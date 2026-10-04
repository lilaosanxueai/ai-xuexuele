import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let fixed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    if (l.id !== 'soc-17') continue;
    const ex = l.exercises?.[1];
    if (!ex) continue;
    ex.options = [
      '政府财政不够花想多收钱',
      '自愿参与会导致池子没钱最需要的人没保障',
      '国际上的通行惯例要求这样做',
      '没有任何特别深刻的原因'
    ];
    ex.answer = 1;
    fixed++; changed = true;
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('fixed ' + fixed);
