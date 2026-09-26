import type { Lesson } from '@shared/types.ts';

/**
 * 课程难度星级：根据学段+学科特征+题目深度自动计算 1-5 星，
 * 让孩子一眼看出"这是热身还是挑战"。
 */

export function difficultyStars(l: Lesson): number {
  let score = 0;
  // 学段基础分
  if (l.gradeBand === 'primary') score += 1;
  else if (l.gradeBand === 'junior') score += 2.5;
  else score += 3.5;
  // 年级微调
  const g = l.grade ?? 3;
  if (l.gradeBand === 'primary') score += g >= 5 ? 0.5 : 0;
  if (l.gradeBand === 'junior') score += g >= 8 ? 0.5 : 0;
  if (l.gradeBand === 'senior') score += g >= 11 ? 0.5 : 0;
  // 学科加权（理科稍难）
  const hard = ['数学', '物理', '化学', '信息科技'];
  if (hard.includes(l.subjectArea ?? '')) score += 0.5;
  // 实验课稍难（动手+理解）
  if (l.lab?.code) score += 0.3;
  // 题目深度：有6题的课比只有3题的深
  const exCount = (l.exercises ?? []).length;
  if (exCount >= 6) score += 0.2;
  return Math.max(1, Math.min(5, Math.round(score)));
}

export const starsDisplay = (n: number) => '⭐'.repeat(n) + '☆'.repeat(5 - n);

export const difficultyLabel = (n: number) => {
  if (n <= 1) return '热身';
  if (n <= 2) return '基础';
  if (n <= 3) return '进阶';
  if (n <= 4) return '挑战';
  return '硬核';
};
