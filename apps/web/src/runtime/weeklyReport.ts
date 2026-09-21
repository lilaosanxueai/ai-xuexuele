import type { Lesson, ProfileProgress } from '@shared/types.ts';

/** 学情周报：全部由本地学习档案计算，回答「这周学得怎么样、哪里薄弱、下周干什么」 */
export interface DayBar {
  /** 如 周一 */
  label: string;
  /** 分钟数 */
  minutes: number;
}

export interface SubjectStat {
  subject: string;
  correct: number;
  total: number;
  /** 0-100；total=0 时为 null */
  accuracy: number | null;
}

export interface WeakLesson {
  lessonId: string;
  title: string;
  emoji: string;
  subject: string;
  accuracy: number;
}

export interface WeeklyReport {
  totalMinutes: number;
  activeDays: number;
  dayBars: DayBar[];
  lessonsDone: { title: string; emoji: string }[];
  subjectStats: SubjectStat[];
  weakLessons: WeakLesson[];
  streak: number;
  /** 给孩子的一句话总结 */
  headline: string;
}

const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];

export function computeWeeklyReport(
  lessons: Lesson[],
  progress: ProfileProgress | null,
  now: Date = new Date(),
): WeeklyReport {
  const usage = progress?.dailyUsage ?? {};
  const dayBars: DayBar[] = [];
  let totalMinutes = 0;
  let activeDays = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const minutes = usage[key] ?? 0;
    dayBars.push({ label: '周' + WEEKDAY[d.getDay()], minutes });
    totalMinutes += minutes;
    if (minutes > 0) activeDays += 1;
  }

  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const lessonsDone: { title: string; emoji: string }[] = [];
  for (const [id, lp] of Object.entries(progress?.lessons ?? {})) {
    if (lp.status !== 'completed' || !lp.completedAt) continue;
    if (new Date(lp.completedAt).getTime() < weekStart.getTime()) continue;
    const l = byId.get(id);
    if (l) lessonsDone.push({ title: l.title, emoji: l.emoji });
  }

  // 各学科正确率（只统计本周内做过或全部做过的课，用全量即可反映真实水平）
  const acc = new Map<string, { correct: number; total: number }>();
  for (const [id, rec] of Object.entries(progress?.exercises ?? {})) {
    const l = byId.get(id);
    const subject = l?.subjectArea ?? '信息科技';
    const cur = acc.get(subject) ?? { correct: 0, total: 0 };
    cur.correct += rec.correct;
    cur.total += rec.total;
    acc.set(subject, cur);
  }
  const subjectStats: SubjectStat[] = [...acc.entries()]
    .filter(([, v]) => v.total > 0)
    .map(([subject, v]) => ({ subject, correct: v.correct, total: v.total, accuracy: Math.round((v.correct / v.total) * 100) }))
    .sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));

  // 薄弱课：做过 ≥3 题且正确率 < 70%，最差的 3 节
  const weakLessons: WeakLesson[] = [];
  for (const [id, rec] of Object.entries(progress?.exercises ?? {})) {
    if (rec.total < 3) continue;
    const rate = rec.correct / rec.total;
    if (rate >= 0.7) continue;
    const l = byId.get(id);
    if (!l) continue;
    weakLessons.push({ lessonId: id, title: l.title, emoji: l.emoji, subject: l.subjectArea ?? '信息科技', accuracy: Math.round(rate * 100) });
  }
  weakLessons.sort((a, b) => a.accuracy - b.accuracy);

  // 连续天数（当天没学不打断）
  let streak = 0;
  const startOffset = (usage[now.toISOString().slice(0, 10)] ?? 0) > 0 ? 0 : 1;
  for (let off = startOffset; ; off++) {
    const d = new Date(now);
    d.setDate(d.getDate() - off);
    if ((usage[d.toISOString().slice(0, 10)] ?? 0) > 0) streak += 1;
    else break;
    if (off > 400) break;
  }

  let headline: string;
  if (weakLessons.length > 0) {
    const prefix = totalMinutes > 0 ? `本周学了 ${totalMinutes} 分钟，` : '本周还没开始学习，正好从补弱开始：';
    headline = `${prefix}${weakLessons[0].subject}的「${weakLessons[0].title}」正确率只有 ${weakLessons[0].accuracy}%，先把它补上 💪`;
  } else if (totalMinutes === 0) {
    headline = '本周还没开始学习——从一节小课开始，15 分钟就算赢 🔑';
  } else if (subjectStats.length > 0) {
    headline = `本周学了 ${totalMinutes} 分钟，各科正确率都在 70% 以上，状态很好，继续保持 🚀`;
  } else {
    headline = `本周学了 ${totalMinutes} 分钟，去随堂小练里测一测，看看掌握得怎么样 📝`;
  }

  return { totalMinutes, activeDays, dayBars, lessonsDone, subjectStats, weakLessons: weakLessons.slice(0, 3), streak, headline };
}
