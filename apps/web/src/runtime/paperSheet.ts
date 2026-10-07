import type { Exercise, Lesson } from '@shared/types.ts';

/**
 * 期中/期末综合卷生成器：跨课标模块按比例抽题。
 * 确定性：同一天同一参数 → 同一张卷（重打印不换题）。
 */

/** 字符串种子 → 32 位整数（xmur3 简化版） */
function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32：确定性伪随机（出卷复现用，刻意非加密强度：同种子同卷） */
function rng(seedNum: number): () => number {
  let a = seedNum;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shuffle = <T,>(arr: T[], rand: () => number): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** 模块内候选题：优先每课后半段（综合题），每课最多2道 */
function poolOfModule(lessons: Lesson[], mod: string): Exercise[] {
  const pool: Exercise[] = [];
  for (const l of lessons) {
    if ((l.curriculum?.module ?? '其他') !== mod) continue;
    const exs = l.exercises ?? [];
    const late = [5, 4, 3].filter((i) => exs[i]).map((i) => exs[i]);
    const early = [2, 1, 0].filter((i) => exs[i]).map((i) => exs[i]);
    pool.push(...[...late, ...early].slice(0, 2).map((e) => ({ ...e })));
  }
  return pool;
}

export interface BuildPaperOpts {
  lessons: Lesson[];
  /** 参与出卷的模块（顺序按课程序） */
  modules: string[];
  /** 目标题量（10/20/30） */
  count: number;
  /** 种子（默认当天日期） */
  seed?: string;
}

/** 出卷：模块按比例分摊（各模块至少1题），题干去重，输出可直接喂 ExercisePanel */
export function buildPaper(opts: BuildPaperOpts): Exercise[] {
  const { lessons, modules, count } = opts;
  const rand = rng(hashSeed(opts.seed ?? new Date().toISOString().slice(0, 10)));
  if (modules.length === 0 || count <= 0) return [];

  // 题量分摊：大者优先整除+余数随机派发；模块多于题量时按课程序截取
  const mods = modules.slice(0, Math.max(1, count));
  const base = Math.floor(count / mods.length);
  let rem = count - base * mods.length;
  const quota = new Map<string, number>();
  for (const m of mods) quota.set(m, base + (rem-- > 0 ? 1 : 0));

  const seenQ = new Set<string>();
  const out: Exercise[] = [];
  const leftovers: Exercise[] = [];
  for (const m of mods) {
    const pool = shuffle(poolOfModule(lessons, m), rand);
    const take = pool.filter((e) => !seenQ.has(e.q)).slice(0, quota.get(m) ?? 1);
    const rest = pool.filter((e) => !seenQ.has(e.q)).slice(take.length);
    for (const e of take) seenQ.add(e.q);
    out.push(...take);
    leftovers.push(...rest);
  }
  // 缺口回填：某模块题量不足时，从其他模块剩余池补足到目标题数
  for (const e of shuffle(leftovers, rand)) {
    if (out.length >= count) break;
    if (seenQ.has(e.q)) continue;
    seenQ.add(e.q);
    out.push(e);
  }
  return shuffle(out, rand).slice(0, count);
}

/** 打印辅助：填空题印成横线（返回 null 表示该题用横线作答） */
export function printOptions(ex: Exercise): string[] | null {
  if (ex.type === 'blank') return null;
  return ex.options;
}

/** 打印辅助：该题的答案文本 */
export function printAnswer(ex: Exercise): string {
  if (ex.type === 'blank' && ex.blank) return ex.blank.answerText;
  const opt = ex.options[ex.answer];
  return opt != null ? `${'ABCD'[ex.answer] ?? ''}. ${opt}` : String(opt ?? '');
}
