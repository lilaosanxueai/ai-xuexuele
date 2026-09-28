import type { Exercise } from '@shared/types.ts';

/**
 * 题目难度启发式：1=基础（记忆再认） 2=进阶（理解辨别） 3=挑战（推理计算）。
 * 纯函数可单测；用于期末卷/挑战赛「由易到难」排卷——真实考试的黄金法则。
 */

/** 挑战级信号：需要计算、比较、推导或题干含多步情境 */
const HARD_WORDS = /为什么|怎么|如何|几倍|大约|约是|比例|比较|区别|推导|计算|选出正确|错误的|不属于|不包括|最合适|原因|解释| vs /;
/** 进阶级信号：需要理解概念而非直接再认 */
const MID_WORDS = /属于|正确的是|作用|意义|特点|目的|依据|原理|反映|说明|体现/;
/** 基础级信号：直接问时间/人物/地点/「是什么」 */
const EASY_WORDS = /什么是|时间是|谁是|哪年|在哪|首创|标志着|被称为|提出/;

export function estimateDifficulty(ex: Pick<Exercise, 'q'>): 1 | 2 | 3 {
  const q = ex.q ?? '';
  const len = q.length;
  const hasHard = HARD_WORDS.test(q);
  const hasMid = MID_WORDS.test(q);
  // 词级信号优先：推理计算 > 理解辨别 > 记忆再认；长度只在无信号时兜底
  if (hasHard) return 3;
  if (hasMid) return 2;
  if (EASY_WORDS.test(q)) return 1;
  return len > 34 ? 2 : 1;
}

/** 组卷排序：难度递增（同难度保持原有随机顺序，稳定排序） */
export function sortByDifficulty<T extends { q: string }>(items: T[]): T[] {
  return items
    .map((it, i) => ({ it, i, d: estimateDifficulty(it) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .map((x) => x.it);
}

/** 错题重练优先级：错次越多、错得越久，越该先练（Anki 式到期思想） */
export interface WrongLike {
  times: number;
  lastWrongAt: string;
}

export function wrongPriority(w: WrongLike, now = new Date()): number {
  const days = Math.max(0, (now.getTime() - new Date(w.lastWrongAt).getTime()) / 86400000);
  return w.times * 2 + Math.min(days, 30) / 3;
}

/** 错题重练排序：优先级高（最该复习）的排前面 */
export function sortByWrongPriority<T extends WrongLike>(items: T[], now = new Date()): T[] {
  return [...items].sort((a, b) => wrongPriority(b, now) - wrongPriority(a, now));
}
