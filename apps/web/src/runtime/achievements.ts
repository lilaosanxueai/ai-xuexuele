import type { Lesson, ProfileProgress } from '@shared/types.ts';

/** 成就徽章定义：全部由学习档案本地计算，不依赖任何外部接口 */
export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  goal: number;
}

export interface BadgeState extends BadgeDef {
  unlocked: boolean;
  cur: number;
}

/** 游戏与考试战绩（localStorage 本地记录，徽章 v2 用） */
export interface GameRecords {
  /** 连连看完成局数 */
  pairsPlays: number;
  /** 听音辨卡满分（5/5）次数 */
  listenPerfect: number;
  /** 挑战赛单局最高分 */
  challengeBest: number;
  /** 期末模拟卷最高正确率（%） */
  examBest: number;
  /** 周目标达成次数 */
  weeklyGoalsMet: number;
}

export const EMPTY_RECORDS: GameRecords = { pairsPlays: 0, listenPerfect: 0, challengeBest: 0, examBest: 0, weeklyGoalsMet: 0 };

/** 从 localStorage 读战绩（坏数据容错） */
export function readRecords(raw: unknown): GameRecords {
  if (typeof raw !== 'object' || raw === null) return { ...EMPTY_RECORDS };
  const r = raw as Partial<GameRecords>;
  return {
    pairsPlays: Number(r.pairsPlays ?? 0) || 0,
    listenPerfect: Number(r.listenPerfect ?? 0) || 0,
    challengeBest: Number(r.challengeBest ?? 0) || 0,
    examBest: Number(r.examBest ?? 0) || 0,
    weeklyGoalsMet: Number(r.weeklyGoalsMet ?? 0) || 0,
  };
}

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', name: '初出茅庐', emoji: '🌱', desc: '完成第 1 节课', goal: 1 },
  { id: 'ten-lessons', name: '小书虫', emoji: '📚', desc: '累计完成 10 节课', goal: 10 },
  { id: 'fifty-lessons', name: '学海无涯', emoji: '🎓', desc: '累计完成 50 节课', goal: 50 },
  { id: 'streak-3', name: '三日之约', emoji: '🔥', desc: '连续学习 3 天', goal: 3 },
  { id: 'streak-7', name: '七日成钢', emoji: '⚡', desc: '连续学习 7 天', goal: 7 },
  { id: 'perfect-quiz', name: '满分出击', emoji: '🎯', desc: '单课随堂练 6/6 全对', goal: 1 },
  { id: 'hundred-correct', name: '百题斩', emoji: '💯', desc: '累计答对 100 题', goal: 100 },
  { id: 'five-hundred', name: '千题之王', emoji: '🏆', desc: '累计答对 500 题', goal: 500 },
  { id: 'lab-20', name: '实验家', emoji: '🧪', desc: '完成 20 节互动实验课', goal: 20 },
  { id: 'wrong-slayer', name: '错题终结者', emoji: '🐛', desc: '消灭 20 道错题', goal: 20 },
  { id: 'five-subjects', name: '五湖四海', emoji: '🗺️', desc: '在 5 个学科留下足迹', goal: 5 },
  { id: 'note-writer', name: '科学笔记达人', emoji: '📝', desc: '写下 5 份实验记录单', goal: 5 },
  { id: 'pairs-3', name: '连连看达人', emoji: '🔗', desc: '完成 3 局概念连连看', goal: 3 },
  { id: 'listen-ear', name: '金耳朵', emoji: '🎧', desc: '听音辨卡 5/5 满分 1 次', goal: 1 },
  { id: 'challenge-180', name: '擂台高手', emoji: '⚔️', desc: '挑战赛单局 ≥ 180 分', goal: 1 },
  { id: 'exam-90', name: '期末优等生', emoji: '🥇', desc: '任一模拟卷正确率 ≥ 90%', goal: 1 },
  { id: 'weekly-goal-3', name: '言出必行', emoji: '🎯', desc: '达成 3 次周目标', goal: 3 },
];

/** 从「今天」往回数连续有学习记录的天数（当天没学不打断，从昨天起算） */
export function streakFrom(dailyUsage: Record<string, number>): number {
  const day = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10);
  };
  let streak = 0;
  const startOffset = (dailyUsage[day(0)] ?? 0) > 0 ? 0 : 1;
  for (let off = startOffset; ; off++) {
    if ((dailyUsage[day(off)] ?? 0) > 0) streak += 1;
    else break;
    if (off > 400) break; // 防御：极端历史数据
  }
  return streak;
}

/** 计算全部徽章状态：cur 为当前进度，unlocked = cur >= goal（records 为游戏/考试战绩，可缺省） */
export function computeBadges(lessons: Lesson[], progress: ProfileProgress | null, records: GameRecords = { ...EMPTY_RECORDS }): BadgeState[] {
  const done = lessons.filter((l) => progress?.lessons[l.id]?.status === 'completed');
  const doneIds = new Set(done.map((l) => l.id));
  const labsDone = lessons.filter((l) => l.lab && doneIds.has(l.id)).length;
  const ex = progress?.exercises ?? {};
  let correct = 0;
  let perfect = 0;
  for (const rec of Object.values(ex)) {
    correct += rec.correct;
    if (rec.total >= 6 && rec.correct === rec.total) perfect += 1;
  }
  const subjects = new Set(done.map((l) => l.subjectArea ?? '信息科技')).size;
  const notes = Object.values(progress?.labNotes ?? {}).filter((v) => v && v.trim().length > 0).length;
  const streak = streakFrom(progress?.dailyUsage ?? {});

  const cur: Record<string, number> = {
    'first-lesson': done.length,
    'ten-lessons': done.length,
    'fifty-lessons': done.length,
    'streak-3': streak,
    'streak-7': streak,
    'perfect-quiz': perfect,
    'hundred-correct': correct,
    'five-hundred': correct,
    'lab-20': labsDone,
    'wrong-slayer': progress?.wrongCleared ?? 0,
    'five-subjects': subjects,
    'note-writer': notes,
    'pairs-3': records.pairsPlays,
    'listen-ear': records.listenPerfect,
    'challenge-180': records.challengeBest >= 180 ? 1 : 0,
    'exam-90': records.examBest >= 90 ? 1 : 0,
    'weekly-goal-3': records.weeklyGoalsMet,
  };
  return BADGES.map((b) => ({ ...b, cur: Math.min(cur[b.id] ?? 0, b.goal), unlocked: (cur[b.id] ?? 0) >= b.goal }));
}

/** 战绩写入器：merge 后返回新记录（供各页面调用） */
export function bumpRecords(prev: GameRecords, patch: Partial<GameRecords>): GameRecords {
  return {
    pairsPlays: Math.max(prev.pairsPlays, patch.pairsPlays ?? 0),
    listenPerfect: Math.max(prev.listenPerfect, patch.listenPerfect ?? 0),
    challengeBest: Math.max(prev.challengeBest, patch.challengeBest ?? 0),
    examBest: Math.max(prev.examBest, patch.examBest ?? 0),
    weeklyGoalsMet: Math.max(prev.weeklyGoalsMet, patch.weeklyGoalsMet ?? 0),
  };
}

/** localStorage 战绩键 */
export const recordsKey = (profileId: string) => `island-records-${profileId}`;
