import { describe, expect, it } from 'vitest';
import { pickVariants } from './variants.ts';
import type { Exercise, Lesson, WrongItem } from '@shared/types.ts';

const ex = (q: string): Exercise => ({ q, options: ['甲', '乙', '丙', '丁'], answer: 0, explain: '解析' });
const lesson = (id: string, area: string, mod: string, qs: string[]): Lesson => ({
  id, order: 1, title: id, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '', x: 0, y: 0 },
  tasks: [], aiIntro: '', celebrate: '', subjectArea: area, curriculum: { module: mod, points: [] },
  exercises: qs.map(ex),
} as unknown as Lesson);
const wrong = (id: string, lessonId: string, q: string): WrongItem => ({
  id, lessonId, lessonTitle: lessonId, subjectArea: '数学', q,
  options: ['甲', '乙'], answer: 0, explain: '', wrongPicks: [1], times: 1, lastWrongAt: '2026-01-01',
});

describe('pickVariants 举一反三变式', () => {
  it('优先取同模块的题，且排除原题和已在错题本的题', () => {
    const ls = [
      lesson('math-a', '数学', '分数', ['原题', '模块题1', '模块题2', '模块题3']),
      lesson('math-b', '数学', '分数', ['模块题4', '错题本里已有的题']),
      lesson('math-c', '数学', '方程', ['方程题1']),
    ];
    const w = wrong('math-a#0', 'math-a', '原题');
    const wrongs = [w, wrong('math-b#1', 'math-b', '错题本里已有的题')];
    const out = pickVariants(w, ls, wrongs, 3);
    expect(out.map((e) => e.q).sort()).toEqual(['模块题1', '模块题2', '模块题3']);
  });

  it('同模块题不足时回退同学科，再回退原课', () => {
    const ls = [
      lesson('math-a', '数学', '分数', ['原题', '仅剩的原课题']),
      lesson('math-d', '数学', '几何', ['几何题1', '几何题2']),
      lesson('chn-a', '语文', '分数', ['语文撞名模块题']),
    ];
    const out = pickVariants(wrong('math-a#0', 'math-a', '原题'), ls, [], 3);
    // 语文撞名模块不进来；同学科几何题 + 原课题补足
    expect(out.map((e) => e.q).sort()).toEqual(['仅剩的原课题', '几何题1', '几何题2']);
  });

  it('数量不足时有几道给几道，空池返回空数组', () => {
    const thin = [lesson('math-a', '数学', '分数', ['原题'])];
    expect(pickVariants(wrong('math-a#0', 'math-a', '原题'), thin, [], 3)).toEqual([]);
    const two = [lesson('math-a', '数学', '分数', ['原题', '变1', '变2'])];
    expect(pickVariants(wrong('math-a#0', 'math-a', '原题'), two, [], 3)).toHaveLength(2);
  });

  it('按题干去重，同一题不重复出现', () => {
    const ls = [
      lesson('math-a', '数学', '分数', ['原题', '共享题']),
      lesson('math-b', '数学', '分数', ['共享题', '共享题2']),
    ];
    const out = pickVariants(wrong('math-a#0', 'math-a', '原题'), ls, [], 3);
    expect(out.filter((e) => e.q === '共享题')).toHaveLength(1);
  });
});
