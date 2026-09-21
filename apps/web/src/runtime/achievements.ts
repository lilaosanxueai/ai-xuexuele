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

/** 计算全部徽章状态：cur 为当前进度，unlocked = cur >= goal */
export function computeBadges(lessons: Lesson[], progress: ProfileProgress | null): BadgeState[] {
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
  };
  return BADGES.map((b) => ({ ...b, cur: Math.min(cur[b.id] ?? 0, b.goal), unlocked: (cur[b.id] ?? 0) >= b.goal }));
}
