import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第41轮拓展批：语文小学+4 英语小学+3 科学小学+3 = 10 节（订单号 356-365） */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

/* ================= 语文·小学 +4 ================= */

L['chn-11'] = mk({ id: 'chn-11', island: 'cross', order: 356, title: '拼音闯关：平翘舌与前后鼻', emoji: '🔤',
  subjectArea: '语文', gradeBand: 'primary', grade: 1, textbook: '统编版语文（一年级）',
  curriculum: { module: '拼音', points: ['平舌音 z c s', '翘舌音 zh ch sh', '前鼻韵母与后鼻韵母'] },
  story: '「四」和「是」、「分」和「风」——一读错就闹笑话。平舌像小蛇吐信（舌尖抵下齿），翘舌像小猫卷舌（舌尖翘向上颚）。今天把最容易混的拼音一网打尽！',
  goals: ['区分平舌音与翘舌音', '区分前鼻韵尾 n 与后鼻韵尾 ng', '能正确拼读易混音节'],
  aiIntro: '🔤 拨动易混对 selector，看舌头位置和绕口令——拼音正音训练场！',
  lab: { params: [{ name: 'pair', label: '易混对', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['pair=1 四和是的声母差在哪？', '前鼻音和后鼻音舌位有什么不同？', '你能快速读对绕口令吗？'],
    code: `# 拼音正音训练场
pair = 1   # 1 z-zh 2 c-ch 3 s-sh 4 n-ng

hide()
t = "z（平舌） vs zh（翘舌）"
ex = "四 sì —— 是 shì"
tip = "平舌舌尖抵下齿背；翘舌舌尖卷向上腭"
rk = "四是四，十是十，十四是十四，四十是四十"
if pair == 2:
    t = "c（平舌） vs ch（翘舌）"
    ex = "从 cónɡ —— 虫 chónɡ"
    tip = "c 像刺猬嘘气，ch 像火车出发"
    rk = "从虫从虫冲出洞"
if pair == 3:
    t = "s（平舌） vs sh（翘舌）"
    ex = "三 sān —— 山 shān"
    tip = "s 轻轻送气，sh 舌尖翘起"
    rk = "三山四树十三只狮"
if pair == 4:
    t = "前鼻 n vs 后鼻 ng"
    ex = "分 fēn —— 风 fēnɡ"
    tip = "前鼻舌尖顶上齿龈收尾；后鼻舌根抬起走鼻腔"
    rk = "风吹门缝分外冷"
fill_rect(0, 130, 360, 30, "#dc2626")
write(t, 0, 130, "#fff", 12)
fill_rect(0, 82, 360, 36, "#f1f5f9")
write(ex, 0, 82, "#0f172a", 13)
fill_rect(0, 32, 360, 38, "#fef3c7")
write(tip, 0, 32, "#b45309", 11)
fill_rect(0, -20, 360, 38, "#eff6ff")
write("绕口令：" + rk, 0, -20, "#1d4ed8", 11)
write("口诀：舌尖抵下是平舌，舌尖上翘是翘舌", -20, -70, "#16a34a", 11)
write("鼻音收尾舌前顶，后鼻收尾舌根抬", -20, -95, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '平舌与翘舌', body: '【平舌音 z c s：舌尖抵住或接近下齿背】\n【翘舌音 zh ch sh r：舌尖卷起抵上腭前部】\n记法：z 像蜜蜂嗡嗡（平），zh 像知了叫（翘）。\n易混字：四/是、三/山、从/虫、擦/茶。' },
      { title: '前鼻与后鼻', body: '【前鼻韵尾 n：舌尖顶住上齿龈，气从鼻出（分、山、金）】\n【后鼻韵尾 ng：舌根抬起，鼻腔共鸣更长（风、上、星）】\n trick：捏住鼻子读"分"和"风"都变闷——因为都走鼻腔；区别在舌位收尾。\n记：前鼻短促，后鼻悠长（像钟声）。' },
      { title: '正音小妙招', body: '【夸张法：把翘舌读得特别卷，找准位置再恢复正常】\n【对比法：成对读 四-是、三-山，耳朵会越来越灵】\n【绕口令：由慢到快，读准比读快重要】\n方言区的同学坚持每天 5 分钟正音，一个月大变样。' },
    ], examples: [
      { q: '"老师"的 sh 是平舌还是翘舌？', steps: ['sh 属于翘舌音 zh ch sh r 组', '舌尖卷起抵上腭', '对比平舌 s（三）', '老师 shī 是翘舌'], tip: 'sh 组=翘' },
      { q: '区分 星 xīng 和 心 xīn 的韵尾。', steps: ['心 xīn：前鼻 n，短促收尾', '星 xīng：后鼻 ng，鼻音拉长', '试读：心~短 / 星~~长', '舌位：舌尖顶 vs 舌根抬'], tip: '长短+舌位双线索' },
    ], mistakes: ['把翘舌读成平舌（是→四）', '后鼻音丢掉 g（星→心）'] },
  exercises: [
    { q: '下列属于翘舌音的是？', options: ['sh', 's', 'z', 'c'], answer: 0, explain: 'zh ch sh r' },
    { q: '"四"的声母是？', options: ['s（平舌）', 'sh（翘舌）', 'c', 'ch'], answer: 0, explain: 'sì 平舌' },
    { q: '"风"的韵尾是？', options: ['ng（后鼻）', 'n（前鼻）', 'm', '无'], answer: 0, explain: 'fēng 后鼻' },
    { q: '平舌音的舌尖位置是？', options: ['抵下齿背', '卷向上腭', '顶住鼻尖', '悬空'], answer: 0, explain: '舌尖向前' },
    { q: '"三山"里有几个翘舌音？', options: ['1 个（山）', '2 个', '0 个', '3 个'], answer: 0, explain: '三=平舌' },
    { q: '后鼻音的舌位变化是？', options: ['舌根抬起', '舌尖顶上齿龈', '舌头不动', '卷舌尖'], answer: 0, explain: '舌根+鼻腔共鸣' },
  ],
});

L['chn-12'] = mk({ id: 'chn-12', island: 'cross', order: 357, title: '看图写话：三要素拼句器', emoji: '🖼️',
  subjectArea: '语文', gradeBand: 'primary', grade: 2, textbook: '统编版语文（二年级）',
  curriculum: { module: '写话', points: ['看图写话三要素', '把句子写完整', '加上修饰更生动'] },
  story: '看图写话的秘密就三个问题：谁？在哪？干什么？回答完这三个问题，一句完整的话就"拼"出来了。再加上颜色、心情这些"装饰品"，句子立刻活起来！',
  goals: ['掌握看图写话三要素', '会写完整通顺的句子', '会给句子加修饰词'],
  aiIntro: '🖼️ 拨动三要素滑块，看句子一层层长出来——拼句魔法机！',
  lab: { params: [{ name: 'el', label: '拼到第几层', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['el=1 只说 谁在哪干什么 为什么不够生动？', 'el=3 加了什么让句子活起来？', '你的看图写话漏过哪个要素？'],
    code: `# 拼句魔法机
el = 1   # 1三要素 2加动作细节 3加心情修饰

hide()
s1 = "小鸟 在树上 唱歌。"
s2 = "小鸟 在树上 欢快地唱歌。"
s3 = "一只黄色的小鸟 在高高的树上 欢快地唱歌，好像在开音乐会！"
cur = s1
lv = "第一层：谁 + 在哪 + 干什么（完整句）"
if el == 2:
    cur = s2
    lv = "第二层：加动作细节（欢快地）"
if el == 3:
    cur = s3
    lv = "第三层：加修饰和想象（一只黄色的、好像…）"
fill_rect(0, 120, 360, 34, "#16a34a")
write("第" + el + "层句子", 0, 120, "#fff", 13)
fill_rect(0, 60, 360, 56, "#f1f5f9")
write(cur, 0, 60, "#0f172a", 11)
fill_rect(0, 8, 360, 36, "#fef3c7")
write(lv, 0, 8, "#b45309", 11)
i = 1
while i < 4:
    x = -110 + (i - 1) * 110
    if i <= el:
        fill_rect(x, -55, 90, 44, "#16a34a")
        write("层" + i + " ✓", x, -55, "#fff", 12)
    if i > el:
        fill_rect(x, -55, 90, 44, "#e2e8f0")
        write("层" + i, x, -55, "#64748b", 11)
    i = i + 1
write("检查口诀：有谁吗？在哪吗？干什么吗？", -20, -118, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '三要素', body: '【谁（人物/动物）+ 在哪（地点）+ 干什么（事件）】\n缺一个要素，句子就"残废"：只有"在唱歌"——谁唱？在哪？\n先指着图说三句话，再连成一句。' },
      { title: '把句子写长写活', body: '【加修饰：什么样的（颜色/大小）+ 怎样地（动作情态）】\n【加想象：好像…、可能…、真想…】\n小鸟唱歌 → 一只黄色的小鸟在树上欢快地唱歌，好像在开音乐会。\n注意：加而不堆，一句最多两三个修饰就够。' },
      { title: '写话四步', body: '【①看：整体看图上有谁、什么时间、什么地方】\n【②说：口头把三要素连成句】【③写：一句一句写，注意标点】【④查：读一遍，查漏字错字】\n多幅图：按顺序每幅写一两句，再用"接着""然后"连起来。' },
    ], examples: [
      { q: '图上：小男孩在公园放风筝。用三要素写一句话。', steps: ['谁：小男孩', '在哪：公园里', '干什么：放风筝', '连句：小男孩在公园里放风筝。'], tip: '先说后写' },
      { q: '把"小男孩在公园里放风筝"写生动。', steps: ['加修饰：兴奋地、高高飘上天空的风筝', '加想象：好像要飞到白云里去', '组合：小男孩在公园里兴奋地放风筝，风筝越飞越高，好像要钻进白云里'], tip: '修饰一两处就好' },
    ], mistakes: ['只写"干什么"漏掉"谁在哪"（缺要素）', '修饰词堆太多读起来累'] },
  exercises: [
    { q: '看图写话三要素是？', options: ['谁·在哪·干什么', '时间地点人物', '起因经过结果', '颜色形状大小'], answer: 0, explain: '先保完整' },
    { q: '"在草地上跑"缺了哪个要素？', options: ['谁', '在哪', '干什么', '不缺'], answer: 0, explain: '没说主语' },
    { q: '让句子生动的办法是？', options: ['加合适修饰和想象', '多写错字', '句子越长越好', '抄课文'], answer: 0, explain: '修饰要恰当' },
    { q: '多幅图写话要按？', options: ['顺序一幅幅写', '随便挑', '只写最后一幅', '倒着写'], answer: 0, explain: '顺序+连接词' },
    { q: '写完后应该？', options: ['读一遍查漏字错字', '立刻交', '撕掉重写', '不检查'], answer: 0, explain: '四步之查' },
    { q: '"好像在开音乐会"属于？', options: ['想象', '三要素', '标点', '修辞错误'], answer: 0, explain: '让画面活起来' },
  ],
});

L['chn-13'] = mk({ id: 'chn-13', island: 'cross', order: 358, title: '词语百宝箱：量词与近反义', emoji: '🧰',
  subjectArea: '语文', gradeBand: 'primary', grade: 3, textbook: '统编版语文（三年级）',
  curriculum: { module: '词语积累', points: ['常用量词搭配', '近义词辨析', '反义词对对碰'] },
  story: '一只鸟、一匹马、一头牛、一条鱼——为什么马用"匹"牛用"头"？量词是汉语的乐高积木，搭错了就闹笑话。再加上近义词、反义词两把刷子，你的词语百宝箱就装满了！',
  goals: ['掌握常见量词搭配', '会辨析常用近义词', '快速说出反义词'],
  aiIntro: '🧰 拨动百宝箱抽屉，量词近义反义词换着学——词语百宝箱！',
  lab: { params: [{ name: 'box', label: '抽屉', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['box=1 为什么鱼用条马用匹？', '近义词"爱护·爱惜"怎么区分？', '反义词能一对多吗？'],
    code: `# 词语百宝箱
box = 1   # 1量词 2近义词 3反义词

hide()
t = "抽屉一：量词搭配"
a1 = "一匹马 · 一头牛 · 一只鸟 · 一条鱼"
a2 = "一朵花 · 一座山 · 一辆汽车 · 一把伞"
note = "口诀：大兽用头小用只，长物用条马用匹"
if box == 2:
    t = "抽屉二：近义词辨析"
    a1 = "爱护（对象是人或公物）：爱护花草"
    a2 = "爱惜（对象是时间粮食等）：爱惜粮食"
    note = "辨析法：看对象 + 看搭配 + 造句试"
if box == 3:
    t = "抽屉三：反义词对对碰"
    a1 = "高—矮 · 大—小 · 黑—白 · 冷—热"
    a2 = "认真—马虎 · 成功—失败 · 谦虚—骄傲"
    note = "反义词词性要相同：高（形）对矮（形）"
fill_rect(0, 130, 360, 30, "#7c3aed")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 78, 360, 38, "#f1f5f9")
write(a1, 0, 78, "#0f172a", 11)
fill_rect(0, 26, 360, 38, "#fef3c7")
write(a2, 0, 26, "#b45309", 11)
fill_rect(0, -26, 360, 36, "#eff6ff")
write(note, 0, -26, "#1d4ed8", 11)
write("量词错搭闹笑话：一匹牛？一头马？", -20, -78, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '量词搭配', body: '【动物：一只鸟/一条鱼/一头牛/一匹马】【植物：一朵花/一棵树】\n【建筑：一座山/一栋楼】【器物：一把伞/一张纸/一本书/一支笔】\n马用"匹"是古语留传（布帛也用匹）；牛体大头大用"头"。量词是约定俗成，多读多记就顺口。' },
      { title: '近义词辨析', body: '【三步辨析：①看对象 ②看搭配 ③造句试】\n爱护（花草/公物/学生）vs 爱惜（粮食/时间）。\n忽然（快、意外）vs 突然（程度更重、可用"很"）。\n近义词不是完全等价——差别就在这些小地方。' },
      { title: '反义词', body: '【词性必须相同：形容词对形容词（高—矮），动词对动词（爱—恨）】\n有的词有多个反义词：老—幼/少/新（看语境选）。\n找反义词先想这个词的核心意思，再想"反过来"。' },
    ], examples: [
      { q: '选择：一（ ）山。', steps: ['山是大型建筑/地物', '量词用"座"', '一座山'], tip: '大地物用座' },
      { q: '辨析：安静 和 宁静。', steps: ['都表示没有声音', '安静：多指环境暂时无声（教室很安静）', '宁静：程度更深，常指心境或夜晚（宁静的夜晚）', '一个说场合，一个说氛围心境'], tip: '看常用搭配' },
    ], mistakes: ['量词张冠李戴（一匹牛）', '近义词当完全同义词乱互换（语感不合）'] },
  exercises: [
    { q: '一（ ）马，选？', options: ['匹', '头', '只', '条'], answer: 0, explain: '马用匹' },
    { q: '一（ ）伞，选？', options: ['把', '张', '支', '块'], answer: 0, explain: '把伞' },
    { q: '爱惜 的正确搭配是？', options: ['爱惜粮食', '爱惜学生', '爱护粮食', '爱护时间'], answer: 0, explain: '对象是物' },
    { q: '"认真"的反义词是？', options: ['马虎', '失败', '谦虚', '安静'], answer: 0, explain: '态度相反' },
    { q: '反义词必须？', options: ['词性相同', '字数不同', '声调相同', '都是名词'], answer: 0, explain: '形对形动对动' },
    { q: '"忽然"和"突然"相比？', options: ['突然程度更重', '忽然更重', '完全相同', '忽然是错的'], answer: 0, explain: '很突然√很忽然×' },
  ],
});

L['chn-14'] = mk({ id: 'chn-14', island: 'cross', order: 359, title: '古诗四季：诗里的春夏秋冬', emoji: '🌸',
  subjectArea: '语文', gradeBand: 'primary', grade: 3, textbook: '统编版语文（三年级）',
  curriculum: { module: '古诗积累', points: ['春晓与春天意象', '山行与秋天意象', '江雪与冬天意象'] },
  story: '春天有"处处闻啼鸟"，秋天有"霜叶红于二月花"，冬天有"独钓寒江雪"——古人把四季装进了诗里。跟着诗人去春游、赏秋、看雪，一年四季都是诗！',
  goals: ['背诵四季代表古诗', '理解诗中的季节意象', '体会诗人的情感'],
  aiIntro: '🌸 拨动季节转盘，诗和画面一起换——古诗四季游！',
  lab: { params: [{ name: 'season', label: '季节', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['season=2 小荷才露尖尖角写的什么？', '霜叶为什么红于二月花？', '独钓寒江雪的老翁孤单吗？'],
    code: `# 古诗四季游
season = 1   # 1春 2夏 3秋 4冬

hide()
poem = "春晓（孟浩然）"
l1 = "春眠不觉晓，处处闻啼鸟。"
l2 = "夜来风雨声，花落知多少。"
key = "意象：啼鸟·落花 → 春的生机与惜春"
bg = "#fecdd3"
if season == 2:
    poem = "小池（杨万里）"
    l1 = "小荷才露尖尖角，早有蜻蜓立上头。"
    l2 = "泉眼无声惜细流，树阴照水爱晴柔。"
    key = "意象：小荷·蜻蜓 → 夏的灵动小巧"
    bg = "#bbf7d0"
if season == 3:
    poem = "山行（杜牧）"
    l1 = "停车坐爱枫林晚，霜叶红于二月花。"
    l2 = "远上寒山石径斜，白云生处有人家。"
    key = "意象：霜叶·寒山 → 秋的绚烂深沉"
    bg = "#fed7aa"
if season == 4:
    poem = "江雪（柳宗元）"
    l1 = "孤舟蓑笠翁，独钓寒江雪。"
    l2 = "千山鸟飞绝，万径人踪灭。"
    key = "意象：孤舟·江雪 → 冬的孤高坚守"
    bg = "#e0e7ff"
fill_rect(0, 140, 360, 34, "#7c3aed")
write(poem, 0, 140, "#fff", 13)
fill_rect(0, 90, 360, 38, bg)
write(l1, 0, 90, "#0f172a", 12)
fill_rect(0, 42, 360, 38, bg)
write(l2, 0, 42, "#0f172a", 12)
fill_rect(0, -8, 360, 40, "#f1f5f9")
write(key, 0, -8, "#0f172a", 11)
if season == 1:
    write("🌸", -80, -70, "#db2777", 18)
    write("🐦", 0, -60, "#0f172a", 16)
if season == 2:
    write("🪷", -60, -70, "#16a34a", 18)
    write("🦟", 30, -60, "#0f172a", 14)
if season == 3:
    write("🍁", -70, -70, "#dc2626", 18)
    write("🍁", 0, -60, "#ea580c", 14)
if season == 4:
    write("❄️", -70, -70, "#0f172a", 18)
    write("⛄", 30, -60, "#0f172a", 16)
write("读诗三步：读通 → 画面 → 想情感", 0, -118, "#0369a1", 11)
`,
  },
  teach: { sections: [
      { title: '春：生机与惜春', body: '【春晓：春眠不觉晓，处处闻啼鸟】\n鸟啼花落——春天的热闹与一夜风雨后的惋惜。\n其他春诗：咏柳（不知细叶谁裁出）——把春风比作剪刀。' },
      { title: '夏：灵动的小景', body: '【小池：小荷才露尖尖角，早有蜻蜓立上头】\n泉眼、树阴、小荷、蜻蜓——夏天的清新小品。\n"才露"和"早有"一先一后，写活了万物争先的夏天。' },
      { title: '秋冬：绚烂与孤高', body: '【山行：停车坐爱枫林晚，霜叶红于二月花】\n经霜的枫叶比春花更红——秋天的绚烂胜过春天。\n【江雪：孤舟蓑笠翁，独钓寒江雪】\n万物绝迹的大雪里独自垂钓——写景更写人的孤傲坚守。' },
    ], examples: [
      { q: '霜叶红于二月花 为什么成了千古名句？', steps: ['对比：秋叶 vs 春花', '秋叶经霜更红，胜过春天', '打破悲秋的老调', '赞颂了深秋的生命力'], tip: '对比出诗意' },
      { q: '江雪 前两句写"绝"和"灭"，有什么作用？', steps: ['鸟飞绝、人踪灭=万籁俱寂', '越空旷越显孤舟', '大雪封江只有老翁垂钓', '衬托出坚韧孤高的品格'], tip: '以无衬有' },
    ], mistakes: ['把"坐爱"理解为坐下爱（坐=因为）', '背诗只背字不看画面和情感'] },
  exercises: [
    { q: '春眠不觉晓的下一句是？', options: ['处处闻啼鸟', '花落知多少', '夜来风雨声', '春眠不觉晓'], answer: 0, explain: '对句' },
    { q: '小荷才露尖尖角 写的是哪个季节？', options: ['夏', '春', '秋', '冬'], answer: 0, explain: '初夏小荷' },
    { q: '霜叶红于二月花 出自？', options: ['山行', '春晓', '江雪', '小池'], answer: 0, explain: '杜牧' },
    { q: '山行 中 坐 的意思是？', options: ['因为', '坐下', '乘坐', '座位'], answer: 0, explain: '停车坐爱=因爱' },
    { q: '独钓寒江雪 塑造的老翁形象是？', options: ['孤傲坚守', '贫穷可怜', '悠闲度假', '害怕寒冷'], answer: 0, explain: '品格象征' },
    { q: '读诗的正确顺序是？', options: ['读通→画面→情感', '先背再懂', '只看翻译', '只认字'], answer: 0, explain: '三步读诗法' },
  ],
});

/* ================= 英语·小学 +3 ================= */

L['eng-20'] = mk({ id: 'eng-20', island: 'cross', order: 360, title: '自然拼读：元音的发音密码', emoji: '🔐',
  subjectArea: '英语', gradeBand: 'primary', grade: 3, textbook: '人教PEP英语三年级上册',
  curriculum: { module: '语音·自然拼读', points: ['短元音 a e i o u', '辅音+元音拼读', '见词能读的规律'] },
  story: 'cat 里的 a、bed 里的 e、pig 里的 i——五个短元音是英语单词的"拼音密码"。学会了它们，见到新单词不用查字典，张口就能读 70% 的词！',
  goals: ['掌握五个短元音的发音', '会拼读辅音+元音组合', '能读出简单 CVC 单词'],
  aiIntro: '🔐 拨动元音密码盘，看一个字母怎么点亮一串单词——自然拼读解码器！',
  lab: { params: [{ name: 'v', label: '短元音', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['v=1 的 a 在 cat/map 里发音一样吗？', '五个短元音里哪个最难读？', '学会拼读后可以怎么记单词？'],
    code: `# 自然拼读解码器
v = 1   # 1 a 2 e 3 i 4 o 5 u

hide()
letter = "a"
sound = "/æ/ 嘴巴张大"
w1 = "c-a-t  cat  猫"
w2 = "m-a-p  map  地图"
w3 = "b-a-g  bag  书包"
if v == 2:
    letter = "e"
    sound = "/e/ 嘴角咧开"
    w1 = "b-e-d  bed  床"
    w2 = "p-e-n  pen  钢笔"
    w3 = "r-e-d  red  红色"
if v == 3:
    letter = "i"
    sound = "/ɪ/ 短促有力"
    w1 = "p-i-g  pig  猪"
    w2 = "s-i-t  sit  坐"
    w3 = "b-i-g  big  大的"
if v == 4:
    letter = "o"
    sound = "/ɒ/ 嘴唇圆圆"
    w1 = "d-o-g  dog  狗"
    w2 = "h-o-t  hot  热的"
    w3 = "b-o-x  box  盒子"
if v == 5:
    letter = "u"
    sound = "/ʌ/ 短促开口"
    w1 = "c-u-p  cup  杯子"
    w2 = "b-u-s  bus  公交车"
    w3 = "s-u-n  sun  太阳"
fill_rect(-130, 130, 60, 60, "#1d4ed8")
write(letter, -130, 130, "#fff", 28)
fill_rect(40, 130, 240, 60, "#f1f5f9")
write("发音：" + sound, 40, 130, "#0f172a", 13)
fill_rect(0, 70, 360, 34, "#fef3c7")
write(w1, 0, 70, "#b45309", 13)
fill_rect(0, 22, 360, 34, "#f1f5f9")
write(w2, 0, 22, "#0f172a", 13)
fill_rect(0, -26, 360, 34, "#eff6ff")
write(w3, 0, -26, "#1d4ed8", 13)
write("拼读口诀：辅音快，元音清，一口气连成音", -20, -78, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '五个短元音', body: '【a /æ/：cat map apple（嘴巴张大）】\n【e /e/：bed pen red（嘴角咧开）】\n【i /ɪ/：pig sit big（短促）】【o /ɒ/：dog hot box（圆唇）】【u /ʌ/：cup bus sun（短开口）】\n每个元音配一个"锚词"，想不起发音就读锚词。' },
      { title: 'CVC 拼读', body: '【辅音+元音+辅音（C-V-C）是拼读的最小单元】\nc-a-t → /k/+/æ/+/t/ → cat。\n拼法：先读元音，再把前后辅音"夹"上去，一气呵成。\n换首换尾：cat→bat→hat→map→mad——一族一族地记。' },
      { title: '见词能读', body: '【掌握 26 个字母基础音+五个短元音，约 70% 的简单单词能直接读出】\n读对了再对照音频验证——耳朵是最后的裁判。\n遇到读不出的词（不规则发音）再单独记，不要怀疑拼读法。' },
    ], examples: [
      { q: '读出单词 map。', steps: ['拆：m-a-p', 'm/m/ + a/æ/ + p/p/', '连读：/mæp/ map', '对照锚词 cat 检查 a 的音'], tip: '先拆后连' },
      { q: 'cat 换首字母能变出哪些词？', steps: ['换 c→b：bat 蝙蝠', '换 c→h：hat 帽子', '换 c→f：fat 胖的', '一族词一起记效率翻倍'], tip: '词族记忆法' },
    ], mistakes: ['用汉语拼音读英语字母（a 读"啊"）', '元音拖太长（短元音要短促）'] },
  exercises: [
    { q: 'cat 中 a 的发音是？', options: ['/æ/', '/e/', '/ɪ/', '/ʌ/'], answer: 0, explain: '张大嘴' },
    { q: '下列与 pen 的 e 发音相同的是？', options: ['bed', 'pig', 'dog', 'cup'], answer: 0, explain: '/e/' },
    { q: 'p-i-g 拼读结果是？', options: ['pig', 'big', 'pin', 'pit'], answer: 0, explain: '/pɪg/' },
    { q: '短元音 o 的口型是？', options: ['圆唇', '张大嘴', '咧嘴', '闭嘴'], answer: 0, explain: '/ɒ/' },
    { q: 'CVC 指的是？', options: ['辅音+元音+辅音', '三个辅音', '三个元音', '词组'], answer: 0, explain: '拼读最小单元' },
    { q: 'bus 中 u 的发音像？', options: ['/ʌ/ 短开口', '/æ/ 大开口', '/e/ 咧嘴', '/ɒ/ 圆唇'], answer: 0, explain: '短促开口' },
  ],
});

L['eng-21'] = mk({ id: 'eng-21', island: 'cross', order: 361, title: 'There be 句型：教室大发现', emoji: '🏫',
  subjectArea: '英语', gradeBand: 'primary', grade: 4, textbook: '人教PEP英语四年级上册',
  curriculum: { module: '句型·There be', points: ['There is 单数', 'There are 复数', '就近原则'] },
  story: '介绍你的教室怎么说？There is a book on the desk.（桌上有一本书）There are two pens.（有两支钢笔）——is 还是 are，看它后面跟的名词：一个 is，多个 are！',
  goals: ['掌握 There is/are 的用法', '会描述教室物品', '理解就近原则'],
  aiIntro: '🏫 调节教室物品数量，看 is 和 are 怎么切换——There be 变形器！',
  lab: { params: [{ name: 'n', label: '钢笔数量', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['n=1 和 n=2 句子哪里变了？', 'There is 后能跟复数吗？', 'There is a book and two pens 对吗？'],
    code: `# There be 变形器
n = 1   # 钢笔数量

hide()
sent = "There is a pen on the desk."
form = "单数 → There is + a/an + 名词"
if n > 1:
    sent = "There are " + n + " pens on the desk."
    form = "复数 → There are + 数字 + 名词复数"
fill_rect(0, 120, 360, 44, "#1d4ed8")
write(sent, 0, 120, "#fff", 13)
fill_rect(0, 68, 360, 36, "#f1f5f9")
write(form, 0, 68, "#0f172a", 11)
i = 0
while i < n:
    x = -140 + i * 80
    fill_rect(x, 0, 60, 16, "#dc2626")
    fill_rect(x + 50, 8, 14, 6, "#0f172a")
    i = i + 1
fill_rect(0, -50, 360, 30, "#94a3b8")
write("desk", 0, -50, "#fff", 11)
write("就近原则：There is a book and two pens.（看最近的词）", -10, -95, "#dc2626", 10)
write("否定在 be 后加 not：There is not a pen.", -10, -120, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: 'There is / There are', body: '【There is + 单数/不可数：There is a book. / There is some water.】\n【There are + 复数：There are two pens.】\nThere be 表示"某处有某物"，注意和 have（某人拥有）区分。\n口诀：一个 is，两个 are，is/are 看后头。' },
      { title: '描述教室', body: '【This is my classroom. There are many desks and chairs.】\n【There is a blackboard on the wall. There are two lights.】\n方位介词搭档：on the desk / in the bag / under the chair / near the door。\n先说大件（黑板、讲台），再说小件（书、笔），条理清晰。' },
      { title: '就近原则', body: '【be 动词和它最近的名词保持一致】\nThere is a book and two pens on the desk.（最近的是 a book→is）\nThere are two pens and a book on the desk.（最近的是 two pens→are）\n一般疑问句：Is there…? / Are there…? 回答 Yes, there is/are. No, there isn\'t/aren\'t.' },
    ], examples: [
      { q: '用 There be 描述：桌上有三支铅笔。', steps: ['pencils 复数', '用 There are', 'There are three pencils on the desk.'], tip: '先数数再选词' },
      { q: 'There ___ a book and two pens on the desk. 填？', steps: ['找最近的名词：a book 单数', '就近原则用 is', '答案：is'], tip: '就近看第一个' },
    ], mistakes: ['There is two books（数错 be 动词）', 'There be 和 have 混用（There has ×）'] },
  exercises: [
    { q: 'There ___ a cat under the tree.', options: ['is', 'are', 'am', 'be'], answer: 0, explain: 'a cat 单数' },
    { q: 'There ___ four lights in the classroom.', options: ['are', 'is', 'am', 'was'], answer: 0, explain: 'four 复数' },
    { q: 'There is some ___ in the bottle.', options: ['water', 'books', 'pens', 'cats'], answer: 0, explain: '不可数名词' },
    { q: 'There is a book and two pens 中 be 由谁决定？', options: ['最近的 a book', 'two pens', '随便', '句子主语'], answer: 0, explain: '就近原则' },
    { q: '一般疑问句：桌上有书吗？', options: ['Is there a book on the desk?', 'There is a book?', 'Has a book?', 'Is a book there desk?'], answer: 0, explain: 'Is there…' },
    { q: 'There be 表示？', options: ['某处有某物', '某人有某物', '正在做', '过去有'], answer: 0, explain: 'have 才是拥有' },
  ],
});

L['eng-22'] = mk({ id: 'eng-22', island: 'cross', order: 362, title: '动物与方位：on·in·under', emoji: '🐾',
  subjectArea: '英语', gradeBand: 'primary', grade: 3, textbook: '人教PEP英语三年级下册',
  curriculum: { module: '词汇·方位介词', points: ['常见动物单词', '方位介词 on/in/under', 'Where is 句型'] },
  story: 'Where is the cat? 猫在盒子上？盒子里？盒子下？on、in、under 三个小词说清楚。学会问 Where is…?，你就能玩"找动物"的英语游戏了！',
  goals: ['掌握 8 个动物单词', '会用地on/in/under', '会用 Where is 提问'],
  aiIntro: '🐾 拨动方位选择器，看小猫钻进钻出盒子——方位介词演示盒！',
  lab: { params: [{ name: 'pos', label: '小猫位置', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['pos=1 的句子怎么说？', 'under 和 on 的区别？', 'Where is the bird? 怎么回答？'],
    code: `# 方位介词演示盒
pos = 1   # 1 on 2 in 3 under

hide()
prep = "on"
sent = "The cat is on the box."
cn = "猫在盒子上面（表面接触）"
py = 55
inside = 0
if pos == 2:
    prep = "in"
    sent = "The cat is in the box."
    cn = "猫在盒子里面（被包围）"
    py = 0
    inside = 1
if pos == 3:
    prep = "under"
    sent = "The cat is under the box."
    cn = "猫在盒子下面（下方）"
    py = -62
fill_rect(0, 120, 360, 32, "#1d4ed8")
write(sent, 0, 120, "#fff", 14)
if inside == 1:
    fill_rect(0, 20, 130, 90, "#f59e0b")
    fill_rect(0, -20, 130, 16, "#b45309")
    write("🐱", 0, py, "#0f172a", 24)
if inside == 0:
    write("🐱", 0, py, "#0f172a", 24)
    fill_rect(0, -20, 130, 50, "#f59e0b")
    fill_rect(0, 5, 130, 14, "#b45309")
fill_rect(0, 78, 360, 30, "#f1f5f9")
write(cn + "（介词：" + prep + "）", 0, 78, "#0f172a", 11)
write("问：Where is the cat?   答：It is " + prep + " the box.", -10, -80, "#dc2626", 11)
write("动物单词：cat dog bird duck pig bear panda tiger", 0, -108, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '动物单词', body: '【cat 猫 · dog 狗 · bird 鸟 · duck 鸭 · pig 猪 · bear 熊 · panda 熊猫 · tiger 老虎】\n复数加 s：cats, dogs, birds（注意 duck→ducks）。\n句型：I like cats. They are cute.' },
      { title: '方位三兄弟', body: '【on：在…上面（表面接触）——on the box】\n【in：在…里面（被包围）——in the box】\n【under：在…下面——under the box】\n动作演示：把手 on 桌上、in 口袋、under 桌子——身体记忆最牢。' },
      { title: 'Where is 句型', body: '【问：Where is the cat? 单数 / Where are the cats? 复数】\n【答：It is on the box. / They are under the box.】\n问答要配套：is 问 it 答，are 问 they 答。\n拓展：near（旁边）behind（后面）——捉迷藏英语全靠它。' },
    ], examples: [
      { q: '猫在盒子里，怎么说？', steps: ['选择介词：in（里面）', '主语 the cat 单数用 is', 'The cat is in the box.'], tip: '先定介词再造句' },
      { q: 'Where are the birds? 怎么回答？', steps: ['are 问→they 答', '假设鸟在树上', 'They are in the tree.', '注意复数 are/they 配套'], tip: '问答配套' },
    ], mistakes: ['on 和 in 混用（树上鸟用 in the tree）', 'Where is the cats（单复数不一致）'] },
  exercises: [
    { q: 'The cat is ___ the box.（在盒子上面）', options: ['on', 'in', 'under', 'at'], answer: 0, explain: '表面接触' },
    { q: '在盒子下面用？', options: ['under', 'on', 'in', 'up'], answer: 0, explain: 'under' },
    { q: '熊猫的英语是？', options: ['panda', 'tiger', 'bear', 'duck'], answer: 0, explain: '国宝' },
    { q: 'Where ___ the dog? It is under the chair.', options: ['is', 'are', 'am', 'be'], answer: 0, explain: '单数 dog' },
    { q: 'They are ___ the tree.（鸟在树上）', options: ['in', 'on', 'under', 'at'], answer: 0, explain: '长在树里用 in' },
    { q: 'I like ___.（熊猫复数）', options: ['pandas', 'panda', 'pandaes', 'pandies'], answer: 0, explain: '直接加 s' },
  ],
});

/* ================= 科学·小学 +3 ================= */

L['sci-16'] = mk({ id: 'sci-16', island: 'cross', order: 363, title: '溶解与过滤：水的魔法', emoji: '🥛',
  subjectArea: '科学', gradeBand: 'primary', grade: 4, textbook: '冀人版科学（小学）',
  curriculum: { module: '物质变化', points: ['溶解的现象', '哪些物质能溶解', '过滤分离混合物'] },
  story: '一勺盐放进水里"消失"了——它没有魔法，只是变成了看不见的微粒均匀躲在水里。但沙子怎么搅也不化，面粉搅出浑水……溶解与过滤，水的两个小魔法。',
  goals: ['理解溶解的本质', '知道常见物质的溶解性', '学会用过滤分离不溶物'],
  aiIntro: '🥛 把不同东西倒进水里，看谁能"隐身"——溶解观察杯！',
  lab: { params: [{ name: 'sub', label: '放入物质', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['sub=1 盐去哪了？还能变回来吗？', 'sub=2 沙子为什么不溶解？', '过滤能把盐水里的盐滤出来吗？'],
    code: `# 溶解观察杯
sub = 1   # 1盐 2沙子 3面粉 4食用油

hide()
name = "食盐"
res = "溶解 ✓ 变成看不见的微粒"
extra = "水变咸了——盐还在，只是分散了"
col = "#bae6fd"
if sub == 2:
    name = "沙子"
    res = "不溶解 ✗ 沉在杯底"
    extra = "过滤能把沙子和水分开"
    col = "#e2e8f0"
if sub == 3:
    name = "面粉"
    res = "不溶解 ✗ 水变浑浊悬浮"
    extra = "静置后面粉慢慢沉底，也可过滤"
    col = "#fef9c3"
if sub == 4:
    name = "食用油"
    res = "不溶解 ✗ 漂在水面上"
    extra = "油比水轻，分层浮着"
    col = "#fed7aa"
fill_rect(0, 130, 360, 30, "#1d4ed8")
write("放入：" + name, 0, 130, "#fff", 13)
pen_color("#94a3b8")
pen_down()
go_to(-60, 100)
go_to(-60, -60)
go_to(60, -60)
go_to(60, 100)
pen_up()
fill_rect(0, 30, 110, 170, col)
if sub == 2:
    fill_rect(0, -50, 100, 14, "#fbbf24")
if sub == 3:
    i = 0
    while i < 5:
        write("·", -40 + i * 20, 40 - i * 18, "#a16207", 12)
        i = i + 1
if sub == 4:
    fill_rect(0, 95, 110, 18, "#fdba74")
fill_rect(0, -95, 360, 34, "#f1f5f9")
write(res, 0, -95, "#0f172a", 11)
fill_rect(0, -135, 360, 30, "#fef3c7")
write(extra, 0, -135, "#b45309", 10)
`,
  },
  teach: { sections: [
      { title: '溶解是什么', body: '【物质以极小微粒均匀分散在水里，看不见但还在】\n证据：盐水晒干后盐回来了（蒸发结晶）。\n搅拌和升温能加快溶解，但不能让不溶的东西变可溶。' },
      { title: '谁能溶解', body: '【能溶：食盐、白糖、小苏打、味精】\n【不溶：沙子、石子、面粉（悬浮变浑）、食用油（分层漂浮）】\n判断方法：看水是否透明均匀——浑浊、分层、沉底都是不溶。' },
      { title: '过滤', body: '【过滤：让液体通过滤纸，把不溶性固体拦下来】\n能分离：沙子和水、面粉和水。\n不能分离：盐和水（盐已溶解"穿过"滤纸）——那要蒸发结晶。\n仪器口诀：一贴二低三靠（滤纸贴漏斗、液面低于纸边、杯口靠玻璃棒）。' },
    ], examples: [
      { q: '怎样把混在沙子里的盐提出来？', steps: ['加水搅拌——盐溶解，沙子不溶', '过滤——沙子留在滤纸上', '滤液（盐水）蒸发——盐结晶析出', '溶解+过滤+蒸发三步走'], tip: '利用溶解性差异' },
      { q: '糖水放久了糖会沉底吗？', steps: ['糖已溶解成微粒', '微粒均匀分布不会沉降', '静置不会分层', '只有蒸发才会析出'], tip: '溶解=均匀稳定' },
    ], mistakes: ['认为溶解就是"消失了"（质量不变）', '想用过滤分离盐水（需蒸发）'] },
  exercises: [
    { q: '下列能溶解在水里的是？', options: ['食盐', '沙子', '石子', '菜油'], answer: 0, explain: '成微粒分布' },
    { q: '过滤能把盐从盐水里分离出来吗？', options: ['不能，盐穿过滤纸', '能', '有时能', '看心情'], answer: 0, explain: '需蒸发结晶' },
    { q: '油倒进水里会？', options: ['漂在水面分层', '溶解', '沉底', '消失'], answer: 0, explain: '油轻不互溶' },
    { q: '加快溶解的办法是？', options: ['搅拌', '静置', '冰冻', '加沙子'], answer: 0, explain: '升温也行' },
    { q: '盐溶解后水变咸说明？', options: ['盐还在水里', '盐消失了', '水变质了', '变新物质'], answer: 0, explain: '微粒均匀分布' },
    { q: '面粉倒入水里会？', options: ['水变浑浊', '完全溶解', '浮在水面', '立刻消失'], answer: 0, explain: '悬浮不溶' },
  ],
});

L['sci-17'] = mk({ id: 'sci-17', island: 'cross', order: 364, title: '植物的身体：根茎叶各显神通', emoji: '🌿',
  subjectArea: '科学', gradeBand: 'primary', grade: 3, textbook: '冀人版科学（小学）',
  curriculum: { module: '生命世界·植物', points: ['根固定吸收', '茎运输支撑', '叶光合蒸腾'] },
  story: '一棵植物就是一家公司：根是采购部（吸水吸肥）、茎是物流部（运输队）、叶是生产部（光合工厂）。三个部门分工合作，植物才能长高长大。',
  goals: ['知道根茎叶各自的功能', '理解导管运输的方向', '了解光合作用与蒸腾'],
  aiIntro: '🌿 拨动器官选择器，看植物公司的部门分工——植物身体导航图！',
  lab: { params: [{ name: 'org', label: '器官', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['org=2 水在茎里往哪个方向流？', '叶子为什么是绿色的？', '把大树的根挖掉会怎样？'],
    code: `# 植物身体导航图
org = 1   # 1根 2茎 3叶

hide()
t = "根：采购部"
f = "固定植物 + 吸收水分和养分（根毛是吸管）"
ex = "大树根深扎地下比树冠还宽"
if org == 2:
    t = "茎：物流部"
    f = "支撑身体 + 上下运输（导管运水 upward）"
    ex = "插在红墨水里的花，茎变红花瓣也变红"
if org == 3:
    t = "叶：生产部"
    f = "光合作用制造养料 + 蒸腾拉水上升"
    ex = "塑料袋套叶子上，袋壁出现水珠=蒸腾"
fill_rect(0, 130, 360, 30, "#16a34a")
write(t, 0, 130, "#fff", 14)
fill_rect(0, 78, 360, 40, "#f0fdf4")
write(f, 0, 78, "#166534", 11)
pen_color("#166534")
pen_down()
go_to(0, -80)
go_to(0, 20)
pen_up()
circle(0, 45, 26, "#22c55e")
circle(-28, 28, 18, "#16a34a")
circle(28, 28, 18, "#16a34a")
pen_color("#92400e")
pen_down()
go_to(-8, -80)
go_to(-14, -140)
pen_up()
pen_down()
go_to(8, -80)
go_to(14, -140)
pen_up()
if org == 1:
    fill_rect(0, -120, 200, 30, "#fef3c7")
    write("★根在工作：吸水吸肥", 0, -120, "#b45309", 11)
if org == 2:
    fill_rect(0, -120, 200, 30, "#fef3c7")
    write("★茎在运输：根→叶单向送水", 0, -120, "#b45309", 11)
if org == 3:
    fill_rect(0, -120, 200, 30, "#fef3c7")
    write("★叶在生产：阳光+水+CO₂→养料+O₂", 0, -120, "#b45309", 11)
write("实验：" + ex, 0, 100, "#0f172a", 10)
`,
  },
  teach: { sections: [
      { title: '根：采购部', body: '【固定植物体 + 从土壤吸收水分和无机盐】\n根毛大大增加吸收面积——像千万根小吸管。\n直根系（大豆，主根明显）vs 须根系（小麦，一团胡须）。\n储存根：萝卜、红薯把养料存进根里。' },
      { title: '茎：物流部', body: '【支撑植物 + 由导管把根吸收的水运向叶（单向）】\n红墨水实验：茎横切面出现红点=导管被染红。\n筛管把叶子制造的养料送到全身（另一条路）。\n草质茎柔软（向日葵），木质茎坚硬（杨树）。' },
      { title: '叶：生产部', body: '【光合作用：阳光+水+二氧化碳 → 养料+氧气（叶绿体是车间）】\n叶子绿色因为含叶绿素。\n【蒸腾作用：叶把水以水汽形式"呼出"，拉动的力量帮助水上升】\n蒸腾还能给植物降温——大树的天然空调。' },
    ], examples: [
      { q: '为什么说根是采购部？', steps: ['采购=吸收原材料', '根吸收土壤里的水分和无机盐', '根毛扩大吸收面积', '没有根植物会倒+饿死渴死'], tip: '比喻记功能' },
      { q: '设计实验证明茎能运输水。', steps: ['把白色花插入红墨水', '放置几小时观察', '花瓣变红说明红水沿茎上升', '结论：茎的导管由下向上运水'], tip: '染色示踪法' },
    ], mistakes: ['认为植物喝水靠叶子（主要靠根毛）', '认为蒸腾是浪费（是拉水动力+降温）'] },
  exercises: [
    { q: '吸收水分和无机盐的主要器官是？', options: ['根', '茎', '叶', '花'], answer: 0, explain: '根毛吸管' },
    { q: '导管运输的方向是？', options: ['根→叶', '叶→根', '双向', '随机'], answer: 0, explain: '向上单向' },
    { q: '光合作用的原料不包括？', options: ['阳光', '水', '二氧化碳', '糖'], answer: 0, explain: '糖是产物' },
    { q: '叶子是绿色因为含？', options: ['叶绿素', '花青素', '胡萝卜素', '水'], answer: 0, explain: '叶绿体车间' },
    { q: '蒸腾作用的意义是？', options: ['拉水上升+降温', '制造养料', '吸引昆虫', '繁殖'], answer: 0, explain: '天然水泵' },
    { q: '萝卜的膨大部分其实是？', options: ['储根', '茎', '叶', '果实'], answer: 0, explain: '储存养料' },
  ],
});

L['sci-18'] = mk({ id: 'sci-18', island: 'cross', order: 365, title: '五感侦察队：眼耳鼻舌手', emoji: '👀',
  subjectArea: '科学', gradeBand: 'primary', grade: 2, textbook: '冀人版科学（小学）',
  curriculum: { module: '人体·感觉器官', points: ['五种感觉器官', '感官分工合作', '感官的保护'] },
  story: '闭上眼睛你能猜出手里是苹果吗？闻一闻？咬一口？眼睛、耳朵、鼻子、舌头、皮肤是五支侦察小队，它们合作汇报，大脑才能拼出完整的世界地图。',
  goals: ['认识五种感觉器官和功能', '理解多感官合作观察', '知道怎样保护感官'],
  aiIntro: '👀 拨动侦察队编号，看哪个器官在收集情报——五感侦察台！',
  lab: { params: [{ name: 's', label: '侦察队', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['s=2 耳朵能收集哪些声音信息？', '为什么蒙眼猜物要用到手和鼻？', '怎样保护眼睛？'],
    code: `# 五感侦察台
s = 1   # 1眼 2耳 3鼻 4舌 5皮肤

hide()
emo = "👀"
name = "眼睛"
job = "侦察光线和颜色 → 看世界的大小远近"
tip = "护眼：读书一尺远，20 分钟望远处"
col = "#1d4ed8"
if s == 2:
    emo = "👂"
    name = "耳朵"
    job = "侦察声音 → 分辨高低远近强弱"
    tip = "护耳：不放耳机太大声，远离噪音"
    col = "#f59e0b"
if s == 3:
    emo = "👃"
    name = "鼻子"
    job = "侦察气味 → 闻出香臭和安全信号"
    tip = "护鼻：不用手挖，闻不到的气味要小心"
    col = "#16a34a"
if s == 4:
    emo = "👅"
    name = "舌头"
    job = "侦察味道 → 酸甜苦辣咸"
    tip = "护舌：太烫的食物先吹凉"
    col = "#dc2626"
if s == 5:
    emo = "🤚"
    name = "皮肤"
    job = "侦察触觉 → 冷热软硬疼痛"
    tip = "护肤：烫的冰的先小心试探"
    col = "#7c3aed"
fill_rect(0, 120, 360, 40, col)
write(name + " " + emo, 0, 120, "#fff", 16)
fill_rect(0, 66, 360, 40, "#f1f5f9")
write(job, 0, 66, "#0f172a", 11)
write(emo, -60, -20, "#0f172a", 30)
fill_rect(0, -80, 360, 34, "#fef3c7")
write("保护：" + tip, 0, -80, "#b45309", 11)
write("五队合作观察：看+听+闻+摸，情报越多判断越准", -20, -122, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '五支侦察队', body: '【眼→视觉（颜色形状远近）】【耳→听觉（声音强弱高低）】\n【鼻→嗅觉（气味）】【舌→味觉（酸甜苦咸鲜）】【皮肤→触觉（冷热痛触压）】\n每种感官只负责一类情报，谁也不能包办。' },
      { title: '合作观察', body: '【观察一个苹果：眼看颜色、鼻闻果香、手摸光滑、舌尝甜味】\n多个感官一起用，信息才完整——科学家观察都这样。\n盲人失去了视觉，其他感官会更敏锐来补位（大脑可塑）。' },
      { title: '保护感官', body: '【眼：读写一尺远、20-20-20 法则（每 20 分钟看 20 英尺外 20 秒）】\n【耳：不长时间戴耳机、远离鞭炮】【鼻舌：不闻不明气体、不吃太烫】\n【皮肤：防晒防烫、勤洗手】\n感官是终身装备，坏了没有原厂配件。' },
    ], examples: [
      { q: '蒙眼摸物猜苹果，用了哪些感官？', steps: ['手摸：圆滑（触觉）', '鼻闻：果香（嗅觉）', '不能看（无视觉）', '触觉+嗅觉合作完成判断'], tip: '缺一补一' },
      { q: '为什么不能只靠眼睛观察？', steps: ['眼睛看不见气味和味道', '黑暗中视觉失效', '多感官交叉验证更准确', '科学观察讲究全面'], tip: '情报越多越准' },
    ], mistakes: ['认为味觉只有酸甜苦辣咸四味（还有鲜）', '认为皮肤只管触摸（还管冷热疼痛）'] },
  exercises: [
    { q: '负责听觉的器官是？', options: ['耳', '眼', '鼻', '舌'], answer: 0, explain: '听声音' },
    { q: '酸甜苦咸属于？', options: ['味觉', '嗅觉', '触觉', '视觉'], answer: 0, explain: '舌头侦察' },
    { q: '感知冷热的器官是？', options: ['皮肤', '眼', '耳', '鼻'], answer: 0, explain: '触温觉' },
    { q: '观察苹果最全面的做法是？', options: ['看闻摸尝结合', '只看', '只摸', '只闻'], answer: 0, explain: '多感官合作' },
    { q: '20-20-20 法则保护的是？', options: ['眼睛', '耳朵', '皮肤', '鼻子'], answer: 0, explain: '看远休息' },
    { q: '闻到奇怪气味应该？', options: ['捂鼻离开并告诉大人', '深吸一口', '点打火机看看', '不管它'], answer: 0, explain: '安全第一' },
  ],
});

/* ================= 写入 ================= */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第41轮拓展批写入 ${n} 节：${Object.keys(L).join(', ')}`);
