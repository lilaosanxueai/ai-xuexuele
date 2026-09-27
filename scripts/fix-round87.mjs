import fs from 'node:fs';
import path from 'node:path';

/**
 * 第87轮：A. 给 8 节 SVG 课补探索问题；B. 新增高中历史 2 节（his-27/28）。
 * 用法: npx tsx scripts/fix-round87.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

// A. 探索问题补齐（贴合各课演示内容）
const EXPLORE = {
  'ai-07': [
    '为什么折半 7 次就一定能找到？',
    '目标数是 1 或 100 时，走的次数一样吗？',
    '如果是 1~1000，最多要几次？',
  ],
  'ai-08': [
    '第 1 趟后最大的 3 一定在哪一格？',
    '5 个数最少要几趟才有序？',
    '如果一开始就有序，还要比较几次？',
  ],
  'ai-09': [
    'n 翻 10 倍，三种算法各慢多少？',
    '为什么二分只多用一步？',
    '把 n 拖到 1000，红条还画得下吗？',
  ],
  'cross-15': [
    'one 到 five 里哪个字母出现最多？',
    'three 比 two 多了什么发音变化？',
    '试着从 five 倒着数回去！',
  ],
  'cross-75': [
    '升高 6 个半音时频率大约翻了多少？',
    '为什么钢琴上 12 个半音一组？',
    '半音比例如果改成 1.05 会怎样？',
  ],
  'cross-76': [
    '量一量：肚脐到脚的距离和身高接近什么比？',
    '为什么 0.618 看起来最舒服？',
    '找找生活里 3 处黄金分割',
  ],
  'cross-119': [
    '哪个月份的柱子最高，为什么？',
    '如果数据都相同，图会是什么样？',
    '柱子的宽窄影响读数吗？',
  ],
  'extra-03': [
    '把 move(110) 改成 move(80)，图形怎么变？',
    '循环 4 次改成 3 次，画出来是什么？',
    'turn_right 改成 turn_left 会怎样？',
  ],
};

// B. 高中历史两节（纲要上·近代）
const L = (o) => ({
  toolbox: [],
  actor: { costume: o.emoji, x: 0, y: 0 },
  targets: [],
  tasks: [
    { id: 'e0', text: '探索：' + o.explore[0], check: { type: 'manual' }, hintPrompts: ['把滑块拖到两个极端对比观察', '用「因为…所以…」把发现写成一句话'] },
    { id: 'e1', text: '探索：' + o.explore[1], check: { type: 'manual' }, hintPrompts: ['把滑块拖到两个极端对比观察', '用「因为…所以…」把发现写成一句话'] },
    { id: 'e2', text: '探索：' + o.explore[2], check: { type: 'manual' }, hintPrompts: ['先做几组对比再下结论', '把发现记进「我的发现」'] },
    { id: 'quiz', text: '完成随堂小练', check: { type: 'manual' }, hintPrompts: ['答案都藏在卡片和讲解里'] },
  ],
  celebrate: '新知识到手！',
  island: 'cross',
  subjectArea: '历史',
  ...o,
  lab: { params: [o.param] },
  interact: { views: o.views, explore: o.explore },
});

const LESSONS = [
  L({
    id: 'his-27', order: 600, title: '列强侵略与民族危机：从鸦片战争到甲午', emoji: '⚓', gradeBand: 'senior', grade: 10, textbook: '统编版历史（中外历史纲要上）',
    curriculum: { module: '晚清时期的内忧外患与救亡图存', points: ['两次鸦片战争', '甲午战争', '半殖民地化加深'] },
    story: '1840 年英国的军舰来了，签一份条约走人；1894 年，同一个英国已把军舰卖给了日本——当年跟老师打的日本学生，在黄海把北洋水师打成了碎片。半殖民地化的四十年，是一条不断下探的曲线。',
    goals: ['梳理两次鸦片战争与甲午战争的关键史实', '理解半殖民地半封建化的加深过程', '用全球视野解释「为什么总挨打」'],
    aiIntro: '⚓ 把四次战败连成曲线，看清危机怎样步步加深！',
    param: { name: 'w', label: '战争', min: 1, max: 3, step: 1, value: 1 },
    explore: ['第二次鸦片战争比第一次多了什么损失？', '《马关条约》与《南京条约》哪条危害更深？', '甲午战败为什么刺激了全民族的觉醒？'],
    views: [
      { when: 1, title: '两次鸦片战争', subtitle: '1840—1842 · 1856—1860', color: 'rose', emoji: '🚢', blocks: [
        { kind: 'compare', title: '两次战争对比', items: [
          { label: '第一次', value: '1840—1842 · 《南京条约》：割香港岛·五口通商·协定关税' },
          { label: '第二次', value: '1856—1860 · 英法联军火烧圆明园；《天津》《北京》条约：增开口岸·内河航行·割九龙司' },
        ] },
        { kind: 'info', icon: '⚖️', title: '影响', text: '中国开始沦为半殖民地半封建社会；领事裁判权·最惠国待遇捆绑加深' },
        { kind: 'highlight', text: '「师夷长技以制夷」——林则徐魏源睁开眼看世界' },
      ] },
      { when: 2, title: '甲午战争', subtitle: '1894—1895 · 洋务运动的考试', color: 'red', emoji: '⚔️', blocks: [
        { kind: 'info', icon: '🚩', title: '经过', text: '丰岛海战→平壤战役→黄海海战（邓世昌殉国）→威海卫北洋水师全军覆没' },
        { kind: 'info', icon: '📜', title: '《马关条约》', text: '割台湾及澎湖·赔款二亿两·允许日本在华设厂——侵略由商品输出变资本输出' },
        { kind: 'info', icon: '📉', title: '影响', text: '半殖民地化大大加深；列强掀起瓜分狂潮，民族危机空前严重' },
        { kind: 'highlight', text: '三十年洋务「自强」一朝证明破产——器物之路走不通' },
      ] },
      { when: 3, title: '瓜分狂潮与觉醒', subtitle: '1898 前后 · 危机催生变革', color: 'violet', emoji: '🌏', blocks: [
        { kind: 'info', icon: '🗺️', title: '瓜分狂潮', text: '强租租借地、划分「势力范围」；美国提出「门户开放」利益均沾' },
        { kind: 'info', icon: '📣', title: '公车上书', text: '康有为梁启超发动维新变法（1898 百日维新），救亡图存成为时代最强音' },
        { kind: 'info', icon: '🥋', title: '义和团', text: '农民反帝运动兴起，八国联军侵华（1900）→《辛丑条约》赔款 4.5 亿两' },
        { kind: 'highlight', text: '《辛丑条约》= 完全沦为半殖民地半封建社会，清政府成了「洋人的朝廷」' },
      ] },
    ],
    teach: { sections: [
      { title: '两次鸦片战争', body: '【根本原因】工业革命后英国要求打开中国市场。\n【导火索】中国禁烟（虎门销烟）/修约要求未满足。\n【结果】《南京条约》《天津条约》《北京条约》——领土·主权·关税·司法主权接连丧失。\n【认识】战败根源：封建制度落后+闭关自守+武备废弛。' },
      { title: '甲午中日战争', body: '【背景】日本明治维新后蓄谋侵华；清政府腐败避战。\n【关键战役】黄海海战（邓世昌）·威海卫（北洋水师覆灭）。\n【《马关条约》】割台湾·赔二亿两·开重庆沙市苏杭为商埠·允许设厂。\n【影响】半殖民地化大大加深；引发瓜分狂潮与民族觉醒。' },
      { title: '危机与应对', body: '【瓜分狂潮】租借地+势力范围；门户开放（美）。\n【应对】维新变法（制度层面救亡）→失败；义和团（自发反帝）→被镇压。\n【《辛丑条约》1901】赔款 4.5 亿·使馆区·拆炮台·惩办「祸首」——清政府完全成为列强统治工具。' },
    ], examples: [
      { q: '半殖民地化是怎样「步步加深」的？', steps: ['1842 南京条约：开始沦为', '1860 北京条约：加深一步', '1895 马关条约：大大加深', '1901 辛丑条约：完全沦为'], tip: '四条约四级台阶' },
      { q: '《马关条约》允许设厂意味着什么？', steps: ['此前列强主要卖商品（商品输出）', '此后可直接在华开工厂', '资本输出：控制中国经济命脉', '民族工业生存空间被挤压'], tip: '从卖货到开厂' },
    ], mistakes: ['认为火烧圆明园发生在第一次鸦片战争（第二次，1860 英法联军）', '认为《辛丑条约》割地（不割地，但赔款驻军惩办官员——控制内政）'] },
    exercises: [
      { q: '火烧圆明园发生在哪次战争？', options: ['第二次鸦片战争', '第一次鸦片战争', '甲午战争', '八国联军侵华'], answer: 0, explain: '1860 年英法联军攻入北京' },
      { q: '黄海海战中壮烈殉国的致远舰管带是？', options: ['邓世昌', '林则徐', '关天培', '丁汝昌'], answer: 0, explain: '「此日漫挥天下泪，有公足壮海军威」' },
      { q: '《马关条约》中最有利于列强资本输出的是？', options: ['允许日本在华设厂', '割台湾', '赔款二亿两', '开放苏州杭州'], answer: 0, explain: '设厂权使侵略深入生产领域' },
      { q: '中国完全沦为半殖民地半封建社会的标志是？', options: ['《辛丑条约》签订', '《马关条约》签订', '《南京条约》签订', '火烧圆明园'], answer: 0, explain: '1901 年清政府成为列强统治工具' },
    ],
  }),
  L({
    id: 'his-28', order: 601, title: '辛亥革命与民国初年：共和的试验', emoji: '🏛️', gradeBand: 'senior', grade: 10, textbook: '统编版历史（中外历史纲要上）',
    curriculum: { module: '辛亥革命与中华民国的建立', points: ['革命的酝酿', '民国的建立', '变与不变'] },
    story: '1912 年 2 月 12 日，宣统帝退位诏书颁下；次日，孙中山提出辞呈，袁世凯接任临时大总统——从皇帝到总统只用了四个月。剪了辫子的中国，真的共和了吗？',
    goals: ['梳理辛亥革命的酝酿与爆发', '理解《临时约法》的制度设计', '辩证评价「变与不变」'],
    aiIntro: '🏛️ 共和元年：一场划时代的政治试验！',
    param: { name: 's', label: '观察维度', min: 1, max: 3, step: 1, value: 1 },
    explore: ['资产阶级革命派为什么放弃改良选择革命？', '《临时约法》为什么把总统制改成内阁制？', '辛亥革命「变」了什么、「没变」什么？'],
    views: [
      { when: 1, title: '革命的酝酿', subtitle: '改良失败之后', color: 'blue', emoji: '📋', blocks: [
        { kind: 'info', icon: '💔', title: '改良破产', text: '戊戌变法百日夭折；清末「新政」「预备立宪」皇族内阁暴露假立宪' },
        { kind: 'info', icon: '📖', title: '思想动员', text: '孙中山《民报》发刊词阐发三民主义；革命派与保皇派论战' },
        { kind: 'info', icon: '💣', title: '武装尝试', text: '黄花岗起义等多次起义虽败，革命党人「愈挫愈奋」' },
        { kind: 'highlight', text: '保路运动点燃导火索——武汉兵力空虚，武昌起义时机成熟' },
      ] },
      { when: 2, title: '民国与约法', subtitle: '制度设计的一次冲刺', color: 'amber', emoji: '📜', blocks: [
        { kind: 'info', icon: '🏛️', title: '中华民国建立', text: '1912.1.1 孙中山就任临时大总统，定都南京，改用公历' },
        { kind: 'info', icon: '⚖️', title: '《临时约法》', text: '主权在民·国民平等·三权分立·责任内阁制——中国第一部资产阶级宪法性文件' },
        { kind: 'info', icon: '🎭', title: '为什么设内阁制', text: '为限制袁世凯权力——把总统制改成责任内阁制' },
        { kind: 'highlight', text: '帝制终结+共和立宪：两千年政治形态的根本转折' },
      ] },
      { when: 3, title: '变与不变', subtitle: '胜利与局限的双重奏', color: 'rose', emoji: '⚖️', blocks: [
        { kind: 'compare', title: '变的清单', items: [
          { label: '变', value: '帝制→共和·辫子剪了·民主共和观念深入人心' },
          { label: '没变', value: '社会性质仍是半殖民地半封建·封建土地制度依旧' },
          { label: '反转', value: '袁世凯窃取果实→复辟帝制闹剧 83 天收场' },
        ] },
        { kind: 'info', icon: '🧭', title: '新文化运动', text: '共和招牌下思想仍被旧文化束缚——陈独秀举「民主」「科学」大旗再启蒙' },
        { kind: 'highlight', text: '旧民主主义革命走到尽头，历史等待新的领导阶级与新的思想' },
      ] },
    ],
    teach: { sections: [
      { title: '革命的条件', body: '【经济】民族资本主义初步发展，民族资产阶级壮大。\n【组织】兴中会→同盟会（第一个全国性资产阶级革命政党）。\n【思想】三民主义·与保皇派论战·《民报》。\n【时机】保路运动+湖北新军倾向革命。' },
      { title: '民国初建', body: '【1911.10.10】武昌起义→各省独立。\n【1912.1.1】中华民国临时政府成立（南京）。\n【1912.2.12】宣统帝退位，清朝结束。\n【1912.3】《中华民国临时约法》颁布：主权在民·三权分立·责任内阁。' },
      { title: '局限与转折', body: '【胜利】结束帝制·确立共和·观念革新·推动社会经济与风俗变化。\n【局限】果实被袁世凯窃取；反帝反封建任务未完成；社会性质未变。\n【后事】二次革命·护国运动挫败复辟；军阀割据——新文化运动与新民主主义革命登场。' },
    ], examples: [
      { q: '为什么说《临时约法》是「因人设法」？', steps: ['原定总统制（孙中山任总统）', '袁世凯将继任', '临时约法改行责任内阁制', '用制度束缚袁世凯——也留下府院之争隐患'], tip: '制度让位于人事' },
      { q: '「民主共和观念深入人心」如何体现？', steps: ['袁世凯复辟 83 天即败', '张勋复辟 12 天收场', '此后无人敢公开称帝', '观念的变革最深刻也最持久'], tip: '开历史倒车者亡' },
    ], mistakes: ['认为辛亥革命失败=一无是处（帝制终结与观念革新是伟大胜利）', '认为《临时约法》一直是总统制（临时改责任内阁制）'] },
    exercises: [
      { q: '中华民国临时政府成立于？', options: ['1912 年 1 月 1 日', '1911 年 10 月 10 日', '1912 年 2 月 12 日', '1915 年 12 月'], answer: 0, explain: '孙中山在南京就任临时大总统' },
      { q: '《中华民国临时约法》确立的政治体制是？', options: ['责任内阁制', '总统制', '君主立宪制', '议行合一'], answer: 0, explain: '为限制袁世凯而设' },
      { q: '袁世凯复辟帝制失败说明？', options: ['民主共和观念深入人心', '袁世凯兵力不足', '列强反对', '北洋军哗变'], answer: 0, explain: '逆历史潮流者必败' },
      { q: '辛亥革命「不变」的是？', options: ['半殖民地半封建社会性质', '国家元首称号', '政体形式', '历法'], answer: 0, explain: '社会性质与主要矛盾未变' },
    ],
  }),
];

// A. 补探索问题
let patched = 0;
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    const ex = EXPLORE[l.id];
    if (!ex || l.interact) continue;
    if (!l.lab) l.lab = {};
    l.lab.explore = ex;
    // 同步任务卡文案
    l.tasks = (l.tasks ?? []).map((t) => t.id?.startsWith('e') && !t.optional
      ? { ...t, text: '探索：' + (ex[Number(t.id.slice(1))] ?? t.text) }
      : t);
    changed = true;
    patched++;
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('explore 补齐:', patched, '节');

// B. 新课
for (const l of LESSONS) {
  fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
}
console.log('已生成 2 节高中历史:', LESSONS.map((l) => l.id).join(', '));
