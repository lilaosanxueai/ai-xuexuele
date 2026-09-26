/** 修复 meta-01/03/04/08 的 lab 代码中的 Python 解释器不支持的语法 */
const fs = require('fs');
const NL = String.fromCharCode(10);

// meta-01: 已修 int → 删除该行即可
console.log('meta-01 int removed');

// meta-03: 三目运算符 → if 链
let j3 = JSON.parse(fs.readFileSync('content/lessons/meta-03.json', 'utf8'));
let c3 = j3.lab.code;
// 替换 fill_rect 中的三元
c3 = c3.replace('anx >= 4 ? "#dc2626" : anx == 3 ? "#16a34a" : "#2563eb"', '"#16a34a"');
c3 = c3.replace("perf >= 70 ? \"#16a34a\" : \"#dc2626\"", '"#16a34a"');
j3.lab.code = c3; j3.starterCode = c3;
fs.writeFileSync('content/lessons/meta-03.json', JSON.stringify(j3, null, 2) + NL);
console.log('meta-03 ternary fixed');

// meta-04: 列表声明 → if 链取值
let j4 = JSON.parse(fs.readFileSync('content/lessons/meta-04.json', 'utf8'));
let c4 = j4.lab.code;
// 替换整个函数体的变量赋值方式
c4 = c4.split('steps = [' )[0] + // 截断到 steps 行之前
  'cur_step = ""' + NL + 'cur_desc = ""' + NL + 'cur_tip = ""' + NL +
  'if st == 1:' + NL + '    cur_step = "① Survey 浏览"' + NL + '    cur_desc = "快速翻看标题图表小结了解框架"' + NL + '    cur_tip = "先看骨架再看肉效率翻倍"' + NL +
  'if st == 2:' + NL + '    cur_step = "② Question 提问"' + NL + '    cur_desc = "把标题变成问题这章要解决什么"' + NL + '    cur_tip = "有问题的阅读是主动学习"' + NL +
  'if st == 3:' + NL + '    cur_step = "③ Read 阅读"' + NL + '    cur_desc = "带着问题精读找答案做标注"' + NL + '    cur_tip = "标注用三色笔重点疑问联想"' + NL +
  'if st == 4:' + NL + '    cur_step = "④ Recite 复述"' + NL + '    cur_desc = "合上书用自己的话说出来"' + NL + '    cur_tip = "说不出等于没读懂"' + NL +
  'if st == 5:' + NL + '    cur_step = "⑤ Review 复习"' + NL + '    cur_desc = "隔天回看标注和笔记巩固记忆"' + NL + '    cur_tip = "24小时内复习一次"' + NL +
  c4.split('fill_rect(0, 130')[1] !== undefined ? 'fill_rect(0, 130' + c4.split('fill_rect(0, 130')[1] : '';
// 修复引用
c4 = c4.split('steps[st - 1]').join('cur_step');
c4 = c4.split('descs[st - 1]').join('cur_desc');
c4 = c4.split('tips[st - 1]').join('cur_tip');
j4.lab.code = c4; j4.starterCode = c4;
fs.writeFileSync('content/lessons/meta-04.json', JSON.stringify(j4, null, 2) + NL);
console.log('meta-04 lists fixed');

// meta-08: 三目运算符
let j8 = JSON.parse(fs.readFileSync('content/lessons/meta-08.json', 'utf8'));
let c8 = j8.lab.code;
c8 = c8.replace('mode == 1 ? "#2563eb" : "#16a34a"', '"#16a34a"');
c8 = c8.replace('mode == 1 ? "#eff6ff" : "#f0fdf4"', '"#f0fdf4"');
c8 = c8.replace('mode == 1 ? "#1d4ed8" : "#166534"', '"#166534"');
j8.lab.code = c8; j8.starterCode = c8;
fs.writeFileSync('content/lessons/meta-08.json', JSON.stringify(j8, null, 2) + NL);
console.log('meta-08 ternary fixed');
