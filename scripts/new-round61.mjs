import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第61轮拓展批：科学初中+2 数学小学+2 英语小学+2 语文小学+2 = 8 节 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

L['sci-27'] = mk({ id: 'sci-27', island: 'cross', order: 487, title: '人体的运动系统', emoji: '🦴',
  subjectArea: '科学', gradeBand: 'junior', grade: 7, textbook: '浙教版科学（初中七下）',
  curriculum: { module: '生命科学', points: ['骨·关节·肌肉', '运动的产生', '运动系统保健'] },
  story: '你跑 100 米只需 13 秒——206 块骨、600 多块肌肉、上百个关节在这一瞬间完美配合。运动系统像一台精密机器：骨是杠杆、关节是支点、肌肉是发动机。',
  goals: ['了解骨关节肌肉', '理解运动产生原理', '养成运动保健习惯'],
  aiIntro: '🦴 切换部位，看运动系统怎么协作——运动系统解剖台！',
  lab: { params: [{ name: 'part', label: '部位', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['part=3 屈肘时肱二头肌是收缩还是舒张？', '为什么儿童骨柔软不易骨折？', '运动前为什么要热身？'],
    code: `# 运动系统解剖台
part = 1   # 部位

hide()
t = "骨骼：杠杆+支架"
d = "206 块骨：头骨·脊柱·肋骨·四肢骨——支撑身体保护器官"
tip = "儿童骨有机物多柔软不易折断；老年骨无机物多脆易折"
if part == 2:
    t = "关节：连接+支点"
    d = "活动关节（肘膝肩髋）：关节面·关节囊·关节腔——灵活运动"
    tip = "关节软骨减震；脱臼=关节头从关节窝滑出"
if part == 3:
    t = "肌肉：发动机"
    d = "骨骼肌跨越关节附着在骨上：收缩变短拉动骨产生运动"
    tip = "屈肘：肱二头肌收缩·肱三头肌舒张；伸肘反过来"
fill_rect(0, 130, 360, 30, "#dc2626")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 76, 360, 42, "#fef2f2")
write(d, 0, 76, "#991b1b", 10)
fill_rect(0, 16, 360, 56, "#fef3c7")
write("保健：" + tip, 0, 16, "#b45309", 10)
write("骨=杠杆·关节=支点·肌肉=动力——缺一不可", -20, -50, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '骨', body: '【206 块骨组成骨骼：支撑身体·保护器官·运动杠杆】\n骨的成分：有机物（柔韧）+ 无机物（坚硬）——儿童有机物多不易折；老年无机物多易折。\n长骨结构：骨膜·骨质·骨髓（造血）。\n脊柱四个生理弯曲：缓冲震荡·维持平衡。' },
      { title: '关节与肌肉', body: '【关节：骨与骨的连接——活动关节让骨骼灵活】\n结构：关节面（软骨覆盖）·关节囊·关节腔（滑液润滑）。\n脱臼：关节头滑出关节窝——不能自行硬掰，需医生复位。\n骨骼肌特性：收缩变短——只能拉不能推，所以需成对配合（二头肌/三头肌）。' },
      { title: '运动与保健', body: '【运动产生：骨骼肌收缩→牵引骨→绕关节转动→产生动作】\n屈肘：肱二头肌收缩+肱三头肌舒张；伸肘反过来——拮抗协作。\n保健：运动前热身（关节滑液增多）；补钙+维生素D（防骨质疏松）；坐姿端正（防脊柱侧弯）。' },
    ], examples: [
      { q: '为什么儿童骨不易骨折？', steps: ['儿童骨有机物比例高', '有机物柔韧有弹性', '受外力变形不易完全断裂', '像新鲜树枝弯而不断'], tip: '有机物=韧性' },
      { q: '屈肘时哪块肌肉收缩？', steps: ['屈肘=前臂向肩膀靠近', '肱二头肌在上臂前面', '它收缩变短拉动前臂骨', '同时肱三头肌舒张配合'], tip: '屈二伸三' },
    ], mistakes: ['认为肌肉可以推骨运动（只能拉动）', '脱臼后自行硬掰（需医生复位）'] },
  exercises: [
    { q: '成人有多少块骨？', options: ['206', '300', '100', '600'], answer: 0, explain: '206块' },
    { q: '关节的作用是？', options: ['连接+支点', '造血', '消化', '呼吸'], answer: 0, explain: '杠杆支点' },
    { q: '屈肘时收缩的是？', options: ['肱二头肌', '肱三头肌', '两块都收缩', '两块都舒张'], answer: 0, explain: '屈二伸三' },
    { q: '骨中造血的部位是？', options: ['骨髓', '骨膜', '关节软骨', '骨质'], answer: 0, explain: '红骨髓' },
    { q: '老年人易骨折因为？', options: ['无机物多骨脆', '有机物多', '骨太软', '没有原因'], answer: 0, explain: '钙多韧性差' },
    { q: '运动前热身的目的是？', options: ['关节滑液增多防伤', '好看', '浪费时间', '没有目的'], answer: 0, explain: '润滑关节' },
  ],
});

L['sci-28'] = mk({ id: 'sci-28', island: 'cross', order: 488, title: '遗传的基本规律', emoji: '🧬',
  subjectArea: '科学', gradeBand: 'junior', grade: 8, textbook: '浙教版科学（初中八下）',
  curriculum: { module: '遗传与进化', points: ['基因与性状', '显性与隐性', '基因型与表现型'] },
  story: '为什么你有爸爸的眼睛和妈妈的鼻子？为什么双眼皮的父母可能生出单眼皮的孩子？答案藏在基因的"排列组合"里——孟德尔用 8 年豌豆实验找到了规律。',
  goals: ['理解基因决定性状', '掌握显隐性关系', '会分析遗传概率'],
  aiIntro: '🧬 拨动基因组合，看性状怎么表现——遗传规律演示器！',
  lab: { params: [{ name: 'combo', label: '基因型', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['combo=3 为什么两个单眼皮不会生出双眼皮？', 'Aa 的人表现什么性状？', '什么是携带者？'],
    code: `# 遗传规律演示器（A=双眼皮显性 a=单眼皮隐性）
combo = 1   # 基因型

hide()
t = "AA → 双眼皮"
d = "两个显性基因：表现显性性状（双眼皮）"
ph = "表现型：双眼皮 · 携带者：否"
if combo == 2:
    t = "Aa → 双眼皮"
    d = "一显一隐：显性盖过隐性，表现显性"
    ph = "表现型：双眼皮 · 携带者：是（带a但不表现）"
if combo == 3:
    t = "aa → 单眼皮"
    d = "两个隐性基因：隐性性状才表现"
    ph = "表现型：单眼皮 · 携带者：否"
fill_rect(0, 130, 360, 30, "#7c3aed")
write(t, 0, 130, "#fff", 14)
fill_rect(0, 76, 360, 42, "#f5f3ff")
write(d, 0, 76, "#6d28d9", 11)
fill_rect(0, 16, 360, 56, "#fef3c7")
write(ph, 0, 16, "#b45309", 10)
write("Aa×Aa → 1AA:2Aa:1aa → 3双眼皮:1单眼皮", -15, -50, "#dc2626", 10)
`,
  },
  teach: { sections: [
      { title: '基因与性状', body: '【基因：DNA 上控制性状的片段（如控制眼皮单双的指令）】\n【性状：生物体的形态特征或生理特性（眼皮颜色·身高·血型）】\n成对存在：体细胞中每种基因有两个（一个来自父方一个来自母方）。\n同种基因的不同版本叫等位基因（A 和 a）。' },
      { title: '显性与隐性', body: '【显性基因（大写A）：只要存在就表现——双眼皮·有耳垂】\n【隐性基因（小写a）：必须成对才表现——单眼皮·无耳垂】\nAA 和 Aa 都表现显性（Aa 叫携带者）；只有 aa 才表现隐性。\n孟德尔豌豆实验：高茎×矮茎→子一代全高茎→子二代 3:1。' },
      { title: '遗传分析', body: '【Aa×Aa → 后代：1AA : 2Aa : 1aa → 表现型 3显:1隐】\nAA×aa → 后代全 Aa（全表现显性）\naa×aa → 后代全 aa（全表现隐性）\n概率计算：每种组合的概率 = 两配子概率的乘积。' },
    ], examples: [
      { q: '父母都是双眼皮（Aa），孩子是单眼皮的概率？', steps: ['Aa×Aa 的后代组合', 'AA(25%) + Aa(50%) + aa(25%)', '只有 aa 表现单眼皮', '概率 = 25%'], tip: '隐性必须成对' },
      { q: '为什么两个单眼皮不会有双眼皮孩子？', steps: ['单眼皮基因型必为 aa', 'aa×aa 只产生 a 配子', '后代只能是 aa', 'aa = 单眼皮'], tip: '隐性纯合' },
    ], mistakes: ['认为Aa表现中间性状（显性完全盖住隐性）', '认为单眼皮父母能生双眼皮（aa×aa只产aa）'] },
  exercises: [
    { q: '显性基因用什么字母表示？', options: ['大写', '小写', '数字', '希腊字母'], answer: 0, explain: 'A为显性' },
    { q: 'Aa 的表现型是？', options: ['显性性状', '隐性性状', '中间型', '不确定'], answer: 0, explain: '显性盖隐性' },
    { q: 'Aa×Aa 后代 aa 的概率？', options: ['25%', '50%', '75%', '100%'], answer: 0, explain: '1/4' },
    { q: 'aa×aa 后代的基因型？', options: ['全aa', '全AA', '1AA:1aa', '全Aa'], answer: 0, explain: '只有a配子' },
    { q: '单眼皮是显性还是隐性？', options: ['隐性', '显性', '既是又是', '都不是'], answer: 0, explain: 'aa才单眼皮' },
    { q: '孟德尔用什么植物做实验？', options: ['豌豆', '玉米', '小麦', '水稻'], answer: 0, explain: '8年豌豆' },
  ],
});

L['math-95'] = mk({ id: 'math-95', island: 'math', order: 489, title: '认识分数：几分之一', emoji: '🍕',
  subjectArea: '数学', gradeBand: 'primary', grade: 3, textbook: '人教版数学（三年级）',
  curriculum: { module: '分数初步', points: ['分数的含义', '几分之一的大小', '分数的读写'] },
  story: '一个披萨分给 4 个人，每人得到多少？不是 1 个也不是 0 个——是 1/4 个！分数就是把"1"平均分成几份，取其中的一份或几份。',
  goals: ['理解分数的含义', '会比较几分之一', '会读写分数'],
  aiIntro: '🍕 拖动分母，看披萨被切成几份——分数披萨店！',
  lab: { params: [{ name: 'n', label: '平均分成几份', min: 2, max: 8, step: 1, value: 4 }],
    grid: false, explore: ['n=8 时每份比 n=4 时大还是小？', '为什么分母越大每份越小？', '1/2 和 1/3 哪个大？'],
    code: `# 分数披萨店
n = 4   # 平均份数

hide()
fill_rect(0, 130, 340, 30, "#f59e0b")
write("1/" + n + "：把一个披萨平均分成 " + n + " 份，取 1 份", 0, 130, "#fff", 10)
i = 0
while i < n:
    a = 360 / n * i
    fill_rect(0, 0, 1, 1, "#fbbf24")
    circle(30 * cos(a + 180 / n), 30 * sin(a + 180 / n), 30 / (n / 3 + 1), "#fbbf24")
    i = i + 1
circle(0, 0, 70, "#f59e0b")
fill_rect(0, 55, 80, 14, "#dc2626")
circle(30, 30, 8, "#fbbf24")
write("分母=" + n, -60, -85, "#dc2626", 11)
write("分母越大→每份越小", -20, -110, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '分数的含义', body: '【把"1"平均分成若干份，表示其中一份或几份的数叫分数】\n1/4 读作"四分之一"——分母 4 表示平均分成 4 份，分子 1 表示取 1 份。\n关键：必须"平均分"！不平均分不能用分数表示。\n分数线=除号：1/4 = 1÷4。' },
      { title: '几分之一比较', body: '【分母越大→每份越小：1/2 > 1/3 > 1/4 > 1/5】\n直觉：披萨分的人越多，每人分到的越少。\n分子相同比大小：只比分母，分母大的反而小。\n1/2 = 半个；1/4 = 四分之一。' },
      { title: '读写与生活', body: '【写法：先写分数线，再写分母，最后写分子】\n读法：先读分母再读分子——1/4 读"四分之一"（不读"一分之四"）。\n生活中的分数：半杯水=1/2杯·一刻钟=1/4小时·半斤=1/2斤。\n分数墙：把多个分数排在一条线上比大小。' },
    ], examples: [
      { q: '1/5 和 1/3 哪个大？', steps: ['分子相同都是1', '分母 5 > 3', '分母大=每份小', '所以 1/3 > 1/5'], tip: '分母大反而小' },
      { q: '一块巧克力平均分给 6 人，每人得到几分之几？', steps: ['平均分成 6 份', '每人取 1 份', '每人得到 1/6', '读作六分之一'], tip: '分几份分母就几' },
    ], mistakes: ['认为分母大分数就大（分子相同时分母大反而小）', '不平均分也用分数（必须平均分）'] },
  exercises: [
    { q: '1/4 读作？', options: ['四分之一', '一分之四', '四分之四', '一除以四'], answer: 0, explain: '先读分母' },
    { q: '1/3 和 1/5 哪个大？', options: ['1/3', '1/5', '一样', '无法比'], answer: 0, explain: '分母小每份大' },
    { q: '把1平均分成8份，每份是？', options: ['1/8', '8', '1', '8/1'], answer: 0, explain: '八分之一' },
    { q: '半杯水用分数表示？', options: ['1/2', '1/4', '2/1', '1/8'], answer: 0, explain: '一半=二分之一' },
    { q: '分数的分母表示？', options: ['平均分成几份', '取几份', '总数', '没有意义'], answer: 0, explain: '分母=分的份数' },
    { q: '一刻钟等于多少小时？', options: ['1/4', '1/2', '1/3', '1/60'], answer: 0, explain: '15/60=1/4' },
  ],
});

L['math-96'] = mk({ id: 'math-96', island: 'math', order: 490, title: '角的度量与画法', emoji: '📐',
  subjectArea: '数学', gradeBand: 'primary', grade: 4, textbook: '人教版数学（四年级）',
  curriculum: { module: '图形与几何', points: ['量角器的使用', '画指定度数的角', '角的计算'] },
  story: '量角器为什么是半圆形？因为它把 180° 平均分成 180 份，每一份就是 1°。学会用量角器，你就能精确知道每个角有多大，还能画出任何角度！',
  goals: ['会使用量角器量角', '会画指定角度', '会进行角度计算'],
  aiIntro: '📐 拨动角度值，看量角器怎么对齐——量角器使用训练台！',
  lab: { params: [{ name: 'ang', label: '角度（°）', min: 15, max: 165, step: 15, value: 60 }],
    grid: true, explore: ['ang=90 时是什么角？', '量角器为什么要对准顶点？', '两个角拼起来180°叫什么？'],
    code: `# 量角器使用训练台
ang = 60   # 角度

hide()
kind = "锐角"
if ang == 90:
    kind = "直角"
if ang > 90:
    kind = "钝角"
if ang == 180:
    kind = "平角"
fill_rect(0, 130, 340, 30, "#1d4ed8")
write(ang + "° 是" + kind, 0, 130, "#fff", 13)
pen_color("#0f172a")
pen_down()
go_to(-100, -40)
go_to(60, -40)
pen_up()
pen_down()
go_to(-100, -40)
go_to(-100 + 140 * cos(ang), -40 + 140 * sin(ang))
pen_up()
write("顶点", -100, -55, "#64748b", 9)
if ang == 90:
    write("90° = 直角：用三角尺验证", -30, 90, "#dc2626", 11)
if ang != 90:
    if ang < 90:
        write("小于90° = 锐角", -30, 90, "#16a34a", 11)
    if ang > 90:
        write("大于90° = 钝角", -30, 90, "#ea580c", 11)
write("量角三步：中心对顶点·零线对一边·读刻度", -20, -80, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '量角器量角', body: '【三步：①中心点对准角的顶点 ②零刻度线对准角的一条边 ③读另一条边所对的刻度】\n注意：用内圈还是外圈——看零刻度线在哪圈，就读同圈的数字。\n0° 在哪条边就从哪条边开始读。\n量角器单位：1° = 把半圆平均分成 180 份的 1 份。' },
      { title: '画角', body: '【画 60° 角的步骤：①画一条射线 ②量角器中心对准射线端点 ③零线对准射线 ④在 60° 刻度处点一个点 ⑤连接端点和这个点】\n特殊角可以直接用三角尺画：30°·45°·60°·90°\n画完别忘了标上角的符号和度数。' },
      { title: '角度计算', body: '【平角 = 180°；周角 = 360°；直角 = 90°】\n1 平角 = 2 直角；1 周角 = 4 直角 = 2 平角。\n计算：已知∠1=65°，求它的补角→180°-65°=115°。\n对顶角相等；三角形内角和=180°。' },
    ], examples: [
      { q: '量角器中心点要对准什么？', steps: ['角的顶点', '角的边', '角的内部', '任何地方'], tip: '中心对顶点' },
      { q: '画一个 45° 的角能用什么工具？', steps: ['45° 三角尺有 45°-45°-90° 的', '直接用三角尺画', '或用量角器 45° 刻度', '两种方法都行'], tip: '三角尺快捷' },
    ], mistakes: ['量角器没对准顶点（度数不准）', '内外圈刻度看错（看零线在哪圈）'] },
  exercises: [
    { q: '量角器的中心点要对准？', options: ['角的顶点', '角的边', '角的内部', '纸边'], answer: 0, explain: '三点一线' },
    { q: '平角等于多少度？', options: ['180°', '90°', '360°', '45°'], answer: 0, explain: '一条直线' },
    { q: '1 周角 = 几个直角？', options: ['4', '2', '6', '8'], answer: 0, explain: '360÷90=4' },
    { q: '三角尺不能直接画出的角是？', options: ['50°', '30°', '45°', '90°'], answer: 0, explain: '三角尺只有30/45/60/90' },
    { q: '∠1=65°，它的补角是？', options: ['115°', '65°', '180°', '90°'], answer: 0, explain: '180-65=115' },
    { q: '量角器把半圆分成多少份？', options: ['180', '100', '360', '90'], answer: 0, explain: '每份1°' },
  ],
});

/* 英语+2, 语文+2 同理... 为节省篇幅只写核心结构 */

L['eng-34'] = mk({ id: 'eng-34', island: 'cross', order: 491, title: '动物单词与句型', emoji: '🐾',
  subjectArea: '英语', gradeBand: 'primary', grade: 3, textbook: '人教PEP英语三年级上册',
  curriculum: { module: '词汇与句型', points: ['动物单词', 'It is a/an 句型', '复数形式'] },
  story: 'dog cat bird fish——这些动物用英语怎么叫？It is a cat. It is a dog. 学会这个句型，你就能介绍任何一只动物！',
  goals: ['掌握10个动物单词', '会用It is a/an句型', '会加复数s'],
  aiIntro: '🐾 切换动物，看英语怎么说——动物英语卡片机！',
  lab: { params: [{ name: 'a', label: '动物', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['a=4 为什么用an不用a？', 'cat的复数怎么写？', '你还能想到什么动物？'],
    code: `# 动物英语卡片机
a = 1   # 动物

hide()
word = "cat"
cn = "猫"
sent = "It is a cat."
emo = "🐱"
if a == 2:
    word = "dog"
    cn = "狗"
    sent = "It is a dog."
    emo = "🐶"
if a == 3:
    word = "bird"
    cn = "鸟"
    sent = "It is a bird."
    emo = "🐦"
if a == 4:
    word = "elephant"
    cn = "大象"
    sent = "It is an elephant."
    emo = "🐘"
if a == 5:
    word = "fish"
    cn = "鱼"
    sent = "It is a fish."
    emo = "🐟"
fill_rect(0, 130, 340, 30, "#f59e0b")
write(emo + " " + word + "（" + cn + "）", 0, 130, "#fff", 14)
fill_rect(0, 74, 340, 40, "#fef3c7")
write(sent, 0, 74, "#b45309", 14)
fill_rect(0, 18, 340, 46, "#f1f5f9")
write("复数：cat→cats  dog→dogs  bird→birds", 0, 18, "#0f172a", 10)
write("an 用于元音开头的词（elephant·apple·egg）", -20, -40, "#dc2626", 10)
`,
  },
  teach: { sections: [
      { title: '动物单词', body: '【cat 猫 · dog 狗 · bird 鸟 · fish 鱼 · rabbit 兔 · panda 熊猫 · tiger 虎 · lion 狮 · monkey 猴 · elephant 大象】\n复数规则：一般加 s（cat→cats）；以 s/x/sh/ch 结尾加 es（fish→fishes 特殊）。\n动物叫声：dog→woof·cat→meow·bird→tweet。' },
      { title: 'It is a/an 句型', body: '【It is a + 辅音开头的词：It is a cat/dog/bird】\n【It is an + 元音开头的词：It is an elephant/apple/egg】\n元音字母：a e i o u 开头的单词用 an。\n否定：It is not a cat. 疑问：Is it a cat? Yes, it is. / No, it is not.' },
      { title: '拓展运用', body: '【I like cats.（喜欢的一类用复数）】\n【The cat is cute.（特指那只猫）】\n【What is it? It is a dog.（问答练习）】\n动物+颜色：a black cat·a white dog·a yellow bird。\n结合已学的 there be：There is a cat under the tree.' },
    ], examples: [
      { q: '大象 elephant 前用 a 还是 an？', steps: ['elephant 以元音 e 开头', '元音开头用 an', 'It is an elephant', '答案：an'], tip: '看首字母' },
      { q: 'cat 的复数是什么？', steps: ['一般名词加 s', 'cat + s', 'cats', '两只猫：two cats'], tip: '直接加s' },
    ], mistakes: ['elephant 前用 a（元音开头应用 an）', 'like 后用单数（应用复数 cats）'] },
  exercises: [
    { q: 'cat 的中文是？', options: ['猫', '狗', '鸟', '鱼'], answer: 0, explain: '🐱猫' },
    { q: 'elephant 前用？', options: ['an', 'a', 'the', '不填'], answer: 0, explain: '元音开头' },
    { q: 'cat 的复数？', options: ['cats', 'cates', 'cat', 'caties'], answer: 0, explain: '加s' },
    { q: 'Is it a dog? 肯定回答？', options: ['Yes, it is.', 'Yes, it does.', 'No.', 'It is.'], answer: 0, explain: 'is问is答' },
    { q: 'a black cat 中 black 是？', options: ['颜色', '大小', '数量', '名字'], answer: 0, explain: '形容词' },
    { q: 'panda 的意思是？', options: ['熊猫', '老虎', '猴子', '狮子'], answer: 0, explain: '国宝🐼' },
  ],
});

L['eng-35'] = mk({ id: 'eng-35', island: 'cross', order: 492, title: '数字与年龄', emoji: '🔢',
  subjectArea: '英语', gradeBand: 'primary', grade: 3, textbook: '人教PEP英语三年级上册',
  curriculum: { module: '数字话题', points: ['1-20的英语', 'How old are you?', '年龄表达'] },
  story: 'How old are you? I am nine.——学会用英语说年龄，你就能和外国小朋友互相认识啦！one two three four five——数字是英语世界的第一把钥匙。',
  goals: ['会说1-20的英语', '会问和答年龄', '会简单加减的英语表达'],
  aiIntro: '🔢 拨动年龄，看英语怎么问答——年龄问答训练器！',
  lab: { params: [{ name: 'age', label: '年龄', min: 5, max: 15, step: 1, value: 9 }],
    grid: false, explore: ['age=11 和 age=12 的英语有什么特点？', 'How old are you? 怎么回答？', 'thirteen 和 thirty 怎么区分？'],
    code: `# 年龄问答训练器
age = 9   # 年龄

hide()
words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"]
w = words[age - 1]
if age > 15:
    w = "sixteen"
if age == 17:
    w = "seventeen"
if age == 18:
    w = "eighteen"
if age == 19:
    w = "nineteen"
if age == 20:
    w = "twenty"
fill_rect(0, 130, 340, 30, "#2563eb")
write("How old are you? — I am " + w + ".", 0, 130, "#fff", 10)
fill_rect(0, 76, 340, 40, "#eff6ff")
write(w + "（" + age + "岁）", 0, 76, "#1d4ed8", 14)
fill_rect(0, 16, 340, 56, "#fef3c7")
write("1-10: one two three four five six seven eight nine ten", 0, 16, "#b45309", 8)
write("11-15: eleven twelve thirteen fourteen fifteen", 0, 40, "#7c3aed", 8)
`,
  },
  teach: { sections: [
      { title: '数字 1-20', body: '【1-10：one two three four five six seven eight nine ten】\n【11-15：eleven twelve thirteen fourteen fifteen（-teen 结尾）】\n【16-19：sixteen seventeen eighteen nineteen（规律：个位+teen）】\n【20：twenty】\n记忆技巧：13-19 都以 -teen 结尾（thirteen→thirty 是 30）。' },
      { title: '问年龄', body: '【问：How old are you?（你几岁？）】\n【答：I am nine. / I am nine years old.】\n问第三人称：How old is he/she? — He/She is ten.\n礼貌提醒：对成年女性不随便问年龄（西方礼仪）。' },
      { title: '数字运用', body: '【加法：One and two is three.（1+2=3）】\n【电话号码：one three five...（逐个读）】\n【价格：How much is it? — It is five yuan.】\n【数量：I have three books.（复数加s）】\n数字在生活中无处不在——电话·门牌·价格·时间。' },
    ], examples: [
      { q: 'How old are you? 你 10 岁，怎么回答？', steps: ['用 I am + 数字', 'I am ten.', '或 I am ten years old.', '两种都对'], tip: 'I am + 年龄' },
      { q: 'thirteen 和 thirty 哪个是 30？', steps: ['thirteen = 13（-teen）', 'thirty = 30（-ty）', '重音不同：thirTEEN vs THIRty', '注意区分'], tip: '-teen vs -ty' },
    ], mistakes: ['忘记 am/is（I am nine 不是 I nine）', 'thirteen 和 thirty 混淆（13 vs 30）'] },
  exercises: [
    { q: '5 的英语是？', options: ['five', 'four', 'six', 'fifteen'], answer: 0, explain: 'five' },
    { q: '12 的英语是？', options: ['twelve', 'twenty', 'two', 'ten'], answer: 0, explain: 'twelve' },
    { q: 'How old are you? 回答用？', options: ['I am nine.', 'I nine.', 'Me nine.', 'Nine old.'], answer: 0, explain: 'I am+年龄' },
    { q: 'thirteen 是多少？', options: ['13', '30', '3', '33'], answer: 0, explain: '-teen=十几' },
    { q: '20 的英语是？', options: ['twenty', 'twelve', 'two', 'twenties'], answer: 0, explain: 'twenty' },
    { q: '1+2=3 用英语说？', options: ['One and two is three.', 'One two three.', 'Plus one two.', '一加二'], answer: 0, explain: 'and=加' },
  ],
});

L['chn-33'] = mk({ id: 'chn-33', island: 'cross', order: 493, title: '缩句：找出句子主干', emoji: '✂️',
  subjectArea: '语文', gradeBand: 'primary', grade: 5, textbook: '统编版语文（五年级）',
  curriculum: { module: '句子训练', points: ['缩句的方法', '保留与删除', '缩句口诀'] },
  story: '"美丽的蝴蝶在五颜六色的花丛中快乐地飞舞"——这句话的主干是什么？只要"蝴蝶飞舞"！缩句就像剥洋葱，把修饰的皮一层层剥掉，只剩最核心的"谁+干什么"。',
  goals: ['掌握缩句方法', '知道保留什么删除什么', '会验证缩句结果'],
  aiIntro: '✂️ 拨动缩句步骤，看修饰语怎么被剥掉——缩句剥洋葱台！',
  lab: { params: [{ name: 'st', label: '步骤', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['st=2 什么样的词要删？', '缩到最短会不会意思变了？', '"的""地""得"前面的都要删吗？'],
    code: `# 缩句剥洋葱台
st = 1   # 步骤

hide()
t = "原句"
s = "美丽的蝴蝶在五颜六色的花丛中快乐地飞舞。"
if st == 2:
    t = "删修饰"
    s = "蝴蝶在花丛中飞舞。（删美丽的·五颜六色的·快乐地）"
if st == 3:
    t = "留主干"
    s = "蝴蝶飞舞。（谁+干什么）"
fill_rect(0, 130, 360, 30, "#dc2626")
write(t, 0, 130, "#fff", 14)
fill_rect(0, 74, 360, 48, "#fef2f2")
write(s, 0, 74, "#991b1b", 11)
if st == 3:
    write("✓ 主干：谁（蝴蝶）+ 干什么（飞舞）", -20, -30, "#16a34a", 11)
write("口诀：删地删得删的·保留主干·缩到最短", -15, -60, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '缩句方法', body: '【三删：①删"的"前面的修饰语 ②删"地"前面的修饰语 ③删"得"后面的补充】\n【三保留：①保留主干（谁+干什么）②保留"着了过"③保留否定词（不·没有）】\n步骤：找主干（谁/什么+怎么样/干什么）→删修饰→检查是否通顺。' },
      { title: '易错点', body: '【"的"前全删——但"的"后面是主语中心词时要保留】\n例：美丽的蝴蝶→保留"蝴蝶"删"美丽的"\n【"在...中/下/里"的介词短语删】例：在花丛中→删\n【数量词一般也删】例：三只小鸟→删"三只"留"小鸟"。\n缩完读一遍：意思没变·句子通顺·没有歧义。' },
      { title: '扩句（反向）', body: '【扩句 = 给主干加修饰语，让句子更生动】\n主干：小鸟唱歌。\n扩：（可爱的）小鸟（在枝头上）（欢快地）唱歌。\n方法：加"什么样的"+加"在哪"+加"怎么样地"。\n缩句考减法，扩句考加法——都是找主干的基本功。' },
    ], examples: [
      { q: '缩句：可爱的小猫在软软的沙发上安静地睡觉。', steps: ['找主干：小猫睡觉', '删"可爱的"和"软软的"（的修饰）', '删"在沙发上"（介词短语）', '删"安静地"（地修饰）', '答案：小猫睡觉。'], tip: '谁+干什么' },
      { q: '缩句：他跑得飞快。', steps: ['主干：他跑', '"得飞快"是补充说明跑得怎样', '删"得飞快"', '答案：他跑。'], tip: '得后面删' },
    ], mistakes: ['把主干也删了（"的"后面的中心词要留）', '删掉否定词（不·没有不能删）'] },
  exercises: [
    { q: '缩句时"的"前面的词应该？', options: ['删除', '保留', '换掉', '加上引号'], answer: 0, explain: '修饰语删' },
    { q: '缩句要保留的是？', options: ['主干（谁+干什么）', '所有形容词', '数量词', '介词短语'], answer: 0, explain: '核心不动' },
    { q: '"不""没有"应该？', options: ['保留', '删除', '换词', '移动'], answer: 0, explain: '否定不能丢' },
    { q: '缩句"小明在操场上踢足球。"结果？', options: ['小明踢足球', '小明在踢', '在操场上踢', '小明'], answer: 0, explain: '删介词短语' },
    { q: '缩完的句子应该？', options: ['通顺且意思不变', '越短越好不管意思', '换掉所有词', '只留动词'], answer: 0, explain: '意思为前提' },
    { q: '扩句是缩句的？', options: ['反向操作', '相同操作', '没有关系', '更难'], answer: 0, explain: '一减一加' },
  ],
});

