import { describe, expect, it } from 'vitest';
import { buildWeeklyCardStats, wrapComment } from './shareCard.ts';
import type { WeeklyReport } from './weeklyReport.ts';

const report: WeeklyReport = {
  totalMinutes: 95, activeDays: 4, streak: 3,
  dayBars: [], lessonsDone: [{ title: '浮力', emoji: '🌊' }, { title: '心流', emoji: '🌊' }],
  subjectStats: [
    { subject: '数学', correct: 40, total: 50, accuracy: 80 },
    { subject: '语文', correct: 20, total: 25, accuracy: 80 },
    { subject: '英语', correct: 2, total: 2, accuracy: 100 }, // 题数<3 的过滤
    { subject: '物理', correct: 5, total: 10, accuracy: 50 },
  ],
  weakLessons: [], headline: '本周学了 95 分钟，去随堂小练里测一测 📝',
};

describe('wrapComment 评语折行', () => {
  it('按每行字数折行，空白归一', () => {
    expect(wrapComment('abcdef', 3)).toEqual(['abc', 'def']);
    expect(wrapComment('a  b\nc', 5)).toEqual(['a b c']);
  });
  it('超长截断并加省略号', () => {
    const out = wrapComment('x'.repeat(100), 20, 4);
    expect(out).toHaveLength(4);
    expect(out[3].endsWith('…')).toBe(true);
    expect(out[3].length).toBe(20);
  });
  it('空串返回空数组', () => {
    expect(wrapComment('   ')).toEqual([]);
  });
});

describe('buildWeeklyCardStats 周报卡数据', () => {
  const now = new Date('2026-10-06T12:00:00Z');
  it('日期区间为过去7天，delta 透传，评语缺省用 headline', () => {
    const s = buildWeeklyCardStats({ name: '小明', avatar: '🚀' }, report, { minutes: 25, activeDays: 1, lessons: 2 }, null, now);
    expect(s.dateRange).toBe('09.30 - 10.06');
    expect(s.delta.minutes).toBe(25);
    expect(s.commentSource).toBe('headline');
    expect(s.comment).toContain('95 分钟');
  });
  it('学科条过滤题数<3 的，最多4条', () => {
    const s = buildWeeklyCardStats({ name: 'a', avatar: 'b' }, report, { minutes: 0, activeDays: 0, lessons: 0 }, '评语文本', now);
    expect(s.subjects.map((x) => x.subject)).toEqual(['数学', '语文', '物理']);
    expect(s.commentSource).toBe('llm');
  });
});
