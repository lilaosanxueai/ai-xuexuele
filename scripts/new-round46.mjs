import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第46轮拓展批：数学小学+4 语文小学+2 英语小学+2 = 8 节（订单号 396-403） */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

/* ================= 数学·小学 +4 ================= */

L['math-88'] = mk({ id: 'math-88', island: 'math', order: 396, title: '人民币：购物与找零', emoji: '💰',
  subjectArea: '数学', gradeBand: 'primary', grade: 2, textbook: '人教版数学（二年级）',
  curriculum: { module: '元角分', points: ['元角分的换算', '购物付款组合', '找零的计算'] },
  story: '一支铅笔 8 角，一块橡皮 1 元 2 角，付 2 元应找回多少？人民币的世界里藏着加减法的实战演练——今天你就是小收银员！',
  goals: ['掌握元角分换算', '会组合付款方式', '会计算找零'],
  aiIntro: '💰 拨动商品选择和付款面额，看找零怎么算——小超市收银台！',
  lab: { params: [{ name: 'item', label: '买什么', min: 1, max: 3, step: 1, value: 1 },
                  { name: 'pay', label: '付几元', min: 2, max: 10, step: 1, value: 5 }],
    grid: false, explore: ['item=2 一共多少钱、找零多少？', '怎样付款最方便（张数最少）？', '1 元等于几角？'],
    code: `# 小超市收银台
item = 1   # 商品
pay = 5    # 付的钱（元）

hide()
name = "铅笔"
price = 0.8
if item == 2:
    name = "橡皮"
    price = 1.2
if item == 3:
    name = "文具盒"
    price = 6.5
change = pay - price
fill_rect(0, 130, 340, 30, "#1d4ed8")
write(name + " " + price + " 元，付 " + pay + " 元", 0, 130, "#fff", 12)
fill_rect(0, 78, 340, 36, "#fef3c7")
if change >= 0:
    write("应找回：" + change + " 元", 0, 78, "#b45309", 13)
if change < 0:
    write("钱不够！还差 " + (0 - change) + " 元", 0, 78, "#dc2626", 13)
fill_rect(-100, 10, 70, 40, "#22c55e")
write("1元", -100, 10, "#fff", 11)
fill_rect(0, 10, 70, 40, "#3b82f6")
write("5元", 0, 10, "#fff", 11)
fill_rect(100, 10, 70, 40, "#a855f7")
write("10元", 100, 10, "#fff", 11)
write("1 元 = 10 角    1 角 = 10 分", -30, -40, "#7c3aed", 12)
write("付款小技巧：先凑整元，再补零头", -30, -68, "#0369a1", 11)
`,
  },
  teach: { sections: [
      { title: '元角分', body: '【1 元 = 10 角，1 角 = 10 分，1 元 = 100 分】\n人民币面值：1角5角1元5元10元20元50元100元。\n换算口诀：元变角乘十，角变分乘十；反过来除以十。' },
      { title: '组合付款', body: '【付指定金额有很多种组合，张数最少的最好】\n例：付 8 元 = 5元+1元+1元+1元（4张）或 5元+2元+1元（3张）。\n策略：先用大面值凑，不足的用小面值补。' },
      { title: '找零计算', body: '【找零 = 付的钱 − 商品价钱】\n例：买 6 元 5 角付 10 元，找 3 元 5 角。\n验算：找零 + 价钱 = 付款。\n生活应用：先算总价，再想怎么付，最后核对找零。' },
    ], examples: [
      { q: '买 3 元 6 角的笔记本，付 5 元，找回多少？', steps: ['统一单位：5 元 = 50 角', '3 元 6 角 = 36 角', '50 − 36 = 14 角', '找 1 元 4 角'], tip: '化角计算最稳' },
      { q: '付 7 元，怎样拿张数最少的人民币？', steps: ['5 元 1 张', '2 元 1 张', '共 2 张', '5+2=7 最少'], tip: '大面值优先' },
    ], mistakes: ['元和角直接相减（要统一单位）', '找零后不验算'] },
  exercises: [
    { q: '1 元 = 几角？', options: ['10 角', '100 角', '5 角', '2 角'], answer: 0, explain: '十进制' },
    { q: '3 元 5 角 = 几角？', options: ['35 角', '53 角', '8 角', '350 角'], answer: 0, explain: '3×10+5' },
    { q: '买 4 元物品付 10 元，找？', options: ['6 元', '5 元', '14 元', '4 元'], answer: 0, explain: '10−4' },
    { q: '付 8 元最少用几张（有5元2元1元）？', options: ['2 张', '3 张', '8 张', '1 张'], answer: 0, explain: '5+2+1' },
    { q: '1 角 = 几分？', options: ['10 分', '100 分', '5 分', '2 分'], answer: 0, explain: '十进制' },
    { q: '6 元 5 角付 10 元找？', options: ['3 元 5 角', '4 元 5 角', '3 元', '5 元'], answer: 0, explain: '10−6.5' },
  ],
});

