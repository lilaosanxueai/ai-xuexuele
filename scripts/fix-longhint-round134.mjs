import fs from 'node:fs';
import path from 'node:path';

/**
 * 第134轮 longHint 修复：11 题正确项过长（安全闸：改写前匹配原文，改写后 options[answer] 校验）。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  { file: 'psy-26.json', qi: 0, answer: 1, oldCorrect: '情绪系统先熟·控制系统后熟', newOptions: ['四肢比躯干长得快', '情绪先熟理智后熟', '左眼和右眼视力', '身高和体重变化'] },
  { file: 'psy-26.json', qi: 3, answer: 1, oldCorrect: '无用连接被剪·常用的被强化', newOptions: ['头发变得稀少', '剪掉无用强化常用', '大脑体积缩小', '记忆全部清零'] },
  { file: 'psy-26.json', qi: 4, answer: 1, oldCorrect: '竞赛·表演·新技能等规则内挑战', newOptions: ['马路上飙车', '规则内的新挑战', '尝试吸烟试探', '夜不归宿派对'] },
  { file: 'psy-27.json', qi: 2, answer: 1, oldCorrect: '情绪敏感度高·对威胁警觉', newOptions: ['一种精神疾病', '情绪敏感对威胁警觉', '智力水平低', '完全无法社交'] },
  { file: 'psy-28.json', qi: 0, answer: 1, oldCorrect: '决定做多了·后续决定质量下降', newOptions: ['太累不想起床', '决定做多了质量下降', '单纯讨厌作业', '记忆力变差'] },
  { file: 'soc-24.json', qi: 0, answer: 1, oldCorrect: '成果共享导致人人想坐享其成', newOptions: ['坐公交车出行', '成果共享人人想搭车', '城市交通堵车', '乘车逃票行为'] },
  { file: 'soc-24.json', qi: 3, answer: 1, oldCorrect: '轻参与易冷却·缺乏持续压力', newOptions: ['传播速度太慢', '轻参与易冷却', '参与人数太少', '完全没有情绪'] },
  { file: 'soc-24.json', qi: 4, answer: 1, oldCorrect: '落地为线下行动与制度对话', newOptions: ['只维持网上热度', '落地为线下行动', '每天更换头像', '等待热搜降临'] },
  { file: 'soc-25.json', qi: 1, answer: 1, oldCorrect: '不公平感（等待投入被偷走）', newOptions: ['大家脾气太差', '不公平感被触发', '时间实在太多', '纯粹的嫉妒心'] },
  { file: 'soc-26.json', qi: 0, answer: 1, oldCorrect: '情绪在人群中互相激发强化', newOptions: ['一种化学反应', '情绪互相激发强化', '循环经济模式', '数学上的循环'] },
  { file: 'soc-28.json', qi: 1, answer: 1, oldCorrect: '主要由人类活动制造·全球传导', newOptions: ['只发生在城市里', '人造且全球传导', '威力比以前小', '肉眼都能看见'] },
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
