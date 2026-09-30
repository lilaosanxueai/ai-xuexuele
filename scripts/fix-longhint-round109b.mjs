import fs from 'node:fs';
import path from 'node:path';

/** 修复 psy-04 Q3 答案位置（上次替换把正确项放错下标）+ soc-03 干扰项补长 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const jobs = [
  {
    id: 'psy-04', qPrefix: '求助和打小报告的区别',
    // 原 answer=1：正确项必须在下标 1
    options: ['没有本质区别只是说法不同', '求助为停止伤害，告状为让对方倒霉', '敢求助的才是胆小鬼行为', '打小报告的同学更讲义气'],
    answer: 1,
  },
  {
    id: 'soc-03', qPrefix: '尊重的最高层次',
    // 原 answer=2
    options: ['看见了也装作完全没看见', '远远躲开不产生任何接触', '欣赏并主动去了解', '嘴上说尊重心里嫌弃'],
    answer: 2,
  },
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
    for (const j of jobs) {
      if (l.id !== j.id) continue;
      const ex = (l.exercises ?? []).find((e) => (e.q ?? '').startsWith(j.qPrefix));
      if (!ex) continue;
      ex.options = j.options;
      ex.answer = j.answer;
      fixed++; changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('修正 ' + fixed + ' 题');
