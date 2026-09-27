import fs from 'node:fs';

/** 第89轮B：学科页同年级课在学段分组内置顶 */
const p = 'apps/web/src/screens/SubjectScreen.tsx';
let s = fs.readFileSync(p, 'utf8');

// 1) bands 分组时应用 gradeSort
if (!s.includes('gradeSort')) {
  s = s.replace(
    "const bands = BAND_ORDER\n    .map((b) => ({ band: b, list: mine.filter((l) => (l.gradeBand ?? 'primary') === b) }))",
    "const bands = BAND_ORDER\n    // 同年级课在组内置顶（孩子先看到自己的课）\n    .map((b) => ({ band: b, list: gradeSort(mine.filter((l) => (l.gradeBand ?? 'primary') === b)) }))",
  );

  // 2) 组件前加 gradeSort 辅助函数（依赖组件内的 profile，改为接收 grade 参数）
  const helper = [
    '/** 同年级课排最前，其余按 order */',
    'function gradeSort(list: Lesson[], grade?: number): Lesson[] {',
    '  if (grade == null) return list;',
    '  return [...list].sort((a, b) => (b.grade === grade ? 1 : 0) - (a.grade === grade ? 1 : 0) || a.order - b.order);',
    '}',
    '',
  ].join('\n');
  s = s.replace('export default function SubjectScreen() {', helper + '\nexport default function SubjectScreen() {');

  fs.writeFileSync(p, s);
}

// 3) 调用处传 profile.grade
if (!s.includes('gradeSort(mine')) {
  // 已经通过第1步替换包含；保险检查
}
let s2 = fs.readFileSync(p, 'utf8');
s2 = s2.replace(
  'gradeSort(mine.filter((l) => (l.gradeBand ?? \'primary\') === b))',
  'gradeSort(mine.filter((l) => (l.gradeBand ?? \'primary\') === b), profile.grade)',
);
fs.writeFileSync(p, s2);

console.log('gradeSort wired:', fs.readFileSync(p, 'utf8').includes('profile.grade)'));
