import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第70轮（整十里程碑）：语文+2 英语+2 音乐+2 体育+2 = 8 节 → 总计 540 课 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => {
  const tasks = (o.lab.explore || []).map((text, i) => ({
    id: 'e' + i, text: '探索：' + text, check: { type: 'manual' },
    hintPrompts: ['动手验证：把参数拖到两个极端对比观察', '把发现说给 AI 老师听，让它帮你变成结论'],
  }));
  tasks.push({ id: 'quiz', text: '完成随堂小练', check: { type: 'manual' }, hintPrompts: ['先做几组实验再答题，答案就藏在演示里'] });
  return { toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks,
    codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o };
};

L['chn-35'] = mk({ id: 'chn-35', island: 'cross', order: 536, title: '标点符号：句子的表情', emoji: '❓',
  subjectArea: '语文', gradeBand: 'primary', grade: 6, textbook: '统编版语文（六年级）',
  curriculum: { module: '标点符号', points: ['句号问号叹号', '冒号与引号', '标点的语气功能'] },
  story: '同样一句话，句号是平静，问号是好奇，叹号是激动——标点是句子的表情！用错标点，意思可能完全变了：「吃饭了。」「吃饭了？」「吃饭了！」三种语气，你品品。',
  goals: ['掌握三种句末标点', '学会对话中的冒号引号', '理解标点的语气功能'],
  aiIntro: '❓ 切换句子类型，看标点怎么给句子换表情——标点诊断台！',
  lab: { params: [{ name: 'kind', label: '句子类型', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['kind=1 和 kind=3 的语气差在哪？', 'kind=4 对话里冒号引号怎么配合？', '问号能用在陈述句末尾吗？'],
    code: `# 标点符号诊断台
kind = 1   # 1陈述 2疑问 3感叹 4对话

hide()
t = "陈述句：句末用句号（。）"
s = "今天天气很好。"
tip = "语气平缓地说事实，用句号收尾"
if kind == 2:
    t = "疑问句：句末用问号（？）"
    s = "你今天读书了吗？"
    tip = "提出问题、有疑问语气，用问号收尾"
if kind == 3:
    t = "感叹句：句末用叹号（！）"
    s = "这场比赛太精彩了！"
    tip = "表达强烈感情（惊讶·高兴·赞美），用叹号"
if kind == 4:
    t = "对话：冒号+引号"
    s = "老师说：「明天带彩笔。」"
    tip = "提示语在后，冒号引出原话；引号里再套标点"
fill_rect(0, 130, 340, 30, "#7c3aed")
write(t, 0, 130, "#fff", 12)
fill_rect(0, 56, 320, 72, "#faf5ff")
write(s, 0, 56, "#4c1d95", 14)
fill_rect(0, -28, 320, 48, "#fef3c7")
write(tip, 0, -28, "#b45309", 10)
write("标点是句子的表情符号", 0, -92, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '句末三兄弟', body: '【句号（。）：陈述事实·语气平缓】今天星期三。\n【问号（？）：提出问题·有疑问】你去吗？\n【叹号（！）：强烈感情·惊讶赞美】多美的花呀！\n判断方法：把句子读出声，听语气落点。' },
      { title: '对话标点', body: '【冒号（：）+引号（「」）：提示语后引出原话】\n老师说：「明天带彩笔。」\n引号里面是完整的话，句末标点放在引号里面。\n提示语在后时： 「明天带彩笔。」老师说。（句号变成逗号→提示语后用句号）' },
      { title: '常用标点一览', body: '【逗号（，）：句中停顿】春天的花，夏天的雨。\n【顿号（、）：并列词语间】苹果、香蕉、橘子。\n【分号（；）：并列分句间】白天，他上学；晚上，他读书。\n【书名号（《》）：书名篇名】我爱读《西游记》。\n标点虽小，语气全靠它。' },
    ], examples: [
      { q: '「多美呀（ ）」括号里填什么标点？', steps: ['读一读：语气强烈·表达赞美', '强烈感情用叹号', '填（！）', '如果语气平静才用句号'], tip: '听语气' },
      { q: '把「你吃饭了吗」加上标点', steps: ['这是问问题的句子', '疑问语气', '句末加问号', '你吃饭了吗？'], tip: '疑问用问号' },
    ], mistakes: ['一句到底全用逗号（该断句用句号）', '引号里的句末标点放引号外面（应放里面）'] },
  exercises: [
    { q: '表达强烈感情的标点是？', options: ['叹号', '句号', '逗号', '顿号'], answer: 0, explain: '！' },
    { q: '并列词语之间用？', options: ['顿号', '句号', '分号', '冒号'], answer: 0, explain: '、' },
    { q: '书名用什么标点？', options: ['书名号', '引号', '括号', '破折号'], answer: 0, explain: '《》' },
    { q: '提示语后引出原话用？', options: ['冒号+引号', '句号', '问号', '分号'], answer: 0, explain: '：「」' },
    { q: '「你去还是留（ ）」填？', options: ['？', '。', '！', '，'], answer: 0, explain: '疑问句' },
    { q: '引号里句子的句末标点放在？', options: ['引号里面', '引号外面', '都行', '删掉'], answer: 0, explain: '属于原话' },
  ],
});

L['chn-36'] = mk({ id: 'chn-36', island: 'cross', order: 537, title: '查字典：自学的大门', emoji: '📕',
  subjectArea: '语文', gradeBand: 'primary', grade: 3, textbook: '统编版语文（三年级）',
  curriculum: { module: '识字与写字', points: ['音序查字法', '部首查字法', '数笔画查字法'] },
  story: '遇到不认识的字怎么办？问字典！知道读音查音序，知道样子查部首，都不认识数笔画——学会三种查字法，天下汉字都难不倒你。字典是不说话的老师。',
  goals: ['掌握音序查字法', '掌握部首查字法', '会按情况选方法'],
  aiIntro: '📕 切换查字法，看三种开门钥匙怎么用——查字典训练台！',
  lab: { params: [{ name: 'method', label: '查字法', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['method=1 什么情况用音序查字法？', 'method=2 部首查字法第一步数什么？', '三种方法各自的钥匙是什么？'],
    code: `# 查字典训练台
method = 1   # 1音序 2部首 3数笔画

hide()
t = "音序查字法"
when2 = "知道读音，不知道意思"
s1 = "第一步：读准音节，找大写字母"
s2 = "第二步：音序表里找音节"
s3 = "第三步：按页码翻到正文"
if method == 2:
    t = "部首查字法"
    when2 = "见到生字，不知道读音"
    s1 = "第一步：找出部首，数部首笔画"
    s2 = "第二步：部首目录里查页码"
    s3 = "第三步：数剩余笔画找到字"
if method == 3:
    t = "数笔画查字法"
    when2 = "既不知道读音，也难定部首"
    s1 = "第一步：数清整个字的总笔画"
    s2 = "第二步：难检字笔画表中找"
    s3 = "第三步：翻到对应页码"
fill_rect(0, 130, 340, 30, "#dc2626")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 82, 320, 40, "#fef2f2")
write("适用：" + when2, 0, 82, "#991b1b", 11)
fill_rect(0, 6, 320, 80, "#fff7ed")
write(s1, 0, 26, "#92400e", 11)
write(s2, 0, 6, "#92400e", 11)
write(s3, 0, -14, "#92400e", 11)
write("字典是不说话的老师", 0, -70, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '音序查字法', body: '【口诀：知音查音序】\n适用：知道读音，不知道意思或写法的字。\n三步：①定音节·找大写字母②查音序表·找音节③翻正文页码。\n例：查「聪」→音节 cōng → 音序 C → 正文找到。' },
      { title: '部首查字法', body: '【口诀：知形查部首】\n适用：见到生字，不知道怎么读。\n三步：①找部首·数部首几画②部首目录查页码③数除部首外几画·找到字。\n例：查「沙」→部首氵（3画）→再数「少」4画。' },
      { title: '数笔画查字法', body: '【口诀：难字数笔画】\n适用：独体字或部首难定的字。\n三步：①数清总笔画②查难检字笔画表③翻页码。\n例：查「凹」「凸」这类字。\n三法在手，天下无难字——自学的大门从此打开。' },
    ], examples: [
      { q: '读课外书遇到「巍」不认识，用什么查？', steps: ['不知道读音', '知道字形', '用部首查字法', '部首山（3画）+剩余笔画'], tip: '知形查部首' },
      { q: '写作文想用「xuàn丽」的 xuàn，只知道读音，怎么查？', steps: ['知道读音 xuàn', '用音序查字法', '音序 X，找音节 xuan', '找到「绚」'], tip: '知音查音序' },
    ], mistakes: ['部首查字法第二步直接翻正文（应先查部首目录）', '独体字硬找部首（可用数笔画法）'] },
  exercises: [
    { q: '知道读音不知道意思，用？', options: ['音序查字法', '部首查字法', '数笔画查字法', '没法查'], answer: 0, explain: '知音查音序' },
    { q: '「沙」的部首是？', options: ['氵', '少', '沙', '水'], answer: 0, explain: '三点水' },
    { q: '部首查字法第二步查？', options: ['部首目录', '音序表', '正文', '封面'], answer: 0, explain: '先定页码' },
    { q: '「凹」这样的字适合？', options: ['数笔画查字法', '音序查字法', '部首查字法', '不用查'], answer: 0, explain: '难定部首' },
    { q: '音序查字法的大写字母叫？', options: ['音序', '音节', '声调', '笔画'], answer: 0, explain: '首字母大写' },
    { q: '字典被称作？', options: ['不说话的老师', '睡觉的枕头', '画图册', '练习本'], answer: 0, explain: '自学工具' },
  ],
});

