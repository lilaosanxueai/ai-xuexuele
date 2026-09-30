import fs from 'node:fs';
import path from 'node:path';

/** 第114轮：12 处 longHint 干扰项补强 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  ['ai-11', 0, ['AI自己突然产生的想法', '训练数据中人类偏见的反映和放大', '计算机中了某种病毒', '随机出现的故障'], 1],
  ['ai-11', 1, ['一种很高深的学习方法', '用AI生成以假乱真的图像视频音频', '挖得很深的伪造坑道', '高级的修图软件'], 1],
  ['eco-17', 0, ['自己生产全部产品', '撮合供需双方并从连接中获利', '不赚钱的公益组织', '只做线下交易的商场'], 1],
  ['eco-17', 1, ['上网的网速越来越快', '用户越多产品价值越大·吸引更多用户', '互联网覆盖的范围越来越广', '社交关系网越来越大'], 1],
  ['eco-17', 2, ['完全不需要花一分钱', '每多一个用户或一份复制的成本≈0', '产品本身一文不值', '永远没有价格标签'], 1],
  ['eco-17', 3, ['全靠政府财政补贴', '广告·佣金·增值服务的交叉补贴', '靠用户的爱心捐赠维持', '根本不需要赚钱'], 1],
  ['eco-18', 1, ['政府直接规定每家排多少', '给排放权定价·让市场找到最低成本减排路径', '彻底禁止所有碳排放', '对排放企业收污染税'], 1],
  ['eco-18', 2, ['发电完全不需要花钱', '建好后每多发的电成本极低', '太阳能板和风机是免费的', '这是不可能实现的事'], 1],
  ['eco-18', 3, ['Sales（销售额）', 'Social（社会责任）', 'Speed（速度）', 'Size（规模）'], 1],
  ['his-38', 3, ['建造更多的传统工厂', '以科技创新驱动的高质量发展', '增加更多的人口红利', '出口更多低端产品'], 1],
  ['his-39', 1, ['各国彻底关闭边界互不来往', '从效率优先转向安全优先的区域化调整', '全球化已经完全终结', '回到冷战时期对立格局'], 1],
  ['his-39', 2, ['缺少国际组织的协调', '集体行动难题·各国利益不同难统一', '技术发展太简单了', '没有人在乎这些问题'], 1],
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
