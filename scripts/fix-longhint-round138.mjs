import fs from 'node:fs';
import path from 'node:path';

/**
 * 第138轮 longHint 修复：5 题正确项过长（安全闸：改写前匹配原文，改写后校验）。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  { file: 'art-30.json', qi: 2, answer: 1, oldCorrect: '一张画拍两次（省一半绘制）', newOptions: ['画两遍草稿', '一张画拍两次', '两秒才一帧', '两人一起画'] },
  { file: 'art-31.json', qi: 4, answer: 1, oldCorrect: '传统的现代表达（中而新）', newOptions: ['完全照搬古建', '传统的现代表达', '全盘西化模仿', '越怪越吸引人'] },
  { file: 'art-33.json', qi: 1, answer: 1, oldCorrect: '选择与语境让物"变成"艺术', newOptions: ['手工精湛', '选择与语境', '材料越贵越好', '画得逼真'] },
  { file: 'art-33.json', qi: 2, answer: 1, oldCorrect: '形式（怎样画）与边界（什么是艺术）', newOptions: ['都是绘画技法', '形式与边界', '色彩与线条', '颜料与画布'] },
  { file: 'art-33.json', qi: 4, answer: 1, oldCorrect: '市场价（资本·话题·稀缺共同作用）', newOptions: ['艺术价值本身', '市场价（不等于艺术价值）', '作者绘画水平', '材料的成本'] },
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
