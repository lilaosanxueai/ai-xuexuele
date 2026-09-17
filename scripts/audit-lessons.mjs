import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 课程全面体检：结构 / 学段 / 课标 / 教材 / 实验 / 随堂题，输出分类问题清单 */
const DIR = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const KNOWN_SUBJECTS = ['数学', '物理', '化学', '生物', '地理', '科学', '语文', '英语', '音乐', '道德与法治', '劳动', '体育与健康', '艺术', '信息科技'];
const LAB_SUBJECTS = new Set(['数学', '物理', '化学', '生物', '地理', '科学']);
const SUBJECT_KEYWORD = {
  '数学': ['数学'], '物理': ['物理'], '化学': ['化学'], '生物': ['生物'], '地理': ['地理'],
  '科学': ['科学'], '语文': ['语文'], '英语': ['英语', 'PEP'], '音乐': ['音乐'],
  '道德与法治': ['道德与法治', '道法'], '劳动': ['劳动'], '体育与健康': ['体育'],
  '艺术': ['美术', '艺术', '美育'], '信息科技': ['信息科技', '信息'],
};

const issues = { structural: [], stage: [], curriculum: [], textbook: [], lab: [], exercise: [], duplicate: [] };
const lessons = [];
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8')); }
  catch (e) { issues.structural.push(`${f}: JSON 解析失败 ${e.message}`); continue; }
  j._file = f;
  lessons.push(j);
}

const byId = new Map(lessons.map((l) => [l.id, l]));
const seenTitles = new Map();

// 模块 → 出现过的学科分布（找跨学科污染）
const moduleSubjects = new Map();
for (const l of lessons) {
  const m = l.curriculum?.module;
  if (!m) continue;
  if (!moduleSubjects.has(m)) moduleSubjects.set(m, new Map());
  const cnt = moduleSubjects.get(m);
  cnt.set(l.subjectArea, (cnt.get(l.subjectArea) ?? 0) + 1);
}

