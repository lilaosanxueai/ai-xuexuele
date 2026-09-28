import fs from 'node:fs';
import path from 'node:path';

/**
 * 第100轮B：longHint 最后 11 题（round-99 前缀笔误漏网项，用精确题干前缀补刀）。
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  ['cross-122', '数学归纳法的两步', '基础步（n=1 成立）+ 递推步（k 成立推 k+1 成立）', '把结论原封不动地重新证明一遍', '基础步（n=1 成立）+ 递推步（k 成立推 k+1 成立）', '多举几个具体例子再配上图示', '先代入几个数字计算再验算'],
  ['cross-18', '验证质量守恒时红磷', '生成物是固体且防止气体参与', '生成物是固体且防止气体参与', '因为红磷本身有毒要封住', '敞着口的情况下无法点燃', '为了让反应进行得更快些'],
  ['cross-43', '"遥看瀑布', '化动为静，写出瀑布如白练悬垂', '化动为静，写出瀑布如白练悬垂', '「挂」字说明瀑布非常沉重', '只是表示上面挂着东西而已', '作者凑字数随手选的一个字'],
  ['cross-69', '过山车实际', '摩擦把部分机械能转化为热', '这是设计师的失误造成的', '摩擦把部分机械能转化为热', '因为机械能凭空消失了', '因为过山顶时重力变小了'],
  ['cross-71', '可逆反应达到平衡后', '不再变化（但不一定相等）', '不再变化（但不一定相等）', '平衡时各物质浓度都相等', '各物质浓度还在持续增大', '各物质浓度最后都降为零'],
  ['cross-72', 'Aa × Aa 后代的基因型', '1:2:1（AA:Aa:aa）', '后代比例是 1:1（像测交）', '后代表现型比例是 3:1', '1:2:1（AA:Aa:aa）', '后代全部是杂合子 Aa'],
  ['cross-72', '孟德尔实验中', 'F₁（Aa）产生两种配子且受精随机', 'F₁（Aa）产生两种配子且受精随机', '靠环境条件直接影响性状', '因为亲本发生了基因突变', '因为人工进行了选择淘汰'],
  ['cross-77', '用拟合线预测', '不可靠——远超数据范围属于危险外推', '非常可靠，直线从来不会骗人', '不可靠——远超数据范围属于危险外推', '和 6 小时处的预测一样准', 'AI 算出来的结果从不出错'],
  ['cross-78', '线性分类器训练时', '指导参数往减小错误的方向微调', '指导参数往减小错误的方向微调', '直接删除出错的那个数据点', '用来惩罚不好好干的计算机', '只是用来增大训练数据量'],
  ['cross-83', '元素周期表中', '性质相似（最外层电子数相同）', '它们的相对原子质量很接近', '性质相似（最外层电子数相同）', '它们的外观颜色都相同', '它们被发现的时间很接近'],
  ['math-19', '程序用循环累加', '公式一步到位：算法有优劣', '循环累加的计算速度反而更快', '公式一步到位：算法有优劣', '两种方法计算速度一样慢', '这两种说法其实都不对'],
];

const FIXES = FIX.map((e) => (e.length === 7 ? [e[0], e[1], e[2], e.slice(3)] : e));

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
let fixed = 0, skipped = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    for (const [id, qPrefix, expectCorrect, newOpts] of FIXES) {
      if (l.id !== id) continue;
      const ex = (l.exercises ?? []).find((e) => (e.q ?? '').startsWith(qPrefix));
      if (!ex) { skipped++; console.log('未找到: ' + id + ' ' + qPrefix); continue; }
      if ((ex.options?.[ex.answer] ?? '') !== expectCorrect) {
        skipped++;
        console.log('正确项不匹配: ' + id + ' ' + qPrefix + ' 实际=' + (ex.options?.[ex.answer] ?? ''));
        continue;
      }
      ex.options = newOpts;
      fixed++;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('替换 ' + fixed + ' 题，未命中 ' + skipped + ' 条');
