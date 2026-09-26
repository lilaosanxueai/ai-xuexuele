import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第67轮：科学+2 英语+2 信息+2 音乐+1 体育+1 = 8 节 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

L['sci-29'] = mk({ id: 'sci-29', island: 'cross', order: 520, title: '电与磁：电磁铁实验', emoji: '🔌',
  subjectArea: '科学', gradeBand: 'junior', grade: 8, textbook: '浙教版科学（初中八上）',
  curriculum: { module: '电磁学基础', points: ['电流的磁效应', '电磁铁构造', '影响磁性强弱的因素'] },
  story: '一根导线通电后能让指南针偏转——1820 年奥斯特发现了电与磁的联系。给导线绕上线圈插入铁钉，就成了电磁铁：通电有磁性断电消失。电动机、电磁起重机都靠它！',
  goals: ['理解电流磁效应', '会做电磁铁实验', '掌握影响磁性强弱的因素'],
  aiIntro: '🔌 调节线圈匝数和电流，看磁性怎么变——电磁铁实验台！',
  lab: { params: [{ name: 'turns', label: '线圈匝数', min: 10, max: 100, step: 10, value: 30 },
                  { name: 'current', label: '电流（A）', min: 1, max: 5, step: 1, value: 2 }],
    grid: false, explore: ['turns 和 current 哪个影响更大？', '为什么插入铁钉磁性增强？', '电磁铁和永磁体的区别？'],
    code: `# 电磁铁实验台
turns = 30    # 线圈匝数
current = 2   # 电流（安）

hide()
force = turns * current / 10
fill_rect(0, 130, 340, 30, "#dc2626")
write("磁力指数 = " + force + "（匝数" + turns + "×电流" + current + "÷10）", 0, 130, "#fff", 10)
fill_rect(-160, 20, 320, 40, "#e2e8f0")
fill_rect(-160, 20, force * 4, 40, "#dc2626")
write("磁力条", -100, 20, "#fff", 11)
fill_rect(0, -50, 10, 80, "#94a3b8")
write("铁钉", 20, -30, "#64748b", 10)
i = 0
while i < 6:
    y = -40 + i * 16
    pen_color("#f59e0b")
    pen_down()
    go_to(-60, y)
    go_to(60, y)
    pen_up()
    i = i + 1
write("匝数越多电流越大→磁性越强", -20, -85, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '电流磁效应', body: '【奥斯特实验：导线通电→旁边指南针偏转→电产生磁】\n直线电流的磁场：以导线为中心的同心圆（右手螺旋定则判断方向）。\n电流越大磁性越强。这是电与磁的第一次"握手"。' },
      { title: '电磁铁', body: '【构造：线圈+铁芯（铁钉）→通电有磁性·断电消失】\n为什么插铁钉：铁芯被线圈磁场磁化→磁性大大增强。\n影响因素：①匝数越多越强②电流越大越强③铁芯比空气强得多。\n优点：磁性有无可控（通断电）·方向可换（换电流方向）。' },
      { title: '应用', body: '【电磁起重机：吸起废钢→移到目的地→断电放下】\n【电动机：通电线圈在磁场中受力转动（电→动）】【电铃：电磁铁吸合敲铃→断电弹回→反复】\n电磁继电器：小电流控制大电流——自动控制的基础。' },
    ], examples: [
      { q: '怎样让电磁铁吸起更多回形针？', steps: ['增加线圈匝数', '增大电流', '确保有铁芯', '三管齐下效果最好'], tip: '匝数×电流' },
      { q: '电磁铁比永磁体的优势是什么？', steps: ['磁性有无可控（通断电）', '磁极方向可换（改电流方向', '磁性强弱可调（改匝数电流', '可控性强=用途广'], tip: '可控是关键' },
    ], mistakes: ['认为电磁铁断电后还有磁性（铁芯退磁很快）', '忽略匝数和电流的双重影响'] },
  exercises: [
    { q: '发现电流磁效应的科学家是？', options: ['奥斯特', '牛顿', '欧姆', '法拉第'], answer: 0, explain: '1820年' },
    { q: '电磁铁的必要组成部分是？', options: ['线圈+铁芯', '只有铁芯', '只有线圈', '永久磁铁'], answer: 0, explain: '通电螺线管+铁芯' },
    { q: '增大电磁铁磁性的方法是？', options: ['增加匝数或增大电流', '减少匝数', '减小电流', '去掉铁芯'], answer: 0, explain: '两个因素' },
    { q: '电磁铁断电后磁性？', options: ['基本消失', '不变', '更强', '变反'], answer: 0, explain: '可控性' },
    { q: '电磁起重机利用电磁铁的什么特点？', options: ['通断电控制磁性', '磁性永存', '体积小', '外观好'], answer: 0, explain: '吸放自如' },
    { q: '右手螺旋定则用来判断？', options: ['电流方向与磁场方向', '力的大小', '电阻值', '电压高低'], answer: 0, explain: '右手定则' },
  ],
});

L['sci-30'] = mk({ id: 'sci-30', island: 'cross', order: 521, title: '能量转化：无处不在', emoji: '⚡',
  subjectArea: '科学', gradeBand: 'junior', grade: 9, textbook: '浙教版科学（初中九上）',
  curriculum: { module: '能量守恒', points: ['能量形式', '能量转化链', '能量守恒定律'] },
  story: '吃一碗饭→骑车上学→你身体把化学能变成动能和热能。能量不会凭空产生也不会凭空消失——只会从一种形式变成另一种形式。从太阳能到电能再到光能，能量在宇宙中"旅行"。',
  goals: ['了解能量形式', '会分析能量转化链', '理解能量守恒'],
  aiIntro: '⚡ 拨动转化步骤，看能量怎么变身——能量转化追踪器！',
  lab: { params: [{ name: 'chain', label: '转化链', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['chain=1 电灯的能量从哪来？', 'chain=3 你身体能量的终极来源是什么？', '能量会消失吗？'],
    code: `# 能量转化追踪器
chain = 1   # 转化链

hide()
t = "电灯链条"
e1 = "化学能（煤）"
e2 = "热能→动能（汽轮机）"
e3 = "电能（发电机）"
e4 = "光能+热能（灯泡）"
if chain == 2:
    t = "食物链条"
    e1 = "太阳能（太阳）"
    e2 = "化学能（光合作用）"
    e3 = "化学能（吃食物）"
    e4 = "动能+热能（运动）"
if chain == 3:
    t = "水力发电链条"
    e1 = "太阳能（蒸发水）"
    e2 = "势能（高处的水）"
    e3 = "动能（水流下）"
    e4 = "电能（发电机）"
fill_rect(0, 130, 340, 30, "#f59e0b")
write(t, 0, 130, "#fff", 13)
fill_rect(-130, 80, 65, 36, "#dc2626")
write(e1, -130, 80, "#fff", 8)
fill_rect(-45, 80, 65, 36, "#2563eb")
write(e2, -45, 80, "#fff", 8)
fill_rect(40, 80, 65, 36, "#16a34a")
write(e3, 40, 80, "#fff", 8)
fill_rect(125, 80, 65, 36, "#7c3aed")
write(e4, 125, 80, "#fff", 8)
write("→→→ 能量流动方向", -20, 30, "#64748b", 10)
write("能量不会消失只会变身", -20, -30, "#dc2626", 12)
`,
  },
  teach: { sections: [
      { title: '能量形式', body: '【六种常见形式：化学能·动能·势能·热能·电能·光能】\n化学能：储存在食物和燃料中。动能：运动的物体有。势能：高处的物体有。\n热能：分子运动。电能：电流。光能：太阳。' },
      { title: '能量转化链', body: '【分析步骤：找出起点能量→经过什么装置→变成什么能量】\n电灯：化学能→热能→动能→电能→光能+热能。\n人跑步：太阳能→化学能→动能+热能。\n水电站：太阳能→势能→动能→电能。' },
      { title: '能量守恒', body: '【能量既不会凭空产生也不会凭空消灭，只会从一种形式转化为另一种形式】\n总量不变。但转化的能量不一定都有用——部分变成"废热"散失。\n永动机不可能存在——因为能量不能凭空产生。\n能量利用率 = 有用的能量 ÷ 总能量 × 100%。' },
    ], examples: [
      { q: '手机充电时能量怎么转化？', steps: ['电能从插座输入', '电池储存为化学能', '使用时化学能→电能', '屏幕发光→光能+热能'], tip: '电→化学→电→光' },
      { q: '为什么永动机不可能？', steps: ['能量守恒定律禁止凭空产生能量', '摩擦生热消耗能量', '不输入能量就会停止', '任何"永动机"都被证明是骗局'], tip: '守恒是铁律' },
    ], mistakes: ['认为能量消失了（变成不可用的废热）', '认为摩擦"损失"了能量（变成热能仍在）'] },
  exercises: [
    { q: '能量的形式不包括？', options: ['暗能', '化学能', '动能', '电能'], answer: 0, explain: '六种常见' },
    { q: '能量守恒定律说能量？', options: ['不生不灭只转化', '会消失', '会凭空产生', '没有规律'], answer: 0, explain: '总量不变' },
    { q: '食物中的化学能来自？', options: ['太阳能', '地球内部', '月球', '人造'], answer: 0, explain: '光合作用' },
    { q: '水力发电的能量源头是？', options: ['太阳能', '水自身', '重力', '月球'], answer: 0, explain: '太阳蒸发水' },
    { q: '永动机不可能因为？', options: ['能量守恒', '技术不够', '材料不够', '资金不够'], answer: 0, explain: '物理定律' },
    { q: '摩擦生热说明？', options: ['动能变热能', '能量消失', '创造能量', '没有变化'], answer: 0, explain: '能量转化' },
  ],
});

L['eng-36'] = mk({ id: 'eng-36', island: 'cross', order: 522, title: '宾语从句', emoji: '💬',
  subjectArea: '英语', gradeBand: 'junior', grade: 9, textbook: '人教版英语（初中九年级）',
  curriculum: { module: '复合句·宾语从句', points: ['宾语从句的连接词', '语序永远陈述', '时态呼应'] },
  story: 'I think (that) English is fun.——think 后面跟的那个小句子就是宾语从句！掌握"一个连接词+陈述语序+时态呼应"三原则，宾语从句就是送分题。',
  goals: ['会选连接词', '掌握陈述语序', '会做时态呼应'],
  aiIntro: '💬 切换从句类型，看连接词和语序怎么定——宾语从句构造器！',
  lab: { params: [{ name: 'type', label: '从句类型', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['type=1 that 什么时候可以省？', 'type=2 if 和 whether 的区别？', 'type=3 时态怎么呼应？'],
    code: `# 宾语从句构造器
type = 1   # 类型

hide()
t = "陈述句作从句"
conn = "that（可省略）"
ex = "I think (that) you are right."
rule = "语序：陈述语序（主语+谓语）"
if type == 2:
    t = "一般疑问句作从句"
    conn = "if / whether（不可省）"
    ex = "I wonder if he will come."
    rule = "疑问句要改成陈述语序"
if type == 3:
    t = "特殊疑问句作从句"
    conn = "原来的疑问词（what/where/when/why/how）"
    ex = "I don't know where he lives."
    rule = "保留疑问词+陈述语序"
fill_rect(0, 130, 340, 30, "#2563eb")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 76, 340, 42, "#eff6ff")
write("连接词：" + conn, 0, 76, "#1d4ed8", 12)
fill_rect(0, 16, 340, 56, "#fef3c7")
write("例：" + ex, 0, 26, "#b45309", 10)
write(rule, 0, 8, "#92400e", 9)
`,
  },
  teach: { sections: [
      { title: '连接词三选一', body: '【陈述句→that（口语可省）】I know (that) she likes music.\n【一般疑问句→if/whether】I ask if he is happy.\n【特殊疑问句→保留疑问词】Tell me what you want.\n选词看从句原来是哪种句子。' },
      { title: '语序：永远陈述', body: '【宾语从句永远用陈述语序（主语+谓语）】\nWhere does he live?→I don\'t know where he lives.（不是where does he live）\n这是最容易扣分的地方！\n口诀：从句开头疑问词，后面主谓要陈述。' },
      { title: '时态呼应', body: '【主句现在时→从句按实际需要】I think he came yesterday.\n【主句过去时→从句用过去某种时态】I thought he had come.\n【客观真理永远现在时】He said the earth is round.\n口诀：主现从随便，主过从过去，真理永现在。' },
    ], examples: [
      { q: 'I don\'t know ___ he will come.', options: ['if', 'that', 'what', 'where'], answer: 0, explain: '一般疑问句用if' },
      { q: 'Can you tell me ___?', steps: ['原句Where is the station？', '改成陈述语序where the station is', 'Can you tell me where the station is？', '不是where is the station'], tip: '陈述语序' },
    ], mistakes: ['从句用了疑问语序（永远陈述）', '客观真理用了过去时（永现在）'] },
  exercises: [
    { q: 'I think ___ he is right.（填连接词）', options: ['that', 'if', 'what', 'who'], answer: 0, explain: '陈述句用that' },
    { q: 'I wonder ___ you can help me.', options: ['if', 'that', 'what', 'who'], answer: 0, explain: '一般疑问用if' },
    { q: 'Do you know ___ he lives?', options: ['where', 'that', 'if', 'what'], answer: 0, explain: '疑问词where' },
    { q: '宾语从句的语序是？', options: ['陈述语序', '疑问语序', '倒装', '任意'], answer: 0, explain: '主谓不倒' },
    { q: 'He said the earth ___ round.', options: ['is', 'was', 'were', 'be'], answer: 0, explain: '真理永现在' },
    { q: 'I thought you ___ finished it.', options: ['had', 'have', 'has', 'having'], answer: 0, explain: '主过从过去' },
  ],
});

L['eng-37'] = mk({ id: 'eng-37', island: 'cross', order: 523, title: '情景交际：购物', emoji: '🛒',
  subjectArea: '英语', gradeBand: 'junior', grade: 8, textbook: '人教版英语（初中）',
  curriculum: { module: '交际用语', points: ['购物常用句', '询问价格与尺寸', '讨价还价'] },
  story: 'Can I help you? Yes, I\'m looking for a T-shirt.——学会购物英语，出国旅行不再比手画脚！从问价到试穿到付款，一条龙搞定。',
  goals: ['掌握购物常用句', '会问价格尺寸', '会用购物礼仪'],
  aiIntro: '🛒 切换购物环节，看英语怎么应对——英语购物模拟器！',
  lab: { params: [{ name: 'sc', label: '场景', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['sc=1 店员怎么打招呼？', 'sc=2 怎么问价格和试穿？', 'sc=3 How much 和 How many 的区别？'],
    code: `# 英语购物模拟器
sc = 1   # 场景

hide()
t = "进店问候"
a1 = "Can I help you? / What can I do for you?"
a2 = "I'm looking for a T-shirt. / I want to buy a skirt."
tip = "店员问+你回答=对话开始"
if sc == 2:
    t = "询问与试穿"
    a1 = "How much is it? / What size do you have?"
    a2 = "Can I try it on? / Do you have a bigger one?"
    tip = "How much is/are + 单/复数"
if sc == 3:
    t = "付款与礼貌"
    a1 = "I'll take it. / That's too expensive."
    a2 = "Here you are. / Thank you!"
    tip = "即使不买也要说 Thanks anyway"
fill_rect(0, 130, 340, 30, "#16a34a")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 74, 340, 48, "#f0fdf4")
write(a1, 0, 74, "#166534", 10)
fill_rect(0, 12, 340, 60, "#fef3c7")
write(a2, 0, 12, "#b45309", 10)
write("要领：" + tip, -20, -55, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '购物三步', body: '【①进店：Can I help you? → I\'m looking for...\n【②询问：How much is it? What size? Can I try it on?\n【③决定：I\'ll take it.（买）/ That\'s too expensive.（嫌贵）\n礼貌离店：Thanks anyway.（不买也说谢谢）' },
      { title: '问价', body: '【How much is + 单数？How much are + 复数？\nHow much is this hat? How much are these shoes?\n【What\'s the price of...? 也可以问价】\n回答：It\'s ten dollars. / They\'re fifty yuan.\n讨价还价：Can you make it cheaper? / That\'s a bit expensive.' },
      { title: '尺寸与颜色', body: '【What size do you want? → Size M / Medium】\n【Do you have this in blue? → 问问有没有别的颜色】\n【It\'s too small/big. Do you have a bigger/smaller one?】\n试穿：Where is the fitting room?（试衣间在哪）\nThat fits well.（很合身）/ It doesn\'t fit.（不合身）' },
    ], examples: [
      { q: '你想买一条裤子，店员问 Can I help you?', steps: ['回答意图', 'I\'m looking for a pair of pants', '或 I want to buy pants', '不要只说Yes'], tip: '说出你要什么' },
      { q: '试穿后太小了怎么说？', steps: ['It\'s too small', 'Do you have a bigger one', '或 This doesn\'t fit', '礼貌请求换号'], tip: 'too+形容词' },
    ], mistakes: ['How much is these shoes（复数用are）', '不买时不打招呼就走（说Thanks anyway）'] },
  exercises: [
    { q: 'How much ___ this shirt?', options: ['is', 'are', 'do', 'does'], answer: 0, explain: '单数用is' },
    { q: 'How much ___ these shoes?', options: ['are', 'is', 'do', 'does'], answer: 0, explain: '复数用are' },
    { q: 'Can I ___ it on?', options: ['try', 'trying', 'tried', 'tries'], answer: 0, explain: 'try on' },
    { q: '决定买了说？', options: ['I\'ll take it', 'I\'ll go', 'I\'ll see', 'I\'ll try'], answer: 0, explain: '买了' },
    { q: '不买东西离开时说？', options: ['Thanks anyway', 'Nothing', 'Go away', 'Bye'], answer: 0, explain: '礼貌拒绝' },
    { q: '想要大一号说？', options: ['a bigger one', 'a big one', 'more big', 'biggest'], answer: 0, explain: '比较级' },
  ],
});

