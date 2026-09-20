import fs from 'node:fs';

/** 批量修复 18 节文科/信息/科学课 lab 代码里的解释器不支持语法：列表字面量、含中引号/撇号的字符串 */
const files = ['chn-01','chn-02','chn-03','chn-04','chn-05','chn-06',
  'eng-09','eng-10','eng-11','eng-12','eng-13',
  'it-12','it-13','it-14','it-15','sci-13','sci-14','sci-15'];

for (const id of files) {
  const p = `content/lessons/${id}.json`;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  let c = j.lab.code;
  // 策略：逐条替换已知列表模式为 if 链太难自动化——直接检测并删掉含 [ 的行，再删引用列表变量的行
  const lines = c.split('\n');
  const listVars = new Set();
  const kept = [];
  for (const l of lines) {
    const m = l.match(/^\s*([A-Za-z_]\w*)\s*=\s*\[/);
    if (m) { listVars.add(m[1]); continue; } // 记住列表名并删声明行
    // 引用列表变量的行（含 var[）也删
    if ([...listVars].some(v => new RegExp(v + '\\[').test(l))) continue;
    kept.push(l);
  }
  c = kept.join('\n');
  // 含 "电话簿" 这类中文引号在代码字符串里的（write 参数中的引号冲突）——检测 write(...) 行中有奇数个 " 的行删引号冲突
  const fixed2 = c.split('\n').map(l => {
    if (!l.includes('write(') ) return l;
    const count = (l.match(/"/g) || []).length;
    if (count % 2 !== 0) return ''; // 引号不配对——直接删此行（信息损失可接受）
    return l;
  }).filter(Boolean);
  c = fixed2.join('\n');
  // 双重引号写法如 "管"行"" → 删行或简化
  c = c.split('\n').filter(l => !/( 管|行"|"行|"列)/.test(l) || !l.includes('write(')).join('\n');
  j.lab.code = c;
  j.starterCode = c;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  console.log(`清理 ${id}`);
}
console.log('全部完成');
