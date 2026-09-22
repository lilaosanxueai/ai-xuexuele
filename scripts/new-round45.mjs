import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第45轮拓展批：科学初中+4（浙教版首开初中段） 语文初中+2 英语初中+2 = 8 节（订单号 388-395） */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

/* ================= 科学·初中（浙教版） +4 ================= */

L['sci-19'] = mk({ id: 'sci-19', island: 'cross', order: 388, title: '物态变化：冰水汽的变身', emoji: '❄️',
  subjectArea: '科学', gradeBand: 'junior', grade: 7, textbook: '浙教版科学（初中七上）',
  curriculum: { module: '物质的变化', points: ['三种物态与分子排列', '熔化凝固与汽化液化', '升华凝华'] },
  story: '一块冰要"过五关"才能环游世界：熔化成水、汽化成雾、凝华成霜……六种物态变化就像物质的六次变身，每一次都伴随着吸热或放热。',
  goals: ['掌握六种物态变化', '理解吸热放热规律', '会解释生活现象'],
  aiIntro: '❄️ 拖动温度滑块，看水分子怎么换队形——物态变化演示箱！',
  lab: { params: [{ name: 'temp', label: '温度（℃）', min: -30, max: 130, step: 10, value: 20 }],
    grid: false, explore: ['0℃ 和 100℃ 各发生什么变化？', '哪种变化吸热、哪种放热？', '冬天窗户上的冰花是哪种变化？'],
    code: `# 物态变化演示箱
temp = 20   # 温度（摄氏度）

hide()
state = "液态水"
change = "稳定液态"
heat = "—"
if temp < 0:
    state = "固态冰"
    change = "低于熔点：已凝固（放热成冰）"
    heat = "放热"
if temp > 100:
    state = "气态水蒸气"
    change = "高于沸点：已汽化（吸热成气）"
    heat = "吸热"
if temp == 0:
    change = "熔点：冰水混合（熔化吸热）"
    heat = "吸热"
if temp == 100:
    change = "沸点：沸腾汽化（大量吸热）"
    heat = "吸热"
fill_rect(0, 140, 360, 30, "#1d4ed8")
write(temp + "℃ → " + state + "（" + heat + "）", 0, 140, "#fff", 12)
spread = 26
if temp < 0:
    spread = 12
if temp > 100:
    spread = 44
i = 0
while i < 12:
    col = i - (i / 4) * 4
    row = i / 4
    x = -spread * 1.5 + col * spread
    y = 40 - row * spread
    fill_rect(x, y, 8, 8, "#38bdf8")
    i = i + 1
write("蓝块=水分子：固挨着站·液可滑动·气自由飞", -30, -50, "#0f172a", 10)
fill_rect(0, -90, 360, 34, "#fef3c7")
write(change, 0, -90, "#b45309", 11)
write("六变化：熔化·汽化·升华吸热 | 凝固·液化·凝华放热", -20, -125, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '分子视角', body: '【固态：分子手拉手整齐排队（有固定形状）】\n【液态：分子可以滑动互换（随容器变形）】【气态：分子自由飞行（充满空间）】\n温度=分子运动剧烈程度——热了分子挣脱束缚，冷了乖乖排好。' },
      { title: '六种变化', body: '【吸热三兄弟：熔化（冰→水）、汽化（水→汽，含蒸发和沸腾）、升华（冰→直接变汽，冻衣服变干）】\n【放热三兄弟：凝固、液化（雾、露）、凝华（霜、冰花、雾凇）】\n晶体有固定熔点（冰 0℃），非晶体没有（玻璃蜡）。' },
      { title: '生活现象', body: '【冬天冰花在窗户内侧（室内水汽遇冷凝华）】\n【夏天喝冰水杯壁出露（空气水蒸气液化）】\n【出汗凉快（蒸发吸热）、下雪不冷化雪冷（熔化吸热）】\n答题套路：先说变化名称，再说吸放热，最后解释现象。' },
    ], examples: [
      { q: '北方冬天冻衣服也能变干，为什么？', steps: ['冰直接变成水蒸气', '固→气是升华', '升华吸热', '所以冻衣服慢慢变干'], tip: '不经液态直达' },
      { q: '为什么下雪不冷化雪冷？', steps: ['下雪：水汽凝华/凝固放热', '化雪：熔化吸热', '吸热从周围环境抢热量', '所以化雪时更冷'], tip: '吸放热定冷暖' },
    ], mistakes: ['认为 100℃ 的水继续加热温度一直升（沸腾时温度不变）', '把白气当水蒸气（白气是液化的小水滴）'] },
  exercises: [
    { q: '冰变成水属于？', options: ['熔化', '凝固', '升华', '液化'], answer: 0, explain: '固→液吸热' },
    { q: '雾的形成属于？', options: ['液化', '汽化', '凝华', '熔化'], answer: 0, explain: '气→液放热' },
    { q: '下列吸热的变化是？', options: ['升华', '凝固', '液化', '凝华'], answer: 0, explain: '吸热三兄弟' },
    { q: '冰的熔点是？', options: ['0℃', '100℃', '-10℃', '50℃'], answer: 0, explain: '标准大气压' },
    { q: '窗上冰花出现在？', options: ['窗户内侧', '窗户外侧', '中间', '没有冰花'], answer: 0, explain: '室内水汽凝华' },
    { q: '出汗凉快利用了？', options: ['蒸发吸热', '凝固放热', '升华', '传导'], answer: 0, explain: '汽化吸热' },
  ],
});

L['sci-20'] = mk({ id: 'sci-20', island: 'cross', order: 389, title: '电路初探：串联与并联', emoji: '🔌',
  subjectArea: '科学', gradeBand: 'junior', grade: 7, textbook: '浙教版科学（初中七上）',
  curriculum: { module: '电与磁', points: ['电路的组成', '串联电路特点', '并联电路特点'] },
  story: '节日彩灯一灭一串全灭，家里的灯各开各的——秘密在接线方式：串联像独木桥，一处断全队停；并联像多车道，各走各的。认识电路，从两条路开始。',
  goals: ['知道电路的四部分组成', '掌握串并联的特点与识别', '会画简单电路图'],
  aiIntro: '🔌 切换接线方式，看两只灯泡的命运分岔——串并联对比台！',
  lab: { params: [{ name: 'mode', label: '接线方式', min: 1, max: 2, step: 1, value: 1 },
                  { name: 'broken', label: '灯2断路？', min: 0, max: 1, step: 1, value: 0 }],
    grid: false, explore: ['mode=1 且断路时灯1怎样？', '并联时一条支路断，另一条呢？', '家里的电路是哪种？'],
    code: `# 串并联对比台
mode = 1      # 1串联 2并联
broken = 0    # 灯2 是否断路

hide()
t = "串联电路"
feat = "电流只有一条路：一断全灭"
l1 = "亮"
l2 = "亮"
if mode == 1:
    if broken == 1:
        l1 = "灭"
        l2 = "灭（断了全停）"
if mode == 2:
    t = "并联电路"
    feat = "电流多条路：互不影响（家庭电路）"
    if broken == 1:
        l2 = "灭（只灭这一条）"
fill_rect(0, 140, 360, 30, "#1d4ed8")
write(t + "：" + feat, 0, 140, "#fff", 10)
pen_color("#0f172a")
pen_down()
go_to(-160, 60)
go_to(160, 60)
go_to(160, -20)
go_to(-160, -20)
go_to(-160, 60)
pen_up()
circle(-90, 20, 16, "#f59e0b")
write("灯1", -90, 20, "#7c2d12", 9)
if mode == 1:
    circle(90, 20, 16, "#f59e0b")
    write("灯2", 90, 20, "#7c2d12", 9)
if mode == 2:
    circle(60, 20, 14, "#f59e0b")
    write("灯2", 60, 20, "#7c2d12", 8)
    circle(120, 20, 14, "#f59e0b")
    write("灯3", 120, 20, "#7c2d12", 8)
if broken == 1:
    if mode == 1:
        fill_rect(-90, 20, 30, 30, "#475569")
        fill_rect(90, 20, 30, 30, "#475569")
    if mode == 2:
        fill_rect(60, 20, 26, 26, "#475569")
write("灯1：" + l1 + "   灯2：" + l2, -20, 100, "#dc2626", 12)
write("串联分压电流相等；并联电压相等电流相加", -20, -60, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '电路四件套', body: '【电源（提供电能）+ 用电器（消耗）+ 开关（控制）+ 导线（输送）】\n通路：处处连通；断路（开路）：某处断开；短路：不经过用电器直接连电源正负极——危险，会烧电源。\n画电路图用统一符号：电池长短线、灯泡圆圈叉。' },
      { title: '串联', body: '【首尾相连一条路：电流处处相等 I=I₁=I₂】\n【电压分配：U=U₁+U₂】【总电阻 R=R₁+R₂ 越串越大】\n特点：一断全灭——节日彩灯老式接法。\n开关接在任何位置效果相同。' },
      { title: '并联', body: '【并列分叉多条路：电压相等 U=U₁=U₂】\n【电流相加 I=I₁+I₂】【总电阻越并越小】\n特点：互不影响——家庭电路全是并联，开关装在支路控各自的灯。\n识别法：电流有无分叉；拆掉一个用电器看其他还亮不亮。' },
    ], examples: [
      { q: '教室里一盏灯坏了，其他灯还亮，说明什么？', steps: ['互不影响=并联', '若串联会全灭', '家庭/教室电路均为并联', '答案：并联'], tip: '断一个看其他' },
      { q: '为什么不能用导线直接连电池两端？', steps: ['电流不经过用电器=电源短路', '电流过大发热', '烧坏电源甚至起火', '答案：短路危险'], tip: '短路线是红线' },
    ], mistakes: ['认为并联电流处处相等（那是串联）', '开关装在并联干路以为只控一盏（控全部）'] },
  exercises: [
    { q: '电路的组成不包括？', options: ['开关', '电源', '导线', '水龙头'], answer: 0, explain: '四件套' },
    { q: '串联电路中？', options: ['电流处处相等', '电压处处相等', '电阻越并越小', '互不影响'], answer: 0, explain: '一条路同流量' },
    { q: '家庭电路的连接方式是？', options: ['并联', '串联', '混联都不用', '短路'], answer: 0, explain: '各灯独立' },
    { q: '一断全灭的是？', options: ['串联', '并联', '都一样', '无线'], answer: 0, explain: '独木桥' },
    { q: '并联电路的电压关系是？', options: ['各支路电压相等', '相加', '递减', '为零'], answer: 0, explain: '同源同压' },
    { q: '导线直接连电源两极属于？', options: ['短路（危险）', '通路', '断路', '正常'], answer: 0, explain: '会烧电源' },
  ],
});

