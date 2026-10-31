import { describe, expect, it } from 'vitest';
import { BADGES, computeBadges } from './achievements.ts';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

const L = (id: string, subject: string, module: string, order: number): Lesson => ({
  id, order, title: id, emoji: '📘', story: '', goals: [],
  toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: subject, curriculum: { module, points: [] }, island: 'cross',
} as unknown as Lesson);

const p = (done: string[], ex: Record<string, { correct: number; total: number }> = {}): ProfileProgress => ({
  profileId: 'p',
  lessons: Object.fromEntries(done.map((id) => [id, { status: 'completed' as const, tasks: {} }])),
  dailyUsage: {}, lessonDrafts: {}, lessonCodes: {}, exercises: ex,
});

describe('宇宙徽章（星图统计）', () => {
  it('点亮模块数 = 练过随堂练的 学科×模块 数', () => {
    const lessons = [
      L('a', '数学', '函数', 1), L('b', '数学', '几何', 2), L('c', '物理', '波', 3),
    ];
    const b = computeBadges(lessons, p([], { a: { correct: 1, total: 6 }, b: { correct: 2, total: 6 } }));
    expect(b.find((x) => x.id === 'star-lit-10')!.cur).toBe(2);
    expect(b.find((x) => x.id === 'star-lit-50')!.cur).toBe(2);
  });

  it('满贯星系：≥2 课的模块全部完成才计数', () => {
    const lessons = [
      L('a', '数学', '函数', 1), L('b', '数学', '函数', 2), // 函数 2 课全完成 → 计 1
      L('c', '物理', '波', 3), L('d', '物理', '波', 4), // 波 2 课只完成 1 → 不计
    ];
    const b = computeBadges(lessons, p(['a', 'b', 'c']));
    expect(b.find((x) => x.id === 'galaxy-master-5')!.cur).toBe(1);
  });

  it('十星巡礼：有完成课的学科数', () => {
    const lessons = [L('a', '数学', '函数', 1), L('b', '物理', '波', 2)];
    const b = computeBadges(lessons, p(['a', 'b']));
    expect(b.find((x) => x.id === 'ten-galaxies')!.cur).toBe(2);
  });

  it('全部徽章都有 cur 映射（新增徽章防漏配）', () => {
    const b = computeBadges([L('a', '数学', '函数', 1)], p([]));
    expect(b.length).toBe(BADGES.length);
    for (const bd of BADGES) {
      const st = b.find((x) => x.id === bd.id);
      expect(st, bd.id).toBeDefined();
      expect(typeof st!.cur).toBe('number');
    }
  });
});
