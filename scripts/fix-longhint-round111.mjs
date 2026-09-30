import fs from 'node:fs';
import path from 'node:path';

/** 第111轮：14 处 longHint 干扰项补强 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = [
  ['eco-09', 'GDP衡量的是', '一年内最终产品和服务的市场价值', ['国家人民幸福感多高', '一年内最终产品和服务的市场价值', '政府金库里有多少钱', '全国人口的总数量'], 1],
  ['eco-10', '降息的直接效果', '借钱变便宜→刺激投资消费', ['钱变得贵了没人敢借', '借钱变便宜→刺激投资消费', '股市一定马上下跌', '通货膨胀立刻消失'], 1],
  ['eco-10', '为什么央行要独立于政府', '防止政府滥印钞导致恶性通胀', ['这样办事效率会更高', '防止政府滥印钞导致恶性通胀', '国际上的通行惯例而已', '技术原因没有特别含义'], 1],
  ['eco-11', '"婴儿产业"保护论指的是', '保护刚起步的战略产业暂时免于竞争', ['保护婴儿食品行业的说法', '保护刚起步的战略产业暂时免于竞争', '保护学校和教育机构', '保护刚出生的婴儿用品'], 1],
  ['eco-12', '器官捐献 opt-out 国家捐献率高因为', '默认选项的力量（不勾即同意）', ['这些国家的人民更有爱心', '默认选项的力量（不勾即同意）', '法律强制所有人必须捐献', '捐献者家属可以拿钱'], 1],
  ['psy-10', '进入心流的必要条件是', '挑战略高于技能+即时反馈', ['任务越简单越容易进', '挑战略高于技能+即时反馈', '什么都不做发发呆就行', '必须听着安静的音乐'], 1],
  ['psy-11', '打破从众最有效的是', '有一个同盟者', ['大声喊出自己的想法', '有一个同盟者', '所有人都沉默不语', '等多数人先改变看法'], 1],
  ['psy-12', '考前熬夜复习的问题在', '跳过REM=记忆没归档保存', ['晚上太累手写不动字', '跳过REM=记忆没归档保存', '教室晚上会锁门进不去', '会被老师发现批评'], 1],
  ['soc-09', '"代际收入弹性"越大说明', '收入越"继承"父母（流动性越低）', ['社会流动性就越高越好', '收入越"继承"父母（流动性越低）', '国民收入越来越平均', '经济发达程度越高'], 1],
  ['soc-09', '"躺平"现象的社会学解释', '预期回报降低时的理性反应', ['年轻人天生就是懒惰', '预期回报降低时的理性反应', '网络流行语没有含义', '政府号召大家休息'], 1],
  ['soc-10', '集装箱革命的意义是', '海运成本暴跌90%+使全球分工可行', ['集装箱的外形设计很美观', '海运成本暴跌90%+使全球分工可行', '货物在海上不会被打湿', '让仓库变得更加整齐'], 1],
  ['soc-10', '逆全球化的表现是', '保护主义·产业回流·供应链重组', ['各国关税降到零自由贸易', '保护主义·产业回流·供应链重组', '跨国公司数量越来越多', '全球移民数量暴增'], 1],
  ['soc-12', '法律和道德的关系是', '法律是底线道德是高线·互相影响', ['两者完全是一回事', '法律是底线道德是高线·互相影响', '道德包含法律的一切内容', '两者没有任何关系'], 1],
  ['soc-12', '"法治"与"法制"的分水岭是', '法律是否也约束权力', ['法律条文的数量多少', '法律是否也约束权力', '法院建筑的大小规模', '罚金收入的高低多少'], 1],
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
    for (const [id, qPrefix, expect, newOpts, ans] of FIX) {
      if (l.id !== id) continue;
      const ex = (l.exercises ?? []).find((e) => (e.q ?? '').startsWith(qPrefix));
      if (!ex) { console.log('未找到: ' + id + ' ' + qPrefix.slice(0, 8)); continue; }
      if ((ex.options?.[ex.answer] ?? '') !== expect) { console.log('不匹配: ' + id + ' 实际=' + (ex.options?.[ex.answer] ?? '').slice(0, 10)); continue; }
      ex.options = newOpts;
      ex.answer = ans;
      fixed++; changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('替换 ' + fixed + ' 题');
