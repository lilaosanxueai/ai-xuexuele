/**
 * 学习之星（XP）与等级：多邻国式全局激励层。
 * XP 来自随堂练（正确数×10 + 全对加成），等级曲线用平方根——前期升得快、后期有追求。
 */

/** 等级称号（每 5 级一档） */
const TITLES = ['见习学员', '知识新芽', '学习行者', '思维探险家', '学科达人', '智慧大师', '传奇学霸'];

export interface XpLevel {
  level: number;
  title: string;
  /** 当前等级已攒 XP（等级起点） */
  cur: number;
  /** 下一等级所需 XP */
  next: number;
  /** 0-100 到下一级进度 */
  progress: number;
}

/** 每级所需 XP：level n → n+1 需要 40 + 10*n（缓增） */
export function xpForLevel(level: number): number {
  return 40 + 10 * Math.max(1, level);
}

export function levelFor(xp: number): XpLevel {
  let level = 1;
  let rest = Math.max(0, Math.floor(xp));
  while (rest >= xpForLevel(level)) {
    rest -= xpForLevel(level);
    level += 1;
    if (level > 999) break;
  }
  const need = xpForLevel(level);
  return {
    level,
    title: TITLES[Math.min(TITLES.length - 1, Math.floor((level - 1) / 5))],
    cur: level === 1 ? 0 : xp - rest,
    next: need,
    progress: Math.min(100, Math.round((rest / need) * 100)),
  };
}

/** 小练 XP：每对 10 星，全对 +20，完成即 +5（鼓励做完） */
export function xpForQuiz(correct: number, total: number): number {
  if (total <= 0) return 0;
  return correct * 10 + (correct === total ? 20 : 0) + 5;
}
