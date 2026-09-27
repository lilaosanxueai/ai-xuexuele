import fs from 'node:fs';
import path from 'node:path';

/** 第87轮调研：学段覆盖 + explore 缺失清单（只读不改） */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const all = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    if (Array.isArray(j)) all.push(...j); else if (j) all.push(j);
  } catch { /* skip */ }
}

console.log('== 学段覆盖 ==');
for (const band of ['primary', 'junior', 'senior']) {
  const bySub = {};
  for (const l of all) {
    if (l.gradeBand !== band) continue;
    (bySub[l.subjectArea] ??= []).push(l.grade);
  }
  const line = Object.entries(bySub).sort()
    .map(([s, g]) => s + ':' + g.length + '节(年级' + [...new Set(g)].sort((a, b) => a - b).join('/') + ')')
    .join('  ');
  console.log('[' + band + '] ' + line);
}

const noExp = all.filter((l) => !l.interact && (l.lab || l.starterCode) && !((l.lab || {}).explore || []).length);
console.log('\n== SVG课缺探索问题 == ' + noExp.length + ' 节: ' + noExp.map((l) => l.id).join(','));

const noReportSubj = all.filter((l) => !l.exercises?.length);
const m = new Map();
for (const l of noReportSubj) m.set(l.subjectArea, (m.get(l.subjectArea) ?? 0) + 1);
console.log('\n== 无随堂练课程分布 ==');
[...m.entries()].sort((a, b) => b[1] - a[1]).forEach(([s, n]) => console.log('  ' + s + ': ' + n));
