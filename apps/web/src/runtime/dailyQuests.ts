import type { Lesson, ProfileProgress } from '@shared/types.ts';

/**
 * 每日任务：把全 app 的学习动作串成一天的闯关清单。
 * 完成状态完全由真实数据推导（不靠手点勾选）：
 * - 新课：progress 里 completedAt 为今天的课
 * - 闪卡：localStorage 计数器（每天重置）
 * - 错题：localStorage 计数器（当天消灭数）
 * - 挑战：localStorage 计数器（当天完成局数）
 */

export interface DailyCounters {
  date: string;
  flashcards: number;
  wrongsCleared: number;
  challenges: number;
}

export interface Quest {
  id: 'new-lesson' | 'flashcards' | 'wrongbook' | 'challenge';
  emoji: string;
  title: string;
  detail: string;
  goal: number;
  cur: number;
  done: boolean;
  route: string;
}

export function todayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** 读当日计数器（跨天自动归零） */
export function readCounters(raw: unknown, now: Date = new Date()): DailyCounters {
  const blank: DailyCounters = { date: todayKey(now), flashcards: 0, wrongsCleared: 0, challenges: 0 };
  if (typeof raw !== 'object' || raw === null) return blank;
  const r = raw as Partial<DailyCounters>;
  if (r.date !== blank.date) return blank;
  return { ...blank, flashcards: r.flashcards ?? 0, wrongsCleared: r.wrongsCleared ?? 0, challenges: r.challenges ?? 0 };
}

export function bumpCounter(raw: unknown, key: 'flashcards' | 'wrongsCleared' | 'challenges', now: Date = new Date()): DailyCounters {
  const c = readCounters(raw, now);
  c[key] += 1;
  return c;
}

/** 生成今日任务清单：固定 3 项 + 有错题时第 4 项 */
export function generateQuests(
  lessons: Lesson[],
  progress: ProfileProgress | null,
  counters: DailyCounters,
  now: Date = new Date(),
): Quest[] {
  const today = todayKey(now);
  const newToday = Object.values(progress?.lessons ?? {}).filter(
    (lp) => lp.status === 'completed' && lp.completedAt?.slice(0, 10) === today,
  ).length;

  const quests: Quest[] = [
    {
      id: 'new-lesson',
      emoji: '📖',
      title: '学一节新课',
      detail: '完成任意一节新课的学习',
      goal: 1,
      cur: Math.min(1, newToday),
      done: newToday >= 1,
      route: '/map',
    },
    {
      id: 'flashcards',
      emoji: '🃏',
      title: '复习 5 张闪卡',
      detail: '记忆盒里到期的卡，越清越轻松',
      goal: 5,
      cur: Math.min(5, counters.flashcards),
      done: counters.flashcards >= 5,
      route: '/flashcards',
    },
    {
      id: 'challenge',
      emoji: '⚡',
      title: '打一局挑战赛',
      detail: '10 题快问快答，错题自动进错题本',
      goal: 1,
      cur: Math.min(1, counters.challenges),
      done: counters.challenges >= 1,
      route: '/challenge',
    },
  ];

  const wrongs = progress?.wrongBook?.length ?? 0;
  if (wrongs > 0) {
    quests.push({
      id: 'wrongbook',
      emoji: '🐛',
      title: '消灭 2 道错题',
      detail: `错题本还有 ${wrongs} 道，重练全对即消灭`,
      goal: 2,
      cur: Math.min(2, counters.wrongsCleared),
      done: counters.wrongsCleared >= 2,
      route: '/wrongbook',
    });
  }
  void lessons;
  return quests;
}
