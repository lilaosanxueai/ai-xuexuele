/**
 * 课标真实化脚本（幂等可重跑）：
 * 把 226 课的 curriculum 从「信息科技课标模板」（身边的算法/过程与控制/...）
 * 升级为各学科真实课标模块；知识点优先采用 subject.points（真实学科知识点）。
 *
 * 用法：npx tsx scripts/upgrade-curriculum.ts [--dry]
 * 信息科技学科的课程课标本就正确，跳过不改。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content/lessons');
const DRY = process.argv.includes('--dry');

/** 写入前校验目标在课程目录内（root 边界校验，防路径穿越） */
function safeWrite(name: string, data: string): void {
  const file = path.resolve(DIR, name);
  if (!file.startsWith(DIR + path.sep) || !file.endsWith('.json')) {
    throw new Error(`非法目标文件：${name}`);
  }
  fs.writeFileSync(file, data);
}

/** 学科课标模块判定规则：按序匹配 subject.name/title/points/textbook/goals，命中即归类 */
const RULES: Record<string, [RegExp, string][]> = {
  数学: [
    [/统计|概率|平均数|方差|频率|数据|树状图|二项|随机|可视化|抽样/, '统计与概率'],
    [/三角|圆|面积|体积|周长|图形|几何|坐标|对称|全等|相似|向量|勾股|平行|平移|旋转|椭圆|解析|尺规|影子|阶梯|容斥|黄金分割/, '图形与几何'],
    [/归纳|推理|证明|文化|莫比乌斯|蒙特卡洛|蒙提霍尔|人工智能/, '综合与实践'],
    [/数|加减|乘|除|负|方程|函数|不等式|因式|整式|分式|二次|幂|指数|对数|数列|集合|排列|组合|复利|时间|分配|同类项|代入|震级|密码/, '数与代数'],
  ],
  语文: [
    [/写作|作文|表达|发布|演讲|三幕|结构创作/, '表达与交流'],
    [/部首|偏旁|多音字|标点|写字|识字|对联|对韵/, '识字与写字'],
    [/古诗|文言|成语|名著|鉴赏|意象|炼字|修辞|阅读|课文|捕鸟|诗句|咏鹅|悯农|春晓|刻舟|掩耳|推敲/, '阅读与鉴赏'],
  ],
  英语: [
    [/写作|阅读|语篇/, '阅读与写作'],
    [/口语|对话|情景|交际|问候|介绍|问答|购物/, '听说活动'],
    [/字母|数字|颜色|家庭|身体|单词|句型|词汇|歌|My /, '词汇与句型'],
  ],
  物理: [
    [/质量|密度/, '物质'],
    [/能量|功|功率|机械能|比热|热|内能|温度|电|电路|欧姆/, '能量'],
    [/力|运动|牛顿|摩擦|浮力|压强|惯性|引力|抛体|振动|简谐|机械|杠杆|滑轮|声|光|透镜|折射|全反射|回声|测距|成像/, '运动和相互作用'],
    [/数据|测量|实验|称量/, '实验探究'],
  ],
  化学: [
    [/分子|原子|元素|结构|构成|周期律|周期表/, '物质的组成与结构'],
    [/材料|社会|生活|燃料|能源|环保/, '化学与社会'],
    [/物态|熔化|凝固|燃烧|反应|方程式|配平|酸|碱|盐|金属|溶液|溶解度|空气|氧气|变化|试剂/, '物质的性质与变化'],
  ],
  生物: [
    [/细胞|结构层次|显微镜/, '生物体的结构层次'],
    [/光合|呼吸作用|绿色植物|植物|叶|花|种子/, '生物圈中的绿色植物'],
    [/人体|食物|消化|循环|呼吸|神经|激素|调节|健康|传染病|生命活动/, '生物圈中的人'],
    [/遗传|基因|DNA|进化|变异|孟德尔|自然选择/, '遗传与进化'],
    [/生态|环境|群落|食物链|土壤|自然观察|动物分类/, '生物与环境'],
    [/分类|类群|多样性/, '生物的多样性'],
    [/水循环|磁铁|健康|生长/, '生命科学'],
  ],
  地理: [
    [/中国|乡土|华北|河北|三级阶梯/, '中国地理'],
    [/地球|地图|地形|海拔|纬度|经线|时区|等高线|三要素|宇宙|大气|受热|环球/, '地球与地图'],
    [/天气|气候|降水|气温|符号|海洋|大洲/, '世界地理'],
  ],
  科学: [
    [/水循环|土壤|地球|宇宙|天气|太阳|季节|月相|星空/, '地球与宇宙科学'],
    [/健康|身体|生命|生长|动物|植物/, '生命科学'],
    [/探究|实验|制作|工程|技术/, '技术与工程'],
    [/物质|力|光|磁|声音|影|电|热|水|溶解|沉浮/, '物质科学'],
  ],
  音乐: [
    [/鉴赏|欣赏|听赏|评述/, '欣赏·评述'],
    [/编创|创作|作曲/, '创造'],
    [/乐理|节奏|拍号|音阶|音高|音色|旋律|唱|奏|平均律|歌/, '表现'],
  ],
  '道德与法治': [
    [/安全|健康|网络|生命|防护/, '生命安全与健康教育'],
    [/规则|秩序|社区|环保|绿色|公共|文明|排队|传统|文化|责任/, '道德教育'],
    [/权利|义务|法律|未成年人保护/, '法治教育'],
  ],
  艺术: [
    [/鉴赏|欣赏|评述/, '欣赏·评述'],
    [/设计|图案|应用|色彩|视觉/, '设计·应用'],
    [/造型|构图|表现|绘画|对称|分割|临摹/, '造型·表现'],
  ],
  劳动: [
    [/班级|服务|校园|公益|志愿/, '服务性劳动'],
    [/整理|书包|自理|家务|生活|家庭|计时/, '日常生活劳动'],
    [/生产|种植|养殖|手工|制作/, '生产劳动'],
  ],
  '体育与健康': [
    [/健康|保健|预防|作息/, '健康教育'],
    [/热身|体能|锻炼|柔韧|跳绳|跑步/, '体能与健身'],
    [/球|操|技能|泳|武术|游戏/, '运动技能'],
  ],
};

