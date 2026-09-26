import { describe, expect, it } from 'vitest';
import { atomCount, balanceTable, EQUATIONS, formulaParts, isBalanced, parseElements, sampleEquations } from './balance.ts';

describe('parseElements 化学式解析', () => {
  it('解析常见化学式', () => {
    expect(parseElements('H2O')).toEqual({ H: 2, O: 1 });
    expect(parseElements('O2')).toEqual({ O: 2 });
    expect(parseElements('Fe3O4')).toEqual({ Fe: 3, O: 4 });
    expect(parseElements('KMnO4')).toEqual({ K: 1, Mn: 1, O: 4 });
    expect(parseElements('C2H5OH')).toEqual({ C: 2, H: 6, O: 1 });
    expect(parseElements('Zn')).toEqual({ Zn: 1 });
  });
});

describe('atomCount / isBalanced / balanceTable', () => {
  const eq = EQUATIONS[0]; // H2 + O2 -> H2O, answer [2,1,2]

  it('系数为 1 时未配平', () => {
    expect(isBalanced(eq, [1, 1, 1])).toBe(false);
  });

  it('正确系数时配平', () => {
    expect(isBalanced(eq, eq.answer)).toBe(true);
  });

  it('atomCount 按元素累加', () => {
    expect(atomCount(eq.left, [2, 1])).toEqual({ H: 4, O: 2 });
    expect(atomCount(eq.right, [2])).toEqual({ H: 4, O: 2 });
  });

  it('对照表逐元素给出左右数量', () => {
    const t = balanceTable(eq, [1, 1, 1]);
    const h = t.find((r) => r.el === 'H');
    expect(h).toEqual({ el: 'H', left: 2, right: 2, ok: true });
    const o = t.find((r) => r.el === 'O');
    expect(o && o.ok).toBe(false);
  });
});

describe('EQUATIONS 词库自洽性', () => {
  it('全部方程式的标准答案都能通过配平校验', () => {
    for (const eq of EQUATIONS) {
      expect(eq.answer.length).toBe(eq.left.length + eq.right.length);
      expect(isBalanced(eq, eq.answer)).toBe(true);
    }
  });

  it('抽题数量正确且来自词库', () => {
    const q = sampleEquations(5);
    expect(q.length).toBe(5);
    for (const eq of q) expect(EQUATIONS.some((e) => e.id === eq.id)).toBe(true);
    expect(sampleEquations(99).length).toBe(EQUATIONS.length);
  });
});

describe('formulaParts 下标渲染', () => {
  it('化学式拆成字母与数字段', () => {
    expect(formulaParts('H2O')).toEqual(['H', '2', 'O']);
    expect(formulaParts('Fe3O4')).toEqual(['Fe', '3', 'O', '4']);
    expect(formulaParts('Zn')).toEqual(['Zn']);
  });
});
