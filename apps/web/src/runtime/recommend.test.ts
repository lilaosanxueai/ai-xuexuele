import { describe, expect, it } from 'vitest';
import { recommendNext } from './recommend.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const L = (id: string, order: number, area: string): Lesson => ({
  id, island: 'math', order, title: `课${id}`, emoji: '📘', story: '', goals: [],
  toolbox: [], actor: { costume: '🤖', x: 0, y: 0 }, tasks: [], aiIntro: '', celebrate: '',
  subjectArea: area,
});

const lessons = [L('a', 1, '信息科技'), L('b', 2, '数学'), L('c', 3, '数学'), L('d', 4, '物理')];

const P = (lessonsDone: string[], drafts: string[] = []): ProfileProgress => ({
  profileId: 'p',
  lessons: Object.fromEntries(lessonsDone.map((id) => [id, { status: 'completed' as const, tasks: {} }])),
  dailyUsage: {},
  lessonDrafts: Object.fromEntries(drafts.map((id) => [id, '<xml/>'])),
  lessonCodes: {},
});

describe('智能学习路径', () => {
  it('有草稿的课优先推荐「继续」', () => {
    const r = recommendNext(lessons, P(['a'], ['c']));
    expect(r?.lessonId).toBe('c');
    expect(r?.reason).toContain('继续');
  });

  it('无进行中课程时补最薄弱学科（物理 0%）', () => {
    const r = recommendNext(lessons, P(['a', 'b', 'c']));
    expect(r?.lessonId).toBe('d');
    expect(r?.reason).toContain('物理');
  });

  it('全新用户顺序推荐第一课', () => {
    const r = recommendNext(lessons, P([]));
    expect(r?.lessonId).toBe('a');
  });

  it('全部完成推荐重温', () => {
    const r = recommendNext(lessons, P(['a', 'b', 'c', 'd']));
    expect(r?.reason).toContain('全部通关');
  });
});
