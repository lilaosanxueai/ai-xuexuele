import fs from 'node:fs';
import path from 'node:path';

/** soc-03 真正的 Q3（信仰态度）干扰项补长 */
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
    if (l.id !== 'soc-03') continue;
    const ex = (l.exercises ?? []).find((e) => (e.q ?? '').startsWith('对待不同信仰'));
    if (!ex) continue;
    // 原 answer=1，正确项保持下标 1
    ex.options = ['所有人都必须信同一种才好', '不伤害他人前提下尊重其自由', '把不同信仰统统禁止掉', '假装这些差异不存在'];
    ex.answer = 1;
    fixed++; changed = true;
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('修正 ' + fixed + ' 题');
