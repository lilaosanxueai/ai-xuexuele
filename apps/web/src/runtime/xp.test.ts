import { describe, expect, it } from 'vitest';
import { levelFor, xpForLevel, xpForQuiz } from './xp.ts';

describe('levelFor 等级曲线', () => {
  it('0 XP 是 1 级见习学员', () => {
    const l = levelFor(0);
    expect(l.level).toBe(1);
    expect(l.title).toBe('见习学员');
    expect(l.progress).toBe(0);
  });
  it('一级需求 50 XP（40+10×1）', () => {
    expect(xpForLevel(1)).toBe(50);
    const l = levelFor(50);
    expect(l.level).toBe(2);
  });
  it('中段等级正确累计', () => {
    const total = xpForLevel(1) + xpForLevel(2) + xpForLevel(3); // 50+60+70=180
    expect(levelFor(total).level).toBe(4);
    expect(levelFor(total - 1).level).toBe(3);
  });
  it('称号每 5 级晋升', () => {
    expect(levelFor(0).title).toBe('见习学员');
    expect(levelFor(1000).level).toBeGreaterThan(3);
  });
});

describe('xpForQuiz 小练结算', () => {
  it('全对 4 题：4×10+20+5=65', () => {
    expect(xpForQuiz(4, 4)).toBe(65);
  });
  it('有错有基础分与完成分', () => {
    expect(xpForQuiz(2, 4)).toBe(25);
    expect(xpForQuiz(0, 4)).toBe(5);
  });
  it('零题不发放', () => {
    expect(xpForQuiz(0, 0)).toBe(0);
  });
});
