import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/** 临时诊断：算某课舞台 bbox 与自适应缩放（用后即删） */
const ROOT = path.resolve(import.meta.dirname, '..');
const id = process.argv[2] ?? 'mus-06';
const { parsePy, PyRunner } = await import(pathToFileURL(path.join(ROOT, 'apps/web/src/runtime/pyinterp.ts')).href);
const { pyStageApi } = await import(pathToFileURL(path.join(ROOT, 'apps/web/src/runtime/pyBridge.ts')).href);

const files = fs.readdirSync(path.join(ROOT, 'content/lessons')).filter((f) => f.endsWith('.json'));
let lesson = null;
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/lessons', f), 'utf8'));
  const arr = Array.isArray(j) ? j : [j];
  const hit = arr.find((l) => l.id === id);
  if (hit) { lesson = hit; break; }
}
const code = lesson?.lab?.code ?? lesson?.starterCode ?? '';
const cmds = [];
const api = {
  write: (text, x, y, color, size) => cmds.push({ t: 'text', text: String(text), x, y, size: size ?? 11 }),
  fillRect: (x, y, w, h) => cmds.push({ t: 'rect', x, y, w, h }),
  circle: (x, y, r) => cmds.push({ t: 'circle', x, y, r }),
  ring: (x, y, r) => cmds.push({ t: 'ring', x, y, r }),
  move() {}, turnRight() {}, turnLeft() {}, goTo() {}, bounce() {}, say() {}, sayFor() {},
  costume() {}, changeSize() {}, show() {}, hide() {}, play() {}, wait() {}, penDown() {}, penUp() {}, penColor() {},
  touchingEdge: () => false, keyDown: () => false, recognize: () => false, random: (a, b) => (a + b) / 2,
};
const { program, error } = parsePy(code);
if (error) { console.log('PARSE ERROR', error.message); process.exit(1); }
const runner = new PyRunner(program, pyStageApi({ api }));
await new Promise((res) => { void runner.run(res); });
if (runner.lastError) { console.log('RUN ERROR', runner.lastError); process.exit(1); }

let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
const touch = (x, y, r = 0) => { minX = Math.min(minX, x - r); maxX = Math.max(maxX, x + r); minY = Math.min(minY, y - r); maxY = Math.max(maxY, y + r); };
for (const c of cmds) {
  if (c.t === 'rect') { touch(c.x - c.w / 2, c.y - c.h / 2); touch(c.x + c.w / 2, c.y + c.h / 2); }
  else if (c.t === 'circle' || c.t === 'ring') touch(c.x, c.y, c.r);
  else if (c.t === 'line') { touch(c.x1, c.y1); touch(c.x2, c.y2); }
  else { const tw = c.text.length * c.size * (/[\u4e00-\u9fff]/.test(c.text) ? 1.05 : 0.6); touch(c.x - tw / 2, c.y - c.size * 0.7); touch(c.x + tw / 2, c.y + c.size * 0.7); }
}
const w = maxX - minX, h = maxY - minY;
const scale = Math.min(420 * 0.74 / Math.max(w, 1), 330 * 0.74 / Math.max(h, 1), 2.2);
console.log('cmds=' + cmds.length + ' bbox w=' + w.toFixed(0) + ' h=' + h.toFixed(0) + ' minX=' + minX.toFixed(0) + ' minY=' + minY.toFixed(0) + ' maxX=' + maxX.toFixed(0) + ' maxY=' + maxY.toFixed(0) + ' scale=' + scale.toFixed(2));
cmds.forEach((c) => console.log('  ' + c.t + ' x=' + c.x + ' y=' + c.y + ' w=' + (c.w ?? '') + ' h=' + (c.h ?? '') + ' r=' + (c.r ?? '') + ' [' + (c.text ?? '').slice(0, 10) + '] size=' + (c.size ?? '')));