L['it-22'] = mk({ id: 'it-22', island: 'cross', order: 524, title: '循环嵌套：打印图形', emoji: '🔲',
  subjectArea: '信息科技', gradeBand: 'junior', grade: 8, textbook: '浙教版信息科技（初中）',
  curriculum: { module: '程序设计', points: ['外层控制行', '内层控制列', '嵌套循环图案'] },
  story: '一个循环打印一行星号，两个循环嵌套就能打印矩形、三角形、菱形——用代码画图形是理解嵌套循环最直观的方式！',
  goals: ['理解嵌套循环', '会用外层行内层列', '能打印简单图形'],
  aiIntro: '🔲 拨动行数和列数，看星号怎么排列——嵌套循环画板！',
  lab: { params: [{ name: 'rows', label: '行数', min: 2, max: 6, step: 1, value: 3 },
                  { name: 'shape', label: '形状', min: 1, max: 2, step: 1, value: 1 }],
    grid: false, explore: ['shape=2 三角形每行星号数怎么变？', '外层循环控制什么？内层呢？', '如果两层循环交换会怎样？'],
    code: `# 嵌套循环画板
rows = 3    # 行数
shape = 1   # 1矩形 2三角形

hide()
y = 100
r = 0
while r < rows:
    cols = rows
    if shape == 2:
        cols = r + 1
    x = -80
    c = 0
    while c < cols:
        write("*", x, y, "#dc2626", 16)
        x = x + 22
        c = c + 1
    y = y - 28
    r = r + 1
t2 = "矩形"
if shape == 2:
    t2 = "三角形"
fill_rect(0, 130, 340, 30, "#1d4ed8")
write(t2, 0, 130, "#fff", 14)
write("外层管行·内层管列", -20, -80, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '外层行内层列', body: '【外层循环：控制行数（换行）】【内层循环：控制每行打几个（列数）】\n外层每执行一次=打印一行+换行\n内层每执行一次=打印一个星号\n口诀：外行内列。' },
      { title: '打印三角形', body: '【关键：内层的次数随行号变化】\n第1行打1个·第2行打2个·第3行打3个\n内层循环次数 = 当前行号\n打印直角三角形只需改内层的上限。' },
      { title: '变式练习', body: '【矩形：内外层都固定次数】\n【直角三角形：内层=行号】\n【倒三角：内层=总行数-行号+1】\n【乘法口诀表：打印i*j=k】\n多动手画图，嵌套循环自然就懂了。' },
    ], examples: [
      { q: '打印3行5列的矩形，循环怎么写？', steps: ['外层循环3次（3行）', '内层循环5次（5列）', '内层每圈打一个*', '外层每圈换一次行'], tip: '外3内5' },
      { q: '打印直角三角形（第i行打i个*），内层循环写什么？', steps: ['第1行打1个', '第2行打2个', '内层次数=行号i', 'for j in range(1, i+1)'], tip: '内层=行号' },
    ], mistakes: ['内外层循环搞反（外行内列）', '三角形内层上限写固定值（应随行号变）'] },
  exercises: [
    { q: '嵌套循环的外层控制？', options: ['行数', '列数', '颜色', '速度'], answer: 0, explain: '外行内列' },
    { q: '打印直角三角形第i行打几个*？', options: ['i 个', '固定5个', '1个', '不确定'], answer: 0, explain: '等于行号' },
    { q: '打印3×4矩形需要几层循环？', options: ['2层', '1层', '3层', '4层'], answer: 0, explain: '外层行+内层列' },
    { q: '内层循环每执行一次做什么？', options: ['打一个字符', '换一行', '结束程序', '清屏'], answer: 0, explain: '列方向' },
    { q: '打印倒三角第1行打几个？', options: ['最多', '1个', '0个', '随机'], answer: 0, explain: '从多到少' },
    { q: '嵌套循环的理解关键是？', options: ['外行内列+行号变化', '背代码', '多打字', '不需要理解'], answer: 0, explain: '画图最直观' },
  ],
});

L['it-23'] = mk({ id: 'it-23', island: 'cross', order: 525, title: '信息安全与密码', emoji: '🔐',
  subjectArea: '信息科技', gradeBand: 'junior', grade: 9, textbook: '浙教版信息科技（初中）',
  curriculum: { module: '信息安全', points: ['密码安全', '钓鱼识别', '个人信息保护'] },
  story: '你的密码是123456吗？全球有2300万人在用这个密码！一个强密码+一次双重验证=黑客的噩梦。学会三招，你的账号安全提升100倍。',
  goals: ['会创建强密码', '能识别钓鱼', '会保护个人信息'],
  aiIntro: '🔐 切换安全主题，看怎么保护自己——信息安全防御塔！',
  lab: { params: [{ name: 'topic', label: '主题', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['topic=1 123456为什么危险？', 'topic=2 钓鱼网站的特征？', '哪些信息不能发朋友圈？'],
    code: `# 信息安全防御塔
topic = 1   # 主题

hide()
t = "密码安全"
d = "弱密码：123456·password·生日"
g = "强密码：大写+小写+数字+符号·8位以上"
if topic == 2:
    t = "钓鱼识别"
    d = "特征：奇怪链接·催促你点·要密码"
    g = "对策：看域名·不点链接·直接输官网"
if topic == 3:
    t = "个人信息保护"
    d = "危险：身份证号·住址·学校·实时定位"
    g = "原则：朋友圈不发·不告诉陌生人·设置隐私"
fill_rect(0, 130, 340, 30, "#dc2626")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 76, 340, 42, "#fef2f2")
write(d, 0, 76, "#991b1b", 10)
fill_rect(0, 16, 340, 56, "#f0fdf4")
write(g, 0, 16, "#166534", 10)
`,
  },
  teach: { sections: [
      { title: '密码安全', body: '【弱密码：纯数字·常见单词·生日·手机号——秒破】\n【强密码四要素：大写+小写+数字+符号，至少8位】\n比如：Xy9#mK2$p（不同网站用不同密码）\n密码管理器可以帮你记住所有密码。' },
      { title: '钓鱼识别', body: '【钓鱼：伪装成官方骗你输入密码】\n特征：①域名奇怪（gooogle.com不是google.com）②制造紧迫感"账号将被冻结"③要求点击链接输入密码。\n对策：不看链接直接输官网·银行不会邮件要密码。' },
      { title: '个人信息保护', body: '【不能泄露：身份证号·银行卡·密码·住址·学校班级】\n【朋友圈三不发：定位不发·行程不发·证件不发】\n公共WiFi不登录银行·快递单撕碎再扔。\n一旦信息泄露→改密码→告诉家长→必要时报警。' },
    ], examples: [
      { q: '怎么把弱密码 password 改成强密码？', steps: ['加大小写：PassWord', '加数字：Pass8Word', '加符号：P@ss8W0rd', '长度≥8且无规律'], tip: '四要素缺一不可' },
      { q: '收到邮件说"银行账号异常请点击验证"，怎么办？', steps: ['不点链接', '看域名是否是官方', '直接打开银行官网或打客服', '不输入任何信息'], tip: '不点+核实' },
    ], mistakes: ['所有网站用同一个密码（一破全破）', '认为"我又不是名人没人盗我号"（自动化攻击不挑人）'] },
  exercises: [
    { q: '最弱的密码是？', options: ['123456', 'Xy9#mK2', 'Ab@34efG', 'Tq!7zP2#'], answer: 0, explain: '全球千万人在用' },
    { q: '强密码至少需要几种字符？', options: ['4种（大小写数字符号）', '1种', '2种', '无所谓'], answer: 0, explain: '四要素' },
    { q: '钓鱼网站的典型特征是？', options: ['奇怪域名+催你点击', '页面漂亮', '加载慢', '字太小'], answer: 0, explain: '伪装+紧迫' },
    { q: '收到中奖信息要你填银行卡，应该？', options: ['不填并删除', '填了试试', '告诉朋友也填', '转发'], answer: 0, explain: '天上不掉馅饼' },
    { q: '朋友圈不应该发？', options: ['实时定位', '风景照', '美食', '心情'], answer: 0, explain: '暴露位置' },
    { q: '密码应该？', options: ['不同网站不同密码', '所有网站同一个', '写在纸上贴屏幕', '告诉好朋友'], answer: 0, explain: '分站分密' },
  ],
});

L['mus-23'] = mk({ id: 'mus-23', island: 'cross', order: 526, title: '和声：音的化学反应', emoji: '🎹',
  subjectArea: '音乐', gradeBand: 'junior', grade: 9, textbook: '人音版音乐（初中）',
  curriculum: { module: '和声基础', points: ['大三和弦', '小三和弦', '大小调的色彩'] },
  story: 'do+mi+sol 同时响是大三和弦（明亮），do+降mi+sol 是小三和弦（柔和）——三个音的距离决定了情绪色彩。和声就像化学：不同的"音"组合出不同的"情感反应"。',
  goals: ['理解大三和弦', '理解小三和弦', '感受大小调色彩差异'],
  aiIntro: '🎹 切换和弦类型，听色彩的变化——和声实验室！',
  lab: { params: [{ name: 'chord', label: '和弦', min: 1, max: 2, step: 1, value: 1 }],
    grid: false, explore: ['chord=1 为什么大三和弦听起来明亮？', '小三和弦和大三和弦差在哪？', '大调和小调的色彩？'],
    code: `# 和声实验室
chord = 1   # 1大三 2小三

hide()
t = "大三和弦 C-E-G"
feel = "明亮·欢快·坚定"
use2 = "国歌开头进行曲·生日歌"
col = "#f59e0b"
if chord == 2:
    t = "小三和弦 C-降E-G"
    feel = "柔和·忧伤·温柔"
    use2 = "月光·忧伤的抒情曲"
    col = "#6366f1"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 13)
fill_rect(0, 76, 340, 42, "#eff6ff")
write("听感：" + feel, 0, 76, "#1d4ed8", 12)
fill_rect(0, 16, 340, 56, "#fef3c7")
write("应用：" + use2, 0, 16, "#b45309", 10)
circle(-80, -50, 18, col)
write("C", -80, -50, "#fff", 12)
lbl = "E"
if chord == 2:
    lbl = "bE"
circle(0, -50, 18, col)
write(lbl, 0, -50, "#fff", 10)
circle(80, -50, 18, col)
write("G", 80, -50, "#fff", 12)
`,
  },
  teach: { sections: [
      { title: '大三和弦', body: '【结构：根音+大三度+纯五度（C-E-G）】\nC到E是4个半音=大三度（距离大）\n听感：明亮·稳定·欢快\n大调音乐的主要和弦→"大调=白天"的感觉。' },
      { title: '小三和弦', body: '【结构：根音+小三度+纯五度（C-降E-G）】\nC到降E是3个半音=小三度（距离小）\n听感：柔和·忧伤·温柔\n小调音乐的主要和弦→"小调=夜晚"的感觉。' },
      { title: '大小调色彩', body: '【大调：以大三和弦为主→明亮·欢快·进行曲】\n【小调：以小三和弦为主→柔和·忧伤·抒情】\n同一旋律换大小调=完全不同的情绪！\n试试把生日歌换成小调→立刻变成"葬礼版"。\n和声是音乐的"色彩调味师"。' },
    ], examples: [
      { q: '为什么国歌听起来庄严坚定？', steps: ['大量使用大三和弦', '大三度距离宽', '听感明亮稳定', '进行曲风格需要'], tip: '大三度=明亮' },
      { q: '怎样把一首欢快的歌变成忧伤的？', steps: ['把大三度改成小三度', '大三→小三和弦', '大调变同主音小调', '色彩从白天变夜晚'], tip: '改距离换情绪' },
    ], mistakes: ['认为和弦只是"几个音一起响"（有结构的）', '分不清大小三度（半音数不同）'] },
  exercises: [
    { q: '大三和弦的听感是？', options: ['明亮', '忧伤', '恐怖', '刺耳'], answer: 0, explain: '大三度宽' },
    { q: '小三和弦的听感是？', options: ['柔和忧伤', '欢快', '愤怒', '无所谓'], answer: 0, explain: '小三度窄' },
    { q: 'C-E-G 是什么和弦？', options: ['大三和弦', '小三和弦', '属七', '减三'], answer: 0, explain: 'C大调主和弦' },
    { q: '大三度等于几个半音？', options: ['4', '3', '2', '5'], answer: 0, explain: 'C到E' },
    { q: '小三度等于几个半音？', options: ['3', '4', '2', '5'], answer: 0, explain: 'C到降E' },
    { q: '小调音乐的典型色彩是？', options: ['柔和忧伤', '欢快', '庄严', '嘈杂'], answer: 0, explain: '夜晚感' },
  ],
});

L['pe-22'] = mk({ id: 'pe-22', island: 'cross', order: 527, title: '足球：传接球配合', emoji: '⚽',
  subjectArea: '体育与健康', gradeBand: 'junior', grade: 8, textbook: '人教版体育（初中）',
  curriculum: { module: '球类·足球', points: ['脚内侧传球', '接停球', '两人配合'] },
  story: '一个人带球过五个人很帅，但两个人一脚传球就过了——足球是团队运动，传接球是基本功。脚内侧传球最稳定，像用脚"推 email"，准确率最高！',
  goals: ['掌握脚内侧传球', '学会接停球', '会做两人配合'],
  aiIntro: '⚽ 切换练习环节，看传接球怎么练——传接球训练场！',
  lab: { params: [{ name: 'ph', label: '环节', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['ph=1 脚内侧击球的哪个部位？', 'ph=2 接球时脚要怎么"迎球"？', '两人配合的最重要原则？'],
    code: `# 传接球训练场
ph = 1   # 环节

hide()
t = "① 脚内侧传球"
d = "支撑脚在球旁·击球脚踝锁紧·用脚弓推球的中部"
tip = "像推 email 一样——准确比大力更重要"
if ph == 2:
    t = "② 接停球"
    d = "脚内侧迎球·触球瞬间轻轻后撤卸力"
    tip = "球贴脚不弹开=好停球"
if ph == 3:
    t = "③ 两人配合"
    d = "传球后立刻跑位接应·同伴传脚下"
    tip = "传球→跑位→再接球=移动的三角形"
fill_rect(0, 130, 340, 30, "#16a34a")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 76, 340, 42, "#f0fdf4")
write(d, 0, 76, "#166534", 10)
fill_rect(0, 16, 340, 56, "#fef3c7")
write("要领：" + tip, 0, 16, "#b45309", 10)
`,
  },
  teach: { sections: [
      { title: '脚内侧传球', body: '【动作：支撑脚踩在球旁10cm·脚尖指向目标·脚踝锁紧·脚弓推球中部】\n脚内侧（脚弓）接触面积大→最准确。\n力量来自摆腿不是踢，触球后跟随。\n练习：两人5米对传，一天50次。' },
      { title: '接停球', body: '【要领：脚内侧迎球·触球瞬间脚往后撤卸力】\n好的停球=球停在脚下不弹开。\n卸力的原理：脚和球同方向运动→延长接触时间→减小弹力。\n接地滚球最容易·接空中球先用大腿或胸部。' },
      { title: '两人配合', body: '【传完就跑（不要站着看）·同伴传脚下·形成传递三角】\n撞墙式配合：A传给B→A前插→B回传A=A自己当"墙"。\n关键：传球的质量决定配合的流畅度。\n训练：2人1球·传→跑→接→传循环。' },
    ], examples: [
      { q: '脚内侧传球为什么最准确？', steps: ['脚弓接触面积大', '容易控制方向', '适合短传', '像推不像踢'], tip: '面积大=可控' },
      { q: '停球总是弹开怎么办？', steps: ['检查脚是否"迎球"', '触球瞬间要后撤卸力', '脚踝放松不僵硬', '多次触球培养球感'], tip: '后撤=卸力' },
    ], mistakes: ['用脚尖捅球（方向不可控）', '传完球站着不动（应立刻跑位）'] },
  exercises: [
    { q: '最准确的传球方式是？', options: ['脚内侧', '脚尖', '脚跟', '头顶'], answer: 0, explain: '脚弓面积大' },
    { q: '停球时脚要？', options: ['迎球并后撤', '硬挡', '躲开', '踢回去'], answer: 0, explain: '卸力' },
    { q: '传球后应该？', options: ['立刻跑位', '站着看', '坐下', '回去防守'], answer: 0, explain: '传跑结合' },
    { q: '支撑脚的位置在？', options: ['球旁约10cm', '球后面一米', '球的上面', '无所谓'], answer: 0, explain: '稳定支撑' },
    { q: '撞墙式配合是自己当？', options: ['墙', '守门员', '裁判', '观众'], answer: 0, explain: '回传做墙' },
    { q: '两人配合的形状是？', options: ['三角形', '正方形', '圆形', '直线'], answer: 0, explain: '传跑接三角' },
  ],
});

/* 写入 */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第67轮写入 ${n} 节：${Object.keys(L).join(', ')}`);
