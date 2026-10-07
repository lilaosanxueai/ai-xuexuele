import fs from 'node:fs';
import path from 'node:path';

/**
 * 第143轮 longHint 修复：8 题正确项过长（安全闸：改写前匹配原文，改写后校验）。
 * 策略：缩短正确项括注 + 长度对等的干扰项。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  { file: 'eth-28.json', qi: 3, answer: 1, oldCorrect: '保留证据并告诉信任的大人', newOptions: ['直接报复回去', '留证据并找大人', '忍着不说', '转学逃避'] },
  { file: 'eth-29.json', qi: 0, answer: 1, oldCorrect: '三级（不良·严重不良·犯罪）', newOptions: ['两类', '三级阶梯', '五级', '不分级'] },
  { file: 'eth-30.json', qi: 2, answer: 3, oldCorrect: '以自己劳动收入为主要生活来源', newOptions: ['身高年满一米八', '已经结婚', '父母点头同意', '劳动收入为主要来源'] },
  { file: 'eth-31.json', qi: 1, answer: 1, oldCorrect: '周五六日和节假日20-21点', newOptions: ['每天三个小时', '周末节假日20-21点', '全天都开放', '寒暑假全天'] },
  { file: 'eth-31.json', qi: 3, answer: 1, oldCorrect: '个人信息保护规定（禁止强制索权）', newOptions: ['环境保护法', '个人信息保护规定', '道路交通法规', '税收征管法'] },
  { file: 'eth-32.json', qi: 2, answer: 1, oldCorrect: '12周岁（特定情形+最高检核准）', newOptions: ['10周岁', '12周岁（须最高检核准）', '14周岁', '没有降低'] },
  { file: 'eth-32.json', qi: 3, answer: 1, oldCorrect: '宽容不纵容（从宽但不免罪）', newOptions: ['一律免责', '宽容不纵容', '加倍处罚', '只罚款了事'] },
  { file: 'eth-33.json', qi: 3, answer: 3, oldCorrect: '违法（不得收取押金证件）', newOptions: ['行业惯例而已', '报销就行', '可以讨价还价', '违法（不得收押金）'] },
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
