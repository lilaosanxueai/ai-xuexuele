import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 第22轮课程全面修复：
 * 1) 111 节缺 grade 的课按教材学段+知识定位补年级
 * 2) 22 节缺 textbook 的课按学科配套教材补齐
 * 3) gradeBand 全局按 grade 重算（修 16 节学段矛盾）
 * 4) order 稳定重排 1..N（修 18 对 order 冲突，保持现有显示顺序）
 * 5) cross-97 浮力挑战：rho_liq 滑块下限 0.8→0.5（目标 0.5 原本永远拖不到）
 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

/** 缺年级课程的年级赋值（依据现有 band + 学科知识定位） */
const GRADE_MAP = {
  // 信息科技：小学段（冀教 3-4 年级体验 / 5-6 数据编码）
  'ai-01': 4, 'ai-02': 4, 'ai-03': 4,
  'ai-04': 7, 'ai-05': 7, 'ai-06': 7, 'ai-10': 7, 'ai-11': 7,
  'ai-07': 10, 'ai-08': 10, 'ai-09': 10,
  'basics-01': 3, 'basics-02': 3, 'basics-03': 3, 'basics-04': 3, 'basics-05': 3, 'basics-05-fix': 3,
  'extra-02': 4, 'extra-03': 7,
  'cross-57': 2, 'cross-58': 3, 'cross-59': 3, 'cross-60': 2, 'cross-61': 2,
  'cross-119': 10,
  // 数学（冀教小学 / 人教初中 / 人教A高中）
  'math-01': 1, 'math-02': 2, 'math-03': 3, 'math-04': 4, 'math-05': 5, 'math-06': 6,
  'math-13': 3, 'math-18': 9, 'math-19': 10, 'math-20': 10,
  'math-21': 2, 'math-22': 3, 'math-23': 3, 'math-24': 2, 'math-25': 2, 'math-26': 4,
  'math-27': 6, 'math-28': 6, 'math-29': 7,
  'math-36': 5, 'math-37': 4, 'math-38': 4, 'math-42': 8, 'math-50': 9, 'math-51': 3,
  'cross-02': 5, 'cross-05': 4, 'cross-112': 9,
  'extra-01': 4,
  'cross-76': 10, 'cross-78': 10, 'cross-79': 10,
  // 科学（冀人版）
  'cross-04': 5, 'cross-115': 3, 'cross-116': 2,
  'cross-127': 4, 'cross-128': 3, 'cross-35': 1, 'cross-36': 2,
  'cross-37': 3, 'cross-38': 1, 'cross-39': 2,
  // 语文
  'cross-40': 1, 'cross-41': 1, 'cross-42': 1, 'cross-43': 2,
  'cross-45': 3, 'cross-46': 3, 'cross-47': 4, 'cross-48': 2, 'cross-49': 2,
  'cross-50': 2, 'cross-51': 2, 'cross-19': 10,
  'cross-92': 7, 'cross-114': 10, 'cross-125': 8,
  // 英语
  'cross-14': 10, 'cross-15': 10,
  'eng-04': 3, 'eng-05': 3, 'eng-06': 7, 'eng-07': 7, 'eng-08': 7,
  // 音乐
  'cross-03': 2, 'cross-64': 2, 'cross-75': 10, 'mus-02': 2, 'mus-03': 7, 'cross-94': 7,
  // 艺术
  'cross-52': 4, 'cross-53': 1, 'cross-90': 2,
  // 劳动 / 体育
  'cross-55': 2, 'cross-86': 1, 'cross-87': 2,
  'cross-56': 2, 'cross-88': 3,
  // 道法
  'cross-65': 1,
  // 地理 / 生物 / 化学（高中）
  'geo-03': 4, 'geo-04': 7,
  'cross-12': 10, 'cross-13': 10,
  'cross-10': 10, 'cross-29': 9, 'cross-82': 9, 'cross-83': 10,
};

/** 缺教材课程的教材补齐（与同学科既有格式一致） */
const TEXTBOOK_MAP = {
  'ai-07': '冀教版信息科技（高中）', 'ai-08': '冀教版信息科技（高中）', 'ai-09': '冀教版信息科技（高中）',
  'cross-119': '冀教版信息科技（高中）',
  'cross-03': '人音版音乐（小学）', 'mus-02': '人音版音乐（小学）',
  'cross-60': '人音版音乐（小学）', 'cross-64': '人音版音乐（小学）',
  'mus-03': '人音版音乐（初中）', 'cross-94': '人音版音乐（初中）',
  'cross-75': '人音版音乐（高中）',
  'cross-52': '人美版美术（小学）', 'cross-53': '人美版美术（小学）', 'cross-90': '人美版美术（小学）',
  'cross-76': '人美版美术（高中）',
  'cross-55': '人教版劳动（小学）', 'cross-86': '人教版劳动（小学）', 'cross-87': '人教版劳动（小学）',
  'cross-56': '人教版体育与健康（小学）', 'cross-61': '人教版体育与健康（小学）', 'cross-88': '人教版体育与健康（小学）',
  // 小学没有独立地理教材，方位与地图内容在科学课里
  'geo-03': '冀人版科学（小学）',
};

const bandOf = (g) => (g <= 6 ? 'primary' : g <= 9 ? 'junior' : 'senior');

const lessons = [];
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  j._file = f;
  lessons.push(j);
}

let fixedGrade = 0, fixedTextbook = 0, fixedBand = 0, fixedChallenge = 0;

// 1) 年级 + 教材
for (const l of lessons) {
  if (GRADE_MAP[l.id] != null && typeof l.grade !== 'number') { l.grade = GRADE_MAP[l.id]; fixedGrade++; }
  if (TEXTBOOK_MAP[l.id] && !l.textbook) { l.textbook = TEXTBOOK_MAP[l.id]; fixedTextbook++; }
}

// 2) 学段按年级全局重算
for (const l of lessons) {
  if (typeof l.grade === 'number' && l.gradeBand !== bandOf(l.grade)) { l.gradeBand = bandOf(l.grade); fixedBand++; }
}

// 3) cross-97：浮力挑战滑块下限
const c97 = lessons.find((l) => l.id === 'cross-97');
const rhoLiq = c97?.lab?.params?.find((p) => p.name === 'rho_liq');
if (rhoLiq && rhoLiq.min > 0.5) { rhoLiq.min = 0.5; fixedChallenge++; }

// 4) order 稳定重排：按现有 (order, 文件名) 排序后编 1..N，保持用户看到的顺序不变
const sorted = [...lessons].sort((a, b) => a.order - b.order || a._file.localeCompare(b._file));
sorted.forEach((l, i) => { l.order = i + 1; });

// 写回（LF + 2 空格缩进 + 末尾换行，与现有文件一致）
for (const l of sorted) {
  const f = l._file;
  delete l._file;
  fs.writeFileSync(path.join(D, f), JSON.stringify(l, null, 2) + '\n', 'utf8');
}

console.log(`补年级 ${fixedGrade} 节，补教材 ${fixedTextbook} 节，修学段 ${fixedBand} 节，修挑战 ${fixedChallenge} 个，order 重排 ${sorted.length} 节`);
