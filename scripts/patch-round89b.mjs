import fs from 'node:fs';

/** 第89轮B2：处理 CRLF 的学科页 gradeSort 接线 */
const p = 'apps/web/src/screens/SubjectScreen.tsx';
let s = fs.readFileSync(p, 'utf8');

const from = ".map((b) => ({ band: b, list: mine.filter((l) => (l.gradeBand ?? 'primary') === b) }))";
const to = ".map((b) => ({ band: b, list: gradeSort(mine.filter((l) => (l.gradeBand ?? 'primary') === b), profile.grade) }))";
if (!s.includes('gradeSort(mine')) {
  s = s.replace(from, to);
  fs.writeFileSync(p, s);
}
console.log('wired:', fs.readFileSync(p, 'utf8').includes('gradeSort(mine'));
