import { describe, expect, it } from 'vitest';
import { computeWeeklyRecap } from './weeklyRecap.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const lesson = (id: string, title: string): Lesson => ({
  id, order: 1, title, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '', x: 0, y: 0 },
  tasks: [], aiIntro: '', celebrate: '', subjectArea: '数学',
} as unknown as Lesson);

const now = new Date('2026-10-06T10:00:00Z');
const iso = (d: Date) => d.toISOString().slice(0, 10);
const dayAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

describe('computeWeeklyRecap 本周高光', () => {
  const wed = new Date(now); wed.setDate(wed.getDate() - 3);
  const progress = {
    lessons: {
      'a': { status: 'completed', completedAt: dayAgo(1) },
      'b': { status: 'completed', completedAt: dayAgo(2) },
      'old': { status: 'completed', completedAt: dayAgo(20) }, // 上上周，不算
      'doing': { status: 'in_progress' }, // 未完成，不算
    },
    exercises: { 'a': { correct: 9, total: 10 }, 'b': { correct: 5, total: 10 } },
    dailyUsage: { [iso(wed)]: 30, [iso(now)]: 10 },
  } as unknown as ProfileProgress;

  it('只统计 7 天内完成的课，正确率随行', () => {
    const r = computeWeeklyRecap([lesson('a', '浮力'), lesson('b', '心流'), lesson('old', '旧课')], progress, now);
    expect(r.lessons.map((l) => l.id).sort()).toEqual(['a', 'b']);
    expect(r.lessons.find((l) => l.id === 'a')?.accuracy).toBe(90);
    expect(r.lessons.find((l) => l.id === 'b')?.accuracy).toBe(50);
  });

  it('高光课取正确率最高的一节', () => {
    const r = computeWeeklyRecap([lesson('a', '浮力'), lesson('b', '心流')], progress, now);
    expect(r.bestLesson?.id).toBe('a');
    expect(r.bestLesson?.accuracy).toBe(90);
  });

  it('分钟/天数/连击来自近7天 usage', () => {
    const r = computeWeeklyRecap([], progress, now);
    expect(r.totalMinutes).toBe(40);
    expect(r.activeDays).toBe(2);
    expect(r.streak).toBe(1); // 今天有记录，昨天无
  });

  it('庆祝语分档：高产带数字，零周给种子句', () => {
    const rich = computeWeeklyRecap([lesson('a', 'x')], progress, now);
    expect(rich.headline).toContain('完成');
    const empty = computeWeeklyRecap([], { lessons: {}, exercises: {}, dailyUsage: {} } as unknown as ProfileProgress, now);
    expect(empty.headline).toContain('第一课');
    expect(empty.lessons).toEqual([]);
    expect(empty.bestLesson).toBeNull();
  });

  it('连击 ≥3 天时庆祝语带连击', () => {
    const usage: Record<string, number> = {};
    for (let i = 0; i < 4; i++) { const d = new Date(now); d.setDate(d.getDate() - i); usage[iso(d)] = 15; }
    const r = computeWeeklyRecap([], { lessons: {}, exercises: {}, dailyUsage: usage } as unknown as ProfileProgress, now);
    expect(r.streak).toBe(4);
    expect(r.headline).toContain('连续 4 天');
  });
});
