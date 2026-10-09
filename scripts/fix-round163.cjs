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

fix('eco-41', 1, ['骂商家一顿', '保留商品小票和照片', '算了自己吃亏', '大哭一场']);
fix('eth-41', 2, ['关心你的表现', '大概率是骗局怕识破', '正常的保密操作', '法律明确规定']);
fix('eth-42', 4, ['马上就点进去', '从官方App登录验证', '转发给朋友试试', '回复自己的密码']);
fix('eth-43', 1, ['忍着不说', '大声说不并告诉大人', '觉得自己想多了', '保守这个秘密']);
fix('eth-43', 2, ['可信的好朋友', '大概率是要保密的坏事', '一种游戏规则', '很正常的事']);
fix('eth-43', 3, ['是小孩自己的', '做坏事的人永远不是你', '爸妈的错', '老师的错']);
fix('psy-44', 4, ['洗澡换衣服', '告诉大人保留证据', '删除聊天记录', '一直沉默下去']);
fix('psy-46', 3, ['想开点别矫情', '我在听你慢慢说', '你太脆弱了吧', '别跟我说这些']);
fix('soc-35', 0, ['让你更聪明', '获取你的注意力', '为了社会公益', '完全随机推荐']);
fix('soc-35', 1, ['大家天生爱愤怒', '这类内容停留最久', '纯粹是巧合', '编辑的个人喜好']);
fix('soc-35', 2, ['只看更多同类', '主动搜不同观点验证', '完全不上网了', '只信官方频道']);
console.log('all done');
