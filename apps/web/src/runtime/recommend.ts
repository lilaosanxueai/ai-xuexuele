import type { Lesson, ProfileProgress } from '@shared/types.ts';

/**
 * 智能学习路径引擎：基于进度给孩子推荐「下一步」。
 * 规则优先级：继续未完成的 > 补最薄弱学科 > 顺序推进。
 * 纯函数，可单测。
 */

export interface Recommendation {
  lessonId: string;
  title: string;
  emoji: string;
  reason: string;
  subjectArea: string;
}

export function recommendNext(
  lessons: Lesson[],
  progress: ProfileProgress | null,
): Recommendation | null {
  if (lessons.length === 0) return null;
  const done = (id: string) => progress?.lessons[id]?.status === 'completed';
  const hasDraft = (id: string) => !!(progress?.lessonDrafts?.[id] || progress?.lessonCodes?.[id]);
  const byOrder = [...lessons].sort((a, b) => a.order - b.order);

  // 1) 继续进行中的课：有草稿/做过任务但未完成
  const inProgress = byOrder.find((l) => !done(l.id) && (hasDraft(l.id) || hasPartialTasks(l, progress)));
  if (inProgress) {
    return toRec(inProgress, '继续上次的学习，做完它就点亮一个新知识点 ✨');
  }

  // 2) 薄弱学科优先：完成率最低且仍有未完成课程的学科
  const areas = groupByArea(byOrder);
  let weakest: { area: string; rate: number; next: Lesson } | null = null;
  for (const [area, ls] of Object.entries(areas)) {
    const total = ls.length;
    const completed = ls.filter((l) => done(l.id)).length;
    const next = ls.find((l) => !done(l.id));
    if (!next) continue; // 该学科已全部完成
    const rate = completed / total;
    if (!weakest || rate < weakest.rate) weakest = { area, rate, next };
  }
  if (weakest && weakest.rate < 1) {
    return toRec(weakest.next, `${weakest.area}学科还有进步空间，从这一课补上 📗`);
  }

  // 3) 顺序推进：第一个未完成的
  const next = byOrder.find((l) => !done(l.id));
  if (next) return toRec(next, '按学习路径的下一站，出发 🚀');

  // 4) 全部完成：推荐重温
  const last = byOrder[byOrder.length - 1];
  return toRec(last, '全部通关！挑喜欢的课重温，或去 AI 实验室探索 🎉');
}

function hasPartialTasks(l: Lesson, progress: ProfileProgress | null): boolean {
  const lp = progress?.lessons[l.id];
  if (!lp) return false;
  return Object.values(lp.tasks).some((t) => t.done);
}

function groupByArea(lessons: Lesson[]): Record<string, Lesson[]> {
  const out: Record<string, Lesson[]> = {};
  for (const l of lessons) {
    const key = l.subjectArea ?? '信息科技';
    (out[key] ??= []).push(l);
  }
  return out;
}

function toRec(l: Lesson, reason: string): Recommendation {
  return { lessonId: l.id, title: l.title, emoji: l.emoji, reason, subjectArea: l.subjectArea ?? '信息科技' };
}
