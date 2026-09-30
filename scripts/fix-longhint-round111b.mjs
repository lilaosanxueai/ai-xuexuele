import fs from 'node:fs';
import path from 'node:path';

/** 精确修正剩余3处（Q1 eco-09 前缀带空格、psy-11 Q4、soc-12 Q4） */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  ['eco-09', 0, ['国家人民幸福感多高', '一年内最终产品和服务的市场价值', '政府金库里有多少钱', '全国人口的总数量'], 1],
  ['psy-11', 3, ['事事反对跟大家对着干', '从不听任何人的意见', '知道为什么同意而非因为大家都', '把自己孤立起来不社交'], 2],
  ['soc-12', 3, ['被告一定是个无罪的人', '证明有罪前推定无罪·举证在控方', '不需要开庭审判就放人', '要受害人自己找证据'], 1],
];

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let fixed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    for (const [id, qi, opts, ans] of FIX) {
      if (l.id !== id) continue;
      const ex = l.exercises?.[qi];
      if (!ex) continue;
      ex.options = opts;
      ex.answer = ans;
      fixed++; changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('修正 ' + fixed + ' 题');
