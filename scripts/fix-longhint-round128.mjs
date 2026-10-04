import fs from 'node:fs';
import path from 'node:path';

/**
 * 第128轮 longHint 修复：eco-28 三题正确项过长。
 * 安全闸：改写前必须匹配原文；改写后 options[answer] 必须等于新正确项。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  {
    file: 'eco-28.json', qi: 1, answer: 1,
    oldCorrect: '产权模糊·人人使用无人负责',
    newOptions: ['土地太贫瘠了', '产权模糊无人负责', '人口太多分不过来', '那几年天气不好'],
  },
  {
    file: 'eco-28.json', qi: 2, answer: 2,
    oldCorrect: '激励结构变了（多劳多得）',
    newOptions: ['那年天气特别好', '化肥突然普及', '激励结构变了', '农业机械推广'],
  },
  {
    file: 'eco-28.json', qi: 3, answer: 1,
    oldCorrect: '交够国家的·留足集体的·剩下自己的',
    newOptions: ['全部上交国家统一分配', '交够国家的留足集体的剩下自己的', '家家户户按人口平均分', '干多干少都记一样工分'],
  },
];

let ok = 0;
const p = path.join(DIR, 'eco-28.json');
const l = JSON.parse(fs.readFileSync(p, 'utf8'));
for (const f of FIX) {
  const ex = l.exercises[f.qi];
  const cur = ex.options[ex.answer];
  if (cur !== f.oldCorrect) { console.error(`✗ Q${f.qi + 1} 安全闸：现正确项「${cur}」≠ 预期「${f.oldCorrect}」，跳过`); continue; }
  ex.options = [...f.newOptions];
  ex.answer = f.answer;
  if (ex.options[ex.answer] !== f.newOptions[f.answer]) { console.error(`✗ Q${f.qi + 1} 改写后校验失败`); continue; }
  console.log(`✓ Q${f.qi + 1}「${cur}」→「${f.newOptions[f.answer]}」`);
  ok++;
}
fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log(`完成 ${ok}/${FIX.length} 处修复`);