L['eng-38'] = mk({ id: 'eng-38', island: 'cross', order: 538, title: '比较级与最高级：谁更谁最', emoji: '📊',
  subjectArea: '英语', gradeBand: 'primary', grade: 6, textbook: '人教PEP英语六年级上册',
  curriculum: { module: '形容词比较等级', points: ['比较级构成规则', '最高级构成规则', 'than 与 the'] },
  story: 'tall → taller → tallest：比较级比两人，最高级比一群！形容词变身有三条规则，还有 good→better→best 这样的捣蛋鬼——掌握规律，一句 Who is taller? 走天下。',
  goals: ['会构成比较级最高级', '会用 than 句型', '记住常见不规则变化'],
  aiIntro: '📊 切换形容词，看它怎么三段变身——比较级变化台！',
  lab: { params: [{ name: 'adj', label: '形容词', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['adj=2 big 为什么要双写 g？', 'adj=3 heavy 的 y 怎么变？', 'adj=4 为什么不合规则？'],
    code: `# 比较级变化台
adj = 1   # 1tall 2big 3heavy 4good

hide()
base = "tall"
comp = "taller"
sup = "tallest"
rule = "规则一：直接加 er / est"
ex = "Tom is taller than Mike."
if adj == 2:
    base = "big"
    comp = "bigger"
    sup = "biggest"
    rule = "规则二：重读闭音节，双写末尾辅音再加"
    ex = "My box is bigger than yours."
if adj == 3:
    base = "heavy"
    comp = "heavier"
    sup = "heaviest"
    rule = "规则三：辅音字母+y，变 y 为 i 再加"
    ex = "This bag is heavier."
if adj == 4:
    base = "good"
    comp = "better"
    sup = "best"
    rule = "不规则变化，需要背下来"
    ex = "She is the best student."
fill_rect(0, 130, 340, 30, "#2563eb")
write(base + " - " + comp + " - " + sup, 0, 130, "#fff", 13)
fill_rect(0, 76, 320, 42, "#eff6ff")
write(rule, 0, 76, "#1d4ed8", 11)
fill_rect(0, 10, 320, 60, "#fef3c7")
write("原级：a " + base + " boy", 0, 26, "#b45309", 10)
write("比较级/最高级例句：", 0, 6, "#92400e", 9)
write(ex, 0, -12, "#b45309", 10)
write("比较级后接 than · 最高级前加 the", 0, -60, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '三条变身规则', body: '【规则一：一般直接加 -er / -est】tall→taller→tallest\n【规则二：重读闭音节双写末尾辅音】big→bigger→biggest·hot→hotter\n【规则三：辅音字母+y 变 i 再加】heavy→heavier→heaviest·easy→easier\n先看词尾，再选规则。' },
      { title: '句型', body: '【比较级：A … + er + than + B】Tom is taller than Mike.\n【最高级：the + …est + of/in 范围】He is the tallest in our class.\n比较的两者用 than 连接；最高级要说范围（in the class / of all）。\n问身高：Who is taller, Tom or Mike?' },
      { title: '不规则捣蛋鬼', body: '【必背四个】good/well→better→best\nbad→worse→worst　many/much→more→most\nlittle→less→least　far→farther→farthest\n口诀：好坏多少远，通通不规则。\n多音节词（beautiful）加 more/most，不加 er。' },
    ], examples: [
      { q: '翻译：我的书包比你的重。', steps: ['重 heavy→heavier', '比较级句型：A is -er than B', 'My bag is heavier than yours', '别忘了 than'], tip: '变y为i' },
      { q: '他是我们班最高的。', steps: ['高 tall→tallest', '最高级前加 the', '范围 our class 用 in', 'He is the tallest in our class'], tip: 'the+est' },
    ], mistakes: ['比较级忘了 than（My bag is heavier yours ✗）', '双写规则漏掉（biger ✗ 应为 bigger）'] },
  exercises: [
    { q: 'tall 的比较级是？', options: ['taller', 'tallerest', 'more tall', 'tallest'], answer: 0, explain: '直接加er' },
    { q: 'big 的最高级是？', options: ['biggest', 'biger', 'bigst', 'most big'], answer: 0, explain: '双写g加est' },
    { q: 'heavy 的比较级是？', options: ['heavier', 'heavyer', 'more heavy', 'heavest'], answer: 0, explain: '变y为i' },
    { q: 'good 的比较级是？', options: ['better', 'gooder', 'more good', 'best'], answer: 0, explain: '不规则' },
    { q: '比较级连接词用？', options: ['than', 'then', 'that', 'the'], answer: 0, explain: 'A er than B' },
    { q: '最高级前面要加？', options: ['the', 'a', 'an', '不加'], answer: 0, explain: 'the + est' },
  ],
});

L['eng-39'] = mk({ id: 'eng-39', island: 'cross', order: 539, title: 'There be 句型：某处有某物', emoji: '📦',
  subjectArea: '英语', gradeBand: 'primary', grade: 5, textbook: '人教PEP英语五年级上册',
  curriculum: { module: 'There be 句型', points: ['There is/are 的选择', '就近原则', 'some 与 any'] },
  story: 'There is a book on the desk.——「桌上有本书」就这么说！There be 是英语里的「有」字句：某处存在某物用它，某人拥有用 have。is 还是 are？看后面的名词是单数还是复数！',
  goals: ['会选 is 或 are', '理解就近原则', '会用 some 和 any'],
  aiIntro: '📦 切换场景，看 is/are 怎么选——There be 演示台！',
  lab: { params: [{ name: 'scene', label: '场景', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['scene=1 和 scene=2 的 be 动词为什么不同？', 'scene=3 不可数名词用哪个？', 'There be 和 have 的区别是什么？'],
    code: `# There be 演示台
scene = 1   # 1单数 2复数 3不可数

hide()
t = "单数名词用 There is"
s = "There is a book on the desk."
tip = "a/an + 单数名词，动词用 is"
if scene == 2:
    t = "复数名词用 There are"
    s = "There are two birds in the tree."
    tip = "two/some + 复数名词，动词用 are"
if scene == 3:
    t = "不可数名词也用 There is"
    s = "There is some water in the glass."
    tip = "water/milk/bread 不可数，动词用 is"
fill_rect(0, 130, 340, 30, "#16a34a")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 60, 320, 64, "#f0fdf4")
write(s, 0, 60, "#166534", 12)
fill_rect(0, -20, 320, 50, "#fef3c7")
write(tip, 0, -20, "#b45309", 11)
write("There be 表存在 · have 表拥有", 0, -78, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '基本结构', body: '【There be + 某物 + 某处 = 某处有某物】\nThere is a cat under the tree.（树上有只猫）\nThere are some apples on the table.\nbe 动词看后面的名词：单数/不可数→is·复数→are。' },
      { title: '就近原则', body: '【多个名词并列时，be 与最近的名词一致】\nThere is a pen and two books on the desk.（最近的是 a pen → is）\nThere are two books and a pen on the desk.（最近的是 two books → are）\n口诀：be 看邻居，就近不商量。' },
      { title: 'some/any 与否定疑问', body: '【肯定句用 some】There are some ducks on the lake.\n【否定/疑问句用 any】There are not any ducks. / Are there any ducks?\n【一般疑问回答】Yes, there is. / No, there are not.\nThere be 表存在；I have 表拥有——两码事。' },
    ], examples: [
      { q: '翻译：书包里有两支铅笔。', steps: ['两支铅笔复数→are', 'There are + 数量 + 复数', 'There are two pencils in the bag', '地点用 in'], tip: '复数用are' },
      { q: 'There ___ a dog and two cats here. 填？', steps: ['并列名词看最近的', '最近的是 a dog 单数', '填 is', '就近原则'], tip: 'be看邻居' },
    ], mistakes: ['见 There 就用 is（复数要用 are）', '疑问句还用 some（应用 any）'] },
  exercises: [
    { q: 'There ___ a book on the desk. 填？', options: ['is', 'are', 'am', 'be'], answer: 0, explain: '单数用is' },
    { q: 'There ___ some birds in the sky. 填？', options: ['are', 'is', 'am', 'be'], answer: 0, explain: '复数用are' },
    { q: 'There is some ___ in the glass.', options: ['water', 'eggs', 'apples', 'pens'], answer: 0, explain: '不可数名词' },
    { q: 'Are there ___ flowers? 填？', options: ['any', 'some', 'a', 'much'], answer: 0, explain: '疑问用any' },
    { q: 'There ___ a cat and two dogs. 填？', options: ['is', 'are', 'am', 'were'], answer: 0, explain: '就近原则' },
    { q: '表达「桌上有本书」用？', options: ['There is', 'I have', 'He has', 'It is'], answer: 0, explain: '存在用There be' },
  ],
});

