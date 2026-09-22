import { describe, expect, it } from 'vitest';
import { computeBadges, EMPTY_RECORDS, readRecords, streakFrom, bumpRecords } from './achievements.ts';
import { computeWeeklyReport } from './weeklyReport.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const mkLesson = (id: string, subject: string, withLab = false): Lesson => ({
  id, island: 'cross', order: 1, title: id, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: subject, gradeBand: 'primary', grade: 3, textbook: '测试',
  ...(withLab ? { lab: { params: [], code: 'hide()' } } : {}),
});

const mkProgress = (patch: Partial<ProfileProgress> = {}): ProfileProgress => ({
  profileId: 'p1', lessons: {}, dailyUsage: {}, lessonDrafts: {}, lessonCodes: {}, ...patch,
});

describe('streakFrom 连续天数', () => {
  it('当天没学不打断，从昨天起算', () => {
    const today = new Date();
    const y = new Date(); y.setDate(y.getDate() - 1);
    const d2 = new Date(); d2.setDate(d2.getDate() - 2);
    const usage = { [y.toISOString().slice(0, 10)]: 10, [d2.toISOString().slice(0, 10)]: 5 };
    expect(streakFrom(usage)).toBe(2);
    void today;
  });
  it('今天学了计入', () => {
    const usage = { [new Date().toISOString().slice(0, 10)]: 8 };
    expect(streakFrom(usage)).toBe(1);
  });
  it('空记录为 0', () => {
    expect(streakFrom({})).toBe(0);
  });
});

describe('computeBadges 成就徽章', () => {
  it('零进度时全部锁定但初出茅庐显示 0/1', () => {
    const badges = computeBadges([mkLesson('a', '数学')], mkProgress());
    expect(badges.every((b) => !b.unlocked)).toBe(true);
    expect(badges.find((b) => b.id === 'first-lesson')!.cur).toBe(0);
  });
  it('完成 1 课解锁初出茅庐', () => {
    const lessons = [mkLesson('a', '数学'), mkLesson('b', '语文')];
    const p = mkProgress({ lessons: { a: { status: 'completed', tasks: {} } } });
    const badges = computeBadges(lessons, p);
    expect(badges.find((b) => b.id === 'first-lesson')!.unlocked).toBe(true);
    expect(badges.find((b) => b.id === 'ten-lessons')!.unlocked).toBe(false);
  });
  it('实验课计数只认带 lab 的完成课', () => {
    const lessons = [mkLesson('a', '物理', true), mkLesson('b', '物理')];
    const p = mkProgress({ lessons: { a: { status: 'completed', tasks: {} }, b: { status: 'completed', tasks: {} } } });
    const badges = computeBadges(lessons, p);
    expect(badges.find((b) => b.id === 'lab-20')!.cur).toBe(1);
  });
  it('满分与百题斩按练习记录计算', () => {
    const lessons = [mkLesson('a', '数学')];
    const p = mkProgress({ exercises: { a: { correct: 6, total: 6 } } });
    const badges = computeBadges(lessons, p);
    expect(badges.find((b) => b.id === 'perfect-quiz')!.unlocked).toBe(true);
    expect(badges.find((b) => b.id === 'hundred-correct')!.unlocked).toBe(false);
    expect(badges.find((b) => b.id === 'hundred-correct')!.cur).toBe(6);
  });
  it('5 学科足迹解锁五湖四海', () => {
    const lessons = ['数学', '语文', '英语', '物理', '化学'].map((s, i) => mkLesson('l' + i, s));
    const lessonsRec: ProfileProgress['lessons'] = {};
    for (let i = 0; i < 5; i++) lessonsRec['l' + i] = { status: 'completed', tasks: {} };
    const badges = computeBadges(lessons, mkProgress({ lessons: lessonsRec }));
    expect(badges.find((b) => b.id === 'five-subjects')!.unlocked).toBe(true);
  });
});

