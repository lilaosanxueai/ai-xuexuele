/** 修复 .mjs 中所有 \\' (双反斜杠+引号=断串) 替换为 \' (单反斜杠+引号=转义) */
const fs = require('fs');
const p = 'scripts/new-round56.mjs';
let t = fs.readFileSync(p, 'utf8');
// \\' 在源码中是 3 个字符 [\, \, '] —— 替换为 [\, '] 两个字符
const before = (t.match(/\\\\'/g) || []).length;
t = t.replace(/\\\\'/g, "\\'");
fs.writeFileSync(p, t);
console.log('replaced', before, 'occurrences of double-backslash-quote');
