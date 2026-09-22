/** 自查任意轮次脚本：write 缺左括号、sections 数组多余括号、lab code 里的 % 和 [ 列表 */
const fs = require('fs');
const file = process.argv[2] || 'scripts/new-round45.mjs';
const t = fs.readFileSync(file, 'utf8');
const lines = t.split(/\r?\n/);
const bad = { write: [], bracket: [], code: [] };
lines.forEach((l, i) => {
  if (/^\s*write\s+"/.test(l)) bad.write.push((i + 1) + ': ' + l.trim().slice(0, 80));
  if (/\}\s*,?\s*\}\s*\)|\}\s*\]\s*\)|\}\s*,\s*\]\)/.test(l)) bad.bracket.push((i + 1) + ': ' + l.trim().slice(0, 80));
});
// lab code 字符串里的解释器违禁： % 取模、列表字面量 ["
const codeMatches = t.match(/code: `[^`]*`/gs) ?? [];
codeMatches.forEach((c, ci) => {
  c.split(/\r?\n/).forEach((l, li) => {
    if (/%/.test(l)) bad.code.push(`code#${ci} 行${li}: ` + l.trim().slice(0, 70));
    if (/\[\s*"/.test(l)) bad.code.push(`code#${ci} 行${li}: ` + l.trim().slice(0, 70));
  });
});
console.log('缺括号 write:', bad.write.length); console.log(bad.write.join('\n'));
console.log('多余括号:', bad.bracket.length); console.log(bad.bracket.join('\n'));
console.log('code 违禁:', bad.code.length); console.log(bad.code.join('\n'));
if (!bad.write.length && !bad.bracket.length && !bad.code.length) console.log('ALL CLEAN');
