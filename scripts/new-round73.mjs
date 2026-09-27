import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第73轮：语文+2 英语+2 科学+2 地理+2 = 8 节（总计 564 课） */
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

L['chn-37'] = mk({ id: 'chn-37', island: 'cross', order: 560, title: '记叙文六要素：事情的骨架', emoji: '🦴',
  subjectArea: '语文', gradeBand: 'junior', grade: 8, textbook: '统编版语文（初中）',
  curriculum: { module: '现代文阅读·记叙文', points: ['六要素内容', '详略安排', '线索梳理'] },
  story: '时间、地点、人物、起因、经过、结果——六根骨头撑起一件完整的事。缺了「起因」，读者一头雾水；漏了「结果」，故事有头无尾。读完先找六要素，文章的骨架就摸清了。',
  goals: ['熟记六要素', '会分析详略安排', '会找文章线索'],
  aiIntro: '🦴 逐个点亮六要素，看一件事的骨架怎么搭——记叙文透视台！',
  lab: { params: [{ name: 'el', label: '要素', min: 1, max: 6, step: 1, value: 1 }],
    grid: false, explore: ['el=4 起因和结果有什么关系？', '六要素里哪个通常写得最详细？', '缺了哪个要素读者最迷糊？'],
    code: `# 记叙文透视台
el = 1   # 要素

hide()
t = "时间"
d = "事情发生在什么时候：某天·某季节·某个年代"
ask2 = "我找对了吗：开头的年月日·季节景物都是时间线索"
col = "#dc2626"
if el == 2:
    t = "地点"
    d = "事情发生在哪里：教室·操场·回家的路上"
    ask2 = "我找对了吗：人物活动的场所变化就是地点转换"
    col = "#f97316"
if el == 3:
    t = "人物"
    d = "谁的故事：主要人物是谁·还有哪些配角"
    ask2 = "我找对了吗：出场最多·推动情节的是主要人物"
    col = "#facc15"
if el == 4:
    t = "起因"
    d = "为什么会发生这件事：矛盾·误会·一个请求"
    ask2 = "我找对了吗：起因是故事的发动机"
    col = "#16a34a"
if el == 5:
    t = "经过"
    d = "事情怎么发展的：波折·冲突·高潮（通常最详细）"
    ask2 = "我找对了吗：经过写得最细·笔墨最多"
    col = "#0ea5e9"
if el == 6:
    t = "结果"
    d = "事情最后怎样了：解决·和解·留下回味"
    ask2 = "我找对了吗：结果常在结尾·有时含蓄留白"
    col = "#7c3aed"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 14)
fill_rect(0, 66, 320, 54, "#f8fafc")
write(d, 0, 66, "#334155", 11)
fill_rect(0, -14, 320, 52, "#fef3c7")
write(ask2, 0, -14, "#b45309", 10)
write("时间 地点 人物 起因 经过 结果", -20, -76, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '六要素', body: '【时间·地点·人物·起因·经过·结果】\n概括一件事的公式：什么时间什么地点，谁因为什么原因，做了什么，结果怎样。\n按这个公式说话，一句话就能讲清一件事。' }, 
      { title: '详略安排', body: '【经过最详：波折和高潮是文章主体】\n【起因结果较略：交代清楚即可】\n【中心思想决定详略：与主题关系大的写细·关系小的略写】\n判断详略：看字数·看描写密度·看情感投入。' },
      { title: '线索', body: '【线索：贯穿全文的「线」】\n常见线索：一个物品（背影里的橘子）·一句话·一种情感·时间变化·地点转换。\n找线索方法：反复出现的词物·标题·首尾呼应处。\n抓住线索，散落的材料就串成了一串珠子。' },
    ], examples: [
      { q: '用一句话概括《散步》的内容', steps: ['时间：初春的田野', '人物：我·母亲·妻子·儿子', '事件：散步路线起分歧', '结果：走小路其乐融融'], tip: '六要素公式' },
      { q: '为什么文章把「经过」写得最详细？', steps: ['经过包含波折和高潮', '最能表现人物和主题', '读者最关心的部分', '详略为中心思想服务'], tip: '详略服务主题' },
    ], mistakes: ['概括时漏掉「结果」（有头无尾）', '把起因和经过混在一起（起因是发动机不是主体）'] },
  exercises: [
    { q: '记叙文六要素不包括？', options: ['作者的感想', '时间', '人物', '结果'], answer: 0, explain: '六要素是骨架' },
    { q: '通常写得最详细的是？', options: ['经过', '时间', '起因', '地点'], answer: 0, explain: '主体部分' },
    { q: '详略安排由什么决定？', options: ['中心思想', '字数限制', '心情', '老师要求'], answer: 0, explain: '为主题服务' },
    { q: '贯穿全文的「线」叫？', options: ['线索', '标题', '主旨', '过渡'], answer: 0, explain: '串联材料' },
    { q: '反复出现的物品往往是？', options: ['线索', '闲笔', '错误', '装饰'], answer: 0, explain: '找线索技巧' },
    { q: '概括一件事的公式要包含？', options: ['六要素', '修辞手法', '作者生年', '出版信息'], answer: 0, explain: '完整叙事' },
  ],
});

L['chn-38'] = mk({ id: 'chn-38', island: 'cross', order: 561, title: '议论文三要素', emoji: '⚖️',
  subjectArea: '语文', gradeBand: 'junior', grade: 9, textbook: '统编版语文（初中）',
  curriculum: { module: '现代文阅读·议论文', points: ['论点', '论据', '论证方法'] },
  story: '议论文就是「摆事实、讲道理」：论点是你要证明的观点（靶心），论据是支撑观点的材料（弹药），论证是用材料打中靶心的过程（射击）。三要素合力，观点才站得住！',
  goals: ['会找中心论点', '区分事实论据和道理论据', '识别常见论证方法'],
  aiIntro: '⚖️ 切换三要素，看观点怎么被撑起来——议论文解剖台！',
  lab: { params: [{ name: 'el', label: '三要素', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['el=1 中心论点常出现在哪里？', 'el=2 事实论据和道理论据怎么区分？', '比喻论证和举例论证有什么不同？'],
    code: `# 议论文解剖台
el = 1   # 1论点 2论据 3论证

hide()
t = "论点：作者的观点（靶心）"
d = "一句话回答：作者到底想证明什么"
tip = "中心论点常在标题·开头·结尾；是判断句不是疑问句"
col = "#dc2626"
if el == 2:
    t = "论据：支撑观点的材料（弹药）"
    d = "事实论据：事例·史实·数据；道理论据：名言·定理·公认道理"
    tip = "判断方法：讲了一个故事=事实；引用了名言=道理"
    col = "#2563eb"
if el == 3:
    t = "论证：用材料打中靶心（射击）"
    d = "举例论证·道理论证·对比论证·比喻论证"
    tip = "比喻论证用打比方说理；举例论证用真事说理"
    col = "#16a34a"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 12)
fill_rect(0, 66, 320, 54, "#f8fafc")
write(d, 0, 66, "#334155", 10)
fill_rect(0, -14, 320, 52, "#fef3c7")
write(tip, 0, -14, "#b45309", 9)
write("论点+论据+论证=一篇有说服力的议论文", -20, -76, "#64748b", 9)
`,
  },
  teach: { sections: [
      { title: '找论点', body: '【论点：作者的完整观点判断句】\n位置线索：标题即论点·开头亮观点·结尾总结升华。\n检验：能回答「作者认为什么」；是陈述判断，不是问题或话题。\n注意区分论题（谈什么）和论点（认为什么）。' }, 
      { title: '论据两类', body: '【事实论据：具体事例·史实·统计数字】有说服力的「实锤」。\n【道理论据：名言警句·科学定理·公认道理】借权威的「光环」。\n好的议论文两类论据搭配使用，虚实结合。' },
      { title: '四种论证', body: '【举例论证：摆事实】最具说服力。\n【道理论证：讲道理·引名言】\n【对比论证：正反对照】是非自明。\n【比喻论证：打比方】抽象道理形象化（「毅力是刀刃上的钢」）。\n答题格式：运用了……论证，有力证明了……观点。' },
    ], examples: [
      { q: '「敬业与乐业」的中心论点是什么？', steps: ['看标题和开头', '开头亮出：敬业乐业四个字是人生不二法门', '即：人要敬业·要乐业', '分论点：有业·敬业·乐业层层递进'], tip: '开头亮观点' },
      { q: '居里夫人提炼镭的事例是什么论据？', steps: ['判断：是真实发生的事', '有具体人物·过程·结果', '属于事实论据', '用于证明「恒心成就事业」等观点'], tip: '实事=事实论据' },
    ], mistakes: ['把论题当论点（「谈勤奋」是论题不是论点）', '认为引用名言就是举例论证（那是道理论证）'] },
  exercises: [
    { q: '议论文三要素是？', options: ['论点论据论证', '起因经过结果', '时间地点人物', '论点开头结尾'], answer: 0, explain: '骨架三件套' },
    { q: '中心论点常出现在？', options: ['标题开头结尾', '中间段落', '注释里', '任何地方都一样'], answer: 0, explain: '找位置' },
    { q: '名言警句属于？', options: ['道理论据', '事实论据', '论证方法', '论点'], answer: 0, explain: '讲道理' },
    { q: '「有业之必要」用了大量古代实例，属于？', options: ['事实论据', '道理论据', '比喻论证', '论点'], answer: 0, explain: '摆事实' },
    { q: '打比方说理是？', options: ['比喻论证', '举例论证', '对比论证', '道理论证'], answer: 0, explain: '形象化' },
    { q: '正反对照说理是？', options: ['对比论证', '比喻论证', '举例论证', '引用论证'], answer: 0, explain: '是非自明' },
  ],
});

L['eng-40'] = mk({ id: 'eng-40', island: 'cross', order: 562, title: '被动语态：谁是主角', emoji: '🔄',
  subjectArea: '英语', gradeBand: 'junior', grade: 8, textbook: '人教版英语（初中八年级）',
  curriculum: { module: '被动语态', points: ['主动变被动', 'be + 过去分词', 'by 短语'] },
  story: 'The boy broke the window. 强调「谁干的」；The window was broken by the boy. 强调「窗户怎么样了」——同一件事，换主角就是换语态！当动作的承受者更重要时，用被动语态。',
  goals: ['理解被动含义', '掌握主动变被动三步', '会按时态变换 be'],
  aiIntro: '🔄 切换例句，看主语宾语怎么换座位——被动语态变形台！',
  lab: { params: [{ name: 'cs', label: '例句', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['cs=1 主动句的宾语去哪了？', 'by the boy 什么时候可以省略？', '三步变被动是哪三步？'],
    code: `# 被动语态变形台
cs = 1   # 例句

hide()
act = "The boy broke the window."
pas = "The window was broken by the boy."
t = "一般过去时：was/were + 过去分词"
if cs == 2:
    act = "People grow rice in the south."
    pas = "Rice is grown in the south (by people)."
    t = "一般现在时：am/is/are + 过去分词；泛指人时 by 可省"
if cs == 3:
    act = "They will plant trees tomorrow."
    pas = "Trees will be planted tomorrow."
    t = "一般将来时：will be + 过去分词"
fill_rect(0, 130, 340, 30, "#f59e0b")
write("主动 → 被动", 0, 130, "#fff", 13)
fill_rect(0, 78, 320, 44, "#f8fafc")
write(act, 0, 78, "#334155", 11)
fill_rect(0, 14, 320, 52, "#fef3c7")
write(pas, 0, 24, "#b45309", 10)
write("be 随时态变化 · 动词变过去分词", 0, 2, "#92400e", 9)
fill_rect(0, -58, 320, 44, "#eff6ff")
write(t, 0, -58, "#1d4ed8", 10)
`,
  },
  teach: { sections: [
      { title: '什么是被动', body: '【主动：主语是动作的执行者】We clean the classroom.\n【被动：主语是动作的承受者】The classroom is cleaned by us.\n用被动的时机：不知道谁做的·谁做不重要·强调承受者。' }, 
      { title: '三步变形', body: '【①宾语提前当主语】window → The window\n【②动词变 be + 过去分词】broke → was broken\n【③原主语放 by 后（可省略）】by the boy\n口诀：宾变主·动变被动·主变 by 宾。' },
      { title: 'be 的时态', body: '【一般现在时】am/is/are done：is grown\n【一般过去时】was/were done：was broken\n【一般将来时】will be done：will be planted\n【现在完成时】have/has been done\nbe 像变形金刚·过去分词永不变。' },
    ], examples: [
      { q: '把 They clean the room every day. 变成被动', steps: ['宾语 the room 提前', 'clean → are cleaned（复数主语）', 'The room is cleaned…？注意 the room 单数', 'The room is cleaned by them every day.'], tip: 'be 看新主语' },
      { q: '被动句 Rice is grown in the south 的 by people 为什么省了？', steps: ['people 是泛指「人们」', '不知道/不必说明是谁', '泛指的执行者可以省略', '省后更简洁'], tip: '泛指可省' },
    ], mistakes: ['被动句 be 的单复数还跟着旧主语（应跟新主语）', '忘记把动词变成过去分词（was break ✗）'] },
  exercises: [
    { q: '被动语态的基本形式？', options: ['be + 过去分词', 'be + 现在分词', 'do + 过去分词', 'have + 过去分词'], answer: 0, explain: 'be done' },
    { q: 'The window ___ broken by the boy. 填？', options: ['was', 'is', 'were', 'are'], answer: 0, explain: '过去时单数' },
    { q: 'Rice ___ grown in the south. 填？', options: ['is', 'are', 'was', 'am'], answer: 0, explain: '现在时单数' },
    { q: '主动变被动第一步？', options: ['宾语提前当主语', '动词提前', '加 by', '变疑问'], answer: 0, explain: '宾变主' },
    { q: 'Trees will be planted 属于什么时态被动？', options: ['一般将来时', '一般现在时', '现在完成时', '过去时'], answer: 0, explain: 'will be done' },
    { q: 'by people 什么时候可省？', options: ['泛指人们时', '永远不能省', '过去时', '有宾语时'], answer: 0, explain: '执行者不重要' },
  ],
});

L['eng-41'] = mk({ id: 'eng-41', island: 'cross', order: 563, title: '一般过去式：昨天的事', emoji: '⏮',
  subjectArea: '英语', gradeBand: 'primary', grade: 6, textbook: '人教PEP英语六年级下册',
  curriculum: { module: '一般过去时', points: ['动词过去式变化', '时间标志词', '疑问否定式'] },
  story: 'yesterday、last week、two days ago——看到这些词，动词就要「穿古装」变过去式！规则动词加 ed，不规则动词各自变身（go→went）。过去时讲昨天的故事，故事讲完记得回来！',
  goals: ['掌握规则变化', '背熟常见不规则', '会用时间标志词'],
  aiIntro: '⏮ 切换动词类型，看动词怎么穿古装——过去式变装台！',
  lab: { params: [{ name: 'type', label: '动词类型', min: 1, max: 4, step: 1, value: 1 }],
    grid: false, explore: ['type=1 play 和 study 的变化为什么不同？', 'type=4 go 的过去式怎么背？', '哪些时间词提示用过去时？'],
    code: `# 过去式变装台
type = 1   # 1规则加ed 2e结尾加d 3辅音+y 4不规则

hide()
t = "规则一：直接加 ed"
ex = "play - played · visit - visited"
tip = "大部分动词这样变"
col = "#16a34a"
if type == 2:
    t = "规则二：e 结尾只加 d"
    ex = "like - liked · live - lived"
    tip = "已经有 e 了就不重复加"
    col = "#0ea5e9"
if type == 3:
    t = "规则三：辅音字母+y，变 y 为 i 加 ed"
    ex = "study - studied · carry - carried"
    tip = "元音字母+y 直接加 ed：play - played"
    col = "#f97316"
if type == 4:
    t = "不规则：逐个背"
    ex = "go-went · eat-ate · see-saw · do-did"
    tip = "不规则动词表每天读一遍"
    col = "#dc2626"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 11)
fill_rect(0, 70, 320, 52, "#f8fafc")
write(ex, 0, 70, "#334155", 11)
fill_rect(0, -2, 320, 52, "#fef3c7")
write(tip, 0, -2, "#b45309", 10)
write("标志词：yesterday · last week · …ago · just now", -20, -64, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '四条变化规则', body: '【一般动词 + ed】play→played\n【e 结尾 + d】like→liked\n【辅音+y：变 y 为 i + ed】study→studied\n【不规则：背】go→went·do→did·have→had\n规则靠理解·不规则靠背诵。' }, 
      { title: '时间标志词', body: '【看到这些词 = 用过去时】\nyesterday（昨天）·last night/week/month（上个……）\n…ago（……以前）·just now（刚才）·in 2020（在过去年份）\n标志词是时态的红绿灯。' },
      { title: '句型变换', body: '【肯定】I played football yesterday.\n【否定】I did not (did not) play…——动词还原！\n【疑问】Did you play…?——用 did 提问·动词还原。\n口诀：did 一出现·动词回原形。' },
    ], examples: [
      { q: '把 I go to the park yesterday 改对', steps: ['yesterday 提示过去时', 'go 变 went', 'I went to the park yesterday', '别忘了动词变身'], tip: '标志词定 时态' },
      { q: '变疑问句：She watched TV last night.', steps: ['过去时用 Did 提问', 'watched 还原成 watch', 'Did she watch TV last night?', 'did 出现动词回原形'], tip: 'did+原形' },
    ], mistakes: ['用了 did 还保留过去式（Did you went ✗ 应 watch）', '辅音+y 动词直接加 ed（studyed ✗ 应 studied）'] },
  exercises: [
    { q: 'study 的过去式是？', options: ['studied', 'studyed', 'studed', 'studying'], answer: 0, explain: '变y为i' },
    { q: 'go 的过去式是？', options: ['went', 'goed', 'gone', 'going'], answer: 0, explain: '不规则' },
    { q: '哪个词提示用过去时？', options: ['yesterday', 'now', 'tomorrow', 'usually'], answer: 0, explain: '昨天' },
    { q: 'Did you ___ TV last night? 填？', options: ['watch', 'watched', 'watches', 'watching'], answer: 0, explain: 'did后还原' },
    { q: 'like 的过去式是？', options: ['liked', 'likeded', 'likeed', 'like'], answer: 0, explain: 'e结尾加d' },
    { q: 'I ___ football yesterday. 填？', options: ['played', 'play', 'plays', 'playing'], answer: 0, explain: '加ed' },
  ],
});