L['math-89'] = mk({ id: 'math-89', island: 'math', order: 397, title: '认识角：锐角直角钝角', emoji: '📏',
  subjectArea: '数学', gradeBand: 'primary', grade: 2, textbook: '人教版数学（二年级）',
  curriculum: { module: '图形与几何', points: ['角的组成', '角的分类', '角的大小与边长无关'] },
  story: '剪刀张开是角，钟表的两根针也是角。角的世界只有三位主角：锐角（小巧）、直角（标准）、钝角（开阔）——而且角的大小和边的长短没关系，只看张口！',
  goals: ['认识角的组成', '会分类锐角直角钝角', '理解角的大小与边长无关'],
  aiIntro: '📏 拖动角度滑块，看角怎么改名换姓——角的大观园！',
  lab: { params: [{ name: 'ang', label: '角度（°）', min: 10, max: 180, step: 10, value: 45 }],
    grid: false, explore: ['角度跨过 90 时名字怎么变？', '180° 的角叫什么？', '边画长一些角会变大吗？'],
    code: `# 角的大观园
ang = 45   # 角度

hide()
kind = "锐角"
col = "#22c55e"
note = "小于 90°：像削尖的铅笔"
if ang == 90:
    kind = "直角"
    col = "#3b82f6"
    note = "正好 90°：像课桌的角（可以用三角尺验证）"
if ang > 90:
    kind = "钝角"
    col = "#f97316"
    note = "大于 90° 小于 180°：像张开的扇子"
if ang == 180:
    kind = "平角"
    col = "#a855f7"
    note = "180°：两条边拉成一条直线"
fill_rect(0, 130, 340, 30, col)
write(ang + "° 是" + kind, 0, 130, "#fff", 14)
pen_color("#0f172a")
pen_down()
go_to(-150, -40)
go_to(60, -40)
pen_up()
pen_down()
go_to(-150, -40)
go_to(-150 + 160 * cos(ang), -40 - 160 * sin(ang))
pen_up()
circle(-150, -40, 12, col)
write("顶点", -150, -75, "#64748b", 9)
fill_rect(0, 60, 340, 36, "#fef3c7")
write(note, 0, 60, "#b45309", 11)
write("角的大小看张口，不看边的长短", -30, 100, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '角的组成', body: '【一个顶点 + 两条边 = 角】\n记角：∠1、∠AOB（顶点字母放中间）。\n画角三步：定顶点→画一条边→用量角器量度数画另一条边。' },
      { title: '角的分类', body: '【锐角 < 90°；直角 = 90°；90° < 钝角 < 180°；平角 = 180°】\n判断直角：用三角尺的直角比一比（顶点对顶点，边对边）。\n一副三角尺能拼出 75°、105°、120°、135°、150°。' },
      { title: '大小与边长', body: '【角的大小由两条边张开的程度决定，与边的长短无关】\n放大镜看角，角不变大——变大的只是边。\n比较角：顶点对顶点，一条边对齐，看另一条边的位置。' },
    ], examples: [
      { q: '用三角尺比一比，怎样判断直角？', steps: ['三角尺的直角顶点对角的顶点', '一条直角边与角的一条边重合', '看另一条边是否也重合', '都重合=直角'], tip: '两重合判定' },
      { q: '把一个角的两条边各延长 3 厘米，角变大了吗？', steps: ['角的大小只看张口', '边延长张口没变', '角的大小不变', '只是看起来边更长'], tip: '张口定大小' },
    ], mistakes: ['认为边长的角大（张口才决定）', '认为钝角大于 180°（那叫平角/周角）'] },
  exercises: [
    { q: '角是由什么组成的？', options: ['一个顶点和两条边', '三条边', '两个点', '一条线'], answer: 0, explain: '顶点+两边' },
    { q: '直角是多少度？', options: ['90°', '45°', '180°', '60°'], answer: 0, explain: '标准角' },
    { q: '比 90° 小的角叫？', options: ['锐角', '钝角', '平角', '直角'], answer: 0, explain: '小巧锐利' },
    { q: '120° 的角是？', options: ['钝角', '锐角', '直角', '平角'], answer: 0, explain: '90<钝角<180' },
    { q: '角的大小与什么有关？', options: ['两边张口', '边的长短', '顶点位置', '颜色'], answer: 0, explain: '张口定大小' },
    { q: '180° 的角叫？', options: ['平角', '钝角', '直角', '周角'], answer: 0, explain: '拉成直线' },
  ],
});

L['math-90'] = mk({ id: 'math-90', island: 'cross', order: 398, title: '克与千克：称一称', emoji: '⚖️',
  subjectArea: '数学', gradeBand: 'primary', grade: 2, textbook: '人教版数学（二年级）',
  curriculum: { module: '量的计量', points: ['克与千克的关系', '选择合适的单位', '估测物体质量'] },
  story: '一枚硬币约 1 克，一袋盐 500 克，两袋盐就是 1 千克——克称轻小，千克称重磅。买菜、寄快递、做实验都离不开它们，你的手感就是最好的秤！',
  goals: ['掌握克与千克换算', '会选合适单位', '会估测常见物品质量'],
  aiIntro: '⚖️ 拨动物品选择器，猜猜它用克还是千克——物品秤重台！',
  lab: { params: [{ name: 'obj', label: '物品', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['obj=4 一头牛能用克吗？', '你的书包大约多重？', '1 千克棉花和 1 千克铁谁重？'],
    code: `# 物品秤重台
obj = 1   # 物品

hide()
name = "一枚2分硬币"
w = "约 1 克"
unit = "克"
feel = "放在手心几乎没感觉"
if obj == 2:
    name = "一个苹果"
    w = "约 200 克"
    unit = "克"
    feel = "一个手掌的分量"
if obj == 3:
    name = "一袋食用盐"
    w = "500 克"
    unit = "克"
    feel = "两袋就是 1 千克"
if obj == 4:
    name = "一头牛"
    w = "约 400 千克"
    unit = "千克"
    feel = "称重的大家伙用千克"
if obj == 5:
    name = "你的书包（装满书）"
    w = "约 3-5 千克"
    unit = "千克"
    feel = "背久了肩膀酸"
fill_rect(0, 130, 340, 30, "#16a34a")
write(name + "：" + w, 0, 130, "#fff", 13)
fill_rect(0, 76, 340, 40, "#f1f5f9")
write("单位：" + unit, 0, 76, "#0f172a", 12)
fill_rect(0, 20, 340, 44, "#fef3c7")
write("手感：" + feel, 0, 20, "#b45309", 11)
write("1000 克 = 1 千克", -60, -40, "#dc2626", 13)
write("轻小物品用克，重大家伙用千克", -30, -70, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '克与千克', body: '【1 千克 = 1000 克；克记 g，千克记 kg】\n1 克的参照：一枚 2 分硬币；1 千克的参照：两袋 500 克的盐、两瓶矿泉水。\n换算：千克→克乘 1000；克→千克除以 1000。' },
      { title: '选单位', body: '【轻小（硬币、橡皮、黄豆）用克】【较重（书包、西瓜、人、大米袋）用千克】\n判断法：数字合常理吗？——小明体重 30 克（×）、30 千克（√）。\n写质量别忘写单位，没单位的数没有意义。' },
      { title: '估测', body: '【建立参照物：1 克硬币、500 克盐、1 千克两瓶水、自己的体重】\n估一估：一个鸡蛋 ≈ 50 克（约 20 个 1 千克）；一个西瓜 ≈ 4 千克。\n用天平/电子秤验证估测——误差在合理范围就是好手感。' },
    ], examples: [
      { q: '一个西瓜约重 4（ ），填单位？', steps: ['西瓜是大家伙', '用千克', '4 千克 ≈ 4000 克，合理'], tip: '先想物体再配数' },
      { q: '2 千克苹果和 1500 克橘子谁重？', steps: ['统一单位：2 千克 = 2000 克', '比较：2000 > 1500', '苹果重', '答：苹果重 500 克'], tip: '统一单位再比' },
    ], mistakes: ['见数就填克（大家伙用千克）', '1 千克记成 100 克（是 1000 克）'] },
  exercises: [
    { q: '1 千克 = 几克？', options: ['1000 克', '100 克', '10 克', '500 克'], answer: 0, explain: '千进制' },
    { q: '一枚硬币约重？', options: ['1 克', '1 千克', '100 克', '10 千克'], answer: 0, explain: '轻小用克' },
    { q: '小明的体重约 30（ ）', options: ['千克', '克', '吨', '厘米'], answer: 0, explain: '人体重' },
    { q: '3 千克 = 几克？', options: ['3000 克', '300 克', '30 克', '3 克'], answer: 0, explain: '×1000' },
    { q: '1 千克棉花和 1 千克铁？', options: ['一样重', '棉花重', '铁重', '没法比'], answer: 0, explain: '质量相同' },
    { q: '一个鸡蛋约重？', options: ['50 克', '5 克', '500 克', '2 千克'], answer: 0, explain: '约20个1千克' },
  ],
});

