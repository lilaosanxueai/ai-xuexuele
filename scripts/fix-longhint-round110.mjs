import fs from 'node:fs';
import path from 'node:path';

/** 第110轮：8 处 longHint 干扰项补强（正确项保持原下标） */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

// [id, 题干前缀, 正确项, 新选项（正确项在原 answer 下标）, 原 answer]
const FIX = [
  ['eco-06', '为什么通缩比通胀更可怕', '推迟购买→企业裁员→更不敢买的螺旋',
    ['东西便宜是因为经济在冰冻', '推迟购买→企业裁员→更不敢买的螺旋', '银行会全部关门停业', '物价低是好事没危害'], 1],
  ['eco-08', '囚徒困境的核心是', '个体最优选择导致集体最差结果',
    ['警察审讯手段太高明', '个体最优选择导致集体最差结果', '罪犯之间没有沟通渠道', '法官判得太重了'], 1],
  ['psy-07', '朋友圈"高光剪辑"指', '只展示最好片段造成的不真实感',
    ['短视频的一种拍摄手法', '只展示最好片段造成的不真实感', '朋友圈自动修图的功能', '相机的高光模式'], 1],
  ['psy-07', '点赞让人上瘾因为', '不确定的奖励激活多巴胺回路',
    ['点赞的图标设计好看', '不确定的奖励激活多巴胺回路', '网速快点赞手感好', '大家都点不好意思不点'], 1],
  ['psy-08', '"你让我很失望"的问题在', '把责任全推给对方（指责句式）',
    ['说得太诚实太直接了', '把责任全推给对方（指责句式）', '句子里缺少标点符号', '语气词用得太多了'], 1],
  ['soc-06', '职业诞生的根本原因是', '社会需要+有人擅长+愿意交换',
    ['政府统一安排分配的', '社会需要+有人擅长+愿意交换', '祖辈一代代传下来的', '随机碰运气形成的'], 1],
  ['soc-06', '打字员这个职业消失因为', '技术进步（电脑语音输入）',
    ['打字员工作太偷懒了', '技术进步（电脑语音输入）', '打字员工资要求太高', '法律禁止这个职业'], 1],
  ['soc-08', '城镇化的"推力"来自', '乡村收入低·农业需要人减少',
    ['城市太好玩吸引力大', '乡村收入低·农业需要人减少', '政府强制人口搬迁', '气候变化庄稼歉收'], 1],
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
      if (!ex) continue;
      if ((ex.options?.[ex.answer] ?? '') !== expect) { console.log('不匹配: ' + id + ' 实际=' + (ex.options?.[ex.answer] ?? '').slice(0, 15)); continue; }
      ex.options = newOpts;
      ex.answer = ans;
      fixed++; changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('替换 ' + fixed + ' 题');
