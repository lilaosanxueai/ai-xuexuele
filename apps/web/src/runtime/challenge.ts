import type { Lesson } from '@shared/types.ts';

/**
 * 全学科挑战赛引擎：从课程题库抽样组卷、计分（连击加成）、评级。
 * 纯本地运行，错题经 wrongAdds 进入既有错题本闭环。
 */

export interface ChallengeQ {
  lessonId: string;
  lessonTitle: string;
  subjectArea: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

/** 从题库抽样：默认每课最多抽 1 题保证覆盖面，学科/学段可过滤 */
export function sampleQuestions(
  lessons: Lesson[],
  opts: { subject?: string; gradeBand?: string; count?: number } = {},
): ChallengeQ[] {
  const { subject, gradeBand, count = 10 } = opts;
  const pool: ChallengeQ[] = [];
  for (const l of lessons) {
    if (subject && subject !== '全部' && (l.subjectArea ?? '信息科技') !== subject) continue;
    if (gradeBand && gradeBand !== '全部' && l.gradeBand !== gradeBand) continue;
    const exs = l.exercises ?? [];
    if (exs.length === 0) continue;
    // 每课随机挑 1 题（挑战赛重覆盖不重深度）
    const pick = exs[Math.floor(Math.random() * exs.length)];
    pool.push({
      lessonId: l.id, lessonTitle: l.title, subjectArea: l.subjectArea ?? '信息科技',
      q: pick.q, options: pick.options, answer: pick.answer, explain: pick.explain,
    });
  }
  // Fisher-Yates 洗牌后取前 count 题
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** 答对一题的得分：基础 10 分 + 连击加成（每连击 +2，封顶 +10） */
export function scoreFor(streak: number): number {
  return 10 + Math.min(10, Math.max(0, streak - 1) * 2);
}

/** 终局评级：按得分与正确率给称号 */
export function gradeResult(correct: number, total: number, score: number): { emoji: string; title: string; word: string } {
  const rate = total > 0 ? correct / total : 0;
  if (rate === 1 && total > 0) return { emoji: '👑', title: '全对擂主', word: '一题不失，你就是全学科之王！' };
  if (rate >= 0.8) return { emoji: '🏆', title: '学科达人', word: '稳准狠，正确率超高！' };
  if (rate >= 0.6) return { emoji: '🥈', title: '实力战将', word: '过半再过两成，离达人只差一步！' };
  if (rate >= 0.4) return { emoji: '🥉', title: '顽强新兵', word: '稳住节奏，先保证基础题不丢分！' };
  return { emoji: '💪', title: '越挫越勇', word: '错题已进错题本，清零之后再来一战！' };
}

/** 连击文案（每 3 连击换一句） */
export function comboWord(streak: number): string {
  if (streak >= 9) return '神了！🔥🔥🔥';
  if (streak >= 6) return '连击如虹！🔥🔥';
  if (streak >= 3) return '手感来了！🔥';
  return '';
}
