import fs from 'node:fs';
import path from 'node:path';

// 第 225 轮：小学段收尾——道法/地理/信科/英语/心理 各 +2（小学全线 ≥17）
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
  // ===== 道德与法治 =====
  L({
    area: '道德与法治', band: 'primary', grade: 4, id: 'eth-59', order: 1151, title: '拒绝欺凌：勇敢说不', emoji: '🛡️', textbook: '道德与法治（统编版四年级）',
    curriculum: { module: '安全与健康', points: ['什么是欺凌', '三不原则', '求助不丢人'] },
    story: '被起难听的外号·被故意撞一下·被一群人围着笑——这些不是「开玩笑」，是欺凌。今天学会三招护身术：不做沉默的小羊，也不做旁观的看客。',
    goals: ['分清玩闹和欺凌', '掌握三不原则', '敢于求助'],
    aiIntro: '🛡️ 不做沉默的小羊——拒绝校园欺凌',
    param: { name: 'ql1', label: '护身站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['玩笑和欺凌差在哪？', '被欺负了第一句话说什么？', '看到别人被欺负怎么办？',
    ],
    views: [
      { when: 1, title: '认清欺凌', subtitle: '不是开玩笑', color: 'blue', emoji: '🔍', blocks: [
        { kind: 'info', icon: '⚖️', title: '一条分界线', text: '玩笑：双方都笑·随时能停——像挠痒痒；欺凌：一方难受·反复发生·躲不开——像被按着挠：关键看「你想不想停」——你说停对方还继续，就越界了' },
        { kind: 'compare', title: '欺凌的三张脸', items: [
          { label: '身体欺凌', value: '打·推·撞·抢东西——最容易被看见的一张脸' },
          { label: '语言欺凌', value: '起外号·嘲笑·当众羞辱——看不见伤口·疼得不轻' },
          { label: '关系欺凌', value: '拉帮结派孤立人·「别跟他玩」——最隐蔽·最伤人' },
        ] },
        { kind: 'highlight', text: '一方难受+反复发生+躲不开——越线就是欺凌' },
      ] },
      { when: 2, title: '三不原则', subtitle: '护身三招', color: 'amber', emoji: '🥋', blocks: [
        { kind: 'info', icon: '1️⃣', title: '不做受害者', text: '眼神坚定·声音洪亮地说：「你不可以这样对我！请停下！」——欺凌者最爱挑「不出声」的人：说不出口就先练十遍·对着镜子练：气势不是打架·是态度' },
        { kind: 'info', icon: '2️⃣', title: '不做欺凌者', text: '外号再「好玩」也不起·「大家都笑」也不跟——你笑一声·被笑的人疼一分：不围观不起哄——你的笑声是欺凌的燃料·不添柴火自然灭' },
        { kind: 'info', icon: '3️⃣', title: '不做旁观者', text: '看到欺凌：不喊加油不拍视频·悄悄告诉老师（不是打小报告·是救人）：勇敢的话可以当场说一句「别闹了·走吧」拉走同学——旁观者一开口·欺凌就泄气' },
        { kind: 'highlight', text: '不做受害者·不做欺凌者·不做旁观者' },
      ] },
      { when: 3, title: '求助路线', subtitle: '说出来的力量', color: 'green', emoji: '🆘', blocks: [
        { kind: 'info', icon: '🗣️', title: '求助四步', text: '①第一时间告诉老师或爸妈（说清：谁·什么时候·发生了什么）；②保留证据：伤痕拍照·聊天记录截图；③上下学结伴走·避开没人的角落；④情况严重时拨打 12355 青少年服务台——每一步都是正当防卫' },
        { kind: 'info', icon: '💪', title: '求助不丢人', text: '有人怕「告老师」被笑话——恰恰相反：敢说出来的人最勇敢·瞒着忍着才会让欺凌变大：大人介入后·欺凌者反而收手——因为欺凌最怕见光' },
        { kind: 'highlight', text: '告诉大人不是打小报告——是给自己撑腰' },
      ] },
    ],
    teach: { sections: [
      { title: '什么是欺凌', body: '【分界】一方难受·反复发生·躲不开。\n【三张脸】身体·语言·关系。\n【判断】你说停对方还继续=越线。' },
      { title: '三不原则', body: '【受害者】坚定说不·练出气势。\n【欺凌者】不起哄不围观。\n【旁观者】悄悄报告·敢拉人。' },
      { title: '求助路线', body: '【四步】告诉大人·留证据·结伴·12355。\n【心态】求助=勇敢·忍让=纵容。\n【关键】欺凌怕见光。' },
    ], examples: [
      { q: '同学总给你起难听外号', steps: ['坚定说：请停下', '对方还继续就告诉老师', '把起外号的记录留下来', '上下学和好朋友结伴'], tip: '说不+报告' },
      { q: '看到有人被围着起哄', steps: ['不围观不笑', '拉身边同学一起走开', '悄悄告诉老师', '事后安慰被欺负的同学'], tip: '不添柴火' },
    ], mistakes: ['觉得告诉老师是打小报告（那是救人·是勇敢）', '以为忍一忍就过去了（欺凌会变本加厉·要早说）'] },
    exercises: [
      { q: '欺凌和玩笑的分界是？', options: ['一方难受还停不了', '声音大小', '人数多少', '地点在哪'], answer: 0, explain: '看想不想停' },
      { q: '起外号嘲笑属于？', options: ['身体欺凌', '语言欺凌', '玩笑', '帮助'], answer: 1, explain: '看不见的伤' },
      { q: '被欺凌第一步应该？', options: ['打回去', '坚定说请停下', '忍着不说', '转学'], answer: 1, explain: '先亮态度' },
      { q: '看到别人被欺凌，对的做法是？', options: ['拍视频发群里', '围观喊加油', '悄悄告诉老师', '装没看见'], answer: 2, explain: '报告是救人' },
      { q: '被欺凌后正确的做法是？', options: ['告诉大人并留证据', '找人打回去', '忍着不说', '再也不上学'], answer: 0, explain: '说不+求助' },
      { q: '欺凌最怕的是见到 ___', options: ['光', '糖'], answer: 0, explain: '说出来就好', type: 'blank', blank: { answerText: '光', bank: ['光', '糖'] } },
    ],
  }),
  L({
    area: '道德与法治', band: 'primary', grade: 4, id: 'eth-60', order: 1152, title: '守时小达人：时间的承诺', emoji: '⏰', textbook: '道德与法治（统编版四年级）',
    curriculum: { module: '品德养成', points: ['守时是尊重', '时间小账本', '和拖拉说再见'] },
    story: '约好 3 点到，你 3 点半才来——朋友嘴上说没事，心里已经等出了小情绪。守时不只是看表，是一句无声的承诺：你的时间宝贵，别人的也是。',
    goals: ['理解守时是尊重', '学会管理时间', '告别拖拉磨蹭'],
    aiIntro: '⏰ 说好几点就几点——守时的秘密',
    param: { name: 'sh1', label: '守时站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['等人 30 分钟是什么感受？', '为什么起床总来不及？', '拖拉的时候时间去哪了？'],
    views: [
      { when: 1, title: '守时=尊重', subtitle: '无声的承诺', color: 'blue', emoji: '🤝', blocks: [
        { kind: 'info', icon: '⏳', title: '等的人心里', text: '约好 3 点·你 3 点半到——朋友等的 30 分钟里：看表 8 次·猜「是不是出事了」·有点着急有点生气：迟到的人一句「路上堵」就带过——等待的人却实实在在付了半小时' },
        { kind: 'info', icon: '🏅', title: '守时是名片', text: '面试早到 10 分钟的人·老师眼里「靠谱」；约定从不迟到的人·同学敢把事情托付给他：守时=不用嘴说的自我介绍——比任何形容词都有说服力' },
        { kind: 'highlight', text: '守时=把别人的时间当时间——无声的尊重' },
      ] },
      { when: 2, title: '时间账本', subtitle: '迟到都怪谁', color: 'amber', emoji: '📒', blocks: [
        { kind: 'info', icon: '🔍', title: '倒推法', text: '8:00 上学迟到·别怪闹钟：倒着推——7:50 到校·7:30 出门·7:10 吃早饭·7:00 起床：一切从起床那一刻就定了——迟到的原因在早上 7 点·不在 8 点的校门口' },
        { kind: 'compare', title: '两种人对比', items: [
          { label: '卡点王', value: '算时间只算「路上」：出门才找袜子·书包昨晚没理——每天上演生死时速·还总迟到' },
          { label: '提前量王', value: '所有事+10 分钟缓冲：昨晚理好书包·今早多留 10 分钟——看起来慢悠悠·反而从不迟到' },
        ] },
        { kind: 'highlight', text: '倒推定闹钟·凡事留缓冲' },
      ] },
      { when: 3, title: '告别拖拉', subtitle: '三招治磨蹭', color: 'green', emoji: '🚀', blocks: [
        { kind: 'info', icon: '1️⃣', title: '番茄闹钟', text: '作业设 25 分钟倒计时·铃响前只做作业（喝水上厕所都想·忍到铃响）：时间看得见·拖拉就现形——一晚上能收割好几个「番茄」' },
        { kind: 'info', icon: '2️⃣', title: '先苦后甜', text: '「先做完作业再玩」不是口号是顺序：玩的甜头当奖励——写完的轻松+玩的安心=双倍快乐：先玩后写=玩着惦记·写着犯困' },
        { kind: 'info', icon: '3️⃣', title: '两分钟启动法', text: '再不想做的事·先只做 2 分钟：2 分钟后往往就做下去了——拖拉最怕「开始」：万事开头难·开完头就不难' },
        { kind: 'highlight', text: '倒计时·先苦后甜·2 分钟启动——三招治拖拉' },
      ] },
    ],
    teach: { sections: [
      { title: '守时是尊重', body: '【本质】把别人的时间当时间。\n【名片】守时=靠谱的证明。\n【公式】迟到成本由等的人付。' },
      { title: '时间账本', body: '【倒推】从截止点倒着排时间。\n【缓冲】凡事+10 分钟。\n【关键】迟到定因在出发前。' },
      { title: '治拖拉三招', body: '【番茄】25 分钟只做一件事。\n【顺序】先苦后甜。\n【启动】先做 2 分钟。' },
    ], examples: [
      { q: '明天 8 点到校不迟到', steps: ['倒推：7:30 出门', '今晚理好书包和衣服', '闹钟定 7:00 多留 10 分钟', '起床先做最难的一步'], tip: '倒推+缓冲' },
      { q: '写作业总磨蹭', steps: ['倒计时 25 分钟', '桌面只留作业', '铃响前不动别的', '完成后痛快玩'], tip: '番茄一开动' },
    ], mistakes: ['把迟到全怪给闹钟和堵车（原因在出发前的准备）', '觉得偶尔迟到没关系（每次都消耗别人的信任）'] },
    exercises: [
      { q: '守时的本质是？', options: ['跑得快', '尊重别人的时间', '表很贵', '起得早'], answer: 1, explain: '无声的承诺' },
      { q: '避免迟到的正确方法是？', options: ['倒推定闹钟留缓冲', '每天踩点出门', '让同学帮瞒着', '迟到就怪堵车'], answer: 0, explain: '倒推+缓冲' },
      { q: '拖拉最好的启动法是？', options: ['先做 2 分钟', '明天再说', '等有心情', '先玩够'], answer: 0, explain: '开头最难' },
      { q: '写作业最高效的顺序是？', options: ['先玩再写', '先写完再玩', '边玩边写', '不写最好'], answer: 1, explain: '先苦后甜' },
      { q: '迟到真正的原因常在？', options: ['校门口堵车', '出发前的准备', '鞋带断了', '天气不好'], answer: 1, explain: '倒推就知道' },
      { q: '守时是一句不用嘴说的 ___', options: ['承诺', '台词'], answer: 0, explain: '行动的语言', type: 'blank', blank: { answerText: '承诺', bank: ['承诺', '台词'] } },
    ],
  }),

  // ===== 地理 =====
  L({
    area: '地理', band: 'primary', grade: 4, id: 'geo-48', order: 1153, title: '河流与湖泊：水的大本营', emoji: '🏞️', textbook: '地理（科普版四年级拓展）',
    curriculum: { module: '水系统', points: ['河流的旅程', '湖泊的形成', '中国的母亲河'] },
    story: '一滴雨落在山上，顺着小沟往下跑——小沟变小溪·小溪变小河·大河奔向大海！陆地上的水都住在哪里？这一课跟着一滴水去旅行。',
    goals: ['了解河流的旅程', '认识湖泊类型', '记住两条母亲河'],
    aiIntro: '🏞️ 跟着一滴水旅行——河流与湖泊',
    param: { name: 'hl1', label: '河流站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['河为什么总往低处流？', '湖是怎么装满水的？', '黄河的水为什么是黄的？'],
    views: [
      { when: 1, title: '河流旅程', subtitle: '从山到海', color: 'blue', emoji: '🏔️', blocks: [
        { kind: 'info', icon: '🏞️', title: '一滴水的三级跳', text: '第一跳·源头：山上雨水或雪水汇成涓涓细流；第二跳·中游：小溪收小河·越汇越宽·冲出平原；第三跳·入海口：大河扑进大海·泥沙堆出三角洲：水永远只往低处走——地图上的蓝线都是这么画出来的' },
        { kind: 'compare', title: '河的两头', items: [
          { label: '上游', value: '山里的年轻河：水流急·河床窄·哗哗响——会切割峡谷·推大石头：性子急的少年' },
          { label: '下游', value: '平原的老年河：水流缓·河面宽·爱拐弯——泥沙沉下来·造就粮田：稳重的老爷爷' },
        ] },
        { kind: 'highlight', text: '源出高山·汇流成河·奔向大海——水只往低处走' },
      ] },
      { when: 2, title: '湖泊秘密', subtitle: '大地的水盆', color: 'amber', emoji: '🌊', blocks: [
        { kind: 'info', icon: '🕳️', title: '湖是怎么来的', text: '①地壳凹下去存水（构造湖·如贝加尔湖）；②火山口积水（火山口湖·如长白山天池）；③河流改道留下的旧河床（牛轭湖）：大地上的「盆」装满了水就叫湖' },
        { kind: 'compare', title: '淡水湖咸水湖', items: [
          { label: '淡水湖', value: '有出口的水盆——水进水出·盐分带走：鄱阳湖·洞庭湖——能喝能浇田·鱼虾的家' },
          { label: '咸水湖', value: '只进不出的死水盆——水蒸发·盐留下·越攒越咸：青海湖——湖里的盐够全世界吃很多年' },
        ] },
        { kind: 'highlight', text: '会换水的湖是甜的·只进不出的湖是咸的' },
      ] },
      { when: 3, title: '母亲河', subtitle: '长江与黄河', color: 'green', emoji: '🇨🇳', blocks: [
        { kind: 'compare', title: '两条母亲河', items: [
          { label: '长江', value: '中国第一长河（6300 公里）：水大能行大船——黄金水道；中上游峡谷（三峡）·下游鱼米之乡' },
          { label: '黄河', value: '中国第二长河（5464 公里）：流过黄土高原带走泥沙——水黄如汤；泥沙造出华北平原——「一碗水半碗沙」' },
        ] },
        { kind: 'info', icon: '🌾', title: '为什么叫母亲河', text: '河边有水有平地——种田方便·建城方便：中华文明就在这两河边长大：城市的选址秘密：有河的地方就有人家' },
        { kind: 'highlight', text: '长江水多能行船·黄河带沙造平原——文明在水边长大' },
      ] },
    ],
    teach: { sections: [
      { title: '河流旅程', body: '【三跳】源头→中游→入海口。\n【性格】上游急切峡谷·下游宽缓拐弯。\n【规律】水只往低处走。' },
      { title: '湖泊', body: '【成因】地壳凹·火山口·旧河床。\n【淡水湖】有出口·盐分走。\n【咸水湖】只进不出·越晒越咸。' },
      { title: '母亲河', body: '【长江】最长·黄金水道。\n【黄河】带泥沙·造平原。\n【原因】有水有平地好安家。' },
    ], examples: [
      { q: '看地图找河', steps: ['找蓝色的弯曲线', '线越来越粗是下游', '最粗的尽头是大海', '细的那头是源头'], tip: '由细到粗入海' },
      { q: '分清淡水湖咸水湖', steps: ['看湖有没有出口', '有出口水会流动', '咸湖只进不出', '青海湖就是咸的'], tip: '看出口' },
    ], mistakes: ['以为所有湖都是淡水湖（只进不出的湖会越来越咸）', '以为黄河天生是黄的（是黄土高原的泥沙染黄的）'] },
    exercises: [
      { q: '河流最终流向？', options: ['高处', '大海', '天上', '地下'], answer: 1, explain: '水往低处走' },
      { q: '上游河流的特点是？', options: ['水流急河床窄', '水面宽流速缓', '又宽又慢', '从不流动'], answer: 0, explain: '少年河' },
      { q: '青海湖是？', options: ['淡水湖', '咸水湖', '人工湖', '火山'], answer: 1, explain: '只进不出' },
      { q: '黄河水黄是因为？', options: ['天生的', '流经黄土高原带泥沙', '被污染了', '有黄金'], answer: 1, explain: '一碗水半碗沙' },
      { q: '中国最长的河是？', options: ['黄河', '长江', '珠江', '淮河'], answer: 1, explain: '6300公里' },
      { q: '有河的地方就容易有人家·因为要水又要 ___', options: ['平地', '高山'], answer: 0, explain: '种田安家', type: 'blank', blank: { answerText: '平地', bank: ['平地', '高山'] } },
    ],
  }),
  L({
    area: '地理', band: 'primary', grade: 4, id: 'geo-49', order: 1154, title: '白天与黑夜：地球转圈圈', emoji: '🌍', textbook: '地理（科普版四年级拓展）',
    curriculum: { module: '地球运动', points: ['自转一圈一天', '昼夜交替', '时差初体验'] },
    story: '太阳从来没有「下班」，是地球自己在转圈！你脚下的地球每小时跑一千多公里，你却感觉不到——这就是为什么有白天和黑夜。这节课我们当一回小小的地球。',
    goals: ['理解地球自转', '明白昼夜交替', '知道时差的存在'],
    aiIntro: '🌍 是你在转不是太阳在跑——白天黑夜',
    param: { name: 'zz1', label: '自转站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['太阳真的会落山吗？', '为什么中午亮半夜黑？', '我们白天时外国是黑夜吗？'],
    views: [
      { when: 1, title: '地球自转', subtitle: '看不见的旋转', color: 'blue', emoji: '🎡', blocks: [
        { kind: 'info', icon: '🔄', title: '一天一圈', text: '地球像陀螺一样不停自转·转一圈正好 24 小时=一天：转动的方向自西向东——太阳因此「东升西落」（其实是我们在转着迎太阳）：坐地日行八万里——你坐着不动·一天已被地球带着跑了四万公里！' },
        { kind: 'info', icon: '🔍', title: '为什么感觉不到', text: '飞机平稳飞行时你感觉不到在跑——地球转得太稳太大·我们跟着一起转·没有参照物：但天空的太阳月亮星辰「移动」就是证据——不是它们动·是我们在转' },
        { kind: 'highlight', text: '地球 24 小时自转一圈——坐地日行八万里' },
      ] },
      { when: 2, title: '昼夜交替', subtitle: '手电筒实验', color: 'amber', emoji: '🔦', blocks: [
        { kind: 'info', icon: '🌗', title: '亮面与暗面', text: '手电筒照地球仪：照到的半球是白天（昼半球）·照不到的是黑夜（夜半球）——昼夜的分界线叫晨昏线：地球一转·你就从亮面转进暗面——日落其实是「你转进了影子」' },
        { kind: 'info', icon: '🌅', title: '一天的过程', text: '早晨：你正转进亮面（日出）；中午：正对太阳·影子最短；傍晚：转出亮面（日落）；半夜：背对太阳·影子最长：影子的长短就是太阳高度的晴雨表' },
        { kind: 'highlight', text: '对着太阳是白天·背对太阳是黑夜' },
      ] },
      { when: 3, title: '时差初体验', subtitle: '世界不同步', color: 'green', emoji: '⏰', blocks: [
        { kind: 'info', icon: '🌏', title: '北京的晚上=伦敦的白天', text: '地球是个球·太阳同一时刻只照亮一面：北京晚上 8 点·伦敦是中午 12 点·纽约还在上午 7 点：地球自西向东转——东边的人先看到太阳——越东越早' },
        { kind: 'info', icon: '✈️', title: '倒时差', text: '坐飞机去很远的国家·你的「白天黑夜钟」还按北京时间走·当地却可能是黑夜——身体闹别扭就是时差：出国比赛的运动队要提前倒时差——让身体钟对准当地太阳' },
        { kind: 'highlight', text: '东边先见太阳——地球两端昼夜正好相反' },
      ] },
    ],
    teach: { sections: [
      { title: '自转一圈一天', body: '【周期】24 小时一圈。\n【方向】自西向东。\n【感觉】太稳太大感觉不到。' },
      { title: '昼夜交替', body: '【原理】对太阳=昼·背太阳=夜。\n【晨昏线】昼夜分界。\n【影子】中午最短·早晚最长。' },
      { title: '时差', body: '【原因】太阳只照一面。\n【规律】越东越早。\n【倒时差】让身体钟对准当地。' },
    ], examples: [
      { q: '手电筒模拟昼夜', steps: ['暗屋里用手电照地球仪', '标记面对光的一半', '转动地球仪', '观察标记点进出亮面'], tip: '转动见日夜' },
      { q: '给外国朋友打电话', steps: ['想对方在东还是西', '东边时间比你早', '算差几小时', '避开对方半夜打'], tip: '先算时差' },
    ], mistakes: ['以为太阳真的绕地球转（是地球自转·太阳「不动」）', '以为全世界同时过白天（太阳只照亮一半地球）'] },
    exercises: [
      { q: '地球自转一圈需要？', options: ['一天', '一个月', '一年', '一小时'], answer: 0, explain: '24小时' },
      { q: '黑夜的原因是？', options: ['太阳熄灭了', '转到背对太阳的一面', '云挡住了', '月亮遮住'], answer: 1, explain: '你在影子里' },
      { q: '「坐地日行八万里」说明我们？', options: ['随地球一起在动', '站着在飞走', '地球不动', '在原地跳'], answer: 0, explain: '被地球带着转' },
      { q: '一天中影子最短在？', options: ['早晨', '中午', '傍晚', '半夜'], answer: 1, explain: '正对太阳' },
      { q: '北京的深夜·地球另一边的纽约可能是？', options: ['黑夜', '白天', '日食', '下雪'], answer: 1, explain: '昼夜相反' },
      { q: '越往东越先看到太阳·因为地球朝 ___ 转', options: ['东', '西'], answer: 0, explain: '自西向东', type: 'blank', blank: { answerText: '东', bank: ['东', '西'] } },
    ],
  }),

  // ===== 信息科技 =====
  L({
    area: '信息科技', band: 'primary', grade: 3, id: 'it-29', order: 1155, title: '算法初体验：拆成小步骤', emoji: '🧩', textbook: '信息科技（浙教版三年级）',
    curriculum: { module: '算法启蒙', points: ['什么是算法', '步骤要明确', '顺序很重要'] },
    story: '让机器人帮你泡一杯奶——它真的会问：「一杯是多少？温水是多温？」电脑是最听话也是最「笨」的伙伴：你说的每一步都必须清清楚楚。这就是算法的秘密。',
    goals: ['理解什么是算法', '写出明确步骤', '体会顺序的重要性'],
    aiIntro: '🧩 把大事拆成小步骤——算法',
    param: { name: 'sf1', label: '算法站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么机器人听不懂「随便倒点水」？', '先穿鞋还是先穿袜？', '怎么把刷牙写成算法？'],
    views: [
      { when: 1, title: '什么是算法', subtitle: '做事的说明书', color: 'blue', emoji: '📜', blocks: [
        { kind: 'info', icon: '🤖', title: '泡奶翻车记', text: '你对机器人说「泡杯奶」——它卡住了：多少水？多热？放几勺奶粉？先放水还是先放粉？：把每个问题都答清楚·写成一步步的说明——这份「说明书」就是算法' },
        { kind: 'info', icon: '📝', title: '算法三特征', text: '①有穷：步骤数得清·不能无限循环；②明确：每一步不用猜——「适量」不合格·「200 毫升」才合格；③有序：先做什么后做什么写得明明白白' },
        { kind: 'highlight', text: '算法=又明确又有顺序的做事说明书' },
      ] },
      { when: 2, title: '步骤要明确', subtitle: '笨电脑难题', color: 'amber', emoji: '💬', blocks: [
        { kind: 'compare', title: '合格与不合格', items: [
          { label: '不合格步骤', value: '「把水调到合适温度」——几度算合适？机器人懵了' },
          { label: '合格步骤', value: '「烧开水·晾 10 分钟·兑 50 毫升凉水」——每一步都能照做不用猜' },
        ] },
        { kind: 'info', icon: '🎮', title: '你早就在用算法', text: '游戏攻略的出装顺序·折纸鹤的图解·做操的分解动作——全是算法：会看说明=会用算法·会写说明=会造算法' },
        { kind: 'highlight', text: '明确到不用猜——电脑才不懵' },
      ] },
      { when: 3, title: '顺序很重要', subtitle: '穿袜穿鞋定理', color: 'green', emoji: '🧦', blocks: [
        { kind: 'info', icon: '👞', title: '先袜后鞋', text: '先穿鞋再穿袜？永远穿不上！有些步骤换了顺序就全错——这叫「顺序依赖」：煮泡面先放调料再烧水·味道就会怪：写算法前先想清楚谁必须在前' },
        { kind: 'info', icon: '🪥', title: '刷牙算法', text: '①拿牙刷②挤牙膏 1 厘米③接水漱口④上牙往下刷 20 次⑤下牙往上刷 20 次⑥漱口收工：把生活里的事写成算法·你会发现自己原来这么能干' },
        { kind: 'highlight', text: '顺序错了全盘错——先想清楚谁在前' },
      ] },
    ],
    teach: { sections: [
      { title: '什么是算法', body: '【定义】明确的做事步骤说明书。\n【三特征】有穷·明确·有序。\n【例子】泡奶·攻略·折纸。' },
      { title: '步骤要明确', body: '【不合格】适量·差不多·随便。\n【合格】数字+动作+对象。\n【标准】照做不用猜。' },
      { title: '顺序很重要', body: '【袜子定理】先袜后鞋不可换。\n【写法】想清依赖再排序。\n【练习】把日常写成步骤。' },
    ], examples: [
      { q: '写「泡奶算法」', steps: ['列出要做的事', '把模糊词换成数字', '排好先后顺序', '让家人照着做一遍'], tip: '找人试跑' },
      { q: '给扫地机器人下指令', steps: ['起点：客厅角落', '路线：沿墙一圈再走S形', '遇到障碍：绕开继续', '结束：回充电座'], tip: '路线+意外都要写' },
    ], mistakes: ['写步骤用「适量」「大概」（电脑没法猜·要写具体数字）', '以为顺序无所谓（穿鞋再穿袜永远失败）'] },
    exercises: [
      { q: '算法是？', options: ['一种电脑', '明确的做事步骤', '一个游戏', '数学题'], answer: 1, explain: '做事说明书' },
      { q: '算法的步骤应该？', options: ['模糊些', '明确不用猜', '越少越好', '随便排'], answer: 1, explain: '笨电脑要求' },
      { q: '「放适量糖」这个步骤？', options: ['合格', '不合格太模糊', '太长了', '是密码'], answer: 1, explain: '要写几克' },
      { q: '先穿鞋再穿袜说明？', options: ['顺序很重要', '袜子不好', '鞋更快', '都一样'], answer: 0, explain: '顺序依赖' },
      { q: '下面哪个像算法？', options: ['折纸步骤图', '一首诗', '一张照片', '一句口号'], answer: 0, explain: '分步骤可照做' },
      { q: '写算法要把模糊词换成具体 ___', options: ['数字', '表情'], answer: 0, explain: '可执行', type: 'blank', blank: { answerText: '数字', bank: ['数字', '表情'] } },
    ],
  }),
  L({
    area: '信息科技', band: 'primary', grade: 3, id: 'it-30', order: 1156, title: '像素画：马赛克魔法', emoji: '🖼️', textbook: '信息科技（浙教版三年级）',
    curriculum: { module: '数字创作', points: ['什么是像素', '格子画创作', '图片放大变糊的秘密'] },
    story: '凑近电视屏幕看，会发现画面由一颗颗小方点组成！这些最小的「颜色积木」叫像素。学会像素的秘密，你就能用方格纸画出电脑里的世界。',
    goals: ['认识像素', '创作格子画', '明白图片放大会糊'],
    aiIntro: '🖼️ 一颗颗小方块拼出大世界——像素',
    param: { name: 'xs1', label: '像素站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['屏幕上的小方块藏在哪里？', '马赛克画怎么画？', '照片放大会糊和像素有什么关系？'],
    views: [
      { when: 1, title: '认识像素', subtitle: '最小的颜色积木', color: 'blue', emoji: '🔍', blocks: [
        { kind: 'info', icon: '🧱', title: '屏幕的真面目', text: '凑近看屏幕：画面由一格格小方点拼成——每个小方点只能是一种颜色·叫做素（picture element）：几百万个像素一起「站岗」·才拼出你看到的动画·照片·游戏' },
        { kind: 'info', icon: '📏', title: '像素多少=清晰度', text: '手机照片 4000×3000=1200 万像素——横 4000 颗竖 3000 颗小积木：像素越多·画面细节越丰富·放大越不容易糊：像素就是清晰度的计数单位' },
        { kind: 'highlight', text: '像素=最小的颜色积木·越多越清晰' },
      ] },
      { when: 2, title: '格子画', subtitle: '动手拼像素', color: 'amber', emoji: '🎨', blocks: [
        { kind: 'info', icon: '⬛', title: '像素画三步', text: '①定画布：8×8 或 16×16 方格纸；②勾轮廓：用铅笔在格子上描出物体外形（一格一格对齐·不能斜着涂一半）；③上色：一格一色·整格填满——像素画不许半格！' },
        { kind: 'info', icon: '❤️', title: '8×8 画爱心', text: '第 2-3 行中间涂 4 格红·第 4 行涂 6 格·往下每行少 2 格收成尖——一颗像素爱心就成了：先易后难：爱心→蘑菇→小人→你的头像' },
        { kind: 'highlight', text: '一格一色整格填——像素画的规矩' },
      ] },
      { when: 3, title: '放大变糊', subtitle: '马赛克的真相', color: 'green', emoji: '😵', blocks: [
        { kind: 'info', icon: '🔍', title: '小图放大的悲剧', text: '把 8×8 的爱心放大 10 倍——每格变成大方块·边缘全是锯齿（马赛克感）：像素是积木·积木就那么大——放大不会变出新积木·只会把旧积木撑大' },
        { kind: 'info', icon: '💡', title: '生活里的应用', text: '电视马赛克（保护隐私打码）·十字绣（一针一像素）·乐高画——全是像素原理：照片放大糊了想救？用 AI「脑补」出新像素——但那已是猜测不是原图' },
        { kind: 'highlight', text: '放大=撑大旧积木·不产生新积木' },
      ] },
    ],
    teach: { sections: [
      { title: '什么是像素', body: '【定义】屏幕最小颜色单位。\n【清晰】像素越多越清晰。\n【规模】手机照片上千万像素。' },
      { title: '格子画', body: '【三步】定画布·勾轮廓·整格上色。\n【规矩】一格一色不半格。\n【进阶】爱心→蘑菇→头像。' },
      { title: '放大变糊', body: '【原因】旧积木撑大不生新。\n【表现】边缘锯齿马赛克。\n【同类】打码·十字绣·乐高。' },
    ], examples: [
      { q: '画 8×8 像素爱心', steps: ['准备方格纸', '铅笔勾出轮廓格', '红色整格填充', '数一数用了多少格'], tip: '整格填色' },
      { q: '解释照片放大糊', steps: ['照片由像素积木组成', '放大只是撑大积木', '积木数没变边缘锯齿', '想要清就要原图像素多'], tip: '积木不会变多' },
    ], mistakes: ['涂色涂半格（像素画一格一色·整格填满）', '以为放大会自动变清晰（放大只撑大像素·不产生新细节）'] },
    exercises: [
      { q: '像素是？', options: ['最小的颜色单位', '一种动物', '游戏角色', '网络速度'], answer: 0, explain: '颜色积木' },
      { q: '像素越多画面越？', options: ['模糊', '清晰', '黑暗', '昂贵'], answer: 1, explain: '细节丰富' },
      { q: '像素画涂色的规矩是？', options: ['一格一色', '随便涂', '只许涂一半', '必须斜涂'], answer: 0, explain: '整格填满' },
      { q: '小图放大会？', options: ['更清晰', '出现锯齿变糊', '自动修复', '消失'], answer: 1, explain: '积木撑大' },
      { q: '电视打码用的原理是？', options: ['像素放大', '换台', '关机', '调亮'], answer: 0, explain: '马赛克' },
      { q: '放大图片不会产生新的 ___', options: ['像素', '文件'], answer: 0, explain: '只撑大旧的', type: 'blank', blank: { answerText: '像素', bank: ['像素', '文件'] } },
    ],
  }),

  // ===== 英语 =====
  L({
    area: '英语', band: 'primary', grade: 3, id: 'eng-56', order: 1157, title: 'What time is it：几点了', emoji: '🕐', textbook: '英语（人教版三年级）',
    curriculum: { module: '时间表达', points: ['整点表达', '半点表达', '问时间的句型'] },
    story: '外国朋友问你 What time is it? 你只会说 yes？这一课学会报时三件套：整点、半点、还有最帅的一句 It\'s about time!（该出发啦）！',
    goals: ['会问几点了', '会说整点和半点', '会用 o\'clock'],
    aiIntro: '🕐 几点了？——What time is it',
    param: { name: 'tm2', label: '时间站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['整点怎么说？', 'half past 是过半还是没到？', '怎么问别人几点了？'],
    views: [
      { when: 1, title: '问与答', subtitle: '报时句型', color: 'blue', emoji: '❓', blocks: [
        { kind: 'info', icon: '💬', title: '两问一答', text: '问：What time is it?（几点了？）/ What\'s the time?；答：It\'s + 时间——It\'s seven.（七点了）· It\'s seven o\'clock.（七点整）：o\'clock 只用于整点——「七点半」绝不能说 seven o\'clock' },
        { kind: 'compare', title: '整点与半点', items: [
          { label: '整点', value: '数字 + o\'clock：7:00 = seven o\'clock（七点整）：几点整几点说·最简单' },
          { label: '半点', value: 'half past + 数字：7:30 = half past seven（七过一半）：half=一半·past=过了——七点过了一半' },
        ] },
        { kind: 'highlight', text: '整点加 o\'clock·半点 half past' },
      ] },
      { when: 2, title: '我的作息表', subtitle: '整点串串烧', color: 'amber', emoji: '📋', blocks: [
        { kind: 'info', icon: '⏰', title: '一天六句话', text: 'I get up at seven o\'clock. 七点起；I go to school at eight. 八点上学；Lunch at twelve! 十二点午饭；I play at four o\'clock. 四点玩；Homework at half past seven. 七点半作业；I sleep at nine. 九点睡——用六个时间点把一天串起来' },
        { kind: 'info', icon: '🔁', title: 'at 是时间钩子', text: '说「在几点」要加 at：at seven·at half past nine——at 像一枚图钉把时间和动作钉在一起：记住口诀：几点做事 at 打头' },
        { kind: 'highlight', text: 'at + 时间——把动作钉在时间上' },
      ] },
      { when: 3, title: '时间对话', subtitle: '实战演练', color: 'green', emoji: '🎭', blocks: [
        { kind: 'compare', title: '三组真实对话', items: [
          { label: '问路遇', value: '—What time is it? —It\'s half past three. Let\'s go!（三点半了·走吧！）' },
          { label: '约朋友', value: '—See you at five o\'clock? —OK! At five.（五点见？——好·五点！）' },
          { label: '迟到了', value: '—Oh no, it\'s nine o\'clock! —Hurry up!（九点了！——快点！）' },
        ] },
        { kind: 'info', icon: '⏳', title: 'about 差不多', text: 'It\'s about seven.（七点左右）——about=大约：不确切的时间用 about 打头·最地道的口语缓冲词：时间没掐准也能大方开口' },
        { kind: 'highlight', text: 'about=大约——不确定就加它' },
      ] },
    ],
    teach: { sections: [
      { title: '问与答', body: '【问】What time is it?\n【答】It\'s + 时间。\n【整点】数字+o\'clock。' },
      { title: '半点', body: '【句型】half past + 数字。\n【理解】half 一半·past 过了。\n【例】7:30=half past seven。' },
      { title: '作息表达', body: '【介词】在几点用 at。\n【缓冲】about=大约。\n【例】at seven·about nine。' },
    ], examples: [
      { q: '看钟说时间', steps: ['看时针指向几', '整点说 It\'s five o\'clock', '半点说 half past five', '不确定加 about'], tip: '整半分开说' },
      { q: '介绍我的一天', steps: ['列六个时间点', '每个配一个动作', '动词前加 at', '连成六句话'], tip: 'at 钉时间' },
    ], mistakes: ['七点半说成 seven o\'clock（o\'clock 只用于整点）', '忘了在时间前加 at（at seven 才对）'] },
    exercises: [
      { q: '「几点了？」英语是？', options: ['What time is it?', 'How are you?', 'What\'s this?', 'Who are you?'], answer: 0, explain: '问时间专用' },
      { q: '7:00 的英语是？', options: ['seven o\'clock', 'half past seven', 'seven half', 'seven past'], answer: 0, explain: '整点加oclock' },
      { q: 'half past seven 是？', options: ['7:00', '7:30', '6:30', '7:15'], answer: 1, explain: '七过一半' },
      { q: '「在七点」要说？', options: ['on seven', 'at seven', 'in seven', 'to seven'], answer: 1, explain: 'at 钉时间' },
      { q: 'It\'s about nine 的意思是？', options: ['九点整', '九点左右', '九点半', '九点前'], answer: 1, explain: 'about大约' },
      { q: 'o\'clock 只用于 ___ 点', options: ['整', '半'], answer: 0, explain: '整点专用', type: 'blank', blank: { answerText: '整', bank: ['整', '半'] } },
    ],
  }),
  L({
    area: '英语', band: 'primary', grade: 3, id: 'eng-57', order: 1158, title: 'I can swim：会与不会', emoji: '🏊', textbook: '英语（人教版三年级）',
    curriculum: { module: '情态动词', points: ['can 表示会', '否定和疑问', 'can 的用法'] },
    story: '你会游泳吗？Can you swim? 会就是 I can! 不会也别慌——I can\'t 现在，但 can 的世界里没有「永远不行」：学会 can，一分钟介绍你的十八般武艺！',
    goals: ['用 can 说会什么', '会用 can\'t', '会问 Can you…?'],
    aiIntro: '🏊 会还是不会——can 的小宇宙',
    param: { name: 'cn1', label: '能力站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['can 放在句子哪里？', '不会做怎么说？', '怎么问别人会不会？'],
    views: [
      { when: 1, title: 'can 三连', subtitle: '肯定否定疑问', color: 'blue', emoji: '✅', blocks: [
        { kind: 'compare', title: '一个 can 三种说法', items: [
          { label: '肯定', value: 'I can swim. 我会游泳——can + 动词原形：can 后面永远跟「裸动词」（不加 s 不加 ing）' },
          { label: '否定', value: 'I can\'t swim. 我不会游泳——can + not = can\'t（cannot 缩写）：轻描淡写说不会·大方承认不丢人' },
          { label: '疑问', value: 'Can you swim? 你会游泳吗？——can 搬到句首当问号开关：Can she dance? 她会跳舞吗？' },
        ] },
        { kind: 'highlight', text: 'can+动词原形；否定 can\'t；提问 can 打头' },
      ] },
      { when: 2, title: '能力发布会', subtitle: '夸自己专用', color: 'amber', emoji: '🌟', blocks: [
        { kind: 'info', icon: '🏆', title: 'Can 三连夸', text: 'I can play football. 我会踢球；I can draw pandas. 我会画熊猫；I can cook eggs! 我会煎蛋——can 后面装的就是你的本事清单：动词原形随便换·一句话一个本领' },
        { kind: 'info', icon: '🎵', title: '唱出来的 can', text: '儿歌《I Can Sing a Rainbow》：I can sing a rainbow, sing a rainbow, sing a rainbow too——旋律一响句型就会了：can 歌是学 can 最快的路' },
        { kind: 'highlight', text: 'I can + 本事——一分钟自我介绍' },
      ] },
      { when: 3, title: '问答实战', subtitle: '调查小采访', color: 'green', emoji: '🎤', blocks: [
        { kind: 'info', icon: '📋', title: '班级能力调查', text: '拿表格采访同学：Can you play the piano? —Yes, I can. / No, I can\'t：回答不用整句·Yes/No + I can(c\'n\'t) 就够——地道的省力回答法' },
        { kind: 'info', icon: '🤝', title: '礼貌夸人', text: '别人展示才艺时说 You can dance so well!（你舞跳得真好）——can 不光说自己·也是夸人的好帮手：夸人一句·朋友+1' },
        { kind: 'highlight', text: 'Yes, I can. / No, I can\'t.——省力又地道' },
      ] },
    ],
    teach: { sections: [
      { title: 'can 三式', body: '【肯定】I can swim.\n【否定】I can\'t swim.\n【疑问】Can you swim?\n【铁律】can+动词原形。' },
      { title: '能力表达', body: '【句型】I can + 本事。\n【替换】play/draw/cook/sing。\n【儿歌】Rainbow 巩固。' },
      { title: '问答互动', body: '【简答】Yes, I can. No, I can\'t.\n【夸人】You can… so well!\n【活动】能力调查表。' },
    ], examples: [
      { q: '介绍自己的三个本领', steps: ['写三个会做的事', '动词放 can 后面', '检查动词没加s', '大声连说三句'], tip: '裸动词' },
      { q: '采访同学会不会钢琴', steps: ['Can you play the piano?', '等对方回答', '记录 Yes 或 No', '换下一个问题'], tip: 'can 打头提问' },
    ], mistakes: ['说 I can swims（can 后动词不加 s）', '疑问句忘把 can 提到句首（You can swim? 不标准·应 Can you swim?）'] },
    exercises: [
      { q: '「我会游泳」是？', options: ['I can swim.', 'I swim can.', 'I can swims.', 'Can I swim.'], answer: 0, explain: 'can+原形' },
      { q: '「我不会画画」是？', options: ['I can draw.', 'I can\'t draw.', 'I not draw.', 'I don\'t can.'], answer: 1, explain: 'can\'t 表不会' },
      { q: '「你会跳舞吗？」是？', options: ['You can dance?', 'Can you dance?', 'Do you can dance?', 'Can dance you?'], answer: 1, explain: 'can 提句首' },
      { q: 'can 后面的动词要？', options: ['加 s', '加 ing', '用原形', '大写'], answer: 2, explain: '裸动词' },
      { q: 'Can you sing? 的简短肯定回答是？', options: ['Yes, I can.', 'Yes, I sing.', 'I can sing good.', 'Sing!'], answer: 0, explain: '省力回答' },
      { q: 'can 后面跟动词 ___', options: ['原形', '复数'], answer: 0, explain: '不加s不加ing', type: 'blank', blank: { answerText: '原形', bank: ['原形', '复数'] } },
    ],
  }),

  // ===== 心理学 =====
  L({
    area: '心理学', band: 'primary', grade: 4, id: 'psy-59', order: 1159, title: '睡眠魔法：大脑夜班', emoji: '😴', textbook: '心理与健康（拓展）',
    curriculum: { module: '身心健康', points: ['睡眠时大脑在干嘛', '睡前三准备', '睡够多少小时'] },
    story: '你以为睡着后大脑就下班了？错！它开起夜班工厂：把白天的知识归档·把垃圾清走·把长高的信号发出。睡个好觉，比多刷十道题更管用。',
    goals: ['了解睡眠的作用', '学会睡前准备', '知道自己该睡多久'],
    aiIntro: '😴 大脑的夜班工厂——睡眠的秘密',
    param: { name: 'sm1', label: '睡眠站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['睡着后大脑在做什么？', '为什么睡前不能玩手机？', '小学生要睡几个小时？'],
    views: [
      { when: 1, title: '夜班工厂', subtitle: '睡着不等于关机', color: 'blue', emoji: '🏭', blocks: [
        { kind: 'info', icon: '📦', title: '夜班三件事', text: '①归档：白天学的知识从「临时文件夹」搬进「长期仓库」——复习靠的就是这一步；②大扫除：冲走白天攒下的代谢垃圾·脑细胞洗个澡；③长个儿：深睡时生长激素分泌最多——个子是睡出来的' },
        { kind: 'info', icon: '🧠', title: '熬夜的账单', text: '睡不够→知识没归档（白学）·垃圾没清走（脑子昏沉）·生长激素不足（长不高）：熬一夜·三天补不回——睡眠是唯一不能「先欠后还」的东西' },
        { kind: 'highlight', text: '归档·大扫除·长个子——睡觉是大脑最重要的工作' },
      ] },
      { when: 2, title: '睡前三准备', subtitle: '入睡小仪式', color: 'amber', emoji: '🌙', blocks: [
        { kind: 'info', icon: '📵', title: '①收手机', text: '屏幕的蓝光会骗大脑「还是白天」·褪黑素（睡眠开关）分泌减少：睡前 30 分钟放下屏幕——改看纸质书或听故事：大脑收到「天黑了」的信号才会犯困' },
        { kind: 'info', icon: '🛁', title: '②固定流程', text: '每天同一套动作：刷牙→洗脚→换睡衣→关灯——像火车进站前减速：大脑一看到流程就知道「该睡了」——固定时间上下床·周末也别差太多（差 1 小时内）' },
        { kind: 'info', icon: '🧸', title: '③清空小脑袋', text: '躺下后脑子还在转？把担心的事写在纸上合上本子——「交给明天的我」；再做个五指呼吸：摸一根手指深呼吸一次·五根手指五次——多数人没做完就睡着' },
        { kind: 'highlight', text: '收屏幕·走流程·清脑袋——入睡三板斧' },
      ] },
      { when: 3, title: '睡多久', subtitle: '你的睡眠额度', color: 'green', emoji: '⏱️', blocks: [
        { kind: 'info', icon: '📊', title: '小学生睡眠表', text: '教育部规定：小学生每天睡 10 小时·初中生 9 小时：倒推法：7 点起→晚上 9 点前必须睡：睡够的标志：早上不用人喊自己醒·白天上课不打瞌睡' },
        { kind: 'info', icon: '📅', title: '周末陷阱', text: '周末睡到中午=给生物钟「倒时差」——周一早起加倍痛苦：周末最多比平时晚起 1 小时·午睡 20-30 分钟补觉更聪明：规律比时长更重要' },
        { kind: 'highlight', text: '小学生 10 小时·晚 9 点前睡——规律比补觉管用' },
      ] },
    ],
    teach: { sections: [
      { title: '睡眠作用', body: '【三件事】归档知识·清扫垃圾·分泌生长激素。\n【熬夜】白学+昏沉+长不高。\n【结论】不能先欠后还。' },
      { title: '睡前准备', body: '【收屏】睡前30分钟离屏幕。\n【流程】固定动作固定时间。\n【清脑】写下来+五指呼吸。' },
      { title: '睡眠时长', body: '【标准】小学生10小时。\n【倒推】7点起→9点睡。\n【规律】周末差不过1小时。' },
    ], examples: [
      { q: '制定我的睡觉时间表', steps: ['定起床时间', '倒推10小时定入睡点', '列睡前流程三项', '坚持一周打卡'], tip: '倒推法定点' },
      { q: '躺下睡不着', steps: ['把烦心事写在纸上', '做五指呼吸', '不看时间不数羊', '还睡不着就闭眼养神'], tip: '越急越睡不着' },
    ], mistakes: ['认为睡觉浪费时间（归档+长高都在睡里完成）', '周末狂补觉到中午（打乱生物钟·周一更困）'] },
    exercises: [
      { q: '睡眠时大脑在？', options: ['关机休息', '归档知识和清扫', '什么也不做', '玩游戏'], answer: 1, explain: '夜班工厂' },
      { q: '生长激素分泌最多在？', options: ['深睡时', '跑步时', '吃饭时', '打游戏时'], answer: 0, explain: '个子睡出来' },
      { q: '睡前不该做的事是？', options: ['刷牙', '看纸质书', '玩手机', '听故事'], answer: 2, explain: '蓝光骗大脑' },
      { q: '小学生每天应睡？', options: ['6 小时', '8 小时', '10 小时', '12 小时以上'], answer: 2, explain: '教育部规定' },
      { q: '周末起床最好比平时？', options: ['晚 3 小时', '晚不超过 1 小时', '睡到中午', '更早起'], answer: 1, explain: '保生物钟' },
      { q: '把白天学的知识归档发生在睡 ___ 里', options: ['眠', '觉'], answer: 0, explain: '深睡归档', type: 'blank', blank: { answerText: '眠', bank: ['眠', '觉'] } },
    ],
  }),
  L({
    area: '心理学', band: 'primary', grade: 4, id: 'psy-60', order: 1160, title: '倾听高手：耳朵超能力', emoji: '👂', textbook: '心理与健康（拓展）',
    curriculum: { module: '人际交往', points: ['倾听三要素', '不好的听话习惯', '听完再回应'] },
    story: '会说话是本事，会听话是超能力！朋友难过时，你不用急着讲道理——耳朵先到，心就到了。这一课练成「听懂别人」的神功。',
    goals: ['掌握倾听三要素', '改掉抢话毛病', '学会听完再回应'],
    aiIntro: '👂 耳朵的超能力——倾听',
    param: { name: 'qt1', label: '倾听站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么朋友说话时要看着他？', '抢着说话会怎样？', '听完之后该说什么？'],
    views: [
      { when: 1, title: '倾听三要素', subtitle: '听的神功', color: 'blue', emoji: '🎯', blocks: [
        { kind: 'info', icon: '👀', title: '①眼睛看', text: '对方说话时看着他（不用死盯·看眼睛和脸之间就行）：眼睛看着=我在乎你说的话：东张西望=你说的话不重要——眼睛是倾听的第一信号' },
        { kind: 'info', icon: '🧠', title: '②耳朵听完整', text: '听人家把话说完——中途接话=告诉对方「你说太慢了」：听完整才能听懂全部：很多误会就是听一半「自以为懂了」闹出来的' },
        { kind: 'info', icon: '💗', title: '③心里要想', text: '边听边想：TA 现在是什么心情？需要我帮忙还是只想说说？——倾听不是装安静·是用心跟对方的思路走：听懂情绪比听懂事情更重要' },
        { kind: 'highlight', text: '眼睛看·听完整·用心想——倾听三要素' },
      ] },
      { when: 2, title: '听话坏习惯', subtitle: '三大杀手', color: 'amber', emoji: '🚫', blocks: [
        { kind: 'compare', title: '杀手现形记', items: [
          { label: '抢话怪', value: '话没说完就「我知道我知道」——你抢走的不只是话·还有对方的兴致：惩罚：慢慢没人愿意跟你说' },
          { label: '走神怪', value: '嗯嗯啊啊地敷衍·眼睛盯着别处——对方一眼识破：假装在听比不听还伤人' },
          { label: '急导师', value: '朋友刚开口就「你应该怎样怎样」——TA 只想被听见·不是来上课的：先听懂·再问要不要建议' },
        ] },
        { kind: 'highlight', text: '抢话·走神·急着给建议——倾听三大杀手' },
      ] },
      { when: 3, title: '听完再说', subtitle: '回应的艺术', color: 'green', emoji: '💬', blocks: [
        { kind: 'info', icon: '🔁', title: '复述确认', text: '听完后先用自己的话复述：「你是说……对吗？」——一句话确认没听错·对方感觉被认真对待：吵架多半源于「你根本没听懂我」——复述就是解药' },
        { kind: 'info', icon: '🫂', title: '先接情绪再接事', text: '朋友考砸了——先说「挺难受吧」再讨论怎么办：情绪没被接住·任何建议都是耳边风：顺序：接住心情→等TA问建议→才给建议' },
        { kind: 'highlight', text: '复述确认+先接情绪——听完后的两步舞' },
      ] },
    ],
    teach: { sections: [
      { title: '倾听三要素', body: '【一看】眼睛看对方。\n【二完】听完整不打断。\n【三想】跟思路·懂情绪。' },
      { title: '三大杀手', body: '【抢话】打断抢兴致。\n【走神】假装听更伤人。\n【急导师】没问就给建议。' },
      { title: '听完再说', body: '【复述】你是说…对吗。\n【顺序】先接情绪再谈事。\n【建议】等对方来问。' },
    ], examples: [
      { q: '朋友说比赛输了', steps: ['眼睛看着他听完', '复述：输了挺难受吧', '等他说想怎么办', '他问了再给建议'], tip: '先接情绪' },
      { q: '听不懂对方的意思', steps: ['别装懂点头', '礼貌问：能再说一遍吗', '用自己的话复述', '确认后再回应'], tip: '问清不算丢人' },
    ], mistakes: ['朋友倾诉时马上讲道理（先接住情绪·建议等TA来问）', '一边嗯嗯一边看别处（假装听比不听更伤人）'] },
    exercises: [
      { q: '倾听的第一信号是？', options: ['眼睛看对方', '大声说话', '快速提问', '做笔记'], answer: 0, explain: '在乎的表现' },
      { q: '听人说话的正确做法是？', options: ['中途抢话', '听完整再回应', '边玩边听', '马上给建议'], answer: 1, explain: '听完整' },
      { q: '「急导师」的问题在于？', options: ['声音太大', '没听完就给建议', '太会听了', '笑得太多'], answer: 1, explain: '先听懂再谈' },
      { q: '听完后确认理解可以说？', options: ['你是说…对吗', '无聊', '我知道了别说了', '换我讲'], answer: 0, explain: '复述确认' },
      { q: '朋友难过时先要？', options: ['讲道理', '接住情绪', '转身走开', '讲笑话'], answer: 1, explain: '先心情后事情' },
      { q: '倾听时要眼睛看·听完整·用心 ___', options: ['想', '跑'], answer: 0, explain: '跟思路懂情绪', type: 'blank', blank: { answerText: '想', bank: ['想', '跑'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id + ' order=' + l.order).join(', '));
