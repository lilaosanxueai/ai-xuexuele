import fs from 'node:fs';
import path from 'node:path';

/** 第98轮：导出 longHint 题的完整选项，供手写增强干扰项 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

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

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const all = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    if (Array.isArray(j)) all.push(...j); else if (j) all.push(j);
  } catch { /* skip */ }
}

// 目标课：按 id 前缀过滤（第100轮：其余全部）
const targets = all.filter((l) => !/^(basics|ai|bio|chem|cross|sci)-/.test(l.id));
for (const l of targets) {
  (l.exercises ?? []).forEach((e, i) => {
    const opts = (e.options ?? []).map(String);
    const ans = opts[e.answer] ?? '';
    const others = opts.filter((_, oi) => oi !== e.answer);
    const avg = others.reduce((s, o) => s + o.length, 0) / Math.max(1, others.length);
    if (ans.length >= 12 && ans.length >= avg * 2.5) {
      console.log(`\n### ${l.id} Q${i + 1}  ${e.q}`);
      opts.forEach((o, oi) => console.log(`  ${'ABCD'[oi]}${oi === e.answer ? '*' : ' '} [${o.length}字] ${o}`));
    }
  });
}
