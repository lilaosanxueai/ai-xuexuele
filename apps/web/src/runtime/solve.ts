/** 一元一次方程分步求解：随机出题（保证整数解）+ 规范步骤生成 */

export interface LinEq {
  /** 方程 ax + b = cx + d */
  a: number;
  b: number;
  c: number;
  d: number;
  /** 唯一解 */
  x: number;
}

export interface SolveStep {
  /** 步骤标题，如「移项」 */
  title: string;
  /** 该步之后的方程形态 */
  text: string;
}

function randInt(min: number, max: number): number {
  const arr = new Uint32Array(1);
  globalThis.crypto.getRandomValues(arr);
  return min + (arr[0] % (max - min + 1));
}

/**
 * 生成一道保证整数解的一元一次方程 ax + b = cx + d：
 * 先定 a c x，再反算 d = b + (a-c)x。
 * 难度：easy → 单边含 x；normal → 双边 x 系数不同；hard → 系数差更大。
 */
export function generateEq(difficulty: 'easy' | 'normal' | 'hard' = 'normal'): LinEq {
  let a: number, c: number;
  if (difficulty === 'easy') {
    a = randInt(1, 5);
    c = 0;
  } else if (difficulty === 'normal') {
    a = randInt(2, 6);
    c = randInt(1, a - 1);
  } else {
    a = randInt(4, 9);
    c = randInt(1, 3);
  }
  const x = randInt(-6, 8);
  const b = randInt(-8, 8);
  const d = b + (a - c) * x;
  return { a, b, c, d, x };
}

/** x 项显示：系数 1 省略、0 省略；first 决定首项符号格式 */
function xterm(coef: number, first: boolean): string {
  if (coef === 0) return '';
  const abs = Math.abs(coef);
  const body = (abs === 1 ? '' : String(abs)) + 'x';
  if (first) return coef < 0 ? `-${body}` : body;
  return `${coef < 0 ? '- ' : '+ '}${body}`;
}

/** 常数项显示：0 省略 */
function numterm(n: number, first: boolean): string {
  if (n === 0) return '';
  if (first) return String(n);
  return n > 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

function join(parts: string[]): string {
  const t = parts.filter(Boolean).join(' ').trim();
  if (t === '') return '0';
  // 前面的项被省略（系数 0）时，去掉常数项继承来的 "+ " 前缀
  return t.startsWith('+ ') ? t.slice(2) : t;
}

/** 方程原式 */
export function eqText(e: LinEq): string {
  return `${join([xterm(e.a, true), numterm(e.b, false)])} = ${join([xterm(e.c, true), numterm(e.d, false)])}`;
}

/** 规范解题步骤：移项 → 合并同类项 → 系数化为 1 */
export function solveSteps(e: LinEq): SolveStep[] {
  const k = e.a - e.c;
  return [
    { title: '① 移项（过桥变号）', text: `${join([xterm(e.a, true), xterm(-e.c, false)])} = ${join([numterm(e.d, true), numterm(-e.b, false)])}` },
    { title: '② 合并同类项', text: `${join([xterm(k, true)])} = ${e.d - e.b}` },
    { title: '③ 系数化为 1（两边同除）', text: `x = ${e.d - e.b} ÷ ${k} = ${e.x}` },
  ];
}

/** 判分（容忍小数输入） */
export function checkAnswer(input: string, x: number): boolean {
  const v = Number(input.trim());
  return Number.isFinite(v) && Math.abs(v - x) < 1e-9;
}