/** 学科默认模块（关键词全部未命中时兜底，尽量少用） */
const FALLBACK: Record<string, string> = {
  数学: '数与代数',
  语文: '阅读与鉴赏',
  英语: '词汇与句型',
  物理: '运动和相互作用',
  化学: '物质的性质与变化',
  生物: '生物与环境',
  地理: '地球与地图',
  科学: '物质科学',
  音乐: '表现',
  '道德与法治': '道德教育',
  艺术: '造型·表现',
  劳动: '日常生活劳动',
  '体育与健康': '体能与健身',
};

interface Curriculum { stage: string; module: string; points: string[] }

function classifyModule(area: string, haystack: string): { module: string; via: 'rule' | 'fallback' } {
  const rules = RULES[area];
  if (rules) {
    for (const [re, mod] of rules) {
      if (re.test(haystack)) return { module: mod, via: 'rule' };
    }
  }
  return { module: FALLBACK[area] ?? '综合学习', via: 'fallback' };
}

let changed = 0;
let untouched = 0;
const fallbackLessons: string[] = [];
const moduleDist: Record<string, number> = {};

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  const l = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const area = l.subjectArea ?? '信息科技';
  // 信息科技课标本来就正确，跳过
  if (area === '信息科技' || !l.curriculum) {
    untouched++;
    continue;
  }
  // 匹配源只用子领域（"·"后部分），避免学科名本身（如"道德与法治"含"法"）污染关键词匹配
  const subjectPart = l.subject
    ? `${l.subject.name.split('·').slice(1).join('·') || l.subject.name} ${(l.subject.points ?? []).join(' ')}`
    : '';
  const haystack = `${subjectPart} ${l.title} ${l.textbook ?? ''} ${(l.goals ?? []).join(' ')}`;
  const { module: mod, via } = classifyModule(area, haystack);
  if (via === 'fallback') fallbackLessons.push(`${l.id} ${area} ${l.title}`);

  const next: Curriculum = {
    stage: l.curriculum.stage,
    module: mod,
    // 知识点优先用真实的 subject.points；无 subject 的课保留原值
    points: l.subject?.points?.length ? l.subject.points : l.curriculum.points,
  };
  const key = `${area}·${mod}`;
  moduleDist[key] = (moduleDist[key] ?? 0) + 1;
  if (next.module !== l.curriculum.module || JSON.stringify(next.points) !== JSON.stringify(l.curriculum.points)) {
    l.curriculum = next;
    changed++;
    if (!DRY) safeWrite(f, JSON.stringify(l, null, 2) + '\n');
  } else {
    untouched++;
  }
}

console.log(`\n=== 课标真实化${DRY ? '（dry run）' : ''} ===`);
console.log(`改写 ${changed} 课 · 保留 ${untouched} 课`);
console.log('\n-- 学科×课标模块分布 --');
Object.entries(moduleDist).sort((a, b) => a[0].localeCompare(b[0], 'zh')).forEach(([k, n]) => console.log(String(n).padStart(3), k));
if (fallbackLessons.length) {
  console.log('\n-- 未命中规则、用默认模块的课 --');
  fallbackLessons.forEach((s) => console.log('  ', s));
} else {
  console.log('\n全部课程均按关键词规则命中课标模块，无默认兜底');
}