for (const l of lessons) {
  const tag = `${l.id}(${l.title})`;
  const add = (cat, msg) => issues[cat].push(`${tag}: ${msg}`);

  // ---- A 结构 ----
  if (!l.title?.trim()) add('structural', '缺 title');
  if (!l.emoji?.trim()) add('structural', '缺 emoji');
  if (!l.story?.trim() || l.story.trim().length < 10) add('structural', `story 缺失或过短 (${l.story?.trim().length ?? 0} 字)`);
  if (!Array.isArray(l.goals) || l.goals.length === 0) add('structural', '缺 goals');
  if (!l.aiIntro?.trim()) add('structural', '缺 aiIntro');
  if (!l.celebrate?.trim()) add('structural', '缺 celebrate');
  if (typeof l.order !== 'number') add('structural', '缺 order');
  if (!KNOWN_SUBJECTS.includes(l.subjectArea)) add('structural', `subjectArea「${l.subjectArea}」不在 14 学科内`);

  // ---- B 学段 ----
  const g = l.grade;
  if (typeof g !== 'number' || g < 1 || g > 12) add('stage', `grade 非法: ${g}`);
  else {
    const expect = g <= 6 ? 'primary' : g <= 9 ? 'junior' : 'senior';
    if (l.gradeBand !== expect) add('stage', `gradeBand(${l.gradeBand}) 与 grade(${g}) 不符，应为 ${expect}`);
  }

  // ---- C 课标 ----
  const mod = l.curriculum?.module;
  const pts = l.curriculum?.points;
  if (!mod?.trim()) add('curriculum', '缺 curriculum.module');
  else {
    const dist = moduleSubjects.get(mod);
    if (dist && dist.size > 1) {
      const sorted = [...dist.entries()].sort((a, b) => b[1] - a[1]);
      if (sorted[0][0] !== l.subjectArea) {
        add('curriculum', `module「${mod}」主要属于 ${sorted.map(([s, n]) => `${s}×${n}`).join('/')}，与本体学科 ${l.subjectArea} 不符`);
      }
    }
  }
  if (!Array.isArray(pts) || pts.length === 0) add('curriculum', '缺 curriculum.points');
  else if (pts.some((p) => !p?.trim() || p.trim().length < 2)) add('curriculum', 'curriculum.points 有空/过短项');

  // ---- D 教材 ----
  if (!l.textbook?.trim()) add('textbook', '缺 textbook');
  else {
    // 小学没有独立地理教材，方位/地图内容在科学课（冀人版科学）里，属合理标注
    const kws = l.subjectArea === '地理' && l.gradeBand === 'primary' ? ['地理', '科学'] : (SUBJECT_KEYWORD[l.subjectArea] ?? []);
    if (kws.length && !kws.some((k) => l.textbook.includes(k))) add('textbook', `textbook「${l.textbook}」与学科 ${l.subjectArea} 对不上`);
  }

  // ---- E 实验室 ----
  const code = l.lab?.code ?? l.starterCode ?? '';
  if (LAB_SUBJECTS.has(l.subjectArea)) {
    if (!l.lab && !l.starterCode) add('lab', '理科学科但既无 lab 也无 starterCode');
  }
  if (l.lab) {
    if (!code) add('lab', 'lab 存在但无演示代码');
    for (const p of l.lab.params ?? []) {
      const re = new RegExp(`^(\\s*)(${p.name})\\s*=`, 'm');
      if (!re.test(code ?? '')) add('lab', `参数 ${p.name}(${p.label}) 不在代码顶层赋值里，滑块无效`);
      if (p.min >= p.max) add('lab', `参数 ${p.name} min>=max`);
      if (p.step <= 0) add('lab', `参数 ${p.name} step<=0`);
    }
    for (const [i, ch] of (l.lab.challenges ?? []).entries()) {
      for (const [name, target] of Object.entries(ch.params ?? {})) {
        const p = (l.lab.params ?? []).find((x) => x.name === name);
        if (!p) { add('lab', `挑战${i + 1} 目标参数 ${name} 不在 params 里`); continue; }
        if (target < p.min - 1e-9 || target > p.max + 1e-9) add('lab', `挑战${i + 1} ${name} 目标 ${target} 超出滑块范围 [${p.min},${p.max}]`);
        const stepsFromMin = (target - p.min) / p.step;
        if (Math.abs(stepsFromMin - Math.round(stepsFromMin)) > 1e-6) add('lab', `挑战${i + 1} ${name} 目标 ${target} 不是从 ${p.min} 起步长 ${p.step} 的整数倍——永远拖不到，挑战无法达成`);
      }
    }
    if (l.codeLesson === true && !l.starterCode) add('lab', 'codeLesson=true 但无 starterCode');
  }

  // ---- F 随堂题 ----
  const ex = l.exercises;
  if (!Array.isArray(ex) || ex.length === 0) add('exercise', '缺随堂题');
  else {
    for (const [i, q] of ex.entries()) {
      const t = `题${i + 1}`;
      if (!q.q?.trim()) add('exercise', `${t} 缺题干`);
      if (!Array.isArray(q.options) || q.options.length !== 4) add('exercise', `${t} 选项数=${q.options?.length}（应 4）`);
      if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) add('exercise', `${t} answer=${q.answer} 非法`);
      if (!q.explain?.trim()) add('exercise', `${t} 缺解析`);
    }
  }

  // ---- G 重复 ----
  const titleKey = l.title.trim();
  if (seenTitles.has(titleKey)) add('duplicate', `与 ${seenTitles.get(titleKey)} 标题重复`);
  else seenTitles.set(titleKey, l.id);
}

// order 唯一性
const orders = new Map();
for (const l of lessons) orders.set(l.order, (orders.get(l.order) ?? 0) + 1);
for (const [o, n] of orders) if (typeof o === 'number' && n > 1) issues.structural.push(`order=${o} 被 ${n} 节课共用`);

// id 唯一性（文件名可以带后缀，但 id 必须唯一）
const idCounts = new Map();
for (const l of lessons) idCounts.set(l.id, (idCounts.get(l.id) ?? 0) + 1);
for (const [id, n] of idCounts) if (n > 1) issues.structural.push(`id「${id}」被 ${n} 个文件重复定义`);

let total = 0;
const lines = [];
for (const [cat, list] of Object.entries(issues)) {
  lines.push(`===== ${cat} (${list.length}) =====`);
  for (const line of list) lines.push('  ' + line);
  lines.push('');
  total += list.length;
}
lines.push(`总计 ${total} 个问题，${lessons.length} 节课`);
fs.writeFileSync(new URL('../audit-report.txt', import.meta.url), lines.join('\n'), 'utf-8');
for (const [cat, list] of Object.entries(issues)) console.log(`${cat}: ${list.length}`);
console.log(`TOTAL: ${total} (report: audit-report.txt)`);