L['sci-33'] = mk({ id: 'sci-33', island: 'cross', order: 564, title: '水的三态变化', emoji: '💧',
  subjectArea: '科学', gradeBand: 'primary', grade: 5, textbook: '教科版科学（小学五年级）',
  curriculum: { module: '水的三态变化', points: ['三态特征', '熔化凝固', '汽化液化升华'] },
  story: '水是变形大师：冷了变冰，热了变汽，天上地下循环不息。冰化成水、水烧成汽、汽凝成露——六种变化全靠吸热放热在指挥。看懂三态变化，就看懂了云雨霜雪！',
  goals: ['认识三态特征', '掌握六种变化', '理解吸热放热'],
  aiIntro: '💧 切换变化过程，看水怎么变形——三态变化变形器！',
  lab: { params: [{ name: 'chg', label: '变化', min: 1, max: 6, step: 1, value: 1 }],
    grid: false, explore: ['chg=1 和 chg=2 是一对什么变化？', '哪几种变化吸热？哪几种放热？', '冬天窗户上的冰花是哪种变化？'],
    code: `# 水的三态变化变形器
chg = 1   # 1熔化 2凝固 3汽化 4液化 5升华 6凝华

hide()
t = "熔化：冰 → 水"
d = "冰吸热变成水（0℃ 开始熔化）"
heat = "吸热"
col = "#f97316"
if chg == 2:
    t = "凝固：水 → 冰"
    d = "水放热结成冰（0℃ 开始凝固）"
    heat = "放热"
    col = "#0ea5e9"
if chg == 3:
    t = "汽化：水 → 水蒸气"
    d = "蒸发和沸腾都是汽化（吸热）"
    heat = "吸热"
    col = "#f59e0b"
if chg == 4:
    t = "液化：水蒸气 → 小水珠"
    d = "雾·露·白气都是液化（放热）"
    heat = "放热"
    col = "#2563eb"
if chg == 5:
    t = "升华：冰 → 水蒸气（不经过水）"
    d = "冬天冻衣服慢慢变干（吸热）"
    heat = "吸热"
    col = "#dc2626"
if chg == 6:
    t = "凝华：水蒸气 → 冰（不经过水）"
    d = "霜·雪·窗上冰花都是凝华（放热）"
    heat = "放热"
    col = "#7c3aed"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 12)
fill_rect(0, 66, 320, 54, "#f8fafc")
write(d, 0, 66, "#334155", 10)
fill_rect(0, -16, 320, 50, "#fff7ed")
write("热量交换：" + heat + "（热量决定方向）", 0, -16, "#92400e", 11)
write("固态-液态-气态 循环不息", -20, -76, "#64748b", 10)
`,
  },
  teach: { sections: [
      { title: '三态特征', body: '【固态：有固定形状和体积】冰·霜·雪\n【液态：有固定体积·无固定形状】水·露·雾滴\n【气态：无固定形状体积】水蒸气（看不见！白气不是蒸气是小水珠）\n状态由分子间距和排列决定。' }, 
      { title: '三对变化', body: '【固⇄液：熔化（吸热）⇄凝固（放热）】\n【液⇄气：汽化（吸热）⇄液化（放热）】\n【固⇄气：升华（吸热）⇄凝华（放热）】\n规律：向气态变=吸热；向固态变=放热。' },
      { title: '生活辨识', body: '【雾·露·白气=液化】【霜·雪·冰花=凝华】\n【湿衣服变干=蒸发（汽化）】【冻衣服变干=升华】\n【冰化水=熔化】【水结冰=凝固】\n口诀：白气雾露液·霜雪冰花华。' },
    ], examples: [
      { q: '冬天窗玻璃内侧的冰花是怎么来的？', steps: ['室内水蒸气遇到冷玻璃', '直接变冰不经过水', '气态→固态', '凝华（放热）'], tip: '气到固是凝华' },
      { q: '夏天冰镇饮料瓶外的水珠？', steps: ['空气中的水蒸气遇冷瓶', '水蒸气变液态小水珠', '气态→液态', '液化（放热）'], tip: '气到液是液化' },
    ], mistakes: ['认为「白气」是水蒸气（是液化的小水珠，蒸气看不见）', '把霜当成凝固（不经过液态，是凝华）'] },
  exercises: [
    { q: '冰变成水是？', options: ['熔化', '凝固', '升华', '液化'], answer: 0, explain: '固→液吸热' },
    { q: '水蒸气直接变冰是？', options: ['凝华', '凝固', '液化', '升华'], answer: 0, explain: '不经过液态' },
    { q: '霜是哪种变化的产物？', options: ['凝华', '凝固', '熔化', '汽化'], answer: 0, explain: '水蒸气遇冷' },
    { q: '下列吸热的变化是？', options: ['熔化', '凝固', '液化', '凝华'], answer: 0, explain: '向气态方向' },
    { q: '烧开水时的「白气」其实是？', options: ['小水珠', '水蒸气', '空气', '氧气'], answer: 0, explain: '液化产物' },
    { q: '冻衣服慢慢变干是？', options: ['升华', '熔化', '蒸发', '凝华'], answer: 0, explain: '冰直接变气' },
  ],
});

