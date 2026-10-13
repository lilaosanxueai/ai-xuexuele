import type { ReviewItem } from '@shared/types.ts';

/**
 * 错题记忆盒调度（纯函数，服务端只管存储，到期判断在展示端算）：
 * 错题练对后按 2/4/7 天间隔复查，三次全过毕业；复查忘了送回错题本。
 */

export const DAY_MS = 86_400_000;

/** 今天到期该复查的题：最早到期优先，一次最多 10 道（防疲劳） */
export function dueReviews(queue: ReviewItem[], now: Date = new Date()): ReviewItem[] {
  return queue
    .filter((x) => new Date(x.dueAt).getTime() <= now.getTime())
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(0, 10);
}

/** 还没到期的题（「复习中」列表用，按到期先后） */
export function scheduledReviews(queue: ReviewItem[], now: Date = new Date()): ReviewItem[] {
  return queue
    .filter((x) => new Date(x.dueAt).getTime() > now.getTime())
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/** 距到期还剩几天（已到期为 0） */
export function daysUntil(dueAt: string, now: Date = new Date()): number {
  return Math.max(0, Math.ceil((new Date(dueAt).getTime() - now.getTime()) / DAY_MS));
}

/** 阶段文案：第几次复查、还差几关毕业 */
export function stageLabel(stage: number, intervals: number[] = [2, 4, 7]): string {
  if (stage >= intervals.length) return '已毕业';
  const left = intervals.length - stage;
  return `第 ${stage + 1} 次复查（再过 ${left} 关毕业）`;
}
