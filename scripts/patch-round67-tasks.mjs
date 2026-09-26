import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第67轮补丁：为 8 节新课按 lab.explore 生成必做任务 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const IDS = ['sci-29', 'sci-30', 'eng-36', 'eng-37', 'it-22', 'it-23', 'mus-23', 'pe-22'];

for (const id of IDS) {
  const p = path.join(D, id + '.json');
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  const explores = (l.lab && l.lab.explore) || [];
  const tasks = explores.map((text, i) => ({
    id: 'e' + i,
    text: '探索：' + text,
    check: { type: 'manual' },
    hintPrompts: ['动手验证：把参数拖到两个极端对比观察', '把发现说给 AI 老师听，让它帮你变成结论'],
  }));
  tasks.push({ id: 'quiz', text: '完成随堂小练', check: { type: 'manual' }, hintPrompts: ['先做几组实验再答题，答案就藏在演示里'] });
  l.tasks = tasks;
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n');
  console.log(id + ' -> ' + tasks.length + ' tasks');
}
