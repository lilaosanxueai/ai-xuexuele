/** 修复：行尾 '}); 但下一行还有 { title: —— 说明本行错关了 sections 数组，应为 '}, */
const fs = require('fs');
const p = process.argv[2] || 'scripts/new-round48.mjs';
const lines = fs.readFileSync(p, 'utf8').split('\n');
let fixed = 0;
for (let i = 0; i < lines.length - 1; i++) {
  if (/\'\s*\}\s*\)\s*;\s*$/.test(lines[i]) && /^\s*\{\s*title:/.test(lines[i + 1] ?? '')) {
    lines[i] = lines[i].replace(/\s*\}\s*\)\s*;\s*$/, ' },');
    fixed++;
  }
}
fs.writeFileSync(p, lines.join('\n'));
console.log('fixed premature closes:', fixed);
