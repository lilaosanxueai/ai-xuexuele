import { describe, expect, it } from 'vitest';
import { comboWord, gradeResult, sampleQuestions, scoreFor } from './challenge.ts';
import type { Lesson } from '@shared/types.ts';

const mkLesson = (id: string, subject: string, band: 'primary' | 'junior' | 'senior', nEx = 3): Lesson => ({
  id, island: 'cross', order: 1, title: '课' + id, emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: subject, gradeBand: band, grade: 3, textbook: '测试',
  exercises: Array.from({ length: nEx }, (_, i) => ({ q: `${id}题${i}`, options: ['A', 'B', 'C', 'D'], answer: 0, explain: '解析' })),
});

describe('sampleQuestions 抽样', () => {
  it('按学科和学段过滤，每课最多 1 题，总量受限', () => {
    const lessons = [mkLesson('a', '数学', 'primary'), mkLesson('b', '数学', 'junior'), mkLesson('c', '语文', 'primary')];
    const qs = sampleQuestions(lessons, { subject: '数学', count: 10 });
    expect(qs).toHaveLength(2);
    expect(qs.every((q) => q.subjectArea === '数学')).toBe(true);
    const ids = qs.map((q) => q.lessonId);
    expect(new Set(ids).size).toBe(ids.length); // 无重复课
  });
  it('题面字段完整可作答', () => {
    const qs = sampleQuestions([mkLesson('x', '科学', 'primary')], { count: 5 });
    expect(qs.length).toBe(1);
    const q = qs[0];
    expect(q.options).toHaveLength(4);
    expect(q.answer).toBe(0);
    expect(q.q.startsWith('x题')).toBe(true);
    expect(q.explain).toBe('解析');
  });
  it('无题可抽时返回空数组', () => {
    expect(sampleQuestions([], { count: 10 })).toHaveLength(0);
    expect(sampleQuestions([mkLesson('y', '音乐', 'senior')], { subject: '数学' })).toHaveLength(0);
  });
});

describe('scoreFor 连击计分', () => {
  it('首题 10 分，连击逐级加成并封顶', () => {
    expect(scoreFor(1)).toBe(10);
    expect(scoreFor(2)).toBe(12);
    expect(scoreFor(6)).toBe(20); // 10 + 5*2
    expect(scoreFor(50)).toBe(20); // 封顶 +10
  });
  it('非正连击按基础分', () => {
    expect(scoreFor(0)).toBe(10);
  });
});

describe('gradeResult 评级', () => {
  it('全对封王，梯度称号', () => {
    expect(gradeResult(10, 10, 200).title).toBe('全对擂主');
    expect(gradeResult(8, 10, 150).title).toBe('学科达人');
    expect(gradeResult(6, 10, 100).title).toBe('实力战将');
    expect(gradeResult(4, 10, 70).title).toBe('顽强新兵');
    expect(gradeResult(2, 10, 40).title).toBe('越挫越勇');
  });
  it('零题不崩溃', () => {
    expect(gradeResult(0, 0, 0).emoji).toBe('💪');
  });
});

describe('comboWord 连击文案', () => {
  it('3/6/9 连击换档，低连击为空', () => {
    expect(comboWord(1)).toBe('');
    expect(comboWord(3)).toContain('手感');
    expect(comboWord(6)).toContain('如虹');
    expect(comboWord(9)).toContain('神了');
  });
});
