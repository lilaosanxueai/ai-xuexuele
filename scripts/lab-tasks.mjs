import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 实验室课程任务体系重构（第23轮）：
 * 理科 lab 课的 tasks 还是积木时代产物（走到码头/说口令等），实验室模式里永远完不成。
 * 改为实验原生要点：探索问题(e*) + 实验挑战(c*) + 随堂练(quiz)，LabScreen 会实时上报勾选状态。
 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const LAB_SUBJECTS = new Set(['数学', '物理', '化学', '生物', '地理', '科学']);

let changed = 0;
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  const p = path.join(D, f);
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  const isLab = LAB_SUBJECTS.has(l.subjectArea) && (l.lab || l.starterCode);
  if (!isLab) continue;

  const tasks = [];
  (l.lab?.explore ?? []).forEach((q, i) => {
    tasks.push({
      id: `e${i}`, text: `探索：${q}`, check: { type: 'manual' },
      hintPrompts: ['动手验证：把参数拖到两个极端对比观察', '把发现说给 AI 老师听，让它帮你变成结论'],
    });
  });
  (l.lab?.challenges ?? []).forEach((c, i) => {
    tasks.push({
      id: `c${i}`, text: `挑战：${c.text}`, check: { type: 'manual' }, optional: true,
      hintPrompts: ['只调挑战要求的参数，其他保持不变', '注意滑块的步长，慢慢逼近目标值'],
    });
  });
  if (l.exercises?.length) {
    tasks.push({
      id: 'quiz', text: '完成随堂小练', check: { type: 'manual' },
      hintPrompts: ['先做几组实验再答题，答案就藏在演示里'],
    });
  }
  // 无 explore 的自动参数课：至少给一条动手要点
  if (tasks.filter((t) => !t.optional).length === 0) {
    tasks.unshift({ id: 'e0', text: '探索：拖动参数，观察舞台变化并说出规律', check: { type: 'manual' } });
  }
  l.tasks = tasks;
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
  changed++;
}
console.log(`重写实验室任务 ${changed} 节`);
