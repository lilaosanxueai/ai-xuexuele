import fs from 'node:fs';
import path from 'node:path';

/**
 * 第86轮B：地理小学段扩容 6→12 节（geo-p1 ~ geo-p6，填 1/2/3/4/5 年级空白）。
 * 用法: npx tsx scripts/gen-geo-primary.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const L = (o) => ({
  toolbox: [],
  actor: { costume: o.emoji, x: 0, y: 0 },
  targets: [],
  tasks: [
    { id: 'e0', text: '探索：' + o.explore[0], check: { type: 'manual' }, hintPrompts: ['把滑块拖到两个极端对比观察', '用「因为…所以…」把发现写成一句话'] },
    { id: 'e1', text: '探索：' + o.explore[1], check: { type: 'manual' }, hintPrompts: ['把滑块拖到两个极端对比观察', '用「因为…所以…」把发现写成一句话'] },
    { id: 'e2', text: '探索：' + o.explore[2], check: { type: 'manual' }, hintPrompts: ['先做几组对比再下结论', '把发现记进「我的发现」'] },
    { id: 'quiz', text: '完成随堂小练', check: { type: 'manual' }, hintPrompts: ['答案都藏在卡片和讲解里'] },
  ],
  celebrate: '新知识到手！',
  island: 'cross',
  subjectArea: '地理',
  gradeBand: 'primary',
  ...o,
  lab: { params: [o.param] },
  interact: { views: o.views, explore: o.explore },
});

const LESSONS = [
  L({
    id: 'geo-p1', order: 594, title: '太阳公公的一天：影子方向秘密', emoji: '☀️', grade: 2, textbook: '人教版地理（小学拓展）',
    curriculum: { module: '地球与生活', points: ['太阳方位', '影子方向', '日出日落'] },
    story: '早晨上学时，你的影子长长的拖在身后；中午影子缩到脚底下；傍晚放学，影子又变长，却跑到了早晨的反方向。影子一天里偷偷转了个方向——这是谁在指挥？',
    goals: ['知道太阳东升西落', '发现影子方向和太阳相反', '会用影子辨别方向'],
    aiIntro: '☀️ 拖动时间滑块，看太阳和影子怎么配合！',
    param: { name: 't', label: '时间', min: 1, max: 4, step: 1, value: 1 },
    explore: ['早晨太阳在哪边、影子在哪边？', '中午影子为什么最短？', '没有指南针怎么用影子找方向？'],
    views: [
      { when: 1, title: '早晨', subtitle: '太阳从东方升起', color: 'amber', emoji: '🌅', blocks: [
        { kind: 'info', icon: '🌅', title: '太阳在哪', text: '太阳从东边升起——早晨太阳在东方' },
        { kind: 'info', icon: '🧍', title: '影子在哪', text: '影子和太阳方向相反——影子指向西方' },
        { kind: 'highlight', text: '影子长长地拖在身后，像一根指向西方的箭' },
      ] },
      { when: 2, title: '中午', subtitle: '太阳最高 · 影子最短', color: 'orange', emoji: '☀️', blocks: [
        { kind: 'info', icon: '☀️', title: '太阳最高', text: '中午太阳升到天空最高的位置' },
        { kind: 'info', icon: '🧍', title: '影子最短', text: '太阳越高，影子越短——中午影子缩到脚边' },
        { kind: 'highlight', text: '北回归线以北：中午太阳在南方，影子指向北方' },
      ] },
      { when: 3, title: '傍晚', subtitle: '太阳西下', color: 'rose', emoji: '🌇', blocks: [
        { kind: 'info', icon: '🌇', title: '太阳在哪', text: '傍晚太阳落到西边' },
        { kind: 'info', icon: '🧍', title: '影子在哪', text: '影子转向东方——和早晨正好相反' },
        { kind: 'highlight', text: '太阳和影子像跷跷板：一头翘起，另一头就压下' },
      ] },
      { when: 4, title: '影子指南针', subtitle: '没有工具也能辨方向', color: 'sky', emoji: '🧭', blocks: [
        { kind: 'steps', title: '三步辨向法', items: ['找到你的影子', '面朝影子站好——你在面向北方（中午）', '左西右东，方向全知道！'] },
        { kind: 'highlight', text: '迷路时先找影子：它是大自然送的指南针' },
      ] },
    ],
    teach: { sections: [
      { title: '太阳的运行', body: '太阳每天从东方升起，中午升到最高，傍晚从西方落下。\n（实际上太阳位置基本不动，是地球自转让我们看到太阳「东升西落」。）' },
      { title: '影子的规律', body: '影子和太阳的方向永远相反。\n太阳越低（早晨傍晚），影子越长；太阳越高（中午），影子越短。\n中午北回归线以北地区太阳在正南方，影子指向正北方。' },
      { title: '影子的用处', body: '古人用日晷（影子钟）计时；迷路时用影子辨向；楼房间距也要看影子。\n观察是地理学习的第一步！' },
    ], examples: [
      { q: '早上迎着太阳上学，影子在哪边？', steps: ['早晨太阳在东方', '你面朝太阳=面朝东', '影子在你背后', '影子指向西方'], tip: '影日相反' },
      { q: '为什么中午影子最短？', steps: ['影子长度取决于太阳高度', '中午太阳最高', '光线几乎从头顶照下', '所以影子缩到最短'], tip: '日高影短' },
    ], mistakes: ['认为影子方向和太阳相同（相反）', '认为影子长短不变（随太阳高度变化）'] },
    exercises: [
      { q: '早晨太阳从哪边升起？', options: ['东方', '西方', '南方', '北方'], answer: 0, explain: '太阳东升西落' },
      { q: '中午时影子指向？', options: ['北方（北回归线以北）', '南方', '东方', '西方'], answer: 0, explain: '中午太阳在南方，影子朝北' },
      { q: '一天中影子最短的时刻是？', options: ['中午', '早晨', '傍晚', '半夜'], answer: 0, explain: '中午太阳最高' },
      { q: '影子和太阳的方向关系是？', options: ['相反', '相同', '垂直', '没有关系'], answer: 0, explain: '影子和太阳永远方向相反' },
    ],
  }),
  L({
    id: 'geo-p2', order: 595, title: '小水滴旅行记：水的循环', emoji: '💧', grade: 3, textbook: '人教版地理（小学拓展）',
    curriculum: { module: '地球与生活', points: ['蒸发与凝结', '雨雪形成', '水循环'] },
    story: '海里的一颗小水滴被太阳晒得轻飘飘，飞上了天，变成白云去旅行；风把它吹到高山上，它冻成了雪花落下来，化成小溪，冲进大河，最后又回到了大海。水的旅行永远不会结束。',
    goals: ['说出水循环的主要环节', '知道雨雪是怎么来的', '树立节约用水意识'],
    aiIntro: '💧 跟着小水滴上天入地，转一圈水的循环！',
    param: { name: 's', label: '旅行阶段', min: 1, max: 4, step: 1, value: 1 },
    explore: ['小水滴怎么上天？', '白云为什么会变成雨？', '如果水停止循环会怎样？'],
    views: [
      { when: 1, title: '起飞：蒸发', subtitle: '太阳的魔法', color: 'amber', emoji: '☀️', blocks: [
        { kind: 'info', icon: '☀️', title: '蒸发', text: '太阳一晒，海面河面的水变成看不见的水汽，悄悄飞上天' },
        { kind: 'info', icon: '🍃', title: '植物的帮忙', text: '树叶也会「出汗」——蒸腾作用把水汽送到空中' },
        { kind: 'highlight', text: '水变成水汽的过程叫蒸发，它是旅行的第一步' },
      ] },
      { when: 2, title: '天上游：凝结', subtitle: '变成白云', color: 'sky', emoji: '☁️', blocks: [
        { kind: 'info', icon: '☁️', title: '凝结', text: '高空很冷，水汽抱住灰尘小颗粒凝结成小水滴，聚在一起就是云' },
        { kind: 'info', icon: '💨', title: '风带着跑', text: '风把云吹向陆地和高山——小水滴开始陆上旅行' },
        { kind: 'highlight', text: '云 = 无数悬浮的小水滴或小冰晶' },
      ] },
      { when: 3, title: '降落：降水', subtitle: '雨雪冰雹', color: 'violet', emoji: '🌧️', blocks: [
        { kind: 'info', icon: '🌧️', title: '下雨', text: '云里的小水滴越抱越大，空气托不住就掉下来——这就是雨' },
        { kind: 'info', icon: '❄️', title: '下雪', text: '高空温度低于零度，水汽直接变成雪花；夏天落地前的冰疙瘩是冰雹' },
        { kind: 'highlight', text: '雨·雪·冰雹统称降水' },
      ] },
      { when: 4, title: '回家：径流', subtitle: '回到大海再出发', color: 'teal', emoji: '🌊', blocks: [
        { kind: 'steps', title: '回家的路', items: ['雨水落在山上', '汇成小溪流进大河', '大河流向大海', '再次被太阳蒸发——循环永不停止！'] },
        { kind: 'highlight', text: '地球上的水在循环，但干净的水很有限——要节约每一滴' },
      ] },
    ],
    teach: { sections: [
      { title: '水循环的环节', body: '蒸发（含蒸腾）→水汽输送→凝结成云→降水→径流（地表河流+地下暗流）回到海洋。\n海陆间循环让陆地不断得到淡水补充。' },
      { title: '降水的形成', body: '水汽凝结需要两个帮手：降温（升高到高空）和凝结核（灰尘颗粒）。\n小水滴合并增大→空气托不住→降水。温度不同决定落下来的是雨、雪还是冰雹。' },
      { title: '珍惜每一滴', body: '地球虽然被称为「水球」，97% 是不能直接喝的海水；淡水只占 3%，大多还冻在冰川里。\n循环让水可再生，但净化需要时间和成本——节约用水人人有责。' },
    ], examples: [
      { q: '雨是从哪里来的？', steps: ['地面水蒸发上天', '水汽遇冷凝结成云', '小水滴合并变大', '掉下来就是雨'], tip: '云是雨的「妈妈」' },
      { q: '为什么河流总是流不尽？', steps: ['河水不断流向大海', '海面不断蒸发补充天上的水', '降水又不断补给河流', '水循环让河水取之不尽（但受污染会毁掉）'], tip: '循环的智慧' },
    ], mistakes: ['认为水汽是白色的（水汽无色，白云是小水滴）', '认为用完的水就消失了（水在循环，但被污染就难以利用）'] },
    exercises: [
      { q: '水变成水汽飞上天的过程叫？', options: ['蒸发', '凝结', '降水', '径流'], answer: 0, explain: '蒸发是水循环的第一步' },
      { q: '云主要由什么组成？', options: ['小水滴和小冰晶', '水汽', '灰尘', '烟雾'], answer: 0, explain: '水汽凝结成的小水滴悬浮在空中' },
      { q: '雨、雪、冰雹统称？', options: ['降水', '蒸发', '径流', '凝结'], answer: 0, explain: '从云里落下来的都叫降水' },
      { q: '地球上的淡水占比约是？', options: ['3%', '50%', '97%', '30%'], answer: 0, explain: '97% 是海水，淡水只占 3%' },
    ],
  }),
  L({
    id: 'geo-p3', order: 596, title: '动物的房子在哪：住出来的地理', emoji: '🏠', grade: 3, textbook: '人教版地理（小学拓展）',
    curriculum: { module: '家乡与环境', points: ['民居与环境', '气候与建筑', '因地制宜'] },
    story: '傣家的竹楼悬空架起，黄土高原的窑洞凿进山体，北极的冰屋用雪块垒成，草原上的毡房说走就走……动物有巢，人有屋——房子，就是人类写给大自然的答卷。',
    goals: ['发现民居与环境的关系', '举出两个因地制宜的例子', '理解「一方水土养一方人」'],
    aiIntro: '🏠 环游世界，看房子怎么「入乡随俗」！',
    param: { name: 'h', label: '民居', min: 1, max: 4, step: 1, value: 1 },
    explore: ['竹楼为什么要架空？', '窑洞冬暖夏凉的秘密是什么？', '你家房子的设计适应了什么环境？'],
    views: [
      { when: 1, title: '傣家竹楼', subtitle: '湿热地区的智慧', color: 'green', emoji: '🎍', blocks: [
        { kind: 'info', icon: '🌡️', title: '环境', text: '云南西双版纳：终年湿热、多雨多蛇虫' },
        { kind: 'info', icon: '🎍', title: '妙处', text: '竹楼用竹木架空：上层住人防潮防虫，下层养牲畜；坡顶排水快' },
        { kind: 'highlight', text: '就地取材（竹子多）+ 适应气候（防潮散热）= 民居智慧' },
      ] },
      { when: 2, title: '黄土窑洞', subtitle: '冬暖夏凉的洞穴', color: 'amber', emoji: '🕳️', blocks: [
        { kind: 'info', icon: '⛰️', title: '环境', text: '黄土高原：黄土深厚直立、干燥少雨、冬冷夏热' },
        { kind: 'info', icon: '🕳️', title: '妙处', text: '凿洞而居：黄土保温，冬暖夏凉；不占耕地，施工简单' },
        { kind: 'highlight', text: '窑洞是「靠山吃山」的居住智慧，一住几千年' },
      ] },
      { when: 3, title: '北极冰屋', subtitle: '用雪做的房子', color: 'sky', emoji: '🧊', blocks: [
        { kind: 'info', icon: '❄️', title: '环境', text: '北极：终年严寒、风雪大、没有树木建材' },
        { kind: 'info', icon: '🧊', title: '妙处', text: '冰屋圆顶抗风、冰雪挡风；雪是热的不良导体，屋内比屋外暖几十度' },
        { kind: 'highlight', text: '没有材料？环境本身就是材料' },
      ] },
      { when: 4, title: '草原毡房', subtitle: '会搬家的房子', color: 'violet', emoji: '⛺', blocks: [
        { kind: 'info', icon: '🐎', title: '环境', text: '内蒙古草原：游牧民族逐水草而居，四季换草场' },
        { kind: 'info', icon: '⛺', title: '妙处', text: '毡房（蒙古包）用毛毡木架搭成，一小时拆装，跟着羊群走' },
        { kind: 'highlight', text: '房子不动人就得挨饿——生活方式决定房子样式' },
      ] },
    ],
    teach: { sections: [
      { title: '民居与环境', body: '民居是自然环境与人类智慧的结合。\n看民居三问：这里的气候怎样？有什么材料？人们怎么生活？\n湿热→通风防潮（竹楼·高脚屋）；干燥→厚墙小窗（平顶房）；寒冷→保暖（冰屋·火炕）；游牧→可移动（毡房）。' },
      { title: '经典例子', body: '【傣家竹楼】防潮防虫·就地取材。\n【黄土窑洞】保温节能·不占耕地。\n【北极冰屋】圆顶抗风·雪是绝缘体。\n【蒙古包】拆装灵活·随水草迁徙。' },
      { title: '因地制宜', body: '「一方水土养一方人」：环境塑造生活，人也智慧地适应环境。\n今天盖楼房装空调，依然在回答同样的问题——只是换了新手段。\n保护环境，就是保护我们的「家」的根基。' },
    ], examples: [
      { q: '为什么竹楼要架空？', steps: ['西双版纳湿热多雨', '地面潮气重、虫蛇多', '架空中层住人避开潮气', '下层还能养牲畜'], tip: '离地防潮' },
      { q: '窑洞为什么冬暖夏凉？', steps: ['黄土层深厚', '土是热的不良导体', '洞内温度变化慢', '冬暖夏凉，天然「空调房」'], tip: '大地的保温层' },
    ], mistakes: ['认为冰屋比木屋冷（雪是热的不良导体，屋内反而暖）', '认为民居样式是随便选的（都由环境与生活决定）'] },
    exercises: [
      { q: '傣家竹楼架空的主要目的是？', options: ['防潮防虫蛇', '好看', '省材料', '防地震'], answer: 0, explain: '湿热地区的适应性设计' },
      { q: '窑洞分布在？', options: ['黄土高原', '东北平原', '云贵高原', '内蒙古草原'], answer: 0, explain: '利用黄土直立性凿洞而居' },
      { q: '蒙古包可以随时拆装，是因为牧民？', options: ['逐水草而居', '喜欢搬家玩', '躲避野兽', '政府要求'], answer: 0, explain: '游牧生产方式决定居住形态' },
      { q: '北极冰屋保暖的关键是？', options: ['雪是热的不良导体', '冰屋里有暖气', '爱斯基摩人不怕冷', '冰屋很小'], answer: 0, explain: '冰雪隔热，屋内温度远高于屋外' },
    ],
  }),
  L({
    id: 'geo-p4', order: 597, title: '跟着候鸟去旅行：为什么迁徙', emoji: '🦢', grade: 4, textbook: '人教版地理（小学拓展）',
    curriculum: { module: '地球与生活', points: ['候鸟迁徙', '季节变化', '栖息地'] },
    story: '秋天一到，北京雨燕攒足力气，一口气飞上万公里到南非过冬；第二年春天，它们又准确飞回同一个屋檐下筑巢。没有地图、没有导航，它们凭什么不迷路？',
    goals: ['知道候鸟迁徙的原因', '说出迁徙路线上的关键驿站', '树立保护候鸟的意识'],
    aiIntro: '🦢 跟着候鸟的翅膀，飞越半个地球！',
    param: { name: 'b', label: '候鸟故事', min: 1, max: 3, step: 1, value: 1 },
    explore: ['候鸟为什么冬天要飞走？', '湿地对候鸟有多重要？', '我们能为候鸟做什么？'],
    views: [
      { when: 1, title: '为什么飞', subtitle: '追着食物和温暖', color: 'teal', emoji: '🌡️', blocks: [
        { kind: 'info', icon: '🌡️', title: '天气变冷', text: '北方冬天冰封雪盖，虫子死了、水面冻了，鸟儿没吃没喝' },
        { kind: 'info', icon: '🍽️', title: '南方过冬', text: '南方温暖食物多，但春天北方虫多天敌少、更适合繁殖' },
        { kind: 'highlight', text: '迁徙 = 追着「吃得住」跑，是生存的智慧' },
      ] },
      { when: 2, title: '怎么飞', subtitle: '路线·导航·驿站', color: 'sky', emoji: '🧭', blocks: [
        { kind: 'info', icon: '🧭', title: '天生的导航', text: '候鸟靠太阳星星定向，还能感应地球磁场——自带「GPS」' },
        { kind: 'info', icon: '🛫', title: '超级航线', text: '北京雨燕：北京→中亚→非洲，往返约 3.8 万公里；斑尾塍鹬能连飞 11 天不落地' },
        { kind: 'info', icon: '🛖', title: '驿站', text: '沿途的湿地滩涂是「服务区」，停歇觅食补充体力' },
        { kind: 'highlight', text: '一个驿站被填掉，整条航线都可能断掉' },
      ] },
      { when: 3, title: '一起守护', subtitle: '候鸟需要的三样东西', color: 'green', emoji: '🕊️', blocks: [
        { kind: 'steps', title: '保护行动', items: ['留下湿地：不填湖不围垦', '管住渔网：不过度捕捞鱼虾', '拒绝捕杀：不打鸟不掏窝，见到受伤鸟联系救助站'] },
        { kind: 'info', icon: '🏞️', title: '中国行动', text: '多地建立候鸟保护区；每年爱鸟周宣传爱鸟护鸟' },
        { kind: 'highlight', text: '候鸟不用护照，但它们需要「签证」——干净的家' },
      ] },
    ],
    teach: { sections: [
      { title: '候鸟与留鸟', body: '候鸟：随季节往返迁徙（燕子·大雁·雨燕·天鹅）。\n留鸟：常年留在同一地区（麻雀·喜鹊）。\n迁徙的本质：追逐食物与适宜的繁殖环境。' },
      { title: '迁徙的智慧', body: '定向：太阳·星星·地磁场·地形地标多管齐下。\n队形：大雁「人」字形飞行省力——前鸟翼尖气流帮后鸟。\n驿站：湿地滩涂是迁徙链的关键节点，缺一环则全线告急。' },
      { title: '与候鸟做朋友', body: '保护湿地=保护候鸟的加油站。\n观鸟不打鸟：望远镜是好客的方式。\n全球合作：候鸟跨国飞行，保护需要全世界一起努力（如中日澳候鸟保护协定）。' },
    ], examples: [
      { q: '大雁为什么排「人」字飞行？', steps: ['长途飞行很耗体力', '前鸟扇动翅膀产生上升气流', '后鸟借力省体力', '头雁累了换班——团队合作的智慧'], tip: '省力阵型' },
      { q: '为什么说湿地是候鸟的「服务区」？', steps: ['迁徙上万公里消耗巨大', '中途必须停歇觅食', '湿地鱼虾螺贝丰富', '没有驿站=飞不到终点'], tip: '一环都不能少' },
    ], mistakes: ['认为候鸟迁徙怕冷本身（鸟有羽毛，缺的是食物）', '认为所有鸟都迁徙（麻雀喜鹊是留鸟）'] },
    exercises: [
      { q: '候鸟迁徙主要是为了？', options: ['寻找食物和繁殖地', '旅游', '锻炼身体', '躲避天敌游戏'], answer: 0, explain: '追着食物与适宜环境跑' },
      { q: '下面哪种是留鸟？', options: ['麻雀', '大雁', '燕子', '天鹅'], answer: 0, explain: '麻雀常年留在本地' },
      { q: '候鸟迁徙途中歇脚觅食的地方主要是？', options: ['湿地滩涂', '沙漠', '城市高楼', '高山山顶'], answer: 0, explain: '湿地是候鸟的加油站' },
      { q: '大雁飞行排「人」字形是为了？', options: ['节省体力', '好看', '防御猎人', '保持队形整齐'], answer: 0, explain: '借助前鸟翼尖上升气流省力' },
    ],
  }),
  L({
    id: 'geo-p5', order: 598, title: '超市里的地理课：食物从哪来', emoji: '🛒', grade: 4, textbook: '人教版地理（小学拓展）',
    curriculum: { module: '家乡与环境', points: ['物产分布', '南北方差异', '运输与保鲜'] },
    story: '同样是超市：海南货架上的椰子，本地从不长；东北的大米在南方超市堆成山；冬天吃上夏季的西瓜……每一件商品背后，都藏着一个地理故事。',
    goals: ['发现食物产地与自然环境的关系', '比较南北方物产差异', '理解运输如何丰富餐桌'],
    aiIntro: '🛒 推着购物车上一堂地理课！',
    param: { name: 'g', label: '货架', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么香蕉不长在东北？', '南北方主粮为什么不同？', '冬天吃西瓜靠什么实现？'],
    views: [
      { when: 1, title: '水果区', subtitle: '甜是「积温」给的', color: 'orange', emoji: '🍌', blocks: [
        { kind: 'compare', title: '水果的家', items: [
          { label: '香蕉·椰子·菠萝', value: '海南·华南——终年炎热' },
          { label: '苹果·梨·葡萄', value: '北方——温凉干燥，昼夜温差大更甜' },
          { label: '哈密瓜', value: '新疆——日照强温差大，糖分足足的' },
        ] },
        { kind: 'highlight', text: '每种水果都有「脾气」：温度不够甜不起来' },
      ] },
      { when: 2, title: '粮食区', subtitle: '南稻北麦', color: 'amber', emoji: '🌾', blocks: [
        { kind: 'info', icon: '🍚', title: '南方吃米', text: '南方湿热多雨，水田连片——种水稻' },
        { kind: 'info', icon: '🍞', title: '北方吃面', text: '北方降水较少气温较低，旱地——种小麦，所以馒头面条多' },
        { kind: 'highlight', text: '「南稻北麦、南米北面」：一方水土养一方胃' },
      ] },
      { when: 3, title: '反季节的秘密', subtitle: '大棚·冷库·物流', color: 'sky', emoji: '🚚', blocks: [
        { kind: 'info', icon: '🏡', title: '大棚', text: '塑料大棚把阳光关起来保温——冬天也能种夏天的菜' },
        { kind: 'info', icon: '❄️', title: '冷链', text: '冷库+冷藏车一路保鲜，海南荔枝三天到北京' },
        { kind: 'highlight', text: '科技+交通打破季节和距离——但也别忘了优先吃本地应季的更环保' },
      ] },
    ],
    teach: { sections: [
      { title: '物产与自然环境', body: '光照·热量·水分·土壤决定一个地方适合种什么。\n热带：椰子香蕉；温带：苹果梨；干旱区（新疆）：瓜果特别甜（温差大糖分积累多）。' },
      { title: '南北方差异', body: '【气候分界】秦岭—淮河一线。\n南方：湿热→水稻→米饭；北方：温凉→小麦→面食。\n这条线还是 1 月 0°C 等温线、800 毫米等降水量线。' },
      { title: '从田间到餐桌', body: '大棚技术突破季节限制；冷链物流突破距离限制。\n超市=一部立体的地理教科书：找三件商品，查查它们的家乡。' },
    ], examples: [
      { q: '新疆瓜果为什么特别甜？', steps: ['日照强光合旺盛', '昼夜温差大', '白天造糖多', '夜里消耗少——糖分攒下来'], tip: '温差=糖分' },
      { q: '北方人为什么爱吃面食？', steps: ['北方降水少气温低', '适合种小麦不适合水稻', '小麦磨成面粉', '馒头面条成了主食'], tip: '物产决定餐桌' },
    ], mistakes: ['认为香蕉可以种在北方（热量不足）', '认为反季节蔬果违反自然（大棚只是营造了适合的小环境）'] },
    exercises: [
      { q: '香蕉、椰子主要产在？', options: ['海南等热带地区', '东北', '新疆', '青藏高原'], answer: 0, explain: '热带作物需要终年高温' },
      { q: '新疆哈密瓜特别甜的原因是？', options: ['日照强、昼夜温差大', '雨水特别多', '土壤是黑的', '农民多浇水'], answer: 0, explain: '温差大利于糖分积累' },
      { q: '我国「南稻北麦」格局的主导因素是？', options: ['气候差异', '口味偏好', '历史传统', '政策规定'], answer: 0, explain: '南方湿热宜水稻，北方温凉宜小麦' },
      { q: '冬天能吃到新鲜西瓜主要靠？', options: ['大棚技术', '进口月球', '多施化肥', '新品种突变'], answer: 0, explain: '大棚营造温暖小环境' },
    ],
  }),
  L({
    id: 'geo-p6', order: 599, title: '家乡的宝藏：物产大搜索', emoji: '💎', grade: 5, textbook: '人教版地理（小学拓展）',
    curriculum: { module: '家乡与环境', points: ['自然资源', '区域物产', '资源保护'] },
    story: '你的家乡藏着一个「宝库」：山西的地下是煤海，大庆的地下是油河，江西的山里有稀土，东海的浪下有鱼群……宝藏不会自己走到我们面前——认识它们，才能用好它们、护好它们。',
    goals: ['举例说出家乡或我国的资源', '理解资源分布不均', '树立节约保护意识'],
    aiIntro: '💎 挖一挖大地藏的宝藏，学会珍惜它们！',
    param: { name: 'r', label: '宝藏类型', min: 1, max: 4, step: 1, value: 1 },
    explore: ['为什么煤多在北方、鱼多在东海？', '资源会用完吗？', '我们能为节约资源做什么？'],
    views: [
      { when: 1, title: '地下宝藏：矿产', subtitle: '煤·石油·稀土', color: 'slate', emoji: '⛏️', blocks: [
        { kind: 'compare', title: '中国矿产名片', items: [
          { label: '煤', value: '山西·内蒙古——「煤海」' },
          { label: '石油', value: '大庆·胜利油田——工业血液' },
          { label: '稀土', value: '内蒙古白云鄂博——「工业维生素」世界第一' },
        ] },
        { kind: 'highlight', text: '矿产要几百万年才能形成——用一点少一点，属于不可再生资源' },
      ] },
      { when: 2, title: '水土宝藏：农业', subtitle: '耕地·淡水', color: 'green', emoji: '🌾', blocks: [
        { kind: 'info', icon: '🌾', title: '耕地', text: '东北黑土地最肥沃（一脚能踩出油）；但我国人均耕地远低于世界平均' },
        { kind: 'info', icon: '💧', title: '淡水', text: '南多北少——所以有了南水北调大工程' },
        { kind: 'highlight', text: '耕地和淡水用得好能再生，被毁掉就很难恢复' },
      ] },
      { when: 3, title: '海洋宝藏', subtitle: '蓝色的国土', color: 'sky', emoji: '🐠', blocks: [
        { kind: 'info', icon: '🐠', title: '鱼场', text: '舟山渔场是我国最大渔场——寒暖流交汇饵料丰富' },
        { kind: 'info', icon: '🧂', title: '海盐·油气', text: '长芦盐场晒海盐；大陆架下藏着石油天然气' },
        { kind: 'highlight', text: '海洋不是垃圾桶：休渔期让鱼长大再捕' },
      ] },
      { when: 4, title: '做资源小卫士', subtitle: '节约·替代·循环', color: 'violet', emoji: '🛡️', blocks: [
        { kind: 'steps', title: '三件小事', items: ['节约：随手关灯·一水多用·光盘行动', '替代：多用太阳能风能，少烧煤', '循环：垃圾分类，旧物改造'] },
        { kind: 'info', icon: '♻️', title: '大道理', text: '绿水青山就是金山银山——资源护好了，家乡才可持续' },
        { kind: 'highlight', text: '宝藏属于每一个未来的人' },
      ] },
    ],
    teach: { sections: [
      { title: '自然资源的家底', body: '【可再生】耕地·淡水·森林·鱼类——用得合理可以再生。\n【不可再生】煤·石油·天然气·矿产——亿万年形成，用一点少一点。\n【国情】总量丰富，人均不足；分布不均（煤北水南）。' },
      { title: '主要物产分布', body: '【煤炭】山西·内蒙古·陕西。\n【石油】大庆（黑）·胜利（鲁）·塔里木（新）。\n【稀土】白云鄂博。\n【渔场】舟山最大。\n【盐场】长芦最大。' },
      { title: '资源保护', body: '节约优先：节水节电节粮。\n开发替代：风能太阳能核电。\n循环利用：垃圾分类回收。\n依法保护：休渔·耕地红线·自然保护区。' },
    ], examples: [
      { q: '为什么舟山能成为最大渔场？', steps: ['位于长江口附近', '寒暖流交汇搅动营养', '饵料丰富鱼群聚集', '加上岛屿地形利于鱼类繁殖'], tip: '洋流送的「外卖」' },
      { q: '煤为什么集中在北方？', steps: ['亿万年前北方有大片森林沼泽', '植物遗体被埋入地下', '高温高压变成煤', '所以煤田多在北方'], tip: '煤是远古的森林' },
    ], mistakes: ['认为资源取之不尽（不可再生资源用一点少一点）', '认为海洋资源随便捕（休渔期是让鱼「长大再生」）'] },
    exercises: [
      { q: '我国的「煤海」是指？', options: ['山西', '海南', '江苏', '青海'], answer: 0, explain: '山西煤炭储量居全国前列' },
      { q: '我国最大的渔场是？', options: ['舟山渔场', '渤海湾渔场', '北部湾渔场', '南海沿岸渔场'], answer: 0, explain: '寒暖流交汇，饵料丰富' },
      { q: '下面属于不可再生资源的是？', options: ['煤炭', '淡水', '森林', '鱼类'], answer: 0, explain: '煤要亿万年才能形成' },
      { q: '解决北方缺水的重大工程是？', options: ['南水北调', '西气东输', '青藏铁路', '三峡工程'], answer: 0, explain: '把长江流域的水调往北方' },
    ],
  }),
];

let n = 0;
for (const l of LESSONS) {
  fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
  n++;
}
console.log('已生成 ' + n + ' 节地理课:', LESSONS.map((l) => l.id).join(', '));
