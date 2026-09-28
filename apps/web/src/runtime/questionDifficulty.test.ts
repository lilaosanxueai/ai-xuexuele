import { describe, expect, it } from 'vitest';
import { estimateDifficulty, sortByDifficulty, sortByWrongPriority, wrongPriority } from './questionDifficulty.ts';

describe('estimateDifficulty 题目难度启发式', () => {
  it('直问直答的短题是基础（1）', () => {
    expect(estimateDifficulty({ q: '隋朝的建立者是？' })).toBe(1);
    expect(estimateDifficulty({ q: '什么是勾股定理？' })).toBe(1);
  });
  it('「属于/作用/意义」类理解题是进阶（2）', () => {
    expect(estimateDifficulty({ q: '下列属于可再生能源的是？' })).toBe(2);
    expect(estimateDifficulty({ q: '蒸腾作用对植物的意义是？' })).toBe(2);
  });
  it('「为什么/比较/计算」类推理题是挑战（3）', () => {
    expect(estimateDifficulty({ q: '为什么沿海地区昼夜温差小？' })).toBe(3);
    expect(estimateDifficulty({ q: '两种方案比较，应该怎么做？' })).toBe(3);
  });
  it('空题干不崩溃且为基础级', () => {
    expect(estimateDifficulty({ q: '' })).toBe(1);
  });
});

describe('sortByDifficulty 由易到难组卷', () => {
  it('难度递增且同难度保持原序（稳定）', () => {
    const qs = [
      { q: '为什么导体能导电呢', tag: 'hard' },
      { q: '什么是密度？', tag: 'easy1' },
      { q: '下列属于金属的是？', tag: 'mid' },
      { q: '唐朝建立的时间是？', tag: 'easy2' },
    ];
    const sorted = sortByDifficulty(qs);
    expect(sorted.map((x) => x.tag)).toEqual(['easy1', 'easy2', 'mid', 'hard']);
  });
});

describe('wrongPriority 错题重练优先级', () => {
  const now = new Date('2026-09-28T00:00:00Z');
  it('错次多的优先', () => {
    const a = { times: 1, lastWrongAt: '2026-09-20T00:00:00Z' };
    const b = { times: 3, lastWrongAt: '2026-09-20T00:00:00Z' };
    expect(wrongPriority(b, now)).toBeGreaterThan(wrongPriority(a, now));
  });
  it('同错次时错得更久的优先', () => {
    const recent = { times: 2, lastWrongAt: '2026-09-27T00:00:00Z' };
    const old = { times: 2, lastWrongAt: '2026-09-01T00:00:00Z' };
    expect(wrongPriority(old, now)).toBeGreaterThan(wrongPriority(recent, now));
  });
  it('排序把最该复习的放最前', () => {
    const list = [
      { times: 1, lastWrongAt: '2026-09-27T00:00:00Z' },
      { times: 3, lastWrongAt: '2026-09-01T00:00:00Z' },
    ];
    expect(sortByWrongPriority(list, now)[0].times).toBe(3);
  });
});
