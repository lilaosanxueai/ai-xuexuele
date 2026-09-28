import type { Lesson } from '@shared/types.ts';

/**
 * 难度自适应下一课推荐：随堂练得分 → 下一站建议。
 * 高分往上跳（同模块更深）、低分往下补（同模块更基础）、中间顺位走。
 * 纯函数可单测。
 */

export interface NextStep {
  lessonId: string;
  title: string;
  emoji: string;
  reason: string;
  /** 跳转路由（/lab 或 /tutor 由课程形态决定） */
  path: string;
}

const BAND_RANK: Record<string, number> = { primary: 0, junior: 1, senior: 2 };

/** 同学科、同课标模块（模块名缺失时退化为同学科）的课程集合 */
function modulePeers(all: Lesson[], cur: Lesson): Lesson[] {
  const mod = cur.curriculum?.module;
  const sameArea = all.filter((l) => l.id !== cur.id && l.subjectArea === cur.subjectArea);
  const sameModule = mod ? sameArea.filter((l) => l.curriculum?.module === mod) : [];
  return sameModule.length > 0 ? sameModule : sameArea;
}

export function suggestNext(all: Lesson[], cur: Lesson, accuracy: number): NextStep | null {
  if (all.length === 0) return null;
  const route = (l: Lesson) => (l.lab || l.starterCode ? `/lab/${l.id}` : `/tutor/${l.id}`);
  const peers = modulePeers(all, cur);

  // ① 高分（≥90%）：同模块里找更深的一课（年级更高，其次学段更高）
  if (accuracy >= 0.9) {
    const deeper = peers
      .filter((l) => (l.grade ?? 0) > (cur.grade ?? 0) || BAND_RANK[l.gradeBand ?? 'primary'] > BAND_RANK[cur.gradeBand ?? 'primary'])
      .sort((a, b) => (a.grade ?? 0) - (b.grade ?? 0) || BAND_RANK[a.gradeBand ?? 'primary'] - BAND_RANK[b.gradeBand ?? 'primary'])[0];
    if (deeper) {
      return { lessonId: deeper.id, title: deeper.title, emoji: deeper.emoji, path: route(deeper),
        reason: '这一课稳了！同主题更深的一课已经准备好 🚀' };
    }
  }

  // ② 低分（<60%）：同模块里找更基础的课垫一垫
  if (accuracy < 0.6) {
    const easier = peers
      .filter((l) => (l.grade ?? 0) < (cur.grade ?? 0) || BAND_RANK[l.gradeBand ?? 'primary'] < BAND_RANK[cur.gradeBand ?? 'primary'])
      .sort((a, b) => (b.grade ?? 0) - (a.grade ?? 0) || BAND_RANK[b.gradeBand ?? 'primary'] - BAND_RANK[a.gradeBand ?? 'primary'])[0];
    if (easier) {
      return { lessonId: easier.id, title: easier.title, emoji: easier.emoji, path: route(easier),
        reason: '先把基础垫稳——这节更友好的同主题课正合适 🌱' };
    }
  }

  // ③ 中间水平：按学科顺序的下一课
  const siblings = all
    .filter((l) => l.subjectArea === cur.subjectArea)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = siblings.findIndex((l) => l.id === cur.id);
  const next = siblings[idx + 1];
  if (next) {
    return { lessonId: next.id, title: next.title, emoji: next.emoji, path: route(next),
      reason: '节奏正好，学科路径的下一课继续 📚' };
  }
  return null;
}
