import { describe, expect, it } from 'vitest';
import { bumpCounter, generateQuests, readCounters, todayKey } from './dailyQuests.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const mkLesson = (): Lesson => ({
  id: 'a', island: 'cross', order: 1, title: '课', emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: '数学', gradeBand: 'primary', grade: 3, textbook: '测试',
});
const mkProgress = (patch: Partial<ProfileProgress> = {}): ProfileProgress => ({
  profileId: 'p', lessons: {}, dailyUsage: {}, lessonDrafts: {}, lessonCodes: {}, ...patch,
});

describe('readCounters 计数器', () => {
  it('空/坏数据返回当日空计数', () => {
    const c = readCounters(null);
    expect(c.date).toBe(todayKey());
    expect(c.flashcards).toBe(0);
  });
  it('跨天自动归零', () => {
    const stale = readCounters({ date: '2000-01-01', flashcards: 9, wrongsCleared: 9, challenges: 9 });
    expect(stale.flashcards).toBe(0);
  });
  it('同日读取保留数值', () => {
    const c = readCounters({ date: todayKey(), flashcards: 3, wrongsCleared: 1, challenges: 2, reviews: 1 });
    expect(c).toEqual({ date: todayKey(), flashcards: 3, wrongsCleared: 1, challenges: 2, reviews: 1 });
  });
});

describe('bumpCounter', () => {
  it('对应项 +1 且不影响其他项', () => {
    const c = bumpCounter({ date: todayKey(), flashcards: 1, wrongsCleared: 0, challenges: 0 }, 'flashcards');
    expect(c.flashcards).toBe(2);
    expect(c.challenges).toBe(0);
  });
  it('跨天旧数据先归零再累加', () => {
    const c = bumpCounter({ date: '2000-01-01', flashcards: 5, wrongsCleared: 0, challenges: 0 }, 'challenges');
    expect(c.challenges).toBe(1);
  });
});

