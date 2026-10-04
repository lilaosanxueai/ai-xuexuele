import fs from 'node:fs';
import path from 'node:path';

/**
 * 第126轮 longHint 修复：5 题正确项过长（正确项长度 >> 干扰项均值 → 泄底）。
 * 安全闸：改写前必须匹配原文；改写后 options[answer] 必须等于新正确项文本。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  {
    file: 'art-26.json', qi: 1, answer: 1,
    oldCorrect: '画面空间深度（近大远小）',
    newOptions: ['色彩鲜艳', '画面空间深度', '画得更快', '保存更久'],
  },
  {
    file: 'art-26.json', qi: 3, answer: 1,
    oldCorrect: '照相机取代了"像"·画家转向别的价值',
    newOptions: ['画家的技术退步了', '照相机取代了"画得像"', '颜料质量变差了', '观众喜欢看不懂的'],
  },
  {
    file: 'art-28.json', qi: 1, answer: 1,
    oldCorrect: '约3种（60-30-10）',
    newOptions: ['只用1种', '约3种', '越多越好', '看心情随便用'],
  },
  {
    file: 'mus-28.json', qi: 0, answer: 0,
    oldCorrect: '拍子是匀速底板·节奏是长短组合',
    newOptions: ['拍子匀速·节奏长短组合', '拍子和节奏完全一样', '节奏才是匀速的底板', '两者没有任何关系'],
  },
  {
    file: 'mus-29.json', qi: 1, answer: 1,
    oldCorrect: '基础节奏型（短-短-长）',
    newOptions: ['一种打击乐器', '拉丁乐的基础节奏型', '一种舞蹈步伐', '一种歌词形式'],
  },
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
    if (cur !== f.oldCorrect) { console.error(`✗ ${file} Q${f.qi + 1} 安全闸：现正确项「${cur}」≠ 预期「${f.oldCorrect}」，跳过`); continue; }
    if (ex.type === 'blank') { console.error(`✗ ${file} Q${f.qi + 1} 是 blank 题，不动`); continue; }
    ex.options = [...f.newOptions];
    ex.answer = f.answer;
    if (ex.options[ex.answer] !== f.newOptions[f.answer]) { console.error(`✗ ${file} Q${f.qi + 1} 改写后校验失败`); continue; }
    console.log(`✓ ${file} Q${f.qi + 1}「${cur}」→「${f.newOptions[f.answer]}」`);
    ok++;
  }
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
}
console.log(`完成 ${ok}/${FIX.length} 处修复`);
