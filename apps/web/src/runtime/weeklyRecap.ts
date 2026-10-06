import type { Lesson, ProfileProgress } from '@shared/types.ts';

/**
 * 孩子端的本周高光回顾：只庆祝、不说教（分析视角归家长端周报）。
 * 数据全部来自本地学习档案。
 */

export interface RecapLesson {
  id: string;
  title: string;
  emoji: string;
  /** 随堂小练正确率（没做过为 null） */
  accuracy: number | null;
}

export interface WeeklyRecap {
  totalMinutes: number;
  activeDays: number;
  streak: number;
  /** 本周完成的课（新→旧） */
  lessons: RecapLesson[];
  /** 本周正确率最高的一课（做过 ≥3 题才算） */
  bestLesson: RecapLesson | null;
  /** 给孩子的一句庆祝语 */
  headline: string;
}

export function computeWeeklyRecap(
  lessons: Lesson[],
  progress: ProfileProgress | null,
  now: Date = new Date(),
): WeeklyRecap {
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const byId = new Map(lessons.map((l) => [l.id, l]));

  const done: RecapLesson[] = [];
  for (const [id, lp] of Object.entries(progress?.lessons ?? {})) {
    if (lp.status !== 'completed' || !lp.completedAt) continue;
    if (new Date(lp.completedAt).getTime() < weekStart.getTime()) continue;
    const l = byId.get(id);
    if (!l) continue;
    const ex = progress?.exercises?.[id];
    done.push({
      id, title: l.title, emoji: l.emoji,
      accuracy: ex && ex.total >= 1 ? Math.round((ex.correct / ex.total) * 100) : null,
    });
  }
  done.sort((a, b) => (a.accuracy ?? -1) - (b.accuracy ?? -1));

  const usage = progress?.dailyUsage ?? {};
  let totalMinutes = 0;
  let activeDays = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const m = usage[d.toISOString().slice(0, 10)] ?? 0;
    totalMinutes += m;
    if (m > 0) activeDays += 1;
  }
  let streak = 0;
  const startOffset = (usage[now.toISOString().slice(0, 10)] ?? 0) > 0 ? 0 : 1;
  for (let off = startOffset; ; off++) {
    const d = new Date(now);
    d.setDate(d.getDate() - off);
    if ((usage[d.toISOString().slice(0, 10)] ?? 0) > 0) streak += 1;
    else break;
    if (off > 400) break;
  }

  const bestLesson = done.filter((l) => l.accuracy !== null && (l.accuracy ?? 0) > 0).sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0))[0] ?? null;

  let headline: string;
  const n = done.length;
  if (n >= 3 || totalMinutes >= 120) {
    headline = `拿下 ${n} 座知识城堡、火力全开 ${totalMinutes} 分钟！`;
  } else if (n > 0 || totalMinutes > 0) {
    headline = `完成 ${n} 节课 · ${totalMinutes} 分钟——小步也是前进！`;
  } else {
    headline = '新的一周，拿下第一课就是胜利！';
  }
  if (streak >= 3) headline += ` 已连续 ${streak} 天 🔥`;

  return { totalMinutes, activeDays, streak, lessons: done, bestLesson, headline };
}
