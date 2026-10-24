import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(import.meta.dirname, '..', 'content', 'lessons');
// 把六课的答案位置打散：目标分布 [1,0,3,1,2,1] 之类（含各位置），选项随 answer 平移
const TARGET = { 'art-56': [1, 0, 3, 1, 2, 1], 'eco-55': [1, 0, 3, 1, 2, 1], 'geo-41': [1, 0, 3, 1, 2, 1], 'lab-54': [1, 0, 3, 1, 2, 1], 'mus-50': [1, 0, 3, 1, 2, 1], 'soc-55': [1, 0, 3, 1, 2, 1] };
for (const [id, answers] of Object.entries(TARGET)) {
  const p = path.join(DIR, id + '.json');
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  l.exercises.forEach((e, i) => {
    const want = answers[i];
    const cur = e.answer;
    if (cur === want || e.type === 'blank') return;
    // 交换 cur 与 want 位置的选项，answer 指向 want
    const opts = [...e.options];
    [opts[cur], opts[want]] = [opts[want], opts[cur]];
    e.options = opts;
    e.answer = want;
  });
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
  console.log(id, JSON.stringify(l.exercises.map((e) => e.answer)));
}
