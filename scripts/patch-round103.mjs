import fs from 'node:fs';

/** 第103轮B：把学习路径块移动到学科横幅正下方（页面主角位） */
const p = 'apps/web/src/screens/SubjectScreen.tsx';
let s = fs.readFileSync(p, 'utf8');

const startMark = '        {/* 学习路径（多邻国式闯关地图）';
const endMark = '        })()}';
const si = s.indexOf(startMark);
const ei = s.indexOf(endMark, si);
if (si < 0 || ei < 0) throw new Error('path block not found');
const block = s.slice(si, ei + endMark.length);
s = s.slice(0, si) + s.slice(ei + endMark.length);

// 插入点：期末模拟卷注释前
const anchor = '        {/* 期末模拟卷：全学科抽题组卷 + 限时 + 模块诊断 */}';
const ai = s.indexOf(anchor);
if (ai < 0) throw new Error('anchor not found');
s = s.slice(0, ai) + block + '\n\n' + s.slice(ai);

fs.writeFileSync(p, s);
console.log('moved, order ok:', s.indexOf(startMark) < s.indexOf(anchor));
