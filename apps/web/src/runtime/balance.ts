/** 化学方程式配平：系数调节 + 原子守恒实时对照（初中化学刚需） */

export interface Substance {
  /** 化学式，如 H2O、Fe3O4（不含括号） */
  formula: string;
  /** 中文名 */
  name: string;
}

export interface BalanceEq {
  id: string;
  left: Substance[];
  right: Substance[];
  /** 正确系数（与 left+right 顺序对应） */
  answer: number[];
  hint: string;
}

/** 初中常见配平方程式 */
export const EQUATIONS: BalanceEq[] = [
  { id: 'h2o-synth', left: [{ formula: 'H2', name: '氢气' }, { formula: 'O2', name: '氧气' }], right: [{ formula: 'H2O', name: '水' }], answer: [2, 1, 2], hint: '氧原子右边是奇数，先给 H2O 配 2' },
  { id: 'mgo-synth', left: [{ formula: 'Mg', name: '镁' }, { formula: 'O2', name: '氧气' }], right: [{ formula: 'MgO', name: '氧化镁' }], answer: [2, 1, 2], hint: '让 MgO 的氧变成偶数即可' },
  { id: 'h2o-decomp', left: [{ formula: 'H2O', name: '水' }], right: [{ formula: 'H2', name: '氢气' }, { formula: 'O2', name: '氧气' }], answer: [2, 2, 1], hint: '电解水口诀：氢二氧一' },
  { id: 'caco3-decomp', left: [{ formula: 'CaCO3', name: '碳酸钙' }], right: [{ formula: 'CaO', name: '氧化钙' }, { formula: 'CO2', name: '二氧化碳' }], answer: [1, 1, 1], hint: '已经平衡，确认一下原子数' },
  { id: 'fe3o4', left: [{ formula: 'Fe', name: '铁' }, { formula: 'O2', name: '氧气' }], right: [{ formula: 'Fe3O4', name: '四氧化三铁' }], answer: [3, 2, 1], hint: 'Fe3O4 里有 3 个铁 4 个氧' },
  { id: 'al2o3', left: [{ formula: 'Al', name: '铝' }, { formula: 'O2', name: '氧气' }], right: [{ formula: 'Al2O3', name: '氧化铝' }], answer: [4, 3, 2], hint: 'Al 配 4、O2 配 3，奇偶配平经典题' },
  { id: 'ch4-burn', left: [{ formula: 'CH4', name: '甲烷' }, { formula: 'O2', name: '氧气' }], right: [{ formula: 'CO2', name: '二氧化碳' }, { formula: 'H2O', name: '水' }], answer: [1, 2, 1, 2], hint: '先看氢：H2O 配 2，再看氧' },
  { id: 'kmno4', left: [{ formula: 'KMnO4', name: '高锰酸钾' }], right: [{ formula: 'K2MnO4', name: '锰酸钾' }, { formula: 'MnO2', name: '二氧化锰' }, { formula: 'O2', name: '氧气' }], answer: [2, 1, 1, 1], hint: 'K2MnO4 有 2 个钾，所以 KMnO4 配 2' },
  { id: 'co-reduce', left: [{ formula: 'Fe2O3', name: '氧化铁' }, { formula: 'CO', name: '一氧化碳' }], right: [{ formula: 'Fe', name: '铁' }, { formula: 'CO2', name: '二氧化碳' }], answer: [1, 3, 2, 3], hint: 'Fe2O3 的 3 个氧需要 3 个 CO 来抢' },
  { id: 'c2h5oh', left: [{ formula: 'C2H5OH', name: '乙醇' }, { formula: 'O2', name: '氧气' }], right: [{ formula: 'CO2', name: '二氧化碳' }, { formula: 'H2O', name: '水' }], answer: [1, 3, 2, 3], hint: '先配碳和氢，最后配氧' },
  { id: 'zn-hcl', left: [{ formula: 'Zn', name: '锌' }, { formula: 'HCl', name: '盐酸' }], right: [{ formula: 'ZnCl2', name: '氯化锌' }, { formula: 'H2', name: '氢气' }], answer: [1, 2, 1, 1], hint: 'ZnCl2 有 2 个氯，HCl 配 2' },
  { id: 'caco3-hcl', left: [{ formula: 'CaCO3', name: '碳酸钙' }, { formula: 'HCl', name: '盐酸' }], right: [{ formula: 'CaCl2', name: '氯化钙' }, { formula: 'H2O', name: '水' }, { formula: 'CO2', name: '二氧化碳' }], answer: [1, 2, 1, 1, 1], hint: 'CaCl2 的 2 个氯决定 HCl 配 2' },
];

/** 解析化学式 → 元素原子数（不含括号的简单式子） */
export function parseElements(formula: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const token of formula.match(/[A-Z][a-z]?\d*/g) ?? []) {
    const el = token.match(/[A-Z][a-z]?/)?.[0] ?? token;
    const digits = token.slice(el.length);
    const n = digits === '' ? 1 : parseInt(digits, 10);
    out[el] = (out[el] ?? 0) + (Number.isFinite(n) && n > 0 ? n : 1);
  }
  return out;
}

/** 一侧的原子总数：各化学式 × 系数后按元素累加 */
export function atomCount(side: Substance[], coeffs: number[]): Record<string, number> {
  const out: Record<string, number> = {};
  side.forEach((s, i) => {
    const c = coeffs[i] ?? 1;
    for (const [el, n] of Object.entries(parseElements(s.formula))) {
      out[el] = (out[el] ?? 0) + c * n;
    }
  });
  return out;
}

/** 是否配平：两侧每种元素的原子数都相等 */
export function isBalanced(eq: BalanceEq, coeffs: number[]): boolean {
  const l = atomCount(eq.left, coeffs.slice(0, eq.left.length));
  const r = atomCount(eq.right, coeffs.slice(eq.left.length));
  const els = new Set([...Object.keys(l), ...Object.keys(r)]);
  for (const el of els) {
    if ((l[el] ?? 0) !== (r[el] ?? 0)) return false;
  }
  return true;
}

/** 对照表行：元素 | 左 | 右 | 是否相等 */
export function balanceTable(eq: BalanceEq, coeffs: number[]): { el: string; left: number; right: number; ok: boolean }[] {
  const l = atomCount(eq.left, coeffs.slice(0, eq.left.length));
  const r = atomCount(eq.right, coeffs.slice(eq.left.length));
  const els = [...new Set([...Object.keys(l), ...Object.keys(r)])].sort();
  return els.map((el) => ({ el, left: l[el] ?? 0, right: r[el] ?? 0, ok: (l[el] ?? 0) === (r[el] ?? 0) }));
}

/** 化学式渲染分段：H2O → [H, 2, O]（数字用于下标） */
export function formulaParts(formula: string): string[] {
  return formula.match(/[A-Z][a-z]?\d*/g)?.flatMap((t) => {
    const el = t.match(/[A-Z][a-z]?/)?.[0] ?? t;
    const digits = t.slice(el.length);
    return digits === '' ? [el] : [el, digits];
  }) ?? [formula];
}

/** 安全随机数（浏览器/Node 通用 crypto API） */
function rand(): number {
  const arr = new Uint32Array(1);
  globalThis.crypto.getRandomValues(arr);
  return arr[0] / 2 ** 32;
}

/** 随机抽 n 道题（Fisher-Yates 乱序） */
export function sampleEquations(n: number): BalanceEq[] {
  const a = [...EQUATIONS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}
