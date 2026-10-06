import { describe, expect, it } from 'vitest';
import { offlineWeeklyComment, type WeeklySummary } from './weeklyComment.ts';

const now = new Date('2026-10-06T10:00:00Z');

const base: WeeklySummary = {
  totalMinutes: 120, activeDays: 3, streak: 2,
  lessonsDone: ['二次函数的图像'],
  subjectStats: [{ subject: '数学', accuracy: 82, correct: 41, total: 50 }],
  weakLessons: [],
};

describe('offlineWeeklyComment 周报评语', () => {
  it('高产档：写出分钟数与天数', () => {
    const c = offlineWeeklyComment({ ...base, totalMinutes: 240, activeDays: 6, name: '小明' }, now);
    expect(c).toContain('小明同学');
    expect(c).toContain('240');
    expect(c).toContain('6');
    expect(c.length).toBeGreaterThan(60);
  });

  it('有薄弱课时：点名课程与正确率，并给目标', () => {
    const c = offlineWeeklyComment({
      ...base,
      weakLessons: [{ title: '浮力', subject: '物理', accuracy: 45 }],
    }, now);
    expect(c).toContain('浮力');
    expect(c).toContain('45%');
    expect(c).toContain('物理');
  });

  it('零学习周：温和召回不开骂，目标具体', () => {
    const c = offlineWeeklyComment({ ...base, totalMinutes: 0, activeDays: 0, streak: 0, lessonsDone: [], subjectStats: [], weakLessons: [] }, now);
    expect(c).toContain('还没开始学习');
    expect(c).toContain('小目标');
  });

  it('亮点句：大幅进步或高分学科至少提一个', () => {
    const c1 = offlineWeeklyComment({ ...base, delta: { minutes: 45, activeDays: 1, lessons: 2 } }, now);
    expect(c1).toContain('比上周多学了 45 分钟');
    const c2 = offlineWeeklyComment({
      ...base,
      subjectStats: [{ subject: '英语', accuracy: 94, correct: 47, total: 50 }, { subject: '数学', accuracy: 70, correct: 21, total: 30 }],
    }, now);
    expect(c2).toContain('英语正确率 94%');
  });

  it('同一天数据稳定，不同日期可能轮换措辞', () => {
    const a = offlineWeeklyComment(base, now);
    const b = offlineWeeklyComment({ ...base }, new Date('2026-10-06T22:00:00Z'));
    expect(a).toBe(b);
    // 只保证不抛错、长度合理；措辞轮换是概率性行为
    const c = offlineWeeklyComment(base, new Date('2026-10-08T10:00:00Z'));
    expect(c.length).toBeGreaterThan(60);
  });
});
