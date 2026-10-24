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
    area: '数学', band: 'senior', grade: 10, id: 'math-115', order: 1074, title: '正弦定理与余弦定理：解三角形', emoji: '📐', textbook: '人教A版数学（必修二）',
    curriculum: { module: '解三角形', points: ['正弦定理', '余弦定理', '测量应用'] },
    story: '隔着一条河想知道对岸两棵树的距离——尺子过不去，三角来帮忙。正弦·余弦定理是人类「不过河也能量河宽」的智慧：GPS·天文观测·测绘·底层都是这两个定理。',
    goals: ['掌握正弦定理及适用情形', '掌握余弦定理及适用情形', '会解实际问题'],
    aiIntro: '📐 不过河能量河宽——解三角形',
    param: { name: 'tri', label: '解三角站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['知道什么能用正弦定理？', '知道什么用余弦定理？', '实际测量怎样布点？'],
    views: [
      { when: 1, title: '正弦定理', subtitle: '边角比例', color: 'blue', emoji: '⚖️', blocks: [
        { kind: 'info', icon: '📜', title: '定理内容', text: 'a/sinA = b/sinB = c/sinC = 2R（外接圆直径）——三边与对角的正弦成同一比例：边角可以互相换算，知三求三' },
        { kind: 'compare', title: '适用两种情形', items: [
          { label: '两角一边', value: 'ASA / AAS——第三角先内角和求出·再用比例求边：如测河对岸两点距离' },
          { label: '两边一对角', value: 'SSA——小心！可能出现两解（三角形的形状不唯一）： SSA 是唯一「会骗人」的情形，高考常设坑' },
        ] },
        { kind: 'highlight', text: '正弦定理管「两角一边」——SSA 要警惕两解' },
      ] },
      { when: 2, title: '余弦定理', subtitle: '二次形式', color: 'green', emoji: '🧮', blocks: [
        { kind: 'info', icon: '📜', title: '定理内容', text: 'a² = b² + c² − 2bc·cosA——勾股定理的推广：角是 90° 时 cosA=0·退化成勾股；角是钝角 cosA<0 时 a² 反而更大（钝角对最长边）：一个公式统一了三角形的「形状信息」' },
        { kind: 'compare', title: '适用两种情形', items: [
          { label: '三边', value: 'SSS——三边都知道·反角：cosA = (b²+c²−a²)/2bc：判断锐钝直角就看分子符号' },
          { label: '两边夹角', value: 'SAS——两边与夹角·第三边直接算：两点间距离公式就是它的坐标版' },
        ] },
        { kind: 'info', icon: '🧭', title: '选定理的口诀', text: '找比例（边对角的比）用正弦·找长度平方差用余弦；看到「两角+一边」→正弦·「两边+夹角」→余弦·最后一条边出来后想求角·回头用余弦：两定理常接力出场' },
        { kind: 'highlight', text: '余弦定理=勾股的推广——钝角时 a² 更大' },
      ] },
      { when: 3, title: '应用', subtitle: '测量现场', color: 'amber', emoji: '🏔️', blocks: [
        { kind: 'steps', title: '经典测河宽', items: ['河这边取 A·B 两点·量出 AB 距离', '在对岸选目标 C·测 ∠A 和 ∠B（测角仪）', 'AAS 型——用正弦定理直接解出 AC 或 BC', '全程不过河·河宽到手：测绘卫星·GPS 基线·天文视差·同源思想' ] },
        { kind: 'info', icon: '🌌', title: '丈量宇宙', text: '地球到月球的距离：从地球两端同时测月球视角·构成巨型三角形——正弦定理算出 38 万公里：天文学家的「测量河宽」·河是真空·三角形的边长以万公里计' },
        { kind: 'info', icon: '🚢', title: '航海与航空', text: '船只知道两个灯塔方位角·解三角形定位——海图上的三角网·航空导航：两定理是「用角度换距离」的通用货币' },
        { kind: 'highlight', text: '测角·连线·解三角形——不过河量河宽·不飞月球量月距' },
      ] },
    ],
    teach: { sections: [
      { title: '正弦定理', body: '【公式】a/sinA=b/sinB=c/sinC=2R。\n【适用】两角一边（ASA/AAS）·两边对角（SSA 两解！）。\n【坑】SSA 形状不唯一。' },
      { title: '余弦定理', body: '【公式】a²=b²+c²−2bc·cosA。\n【适用】三边（SSS）反角·两边夹角（SAS）求边。\n【关系】勾股的推广·钝角时更大。' },
      { title: '应用', body: '【测河】AB+两角→正弦定理。【测月】视差三角。【选定理】比例用正弦·平方差用余弦·常接力。' },
    ], examples: [
      { q: '已知 A=60°，B=45°，a=6 求 b', steps: ['正弦定理：b/sinB=a/sinA', 'b=6×sin45°/sin60°', '=6×(√2/2)/(√3/2)', '=2√6'], tip: '比例一算' },
      { q: '已知 a=3，b=5，C=60° 求 c', steps: ['两边夹角→余弦定理', 'c²=9+25−2×3×5×cos60°', '=34−15=19', 'c=√19'], tip: 'SAS 用余弦' },
    ], mistakes: ['SSA 情形忘记讨论两解（三角形不唯一）', '余弦定理算完忘记开方（c² 不是 c）'] },
    exercises: [
      { q: '正弦定理中三边的比等于？', options: ['sin 对角', '2R 外接圆直径', '半周长', '面积'], answer: 1, explain: '同除得比例' },
      { q: '两边和夹角求第三边用？', options: ['正弦定理', '余弦定理', '勾股定理', '诱导公式'], answer: 1, explain: 'SAS' },
      { q: '「两边及其中一边的对角」（SSA）的隐患是？', options: ['无解', '可能两解', '必是直角', '边太长'], answer: 1, explain: '形状不唯一' },
      { q: '勾股定理是余弦定理在什么情况下的特例？', options: ['角为90°', '边相等', '钝角', '等腰'], answer: 0, explain: 'cos90°=0' },
      { q: '判断三角形锐钝直角可看？', options: ['最大角的余弦符号', '周长', '面积', '外接圆半径'], answer: 0, explain: '分子正负' },
      { q: '测河宽的基本思路是量出一条基线和两个 ___', options: ['角', '水深'], answer: 0, explain: 'AAS 解三角形', type: 'blank', blank: { answerText: '角', bank: ['角', '水深'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 10, id: 'math-116', order: 1075, title: '诱导公式：三角的变形术', emoji: '🌀', textbook: '人教A版数学（必修一）',
    curriculum: { module: '三角函数', points: ['诱导公式族', '记忆口诀', '化简求值'] },
    story: 'sin150° 是多少？sin(−30°) 呢？不用计算器——诱导公式把它们全部「翻译」回 0°~90° 的老朋友。十个公式看起来吓人·其实只有一句口诀。',
    goals: ['掌握诱导公式', '会用口诀化简', '理解对称的本质'],
    aiIntro: '🌀 十个公式一句口诀——诱导公式',
    param: { name: 'id2', label: '诱导站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['sin(−30°) 怎样变？', '对称为什么成立？', '口诀怎样记？'],
    views: [
      { when: 1, title: '对称', subtitle: '公式的本质', color: 'blue', emoji: '🪞', blocks: [
        { kind: 'info', icon: '⭕', title: '单位圆的对称性', text: '三角函数是单位圆上的坐标——圆是完美对称的：关于 x 轴·y 轴·原点·直线 y=x 对称：诱导公式=对称性的代数表达·十个公式其实是「圆很对称」的十句话' },
        { kind: 'compare', title: '四组基本变形', items: [
          { label: '−α（关于x轴）', value: 'sin(−α)=−sinα·cos(−α)=cosα——偶余奇正' },
          { label: '180°±α（原点）', value: 'sin(180°+α)=−sinα·cos(180°+α)=−cosα——都变号' },
          { label: '90°−α（y=x对称）', value: 'sin(90°−α)=cosα——函数「互换了名字」' },
        ] },
        { kind: 'highlight', text: '诱导公式=单位圆的对称性——十句话讲一件事' },
      ] },
      { when: 2, title: '口诀', subtitle: '奇变偶不变', color: 'green', emoji: '🔑', blocks: [
        { kind: 'steps', title: '一句口诀走天下', items: ['「奇变偶不变·符号看象限」', '奇偶：90° 的奇数倍→函数名变（sin⇄cos）；偶数倍→函数名不变', '符号：把 α 当锐角·看原角落在第几象限·原函数在该象限的正负就是结果的正负', '例：sin(90°+α)——90° 奇数倍→变 cos；90°+α 在第二象限 sin 为正→得 cosα' ] },
        { kind: 'info', icon: '🧪', title: '验证一个', text: 'sin150°：150°=180°−30°（180° 偶数倍→不变 sin）·180°−30° 在第二象限·sin 为正→sin30°=½：口诀一遍过·计算器验证吻合——记忆是有数学保证的' },
        { kind: 'highlight', text: '奇变偶不变·符号看象限——把 α 看成锐角' },
      ] },
      { when: 3, title: '化简', subtitle: '实战三步', color: 'amber', emoji: '⚔️', blocks: [
        { kind: 'steps', title: '化简求值流程', items: ['负角先正：sin(−α)=−sinα（把负号吃掉）', '大角化小：反复用诱导公式·把角度拉回 0°~90°（像长除法一样「剥」）', '特殊角查表：30/45/60 的值·收尾求值' ] },
        { kind: 'info', icon: '🎯', title: '考试中的角色', text: '诱导公式很少单独出大题——它是三角化简·求值·证明的「中间工序」（像乘法口诀）：高考三角大题第一问基本都要过它：熟到条件反射' },
        { kind: 'info', icon: '🧠', title: '物理里的回响', text: '三角函数描述振动与波——sin(180°+α)=−sinα 意味着「转半圈波形反相」：音响的相位·交流电的正负半周：对称公式在物理里是「反相」·同源同构' },
        { kind: 'highlight', text: '负角先正·大角化小·查表收尾——三层剥洋葱' },
      ] },
    ],
    teach: { sections: [
      { title: '对称本质', body: '【−α】偶余奇正。【180°±α】全变号。\n【90°−α】函数名互换。\n【本质】单位圆的对称性。' },
      { title: '口诀', body: '【奇偶】90°奇倍变名·偶倍不变。\n【符号】α当锐角·看象限定正负。\n【验证】sin150°=½。' },
      { title: '化简流程', body: '【一】负角先正。【二】大角化小到0~90°。\n【三】特殊角查表收尾。\n【物理】反相=对称公式。' },
    ], examples: [
      { q: '化简 sin(−60°)', steps: ['负角先正：−sin60°', '查表：−√3/2', '完成', '验证：第四象限正弦为负'], tip: '负号先吃' },
      { q: '求 cos210°', steps: ['210°=180°+30°', '偶倍不变·符号看象限', '第三象限 cos 为负', '=−cos30°=−√3/2'], tip: '口诀两步' },
    ], mistakes: ['符号看象限时把新函数当原函数看象限（应看原函数）', '90° 的奇数倍忘记变函数名（sin 没换成 cos）'] },
    exercises: [
      { q: 'sin(−α) 等于？', options: ['sinα', '−sinα', 'cosα', '−cosα'], answer: 1, explain: '偶余奇正' },
      { q: 'sin(90°−α) 等于？', options: ['−sinα', 'cosα', 'sinα', '−cosα'], answer: 1, explain: '函数名互换' },
      { q: '「奇变偶不变」中的奇偶指？', options: ['α 的奇偶', '90° 倍数的奇偶', '系数', '次数'], answer: 1, explain: 'π/2 的倍数' },
      { q: 'cos150° 等于？', options: ['√3/2', '−√3/2', '½', '−½'], answer: 1, explain: '第二象限余弦负' },
      { q: '诱导公式的本质是单位圆的？', options: ['周长', '面积', '对称性', '切线'], answer: 2, explain: '十句话一件事' },
      { q: '化简口诀：奇变偶不变·符号看 ___', options: ['象限', '钟表'], answer: 0, explain: 'α 当锐角', type: 'blank', blank: { answerText: '象限', bank: ['象限', '钟表'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 10, id: 'math-117', order: 1076, title: '互斥与对立：事件的关系', emoji: '🪙', textbook: '人教A版数学（必修二）',
    curriculum: { module: '概率', points: ['互斥事件', '对立事件', '加法公式'] },
    story: '掷一枚硬币：正面和反面不会同时出现——它们是「互斥」的；而且必有一面出现——它们还是「对立」的。理清事件之间的关系·概率计算就有了地基。',
    goals: ['理解互斥与对立', '区分两个概念', '会用加法公式'],
    aiIntro: '🪙 不会同时发生——互斥与对立',
    param: { name: 'me', label: '事件站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['互斥和对立差在哪？', '加法公式何时成立？', '「至少一个」怎么算？'],
    views: [
      { when: 1, title: '互斥', subtitle: '不同时发生', color: 'blue', emoji: '🚫', blocks: [
        { kind: 'info', icon: '📖', title: '互斥事件', text: '不可能同时发生的两个事件——掷骰子「掷出1点」和「掷出2点」互斥：一次只能发生其一。韦恩图上两个圈不相交' },
        { kind: 'info', icon: '⚖️', title: '互斥加法公式', text: 'A、B 互斥 ⇒ P(A∪B) = P(A) + P(B)——概率直接相加：掷出 1 或 2 的概率=1/6+1/6=1/3：互斥时「或」就是加' },
        { kind: 'info', icon: '⚠️', title: '不互斥的陷阱', text: '「掷出偶数」和「掷出2」——能同时发生（2 就是偶数）·不互斥！直接相加会重复计算 2：一般加法公式 P(A∪B)=P(A)+P(B)−P(AB)·减去交叠部分' },
        { kind: 'highlight', text: '互斥才能直接相加——不互斥要减掉交集' },
      ] },
      { when: 2, title: '对立', subtitle: '必居其一', color: 'green', emoji: '🔁', blocks: [
        { kind: 'compare', title: '对立 vs 互斥', items: [
          { label: '对立事件', value: '不能同时发生 + 必有一个发生——正面与反面·「活着」与「死了」·考试及格与不及格：P(Ā)=1−P(A)' },
          { label: '关系辨析', value: '对立一定互斥·互斥不一定对立（掷骰子掷出 1 和 2 互斥·但还可能有 3~6·并非必居其一）：对立是互斥的加强版' },
          { label: '判断标准', value: '问一句「除了 A 和 B 还有别的可能吗」——有→只是互斥·没有→对立：一句话判两类' },
        ] },
        { kind: 'info', icon: '🎯', title: '对立的妙用：正难则反', text: '「至少一个发生」正面要算许多种——算反面「全都不发生」再 1 减·常常一步到位：P(至少一个)=1−P(一个都没有)：概率大题的常用杀招' },
        { kind: 'highlight', text: '对立=互斥+必居其一——正难则反用 1−' },
      ] },
      { when: 3, title: '实战', subtitle: '考试场景', color: 'amber', emoji: '⚔️', blocks: [
        { kind: 'steps', title: '两类经典题', items: ['「至多 n 个」——用对立面「至少 n+1 个」反着算：如 3 发射击至多 1 中 = 1 − P(至少 2 中)', '「至少一个」——反面是「一个也没有」：3 台独立机器同时故障概率 0.1³·至少一台正常 = 1−0.1³=0.999', '先判关系再用公式——互斥加·一般减·对立 1 减：三件武器按关系选' ] },
        { kind: 'info', icon: '🧠', title: '韦恩图是翻译官', text: '把文字事件画成圆圈图——互斥（分离）·交叠（相交）·对立（互补两半）：图一画·公式自己浮现：抽象概率题先画图再动笔' },
        { kind: 'info', icon: '🏥', title: '生活的概率思维', text: '「检测呈阳性」和「真患病」不互斥也不相等（条件概率的伏笔）；「两项检查至少一项异常」用 1− 都正常：医院报告·风险清单·都值得用今天的眼光重读' },
        { kind: 'highlight', text: '互斥加·一般减·对立 1 减——先画图再选武器' },
      ] },
    ],
    teach: { sections: [
      { title: '互斥', body: '【定义】不同时发生（韦恩图分离）。\n【加法】互斥直接相加。\n【陷阱】不互斥需减交集 P(AB)。' },
      { title: '对立', body: '【定义】互斥+必居其一。\n【公式】P(Ā)=1−P(A)。\n【判断】除二者外无其他可能。\n【妙用】正难则反·算反面。' },
      { title: '实战', body: '【至多】1−至少。【至少】1−都没有。\n【流程】判关系→选公式→画图验证。' },
    ], examples: [
      { q: '掷骰子求掷出 1 或 3 的概率', steps: ['判断：1 和 3 互斥', '加法公式', '1/6 + 1/6', '= 1/3'], tip: '互斥直接加' },
      { q: '投篮命中率0.8·投三次至少一中', steps: ['反面：三次全不中 (0.2)³=0.008', '对立公式', '1 − 0.008', '= 0.992'], tip: '正难则反' },
    ], mistakes: ['不互斥的事件直接概率相加（重复计算交集）', '把「互斥」当成「独立」（完全不同的概念）'] },
    exercises: [
      { q: '互斥事件的含义是？', options: ['概率相等', '不同时发生', '相互影响', '必然发生'], answer: 1, explain: '韦恩图分离' },
      { q: '对立事件与互斥的关系是？', options: ['无关', '对立一定互斥', '互斥一定对立', '互相矛盾'], answer: 1, explain: '对立是加强版' },
      { q: '掷出「偶数」与「掷出 2」是否互斥？', options: ['互斥', '对立', '不互斥（能同时发生）', '相等'], answer: 2, explain: '2 就是偶数' },
      { q: 'P(Ā) 等于？', options: ['P(A)²', '1 − P(A)', 'P(A) − 1', '0'], answer: 1, explain: '对立公式' },
      { q: '「至少一台正常」的快捷算法是？', options: ['直接加', '1 − 全都不正常', '求平均', '翻倍'], answer: 1, explain: '正难则反' },
      { q: '不互斥的加法要减去 P( ___ )', options: ['AB', 'A'], answer: 0, explain: '交集', type: 'blank', blank: { answerText: 'AB', bank: ['AB', 'A'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 10, id: 'math-118', order: 1077, title: '独立事件：互不影响', emoji: '🎲', textbook: '人教A版数学（必修二）',
    curriculum: { module: '概率', points: ['独立性定义', '乘法公式', '独立重复试验'] },
    story: '掷两次硬币·第二次的结果会受第一次影响吗？不会——这就是「独立」。独立性让概率可以相乘：从连续投篮到彩票中奖·大量现实问题靠它建模。',
    goals: ['理解独立性的定义', '掌握乘法公式', '认识独立重复试验'],
    aiIntro: '🎲 互不干涉——独立事件',
    param: { name: 'in', label: '独立站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['独立和互斥差在哪？', '概率何时相乘？', '连续失败概率多大？'],
    views: [
      { when: 1, title: '定义', subtitle: '彼此无感', color: 'blue', emoji: '🔀', blocks: [
        { kind: 'info', icon: '📖', title: '独立事件', text: 'A 的发生与否不影响 B 发生的概率——P(B|A) = P(B)：定义式 P(AB) = P(A)·P(B)（同时发生的概率=概率之积）：「一个已经发生」不改变「另一个的剧本」' },
        { kind: 'compare', title: '独立 ≠ 互斥', items: [
          { label: '互斥', value: '一个发生·另一个必然不发生——影响强烈（P(AB)=0）：掷骰子的 1 和 2' },
          { label: '独立', value: '一个发生·另一个概率纹丝不动（P(AB)=P(A)P(B)）：两次射击' },
          { label: '判断', value: '互斥的 P(AB)=0·若都非零则不可能独立——两个都为正概率的事件·互斥与独立不能兼得：新手最容易混的一对概念' },
        ] },
        { kind: 'highlight', text: '互斥=强烈影响·独立=毫无影响——别混' },
      ] },
      { when: 2, title: '乘法', subtitle: '概率相乘', color: 'green', emoji: '✖️', blocks: [
        { kind: 'steps', title: '乘法公式的用法', items: ['判独立：物理上是否「各掷各的」（新样本·重置·不同对象）', '同时发生：P(AB)=P(A)·P(B)——连中两次 = 0.8 × 0.8 = 0.64', '依次发生：P(A)·P(B̄) 等组合·逐段相乘（如「第一次中第二次不中」=0.8×0.2）' ] },
        { kind: 'info', icon: '🎰', title: '赌徒谬误', text: '连开 10 把「大」·下一把「该出小了」？——独立！轮盘没有记忆·概率永远是 18/37：直觉的「平衡补偿」不存在：独立事件的反面教材·赌场最爱的错觉' },
        { kind: 'info', icon: '📉', title: '小概率连乘', text: '一个零件合格率 99%·十个零件全合格 = 0.99¹⁰ ≈ 0.904——「个个都好」反而只有九成：质量管理的数学：串联系统越拉越长·可靠度越乘越低' },
        { kind: 'highlight', text: '独立则相乘——0.99 连乘十次只剩九成' },
      ] },
      { when: 3, title: '重复', subtitle: 'n 次独立试验', color: 'amber', emoji: '🏹', blocks: [
        { kind: 'info', icon: '🎯', title: 'n 重伯努利试验', text: '同一试验独立重复 n 次·每次成功概率 p——「恰好 k 次成功」：C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ（选哪 k 次成功 × 成功的 × 失败的）：二项分布的雏形' },
        { kind: 'steps', title: '实战一例', items: ['投篮命中率 0.7·投 4 次恰好 2 中', '选位置：C(4,2)=6 种', '成功²：0.7²=0.49', '失败²：0.3²=0.09 → 6×0.49×0.09≈0.264' ] },
        { kind: 'info', icon: '🧬', title: '科学采样', text: '临床试验分组·质检抽检·A/B 测试——都默认「独立同分布」才能统计推断：独立性是现代统计学得以站住的第一根柱子' },
        { kind: 'highlight', text: 'C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ——恰好 k 次成功的公式' },
      ] },
    ],
    teach: { sections: [
      { title: '独立性', body: '【定义】P(AB)=P(A)P(B)·互不影响。\n【对比】互斥=强影响（P(AB)=0）。\n【警告】正概率事件互斥与独立不可兼得。' },
      { title: '乘法公式', body: '【同时】P(A)P(B)。【依次】逐段相乘。\n【谬误】赌徒谬误——独立无记忆。\n【串联】0.99¹⁰≈0.904。' },
      { title: '独立重复', body: '【模型】n 重伯努利试验。\n【公式】C(n,k)pᵏ(1−p)ⁿ⁻ᵏ。\n【应用】投篮·质检·AB测试。' },
    ], examples: [
      { q: '两射手各 0.6·同时命中概率', steps: ['两人射击独立', '乘法公式', '0.6 × 0.6', '= 0.36'], tip: '独立相乘' },
      { q: '4 次独立试验恰好 3 次成功 p=0.5', steps: ['C(4,3)=4', '0.5³×0.5=0.0625', '4×0.0625', '=0.25'], tip: '选位×概率' },
    ], mistakes: ['把互斥当成独立（概念混淆）', '相信「该轮到了」的赌徒谬误（独立事件无记忆）'] },
    exercises: [
      { q: '独立事件的定义式是？', options: ['P(AB)=0', 'P(AB)=P(A)+P(B)', 'P(AB)=P(A)P(B)', 'P(A)=P(B)'], answer: 2, explain: '概率之积' },
      { q: '互斥与独立能否同时成立（均非零概率）？', options: ['能', '不能', '看情况', '总可以'], answer: 1, explain: '互斥即强影响' },
      { q: '两台独立设备故障率 0.1·同时故障的概率？', options: ['0.1', '0.01', '0.2', '0.9'], answer: 1, explain: '0.1×0.1' },
      { q: '连开 10 次大后第 11 次开大的概率？', options: ['变大', '变小', '不变', '为一半'], answer: 2, explain: '独立无记忆' },
      { q: '10 个 99% 合格零件全合格的概率约？', options: ['99%', '90.4%', '100%', '50%'], answer: 1, explain: '0.99¹⁰' },
      { q: 'n 重伯努利「恰好 k 次」的选位符号是 C( ___ )', options: ['n,k', 'k,n'], answer: 0, explain: '组合数', type: 'blank', blank: { answerText: 'n,k', bank: ['n,k', 'k,n'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 11, id: 'math-119', order: 1078, title: '期望：概率的加权平均', emoji: '🎯', textbook: '人教A版数学（选择性必修三）',
    curriculum: { module: '随机变量', points: ['期望的定义', '期望的线性性', '决策应用'] },
    story: '彩票摊主为什么稳赚不赔？保险公司为什么敢承诺理赔？他们都在赌一个数——期望：长期平均的结果。单次事件靠运气·重复成千上万次·期望说了算。',
    goals: ['理解期望的定义', '掌握期望的线性性', '用期望做决策'],
    aiIntro: '🎯 长期平均的宿命——期望',
    param: { name: 'ex2', label: '期望站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['期望怎么算？', '它和平均数什么关系？', '怎样用期望做选择？'],
    views: [
      { when: 1, title: '定义', subtitle: '加权平均', color: 'blue', emoji: '⚖️', blocks: [
        { kind: 'info', icon: '📖', title: '离散型随机变量的期望', text: 'E(X) = x₁p₁ + x₂p₂ + …（每个取值 × 概率·全部加起来）：本质是「以概率为权重的平均数」——掷骰子 E(X) = 1×⅙+2×⅙+…+6×⅙ = 3.5（3.5 点不存在·但长期平均就是它）' },
        { kind: 'info', icon: '🎰', title: '大数定律', text: '单次结果随机·重复次数足够多·平均值无限逼近期望——骰子掷 100 万次·平均点数≈3.500：期望不是「某一次的结果」·是「命运的引力中心」' },
        { kind: 'highlight', text: 'E(X)=Σxᵢpᵢ——以概率为权的平均·命运引力中心' },
      ] },
      { when: 2, title: '性质', subtitle: '线性之美', color: 'green', emoji: '➕', blocks: [
        { kind: 'compare', title: '两条黄金性质', items: [
          { label: '线性', value: 'E(aX+b) = aE(X)+b——平移伸缩照搬；E(X+Y)=E(X)+E(Y) 恒成立（不需要独立！）：加法自由·概率论最优雅的性质' },
          { label: '不独立也能加', value: '「两人的总成绩期望」=各自期望相加——不管成绩是否相关：这与方差（需独立才能加）形成对比·常考辨析' },
        ] },
        { kind: 'info', icon: '🎫', title: '彩票的账', text: '双色球单注期望≈2 元×50%=1 元左右（返还率约一半）——花 2 元买期望 1 元的东西：长期买·每注亏 1 元。摊主稳赚的数学本质：期望差·大数定律兑现' },
        { kind: 'highlight', text: '期望线性可加·不需要独立——彩票期望低于票价' },
      ] },
      { when: 3, title: '决策', subtitle: '理性选择', color: 'amber', emoji: '🧭', blocks: [
        { kind: 'steps', title: '期望决策三步', items: ['列方案：每个选择的可能结果与概率', '算期望：每个方案的 E(X)', '比大小：选期望最高的（风险相同的前提下）——期望是「重复博弈」中的最优策略标尺' ] },
        { kind: 'info', icon: '🏥', title: '现实中的期望思维', text: '疫苗：副作用概率极低×危害小 vs 感染概率×危害大——公共卫生决策就是期望比较；保险：保费=理赔期望+运营成本——你「亏」的部分买的是确定性（风险厌恶·期望不是唯一标准）' },
        { kind: 'info', icon: '⚠️', title: '期望的边界', text: '期望只描述长期平均——单次重大风险（破产·致命）不能只看期望（「期望收益为正但可能一次归零」的赌局别碰）：理性人既算期望·也看方差（下轮主角）' },
        { kind: 'highlight', text: '列方案→算期望→比大小——重复博弈的最优标尺' },
      ] },
    ],
    teach: { sections: [
      { title: '定义', body: '【公式】E(X)=Σxᵢpᵢ·概率加权平均。\n【例】骰子期望 3.5。\n【大数定律】重复多→平均→期望。' },
      { title: '线性性', body: '【公式】E(aX+b)=aE(X)+b。\n【相加】E(X+Y)=E(X)+E(Y) 恒成立（无需独立）。\n【彩票】返还率≈一半·长期必亏。' },
      { title: '决策', body: '【三步】列方案·算期望·比大小。\n【应用】疫苗·保险·商业。\n【边界】单次重大风险要连方差一起看。' },
    ], examples: [
      { q: '射击 10 环概率 0.2·9 环 0.5·8 环 0.3 求期望', steps: ['E=10×0.2+9×0.5+8×0.3', '=2+4.5+2.4', '=8.9', '长期平均 8.9 环'], tip: '加权求和' },
      { q: '游戏抽卡期望计算', steps: ['列概率分布', '求各档奖励×概率之和', '对比投入成本', '期望低于成本则长期亏'], tip: '算完再氪' },
    ], mistakes: ['把「最可能的结果」当成期望（期望是加权平均·不是众数）', '认为期望为正就可以无限押注（单次毁灭风险要另算方差）'] },
    exercises: [
      { q: '掷骰子点数的期望是？', options: ['3.5', '3', '4', '6'], answer: 0, explain: '概率加权平均' },
      { q: '期望的本质是？', options: ['最大值', '以概率为权的平均', '最可能值', '总和'], answer: 1, explain: '加权平均' },
      { q: 'E(X+Y)=E(X)+E(Y) 成立需要独立吗？', options: ['必须独立', '互斥才行', '恒成立', '看方差'], answer: 2, explain: '线性性' },
      { q: '彩票长期购买的数学结局是？', options: ['必赚', '期望为负·长期亏', '期望为零', '看运气'], answer: 1, explain: '返还率不到一' },
      { q: '大数定律说的是？', options: ['单次随机', '重复多次平均趋近期望', '期望会变', '概率相乘'], answer: 1, explain: '命运引力中心' },
      { q: '期望决策前先列出各方案的 ___', options: ['结果与概率', '口号'], answer: 0, explain: '三步第一步', type: 'blank', blank: { answerText: '结果与概率', bank: ['结果与概率', '口号'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 11, id: 'math-120', order: 1079, title: '平面向量与数量积', emoji: '➡️', textbook: '人教A版数学（必修二）',
    curriculum: { module: '平面向量', points: ['向量的概念与运算', '数量积', '向量的应用'] },
    story: '「向东北走 5 公里」——既有大小又有方向的量就是向量。物理学把它当语言（力·速度·加速度），数学把它当工具（数形结合的桥）：数量积一算·角度和长度全出来。',
    goals: ['掌握向量的线性运算', '掌握数量积', '用向量解几何问题'],
    aiIntro: '➡️ 有方向的量——平面向量',
    param: { name: 'vc', label: '向量站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['向量怎样加减？', '数量积算出什么？', '怎样证明垂直？'],
    views: [
      { when: 1, title: '运算', subtitle: '几何与坐标', color: 'blue', emoji: '🧭', blocks: [
        { kind: 'compare', title: '两类运算', items: [
          { label: '加减（三角形/平行四边形法则）', value: '位移的合成——a+b 首尾相接：A→B→C 等于 A→C；坐标版：(x₁,y₁)+(x₂,y₂)=(x₁+x₂, y₁+y₂)' },
          { label: '数乘', value: 'λa：伸缩（|λ|>1 放大）+ 反向（λ<0 掉头）：共线的判定 λa∥b ⇔ x₁y₂−x₂y₁=0' },
        ] },
        { kind: 'info', icon: '⚖️', title: '向量是「自动记账」', text: '物理里的合力·位移合成·速度分解——全部是向量加法：既管大小又管方向·一笔算清两个信息：标量要算两遍的事·向量一遍搞定' },
        { kind: 'highlight', text: '加减=位移合成·数乘=伸缩换向——共线看 x₁y₂−x₂y₁' },
      ] },
      { when: 2, title: '数量积', subtitle: '角度探测器', color: 'green', emoji: '📐', blocks: [
        { kind: 'info', icon: '📜', title: '定义与坐标式', text: 'a·b = |a||b|cosθ——一个数（所以叫「数量」积）：坐标版 a·b = x₁x₂ + y₁y₂：长度和角度的信息压缩进一个乘法' },
        { kind: 'compare', title: '三大应用', items: [
          { label: '求角', value: 'cosθ = a·b / (|a||b|)——夹角一步到位' },
          { label: '证垂直', value: 'a⊥b ⇔ a·b = 0 ⇔ x₁x₂+y₁y₂=0：垂直判定变成一次乘加·快到飞起' },
          { label: '求模长', value: '|a|² = a·a = x²+y²——模长也是数量积的特例' },
        ] },
        { kind: 'info', icon: '💡', title: '物理原型：功', text: 'W = F·s·cosθ——力做的功就是力向量与位移向量的数量积：数学公式直接来自物理：数量积是「有效分量」的度量（力只有沿位移方向的分量才做功）' },
        { kind: 'highlight', text: 'a·b=0 即垂直——角度与长度一积全知' },
      ] },
      { when: 3, title: '应用', subtitle: '数形之桥', color: 'violet', emoji: '🌉', blocks: [
        { kind: 'steps', title: '向量法解几何', items: ['设坐标：把几何图形放进坐标系（选直角·让顶点坐标整齐）', '向量表示：边·线段全部写成向量坐标', '翻译条件：垂直→数量积为 0·共线→交叉相乘相等·等长→模相等', '代数运算出结论——几何证明变成计算：会算就会证' ] },
        { kind: 'info', icon: '🚀', title: '为什么重要', text: '向量是「代数与几何的翻译官」——解析几何·立体几何（math-107 空间向量）·物理·计算机图形学（游戏里每个物体的朝向速度都是向量）：现代科学的地基语言' },
        { kind: 'info', icon: '🎮', title: '游戏里的向量', text: '角色移动方向·子弹轨迹·碰撞检测·视角朝向——游戏引擎每帧做百万次向量运算：你玩过的每一款 3D 游戏·背后都是本节课的公式在跑' },
        { kind: 'highlight', text: '设坐标→向量表示→翻译条件→计算——会算就会证' },
      ] },
    ],
    teach: { sections: [
      { title: '线性运算', body: '【加】三角形法则·坐标相加。【数乘】伸缩反向。\n【共线】x₁y₂−x₂y₁=0。\n【原型】合力·位移合成。' },
      { title: '数量积', body: '【定义】a·b=|a||b|cosθ=x₁x₂+y₁y₂。\n【求角】除以模之积。【垂直】数量积=0。\n【模】|a|²=a·a。【物理】功。' },
      { title: '向量法', body: '【四步】设坐标→表示→翻译（垂直/共线/等长）→计算。\n【地位】代数几何翻译官·游戏引擎在跑。' },
    ], examples: [
      { q: 'a=(1,2)，b=(3,−1) 求 a·b', steps: ['坐标乘加', '1×3+2×(−1)', '=3−2', '=1'], tip: 'x·x+y·y' },
      { q: '证明 A(0,0) B(2,1) C(4,−3) 中 ∠A 是直角', steps: ['AB=(2,1)·AC=(4,−3)', 'AB·AC=8−3=5≠0', '咦·不是直角', '换成 AB·BC：2×2+1×(−4)=0 √'], tip: '换对向量再验' },
    ], mistakes: ['数量积忘了除以模积求角（a·b 不是 cosθ 本身）', '把向量加法算成模长相加（|a+b|≠|a|+|b| 除非同向）'] },
    exercises: [
      { q: '向量 a=(1,3)，b=(2,−1)，a·b=？', options: ['5', '−1', '7', '2'], answer: 1, explain: '2−3' },
      { q: 'a⊥b 等价于？', options: ['a·b=0', 'a·b=1', '|a|=|b|', 'a=−b'], answer: 0, explain: '垂直判定' },
      { q: '向量加法的几何法则是？', options: ['长度相加', '首尾相接', '角度相加', '任意组合'], answer: 1, explain: '三角形法则' },
      { q: '物理中数量积的原型是？', options: ['功', '速度', '质量', '温度'], answer: 0, explain: 'W=F·s·cosθ 有效分量' },
      { q: '共线向量的坐标条件是？', options: ['x₁y₂−x₂y₁=0', 'x₁+x₂=0', 'y₁=y₂', '模相等'], answer: 0, explain: '交叉相乘' },
      { q: 'a·b=0 ⇔ a ___ b', options: ['⊥', '∥'], answer: 0, explain: '垂直即零积', type: 'blank', blank: { answerText: '⊥', bank: ['⊥', '∥'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id + ' order=' + l.order).join(', '));