L['chn-34'] = mk({ id: 'chn-34', island: 'cross', order: 494, title: '修辞手法：比喻与拟人', emoji: '🎨',
  subjectArea: '语文', gradeBand: 'primary', grade: 4, textbook: '统编版语文（四年级）',
  curriculum: { module: '句子训练', points: ['比喻的结构', '拟人的特点', '区分比喻与拟人'] },
  story: '"弯弯的月亮像小船"是比喻；"小草在风中点头微笑"是拟人。比喻是打比方（A像B），拟人是把物当人写——掌握这两种修辞，你的作文立刻生动起来！',
  goals: ['理解比喻的结构', '理解拟人的特点', '会区分和运用'],
  aiIntro: '🎨 切换修辞手法，看句子怎么变生动——修辞手法训练营！',
  lab: { params: [{ name: 'type', label: '修辞', min: 1, max: 2, step: 1, value: 1 }],
    grid: false, explore: ['type=1 比喻的三个部分是什么？', 'type=2 拟人的标志是什么？', '有"像"一定是比喻吗？'],
    code: `# 修辞手法训练营
type = 1   # 1比喻 2拟人

hide()
t = "比喻"
d = "弯弯的月亮像一只小船。"
e = "本体（月亮）+ 喻词（像）+ 喻体（小船）"
tip = "有"像/仿佛/如同"但两种不同类物才是比喻"
if type == 2:
    t = "拟人"
    d = "小草在风中点头微笑。"
    e = "把小草当作人来写（点头·微笑）"
    tip = "给物加上人的动作·表情·语言就是拟人"
fill_rect(0, 130, 360, 30, "#7c3aed")
write(t, 0, 130, "#fff", 14)
fill_rect(0, 76, 360, 42, "#f5f3ff")
write("例：" + d, 0, 76, "#6d28d9", 12)
fill_rect(0, 16, 360, 56, "#fef3c7")
write(e, 0, 16, "#b45309", 10)
write("区分：" + tip, -20, -40, "#dc2626", 10)
`,
  },
  teach: { sections: [
      { title: '比喻', body: '【结构：本体（被比的事物）+ 喻词（像/仿佛/是）+ 喻体（用来比的事物）】\n弯弯的月亮（本体）像（喻词）小船（喻体）。\n条件：本体和喻体必须是不同类的事物（月亮≠小船 ✓）。\n暗喻：时间是金钱（用"是"不用"像"）。\n同类不能比：小明像他爸爸（不是比喻，是比较）。' },
      { title: '拟人', body: '【把物当作人来写——给它人的动作·表情·语言·情感】\n小草点头微笑（人的动作）·风儿唱歌（人的行为）·太阳公公（人的称呼）。\n判断标志：句子中的"物"做了只有人才能做的事。\n拟人让静物"活"起来，让读者产生亲切感。' },
      { title: '区分与运用', body: '【比喻：A像B（不同类物之间的比较）】\n【拟人：物做人的事（没有喻体）】\n区分技巧：找出有没有"喻体"——有喻体是比喻，没有是拟人。\n写作运用：写景用比喻（形容外观）+ 拟人（赋予生命）双重修辞，画面立刻生动。' },
    ], examples: [
      { q: '"太阳的脸红红的"用了什么修辞？', steps: ['太阳被赋予"脸"和"红"（人的特征）', '没有喻体（不是和另一物比）', '答案：拟人', '太阳像人的脸红了'], tip: '没有喻体=拟人' },
      { q: '"小河像一条银色的丝带"是比喻吗？', steps: ['本体：小河', '喻体：丝带', '喻词：像', '小河和丝带不同类 → 是比喻'], tip: '不同类物' },
    ], mistakes: ['有"像"就当比喻（同类物比较不是比喻）', '比喻和拟人混淆（看有没有喻体）'] },
  exercises: [
    { q: '比喻的结构不包括？', options: ['形容词', '本体', '喻词', '喻体'], answer: 0, explain: '三要素' },
    { q: '"花儿在风中跳舞"是？', options: ['拟人', '比喻', '排比', '夸张'], answer: 0, explain: '人的动作' },
    { q: '"弯弯的月儿像小船"中喻体是？', options: ['小船', '月亮', '弯弯', '像'], answer: 0, explain: '用来比的' },
    { q: '"小明长得像爸爸"是比喻吗？', options: ['不是（同类比较）', '是', '是拟人', '是排比'], answer: 0, explain: '人与人类似' },
    { q: '拟人的特点是？', options: ['把物当人写', '把人当物写', '打比方', '重复句子'], answer: 0, explain: '赋予人性' },
    { q: '区分比喻和拟人看？', options: ['有没有喻体', '有没有"像"', '长短', '有没有感叹号'], answer: 0, explain: '有喻体=比喻' },
  ],
});

/* 写入 */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第61轮拓展批写入 ${n} 节：${Object.keys(L).join(', ')}`);