L['sci-21'] = mk({ id: 'sci-21', island: 'cross', order: 390, title: '显微镜下的世界', emoji: '🔬',
  subjectArea: '科学', gradeBand: 'junior', grade: 7, textbook: '浙教版科学（初中七上）',
  curriculum: { module: '生命科学', points: ['显微镜的结构与使用', '细胞学说的要点', '动植物细胞的区别'] },
  story: '三百多年前列文虎克磨出一颗玻璃珠，看见了会动的"小动物"——人类第一次窥见微观世界。学会用显微镜，你也能亲眼看到生命的基本单位：细胞。',
  goals: ['掌握显微镜的使用步骤', '了解细胞学说', '区分动植物细胞'],
  aiIntro: '🔬 拨动观察对象，看镜头里的微观世界——显微镜观察台！',
  lab: { params: [{ name: 'obj', label: '观察对象', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['obj=2 为什么植物细胞有整齐的"砖墙"？', '使用显微镜先用什么镜头？', '放大倍数怎么算？'],
    code: `# 显微镜观察台
obj = 1   # 1洋葱表皮 2口腔上皮 3酵母菌

hide()
t = "洋葱表皮细胞（植物）"
see = "整齐排列的砖块：细胞壁+细胞核+液泡"
key = "有细胞壁和液泡——植物特有"
if obj == 2:
    t = "口腔上皮细胞（动物）"
    see = "圆润的细胞：细胞膜+细胞核+细胞质"
    key = "没有细胞壁和液泡——动物细胞"
if obj == 3:
    t = "酵母菌（真菌）"
    see = "椭圆形小家伙，出芽生殖的模样"
    key = "单细胞生物：一个细胞就是一个生命"
fill_rect(0, 140, 360, 30, "#16a34a")
write(t, 0, 140, "#fff", 13)
circle(0, 20, 80, "#f0fdf4")
if obj == 1:
    i = 0
    while i < 3:
        row = 0
        while row < 2:
            fill_rect(-50 + i * 50, -10 + row * 45, 42, 38, "#bbf7d0")
            circle(-50 + i * 50, -10 + row * 45, 8, "#166534")
            row = row + 1
        i = i + 1
if obj == 2:
    i = 0
    while i < 3:
        circle(-50 + i * 50, 10 - (i / 2) * 20, 22, "#fecdd3")
        circle(-50 + i * 50, 10 - (i / 2) * 20, 7, "#9f1239")
        i = i + 1
if obj == 3:
    i = 0
    while i < 4:
        circle(-50 + i * 34, 20, 14, "#fef3c7")
        circle(-36 + i * 34, 34, 8, "#fef3c7")
        i = i + 1
fill_rect(0, -70, 360, 36, "#f1f5f9")
write(see, 0, -70, "#0f172a", 10)
write("识别：" + key, -20, -108, "#b45309", 11)
write("放大倍数 = 目镜倍数 × 物镜倍数", -20, -135, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '显微镜使用', body: '【步骤：取镜安放→对光（低倍物镜、大光圈、反光镜调亮）→压片→调焦（先降后升，镜筒先降近玻片再缓缓上提）→观察】\n放大倍数 = 目镜 × 物镜（10×40=400 倍）。\n看到的像是倒像：物像偏哪移玻片往哪移。' },
      { title: '细胞学说', body: '【动物和植物都由细胞构成；细胞是生命活动的基本单位；新细胞由老细胞分裂产生】\n三位功臣：胡克（命名 cell）、施莱登与施旺（动植物由细胞组成）、魏尔肖（细胞来自细胞）。\n从"看不见"到"看透"——学说是 many 人接力拼出的。' },
      { title: '动植物细胞对比', body: '【共有：细胞膜、细胞质、细胞核】\n【植物特有：细胞壁（骨架）、液泡（储水储养分）、叶绿体（部分细胞有，光合作用）】\n【动物特有：没有壁和液泡】\n画细胞图：暗处用点表示，不能涂阴影。' },
    ], examples: [
      { q: '视野太暗怎么办？', steps: ['换大光圈', '换凹面反光镜聚光', '调光源更亮', '三招组合'], tip: '先光圈后反光镜' },
      { q: '怎样区分镜下是植物还是动物细胞？', steps: ['找细胞壁：有则是植物', '找大液泡：有则是植物', '找叶绿体：绿色必是植物', '都没有→动物细胞'], tip: '三件套一查便知' },
    ], mistakes: ['调焦时镜筒一直下降（可能压碎玻片，应先降后升）', '认为所有植物细胞都有叶绿体（根细胞没有）'] },
  exercises: [
    { q: '显微镜的放大倍数等于？', options: ['目镜×物镜', '目镜+物镜', '物镜×2', '镜筒长度'], answer: 0, explain: '乘积' },
    { q: '植物细胞特有的结构是？', options: ['细胞壁和液泡', '细胞核', '细胞膜', '细胞质'], answer: 0, explain: '动物没有' },
    { q: '对光时应使用？', options: ['低倍物镜', '高倍物镜', '不用物镜', '任意'], answer: 0, explain: '先低后高' },
    { q: '细胞学说的核心是？', options: ['细胞是生命活动的基本单位', '细胞会运动', '所有细胞都有壁', '细胞不可见'], answer: 0, explain: '基本单位' },
    { q: '显微镜下的像是？', options: ['倒像', '正像', '放大的正像', '缩小的像'], answer: 0, explain: '上下左右颠倒' },
    { q: '第一个命名 cell 的科学家是？', options: ['胡克', '施旺', '列文虎克', '巴斯德'], answer: 0, explain: '软木切片小室' },
  ],
});

L['sci-22'] = mk({ id: 'sci-22', island: 'cross', order: 391, title: '科学方法：控制变量法', emoji: '🧪',
  subjectArea: '科学', gradeBand: 'junior', grade: 7, textbook: '浙教版科学（初中七上）',
  curriculum: { module: '科学探究', points: ['提出问题与假设', '控制变量法', '实验数据与结论'] },
  story: '种子发芽是光说了算还是水说了算？聪明的做法：一次只让一个条件不同，其他全部相同——这就是控制变量法，所有科学实验的"总开关"。',
  goals: ['会提出可检验的问题与假设', '掌握控制变量法设计实验', '会从数据得出结论'],
  aiIntro: '🧪 拨动变量开关，看哪盆豆芽长得好——控制变量实验台！',
  lab: { params: [{ name: 'light', label: '光照不同？', min: 0, max: 1, step: 1, value: 1 },
                  { name: 'water', label: '水分不同？', min: 0, max: 1, step: 1, value: 0 }],
    grid: false, explore: ['两盆都不同时能得出结论吗？', '怎样验证"光影响发芽"？', '结论应该说"什么导致什么"？'],
    code: `# 控制变量实验台
light = 1   # 两盆光照是否不同
water = 0   # 两盆水分是否不同

hide()
vars = 0
if light == 1:
    vars = vars + 1
if water == 1:
    vars = vars + 1
fill_rect(0, 140, 360, 30, "#16a34a")
if vars == 1:
    write("✓ 只有一个变量不同：可以下结论", 0, 140, "#fff", 12)
if vars == 0:
    write("✗ 完全相同：没有对比，得不出结论", 0, 140, "#fff", 12)
if vars == 2:
    write("✗ 两个变量都不同：说不清是谁的功劳", 0, 140, "#fff", 11)
write("A 盆：光照 ✓ 水 ✓", -110, 90, "#0f172a", 11)
if light == 1:
    write("B 盆：遮光 ✗ 水 ✓", 110, 90, "#0f172a", 11)
if light == 0:
    if water == 1:
        write("B 盆：光照 ✓ 缺水 ✗", 110, 90, "#0f172a", 11)
if light == 0:
    if water == 0:
        write("B 盆：与 A 相同", 110, 90, "#64748b", 11)
fill_rect(-110, 30, 90, 70, "#bbf7d0")
write("🌱", -110, 35, "#166534", 22)
if vars == 1:
    fill_rect(110, 30, 90, 70, "#e2e8f0")
    write("🥀", 110, 35, "#334155", 22)
if vars != 1:
    fill_rect(110, 30, 90, 70, "#fef3c7")
    write("？", 110, 35, "#b45309", 22)
write("结论句式：在xx相同时，xx不同导致结果不同", -20, -50, "#dc2626", 11)
write("控制变量法：一次只改一个条件", -40, -80, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '提出问题', body: '【可检验的问题长什么样：光会影响绿豆发芽吗？（可设计实验回答）】\n不可检验：光好还是水好？（无法实验）\n假设是对问题的猜测答案：若光影响发芽，则遮光的发芽率低。' },
      { title: '控制变量法', body: '【核心：只允许一个条件（自变量）不同，其余（温度、水分、种子数量）全部控制相同】\n对照组：正常条件；实验组：只改变自变量。\n样本要多（20 粒不是 2 粒）：排除偶然性。' },
      { title: '数据与结论', body: '【记录表格：日期/条件/发芽数——多组重复取平均】\n结论三句话：条件相同时……（控制）；只有 X 不同（变量）；导致结果差异（结论）。\n诚实记录反常数据——反常里可能藏着新发现。' },
    ], examples: [
      { q: '验证"温度影响酶的分解"，怎么设计？', steps: ['准备两组相同份量的酶和底物', '一组 37℃、一组 60℃，其余全相同', '观察分解速度差异', '结论：温度不同导致分解速度不同'], tip: '只留温度变量' },
      { q: '两盆豆芽一盆遮光一盆少水，结果都长得差，能下结论吗？', steps: ['有两个变量同时不同', '无法判断是谁导致长差', '不符合控制变量法', '不能下结论，需重新设计'], tip: '一因一果才说得清' },
    ], mistakes: ['一次改变多个条件（说不清因果）', '样本太少就下结论（偶然当必然）'] },
  exercises: [
    { q: '控制变量法的核心是？', options: ['一次只改一个条件', '同时改变所有条件', '不做对照', '凭感觉'], answer: 0, explain: '单一变量' },
    { q: '对照组的作用是？', options: ['提供对比基准', '增加数量', '好看', '浪费'], answer: 0, explain: '正常条件参照' },
    { q: '样本要足够多是为了？', options: ['排除偶然性', '好看', '省时间', '没有原因'], answer: 0, explain: '一粒发芽可能是巧合' },
    { q: '"光好还是水好"这个问题？', options: ['不可检验', '可检验', '是假设', '是结论'], answer: 0, explain: '无法实验回答' },
    { q: '自变量是指？', options: ['实验中改变的量', '不变的量', '测量的结果', '实验器材'], answer: 0, explain: '原因变量' },
    { q: '出现反常数据应该？', options: ['如实记录并分析', '删掉', '改数据', '不管'], answer: 0, explain: '诚实是科学底线' },
  ],
});

/* ================= 语文·初中 +2 ================= */

L['chn-18'] = mk({ id: 'chn-18', island: 'cross', order: 392, title: '议论文阅读：把握作者观点', emoji: '🎯',
  subjectArea: '语文', gradeBand: 'junior', grade: 9, textbook: '统编版语文（初中）',
  curriculum: { module: '现代文阅读·议论文', points: ['找中心论点', '辨论证方法', '分析论证思路'] },
  story: '读议论文像听人辩论：他到底主张什么（论点）？拿什么证明（论据）？怎么一步步说服你（论证）？抓住这三个问题，一篇议论文就读透了。',
  goals: ['会找中心论点', '辨别论证方法及作用', '会梳理论证思路'],
  aiIntro: '🎯 拨动阅读三问，看议论文怎么被拆解——议论文透视镜！',
  lab: { params: [{ name: 'q', label: '阅读三问', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['论点常出现在哪里？', '举例论证和道理论证怎么区分？', '论证思路答题怎么说？'],
    code: `# 议论文透视镜
q = 1   # 1找论点 2辨方法 3理思路

hide()
t = "一问：论点在哪"
d = "标题、开头、结尾；论点是判断句（xx应该xx）"
ex = "敬业与乐业：敬业主义于人生最为必要"
if q == 2:
    t = "二问：怎么论证"
    d = "举例论证（事实有力）·道理论证（讲理深刻）·对比论证（是非分明）·比喻论证（形象易懂）"
    ex = "答题：运用xx论证+证明了xx+使论证更xx"
if q == 3:
    t = "三问：思路如何"
    d = "提出问题（引论）→分析问题（本论）→解决问题（结论）"
    ex = "首先由xx引出论题，然后从xx三方面论证，最后总结出xx"
fill_rect(0, 130, 360, 32, "#dc2626")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 78, 360, 38, "#f1f5f9")
write(d, 0, 78, "#0f172a", 10)
fill_rect(0, 24, 360, 44, "#fef3c7")
write("例：" + ex, 0, 24, "#b45309", 10)
i = 1
while i < 4:
    x = -110 + (i - 1) * 110
    if i <= q:
        fill_rect(x, -55, 90, 44, "#dc2626")
        write("问" + i + " ✓", x, -55, "#fff", 12)
    if i > q:
        fill_rect(x, -55, 90, 44, "#e2e8f0")
        write("问" + i, x, -55, "#64748b", 11)
    i = i + 1
write("论点≠论题：论题是谈什么，论点是主张什么", -20, -115, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '找论点', body: '【论点=作者的完整主张，一句判断句】\n位置：标题（有时）、开头（开门见山）、结尾（卒章显志）、中间（承上启下后）。\n区分论题：论题是"谈什么"（谈骨气），论点是"主张什么"（我们要有骨气）。' },
      { title: '论证方法', body: '【举例论证：摆事实——具体有力】【道理论证：讲道理/引名言——权威深刻】\n【对比论证：正反对照——是非分明】【比喻论证：打比方——形象透彻】\n作用公式：运用xx论证方法 + 通过xx + 有力证明了xx论点。' },
      { title: '论证思路', body: '【结构三段：引论（提出问题）→本论（分析问题）→结论（解决问题）】\n常见结构：总分总、层进（是什么-为什么-怎么办）、并列（几方面平列）。\n答题模板：首先…提出xx；接着…从xx论证；然后…转折补充；最后…总结深化。' },
    ], examples: [
      { q: '"谈读书"和"读书使人明智"哪个是论点？', steps: ['谈读书：只说话题=论题', '读书使人明智：完整判断=论点', '也可以是分论点', '答案：后者'], tip: '判断句才是论点' },
      { q: '文章用"囊萤映雪"证明勤学，是什么论证？', steps: ['车胤孙康的故事=事实', '用事实证明观点', '举例论证', '作用：具体有力'], tip: '摆事实举例' },
    ], mistakes: ['把论题当论点（谈什么≠主张什么）', '论证方法只写名称不答作用'] },
  exercises: [
    { q: '论点的句式通常是？', options: ['判断句', '疑问句', '感叹句', '祈使句'], answer: 0, explain: '明确主张' },
    { q: '引用名言说理属于？', options: ['道理论证', '举例论证', '对比论证', '比喻论证'], answer: 0, explain: '讲道理' },
    { q: '正反两方面对照论证属于？', options: ['对比论证', '比喻论证', '举例论证', '道理论证'], answer: 0, explain: '是非自明' },
    { q: '论证思路的三段结构是？', options: ['引论-本论-结论', '开头-中间-结尾', '起因-经过-结果', '总-分'], answer: 0, explain: '提出-分析-解决' },
    { q: '论题和论点的区别是？', options: ['谈什么 vs 主张什么', '一样', '论题更长', '论点在标题'], answer: 0, explain: '话题vs判断' },
    { q: '举例论证的作用是？', options: ['具体有力地证明论点', '生动形象', '权威深刻', '对比鲜明'], answer: 0, explain: '事实胜于雄辩' },
  ],
});

L['chn-19'] = mk({ id: 'chn-19', island: 'cross', order: 393, title: '新闻阅读：获取与辨析', emoji: '📰',
  subjectArea: '语文', gradeBand: 'junior', grade: 8, textbook: '统编版语文（初中）',
  curriculum: { module: '实用文阅读·新闻', points: ['新闻的结构与要素', '标题与导语', '信息辨析与媒介素养'] },
  story: '一则消息的开头一段就能告诉你"谁、何时、何地、发生了什么"——这是新闻人的百年智慧。学会读新闻，更要学会问：消息来源可靠吗？有没有夸大？信息时代，辨别力就是竞争力。',
  goals: ['掌握新闻五要素与结构', '会读标题和导语', '具有初步的信息辨析能力'],
  aiIntro: '📰 切换新闻部位，看每一段的任务——新闻解剖台！',
  lab: { params: [{ name: 'part', label: '新闻部位', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['part=2 导语为什么最重要？', '标题和新闻的内容一定一致吗？', '怎样判断一条消息可不可信？'],
    code: `# 新闻解剖台
part = 1   # 1标题 2导语 3主体 4背景结语

hide()
t = "标题：新闻的眼睛"
d = "概括最重要事实；引题交代背景、主题报告事实、副题补充"
ex = "主标：我国高铁突破 4 万公里"
if part == 2:
    t = "导语：第一段是灵魂"
    d = "五要素集中地：何时何地何人何事何果"
    ex = "读完导语就知道了新闻的核心信息"
if part == 3:
    t = "主体：展开的骨架"
    d = "按重要性递减（倒金字塔结构）逐层补充细节"
    ex = "最重要的放最前，越往后越细"
if part == 4:
    t = "背景与结语"
    d = "背景帮助理解，结语小结展望；可有可无，位置灵活"
    ex = "背景：这是我国连续第X年…"
fill_rect(0, 130, 360, 32, "#1d4ed8")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 78, 360, 38, "#f1f5f9")
write(d, 0, 78, "#0f172a", 10)
fill_rect(0, 24, 360, 44, "#fef3c7")
write("例：" + ex, 0, 24, "#b45309", 10)
write("辨析三问：谁说的？有证据吗？别处怎么说？", -20, -55, "#dc2626", 11)
write("五要素：何时 何地 何人 何事 何故", -20, -85, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '结构五件套', body: '【标题（眼睛）+ 导语（灵魂，五要素聚集）+ 主体（倒金字塔展开）+ 背景 + 结语】\n消息篇幅短、时效强；通讯有细节有情感；新闻评论是观点。\n倒金字塔：最重要的信息放最前——为读者随时可以停读而设计。' },
      { title: '标题与导语', body: '【标题三件：引题（肩题）造势、主题报告事实、副题补充】\n【导语=第一段（或第一句）：五要素浓缩】\n拟标题训练：事实+最吸引点，不超过 15 字为宜。\n好导语让读者 5 秒抓住核心。' },
      { title: '信息辨析', body: '【三问：谁说的（来源权威吗）？有证据吗（数据当事人）？别处怎么说（交叉验证）？】\n警惕：标题党（题文不符）、断章取义、情绪煽动、无出处转发。\n媒介素养：转发前停 10 秒核实——不做谣言的二传手。' },
    ], examples: [
      { q: '给学校运动会拟一个标题。', steps: ['抓最核心事实：校运会开幕', '加亮点：三十项纪录被刷新', '压缩：我校运动会开幕 三项纪录被刷新', '对照正文核实无夸大'], tip: '事实+亮点' },
      { q: '家族群里"某食物致癌"文章无出处，怎么办？', steps: ['三问：谁写的？证据？', '查权威平台（科普机构）', '多数此类文为博眼球', '不转发并提醒长辈'], tip: '先核实再转发' },
    ], mistakes: ['把标题直接当新闻全部内容（可能标题党）', '导语五要素缺"结果"（读者抓不到结论）'] },
  exercises: [
    { q: '新闻的灵魂是？', options: ['导语', '标题', '结语', '背景'], answer: 0, explain: '五要素聚集' },
    { q: '倒金字塔结构指？', options: ['最重要信息在前', '时间顺序', '先背景后事实', '字数递减'], answer: 0, explain: '重要度递减' },
    { q: '新闻五要素不包括？', options: ['价格', '何时', '何地', '何人'], answer: 0, explain: '5W 中无价格' },
    { q: '标题党的特征是？', options: ['题文不符博眼球', '标题准确', '字数多', '用引号'], answer: 0, explain: '夸张失实' },
    { q: '判断消息可信的第一步是？', options: ['看来源', '看字数', '看表情包', '看谁发的红包'], answer: 0, explain: '权威来源' },
    { q: '通讯与消息相比？', options: ['更详细有细节', '更短', '更慢无时效', '没有事实'], answer: 0, explain: '消息快讯通讯详' },
  ],
});

/* ================= 英语·初中 +2 ================= */

L['eng-25'] = mk({ id: 'eng-25', island: 'cross', order: 394, title: '一般现在时与三单', emoji: '⏰',
  subjectArea: '英语', gradeBand: 'junior', grade: 7, textbook: '人教版英语（初中）',
  curriculum: { module: '时态·一般现在时', points: ['一般现在时的用法', '第三人称单数变化', '频度副词的位置'] },
  story: 'I go to school. He goes to school.——为什么 he 后面的动词要加 s？这就是"三单"魔咒：只要主语是第三人称单数（他/她/它/小明），一般现在时的动词就要变身。',
  goals: ['掌握一般现在时的两大用法', '熟练三单动词变化', '会摆频度副词位置'],
  aiIntro: '⏰ 切换主语，看动词怎么变身——三单变身器！',
  lab: { params: [{ name: 'subj', label: '主语', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['subj=3 动词加 s 了吗？为什么？', '频度副词放在哪？', 'o/ch/sh 结尾的动词怎么变？'],
    code: `# 三单变身器
subj = 1   # 1 I 2 You 3 He 4 My mother

hide()
s = "I"
verb = "play"
sent = "I play basketball every day."
why = "第一人称：动词用原形"
if subj == 2:
    s = "You"
    sent = "You play basketball every day."
    why = "第二人称：动词用原形"
if subj == 3:
    s = "He"
    verb = "plays"
    sent = "He plays basketball every day."
    why = "第三人称单数：动词加 s（三单）"
if subj == 4:
    s = "My mother"
    verb = "watches"
    sent = "My mother watches TV in the evening."
    why = "三单 + ch 结尾加 es（watch→watches）"
fill_rect(0, 130, 360, 32, "#1d4ed8")
write(s + " " + verb + " …", 0, 130, "#fff", 14)
fill_rect(0, 78, 360, 40, "#f1f5f9")
write(sent, 0, 78, "#0f172a", 12)
fill_rect(0, 22, 360, 44, "#fef3c7")
write("规则：" + why, 0, 22, "#b45309", 11)
write("三单变化：一般加s；s/x/ch/sh/o 结尾加es；辅音+y 变y为ies", -30, -30, "#dc2626", 10)
write("频度副词（always/usually/often/sometimes/never）放实义动词前", -30, -58, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '一般现在时', body: '【用法一：经常性习惯性动作（常伴频度副词）】\n【用法二：客观事实普遍真理（The earth goes around the sun.）】\n时间标志：every day、usually、often、on Mondays。\n否定/疑问借 do/does：He doesn\'t play. Does he play?' },
      { title: '三单变化', body: '【一般动词 +s：play→plays】【s/x/ch/sh/o 结尾 +es：watch→watches、go→goes】\n【辅音字母+y：study→studies（元音+y 直接加 s：play→plays）】\n【特殊：have→has】\n口诀：三单魔咒，动词变身；他她它名，统统加身。' },
      { title: '频度副词', body: '【always 总是(100%) > usually 通常 > often 经常 > sometimes 有时 > never 从不(0%)】\n位置：实义动词之前，be 动词/助动词之后。\nHe is always late. / He always plays.\n提问用 How often：—How often do you exercise? —Every day.' },
    ], examples: [
      { q: 'She ___ (go) to school by bike. 填？', steps: ['主语 she 是三单', '一般现在时', 'go→goes', '答案：goes'], tip: 'o结尾加es' },
      { q: '把 He often plays football. 改否定。', steps: ['三单否定借 does', 'He does not / doesn\'t play', '动词还原原形', '频度副词保留'], tip: '借does动词回原形' },
    ], mistakes: ['用了 does 又给动词加 s（doesn\'t plays ×）', '频度副词放到句尾（应在动词前）'] },
  exercises: [
    { q: 'He ___ football after school.', options: ['plays', 'play', 'playing', 'to play'], answer: 0, explain: '三单加s' },
    { q: 'watch 的三单形式是？', options: ['watches', 'watchs', 'watch', 'watching'], answer: 0, explain: 'ch结尾加es' },
    { q: 'study 的三单形式是？', options: ['studies', 'studys', 'study', 'studing'], answer: 0, explain: '辅音+y变ies' },
    { q: 'My mother ___ (have) breakfast at 7.', options: ['has', 'have', 'haves', 'having'], answer: 0, explain: '特殊变化' },
    { q: '频度副词应放在？', options: ['实义动词前', '句首', '句尾', '主语前'], answer: 0, explain: '动词之前' },
    { q: 'The earth ___ around the sun.', options: ['goes', 'go', 'going', 'went'], answer: 0, explain: '客观真理用一般现在时' },
  ],
});

L['eng-26'] = mk({ id: 'eng-26', island: 'cross', order: 395, title: '时间与日期表达', emoji: '📅',
  subjectArea: '英语', gradeBand: 'junior', grade: 7, textbook: '人教版英语（初中）',
  curriculum: { module: '交际用语', points: ['年月日表达', '星期与介词 on/in/at', '询问时间的句型'] },
  story: '2026 年 9 月 21 日星期一——英语怎么说？月份要大写、日期用序数词、年份分两位读……时间表达是初中英语的第一道"格式关"，也是考试的常客。',
  goals: ['掌握年月日星期的表达', '会用 on/in/at 时间介词', '会问答时间和日期'],
  aiIntro: '📅 拨到不同的日子，看介词怎么换班——时间介词值班表！',
  lab: { params: [{ name: 'day', label: '日期类型', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['day=1 为什么用 on？', '月份和年份用哪个介词？', '日期用基数词还是序数词？'],
    code: `# 时间介词值班表
day = 1   # 1具体日期 2月份 3年份 4钟点

hide()
prep = "on"
ex = "on Monday, September 21st"
rule = "具体到某一天（日期+星期）用 on"
if day == 2:
    prep = "in"
    ex = "in September / in winter"
    rule = "月份、季节、年份用 in"
if day == 3:
    prep = "in"
    ex = "in 2026"
    rule = "年份用 in"
if day == 4:
    prep = "at"
    ex = "at 7:00 / at noon / at night"
    rule = "钟点、中午、夜里用 at"
fill_rect(0, 130, 360, 32, "#16a34a")
write("介词：" + prep, 0, 130, "#fff", 16)
fill_rect(0, 76, 360, 42, "#f1f5f9")
write(ex, 0, 76, "#0f172a", 13)
fill_rect(0, 20, 360, 46, "#fef3c7")
write(rule, 0, 20, "#b45309", 11)
write("口诀：in 年 in 月 in 季节，on 具体某一天，at 钟点中午夜", -30, -40, "#dc2626", 11)
write("日期写读用序数词：21st 读 the twenty-first", -30, -70, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '年月日', body: '【英文顺序：月 + 日 + 年（September 21st, 2026）】\n月份首字母大写；日用序数词（1st/2nd/3rd/21st）。\n读法：September the twenty-first, twenty twenty-six。\n日期前可加 the：September (the) 21st。' },
      { title: '星期', body: '【Monday Tuesday Wednesday Thursday Friday Saturday Sunday（首字母大写）】\n问星期：What day is it today? —It\'s Monday.\n周末：on weekends（美）/ at weekends（英）。\n周一早晨 on Monday morning：具体某天的上下午也用 on。' },
      { title: '问时间', body: '【What time is it? / What\'s the time?】\n回答：7:00 读 seven (o\'clock)；7:30 读 seven thirty 或 half past seven。\n问答日期：What\'s the date today? —It\'s September 21st.\n区分：What day 问星期，What\'s the date 问日期。' },
    ], examples: [
      { q: '9 月 21 日怎么表达？', steps: ['月在前：September', '日期序数词：21st', 'September 21st / September (the) twenty-first', '年份放最后：September 21st, 2026'], tip: '月日年顺序' },
      { q: '周一早上用哪个介词？', steps: ['Monday 是具体某天 → on', 'Monday morning 还是具体某天的时段', '仍用 on：on Monday morning', '口诀：on 具体某一天'], tip: '某天的时段也on' },
    ], mistakes: ['日期用基数词（21 读 twenty-one × 应 twenty-first）', 'in Monday（× 具体某天用 on）'] },
  exercises: [
    { q: 'September 21st 读作？', options: ['the twenty-first', 'twenty-one', 'twenty-oneth', 'twentieth-one'], answer: 0, explain: '序数词' },
    { q: '___ Monday 用？', options: ['on', 'in', 'at', 'of'], answer: 0, explain: '具体某天' },
    { q: '___ 2026 用？', options: ['in', 'on', 'at', 'to'], answer: 0, explain: '年份用in' },
    { q: '___ seven o\'clock 用？', options: ['at', 'in', 'on', 'by'], answer: 0, explain: '钟点用at' },
    { q: '问星期几说？', options: ['What day is it today?', 'What\'s the date?', 'What time?', 'How day?'], answer: 0, explain: 'day问星期' },
    { q: '月份首字母？', options: ['要大写', '要小写', '斜体', '加引号'], answer: 0, explain: 'September' },
  ],
});

/* ================= 写入 ================= */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第45轮拓展批写入 ${n} 节：${Object.keys(L).join(', ')}`);
