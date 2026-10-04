import type { Exercise, Lesson, WrongItem } from '@shared/types.ts';
import { sortByDifficulty } from './questionDifficulty.ts';

/**
 * 举一反三变式：为错题就地挑同考点的变式题（不出错题本页面）。
 * 候选池优先级：同学科同课标模块（可跨课）→ 同学科 → 原课其他题；
 * 排除原题本身与已在错题本里的题（那些本来就等着重练）。
 */

const usable = (ex: Exercise, wrongQs: Set<string>, originQ: string): boolean =>
  ex.q !== originQ && !wrongQs.has(ex.q) && ex.options.filter(Boolean).length >= 2 && Boolean(ex.explain);

const poolOf = (lessons: Lesson[], wrongQs: Set<string>, originQ: string): Exercise[] =>
  lessons.flatMap((l) => l.exercises ?? []).filter((ex) => usable(ex, wrongQs, originQ));

const dedupeByQ = (list: Exercise[]): Exercise[] => {
  const seen = new Set<string>();
  return list.filter((ex) => (seen.has(ex.q) ? false : (seen.add(ex.q), true)));
};

export function pickVariants(
  wrong: WrongItem,
  allLessons: Lesson[],
  wrongs: WrongItem[],
  count = 3,
): Exercise[] {
  const wrongQs = new Set(wrongs.map((w) => w.q));
  const src = allLessons.find((l) => l.id === wrong.lessonId);
  const mod = src?.curriculum?.module;

  let pool: Exercise[] = [];
  if (mod) {
    pool = poolOf(allLessons.filter((l) => l.subjectArea === wrong.subjectArea && l.curriculum?.module === mod), wrongQs, wrong.q);
  }
  if (pool.length < count) {
    pool = dedupeByQ([...pool, ...poolOf(allLessons.filter((l) => l.subjectArea === wrong.subjectArea), wrongQs, wrong.q)]);
  }
  if (pool.length < count && src) {
    pool = dedupeByQ([...pool, ...poolOf([src], wrongQs, wrong.q)]);
  }
  return sortByDifficulty(dedupeByQ(pool)).slice(0, count);
}
