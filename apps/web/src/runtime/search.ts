import type { Lesson } from '@shared/types.ts';

/**
 * 全科知识搜索：把 371 课的课标知识点、讲解定义句、章节标题建成可检索索引，
 * 让孩子卡在某个概念（如「浮力」「定语从句」）时能一秒定位到对应课程。
 * 纯本地字符串匹配 + 简单排序，无任何外部依赖。
 */

export type EntryKind = 'point' | 'claim' | 'section';

export interface SearchEntry {
  lessonId: string;
  lessonTitle: string;
  emoji: string;
  subject: string;
  band: 'primary' | 'junior' | 'senior';
  /** 条目类型：知识点 / 定义句 / 章节标题 */
  kind: EntryKind;
  /** 被检索的文本 */
  text: string;
}

/** 建索引：每课贡献 知识点 + 讲解【】定义句 + 章节标题 */
export function buildIndex(lessons: Lesson[]): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const l of lessons) {
    const base = {
      lessonId: l.id, lessonTitle: l.title, emoji: l.emoji,
      subject: l.subjectArea ?? '信息科技', band: l.gradeBand ?? 'primary',
    };
    for (const p of l.curriculum?.points ?? []) out.push({ ...base, kind: 'point' as const, text: p });
    for (const s of l.teach?.sections ?? []) {
      out.push({ ...base, kind: 'section' as const, text: s.title });
      const claims = s.body.match(/【[^】]+】/g) ?? [];
      for (const c of claims) out.push({ ...base, kind: 'claim' as const, text: c.slice(1, -1) });
    }
  }
  return out;
}

/** 单条命中得分：越高越靠前（0 = 不命中） */
export function scoreEntry(entry: SearchEntry, q: string): number {
  if (!q) return 0;
  const text = entry.text;
  const idx = text.indexOf(q);
  if (idx < 0) return 0;
  let score = 10;
  if (text === q) score = 100; // 完全相同
  else if (text.startsWith(q)) score = 60; // 前缀
  else if (idx === 0) score = 40;
  if (entry.kind === 'point') score += 15; // 知识点优先
  if (entry.kind === 'claim') score += 8;
  // 课名也含关键词的再加权（学这课大概率就是答案）
  if (entry.lessonTitle.includes(q)) score += 20;
  return score;
}

/** 搜索：同课聚合、按最高分排序，最多 limit 课 */
export function searchLessons(
  index: SearchEntry[],
  q: string,
  opts: { subject?: string; limit?: number } = {},
): { lessonId: string; lessonTitle: string; emoji: string; subject: string; band: 'primary' | 'junior' | 'senior'; snippets: string[] }[] {
  const { subject, limit = 12 } = opts;
  const query = q.trim();
  if (!query) return [];
  const byLesson = new Map<string, { score: number; snippets: string[]; entry: SearchEntry }>();
  for (const e of index) {
    if (subject && subject !== '全部' && e.subject !== subject) continue;
    const s = scoreEntry(e, query);
    if (s <= 0) continue;
    const cur = byLesson.get(e.lessonId);
    if (!cur) byLesson.set(e.lessonId, { score: s, snippets: [e.text], entry: e });
    else {
      cur.score += s * 0.5; // 同课多命中适度叠加
      if (cur.snippets.length < 3 && !cur.snippets.includes(e.text)) cur.snippets.push(e.text);
    }
  }
  return [...byLesson.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry, snippets }) => ({ lessonId: entry.lessonId, lessonTitle: entry.lessonTitle, emoji: entry.emoji, subject: entry.subject, band: entry.band, snippets }));
}

/** 热词推荐：从全站知识点里挑短小好读的（每次取前 N 条，按课序） */
export function hotKeywords(lessons: Lesson[], n = 8): string[] {
  const out: string[] = [];
  const start = Math.floor(Math.random() * Math.max(1, lessons.length - n));
  for (const l of lessons.slice(start, start + n * 3)) {
    const p = l.curriculum?.points?.[0];
    if (!p) continue;
    const clean = p.replace(/[（(].*$/, '').slice(0, 8);
    if (clean.length >= 2 && !out.includes(clean)) out.push(clean);
    if (out.length >= n) break;
  }
  return out;
}
