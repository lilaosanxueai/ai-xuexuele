import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 第81轮：全量 SVG 课程「舞台离线体检」。
 * 对所有非 interact 且带 lab.code/starterCode 的课程，离线跑一遍捕获，
 * 按 StageSvg v2 同款几何规则计算指标，标记：跑挂/空舞台/无文字/过挤/比例失衡/文字互叠。
 * 用法: npx tsx scripts/audit-stages.mjs
 * 输出: 控制台分级清单（不改任何文件）。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const { pathToFileURL } = await import('node:url');
const { parsePy, PyRunner } = await import(pathToFileURL(path.join(ROOT, 'apps/web/src/runtime/pyinterp.ts')).href);
const { pyStageApi } = await import(pathToFileURL(path.join(ROOT, 'apps/web/src/runtime/pyBridge.ts')).href);

async function runCapture(code) {
  const cmds = [];
  const api = {
    write: (text, x, y, color, size) => cmds.push({ t: 'text', text: String(text), x, y, color, size: size ?? 11 }),
    fillRect: (x, y, w, h, color) => cmds.push({ t: 'rect', x, y, w, h, color: color ?? 'blue' }),
    circle: (x, y, r, color) => cmds.push({ t: 'circle', x, y, r, color }),
    ring: (x, y, r, color) => cmds.push({ t: 'ring', x, y, r, color }),
    move(d) { const rad = (this._h * Math.PI) / 180; this._line(this._x, this._y, this._x + d * Math.cos(rad), this._y + d * Math.sin(rad)); },
    _x: 0, _y: 0, _h: 90, _pen: false, _pc: 'blue', _pw: 2,
    _line(x1, y1, x2, y2) { if (this._pen) cmds.push({ t: 'line', x1, y1, x2, y2, color: this._pc, width: this._pw }); this._x = x2; this._y = y2; },
    goTo(x, y) { this._line(this._x, this._y, x, y); },
    turnRight(a) { this._h -= a; }, turnLeft(a) { this._h += a; },
    penDown() { this._pen = true; }, penUp() { this._pen = false; }, penColor(c) { this._pc = c; },
    bounce() {}, say() {}, sayFor() {}, costume() {}, changeSize() {}, show() {}, hide() {}, play() {}, wait() {},
    touchingEdge: () => false, keyDown: () => false, recognize: () => false, random: (a, b) => (a + b) / 2,
  };
  const { program, error } = parsePy(code);
  if (error || !program) return { error: error?.message ?? 'parse fail' };
  const runner = new PyRunner(program, pyStageApi({ api }));
  await new Promise((res) => { void runner.run(res); });
  if (runner.lastError) return { error: runner.lastError };
  return { cmds };
}

const cjk = (s) => /[\u4e00-\u9fff]/.test(s);
const textW = (c) => c.text.length * c.size * (cjk(c.text) ? 1.05 : 0.6);
const textBox = (c) => ({ x1: c.x - textW(c) / 2, x2: c.x + textW(c) / 2, y1: c.y - c.size * 0.7, y2: c.y + c.size * 0.7 });
const interRatio = (a, b) => {
  const ix = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
  const iy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
  if (ix <= 0 || iy <= 0) return 0;
  const inter = ix * iy;
  const minA = Math.min((a.x2 - a.x1) * (a.y2 - a.y1), (b.x2 - b.x1) * (b.y2 - b.y1));
  return minA > 0 ? inter / minA : 0;
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const lessons = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    if (Array.isArray(j)) lessons.push(...j); else if (j) lessons.push(j);
  } catch { /* skip */ }
}

const flagged = { error: [], empty: [], noText: [], crowded: [], sliver: [], overlap: [] };
let audited = 0;
for (const l of lessons) {
  const code = l.lab?.code ?? l.starterCode;
  if (!code || l.interact) continue;
  audited++;
  const res = await runCapture(code);
  const id = l.id + '「' + (l.title ?? '') + '」';
  if (res.error) { flagged.error.push(id + ' :: ' + res.error); continue; }
  const cmds = res.cmds;
  if (cmds.length === 0) { flagged.empty.push(id); continue; }
  const writes = cmds.filter((c) => c.t === 'text');
  if (writes.length === 0) flagged.noText.push(id);
  if (writes.length >= 18) flagged.crowded.push(id + ' (' + writes.length + '条文字)');

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const touch = (x, y, r = 0) => { minX = Math.min(minX, x - r); maxX = Math.max(maxX, x + r); minY = Math.min(minY, y - r); maxY = Math.max(maxY, y + r); };
  for (const c of cmds) {
    if (c.t === 'rect') { touch(c.x - c.w / 2, c.y - c.h / 2); touch(c.x + c.w / 2, c.y + c.h / 2); }
    else if (c.t === 'circle' || c.t === 'ring') touch(c.x, c.y, c.r);
    else if (c.t === 'line') { touch(c.x1, c.y1); touch(c.x2, c.y2); }
    else { const b = textBox(c); touch(b.x1, b.y1); touch(b.x2, b.y2); }
  }
  const w = maxX - minX, h = maxY - minY;
  if (Number.isFinite(w) && Number.isFinite(h) && w > 1 && h > 1) {
    const ar = w / h;
    if (ar > 3.2 || ar < 0.31) flagged.sliver.push(id + ' (宽高比 ' + ar.toFixed(1) + ')');
  }
  // 文字两两互叠（重叠面积占小者 >30% 才算真打架）
  const boxes = writes.map(textBox);
  let overlapPairs = 0;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (interRatio(boxes[i], boxes[j]) > 0.3) overlapPairs++;
    }
  }
  if (overlapPairs >= 2) flagged.overlap.push(id + ' (' + overlapPairs + '对互叠)');
}

console.log('=== SVG 舞台体检：共审计 ' + audited + ' 节 ===');
for (const [k, arr] of Object.entries(flagged)) {
  console.log('\n[' + k + '] ' + arr.length + ' 节');
  arr.slice(0, 40).forEach((s) => console.log('  - ' + s));
  if (arr.length > 40) console.log('  …还有 ' + (arr.length - 40) + ' 节');
}
