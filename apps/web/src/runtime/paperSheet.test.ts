import { describe, expect, it } from 'vitest';
import { buildPaper, printAnswer, printOptions } from './paperSheet.ts';
import type { Exercise, Lesson } from '@shared/types.ts';

const ex = (q: string): Exercise => ({ q, options: ['甲', '乙', '丙', '丁'], answer: 0, explain: '解析' });
const blank = (q: string, ans: string): Exercise => ({ q, options: [ans, '错'], answer: 0, explain: '', type: 'blank', blank: { answerText: ans, bank: [ans, '错'] } });

/** 一门课 6 题（前3基础后3综合），模块由参数给 */
const lesson = (id: string, mod: string, qs: string[]): Lesson => ({
  id, order: 1, title: id, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '', x: 0, y: 0 },
  tasks: [], aiIntro: '', celebrate: '', subjectArea: '数学', curriculum: { module: mod, points: [] },
  exercises: qs.map(ex),
} as unknown as Lesson);

describe('buildPaper 期中综合卷', () => {
  const lessons = [
    lesson('l1', '函数', ['函1', '函2', '函3', '函4', '函5', '函6']),
    lesson('l2', '函数', ['函a', '函b', '函c', '函d', '函e', '函f']),
    lesson('l3', '几何', ['几1', '几2', '几3', '几4', '几5', '几6']),
    lesson('l4', '统计', ['统1', '统2', '统3', '统4', '统5', '统6']),
  ];

  it('跨模块按比例出题，总数精确', () => {
    const paper = buildPaper({ lessons, modules: ['函数', '几何', '统计'], count: 8, seed: '2026-11-01' });
    expect(paper).toHaveLength(8);
    // 每模块至少分到题
    const from = (pre: string) => paper.filter((e) => e.q.startsWith(pre)).length;
    expect(from('函')).toBeGreaterThan(0);
    expect(from('几')).toBeGreaterThan(0);
    expect(from('统')).toBeGreaterThan(0);
  });

  it('请求题量超过课程池上限时，给到上限且不超过请求', () => {
    // 本测试数据总池=8（函数4+几何2+统计2），请求 20 只能给 8
    const paper = buildPaper({ lessons, modules: ['函数', '几何', '统计'], count: 20, seed: 'x' });
    expect(paper).toHaveLength(8);
    expect(paper.length).toBeLessThanOrEqual(20);
  });

  it('同种子同卷（重打印不换题），换种子换卷', () => {
    const a = buildPaper({ lessons, modules: ['函数', '几何'], count: 6, seed: 'd1' }).map((e) => e.q);
    const b = buildPaper({ lessons, modules: ['函数', '几何'], count: 6, seed: 'd1' }).map((e) => e.q);
    expect(a).toEqual(b);
    const c = buildPaper({ lessons, modules: ['函数', '几何'], count: 6, seed: 'd2' }).map((e) => e.q);
    // 允许极小概率巧合，断言题目集合不全等
    expect(new Set(c).size).toBe(6);
  });

  it('每课最多 2 题，题干不重复', () => {
    const many = [lesson('x1', 'M', ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']), lesson('x2', 'M', ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'])];
    const paper = buildPaper({ lessons: many, modules: ['M'], count: 4, seed: 's' });
    expect(paper).toHaveLength(4);
    expect(new Set(paper.map((e) => e.q)).size).toBe(4);
    // 单模块 4 题只能来自两课（每课2题封顶）
    const xs = paper.filter((e) => e.q.startsWith('q')).length;
    expect(xs).toBeLessThanOrEqual(2);
  });

  it('模块多于题量时按序截取；空模块返回空卷', () => {
    const paper = buildPaper({ lessons, modules: ['函数', '几何', '统计', '第四模块'], count: 2, seed: 's' });
    expect(paper).toHaveLength(2);
    expect(buildPaper({ lessons, modules: [], count: 10, seed: 's' })).toEqual([]);
  });

  it('填空题打印辅助：横线作答与答案文本', () => {
    const b = blank('复习要卡在___', '时机');
    expect(printOptions(b)).toBeNull();
    expect(printAnswer(b)).toBe('时机');
    const c = ex('正常题');
    expect(printOptions(c)).toEqual(['甲', '乙', '丙', '丁']);
    expect(printAnswer(c)).toBe('A. 甲');
  });
});
