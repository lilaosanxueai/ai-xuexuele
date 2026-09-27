import { describe, expect, it } from 'vitest';
import { recommendNext } from './recommend.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const L = (id: string, order: number, area: string, grade?: number): Lesson => ({
  id, island: 'math', order, title: `课${id}`, emoji: '📘', story: '', goals: [],
  toolbox: [], actor: { costume: '🤖', x: 0, y: 0 }, tasks: [], aiIntro: '', celebrate: '',
  subjectArea: area, grade,
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
    expect(r?.reason).toContain('全部学完');
  });

  it('带年级时：同龄课优先于薄弱学科', () => {
    // 数学 0% 最薄弱，但 7 年级课 a 还没学 → 同龄推荐优先
    const graded = [L('a', 1, '信息科技', 7), L('g8', 2, '数学', 8), L('g7', 3, '数学', 7)];
    const r = recommendNext(graded, P([]), 7);
    expect(r?.lessonId).toBe('a');
    expect(r?.reason).toContain('7年级正在学');
  });

  it('带年级且无同龄课时：薄弱学科通道用年级选入口', () => {
    // 没有 7 年级课剩着：数学 0% 最薄弱 → 入口是数学的 g8
    const graded = [L('a', 1, '信息科技', 7), L('g8', 2, '数学', 8), L('g6', 3, '数学', 6)];
    const r = recommendNext(graded, P(['a']), 7);
    expect(r?.lessonId).toBe('g8');
    expect(r?.reason).toContain('数学');
  });

  it('带年级时：无薄弱学科推同年级新课（而非顺序第一课）', () => {
    // 数学只剩 g7 未完成 → 同龄推荐命中
    const graded = [L('a', 1, '信息科技', 7), L('g8', 2, '数学', 8), L('g7', 3, '数学', 7)];
    const r = recommendNext(graded, P(['a', 'g8']), 7);
    expect(r?.lessonId).toBe('g7');
    expect(r?.reason).toContain('7年级正在学');
  });

  it('不带年级时行为与旧逻辑一致', () => {
    const graded = [L('a', 1, '信息科技', 7), L('g8', 2, '数学', 8), L('g7', 3, '数学', 7)];
    const r = recommendNext(graded, P(['a', 'g8']));
    expect(r?.lessonId).toBe('g7'); // 顺序推进恰好也是它，语义不变
  });
});
