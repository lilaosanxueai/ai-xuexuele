import { describe, expect, it } from 'vitest';
import { buildUniverse, universeWeakSpots } from './knowledgeUniverse.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const L = (o: { id: string; subject: string; module: string; points: string[]; order: number }): Lesson => ({
  id: o.id, order: o.order, title: o.id, emoji: '📘', story: '', goals: [],
  toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: o.subject, curriculum: { module: o.module, points: o.points }, island: 'cross',
} as unknown as Lesson);

const progress = (done: string[], acc: Record<string, { correct: number; total: number }> = {}): ProfileProgress => ({
  profileId: 'p',
  lessons: Object.fromEntries(done.map((id) => [id, { status: 'completed' as const, tasks: {} }])),
  dailyUsage: {}, lessonDrafts: {}, lessonCodes: {},
  exercises: acc,
});

const data = [
  L({ id: 'a1', subject: '物理', module: '波', points: ['波的传播', '波长'], order: 1 }),
  L({ id: 'a2', subject: '物理', module: '波', points: ['波的传播'], order: 2 }),
  L({ id: 'b1', subject: '音乐', module: '声学', points: ['声音的产生'], order: 3 }),
  L({ id: 'c1', subject: '数学', module: '函数', points: ['函数概念'], order: 4 }),
  L({ id: 'd1', subject: '数学', module: '函数', points: ['函数概念', '函数图像'], order: 5 }),
];

describe('buildUniverse 知识宇宙', () => {
  it('同学科同模块合为一个节点', () => {
    const g = buildUniverse(data, null);
    const wave = g.nodes.find((n) => n.id === '物理·波');
    expect(wave).toBeDefined();
    expect(wave!.count).toBe(2);
    expect(g.nodes.length).toBe(3); // 物理·波 / 音乐·声学 / 数学·函数
  });

  it('跨学科共享关键词才连线·同学科不连', () => {
    const g = buildUniverse([data[0], data[2], data[3]], null); // 物理·波 / 音乐·声学 / 数学·函数（互不共享）
    expect(g.edges.length).toBe(0);
  });

  it('掌握度与完成数来自 progress', () => {
    const p = progress(['a1', 'a2', 'c1'], { a1: { correct: 3, total: 6 }, a2: { correct: 6, total: 6 } });
    const g = buildUniverse(data, p);
    const wave = g.nodes.find((n) => n.id === '物理·波')!;
    expect(wave.doneCount).toBe(2);
    expect(wave.accuracy).toBe(75); // (50+100)/2
    const fn = g.nodes.find((n) => n.id === '数学·函数')!;
    expect(fn.doneCount).toBe(1);
    expect(fn.accuracy).toBeNull(); // c1 无练习记录·d1 无
  });

  it('确定性布局：同输入同输出·坐标在画布内', () => {
    const g1 = buildUniverse(data, null);
    const g2 = buildUniverse(data, null);
    expect(g1.nodes.map((n) => [n.x, n.y])).toEqual(g2.nodes.map((n) => [n.x, n.y]));
    for (const n of g1.nodes) {
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.x).toBeLessThanOrEqual(1000);
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeLessThanOrEqual(780);
    }
  });

  it('连线总量受 maxEdges 约束', () => {
    const many: Lesson[] = [];
    for (let s = 0; s < 10; s++) {
      for (let m = 0; m < 5; m++) {
        many.push(L({ id: `s${s}m${m}`, subject: `科${s}`, module: `模块${m}`, points: ['共享概念'], order: s * 10 + m }));
      }
    }
    const g = buildUniverse(many, null, { maxEdges: 20, maxPerNode: 2 });
    expect(g.edges.length).toBeLessThanOrEqual(20);
    const degree = new Map<string, number>();
    for (const e of g.edges) {
      degree.set(e.a, (degree.get(e.a) ?? 0) + 1);
      degree.set(e.b, (degree.get(e.b) ?? 0) + 1);
    }
    for (const d of degree.values()) expect(d).toBeLessThanOrEqual(2);
  });

  it('学科统计：完成数/完成率/平均正确率聚合', () => {
    const p = progress(['a1', 'a2', 'c1'], { a1: { correct: 6, total: 6 }, a2: { correct: 3, total: 6 } });
    const g = buildUniverse(data, p);
    const phy = g.subjects.find((s) => s.subject === '物理')!;
    expect(phy.done).toBe(2);
    expect(phy.doneRatio).toBe(1);
    expect(phy.accuracy).toBe(75);
    const math = g.subjects.find((s) => s.subject === '数学')!;
    expect(math.done).toBe(1);
    expect(math.doneRatio).toBeCloseTo(0.5);
    expect(math.accuracy).toBeNull(); // 无练习记录
  });

  it('薄弱星云：低正确率模块入选并推荐未完成课', () => {
    const p = progress([], { a1: { correct: 2, total: 6 } }); // 物理·波 ≈33%
    const g = buildUniverse(data, p);
    const weak = universeWeakSpots(g, data, p);
    expect(weak.length).toBe(1); // 其余模块课数 <3 又无低正确率
    expect(weak[0]!.id).toBe('物理·波');
    expect(weak[0]!.accuracy).toBe(33);
    expect(weak[0]!.lessonId).toBe('a1'); // 未完成的按顺序第一节
    expect(weak[0]!.reason).toContain('33%');
  });

  it('薄弱星云：全完成但薄弱时推荐正确率最低的一课', () => {
    const p = progress(['a1', 'a2'], { a1: { correct: 1, total: 6 }, a2: { correct: 5, total: 6 } });
    const g = buildUniverse(data, p);
    const weak = universeWeakSpots(g, data, p);
    expect(weak[0]!.id).toBe('物理·波');
    expect(weak[0]!.lessonId).toBe('a1'); // 两课全完成 → 挑正确率最低的 a1
  });

  it('薄弱星云：≥3 课全暗的大模块入选·健康模块不入·限量', () => {
    const big = [1, 2, 3].map((i) => L({ id: `x${i}`, subject: '科学', module: '地球', points: ['地球结构'], order: 10 + i }));
    const strong = [1, 2].map((i) => L({ id: `y${i}`, subject: '历史', module: '唐朝', points: ['盛唐气象'], order: 20 + i }));
    const p = progress(['y1', 'y2'], { y1: { correct: 6, total: 6 }, y2: { correct: 6, total: 6 } });
    const lessons = [...data, ...big, ...strong];
    const g = buildUniverse(lessons, p);
    const weak = universeWeakSpots(g, lessons, p);
    const ids = weak.map((w) => w.id);
    expect(ids).toContain('科学·地球'); // 3 课全暗
    expect(ids).not.toContain('历史·唐朝'); // 全完成 + 100%
    expect(weak.find((w) => w.id === '科学·地球')!.lessonId).toBe('x1'); // 从第一节点亮
    expect(weak.length).toBeLessThanOrEqual(6); // 默认限量
  });
});