L['sci-34'] = mk({ id: 'sci-34', island: 'cross', order: 565, title: '杠杆：给我一个支点', emoji: '🔧',
  subjectArea: '科学', gradeBand: 'junior', grade: 8, textbook: '浙教版科学（初中）',
  curriculum: { module: '简单机械·杠杆', points: ['五要素', '平衡条件 F1L1=F2L2', '三类杠杆'] },
  story: '阿基米德说：给我一个支点，我能撬动地球！撬棒、剪刀、筷子、天平——都是杠杆。支点、动力、阻力、动力臂、阻力臂，五要素齐了，一个等式判断省力费力！',
  goals: ['认识杠杆五要素', '掌握平衡条件', '会分析省力费力杠杆'],
  aiIntro: '🔧 调力臂和砝码，看杠杆往哪边沉——杠杆平衡实验台！',
  lab: { params: [{ name: 'l1', label: '左边力臂（格）', min: 1, max: 5, step: 1, value: 3 },
                  { name: 'f1', label: '左边砝码（个）', min: 1, max: 4, step: 1, value: 2 },
                  { name: 'f2', label: '右边砝码（个）', min: 1, max: 4, step: 1, value: 3 }],
    grid: false, explore: ['l1=3 f1=2 时，右边砝码 3 个需要多大力臂才平？', '怎样让左边翘起来？', '天平为什么等臂？'],
    code: `# 杠杆平衡实验台：右边力臂固定 2 格
l1 = 3   # 左边力臂（格）
f1 = 2   # 左边砝码（个）
f2 = 3   # 右边砝码（个）

hide()
momL = f1 * l1
momR = f2 * 2
state2 = "右边沉：F2×L2 = " + momR + " 更大"
col = "#2563eb"
if momL > momR:
    state2 = "左边沉：F1×L1 = " + momL + " 更大"
    col = "#dc2626"
if momL == momR:
    state2 = "平衡！F1×L1 = F2×L2 = " + momL
    col = "#16a34a"
fill_rect(0, 130, 340, 30, "#0f766e")
write("左：力臂 " + l1 + " × 砝码 " + f1 + " · 右：砝码 " + f2 + " × 力臂 2", 0, 130, "#fff", 10)
fill_rect(0, 40, 300, 10, "#94a3b8")
fill_rect(0, 40, 6, 60, "#64748b")
i = 0
while i < f1:
    circle(-140 + 12, -20 - i * 14, 6, "#2563eb")
    i = i + 1
i = 0
while i < f2:
    circle(140, -20 - i * 14, 6, "#dc2626")
    i = i + 1
write("平衡条件：F1 × L1 = F2 × L2", -20, -90, "#7c3aed", 11)
write(state2, -20, -120, col, 10)
`,
  },
  teach: { sections: [
      { title: '五要素', body: '【支点 O：杠杆绕着转的点】\n【动力 F1·阻力 F2】让杠杆转的力和阻碍的力\n【动力臂 L1·阻力臂 L2】支点到力的作用线的垂直距离（不是到作用点！）\n画力臂：从支点向力的方向作垂线。' }, 
      { title: '平衡条件', body: '【F1 × L1 = F2 × L2】动力×动力臂 = 阻力×阻力臂\n欲平衡：力大就要臂短·力小就要臂长。\n应用：杆秤称重·天平称质量·跷跷板平衡。' },
      { title: '三类杠杆', body: '【省力杠杆：L1>L2】撬棒·开瓶器·老虎钳（费距离）\n【费力杠杆：L1<L2】筷子·镊子·钓鱼竿（省距离）\n【等臂杠杆：L1=L2】天平·跷跷板（不省不费）\n省力必费距离·没有又省力又省距离的杠杆。' },
    ], examples: [
      { q: '撬棒撬石头为什么省力？', steps: ['支点在棒端抵住地面', '动力臂远大于阻力臂', 'L1>L2 → F1<F2', '用小力克服大阻力'], tip: '长臂省力' },
      { q: '使用筷子夹菜是哪类杠杆？', steps: ['支点在虎口处', '动力臂小于阻力臂', 'L1<L2 → 费力', '费力但省距离·灵活'], tip: '费力省距离' },
    ], mistakes: ['力臂量到力的作用点（应是垂直距离）', '认为费力杠杆没有用（省距离+灵活）'] },
  exercises: [
    { q: '杠杆的平衡条件是？', options: ['F1L1=F2L2', 'F1=F2', 'L1=L2', 'F1+L1=F2+L2'], answer: 0, explain: '力×力臂相等' },
    { q: '力臂是支点到什么的距离？', options: ['力的作用线的垂直距离', '力的作用点', '杠杆末端', '重心'], answer: 0, explain: '垂直距离' },
    { q: '下列省力杠杆是？', options: ['开瓶器', '筷子', '钓鱼竿', '镊子'], answer: 0, explain: '动力臂长' },
    { q: '天平属于？', options: ['等臂杠杆', '省力杠杆', '费力杠杆', '不是杠杆'], answer: 0, explain: 'L1=L2' },
    { q: '费力杠杆的优点是？', options: ['省距离', '省力', '省时间', '省材料'], answer: 0, explain: '小动作大移动' },
    { q: 'F1=2N L1=3m，右侧 L2=2m，平衡需要 F2=?', options: ['3 N', '2 N', '6 N', '1 N'], answer: 0, explain: '2×3=6÷2' },
  ],
});

