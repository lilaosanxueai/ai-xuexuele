/** 找出 sections 数组后多余的分号+括号手误（}, }); 与 },]); 等） */
const fs = require('fs');
const t = fs.readFileSync('scripts/new-round44.mjs', 'utf8');
const lines = t.split(/\r?\n/);
const bad = [];
lines.forEach((l, i) => {
  if (/\}\s*,?\s*\}\s*\)\s*;?/.test(l) || /\}\s*\]\s*\)\s*;?/.test(l)) bad.push((i + 1) + ': ' + l.trim().slice(0, 100));
});
console.log(bad.join('\n') || 'clean');
