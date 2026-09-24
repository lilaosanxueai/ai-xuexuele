import { describe, expect, it } from 'vitest';
import { buildMindmap, layoutMindmap } from './mindmap.ts';
import type { Lesson } from '@shared/types.ts';

const mkLesson = (over: Partial<Lesson>): Lesson => ({
  id: 'a', island: 'cross', order: 1, title: '测试课', emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: '数学', gradeBand: 'primary', grade: 3, textbook: '测试', ...over,
});

describe('buildMindmap', () => {
  it('从讲解章节+【】要点生成三级结构', () => {
    const l = mkLesson({
      teach: { sections: [
        { title: '什么是比', body: '【两个数相除叫比】\n普通句子。' },
        { title: '比的基本性质', body: '【前项后项同乘同除比值不变】【比的化简方法】' },
      ], examples: [], mistakes: [] },
    });
    const m = buildMindmap(l);
    expect(m.label).toBe('测试课');
    expect(m.children).toHaveLength(2);
    expect(m.children[0].children[0].label).toBe('两个数相除叫比');
    expect(m.children[1].children).toHaveLength(2);
  });
  it('无讲解时用课标知识点', () => {
    const l = mkLesson({ curriculum: { module: 'm', stage: 's', points: ['比例尺', '比例的应用'] } });
    const m = buildMindmap(l);
    expect(m.children.map((c) => c.label)).toEqual(['比例尺', '比例的应用']);
  });
  it('章节不足 6 个时补充未覆盖的课标点', () => {
    const l = mkLesson({
      curriculum: { module: 'm', stage: 's', points: ['电解池原理', '金属活动性', '实际应用'] },
      teach: { sections: [{ title: '电解', body: '【电解原理】' }], examples: [], mistakes: [] },
    });
    const m = buildMindmap(l);
    expect(m.children.length).toBeGreaterThan(1);
    expect(m.children.some((c) => c.label === '金属活动性')).toBe(true);
  });
});

describe('layoutMindmap', () => {
  it('根居中且一级分两列', () => {
    const root = { label: 'R', children: [
      { label: 'A', children: [{ label: 'a1', children: [] }] },
      { label: 'B', children: [] },
      { label: 'C', children: [] },
    ] };
    const laid = layoutMindmap(root);
    expect(laid[0].x).toBe(0);
    expect(laid[0].y).toBe(0);
    const depth1 = laid.filter((n) => n.depth === 1);
    expect(depth1.some((n) => n.x < 0)).toBe(true);
    expect(depth1.some((n) => n.x > 0)).toBe(true);
    const depth2 = laid.filter((n) => n.depth === 2);
    expect(depth2.length).toBe(1);
    expect(depth2[0].parent).toBeDefined();
  });
  it('空子节点返回仅根', () => {
    const laid = layoutMindmap({ label: 'Solo', children: [] });
    expect(laid).toHaveLength(1);
    expect(laid[0].label).toBe('Solo');
  });
});
