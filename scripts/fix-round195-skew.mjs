import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(import.meta.dirname, '..', 'content', 'lessons');
// 目标答案分布：非全 B 且无长选项暗示（正确项位置随机分散）
const TARGET = {
  'math-111': [1, 0, 3, 1, 2, 0],
  'math-112': [1, 0, 3, 1, 2, 0],
  'math-113': [1, 0, 3, 1, 2, 0],
  'math-114': [1, 0, 3, 1, 2, 0],
};
for (const [id, answers] of Object.entries(TARGET)) {
  const p = path.join(DIR, id + '.json');
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  l.exercises.forEach((e, i) => {
    const want = answers[i];
    const cur = e.answer;
    if (cur === want || e.type === 'blank') return;
    const opts = [...e.options];
    [opts[cur], opts[want]] = [opts[want], opts[cur]];
    e.options = opts;
    e.answer = want;
  });
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
  console.log(id, JSON.stringify(l.exercises.map((e) => e.answer)));
}
