import type { Lesson } from '@shared/types.ts';

/**
 * 跨学科知识链接：找到不同学科中相关联的课程。
 * 例：物理"波的传播"↔音乐"声音的产生"↔数学"正弦函数"——
 * 让孩子看到知识不是孤岛，学科之间是连通的。
 */

export interface CrossLink {
  lessonId: string;
  lessonTitle: string;
  emoji: string;
  subject: string;
  sharedPoint: string;
}

/** 提取课程的核心关键词（去括号取前几个字） */
function keyOf(point: string): string {
  return point.replace(/[（(].*$/, '').trim().slice(0, 4);
}

/** 找跨学科链接：同关键词但不同学科的课程 */
export function findCrossLinks(target: Lesson, allLessons: Lesson[], limit = 3): CrossLink[] {
  const targetSubject = target.subjectArea ?? '';
  const targetKeys = new Set((target.curriculum?.points ?? []).map(keyOf));
  if (targetKeys.size === 0) return [];
  const out: CrossLink[] = [];
  for (const l of allLessons) {
    if (l.subjectArea === targetSubject || l.id === target.id) continue;
    for (const p of l.curriculum?.points ?? []) {
      const k = keyOf(p);
      if (targetKeys.has(k) || [...targetKeys].some((tk) => tk.includes(k) || k.includes(tk))) {
        out.push({
          lessonId: l.id, lessonTitle: l.title, emoji: l.emoji,
          subject: l.subjectArea ?? '综合', sharedPoint: p,
        });
        break; // 每课只取一个匹配点
      }
    }
    if (out.length >= limit * 3) break; // 多取一些再去重
  }
  // 去重（同课只留一条）+ 按学科多样性排序
  const seen = new Set<string>();
  const deduped = out.filter((o) => {
    if (seen.has(o.lessonId)) return false;
    seen.add(o.lessonId);
    return true;
  });
  // 优先不同学科
  const subjectCount = new Map<string, number>();
  const result: CrossLink[] = [];
  for (const link of deduped) {
    const cnt = subjectCount.get(link.subject) ?? 0;
    if (cnt < 2) { // 每学科最多2条
      result.push(link);
      subjectCount.set(link.subject, cnt + 1);
    }
    if (result.length >= limit) break;
  }
  return result;
}
