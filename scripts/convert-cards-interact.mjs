import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 第75轮B：把「纯卡片式」画布课自动迁移为 interact 原生卡片形态。
 * 原理：离线用项目自带 Python 解释器跑一遍 lab.code（对第一个参数的每个取值），
 * 捕获 write/fill_rect/circle 命令，按几何关系还原成 标题卡/信息卡/金句。
 * 转不干净的课自动跳过，保持画布形态。
 * 用法: npx tsx scripts/convert-cards-interact.mjs <subjectArea> [dry|write]
 */
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = path.join(ROOT, 'content', 'lessons');
const SUBJECT = process.argv[2] ?? '数学';
const WRITE = process.argv[3] === 'write';

const { pathToFileURL } = await import('node:url');
const { parsePy, PyRunner } = await import(pathToFileURL(path.join(ROOT, 'apps/web/src/runtime/pyinterp.ts')).href);
const { pyStageApi } = await import(pathToFileURL(path.join(ROOT, 'apps/web/src/runtime/pyBridge.ts')).href);

/** 主题色映射：hex → 主题名（最近 RGB 距离） */
const PALETTE = {
  red: [220, 38, 38], orange: [249, 115, 22], amber: [245, 158, 11], green: [22, 163, 74],
  teal: [20, 184, 166], sky: [14, 165, 233], blue: [37, 99, 235], violet: [124, 58, 237],
  purple: [147, 51, 234], pink: [236, 72, 153], rose: [244, 63, 94],
};
function themeOf(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return 'sky';
  const n = parseInt(m[1], 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  let best = 'sky', bd = Infinity;
  for (const [name, c] of Object.entries(PALETTE)) {
    const d = (rgb[0] - c[0]) ** 2 + (rgb[1] - c[1]) ** 2 + (rgb[2] - c[2]) ** 2;
    if (d < bd) { bd = d; best = name; }
  }
  return best;
}

/** 跑一遍代码并捕获绘图命令 */
async function runCapture(code, firstParam, v) {
  let src = code;
  if (firstParam && v !== undefined) {
    src = src.replace(new RegExp(`^(\\s*)(${firstParam})\\s*=\\s*[-+\\d.]+`, 'm'), `$1$2 = ${v}`);
  }
  const cmds = [];
  const api = {
    write: (text, x, y, color, size) => cmds.push({ t: 'write', text: String(text), x, y, color, size: size ?? 11 }),
    fillRect: (x, y, w, h, color) => cmds.push({ t: 'rect', x, y, w, h, color: color ?? 'blue' }),
    circle: (x, y, r, color) => cmds.push({ t: 'circle', x, y, r, color }),
    ring: (x, y, r, color) => cmds.push({ t: 'ring', x, y, r, color }),
    move() {}, turnRight() {}, turnLeft() {}, goTo() {}, bounce() {}, say() {}, sayFor() {},
    costume() {}, changeSize() {}, show() {}, hide() {}, play() {}, wait() {}, penDown() {}, penUp() {}, penColor() {},
    touchingEdge: () => false, keyDown: () => false, recognize: () => false, random: (a, b) => (a + b) / 2,
  };
  const { program, error } = parsePy(src);
  if (error || !program) return { error: error?.message ?? 'parse fail' };
  const runner = new PyRunner(program, pyStageApi({ api }));
  await new Promise((res) => { void runner.run(res); });
  if (runner.lastError) return { error: runner.lastError };
  return { cmds };
}

const inside = (w, r) => w.x >= r.x - r.w / 2 - 2 && w.x <= r.x + r.w / 2 + 2 && w.y >= r.y - r.h / 2 - 2 && w.y <= r.y + r.h / 2 + 2;

/** 一组命令 → 一个 InteractView */
function extractView(cmds, fallbackTitle) {
  const rects = cmds.filter((c) => c.t === 'rect');
  const writes = cmds.filter((c) => c.t === 'write');
  if (rects.length === 0 && writes.length === 0) return null;
  // 横幅：顶部窄长条
  const banner = rects.find((r) => r.y + r.h / 2 >= 100 && r.h <= 45 && r.w >= 200);
  const bannerWrites = banner ? writes.filter((w) => inside(w, banner)) : [];
  const bannerText = bannerWrites.sort((a, b) => b.size - a.size)[0]?.text ?? '';
  // 其余卡片：面积足够大的矩形
  const cards = rects.filter((r) => r !== banner && r.w >= 70 && r.h >= 24);
  const used = new Set();
  const blocks = [];
  for (const c of cards.sort((a, b) => b.y - a.y)) {
    const ws = writes.filter((w) => inside(w, c) && !used.has(w)).sort((a, b) => b.y - a.y);
    ws.forEach((w) => used.add(w));
    const text = ws.map((w) => w.text).join('；').trim();
    if (!text) continue;
    const m = text.match(/^(.{1,6})：(.+)$/s);
    if (m) blocks.push({ kind: 'info', icon: '💡', title: m[1], text: m[2] });
    else blocks.push({ kind: 'info', icon: '📌', text });
  }
  // 游离文字（不属任何矩形）：作副标题/金句
  const loose = writes.filter((w) => !used.has(w) && w.text.trim() && !bannerWrites.includes(w));
  let subtitle = '', highlight = '';
  const meaningful = loose.filter((w) => w.text.length >= 6 && !/[℃%]/.test(w.text.slice(0, 2)));
  if (meaningful.length >= 2) {
    subtitle = meaningful.find((w) => w.y > 60)?.text ?? '';
    highlight = meaningful.filter((w) => w !== (meaningful.find((w2) => w2.y > 60)))[0]?.text ?? '';
  } else if (meaningful.length === 1) {
    highlight = meaningful[0].text;
  }
  // 标题切分
  let title = bannerText || fallbackTitle;
  if (!subtitle && title.includes('：') && title.length > 8) {
    const i = title.indexOf('：');
    subtitle = title.slice(i + 1);
    title = title.slice(0, i);
  }
  if (title.length > 16) title = title.slice(0, 15) + '…';
  if (!title || blocks.length === 0) return null;
  const view = { when: 0, title, color: themeOf(banner?.color), blocks };
  if (subtitle) view.subtitle = subtitle.slice(0, 40);
  if (highlight) blocks.push({ kind: 'highlight', text: highlight.slice(0, 60) });
  return view;
}

const clean = (s) => s.replace(/^[a-zA-Z]\w*\s*=\s*\d+\s*[，,]?\s*/, '').trim();

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let converted = [], skipped = [];
for (const f of files) {
  const l = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8'));
  if (l.subjectArea !== SUBJECT || l.interact) continue;
  const code = l.lab?.code ?? l.starterCode;
  if (!code || /pen_down|circle\(/.test(code)) continue; // 只转纯卡片课
  const params = l.lab?.params ?? [];
  if (params.length === 0) { skipped.push([l.id, '无参数']); continue; }
  const p0 = params[0];
  const views = [];
  let fail = null;
  for (let v = p0.min; v <= p0.max + 1e-9; v += p0.step) {
    const r = await runCapture(code, p0.name, Math.round(v * 100) / 100);
    if (r.error) { fail = `值${v}: ${r.error}`; break; }
    const view = extractView(r.cmds, l.title);
    if (!view) { fail = `值${v}: 提取为空`; break; }
    view.when = Math.round(v * 100) / 100;
    views.push(view);
  }
  if (fail || views.length === 0) { skipped.push([l.id, fail ?? 'no views']); continue; }
  const explore = (l.lab?.explore ?? l.interact?.explore ?? []).map(clean);
  const patch = { ...l };
  patch.lab = { params };
  patch.interact = { views, explore: explore.length ? explore : undefined };
  delete patch.starterCode;
  delete patch.codeLesson;
  if (WRITE) fs.writeFileSync(path.join(DIR, f), JSON.stringify(patch, null, 2) + '\n');
  converted.push([l.id, `${views.length}视图`]);
}
console.log(`【${SUBJECT}】转换 ${converted.length} 节 / 跳过 ${skipped.length} 节 ${WRITE ? '(已写入)' : '(dry-run)'}`);
converted.forEach(([id, info]) => console.log(`  ✓ ${id} ${info}`));
skipped.forEach(([id, why]) => console.log(`  ✗ ${id} ${why}`));