describe('generateQuests 每日任务', () => {
  it('无错题时 4 项任务全未完成（含补亮一颗星）', () => {
    const qs = generateQuests([mkLesson()], mkProgress(), readCounters(null));
    expect(qs.map((q) => q.id)).toEqual(['new-lesson', 'light-a-star', 'flashcards', 'challenge']);
    expect(qs.every((q) => !q.done)).toBe(true);
  });
  it('有错题时追加错题任务', () => {
    const p = mkProgress({ wrongBook: [{ id: 'x#0', lessonId: 'x', lessonTitle: 't', subjectArea: '数学', q: 'q', options: ['a', 'b', 'c', 'd'], answer: 0, explain: 'e', wrongPicks: [1], times: 1, lastWrongAt: '2026-09-20T00:00:00Z' }] });
    const qs = generateQuests([mkLesson()], p, readCounters(null));
    expect(qs).toHaveLength(5);
    expect(qs[4].id).toBe('wrongbook');
    expect(qs[4].detail).toContain('1 道');
  });
  it('今天完成过新课则第一项点亮', () => {
    const p = mkProgress({ lessons: { a: { status: 'completed', tasks: {}, completedAt: new Date().toISOString() } } });
    const qs = generateQuests([mkLesson()], p, readCounters(null));
    expect(qs[0].done).toBe(true);
  });
  it('昨天完成的课不算今天', () => {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const p = mkProgress({ lessons: { a: { status: 'completed', tasks: {}, completedAt: y.toISOString() } } });
    const qs = generateQuests([mkLesson()], p, readCounters(null));
    expect(qs[0].done).toBe(false);
  });
  it('计数器达标各项点亮', () => {
    const c = { date: todayKey(), flashcards: 5, wrongsCleared: 2, challenges: 1, reviews: 0 };
    const qs = generateQuests([mkLesson()], mkProgress(), c);
    expect(qs.find((q) => q.id === 'flashcards')!.done).toBe(true);
    expect(qs.find((q) => q.id === 'challenge')!.done).toBe(true);
  });
  it('记忆盒有到期错题时出现复查任务，reviews 计数点亮', () => {
    const queue = [
      { id: 'x#0', lessonId: 'x', lessonTitle: 't', subjectArea: '数学', q: 'q', options: ['a', 'b'], answer: 0, explain: 'e', stage: 0, dueAt: new Date(Date.now() - 60_000).toISOString() },
    ];
    const qs0 = generateQuests([mkLesson()], mkProgress({ reviewQueue: queue }), { date: todayKey(), flashcards: 0, wrongsCleared: 0, challenges: 0, reviews: 0 });
    const q0 = qs0.find((q) => q.id === 'wrong-review');
    expect(q0).toBeDefined();
    expect(q0!.done).toBe(false);
    expect(q0!.title).toContain('1 道');
    const qs1 = generateQuests([mkLesson()], mkProgress({ reviewQueue: queue }), { date: todayKey(), flashcards: 0, wrongsCleared: 0, challenges: 0, reviews: 1 });
    expect(qs1.find((q) => q.id === 'wrong-review')!.done).toBe(true);
  });
  it('记忆盒未到期不出现复查任务', () => {
    const queue = [
      { id: 'x#0', lessonId: 'x', lessonTitle: 't', subjectArea: '数学', q: 'q', options: ['a', 'b'], answer: 0, explain: 'e', stage: 0, dueAt: new Date(Date.now() + 3 * 86_400_000).toISOString() },
    ];
    const qs = generateQuests([mkLesson()], mkProgress({ reviewQueue: queue }), readCounters(null));
    expect(qs.find((q) => q.id === 'wrong-review')).toBeUndefined();
  });

  it('今天点亮模块第一颗星→补亮任务完成·标题引用最大的全暗模块', () => {
    const lessons = [
      { ...mkLesson(), id: 'a', curriculum: { module: '函数', points: [], stage: '' } },
      { ...mkLesson(), id: 'b', order: 2, curriculum: { module: '函数', points: [], stage: '' } },
      { ...mkLesson(), id: 'c', order: 3, curriculum: { module: '几何', points: [], stage: '' } },
    ];
    const p = mkProgress({ lessons: { a: { status: 'completed', tasks: {}, completedAt: new Date().toISOString() } } });
    const qs = generateQuests(lessons, p, readCounters(null));
    const star = qs.find((q) => q.id === 'light-a-star')!;
    expect(star).toBeDefined();
    expect(star.done).toBe(true); // 函数的第一颗星今天点亮
    expect(star.title).toContain('几何'); // 推荐最大的全暗模块
    expect(star.detail).toContain('1 颗');
  });

  it('星昨天就点亮了：今天补第二节不算「今天点亮」', () => {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const lessons = [
      { ...mkLesson(), id: 'a', curriculum: { module: '函数', points: [], stage: '' } },
      { ...mkLesson(), id: 'b', order: 2, curriculum: { module: '函数', points: [], stage: '' } },
      { ...mkLesson(), id: 'c', order: 3, curriculum: { module: '几何', points: [], stage: '' } },
    ];
    const p = mkProgress({
      lessons: {
        a: { status: 'completed', tasks: {}, completedAt: y.toISOString() },
        b: { status: 'completed', tasks: {}, completedAt: new Date().toISOString() },
      },
    });
    const qs = generateQuests(lessons, p, readCounters(null));
    expect(qs.find((q) => q.id === 'light-a-star')!.done).toBe(false); // 函数亮于昨天·几何仍全暗未学
  });

  it('没有全暗模块时不出现补亮任务', () => {
    const lessons = [{ ...mkLesson(), id: 'a', curriculum: { module: '函数', points: [], stage: '' } }];
    const p = mkProgress({ lessons: { a: { status: 'completed', tasks: {}, completedAt: new Date().toISOString() } } });
    const qs = generateQuests(lessons, p, readCounters(null));
    expect(qs.find((q) => q.id === 'light-a-star')).toBeUndefined();
  });
});
