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
// dupQ fix: geo-29 Q5 same as geo-23 Q1 about 南水北调中线水源
const geo29 = JSON.parse(fs.readFileSync(path.join(d, 'geo-29.json'), 'utf8'));
geo29.exercises[4].q = '南水北调最大的社会效益是什么？';
geo29.exercises[4].options = ['发电', '缓解北方水资源短缺', '航运', '旅游'];
geo29.exercises[4].answer = 1;
geo29.exercises[4].explain = '让1.5亿人受益';
fs.writeFileSync(path.join(d, 'geo-29.json'), JSON.stringify(geo29, null, 2) + '\n', 'utf8');
console.log('dupQ fixed geo-29 Q5');

// longHint fixes
fix('ai-21', 0, ['很酷的表现', '家里玄关堆满鞋', '让电脑运行更快', '显得专业']);
fix('ai-21', 2, ['三天后自己都不记得了', '没有信息量等于没命名', '电脑系统不认可', '太有创意了']);
fix('ai-21', 3, ['只买3台电脑', '三份副本两种介质一份异地', '每天备份三次', '三个U盘就够了']);
fix('eco-43', 0, ['买机会要花的钱', '选一个后放弃的那个最好的', '零花钱的成本', '没有成本']);
fix('mus-38', 0, ['唐朝长安', '一七九零年前后', '一九九零年', '汉朝宫廷']);
fix('soc-38', 1, ['让大国愿意参与保证系统运转', '只是为了彰显大国权力', '用来惩罚小国的工具', '没有任何作用']);
fix('soc-39', 4, ['理解变化保持清醒', '预测未来的准确时间', '让变化停止不前', '让所有人听从安排']);
console.log('all done');
