import fs from 'node:fs';
import path from 'node:path';

/**
 * 第127轮 longHint 修复：4 题正确项过长。
 * 安全闸：改写前必须匹配原文；改写后 options[answer] 必须等于新正确项。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  {
    file: 'psy-24.json', qi: 2, answer: 1,
    oldCorrect: '期望效应（双方心理暗示）',
    newOptions: ['样本太小', '期望效应', '数据算错', '伦理问题'],
  },
  {
    file: 'psy-24.json', qi: 3, answer: 1,
    oldCorrect: '自选择偏差（能投票的不代表全体）',
    newOptions: ['人数太少', '自选择偏差', '统计不会错', '问题太简单'],
  },
  {
    file: 'soc-22.json', qi: 3, answer: 1,
    oldCorrect: '步行满足日常需求·职住平衡',
    newOptions: ['住得更远更分散', '步行满足日常所需', '多建工厂增加岗位', '到处都建高楼'],
  },
  {
    file: 'soc-23.json', qi: 1, answer: 1,
    oldCorrect: '只看到同质信息·视野变窄',
    newOptions: ['网络信号不稳定', '视野被同质信息变窄', '房间太乱东西多', '手机内存不够用'],
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
