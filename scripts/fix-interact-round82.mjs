import fs from 'node:fs';
import path from 'node:path';

/**
 * 第82轮：interact 卡片课内容修复（按 audit-interact 体检报告）。
 * - 整课重写：eth-08（5视图完全相同）、pe-04（3视图完全相同）、phys-10（画布残留+过薄）、bio-10（数字当标题）
 * - 定点修复：art-22 标题/内容、mus-08 座位碎片→对照卡、bio-09/eng-20/eng-26/eng-40/art-23/eth-25/chn-08/eth-09 标题与副题、bio-16 深夜补内容
 * 用法: npx tsx scripts/fix-interact-round82.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

/** 视图级重写：按旧视图的 when 顺序替换 */
function rewriteViews(l, views) {
  const olds = l.interact.views;
  if (olds.length !== views.length) throw new Error(l.id + ' 视图数不符 ' + olds.length + ' vs ' + views.length);
  l.interact.views = views.map((v, i) => ({ ...v, when: olds[i].when }));
}

const FIX = {
  'eth-08': {
    apply: (l) => rewriteViews(l, [
      { title: '流鼻血', subtitle: '别仰头！血会呛进气管', color: 'rose', emoji: '🩸', blocks: [
        { kind: 'steps', title: '正确处理三步', items: ['头稍向前倾（坐直或稍前倾）', '捏住鼻翼两侧软骨处 10 分钟', '冷敷额头和鼻梁，帮助血管收缩'] },
        { kind: 'info', icon: '❌', title: '常见错误', text: '仰头会让血倒流进咽喉呛入气管，塞纸巾可能损伤鼻黏膜' },
        { kind: 'highlight', text: '10 分钟后仍不止血，或反复流鼻血，要去医院查原因' },
      ] },
      { title: '烫伤', subtitle: '冲脱泡盖送 五字诀', color: 'orange', emoji: '🔥', blocks: [
        { kind: 'steps', title: '五步处理', items: ['冲：冷水冲 15 分钟以上', '脱：小心除去伤处衣物，粘连时剪开勿撕', '泡：冷水浸泡缓解疼痛', '盖：清洁纱布轻轻覆盖', '送：面积大或起大水泡及时送医'] },
        { kind: 'info', icon: '❌', title: '不要做', text: '不涂牙膏酱油香油，不挑破水泡——会污染创面' },
        { kind: 'highlight', text: '烫伤后第一时间冲冷水，比任何偏方都管用' },
      ] },
      { title: '异物卡喉', subtitle: '海姆立克急救法', color: 'amber', emoji: '🫁', blocks: [
        { kind: 'steps', title: '他人急救（站立位）', items: ['站到患者身后，双脚呈弓步稳住重心', '一手握拳，拳眼抵住肚脐上方两横指', '另一手包住拳头，快速向内向上冲击', '重复冲击直到异物咳出'] },
        { kind: 'info', icon: '👶', title: '婴儿不一样', text: '1 岁以下：面朝下趴在手臂上，掌根拍背 5 次，再翻正面压胸 5 次，交替进行' },
        { kind: 'highlight', text: '说不出话、掐住脖子双手乱抓 = 气道梗阻的典型信号' },
      ] },
      { title: '心搏骤停', subtitle: 'CPR 心肺复苏', color: 'red', emoji: '❤️', blocks: [
        { kind: 'steps', title: '按压流程', items: ['拍双肩呼喊判断意识，观察胸廓判断呼吸', '大声呼救，请人拨打 120 并取 AED', '两乳头连线中点，掌根按压，双臂伸直', '深度约 5 厘米，每分钟 100–120 次', '30 次按压 + 2 次人工呼吸循环'] },
        { kind: 'info', icon: '⏱️', title: '黄金 4 分钟', text: '大脑缺氧超过 4 分钟开始不可逆损伤——每早按一分钟，存活率高一分' },
        { kind: 'highlight', text: '不敢做人工呼吸？持续胸外按压同样有效，别停手' },
      ] },
      { title: '溺水', subtitle: '上岸后先判断呼吸', color: 'sky', emoji: '🏊', blocks: [
        { kind: 'steps', title: '岸上急救', items: ['清理口鼻里的泥沙水草', '判断意识和呼吸（5–10 秒）', '有呼吸：侧卧位保暖，等急救车', '无呼吸：立即开始胸外按压'] },
        { kind: 'info', icon: '❌', title: '老方法已淘汰', text: '倒挂控水、膝顶腹部都无用且耽误抢救时间——肺里的水很少，命在心跳不在水' },
        { kind: 'highlight', text: '会游泳 ≠ 不会溺水：抽筋、呛水、低温都可能让人沉底' },
      ] },
    ]),
  },
  'pe-04': {
    apply: (l) => rewriteViews(l, [
      { title: '原地运球', subtitle: '球感是一切的地基', color: 'green', emoji: '🏀', blocks: [
        { kind: 'steps', title: '动作要领', items: ['五指张开成碗状，掌心不碰球', '指尖和手腕发力向下按拍', '球弹到腰际高度最稳', '目视前方，不盯球'] },
        { kind: 'info', icon: '📆', title: '每日球感 5 分钟', text: '左右手各拍 50 次，弱侧手加倍练' },
        { kind: 'info', icon: '❌', title: '常见错误', text: '掌心拍球（球飞不稳）· 直腿弯腰（重心高不灵活）' },
      ] },
      { title: '行进间运球', subtitle: '让球跟着人走', color: 'teal', emoji: '🏃', blocks: [
        { kind: 'steps', title: '动作要领', items: ['按拍球的侧后方，把球推向斜前方', '脚步与拍球同频，节奏先慢后快', '膝盖微弯、重心降低', '球始终在身体侧前方半步'] },
        { kind: 'info', icon: '💡', title: '关键感觉', text: '人推着球走，不是追着球跑——球在身前，视野才开阔' },
        { kind: 'highlight', text: '抬头运球：眼睛看队友和篮筐，不看球' },
      ] },
      { title: '体前变向', subtitle: '过人的第一课', color: 'sky', emoji: '⚡', blocks: [
        { kind: 'steps', title: '动作要领', items: ['向一侧虚晃，诱对手移动重心', '换手按拍球的侧上方，改变球的方向', '蹬地加速，从另一侧突破', '变向瞬间把球压低，防抢断'] },
        { kind: 'info', icon: '💪', title: '下盘功夫', text: '膝盖弯、重心低，变向才快——腿直着变向等于站着挨抢' },
        { kind: 'highlight', text: '变向的假动作骗的是重心：晃肩 + 降速 + 突然加速' },
      ] },
    ]),
  },
  'phys-10': {
    apply: (l) => rewriteViews(l, [
      { title: '铝 · 2.7 g/cm³', subtitle: '同体积 20 cm³ → 质量 54 g', color: 'sky', emoji: '🥤', blocks: [
        { kind: 'info', icon: '🧮', title: '算一算', text: '密度 = 质量 ÷ 体积 = 54 g ÷ 20 cm³ = 2.7 g/cm³' },
        { kind: 'info', icon: '💡', title: '轻是铝的本事', text: '易拉罐、飞机机身都靠它——又轻又防锈' },
      ] },
      { title: '铁 · 7.9 g/cm³', subtitle: '同体积 20 cm³ → 质量 158 g', color: 'amber', emoji: '🍳', blocks: [
        { kind: 'info', icon: '🧮', title: '算一算', text: '158 g ÷ 20 cm³ = 7.9 g/cm³，约是铝的 3 倍重' },
        { kind: 'info', icon: '💡', title: '硬汉担当', text: '铁锅、钢筋、车架——结实便宜，就是容易生锈' },
      ] },
      { title: '铜 · 8.9 g/cm³', subtitle: '同体积 20 cm³ → 质量 178 g', color: 'orange', emoji: '🔌', blocks: [
        { kind: 'info', icon: '🧮', title: '算一算', text: '178 g ÷ 20 cm³ = 8.9 g/cm³' },
        { kind: 'info', icon: '💡', title: '导电高手', text: '电线芯、电机线圈都用铜——导电仅次于银，比银便宜得多' },
      ] },
      { title: '金 · 19.3 g/cm³', subtitle: '同体积 20 cm³ → 质量 386 g', color: 'amber', emoji: '🥇', blocks: [
        { kind: 'info', icon: '🧮', title: '算一算', text: '386 g ÷ 20 cm³ = 19.3 g/cm³——一立方厘米快半斤重' },
        { kind: 'info', icon: '💡', title: '沉甸甸的贵', text: '同体积比一比：金最重。真金坠手，假金轻飘' },
        { kind: 'highlight', text: '同体积比轻重 = 比密度。密度是物质的身份证，一测便知真伪' },
      ] },
    ]),
  },
  'bio-10': {
    apply: (l) => rewriteViews(l, [
      { title: '传递效率 5%', subtitle: '生产者固定 10000 kJ', color: 'green', emoji: '🌱', blocks: [
        { kind: 'info', icon: '🧮', title: '下一级得到', text: '10000 × 5% = 500 kJ' },
        { kind: 'highlight', text: '95% 的能量在这一级就没了：呼吸散热、残枝落叶、未被捕食' },
      ] },
      { title: '传递效率 10%', subtitle: '生产者固定 10000 kJ', color: 'teal', emoji: '🌿', blocks: [
        { kind: 'info', icon: '🧮', title: '下一级得到', text: '10000 × 10% = 1000 kJ（生态系统的常见值）' },
        { kind: 'highlight', text: '林德曼定律：平均约 10%——所以食物链一般不超过 5 级' },
      ] },
      { title: '传递效率 15%', subtitle: '生产者固定 10000 kJ', color: 'amber', emoji: '🌾', blocks: [
        { kind: 'info', icon: '🧮', title: '下一级得到', text: '10000 × 15% = 1500 kJ' },
        { kind: 'highlight', text: '效率越高，能养活的下一级越多——高产牧场的秘密' },
      ] },
      { title: '传递效率 20%', subtitle: '生产者固定 10000 kJ', color: 'orange', emoji: '🔥', blocks: [
        { kind: 'info', icon: '🧮', title: '下一级得到', text: '10000 × 20% = 2000 kJ（接近上限）' },
        { kind: 'highlight', text: '能量单向流动、逐级递减——所以营养级越高，生物数量越少' },
      ] },
    ]),
  },
  'art-22': {
    apply: (l) => {
      const names = ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色'];
      const lifes = ['消防车 · 红灯笼 · 警示标志', '橙子 · 暖灯光 · 秋天的落叶', '香蕉 · 向日葵 · 小黄帽', '树叶 · 草地 · 安全出口', '天空 · 大海 · 校服', '薰衣草 · 葡萄 · 紫罗兰'];
      l.interact.views.forEach((v, i) => {
        v.title = names[i];
        v.subtitle = v.blocks?.[0]?.text ?? '';
        if (v.blocks?.length) v.blocks[0] = { kind: 'info', icon: '🎨', title: '生活中的' + names[i], text: lifes[i] };
      });
    },
  },
  'mus-08': {
    apply: (l) => {
      const junk = new Set(['木管', '铜管', '打击', '弦乐（指挥正前方）']);
      l.interact.views.forEach((v) => {
        v.blocks = (v.blocks ?? []).filter((b) => !(b.kind === 'info' && junk.has((b.text ?? '').trim())));
        v.blocks.splice(2, 0, { kind: 'compare', title: '乐团座位（指挥视角）', items: [
          { label: '弦乐', value: '正前方' }, { label: '木管', value: '中排左侧' },
          { label: '铜管', value: '中排右侧' }, { label: '打击', value: '最后排' },
        ] });
      });
    },
  },
  'bio-09': {
    apply: (l) => l.interact.views.forEach((v) => { v.title = v.subtitle || v.title; v.subtitle = '胰岛素 vs 胰高血糖素'; }),
  },
  'eng-20': {
    apply: (l) => {
      const names = ['字母 A · /æ/', '字母 E · /e/', '字母 I · /ɪ/', '字母 O · /ɒ/', '字母 U · /ʌ/'];
      l.interact.views.forEach((v, i) => { v.title = names[i] ?? v.title; });
    },
  },
  'eng-26': {
    apply: (l) => {
      const t = ['介词：on', '介词：in（月份/季节）', '介词：in（年份）', '介词：at'];
      l.interact.views.forEach((v, i) => { v.title = t[i] ?? v.title; });
    },
  },
  'eng-40': {
    apply: (l) => {
      const s = ['一般过去时', '一般现在时', '一般将来时'];
      l.interact.views.forEach((v, i) => { v.subtitle = s[i] ?? ''; });
    },
  },
  'art-23': {
    apply: (l) => l.interact.views.forEach((v) => {
      const first = v.blocks?.[0];
      if (first?.kind === 'info' && first.text && !first.title) {
        v.title = first.text.split('（')[0];
        v.blocks.shift();
      }
    }),
  },
  'eth-25': {
    apply: (l) => {
      const t = ['场景：考试没考好', '场景：想买一双球鞋', '场景：被同学误会了'];
      l.interact.views.forEach((v, i) => { v.title = t[i] ?? v.title; v.subtitle = ''; });
    },
  },
  'chn-08': {
    apply: (l) => l.interact.views.forEach((v) => {
      const first = v.blocks?.[0];
      if (first?.kind === 'info' && first.text && !first.title) {
        v.subtitle = first.text;
        v.blocks.shift();
      }
    }),
  },
  'eth-09': {
    apply: (l) => l.interact.views.forEach((v) => {
      const first = v.blocks?.[0];
      if (first?.kind === 'info' && !first.title && first.text && first.text.length <= 10) {
        v.subtitle = first.text;
        v.blocks.shift();
      }
    }),
  },
  'bio-16': {
    apply: (l) => {
      const v3 = l.interact.views[2];
      if (v3) v3.blocks.splice(1, 0, { kind: 'info', icon: '🌙', title: '为什么夜里要呼吸', text: '没有光就不能光合作用，但细胞活着就要耗能——白天攒的有机物，夜里慢慢用' });
    },
  },
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const done = [], missed = [];
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    const fix = FIX[l.id];
    if (!fix || !l.interact) continue;
    fix.apply(l);
    changed = true;
    done.push(l.id);
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
for (const id of Object.keys(FIX)) if (!done.includes(id)) missed.push(id);
console.log('已修复:', done.join(', '));
if (missed.length) console.log('!! 未找到:', missed.join(', '));
