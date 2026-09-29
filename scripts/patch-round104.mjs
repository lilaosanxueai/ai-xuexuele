import fs from 'node:fs';

/** 第104轮B：把「今日学习」CTA 移到学习概览容器最顶（搜索条之前） */
const p = 'apps/web/src/screens/MapScreen.tsx';
let s = fs.readFileSync(p, 'utf8');

const startMark = '          {/* 今日学习大 CTA';
const endMark = '          })()}';
const si = s.indexOf(startMark);
const ei = s.indexOf(endMark, si);
if (si < 0 || ei < 0) throw new Error('CTA block not found');
const block = s.slice(si, ei + endMark.length);
s = s.slice(0, si) + s.slice(ei + endMark.length);

// 容器起点：学习概览 div 内的第一个子元素（搜索按钮）之前——按 onClick 行定位其按钮起始行
const searchLine = s.indexOf("onClick={() => nav('/search')}");
if (searchLine < 0) throw new Error('anchor not found');
const btnStart = s.lastIndexOf('<button', searchLine);
s = s.slice(0, btnStart) + block + '\n\n' + s.slice(btnStart);

fs.writeFileSync(p, s);
console.log('moved to top:', s.indexOf(startMark) < s.indexOf("onClick={() => nav('/search')}"));
