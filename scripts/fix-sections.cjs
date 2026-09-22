/** 修复 sections 数组里以 ', 结尾（缺右花括号）的行：xxx', → xxx' }, */
const fs = require('fs');
const p = 'scripts/new-round47.mjs';
let t = fs.readFileSync(p, 'utf8');
const lines = t.split('\n');
let fixed = 0;
for (let i = 0; i < lines.length; i++) {
  if (/^\s*\{ title: .*',\s*$/.test(lines[i]) && !/,\s*\},?\s*$/.test(lines[i]) && !/\}\s*,\s*$/.test(lines[i])) {
    lines[i] = lines[i].replace(/',\s*$/, "' },");
    fixed++;
  }
}
fs.writeFileSync(p, lines.join('\n'));
console.log('repaired lines:', fixed);
