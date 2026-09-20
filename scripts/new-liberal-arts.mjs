import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第36轮·文科+信息+科学扩容 +18 课 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

/* ================= 语文 +6 ================= */

L['chn-01'] = mk({ id: 'chn-01', island: 'cross', order: 271, title: '文言文入门：《狼》', emoji: '🐺',
  subjectArea: '语文', gradeBand: 'junior', grade: 7, textbook: '统编版语文（初中）',
  curriculum: { module: '阅读与鉴赏', points: ['文言词语：缀/敌/顾/犬坐', '屠户心理变化线', '狼的贪婪狡诈形象'] },
  story: '一屠晚归，担中肉尽，止有剩骨。路遇两狼，缀行甚远——蒲松龄用不到三百字写尽人与狼的生死对峙。读懂它，文言文的钥匙就在你手里。',
  goals: ['掌握重点文言词语', '理清屠户的心理与行动线', '理解狼的象征意义'],
  aiIntro: '🐺 拖动情节阶段，看屠户从恐惧到觉醒的心理弧线——文言文也能"可视化"！',
  lab: { params: [{ name: 'phase', label: '情节阶段', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['每个阶段屠户的心情是什么？', '两狼的计谋在哪一步暴露？', '"止露尻尾"说明什么？'],
    code: `# 《狼》情节探索台
phase = 1   # 1遇狼 2惧狼 3御狼 4杀狼

hide()
titles = ["遇狼：缀行甚远", "惧狼：投以骨", "御狼：奔倚其下", "杀狼：刀劈狼首"]
moods = ["紧张：担中肉尽，两狼尾随", "恐惧又抱侥幸：一骨止一狼，一狼又至", "醒悟：屠暴起，恐前后受其敌", "决断：自后断其股，亦毙之"]
quotes = ["途中两狼，缀行甚远。", "复投之，后狼止而前狼又至。", "屠乃奔倚其下，弛担持刀。", "屠暴起，以刀劈狼首，又数刀毙之。"]
i = 0
while i < 4:
    y = 100 - i * 60
    col = "#e2e8f0"
    if i + 1 == phase:
        col = "#fde68a"
    fill_rect(0, y, 380, 46, col)
    write(titles[i], -140, y + 8, "#0f172a", 11)
    i = i + 1
write(quotes[phase - 1], 0, -80, "#dc2626", 13)
write(moods[phase - 1], 0, -110, "#1d4ed8", 11)
write("屠户弧线：惧 → 退 → 醒 → 勇", -30, 150, "#16a34a", 12)
write("启示：像狼一样的恶势力，退让换不来安全", -100, 130, "#ea580c", 11)
`,
  },
  teach: { sections: [
      { title: '重点词语', body: '【缀(zhuì)行：紧跟；敌：攻击；顾：回头看；犬坐：像狗一样蹲坐；意暇甚：神情很悠闲；股：大腿】\n"其一犬坐于前"的"犬"是名词作状语（像狗那样）。\n"止有剩骨"的"止"通"只"。' },
      { title: '情节与心理', body: '【遇狼（紧张）→ 惧狼（恐惧侥幸）→ 御狼（丢幻想、准备反抗）→ 杀狼（果断勇敢）】\n屠户的心理是全篇的暗线。\n狼的"一狼假寐，一狼洞其中"体现狡诈分工。' },
      { title: '主旨', body: '【对待像狼一样的恶势力，不能存幻想，必须敢于斗争、善于斗争】\n"狼亦黠矣，而顷刻两毙"——禽兽之变诈几何哉？止增笑耳。\n蒲松龄借狼讽喻人间的贪婪狡诈者。' },
    ], examples: [
      { q: '翻译："少时，一狼径去，其一犬坐于前。"', steps: ['少时：一会儿', '径去：径直离开', '犬坐：像狗一样蹲坐', '译：一会儿，一只狼径直离开，另一只像狗一样蹲坐在前面'], tip: '"犬"在这里是名词作状语' },
      { q: '"一狼洞其中"的"洞"是什么用法？', steps: ['洞原本是名词（洞穴）', '这里后接"其中"（在其中）', '名词活用为动词：打洞', '"意将隧入以攻其后也"印证'], tip: '名词+宾语时往往活用为动词' },
    ], mistakes: ['"犬坐"理解为"狗坐着"（是像狗那样蹲坐）', '忽略"洞"的词类活用'] },
  exercises: [
    { q: '"缀行甚远"的"缀"意思是？', options: ['连接/紧跟', '缀饰', '停止', '奔跑'], answer: 0, explain: '紧跟不舍' },
    { q: '"恐前后受其敌"的"敌"意思是？', options: ['攻击', '敌人', '对抗', '仇视'], answer: 0, explain: '名词活用为动词：攻击' },
    { q: '"其一犬坐于前"的"犬"是？', options: ['名词作状语（像狗那样）', '就是狗', '名词', '动词'], answer: 0, explain: '修饰"坐"的方式' },
    { q: '狼"假寐"的目的是？', options: ['麻痹屠户暗中偷袭', '真的累了', '等同伴', '吃骨头'], answer: 0, explain: '"意暇甚"是伪装' },
    { q: '本文给我们的启示是？', options: ['对恶势力不能存幻想', '遇事就跑', '动物都很坏', '少走夜路'], answer: 0, explain: '敢于并善于斗争' },
    { q: '"止增笑耳"表达作者怎样的态度？', options: ['对恶者的嘲笑蔑视', '同情狼', '赞叹狼', '悲伤'], answer: 0, explain: '禽兽之变诈不过如此' },
  ],
});

L['chn-02'] = mk({ id: 'chn-02', island: 'cross', order: 272, title: '说明文阅读：说清事物的方法', emoji: '📖',
  subjectArea: '语文', gradeBand: 'junior', grade: 8, textbook: '统编版语文（初中）',
  curriculum: { module: '阅读与鉴赏', points: ['说明文四种说明顺序', '常见说明方法及作用', '说明文语言的准确性'] },
  story: '为什么你一眼就能看懂说明书，却读不进百科词条？秘密在于说明的方法：列数字、打比方、作比较……让抽象变具体、陌生变熟悉。',
  goals: ['识别四种说明顺序', '掌握常见说明方法及答题格式', '体会说明文语言的准确性'],
  aiIntro: '📖 拖动说明方法，看同一个知识点怎样变得更好懂！',
  lab: { params: [{ name: 'method', label: '说明方法', min: 1, max: 4, step: 1, value: 2 }],
    grid: false, explore: ['哪种方法最直观？哪种最精确？', '"约""左右"等词为什么不能删？', '时间顺序适合说明什么？'],
    code: `# 说明方法对比台
method = 2   # 1列数字 2打比方 3作比较 4举例子

hide()
topic = "珠穆朗玛峰有多高"
texts = ["珠峰海拔8848.86米，是世界第一高峰。", "珠峰像大地撑向天空的一根巨柱。", "珠峰比第二高峰乔戈里峰高233米。", "例如2020年测量队用GNSS卫星测得珠峰雪面高度。"]
mnames = ["列数字", "打比方", "作比较", "举例子"]
effects = ["精确可信", "生动形象', '突出特点", "具体可感"]
write(topic + "？", 0, 140, "#0f172a", 14)
fill_rect(0, 70, 400, 60, "#fef3c7")
write(mnames[method - 1], -150, 90, "#b45309", 12)
write(texts[method - 1], 20, 65, "#1d4ed8", 11)
write("作用：使说明" + "更" + effects[method - 1], 0, 0, "#16a34a", 12)
write("答题格式：运用了××方法，具体准确/生动形象地说明了……", -100, -50, "#dc2626", 11)
write("语言准确：约、左右、大约——体现严谨", -80, -80, "#0369a1", 11)
write("四顺序：时间·空间·逻辑（由浅入深/由主到次）", -110, -110, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '说明顺序', body: '【时间顺序（制作过程）、空间顺序（建筑由外到内）、逻辑顺序（由浅入深/由因到果/由主到次）】\n《中国石拱桥》由一般到个别——逻辑顺序经典。\n判断方法：找出段落间的推进关系。' },
      { title: '说明方法', body: '【列数字（精确）、打比方（生动）、作比较（突出）、举例子（具体）、分类别（条理）、下定义（本质）、列图表（直观）】\n答题格式：运用了××说明方法，+ 作用 + 具体说明了××。' },
      { title: '语言的准确性', body: '【"约""大概""之一"等词体现严谨】\n"可能是目前已知最大的"——"目前已知"说明结论随科学进步可能更新。\n删去这些词就变成绝对化，反而不科学。' },
    ], examples: [
      { q: '"桥宽约8米"中的"约"能否删去？为什么？', steps: ['不能删', '"约"表示估计值而非精确测量', '删去后变成绝对精确的说法', '体现了说明文语言的准确性和严谨性'], tip: '格式：不能+词义+删后效果+体现准确性' },
      { q: '指出"石拱桥的桥洞成弧形，就像虹"用了什么方法及作用。', steps: ['把桥洞比作虹', '是打比方', '生动形象地说明了桥洞弧形的特点', '增强文章的趣味性'], tip: '先判断方法再答作用' },
    ], mistakes: ['把"打比方"说成"比喻"（说明文术语是打比方）', '答作用时脱离具体内容空谈'] },
  exercises: [
    { q: '"赵州桥非常雄伟，全长50.82米"用了？', options: ['列数字', '打比方', '作比较', '举例子'], answer: 0, explain: '精确数据' },
    { q: '"桥洞像虹"用了？', options: ['打比方', '列数字', '分类别', '下定义'], answer: 0, explain: '说明文中的比喻叫打比方' },
    { q: '"其中一个石狮子有3米高"中"其中一个"体现？', options: ['语言准确', '啰嗦', '不严谨', '文学性'], answer: 0, explain: '限定范围避免绝对化' },
    { q: '介绍一间教室的布局应用？', options: ['空间顺序', '时间顺序', '逻辑顺序', '任意'], answer: 0, explain: '由前到后/由左到右' },
    { q: '语言准确性类题的答题第一步是？', options: ['表明不能删', '解释词义', '分析删后效果', '总结'], answer: 0, explain: '先亮观点再分析' },
    { q: '下列最适合"分类别"说明的是？', options: ['图书馆的书按类别排放', '某人的身高', '一座桥的外观', '一天的气温变化'], answer: 0, explain: '分类别需要多个类别' },
  ],
});

L['chn-03'] = mk({ id: 'chn-03', island: 'cross', order: 273, title: '记叙文写作：讲好一件事', emoji: '✏️',
  subjectArea: '语文', gradeBand: 'junior', grade: 7, textbook: '统编版语文（初中）',
  curriculum: { module: '表达与交流', points: ['记叙文六要素', '详略与线索', '开头结尾的写法'] },
  story: '同样是"难忘的一件事"，有人写得让人落泪，有人写得像流水账。差别不在经历，在笔法：六要素齐全、详略得当、以小见大。',
  goals: ['掌握记叙文六要素', '学会安排详略和线索', '会写引人入胜的开头结尾'],
  aiIntro: '✏️ 拖动详略分配，看同一件事怎样"提味"——详略就是厨艺的盐！',
  lab: { params: [{ name: 'focus', label: '详写部分', min: 1, max: 4, step: 1, value: 3 }],
    grid: false, explore: ['开头略写有什么好处？', '高潮为什么必须详写？', '"以小见大"怎样体现？'],
    code: `# 记叙文详略探索台
focus = 3   # 详写哪个环节

hide()
parts = ["起因（略写）", "经过开端（较详）", "高潮冲突（详写）", "结局收束（略写）"]
heights = [40, 70, 130, 45]
colors = ["#94a3b8", "#60a5fa", "#f59e0b", "#94a3b8"]
i = 0
while i < 4:
    x = -140 + i * 95
    h = heights[i]
    if i + 1 == focus:
        h = h + 20
    fill_rect(x, -40 + h / 2, 70, h, colors[i])
    write(parts[i], x, -60, "#475569", 9)
    i = i + 1
write("高潮详写 = 情感核心", 0, 140, "#dc2626", 12)
write("六要素：时间·地点·人物·起因·经过·结果", -50, 115, "#1d4ed8", 11)
if focus == 3:
    write("高潮处多写动作·语言·心理", -40, -100, "#16a34a", 11)
if focus == 1:
    write("开头交代背景即可，不宜过长", -60, -100, "#0369a1", 10)
write("开头法：开门见山·悬念·环境渲染·对话切入", -90, -130, "#7c3aed", 10)
write("结尾法：点题升华·首尾呼应·留白余味", -70, -155, "#b45309", 10)
`,
  },
  teach: { sections: [
      { title: '六要素与线索', body: '【时间、地点、人物、起因、经过、结果】\n线索：贯穿全文的一条线（一件物品、一种情感、一句话）。\n《背影》以"背影"为线索四次出现——首尾呼应。' },
      { title: '详略安排', body: '【与中心密切相关的内容详写，其余略写】\n高潮（冲突爆发点、情感最浓处）必须详写：放慢镜头，写动作/语言/神态/心理。\n开头交代背景要快，结尾点题收束要有力。' },
      { title: '开头与结尾', body: '【开头：开门见山/悬念/环境渲染/对话切入】【结尾：点题升华/首尾呼应/留白余味】\n"那是我最难忘的一个冬天"→开门见山。\n结尾忌喊口号：用细节和画面收，不用议论堆。' },
    ], examples: [
      { q: '写"运动会上的拼搏"，哪些内容应详写？', steps: ['起因（报名）略写', '准备过程可较详', '比赛冲刺瞬间（高潮）必须详写：慢镜头写动作呼吸心跳', '结果和感想略写点题'], tip: '问自己：哪一刻情感最强？那就是详写点' },
      { q: '以"妈妈的白发"为线索写作，怎样设计？', steps: ['开头：不经意发现一根白发（悬念）', '中间：回忆操劳片段（白发隐现）', '高潮：生病守夜，月光下满头白发', '结尾：握住那缕白发，懂得了爱——首尾呼应'], tip: '线索物品要反复出现才有贯穿力' },
    ], mistakes: ['流水账（所有环节平均用力）', '结尾喊口号式议论'] },
  exercises: [
    { q: '记叙文六要素不包括？', options: ['议论', '时间', '人物', '结果'], answer: 0, explain: '议论是表达方式不是要素' },
    { q: '与中心关系最密切的部分应？', options: ['详写', '略写', '不写', '放最后'], answer: 0, explain: '详略由中心决定' },
    { q: '"背影"在全文四次出现，是？', options: ['线索', '巧合', '主角', '环境'], answer: 0, explain: '贯穿全文的线索' },
    { q: '高潮部分应重点写？', options: ['动作·语言·心理', '天气', '历史背景', '别人的事'], answer: 0, explain: '放慢镜头细描' },
    { q: '最好的结尾方式是？', options: ['用细节和画面呼应开头', '大声喊口号', '总结陈词', '戛然而止'], answer: 0, explain: '含蓄有力，忌空喊' },
    { q: '"那是我最难忘的一个冬天"是什么开头？', options: ['开门见山', '悬念', '对话', '环境渲染'], answer: 0, explain: '直接入题' },
  ],
});

L['chn-04'] = mk({ id: 'chn-04', island: 'cross', order: 274, title: '古诗赏析：送别与思乡', emoji: '🌅',
  subjectArea: '语文', gradeBand: 'junior', grade: 7, textbook: '统编版语文（初中）',
  curriculum: { module: '阅读与鉴赏', points: ['送别诗常见意象', '思乡诗的情感表达', '炼字与画面想象'] },
  story: '"劝君更尽一杯酒，西出阳关无故人""举头望明月，低头思故乡"——离别和乡愁是古人写得最多的主题。柳、月、酒、雁，都是它们的信使。',
  goals: ['认识送别/思乡诗的常见意象', '会分析情感与画面', '掌握炼字题的答题思路'],
  aiIntro: '🌅 拖动意象组合，看它们各自传递怎样的离愁与乡思！',
  lab: { params: [{ name: 'image', label: '意象选择', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['柳为什么和离别有关？', '月最能触发什么情感？', '雁为什么指向思乡？'],
    code: `# 古诗意象探索台
image = 1   # 1柳 2月 3雁 4酒

hide()
emojis = ["🌿", "🌕", "🦢", "🍶"]
names = ["柳", "月", "雁", "酒"]
reasons = ["柳谐音留：折柳赠别挽留不舍", "千里共婵娟：月圆人缺触发思念", "雁足传书+秋季南飞：游子归心", "把酒话别：一杯浊酒尽余欢"]
poems = ["此夜曲中闻折柳，何人不起故园情", "举头望明月，低头思故乡", "乡书何处达？归雁洛阳边", "劝君更尽一杯酒，西出阳关无故人"]
circle(0, 50, 40, "#fef3c7")
write(emojis[image - 1], 0, 50, "#0f172a", 28)
write(names[image - 1], 0, 110, "#dc2626", 16)
write(reasons[image - 1], 0, -20, "#1d4ed8", 12)
write(poems[image - 1], 0, -60, "#7c3aed", 12)
write("意象 = 客观物 + 主观情：读懂意象就读懂了诗", -100, -110, "#16a34a", 11)
write("炼字题：字义 → 画面 → 情感", -30, -135, "#ea580c", 11)
`,
  },
  teach: { sections: [
      { title: '送别诗意象', body: '【柳（谐音"留"，折柳赠别）、酒（饯别）、长亭（送别之地）、夕阳（离别时分）】\n情感：不舍、牵挂、祝福、乐观勉励。\n《送元二使安西》"西出阳关无故人"——深挚关怀。' },
      { title: '思乡诗意象', body: '【月（千里共望）、雁（传书+季候）、鸿雁、杜鹃、故乡水】\n触发：佳节、孤眠、闻笛、见月。\n"春风又绿江南岸，明月何时照我还"——绿字之妙+月之问。' },
      { title: '答题方法', body: '【意象分析：物 → 关联义 → 情感】【炼字：字义 → 描绘画面 → 传达情感】\n"绿"字妙在：形容词作动词，写出春风吹绿江南的动态画面，暗含思归之切。\n先译后析，紧扣诗中具体句。' },
    ], examples: [
      { q: '分析"乡书何处达？归雁洛阳边"中"雁"的作用。', steps: ['雁是候鸟，秋季南飞', '古人认为雁足可以传书', '诗人借归雁寄托传书回乡的渴望', '含蓄表达了浓浓的思乡之情'], tip: '意象题模板：物+关联义+情感' },
      { q: '"春风又绿江南岸"的"绿"字好在哪里？', steps: ['"绿"本是形容词，这里作动词（吹绿）', '化静为动：春风掠过、江南渐绿的画面感扑面而来', '暗示时光流逝又是一年', '反衬诗人无法归家的焦灼'], tip: '炼字三步：词义→画面→情感' },
    ], mistakes: ['只翻译不加分析', '意象的情感答成"很开心"（送别思乡多离愁）'] },
  exercises: [
    { q: '"柳"与离别相关是因为？', options: ['谐音"留"', '柳树好看', '柳枝长', '随口约定'], answer: 0, explain: '折柳=挽留' },
    { q: '"举头望明月"中月的意象指向？', options: ['思乡', '战争', '丰收', '考试'], answer: 0, explain: '千里共婵娟' },
    { q: '"归雁洛阳边"的雁寄托了？', options: ['传书回乡的渴望', '对雁的喜爱', '春天的到来', '旅行计划'], answer: 0, explain: '雁足传书典故' },
    { q: '炼字题的第一步是？', options: ['解释字义', '抄写全诗', '谈感受', '背意象'], answer: 0, explain: '先明字义再析画面' },
    { q: '"绿"字妙在形容词活用为？', options: ['动词', '名词', '副词', '量词'], answer: 0, explain: '"吹绿"的动态感' },
    { q: '送别诗的情感基调通常是？', options: ['不舍与祝福', '欢快', '愤怒', '恐惧'], answer: 0, explain: '离愁+牵挂+勉励' },
  ],
});

L['chn-05'] = mk({ id: 'chn-05', island: 'cross', order: 275, title: '修改病句：语法的体检', emoji: '🔧',
  subjectArea: '语文', gradeBand: 'junior', grade: 8, textbook: '统编版语文（初中）',
  curriculum: { module: '表达与交流', points: ['常见病句六大类型', '修改病句的原则', '缩句法找主干'] },
  story: '"通过这次活动，使我明白了坚持的重要性。"——这句话错在哪？缺主语！病句就像文章的感冒，一查一个准。六大类型+缩句法，你就是自己的语法医生。',
  goals: ['识别六大常见病句类型', '会用缩句法找主干问题', '掌握修改原则（保持原意/最小改动）'],
  aiIntro: '🔧 拖动病句类型，看典型的"症状"长什么样——学会给句子做体检！',
  lab: { params: [{ name: 'type', label: '病句类型', min: 1, max: 6, step: 1, value: 1 }],
    grid: false, explore: ['"通过……使……"为什么缺主语？', '怎样快速判断搭配不当？', '修改病句的铁原则是什么？'],
    code: `# 病句六大类型探索台
type = 1   # 病句类型

hide()
types = ["成分残缺", "搭配不当", "语序不当", "重复啰嗦", "前后矛盾", "句式杂糅"]
examples = ["通过这次活动，使我明白了道理。（缺主语）", "我们要养成认真学习。（缺宾语中心语）", "我们讨论并听取了报告。（先听后讨论才对）", "大约有50名左右的学生。（大约与左右重复）", "这场雨大概肯定不会下了。（大概≠肯定）", "原因是……造成的。（杂糅）"]
fixes = ["删'通过'或'使'", "加'的习惯'", "改为'听取并讨论'", "删'大约'或'左右'", "删'大概'或'肯定'", "删'原因'或'造成的'"]
fill_rect(0, 100, 400, 50, "#fef3c7")
write(types[type - 1], -140, 118, "#b45309", 13)
write(examples[type - 1], 20, 88, "#1d4ed8", 10)
write("✏️ " + fixes[type - 1], 0, 20, "#16a34a", 12)
write("缩句法：去掉修饰语看主干，主谓宾齐不齐、搭不搭", -80, -30, "#dc2626", 11)
write("铁原则：保持原意·改动最小·对症下药", -50, -60, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '六大病句类型', body: '【①成分残缺（通过/使淹没主语）②搭配不当（养成…习惯不能缺"习惯"）③语序不当（先听后议）④重复啰嗦（大约…左右）⑤前后矛盾（大概…肯定）⑥句式杂糅（原因是…造成的）】\n每种类型记住一个典型例句即可举一反三。' },
      { title: '缩句法', body: '【去掉定语状语补语，只留主谓宾主干】\n"通过这次使我终身难忘的活动，我明白了道理"→缩成"我明白了道理"（主谓宾齐全则不缺成分）。\n"我们养成了认真学习"→"养成了学习"，"养成"缺宾语中心语"习惯"。' },
      { title: '修改原则', body: '【①保持原句基本意思 ②改动尽可能小 ③一处一改不"伤筋动骨"】\n修改后要把句子完整读一遍，确认通顺且未改变原意。\n考试中修改符号规范也要注意。' },
    ], examples: [
      { q: '修改病句："通过这次社会实践活动，使我们对劳动有了新的认识。"', steps: ['缩句：使…有了认识（谁有了认识？没有主语）', '"通过"和"使"都是介词结构，淹没主语', '删去"通过"或"使"任一个', '改后：这次社会实践活动使我们对劳动有了新的认识 ✓'], tip: '"通过……使……"是缺主语的高频标志' },
      { q: '修改："他的写作水平明显改善了。"', steps: ['缩句：水平改善了', '"水平"与"改善"搭配不当', '"提高"才能配"水平"', '改为：写作水平明显提高了'], tip: '水平→提高；生活→改善' },
    ], mistakes: ['把对的改错（修改要保持原意）', '不加分析乱删词'] },
  exercises: [
    { q: '"通过…使…"句型的问题是？', options: ['缺主语', '重复', '杂糅', '语序不当'], answer: 0, explain: '介词结构淹没主语' },
    { q: '"大约有50名左右"犯了？', options: ['重复啰嗦', '缺主语', '矛盾', '搭配不当'], answer: 0, explain: '大约与左右同义重复' },
    { q: '"原因是停电造成的"是？', options: ['句式杂糅', '语序不当', '缺宾语', '矛盾'], answer: 0, explain: '"原因是…"与"…造成的"两套糅在一起' },
    { q: '修改"我们讨论并听取了报告"应？', options: ['调为"听取并讨论"', '删"报告"', '加"认真"', '删"并"'], answer: 0, explain: '逻辑上先听取后讨论' },
    { q: '"这场雨大概肯定不会下了"的矛盾在于？', options: ['大概与肯定冲突', '雨不可能停', '时态不对', '没有矛盾'], answer: 0, explain: '推测词与肯定词同用' },
    { q: '修改病句的铁原则不包括？', options: ['尽量换一种全新的说法', '保持原意', '改动最小', '对症下药'], answer: 0, explain: '大改反而丢分' },
  ],
});

L['chn-06'] = mk({ id: 'chn-06', island: 'cross', order: 276, title: '名著导读：《西游记》', emoji: '🐒',
  subjectArea: '语文', gradeBand: 'junior', grade: 7, textbook: '统编版语文（初中）',
  curriculum: { module: '名著导读', points: ['孙悟空的成长弧线', '取经团队的协作', '浪漫主义手法'] },
  story: '从大闹天宫的叛逆者到斗战胜佛——孙悟空的五百年的成长，像极了每个人的青春期。八十一难难难不同，其实都在降同一颗心：自己的心。',
  goals: ['理清孙悟空的成长弧线', '分析师徒四人的团队角色', '欣赏浪漫主义的想象艺术'],
  aiIntro: '🐒 拖动取经阶段，看悟空从"妖"到"佛"的心路成长线！',
  lab: { params: [{ name: 'stage', label: '取经阶段', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['悟空最大的变化发生在什么时候？', '团队中每人不可替代的作用？', '八十一难的象征意义？'],
    code: `# 西游记成长探索台
stage = 1   # 1大闹天宫 2五行山下 3取经初期 4斗战胜佛

hide()
stages = ["大闹天宫（叛逆自我）", "五行山下（沉淀反思）", "取经路上（磨砺担当）", "斗战胜佛（圆融成熟）"]
moods = ["我是齐天大圣！天也不服！", "五百年风吹雨打，静思己过", "师父有难，俺老孙来也！", "心猿归正，功成正果"]
emojis = ["😤", "🏔", "🐒", "🙏"]
write(emojis[stage - 1], 0, 60, "#0f172a", 36)
fill_rect(0, 0, 380, 40, "#fef3c7")
write(stages[stage - 1], 0, 0, "#b45309", 12)
write(moods[stage - 1], 0, -50, "#1d4ed8", 12)
write("成长弧线：桀骜 → 沉淀 → 担当 → 成熟", -60, 140, "#16a34a", 12)
write("团队：唐僧（信念）·悟空（能力）·八戒（烟火气）·沙僧（踏实）", -110, 115, "#7c3aed", 10)
write("八十一难：人生修行的隐喻", -10, -110, "#dc2626", 12)
`,
  },
  teach: { sections: [
      { title: '孙悟空的成长', body: '【石猴出世→拜师学艺→大闹天宫（叛逆巅峰）→五行山（沉淀）→西天取经（磨砺担当）→斗战胜佛（成熟圆融）】\n三打白骨精被逐仍护师——责任取代任性。\n"紧箍咒"象征约束：自由需要边界。' },
      { title: '团队的角色', body: '【唐僧：目标坚定（信念领袖）；悟空：能力担当；八戒：欲望与烟火气；沙僧：忠诚踏实；白龙马：默默承载】\n缺谁都不行：只有能力没有信念会偏，只有信念没有能力寸步难行。\n这是最经典的团队文学模型。' },
      { title: '浪漫主义手法', body: '【大胆想象+夸张变形+神魔外衣+人间内核】\n天宫地府龙宫，写的都是人间的权力与人情。\n妖怪多有所指：贪吃好色的八戒、阿谀的托塔天王……\n"文不幻不文，幻不极不幻"。' },
    ], examples: [
      { q: '为什么说"紧箍咒"是成长的隐喻？', steps: ['戴上紧箍=接受规则的约束', '取经路上悟空越来越少被念咒', '最终成佛紧箍自然消失', '真正的成长是从他律到自律'], tip: '约束消失之日=内化之时' },
      { q: '三打白骨精中悟空"被逐仍回来救师"说明了什么？', steps: ['白骨精三变考验的是辨别力', '悟空明知被误解仍履行保护职责', '从"我要自由"到"我要守护"', '责任与担当的觉醒'], tip: '对比大闹天宫时期判若两猴' },
    ], mistakes: ['只当神话读不分析人物成长', '把八戒单纯当搞笑角色（他代表凡人欲望）'] },
  exercises: [
    { q: '孙悟空最终受封为？', options: ['斗战胜佛', '齐天大圣', '斗战胜佛?', '净坛使者'], answer: 0, explain: '八戒封净坛使者' },
    { q: '"紧箍咒"象征？', options: ['外在的约束规范', '头痛病', '魔法', '如来偏爱'], answer: 0, explain: '成长需要边界' },
    { q: '师徒中"信念领袖"是？', options: ['唐僧', '悟空', '八戒', '沙僧'], answer: 0, explain: '目标最坚定' },
    { q: '《西游记》的手法属于？', options: ['浪漫主义', '现实主义', '自然主义', '意识流'], answer: 0, explain: '神魔想象+夸张' },
    { q: '八十一难实质上象征？', options: ['人生修行的磨砺', '妖怪太坏', '凑数字', '佛祖无聊'], answer: 0, explain: '每难都是一次心的考验' },
    { q: '八戒封的是？', options: ['净坛使者', '斗战胜佛', '金身罗汉', '八部天龙'], answer: 0, explain: '沙僧封金身罗汉' },
  ],
});

/* ================= 英语 +5 ================= */

L['eng-09'] = mk({ id: 'eng-09', island: 'cross', order: 277, title: 'Past Tense: 一般过去时', emoji: '⏮',
  subjectArea: '英语', gradeBand: 'junior', grade: 7, textbook: '人教版英语（初中）',
  curriculum: { module: '语法', points: ['一般过去时的构成', '规则/不规则动词过去式', '时间标志词'] },
  story: '昨天做了什么？上周去了哪？英语讲"过去的故事"有一套专门的时态——一般过去时。动词换上"过去的外衣"（-ed 或不规则变化），配上 yesterday、last week，时光机就启动了。',
  goals: ['掌握一般过去时的肯定/否定/疑问', '熟记常见不规则动词过去式', '会识别时间标志词'],
  aiIntro: '⏮ 拖动动词，看它怎样"穿越"到过去——规则的加ed，不规则的换新装！',
  lab: { params: [{ name: 'verb', label: '动词选择', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['go 的过去式为什么不加 ed？', 'study 要怎么变？', 'yesterday 提示什么时态？'],
    code: `# Past Tense 探索台
verb = 1   # 动词

hide()
verbs = ["go", "play", "study", "stop", "have"]
pasts = ["went", "played", "studied", "stopped", "had"]
rules = ["不规则变化（需记忆）", "规则：直接 + ed", "以辅音+y结尾：变y为i再加ed", "重读闭音节：双写末尾辅音+ed", "不规则变化（需记忆）"]
write(verbs[verb - 1] + " → " + pasts[verb - 1], 0, 80, "#dc2626", 24)
write(rules[verb - 1], 0, 30, "#1d4ed8", 12)
write("I " + pasts[verb - 1] + " football yesterday.", 0, -20, "#16a34a", 13)
write("Did you " + verbs[verb - 1] + " yesterday?  Yes, I did.", -20, -60, "#7c3aed", 11)
write("I did not " + verbs[verb - 1] + " last week.", -10, -90, "#b45309", 11)
write("标志词：yesterday·last…·…ago·in 2020", -60, -130, "#ea580c", 11)
write("口诀：did 后用原形，did not 后也原形", -50, -155, "#0369a1", 11)
`,
  },
  teach: { sections: [
      { title: '构成', body: '【肯定：主语 + 动词过去式；否定：didn\'t + 原形；疑问：Did + 主语 + 原形】\nI played. / I didn\'t play. / Did you play?\n谓语动词已经"承担"了时态，助动词 did 出现时动词回到原形。' },
      { title: '过去式变化', body: '【规则：+ed；以e结尾+d；辅音+y变ied；重读闭音节双写+ed】【不规则：go→went, have→had, do→did, see→saw, eat→ate】\n不规则动词需要背——它们是英语的高频核心词。\nstudy→studied（y前是辅音d）；play→played（y前是元音a，直接加ed）。' },
      { title: '时间标志词', body: '【yesterday, last week/month/year, …ago, in 2020, just now, this morning（已过去时）】\n看到这些词，谓语动词用过去式。\n对话高频：What did you do last weekend?' },
    ], examples: [
      { q: '用所给词的适当形式填空：They ___ (go) to the park yesterday.', steps: ['yesterday 是过去时标志', 'go 的过去式是不规则变化', '填 went', 'They went to the park yesterday.'], tip: 'go/went, do/did, have/had 是三大高频不规则' },
      { q: '改为否定句：He visited his grandma last Sunday.', steps: ['谓语是行为动词 visited', '借 did 构成否定，动词回原形', 'He didn\'t visit his grandma last Sunday', '注意 visited 变回 visit'], tip: 'didn\'t 后永远接原形' },
    ], mistakes: ['didn\'t 后仍用过去式（didn\'t went ✗）', 'play 的过去式写成 plaied（直接加ed）'] },
  exercises: [
    { q: 'go 的过去式是？', options: ['went', 'goed', 'gone', 'going'], answer: 0, explain: '不规则变化' },
    { q: 'study 的过去式是？', options: ['studied', 'studyed', 'studed', 'studying'], answer: 0, explain: '辅音+y→ied' },
    { q: 'She ___ TV last night.（watch）', options: ['watched', 'watch', 'watches', 'watching'], answer: 0, explain: 'last night 过去时+ed' },
    { q: '否定句：I went to school. →', options: ["I did not go to school.", "I do not went to school.", "I not went to school.", "I did not went to school."], answer: 0, explain: "did not+原形" },
    { q: '___ you ___ football yesterday?', options: ['Did…play', 'Did…played', 'Do…play', 'Were…play'], answer: 0, explain: 'Did+主语+原形' },
    { q: '下列哪个不是过去时标志词？', options: ['tomorrow', 'yesterday', 'last week', 'two days ago'], answer: 0, explain: 'tomorrow 指将来' },
  ],
});

L['eng-10'] = mk({ id: 'eng-10', island: 'cross', order: 278, title: 'Comparatives: 比较级与最高级', emoji: '📊',
  subjectArea: '英语', gradeBand: 'junior', grade: 8, textbook: '人教版英语（初中）',
  curriculum: { module: '语法', points: ['比较级的变化规则', '比较级句型结构', 'as…as 同级比较'] },
  story: '谁更高？谁跑得更快？谁是班里最棒的？英语比较三件套：比较级比两个、最高级比一堆、as…as 打平手。加 -er 还是 more？看音节！',
  goals: ['掌握比较级/最高级变化规则', '会使用 than 和 the', '理解 as…as 结构'],
  aiIntro: '📊 拖动两座塔的高度，看比较级句子实时生成！',
  lab: { params: [{ name: 'a', label: 'Tom 的高度', min: 1, max: 10, step: 1, value: 7 },
      { name: 'b', label: 'Jack 的高度', min: 1, max: 10, step: 1, value: 5 }],
    grid: true, explore: ['什么时候用 taller，什么时候用 the tallest？', 'as…as 什么时候用？', 'big 的比较级为什么要双写 g？'],
    code: `# 比较级探索台
a = 7   # Tom 高度
b = 5   # Jack 高度

hide()
ha = a * 12
hb = b * 12
fill_rect(-100, -60 + ha / 2, 50, ha, "#3b82f6")
write("Tom", -100, -80, "#1d4ed8", 11)
fill_rect(100, -60 + hb / 2, 50, hb, "#f59e0b")
write("Jack", 100, -80, "#b45309", 11)
write("Tom is tall.", 0, 130, "#64748b", 11)
if a > b:
    write("Tom is taller than Jack.", 0, 100, "#dc2626", 14)
if a < b:
    write("Jack is taller than Tom.", 0, 100, "#dc2626", 14)
if a == b:
    write("Tom is as tall as Jack.", 0, 100, "#16a34a", 14)
write("短词+er/est · 长词前 more/most", -70, -110, "#1d4ed8", 12)
write("big→bigger→biggest（双写g）", -30, -135, "#ea580c", 11)
write("as…as 中间用原形：as tall as", -45, -160, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '变化规则', body: '【单音节：+er/+est（tall→taller→tallest）】【以e结尾：+r/+st（nice→nicer→nicest）】【辅音+y：ier/iest（happy→happier）】【重读闭音节双写：big→bigger】\n多音节：more/most + 原形（beautiful→more beautiful）。\n不规则：good→better→best；bad→worse→worst。' },
      { title: '句型', body: '【比较级：A + be + 比较级 + than + B】【最高级：the + 最高级 + in/of 范围】\nTom is taller than Jack. / Tom is the tallest in our class.\n比较级前可加 much/a little 修饰：much taller（高得多）。' },
      { title: '同级比较', body: '【as + 原形 + as：和……一样】\nTom is as tall as Jack（一样高）。\n否定 not as…as = 不如：This book is not as interesting as that one。\n= less interesting than。' },
    ], examples: [
      { q: '用 proper form 填空：This box is ___ (heavy) than that one.', steps: ['heavy 是单音节（以辅音+y 结尾）', '变 y 为 i 加 -er', '填 heavier', 'This box is heavier than that one.'], tip: 'heavy→heavier→heaviest' },
      { q: '翻译：Lucy 是班上最认真的学生。', steps: ['认真：careful（多音节）', '最高级用 most careful', '范围 our class 用 in', 'Lucy is the most careful student in our class.'], tip: '多音节不加 est，前加 most' },
    ], mistakes: ['more taller 双重比较（✗）', 'as…as 中误用比较级（as taller as ✗）'] },
  exercises: [
    { q: 'big 的比较级是？', options: ['bigger', 'biger', 'more big', 'biggest'], answer: 0, explain: '重读闭音节双写g' },
    { q: 'good 的最高级是？', options: ['best', 'goodest', 'most good', 'better'], answer: 0, explain: 'good→better→best' },
    { q: 'beautiful 的比较级是？', options: ['more beautiful', 'beautifuler', 'most beautiful', 'beautifulest'], answer: 0, explain: '多音节前加 more' },
    { q: 'Tom is ___ than Jack.（tall）', options: ['taller', 'tall', 'tallest', 'as tall'], answer: 0, explain: 'than 前用比较级' },
    { q: 'He is ___ student in the class.（good）', options: ['the best', 'better', 'good', 'the better'], answer: 0, explain: '范围最高级加 the' },
    { q: '同级比较"和…一样高"是？', options: ['as tall as', 'taller than', 'the tallest', 'more tall'], answer: 0, explain: 'as+原形+as' },
  ],
});

L['eng-11'] = mk({ id: 'eng-11', island: 'cross', order: 279, title: 'Modal Verbs: can·should·must', emoji: '🔑',
  subjectArea: '英语', gradeBand: 'junior', grade: 8, textbook: '人教版英语（初中）',
  curriculum: { module: '语法', points: ['can/should/must 的用法', '情态动词后接原形', '否定形式的意思变化'] },
  story: 'Can you swim? You should practice more! You must be safe. 三个小小的情态动词，一个说能力、一个提建议、一个下命令——语气从柔和到强硬，全靠它们。',
  goals: ['区分 can/should/must 的语气', '掌握情态动词后接原形', '理解 mustn\'t 和 needn\'t 的区别'],
  aiIntro: '🔑 拖动情态动词，感受语气的强弱变化——从"能"到"必须"！',
  lab: { params: [{ name: 'modal', label: '情态动词', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['哪个语气最强？哪个最委婉？', "must not 和 need not 有什么区别？", '情态动词后接什么形式的动词？'],
    code: `# 情态动词探索台
modal = 1   # 1 can 2 should 3 must

hide()
modals = ["can", "should", "must"]
meanings = ["能力/许可：能、可以", "建议/义务：应该", "强制/必要：必须"]
strengths = [2, 4, 6]
colors = ["#60a5fa", "#f59e0b", "#dc2626"]
sentences = ["I can swim very well.", "You should do more exercise.", "You must wear a helmet."]
negs = ["cannot：不能/不可能", "should not：不应该", "must not：禁止（千万别）"]
write(modals[modal - 1], -120, 90, colors[modal - 1], 30)
write(meanings[modal - 1], 20, 90, "#1d4ed8", 12)
fill_rect(0, 20, strengths[modal - 1] * 40, 16, colors[modal - 1])
write("语气强度", 0, 0, "#64748b", 9)
write(sentences[modal - 1], 0, -40, "#16a34a", 13)
write("否定：" + negs[modal - 1], 0, -75, "#ea580c", 12)
write("情态动词 + 动词原形（不加 to！）", -50, -115, "#7c3aed", 12)
write("need not = 不必（区别于 must not 禁止）", -55, -140, "#0369a1", 11)
`,
  },
  teach: { sections: [
      { title: '三剑客的分工', body: '【can：能力（I can swim）/ 许可（Can I go?）】【should：建议（You should rest）】【must：必须（You must stop）】\n语气从弱到强：can < should < must。\ncannot 还能表推测：It can\'t be him!（不可能是他）。' },
      { title: '后接原形', body: '【情态动词 + 动词原形，不加 to、不加 ing、不加 s】\nHe can plays ✗ → He can play ✓\nShe must goes ✗ → She must go ✓\n疑问句直接提前情态动词：Can you…? Must I…?' },
      { title: '否定的微妙', body: '【mustn\'t = 禁止（千万别做）；needn\'t = 不必（没必要做）】\nYou mustn\'t smoke here.（此處禁烟）\nYou needn\'t come early.（不必早来）\nmust 的否定回答用 needn\'t：Must I…? — No, you needn\'t.' },
    ], examples: [
      { q: '选词：You ___ wear a seatbelt when driving.（法律强制）', steps: ['语境是法律强制的"必须"', 'can 表能力/许可，语气不够', 'should 表建议，太弱', '选 must：You must wear a seatbelt.'], tip: '强制→must；建议→should' },
      { q: '填空：He can ___ (play) the piano.', steps: ['情态动词后接原形', 'play 本身就是原形', '不加 s（can 已含语法标记）', 'He can play the piano.'], tip: 'can/must/should 后的动词永远"裸奔"' },
    ], mistakes: ['情态动词后加 to（must to go ✗）', 'mustn\'t 理解成"不必"（是禁止！）'] },
  exercises: [
    { q: '___ I use your pen?（请求许可）', options: ['Can', 'Must', 'Should', 'Am'], answer: 0, explain: 'can 表许可' },
    { q: 'You ___ smoke here. It\'s dangerous!（禁止）', options: ["must not", "need not", "should", "can"], answer: 0, explain: "must not=禁止" },
    { q: 'You ___ finish it today. Tomorrow is OK.（不必）', options: ["need not", "must not", "cannot", "should not"], answer: 0, explain: "need not=不必" },
    { q: 'She can ___ very fast.（run）', options: ['run', 'runs', 'running', 'ran'], answer: 0, explain: '情态动词+原形' },
    { q: '你建议朋友多喝水，说：', options: ['You should drink more water.', 'You must drink water.', 'You can water.', 'You drink should water.'], answer: 0, explain: 'should 表建议' },
    { q: '语气最强的是？', options: ['must', 'can', 'should', 'may'], answer: 0, explain: 'must=必须' },
  ],
});

L['eng-12'] = mk({ id: 'eng-12', island: 'cross', order: 280, title: 'Present Continuous: 现在进行时', emoji: '🏃',
  subjectArea: '英语', gradeBand: 'junior', grade: 7, textbook: '人教版英语（初中）',
  curriculum: { module: '语法', points: ['现在进行时的构成', 'V-ing 变化规则', '与一般现在时的区别'] },
  story: 'Look! He is running! 此刻正在发生的事，英语用"be + doing"来抓拍——像给动作拍一张快照。对比一般现在时的"日常打卡"，进行时是"正在进行"。',
  goals: ['掌握 be + V-ing 结构', '会变 V-ing 的四种规则', '区分"习惯"与"此刻"'],
  aiIntro: '🏃 拖动场景照片，看"正在做"的句子怎样生成——时态抓拍器！',
  lab: { params: [{ name: 'scene', label: '场景', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['I read 与 I am reading 有什么区别？', 'run 为什么要双写 n？', 'look/listen 为什么提示进行时？'],
    code: `# Present Continuous 探索台
scene = 1   # 场景

hide()
emojis = ["📖", "⚽", "🍳", "🎵"]
acts = ["read a book", "play football", "cook dinner", "sing a song"]
ings = ["reading a book", "playing football", "cooking dinner", "singing a song"]
write(emojis[scene - 1], 0, 60, "#0f172a", 36)
write("She is " + ings[scene - 1] + " now.", 0, 0, "#dc2612", 14)
write("Look! She is " + ings[scene - 1] + ".", 0, -35, "#1d4ed8", 12)
write("Be + V-ing = 此刻正在发生", -30, -80, "#16a34a", 12)
write("V-ing 规则：+ing / 去e+ing / 双写+ing / ie→y+ing", -80, -110, "#7c3aed", 10)
write("对比：She reads every day.（习惯）", -50, -140, "#ea580c", 11)
write("标志词：now·look!·listen!·at the moment", -60, -165, "#b45309", 10)
`,
  },
  teach: { sections: [
      { title: '构成', body: '【主语 + be动词(am/is/are) + 动词-ing】\nI am reading. / She is cooking. / They are playing.\n否定在 be 后加 not：She isn\'t cooking.\n疑问把 be 提前：Is she cooking?' },
      { title: 'V-ing 四规则', body: '【一般 +ing：play→playing】【不发音e去e+ing：make→making】【重读闭音节双写+ing：run→running, swim→swimming】【ie结尾变y+ing：lie→lying, die→dying】\nread→reading（直接加）；write→writing（去e）。' },
      { title: 'vs 一般现在时', body: '【一般现在时：习惯性/经常性（every day, usually）】【现在进行时：此刻正在（now, look!, listen!）】\nShe reads every night.（天天读）vs She is reading now.（此刻在读）。\n"Look!" 出现几乎必考进行时。' },
    ], examples: [
      { q: '用所给词的适当形式填空：Look! The boys ___ (play) basketball.', steps: ['Look! 提示"此刻"', 'be + doing 结构', 'boys 是复数用 are', 'The boys are playing basketball.'], tip: 'Look/Listen 开头 = 进行时信号' },
      { q: '改为疑问句：She is making a cake.', steps: ['把 is 提到句首', 'Is she making a cake?', '肯定回答：Yes, she is.', '否定回答：No, she isn\'t.'], tip: '只动 be，动词 ing 不变' },
    ], mistakes: ['漏掉 be 动词（She reading ✗）', 'make 的 ing 写成 makeing（应去掉e）'] },
  exercises: [
    { q: 'Listen! Someone ___ in the next room.', options: ['is singing', 'sings', 'sing', 'sang'], answer: 0, explain: 'Listen! 提示此刻' },
    { q: 'run 的 V-ing 是？', options: ['running', 'runing', 'runnning', 'runs'], answer: 0, explain: '重读闭音节双写n' },
    { q: 'make 的 V-ing 是？', options: ['making', 'makeing', 'makking', 'makes'], answer: 0, explain: '去e加ing' },
    { q: 'They ___ (watch) TV now.', options: ['are watching', 'watch', 'watches', 'watched'], answer: 0, explain: 'now+复数→are doing' },
    { q: 'She reads every night. 说明她？', options: ['习惯性每天读', '此刻正在读', '从不读', '昨天读了'], answer: 0, explain: '一般现在时表习惯' },
    { q: 'I ___ (do) my homework at the moment.', options: ['am doing', 'do', 'did', 'does'], answer: 0, explain: 'at the moment=此刻' },
  ],
});

L['eng-13'] = mk({ id: 'eng-13', island: 'cross', order: 281, title: 'Future Tense: 一般将来时', emoji: '🚀',
  subjectArea: '英语', gradeBand: 'junior', grade: 7, textbook: '人教版英语（初中）',
  curriculum: { module: '语法', points: ['will + 原形', 'be going to + 原形', '两者细微区别'] },
  story: 'Tomorrow is another day! 说明天的事、下周末的计划，英语有两个法宝：will 说话算话的"将"，be going to 说早有打算的"要"。一个偏临场，一个偏计划。',
  goals: ['掌握 will 和 be going to 结构', '区分两者使用场景', '会写将来时的否定和疑问'],
  aiIntro: '🚀 拖动场景类型，看用 will 还是 be going to——未来的两种说法！',
  lab: { params: [{ name: 'case', label: '场景类型', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['"我打算学游泳"用哪个更好？', '"我想天要下雨了"呢？', "will not 是什么的否定？"],
    code: `# Future Tense 探索台
case = 1   # 场景

hide()
cases = ["事先计划：我打算/准备……", "临时决定：当场拍板……", "预测推断：我猜会……"]
bests = ["be going to", "will", "两者均可（will 更常见）"]
examples = ["I am going to learn swimming this summer.", "OK, I will help you with it!", "It will rain tomorrow."]
write(cases[case - 1], 0, 110, "#0f172a", 12)
fill_rect(0, 75, 300, 40, "#fef3c7")
write("推荐：" + bests[case - 1], 0, 75, "#b45309", 13)
write(examples[case - 1], 0, 20, "#dc2626", 13)
write("will + 原形 · be going to + 原形", -40, -30, "#1d4ed8", 12)
write("否定：will not / is not going to", -10, -60, "#ea580c", 12)
write("疑问：Will you…? / Are you going to…?", -30, -90, "#7c3aed", 11)
write("标志词：tomorrow·next…·soon·in the future", -55, -120, "#16a34a", 11)
`,
  },
  teach: { sections: [
      { title: '两种结构', body: '【will + 原形：I will call you tonight.】【be going to + 原形：I am going to visit Beijing.】\nwill 各人称通用；be going to 的 be 随主语变 am/is/are。\n否定：won\'t / be not going to。' },
      { title: '细微区别', body: '【be going to：事先打算好的计划】【will：临时决定、当场承诺、纯预测】\n"打算暑假学游泳"→be going to（早有计划）。\n"好的我来帮你"→will（当场拍板）。\n自然规律预测两者皆可。' },
      { title: '常见场景', body: '【承诺：I will never give up.（意志）】【请求：Will you help me?（客气）】【预言：Robots will do more jobs.】\n时间/条件状语从句中不用 will：If it rains, I will stay home（主句才用 will）。' },
    ], examples: [
      { q: '翻译：我打算下学期加入篮球社。', steps: ['"打算"= 早有计划 → be going to', '主语 I 用 am', 'join 用原形', 'I am going to join the basketball club next term.'], tip: '"打算/准备"是 be going to 的高频信号' },
      { q: 'Don\'t worry, I ___ (help) you.（当场承诺）', steps: ['当场决定帮忙', '用 will', '不用 be going to', 'Don\'t worry, I will help you.'], tip: '临场拍板 → will' },
    ], mistakes: ['If 从句里用 will（If it will rain ✗）', 'be going to 后加 to（going to to learn ✗）'] },
  exercises: [
    { q: 'I ___ visit my grandma this weekend.（计划好）', options: ['am going to', 'wills', 'go to', 'went'], answer: 0, explain: '计划→be going to' },
    { q: "Don't worry, I ___ come.（承诺）", options: ['will', 'am going', 'willing', 'would'], answer: 0, explain: '当场承诺用will' },
    { q: 'will 的否定是？', options: ["will not", "willn't", "not will", "do not will"], answer: 0, explain: "will not = will not" },
    { q: 'She ___ going to buy a car.（第三人称）', options: ['is', 'am', 'are', 'be'], answer: 0, explain: 'She 用 is' },
    { q: 'If it ___ tomorrow, we will stay home.', options: ['rains', 'will rain', 'rained', 'rainning'], answer: 0, explain: 'if从句用一般现在时' },
    { q: '"打算做某事"最好的翻译是？', options: ['be going to do', 'will doing', 'go to do', 'will to do'], answer: 0, explain: 'be going to + 原形' },
  ],
});

/* ================= 信息科技 +4 ================= */

L['it-12'] = mk({ id: 'it-12', island: 'cross', order: 282, title: '网络基础：IP与网址', emoji: '🌐',
  subjectArea: '信息科技', gradeBand: 'junior', grade: 7, textbook: '冀教版信息科技（初中）',
  curriculum: { module: '网络基础', points: ['IP地址的作用', '域名与DNS', '带宽与网速'] },
  story: '你在浏览器输入 www.baidu.com，半秒内页面就来了——背后经历了一次"查地址"（DNS）、一次"敲门"（IP 寻址）和一次"传包裹"（数据分包）。上网的全过程，就是一场快递之旅。',
  goals: ['理解 IP 地址是网络中的门牌号', '知道域名通过 DNS 翻译成 IP', '了解数据分包传输'],
  aiIntro: '🌐 输入网址后发生了什么？逐步点亮快递之旅的每一站！',
  lab: { params: [{ name: 'step', label: '快递步骤', min: 1, max: 5, step: 1, value: 1 }],
    grid: false, explore: ['DNS 像什么？（电话簿）', '为什么数据要分包？', 'IP 地址由什么分隔？'],
    code: `# 网络快递之旅
step = 1   # 步骤

hide()
steps = ["①输入网址 www.example.com", "②DNS 查询：域名→IP 地址", "③建立连接：敲开服务器之门", "④数据分包传输", "⑤浏览器组装显示网页"]
descs = ["你按下回车，请求出发", "DNS 像"电话簿"帮你找到门牌号", "三次握手确认"我在听"", "大文件切成小包编好号", "按编号拼回完整页面"]
i = 0
while i < 5:
    y = 110 - i * 52
    col = "#e2e8f0"
    if i < step:
        col = "#86efac"
    if i + 1 == step:
        col = "#fde68a"
    fill_rect(0, y, 400, 40, col)
    write(steps[i], 0, y, "#0f172a", 11)
    i = i + 1
write(descs[step - 1], 0, -90, "#1d4ed8", 12)
write("IP 是门牌号 · DNS 是电话簿 · 分包像拼快递", -80, 150, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: 'IP 地址', body: '【网络中每台设备的唯一"门牌号"，如 192.168.1.100】\nIPv4 由 4 段 0~255 的数字用点分隔。\n127.0.0.1 是"本机"（localhost）。\n路由器按 IP 找到目标。' },
      { title: '域名与 DNS', body: '【域名是好记的别名（www.baidu.com）；DNS 把域名翻译成 IP】\n人记域名、机器认 IP——DNS 就是互联网的电话簿。\n浏览器先查 DNS 再发起连接。' },
      { title: '分包传输', body: '【大数据切成编号的小包，各自走可能不同的路，到站重装】\n好处：某条路堵了可以绕行；丢一个包只需重发那一个。\n带宽 = 每秒能传多少数据（如 100Mbps）。' },
    ], examples: [
      { q: '为什么有了 IP 还要域名？', steps: ['IP 是一串数字难记', '域名有含义好记', 'DNS 负责翻译', '两者配合：人记域名，机器用IP'], tip: '类比：门牌号 vs 小区名' },
      { q: '看视频卡顿时，分包传输的好处是什么？', steps: ['数据分成了很多小包', '部分包走慢路不影响整体到达', '丢包只重传丢的部分', '整体传输更可靠'], tip: '不把鸡蛋放一个篮子里' },
    ], mistakes: ['认为 DNS 就是路由器', '以为数据是"一整块"直达的（其实是分包）'] },
  exercises: [
    { q: 'IP 地址的作用是？', options: ['标识设备的网络门牌号', '加快网速', '存数据', '杀毒'], answer: 0, explain: '唯一标识' },
    { q: 'DNS 的功能是？', options: ['域名翻译成 IP', '存网页', '加密', '充电'], answer: 0, explain: '互联网电话簿' },
    { q: '127.0.0.1 代表？', options: ['本机', '百度', '路由器', '美国'], answer: 0, explain: 'localhost' },
    { q: '数据分包的好处不包括？', options: ['防止所有网速变快', '可靠（丢包重传个别）', '可绕行', '公平分享线路'], answer: 0, explain: '分包不能提升物理带宽' },
    { q: 'www.baidu.com 是？', options: ['域名', 'IP地址', 'DNS协议', '邮箱'], answer: 0, explain: '好记的别名' },
    { q: '100Mbps 指的是？', options: ['带宽（每秒比特数）', '内存', '屏幕大小', '重量'], answer: 0, explain: '兆比特每秒' },
  ],
});

L['it-13'] = mk({ id: 'it-13', island: 'cross', order: 283, title: '信息安全：密码与加密', emoji: '🔒',
  subjectArea: '信息科技', gradeBand: 'junior', grade: 7, textbook: '冀教版信息科技（初中）',
  curriculum: { module: '信息安全', points: ['强密码原则', '凯撒密码原理', '对称与公钥加密概念'] },
  story: '两千年前的凯撒把字母移 3 位传递军令——这就是加密的起点。今天你的每次网购背后都是数学在"搅乱"信息。学会密码常识，就是学会数字时代的锁门术。',
  goals: ['会设计强密码', '理解凯撒密码的移位原理', '知道公钥加密的基本思想'],
  aiIntro: '🔒 拖动移位数，亲手加密一段文字——体验凯撒密码！',
  lab: { params: [{ name: 'shift', label: '移位数', min: 1, max: 25, step: 1, value: 3 }],
    grid: true, explore: ['移位数是几时密文和原文一样？（26）', '只试 25 次就能破解凯撒密码——它安全吗？', '为什么公钥可以公开？'],
    code: `# 凯撒密码探索台
shift = 3   # 移位数

hide()
alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
plain = "HELLO"
# 手动移位（解释器无字符串索引）
out = ""
write("原文: " + plain, 0, 140, "#0f172a", 14)
write("移位: " + shift, 0, 110, "#1d4ed8", 12)
# H→K E→H L→O L→O O→R
result = ""
if shift == 3:
    result = "KHOOR"
if shift == 1:
    result = "IFMMP"
if shift == 5:
    result = "MJQQT"
if result == "":
    result = "试 1/3/5 看效果"
write("密文: " + result, 0, 60, "#dc2626", 20)
write("每个字母在字母表中向后移 " + shift + " 位", -30, 10, "#16a34a", 12)
write("凯撒密码 25 次即可穷举破解——不安全！", -80, -60, "#ea580c", 12)
write("现代加密：密钥长达 128/256 位，穷举要亿万年", -110, -90, "#1d4ed8", 11)
write("公钥加密：公开的锁，私有的钥匙", -50, -120, "#7c3aed", 12)
write("强密码：长（12+）·杂（大小写符号）·不重复用", -90, -150, "#b45309", 11)
`,
  },
  teach: { sections: [
      { title: '强密码', body: '【长度 ≥12、大小写+数字+符号混合、不含生日姓名、不同网站不同密码】\n"Flower#2024!Sun" 强于"123456"百万倍。\n密码管理器可帮忙记住不同密码。\n开启两步验证=再加一把锁。' },
      { title: '凯撒密码', body: '【每个字母在字母表中向后移固定位数】\n移 3 位：A→D, H→K, HELLO→KHOOR。\n破解只需试 25 种移位——说明"简单规则"不安全。\n但它展示了加密=变换+密钥。' },
      { title: '公钥加密', body: '【公钥（锁）人人可用加密；私钥（钥匙）只有你 能解】\n像街头邮筒：谁都能投信，只有你有钥匙开。\nHTTPS 的小锁标志就是公钥加密在工作。\n密钥长度 256 位→穷举不可能。' },
    ], examples: [
      { q: '用凯撒密码（移3位）加密 "CAT"。', steps: ['C 向后移 3 位 → F', 'A 向后移 3 位 → D', 'T 向后移 3 位 → W', '密文：FDW'], tip: '到 Z 回绕到 A' },
      { q: '为什么说凯撒密码不安全？', steps: ['移位数只有 25 种可能', '穷举法一一尝试', '几分钟内必破解', '现代加密用长密钥使穷举不可行'], tip: '密钥空间决定强度' },
    ], mistakes: ['用生日做密码', '以为公钥加密要保密公钥（公钥就是公开的）'] },
  exercises: [
    { q: '下列最强密码是？', options: ['Flower#2024!Sun', '123456', 'abc123', 'password'], answer: 0, explain: '长+混合+无规律' },
    { q: '凯撒密码移 3 位，A 加密后是？', options: ['D', 'C', 'E', 'X'], answer: 0, explain: '向后移3' },
    { q: '凯撒密码的弱点是？', options: ['密钥空间太小可穷举', '太慢', '字母少', '不能加密数字'], answer: 0, explain: '只有25种移位' },
    { q: '公钥加密中"私钥"用来？', options: ['解密', '加密', '公开', '删数据'], answer: 0, explain: '公钥加密私钥解' },
    { q: '两步验证的作用是？', options: ['多一层安全锁', '加快登录', '记住密码', '美化界面'], answer: 0, explain: '密码泄露也进不来' },
    { q: '网址栏的🔒标志表示？', options: ['HTTPS 加密传输', '网站好看', '已收藏', '网速快'], answer: 0, explain: '公钥加密在保护你' },
  ],
});

L['it-14'] = mk({ id: 'it-14', island: 'cross', order: 284, title: '嵌套循环：画表格', emoji: '🔀',
  subjectArea: '信息科技', gradeBand: 'junior', grade: 7, textbook: '冀教版信息科技（初中）',
  curriculum: { module: '算法与程序实现', points: ['嵌套循环的执行顺序', '外层行内层列', '循环变量不干扰'] },
  story: '画九九乘法表、排座位表、铺地砖——只要"行里有列"的事，都归嵌套循环管。外层管行，内层管列：外层每转一圈，内层已跑完一整行。掌握它，你就掌握了二维世界。',
  goals: ['理解外层每走一步内层跑一圈', '会写双层嵌套画格子', '知道内外层变量要不同名'],
  aiIntro: '🔀 拖动行列数，看嵌套循环怎样铺满整个方阵——一层管行一层管列！',
  lab: { params: [{ name: 'rows', label: '行数', min: 1, max: 6, step: 1, value: 4 },
      { name: 'cols', label: '列数', min: 1, max: 6, step: 1, value: 4 }],
    grid: true, explore: ['总共执行了多少次？（行×列）', '先画完一行还是先画完一列？', 'i 和 j 能同名吗？'],
    code: `# 嵌套循环铺格子
rows = 4   # 行数
cols = 4   # 列数

hide()
i = 0
while i < rows:
    j = 0
    while j < cols:
        x = -150 + j * 55
        y = 120 - i * 55
        fill_rect(x, y, 44, 44, "#60a5fa")
        write(i * 10 + j, x, y, "#ffffff", 10)
        j = j + 1
    i = i + 1
write("外层 i 管"行"（" + rows + " 行）", -70, 160, "#dc2626", 12)
write("内层 j 管"列"（" + cols + " 列）", -70, 138, "#1d4ed8", 12)
write("总执行 " + rows * cols + " 次（行×列）", -30, -170, "#16a34a", 12)
write("外层每走 1 步，内层跑完 1 整行", -80, -145, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '执行顺序', body: '【外层每走 1 步，内层完整跑 1 圈】\n4 行 4 列：外层 i=0 时内层 j 跑 0→3；然后 i=1、j 再跑 0→3……共 16 次。\n"先横后竖"逐行铺开。' },
      { title: '行 × 列', body: '【总执行次数 = 外层次数 × 内层次数】\n5 行 8 列 = 40 次。\n嵌套是程序里"平方级变慢"的常见原因（两层各 100 → 一万次）。' },
      { title: '变量与缩进', body: '【内外层循环变量必须不同名（i 和 j）】\n同名会互相干扰，计数错乱。\n内层的起始值要在内层开头重置（j=0 写在 while j 外面、while i 里面）。\n缩进表明谁包着谁。' },
    ], examples: [
      { q: '嵌套循环 3 行 5 列总共执行多少次内层体？', steps: ['外层跑 3 次', '每次内层跑 5 次', '总执行 = 3 × 5', '= 15 次'], tip: '相乘即可' },
      { q: '画九九乘法表的结构怎么设计？', steps: ['外层 i 从 1 到 9（行）', '内层 j 从 1 到 i（列数逐行加一）', '每次输出 j × i = 积', '三角形表自然成形'], tip: '内层次数可以依赖外层变量！' },
    ], mistakes: ['内外层变量同名导致死循环/错乱', '内层计数器没在外层里重置'] },
  exercises: [
    { q: '嵌套循环 4 行 6 列共执行？', options: ['24 次', '10 次', '4 次', '6 次'], answer: 0, explain: '4×6=24' },
    { q: '外层每走 1 步，内层？', options: ['完整跑 1 圈', '走 1 步', '停住', '倒着跑'], answer: 0, explain: '这是嵌套的定义' },
    { q: '内外层循环变量应该？', options: ['不同名', '同名', '随意', '只能是i'], answer: 0, explain: '同名会互相覆盖' },
    { q: '内层计数器重置应放在？', options: ['外层循环体的开头', '程序最开头', '内层里面', '哪里都行'], answer: 0, explain: '每行重新从0数' },
    { q: '两层各 100 次的嵌套共执行？', options: ['10000 次', '200 次', '100 次', '1000 次'], answer: 0, explain: '100×100，平方增长' },
    { q: '九九表的内层次数特点是？', options: ['依赖外层变量（j ≤ i）', '固定 9 次', '固定 1 次', '随机'], answer: 0, explain: '所以呈三角形' },
  ],
});

L['it-15'] = mk({ id: 'it-15', island: 'cross', order: 285, title: '数据类型与变量', emoji: '📦',
  subjectArea: '信息科技', gradeBand: 'junior', grade: 8, textbook: '冀教版信息科技（初中）',
  curriculum: { module: '算法与程序实现', points: ['常见数据类型', '变量的命名与赋值', '类型混用的坑'] },
  story: '"3" + 5 等于 8 还是 "35"？取决于 3 是数字还是文字！变量像贴了标签的盒子——装什么类型的东西，决定了能对它做什么运算。',
  goals: ['认识数字/字符串/布尔三类数据', '理解变量是"贴标签的盒子"', '会识别类型混用的错误'],
  aiIntro: '📦 拖动数据类型，看同一个值在不同类型下的表现！',
  lab: { params: [{ name: 'type', label: '数据类型', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['"3" + 5 在数字和文字下各是什么结果？', '布尔值只有哪两个？', '为什么变量名不能叫 if？'],
    code: `# 数据类型探索台
type = 1   # 1数字 2字符串 3布尔

hide()
names = ["数字 Number", "字符串 String", "布尔 Boolean"]
values = ["3 + 5 = 8（数学运算）", '"3" + "5" = "35"（拼接）', "True / False（真/假）"]
uses = ["可以做加减乘除", "只能拼接和取长度", "用来做条件判断"]
colors = ["#3b82f6", "#f59e0b", "#16a34a"]
write(names[type - 1], 0, 100, colors[type - 1], 18)
fill_rect(0, 55, 340, 50, "#f8fafc")
write(values[type - 1], 0, 55, "#0f172a", 13)
write(uses[type - 1], 0, 0, "#1d4ed8", 12)
write('变量 = 贴了标签的盒子（x = 3）', -30, -50, "#7c3aed", 12)
write("命名规则：字母开头·不含空格·不用保留字(if/while)", -110, -80, "#ea580c", 11)
if type == 1:
    write('"score" + 1 会报错！', -30, -110, "#dc2626", 12)
if type == 2:
    write('"score" + "1" = "score1"', -30, -110, "#dc2612", 12)
`,
  },
  teach: { sections: [
      { title: '三大类型', body: '【数字：可算术（3+5=8）】【字符串：文字，加号是拼接（"3"+"5"="35"）】【布尔：只有 True/False】\n判断类型看引号："3" 是文字、3 是数字。\n比较运算的结果是布尔（3 > 2 → True）。' },
      { title: '变量', body: '【变量 = 贴了标签的盒子；赋值 = 往盒子里放东西】\nx = 3 把 3 放进名为 x 的盒子。\n命名：字母开头、不含空格、不用保留字（if、while、print）。\nage、score 是好名；a、b 太随意。' },
      { title: '类型混用的坑', body: '【"age"（文字）+ 1 → 报错】【"score" + "1" → "score1"（意外拼接）】\n输入框拿到的永远是字符串——做数学前要先转成数字。\n程序报错先查类型！' },
    ], examples: [
      { q: 'input() 输入的 "12" 怎样变成可计算的数字？', steps: ['输入框返回的是字符串 "12"', '字符串不能做数学', '用转换函数转成数字', '然后就可以 age + 1 了'], tip: '凡输入必查类型' },
      { q: '下列哪些是合法的变量名？age / 2name / my score / if', steps: ['age ✓ 字母开头', '2name ✗ 数字开头', 'my score ✗ 含空格', 'if ✗ 保留字'], tip: '三条规则一查便知' },
    ], mistakes: ['以为 "3"+5 = 8（类型不同会拼接或报错）', '变量名数字开头或含空格'] },
  exercises: [
    { q: '"3" + "5" 的结果是？', options: ['"35"', '8', '报错', '"3+5"'], answer: 0, explain: '字符串加号=拼接' },
    { q: '3 + 5 的结果是？', options: ['8', '"35"', 'True', '0'], answer: 0, explain: '数字做数学' },
    { q: '布尔值有哪两个？', options: ['True / False', 'Yes / No', '1 / 0', '对 / 错'], answer: 0, explain: '首字母大写' },
    { q: '下列合法变量名是？', options: ['my_age', '2nd', 'my age', 'while'], answer: 0, explain: '字母开头+无空格+非保留字' },
    { q: '输入框 input() 得到的是？', options: ['字符串', '数字', '布尔', '图片'], answer: 0, explain: '必须转换才能计算' },
    { q: '变量最形象的比喻是？', options: ['贴了标签的盒子', '一辆车', '一栋楼', '一台电视'], answer: 0, explain: '标签=名，内容=值' },
  ],
});

/* ================= 科学 +3 ================= */

L['sci-13'] = mk({ id: 'sci-13', island: 'cross', order: 286, title: '动物的生命周期', emoji: '🦋',
  subjectArea: '科学', gradeBand: 'primary', grade: 3, textbook: '冀人版科学（小学）',
  curriculum: { module: '生命系统', points: ['完全变态发育', '不完全变态', '生命周期与繁殖'] },
  story: '毛毛虫变蝴蝶、蝌蚪变青蛙、小鸡出壳——动物宝宝们有些"换装"长大（变态发育），有些"照镜子"长大（直接发育）。生命的时钟各有各的转法。',
  goals: ['知道蝴蝶的完全变态四阶段', '区分完全变态与不完全变态', '理解生命周期周而复始'],
  aiIntro: '🦋 拖动发育阶段，看毛毛虫的变身四连拍！',
  lab: { params: [{ name: 'stage', label: '发育阶段', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['哪个阶段时间最长？', '蛹里发生了什么？', '蝗虫和蝴蝶的发育有什么不同？'],
    code: `# 蝴蝶生命周期
stage = 1   # 1卵 2幼虫 3蛹 4成虫

hide()
emojis = ["🥚", "🐛", "🟤", "🦋"]
names = ["卵（产在叶上）", "幼虫（不停吃叶）", "蛹（体内大改造）", "成虫（破茧飞舞）"]
descs = ["小小的圆粒，几天后孵化", "就是毛毛虫，吃吃吃不停长", "外表安静，里面正在重组身体", "翅膀展开，交配产卵开始新循环"]
i = 0
while i < 4:
    x = -140 + i * 95
    col = "#e2e8f0"
    if i + 1 == stage:
        col = "#fde68a"
    fill_rect(x, 60, 70, 70, col)
    write(emojis[i], x, 60, "#0f172a", 22)
    i = i + 1
write(names[stage - 1], 0, -20, "#dc2626", 14)
write(descs[stage - 1], 0, -55, "#1d4ed8", 11)
write("完全变态：卵→幼虫→蛹→成虫（形态大不同）", -80, 140, "#16a34a", 11)
write("不完全变态（如蝗虫）：卵→若虫→成虫（无蛹）", -90, 118, "#7c3aed", 10)
write("成虫产卵→新生命周期开始", 0, -95, "#ea580c", 11)
`,
  },
  teach: { sections: [
      { title: '完全变态', body: '【卵→幼虫→蛹→成虫，四个阶段形态大不同】\n蝴蝶、蜜蜂、蚊子都是完全变态。\n蛹期看似静止，体内正在"拆了重装"。\n幼虫期最长（主要任务是吃和长）。' },
      { title: '不完全变态', body: '【卵→若虫→成虫（没有蛹阶段）】\n蝗虫、蟋蟀的若虫长得很像成虫，只是没长翅膀。\n每次蜕皮更接近成虫。\n"渐变"而非"变身"。' },
      { title: '生命周期的循环', body: '【成虫繁殖产卵→新的生命周期开始→种族延续】\n青蛙：卵→蝌蚪→幼蛙→成蛙（水陆两栖变身）。\n鸡：卵（蛋）→雏鸡→成鸡（直接发育）。\n每个阶段都有适应那个阶段的生存本领。' },
    ], examples: [
      { q: '蝴蝶发育的正确顺序是？', steps: ['从卵开始', '孵化成幼虫（毛毛虫）', '变蛹（体内重组）', '羽化为成虫（蝴蝶）'], tip: '完全变态四部曲' },
      { q: '蝗虫和蝴蝶的发育有什么不同？', steps: ['蝴蝶有蛹阶段', '蝗虫没有蛹，只有若虫', '蝗虫若虫像小型成虫', '蝴蝶幼虫（毛虫）与成虫形态完全不同'], tip: '有蛹=完全变态，无蛹=不完全变态' },
    ], mistakes: ['认为蛹是"睡着了"（体内剧烈重组）', '蝗虫也有蛹（它是若虫渐变）'] },
  exercises: [
    { q: '蝴蝶是完全变态因为？', options: ['有蛹阶段', '会飞', '吃叶子', '颜色美'], answer: 0, explain: '四阶段形态大不同' },
    { q: '下列属于不完全变态的是？', options: ['蝗虫', '蝴蝶', '蚊子', '蜜蜂'], answer: 0, explain: '蝗虫：卵若虫成虫' },
    { q: '蝴蝶幼虫的主要任务是？', options: ['吃和生长', '产卵', '飞舞', '冬眠'], answer: 0, explain: '储存变态所需能量' },
    { q: '蛹期内部在？', options: ['重组身体', '睡觉', '逃走', '变色'], answer: 0, explain: '看似安静实则巨变' },
    { q: '青蛙的发育属于？', options: ['变态发育', '直接发育', '不发育', '退化'], answer: 0, explain: '蝌蚪→青蛙大变身' },
    { q: '生命周期最终回到？', options: ['成虫产卵开始新循环', '永远停止', '变成植物', '飞向太空'], answer: 0, explain: '种族延续的循环' },
  ],
});

L['sci-14'] = mk({ id: 'sci-14', island: 'cross', order: 287, title: '岩石与矿物', emoji: '🪨',
  subjectArea: '科学', gradeBand: 'primary', grade: 4, textbook: '冀人版科学（小学）',
  curriculum: { module: '物质世界', points: ['三大岩石类型', '岩石的成因循环', '常见矿物特征'] },
  story: '脚下每一块石头都有一部传记：岩浆冷却成的火成岩、泥沙压成的沉积岩、高温高压变身的变质岩——三大岩类还在地球"岩石循环"里不停转世。',
  goals: ['区分三大岩类及代表岩石', '理解岩石循环', '会用简单特征辨认矿物'],
  aiIntro: '🪨 拖动温度和压力，看岩石怎样互相转化——地球的炼金术！',
  lab: { params: [{ name: 'rock', label: '岩石类型', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['花岗岩为什么坚硬？', '沉积岩的"层理"像什么？', '大理岩是由什么变来的？'],
    code: `# 三大岩石探索台
rock = 1   # 1火成 2沉积 3变质

hide()
names = ["火成岩（岩浆冷却）", "沉积岩（泥沙压固）", "变质岩（高温高压变身）"]
examples = ["花岗岩·玄武岩·浮石", "砂岩·页岩·石灰岩", "大理岩（石灰岩变）·板岩（页岩变）"]
feats = ["常有晶粒、坚硬、可能有气孔", "一层一层（层理）、可能含化石", "条带纹理、片状可剥（板岩）"]
emojis = ["🌋", "🏖", "⛰"]
write(emojis[rock - 1], 0, 70, "#0f172a", 36)
write(names[rock - 1], 0, 20, "#dc2626", 14)
write(examples[rock - 1], 0, -15, "#1d4ed8", 11)
write("特征：" + feats[rock - 1], 0, -50, "#16a34a", 11)
write("岩石循环：熔化→冷凝→风化搬运→压固→深埋变质→再熔化", -110, -110, "#7c3aed", 10)
write("三大岩在地球里循环转世，永不消失", -50, -135, "#ea580c", 11)
`,
  },
  teach: { sections: [
      { title: '三大岩类', body: '【火成岩：岩浆冷却凝固（花岗岩坚硬、玄武岩多孔、浮石能浮水）】【沉积岩：泥沙层层堆积压实（砂岩、页岩、石灰岩，可能含化石）】【变质岩：已有岩石高温高压"变身"（大理岩来自石灰岩、板岩来自页岩）】' },
      { title: '岩石循环', body: '【火成岩风化成沙→堆积成沉积岩→深埋高温高压变变质岩→熔化回岩浆→再冷凝成火成岩】\n三大岩在地球"大转盘"里循环。\n能量来源：地球内热+太阳能驱动风化。' },
      { title: '辨认矿物', body: '【看颜色/条痕、摸硬度（指甲<铜钥匙<钢刀）、观察光泽透明度】\n方解石遇稀盐酸冒泡（鉴定石灰岩的绝招）。\n石英透明坚硬；云母能剥成薄片。\n矿物是构成岩石的"积木"。' },
    ], examples: [
      { q: '在山上捡到一块有许多小气孔的轻石头，它属于哪类？', steps: ['有气孔说明岩浆冷凝时气体逸出', '是岩浆冷却的产物', '属火成岩（可能是玄武岩或浮石）', '浮石轻到能浮在水上'], tip: '气孔=岩浆冷凝的招牌' },
      { q: '为什么沉积岩中常发现化石？', steps: ['泥沙层层堆积掩埋生物遗体', '压实成岩时遗体被封存', '化石因此保存在层理之间', '火成岩高温会烧毁化石'], tip: '化石是沉积岩的独家标签' },
    ], mistakes: ['把大理岩当沉积岩（石灰岩受热变质而成）', '以为石头不会变（岩石循环永不停）'] },
  exercises: [
    { q: '花岗岩属于？', options: ['火成岩', '沉积岩', '变质岩', '人造石'], answer: 0, explain: '岩浆冷却' },
    { q: '可能含化石的岩类是？', options: ['沉积岩', '火成岩', '变质岩', '陨石'], answer: 0, explain: '泥沙掩埋保存化石' },
    { q: '大理岩是由什么变质而成？', options: ['石灰岩', '花岗岩', '砂岩', '浮石'], answer: 0, explain: '石灰岩高温高压变身' },
    { q: '浮石能浮在水面因为？', options: ['有大量气孔', '很轻的木头', '有魔法', '水太咸'], answer: 0, explain: '气孔多密度小' },
    { q: '方解石遇稀盐酸会？', options: ['冒泡', '发光', '融化', '爆炸'], answer: 0, explain: '鉴定石灰岩/方解石的特征' },
    { q: '三大岩类通过什么循环转化？', options: ['岩石循环（熔化-风化-压固-变质）', '不会循环', '只在实验室', '只有一次'], answer: 0, explain: '地球大转盘' },
  ],
});

L['sci-15'] = mk({ id: 'sci-15', island: 'cross', order: 288, title: '简单机械：省力的智慧', emoji: '🔧',
  subjectArea: '科学', gradeBand: 'primary', grade: 5, textbook: '冀人版科学（小学）',
  curriculum: { module: '物质世界', points: ['杠杆·滑轮·斜面', '省力与费距离', '生活中的简单机械'] },
  story: '阿基米德说"给我一个支点我能撬动地球"——杠杆、滑轮、斜面这些"简单机械"从古埃及金字塔用到今天的工地。省力还是省距离？总要选一头。',
  goals: ['认识杠杆滑轮斜面的原理', '理解省力必费距离', '会辨认生活中的简单机械'],
  aiIntro: '🔧 拖动支点位置，看同样的力能撬起多重的东西——杠杆的魔法！',
  lab: { params: [{ name: 'pos', label: '支点位置', min: 1, max: 5, step: 1, value: 3 }],
    grid: true, explore: ['支点靠近重物时更省力还是费力？', '斜面为什么省力？', '什么机械省力但费距离？'],
    code: `# 简单机械探索台
pos = 3   # 支点位置（1远5近）

hide()
# 杠杆
lever = 360
x0 = -180 + (pos - 1) * 60
pen_color("#78716c")
pen_down()
go_to(-180, 30)
go_to(180, 30)
pen_up()
fill_rect(x0, 18, 16, 26, "#dc2626")
write("支点", x0, -5, "#dc2626", 10)
fill_rect(130, 55, 50, 36, "#f59e0b")
write("重物", 130, 55, "#fff", 10)
# 力臂比例
armL = pos
armR = 6 - pos
gain = armL / armR
write("动力臂:" + armL + " 阻力臂:" + armR, -70, 120, "#1d4ed8", 12)
if gain >= 1:
    write("省力杠杆！省 " + gain + " 倍（但压得更远）", -60, -60, "#16a34a", 12)
if gain < 1:
    write("费力杠杆（省距离，如钓鱼竿）", -30, -60, "#ea580c", 12)
write("省力必费距离——天下没有免费的午餐", -90, -95, "#dc2612", 12)
write("斜面也省力：同样爬高，走坡道比爬梯省劲", -100, 145, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '三大简单机械', body: '【杠杆：绕支点转动的杆（撬棒）】【滑轮：绳绕轮（旗杆顶定滑轮改变方向、起重机动滑轮省力）】【斜面：坡道（盘山公路、无障碍坡道）】\n楔子（斧头）和螺丝是斜面的变形。' },
      { title: '省力必费距离', body: '【省力的机械一定多走距离，功不会凭空减少】\n盘山公路省力但走得更远；撬棒省力但压下很远。\n"既省力又省距离"的机械不存在——能量守恒。' },
      { title: '生活中的它们', body: '【剪刀（两杠杆）、指甲刀、开瓶器（省力杠杆）】【钓鱼竿、筷子、镊子（费力杠杆省距离）】【滑轮组（吊车吊重物）】【斜面（搬重物上车的斜板）】\n人体骨骼也是杠杆：肘是支点、肌肉提供力。' },
    ], examples: [
      { q: '为什么盘山公路比直上直下的台阶省力？', steps: ['斜面把同样的高度摊到更长的路程', '每一步只需克服较小的力', '走得更远但更轻松', '省力费距离的典型'], tip: '斜面=把"陡"变"缓"' },
      { q: '指甲刀是省力还是费力杠杆？', steps: ['按压端力臂长、阻力端力臂短', '动力臂 > 阻力臂', '是省力杠杆', '所以轻轻一按就能剪断硬指甲'], tip: '比力臂长短即可判断' },
    ], mistakes: ['相信"又省力又省距离"的机械存在', '钓鱼竿是省力杠杆（实为费力省距离）'] },
  exercises: [
    { q: '下列不属于简单机械的是？', options: ['发动机', '杠杆', '滑轮', '斜面'], answer: 0, explain: '发动机是复杂机械' },
    { q: '省力的机械一定？', options: ['费距离', '也省距离', '省时间', '省能量'], answer: 0, explain: '功守恒' },
    { q: '钓鱼竿属于？', options: ['费力杠杆（省距离）', '省力杠杆', '斜面', '滑轮'], answer: 0, explain: '手移动少、鱼端动多' },
    { q: '盘山公路利用了？', options: ['斜面', '杠杆', '滑轮', '轮轴'], answer: 0, explain: '把陡变缓' },
    { q: '旗杆顶的定滑轮作用是？', options: ['改变用力方向', '省力', '省功', '加速'], answer: 0, explain: '向下拉旗向上升' },
    { q: '人体中的"杠杆"支点如肘关节，动力来自？', options: ['肌肉收缩', '地球引力', '风力', '血压'], answer: 0, explain: '肌肉提供动力' },
  ],
});

// 写入
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`新增课程 ${n} 节`);
