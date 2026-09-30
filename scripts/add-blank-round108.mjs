import fs from 'node:fs';
import path from 'node:path';

/**
 * 第108轮：填空题第二批 12 道（补齐学科均衡：地理/音乐/艺术/语文/道法/体育/物理/英语/历史）。
 * 用法: npx tsx scripts/add-blank-round108.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const BLANKS = {
  'geo-17': {
    q: '地图上"上北下南"，那么左手边是 ___',
    options: ['西', '东', '南'], answer: 0,
    explain: '面朝北，左西右东',
    blank: { answerText: '西', bank: ['西', '东', '南'] },
  },
  'geo-23': {
    q: '多云的夜晚比晴朗的夜晚更 ___（ warmer/cooler 选一填：暖/凉）',
    options: ['暖', '凉', '冷'], answer: 0,
    explain: '云增强大气逆辐射，保温作用强',
    blank: { answerText: '暖', bank: ['暖', '凉', '冷'] },
  },
  'mus-06': {
    q: '二胡属于民乐四大家族中的 ___ 家族',
    options: ['拉弦', '吹管', '弹拨'], answer: 0,
    explain: '弓弦相摩发声',
    blank: { answerText: '拉弦', bank: ['拉弦', '吹管', '弹拨'] },
  },
  'art-07': {
    q: '人机工程学：椅子的高度约等于人的 ___ 长度（填：小腿）',
    options: ['小腿', '大腿', '手臂'], answer: 0,
    explain: '椅子高≈小腿长，脚能平放地面',
    blank: { answerText: '小腿', bank: ['小腿', '大腿', '手臂'] },
  },
  'chn-08': {
    q: '古人送别折柳，"柳"谐音"___"寄托挽留之意',
    options: ['留', '久', '悲'], answer: 0,
    explain: '柳=留',
    blank: { answerText: '留', bank: ['留', '久', '悲'] },
  },
  'eth-08': {
    q: '心肺复苏的黄金时间是大脑缺氧后 ___ 分钟内（填数字）',
    options: ['4', '10', '30'], answer: 0,
    explain: '黄金 4 分钟',
    blank: { answerText: '4' },
  },
  'pe-04': {
    q: '运球时眼睛应该看 ___ 而不是看球',
    options: ['前方', '地面', '天空'], answer: 0,
    explain: '抬头运球视野开阔',
    blank: { answerText: '前方', bank: ['前方', '地面', '天空'] },
  },
  'phy-10': {
    q: '密度公式 ρ = m ÷ V 中，m 代表 ___',
    options: ['质量', '体积', '密度'], answer: 0,
    explain: 'm=质量（克），V=体积（cm³）',
    blank: { answerText: '质量', bank: ['质量', '体积', '密度'] },
  },
  'phys-09': {
    q: '真空中电磁波（光）的速度约为 3×10 的 ___ 次方 m/s（填数字）',
    options: ['8', '6', '10'], answer: 0,
    explain: '3×10⁸ m/s',
    blank: { answerText: '8' },
  },
  'eng-27': {
    q: 'I like ___ (apple 的正确形式填空)',
    options: ['apples', 'apple', 'apples\''], answer: 0,
    explain: '可数名词复数加 s',
    blank: { answerText: 'apples' },
  },
  'his-34': {
    q: '当今世界格局：暂时"一超多强"，朝着 ___ 化方向发展',
    options: ['多极', '单极', '两极'], answer: 0,
    explain: '多极化趋势不可逆转',
    blank: { answerText: '多极', bank: ['多极', '单极', '两极'] },
  },
  'his-27': {
    q: '中英《南京条约》割让给英国的是香港 ___（填：岛）',
    options: ['岛', '半岛', '新界'], answer: 0,
    explain: '第一次鸦片战争只割香港岛',
    blank: { answerText: '岛', bank: ['岛', '半岛', '新界'] },
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
console.log('第二批已为 ' + added + ' 节课追加填空题');
