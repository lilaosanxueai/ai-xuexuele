import { describe, expect, it } from 'vitest';
import { buildShareStats } from './shareCard.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const mk = (id: string, area: string): Lesson => ({
  id, island: 'cross', order: 1, title: id, emoji: '📘', story: '', goals: [],
  toolbox: [], actor: { costume: '🤖', x: 0, y: 0 }, tasks: [], aiIntro: '', celebrate: '',
  subjectArea: area,
});

const today = new Date();
const key = (off: number) => { const d = new Date(today); d.setDate(d.getDate() - off); return d.toISOString().slice(0, 10); };

const mkProgress = (patch: Partial<ProfileProgress> = {}): ProfileProgress => ({
  profileId: 'p1', lessons: {}, dailyUsage: { [key(0)]: 30, [key(1)]: 60 }, lessonDrafts: {}, lessonCodes: {},
  ...patch,
});

describe('buildShareStats 分享卡片统计', () => {
  const lessons = [mk('a', '数学'), mk('b', '数学'), mk('c', '英语')];

  it('空档案给出零值与新手称号', () => {
    const s = buildShareStats(lessons, null, { name: '小明', avatar: '🦊' });
    expect(s.name).toBe('小明');
    expect(s.title).toContain('新手');
    expect(s.lessonsDone).toBe(0);
    expect(s.totalLessons).toBe(3);
    expect(s.bestSubject).toBe('—');
  });

  it('完成课数决定称号档位', () => {
    const lessons20 = Array.from({ length: 20 }, (_, i) => mk(`l${i}`, '科学'));
    const done = Object.fromEntries(lessons20.map((l) => [l.id, { status: 'completed' as const, tasks: {} }]));
    const s = buildShareStats(lessons20, mkProgress({ lessons: done }), { name: 'x', avatar: '⭐' });
    expect(s.lessonsDone).toBe(20);
    expect(s.title).toContain('学习小达人');
  });

  it('连续天数与总分钟按 dailyUsage 汇总', () => {
    const s = buildShareStats(lessons, mkProgress(), { name: 'x', avatar: '⭐' });
    expect(s.streak).toBeGreaterThanOrEqual(2);
    expect(s.totalMinutes).toBe(90);
  });

  it('最强学科按练习正确率聚合且低于5题不参评', () => {
    const lessons5 = Array.from({ length: 5 }, (_, i) => mk(`m${i}`, '数学'));
    const p = mkProgress({
      exercises: {
        m0: { correct: 4, total: 5 }, m1: { correct: 5, total: 5 },
        m2: { correct: 4, total: 5 }, m3: { correct: 4, total: 5 }, m4: { correct: 4, total: 5 },
        a: { correct: 1, total: 1 }, // 不足5题，不该当最强学科
      },
    });
    const s = buildShareStats(lessons5, p, { name: 'x', avatar: '⭐' });
    expect(s.bestSubject).toBe('数学');
    expect(s.bestAccuracy).toBe(84);
  });

  it('徽章数与错题统计透传', () => {
    const p = mkProgress({
      wrongCleared: 7,
      wrongBook: [{ id: 'a#0', lessonId: 'a', lessonTitle: 't', subjectArea: '数学', q: 'q', options: [], answer: 0, explain: '', wrongPicks: [1], times: 1, lastWrongAt: today.toISOString() }],
    });
    const s = buildShareStats(lessons, p, { name: 'x', avatar: '⭐' });
    expect(s.wrongCleared).toBe(7);
    expect(s.wrongPending).toBe(1);
    expect(s.badgesTotal).toBeGreaterThan(0);
    expect(s.badgesUnlocked).toBeGreaterThanOrEqual(0);
  });
});
