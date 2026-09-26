import type { Lesson } from '@shared/types.ts';

export interface LessonNeighbors {
  prev: Lesson | null;
  next: Lesson | null;
  /** 当前课在同学科序列中的位置（1 起） */
  index: number;
  /** 同学科课程总数 */
  total: number;
}

/**
 * 同学科课程按 order 排成学习序列，找当前课的上一课/下一课。
 * 辅导页/实验室页顶部的连续学习导航用：学完一课直接翻下一课，不用回学科页再找。
 */
export function lessonNeighbors(all: Lesson[], id: string): LessonNeighbors {
  const cur = all.find((l) => l.id === id);
  if (!cur) return { prev: null, next: null, index: 0, total: 0 };
  const area = cur.subjectArea ?? '';
  const siblings = all
    .filter((l) => (l.subjectArea ?? '') === area)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));
  const i = siblings.findIndex((l) => l.id === id);
  return {
    prev: i > 0 ? siblings[i - 1] : null,
    next: i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : null,
    index: i + 1,
    total: siblings.length,
  };
}

/** 导航目标路由：实验课进实验室，其余进辅导页 */
export function lessonRoute(l: Lesson): string {
  return l.lab || l.starterCode ? `/lab/${l.id}` : `/tutor/${l.id}`;
}
