import fs from 'node:fs';
import path from 'node:path';

/**
 * 第92轮：题库质量审计——扫全部课程的 exercises。
 * 检查：答案分布失衡（全同选项）、选项数≠4、空解析、空选项、同学科重复题干。
 * 用法: npx tsx scripts/audit-exercises.mjs
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

const skew = [], optN = [], noExp = [], emptyOpt = [], dupQ = [];
let totalQ = 0;
const qSeen = new Map(); // 题干前30字 -> 首次出现课id
for (const l of all) {
  const exs = l.exercises ?? [];
  if (!exs.length) continue;
  const id = l.id + '「' + (l.title ?? '') + '」';
  const answers = exs.map((e) => e.answer);
  totalQ += exs.length;
  // 1) 答案全同 → 孩子会学会「无脑选A」
  if (new Set(answers).size === 1) skew.push(id + ' 全部= ' + 'ABCD'[answers[0]] + ' (' + exs.length + '题)');
  // 分布极端（≥75% 同一选项且题数≥4）
  else if (exs.length >= 4) {
    const cnt = {};
    answers.forEach((a) => (cnt[a] = (cnt[a] ?? 0) + 1));
    const maxN = Math.max(...Object.values(cnt));
    if (maxN / exs.length >= 0.75) skew.push(id + ' 偏科: ' + JSON.stringify(answers));
  }
  exs.forEach((e, i) => {
    if ((e.options ?? []).length !== 4) optN.push(id + ' 第' + (i + 1) + '题 ' + (e.options ?? []).length + '个选项');
    if (!(e.explain ?? '').trim()) noExp.push(id + ' 第' + (i + 1) + '题');
    (e.options ?? []).forEach((o, oi) => {
      if (!String(o ?? '').trim()) emptyOpt.push(id + ' 第' + (i + 1) + '题 选项' + ('ABCD'[oi]));
    });
    const key = ((e.q ?? '') + '|' + (l.subjectArea ?? '')).slice(0, 40);
    if (qSeen.has(key)) dupQ.push(id + ' 第' + (i + 1) + '题 与 ' + qSeen.get(key) + ' 重复');
    else qSeen.set(key, l.id + ' 第' + (i + 1) + '题');
  });
}

console.log('=== 题库审计：共 ' + all.length + ' 课 / ' + totalQ + ' 题 ===');
for (const [k, arr] of Object.entries({ skew, optN, noExp, emptyOpt, dupQ })) {
  console.log('\n[' + k + '] ' + arr.length + ' 处');
  arr.slice(0, 30).forEach((s) => console.log('  - ' + s));
  if (arr.length > 30) console.log('  …还有 ' + (arr.length - 30) + ' 处');
}
