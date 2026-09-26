/** 修复 meta-06 ex4（缺options）+ 模块名冲突 + meta-04 参数 */
const fs = require('fs');
const NL = String.fromCharCode(10);

// 1. meta-06 ex4: steps → options
let j6 = JSON.parse(fs.readFileSync('content/lessons/meta-06.json', 'utf8'));
j6.exercises[4] = { q: '一周后重做原题的目的是？', options: ['检验是否真正消灭', '增加作业量', '惩罚自己', '浪费时间'], answer: 0, explain: '间隔检验掌握' };
fs.writeFileSync('content/lessons/meta-06.json', JSON.stringify(j6, null, 2) + NL);
console.log('meta-06 ex4 fixed');

// 2. 模块名去重（每学科独立模块名）
const modFixes = {
  'meta-02': '语文学习方法',
  'meta-04': '语文阅读方法',
  'meta-05': '数学时间管理',
  'meta-06': '数学错题方法',
};
for (const [id, mod] of Object.entries(modFixes)) {
  const p = `content/lessons/${id}.json`;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (j.curriculum) j.curriculum.module = mod;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + NL);
  console.log(`${id} module -> ${mod}`);
}

// 3. meta-04: 确保顶层有 st = 1 赋值
let j4 = JSON.parse(fs.readFileSync('content/lessons/meta-04.json', 'utf8'));
// 检查是否已修复
if (!j4.lab.code.includes('st = 1')) {
  j4.lab.code = j4.lab.code.replace('hide()', 'st = 1\nhide()');
  j4.starterCode = j4.lab.code;
  fs.writeFileSync('content/lessons/meta-04.json', JSON.stringify(j4, null, 2) + NL);
  console.log('meta-04 st param fixed');
} else {
  console.log('meta-04 st already ok');
}
