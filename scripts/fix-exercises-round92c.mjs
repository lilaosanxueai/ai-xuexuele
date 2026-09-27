import fs from 'node:fs';
import path from 'node:path';

/**
 * 第92轮C：同学科跨课重复题——从后出现的课里删除（不同学科同题保留：跨学科通识）。
 * 用法: npx tsx scripts/fix-exercises-round92c.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const perFile = []; // { file, data, lessons[] }
for (const f of files) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    const lessons = Array.isArray(data) ? data : [data];
    perFile.push({ file: f, data, lessons });
  } catch { /* skip */ }
}
const flat = [];
perFile.forEach((rec) => rec.lessons.forEach((l) => flat.push({ rec, l })));
flat.sort((a, b) => (a.l.order ?? 0) - (b.l.order ?? 0));

const seen = new Set(); // q|subject
let removed = 0;
const dirty = new Set();
for (const { rec, l } of flat) {
  const exs = l.exercises;
  if (!Array.isArray(exs)) continue;
  const kept = [];
  for (const e of exs) {
    const key = (e.q ?? '').trim() + '|' + (l.subjectArea ?? '');
    if (seen.has(key)) { removed++; continue; }
    seen.add(key);
    kept.push(e);
  }
  if (kept.length !== exs.length && kept.length >= 3) {
    l.exercises = kept;
    dirty.add(rec);
  }
}
for (const rec of dirty) {
  fs.writeFileSync(path.join(DIR, rec.file), JSON.stringify(rec.data, null, 2) + '\n', 'utf8');
}
console.log('写回文件:', dirty.size, '删除题数:', removed);
