const fs = require('fs');
const path = require('path');
const d = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island', 'content', 'lessons');

const fix = (f, qi, fn) => {
  const p = path.join(d, f.replace('.json', '') + '.json');
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  const ex = l.exercises[qi];
  fn(ex);
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
  console.log('fixed', f, 'Q' + (qi + 1));
};

// dupQ: ai-17 Q3 换题（与 ai-07 撞）
fix('ai-17.json', 2, ex => {
  ex.q = '用二分法在 1~1000 内猜数，最多几次？';
  ex.options = ['1000 次', '约 10 次', '50 次', '3 次'];
  ex.answer = 1;
  ex.explain = '每次砍半，2 的 10 次方约 1024';
});

// leak: ai-16 Q4 改题干
fix('ai-16.json', 3, ex => {
  ex.q = 'return 和 print 的不同点是？';
  ex.options = ['完全一样', '一个给程序用一个给人看', '速度不同', '都不执行'];
  ex.answer = 1;
  ex.explain = 'return 的值能被程序继续用，print 只是显示';
});

// longHint 批量修
fix('ai-14.json', 3, ex => { ex.options = ['条件从严到宽排列', '完全相同一模一样', '顺序完全无关紧要', '随便怎么排都一样']; });
fix('ai-15.json', 4, ex => { ex.options = ['纯字典的方案', '列表装字典嵌套', '纯字符串的方案', '只画图的方案']; });
fix('ai-16.json', 2, ex => { ex.options = ['让代码变得更长', '可以复用的积木', '让程序运行更慢', '好看的颜色特效']; });
fix('ai-17.json', 4, ex => { ex.options = ['先放弃然后算了', '先能跑再跑快', '越慢越好的方案', '不管对错先上']; });
fix('eco-35.json', 1, ex => { ex.options = ['卖家一个人定价', '第二想要的人逼出', '政府物价局定的', '拍卖师随口喊的']; });
fix('eco-35.json', 2, ex => { ex.options = ['赢了会被真诅咒', '出价最高往往付多', '中奖奖品的骗局', '拍卖厅闹鬼事件']; });
fix('eco-36.json', 1, ex => { ex.options = ['坐免费的公交车', '不出钱等着享用', '一种旅游的交通', '种地的拖拉机']; });
fix('eco-36.json', 2, ex => { ex.options = ['市场取得了胜利', '公共资源被滥用', '碰上了坏运气', '单纯环保问题']; });
fix('eco-36.json', 3, ex => { ex.options = ['政府在抢大家的钱', '强制汇聚绕便车', '一种惩罚的手段', '给富人的奖励金']; });
fix('pe-38.json', 4, ex => { ex.options = ['替补席的陪练', '后排防守的专家', '发球专业户', '客串的裁判员']; });

console.log('all done');
