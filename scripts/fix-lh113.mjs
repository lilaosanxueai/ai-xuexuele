import fs from 'node:fs';
import path from 'node:path';

/** 第113轮：8 处 longHint 干扰项补强 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  ['eco-13', 2, ['什么都不用管', '用最小代价验证想法是否可行', '必须一步做到完美', '必须找投资人'], 1],
  ['eco-14', 3, ['看广告打得响不响', '看条款（免赔·等待·除外）', '看品牌名字够不够大', '看推销员长得帅不帅'], 1],
  ['psy-15', 1, ['考试考了第一名', '用爬树能力评判一条鱼不公平', '只有笨人才会这样比喻', '鱼其实很聪明会爬树'], 1],
  ['soc-14', 1, ['战争导致的大规模人口流动', '海平面上升·干旱等气候变化', '经济萧条引发的大迁徙', '瘟疫造成的人口锐减'], 1],
  ['soc-15', 0, ['男女之间的生理差异', '社会对性别角色的期待和规范', '染色体决定的生物特征', '每个人天生的性格差异'], 1],
  ['soc-15', 3, ['对女性没有任何伤害', '不许表达脆弱·必须坚强的压力', '让男性赚了更多的钱', '让男性寿命变得更长'], 1],
  ['soc-16', 2, ['只看同一个新闻来源', '关注多元立场信源+主动搜索', '只刷短视频获取信息', '干脆不上网了'], 1],
  ['soc-16', 3, ['帮传播真相和快乐', '帮传播真相还是帮传播恐慌', '让更多人关注你', '提高你的转发量'], 1],
];

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let fixed = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    for (const [id, qi, opts, ans] of FIX) {
      if (l.id !== id) continue;
      const ex = l.exercises?.[qi];
      if (!ex) { console.log('未找到: ' + id + '[' + qi + ']'); continue; }
      ex.options = opts;
      ex.answer = ans;
      fixed++; changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('修正 ' + fixed + ' 题');
