import fs from 'node:fs';
import path from 'node:path';

/**
 * 第93轮：答案泄漏审计——题干（q）或四个选项中出现「互相包含/重复」导致可猜答案。
 * 规则：
 *  1) 题干包含正确选项的核心文本（≥6 字连续重合）→ 送分题
 *  2) 四选项中有两个高度雷同（≥8 字连续重合）→ 选项区分度差
 *  3) 正确选项显著长于其他选项（≥2.5 倍且 ≥12 字）→ 长选项暗示
 * 用法: npx tsx scripts/audit-leak.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const all = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    if (Array.isArray(j)) all.push(...j); else if (j) all.push(j);
  } catch { /* skip */ }
}

/** 最长公共子串长度（朴素滑动，选项文本短，够用） */
function lcs(a, b) {
  if (!a || !b) return 0;
  let best = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let k = 0;
      while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
      if (k > best) best = k;
    }
  }
  return best;
}

const leak = [], dupOpt = [], longHint = [];
let totalQ = 0;
for (const l of all) {
  const exs = l.exercises ?? [];
  if (!exs.length) continue;
  const id = l.id;
  exs.forEach((e, i) => {
    totalQ++;
    const q = (e.q ?? '');
    const opts = (e.options ?? []).map(String);
    const ans = opts[e.answer] ?? '';
    // 1) 题干泄漏：正确项与题干连续重合 ≥6 字
    if (lcs(q, ans) >= 6) leak.push(id + ' 第' + (i + 1) + '题「' + q.slice(0, 18) + '」←题干含「' + ans.slice(0, 12) + '」');
    // 2) 选项雷同：任意两项连续重合 ≥8 字
    for (let a = 0; a < opts.length; a++) {
      for (let b = a + 1; b < opts.length; b++) {
        if (lcs(opts[a], opts[b]) >= 8) { dupOpt.push(id + ' 第' + (i + 1) + '题 选项' + 'ABCD'[a] + '/' + 'ABCD'[b] + ' 雷同'); break; }
      }
    }
    // 3) 长选项暗示：正确项 ≥2.5 倍于其他项平均长且 ≥12 字
    const others = opts.filter((_, oi) => oi !== e.answer);
    const avg = others.reduce((s, o) => s + o.length, 0) / Math.max(1, others.length);
    if (ans.length >= 12 && ans.length >= avg * 2.5) longHint.push(id + ' 第' + (i + 1) + '题 正确项长' + ans.length + ' vs 均' + avg.toFixed(1));
  });
}

console.log('=== 答案泄漏审计：' + all.length + ' 课 / ' + totalQ + ' 题 ===');
for (const [k, arr] of Object.entries({ leak, dupOpt, longHint })) {
  console.log('\n[' + k + '] ' + arr.length + ' 处');
  arr.slice(0, 25).forEach((s) => console.log('  - ' + s));
  if (arr.length > 25) console.log('  …还有 ' + (arr.length - 25) + ' 处');
}
