const fs = require('fs');
const path = require('path');
const d = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island', 'content', 'lessons');
const fix = (f, qi, opts) => {
  const p = path.join(d, f.replace('.json','') + '.json');
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  l.exercises[qi].options = opts;
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
  console.log('fixed', f, 'Q' + (qi + 1));
};
fix('ai-22', 0, ['越长越好看', '越精确越好删掉废话', '越短越好记不住', '用一整句话去搜']);
fix('eng-40', 3, ['把演讲全稿写在上面', '关键词（第一句加三个要点加结尾）', '什么都不写', '写笑话和段子']);
fix('geo-32', 2, ['东西走向的线', '黑河到腾冲这条线', '南北走向的线', '一个环形']);
fix('lab-43', 2, ['全都在最后一起炒', '凉菜先炖菜慢炒菜快汤最后', '全部提前做好', '看心情做']);
fix('lab-43', 3, ['一次放够咸死', '先少放再尝再补', '完全不放盐', '越多越好才够味']);
fix('pe-43', 0, ['更富有', '更团结是后来加的', '更聪明', '更强大了']);
fix('psy-51', 2, ['坐着不动发呆', '有意识不评判关注当下', '念咒语', '什么都不想']);
console.log('all done');
