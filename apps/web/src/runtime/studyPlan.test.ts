import { describe, expect, it } from 'vitest';
import { collectModules, generateStudyPlan, todayModules } from './studyPlan.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const mk = (id: string, mod: string): Lesson => ({
  id, island: 'cross', order: 1, title: id, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: '数学', gradeBand: 'junior', grade: 7, textbook: '测试', curriculum: { module: mod, stage: 's', points: ['p'] },
  exercises: [{ q: 'q', options: ['a', 'b', 'c', 'd'], answer: 0, explain: 'e' }],
});
const progress = (ex: Record<string, { correct: number; total: number }>): ProfileProgress => ({
  profileId: 'p', lessons: {}, dailyUsage: {}, lessonDrafts: {}, lessonCodes: {}, exercises: ex,
});

describe('collectModules 模块收集', () => {
  it('聚合模块并计算平均掌握度；无数据的模块为 null', () => {
    const lessons = [mk('a', '函数'), mk('b', '函数'), mk('c', '几何')];
    const mods = collectModules(lessons, progress({ a: { correct: 6, total: 6 }, b: { correct: 3, total: 6 } }));
    expect(mods).toHaveLength(2);
    const fn = mods.find((m) => m.module === '函数')!;
    expect(fn.mastery).toBe(75); // (100+50)/2
    expect(fn.lessonCount).toBe(2);
    expect(mods.find((m) => m.module === '几何')!.mastery).toBeNull();
  });
});

describe('generateStudyPlan 计划生成', () => {
  const mods = [
    { module: '强模块', mastery: 95, lessonCount: 3 },
    { module: '弱模块', mastery: 40, lessonCount: 3 },
    { module: '无数据', mastery: null, lessonCount: 3 },
  ];
  it('覆盖指定天数且每天都至少有一个模块', () => {
    const plan = generateStudyPlan(mods, 7);
    expect(plan.days).toBe(7);
    expect(plan.schedule.length).toBe(7);
    for (const d of plan.schedule) expect(d.modules.length).toBeGreaterThanOrEqual(1);
  });
  it('最薄弱的模块出现在第一天', () => {
    const plan = generateStudyPlan(mods, 7);
    expect(plan.schedule[0].modules).toContain('无数据');
  });
  it('强模块出现次数不多于弱模块', () => {
    const plan = generateStudyPlan(mods, 14);
    const count = (name: string) => plan.schedule.filter((d) => d.modules.includes(name)).length;
    expect(count('弱模块')).toBeGreaterThanOrEqual(count('强模块'));
    expect(count('无数据')).toBeGreaterThanOrEqual(count('强模块'));
  });
  it('空模块或 0 天返回空计划', () => {
    expect(generateStudyPlan([], 7).schedule).toHaveLength(0);
    expect(generateStudyPlan(mods, 0).schedule).toHaveLength(0);
  });
});

describe('todayModules 今日模块', () => {
  it('计划当天返回模块，越界返回空', () => {
    const plan = { createdAt: new Date().toISOString(), days: 3, schedule: [{ day: 1, modules: ['A'] }, { day: 2, modules: ['B'] }] };
    expect(todayModules(plan)).toEqual(['A']);
    expect(todayModules(null)).toEqual([]);
    const old = { ...plan, createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString() };
    expect(todayModules(old)).toEqual([]);
  });
});
