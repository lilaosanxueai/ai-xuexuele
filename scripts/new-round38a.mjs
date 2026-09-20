import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第38轮 A 批：英语高中+6 语文高中+4 道法+4 = 14 节（订单号 303-316） */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

/* ================= 英语·高中 +6 ================= */

L['eng-14'] = mk({ id: 'eng-14', island: 'cross', order: 303, title: '定语从句：句子里的车厢', emoji: '🚃',
  subjectArea: '英语', gradeBand: 'senior', grade: 10, textbook: '人教版英语（高中必修一）',
  curriculum: { module: '复合句·定语从句', points: ['关系代词 who/whom/whose/which/that', '关系副词 where/when/why', '只能用 that 的场合'] },
  story: 'The girl who is singing is my sister.——主句是一节车头，who is singing 是挂在 girl 后面的车厢：它专门回答"哪个女孩"。学会挂车厢，英语句子瞬间变长却不会散架。',
  goals: ['会选关系代词与关系副词', '理解先行词与从句的关系', '掌握只用 that 的三种场合'],
  aiIntro: '🚃 拖动关系词转盘，看车厢怎么挂在先行词后面——定语从句装卸游戏！',
  lab: { params: [{ name: 'rel', label: '关系词', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['rel=1 用 that 挂什么先行词？（人或物都可以）', 'rel=4 的 whose 在从句里充当什么？', '先行词是地点时用哪个？'],
    code: `# 定语从句探索台
rel = 1   # 1 that 2 who 3 whom 4 whose 5 where

hide()
word = "that / which"
use = "指人或指物，作主语或宾语"
ex = "The book that I bought is great."
if rel == 2:
    word = "who"
    use = "指人，作从句主语"
    ex = "The girl who is singing is my sister."
if rel == 3:
    word = "whom"
    use = "指人，作从句宾语（可省）"
    ex = "The man whom we met is a teacher."
if rel == 4:
    word = "whose"
    use = "表示所属关系（谁的）"
    ex = "The boy whose father is a doctor is my friend."
if rel == 5:
    word = "where"
    use = "先行词是地点，作状语"
    ex = "The school where I study is beautiful."
fill_rect(0, 110, 360, 34, "#1d4ed8")
write("关系词：" + word, 0, 110, "#fff", 14)
fill_rect(0, 62, 360, 30, "#f1f5f9")
write(use, 0, 62, "#0f172a", 12)
fill_rect(0, 10, 360, 44, "#fef3c7")
write("例：" + ex, 0, 10, "#b45309", 11)
fill_rect(-100, -60, 150, 56, "#dc2626")
write("先行词", -100, -42, "#fff", 13)
write("antecedent", -100, -68, "#fecaca", 10)
fill_rect(90, -60, 150, 56, "#16a34a")
write("定语从句", 90, -42, "#fff", 13)
write("relative clause", 90, -68, "#bbf7d0", 10)
pen_color("#7c3aed")
pen_down()
go_to(-25, -60)
go_to(15, -60)
pen_up()
write("关系词 = 挂钩", 0, -100, "#7c3aed", 11)
if rel == 1:
    write("that 万金油：人和物都能挂", 0, 130, "#1d4ed8", 10)
if rel == 4:
    write("whose 后面必跟名词：whose book", 0, 130, "#dc2626", 10)
`,
  },
  teach: { sections: [
      { title: '什么是定语从句', body: '【定语从句 = 挂在名词（先行词）后面、修饰它的小句子】\nThe girl who is singing is my sister.\n先行词 girl，关系词 who，从句 who is singing 告诉你"哪个女孩"。\n关系词一身兼两职：①连接主从句 ②在从句中充当成分。' },
      { title: '关系代词怎么选', body: '【指人作主语 who；指人作宾语 whom（口语可用 who）；指物 which；人物皆可 that；表所属 whose】\n看两点：先行词是人还是物？关系词在从句里作主语、宾语还是定语？\n关系代词作宾语时可省略：The book (that) I bought is great.' },
      { title: '只用 that 的场合', body: '【先行词是 all/everything/nothing/something 等不定代词时】\n【先行词被序数词、最高级、the only、the very 修饰时】\nThis is the best film that I have ever seen.\n另外介词后不能用 that：in which（√）in that（×）。' },
    ], examples: [
      { q: 'I still remember the day ___ we first met. 填什么？', steps: ['先行词 the day 是时间', '从句 we first met 主谓宾齐全，不缺成分', '时间 + 作状语 → 关系副词 when', '答案：when（= on which）'], tip: '从句缺成分用 which/that，不缺用 when/where/why' },
      { q: 'This is the factory ___ makes cars. 填什么？', steps: ['先行词 the factory 是物', '从句 ___ makes cars 缺主语', '缺主语 + 指物 → which/that', '答案：which 或 that'], tip: '先把从句缺口找出来再选词' },
    ], mistakes: ['先行词是时间就填 when（从句缺宾语时要用 which/that）', 'whose 和 who 混淆（whose=谁的，后接名词）'] },
  exercises: [
    { q: 'The man ___ is standing there is my uncle.（作主语指人）', options: ['who', 'which', 'where', 'whose'], answer: 0, explain: '指人作主语用 who' },
    { q: 'The house ___ windows are big faces south.', options: ['whose', 'which', 'that', 'who'], answer: 0, explain: 'windows 前缺定语→whose' },
    { q: 'This is all ___ I want to say.', options: ['that', 'which', 'who', 'what'], answer: 0, explain: '先行词 all 只用 that' },
    { q: 'The city ___ I was born has changed a lot.', options: ['where', 'which', 'that', 'who'], answer: 0, explain: '地点+从句不缺成分→where' },
    { q: 'It is the most interesting book ___ I have read.', options: ['that', 'which', 'who', 'whom'], answer: 0, explain: '最高级修饰只用 that' },
    { q: 'The pen ___ I lost yesterday was red.（作宾语）', options: ['that（可省）', 'who', 'where', 'what'], answer: 0, explain: '指物作宾语 that/which 可省' },
  ],
});

L['eng-15'] = mk({ id: 'eng-15', island: 'cross', order: 304, title: '被动语态：be + done 变形记', emoji: '🔄',
  subjectArea: '英语', gradeBand: 'senior', grade: 10, textbook: '人教版英语（高中必修二）',
  curriculum: { module: '动词的语态', points: ['被动语态的构成 be + 过去分词', '八种时态的被动形式', '主动改被动的三步法'] },
  story: 'Everyone loves English. → English is loved by everyone. 焦点一换，句子就"变身"：动作的承受者站上主语位，动词套上 be + done 的外壳。高考写作里用好被动，句子立刻高级。',
  goals: ['掌握 be + done 的构成逻辑', '会写八种常用时态的被动形式', '会主动句改被动句'],
  aiIntro: '🔄 拨动时态转盘，看 be 怎么变、done 永不变——被动语态变形记！',
  lab: { params: [{ name: 'tense', label: '时态', min: 1, max: 6, step: 1, value: 1 }],
    grid: false, explore: ['哪种成分在变，哪种永不变？', 'tense=4 的 has been done 是什么时态？', 'by 短语什么时候可以不写？'],
    code: `# 被动语态探索台
tense = 1   # 1一般现在 2一般过去 3一般将来 4现在完成 5现在进行 6过去完成

hide()
be = "am / is / are"
name = "一般现在时"
ex = "English is loved by everyone."
if tense == 2:
    be = "was / were"
    name = "一般过去时"
    ex = "The bridge was built in 1990."
if tense == 3:
    be = "will be"
    name = "一般将来时"
    ex = "A new school will be built here."
if tense == 4:
    be = "has / have been"
    name = "现在完成时"
    ex = "The work has been finished."
if tense == 5:
    be = "is / are being"
    name = "现在进行时"
    ex = "The road is being repaired now."
if tense == 6:
    be = "had been"
    name = "过去完成时"
    ex = "The letter had been sent before he came."
fill_rect(0, 120, 360, 30, "#1d4ed8")
write(name + " 被动式", 0, 120, "#fff", 13)
fill_rect(0, 74, 360, 40, "#f1f5f9")
write("be（随时态变）+ done（永不变）", 0, 74, "#dc2626", 12)
fill_rect(-110, 26, 120, 34, "#16a34a")
write(be, -110, 26, "#fff", 12)
fill_rect(20, 26, 120, 34, "#7c3aed")
write("done", 20, 26, "#fff", 12)
fill_rect(0, -30, 360, 44, "#fef3c7")
write("例：" + ex, 0, -30, "#b45309", 11)
write("口诀：被动语态 be 加过表，时态变化全在 be", -40, -85, "#0f172a", 11)
write("不知道/不必说动作执行者时，by 短语可省", -40, -110, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '为什么用被动', body: '【当动作的承受者比执行者更重要、或执行者未知时用被动】\nThe window was broken.（谁打的不重要/不知道）\n科技文、新闻报道高频使用被动——客观、正式。' },
      { title: '被动三步法', body: '【①宾语提前作主语 ②动词变 be + done ③原主语变 by 短语（可省）】\nEveryone loves English. → English is loved (by everyone).\n注意 be 的新主语单复数保持一致：They built two schools → Two schools were built.' },
      { title: '易错点', body: '【不及物动词没有被动：happen, take place, belong to, come true】\nThe accident was happened（×）→ The accident happened（√）\n短语动词的介词不能丢：The children are taken care of.' },
    ], examples: [
      { q: '把 People speak English all over the world. 改成被动。', steps: ['宾语 English 提前作主语', '动词变 are spoken（复数主语）', '答案：English is spoken by people all over the world'], tip: '先找宾语，再看单复数' },
      { q: 'The factory ___ since 2010.（open）', steps: ['since 2010 → 现在完成时', '被动 = have/has been + done', '主语 The factory 单数 → has been opened', '答案：has been opened'], tip: 'since 是完成时的信号词' },
    ], mistakes: ['happen/take place 误用被动', 'be 的单复数不随新主语变化'] },
  exercises: [
    { q: 'The room ___ every day.', options: ['is cleaned', 'cleans', 'is clean', 'cleaned'], answer: 0, explain: '一般现在被动' },
    { q: 'A talk ___ tomorrow afternoon.', options: ['will be given', 'will give', 'is given', 'has been given'], answer: 0, explain: 'tomorrow→将来被动' },
    { q: 'The bridge ___ last year.', options: ['was built', 'is built', 'has been built', 'will be built'], answer: 0, explain: 'last year→过去被动' },
    { q: 'My bike ___. Can you repair it?', options: ['is broken', 'broke', 'is breaking', 'breaks'], answer: 0, explain: '状态被动 is broken' },
    { q: 'The song ___ by young people now.', options: ['is being sung', 'is sung', 'was sung', 'has been sung'], answer: 0, explain: 'now→进行被动' },
    { q: '下列哪句没有被动形式？', options: ['The story happened in 2020.', 'The story was written in 2020.', 'The letter was sent yesterday.', 'The work has been done.'], answer: 0, explain: 'happen 不及物无被动' },
  ],
});

L['eng-16'] = mk({ id: 'eng-16', island: 'cross', order: 305, title: '非谓语动词：doing·done·to do', emoji: '🎈',
  subjectArea: '英语', gradeBand: 'senior', grade: 11, textbook: '人教版英语（高中选择性必修一）',
  curriculum: { module: '非谓语动词', points: ['doing 主动/进行', 'done 被动/完成', 'to do 目的/将来'] },
  story: '一个句子只能有一个"皇帝"（谓语动词），其余动词必须"削藩"变成非谓语——doing、done、to do 三种身份怎么选？看它和逻辑主语的关系：主动进行用 doing，被动完成用 done，目的将来用 to do。',
  goals: ['理解谓语与非谓语的区别', '会根据逻辑主语关系选 doing/done/to do', '掌握非谓语作定语和状语的用法'],
  aiIntro: '🎈 拨动身份选择器，看同一个动词换三种马甲——非谓语变装秀！',
  lab: { params: [{ name: 'form', label: '非谓语形式', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['form=2 的 seen from the hill 为什么用 done？', 'To pass the exam 里的 to do 表示什么？', '逻辑主语和动词的主动/被动关系怎么判断？'],
    code: `# 非谓语动词探索台
form = 1   # 1 doing 2 done 3 to do

hide()
f = "doing"
rel = "主动关系 / 正在进行"
ex = "Seeing the snake, she screamed."
pos = "作状语：她主动看见蛇，同时发生"
if form == 2:
    f = "done"
    rel = "被动关系 / 已完成"
    ex = "Seen from the hill, the town looks small."
    pos = "作状语：镇被从山上看，被动"
if form == 3:
    f = "to do"
    rel = "目的 / 将要发生"
    ex = "To pass the exam, he studied hard."
    pos = "作状语：为了通过考试，目的"
fill_rect(-120, 110, 110, 40, "#16a34a")
write(f, -120, 110, "#fff", 15)
fill_rect(60, 110, 240, 40, "#f1f5f9")
write(rel, 60, 110, "#0f172a", 12)
fill_rect(0, 48, 360, 44, "#fef3c7")
write("例：" + ex, 0, 48, "#b45309", 11)
fill_rect(0, -8, 360, 34, "#eff6ff")
write(pos, 0, -8, "#1d4ed8", 11)
write("一个句子一个谓语皇帝，其余动词都要削藩", -30, -60, "#dc2626", 12)
write("判定：找逻辑主语 → 主动 doing / 被动 done / 目的 to do", -30, -85, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '一句一个皇帝', body: '【谓语动词是句子的皇帝，一个简单句只能有一个；第二个动词必须降级为非谓语】\nShe sat there and cried.（and 连接两个谓语，合法）\nShe sat there, crying.（crying 非谓语，也合法）\nShe sat there cried.（× 两个谓语打架）' },
      { title: '三种身份', body: '【doing：与逻辑主语是主动关系，或表进行】\n【done：与逻辑主语是被动关系，或表完成】\n【to do：表目的、将来】\nThe man standing there is my teacher.（人主动站着→standing）\nthe books written by Lu Xun（书被写→written）' },
      { title: '常考细节', body: '【接不定式作宾语的动词：want/decide/hope/plan/agree】\n【接 doing 的：enjoy/finish/mind/practice/suggest/look forward to】\n forget to do（忘了要做）≠ forget doing（忘了做过）\nstop to do（停下来去做）≠ stop doing（停止做）' },
    ], examples: [
      { q: '___ from space, the earth looks blue. 填 Seeing 还是 Seen？', steps: ['找逻辑主语：the earth', '地球被从太空看 → 被动关系', '被动用 done → Seen from space'], tip: '先找逻辑主语再判主被动' },
      { q: 'He got up early ___ the first bus.', steps: ['分析语义：早起是为了赶上头班车', '表目的用 to do', '答案：to catch'], tip: '目的状语 = to do' },
    ], mistakes: ['见动词就加 ing（不看逻辑主语关系）', 'look forward to 后误加 to do（to 是介词，接 doing）'] },
  exercises: [
    { q: 'The boy ___ in the corner is my brother.', options: ['standing', 'stood', 'to stand', 'stands'], answer: 0, explain: '男孩主动站着→doing' },
    { q: 'The novel ___ by Mo Yan is popular.', options: ['written', 'writing', 'to write', 'writes'], answer: 0, explain: '小说被写→done' },
    { q: '___ English well, you need more practice.', options: ['To learn', 'Learning', 'Learned', 'Learns'], answer: 0, explain: '表目的用 to do' },
    { q: 'He is looking forward to ___ from you.', options: ['hearing', 'hear', 'be heard', 'heard'], answer: 0, explain: 'to 是介词接 doing' },
    { q: 'I remember ___ the door.（锁过了）', options: ['locking', 'to lock', 'lock', 'locked'], answer: 0, explain: 'remember doing 记得做过' },
    { q: '___ tired, he went on working.', options: ['Feeling', 'Felt', 'To feel', 'Feel'], answer: 0, explain: '他主动感到累→doing' },
  ],
});

L['eng-17'] = mk({ id: 'eng-17', island: 'cross', order: 306, title: '虚拟语气：如果世界可以重来', emoji: '🌀',
  subjectArea: '英语', gradeBand: 'senior', grade: 11, textbook: '人教版英语（高中选择性必修二）',
  curriculum: { module: '虚拟语气', points: ['与现在事实相反', '与过去事实相反', '与将来事实相反', 'wish 后的虚拟'] },
  story: 'If I were a bird, I would fly to you.——我不是鸟，所以用 were 不用 am：这就是虚拟语气，专门表达"不可能/没发生"的假设。时态整体"后退一步"，是它唯一的密码。',
  goals: ['理解虚拟语气表达非真实假设', '掌握三种 if 虚拟的时态搭配', '会写 wish 后的虚拟从句'],
  aiIntro: '🌀 拨动假设类型，看时态怎么"后退一步"——虚拟语气时光机！',
  lab: { params: [{ name: 'vt', label: '虚拟类型', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['vt=2 的 had done 表示什么时候的事？', '主句 would 后为什么接不同形式？', '为什么说虚拟=时态后移？'],
    code: `# 虚拟语气探索台
vt = 1   # 1与现在相反 2与过去相反 3与将来相反

hide()
name = "与现在事实相反"
ic = "If I were you,（过去式）"
mc = "I would go.（would + 动词原形）"
ex = "事实：我不是你"
if vt == 2:
    name = "与过去事实相反"
    ic = "If you had studied hard,（过去完成）"
    mc = "you would have passed.（would have done）"
    ex = "事实：你当时没努力，没通过"
if vt == 3:
    name = "与将来事实相反"
    ic = "If it should rain tomorrow,（should + 原形）"
    mc = "we would stay home.（would + 原形）"
    ex = "事实：明天下雨可能性很小"
fill_rect(0, 125, 340, 30, "#7c3aed")
write(name, 0, 125, "#fff", 13)
fill_rect(-100, 78, 160, 38, "#1d4ed8")
write(ic, -100, 78, "#fff", 10)
fill_rect(90, 78, 160, 38, "#dc2626")
write(mc, 90, 78, "#fff", 10)
write("if 从句", -100, 46, "#1d4ed8", 10)
write("主句", 90, 46, "#dc2626", 10)
fill_rect(0, -6, 360, 34, "#f1f5f9")
write(ex, 0, -6, "#0f172a", 11)
write("虚拟密码：时态后退一步", -40, -55, "#dc2626", 12)
write("现在→过去式  过去→过去完成  将来→should + 原形", -40, -80, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '真实 vs 虚拟', body: '【真实条件句：可能发生的假设，用正常时态】If it rains, I will stay home.\n【虚拟条件句：不可能/与事实相反，时态后移】If it rained now, I would stay home.\n判断标准：这事还有可能吗？' },
      { title: '三种 if 虚拟', body: '【与现在相反：If + 过去式，主句 would + 原形】If I had time, I would help you.\n【与过去相反：If + had done，主句 would have done】If you had come, you would have met her.\n【与将来相反：If + should/were to + 原形】If the sun were to rise in the west, I would not change my mind.' },
      { title: 'wish 的虚拟', body: '【对现在的愿望：wish + 过去式】I wish I were taller.\n【对过去的遗憾：wish + had done】I wish I had studied harder.\n【对将来的愿望：wish + could/would + 原形】I wish you could come tomorrow.\nwish 后面永远"时态后移"，与 if 虚拟同源。' },
    ], examples: [
      { q: 'If I ___ you, I would accept the offer.', steps: ['虚拟语气与现在相反', 'be 动词过去式一律用 were', '答案：were'], tip: 'If I were you 是高考高频' },
      { q: 'I wish I ___ the concert last night.', steps: ['last night → 对过去的愿望', 'wish 后用 had done', '答案：had attended'], tip: '时间标志词定虚拟类型' },
    ], mistakes: ['虚拟句 if 后用 was（一律 were）', '与过去相反的主句误用 would do（应 would have done）'] },
  exercises: [
    { q: 'If I ___ wings, I would fly.', options: ['had', 'have', 'would have', 'having'], answer: 0, explain: '与现在相反→过去式' },
    { q: 'If he ___ earlier, he would have caught the train.', options: ['had left', 'left', 'would leave', 'leaves'], answer: 0, explain: '与过去相反→had done' },
    { q: 'I wish I ___ a bird.', options: ['were', 'am', 'will be', 'have been'], answer: 0, explain: '对现在的愿望→过去式 were' },
    { q: 'If it ___ tomorrow, we would cancel the picnic.（几乎不可能）', options: ['should snow', 'snows', 'snowed', 'will snow'], answer: 0, explain: '与将来相反→should + 原形' },
    { q: 'If I had known your number, I ___ you.', options: ['would have called', 'would call', 'had called', 'called'], answer: 0, explain: '主句 would have done' },
    { q: '虚拟语气表达的是？', options: ['非真实的假设或愿望', '已经发生的事', '将来的计划', '命令和要求'], answer: 0, explain: '核心=非真实' },
  ],
});

L['eng-18'] = mk({ id: 'eng-18', island: 'cross', order: 307, title: '阅读理解：主旨题攻略', emoji: '🎯',
  subjectArea: '英语', gradeBand: 'senior', grade: 10, textbook: '人教版英语（高中必修三）',
  curriculum: { module: '阅读策略', points: ['主旨题的三步定位法', '干扰项四大特征', '标题题的取舍'] },
  story: '一道主旨题做错，往往不是没读懂，而是被"太窄的细节"和"太宽的帽子"骗了。掌握三步定位法——首尾句、高频词、作者态度——主旨题从失分项变成送分项。',
  goals: ['会用首尾句+高频词定位主旨', '识别主旨题干扰项特征', '会选最佳标题'],
  aiIntro: '🎯 拨动解题步骤转盘，看主旨怎么被一步步"抓"出来——主旨题破案游戏！',
  lab: { params: [{ name: 'step', label: '解题步骤', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['step=2 为什么高频词这么重要？', '太窄选项错在哪？太宽选项错在哪？', '标题题和主旨题的答案有什么关系？'],
    code: `# 主旨题攻略探索台
step = 1   # 1读首尾 2找高频词 3看作者态度 4验选项

hide()
t = "第一步：读首尾句"
d = "首段末句+各段首句=文章骨架"
k = "首段末句常亮出全文中心论点"
if step == 2:
    t = "第二步：找高频词"
    d = "反复出现的名词=话题核心"
    k = "高频词通常是正确答案里的词"
if step == 3:
    t = "第三步：看作者态度"
    d = "赞成/反对/中立，决定主旨倾向"
    k = "注意 however/but 后面的转折观点"
if step == 4:
    t = "第四步：验证选项"
    d = "太窄=只覆盖一段；太宽=过度概括"
    k = "正确项能覆盖全文而非局部"
fill_rect(0, 120, 340, 32, "#1d4ed8")
write(t, 0, 120, "#fff", 13)
fill_rect(0, 72, 360, 36, "#f1f5f9")
write(d, 0, 72, "#0f172a", 12)
fill_rect(0, 20, 360, 40, "#fef3c7")
write(k, 0, 20, "#b45309", 11)
i = 1
while i < 5:
    x = -140 + (i - 1) * 90
    if i == step:
        fill_rect(x, -50, 56, 44, "#dc2626")
        write("步骤" + i, x, -50, "#fff", 11)
    if i != step:
        fill_rect(x, -50, 56, 44, "#e2e8f0")
        write("步骤" + i, x, -50, "#64748b", 11)
    i = i + 1
write("干扰项四特征：太窄 / 太宽 / 无关 / 偷换", -20, -110, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '三步定位法', body: '【①首尾句：首段末句+各段首句搭骨架 ②高频词：反复出现的名词是话题核心 ③作者态度：however 之后见真心】\n说明文的主旨在首段；议论文的主旨常在末段总结；新闻报道看导语（第一段）。' },
      { title: '干扰项四特征', body: '【太窄：只概括某一段的细节】【太宽：帽子大到原文装不下】【无关：文中没提】【偷换：换了个相近概念】\n做题时先给每个选项贴标签，贴完往往只剩一个"刚刚好"的选项。' },
      { title: '标题题', body: '【最佳标题=话题核心+作者角度，且新颖简洁】\n标题要能覆盖全文又不能太空：The Internet（太宽）→ How the Internet Changes Our Memory（刚好）。' },
    ], examples: [
      { q: '文章共三段：①某新发明亮相 ②它的三个缺点 ③专家建议慎用。主旨是？', steps: ['首尾句：亮相→建议慎用', '高频词：新发明', '作者态度：谨慎不看好', '主旨：这项新发明虽亮眼但需谨慎对待'], tip: '把三段首句连起来读' },
      { q: '选项 A 是第二段的一个例子，B 概括全文。选哪个？', steps: ['A 只覆盖第二段→太窄', 'B 覆盖全文→主旨', '答案：B'], tip: '例子永远不是主旨' },
    ], mistakes: ['把段落细节当主旨（太窄）', '忽略 however 后的转折态度'] },
  exercises: [
    { q: '主旨题第一步应重点读？', options: ['首尾句', '所有生词', '例子细节', '人名地名'], answer: 0, explain: '首尾句搭骨架' },
    { q: '只概括了第二段内容的选项属于？', options: ['太窄', '太宽', '无关', '偷换'], answer: 0, explain: '覆盖不全' },
    { q: '高频词指？', options: ['反复出现的核心名词', '最长的单词', '首段的动词', '数字'], answer: 0, explain: '话题核心' },
    { q: '议论文主旨常出现在？', options: ['末段总结', '第二段例子', '标题引号里', '注释'], answer: 0, explain: '议论文卒章显志' },
    { q: 'however 之后的内容为什么重要？', options: ['常是作者真实观点', '字数最多', '有生词', '是例子'], answer: 0, explain: '转折见真心' },
    { q: '最佳标题应做到？', options: ['覆盖全文且简洁新颖', '尽量宽泛', '只含首段信息', '用原文原句'], answer: 0, explain: '不窄不宽' },
  ],
});

L['eng-19'] = mk({ id: 'eng-19', island: 'cross', order: 308, title: '应用文写作：书信三段式', emoji: '✉️',
  subjectArea: '英语', gradeBand: 'senior', grade: 10, textbook: '人教版英语（高中必修二）',
  curriculum: { module: '书面表达', points: ['三段式结构', '开头结尾万能句', '要点全覆盖与润色'] },
  story: '高考应用文 15 分，拼的不是文采而是"结构清晰+要点齐全+少犯错"。开头说明来意、主体覆盖要点、结尾礼貌收束——三段式框架一套，稳拿基准分，再靠亮点句冲高分。',
  goals: ['掌握书信三段式结构', '积累开头结尾万能句', '学会要点全覆盖不留漏'],
  aiIntro: '✉️ 拨动段落滑块，看一封满分书信怎么搭骨架——应用文建筑师！',
  lab: { params: [{ name: 'para', label: '段落', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['para=1 开头段必须交代哪两件事？', '主体段漏点会扣多少分？', '结尾段的礼貌句型你能背几个？'],
    code: `# 应用文三段式探索台
para = 1   # 1开头 2主体 3结尾

hide()
t = "第一段：开头"
c = "自我介绍 + 写信目的"
e = "I am Li Hua. I am writing to invite you to our culture festival."
w = "万能句：I am writing to tell/ask/invite..."
if para == 2:
    t = "第二段：主体"
    c = "要点 1 + 要点 2 + 要点 3（按提示全覆盖）"
    e = "The festival will be held on June 6th. There will be paper-cutting and kite-making."
    w = "连接词：First / Besides / Finally 让层次清晰"
if para == 3:
    t = "第三段：结尾"
    c = "期待回复 + 礼貌祝愿"
    e = "I am looking forward to your reply. Best wishes!"
    w = "万能句：Looking forward to your early reply."
fill_rect(0, 120, 340, 30, "#16a34a")
write(t, 0, 120, "#fff", 13)
fill_rect(0, 72, 360, 36, "#f1f5f9")
write(c, 0, 72, "#0f172a", 11)
fill_rect(0, 16, 360, 48, "#fef3c7")
write(e, 0, 16, "#b45309", 10)
fill_rect(0, -38, 360, 34, "#eff6ff")
write(w, 0, -38, "#1d4ed8", 11)
i = 1
while i < 4:
    x = -100 + (i - 1) * 100
    if i == para:
        fill_rect(x, -95, 70, 40, "#16a34a")
        write("段" + i, x, -95, "#fff", 12)
    if i != para:
        fill_rect(x, -95, 70, 40, "#e2e8f0")
        write("段" + i, x, -95, "#64748b", 11)
    i = i + 1
`,
  },
  teach: { sections: [
      { title: '三段式骨架', body: '【开头：我是谁+为什么写（1-2 句）】【主体：按提示要点逐条展开（4-6 句）】【结尾：期待回复+祝愿（1-2 句）】\n书信/邮件/通知/倡议书都套这个骨架，只换称呼和语气。' },
      { title: '要点全覆盖', body: '【题目给的每个要点都必须写，漏一点扣 2-3 分】\n写前列要点清单：时间？地点？活动？要求？\n用 First/Besides/Finally 把要点标清楚，阅卷老师 30 秒就能找到分点。' },
      { title: '冲分亮点', body: '【一个定语从句 + 一个非谓语 + 一个高级连接词】\nI am writing to invite you to the festival, which will be held on June 6th.\nHeld annually, the festival attracts many visitors.\nWhat is more / As far as I know 替换 and / I think。' },
    ], examples: [
      { q: '邀请信开头段要交代什么？', steps: ['自我介绍：I am Li Hua, chairman of the Student Union', '写信目的：I am writing to invite you to...', '两句话内完成，直奔主题'], tip: '开头别绕弯子' },
      { q: '提示给了时间/地点/活动三个要点，怎么写主体段？', steps: ['First：时间', 'Besides：地点与活动内容', 'Finally：参加方式或注意事项', '每个要点 1-2 句，连接词开头'], tip: '要点顺序=得分顺序' },
    ], mistakes: ['漏写题目要点（硬扣分）', '通篇简单句无亮点（上不了高分档）'] },
  exercises: [
    { q: '书信开头段的功能是？', options: ['自我介绍+写信目的', '展开全部要点', '致谢祝愿', '罗列生词'], answer: 0, explain: '直奔主题' },
    { q: '主体段最重要的原则是？', options: ['要点全覆盖', '多用长难句', '字数越多越好', '抄题目原句'], answer: 0, explain: '漏点硬扣分' },
    { q: '下面哪个是结尾万能句？', options: ['Looking forward to your reply.', 'I am Li Hua.', 'It is a pen.', 'He is tall.'], answer: 0, explain: '期待回复' },
    { q: '表层次的连接词是？', options: ['Besides', 'But', 'Or', 'So'], answer: 0, explain: '递进补要点' },
    { q: '亮点句 the festival which will be held... 用了？', options: ['定语从句', '倒装句', '强调句', '省略句'], answer: 0, explain: 'which 引导定语从句' },
    { q: '应用文写作最忌讳的是？', options: ['漏写要点', '分段清晰', '礼貌用语', '用连接词'], answer: 0, explain: '要点=得分点' },
  ],
});

/* ================= 语文·高中 +4 ================= */

L['chn-07'] = mk({ id: 'chn-07', island: 'cross', order: 309, title: '文言虚词：之乎者也的秘密', emoji: '📜',
  subjectArea: '语文', gradeBand: 'senior', grade: 10, textbook: '统编版语文（高中必修上）',
  curriculum: { module: '文言文阅读', points: ['之的三种用法', '而的四种关系', '以/于/其的核心用法'] },
  story: '之乎者也——古人说话的"胶水"。一个"之"有时是"的"，有时是"他"，有时干脆是个调节节奏的衬字。掌握 18 个常考虚词的密码，文言文就通了三分之一。',
  goals: ['掌握之/而/以/于/其的核心用法', '会根据语境判断虚词功能', '积累课本经典例句'],
  aiIntro: '📜 拨动虚词转盘，看一个字在不同句子里的变身——文言虚词解码器！',
  lab: { params: [{ name: 'w', label: '虚词', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['w=1 时 之 作代词和作"的"怎么区分？', '而 表转折和表并列有什么区别？', '以 作"因为"和"来"各举一句？'],
    code: `# 文言虚词探索台
w = 1   # 1 之 2 而 3 以 4 于 5 其

hide()
word = "之"
m1 = "作代词：他/它"
e1 = "学而时习之（之=学问）"
m2 = "作助词：的"
e2 = "水陆草木之花"
m3 = "动词：去/到"
e3 = "吾欲之南海（之=去）"
if w == 2:
    word = "而"
    m1 = "表并列：又"
    e1 = "敏而好学（又好学）"
    m2 = "表转折：却"
    e2 = "学而不思则罔（却）"
    m3 = "表承接：就"
    e3 = "温故而知新（就）"
if w == 3:
    word = "以"
    m1 = "介词：用/拿"
    e1 = "以刀劈狼首（用刀）"
    m2 = "介词：因为"
    e2 = "不以物喜（因为）"
    m3 = "连词：来/用来"
    e3 = "属予作文以记之（来）"
if w == 4:
    word = "于"
    m1 = "介词：在"
    e1 = "战于长勺（在长勺）"
    m2 = "介词：比"
    e2 = "苛政猛于虎（比虎）"
    m3 = "介词：被"
    e3 = "受制于人（被人）"
if w == 5:
    word = "其"
    m1 = "代词：他的/那"
    e1 = "择其善者而从之"
    m2 = "语气：难道"
    e2 = "其真无马邪（难道）"
    m3 = "语气：恐怕"
    e3 = "其此之谓乎（恐怕）"
fill_rect(0, 130, 340, 32, "#b45309")
write("虚词：" + word, 0, 130, "#fff", 15)
fill_rect(-100, 84, 160, 36, "#f1f5f9")
write(m1, -100, 84, "#0f172a", 11)
fill_rect(90, 84, 160, 36, "#fef3c7")
write(e1, 90, 84, "#b45309", 10)
fill_rect(-100, 34, 160, 36, "#f1f5f9")
write(m2, -100, 34, "#0f172a", 11)
fill_rect(90, 34, 160, 36, "#fef3c7")
write(e2, 90, 34, "#b45309", 10)
fill_rect(-100, -16, 160, 36, "#f1f5f9")
write(m3, -100, -16, "#0f172a", 11)
fill_rect(90, -16, 160, 36, "#fef3c7")
write(e3, 90, -16, "#b45309", 10)
write("方法：代入法——把释义放回原句读通即为答案", -30, -75, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '之：一字三用', body: '【代词：他/它/这件事】学而时习之。\n【助词"的"：】水陆草木之花。\n【动词"去"：】吾欲之南海。\n还有音节助词（不译）：久之，目似瞑。代入法是万能钥匙。' },
      { title: '而：看前后关系', body: '【并列：又，可互换】敏而好学。\n【转折：却，前后相反】学而不思则罔。\n【承接：就，有时间先后】温故而知新。\n【修饰：地，连接状语】吾尝终日而思矣。\n判断技巧：前后能否互换+语义是否相反。' },
      { title: '以/于/其', body: '【以：用/因为/来/凭借】以刀劈狼首；不以物喜；以光先帝遗德。\n【于：在/比/被/向】战于长勺；苛政猛于虎；受制于人。\n【其：他的/那/难道/恐怕】其真无马邪？\n每个虚词记住 2-3 个课本例句，考场直接迁移。' },
    ], examples: [
      { q: '"予独爱莲之出淤泥而不染"中的 之 是什么用法？', steps: ['主语莲，谓语出淤泥，中间夹着之', '取消句子独立性，不译', '答案：结构助词，取消句独立性'], tip: '主谓之间必是取消独立性' },
      { q: '"千里马常有，而伯乐不常有"的 而 表？', steps: ['前句：千里马常有', '后句：伯乐不常有', '前后相反相对 → 转折：却'], tip: '语义相反选转折' },
    ], mistakes: ['见 之 就译成"的"（还有代词/动词用法）', '而 的并列和承接混淆（并列可互换，承接有先后）'] },
  exercises: [
    { q: '"水陆草木之花"的 之 相当于？', options: ['的', '他', '去', '不译'], answer: 0, explain: '结构助词的' },
    { q: '"学而不思则罔"的 而 表？', options: ['转折', '并列', '承接', '修饰'], answer: 0, explain: '学与不思相反' },
    { q: '"以刀劈狼首"的 以 是？', options: ['用', '因为', '来', '在'], answer: 0, explain: '拿刀' },
    { q: '"苛政猛于虎"的 于 是？', options: ['比', '在', '被', '向'], answer: 0, explain: '比老虎' },
    { q: '"其真无马邪"的 其 是？', options: ['难道', '他的', '那', '恐怕'], answer: 0, explain: '反问语气' },
    { q: '"吾欲之南海"的 之 是？', options: ['动词：去', '代词：它', '助词：的', '不译'], answer: 0, explain: '之=到、去' },
  ],
});

L['chn-08'] = mk({ id: 'chn-08', island: 'cross', order: 310, title: '古诗词鉴赏：意象密码本', emoji: '🌙',
  subjectArea: '语文', gradeBand: 'senior', grade: 10, textbook: '统编版语文（高中必修上）',
  curriculum: { module: '古诗词鉴赏', points: ['常见意象的固定情感', '意象组合成意境', '答题模板'] },
  story: '诗人从不直说"我想家"，他们说"举头望明月"。月、柳、雁、梧桐——这些意象是中国诗歌的"密码本"，破译了它，一千年前的眼泪你也能读懂。',
  goals: ['掌握八大常见意象的情感内涵', '理解意象组合营造意境', '会套用鉴赏答题模板'],
  aiIntro: '🌙 拨动意象转盘，看一个景物如何锁死一种情感——意象密码破译台！',
  lab: { params: [{ name: 'img', label: '意象', min: 1, max: 6, step: 1, value: 1 }],
    grid: false, explore: ['img=1 的月亮为什么总和思乡绑定？', '柳 和 留 谐音说明了什么手法？', '同一意象在不同诗里情感会变吗？'],
    code: `# 意象密码本探索台
img = 1   # 1月 2柳 3雁 4梧桐 5菊 6夕阳

hide()
sym = "月亮"
emo = "思乡怀人"
poem = "举头望明月，低头思故乡"
why = "月圆人不圆，天涯共此月"
if img == 2:
    sym = "柳枝"
    emo = "惜别留恋"
    poem = "昔我往矣，杨柳依依"
    why = "柳谐音留，折柳送别"
if img == 3:
    sym = "大雁"
    emo = "音信与乡愁"
    poem = "雁字回时，月满西楼"
    why = "雁南飞定期，传书之鸟"
if img == 4:
    sym = "梧桐"
    emo = "孤寂哀愁"
    poem = "梧桐更兼细雨，到黄昏"
    why = "秋雨打桐叶，声声皆是愁"
if img == 5:
    sym = "菊花"
    emo = "隐逸高洁"
    poem = "采菊东篱下，悠然见南山"
    why = "陶渊明之花，不与百花争"
if img == 6:
    sym = "夕阳"
    emo = "迟暮感伤"
    poem = "夕阳无限好，只是近黄昏"
    why = "日暮喻人生暮年"
fill_rect(0, 128, 340, 32, "#7c3aed")
write(sym, 0, 128, "#fff", 16)
fill_rect(0, 82, 360, 34, "#fef3c7")
write(emo, 0, 82, "#b45309", 13)
fill_rect(0, 32, 360, 42, "#eff6ff")
write(poem, 0, 32, "#1d4ed8", 11)
fill_rect(0, -20, 360, 40, "#f1f5f9")
write(why, 0, -20, "#0f172a", 11)
write("意象=景 + 固定情感，组合起来=意境", -30, -78, "#dc2626", 11)
write("答题模板：本诗借xx意象，描绘xx画面，抒发xx情感", -30, -102, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '意象：景与情的焊接点', body: '【意象=融入主观情感的客观景物】\n月=思乡，柳=惜别，雁=音信乡愁，梧桐=孤寂，菊=高洁，梅=坚韧，夕阳=迟暮，杜鹃=悲苦。\n意象是诗人的"表情包"——发送千次，含义稳定。' },
      { title: '意象组合成意境', body: '【多个意象叠加，构成整体画面氛围=意境】\n枯藤老树昏鸦，小桥流水人家，古道西风瘦马——九个意象排成两组：荒凉组对温暖组，孤独感瞬间立体。\n鉴赏时先圈意象，再连画面，后定情感。' },
      { title: '答题模板', body: '【这首诗借xx意象，描绘了一幅xx的画面，营造出xx的氛围，抒发了诗人xx的情感】\n三步：找意象→描画面→点情感。\n注意区分：思乡、送别、贬谪、忧国、隐逸，情感词要写准。' },
    ], examples: [
      { q: '"今宵酒醒何处？杨柳岸，晓风残月"用了哪些意象？', steps: ['圈出：杨柳、晓风、残月', '柳=惜别，残月=离别不圆', '组合：离别后的凄清孤寂', '情感：与恋人分别的伤感'], tip: '先圈意象再连情感' },
      { q: '"采菊东篱下"的 菊 寄托了什么？', steps: ['菊的传统含义：隐逸高洁', '东篱、南山=田园隐居生活', '答案：安于隐逸、超脱世俗的高洁志趣'], tip: '意象+人物处境=情感' },
    ], mistakes: ['情感词写得笼统（"悲伤"不如"贬谪失意"得分）', '只翻译诗句不点意象和情感'] },
  exercises: [
    { q: '月亮最常寄托的情感是？', options: ['思乡怀人', '建功立业', '田园之乐', '讽刺时政'], answer: 0, explain: '天涯共明月' },
    { q: '折柳送别因为 柳 谐音？', options: ['留', '路', '楼', '流'], answer: 0, explain: '谐音双关' },
    { q: '大雁在诗中常象征？', options: ['音信与乡愁', '自由爱情', '战争', '丰收'], answer: 0, explain: '鸿雁传书' },
    { q: '"梧桐更兼细雨"营造的氛围是？', options: ['凄冷孤寂', '热闹喜庆', '雄浑开阔', '清新明快'], answer: 0, explain: '愁的叠加' },
    { q: '菊花的传统意象内涵是？', options: ['隐逸高洁', '离别伤感', '思乡', '富贵'], answer: 0, explain: '陶渊明定格' },
    { q: '意境是由什么构成的？', options: ['多个意象组合的整体画面', '一个比喻', '诗的标题', '韵脚'], answer: 0, explain: '意象→画面→意境' },
  ],
});

L['chn-09'] = mk({ id: 'chn-09', island: 'cross', order: 311, title: '议论文写作：论点·论据·论证', emoji: '⚖️',
  subjectArea: '语文', gradeBand: 'senior', grade: 11, textbook: '统编版语文（高中选择性必修上）',
  curriculum: { module: '写作·议论文', points: ['三要素与五段三分式结构', '四种论证方法', '分论点的拆分角度'] },
  story: '议论文是一场"辩论赛"：论点是你的立场，论据是你的证据，论证是推理过程。结构上最稳的打法是"五段三分式"——开头亮剑，三段推进，结尾收锋。',
  goals: ['掌握论点论据论证三要素', '会写五段三分式结构', '会运用四种常见论证方法'],
  aiIntro: '⚖️ 拨动结构滑块，看一篇议论文怎么像辩论赛一样立起来——议论文骨架工厂！',
  lab: { params: [{ name: 'part', label: '结构部位', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['part=2 分论点为什么最好三句排比？', '论证方法里对比论证好在哪？', '论据和论点"两张皮"怎么避免？'],
    code: `# 议论文骨架探索台
part = 1   # 1引论 2本论 3结论 4论证方法

hide()
t = "引论（第1段）"
c = "引材料 + 亮中心论点"
k = "论点句要单句成段，态度鲜明"
if part == 2:
    t = "本论（第2-4段）"
    c = "三个分论点 + 各配论据 + 分析"
    k = "分论点排比最好记：是什么/为什么/怎么办"
if part == 3:
    t = "结论（第5段）"
    c = "重申论点 + 升华收束"
    k = "呼应开头，联系现实，忌空喊口号"
if part == 4:
    t = "四种论证方法"
    c = "举例 / 道理 / 对比 / 比喻"
    k = "一篇文章至少用三种，论证才立体"
fill_rect(0, 122, 340, 32, "#dc2626")
write(t, 0, 122, "#fff", 13)
fill_rect(0, 74, 360, 36, "#f1f5f9")
write(c, 0, 74, "#0f172a", 12)
fill_rect(0, 24, 360, 40, "#fef3c7")
write(k, 0, 24, "#b45309", 11)
i = 1
while i < 5:
    y = -30 - (i - 1) * 26
    if i == part:
        fill_rect(-120, y, 240, 20, "#dc2626")
        write("部位 " + i, -120, y, "#fff", 10)
    if i != part:
        fill_rect(-120, y, 240, 20, "#e2e8f0")
        write("部位 " + i, -120, y, "#64748b", 9)
    i = i + 1
write("论点=立场 论据=证据 论证=推理", 110, -50, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '三要素', body: '【论点：作者的主张，必须一句能说清】坚持，是穿越荒漠的驼铃。\n【论据：事实论据（事例数据）+ 道理论据（名言原理）】\n【论证：用论据证明论点的推理过程】\n三者关系：论点是靶心，论据是箭，论证是射箭的轨迹。' },
      { title: '五段三分式', body: '【第1段引论：引出话题+亮论点（5行内）】\n【第2-4段本论：三个分论点各领一段，段首句即分论点】\n分论点拆法：①是什么/为什么/怎么办 ②个人/集体/国家 ③过去/现在/未来。\n【第5段结论：重申论点+升华，忌口号式空喊】' },
      { title: '四种论证方法', body: '【举例论证：叙例三句话，分析两句话】\n【道理论证：引名言+解释贴合论点】\n【对比论证：正反对撞，是非立现】\n【比喻论证：抽象道理具象化】\n最忌论据与论点"两张皮"：例子讲完必须扣回论点分析。' },
    ], examples: [
      { q: '以 坚持 为中心论点，拆三个分论点。', steps: ['是什么：坚持是日复一日的专注', '为什么：坚持能拉开人与人差距', '怎么办：坚持需目标+方法+热爱', '三个分论点排比展开，结构清晰'], tip: '排比式分论点最稳' },
      { q: '举例论证最常犯的错误是？', steps: ['例子写了五六行，分析只有半句', '例后不扣论点=两张皮', '正确比例：叙例30%+分析70%'], tip: '例子为论证服务，不是凑字数' },
    ], mistakes: ['论点模棱两可（"要坚持但也别太死板"）', '只堆例子不分析（论据≠论证）'] },
  exercises: [
    { q: '议论文的三要素是？', options: ['论点论据论证', '开头正文结尾', '时间地点人物', '起因经过结果'], answer: 0, explain: '灵魂三件套' },
    { q: '中心论点最好放在？', options: ['第一段末尾，一句亮出', '文章中间', '倒数第二段', '不用写明'], answer: 0, explain: '开门见山' },
    { q: '名言警句属于？', options: ['道理论据', '事实论据', '论证方法', '分论点'], answer: 0, explain: '道理论据' },
    { q: '正反两面说理属于？', options: ['对比论证', '举例论证', '比喻论证', '道理论证'], answer: 0, explain: '正反对撞' },
    { q: '五段三分式的第2-4段各写？', options: ['一个分论点', '一个例子', '一个比喻', '一段引用'], answer: 0, explain: '段首=分论点' },
    { q: '叙例和分析的理想比例是？', options: ['叙三句析两句', '叙十句析一句', '只叙不析', '只析不叙'], answer: 0, explain: '分析证明论点' },
  ],
});

L['chn-10'] = mk({ id: 'chn-10', island: 'cross', order: 312, title: '名著导读：《红楼梦》入门', emoji: '🏮',
  subjectArea: '语文', gradeBand: 'senior', grade: 10, textbook: '统编版语文（高中必修下）',
  curriculum: { module: '整本书阅读', points: ['四大家族与主要人物', '宝黛钗情感主线', '高考常考情节与主题'] },
  story: '开谈不说红楼梦，读尽诗书也枉然。一个"白玉为堂金作马"的贾府，一群"水做的骨肉"的女儿，一场"千红一哭、万艳同悲"的大梦——高考整本书阅读的必答题，从人物关系网入门。',
  goals: ['理清四大家族与核心人物关系', '把握宝黛钗主线与关键情节', '理解悲剧主题与常考考点'],
  aiIntro: '🏮 拨动家族转盘，看四大家族与宝黛钗的关系网——《红楼梦》人物导航图！',
  lab: { params: [{ name: 'fam', label: '对象', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['fam=1 护官符四句顺口溜分别指哪家？', '宝玉和黛玉是什么亲戚关系？', '为什么说四大家族一损俱损？'],
    code: `# 红楼梦人物导航台
fam = 1   # 1四大家族 2贾宝玉 3林黛玉 4薛宝钗

hide()
t = "四大家族：贾史王薛"
d = "贾不假，白玉为堂金作马；阿房宫，三百里，住不下金陵一个史；东海缺少白玉床，龙王来请金陵王；丰年好大雪，珍珠如土金如铁。"
if fam == 2:
    t = "贾宝玉"
    d = "荣国府衔玉而生的公子。厌恶仕途经济，说女儿是水做的骨肉。与黛玉心灵相通，与宝钗金玉之说成婚。最终出家。"
if fam == 3:
    t = "林黛玉"
    d = "贾母外孙女，前世绛珠仙草还泪而来。才情第一（葬花吟），寄人篱下敏感自尊。泪尽而逝，还泪之说闭环。"
if fam == 4:
    t = "薛宝钗"
    d = "皇商之女，金锁配通灵玉（金玉良缘）。端庄周全，服冷香丸。婚而成寡，终身误。"
fill_rect(0, 128, 340, 30, "#b45309")
write(t, 0, 128, "#fff", 14)
fill_rect(0, 60, 360, 76, "#fef3c7")
write("贾家（宝玉）—史家（贾母）—王家（王熙凤）-薛家（宝钗）", 0, 78, "#b45309", 10)
write("四家联络有亲，一损俱损一荣俱荣", 0, 48, "#7c3aed", 10)
fill_rect(0, -20, 360, 66, "#f1f5f9")
write(d, 0, -20, "#0f172a", 9)
write("考点：黛玉葬花 / 宝玉挨打 / 刘姥姥进大观园 / 判词", -30, -78, "#dc2626", 10)
`,
  },
  teach: { sections: [
      { title: '四大家族', body: '【贾、史、王、薛，一门公侯一门将，两家豪商】\n护官符四句就是四家的势力名片：贾（白玉为堂）、史（阿房宫三百里）、王（东海龙王）、薛（珍珠如土）。\n四家世代联姻：贾母出史家，王夫人王熙凤出王家，薛姨妈是王夫人之妹——一张网锁死一荣俱荣。' },
      { title: '宝黛钗主线', body: '【木石前盟 vs 金玉良缘】\n黛玉=还泪的绛珠仙草，与宝玉是心灵知己（共读西厢、从不劝他考功名）。\n宝钗=金锁配玉，是家族认可的贤妻。\n高鹗续本：调包计成婚，黛玉焚稿泪尽，宝玉出家——千红一哭。' },
      { title: '高考考点', body: '【常考情节】黛玉葬花、宝玉挨打、刘姥姥三进荣国府、香菱学诗、探春理家。\n【判词】玉带林中挂（黛玉），金簪雪里埋（宝钗）。\n【主题】封建大家族的衰落史 + 青春生命的挽歌 + 对科举仕途经济的批判。' },
    ], examples: [
      { q: '木石前盟和金玉良缘各指什么？', steps: ['木石前盟：绛珠草（黛玉）还泪神瑛（宝玉）', '金玉良缘：金锁（宝钗）配通灵玉', '一个是心灵知己，一个是家族选择', '结局：金玉成婚，木石成空'], tip: '双线对撞是全书主轴' },
      { q: '判词可叹停机德，堪怜咏絮才对应谁？', steps: ['停机德：乐羊子妻劝学之德→宝钗', '咏絮才：谢道韫之才→黛玉', '答案：钗黛合一判词'], tip: '判词+画面=人物命运' },
    ], mistakes: ['把高鹗续本情节当成曹雪芹原意', '混淆黛玉宝钗的判词与象征物'] },
  exercises: [
    { q: '护官符中 白玉为堂金作马 指？', options: ['贾家', '史家', '王家', '薛家'], answer: 0, explain: '贾府豪奢' },
    { q: '黛玉的前世是？', options: ['绛珠仙草', '神瑛侍者', '警幻仙姑', '癞头和尚'], answer: 0, explain: '还泪之说' },
    { q: '金玉良缘指？', options: ['宝钗金锁配宝玉玉', '黛玉玉佩配宝玉', '史湘云金麒麟', '王熙凤凤钗'], answer: 0, explain: '薛家说法' },
    { q: '葬花吟 的作者是？', options: ['林黛玉', '薛宝钗', '史湘云', '贾探春'], answer: 0, explain: '黛玉葬花' },
    { q: '四大家族的关系是？', options: ['联姻结网一损俱损', '互相竞争', '毫无往来', '同宗同族'], answer: 0, explain: '联络有亲' },
    { q: '宝玉对仕途经济的态度是？', options: ['厌恶排斥', '积极追求', '无所谓', '听从父命应考'], answer: 0, explain: '离经叛道' },
  ],
});

/* ================= 道德与法治 +4 ================= */

L['eth-09'] = mk({ id: 'eth-09', island: 'cross', order: 313, title: '宪法：国家的根本法', emoji: '📜',
  subjectArea: '道德与法治', gradeBand: 'junior', grade: 8, textbook: '统编版道德与法治（八下）',
  curriculum: { module: '宪法专册', points: ['宪法规定根本内容', '宪法具有最高法律效力', '宪法制定和修改程序最严格'] },
  story: '一个国家法律成百上千，为什么只有一部能叫"根本法"？因为别的法律都是它的"孩子"——内容上它管最根本的事，效力上它说了算，程序上它最难改。宪法就是法律家族的"总章程"。',
  goals: ['知道宪法规定的根本内容', '理解宪法的最高法律效力', '了解宪法修改的严格程序'],
  aiIntro: '📜 拨动金字塔层级，看宪法为什么站在法律之巅——国家法治金字塔！',
  lab: { params: [{ name: 'level', label: '金字塔层级', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['level=1 宪法规定了哪些根本内容？', '普通法律能和宪法打架吗？', '为什么修宪程序要设计得这么严？'],
    code: `# 法治金字塔探索台
level = 1   # 1宪法 2法律 3行政法规

hide()
t = "宪法"
d = "规定国家最根本的问题：国家性质、根本制度、公民基本权利和义务"
e = "一切法律不得同宪法相抵触"
if level == 2:
    t = "法律"
    d = "刑法、民法典、义务教育法……依据宪法制定"
    e = "效力低于宪法、高于行政法规"
if level == 3:
    t = "行政法规、地方性法规"
    d = "国务院制定的条例、各省条例"
    e = "效力最低，越往下越具体"
fill_rect(0, 110, 260, 110, "#1d4ed8")
write(t, 0, 110, "#fff", 16)
fill_rect(0, -10, 360, 34, "#f1f5f9")
write(d, 0, -10, "#0f172a", 11)
fill_rect(0, -58, 360, 34, "#fef3c7")
write(e, 0, -58, "#b45309", 11)
write("最高法律效力：宪法 > 法律 > 行政法规", -30, -105, "#dc2626", 12)
write("修改宪法：全国人大常委会或1/5以上全国人大代表提议，全体代表2/3以上多数通过", -30, -130, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '宪法管什么', body: '【宪法规定国家生活中最根本、最重要的问题】\n国家性质（人民民主专政的社会主义国家）、根本制度（社会主义制度）、公民的基本权利和义务。\n刑法只管犯罪，民法只管民事——宪法管"国家的根"。' },
      { title: '最高法律效力', body: '【宪法是其他法律的立法基础和依据，一切法律不得同宪法相抵触】\n违反宪法的法律无效。\n宪法是一切组织和个人的根本活动准则——党也必须在宪法和法律范围内活动。' },
      { title: '修改最严格', body: '【提议：全国人大常委会或 1/5 以上全国人大代表】\n【通过：全体代表的 2/3 以上多数】\n普通法律只要过半数即可通过。\n程序越严，根本法越稳——国家根基不容轻易改动。' },
    ], examples: [
      { q: '为什么说宪法是国家的根本法？', steps: ['内容上：规定国家最根本的问题', '效力上：具有最高法律效力', '程序上：制定修改最严格', '三点齐备=根本法'], tip: '三角度答题法' },
      { q: '某地方性法规与宪法相冲突，怎么办？', steps: ['宪法具有最高法律效力', '与宪法相抵触的法规无效', '应予以改变或撤销'], tip: '宪法是最高准则' },
    ], mistakes: ['认为宪法规定国家生活中的一切具体问题（只管根本）', '认为修改宪法与修改普通法律程序相同（更严格）'] },
  exercises: [
    { q: '我国治国安邦的总章程是？', options: ['宪法', '刑法', '民法典', '义务教育法'], answer: 0, explain: '根本法' },
    { q: '宪法规定的是？', options: ['国家最根本的问题', '具体犯罪量刑', '物业收费标准', '交通规则'], answer: 0, explain: '管根本' },
    { q: '法律效力等级最高的是？', options: ['宪法', '法律', '行政法规', '地方性法规'], answer: 0, explain: '金字塔尖' },
    { q: '修改宪法须全体代表多少通过？', options: ['2/3 以上多数', '过半数', '1/3', '全体一致'], answer: 0, explain: '最严格' },
    { q: '其他法律的制定必须以什么为依据？', options: ['宪法', '刑法', '国际法', '部门规章'], answer: 0, explain: '立法基础' },
    { q: '一切组织和个人的根本活动准则是？', options: ['宪法和法律', '领导指示', '公司章程', '乡规民约'], answer: 0, explain: '依法治国' },
  ],
});

L['eth-10'] = mk({ id: 'eth-10', island: 'cross', order: 314, title: '权利与义务：一枚硬币的两面', emoji: '🪙',
  subjectArea: '道德与法治', gradeBand: 'junior', grade: 8, textbook: '统编版道德与法治（八下）',
  curriculum: { module: '公民权利义务', points: ['基本权利', '基本义务', '权利义务相统一'] },
  story: '你有权接受教育，也有义务接受义务教育；你有权上网发言，也有义务不造谣传谣。权利和义务像硬币的两面——只想要权利不想尽义务，硬币就立不起来。',
  goals: ['知道公民的基本权利与基本义务', '理解权利义务相统一', '学会依法维权和自觉履行义务'],
  aiIntro: '🪙 拨动硬币选择器，看权利背后对应的义务——公民身份双面卡！',
  lab: { params: [{ name: 'pick', label: '选择', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['受教育为什么既是权利又是义务？', 'pick=2 言论自由的边界在哪？', '权利被侵犯了该怎么办？'],
    code: `# 权利义务双面卡探索台
pick = 1   # 1受教育 2网络言论 3纳税

hide()
t = "受教育"
r = "权利：上学读书、参加考试、获得资助"
d = "义务：按时入学、完成规定年限的义务教育"
note = "既是权利又是义务的典型"
if pick == 2:
    t = "网络言论"
    r = "权利：上网发表观点、评论时事"
    d = "义务：不造谣、不传谣、不侮辱诽谤他人"
    note = "自由有边界：不得侵害他人权益"
if pick == 3:
    t = "依法纳税"
    r = "权利：享受税收提供的公共服务（道路、学校）"
    d = "义务：公民基本义务，偷税漏税违法"
    note = "税收取之于民用之于民"
fill_rect(0, 122, 320, 32, "#16a34a")
write(t, 0, 122, "#fff", 14)
fill_rect(0, 74, 360, 38, "#eff6ff")
write(r, 0, 74, "#1d4ed8", 11)
fill_rect(0, 24, 360, 38, "#fef2f2")
write(d, 0, 24, "#dc2626", 11)
fill_rect(0, -26, 360, 34, "#f1f5f9")
write(note, 0, -26, "#0f172a", 12)
write("统一性：享受权利的同时必须履行义务", -30, -72, "#7c3aed", 12)
write("维权路径：协商→调解→仲裁→诉讼", -30, -96, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '基本权利', body: '【政治权利：选举权和被选举权（基本政治权利）、言论自由】\n【人身自由：人身自由不受侵犯、人格尊严不受侵犯、住宅不受侵犯】\n【社会经济与文化权利：财产权、劳动权、物质帮助权、受教育权。\n权利不是绝对的——行使权利不得损害国家、社会、集体和他人利益。' },
      { title: '基本义务', body: '【遵守宪法法律、维护国家利益、依法服兵役、依法纳税】\n【受教育和劳动：既是权利又是义务】\n义务具有强制性——该尽不尽要承担法律责任（如家长不送孩子上学违法）。' },
      { title: '相统一原则', body: '【权利的实现需要义务的履行，义务的履行确保权利的实现】\n公民不能只享受权利不承担义务，也不能只承担义务不享受权利。\n维权四步：协商→调解→仲裁→诉讼，告而不闹、依法而行。' },
    ], examples: [
      { q: '小明的爸爸让他辍学打工，侵犯了小明什么权？', steps: ['受教育既是权利又是义务', '父亲让其辍学侵犯受教育权', '也违反义务教育法', '可求助学校、教育部门或法律'], tip: '受教育双重属性' },
      { q: '网上转发了条未经核实的谣言，违法吗？', steps: ['言论自由有边界', '造谣传谣侵害他人权益、扰乱秩序', '情节严重可构成违法犯罪', '发言先核实，转发需谨慎'], tip: '自由以不越界为前提' },
    ], mistakes: ['认为权利想怎么用就怎么用（有边界）', '认为义务可以随意放弃（具有强制性）'] },
  exercises: [
    { q: '公民的基本政治权利是？', options: ['选举权和被选举权', '受教育权', '休息权', '继承权'], answer: 0, explain: '政治权利核心' },
    { q: '既是权利又是义务的是？', options: ['受教育', '休息', '选举', '申诉'], answer: 0, explain: '双重属性' },
    { q: '纳税属于公民的？', options: ['基本义务', '基本权利', '道德要求', '个人选择'], answer: 0, explain: '法定义务' },
    { q: '行使权利的边界是？', options: ['不得损害他人和公共利益', '没有边界', '看心情', '只受道德约束'], answer: 0, explain: '自由有度' },
    { q: '权利被侵犯时应当？', options: ['依法维权', '以牙还牙', '忍气吞声', '网上曝光泄愤'], answer: 0, explain: '协商→调解→仲裁→诉讼' },
    { q: '权利和义务的关系是？', options: ['相统一', '互相对立', '毫无关系', '先有权利'], answer: 0, explain: '硬币两面' },
  ],
});

L['eth-11'] = mk({ id: 'eth-11', island: 'cross', order: 315, title: '基本国情与国家制度', emoji: '🏛️',
  subjectArea: '道德与法治', gradeBand: 'junior', grade: 9, textbook: '统编版道德与法治（九上）',
  curriculum: { module: '国情国策', points: ['基本经济制度', '根本政治制度', '基本政治制度'] },
  story: '中国这辆高速列车靠什么制度引擎？公有制当"主引擎"、多种所有制一起发力；人民代表大会当"总方向盘"；多党合作、民族区域自治、基层群众自治做"悬挂系统"。一套制度，环环相扣。',
  goals: ['知道我国的基本经济制度', '理解人民代表大会制度', '了解三项基本政治制度'],
  aiIntro: '🏛️ 拨动制度楼层，看国家制度大厦怎么搭——国情制度导航图！',
  lab: { params: [{ name: 'layer', label: '制度楼层', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['layer=2 全国人民代表大会的职权有哪些？', '公有制为主体是什么意思？', '基层群众自治举例？'],
    code: `# 国家制度大厦探索台
layer = 1   # 1根本制度 2根本政治制度 3基本政治制度

hide()
t = "根本制度：社会主义制度"
d = "国家的根本制度，其他制度的基础"
e = "宪法第一条确立"
if layer == 2:
    t = "根本政治制度：人民代表大会制度"
    d = "人民选代表→代表组成人民代表大会→代表人民行使国家权力"
    e = "全国人大是最高国家权力机关：立法权、决定权、任免权、监督权"
if layer == 3:
    t = "基本政治制度（三项）"
    d = "中国共产党领导的多党合作和政治协商制度；民族区域自治制度；基层群众自治制度"
    e = "村委会、居委会=基层群众自治组织"
fill_rect(0, 122, 340, 34, "#dc2626")
write(t, 0, 122, "#fff", 12)
fill_rect(0, 70, 360, 40, "#f1f5f9")
write(d, 0, 70, "#0f172a", 11)
fill_rect(0, 14, 360, 44, "#fef3c7")
write(e, 0, 14, "#b45309", 10)
write("经济基础：公有制为主体、多种所有制经济共同发展", -30, -40, "#16a34a", 11)
write("按劳分配为主体、多种分配方式并存", -30, -64, "#0369a1", 10)
write("市场经济体制：市场决定性作用 + 政府宏观调控", -30, -88, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '基本经济制度', body: '【公有制为主体、多种所有制经济共同发展】\n【按劳分配为主体、多种分配方式并存】\n【社会主义市场经济体制】\n公有制经济：国有经济（国民经济命脉）+集体经济；非公有制经济：个体、私营、外资——是社会主义市场经济的重要组成部分。' },
      { title: '人民代表大会制度', body: '【根本政治制度：国家的一切权力属于人民】\n路径：人民→选举人大代表→组成各级人民代表大会→产生"一府一委两院"（政府、监委、法院、检察院）。\n全国人大是最高国家权力机关，行使立法权、决定权、任免权、监督权。' },
      { title: '基本政治制度', body: '【中国共产党领导的多党合作和政治协商制度】八字方针：长期共存、互相监督、肝胆相照、荣辱与共。\n【民族区域自治制度】五个自治区，既保证国家统一又保障少数民族当家作主。\n【基层群众自治制度】村委会、居委会——群众自我管理、自我服务。' },
    ], examples: [
      { q: '全国人民代表大会和"一府一委两院"是什么关系？', steps: ['人大是权力机关，由它产生其他机关', '其他机关对人大负责、受人大监督', '不是平级并列，是产生与被产生'], tip: '权力来源一条线' },
      { q: '国有经济和私营经济分别什么地位？', steps: ['国有经济：国民经济命脉，主导力量', '私营经济：市场经济的重要组成部分', '毫不动摇巩固公有制 + 毫不动摇鼓励支持引导非公经济'], tip: '两个毫不动摇' },
    ], mistakes: ['认为人大和政府是平级机关（政府由人大产生）', '认为非公有制经济是补充（是重要组成部分）'] },
  exercises: [
    { q: '我国的根本政治制度是？', options: ['人民代表大会制度', '多党合作制', '民族区域自治', '基层自治'], answer: 0, explain: '根本政治制度' },
    { q: '最高国家权力机关是？', options: ['全国人民代表大会', '国务院', '最高人民法院', '国家主席'], answer: 0, explain: '一切权力属于人民' },
    { q: '我国经济制度的基础是？', options: ['公有制', '私有制', '混合所有制', '外资经济'], answer: 0, explain: '公有制为主体' },
    { q: '下列属于基本政治制度的是？', options: ['民族区域自治制度', '人民代表大会制度', '社会主义制度', '世袭制'], answer: 0, explain: '三项基本政治制度之一' },
    { q: '村委会属于？', options: ['基层群众自治组织', '政府机关', '政党组织', '司法机关'], answer: 0, explain: '村民自我管理' },
    { q: '非公有制经济的地位是？', options: ['市场经济重要组成部分', '国民经济主导力量', '社会主义经济基础', '可有可无'], answer: 0, explain: '重要组成部分' },
  ],
});

L['eth-12'] = mk({ id: 'eth-12', island: 'cross', order: 316, title: '网络安全小卫士', emoji: '🛡️',
  subjectArea: '道德与法治', gradeBand: 'primary', grade: 5, textbook: '统编版道德与法治（五年级）',
  curriculum: { module: '安全自护', points: ['保护个人信息', '识别网络陷阱', '拒绝网络欺凌'] },
  story: '陌生"阿姨"加好友送游戏皮肤，点还是不点？班级群里有人被起外号嘲笑，笑还是帮？网络世界很大也很好玩，但小卫士的三件法宝要随身带：护信息、辨陷阱、反欺凌。',
  goals: ['知道哪些个人信息不能泄露', '会识别常见网络陷阱', '学会应对网络欺凌'],
  aiIntro: '🛡️ 拨动场景选择器，看小卫士怎么闯关——网络安全大挑战！',
  lab: { params: [{ name: 'scene', label: '场景', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['scene=1 哪些信息属于个人隐私？', '免费皮肤链接为什么危险？', '看到同学被网络欺负该怎么办？'],
    code: `# 网络小卫士闯关台
scene = 1   # 1信息保护 2陌生链接 3网络欺凌

hide()
t = "关卡一：个人信息保卫战"
q = "网友问你叫什么、住哪里、读几年级"
a = "姓名、住址、学校、电话、照片都是隐私，一律不透露"
if scene == 2:
    t = "关卡二：免费皮肤陷阱"
    q = "扫码领皮肤，先填爸爸妈妈的银行卡号"
    a = "天上不会掉皮肤！链接不点、二维码不扫、密码不给"
if scene == 3:
    t = "关卡三：面对网络欺凌"
    q = "群里有人给同学起难听外号还嘲笑他"
    a = "不围观不起哄，告诉老师和家长，截图留证据"
fill_rect(0, 122, 340, 32, "#16a34a")
write(t, 0, 122, "#fff", 13)
fill_rect(0, 72, 360, 40, "#fef3c7")
write("情境：" + q, 0, 72, "#b45309", 11)
fill_rect(0, 14, 360, 50, "#eff6ff")
write("小卫士做法：" + a, 0, 14, "#1d4ed8", 11)
write("三件法宝：护信息 · 辨陷阱 · 反欺凌", -30, -46, "#dc2626", 12)
write("上网时间约定好，遇到坏事找大人", -30, -72, "#0369a1", 11)
`,
  },
  teach: { sections: [
      { title: '个人信息保卫战', body: '【姓名、住址、学校、电话、照片、密码——六大隐私不外泄】\n网友要照片、问住址，礼貌拒绝：这个不能告诉你。\n密码只告诉爸爸妈妈，连最好的同学也不共享。' },
      { title: '识别网络陷阱', body: '【免费皮肤/中奖信息/扫码领红包——天上不掉馅饼】\n三不原则：链接不点、二维码不扫、银行卡号和验证码不给任何人。\n真中奖不会让你先交钱——让你先掏钱的就是骗子。' },
      { title: '拒绝网络欺凌', body: '【起侮辱性外号、发照片嘲笑、孤立同学都是网络欺凌】\n被欺负了：不删记录先截图→告诉老师和家长→必要时报警。\n看到别人被欺负：不围观、不起哄、转发扩散也是参与欺凌。\n网络不是法外之地，键盘也能伤人。' },
    ], examples: [
      { q: '游戏里有人私聊：告诉我你家地址，送你限量皮肤。怎么办？', steps: ['识别：用隐私换礼物=陷阱', '拒绝透露住址', '拉黑举报此人', '告诉爸爸妈妈'], tip: '隐私永远不换' },
      { q: '同学在群里被起了难听外号，大家都在笑。你该？', steps: ['不跟着笑、不转发', '私下安慰这位同学', '截图留证据告诉老师', '提醒群友这是网络欺凌'], tip: '沉默的围观也是伤害' },
    ], mistakes: ['认为网上说话不用负责任', '把验证码告诉"客服"（银行工作人员也不会要）'] },
  exercises: [
    { q: '下列属于个人隐私的是？', options: ['家庭住址', '天气预报', '课程表', '公交车路线'], answer: 0, explain: '住址不外泄' },
    { q: '扫码免费领皮肤，正确做法是？', options: ['不理睬不扫码', '马上扫', '让同学先扫', '扫了再说'], answer: 0, explain: '天上不掉馅饼' },
    { q: '被网友欺负了第一步是？', options: ['截图保留证据', '删掉记录', '骂回去', '换账号'], answer: 0, explain: '证据很重要' },
    { q: '谁也不能索要的验证码是？', options: ['银行卡短信验证码', '课程验证码', '游戏登录码', 'Wi-Fi 密码'], answer: 0, explain: '验证码=钱' },
    { q: '看到同学被网络欺凌应该？', options: ['告诉老师并安慰同学', '围观起哄', '截图转发', '装作没看见'], answer: 0, explain: '不做旁观者' },
    { q: '上网时间应该？', options: ['和爸爸妈妈约定好', '想上多久上多久', '通宵玩', '上课偷偷玩'], answer: 0, explain: '健康用网' },
  ],
});

/* ================= 写入 ================= */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第38轮A批写入 ${n} 节：${Object.keys(L).join(', ')}`);
