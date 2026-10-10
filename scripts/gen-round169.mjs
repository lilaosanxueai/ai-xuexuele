import fs from 'node:fs';
import path from 'node:path';

/**
 * 第169轮：学段继续拉平——8节。
 * 劳动高+1/心理高+1/社会学高+1/信息高+1/信息小+1/道法小+1/英语初+1/地理初+1。
 */
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
    area: '劳动', band: 'senior', grade: 11, id: 'lab-43', order: 900, title: '烹饪进阶：给家人做一桌菜', emoji: '🍳', textbook: '人教版劳动（高中）',
    curriculum: { module: '烹饪技能', points: ['配菜设计', '火候与调味', '上菜流程'] },
    story: '会做一道菜和会做一桌菜是两回事——就像会写一句话和会写一篇文章。一桌菜要考虑荤素搭配·冷热搭配·烹饪时间统筹——这是项目管理+美学+化学的综合考试。这一课学会做一桌让全家惊喜的饭。',
    goals: ['学会配菜设计', '掌握火候与调味', '掌握做一桌菜的流程'],
    aiIntro: '🍳 给全家做一桌菜——烹饪进阶课！',
    param: { name: 'ck', label: '烹饪站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['一桌菜怎样搭配？', '盐和糖的关系？', '怎样让所有菜同时上桌？'],
    views: [
      { when: 1, title: '配菜', subtitle: '设计一桌', color: 'blue', emoji: '📋', blocks: [
        { kind: 'steps', title: '四菜一汤的设计', items: ['一荤主菜：红烧排骨/可乐鸡翅——有分量有主角', '一素炒：蒜蓉西兰花/清炒时蔬——清爽解腻', '一凉菜：拍黄瓜/凉拌木耳——提前做好不占锅', '一汤：番茄蛋汤/紫菜汤——简单快手', '主食：米饭（电饭煲不用管）——五样刚好一桌不浪费：两人做饭四人吃不剩' ] },
        { kind: 'info', icon: '🎨', title: '搭配原则', text: '颜色搭配（绿的西兰花+红的番茄+黄的蛋——好看）；口味搭配（浓的红烧+淡的清炒——不腻）；烹饪方式（炒+炖+凉拌——不重复' },
        { kind: 'highlight', text: '好的一桌菜=荤素+颜色+口味+方式的四个搭配' },
      ] },
      { when: 2, title: '调味', subtitle: '少即是多', color: 'green', emoji: '🧂', blocks: [
        { kind: 'compare', title: '基础调味', items: [
          { label: '盐', value: '一切味道的基础——先少放再补比多放好："盐多了没法救·盐少了可以加"' },
          { label: '糖', value: '不只要甜——糖能提鲜：炒菜加半勺糖→鲜味提升（不明显甜）——餐厅的秘诀' },
          { label: '酱油', value: '生抽调味（咸鲜）·老抽上色（深色菜）——炒菜用生抽·红烧加老抽' },
        ] },
        { kind: 'info', icon: '🔥', title: '火候三档', text: '大火爆炒（锁住水分·炒出"锅气"）；中火慢煎（金黄均匀）；小火炖煮（入味软烂）——大部分新手错在火太小：中餐的灵魂=大火快炒' },
        { kind: 'highlight', text: '调味顺序：先盐后糖·先酒后醋·酱油最后' },
      ] },
      { when: 3, title: '流程', subtitle: '时间统筹', color: 'amber', emoji: '⏱️', blocks: [
        { kind: 'steps', title: '一桌菜时间线', items: ['第一步（提前1小时）：凉菜做好放冰箱·排骨焯水炖上（30分钟不用管）', '第二步（提前15分钟）：洗菜切菜装盘备用（ mise en place 一切就位）', '第三步（开饭前10分钟）：大火炒两个热菜（每个3-5分钟）', '第四步（最后）：汤煮开下蛋液——3分钟出锅' ] },
        { kind: 'info', icon: '🎼', title: '关键：mise en place', text: '法语"一切就位"——所有食材洗好切好·调料摆好·再开火：专业厨师和业余的差别不在炒的技术·在准备：开火后再找蒜=手忙脚乱' },
        { kind: 'info', icon: '❤️', title: '最大的调味料', text: '用心——爸妈吃你做的菜·好不好吃是其次·"孩子长大了"才是他们真正品到的味道：做菜是爱的表达方式之一' },
        { kind: 'highlight', text: '提前准备+时间统筹=所有菜同时热腾腾上桌' },
      ] },
    ],
    teach: { sections: [
      { title: '配菜设计', body: '【结构】一荤一素一凉一汤一主食。\n【搭配】颜色+口味+方式多样化。' },
      { title: '火候与调味', body: '【盐】先少再补。【糖】提鲜。【酱油】生抽调老抽色。\n【火】大火爆炒锁水。' },
      { title: '时间统筹', body: '【流程】凉菜→炖菜→备菜→炒菜→汤。\n【关键】mise en place一切就位。\n【心法】用心是最好的调味料。' },
    ], examples: [
      { q: '第一次给爸妈做一桌菜', steps: ['选四菜一汤简单搭配', '凉菜提前·排骨先炖', '切菜备好再开火', '汤最后3分钟出锅'], tip: '时间线' },
      { q: '菜总是咸了', steps: ['先放一半的盐', '尝味道', '不够再加', '记住"盐少了能救·多了不能"'], tip: '渐进法' },
    ], mistakes: ['所有菜都最后一起炒（提前准备分步做）', '一开始就放很多盐（先少再补）'] },
    exercises: [
      { q: '一桌菜最基本的搭配原则是？', options: ['全是肉', '荤素+颜色+口味搭配', '全是素', '一种菜一大盆'], answer: 1, explain: '多样化' },
      { q: '炒菜加半勺糖的目的是？', options: ['甜', '提鲜', '健康', '好看'], answer: 1, explain: '不甜但鲜' },
      { q: 'mise en place 的意思是？', options: ['慢慢做', '一切就位（先备好再开火）', '随便做', '吃法文'], answer: 1, explain: '专业厨师秘诀' },
      { q: '做一桌菜的正确流程是？', options: ['全最后做', '凉菜先→炖菜慢→炒菜快→汤最后', '全先做', '看心情'], answer: 1, explain: '时间统筹' },
      { q: '盐的正确放法是？', options: ['一次放够', '先少放再补', '不放', '越多越好'], answer: 1, explain: '多了救不回' },
      { q: '用心是最好的 ___', options: ['调味料', '借口'], answer: 0, explain: '爱是味道', type: 'blank', blank: { answerText: '调味料', bank: ['调味料', '借口'] } },
    ],
  }),
  L({
    area: '心理学', band: 'senior', grade: 11, id: 'psy-51', order: 901, title: '正念入门：活在当下', emoji: '🧘', textbook: '综合素养读本·心理',
    curriculum: { module: '心理健康', points: ['什么是正念', '正念呼吸法', '日常正念练习'] },
    story: '你在吃饭时想着下午的考试·考试时想着晚饭吃什么·洗澡时刷着手机——身体在这里·脑子在别处。正念就是"身心合一"：把注意力拉回此时此刻——不需要盘腿不需要念经·只需要"知道自己在干什么"。',
    goals: ['理解正念的核心', '掌握正念呼吸法', '学会日常正念'],
    aiIntro: '🧘 身心合一时最有力量——正念入门！',
    param: { name: 'mf', label: '正念站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么总感到"忙而空"？', '怎样让脑子安静三分钟？', '走路也能正念吗？'],
    views: [
      { when: 1, title: '本质', subtitle: '不带评判的觉知', color: 'blue', emoji: '💡', blocks: [
        { kind: 'info', icon: '🧠', title: '什么是正念', text: '有意识地·不加评判地·关注当下——三个关键词：有意识（不是发呆）·不评判（不判断好坏·只是觉察）·当下（此时此刻不是过去未来）：正念≠冥想——冥想是练习方式·正念是生活方式' },
        { kind: 'info', icon: '🔄', title: '默认模式网络', text: '大脑的"默认模式"是走神——回想过去·担忧未来：走神占清醒时间的约47%——"忙碌了一整天但什么都没享受"就是因为这个。正念=从默认模式切换到"体验模式"' },
        { kind: 'info', icon: '📊', title: '科学验证', text: '正念练习8周→大脑灰质变化（与记忆·学习·情绪调节相关的区域增厚）——正念不是玄学是神经科学：被验证的效果：减压·改善睡眠·降低焦虑·提高专注力' },
        { kind: 'highlight', text: '正念=身心都在同一个时刻——最常见的"不在场"正是痛苦的来源' },
      ] },
      { when: 2, title: '呼吸', subtitle: '锚', color: 'green', emoji: '🌬️', blocks: [
        { kind: 'steps', title: '三分钟正念呼吸', items: ['坐直·闭上眼睛（或半闭）·不需要盘腿——椅子就行', '注意呼吸的自然节奏——不控制·只是"看着"它', '走神了？没关系——轻轻把注意力带回呼吸（走神≠失败·发现走神=正念成功）', '三分钟结束——睁开眼·注意一下现在的感觉跟刚才有什么不同' ] },
        { kind: 'info', icon: '⚓', title: '为什么用呼吸', text: '呼吸永远在当下——你不会呼吸昨天·不会呼吸明天：它是把注意力"锚定"在当下的最方便工具：不需要任何设备·随时可用' },
        { kind: 'info', icon: '⏱️', title: '什么时候用', text: '考试前3分钟（降低焦虑）·写作业前（提高专注）·睡前（帮助入睡）·情绪要爆发时（给理性6秒）——正念不是仪式·是随时可用的工具' },
        { kind: 'highlight', text: '发现走神→带回呼吸——每一次"带回"都是一次正念' },
      ] },
      { when: 3, title: '日常', subtitle: '三件小事', color: 'amber', emoji: '🍚', blocks: [
        { kind: 'steps', title: '三个日常练习', items: ['正念吃饭：吃第一口饭时·只关注味道·温度·口感——不想别的·不想下一口：你会发现自己"从没认真尝过这碗饭"', '正念走路：走100步·只感受脚踩地面的感觉——不想目的地不想手机：大脑在这100步里真正休息了', '正念洗碗：感受水温·碗的触感——不想"好烦我还有作业"：洗碗就是洗碗' ] },
        { kind: 'info', icon: '🔑', title: '核心心法', text: '做一件事时就只做一件事——吃饭时吃饭·走路时走路：看起来简单·试试就知道多难：但每一次成功=给大脑一次真正的休息' },
        { kind: 'info', icon: '🌱', title: '循序渐进', text: '从每天3分钟呼吸开始——一周后加正念吃饭→再加走路——一个月后你会发现自己"在场"的时候变多了：正念不是技能是习惯——慢慢来比较快' },
        { kind: 'highlight', text: '做一件事时就只做一件事——这就是正念的全部' },
      ] },
    ],
    teach: { sections: [
      { title: '正念的本质', body: '【定义】有意识+不评判+关注当下。\n【走神】大脑默认模式占清醒47%。\n【科学】8周练习改变大脑结构。' },
      { title: '正念呼吸', body: '【方法】注意呼吸→走神→带回→重复。\n【原理】呼吸永远在当下=最好的锚。\n【时机】考前·睡前·情绪爆发前。' },
      { title: '日常正念', body: '【吃饭】只关注味道。\n【走路】只感受脚触地。\n【洗碗】不想别的。\n【心法】做一件事就只做一件事。' },
    ], examples: [
      { q: '写作业总想刷手机', steps: ['写前3分钟正念呼吸', '注意走神→带回呼吸', '开始写——只在走神时带回', '慢慢延长专注时间'], tip: '正念=专注力训练' },
      { q: '睡前脑子转个不停', steps: ['正念呼吸3分钟', '只关注呼吸不控制', '走神→带回（不是失败）', '大脑慢慢安静'], tip: '锚定当下' },
    ], mistakes: ['认为走神=失败（发现走神就是正念成功）', '认为正念=宗教或玄学（是神经科学验证的方法）'] },
    exercises: [
      { q: '正念的三个核心要素是？', options: ['坐着+闭眼+深呼吸', '有意识+不评判+关注当下', '不说话+不动+不想', '念经+盘腿+放空'], answer: 1, explain: '不评判是关键' },
      { q: '大脑默认模式（走神）占清醒时间约？', options: ['5%', '20%', '47%', '90%'], answer: 2, explain: '近一半' },
      { q: '正念呼吸走神了应该？', options: ['放弃', '骂自己', '轻轻带回呼吸（发现=成功）', '强迫不想'], answer: 2, explain: '不评判' },
      { q: '为什么用呼吸做"锚"？', options: ['传统', '呼吸永远在当下', '好看', '方便计数'], answer: 1, explain: '你不会呼吸昨天' },
      { q: '正念吃饭的核心是？', options: ['吃快点', '只关注味道温度口感', '边看剧边吃', '边聊天边吃'], answer: 1, explain: '一次只做一件事' },
      { q: '做一件事时就只做一件事——这就是正念的 ___', options: ['全部', '开始'], answer: 0, explain: '核心心法', type: 'blank', blank: { answerText: '全部', bank: ['全部', '开始'] } },
    ],
  }),
  L({
    area: '信息科技', band: 'junior', grade: 8, id: 'ai-22', order: 902, title: '搜索技巧：找答案的方法', emoji: '🔍', textbook: '信息科技（初中）',
    curriculum: { module: '信息素养', points: ['搜索关键词', '信息筛选', '信息可信度判断'] },
    story: '问Google/百度一个问题·出来一百万条结果——但第一条就是对的吗？怎样搜才能找到靠谱答案？这一课教你从"会打字"升级到"会搜索"。',
    goals: ['掌握搜索关键词技巧', '学会筛选信息', '判断信息可信度'],
    aiIntro: '🔍 找到答案的方法——搜索技巧课！',
    param: { name: 'sk', label: '搜索站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么搜出来的不是我想要的？', '哪个网站的信息更可信？', '怎样一句话找到准确答案？'],
    views: [
      { when: 1, title: '关键词', subtitle: '搜的艺术', color: 'blue', emoji: '⌨️', blocks: [
        { kind: 'compare', title: '搜好vs搜差', items: [
          { label: '差', value: '"为什么我的电脑不好了"——太多无关词·引擎不知道你在问什么' },
          { label: '好', value: '"笔记本电脑开机蓝屏 解决方法"——核心词+限定词：删掉"我的""不好了"这些废话' },
          { label: '更好', value: '"Windows11 蓝屏 0x0000007B 修复——加上系统版本+错误代码：精确匹配' },
        ] },
        { kind: 'info', icon: '🔧', title: '五个技巧', text: '①双引号"精确匹配"；②减号-排除（苹果-手机=水果的苹果）；③site:限定网站（site:zhihu.com 只搜知乎）；④filetype:pdf 只搜PDF；⑤用英文搜英文资料（结果质量往往更高）' },
        { kind: 'highlight', text: '搜索的关键词越精确·结果越靠谱——废话是搜索的敌人' },
      ] },
      { when: 2, title: '筛选', subtitle: '三秒判断', color: 'green', emoji: '🎯', blocks: [
        { kind: 'steps', title: '结果三看', items: ['看来源：官方网站（.gov.cn）>百科（维基/百度百科）>专业网站>个人博客>论坛——来源决定起点可信度', '看时间：3年前的技术文章可能过时——加"2024"或"最新"筛选近期内容', '看多个来源：同一个说法至少两个独立来源都说到才初步可信' ] },
        { kind: 'info', icon: '⚠️', title: '警惕这些', text: '标题党（"震惊！"）；满屏广告的网站（靠流量不靠质量）；评论区软文（"我用了效果好"可能是广告）；AI生成的虚假内容——越耸人越要核实' },
        { kind: 'highlight', text: '三秒三看：来源·时间·多源验证' },
      ] },
      { when: 3, title: '判断', subtitle: '可信度', color: 'amber', emoji: '⚖️', blocks: [
        { kind: 'compare', title: '可信度金字塔', items: [
          { label: '最可信', value: '政府网站（.gov.cn）·学术期刊（知网）·官方数据——有审核有责任' },
          { label: '中等可信', value: '知名媒体（新华网·人民网）·专业机构网站（WHO官网）——有编辑有声誉' },
          { label: '需验证', value: '百科（人人可编辑）·自媒体（立场驱动）·论坛（个人经验）——有价值但需交叉验证' },
          { label: '基本不可信', value: '匿名来源·无出处"据说"·标题党——不用' },
        ] },
        { kind: 'info', icon: '💡', title: '一个好习惯', text: '看到"惊人消息"先做一件事：用关键词搜一下有没有权威来源报道过——没有→大概率是假的或被歪曲的。查证30秒·防止被骗一辈子' },
        { kind: 'highlight', text: '搜索不是为了找到"想看到的"——是为了找到"真实的"' },
      ] },
    ],
    teach: { sections: [
      { title: '搜索关键词', body: '【核心】删废话+加限定词。\n【技巧】引号精确·减号排除·site:限定。\n【原则】越精确结果越靠谱。' },
      { title: '信息筛选', body: '【三看】来源·时间·多源验证。\n【警惕】标题党·广告·软文。' },
      { title: '可信度判断', body: '【高】政府·学术·官方数据。\n【中】知名媒体·专业机构。\n【低】百科·自媒体·论坛——需验证。\n【不用】匿名·无出处·标题党。' },
    ], examples: [
      { q: '想查一个健康说法是否靠谱', steps: ['搜关键词不带偏见词', '看来源是不是医院/卫健委', '找第二个独立来源', '两个都说到才初步可信'], tip: '交叉验证' },
      { q: '搜出来一百万条结果看不完', steps: ['换更精确的关键词', '加双引号精确匹配', '加site:限定专业网站', '只看前三个结果——后面的质量递减'], tip: '缩小范围' },
    ], mistakes: ['只看第一条结果就信（排名≠正确）', '搜自己想看到的（确认偏误——搜真相不搜认同）'] },
    exercises: [
      { q: '搜索关键词的原则是？', options: ['越长越好', '越精确越好（删废话加限定）', '越短越好', '用整句话'], answer: 1, explain: '精确匹配' },
      { q: '搜索结果三看是？', options: ['颜色图片视频', '来源·时间·多源验证', '长度格式字体', '点赞评论转发'], answer: 1, explain: '质量判断' },
      { q: '可信度最高的信息来源是？', options: ['朋友圈', '论坛', '政府网站和学术期刊', '个人博客'], answer: 2, explain: '有审核有责任' },
      { q: '"苹果-手机"搜索会得到？', options: ['苹果手机', '水果苹果（排除了手机）', '什么都搜不到', '苹果公司'], answer: 1, explain: '减号排除' },
      { q: '看到"震惊体"标题应该？', options: ['马上转发', '先查权威来源有没有报道', '完全不信', '评论'], answer: 1, explain: '核实优先' },
      { q: '搜索不是为了找到想看到的——是为了找到 ___ 的', options: ['真实', '开心'], answer: 0, explain: '求真', type: 'blank', blank: { answerText: '真实', bank: ['真实', '开心'] } },
    ],
  }),
  L({
    area: '道德与法治', band: 'primary', grade: 6, id: 'eth-46', order: 903, title: '诚实守信：说到做到', emoji: '🤞', textbook: '统编版道德与法治（六年级）',
    curriculum: { module: '品格养成', points: ['承诺的重量', '诚实的代价与收获', '道歉与弥补'] },
    story: '你答应帮同学带书但忘了——说"我忘了"还是说"我肚子疼没来得及"？一个要面对不好意思·另一个看起来"没事"但心里知道在撒谎。诚实有时候需要勇气——但它的收获远大于代价。',
    goals: ['理解承诺的重量', '认识诚实的代价与收获', '学会道歉和弥补'],
    aiIntro: '🤞 说到做到——诚实守信课！',
    param: { name: 'hn', label: '诚信站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['答应了做不到怎么办？', '善意的谎言可以吗？', '做错了怎样道歉？'],
    views: [
      { when: 1, title: '承诺', subtitle: '说出口的分量', color: 'blue', emoji: '⚖️', blocks: [
        { kind: 'info', icon: '🤝', title: '什么是承诺', text: '你说"我会做到"——对方就信了·就等着了·可能还做了安排：承诺不只是一个句子——是别人对你的信任：越小的承诺越要守住（小事都做不到·大事谁信你？）' },
        { kind: 'steps', title: '做承诺前三问', items: ['我能做到吗？——先想再答应', '我有时间吗？——别把所有时间都许出去', '我愿意吗？——不想做就说不·比答应了不做诚实一百倍' ] },
        { kind: 'highlight', text: '承诺之前想清楚——承诺之后做到底' },
      ] },
      { when: 2, title: '诚实', subtitle: '代价与收获', color: 'green', emoji: '💎', blocks: [
        { kind: 'compare', title: '两面看', items: [
          { label: '诚实的代价', value: '当时尴尬（承认忘带书）；可能被批评（承认考砸了）；有时候吃亏（捡到钱归还——"亏了"几十块' },
          { label: '诚实的收获', value: '别人信任你（"TA说话算数"）；内心踏实（不用记着哪个谎在圆哪个谎）；关键时刻有人信你——信任是最贵的资产' },
        ] },
        { kind: 'info', icon: '🧮', title: '算一笔账', text: '撒一次谎→要用更多谎来圆→最后没人信你（重建信任要很久）；诚实一次→可能当下不舒服→但长期获得信任——短期吃亏·长期赚最大' },
        { kind: 'highlight', text: '信任是最贵的资产——失去容易重建难' },
      ] },
      { when: 3, title: '弥补', subtitle: '做错了之后', color: 'amber', emoji: '🩹', blocks: [
        { kind: 'steps', title: '真道歉四步', items: ['说清楚：我做错了什么（不说"如果让你不开心了"——直接认错）', '不找借口：错了就是错了（"因为...但是..."会让道歉打折）', '说对不起：真诚地说（不是敷衍的"行行行对不起"）', '想怎样弥补：明天一定带来/帮TA做一件事——行动比话语有力' ] },
        { kind: 'info', icon: '🤍', title: '打破承诺≠世界末日', text: '谁都做过不到的事——重要的是怎么面对：逃避和撒谎让小事变大；诚实面对+真诚道歉+尽力弥补=把大事化小' },
        { kind: 'highlight', text: '真诚的道歉+用行动弥补=重新赢得信任' },
      ] },
    ],
    teach: { sections: [
      { title: '承诺', body: '【本质】别人对你的信任。\n【三问】能做吗·有时间吗·愿意吗。\n【原则】小事也守·大事才信。' },
      { title: '诚实', body: '【代价】当下尴尬或吃亏。\n【收获】信任+踏实。\n【账】短期亏·长期赚最大。' },
      { title: '道歉与弥补', body: '【四步】说清楚+不找借口+真诚+行动弥补。\n【心态】犯错不丢人·逃避才丢人。' },
    ], examples: [
      { q: '答应帮同学带书但忘了', steps: ['承认：对不起我忘了', '不找借口', '明天一定带来', '下次答应前设闹钟'], tip: '诚实+行动' },
      { q: '捡到同学的钱', steps: ['还回去（不管多少）', '可能"亏了"但获得了信任', '如果你丢了钱也希望有人还', '诚实是让所有人安心的选择'], tip: '长期主义' },
    ], mistakes: ['认为小承诺可以不守（小事不守大事谁信）', '道歉加"但是"（借口让道歉打折）'] },
    exercises: [
      { q: '做承诺之前应该？', options: ['先答应再说', '三问自己能不能愿不愿', '看心情', '不管'], answer: 1, explain: '想清楚再答应' },
      { q: '诚实的最大收获是？', options: ['得到糖果', '别人的信任', '不挨骂', '省钱'], answer: 1, explain: '最贵的资产' },
      { q: '答应的事忘了·正确的做法是？', options: ['找借口', '诚实承认+道歉+弥补', '不理对方', '说是别人搞错了'], answer: 1, explain: '诚实面对' },
      { q: '真道歉不包括？', options: ['说清楚错了什么', '真诚说对不起', '找借口说因为...', '用行动弥补'], answer: 2, explain: '借口打折' },
      { q: '撒一个谎之后通常要？', options: ['没事', '用更多的谎来圆', '自动消失', '变真'], answer: 1, explain: '滚雪球' },
      { q: '信任是最贵的 ___', options: ['资产', '玩具'], answer: 0, explain: '失去易重建难', type: 'blank', blank: { answerText: '资产', bank: ['资产', '玩具'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 7, id: 'eng-40', order: 904, title: 'English Speech: 怎样做好英文展示', emoji: '🗣️', textbook: '人教PEP（七年级）',
    curriculum: { module: '口语表达', points: ['演讲结构', '发音技巧', '肢体语言'] },
    story: '下周英语课要做3分钟English presentation——大部分人的反应是"can I speak Chinese?"。其实用英语展示没有你想的那么难——准备好结构+练习三遍+几个关键技巧，你就能做出让老师眼前一亮的展示。',
    goals: ['掌握英语演讲结构', '改善发音技巧', '用好肢体语言'],
    aiIntro: '🗣️ Present in English with confidence! 演讲课',
    param: { name: 'es', label: '演讲站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['英语演讲怎样开头？', '发音不好能演讲吗？', '站在台上手放哪？'],
    views: [
      { when: 1, title: '结构', subtitle: '三段式', color: 'blue', emoji: '📐', blocks: [
        { kind: 'steps', title: 'Presentation 三步', items: ['Opening 开头（30秒）：Good morning everyone. Today I want to talk about...（今天我想聊聊...）——直接告诉听众你要说什么', 'Body 主体（2分钟）：First... Second... Third...（用First/Second让听众跟得上你的节奏）', 'Closing 结尾（30秒）：Thank you for listening.（谢谢大家）+ 如果有提问：Any questions?' ] },
        { kind: 'info', icon: '🪝', title: '好开头的三个方法', text: '提问题开头：Do you like pandas?（你喜欢熊猫吗？）·讲个人故事开头：Last weekend I went to...·展示图片：Look at this picture.——不要用"Today my topic is..."（太无聊）' },
        { kind: 'highlight', text: 'Structure = Opening + Body(First/Second/Third) + Closing' },
      ] },
      { when: 2, title: '发音', subtitle: '不用完美', color: 'green', emoji: '🗣️', blocks: [
        { kind: 'info', icon: '🎯', title: '两个重点', text: '①Loud enough：声音够大——后排能听到（紧张时人会变小声：刻意大声一点）；②Slow down：说慢一点——紧张时人会加速（刻意放慢20%）' },
        { kind: 'info', icon: '💪', title: '发音不准怎么办', text: '完美口音≠好演讲——清晰>漂亮：把关键词说清楚就行：练习时把不会读的词查音标·跟着手机念三遍：没人期待你是BBC主播' },
        { kind: 'info', icon: '⏸️', title: '停顿的力量', text: '说重点之前停1秒——Today... I want to talk about PANDAS.（停顿让PANDAS更有分量）——紧张的人不停·高手善用停顿' },
        { kind: 'highlight', text: '声音大+说慢+关键词清楚——比口音漂亮重要一百倍' },
      ] },
      { when: 3, title: '身体', subtitle: '不说谎的身体', color: 'amber', emoji: '🧍', blocks: [
        { kind: 'steps', title: '三个身体技巧', items: ['站直+微笑：肩膀打开·看着观众（不是看天花板或地板）——微笑让你和观众都放松', '手势：用手指表示First/Second/Third（数手指比说出来更有力）；描述大小高低时用手比划', '走动：不要钉在原地——说到重点时往前一步——身体动了紧张就散了' ] },
        { kind: 'info', icon: '👀', title: '眼睛看哪', text: '找三张友善的脸（左中右）——轮流看他们·像跟朋友聊天：不要只看老师一个人——老师也是观众' },
        { kind: 'info', icon: '📝', title: '万无一失卡', text: '拿一张小卡片写关键词（不是全稿）——忘词时瞄一眼：写 opening 的第一句+三个 First/Second/Third 的关键词+最后一句话' },
        { kind: 'highlight', text: '站直+微笑+眼神交流——身体在说"我准备好了"' },
      ] },
    ],
    teach: { sections: [
      { title: '演讲结构', body: '【Opening】问题/故事/图片开头。\n【Body】First/Second/Third。\n【Closing】Thank you + Any questions?' },
      { title: '发音技巧', body: '【声音】够大+说慢20%。\n【关键】关键词清楚>口音漂亮。\n【停顿】说重点前停1秒。' },
      { title: '肢体语言', body: '【站姿】直+微笑+眼神交流。\n【手势】数手指+比划。\n【工具】关键词卡片。' },
    ], examples: [
      { q: '3分钟英语展示My Hobby', steps: ['开头：Do you have a hobby? Let me tell you about mine.', '主体：First... Second... Third...', '结尾：Thank you!', '练习3遍'], tip: '三段式+练' },
      { q: '紧张到忘词', steps: ['停顿（观众以为你在思考）', '看关键词卡片', '从最近的词继续', '没人知道你忘了'], tip: '卡片保险' },
    ], mistakes: ['拿全稿上台念（用关键词卡）', '只看老师不看同学（观众是所有人）'] },
    exercises: [
      { q: '好的英语演讲开头方式是？', options: ['Today my topic is...', '提问/故事/图片', '念课本', '沉默'], answer: 1, explain: '吸引注意' },
      { q: '英语演讲最重要的不是？', options: ['声音够大', '说慢+关键词清楚', '口音完美', '眼神交流'], answer: 2, explain: '清晰>漂亮' },
      { q: '说重点之前应该？', options: ['加速', '停顿1秒', '小声说', '跳过'], answer: 1, explain: '停顿是武器' },
      { q: '上台拿的卡片上应该写？', options: ['全稿', '关键词（第一句+三个要点+结尾）', '空白', '笑话'], answer: 1, explain: '关键词卡' },
      { q: '眼神应该看哪？', options: ['天花板', '左中右三张友善的脸', '只看老师', '地板'], answer: 1, explain: '眼神交流' },
      { q: '声音够大+说慢+关键词 ___', options: ['清楚', '模糊'], answer: 0, explain: '三个关键', type: 'blank', blank: { answerText: '清楚', bank: ['清楚', '模糊'] } },
    ],
  }),
  L({
    area: '地理', band: 'junior', grade: 8, id: 'geo-32', order: 905, title: '中国的国土与资源', emoji: '🗺️', textbook: '人教版地理（八上）',
    curriculum: { module: '中国地理', points: ['疆域与邻国', '资源分布', '优势与挑战'] },
    story: '中国陆地面积约960万km²（世界第三）·陆上邻国14个·海岸线1.8万km²——但这些数字背后是一个"资源大国但人均小国"的故事。这一课认识我们国家的"家底"。',
    goals: ['掌握中国的疆域概况', '了解资源分布特点', '理解人均资源挑战'],
    aiIntro: '🗺️ 认识我们的家底——国土与资源',
    param: { name: 'cn', label: '国土站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['中国有多大？邻国有谁？', '水资源南北差多少？', '为什么说"地大物博但人均不足"？'],
    views: [
      { when: 1, title: '疆域', subtitle: '位置和邻居', color: 'blue', emoji: '🌏', blocks: [
        { kind: 'info', icon: '📐', title: '基本数据', text: '陆地面积约960万km²（世界第三·仅次于俄和加）；陆上邻国14个（世界最多之一）；隔海相望6国（日韩菲等）；海岸线约1.8万km；管辖海域约300万km²' },
        { kind: 'info', icon: '⏰', title: '优越的位置', text: '纬度适中（大部分在温带和亚热带——四季分明·适合农业）；海陆兼备（东部靠海对外贸易·西部陆地通欧亚）；时区跨5个（但统一用北京时间）' },
        { kind: 'highlight', text: '海陆兼备+纬度适中——中国位置的两大优势' },
      ] },
      { when: 2, title: '资源', subtitle: '分布不均', color: 'amber', emoji: '⛏️', blocks: [
        { kind: 'compare', title: '资源的南北东西差异', items: [
          { label: '水资源', value: '南多北少（长江流域占约80%·华北仅约6%）——所以才要南水北调' },
          { label: '能源', value: '煤炭：北多南少（山西陕西内蒙古）；油气：西北+东北；水电：西南（落差大）' },
          { label: '耕地', value: '东部季风区集中（南方水田·北方旱地）；西部以草原荒漠为主' },
          { label: '人口', value: '东部密集西部稀疏——胡焕庸线（黑河-腾冲）：线东南约43%的土地承载约94%的人口' },
        ] },
        { kind: 'info', icon: '🚄', title: '资源调配工程', text: '南水北调（水从南到北）·西气东输（天然气从新疆到上海）·西电东送（水电火电从西到东）·北煤南运——全国一盘棋的资源调配' },
        { kind: 'highlight', text: '资源分布"错位"——水在南能矿在西人 在东——调配工程连接四方' },
      ] },
      { when: 3, title: '挑战', subtitle: '人均不足', color: 'green', emoji: '⚖️', blocks: [
        { kind: 'compare', title: '总量vs人均', items: [
          { label: '总量大', value: '水资源世界第6·矿产总量世界第3·耕地世界第4·森林世界第5——"地大物博"' },
          { label: '人均小', value: '人均水资源约为世界平均1/4·人均耕地约1/3·人均矿产约1/2——"人多到分薄了"' },
        ] },
        { kind: 'info', icon: '🌱', title: '应对', text: '节约优先（节水节电节粮）；提高效率（单位GDP能耗逐年降）；开发新能源（光伏风电全球第一）；资源回收（垃圾分类·循环经济）' },
        { kind: 'highlight', text: '"地大物博"后面要加一句"人均不足"——节约不是口号是数学' },
      ] },
    ],
    teach: { sections: [
      { title: '疆域概况', body: '【面积】960万km²世界第三。\n【邻国】陆上14个+隔海6个。\n【优势】海陆兼备+纬度适中。' },
      { title: '资源分布', body: '【水】南多北少。\n【能】煤北油气西北水西南。\n【地】东耕西草。\n【人】胡焕庸线东西分界。\n【调配】南水北调·西气东输。' },
      { title: '人均挑战', body: '【总量】水第6矿第3地第4。\n【人均】水约1/4地约1/3。\n【应对】节约+效率+新能源+回收。' },
    ], examples: [
      { q: '为什么建南水北调', steps: ['水资源南多北少', '华北人口密集需水大', '地下水超采漏斗区', '跨流域调水解决错位'], tip: '资源错配' },
      { q: '为什么说人均资源紧张', steps: ['总量确实大', '但人口14亿', '人均=总量÷人口', '水人均仅世界1/4'], tip: '算人均' },
    ], mistakes: ['只记住"地大物博"忘加"人均不足"（总量大不等于每人多）', '认为资源分布均匀（南北东西差异巨大）'] },
    exercises: [
      { q: '中国陆地面积约？', options: ['300万km²', '960万km²', '2000万km²', '100万km²'], answer: 1, explain: '世界第三' },
      { q: '中国陆上邻国有几个？', options: ['5个', '8个', '14个', '20个'], answer: 2, explain: '世界最多之一' },
      { q: '胡焕庸线大致走向？', options: ['东西向', '东北-西南向（黑河-腾冲）', '南北向', '环形'], answer: 1, explain: '人口分界线' },
      { q: '中国人均水资源约为世界平均的？', options: ['一样', '1/2', '1/4', '2倍'], answer: 2, explain: '人均严重不足' },
      { q: '西气东输输送的是什么？', options: ['水', '天然气（新疆到上海）', '煤炭', '电力'], answer: 1, explain: '能源调配' },
      { q: '"地大物博"后面要加一句"人均 ___ "', options: ['不足', '更多'], answer: 0, explain: '人口分薄了', type: 'blank', blank: { answerText: '不足', bank: ['不足', '更多'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id).join(', '));
