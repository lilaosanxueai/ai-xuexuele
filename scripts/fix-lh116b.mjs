import fs from 'node:fs';
import path from 'node:path';

/** 最终2处微调 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');
const FIX = [
  ['eco-20', 2, ['为了惩罚存钱的人', '降低借贷成本来刺激消费投资对抗衰退', '让银行赚更多的利润', '为了讨好外国投资者'], 1],
  ['soc-17', 1, ['政府想多收钱', '自愿参与会让池子没钱最需要的人反而没保障', '国际上的惯例要求', '没有任何原因'], 1],
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
console.log('修正 ' + fixed);