L['geo-27'] = mk({ id: 'geo-27', island: 'cross', order: 566, title: '气温的变化与分布', emoji: '🌡',
  subjectArea: '地理', gradeBand: 'junior', grade: 7, textbook: '人教版地理（初中七上）',
  curriculum: { module: '气温的变化与分布', points: ['气温日变化年变化', '影响气温的因素', '等温线判读'] },
  story: '一天里午后两点最热，一年里北半球七月最热——气温像呼吸一样有节奏。从赤道到两极越来越冷，从山脚到山顶也越来越冷。读懂气温曲线图，天气密码就解开了一半！',
  goals: ['掌握气温变化规律', '理解影响因素', '会画会读气温曲线'],
  aiIntro: '🌡 切换纬度带，看气温年曲线怎么变形——气温曲线实验室！',
  lab: { params: [{ name: 'zone', label: '纬度带', min: 1, max: 3, step: 1, value: 1 }],
    grid: true, explore: ['zone=1 新加坡的曲线为什么几乎是平的？', 'zone=3 哈尔滨的冬夏温差有多大？', '纬度越高曲线怎么变？'],
    code: `# 气温曲线实验室（北半球 1-12 月）
zone = 1   # 1新加坡(赤道) 2北京(中纬) 3哈尔滨(高纬)

hide()
t = "新加坡（赤道附近）"
range2 = "年温差小：全年 26-28 度"
base = 27
amp = 1
col = "#f97316"
if zone == 2:
    t = "北京（中纬度）"
    range2 = "冬冷夏热：1 月约 -4 度 · 7 月约 26 度"
    base = 11
    amp = 15
    col = "#16a34a"
if zone == 3:
    t = "哈尔滨（高纬度）"
    range2 = "温差巨大：1 月约 -19 度 · 7 月约 23 度"
    base = 2
    amp = 21
    col = "#2563eb"
pen_color(col)
pen_up()
go_to(-165, base + amp - 5)
pen_down()
go_to(-99, base + amp)
go_to(-33, base + amp - 1)
go_to(33, base - amp)
go_to(99, base - amp)
go_to(165, base - amp + 6)
pen_up()
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 12)
write(range2, -20, -120, "#334155", 10)
write("纬度越高·冬季越冷·年温差越大", -20, -145, "#7c3aed", 9)
`,
  },
  teach: { sections: [
      { title: '日变化与年变化', body: '【日变化：最高气温午后 2 时·最低日出前后】\n【年变化（北半球）：陆地最热 7 月·最冷 1 月；海洋晚一个月（8 月/2 月）】\n南半球与北半球正好相反。\n气温曲线图：横轴时间·纵轴气温·峰谷看冷暖。' }, 
      { title: '影响因素', body: '【纬度：纬度越高气温越低（太阳高度角）】\n【海陆：海陆热力差异——海洋冬暖夏凉·调节气温】\n【地形：海拔每升高 100 米气温约降 0.6℃】\n【洋流：暖流增温增湿·寒流降温减湿】' },
      { title: '等温线判读', body: '【等温线密集=气温差异大·稀疏=差异小】\n【闭合中心：标低为低温中心·标高为高温中心】\n【向北递减=北半球·向南递减=南半球】\n全球分布：从低纬向高纬递减·同纬度海洋陆地不同。' },
    ], examples: [
      { q: '为什么吐鲁番「早穿棉袄午穿纱」？', steps: ['深居内陆·沙漠广布', '陆地升温快降温也快', '白天太阳晒气温骤升', '夜晚散热快气温骤降·日温差大'], tip: '海陆差异' },
      { q: '庐山为什么比山下九江凉快？', steps: ['庐山海拔约 1470 米', '每升高 100 米降约 0.6℃', '1470÷100×0.6 ≈ 8.8℃', '山顶比山下低约 9 度'], tip: '地形因素' },
    ], mistakes: ['以为最热是正午 12 点（是午后 2 点·地面储热再放热）', '南北半球年变化当成一样（正好相反）'] },
  exercises: [
    { q: '一天中最高气温出现在？', options: ['午后 2 时', '正午 12 点', '上午 10 点', '日出'], answer: 0, explain: '储热延迟' },
    { q: '北半球陆地最热月是？', options: ['7 月', '1 月', '8 月', '6 月'], answer: 0, explain: '夏季' },
    { q: '海拔每升高100米气温约降？', options: ['0.6℃', '6℃', '1℃', '0.06℃'], answer: 0, explain: '递减率' },
    { q: '纬度越高气温一般？', options: ['越低', '越高', '不变', '越湿润'], answer: 0, explain: '太阳高度角小' },
    { q: '等温线密集说明？', options: ['气温差异大', '差异小', '无差异', '在下雪'], answer: 0, explain: '坡度大' },
    { q: '新加坡气温年曲线形状是？', options: ['近似水平线', '大波浪', '斜线上升', '斜线下降'], answer: 0, explain: '全年高温' },
  ],
});

