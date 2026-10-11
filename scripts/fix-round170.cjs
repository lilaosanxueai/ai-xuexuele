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
fix('ai-24', 1, ['一样的东西', '内存快但临时硬盘大永久', '内存大硬盘小', '没有区别']);
fix('pe-44', 0, ['拼命游回岸', '冷静不挣扎再仰漂', '沉到水底走', '脱掉鞋子']);
fix('pe-44', 3, ['不礼貌', '会被抱住两人沉', '太慢了', '他不想被救']);
console.log('all done');
