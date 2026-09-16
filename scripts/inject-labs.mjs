import fs from 'node:fs';
import path from 'node:path';

// 把 labs-batchN.json 注入课程 JSON 的 lab 字段（幂等：直接覆盖 lab）
// 用法：node scripts/inject-labs.mjs [labs-batch2.json …]（默认第一批）
const batchFile = process.argv[2] ?? 'labs-batch1.json';
const DIR = 'content/lessons';
const labs = JSON.parse(fs.readFileSync(`scripts/${batchFile}`, 'utf8')).labs;
const ids = Object.keys(labs);
let injected = 0;
const missing = [];

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  const file = path.resolve(DIR, f);
  if (!file.startsWith(path.resolve(DIR) + path.sep)) throw new Error('bad path');
  const l = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!ids.includes(l.id)) continue;
  l.lab = labs[l.id];
  fs.writeFileSync(file, JSON.stringify(l, null, 2) + '\n');
  injected++;
}
for (const id of ids) {
  if (!fs.readdirSync(DIR).some((f) => f.endsWith('.json') && JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).id === id)) missing.push(id);
}
console.log('injected:', injected, '/', ids.length, missing.length ? 'missing: ' + missing.join(',') : '');
