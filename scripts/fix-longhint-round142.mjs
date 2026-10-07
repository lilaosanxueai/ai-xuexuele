import fs from 'node:fs';
import path from 'node:path';

/**
 * 第142轮 longHint 修复：3 题正确项过长（安全闸：改写前匹配原文，改写后校验）。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  { file: 'eco-29.json', qi: 0, answer: 1, oldCorrect: '同一商品对不同人卖不同价', newOptions: ['欺负消费者', '同品不同价', '违法行为', '一律涨价'] },
  { file: 'eco-29.json', qi: 1, answer: 1, oldCorrect: '区分价格敏感者·多赚不领券的人', newOptions: ['省下印刷费', '区分敏感者多赚钱', '顺便做广告', '快速清库存'] },
  { file: 'lab-32.json', qi: 3, answer: 1, oldCorrect: '这个岗位前三个月的优先事项是什么', newOptions: ['工资能不能翻倍', '岗位前三个月的优先事项', '公司几点钟下班', '没想好不问了'] },
];

const byFile = {};
for (const f of FIX) (byFile[f.file] ??= []).push(f);

let ok = 0;
for (const [file, fixes] of Object.entries(byFile)) {
  const p = path.join(DIR, file);
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const f of fixes) {
    const ex = l.exercises[f.qi];
    const cur = ex.options[ex.answer];
    if (cur !== f.oldCorrect) { console.error(`✗ ${file} Q${f.qi + 1} 安全闸：「${cur}」≠「${f.oldCorrect}」，跳过`); continue; }
    if (ex.type === 'blank') { console.error(`✗ ${file} Q${f.qi + 1} 是 blank 题，不动`); continue; }
    ex.options = [...f.newOptions];
    ex.answer = f.answer;
    if (ex.options[ex.answer] !== f.newOptions[f.answer]) { console.error(`✗ ${file} Q${f.qi + 1} 改写后校验失败`); continue; }
    console.log(`✓ ${file} Q${f.qi + 1} →「${f.newOptions[f.answer]}」`);
    ok++;
  }
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
}
console.log(`完成 ${ok}/${FIX.length} 处修复`);