L['geo-28'] = mk({ id: 'geo-28', island: 'cross', order: 567, title: '中国的气候特征', emoji: '🎐',
  subjectArea: '地理', gradeBand: 'junior', grade: 8, textbook: '人教版地理（初中八上）',
  curriculum: { module: '中国的气候', points: ['季风气候显著', '气候复杂多样', '雨热同期'] },
  story: '中国气候三张脸：东部季风区夏雨冬干、西北大陆区干旱少雨、青藏高寒区终年低温。世界上最典型的季风区就在这里——夏季风一吹，雨带北上，家乡的梅雨台风都听它的！',
  goals: ['掌握三大气候区', '理解季风影响', '认识雨热同期优势'],
  aiIntro: '🎐 切换气候区，看各地天气性格——中国气候名片馆！',
  lab: { params: [{ name: 'zone', label: '气候区', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['zone=1 夏季风从哪来带来什么？', 'zone=2 西北为什么干旱？', '雨热同期对农业有什么好处？'],
    code: `# 中国气候名片馆
zone = 1   # 1季风区 2西北大陆性 3青藏高寒区

hide()
t = "东部季风区"
d = "夏季高温多雨·冬季低温少雨（雨热同期）"
f2 = "夏季风：东南风从海洋带来水汽"
col = "#16a34a"
if zone == 2:
    t = "西北温带大陆性气候"
    d = "冬冷夏热·降水少·气温年较差大"
    f2 = "深居内陆·山脉阻挡水汽难以到达"
    col = "#f97316"
if zone == 3:
    t = "青藏高原高寒气候"
    d = "终年低温·日照强·气温日较差大"
    f2 = "海拔高·「高」决定了「寒」"
    col = "#0ea5e9"
fill_rect(0, 130, 340, 30, col)
write(t, 0, 130, "#fff", 13)
fill_rect(0, 70, 320, 50, "#f8fafc")
write(d, 0, 70, "#334155", 10)
fill_rect(0, -6, 320, 52, "#fef3c7")
write("成因：" + f2, 0, -6, "#b45309", 10)
write("复杂多样+季风显著 = 中国气候两大特征", -20, -66, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '季风气候显著', body: '【夏季风：来自海洋（东南季风·西南季风）→ 高温多雨】\n【冬季风：来自西伯利亚蒙古 → 寒冷干燥】\n季风区/非季风区分界：大兴安岭-阴山-贺兰山-巴颜喀拉山-冈底斯山。\n夏季风不稳定→旱涝灾害频繁。' }, 
      { title: '复杂多样', body: '【东部：热带季风·亚热带季风·温带季风气候】\n【西北：温带大陆性气候】\n【青藏：高原山地气候】\n【高山峡谷区：一山有四季·十里不同天】\n五种温度带·干湿四区，为农业多样化提供条件。' },
      { title: '雨热同期', body: '【高温期与多雨期一致=雨热同期】\n好处：作物生长旺季正好水热充足→水稻棉花高产。\n对比地中海气候（雨热不同期）更显优势。\n季风之利：养活世界最多人口的农耕文明。' },
    ], examples: [
      { q: '为什么我国东部夏季多雨？', steps: ['夏季风从海洋吹来', '带来大量水汽', '遇冷凝结成雨', '高温与多雨同期'], tip: '夏季风送雨' },
      { q: '新疆瓜果为什么特别甜？', steps: ['温带大陆性气候', '日照强·昼夜温差大', '白天光合作用积累糖分多', '夜晚消耗少·糖分留存'], tip: '温差出甜度' },
    ], mistakes: ['认为全国夏季都多雨（西北全年少雨）', '把青藏气候冷的原因当成纬度高（是海拔高）'] },
  exercises: [
    { q: '我国东部季风区夏季盛行？', options: ['来自海洋的夏季风', '西伯利亚冬季风', '信风', '不下风'], answer: 0, explain: '海洋来水汽' },
    { q: '西北气候类型是？', options: ['温带大陆性', '亚热带季风', '高原山地', '热带季风'], answer: 0, explain: '深居内陆' },
    { q: '青藏高原气候寒冷主因？', options: ['海拔高', '纬度高', '靠海远', '河流多'], answer: 0, explain: '高寒' },
    { q: '雨热同期有利于？', options: ['农作物生长', '工业生产', '交通建设', '滑雪运动'], answer: 0, explain: '水热配合' },
    { q: '我国气候两大特征是？', options: ['复杂多样+季风显著', '全年高温+多雨', '干旱+寒冷', '单一+均匀'], answer: 0, explain: '两大名片' },
    { q: '夏季风不稳定容易造成？', options: ['旱涝灾害', '地震', '火山', '无影响'], answer: 0, explain: '降水年际变化大' },
  ],
});

/* 写入 */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第73轮写入 ${n} 节：${Object.keys(L).join(', ')}`);
