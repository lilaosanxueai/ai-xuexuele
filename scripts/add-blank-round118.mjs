import fs from 'node:fs';
import path from 'node:path';

/**
 * 第118轮：为 20 节数学/科学/物理/化学/地理/生物课各追加 1 道填空题。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const BLANKS = {
  'math-01': {
    q: '数轴上，原点右边的数都大于 ___（填：零）',
    options: ['零', '一', '二', '三'], answer: 0,
    explain: '原点表示0，右边为正数',
    blank: { answerText: '零', bank: ['零', '一', '二', '三'] },
  },
  'math-03': {
    q: '计算 6 ÷ 2 = ___',
    options: ['3', '4', '2', '12'], answer: 0,
    explain: '6÷2=3',
    blank: { answerText: '3', bank: ['3', '4', '2', '12'] },
  },
  'math-05': {
    q: '把一个蛋糕平均分成 4 份，每份是这个蛋糕的 ___ 分之一',
    options: ['四', '三', '五', '二'], answer: 0,
    explain: '平均分成几份就是几分之一',
    blank: { answerText: '四', bank: ['四', '三', '五', '二'] },
  },
  'math-07': {
    q: '长方形面积 = 长 × ___',
    options: ['宽', '高', '边', '对角线'], answer: 0,
    explain: 'S = a × b（长×宽）',
    blank: { answerText: '宽', bank: ['宽', '高', '边', '对角线'] },
  },
  'math-09': {
    q: '一组数据 3, 5, 3, 7, 2 的平均数是 ___',
    options: ['4', '3', '5', '6'], answer: 0,
    explain: '(3+5+3+7+2)÷5 = 20÷5 = 4',
    blank: { answerText: '4', bank: ['4', '3', '5', '6'] },
  },
  'sci-01': {
    q: '水沸腾时的温度约是 ___℃（标准大气压下）',
    options: ['100', '90', '80', '120'], answer: 0,
    explain: '标准大气压下水的沸点是100℃',
    blank: { answerText: '100', bank: ['100', '90', '80', '120'] },
  },
  'sci-03': {
    q: '植物进行光合作用需要吸收二氧化碳和 ___',
    options: ['水', '氧气', '氮气', '土壤'], answer: 0,
    explain: 'CO₂ + H₂O → 有机物 + O₂',
    blank: { answerText: '水', bank: ['水', '氧气', '氮气', '土壤'] },
  },
  'sci-05': {
    q: '声音在 ___ 中传播最快（固体/液体/气体选一）',
    options: ['固体', '液体', '气体', '真空'], answer: 0,
    explain: '固>液>气，真空中不传播',
    blank: { answerText: '固体', bank: ['固体', '液体', '气体', '真空'] },
  },
  'sci-07': {
    q: '磁铁的同名磁极相互 ___（排斥/吸引）',
    options: ['排斥', '吸引'], answer: 0,
    explain: '同名相斥异名相吸',
    blank: { answerText: '排斥', bank: ['排斥', '吸引'] },
  },
  'sci-09': {
    q: '地球自转一周约需要 ___ 小时',
    options: ['24', '12', '48', '365'], answer: 0,
    explain: '一天=自转一周≈24小时',
    blank: { answerText: '24', bank: ['24', '12', '48', '365'] },
  },
  'phy-01': {
    q: '力的三要素：大小、方向和 ___',
    options: ['作用点', '速度', '质量', '时间'], answer: 0,
    explain: '大小·方向·作用点',
    blank: { answerText: '作用点', bank: ['作用点', '速度', '质量', '时间'] },
  },
  'phy-03': {
    q: '光在真空中的速度约为 3×10⁸ ___',
    options: ['m/s', 'km/s', 'km/h', 'm/min'], answer: 0,
    explain: '3×10⁸ m/s',
    blank: { answerText: 'm/s', bank: ['m/s', 'km/s', 'km/h', 'm/min'] },
  },
  'phy-05': {
    q: '串联电路中电流处处 ___（相等/不等）',
    options: ['相等', '不等'], answer: 0,
    explain: '串联电流唯一路径',
    blank: { answerText: '相等', bank: ['相等', '不等'] },
  },
  'chem-01': {
    q: '水的化学式是 ___',
    options: ['H₂O', 'CO₂', 'O₂', 'NaCl'], answer: 0,
    explain: '两个氢一个氧',
    blank: { answerText: 'H₂O', bank: ['H₂O', 'CO₂', 'O₂', 'NaCl'] },
  },
  'chem-03': {
    q: '化学变化生成新物质，物理变化不生成 ___ 物质',
    options: ['新', '旧'], answer: 0,
    explain: '化学变化的本质区别',
    blank: { answerText: '新', bank: ['新', '旧'] },
  },
  'chem-05': {
    q: '燃烧需要三个条件：可燃物、氧气（助燃剂）和温度达到 ___',
    options: ['着火点', '沸点', '熔点', '冰点'], answer: 0,
    explain: '着火点是燃烧的必要条件',
    blank: { answerText: '着火点', bank: ['着火点', '沸点', '熔点', '冰点'] },
  },
  'geo-01': {
    q: '地球绕太阳公转一周约需要 ___ 天',
    options: ['365', '30', '24', '7'], answer: 0,
    explain: '一年≈365天',
    blank: { answerText: '365', bank: ['365', '30', '24', '7'] },
  },
  'bio-01': {
    q: '生物体结构和功能的基本单位是 ___',
    options: ['细胞', '组织', '器官', '系统'], answer: 0,
    explain: '细胞是生命的基本单位',
    blank: { answerText: '细胞', bank: ['细胞', '组织', '器官', '系统'] },
  },
  'bio-03': {
    q: '绿色植物通过 ___ 作用将光能转化为化学能',
    options: ['光合', '呼吸', '蒸腾', '吸收'], answer: 0,
    explain: '光合作用',
    blank: { answerText: '光合', bank: ['光合', '呼吸', '蒸腾', '吸收'] },
  },
  'geo-03': {
    q: '地图上的方向通常是"上北下南左___右东"',
    options: ['西', '东', '南', '北'], answer: 0,
    explain: '上北下南左西右东',
    blank: { answerText: '西', bank: ['西', '东', '南', '北'] },
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
    if (l.exercises.some((e) => e.type === 'blank')) continue;
    l.exercises.push({ ...spec, type: 'blank' });
    changed = true;
    added++;
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('已为 ' + added + ' 节课追加填空题');
