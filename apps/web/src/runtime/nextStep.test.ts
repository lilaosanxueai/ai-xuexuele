import { describe, expect, it } from 'vitest';
import { suggestNext } from './nextStep.ts';
import type { Lesson } from '@shared/types.ts';

const L = (id: string, order: number, grade: number, band: 'primary' | 'junior' | 'senior', mod?: string, area = '数学'): Lesson => ({
  id, island: 'math', order, title: '课' + id, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: area, gradeBand: band, grade,
  curriculum: mod ? { stage: '测试学段', module: mod, points: [] } : undefined,
});

const cur = L('now', 3, 7, 'junior', '函数');
const lessons = [
  L('basic', 1, 5, 'primary', '函数'),
  L('prev', 2, 6, 'primary', '函数'),
  cur,
  L('next', 4, 7, 'junior', '函数'),
  L('deep', 5, 8, 'junior', '函数'),
  L('other', 6, 9, 'junior', '方程'),
];

describe('suggestNext 难度自适应下一课', () => {
  it('高分（≥90%）推同模块更深的一课', () => {
    const r = suggestNext(lessons, cur, 1);
    expect(r?.lessonId).toBe('deep');
    expect(r?.reason).toContain('更深');
  });
  it('低分（<60%）推同模块更基础的课', () => {
    const r = suggestNext(lessons, cur, 0.5);
    expect(r?.lessonId).toBe('prev'); // 最接近且更低年级
    expect(r?.reason).toContain('基础');
  });
  it('中间分按学科顺序推下一课', () => {
    const r = suggestNext(lessons, cur, 0.75);
    expect(r?.lessonId).toBe('next');
    expect(r?.reason).toContain('下一课');
  });
  it('模块无同级更深时高分退化为顺序下一课', () => {
    const only = [L('basic', 1, 5, 'primary', '函数'), cur, L('next', 4, 7, 'junior', '函数')];
    const r = suggestNext(only, cur, 1);
    expect(r?.lessonId).toBe('next');
  });
  it('无课标模块时退化为同学科匹配', () => {
    const noMod = [L('a', 1, 7, 'junior'), L('now2', 2, 7, 'junior'), L('b', 3, 8, 'junior')];
    const r = suggestNext(noMod, noMod[1], 1);
    expect(r?.lessonId).toBe('b');
  });
  it('空课程表返回 null', () => {
    expect(suggestNext([], cur, 1)).toBeNull();
  });
});
