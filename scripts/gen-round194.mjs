import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const L = (o) => ({
  toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [],
  tasks: [
    { id: 'e0', text: `探索：${o.param.name}=2 ${o.explore[0]}`, check: { type: 'manual' }, hintPrompts: ['动手验证：把参数拖到两个极端对比观察', '把发现说给 AI 老师听，让它帮你变成结论'] },
    { id: 'e1', text: `探索：${o.param.name}=3 ${o.explore[1]}`, check: { type: 'manual' }, hintPrompts: ['动手验证：把参数拖到两个极端对比观察', '把发现说给 AI 老师听，让它帮你变成结论'] },
    { id: 'e2', text: '探索：' + o.explore[2], check: { type: 'manual' }, hintPrompts: ['先做几组对比再下结论', '把发现记进「我的发现」'] },
    { id: 'quiz', text: '完成随堂小练', check: { type: 'manual' }, hintPrompts: ['先做几组实验再答题，答案就藏在演示里'] },
  ],
  celebrate: '新知识到手！', island: 'cross', subjectArea: o.area, gradeBand: o.band, grade: o.grade,
  ...o,
  lab: { params: [o.param] },
  interact: { views: o.views, explore: o.explore },
});

const LESSONS = [
  L({
    area: '体育与健康', band: 'senior', grade: 10, id: 'pe-55', order: 1060, title: '体测全攻略：国家学生体质标准', emoji: '📋', textbook: '体育与健康（高中）',
    curriculum: { module: '体质健康', points: ['测什么', '各项技巧', '训练计划'] },
    story: '一年一度的体测来了——肺活量·坐位体前屈·50米·长跑……这张成绩单关系评优·更关系你身体的真实状况。这一课逐项拆解：每项测什么·怎样练·考前怎样安排。',
    goals: ['了解体测的项目与标准', '掌握各项应试技巧', '制定训练计划'],
    aiIntro: '📋 身体的期末考——体测全攻略',
    param: { name: 'ft2', label: '体测站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['体测到底测什么？', '每项有什么技巧？', '考前一个月怎样练？'],
    views: [
      { when: 1, title: '项目', subtitle: '五类素质', color: 'blue', emoji: '📊', blocks: [
        { kind: 'compare', title: '体测项目一览', items: [
          { label: '身体形态', value: '身高体重（BMI）——过低过高都扣分：反映营养与发育是否均衡：不是越瘦越好' },
          { label: '肺活量', value: '心肺功能的窗口——吹气匀速持久·一次吹完：能练·天天深呼吸慢跑见效' },
          { label: '速度灵敏', value: '50 米跑——起跑反应·步频步幅：短跑靠爆发·也靠技术' },
          { label: '力量耐力', value: '立定跳远·引体向上/仰卧起坐·长跑（男1000/女800）——占比最大的一类' },
          { label: '柔韧', value: '坐位体前屈——测关节活动度：柔韧差的人腰背痛风险高：不是小事' },
        ] },
        { kind: 'info', icon: '🎯', title: '分数怎么看', text: '各项按百分制打分·加权总分评等级（优秀·良好·及格）：每年测一次形成曲线——真正的价值不是这一次的分·是看自己的趋势：体测是身体的年度体检报告' },
        { kind: 'highlight', text: '形态·心肺·速度·力量·柔韧——五类合起来才是健康' },
      ] },
      { when: 2, title: '技巧', subtitle: '各项要点', color: 'green', emoji: '🎯', blocks: [
        { kind: 'steps', title: '四项干货技巧', items: ['肺活量：深吸到顶→嘴含紧吹嘴→匀速慢吹到底（前段别猛吹·气要匀着用）——中途不能换气：吹完身体前倾压出最后一口', '长跑：起跑别抢·跟住节奏（能说话的速度）·最后200米再冲刺——极点出现时放慢步频加深呼吸·挺过去就是「第二次呼吸」', '立定跳远：预摆两次→蹬地展体→收腿前伸落地——落地向前跪缓冲别后坐：一摆二蹬三收四稳', '引体向上：正握略宽于肩→先肩胛下沉启动→下巴过杠算一次——借晃动（摆浪）不算·动作干净才计分：从弹力带辅助或斜身引体起步' ] },
        { kind: 'info', icon: '⚠️', title: '考前三天', text: '别突击加练（只会留下疲劳和酸痛）——减量保持·睡眠充足·考前两小时吃完易消化的一餐·测前充分热身：考试拼的是平时·不是那三天的勇气' },
        { kind: 'highlight', text: '匀速吹·跟节奏跑·干净动作——技巧值十分' },
      ] },
      { when: 3, title: '计划', subtitle: '四周提升', color: 'amber', emoji: '📅', blocks: [
        { kind: 'steps', title: '考前四周计划', items: ['第1-2周打基础：每周3次有氧（慢跑20-30分钟）+每天柔韧5分钟——心肺和柔韧最先见效', '第3周针对性：弱项加练——跳远练蹲跳·引体练悬挂和离心（慢慢放下）·跑步加两组400米间歇', '第4周调整：训练量减半·保持感觉——睡好吃好·轻装上阵：状态是练出来的也是养出来的' ] },
        { kind: 'info', icon: '📈', title: '弱项优先原则', text: '把 60% 的训练时间给最弱的两项——总分提升最快（从 60 到 80 比从 90 到 95 容易得多）：均衡是总分的朋友·偏科是总分的小偷' },
        { kind: 'info', icon: '💡', title: '比分数更重要的事', text: '有人为分数突击甚至冒险用药——本末倒置：体测的初衷是给你一张「身体的成绩单」·提醒你哪里该投资：把目标定为「三年后依然在跑」的人·最后分数都不会差' },
        { kind: 'highlight', text: '弱项优先·四周渐变·考前减量——分数是副产品' },
      ] },
    ],
    teach: { sections: [
      { title: '测什么', body: '【五类】BMI·肺活量·50米·跳远引体长跑·坐位体前屈。\n【意义】看趋势比看单次分重要。' },
      { title: '各技巧', body: '【肺活量】匀速吹到底不换气。【长跑】跟节奏最后冲。\n【跳远】摆蹬收稳。【引体】肩胛下沉·动作干净。\n【考前】减量+睡够+热身。' },
      { title: '四周计划', body: '【1-2周】有氧+柔韧打基础。\n【3周】弱项加练间歇。【4周】减半调整。\n【原则】60%时间给最弱两项。' },
    ], examples: [
      { q: '长跑总在600米放弃', steps: ['起跑压住速度', '极点来时深呼吸放步频', '挺过极点第二次呼吸', '留力最后200米冲'], tip: '极点是关隘' },
      { q: '引体向上一个都做不了', steps: ['先练悬挂30秒', '弹力带辅助引体', '离心阶段慢慢放下', '四周后尝试第一个'], tip: '降阶起步' },
    ], mistakes: ['考前三天突击猛练（留下疲劳·成绩更差）', '为分数在测试中作弊或危险减重（体测测的是真实健康）'] },
    exercises: [
      { q: '体测五类项目不包括？', options: ['心肺耐力', '力量', '柔韧', '化妆技术'], answer: 3, explain: '身体素质没有这项' },
      { q: '肺活量测试的正确吹法是？', options: ['猛吹一口就停', '匀速持久吹到底', '分三次吹', '用鼻子吹'], answer: 1, explain: '气要匀着用' },
      { q: '长跑中出现「极点」应该？', options: ['立刻停下', '放慢步频加深呼吸坚持', '加速硬冲', '躺下休息'], answer: 1, explain: '挺过去是第二次呼吸' },
      { q: '训练计划应把多数时间给？', options: ['最强的项目', '最弱的两项', '最喜欢的', '最轻松的'], answer: 1, explain: '总分提升最快' },
      { q: '考前一周的正确做法是？', options: ['疯狂加练', '减量保持睡好吃好', '完全不动', '节食减重'], answer: 1, explain: '状态靠养' },
      { q: '体测真正的价值是看身体的 ___', options: ['趋势', '颜值'], answer: 0, explain: '年度成绩单', type: 'blank', blank: { answerText: '趋势', bank: ['趋势', '颜值'] } },
    ],
  }),
  L({
    area: '体育与健康', band: 'junior', grade: 9, id: 'pe-56', order: 1061, title: '反兴奋剂：干净的体育', emoji: '🚫', textbook: '体育与健康（九年级拓展）',
    curriculum: { module: '体育文化', points: ['什么是兴奋剂', '危害与违规', '干净体育的价值'] },
    story: '0.01 秒的差距·价值千万——于是有人向身体里塞进不该有的东西。兴奋剂是体育的百年阴影·也是一面镜子：照出「赢」的代价。这一课聊聊干净体育。',
    goals: ['了解兴奋剂与种类', '认识危害与检测', '理解公平竞争的价值'],
    aiIntro: '🚫 更快背后的黑暗——反兴奋剂',
    param: { name: 'ad', label: '反兴奋剂站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['兴奋剂是什么·为什么禁？', '服用者付出了什么代价？', '为什么干净比金牌重要？'],
    views: [
      { when: 1, title: '是什么', subtitle: '禁用清单', color: 'red', emoji: '💊', blocks: [
        { kind: 'info', icon: '📖', title: '不只是「兴奋」', text: '兴奋剂=一切用于提高成绩的禁用物质与方法——蛋白同化制剂（长肌肉）·EPO（增加红细胞带氧）·利尿剂（降体重/遮掩）·甚至「输血回输」：世界反兴奋剂机构（WADA）每年更新禁用清单' },
        { kind: 'info', icon: '📜', title: '历史阴影', text: '上世纪东德系统性地给运动员用药——金牌背后是无数被毁的健康（女性运动员男性化·早逝·子女畸形）：国家层面的作弊·个体承担代价：这段历史催生了现代反兴奋剂体系' },
        { kind: 'highlight', text: '一切以提高成绩为目的的禁用物质和方法——统称兴奋剂' },
      ] },
      { when: 2, title: '代价', subtitle: '三重账单', color: 'amber', emoji: '💸', blocks: [
        { kind: 'compare', title: '三重代价', items: [
          { label: '身体', value: '心脏肝肾损伤·内分泌紊乱·情绪失控·成瘾——有的损害不可逆：用健康换奖牌·是最亏的交易' },
          { label: '生涯', text: '', value: '被抓=禁赛（首次2-4年·再犯终身）+收回奖牌+荣誉清零——历史上多枚奥运金牌被追回：兴奋剂检测（尿检血检·生物护照）越来严密——侥幸空间趋近于零', hint: '' },
          { label: '人格', value: '对对手不公平·对信任你的人撒谎·对自己的努力撒谎——赢了一时·输掉了「我是谁」：这是最难收回的奖牌' },
        ] },
        { kind: 'info', icon: '🇨🇳', title: '中国的态度', text: '「拿干净的金牌」是明确要求——反兴奋剂教育进运动队进校园：对青少年更有一条红线：不少「增肌粉」「减脂药」含违禁成分——不明成分的运动补剂别乱吃：想快·往往掉坑' },
        { kind: 'highlight', text: '身体·生涯·人格——三重账单没有一张付得起' },
      ] },
      { when: 3, title: '价值', subtitle: '干净体育', color: 'green', emoji: '🤝', blocks: [
        { kind: 'info', icon: '⚖️', title: '为什么必须公平', text: '体育的魅力建立在「同一起跑线」上——一旦有人作弊·所有人的努力贬值（你练十年·他打一针？）：反兴奋剂保护的不是奖牌·是体育存在的意义' },
        { kind: 'info', icon: '🌱', title: '给学生的映射', text: '考试作弊·比赛犯规·简历注水——都是身边的「兴奋剂」：短期的赢换来长期的信用破产：公平不是天真·是聪明人的长期主义' },
        { kind: 'info', icon: '🏟️', title: '向真正的英雄致敬', text: '最动人的体育故事从不是奖牌榜——是带伤坚持的跑者·是把对手扶起来的选手·是输了也坦荡的少年：奥林匹克的口号是「更快更高更强——更团结」：干净地拼搏·输了也赢' },
        { kind: 'highlight', text: '公平是长期主义——干净地拼搏·输了也赢' },
      ] },
    ],
    teach: { sections: [
      { title: '是什么', body: '【定义】提高成绩的禁用物质与方法。\n【清单】WADA年度更新。\n【历史】东德系统性用药之痛。' },
      { title: '三重代价', body: '【身体】心肝肾内分泌不可逆损伤。\n【生涯】禁赛+追回奖牌。\n【人格】对所有人撒谎。\n【红线】不明补剂别碰。' },
      { title: '干净价值', body: '【公平】同一起跑线是体育的根。\n【映射】考试简历同理。\n【英雄】干净拼搏输了也赢。' },
    ], examples: [
      { q: '同学推荐「增肌神粉」', steps: ['查有没有正规批号', '警惕三无产品', '可能含违禁成分', '食补+训练才是正道'], tip: '想快常掉坑' },
      { q: '看到选手被曝兴奋剂', steps: ['认识危害与代价', '支持反兴奋剂决定', '不以成败论单一英雄', '为干净选手鼓掌'], tip: '价值观立住' },
    ], mistakes: ['认为兴奋剂只危害职业选手（青少年补充剂滥用同样危险）', '觉得「查不出来就行」（检测在进步·人格的账躲不掉）'] },
    exercises: [
      { q: '兴奋剂指的是？', options: ['提神饮料', '禁用的增成绩物质与方法', '一种药物类别', '维生素'], answer: 1, explain: '远不止「兴奋」' },
      { q: '管理世界禁用清单的机构是？', options: ['WADA', 'NBA', 'NASA', 'WTO'], answer: 0, explain: '世界反兴奋剂机构' },
      { q: '服用兴奋剂最大的身体代价是？', options: ['变胖', '器官不可逆损伤', '长高', '视力变好'], answer: 1, explain: '肝肾心与内分泌——最亏的交易' },
      { q: '查实使用兴奋剂的处罚是？', options: ['批评教育', '禁赛收牌', '换队再赛', '扣奖金'], answer: 1, explain: '禁赛并收回奖牌·荣誉清零' },
      { q: '对待「增肌减脂神药」的正确态度是？', options: ['试试看', '警惕三无与违禁成分', '同学都在吃', '多吃几份'], answer: 1, explain: '红线意识' },
      { q: '公平竞争是一种长期的 ___', options: ['聪明', '吃亏'], answer: 0, explain: '信用资产', type: 'blank', blank: { answerText: '聪明', bank: ['聪明', '吃亏'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 7, id: 'eng-48', order: 1062, title: '购物英语：怎么买更划算', emoji: '🛍️', textbook: '人教版英语（七年级）',
    curriculum: { module: '生活英语', points: ['询价与砍价', '尺寸与试穿', '退换表达'] },
    story: '出国旅行或在进口超市——「这个多少钱」「能便宜点吗」「有小一号吗」用英语怎么说？这一课装齐购物全流程的英语工具箱·做个体面的顾客。',
    goals: ['掌握询价砍价句型', '学会问尺寸试穿', '懂得退换表达'],
    aiIntro: '🛍️ 血拼的正确打开方式——购物英语',
    param: { name: 'sh', label: '购物站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['怎样问价砍价？', '怎样试穿问码？', '买错了怎样退换？'],
    views: [
      { when: 1, title: '询价', subtitle: '问价砍价', color: 'blue', emoji: '💰', blocks: [
        { kind: 'compare', title: '询价三句', items: [
          { label: 'How much', value: 'How much is this? / How much are these?（单数 is·复数 are）——最通用的问价' },
          { label: 'Do you have', value: 'Do you have this in blue?（这个有蓝色的吗）——问颜色问款式一句搞定' },
          { label: 'Any discount?', value: 'Is there any discount? / Any discount for two?（买两个有折扣吗）——委婉探折扣' },
        ] },
        { kind: 'info', icon: '🤝', title: '砍价的礼貌姿势', text: 'Can you come down a little?（能便宜点吗）·That is a bit too expensive for me.（对我来说有点贵）——先表达喜欢再还价：漫天砍价在正规商场不适用·跳蚤市场集市才好玩：看场合出招' },
        { kind: 'highlight', text: '问价·问款·探折扣——先喜欢后还价' },
      ] },
      { when: 2, title: '试穿', subtitle: '尺寸合身', color: 'green', emoji: '👕', blocks: [
        { kind: 'steps', title: '试穿四句', items: ['Can I try it on?（能试穿吗）——试衣间 fitting room', 'Do you have a smaller / bigger size?（有小/大一码吗）——size up 大一码·size down 小一码', 'It is too tight / too loose.（太紧/太松）——说出问题店员才能帮你', 'It fits perfectly! I will take it.（很合身！我买了）——满意就果断' ] },
        { kind: 'info', icon: '📏', title: '尺码小知识', text: 'S / M / L / XL（small medium large extra large）——鞋码 US UK EU 各不同（看标签）：拿不准就说 Can you help me find my size?——店员最喜欢目标明确的顾客' },
        { kind: 'highlight', text: 'try on 问码·说松紧·合身拿下' },
      ] },
      { when: 3, title: '退换', subtitle: '售后表达', color: 'amber', emoji: '↩️', blocks: [
        { kind: 'steps', title: '退换三步', items: ['I would like to return this.（我想退这个）——return 退货·exchange 换货', 'It does not fit. / There is something wrong with it.（不合身/有质量问题）——说明原因', 'Here is the receipt.（这是小票）——小票 receipt 是退换的通行证：保留好' ] },
        { kind: 'info', icon: '💳', title: '结账用语', text: 'How would you like to pay?（您怎么付款）——In cash. / By card.（现金/刷卡）；Could I get a bag, please?（能给个袋子吗）：一句话文明全款拿下' },
        { kind: 'info', icon: '🎭', title: '情景小剧场', text: '两人一组演「买 T 恤」：顾客问价→问码→试穿→砍价→付款：五步连台词不超过十句——演三轮·这辈子忘不了：口语是演会的' },
        { kind: 'highlight', text: 'return/exchange + 原因 + receipt——售后三件套' },
      ] },
    ],
    teach: { sections: [
      { title: '询价砍价', body: '【问价】How much is/are...?\n【问款】Do you have it in blue?\n【折扣】Any discount?\n【还价】Can you come down a little?（集市适用）' },
      { title: '试穿尺码', body: '【试穿】Can I try it on?·fitting room。\n【问码】a smaller/bigger size。\n【反馈】too tight/loose。【成交】I will take it。' },
      { title: '退换结账', body: '【退】return·【换】exchange。\n【原因】It does not fit.\n【凭据】Here is the receipt.\n【付款】In cash / By card。' },
    ], examples: [
      { q: '演一遍买鞋对话', steps: ['Do you have these in size 38?', 'Can I try them on?', 'They are a bit tight.', 'Any bigger ones? I will take them'], tip: '四句走完' },
      { q: '买的杯子有裂痕', steps: ['There is something wrong with it', 'I would like to exchange it', 'Here is the receipt', '礼貌但明确'], tip: '售后三件套' },
    ], mistakes: ['How much are this?（单数用 is·复数才用 are）', '退换时不带小票空口说（receipt 是通行证）'] },
    exercises: [
      { q: '「这个多少钱」最地道的说法？', options: ['How many is this?', 'How much is this?', 'What price this?', 'How money?'], answer: 1, explain: 'how much 问价格' },
      { q: '想试穿应该问？', options: ['Can I try it on?', 'Can I eat it?', 'Can I go home?', 'Can I see you?'], answer: 0, explain: 'try on 试穿' },
      { q: '「有小一码的吗」用英语？', options: ['Do you have a bigger size?', 'Do you have a smaller size?', 'Is this free?', 'Where is the door?'], answer: 1, explain: 'smaller 小一码' },
      { q: '退货时最该递给店员的是？', options: ['照片', 'receipt（小票）', '书包', '眼镜'], answer: 1, explain: '售后通行证' },
      { q: '「刷卡付款」的表达是？', options: ['By card', 'By bike', 'On foot', 'By hand'], answer: 0, explain: 'in cash 反义' },
      { q: '砍价先表达对商品的 ___', options: ['喜欢', '讨厌'], answer: 0, explain: '礼貌姿势', type: 'blank', blank: { answerText: '喜欢', bank: ['喜欢', '讨厌'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 8, id: 'eng-49', order: 1063, title: '电影英语：看片学口语', emoji: '🎬', textbook: '人教版英语（八年级拓展）',
    curriculum: { module: '泛听泛读', points: ['选片原则', '三遍精看法', '跟读积累'] },
    story: '看了十年美剧·口语还是开不了口？问题不在片子·在看法。这一课教你「三遍精看法」——一部片顶过去瞎看的十部：让电影真的成为你的外教。',
    goals: ['学会选择合适的片子', '掌握三遍精看法', '养成跟读积累习惯'],
    aiIntro: '🎬 一部片顶十部——电影英语精看法',
    param: { name: 'mv', label: '电影站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['什么片子适合学英语？', '「三遍法」怎样操作？', '看完怎样变成自己的？'],
    views: [
      { when: 1, title: '选片', subtitle: '三挑三不挑', color: 'blue', emoji: '🍿', blocks: [
        { kind: 'compare', title: '选片原则', items: [
          { label: '挑日常对话', value: '生活剧校园剧（老友记·查莉成长日记）——词句能直接搬进生活：第一优先' },
          { label: '挑语速适中', value: '儿童向和青春片语速友好；方言重·俚语密的黑帮片刑侦片——听力地狱：别上来就挑战' },
          { label: '挑你喜欢的', value: '喜欢才会看第二遍第三遍——兴趣决定法能坚持：学英语没有「必看片单」·只有「你的片单」' },
        ] },
        { kind: 'info', icon: '❌', title: '三个误区', text: '只看字幕（眼睛在读中文·耳朵放假）；只求数量（十部各一遍不如一部三遍）；只看不输出（不跟读不记录=白看）：方法不对·看得越多浪费越多' },
        { kind: 'highlight', text: '日常·语速友好·你真心喜欢——三挑三不挑' },
      ] },
      { when: 2, title: '三遍', subtitle: '精看法', color: 'green', emoji: '🔁', blocks: [
        { kind: 'steps', title: '三遍精看法', items: ['第一遍·享受：中英双字幕正常看——懂剧情·记住让你印象深刻的台词：这一遍是「混个脸熟」', '第二遍·精听：英文字幕（关中文）——遇到不懂的暂停·查词·记进小本：一段5分钟可能要学20分钟——慢就是快', '第三遍·跟读：影子跟读法——落后半秒跟着说·模仿语音语调：嘴巴记住了才算真学会' ] },
        { kind: 'info', icon: '✂️', title: '一段就够', text: '不必三遍全片——挑最爱的5分钟片段精看：一集剧学透一段（约30-50个表达）·胜过囫囵三集：小口慢嚼才吸收' },
        { kind: 'highlight', text: '享受→精听→跟读——一段5分钟吃透胜过囫囵三集' },
      ] },
      { when: 3, title: '积累', subtitle: '变成自己的', color: 'amber', emoji: '📓', blocks: [
        { kind: 'steps', title: '三步内化', items: ['记「活的句子」：不抄孤立单词·抄整句+场景（「Ross说这句时在机场」）——句子带着画面才忘不掉', '当天用一次：挑一句用到生活（对同学说 You made my day!）——用过的才是你的', '一周后重听：周末把片段裸听一遍（无字幕）——听懂率就是你的成绩单：可视化进步最上瘾' ] },
        { kind: 'info', icon: '📅', title: '频率建议', text: '每周精学2-3个片段（每天20分钟）——比周末狂刷4小时有效：语言靠重复不靠突击：跟背单词一个道理' },
        { kind: 'info', icon: '🎧', title: '迁移到听力考场', text: '精看练出的「耳朵分辨率」直接迁移——考场上听力语速不再可怕：很多听力满分的同学秘诀就是长期看片跟读：娱乐和学习·从来可以是一件事' },
        { kind: 'highlight', text: '整句+场景·当天用·周重听——用过的才是你的' },
      ] },
    ],
    teach: { sections: [
      { title: '选片', body: '【挑】生活剧·语速友好·真心喜欢。\n【避】方言密·只看中文字幕·贪多。' },
      { title: '三遍法', body: '【一】双字幕享受记台词。\n【二】英文字幕精听暂停记本。\n【三】影子跟读模仿语调。\n【单位】一段5分钟胜过整集。' },
      { title: '内化', body: '【记】整句+场景不抄孤词。\n【用】当天用一次。【复】一周裸听重测。\n【频率】每周2-3段·每天20分钟。' },
    ], examples: [
      { q: '用三遍法学一段动画对白', steps: ['双字幕看懂剧情', '英文字幕逐句暂停记录', '影子跟读模仿三遍', '一周后裸听自测'], tip: '一段吃透' },
      { q: '看剧总忍不住看中文字幕', steps: ['第一遍允许双语', '第二遍物理遮住中文', '查词代替依赖翻译', '坚持三集就习惯'], tip: '耳朵放假问题' },
    ], mistakes: ['以为看片数量越多越好（一部三遍胜十部一遍）', '只看不跟读不记录（ Entertainment ≠ learning）'] },
    exercises: [
      { q: '初学者最适合的学英语片是？', options: ['语速快的黑帮片', '法律术语剧', '日常对话的生活剧', '无对片'], answer: 2, explain: '能搬进生活' },
      { q: '三遍法的第一遍应该？', options: ['逐句查词典', '关字幕裸听', '双语字幕享受剧情', '跟读'], answer: 2, explain: '先混脸熟' },
      { q: '「影子跟读」指的是？', options: ['看影子', '落后半秒模仿跟说', '闭眼听', '抄写台词'], answer: 1, explain: '嘴记住才算会' },
      { q: '记录台词的最佳方式是？', options: ['只抄单词', '整句+场景一起记', '只记语法', '截图完事'], answer: 1, explain: '句子带画面' },
      { q: '看片学英语的正确做法是？', options: ['只刷数量', '一段精看三遍并跟读', '只看中文字幕', '快进看完'], answer: 1, explain: '一部三遍胜十部一遍' },
      { q: '用过的表达才真正是 ___ 的', options: ['自己', '别人的'], answer: 0, explain: '当天用一次', type: 'blank', blank: { answerText: '自己', bank: ['自己', '别人的'] } },
    ],
  }),
  L({
    area: '科学', band: 'junior', grade: 8, id: 'sci-50', order: 1064, title: '食品添加剂：读懂配料表', emoji: '🏷️', textbook: '科学（八年级拓展）',
    curriculum: { module: '化学与生活', points: ['常见添加剂', '剂量与安全', '理性看待'] },
    story: '「零添加」「无防腐剂」——包装上的大字先别急着信。配料表才是食品的「成分说明书」：这一课学会读它·从此买东西先看「背面」。',
    goals: ['认识常见添加剂的作用', '理解剂量决定毒性', '学会理性读标签'],
    aiIntro: '🏷️ 食品的说明书——食品添加剂',
    param: { name: 'fa2', label: '配料站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['防腐剂是洪水猛兽吗？', '配料表怎样读？', '「零添加」更健康吗？'],
    views: [
      { when: 1, title: '家族', subtitle: '各司其职', color: 'blue', emoji: '🧪', blocks: [
        { kind: 'compare', title: '常见添加剂', items: [
          { label: '防腐剂', value: '抑制微生物·防变质——山梨酸钾·苯甲酸钠：没有它·食物三天就坏（肉毒杆菌比防腐剂危险一万倍）：防腐剂是安全的朋友' },
          { label: '抗氧化剂', value: '防油脂酸败——维C（抗坏血酸）·维E也当抗氧化剂用：薯片放一个月不哈喇·靠它' },
          { label: '着色剂·增味剂', value: '色素让颜色好看·谷氨酸钠（味精）提鲜：满足「色香味」的心理需求——适量无害' },
          { label: '增稠·乳化', value: '果冻的口感（卡拉胶）·酸奶的均匀（果胶）：改变质地口感——冰淇淋不加乳化剂会冰碴满口' },
        ] },
        { kind: 'highlight', text: '防腐·抗氧·着色·增味·增稠——添加剂是工具箱不是毒药箱' },
      ] },
      { when: 2, title: '安全', subtitle: '剂量定毒性', color: 'green', emoji: '⚖️', blocks: [
        { kind: 'info', icon: '📏', title: 'ADI 是什么', text: '每日允许摄入量——科学家用动物实验的最大无害剂量除以100倍安全系数得出：国标限量远低于有害量：合法使用的添加剂·正常饮食吃不到危险线' },
        { kind: 'info', icon: '🔬', title: '现代毒理学之父', text: '「剂量决定毒性」——水喝多了也中毒·砒霜微量还是药：抛开剂量谈毒性=抛开速度谈车祸：这句名言是读一切「XX有害」新闻的钥匙' },
        { kind: 'info', icon: '📉', title: '排序规律', text: '配料表按含量降序排列——排第一的就是最多的：白糖排第一的「营养麦片」·油排第一的「蔬菜脆」——看两眼排名·广告就骗不了你：前三位决定这包东西的本质' },
        { kind: 'highlight', text: '合法添加远离危险线·配料表降序藏真相' },
      ] },
      { when: 3, title: '理性', subtitle: '别交智商税', color: 'amber', emoji: '🧠', blocks: [
        { kind: 'compare', title: '三个清醒', items: [
          { label: '「零添加」的真相', value: '「0防腐剂」的酱油可能靠高盐防腐（钠超标）；「无蔗糖」可能加了麦芽糖浆（升糖更快）：营销话术≠更健康——看整体配料再判断' },
          { label: '真正要少吃的', value: '不是添加剂·是「三高配方」：糖·盐·油在配料表前三位——才是现代人饮食的主要风险：配料表长的未必坏·配料表第一是糖的才要小心' },
          { label: '天然≠安全', value: '河豚天然·毒；砒霜天然·毒——「纯天然」不是安全证书：合法合成的添加剂经过的检测比多数「天然物」严格得多' },
        ] },
        { kind: 'info', icon: '🛒', title: '实战：买酸奶', text: '配料第一位是「生牛乳」=真酸奶；第一位是「水」=乳酸菌饮料（糖水）；再看蛋白质含量≥2.3g/100g：三秒钟·做出聪明选择' },
        { kind: 'highlight', text: '警惕营销话术·盯住糖盐油排名——科学消费不吃亏' },
      ] },
    ],
    teach: { sections: [
      { title: '添加剂家族', body: '【防腐】山梨酸钾防菌·防更毒的肉毒杆菌。\n【抗氧】维C维E防哈喇。【着色增味】色香。\n【增稠乳化】口感质地。' },
      { title: '剂量安全', body: '【ADI】无害剂量÷100安全系数。\n【名言】剂量决定毒性。\n【排序】配料表降序·前三位定本质。' },
      { title: '理性消费', body: '【话术】零添加≠健康（高盐代防腐）。\n【真凶】糖盐油排前才要少吃。\n【天然】≠安全证书。\n【实战】酸奶第一位看生牛乳。' },
    ], examples: [
      { q: '挑一瓶好酱油', steps: ['看配料表第一：大豆还是水', '看钠含量', '「零添加」对照价格', '综合选·不为营销词加钱'], tip: '背面定夺' },
      { q: '同学说防腐剂致癌', steps: ['合法使用剂量远低于危险线', '不防腐的食品更危险', '剂量决定毒性', '别被标题吓住'], tip: '科学钥匙' },
    ], mistakes: ['认为所有食品添加剂都有害（合法使用安全性有保障）', '把「零添加」直接等同于更健康（可能换更高盐糖）'] },
    exercises: [
      { q: '食品防腐剂的主要作用是？', options: ['抑制微生物防变质', '增加营养', '染色', '增重'], answer: 0, explain: '防的是更毒的菌' },
      { q: '现代毒理学的核心名言是？', options: ['天然必安全', '剂量决定毒性', '颜色定好坏', '价格定品质'], answer: 1, explain: '水喝多也中毒' },
      { q: '配料表的排列顺序是按？', options: ['字母顺序', '价格高低', '笔画多少', '含量从高到低'], answer: 3, explain: '前三位定本质' },
      { q: '「无蔗糖」食品可能的问题？', options: ['一定更健康', '可能换其他糖浆升糖更快', '没有味道', '热量为零'], answer: 1, explain: '营销话术' },
      { q: '挑选酸奶首先看配料表第一位是？', options: ['白砂糖', '生牛乳', '水', '食用香精'], answer: 1, explain: '真酸奶标志' },
      { q: '现代人饮食该警惕的是配料表前排的？', options: ['香精色素', '糖盐油三高配方', '维生素', '膳食纤维'], answer: 1, explain: '三高配方' },
    ],
  }),
  L({
    area: '科学', band: 'junior', grade: 7, id: 'sci-51', order: 1065, title: '简单机械：撬动地球的工具', emoji: '🔧', textbook: '科学（七年级）',
    curriculum: { module: '力与机械', points: ['杠杆原理', '滑轮与轮轴', '生活中的机械'] },
    story: '「给我一个支点·我能撬起整个地球」——阿基米德没吹牛：他只是懂杠杆。这一课认识人类最早的「力量放大器」：简单机械——省力的智慧都藏在这些老工具里。',
    goals: ['理解杠杆平衡原理', '认识滑轮与轮轴', '发现身边的简单机械'],
    aiIntro: '🔧 撬起地球的支点——简单机械',
    param: { name: 'sm2', label: '机械站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么撬棍能撬大石头？', '定滑轮和动滑轮差在哪？', '生活里哪些是简单机械？'],
    views: [
      { when: 1, title: '杠杆', subtitle: '五要素', color: 'blue', emoji: '⚖️', blocks: [
        { kind: 'info', icon: '📐', title: '杠杆五要素', text: '支点（转轴）·动力·阻力·动力臂·阻力臂——杠杆平衡条件：动力×动力臂 = 阻力×阻力臂（F₁L₁=F₂L₂）：想省力？把动力臂加长——撬棍长长的杆就是干这个的' },
        { kind: 'compare', title: '三类杠杆', items: [
          { label: '省力杠杆', value: '动力臂>阻力臂——撬棍·开瓶器·手推车：省力但费距离（压很远才翘一点）' },
          { label: '费力杠杆', value: '动力臂<阻力臂——筷子·镊子·钓鱼竿：费力但省距离（手指动一点·夹到远处）：不是傻·是买「精准与速度」' },
          { label: '等臂杠杆', value: '两臂相等——天平：不省不费·换来公平的比较' },
        ] },
        { kind: 'highlight', text: 'F₁L₁=F₂L₂——省力费距离·费力省距离·天平等臂' },
      ] },
      { when: 2, title: '滑轮', subtitle: '定与动', color: 'green', emoji: '🪝', blocks: [
        { kind: 'compare', title: '两种滑轮', items: [
          { label: '定滑轮', value: '轴固定不动——旗杆顶上那个：不省力但改变方向（向下拉·旗向上升）：值这个功能' },
          { label: '动滑轮', value: '随货物一起动——省一半力但要拉两倍距离：工地上吊材料的常客' },
          { label: '滑轮组', value: '定+动组合——既省力又能变向：n段绳承担·省力到1/n：电梯·起重机的心脏' },
        ] },
        { kind: 'info', icon: '🎡', title: '轮轴与斜面', text: '轮轴（方向盘·螺丝刀·水龙头）：大轮带小轴·转动省力；斜面（盘山公路·无障碍坡道）：把「陡」拉「长」就省力——同样升10米·坡越长越轻松：简单机械一共六种（还有楔和螺旋）·全是这几种的组合' },
        { kind: 'highlight', text: '定滑轮变向·动滑轮省一半·轮轴斜面各显神通' },
      ] },
      { when: 3, title: '身边', subtitle: '机械就在手边', color: 'amber', emoji: '🔍', blocks: [
        { kind: 'compare', title: '找一找', items: [
          { label: '家里', value: '剪刀（两杠杆）·指甲钳（省力杠杆串）·自行车（轮轴+杠杆的交响）·开瓶器：一屋子的简单机械博物馆' },
          { label: '身体', value: '你的手臂就是费力杠杆（肘是支点·肱二头肌在近端）——费力换来摆动速度快：进化选了速度不是力气' },
          { label: '工地', value: '挖掘机（杠杆群）·吊车（滑轮组）·爬升的斜坡道——工程是简单机械的合唱团' },
        ] },
        { kind: 'info', icon: '💡', title: '永恒的守恒', text: '所有机械都在做同一笔交易——省力必费距离·省距离必费力·「又省力又省距离」的机械不存在（功的原理）：天下没有免费的午餐·物理早早写好了规则' },
        { kind: 'highlight', text: '省力费距离——机械不创造力·只搬运力' },
      ] },
    ],
    teach: { sections: [
      { title: '杠杆', body: '【平衡】F₁L₁=F₂L₂。\n【省力】撬棍开瓶器（费距离）。\n【费力】筷子钓鱼竿（省距离）。\n【等臂】天平。' },
      { title: '滑轮与其他', body: '【定】变向不省力。【动】省一半费两倍距离。\n【组】省力1/n。【轮轴】方向盘。【斜面】盘山路。' },
      { title: '身边的机械', body: '【家】剪刀指甲钳自行车。\n【身体】手臂=费力杠杆。\n【守恒】省力必费距离·没有免费午餐。' },
    ], examples: [
      { q: '用撬棍挪大石头', steps: ['垫一块石头当支点', '支点尽量靠近石头', '长端用力压下', '杠杆平衡公式在工作'], tip: '加长动力臂' },
      { q: '解释盘山公路', steps: ['同样的高度', '坡拉得越长越缓', '用距离换省力', '斜面原理'], tip: '把陡拉长' },
    ], mistakes: ['以为费力的杠杆是设计失误（省的是距离与速度）', '寻找「又省力又省距离」的神器（功的原理不允许）'] },
    exercises: [
      { q: '杠杆平衡的公式是？', options: ['动力=阻力', '动力×动力臂=阻力×阻力臂', '两臂总相等', '臂越长力越大'], answer: 1, explain: 'F₁L₁=F₂L₂' },
      { q: '下列属于省力杠杆的是？', options: ['筷子', '钓鱼竿', '开瓶器', '镊子'], answer: 2, explain: '动力臂长' },
      { q: '定滑轮的特点是？', options: ['省一半力', '改变力的方向', '省距离', '两者都省'], answer: 1, explain: '旗杆顶那个' },
      { q: '筷子使用时支点在？', options: ['筷子尖', '手指捏处上方', '筷尾', '没有支点'], answer: 1, explain: '费力换速度' },
      { q: '盘山公路利用的简单机械是？', options: ['滑轮', '斜面', '轮轴', '杠杆'], answer: 1, explain: '把陡拉长' },
      { q: '简单机械省力就必然费 ___', options: ['距离', '力气'], answer: 0, explain: '功的原理', type: 'blank', blank: { answerText: '距离', bank: ['距离', '力气'] } },
    ],
  }),
  L({
    area: '信息科技', band: 'junior', grade: 8, id: 'it-27', order: 1066, title: '数据可视化：让数字开口', emoji: '📊', textbook: '信息科技（初中拓展）',
    curriculum: { module: '数据处理', points: ['为什么可视化', '图表选型', '警惕骗人图'] },
    story: '一张表 3000 行数字·看十分钟找不到重点——画成图·三秒钟看清趋势。数据可视化不是「把数字变好看」·是让数字开口说话。这一课也教你识破「会撒谎的图表」。',
    goals: ['理解可视化的价值', '学会按数据选图表', '识别误导性图表'],
    aiIntro: '📊 让数字开口说话——数据可视化',
    param: { name: 'dv', label: '可视化站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么图比表好懂？', '什么数据配什么图？', '图表怎样骗人？'],
    views: [
      { when: 1, title: '价值', subtitle: '图胜千表', color: 'blue', emoji: '👁️', blocks: [
        { kind: 'info', icon: '🧠', title: '人脑爱图', text: '视觉是人类带宽最大的感官——一眼能看出「哪根柱子最高·哪条线在跌」：表格需要逐个读·图表整体呈现：可视化=把数字翻译成视觉语言' },
        { kind: 'info', icon: '🎯', title: '可视化的三问', text: '一张好图回答三个问题：①有什么模式（涨跌·分布·异常值）②谁和谁比③所以呢（结论）：不能回答「所以呢」的图·只是装饰' },
        { kind: 'highlight', text: '把数字翻译成视觉语言——好图直接给结论' },
      ] },
      { when: 2, title: '选型', subtitle: '对号入座', color: 'green', emoji: '🧰', blocks: [
        { kind: 'compare', title: '图表选型表', items: [
          { label: '比较大小', value: '柱状图——谁多谁少一目了然（各科平均分）：类别比较的首选' },
          { label: '看趋势', value: '折线图——时间怎么变（月度气温）：有时间轴就用它' },
          { label: '看占比', value: '饼图——部分占整体（零花钱去向）：类别别超过5块·否则看不清' },
          { label: '看分布', value: '散点图（两变量关系）·直方图（数据分布）：找相关性和分布形态' },
        ] },
        { kind: 'info', icon: '🎨', title: '设计三原则', text: '一张图说一件事（标题写结论：「数学成绩持续进步」而不是「成绩图」）；少即是多（去掉花哨3D和渐变——干扰读数）；标注来源和单位（严谨是可信的外衣）' },
        { kind: 'highlight', text: '比大小柱状·看趋势折线·看占比饼图——标题直接写结论' },
      ] },
      { when: 3, title: '防骗', subtitle: '会撒谎的图', color: 'red', emoji: '⚠️', blocks: [
        { kind: 'compare', title: '三大骗术', items: [
          { label: '截断Y轴', value: '柱状图Y轴不从0开始——「50分 vs 52分」能画成差三倍高的柱子：差距被视觉放大：见到不从0开始的柱图·先问为什么' },
          { label: '双轴戏法', value: '两条线用左右两个不同刻度的Y轴——调整刻度能让任何两条线「相交」或「分道扬镳」：想证明什么都画得出来' },
          { label: '3D与顺序', value: '3D饼图扭曲比例（前排遮挡后排）·饼图块顺序乱排（该从大到小顺时针）：花哨常是掩盖' },
        ] },
        { kind: 'info', icon: '🛡️', title: '防骗三步', text: '①看轴：从哪开始·单位是什么②看源：数据从哪来（样本多大）③想一想：换个画法结论还成立吗——带着这三步看新闻图表·你比多数读者清醒' },
        { kind: 'highlight', text: '截断Y轴·双轴·3D——骗术再多·看轴看源想一遍就破' },
      ] },
    ],
    teach: { sections: [
      { title: '价值', body: '【原理】视觉带宽最大·一眼见模式。\n【三问】模式？谁比谁？所以呢？' },
      { title: '选型', body: '【柱状】比大小。【折线】看时间趋势。\n【饼】占比≤5块。【散点】相关性。\n【设计】标题写结论·少装饰·标来源。' },
      { title: '防骗', body: '【截断Y轴】差距视觉放大。\n【双轴】刻度可证一切。【3D】扭曲比例。\n【三步】看轴·看源·换画法想想。' },
    ], examples: [
      { q: '展示班级各科平均分', steps: ['类别比较→柱状图', 'X轴科目Y轴分数从0起', '标题写结论：语文领先', '标注数据来源'], tip: '对号入座' },
      { q: '发现广告图Y轴从90开始', steps: ['识别截断Y轴骗术', '差距被视觉放大', '还原从0开始的画法', '结论可能站不住'], tip: '看轴第一步' },
    ], mistakes: ['所有数据都用饼图（趋势用折线·比较用柱状）', '相信截断Y轴制造的大差距（轴必须看起点）'] },
    exercises: [
      { q: '展示每月气温变化应选？', options: ['饼图', '折线图', '表格', '文字'], answer: 1, explain: '时间趋势' },
      { q: '比较五个班的人数应选？', options: ['柱状图', '折线图', '散点图', '流程图'], answer: 0, explain: '类别比较' },
      { q: '饼图适合展示？', options: ['时间变化', '部分占整体的比例', '两变量关系', '地理位置'], answer: 1, explain: '占比' },
      { q: '柱状图Y轴从90开始意味着？', options: ['更精确', '视觉放大差距', '更美观', '规则要求'], answer: 1, explain: '截断Y轴骗术' },
      { q: '好图表的标题应该？', options: ['只写「图表」', '直接写结论', '不写标题', '用英文'], answer: 1, explain: '一眼给结论' },
      { q: '数据可视化是把数字翻译成 ___ 语言', options: ['视觉', '机器'], answer: 0, explain: '人脑爱图', type: 'blank', blank: { answerText: '视觉', bank: ['视觉', '机器'] } },
    ],
  }),
  L({
    area: '信息科技', band: 'junior', grade: 7, id: 'it-28', order: 1067, title: '信息与信息社会', emoji: 'ℹ️', textbook: '信息科技（七年级）',
    curriculum: { module: '信息意识', points: ['什么是信息', '信息的特征', '信息素养'] },
    story: '你每天刷的手机屏·其实是一条「信息之河」——但什么是信息？数据和知识是一回事吗？这一课回到原点：搞懂我们这个时代最基础的词——信息。',
    goals: ['理解信息的概念', '掌握信息的特征', '树立信息素养'],
    aiIntro: 'ℹ️ 时代的基础词——信息与信息社会',
    param: { name: 'is2', label: '信息站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['数据和知识是信息吗？', '信息有哪些特征？', '怎样做个有素养的数字公民？'],
    views: [
      { when: 1, title: '概念', subtitle: '三层楼', color: 'blue', emoji: '🪜', blocks: [
        { kind: 'compare', title: '数据·信息·知识', items: [
          { label: '数据', value: ' raw 的记录——数字·文字·图像·声音本身：气温表上一串数字（25·26·27…）：原料' },
          { label: '信息', value: '被加工后有含义的数据——「本周气温持续上升」：数据+语境=信息：有用的中间产品' },
          { label: '知识', value: '信息的规律化——「本地6月多升温·午后雷雨常见」：从大量信息中提炼的规律：能指导决策的成品' },
        ] },
        { kind: 'info', icon: '🌍', title: '香农与信息论', text: '1948年·香农创立信息论——用「比特」量化信息（消除不确定性的程度）：你猜硬币正反（1比特的不确定）→我告诉你「正面」（消除不确定）：信息=减熵·这是数字时代的地基' },
        { kind: 'highlight', text: '数据是原料·信息是含义·知识是规律——三层楼步步增值' },
      ] },
      { when: 2, title: '特征', subtitle: '五个性', color: 'green', emoji: '🏷️', blocks: [
        { kind: 'compare', title: '信息的特征', items: [
          { label: '可共享', value: '一个苹果分给你我就少了·一条消息发给你我俩都有——共享不减少反而增值（越传播越有价值）：与物质最大的不同' },
          { label: '时效性', text: '', value: '「明天有雨」过了明天就是废纸——股票行情晚一小时就是损失：信息的价值随时间衰减', hint: '' },
          { label: '真伪性', value: '信息可以是假的——谣言·PS图·AI生成：物质有假货·信息的假货更隐蔽：所以需要信息素养' },
          { label: '载体依附', value: '信息必须附着在什么上——声波·纸张·电磁波·芯片：载体可换（一首歌从唱片到手机）信息不变' },
          { label: '价值相对', value: '同一信息对不同人价值不同——股市行情对股员是命·对你可能是噪点：信息因需而贵' },
        ] },
        { kind: 'highlight', text: '共享不减·过期作废·真假可混——信息的脾气要摸清' },
      ] },
      { when: 3, title: '素养', subtitle: '数字公民', color: 'amber', emoji: '🧭', blocks: [
        { kind: 'steps', title: '信息素养四件套', items: ['会获取：搜索技巧（关键词提炼·多源比对）——找得到是基本功', '会判断：信源可靠吗？证据充分吗？谁受益？——三个问题过一遍再转发', '会加工：整理归纳可视化——把信息变成自己的理解和产出', '有道德：不造谣不传谣·尊重版权·保护隐私——数字化生存的底线' ] },
        { kind: 'info', icon: '🌊', title: '信息过载时代', text: '每天产生的信息量超过古人一生的见闻——稀缺的不再是信息·而是注意力：管理注意力（少刷·精读·深思考）是这个时代的新素养：别让信息流牵着走' },
        { kind: 'highlight', text: '获取·判断·加工·道德——注意力是这个时代的稀缺品' },
      ] },
    ],
    teach: { sections: [
      { title: '三层概念', body: '【数据】原始记录。【信息】数据+含义。\n【知识】信息的规律。\n【香农】比特量化·消除不确定性。' },
      { title: '五特征', body: '【共享】不减反增。【时效】过期作废。\n【真伪】需要判断。【载体】可换壳。\n【相对】因人而贵。' },
      { title: '信息素养', body: '【四件套】获取·判断·加工·道德。\n【时代】注意力稀缺·管理它。\n【底线】不造谣传谣·尊版权护隐私。' },
    ], examples: [
      { q: '区分一段天气记录的三层', steps: ['数据：一串气温数值', '信息：本周持续升温', '知识：本地此季多回暖', '加工步步增值'], tip: '三层楼' },
      { q: '群里转「震惊体」消息前', steps: ['查信源是否可靠', '搜索多方验证', '想谁受益', '不确定就不转发'], tip: '三问再转' },
    ], mistakes: ['把数据直接当信息（无语境的数据只是原料）', '认为信息越多越好（注意力稀缺·贵在筛选）'] },
    exercises: [
      { q: '「25,26,27…」一串温度数字属于？', options: ['知识', '信息', '数据', '智慧'], answer: 2, explain: '原始记录' },
      { q: '从大量信息中提炼的规律是？', options: ['数据', '知识', '噪音', '流量'], answer: 1, explain: '三层楼的顶层' },
      { q: '信息与物质最大的不同是？', options: ['可以共享不减少', '更重', '更贵', '看得见'], answer: 0, explain: '越传播越有价值' },
      { q: '「明天下雨」后天再看属于？', options: ['价值更高', '时效已过', '变成知识', '自动更新'], answer: 1, explain: '时效性' },
      { q: '信息素养的四个组成部分是？', options: ['获取判断加工道德', '吃喝玩乐', '听说读写', '加减乘除'], answer: 0, explain: '数字公民' },
      { q: '信息时代最稀缺的是 ___', options: ['注意力', '纸张'], answer: 0, explain: '管理它', type: 'blank', blank: { answerText: '注意力', bank: ['注意力', '纸张'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id + ' order=' + l.order).join(', '));
