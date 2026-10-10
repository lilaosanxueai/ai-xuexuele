const fs = require('fs');
const path = require('path');
const d = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island', 'content', 'lessons');

// dupQ fix: bio-40 Q4 same as bio-14 Q4 (mRNA vaccine question)
const bio40 = JSON.parse(fs.readFileSync(path.join(d, 'bio-40.json'), 'utf8'));
bio40.exercises[3].q = '疫苗需要打"加强针"的原因是？';
bio40.exercises[3].options = ['药效不够', '记忆细胞需要反复训练', '病毒变异太快', '医生想赚钱'];
bio40.exercises[3].answer = 1;
bio40.exercises[3].explain = '初次免疫弱·加强=复习';
fs.writeFileSync(path.join(d, 'bio-40.json'), JSON.stringify(bio40, null, 2) + '\n', 'utf8');
console.log('dupQ fixed bio-40 Q4');

const fix = (f, qi, opts) => {
  const p = path.join(d, f.replace('.json','') + '.json');
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  l.exercises[qi].options = opts;
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n', 'utf8');
  console.log('fixed', f, 'Q' + (qi + 1));
};
fix('bio-40', 3, ['直接杀病毒', '给免疫系统模拟考', '注入现成抗体', '喝药']);
fix('bio-40', 4, ['直接杀病毒', '给身体图纸自造特征', '最古老的技术', '最危险的']);
fix('eth-45', 0, ['满足需求', '制造需求让人焦虑', '降价促销', '做公益']);
fix('eth-45', 1, ['越买越开心', '新东西很快就习惯了', '不开心的时候', '买不了东西']);
fix('his-46', 3, ['海路直达', '经阿拉伯世界传入', '丝绸之路南线独有', '蒙古西征带入']);
fix('lab-42', 1, ['帮你造密码', '记一个主密码管所有', '偷密码的工具', '完全没用处']);
fix('mus-39', 2, ['凑时间用', '反复出现让人记住', '给歌手休息', '不重要可删']);
console.log('all done');
