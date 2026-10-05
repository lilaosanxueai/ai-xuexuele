import fs from 'node:fs';
import path from 'node:path';

/**
 * 第131轮 longHint 修复：5 题正确项过长。
 * 安全闸：改写前必须匹配原文；改写后 options[answer] 必须等于新正确项。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  {
    file: 'lab-25.json', qi: 0, answer: 1,
    oldCorrect: '先洗油少的杯子碗·后洗油多的盘锅',
    newOptions: ['先洗最油的锅', '先油少后油多', '想到哪洗到哪', '只冲水不擦'],
  },
  {
    file: 'lab-25.json', qi: 4, answer: 1,
    oldCorrect: '喊大人·用扫帚扫·碎片包好再扔',
    newOptions: ['用手快速捡起来', '扫帚扫·包好再扔', '冲进下水道里', '假装什么都没看见'],
  },
  {
    file: 'lab-27.json', qi: 0, answer: 1,
    oldCorrect: '做减法：大字体·少App·大按钮',
    newOptions: ['装更多App', '做减法·字体大App少', '换最新手机', '调快动画速度'],
  },
  {
    file: 'lab-27.json', qi: 3, answer: 1,
    oldCorrect: '设每日转账限额+转账前家人核实',
    newOptions: ['反复口头叮嘱', '限额+转账前核实', '卸载银行App', '不让长辈用手机'],
  },
  {
    file: 'pe-26.json', qi: 4, answer: 1,
    oldCorrect: '遮挡发球（挡住击球瞬间）',
    newOptions: ['垂直向上高抛', '遮挡发球', '球先落己方台面', '下落时才击球'],
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
