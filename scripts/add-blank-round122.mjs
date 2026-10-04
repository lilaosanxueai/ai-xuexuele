import fs from 'node:fs';
import path from 'node:path';

/**
 * 第122轮：为 20 节跨学科课各追加 1 道填空题，扩大双题型覆盖至 66 课。
 * 覆盖：历史4·道法3·语文2·英语2·生物2·地理2·音乐1·体育1·劳动1·艺术1·数学1
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const BLANKS = {
  // 历史
  'his-01': {
    q: '北京人使用 ___ 石器（打制/磨制）',
    options: ['打制', '磨制'], answer: 0,
    explain: '旧石器时代打制石器',
    blank: { answerText: '打制', bank: ['打制', '磨制'] },
  },
  'his-05': {
    q: '丝绸之路的起点是长安，终点到达 ___ 洲',
    options: ['欧', '美', '非', '大洋'], answer: 0,
    explain: '从长安到罗马（欧洲）',
    blank: { answerText: '欧', bank: ['欧', '美', '非', '大洋'] },
  },
  'his-11': {
    q: '隋朝大运河以 ___ 为中心',
    options: ['洛阳', '长安', '开封', '杭州'], answer: 0,
    explain: '北达涿郡南至余杭中心洛阳',
    blank: { answerText: '洛阳', bank: ['洛阳', '长安', '开封', '杭州'] },
  },
  'his-29': {
    q: '古埃及文明的象征是 ___（金字塔/长城）',
    options: ['金字塔', '长城'], answer: 0,
    explain: '法老陵墓',
    blank: { answerText: '金字塔', bank: ['金字塔', '长城'] },
  },
  // 道德与法治
  'eth-08': {
    q: '大脑缺氧超过 ___ 分钟开始不可逆损伤',
    options: ['4', '10', '20', '30'], answer: 0,
    explain: '黄金4分钟',
    blank: { answerText: '4', bank: ['4', '10', '20', '30'] },
  },
  'eth-09': {
    q: '一切法律不得同 ___ 相抵触',
    options: ['宪法', '刑法', '民法', '行政法'], answer: 0,
    explain: '宪法具有最高法律效力',
    blank: { answerText: '宪法', bank: ['宪法', '刑法', '民法', '行政法'] },
  },
  'eth-15': {
    q: '情绪 ABC 理论中 A 代表 ___',
    options: ['事件', '信念', '结果', '行动'], answer: 0,
    explain: 'A事件→B信念→C结果',
    blank: { answerText: '事件', bank: ['事件', '信念', '结果', '行动'] },
  },
  // 语文
  'chn-01': {
    q: '"举头望明月"的下一句是"低头思 ___"',
    options: ['故乡', '亲人', '家乡', '故人'], answer: 0,
    explain: '李白《静夜思》',
    blank: { answerText: '故乡', bank: ['故乡', '亲人', '家乡', '故人'] },
  },
  'chn-03': {
    q: '记叙文六要素中最核心的是 ___（时间/人物/事件）',
    options: ['事件', '时间', '人物', '地点'], answer: 0,
    explain: '事件是骨架其他是血肉',
    blank: { answerText: '事件', bank: ['事件', '时间', '人物', '地点'] },
  },
  // 英语
  'eng-01': {
    q: 'I am a student. 中的 am 是 be 动词的 ___ 形式',
    options: ['第一人称单数', '第二人称', '第三人称单数', '复数'], answer: 0,
    explain: 'I用am·you用are·he/she用is',
    blank: { answerText: '第一人称单数', bank: ['第一人称单数', '第二人称', '第三人称单数', '复数'] },
  },
  'eng-05': {
    q: 'What ___ this?（填 is/are）',
    options: ['is', 'are'], answer: 0,
    explain: 'this是单数用is',
    blank: { answerText: 'is', bank: ['is', 'are'] },
  },
  // 生物
  'bio-05': {
    q: '植物根吸收水分的主要部位是根 ___',
    options: ['毛区', '尖', '茎', '叶'], answer: 0,
    explain: '根毛区增大吸收面积',
    blank: { answerText: '毛区', bank: ['毛区', '尖', '茎', '叶'] },
  },
  'bio-09': {
    q: '胰岛素的作用是降低血糖，胰高血糖素的作用是 ___ 血糖',
    options: ['升高', '降低'], answer: 0,
    explain: '拮抗调节',
    blank: { answerText: '升高', bank: ['升高', '降低'] },
  },
  // 地理
  'geo-07': {
    q: '地球上经度每 15° 相差 ___ 小时',
    options: ['1', '2', '3', '4'], answer: 0,
    explain: '360°÷24h=15°/h',
    blank: { answerText: '1', bank: ['1', '2', '3', '4'] },
  },
  'geo-15': {
    q: '地中海气候的特点是夏季炎热干燥，冬季温和 ___',
    options: ['多雨', '干燥', '寒冷', '炎热'], answer: 0,
    explain: '雨热不同期',
    blank: { answerText: '多雨', bank: ['多雨', '干燥', '寒冷', '炎热'] },
  },
  // 音乐
  'mus-01': {
    q: 'do re mi fa sol la si do 中 mi 到 fa 之间是 ___ 音',
    options: ['半', '全'], answer: 0,
    explain: 'mi-fa和si-do是半音',
    blank: { answerText: '半', bank: ['半', '全'] },
  },
  // 体育
  'pe-01': {
    q: '运动前做 ___ 活动可以预防受伤',
    options: ['热身', '拉伸', '冲刺', '跳跃'], answer: 0,
    explain: '热身让肌肉温度升高',
    blank: { answerText: '热身', bank: ['热身', '拉伸', '冲刺', '跳跃'] },
  },
  // 劳动
  'la-01': {
    q: '植物生长需要阳光、水分和 ___',
    options: ['养分', '雨水', '空气', '温度'], answer: 0,
    explain: '阳光+水+养分（土壤中的矿物质）',
    blank: { answerText: '养分', bank: ['养分', '雨水', '空气', '温度'] },
  },
  // 艺术
  'art-01': {
    q: '色彩三要素：色相、明度和 ___',
    options: ['纯度', '亮度', '暗度', '灰度'], answer: 0,
    explain: '色相·明度·纯度（饱和度）',
    blank: { answerText: '纯度', bank: ['纯度', '亮度', '暗度', '灰度'] },
  },
  // 数学
  'math-15': {
    q: '圆的周长 = 2 × π × ___',
    options: ['半径', '直径', '面积', '周长'], answer: 0,
    explain: 'C = 2πr',
    blank: { answerText: '半径', bank: ['半径', '直径', '面积', '周长'] },
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
