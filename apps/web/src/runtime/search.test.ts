import { describe, expect, it } from 'vitest';
import { buildIndex, hotKeywords, scoreEntry, searchLessons } from './search.ts';
import type { Lesson } from '@shared/types.ts';

const mkLesson = (over: Partial<Lesson>): Lesson => ({
  id: 'l1', island: 'cross', order: 1, title: '浮力入门', emoji: '🚢', story: '', goals: [], toolbox: [], actor: { costume: '🚢', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: '物理', gradeBand: 'junior', grade: 8, textbook: '测试', ...over,
});

const lessons: Lesson[] = [
  mkLesson({
    curriculum: { module: 'm', stage: 's', points: ['浮力的概念', '阿基米德原理'] },
    teach: { sections: [
      { title: '什么是浮力', body: '【浸在液体中的物体受到向上的托力叫浮力】' },
      { title: '计算', body: '【F浮 = ρ液 g V排】' },
    ], examples: [], mistakes: [] },
  }),
  {
    ...mkLesson({ id: 'l2', title: '定语从句', subjectArea: '英语', gradeBand: 'senior' }),
    curriculum: { module: 'm', stage: 's', points: ['关系代词', '定语从句的结构'] },
    teach: { sections: [{ title: '定语从句是什么', body: '【挂在名词后面修饰它的小句子叫定语从句】' }], examples: [], mistakes: [] },
  },
];

describe('buildIndex 索引', () => {
  it('收集知识点、章节标题与定义句', () => {
    const idx = buildIndex(lessons);
    expect(idx.some((e) => e.kind === 'point' && e.text === '浮力的概念')).toBe(true);
    expect(idx.some((e) => e.kind === 'section' && e.text === '什么是浮力')).toBe(true);
    expect(idx.some((e) => e.kind === 'claim' && e.text === 'F浮 = ρ液 g V排')).toBe(true);
  });
  it('无课程数据的课不产条目', () => {
    expect(buildIndex([mkLesson({})])).toHaveLength(0);
  });
});

describe('scoreEntry 打分', () => {
  const e = (kind: 'point' | 'claim' | 'section', text: string) => ({ lessonId: 'x', lessonTitle: '浮力入门', emoji: '📘', subject: '物理', band: 'junior' as const, kind, text });
  it('不命中为 0，命中为正', () => {
    expect(scoreEntry(e('point', '无关内容'), '浮力')).toBe(0);
    expect(scoreEntry(e('point', '浮力的概念'), '浮力')).toBeGreaterThan(0);
  });
  it('完全相同 > 前缀 > 中间包含', () => {
    const exact = scoreEntry(e('section', '浮力'), '浮力');
    const prefix = scoreEntry(e('section', '浮力的概念'), '浮力');
    const mid = scoreEntry(e('section', '认识浮力是什么'), '浮力');
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(mid);
  });
  it('课名含关键词加权', () => {
    const plain = scoreEntry({ ...e('claim', '含浮力的句子'), lessonTitle: '别的话题' }, '浮力');
    const boost = scoreEntry(e('claim', '含浮力的句子'), '浮力');
    expect(boost).toBeGreaterThan(plain);
  });
});

describe('searchLessons 检索', () => {
  const idx = buildIndex(lessons);
  it('按相关性排序返回课程与摘要', () => {
    const rs = searchLessons(idx, '浮力');
    expect(rs.length).toBeGreaterThanOrEqual(1);
    expect(rs[0].lessonId).toBe('l1');
    expect(rs[0].snippets.length).toBeGreaterThanOrEqual(1);
  });
  it('学科过滤生效', () => {
    expect(searchLessons(idx, '从句', { subject: '物理' })).toHaveLength(0);
    expect(searchLessons(idx, '从句', { subject: '英语' })[0].lessonId).toBe('l2');
  });
  it('空串与无命中返回空', () => {
    expect(searchLessons(idx, '')).toHaveLength(0);
    expect(searchLessons(idx, '量子纠缠')).toHaveLength(0);
  });
});

describe('hotKeywords 热词', () => {
  it('给出短小关键词且不重复', () => {
    const ks = hotKeywords(lessons, 4);
    expect(ks.length).toBeGreaterThanOrEqual(1);
    expect(ks.length).toBeLessThanOrEqual(4);
    expect(new Set(ks).size).toBe(ks.length);
  });
});
