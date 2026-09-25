/** 修复 .mjs 中单引号字符串内未转义的英文撇号（' → \' 或去掉缩写） */
const fs = require('fs');
const p = 'scripts/new-round56.mjs';
let lines = fs.readFileSync(p, 'utf8').split('\n');
const fixes = 0;
let fixed = 0;
for (let i = 0; i < lines.length; i++) {
  let l = lines[i];
  // 只处理以 { title: 或 tip: 或 body: 开头的含单引号字符串的行
  if (!/^\s*(\{ title:|tip:|body:|q:)/.test(l)) continue;
  // 将所有未转义的英文撇号替换为安全文本
  // 先把已有 \\' 恢复为占位符
  l = l.split("\\'").join("\x00");
  // 常见缩写替换
  l = l.replace(/don't/g, 'do not').replace(/can't/g, 'cannot')
       .replace(/It's/g, 'It is').replace(/it's/g, 'it is')
       .replace(/I'm/g, 'I am').replace(/won't/g, 'will not')
       .replace(/haven't/g, 'have not').replace(/hasn't/g, 'has not')
       .replace(/didn't/g, 'did not').replace(/isn't/g, 'is not')
       .replace(/aren't/g, 'are not').replace(/doesn't/g, 'does not')
       .replace(/minutes' walk/g, 'minute walk')
       .replace(/You can/g, 'You can');
  // 剩余的裸撇号直接去掉（如所有格）
  l = l.replace(/(\w)'(\w)/g, '$1$2');
  // 恢复占位符
  l = l.split("\x00").join("\\'");
  if (l !== lines[i]) { lines[i] = l; fixed++; }
}
fs.writeFileSync(p, lines.join('\n'));
console.log('fixed lines:', fixed);