L['mus-24'] = mk({ id: 'mus-24', island: 'cross', order: 540, title: '管弦乐队：乐器四大家族', emoji: '🎻',
  subjectArea: '音乐', gradeBand: 'primary', grade: 4, textbook: '人音版音乐（小学）',
  curriculum: { module: '乐器与音色', points: ['弦乐家族', '木管铜管家族', '打击乐家族'] },
  story: '一个管弦乐队将近一百人，分成四个大家族：弦乐唱歌、木管说笑、铜管吹号、打击乐敲鼓——每个家族有自己的性格。听懂音色，你就能「听出」乐队的座位表！',
  goals: ['认识四大家族', '分辨家族音色', '了解乐队座位'],
  aiIntro: '🎻 切换乐器家族，认识乐队四大家族——管弦乐队图鉴！',
  lab: { params: [{ name: 'family', label: '乐器家族', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['family=1 弦乐家族谁个子最小声音最高？', 'family=3 铜管和木管的区别在哪？', '打击乐在乐队里的角色是什么？'],
    code: `# 管弦乐队图鉴
family = 1   # 1弦乐 2木管 3铜管 4打击

hide()
t = "弦乐家族"
mem = "小提琴 · 中提琴 · 大提琴 · 低音提琴"
tone = "音色优美如歌，是乐队的主力"
seat = "坐在指挥正前方，人数最多"
col = "#dc2626"
if family == 2:
    t = "木管家族"
    mem = "长笛 · 单簧管 · 双簧管 · 大管"
    tone = "音色柔和灵活，像说话和唱歌"
    seat = "坐在指挥左侧中排"
    col = "#16a34a"
if family == 3:
    t = "铜管家族"
    mem = "小号 · 圆号 · 长号 · 大号"
    tone = "音色辉煌嘹亮，一响全振"
    seat = "坐在指挥右侧后排"
    col = "#f59e0b"
if family == 4:
    t = "打击乐家族"
    mem = "定音鼓 · 小军鼓 · 三角铁 · 镲"
    tone = "节奏的支柱，负责气氛和高潮"
    seat = "坐在乐队最后排"
    col = "#7c3aed"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 13)
fill_rect(0, 74, 320, 44, "#f8fafc")
write(mem, 0, 74, "#334155", 11)
fill_rect(0, 12, 320, 56, "#fef3c7")
write("音色：" + tone, 0, 26, "#b45309", 10)
write("座位：" + seat, 0, 4, "#92400e", 10)
circle(-110, -60, 20, col)
circle(-40, -60, 20, col)
circle(30, -60, 20, col)
circle(100, -60, 20, col)
write("四位家族成员就位", -6, -60, "#fff", 9)
`,
  },
  teach: { sections: [
      { title: '弦乐家族', body: '【成员：小提琴·中提琴·大提琴·低音提琴】\n发声：弓摩擦琴弦（也可用手指拨）。\n小提琴最高最亮，低音提琴最低最沉。\n弦乐是乐队的中坚，人数约占一半。' },
      { title: '木管与铜管', body: '【木管：长笛·单簧管·双簧管·大管】——吹气发声，音色柔美如歌。\n【铜管：小号·圆号·长号·大号】——嘴唇振动发声，音色辉煌嘹亮。\n区别记忆：木管「说悄悄话」，铜管「喊口号」。' },
      { title: '打击乐家族', body: '【有音高：定音鼓·木琴】能敲出旋律\n【无音高：小军鼓·三角铁·镲】只管节奏和色彩\n角色：乐队的「心跳」——控制节奏·制造高潮。\n四个家族合在一起，就是一幅流动的声音画卷。' },
    ], examples: [
      { q: '怎么快速分辨弦乐和铜管？', steps: ['弦乐：弓拉弦，连绵如歌', '铜管：吹嘴振，嘹亮有力', '听到歌唱般的旋律想弦乐', '听到号角般的声音想铜管'], tip: '听发声方式' },
      { q: '三角铁属于哪个家族？', steps: ['金属打击发声', '无固定音高', '只管节奏和音色点缀', '打击乐家族'], tip: '敲的都归打击' },
    ], mistakes: ['认为长笛是铜管（曾是木制，归木管）', '以为打击乐只是敲锣打鼓的噪音（也管旋律和气氛）'] },
  exercises: [
    { q: '弦乐家族的「主力高音」是？', options: ['小提琴', '大提琴', '低音提琴', '竖琴'], answer: 0, explain: '最高最亮' },
    { q: '长笛属于？', options: ['木管家族', '铜管家族', '弦乐家族', '打击乐'], answer: 0, explain: '木管' },
    { q: '音色「辉煌嘹亮」的是？', options: ['铜管家族', '木管家族', '弦乐家族', '打击乐'], answer: 0, explain: '号角声' },
    { q: '能敲出旋律的打击乐器是？', options: ['定音鼓', '小军鼓', '三角铁', '镲'], answer: 0, explain: '有音高' },
    { q: '乐队人数最多的家族是？', options: ['弦乐', '铜管', '木管', '打击乐'], answer: 0, explain: '约占一半' },
    { q: '打击乐的角色是乐队的？', options: ['心跳', '眉毛', '外套', '鞋子'], answer: 0, explain: '控制节奏' },
  ],
});

L['mus-25'] = mk({ id: 'mus-25', island: 'cross', order: 541, title: '旋律的走向：线条与情绪', emoji: '📈',
  subjectArea: '音乐', gradeBand: 'junior', grade: 7, textbook: '人音版音乐（初中）',
  curriculum: { module: '旋律基础', points: ['上行与情绪', '下行与情绪', '波浪形旋律'] },
  story: '音符一个个排起来就是旋律线：往上走像爬山越来越紧张，往下走像下山越来越放松，波浪线像心跳起伏婉转——旋律的形状，直接画出了情绪的形状！',
  goals: ['认识旋律线三种走向', '理解走向与情绪的关系', '会画简单旋律线'],
  aiIntro: '📈 切换旋律走向，看线条怎么画出情绪——旋律线画板！',
  lab: { params: [{ name: 'melody', label: '旋律走向', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['melody=1 上行时你的心情有什么变化？', 'melody=2 下行为什么让人放松？', '哪种走向最适合抒情歌曲？'],
    code: `# 旋律线画板
melody = 1   # 1上行 2下行 3波浪

hide()
t = "上行旋律"
feel = "情绪逐渐高涨·紧张感增加"
ex = "像爬楼梯：一步比一步高"
col = "#dc2626"
if melody == 2:
    t = "下行旋律"
    feel = "情绪逐渐平静·放松安详"
    ex = "像下山：一步比一步低"
    col = "#2563eb"
if melody == 3:
    t = "波浪形旋律"
    feel = "起伏婉转·最富歌唱性"
    ex = "像海浪：一起一落连绵"
    col = "#16a34a"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 13)
fill_rect(0, 78, 320, 42, "#f8fafc")
write(feel, 0, 78, "#334155", 11)
pen_color(col)
if melody == 1:
    pen_up()
    go_to(-140, -30)
    pen_down()
    go_to(-70, 10)
    go_to(0, 40)
    go_to(70, 66)
    go_to(140, 86)
    pen_up()
if melody == 2:
    pen_up()
    go_to(-140, 86)
    pen_down()
    go_to(-70, 66)
    go_to(0, 40)
    go_to(70, 10)
    go_to(140, -30)
    pen_up()
if melody == 3:
    pen_up()
    go_to(-140, 20)
    pen_down()
    go_to(-90, 70)
    go_to(-40, -10)
    go_to(10, 60)
    go_to(60, -20)
    go_to(110, 40)
    go_to(140, 10)
    pen_up()
write(ex, 0, -76, col, 11)
write("旋律的形状=情绪的形状", 0, -108, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '上行旋律', body: '【音符越来越高→情绪上涨】\n听感：紧张·期待·推进·越来越激动。\n常见用法：乐曲推向高潮前的爬坡。\n例：《国歌》前奏「起来！」向上冲的感觉。' },
      { title: '下行旋律', body: '【音符越来越低→情绪下沉放松】\n听感：平静·安慰·叹息·收束。\n常见用法：乐句结尾·摇篮曲·告别。\n例：摇篮曲「睡吧睡吧」轻轻下行，像哄孩子入睡。' },
      { title: '波浪形旋律', body: '【有起有落→婉转歌唱】\n听感：自然流畅·最像说话和歌唱。\n大多数歌曲都是波浪形：一句上一句下。\n分析方法：把音符标在坐标上，连线看形状。\n会看旋律线=拿到作曲家的情绪地图。' },
    ], examples: [
      { q: '一首歌推向高潮时，旋律通常？', steps: ['高潮=情绪最高点', '上行制造紧张推进', '旋律线持续爬升', '到达顶点后释放'], tip: '高潮靠上行' },
      { q: '摇篮曲为什么多用下行？', steps: ['哄睡需要安静放松', '下行让情绪沉下来', '配合轻柔的节奏', '下行=平静信号'], tip: '下行=放松' },
    ], mistakes: ['认为旋律走向只是「音符高低」（是情绪的方向）', '分析旋律线只看开头（要看整体形状）'] },
  exercises: [
    { q: '上行旋律的听感是？', options: ['紧张推进', '平静放松', '昏昏欲睡', '毫无感觉'], answer: 0, explain: '情绪上涨' },
    { q: '下行旋律常用于？', options: ['乐句结尾', '高潮部分', '开场炸场', '间齐奏'], answer: 0, explain: '收束安慰' },
    { q: '最富歌唱性的走向是？', options: ['波浪形', '直线向上', '直线向下', '同一个音'], answer: 0, explain: '起伏婉转' },
    { q: '《国歌》前奏的上行给你什么感觉？', options: ['昂扬向上', '悲伤哭泣', '昏沉入睡', '平静如水'], answer: 0, explain: '推进冲劲' },
    { q: '旋律线应该怎么画？', options: ['音符高低标坐标连线', '随便画', '只画第一个音', '按歌词画'], answer: 0, explain: '音高走向' },
    { q: '波浪形旋律像什么？', options: ['海浪起伏', '笔直公路', '静止湖面', '垂直瀑布'], answer: 0, explain: '一起一落' },
  ],
});

L['pe-23'] = mk({ id: 'pe-23', island: 'cross', order: 542, title: '立定跳远：一摆二蹬三收四稳', emoji: '🦘',
  subjectArea: '体育与健康', gradeBand: 'primary', grade: 5, textbook: '人教版体育（小学）',
  curriculum: { module: '田径·跳跃', points: ['预摆与起跳', '腾空收腹', '落地缓冲'] },
  story: '立定跳远是体育课的常考项：不用助跑，原地一跳见真章。秘诀就四个字口诀——一摆二蹬三收四稳。动作做完整，比拼尽全力更远！',
  goals: ['掌握四步动作要领', '学会屈膝缓冲', '理解摆臂的作用'],
  aiIntro: '🦘 逐步切换动作阶段，看立定跳远怎么分解——动作分解台！',
  lab: { params: [{ name: 'phase', label: '动作阶段', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['phase=1 预摆为什么要摆臂？', 'phase=2 蹬地的方向是哪里？', 'phase=4 落地不缓冲会怎样？'],
    code: `# 立定跳远动作分解台
phase = 1   # 1预摆 2起跳 3腾空 4落地

hide()
t = "① 预摆"
key = "两脚开立与肩宽·双臂前后摆·重心降低"
wrong2 = "常见错误：直腿站·不摆臂"
col = "#0ea5e9"
if phase == 2:
    t = "② 起跳"
    key = "两脚用力蹬地·双臂快速上摆·向前上方跳出"
    wrong2 = "常见错误：只蹬不摆·方向太平"
    col = "#f97316"
if phase == 3:
    t = "③ 腾空"
    key = "收腹举腿·身体充分伸展像一张弓"
    wrong2 = "常见错误：腿垂着不放"
    col = "#16a34a"
if phase == 4:
    t = "④ 落地"
    key = "脚跟先着地·屈膝缓冲·双臂前伸保平衡"
    wrong2 = "常见错误：直腿硬落地伤膝盖"
    col = "#7c3aed"
fill_rect(0, 130, 340, 30, col)
write(t + " —— 口诀：一摆二蹬三收四稳", 0, 130, "#fff", 11)
fill_rect(0, 70, 320, 50, "#f8fafc")
write(key, 0, 70, "#334155", 11)
fill_rect(0, 4, 320, 50, "#fef2f2")
write(wrong2, 0, 4, "#991b1b", 10)
write("动作做完整比拼尽全力更远", 0, -62, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '预摆与起跳', body: '【预摆：两脚开立·双臂前后摆动·屈膝降低重心】\n摆臂的作用：像荡秋千先后退——蓄力！\n【起跳：两脚前掌用力蹬地·双臂向前上方快摆】\n蹬地方向：向前上方45度左右，不是直上或直前。' },
      { title: '腾空与落地', body: '【腾空：收腹举大腿·小腿前伸·身体成弓形】\n空中把腿收起来=延长腾空时间=跳更远。\n【落地：脚跟着地→屈膝深蹲缓冲→双臂前伸平衡】\n缓冲保护膝盖：像弹簧压下去，不要直腿砸地。' },
      { title: '练习方法', body: '【原地摆臂跳：先练摆蹬配合】\n【跳台阶/跳格子：练蹬地力量】\n【收腹跳：练空中收腿】\n【标志线挑战：每次多跳5厘米】\n安全提示：沙坑或垫子上练·穿运动鞋。' },
    ], examples: [
      { q: '起跳时向哪个方向蹬？', steps: ['不是直上（跳不高不远）', '不是直前（飞不出去）', '向前上方约45度', '像炮弹出膛的抛物线'], tip: '前上方' },
      { q: '落地时膝盖应该？', steps: ['脚跟先着地', '迅速屈膝下蹲缓冲', '像弹簧吸收力量', '保护膝盖不受伤'], tip: '屈膝缓冲' },
    ], mistakes: ['起跳不摆臂（损失一半力量）', '直腿落地（膝盖受冲击易伤）'] },
  exercises: [
    { q: '立定跳远口诀是？', options: ['一摆二蹬三收四稳', '一跑二跳三落地', '先蹲后站起来', '看天跳'], answer: 0, explain: '四步完整' },
    { q: '起跳的蹬地方向是？', options: ['向前上方', '垂直向上', '正前方', '向后'], answer: 0, explain: '45度抛物线' },
    { q: '摆臂的作用是？', options: ['蓄力配合蹬地', '好看', '没有作用', '保持发型'], answer: 0, explain: '增加起跳力' },
    { q: '落地时应该？', options: ['屈膝缓冲', '直腿站直', '坐下', '单脚跳'], answer: 0, explain: '保护膝盖' },
    { q: '腾空时要？', options: ['收腹举腿', '腿放松下垂', '抱住头', '闭上眼'], answer: 0, explain: '延长腾空' },
    { q: '预摆时重心要？', options: ['降低', '升高', '不变', '左右晃'], answer: 0, explain: '屈膝蓄力' },
  ],
});

L['pe-24'] = mk({ id: 'pe-24', island: 'cross', order: 543, title: '篮球运球：球随人走', emoji: '🏀',
  subjectArea: '体育与健康', gradeBand: 'junior', grade: 7, textbook: '人教版体育（初中）',
  curriculum: { module: '球类·篮球', points: ['原地运球', '行进间运球', '体前变向'] },
  story: '新手运球盯着球看，老手运球看全场——差别在球感！运球的秘诀是「球随人走」：手感受球，球听指挥。练好三种运球，过人就有了底气。',
  goals: ['掌握原地运球手型', '学会行进间运球', '会做体前变向'],
  aiIntro: '🏀 切换训练科目，看运球怎么练——运球训练场！',
  lab: { params: [{ name: 'drill', label: '训练科目', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['drill=1 五指怎么控球？', 'drill=2 行进间按拍球的哪个部位？', '变向时重心为什么要低？'],
    code: `# 运球训练场
drill = 1   # 1原地 2行进间 3变向

hide()
t = "① 原地运球"
key = "五指张开·指根以上控球·球弹到腰高·另一手抬臂护球"
tip = "手心不碰球·像给球装了方向盘"
if drill == 2:
    t = "② 行进间运球"
    key = "按拍球的后上方·球落在身体侧前方·跑动节奏一致"
    tip = "人球同步·球像粘在手上"
if drill == 3:
    t = "③ 体前变向"
    key = "降低重心·换手按拍球的侧上方·身体从旁侧过"
    tip = "重心低才拐得急·护球手挡防守"
fill_rect(0, 130, 340, 30, "#f97316")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 70, 320, 52, "#fff7ed")
write(key, 0, 70, "#92400e", 10)
fill_rect(0, -4, 320, 52, "#fef3c7")
write("要领：" + tip, 0, -4, "#b45309", 11)
write("眼睛看前方不看球·球感是练出来的", 0, -66, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '原地运球', body: '【手型：五指自然张开·指根以上部位触球·手心空出】\n按拍：手腕手指柔和用力·球反弹到腰际高度。\n护球：非运球手抬臂挡住防守。\n练习：左右手各50次·高低运球交替。' },
      { title: '行进间运球', body: '【按拍球的后上方→球向前走】\n落点：身体侧前方一步左右（不挡脚·不追球）。\n节奏：跑得快按得重·跑得慢按得轻。\n眼睛看前方——用手的感觉控制球。' },
      { title: '体前变向', body: '【动作：右手拍球右侧上方→推到左侧→左手接续→身体从右侧突破】\n关键：重心降低（拐弯才急）·蹬跨要快。\n护球：变向瞬间用身体挡住防守者。\n练习：慢速走动变向→慢跑变向→对抗变向。' },
    ], examples: [
      { q: '运球总是脱手飞走，怎么改？', steps: ['检查手型：五指张开·手心空出', '用指根以上部位按拍', '手腕手指柔和用力不硬拍', '球弹到腰高最稳'], tip: '手指控球' },
      { q: '行进间运球总是追着球跑，为什么？', steps: ['检查按拍部位：要按后上方', '落点应在身体侧前方一步', '按拍节奏跟跑速一致', '球像粘在手上才是对的'], tip: '人球同步' },
      { q: '变向总被断球怎么办？', steps: ['变向前先降低重心', '换手按拍球的侧上方', '身体从旁侧快速蹬跨过人', '非运球手抬臂护球'], tip: '低重心是钥匙' },
    ], mistakes: ['手心拍球（控不住方向）', '低头看球不看场上（养成坏习惯）'] },
  exercises: [
    { q: '运球触球部位是？', options: ['指根以上', '手心', '拳头', '手腕'], answer: 0, explain: '手指控球' },
    { q: '行进间球的落点在？', options: ['身体侧前方', '正脚下', '身后', '任意'], answer: 0, explain: '不挡脚' },
    { q: '运球时眼睛看？', options: ['前方场上', '盯着球', '看天空', '看观众'], answer: 0, explain: '球感控制' },
    { q: '体前变向的关键是？', options: ['降低重心+换手快', '跳得高', '跑得快', '喊得响'], answer: 0, explain: '重心低' },
    { q: '原地运球球反弹到？', options: ['腰际高度', '膝盖以下', '头顶', '任意高度'], answer: 0, explain: '腰高好控' },
    { q: '护球手的作用是？', options: ['挡住防守', '抓衣服', '指方向', '没有用'], answer: 0, explain: '保护球' },
  ],
});

/* 写入 */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第70轮写入 ${n} 节：${Object.keys(L).join(', ')}`);
