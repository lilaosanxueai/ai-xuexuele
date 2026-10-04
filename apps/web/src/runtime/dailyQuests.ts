import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { recommendNext } from './recommend.ts';

/**
 * 智能每日任务：把全 app 的学习动作串成一天的闯关清单。
 * 升级版：任务引用具体课名（推荐的新课+到期复习课），让每天打开就有明确的行动指引。
 * 完成状态完全由真实数据推导（不靠手点勾选）。
 */

export interface DailyCounters {
  date: string;
  flashcards: number;
  wrongsCleared: number;
  challenges: number;
}

export interface Quest {
  id: 'new-lesson' | 'review' | 'flashcards' | 'wrongbook' | 'challenge';
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

/** 复习黄金期：完成于 1/3/7/14 天前的课（记忆将衰退，现在复习效果最好） */
const REVIEW_DAYS = [1, 3, 7, 14];

function findDueReview(lessons: Lesson[], progress: ProfileProgress | null, now: Date): Lesson | null {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const today = now.getTime();
  for (const [id, lp] of Object.entries(progress?.lessons ?? {})) {
    if (lp.status !== 'completed' || !lp.completedAt) continue;
    const days = Math.floor((today - new Date(lp.completedAt).getTime()) / 86400000);
    if (!REVIEW_DAYS.includes(days)) continue;
    const l = byId.get(id);
    if (l) return l;
  }
  return null;
}

/** 生成智能任务清单：新课推荐具体课名 + 到期复习具体课名 + 闪卡/挑战/错题 */
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

  const quests: Quest[] = [];

  // ① 新课：引用推荐引擎的具体课名
  const rec = recommendNext(lessons, progress);
  if (rec) {
    const recLesson = lessons.find((l) => l.id === rec.lessonId);
    const recRoute = recLesson && (recLesson.lab || recLesson.starterCode) ? `/lab/${rec.lessonId}` : `/tutor/${rec.lessonId}`;
    quests.push({
      id: 'new-lesson',
      emoji: '📖',
      title: `学《${rec.title.slice(0, 8)}${rec.title.length > 8 ? '…' : ''}》`,
      detail: rec.reason,
      goal: 1,
      cur: Math.min(1, newToday),
      done: newToday >= 1,
      route: recRoute,
    });
  }

  // ② 复习：有到期课则引用具体课名
  const dueReview = findDueReview(lessons, progress, now);
  if (dueReview) {
    quests.push({
      id: 'review',
      emoji: '⏰',
      title: `复习《${dueReview.title.slice(0, 8)}${dueReview.title.length > 8 ? '…' : ''}》`,
      detail: '记忆黄金期到了，现在复习效果最好',
      goal: 1,
      cur: 0, // 复习不精确计数——点进去做了就算
      done: false,
      route: dueReview.lab || dueReview.starterCode ? `/lab/${dueReview.id}` : `/tutor/${dueReview.id}`,
    });
  }

  // ③ 闪卡
  quests.push({
    id: 'flashcards',
    emoji: '🃏',
    title: '复习 5 张闪卡',
    detail: '记忆盒里到期的卡，越清越轻松',
    goal: 5,
    cur: Math.min(5, counters.flashcards),
    done: counters.flashcards >= 5,
    route: '/flashcards',
  });

  // ④ 挑战赛
  quests.push({
    id: 'challenge',
    emoji: '⚡',
    title: '打一局挑战赛',
    detail: '10 题快问快答，错题自动进错题本',
    goal: 1,
    cur: Math.min(1, counters.challenges),
    done: counters.challenges >= 1,
    route: '/challenge',
  });

  // ⑤ 错题（有错题时）
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

  return quests;
}