L['math-91'] = mk({ id: 'math-91', island: 'cross', order: 399, title: '条形统计图：数据会说话', emoji: '📊',
  subjectArea: '数学', gradeBand: 'primary', grade: 3, textbook: '人教版数学（三年级）',
  curriculum: { module: '统计与概率', points: ['收集与整理数据', '条形统计图的画法', '从图中获取信息'] },
  story: '全班同学最喜欢的水果是哪种？光看一堆名字看不出名堂，画成条形统计图——谁高谁低一目了然。数据不会撒谎，还会讲故事！',
  goals: ['会收集整理数据', '会画条形统计图', '会根据图表回答问题'],
  aiIntro: '📊 拖动苹果的票数，看条形图实时长高——数据广播台！',
  lab: { params: [{ name: 'apple', label: '喜欢苹果的人数', min: 2, max: 12, step: 1, value: 6 }],
    grid: false, explore: ['苹果比香蕉多几人？', '一格代表几人？一格代表 1 人和 2 人有什么区别？', '怎样从图中快速找出最多的？'],
    code: `# 数据广播台
apple = 6   # 喜欢苹果的人数

hide()
banana = 5
grape = 3
peach = 4
fill_rect(0, 130, 340, 30, "#1d4ed8")
write("三（2）班最喜欢的水果调查（共 " + (apple + banana + grape + peach) + " 人）", 0, 130, "#fff", 11)
pen_color("#0f172a")
pen_down()
go_to(-150, -80)
go_to(170, -80)
go_to(170, 100)
pen_up()
vals0 = apple
vals1 = banana
vals2 = grape
vals3 = peach
mx = apple
if banana > mx:
    mx = banana
if grape > mx:
    mx = grape
if peach > mx:
    mx = peach
unit = 80 / mx
fill_rect(-120, -80 + apple * unit / 2, 44, apple * unit, "#dc2626")
write(apple, -120, -80 + apple * unit + 12, "#dc2626", 11)
write("苹果", -120, -98, "#0f172a", 10)
fill_rect(-60, -80 + banana * unit / 2, 44, banana * unit, "#f59e0b")
write(banana, -60, -80 + banana * unit + 12, "#b45309", 11)
write("香蕉", -60, -98, "#0f172a", 10)
fill_rect(0, -80 + grape * unit / 2, 44, grape * unit, "#a855f7")
write(grape, 0, -80 + grape * unit + 12, "#7c3aed", 11)
write("葡萄", 0, -98, "#0f172a", 10)
fill_rect(60, -80 + peach * unit / 2, 44, peach * unit, "#fca5a5")
write(peach, 60, -80 + peach * unit + 12, "#dc2626", 11)
write("桃子", 60, -98, "#0f172a", 10)
if apple >= mx:
    write("★ 最受欢迎：苹果！", 0, 108, "#dc2626", 11)
if banana > apple:
    write("★ 最受欢迎：香蕉！", 0, 108, "#b45309", 11)
`,
  },
  teach: { sections: [
      { title: '收集与整理', body: '【收集：调查、记录（画正字最方便）】\n【整理：分类数一数，制成统计表】\n"正"字计数法：一笔 1 个，一个正字 5 个。\n数据要真实——统计的生命是诚实。' },
      { title: '画条形图', body: '【步骤：画横轴（类别）纵轴（数量）→ 定每格代表几→ 画直条（宽度相同、间隔均匀）→ 标数据】\n每格代表几由数据大小决定：数据大用 2、5、10，数据小用 1。\n直条要画得一样宽，高度对准刻度。' },
      { title: '读图', body: '【看最高：最多项；看最矮：最少项；做减法：相差多少】\n常见问题：一共多少（加法）、谁比谁多几（减法）、是几倍（除法）。\n预测与决策：根据数据提建议（多买苹果）——统计是为了更好地决定。' },
    ], examples: [
      { q: '调查 40 人喜欢的水果，每格代表 2 人，纵轴最多画几格？', steps: ['先找最大数据：假设 12 人', '12 ÷ 2 = 6 格', '再加表头留 1-2 格', '约 7-8 格够用'], tip: '格数看最大值' },
      { q: '苹果 12 人、香蕉 7 人，苹果比香蕉多几人？多几倍关系接近吗？', steps: ['12 − 7 = 5（人）', '12 ÷ 7 ≈ 1.7', '多 5 人，约 1.7 倍', '减法答差，除法答倍数'], tip: '看清问的是差还是倍' },
    ], mistakes: ['直条宽度不一（条形图要等宽）', '每格代表几没看刻度就报数'] },
  exercises: [
    { q: '记录数据最常用的方法是？', options: ['画正字', '拍照', '背下来', '随便记'], answer: 0, explain: '一个正字5个' },
    { q: '条形图的直条应该？', options: ['宽度相同', '高矮相同', '颜色相同', '随便画'], answer: 0, explain: '高度表数量' },
    { q: '数据很大时每格可代表？', options: ['2、5 或 10', '只能 1', '0.1', '1000'], answer: 0, explain: '灵活定刻度' },
    { q: '最高的直条表示？', options: ['数量最多', '数量最少', '时间最长', '最重'], answer: 0, explain: '高=多' },
    { q: '苹果 9 人香蕉 6 人，共几人？', options: ['15 人', '3 人', '54 人', '9 人'], answer: 0, explain: '加法' },
    { q: '统计最重要的品质是？', options: ['数据真实', '图画得美', '颜色多', '字大'], answer: 0, explain: '诚实记录' },
  ],
});

