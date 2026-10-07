import fs from 'node:fs';
import path from 'node:path';

/**
 * 第144轮 longHint 修复：4 题正确项过长（安全闸：改写前匹配原文，改写后校验）。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  { file: 'pe-32.json', qi: 2, answer: 1, oldCorrect: '123-164（60-80%）', newOptions: ['90-110', '约123-164', '180-200', '无所谓'] },
  { file: 'psy-31.json', qi: 2, answer: 1, oldCorrect: '反复挫折+无力感让人放弃尝试', newOptions: ['狗天生比较笨', '挫折+无力感→放弃', '电击有益健康', '人不如狗聪明'] },
  { file: 'psy-31.json', qi: 4, answer: 1, oldCorrect: '找暂时特定可改的解释并行动', newOptions: ['万事都怪别人', '找可改的解释并行动', '盲目自信不反思', '从不承认失误'] },
  { file: 'psy-32.json', qi: 2, answer: 0, oldCorrect: '亲密加深想撤退·把独立当铠甲', newOptions: ['亲密加深就想撤退', '消息永远秒回', '天天查岗报备', '逢人就倾诉'] },
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
