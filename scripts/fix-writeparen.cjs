/** 修复 lab code 里 write 缺左括号的行：write "xxx", ...) → write("xxx", ...) */
const fs = require('fs');
const p = process.argv[2];
const lines = fs.readFileSync(p, 'utf8').split('\n');
let fixed = 0;
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\s*)write\s+"(.*)",\s*(-?\d+.*)\)$/);
  if (m) {
    lines[i] = `${m[1]}write("${m[2]}", ${m[3]})`;
    fixed++;
  }
}
fs.writeFileSync(p, lines.join('\n'));
console.log('write-paren fixed:', fixed);