/* ================= 语文·小学 +2 ================= */

L['chn-20'] = mk({ id: 'chn-20', island: 'cross', order: 400, title: '查字典：部首查字法', emoji: '📕',
  subjectArea: '语文', gradeBand: 'primary', grade: 2, textbook: '统编版语文（二年级）',
  curriculum: { module: '识字与写字', points: ['部首的确定', '部首查字法四步', '音序查字法的选择'] },
  story: '遇到不认识的字怎么办？问字典！知道读音用音序查字法，不知道读音就用部首查字法——会查字典的孩子，等于随身带了一位不说话的老师。',
  goals: ['会确定常见部首', '掌握部首查字法四步', '知道两种查字法各何时用'],
  aiIntro: '📕 拨动步骤滑块，看部首查字法怎么一步步找到「湖」——查字典演示器！',
  lab: { params: [{ name: 'step', label: '步骤', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['step=1 湖 的部首是什么？', '查到部首后还要数什么？', '什么情况下用音序查字法？'],
    code: `# 查字典演示器（以查 湖 为例）
step = 1   # 步骤

hide()
t = "① 找部首：湖 → 三点水（氵）"
d = "左右结构的字一般看偏旁：湖 是左右结构，左边 氵"
if step == 2:
    t = "② 数部首笔画：氵 = 3 画"
    d = "在部首目录里找到 3 画区的 氵，记下页码"
if step == 3:
    t = "③ 数剩余笔画：湖 去掉 氵 剩 胡 = 9 画"
    d = "翻到 氵 部，在 9 画里找到 湖"
if step == 4:
    t = "④ 按页码翻到正文：湖 hú，湖泊的湖"
    d = "读音、意思、组词一次看全"
fill_rect(0, 130, 360, 32, "#dc2626")
write(t, 0, 130, "#fff", 11)
fill_rect(0, 76, 360, 42, "#f1f5f9")
write(d, 0, 76, "#0f172a", 10)
i = 1
while i < 5:
    x = -110 + (i - 1) * 74
    if i <= step:
        fill_rect(x, -45, 64, 44, "#dc2626")
        write("第" + i + "步✓", x, -45, "#fff", 10)
    if i > step:
        fill_rect(x, -45, 64, 44, "#e2e8f0")
        write("第" + i + "步", x, -45, "#64748b", 10)
    i = i + 1
write("知道读音 → 音序查字法（先查大写字母）", -20, -100, "#7c3aed", 10)
write("不知道读音 → 部首查字法", -40, -125, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '找部首', body: '【左右结构看偏旁（湖→氵）；上下结构看部首（想→心）】\n【独体字看起笔（农→冖）】\n常见部首要记熟：氵亻口日木艹扌亠宀……\n拿不准部首：数总笔画，在难检字表中查。' },
      { title: '四步查字法', body: '【①找部首数它的笔画 ②在部首目录找到页码 ③数去掉部首后剩几画 ④在检字表对应画数里找到字和页码】\n翻到正文页：读音、意思、组词全都看到。\n熟能生巧——查 20 个字就是小达人。' },
      { title: '两种查法怎么选', body: '【知道读音不会写/想了解意思 → 音序查字法（先大写字母再音节）】\n【不认识这个字 → 部首查字法】\n例：知道 hú 这个音查 湖 用音序；路上看到 邕 不认识，用部首。\n字典是不说话的老师，会用字典=自学开挂。' },
    ], examples: [
      { q: '查 蜜 字：部首是什么？剩余几画？', steps: ['蜜 是上中下结构，部首 虫', '虫 = 6 画', '去掉虫：宀+必 = 9 画', '在虫部 9 画里找'], tip: '结构定部首' },
      { q: '"彳亍"两个字都不认识怎么办？', steps: ['不认识→部首查字法', '彳：独体部首本身，3 画', '亍：部首 二 或难检表', '也可用手机拼音手写辅助，但会查字典才是真本事'], tip: '难检字表兜底' },
    ], mistakes: ['数剩余笔画时把部首又算进去（去掉部首再数）', '知道读音还硬用部首查（音序更快）'] },
  exercises: [
    { q: '不认识字时用？', options: ['部首查字法', '音序查字法', '随机翻', '放弃'], answer: 0, explain: '不知读音用部首' },
    { q: '湖 的部首是？', options: ['氵', '古', '月', '胡'], answer: 0, explain: '三点水' },
    { q: '氵 是几画？', options: ['3 画', '2 画', '4 画', '1 画'], answer: 0, explain: '点点提' },
    { q: '知道读音查字用？', options: ['音序查字法', '部首查字法', '数笔画法', '问同学'], answer: 0, explain: '先大写字母' },
    { q: '查到字后能看到？', options: ['读音意思组词', '只有读音', '只有笔画', '图片'], answer: 0, explain: '一条龙信息' },
    { q: '画正字记录适合？', options: ['收集数据', '练毛笔', '画画', '数部首'], answer: 0, explain: '一笔一个' },
  ],
});

L['chn-21'] = mk({ id: 'chn-21', island: 'cross', order: 401, title: '口语交际：打电话与请教', emoji: '📞',
  subjectArea: '语文', gradeBand: 'primary', grade: 2, textbook: '统编版语文（二年级）',
  curriculum: { module: '口语交际', points: ['打电话的礼仪', '向人请教的技巧', '礼貌用语'] },
  story: '打电话看不见表情，全靠声音传礼貌；请教别人要挑时机、说清楚、会道谢。这些"说话的本事"课本叫口语交际——学会了，人人愿意帮你！',
  goals: ['掌握打电话的基本礼仪', '会清楚地向人请教问题', '灵活使用礼貌用语'],
  aiIntro: '📞 切换情景卡片，看小嘴巴怎么说最得体——口语交际演练台！',
  lab: { params: [{ name: 'scene', label: '情景', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['打电话先说什么？', '对方不在怎么办？', '请教时怎么开口最礼貌？'],
    code: `# 口语交际演练台
scene = 1   # 情景

hide()
t = "情景一：给同学打电话约作业"
a1 = "您好，我是小明，请问小华在家吗？"
a2 = "（对方接了）打扰了，我想问今天的数学作业……谢谢！"
tip = "先报姓名→说事情→道谢；对方不在要礼貌留言"
if scene == 2:
    t = "情景二：向老师请教问题"
    a1 = "老师好！我有一个问题想请教您，现在方便吗？"
    a2 = "问题是……（说得具体清楚）谢谢老师！"
    tip = "先问方不方便→问题说具体→认真听→道谢"
if scene == 3:
    t = "情景三：打错了电话"
    a1 = "对不起，我打错电话了，打扰您了。"
    a2 = "（轻轻挂断，重新拨号）"
    tip = "打错要道歉，不能不说话就挂断"
fill_rect(0, 130, 360, 30, "#16a34a")
write(t, 0, 130, "#fff", 12)
fill_rect(0, 76, 360, 42, "#f1f5f9")
write("说：" + a1, 0, 76, "#0f172a", 10)
fill_rect(0, 18, 360, 46, "#fef3c7")
write("再说：" + a2, 0, 18, "#b45309", 10)
fill_rect(0, -34, 360, 36, "#eff6ff")
write("要点：" + tip, 0, -34, "#1d4ed8", 10)
write("礼貌用语：请 您好 谢谢 对不起 没关系", -20, -80, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '打电话', body: '【三步：自报家门（您好，我是xx）→ 说事情（清楚简洁）→ 道谢再见】\n对方不在：请问什么时候回来/麻烦您转告。\n打错了要说对不起再挂断。\n声音清晰、语气亲切，重要信息（时间地点）要重复确认。' },
      { title: '请教别人', body: '【四招：挑时机（别人忙吗）→ 会开口（有个问题想请教您）→ 说清楚（问题具体不笼统）→ 真道谢】\n听的时候看着对方，不打断；没听懂礼貌再说一遍。\n请教不是丢人——会请教的孩子进步最快。' },
      { title: '礼貌用语', body: '【请求用请；见面问您好；受助说谢谢；抱歉对不起；回应没关系/不客气】\n称呼要对：长辈用您，老师同学称呼清楚。\n礼貌不是客套，是把对方放在心上。' },
    ], examples: [
      { q: '电话接通后第一句话说什么？', steps: ['问好+自报家门', '您好，我是二（3）班的明明', '再说明找谁、什么事', '不能劈头就问'], tip: '先亮身份' },
      { q: '想请教老师但老师在批作业，怎么办？', steps: ['观察：老师正在忙', '等一等或问：老师您现在方便吗', '得到允许再问', '道谢后不打扰'], tip: '时机很重要' },
    ], mistakes: ['电话接通直接说事（先自报家门）', '请教时问题说得笼统（别人没法帮）'] },
  exercises: [
    { q: '打电话应先？', options: ['自报家门', '直接说事', '唱歌', '沉默'], answer: 0, explain: '您好我是xx' },
    { q: '打错电话应该？', options: ['道歉后挂断', '直接挂断', '骂人', '聊几句'], answer: 0, explain: '说对不起' },
    { q: '请教前要考虑？', options: ['时机是否合适', '天气', '衣服', '午饭'], answer: 0, explain: '不打扰别人' },
    { q: '受助之后要说？', options: ['谢谢', '再见', '不吭声', '走开'], answer: 0, explain: '感恩表达' },
    { q: '请教时问题要？', options: ['说得具体', '越模糊越好', '不说清楚', '让别人猜'], answer: 0, explain: '具体才好帮' },
    { q: '对长辈称呼用？', options: ['您', '喂', '那个人', '哎'], answer: 0, explain: '敬称' },
  ],
});

/* ================= 英语·小学 +2 ================= */

L['eng-27'] = mk({ id: 'eng-27', island: 'cross', order: 402, title: '食物与 I like 句型', emoji: '🍎',
  subjectArea: '英语', gradeBand: 'primary', grade: 3, textbook: '人教PEP英语三年级下册',
  curriculum: { module: '食物话题', points: ['常见食物单词', 'I like / I don\'t like', '可数与不可数'] },
  story: 'apple 苹果、rice 米饭、milk 牛奶——会用 I like… 和 I don\'t like… 说喜欢，你就能和外国朋友聊吃了！小心：rice 和 milk 没有复数哦。',
  goals: ['掌握 8 个食物单词', '会用 like 表达喜好', '区分可数与不可数名词'],
  aiIntro: '🍎 拨动食物转盘，用英语说喜欢或不喜欢——美食喜好台！',
  lab: { params: [{ name: 'food', label: '食物', min: 1, max: 4, step: 1, value: 1 },
                  { name: 'like', label: '喜欢吗', min: 0, max: 1, step: 1, value: 1 }],
    grid: false, explore: ['like=0 时句子怎么说？', '哪些食物加 s，哪些不加？', '你最喜欢吃什么？用英语说！'],
    code: `# 美食喜好台
food = 1   # 食物
like = 1   # 1 喜欢 0 不喜欢

hide()
word = "apples"
cn = "苹果"
plural = "可数名词：可以加 s"
emo = "🍎"
if food == 2:
    word = "rice"
    cn = "米饭"
    plural = "不可数名词：不能加 s"
    emo = "🍚"
if food == 3:
    word = "milk"
    cn = "牛奶"
    plural = "不可数名词：不能加 s"
    emo = "🥛"
if food == 4:
    word = "noodles"
    cn = "面条"
    plural = "习惯用复数"
    emo = "🍜"
sent = "I like " + word + "."
if like == 0:
    sent = "I don't like " + word + "."
fill_rect(0, 130, 340, 32, "#16a34a")
write(emo + " " + word + "（" + cn + "）", 0, 130, "#fff", 14)
fill_rect(0, 76, 340, 40, "#fef3c7")
write(sent, 0, 76, "#b45309", 14)
fill_rect(0, 20, 340, 44, "#f1f5f9")
write("单词说明：" + plural, 0, 20, "#0f172a", 10)
write("问答：Do you like apples? — Yes, I do. / No, I don't.", -10, -30, "#1d4ed8", 10)
write("食物单词：apple rice milk noodles bread egg fish juice", -10, -60, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '食物单词', body: '【apple 苹果 · bread 面包 · rice 米饭 · milk 牛奶 · egg 鸡蛋 · fish 鱼 · noodles 面条 · juice 果汁】\n可数：apple(s)、egg(s)——有单复数。\n不可数：rice、milk、bread、juice——永远不加 s，说 some rice。' },
      { title: 'like 句型', body: '【肯定：I like apples.（喜欢的一类用复数）】\n【否定：I don\'t like noodles.（don\'t = do not）】\n【问答：Do you like milk? —Yes, I do. / No, I don\'t.】\n第三人称：She likes apples.（注意 likes）' },
      { title: '可数与不可数', body: '【可数名词：一个一个数得清（an apple → two apples）】\n【不可数名词：没法数个数（rice, milk, water, bread）】\n不可数要量化得借量词：a glass of milk、two bowls of rice。\n口诀：能数加 s，不能数用 some。' },
    ], examples: [
      { q: '表达"我喜欢苹果"（一类）', steps: ['喜欢一类水果用复数', 'apples', 'I like apples.', '别忘 s'], tip: '一类用复数' },
      { q: 'Do you like juice? 怎么回答？', steps: ['juice 不可数不影响回答', '喜欢：Yes, I do.', '不喜欢：No, I don\'t.', '用 do 回答'], tip: 'do 问答配套' },
    ], mistakes: ['I like apple（指一类应用 apples）', 'rice 加 s（不可数）'] },
  exercises: [
    { q: '米饭的英语是？', options: ['rice', 'milk', 'bread', 'noodles'], answer: 0, explain: '不可数' },
    { q: '我不喜欢牛奶 怎么说？', options: ['I don\'t like milk.', 'I not like milk.', 'I don\'t likes milk.', 'I like milk.'], answer: 0, explain: "don't + 原形" },
    { q: '下列可数名词是？', options: ['egg', 'rice', 'milk', 'water'], answer: 0, explain: 'eggs' },
    { q: 'Do you like bread? 肯定回答？', options: ['Yes, I do.', 'Yes, I like.', 'No, I do.', 'Yes, it is.'], answer: 0, explain: 'do 问 do 答' },
    { q: 'She ___ apples.', options: ['likes', 'like', 'liking', 'to like'], answer: 0, explain: '三单加s' },
    { q: '两碗米饭怎么表达？', options: ['two bowls of rice', 'two rices', 'two rice', 'rices'], answer: 0, explain: '借量词' },
  ],
});

L['eng-28'] = mk({ id: 'eng-28', island: 'cross', order: 403, title: '月份与生日表达', emoji: '🎂',
  subjectArea: '英语', gradeBand: 'primary', grade: 4, textbook: '人教PEP英语四年级下册',
  curriculum: { module: '时间话题', points: ['十二个月份单词', 'My birthday is in…', '序数词表示日期'] },
  story: '一年十二个月，每个月都有自己的英文名字——January 一月开门，December 十二月收尾。学会它们，就能用英语说出自己的生日：My birthday is in May!',
  goals: ['记住十二个月份', '会表达生日所在月份', '会用序数词说日期'],
  aiIntro: '🎂 拨动月份转盘，看季节和生日句子一起出现——生日月份转盘！',
  lab: { params: [{ name: 'm', label: '月份', min: 1, max: 12, step: 1, value: 1 }],
    grid: false, explore: ['你生日在哪个月？用英语说说', '月份首字母有什么规矩？', 'May 是几月？和情态动词 may 怎么区分？'],
    code: `# 生日月份转盘
m = 1   # 月份

hide()
name = "January"
season = "冬天 ❄️"
if m == 2:
    name = "February"
if m == 3:
    name = "March"
    season = "春天 🌱"
if m == 4:
    name = "April"
if m == 5:
    name = "May"
if m == 6:
    name = "June"
    season = "夏天 ☀️"
if m == 7:
    name = "July"
if m == 8:
    name = "August"
if m == 9:
    name = "September"
    season = "秋天 🍂"
if m == 10:
    name = "October"
if m == 11:
    name = "November"
if m == 12:
    name = "December"
    season = "冬天 ❄️"
fill_rect(0, 130, 340, 32, "#a855f7")
write("Month " + m + "：" + name + "（" + season + "）", 0, 130, "#fff", 13)
fill_rect(0, 74, 340, 44, "#fef3c7")
write("My birthday is in " + name + ".", 0, 74, "#b45309", 13)
fill_rect(0, 16, 340, 46, "#f1f5f9")
write("问答：When is your birthday? — It's in " + name + ".", 0, 16, "#0f172a", 10)
write("月份首字母要大写；具体日期用序数词（May 1st）", -20, -40, "#dc2626", 10)
write("缩写：Jan. Feb. Mar. …（前三个字母加点）", -20, -68, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '十二个月', body: '【January February March | April May June | July August September | October November December】\n分段记：每三月一组，配季节背。\n首字母必须大写；缩写取前三字母加点（Sep. / Sept.）。\n易混：May 五月 vs may 可以；March 行军 vs 三月。' },
      { title: '生日表达', body: '【问：When is your birthday?】【答：My birthday is in May. / It\'s in May.】\n月份前用 in（in July）。\n具体日期：My birthday is on May 1st.（日期前用 on，用序数词）。\n序数词：1st 2nd 3rd 21st，其余 th。' },
      { title: '季节与月份', body: '【春：March April May】【夏：June July August】【秋：September October November】【冬：December January February】\n季节前用 in：in winter。\n北半球季节与中国一致——按自己的生活记忆最快。' },
    ], examples: [
      { q: '你的生日是 6 月 8 日，用英语说。', steps: ['月份：June', '日期序数词：8th（eighth）', 'My birthday is on June 8th.', '只说月份：in June'], tip: '月份in日期on' },
      { q: 'When is your birthday? 怎么回答？', steps: ['结构：My birthday is in + 月份', '例如：My birthday is in October', '也可以 It\'s in October.', '别忘了 in'], tip: 'in 接月份' },
    ], mistakes: ['月份小写（必须大写）', '生日说 on May（月份用 in，日期才用 on）'] },
  exercises: [
    { q: '三月是？', options: ['March', 'May', 'March 和 May 都是', 'May 不是月份'], answer: 0, explain: '三月March' },
    { q: '十二月是？', options: ['December', 'November', 'October', 'January'], answer: 0, explain: '一年最后' },
    { q: '我的生日在五月 说？', options: ['My birthday is in May.', 'My birthday on May.', 'My birthday is May.', 'My birthday at May.'], answer: 0, explain: 'in+月份' },
    { q: '1st 是几号的写法？', options: ['1 号', '第 1 个', '11 号', '21 号'], answer: 0, explain: 'first' },
    { q: '夏天的月份不包括？', options: ['March', 'June', 'July', 'August'], answer: 0, explain: 'March是春' },
    { q: '月份首字母要？', options: ['大写', '小写', '斜体', '双写'], answer: 0, explain: '专有名词' },
  ],
});

/* ================= 写入 ================= */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第46轮拓展批写入 ${n} 节：${Object.keys(L).join(', ')}`);
