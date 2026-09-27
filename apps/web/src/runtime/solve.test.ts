import { describe, expect, it } from 'vitest';
import { checkAnswer, eqText, generateEq, solveSteps } from './solve.ts';

describe('generateEq 出题', () => {
  it('生成的方程恒有整数解且满足定义', () => {
    for (let i = 0; i < 100; i++) {
      const e = generateEq('normal');
      expect(e.a - e.c).toBeGreaterThan(0);
      expect((e.d - e.b) % (e.a - e.c) + 0).toBe(0); // +0 归一化负零
      expect((e.d - e.b) / (e.a - e.c)).toBe(e.x);
      expect(Number.isInteger(e.x)).toBe(true);
    }
  });

  it('三档难度系数约束正确', () => {
    for (let i = 0; i < 30; i++) {
      expect(generateEq('easy').c).toBe(0);
      const n = generateEq('normal');
      expect(n.c).toBeGreaterThan(0);
      const h = generateEq('hard');
      expect(h.a - h.c).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('eqText 显示', () => {
  it('系数 1 与 0 正确省略', () => {
    expect(eqText({ a: 1, b: 0, c: 0, d: 3, x: 3 })).toBe('x = 3');
    expect(eqText({ a: 2, b: -5, c: 1, d: 4, x: 9 })).toBe('2x - 5 = x + 4');
    expect(eqText({ a: 3, b: 4, c: 0, d: 10, x: 2 })).toBe('3x + 4 = 10');
  });
});

describe('solveSteps 解题步骤', () => {
  it('标准三步且最后一步给出正确答案', () => {
    const e = { a: 2, b: -5, c: 1, d: 4, x: 9 };
    const steps = solveSteps(e);
    expect(steps.length).toBe(3);
    expect(steps[0].title).toContain('移项');
    expect(steps[0].text).toBe('2x - x = 4 + 5');
    expect(steps[1].text).toBe('x = 9');
    expect(steps[2].text).toContain('9');
  });

  it('移项过桥变号：负常数移过去变正', () => {
    const e = { a: 3, b: 4, c: 0, d: 10, x: 2 };
    const steps = solveSteps(e);
    expect(steps[0].text).toBe('3x = 10 - 4');
    expect(steps[1].text).toBe('3x = 6');
    expect(steps[2].text).toBe('x = 6 ÷ 3 = 2');
  });
});

describe('checkAnswer 判分', () => {
  it('数值相等判对（容忍空格小数）', () => {
    expect(checkAnswer(' 3 ', 3)).toBe(true);
    expect(checkAnswer('3.0', 3)).toBe(true);
    expect(checkAnswer('-2.5', -2.5)).toBe(true);
    expect(checkAnswer('4', 3)).toBe(false);
    expect(checkAnswer('abc', 3)).toBe(false);
  });
});
