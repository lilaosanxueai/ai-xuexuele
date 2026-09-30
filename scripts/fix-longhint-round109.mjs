import fs from 'node:fs';
import path from 'node:path';

/** 第109轮：新课 3 处 longHint 干扰项补强 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  ['eco-01', '周末 2 小时打游戏', '这 2 小时本可学会的篮球动作',
    ['完全没有付出任何代价', '这 2 小时本可学会的篮球动作', '游戏充值的钱白白花了', '打完游戏的眼睛疲劳度'],
  ],
  ['psy-04', '求助和打小报告的区别', '求助为停止伤害，告状为让对方倒霉',
    ['求助是为了停止伤害，告状为让对方倒霉', '求助的是胆小鬼才干的事', '打小报告的同学更讲义气', '两者都该被老师批评'],
  ],
  ['soc-03', '尊重的最高层次', '欣赏并主动了解',
    ['看见了也装作完全没看见', '远远躲开不产生任何接触', '欣赏并主动去了解它', '嘴上说尊重心里嫌弃'],
  ],
];

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let fixed = 0, skipped = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    for (const [id, qPrefix, expectCorrect, newOpts] of FIX) {
      if (l.id !== id) continue;
      const ex = (l.exercises ?? []).find((e) => (e.q ?? '').startsWith(qPrefix));
      if (!ex) { skipped++; console.log('未找到: ' + id + ' ' + qPrefix); continue; }
      if ((ex.options?.[ex.answer] ?? '') !== expectCorrect) { skipped++; console.log('不匹配: ' + id + ' 实际=' + (ex.options?.[ex.answer] ?? '')); continue; }
      ex.options = newOpts;
      fixed++; changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('替换 ' + fixed + ' 题，跳过 ' + skipped);
