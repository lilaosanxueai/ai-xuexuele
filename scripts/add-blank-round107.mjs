import fs from 'node:fs';
import path from 'node:path';

/**
 * 第107轮：为 12 节课各追加 1 道「真填空题」（type:'blank'），分布 5 学科。
 * options/answer 保留词库兜底（挑战赛/审计兼容）。
 * 用法: npx tsx scripts/add-blank-round107.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const BLANKS = {
  'math-16': {
    q: '在数轴上表示 x > 2，取的是 2 的 ___ 侧的所有数',
    options: ['右', '左', '上下'], answer: 0,
    explain: '大于号向右开口，解集在右（不含 2 画空心圈）',
    blank: { answerText: '右', bank: ['右', '左', '上下'] },
  },
  'math-19': {
    q: '高斯求和：1+2+…+100 = 50 × ___ = 5050',
    options: ['101', '100', '99'], answer: 0,
    explain: '首尾配对每对 101，共 50 对',
    blank: { answerText: '101', bank: ['101', '100', '99'] },
  },
  'math-30': {
    q: '解二元一次方程组的核心策略是消去一个 ___',
    options: ['未知数', '括号', '分数线'], answer: 0,
    explain: '消元化归为一元方程',
    blank: { answerText: '未知数', bank: ['未知数', '括号', '分数线'] },
  },
  'math-35': {
    q: '等比数列求和公式（q≠1）：S = a(1−qⁿ) ÷ (___ − q)',
    options: ['1', '2', '0'], answer: 0,
    explain: '分母是 (1−q)',
    blank: { answerText: '1', bank: ['1', '2', '0'] },
  },
  'math-12': {
    q: '2¹⁵ = 32768 ≈ 10 的 ___ 次方（填数字，可带小数）',
    options: ['4.5', '4', '5'], answer: 0,
    explain: 'log₁₀32768 ≈ 4.5（数量级估算）',
    blank: { answerText: '4.5' },
  },
  'his-04': {
    q: '秦统一全国是在公元前 ___ 年（填数字）',
    options: ['221', '210', '202'], answer: 0,
    explain: '公元前 221 年嬴政建秦',
    blank: { answerText: '221' },
  },
  'his-12': {
    q: '科举制正式形成的标志是隋炀帝设立 ___ 科',
    options: ['进士', '明经', '武举'], answer: 0,
    explain: '进士科设立=科举制诞生',
    blank: { answerText: '进士', bank: ['进士', '明经', '武举'] },
  },
  'bio-07': {
    q: '孟德尔 F₂ 中显性性状约占 ___（填分数，如 3/4）',
    options: ['3/4', '1/4', '1/2'], answer: 0,
    explain: '3:1 分离比中显性占 3/4',
    blank: { answerText: '3/4' },
  },
  'eng-10': {
    q: 'beautiful 的比较级是 ___（填英文）',
    options: ['more beautiful', 'beautifuller', 'most beautiful'], answer: 0,
    explain: '多音节词比较级用 more',
    blank: { answerText: 'more beautiful' },
  },
  'eng-26': {
    q: '表达"在早上 7 点"（at 7:00 ___ the morning）用介词 ___',
    options: ['in', 'on', 'at'], answer: 0,
    explain: 'in the morning 固定搭配',
    blank: { answerText: 'in', bank: ['in', 'on', 'at'] },
  },
  'chem-02': {
    q: '实验室制 CO₂ 所用石灰石的主要成分是 ___',
    options: ['碳酸钙', '氧化钙', '氢氧化钙'], answer: 0,
    explain: 'CaCO₃ 与稀盐酸反应',
    blank: { answerText: '碳酸钙', bank: ['碳酸钙', '氧化钙', '氢氧化钙'] },
  },
  'sci-14': {
    q: '三大岩石按成因分为岩浆岩、沉积岩和 ___',
    options: ['变质岩', '火山岩', '石灰岩'], answer: 0,
    explain: '高温高压变质而成',
    blank: { answerText: '变质岩', bank: ['变质岩', '火山岩', '石灰岩'] },
  },
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let added = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    const spec = BLANKS[l.id];
    if (!spec || !l.exercises) continue;
    if (l.exercises.some((e) => e.type === 'blank')) continue; // 幂等
    l.exercises.push({ ...spec, type: 'blank' });
    changed = true;
    added++;
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('已为 ' + added + ' 节课追加填空题');
