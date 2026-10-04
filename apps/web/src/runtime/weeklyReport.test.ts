import { describe, expect, it } from 'vitest';
import { computeWeeklyReport, weekDelta } from './weeklyReport.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const lesson = (id: string, completedAt?: string): Lesson => ({
  id, order: 1, title: id, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '', x: 0, y: 0 },
  tasks: [], aiIntro: '', celebrate: '', subjectArea: '数学',
} as unknown as Lesson);

const key = (d: Date) => d.toISOString().slice(0, 10);

describe('computeWeeklyReport weekOffset', () => {
  const now = new Date('2026-10-07T10:00:00Z');
  // 本周三 / 上周三各学 20 分钟
  const wed = new Date(now); wed.setDate(wed.getDate() - 4);
  const lastWed = new Date(now); lastWed.setDate(lastWed.getDate() - 11);
  const progress = {
    dailyUsage: { [key(wed)]: 20, [key(lastWed)]: 40 },
    lessons: {
      'a': { status: 'completed', completedAt: new Date(now.getTime() - 86400000).toISOString() }, // 昨天=本周
      'b': { status: 'completed', completedAt: new Date(now.getTime() - 10 * 86400000).toISOString() }, // 上周
    },
  } as unknown as ProfileProgress;
  const lessons = [lesson('a'), lesson('b')];

  it('offset=0 统计本周窗口', () => {
    const r = computeWeeklyReport(lessons, progress, now, 0);
    expect(r.totalMinutes).toBe(20);
    expect(r.activeDays).toBe(1);
    expect(r.lessonsDone.map((l) => l.title)).toEqual(['a']);
  });

  it('offset=1 统计上周窗口', () => {
    const r = computeWeeklyReport(lessons, progress, now, 1);
    expect(r.totalMinutes).toBe(40);
    expect(r.activeDays).toBe(1);
    expect(r.lessonsDone.map((l) => l.title)).toEqual(['b']);
  });

  it('weekDelta：本周减上周，正负都算得对', () => {
    const cur = computeWeeklyReport(lessons, progress, now, 0);
    const prev = computeWeeklyReport(lessons, progress, now, 1);
    const d = weekDelta(cur, prev);
    expect(d.minutes).toBe(-20);
    expect(d.lessons).toBe(0);
    expect(d.activeDays).toBe(0);
  });

  it('无数据时 delta 全为 0', () => {
    const empty = { dailyUsage: {}, lessons: {} } as unknown as ProfileProgress;
    const d = weekDelta(
      computeWeeklyReport([], empty, now, 0),
      computeWeeklyReport([], empty, now, 1),
    );
    expect(d).toEqual({ minutes: 0, activeDays: 0, lessons: 0 });
  });
});