describe('成就 v2：游戏战绩徽章', () => {
  const lessons = [mkLesson('a', '数学')];
  it('零战绩时 5 枚新徽章全部锁定', () => {
    const badges = computeBadges(lessons, mkProgress(), EMPTY_RECORDS);
    for (const id of ['pairs-3', 'listen-ear', 'challenge-180', 'exam-90', 'weekly-goal-3']) {
      expect(badges.find((b) => b.id === id)!.unlocked).toBe(false);
    }
  });
  it('战绩达标各项点亮', () => {
    const rec = { pairsPlays: 3, listenPerfect: 1, challengeBest: 185, examBest: 92, weeklyGoalsMet: 3 };
    const badges = computeBadges(lessons, mkProgress(), rec);
    expect(badges.find((b) => b.id === 'pairs-3')!.unlocked).toBe(true);
    expect(badges.find((b) => b.id === 'listen-ear')!.unlocked).toBe(true);
    expect(badges.find((b) => b.id === 'challenge-180')!.unlocked).toBe(true);
    expect(badges.find((b) => b.id === 'exam-90')!.unlocked).toBe(true);
    expect(badges.find((b) => b.id === 'weekly-goal-3')!.unlocked).toBe(true);
  });
  it('readRecords 容错坏数据，bumpRecords 只取最大值', () => {
    expect(readRecords(null)).toEqual(EMPTY_RECORDS);
    expect(readRecords({ pairsPlays: 'x' }).pairsPlays).toBe(0);
    const prev = { ...EMPTY_RECORDS, challengeBest: 100, examBest: 80 };
    const next = bumpRecords(prev, { challengeBest: 60, examBest: 95, pairsPlays: 2 });
    expect(next.challengeBest).toBe(100); // 低分不清破纪录
    expect(next.examBest).toBe(95);
    expect(next.pairsPlays).toBe(2);
  });
});

describe('computeWeeklyReport 学情周报', () => {
  const now = new Date('2026-09-20T10:00:00');
  const dayKey = (offset: number) => {
    const d = new Date(now); d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10);
  };
  it('零数据给出鼓励文案与全零柱状图', () => {
    const r = computeWeeklyReport([], mkProgress(), now);
    expect(r.totalMinutes).toBe(0);
    expect(r.activeDays).toBe(0);
    expect(r.headline).toContain('还没开始');
    expect(r.dayBars).toHaveLength(7);
    expect(r.weakLessons).toHaveLength(0);
  });
  it('统计 7 天时长与活跃天数', () => {
    const usage = { [dayKey(0)]: 20, [dayKey(1)]: 30, [dayKey(3)]: 10 };
    const r = computeWeeklyReport([], mkProgress({ dailyUsage: usage }), now);
    expect(r.totalMinutes).toBe(60);
    expect(r.activeDays).toBe(3);
    expect(r.dayBars[6].minutes).toBe(20);
    expect(r.dayBars[6].label).toBe('周日');
  });
  it('正确率不足 70% 的课进入薄弱清单（升序前 3）', () => {
    const lessons = [mkLesson('a', '数学'), mkLesson('b', '语文'), mkLesson('c', '英语'), mkLesson('d', '物理')];
    const ex = { a: { correct: 1, total: 6 }, b: { correct: 2, total: 6 }, c: { correct: 3, total: 6 }, d: { correct: 5, total: 6 } };
    const r = computeWeeklyReport(lessons, mkProgress({ exercises: ex }), now);
    expect(r.weakLessons.map((w) => w.lessonId)).toEqual(['a', 'b', 'c']);
    expect(r.headline).toContain('先把它补上');
  });
  it('全对无弱课时 headline 提示状态良好', () => {
    const lessons = [mkLesson('a', '数学')];
    const r = computeWeeklyReport(lessons, mkProgress({ dailyUsage: { [dayKey(0)]: 15 }, exercises: { a: { correct: 6, total: 6 } } }), now);
    expect(r.weakLessons).toHaveLength(0);
    expect(r.headline).toContain('继续保持');
    expect(r.subjectStats[0].accuracy).toBe(100);
  });
  it('本周完成的课按 completedAt 计入', () => {
    const lessons = [mkLesson('a', '数学')];
    const old = new Date(now); old.setDate(old.getDate() - 20);
    const recent = new Date(now); recent.setDate(recent.getDate() - 2);
    const p = mkProgress({
      lessons: {
        old: { status: 'completed', tasks: {}, completedAt: old.toISOString() },
        a: { status: 'completed', tasks: {}, completedAt: recent.toISOString() },
      },
    });
    const r = computeWeeklyReport(lessons, p, now);
    expect(r.lessonsDone).toHaveLength(1);
    expect(r.lessonsDone[0].title).toBe('a');
  });
});
