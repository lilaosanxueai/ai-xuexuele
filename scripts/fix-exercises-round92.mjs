import fs from 'node:fs';
import path from 'node:path';

/**
 * 第92轮B：题库修复。
 * ① 同课内题干重复 → 删除后出现的重复题（保底剩 ≥3 题）
 * ② 答案分布失衡（全同或 ≥75% 同一选项）→ 确定性重排：把正确选项与目标位交换，
 *    目标位 = (课id哈希偏移 + 题序) % 4，全局近似均匀。
 * 安全豁免：选项含「以上/都对/都不对」类措辞的题不参与重排。
 * 用法: npx tsx scripts/fix-exercises-round92.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const UNSAFE = /以上|都对|都不对|都不是|全部正确|全不正确/;

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let deduped = 0, rebalanced = 0, skippedUnsafe = 0, removedQ = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;

  for (const l of arr) {
    const exs = l.exercises;
    if (!Array.isArray(exs) || exs.length === 0) continue;

    // ① 同课去重
    const seen = new Set();
    const kept = [];
    for (const e of exs) {
      const key = (e.q ?? '').trim();
      if (key && seen.has(key)) { removedQ++; continue; }
      seen.add(key);
      kept.push(e);
    }
    if (kept.length !== exs.length && kept.length >= 3) {
      l.exercises = kept;
      changed = true;
      deduped++;
    }

    // ② 答案重排
    const cur = l.exercises;
    const answers = cur.map((e) => e.answer);
    const cnt = {};
    answers.forEach((a) => (cnt[a] = (cnt[a] ?? 0) + 1));
    const maxN = Math.max(...Object.values(cnt));
    const need = new Set(answers).size === 1 || (cur.length >= 4 && maxN / cur.length >= 0.75);
    if (!need) continue;

    const offset = hash(l.id) % 4;
    let touched = false;
    cur.forEach((e, i) => {
      const target = (offset + i) % 4;
      if (e.answer === target) return;
      if (UNSAFE.test((e.options ?? []).join(' '))) { skippedUnsafe++; return; }
      const opts = [...e.options];
      const from = e.answer;
      [opts[from], opts[target]] = [opts[target], opts[from]];
      e.options = opts;
      e.answer = target;
      touched = true;
    });
    if (touched) { changed = true; rebalanced++; }
  }

  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('去重课数:', deduped, '删除题数:', removedQ, '| 重排课数:', rebalanced, '| 安全豁免题数:', skippedUnsafe);
