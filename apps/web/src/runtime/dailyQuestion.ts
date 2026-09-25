import type { Lesson, ProfileProgress } from '@shared/types.ts';

/**
 * 每日一题：按日期从全站题库确定性选一道高质量题（同一天同一题，不同天不同题），
 * 已答对的天不再重复出，创建每天打开App的小钩子。
 */

export interface DailyQuestion {
  lessonId: string;
  lessonTitle: string;
  emoji: string;
  subject: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

/** 确定性伪随机（同一天同一档案结果相同） */
function dayHash(dateKey: string, profileId: string): number {
  let h = 0;
  const s = dateKey + profileId;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  }
  return h;
}

/** 选今日一题：优先选未完成课的第5题（综合应用层），按日期确定性选 */
export function pickDailyQuestion(lessons: Lesson[], progress: ProfileProgress | null, dateKey: string, profileId: string): DailyQuestion | null {
  if (lessons.length === 0) return null;
  // 过滤出有 6 题的课，优先未完成的
  const pool = lessons.filter((l) => (l.exercises ?? []).length >= 6);
  if (pool.length === 0) return null;
  const undone = pool.filter((l) => progress?.lessons[l.id]?.status !== 'completed');
  const candidates = undone.length >= 5 ? undone : pool;
  const h = dayHash(dateKey, profileId);
  const lesson = candidates[h % candidates.length];
  // 第5题是应用/挑战层
  const ex = lesson.exercises![4];
  return {
    lessonId: lesson.id, lessonTitle: lesson.title, emoji: lesson.emoji,
    subject: lesson.subjectArea ?? '综合',
    q: ex.q, options: ex.options, answer: ex.answer, explain: ex.explain,
  };
}

/** 今日是否已答对（localStorage 存日期） */
export function isDailyDone(profileId: string, dateKey: string): boolean {
  try {
    return localStorage.getItem(`island-daily-q-${profileId}`) === dateKey;
  } catch { return false; }
}

export function markDailyDone(profileId: string, dateKey: string): void {
  try { localStorage.setItem(`island-daily-q-${profileId}`, dateKey); } catch { /* 忽略 */ }
}
