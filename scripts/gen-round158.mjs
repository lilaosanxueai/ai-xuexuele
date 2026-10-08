import fs from 'node:fs';
import path from 'node:path';

/**
 * 第158轮：初中段拉平——英语+2 地理+2 音乐+2 劳动+2（16课梯队→18）。
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
    area: '英语', band: 'junior', grade: 8, id: 'eng-36', order: 819, title: '时态对决：过去式 vs 现在完成时', emoji: '⏰', textbook: '人教PEP（八年级）',
    curriculum: { module: '语法', points: ['两种时态的区分', '时间标志词', '常见错误'] },
    story: '「I saw this movie」和「I have seen this movie」——中文都是"我看过"·英文却分成两个世界：一个跟过去的时间点走·一个跟现在有关系。这是初中英语最大的时态难关·这一课用"时间轴"一次说清楚。',
    goals: ['分清两种时态的核心区别', '掌握时间标志词', '避免常见混淆'],
    aiIntro: '⏰ 一条时间轴分清两大时态！',
    param: { name: 'ts', label: '时态站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['saw 和 have seen 差在哪？', '哪些词是"过去专属"？', '为什么 I have seen it yesterday 是错的？'],
    views: [
      { when: 1, title: '核心', subtitle: '一句话分', color: 'blue', emoji: '🔑', blocks: [
        { kind: 'info', icon: '📏', title: '一般过去时', text: '过去某个时间发生的事·跟现在没关系——I saw this movie last week（上周看的·现在怎样不管）：句子里一定有/暗示过去时间点' },
        { kind: 'info', icon: '🔗', title: '现在完成时', text: '过去发生·对现在有影响或持续到现在——I have seen this movie（我看过了→所以现在不想再看）：强调"现在的状态"' },
        { kind: 'info', icon: '🎯', title: '一句话口诀', text: '过去时="报告过去的事"；完成时="过去的事·现在的果"——问自己：这句话关心的是"当时"还是"现在"' },
        { kind: 'highlight', text: '过去时回头看·完成时回头看但脚站在现在' },
      ] },
      { when: 2, title: '标志词', subtitle: '秒判技巧', color: 'green', emoji: '🚦', blocks: [
        { kind: 'compare', title: '专属信号灯', items: [
          { label: '过去时专属', value: 'yesterday·last week/month/year·ago·in 2020·just now——这些词一出现·必用过去时（时间点已经封死在过去）' },
          { label: '完成时专属', value: 'already·yet·just·ever·never·since·for·so far·recently——信号是"到现在为止"（时间没有封死）' },
        ] },
        { kind: 'info', icon: '⚠️', title: '致命组合错误', text: 'I have seen it yesterday ✗ —— yesterday 是过去时专属词·不能跟完成时混搭：要么 I saw it yesterday ✓·要么 I have seen it（去掉 yesterday）✓——考试最爱挖这个坑' },
        { kind: 'info', icon: '📦', title: 'since vs for', text: 'since + 时间点（since 2020·since last week）；for + 时间段（for two years·for a long time）——I have lived here since 2020 / for four years——两个词搭配的"点段之别"年年考' },
        { kind: 'highlight', text: '见 ago/last → 过去式；见 already/since → 完成时' },
      ] },
      { when: 3, title: '错误', subtitle: 'TOP 3', color: 'amber', emoji: '🚫', blocks: [
        { kind: 'steps', title: '高频错误清单', items: ['❌ I have went there → ✓ I have gone there（完成时用过去分词 gone·不是过去式 went）', '❌ He has finished it yesterday → ✓ He finished it yesterday（yesterday 锁死过去时）', '❌ How long do you know him? → ✓ How long have you known him?（"认识多久"从过去持续到现在→完成时）' ] },
        { kind: 'info', icon: '📝', title: '动词三表', text: '写对完成时的前提是过去分词不写错——规则动词 go/went/gone·see/saw/seen·do/did/done；不规则动词表每天背 5 个·两周搞定' },
        { kind: 'highlight', text: '动词三形态（原形/过去式/过去分词）是时态的地基' },
      ] },
    ],
    teach: { sections: [
      { title: '核心区别', body: '【过去时】过去的事·跟现在无关（报告过去）。\n【完成时】过去发生·影响现在（过去的果实）。\n【自问】关心"当时"还是"现在"？' },
      { title: '时间标志词', body: '【过去】yesterday·last…·ago·in 2020·just now。\n【完成】already·yet·just·ever·never·since·for·so far。\n【禁搭】完成时不可与 yesterday 等过去时间词共现。\n【since/for】点 vs 段。' },
      { title: '常见错误', body: '【分词】have gone 不是 have went。\n【搭配】yesterday→过去式。\n【持续】know/live 等持续动词用完成时问 how long。' },
    ], examples: [
      { q: 'She ___ (lose) her key. She cannot open the door.', steps: ['不能开门=影响现在', '用完成时', 'She has lost her key', 'have/has + 过去分词'], tip: '影响判完成' },
      { q: 'I ___ (visit) Beijing in 2019.', steps: ['in 2019 = 过去时间点', '用过去时', 'I visited Beijing', '封死在过去'], tip: '时间点判过去' },
    ], mistakes: ['把 yesterday 和完成时搭配（过去时间词锁死过去式）', '完成时误用过去式替代过去分词（have went → have gone）'] },
    exercises: [
      { q: 'I ___ this book already.', options: ['read', 'have read', 'readed', 'will read'], answer: 1, explain: 'already 是完成时信号' },
      { q: 'They ___ to the park last Sunday.', options: ['have gone', 'went', 'go', 'will go'], answer: 1, explain: 'last Sunday 锁过去式' },
      { q: 'He ___ here since 2020.', options: ['lived', 'has lived', 'lives', 'living'], answer: 1, explain: 'since+完成时' },
      { q: 'I have known her ___ ten years.', options: ['since', 'for', 'from', 'at'], answer: 1, explain: 'for + 时间段' },
      { q: '下列哪句是正确的？', options: ['I have seen it yesterday', 'I saw it yesterday', 'I have saw it yesterday', 'I seen it yesterday'], answer: 1, explain: 'yesterday 排除完成时' },
      { q: '过去时回头看·完成时回头看但脚站在 ___', options: ['现在', '过去'], answer: 0, explain: '核心区别', type: 'blank', blank: { answerText: '现在', bank: ['现在', '过去'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 8, id: 'eng-37', order: 820, title: '阅读细节题：定位三板斧', emoji: '🔍', textbook: '人教PEP（八年级）',
    curriculum: { module: '阅读理解', points: ['关键词定位', '同义替换', '排除法'] },
    story: '英语考试阅读占分最大·细节题又占阅读的大头——很多同学全文"看懂了"但选错了：因为细节题不考"读懂"·考"找对"。这一课学三把斧：关键词定位·同义替换识别·排除法——从此细节题稳拿。',
    goals: ['掌握关键词定位法', '识别同义替换', '用好排除法'],
    aiIntro: '🔍 三把斧稳拿细节题！',
    param: { name: 'rd', label: '阅读站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么"看懂了"还会选错？', '题目和原文总是"一模一样"吗？', '四个选项怎样排除最快？'],
    views: [
      { when: 1, title: '定位', subtitle: '第一斧', color: 'blue', emoji: '📍', blocks: [
        { kind: 'steps', title: '关键词定位三步', items: ['读题干划关键词：人名·地名·数字·年代·专有名词（最好找的词）', '拿着关键词回原文扫读——找到原句用笔标出', '读原句上下各一句（上下文定答案）——不要只看孤句' ] },
        { kind: 'info', icon: '⚡', title: '顺序原则', text: '中考英语阅读的出题顺序通常跟原文段落一致——第 1 题答案在前面·第 2 题在后面：定位时可以"接力"找·不用每次从头扫' },
        { kind: 'highlight', text: '细节题不是读懂做的——是找到做的' },
      ] },
      { when: 2, title: '替换', subtitle: '第二斧', color: 'green', emoji: '🔄', blocks: [
        { kind: 'compare', title: '正确答案的"变装"', items: [
          { label: '同义词替换', value: '原文 like → 选项 enjoy；原文 big → 选项 large——最高频的替换' },
          { label: '词性转换', value: '原文 success(n) → 选项 succeed(v)；原文 happy(adj) → 选项 happiness(n)' },
          { label: '句式转换', value: '原文主动句 → 选项被动句；原文长句 → 选项简化短语' },
        ] },
        { kind: 'info', icon: '🎯', title: '为什么变装', text: '如果选项照抄原文·谁都能选对——出题人故意换说法来测试你"真懂还是碰巧"：所以**长得像原文的选项反而要警惕·换了说法但意思一致的往往是答案**' },
        { kind: 'highlight', text: '正确答案爱"变装"——照抄原词的可能是陷阱' },
      ] },
      { when: 3, title: '排除', subtitle: '第三斧', color: 'amber', emoji: '✂️', blocks: [
        { kind: 'steps', title: '排除三步', items: ['砍"没提到的"：原文完全找不到影子的选项最先删', '砍"张冠李戴的"：A 做的事按到 B 头上（人名·地名对不上）', '砍"过度推断的"：原文说 like·选项说 love（程度拔高）——"最接近原文"的就是答案' ] },
        { kind: 'info', icon: '⏱️', title: '时间分配', text: '细节题 40 秒内：15 秒定位·15 秒比对·10 秒确认——卡壳超 40 秒先标记跳过·做完再回：不要为一道题拖垮全篇节奏' },
        { kind: 'highlight', text: '三斧齐下：定位→替换→排除——细节题变成"找证据"' },
      ] },
    ],
    teach: { sections: [
      { title: '关键词定位', body: '【三步】题干划词→原文扫描→上下文确认。\n【顺序】出题序≈原文段落序。\n【工具】人名地名数字年代最好找。' },
      { title: '同义替换', body: '【词】like→enjoy·big→large。\n【性】success→succeed。\n【句】主动→被动·长→短。\n【警惕】照抄原文可能是陷阱。' },
      { title: '排除法', body: '【三砍】没提到·张冠李戴·过度推断。\n【节奏】40秒/题·卡壳先跳。\n【原则】最接近原文=答案。' },
    ], examples: [
      { q: '题干问 What did Tom do last weekend?', steps: ['划词：Tom·last weekend', '回文找 Tom 出现的段落', '锁定 last weekend 对应句', '比对选项找同义替换'], tip: '定位优先' },
      { q: '选项与原文一模一样能直接选吗？', steps: ['警惕照抄陷阱', '核对主语·时间·对象是否完全匹配', '换了个说法但意思一致更可能是答案', '照抄但偷换一个词是最毒的陷阱'], tip: '变装原则' },
    ], mistakes: ['全文通读再做细节题（定位法效率高三倍）', '选照抄原文的选项（正确答案通常换了说法）'] },
    exercises: [
      { q: '细节题最有效的方法是？', options: ['全文背诵', '关键词定位法', '猜', '看题感'], answer: 1, explain: '找到胜于读懂' },
      { q: '英语阅读出题顺序通常？', options: ['随机', '跟原文段落一致', '从后往前', '按难度'], answer: 1, explain: '接力定位' },
      { q: '正确答案通常的特征是？', options: ['照抄原文', '换了说法但意思一致', '最长', '最短'], answer: 1, explain: '变装原则' },
      { q: '排除法应最先砍掉？', options: ['最长的', '原文完全没提到的', '最短的', '含数字的'], answer: 1, explain: '无据可依' },
      { q: '细节题的时间预算约？', options: ['5 分钟', '40 秒', '2 分钟', '不限时'], answer: 1, explain: '节奏控制' },
      { q: '细节题不是读懂做的——是 ___ 做的', options: ['找到', '猜到'], answer: 0, explain: '定位为王', type: 'blank', blank: { answerText: '找到', bank: ['找到', '猜到'] } },
    ],
  }),
  L({
    area: '地理', band: 'junior', grade: 7, id: 'geo-27', order: 821, title: '中国的气候：五种温度带', emoji: '🌡️', textbook: '人教版地理（八上）',
    curriculum: { module: '中国地理', points: ['温度带划分', '季风与非季风', '干湿地区'] },
    story: '哈尔滨人穿羽绒服过年·广州人穿短袖放鞭炮——同一个中国·为什么差这么多？答案在一条看不见的线：秦岭-淮河。以南以北·冷暖干湿各是一套规则。看懂中国的气候分区·就看懂了为什么北方吃面南方吃米。',
    goals: ['掌握五种温度带', '理解季风区与非季风区', '了解四类干湿地区'],
    aiIntro: '🌡️ 一条秦淮线·分出两个中国！',
    param: { name: 'cz', label: '气候站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['秦岭-淮河线为什么这么重要？', '夏季风怎样影响雨带？', '哪里最干哪里最湿？'],
    views: [
      { when: 1, title: '温度带', subtitle: '五个梯度', color: 'blue', emoji: '📐', blocks: [
        { kind: 'compare', title: '五带对照', items: [
          { label: '热带', value: '雷州半岛·海南·云南南部——全年无冬·水稻一年三熟' },
          { label: '亚热带', value: '秦淮线以南——冬季温和·柑橘茶叶水稻的主场（一年两熟）' },
          { label: '暖温带', value: '秦淮线至长城一线——冬冷夏热·苹果小麦主场（两年三熟）' },
          { label: '中温带', value: '长城至漠河——冬季漫长·春小麦·甜菜' },
          { label: '寒温带', value: '大兴安岭以北——最冷·针叶林·一年一熟' },
        ] },
        { kind: 'info', icon: '🏔️', title: '秦淮线的意义', text: '1 月 0°C 等温线·800 毫米等降水量线——以北河流结冰·以南不结冰；以北旱田·以南水田：一条线就是半部中国地理的目录' },
        { kind: 'highlight', text: '秦岭-淮河：中国地理最重要的分界线' },
      ] },
      { when: 2, title: '季风', subtitle: '夏雨冬干', color: 'green', emoji: '💨', blocks: [
        { kind: 'info', icon: '🌊', title: '为什么有季风', text: '海陆热力差：夏季陆地升温快→风从海洋吹向陆地（带来降水）；冬季反过来→风从陆地吹向海洋（干燥寒冷）——东亚是全球最典型的季风区' },
        { kind: 'steps', title: '雨带的三段行程', items: ['5 月：雨带登陆华南（华南前汛期）', '6-7 月：雨带北上至长江中下游——梅雨季（阴雨连绵一个月）', '7-8 月：雨带到华北东北——北方主汛期·长江进入伏旱' ] },
        { kind: 'info', icon: '🏜️', title: '非季风区', text: '大兴安岭-阴山-贺兰山-冈底斯山以西以北：夏季风鞭长莫及——干旱少雨（西北内陆·青藏高原）：季风区占国土约一半·承载八成以上人口' },
        { kind: 'highlight', text: '中国的雨是"走"出来的——跟着夏季风一路北上' },
      ] },
      { when: 3, title: '干湿', subtitle: '四个等级', color: 'amber', emoji: '💧', blocks: [
        { kind: 'compare', title: '干湿分区', items: [
          { label: '湿润区', value: '年降水>800mm——秦淮以南·东北东部：森林' },
          { label: '半湿润', value: '400-800mm——华北平原·东北大部：森林草原' },
          { label: '半干旱', value: '200-400mm——内蒙古高原·黄土高原北部：草原' },
          { label: '干旱区', value: '<200mm——西北内陆·藏北：荒漠' },
        ] },
        { kind: 'info', icon: '🏠', title: '气候决定生活', text: '南方斜顶瓦房防雨·北方平顶晒粮；南米北面·南船北马——气候分区不是考试概念·是写在建筑·饮食·农业里的活地理' },
        { kind: 'highlight', text: '温度带定"能种什么"·干湿区定"怎么种"——两条线织成中国农业地图' },
      ] },
    ],
    teach: { sections: [
      { title: '温度带', body: '【五带】热·亚热·暖温·中温·寒温。\n【秦淮线】1月0°C·800mm·水田旱田·有无结冰。\n【熟制】三熟→一熟随纬度递减。' },
      { title: '季风气候', body: '【成因】海陆热力差异（夏吸冬放）。\n【雨带】华南→梅雨→华北三级跳。\n【非季风】大-阴-贺-冈一线西北：干旱。' },
      { title: '干湿地区', body: '【四级】湿润>800·半湿400-800·半旱200-400·干旱<200。\n【植被】森林→草原→荒漠。\n【生活】南米北面·斜顶平顶。' },
    ], examples: [
      { q: '为什么梅雨出现在长江中下游？', steps: ['6-7月夏季风北上', '冷暖气团在长江流域对峙', '静止锋持续一个月', '阴雨连绵即梅雨'], tip: '雨带行程' },
      { q: '新疆为什么瓜果特别甜？', steps: ['深居内陆·非季风区', '降水少日照强昼夜温差大', '白天光合积累糖·夜间消耗少', '气候造就特产'], tip: '干湿+温差' },
    ], mistakes: ['认为秦淮线只是温度线（也是降水/农业/河流冰情线）', '把非季风区等同于不降水（有高山冰雪融水灌溉）'] },
    exercises: [
      { q: '秦岭-淮河一线大致是几月几度等温线？', options: ['1月 0°C', '7月 0°C', '1月 10°C', '7月 20°C'], answer: 0, explain: '冬季生死线' },
      { q: '秦淮线的年降水量大约是？', options: ['400mm', '800mm', '1600mm', '200mm'], answer: 1, explain: '干湿分界' },
      { q: '中国季风气候的成因是？', options: ['地形起伏', '海陆热力差异', '地球自转', '洋流'], answer: 1, explain: '夏吸冬放' },
      { q: '梅雨季节主要在？', options: ['华南', '长江中下游（6-7月）', '华北', '东北'], answer: 1, explain: '雨带第二站' },
      { q: '下列属于非季风区的是？', options: ['华北平原', '长江三角洲', '塔里木盆地', '珠江流域'], answer: 2, explain: '西北内陆' },
      { q: '温度带定"能种什么"，干湿区定"___"', options: ['怎么种', '吃什么'], answer: 0, explain: '两条线两功能', type: 'blank', blank: { answerText: '怎么种', bank: ['怎么种', '吃什么'] } },
    ],
  }),
  L({
    area: '地理', band: 'junior', grade: 8, id: 'geo-28', order: 822, title: '中国区域差异：北方与南方', emoji: '🏞️', textbook: '人教版地理（八下）',
    curriculum: { module: '中国区域地理', points: ['四大地理分区', '南北方对比', '区域差异的根源'] },
    story: '春晚收视率北方高南方低·豆腐脑咸甜之争吵翻天——这些日常差异背后是一整套地理逻辑：地形·气候·水源·历史共同写就了中国四大区域。这一课把"南方北方"从刻板印象升级为地理分析。',
    goals: ['掌握四大地理分区', '系统对比南北方', '理解差异的地理根源'],
    aiIntro: '🏞️ 咸甜之争的地理真相——南北方差异！',
    param: { name: 'rg', label: '区域站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么北方吃面南方吃米？', '四大区域怎样划分？', '差异能消除吗？'],
    views: [
      { when: 1, title: '四区', subtitle: '地理版图', color: 'blue', emoji: '🗺️', blocks: [
        { kind: 'compare', title: '四大地理区域', items: [
          { label: '北方地区', value: '秦淮以北·长城以南——平原广阔·半湿润：小麦玉米·重工业发达（东北·华北）' },
          { label: '南方地区', value: '秦淮以南——丘陵水网·湿润：水稻油菜·轻工业外贸活跃（长三角·珠三角）' },
          { label: '西北地区', value: '长城·昆仑山以北以西——干旱：草原荒漠·畜牧业·绿洲农业' },
          { label: '青藏地区', value: '横断山以西·昆仑以南——高寒：日照强温差大·河谷农业·牦牛' },
        ] },
        { kind: 'info', icon: '📏', title: '分界线速记', text: '北方/南方=秦岭淮河；北方/西北=400mm 降水线（长城大致重合）；青藏/其余=地势一二级阶梯（昆仑·祁连·横断）——三条线四个区' },
        { kind: 'highlight', text: '三大界线切出四大区域——每条线背后都是自然差异' },
      ] },
      { when: 2, title: '南 vs 北', subtitle: '六个维度', color: 'green', emoji: '⚖️', blocks: [
        { kind: 'compare', title: '南北方全对比', items: [
          { label: '气候', value: '北方：温带季风·冬冷夏热·年降水<800mm；南方：亚热带季风·冬季温和·降水丰沛' },
          { label: '地形', value: '北方：平原高原为主（东北·华北·黄土高原）；南方：丘陵山地为主（东南丘陵·云贵高原）+长江珠江三角洲' },
          { label: '农业', value: '北方：旱田小麦玉米·一年一至两熟；南方：水田水稻油菜·一年两至三熟' },
          { label: '交通', value: '北方：陆路为主（古有马车）；南方：水运发达（古有船——"南船北马"）' },
          { label: '饮食', value: '北方：面食为主（馒头·面条·饺子）；南方：米饭为主（米粉·粽子·汤圆）' },
          { label: '建筑', value: '北方：墙厚窗小平顶（防寒保温）；南方：墙薄窗大斜顶（通风排水）' },
        ] },
        { kind: 'highlight', text: '南北方差异不是谁好谁坏——是地理条件的两套方案' },
      ] },
      { when: 3, title: '根源', subtitle: '差异的因果链', color: 'amber', emoji: '⛓️', blocks: [
        { kind: 'steps', title: '一条因果链', items: ['根源：气候（温度+降水）差异——由纬度+季风决定', '第二层：影响农业类型（旱田vs水田·小麦vs水稻）', '第三层：塑造生活方式（饮食·建筑·交通）', '最外层：形成文化性格与习俗（方言·节庆·审美）——地理是因·文化是果' ] },
        { kind: 'info', icon: '🔄', title: '差异在缩小吗', text: '高铁网络·南水北调·人口流动让差异快速融合——但地理基础不会消失：北方的供暖制度·南方的梅雨季依然精准运转：变的是交流速度·不变的是自然本底' },
        { kind: 'info', icon: '🌍', title: '用地理眼光看热点', text: '东北人口外流（产业结构+气候）·南方供暖讨论（生活水平提升后对舒适的追求）·"回南天"（暖湿气流遇冷凝结）——学会用分区思维分析身边现象' },
        { kind: 'highlight', text: '地理是文化的基础设施——读懂差异就读懂中国' },
      ] },
    ],
    teach: { sections: [
      { title: '四大分区', body: '【北方】秦淮以北长城以南·旱作平原。\n【南方】秦淮以南·水田丘陵。\n【西北】干旱牧区绿洲。\n【青藏】高寒河谷。\n【界线】秦淮线·400mm线·阶梯线。' },
      { title: '南北方对比', body: '【气候】温带vs亚热带季风。\n【地形】平原高原vs丘陵水网。\n【农业】旱麦vs水稻。\n【生活】面·陆·厚墙vs米·船·斜顶。' },
      { title: '差异根源', body: '【链条】气候→农业→生活→文化。\n【趋势】交通通信缩小表象·地理本底不变。\n【应用】用分区思维看社会现象。' },
    ], examples: [
      { q: '为什么北方菜量大南方菜精致？', steps: ['北方寒冷需热量多', '物产大宗（小麦玉米）', '南方物产多样精细', '气候影响饮食习惯的地理解释'], tip: '因果链' },
      { q: '"南船北马"的地理基础是什么？', steps: ['南方水系密布·降水丰沛', '船运天然便利', '北方平原为主·河流少', '陆路马车优势——地形决定交通'], tip: '地形→交通' },
    ], mistakes: ['把南北方差异当文化优劣（是地理条件的两套方案）', '认为区域差异会完全消失（自然基础长存）'] },
    exercises: [
      { q: '北方地区与南方地区的分界线是？', options: ['长城', '秦岭-淮河', '长江', '昆仑山'], answer: 1, explain: '最重要的地理分界线' },
      { q: '西北地区最突出的自然特征是？', options: ['高寒', '干旱', '湿热', '冷湿'], answer: 1, explain: '深居内陆' },
      { q: '青藏地区农业主要分布在？', options: ['高山顶部', '河谷地带（雅鲁藏布江谷地）', '荒漠', '海岸'], answer: 1, explain: '河谷热量条件较好' },
      { q: '"南船北马"反映的地理差异是？', options: ['饮食', '地形与水系对交通的影响', '方言', '服饰'], answer: 1, explain: '地形决定交通' },
      { q: '区域差异的最终根源是？', options: ['文化传统', '自然条件（气候地形）', '政策', '历史'], answer: 1, explain: '地理是因文化是果' },
      { q: '地理是文化的 ___——读懂差异就读懂中国', options: ['基础设施', '敌人'], answer: 0, explain: '基础决定上层', type: 'blank', blank: { answerText: '基础设施', bank: ['基础设施', '敌人'] } },
    ],
  }),
  L({
    area: '音乐', band: 'junior', grade: 7, id: 'mus-34', order: 823, title: '简谱五线谱：两种读谱法', emoji: '🎼', textbook: '音乐（简谱版）',
    curriculum: { module: '乐理基础', points: ['简谱数字体系', '五线谱入门', '两种谱的对照'] },
    story: '音乐课上老师给了一份五线谱·你只会看简谱——像拿着英文菜单只会中文点菜。其实两种谱是同一门语言的两种写法：简谱用数字·五线谱用位置。学会对照·两种谱都能开口"读"音乐。',
    goals: ['掌握简谱的数字体系', '认识五线谱基本元素', '能在两种谱之间对照'],
    aiIntro: '🎼 两种"读音乐"的文字——简谱与五线谱！',
    param: { name: 'nt', label: '乐谱站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['1234567 各代表什么？', '五线谱的五条线代表什么？', '为什么中国普及简谱？'],
    views: [
      { when: 1, title: '简谱', subtitle: '数字音乐', color: 'blue', emoji: '🔢', blocks: [
        { kind: 'info', icon: '7️⃣', title: '七个基本音', text: '1=do 2=re 3=mi 4=fa 5=sol 6=la 7=si——数字就是音高：大调音阶的骨架。0 = 休止符（不唱）·— = 延长线（拖一拍）' },
        { kind: 'info', icon: '♯', title: '升降与高低八度', text: '#升半音 b降半音；上面加点=高八度·下面加点=低八度——加点是简谱的"楼层标记"：1（低音do）1（中音do）1̣（高音do）' },
        { kind: 'info', icon: '2/4', title: '拍号', text: '分数形式：分母=以几分音符为一拍·分子=每小节几拍——2/4 拍=每小节2拍·以四分音符为一拍：拍号写在乐曲开头' },
        { kind: 'highlight', text: '简谱=用数字写音乐：好学·好抄·好移调' },
      ] },
      { when: 2, title: '五线谱', subtitle: '位置音乐', color: 'green', emoji: '📊', blocks: [
        { kind: 'steps', title: '五线谱入门', items: ['五条线·四个间——从下往上数：第一线（最低）到第五线（最高）', '高音谱号（G谱号）画在第二线：由此确定其他音的位置', '中央C在高音谱号下方加一线——"上门槛"的位置', '线不够用→加线（上加一线·下加一线）：音高沿"线间线间"阶梯排列' ] },
        { kind: 'info', icon: '🎹', title: '口诀背位置', text: '高音谱号线上的音（从下往上）：E G B D F——「Every Good Boy Does Fine」；间里的音：F A C E——正好拼"FACE"：英语口诀是最快的入门法' },
        { kind: 'info', icon: '🔊', title: '五线谱的优势', text: '音高走向一目了然（旋律的起伏看得见）·多声部同时呈现（钢琴双手·合唱声部）——全世界通用的"音乐文字"' },
        { kind: 'highlight', text: '五线谱=用位置写音乐：直观·国际·多声部' },
      ] },
      { when: 3, title: '对照', subtitle: '翻译官', color: 'amber', emoji: '🔄', blocks: [
        { kind: 'compare', title: '两种谱', items: [
          { label: '记录方式', value: '简谱=数字（1 2 3…）；五线谱=位置（线与间）' },
          { label: '擅长领域', value: '简谱→单旋律·民歌·流行（移调方便——换个调只需换调号数字不变）；五线谱→器乐·多声部·古典（精确·国际通行）' },
          { label: '文化背景', value: '简谱源于法国·经日本传入中国后大规模普及（扫盲利器）；五线谱是欧洲记谱传统的延续——两者不是先进落后·是场景不同' },
        ] },
        { kind: 'info', icon: '🎼', title: '练习建议', text: '每天 5 分钟视唱：拿简谱歌曲对照五线谱弹/唱——一个月后两种谱都能开口。会双谱的人·打开的音乐世界翻倍' },
        { kind: 'highlight', text: '双谱在手·天下音乐任你读' },
      ] },
    ],
    teach: { sections: [
      { title: '简谱', body: '【基本】1-7 对应 do-si；0=休止。\n【升降】#升 b降·上下加点变八度。\n【拍号】分数：分母几分一拍·分子几拍。' },
      { title: '五线谱', body: '【结构】五线四间·从下往上数。\n【谱号】高音G谱号定基准。\n【口诀】线EGBDF·间FACE。\n【加线】不够用往上下加。' },
      { title: '对照', body: '【方式】数字vs位置。\n【场景】简谱擅移调单旋律·五线擅多声部。\n【建议】每日5分钟双谱视唱。' },
    ], examples: [
      { q: '简谱 3 2 1 用唱名读出来？', steps: ['3=mi 2=re 1=do', '倒着的音阶', '像"小星星"结尾', '看数字想唱名'], tip: '数字翻译' },
      { q: '五线谱高音谱号第二线是什么音？', steps: ['口诀 Every Good Boy…', '第二线=G', 'G谱号就画在这条线上', '找到锚点推其他'], tip: '锚点法' },
    ], mistakes: ['简谱加点方向弄反（上加点高八度·下加点低八度）', '五线谱从上往下数线（应从下往上）'] },
    exercises: [
      { q: '简谱中 1 对应的唱名是？', options: ['re', 'do', 'mi', 'sol'], answer: 1, explain: 'do' },
      { q: '简谱中的 0 代表？', options: ['高音', '休止符', '重拍', '结束'], answer: 1, explain: '不发声' },
      { q: '简谱数字下面加点表示？', options: ['高八度', '低八度', '重音', '休止'], answer: 1, explain: '楼层标记' },
      { q: '高音谱号五条线上的音（从下往上）是？', options: ['A C E G B', 'E G B D F', 'C D E F G', 'F A C E'], answer: 1, explain: 'Every Good Boy Does Fine' },
      { q: '简谱的最大优势是？', options: ['最好看', '移调方便·好学易抄', '最古老', '最难'], answer: 1, explain: '数字不变换调号即可' },
      { q: '双谱在手·天下音乐任你 ___', options: ['读', '猜'], answer: 0, explain: '会读=打开世界', type: 'blank', blank: { answerText: '读', bank: ['读', '猜'] } },
    ],
  }),
  L({
    area: '音乐', band: 'junior', grade: 8, id: 'mus-35', order: 824, title: '歌唱进阶：气息与咬字', emoji: '🎤', textbook: '音乐（简谱版）',
    curriculum: { module: '声乐基础', points: ['气息控制', '咬字吐字', '情感表达'] },
    story: '同一个教室里有人唱歌像清泉·有人像"念经"——差别不在嗓子·在方法。歌唱的三大基本功：气息（发动机）·咬字（方向盘）·情感（目的地）。这一课从"会哼"到"会唱"的距离。',
    goals: ['掌握气息控制方法', '改善咬字清晰度', '学会用情感驱动演唱'],
    aiIntro: '🎤 从"会哼"到"会唱"的距离！',
    param: { name: 'vc', label: '歌唱站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么唱两句就没气？', '唱歌像"含着茄子"怎样改？', '怎样唱出感情？'],
    views: [
      { when: 1, title: '气息', subtitle: '发动机', color: 'blue', emoji: '💨', blocks: [
        { kind: 'steps', title: '腹式呼吸三步', items: ['吸气：肚子鼓起（不是抬胸）——像闻花香·气沉丹田', '保持：小腹微收稳住气流——像"托住"一口气', '呼气：均匀细长地送出——像吹一根蜡烛但不吹灭：省气才是好气息' ] },
        { kind: 'info', icon: '⚠️', title: '两大错误', text: '① 抬胸耸肩呼吸（气浅·两句就没气）；② 一口气全喷出去（前响后虚）——唱歌的气像花钱：会挣更要会省' },
        { kind: 'info', icon: '💪', title: '每日 3 分钟练习', text: '闻花香吸 4 拍→保持 4 拍→嘶~ 呼 8 拍（牙缝出气）——两周气息耐力翻倍：所有声乐老师的第一课' },
        { kind: 'highlight', text: '气息是歌唱的发动机——不练气一切免谈' },
      ] },
      { when: 2, title: '咬字', subtitle: '方向盘', color: 'green', emoji: '👄', blocks: [
        { kind: 'steps', title: '咬字三关', items: ['字头（声母）：咬准但不咬死——"床前明月光"的 ch 要清晰不僵硬', '字腹（韵母）：引长保持——"光 gu-ang"的 ang 拖足拍子：唱歌主要唱的是字腹', '字尾（归韵）：收干净——"江 jiang"结尾归到 ng·不能散掉：字尾不收·听起来像"口含茄子"' ] },
        { kind: 'info', icon: '📖', title: '朗读导入法', text: '先把歌词像朗诵一样大声读三遍（字正腔圆）·再加旋律唱——说都说不清的歌·唱出来必然含糊：朗读是咬字的排毒操' },
        { kind: 'info', icon: '🀄', title: '十三辙速记', text: '中文歌词押韵的十三大类别（发花辙·中东辙·江阳辙…）——知道归韵类别·字尾统一收法：合唱"齐不齐"听的就是这个' },
        { kind: 'highlight', text: '字头咬准·字腹唱圆·字尾归韵——好咬字三步走' },
      ] },
      { when: 3, title: '情感', subtitle: '目的地', color: 'rose', emoji: '💖', blocks: [
        { kind: 'steps', title: '三步唱出感情', items: ['读懂歌词：这首歌在讲什么故事？（离别？思念？欢乐？）——先感动自己', '设计强弱：高潮强·叙述弱——像说话有语气（全程一个力度=念经）', '气息配合情感：深情时气缓声轻·激昂时气足声亮：技术为情感服务' ] },
        { kind: 'info', icon: '🎭', title: '一个练习', text: '同一句"我爱你中国"用三种方式唱：自豪的·温柔的·深情的——感受气息·力度·速度怎样跟着变：情感不是天赋·是可以设计的表现' },
        { kind: 'highlight', text: '技术给你能力·情感给你方向——先想感动谁·再决定怎样唱' },
      ] },
    ],
    teach: { sections: [
      { title: '气息控制', body: '【腹式】吸鼓肚子·保持微收·呼气匀长。\n【错误】耸肩浅呼吸·一口气喷完。\n【练习】闻花香4拍·保4拍·嘶8拍。' },
      { title: '咬字吐字', body: '【三关】字头准·字腹圆·字尾归韵。\n【方法】朗读导入·先读清再唱。\n【十三辙】归韵分类·合唱齐不齐的关键。' },
      { title: '情感表达', body: '【三步】读懂→设计强弱→气息配合。\n【原则】技术为情感服务。\n【练习】同一句三种情感唱法。' },
    ], examples: [
      { q: '唱歌总两句就气不够', steps: ['检查：是否抬胸浅呼吸', '练腹式：吸4保4嘶8', '高音区提前吸气', '气息耐力两周一变'], tip: '发动机升级' },
      { q: '同学说我唱歌含糊不清', steps: ['歌词大声读三遍', '注意字尾归韵', '字腹拉长唱满', '录音回听——自己的耳朵是最好的老师'], tip: '方向盘校正' },
    ], mistakes: ['用胸口浅呼吸唱歌（腹式才持久）', '只顾声音不注意咬字（听不清等于白唱）'] },
    exercises: [
      { q: '歌唱气息的正确呼吸方式是？', options: ['抬胸耸肩', '腹式呼吸（肚子鼓起）', '憋气', '用嘴猛吸'], answer: 1, explain: '气沉丹田' },
      { q: '唱歌时主要"唱"的是字的哪个部分？', options: ['字头', '字腹（韵母拉长）', '字尾', '声母'], answer: 1, explain: '韵母拖拍' },
      { q: '"字尾归韵"指的是？', options: ['咬重字尾', '字尾收到对应韵母（如ang收ng）', '不收', '换气'], answer: 1, explain: '十三辙' },
      { q: '改善咬字最有效的方法是？', options: ['多唱', '歌词大声朗读', '吃润喉糖', '喝水'], answer: 1, explain: '朗读排毒操' },
      { q: '唱出感情的第一步是？', options: ['唱大声', '读懂歌词的故事', '闭眼', '模仿'], answer: 1, explain: '先感动自己' },
      { q: '技术给你能力·情感给你 ___', options: ['方向', '压力'], answer: 0, explain: '先想感动谁', type: 'blank', blank: { answerText: '方向', bank: ['方向', '压力'] } },
    ],
  }),
  L({
    area: '劳动', band: 'junior', grade: 8, id: 'lab-37', order: 825, title: '衣物修补：从钉扣到缝裂', emoji: '🧵', textbook: '人教版劳动（初中）',
    curriculum: { module: '手工技能', points: ['针法基础', '钉扣子进阶', '缝补裂口'] },
    story: '校服破了洞·扣子掉了线——扔掉可惜·送裁缝铺又贵又远。其实自己动手 15 分钟就能修好：一针一线的手艺·既是环保·也是生活的底气。这一课从"会钉扣子"升级到"会缝裂口"。',
    goals: ['掌握四种基本针法', '学会双孔和四眼扣子', '能缝补衣物裂口'],
    aiIntro: '🧵 一针一线·衣物的急救室！',
    param: { name: 'sw', label: '缝纫站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['平针和回针各用在哪？', '四眼扣子怎样缝才牢固？', '裂口怎样缝才不皱？'],
    views: [
      { when: 1, title: '针法', subtitle: '四把武器', color: 'blue', emoji: '🪡', blocks: [
        { kind: 'compare', title: '基本针法对照', items: [
          { label: '平针', value: '一进一出最简单——适合临时固定·疏缝定位（像"别针"）：快但不牢' },
          { label: '回针', value: '缝一针退半针——最结实的常用针法（像"手缝版的锁边"）：衣物裂口首选' },
          { label: '锁边缝', value: '绕布边缝一圈——防止毛边脱线：牛仔裤裤脚·毛巾边' },
          { label: '藏针缝', value: '针脚藏在折叠层内——正面看不见线迹：玩偶·枕头封口的最优雅针法' },
        ] },
        { kind: 'info', icon: '🧷', title: '穿线打结', text: '线长=手臂伸直的距离（太长打结·太短反复穿）；线尾打结：绕指一圈拉紧即成——打结的小功夫决定缝纫的顺利度' },
        { kind: 'highlight', text: '平针快·回针牢·锁边防脱·藏针美观——四把武器各司其职' },
      ] },
      { when: 2, title: '扣子', subtitle: '双孔与四眼', color: 'green', emoji: '🔘', blocks: [
        { kind: 'steps', title: '四眼扣标准缝法', items: ['穿线打结·从布的正面出针（位置=扣子中心）', '对角线穿过扣眼（1→3→2→4 交叉缝）——更牢固', '缝 5-6 圈后留"线柱"：扣子和布之间留 2mm 空隙（大衣扣要更松）', '绕线柱 3-5 圈（形成颈部·扣子不贴布才好扣）→从背面入针打结剪线' ] },
        { kind: 'info', icon: '⚠️', title: '常见失败', text: '①扣子贴布太紧→扣不上（忘记留线柱）；②没打结就剪线→前功尽弃；③线太细→双股线更耐用——每个失败都有对应的技术解' },
        { kind: 'info', icon: '🧥', title: '带脚扣子', text: '大衣扣子背面有个小脚——缝法一样但线柱更高（约4mm）：厚布料需要更高的"颈"才穿得进扣眼' },
        { kind: 'highlight', text: '扣子牢不牢看线柱·不是看圈数' },
      ] },
      { when: 3, title: '裂口', subtitle: '急救流程', color: 'amber', emoji: '🏥', blocks: [
        { kind: 'steps', title: '裂口缝补四步', items: ['评估：裂口方向和大小（直线小口最好缝·不规则大口考虑补丁）', '对齐：把裂口两边自然合拢（不要拉伸——布纹对齐·皱褶抚平）', '选针法：直线裂口用回针沿裂口缝 0.5cm 边距；毛边处加锁边防脱', '收尾：翻到背面打结·剪线——检查正面是否平整不皱' ] },
        { kind: 'info', icon: '🩹', title: '创意补丁', text: '裂口太大不好缝？用布贴/刺绣盖住——牛仔膝盖上绣朵花·书包上贴个补丁贴：修补可以比原来更好看（"金缮"精神：伤痕变特色）' },
        { kind: 'info', icon: '🌱', title: '为什么要修', text: '一件衣服的全生命周期碳排放约 10kg——多穿九个月碳足迹降约 20%：修补不是抠门·是最直接的环保行动：一针一线的碳账' },
        { kind: 'highlight', text: '会缝补的手·让衣柜多活十年' },
      ] },
    ],
    teach: { sections: [
      { title: '基本针法', body: '【平针】临时固定·快。\n【回针】最结实·裂口首选。\n【锁边】防毛边脱线。\n【藏针】正面无痕。\n【线长】一臂·双股更牢。' },
      { title: '钉扣子', body: '【四眼】对角交叉缝5-6圈。\n【线柱】留2mm空隙绕颈3-5圈。\n【带脚扣】线柱更高约4mm。\n【关键】柱高决定好扣不好扣。' },
      { title: '裂口缝补', body: '【四步】评估→对齐布纹→回针缝合→锁边收尾。\n【补丁】布贴刺绣——金缮精神。\n【碳账】多穿九月碳降两成。' },
    ], examples: [
      { q: '校服袖口裂了一条 3cm 的口', steps: ['评估：直线小口·回针可缝', '对齐布纹', '回针沿边 0.5cm 缝', '锁边防脱·翻面打结'], tip: '回针首选' },
      { q: '扣子缝好了但扣不上', steps: ['诊断：线柱太矮', '拆掉重缝', '留 2mm 空隙再绕颈', '厚布料留更高'], tip: '线柱高度' },
    ], mistakes: ['扣子贴布缝死不留线柱（扣不进扣眼）', '线不打结就剪（全部松脱）'] },
    exercises: [
      { q: '最结实的常用针法是？', options: ['平针', '回针', '锁边', '藏针'], answer: 1, explain: '缝一退半' },
      { q: '防止布边毛线脱散的针法？', options: ['平针', '回针', '锁边缝', '直针'], answer: 2, explain: '绕边一圈' },
      { q: '扣子和布之间要留空隙（线柱）因为？', options: ['好看', '布料不同', '扣子要扣进扣眼需要空间', '省线'], answer: 2, explain: '柱高定好扣' },
      { q: '缝直线裂口首选？', options: ['胶水', '回针缝合', '别针', '扔掉'], answer: 1, explain: '最结实' },
      { q: '一件衣服多穿九个月碳足迹约降？', options: ['2%', '20%', '50%', '90%'], answer: 1, explain: '一针一线的碳账' },
      { q: '会缝补的手·让衣柜多活 ___', options: ['十年', '一天'], answer: 0, explain: '修补的寿命', type: 'blank', blank: { answerText: '十年', bank: ['十年', '一天'] } },
    ],
  }),
  L({
    area: '劳动', band: 'junior', grade: 8, id: 'lab-38', order: 826, title: '出行规划：一次旅行的项目管理', emoji: '🎒', textbook: '人教版劳动（初中）',
    curriculum: { module: '生活管理', points: ['行程规划', '预算管理', '安全预案'] },
    story: '全家出游你去哪儿都是"跟队"——这一课换你当领队：从选目的地到算预算·从排行程到备预案·完整规划一次周末两日游。规划旅行就是一次微缩的项目管理·学会了它·你的人生大小事都有了"方法论"。',
    goals: ['学会行程规划方法', '掌握旅行预算', '掌握安全预案'],
    aiIntro: '🎒 你来当领队——出行规划课！',
    param: { name: 'tp', label: '出行站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['行程怎样排不赶不闲？', '预算怎样做不超支？', '出门在外怎样保安全？'],
    views: [
      { when: 1, title: '行程', subtitle: '节奏的艺术', color: 'blue', emoji: '🗓️', blocks: [
        { kind: 'steps', title: '行程规划五步', items: ['定主题：这次旅行要什么？（自然/人文/美食/放松——选一个不贪多）', '选锚点：2-3 个"必须去"的核心地点（锚点定方向）', '排节奏：每天 1 个主锚点+1-2 个副选——景点间车程不超 1.5h·留白 20%', '查时段：营业时间·预约需求·周几闭馆——查一次省一次白跑', '备选单：下雨/排队太长时的 Plan B（室内馆·备用路线）' ] },
        { kind: 'info', icon: '⚠️', title: '新手最大错误', text: '贪多：一天排五个景点=每个都赶路·哪个都没体验——"少而深"比"多而浅"旅行的价值高三倍：行程的智慧在做减法' },
        { kind: 'highlight', text: '好行程=锚点定方向·留白保弹性·减法出品质' },
      ] },
      { when: 2, title: '预算', subtitle: '四桶分钱', color: 'green', emoji: '💰', blocks: [
        { kind: 'compare', title: '预算四桶', items: [
          { label: '交通桶', value: '大交通（车票机票）+当地交通（公交/打车）——提前订通常更便宜' },
          { label: '住宿桶', value: '住的位置>装修：离核心区近省通勤时间（时间也是钱）——人均预算×晚数' },
          { label: '餐饮桶', value: '每天 2 正餐+1 小吃——当地特色留 1-2 顿"放开吃"·其他简餐' },
          { label: '门票杂费', value: '景点门票+体验项目+备用金（总预算的 10%）——备用金是安全气囊' },
        ] },
        { kind: 'info', icon: '📱', title: '工具推荐', text: '表格 App 或纸笔记账：出发前分桶预算→旅行中随手记→回来复盘——预算管理的完整闭环（学到的正好用在家庭财务）' },
        { kind: 'highlight', text: '预算不是限制快乐——是让快乐不超支' },
      ] },
      { when: 3, title: '安全', subtitle: '预案手册', color: 'rose', emoji: '🛡️', blocks: [
        { kind: 'steps', title: '出行安全四件套', items: ['证件备份：身份证拍照存云+纸质复印件分开放——丢了不慌', '紧急联系卡：写清家人电话+住宿地址+血型过敏史——放随身口袋', '财物分散：大额现金分两处放·手机不开免密支付——丢一处不全失', '天气预案：出发前查三天天气·极端天气果断改期——敬畏自然' ] },
        { kind: 'info', icon: '🆘', title: '突发应对', text: '迷路→原地不动打电话（比乱走更易找）；受伤→就近医院不做"网上医生"；被宰→留证据回来投诉（12345/12315）——预案的价值是遇事不慌' },
        { kind: 'info', icon: '🧳', title: '打包清单', text: '证件·充电器·常用药·雨具·换洗两套——按"没它会麻烦"分优先级：行李的减法也是旅行的减法' },
        { kind: 'highlight', text: '预案不是焦虑——是让你放开玩的底气' },
      ] },
    ],
    teach: { sections: [
      { title: '行程规划', body: '【五步】定主题→选锚点→排节奏→查时段→备选单。\n【原则】少而深·留白20%·车程<1.5h。\n【大忌】贪多赶路。' },
      { title: '预算管理', body: '【四桶】交通·住宿·餐饮·门票杂费。\n【备用金】总预算10%安全气囊。\n【方法】分桶→记录→复盘闭环。' },
      { title: '安全预案', body: '【四件】证件备份·紧急卡·财物分散·天气查。\n【突发】迷路原地等·就近就医·留证投诉。\n【打包】按"没它麻烦"排序。' },
    ], examples: [
      { q: '两天一夜去 nearby 古镇，怎样规划？', steps: ['主题：文化+美食', '锚点：古镇核心区+一家老字号', 'D1下午到·D2上午回·留白半天', '预算四桶分好·备用金10%'], tip: '少而深' },
      { q: '出发前发现目的地有暴雨预警', steps: ['查预警级别', '极端天气果断改期', '启用备选单（Plan B）', '敬畏自然不冒险'], tip: '天气预案' },
    ], mistakes: ['行程贪多（赶路毁体验）', '不留备用金（意外来时无缓冲）'] },
    exercises: [
      { q: '行程规划第一步是？', options: ['订酒店', '定主题（这次要什么）', '买车票', '查天气'], answer: 1, explain: '方向先行' },
      { q: '新手行程规划最大的错误是？', options: ['订贵酒店', '贪多赶路', '带太多行李', '拍照少'], answer: 1, explain: '少而深' },
      { q: '备用金建议占总预算？', options: ['1%', '10%', '50%', '不需要'], answer: 1, explain: '安全气囊' },
      { q: '证件备份的正确做法？', options: ['全放钱包', '拍照存云+纸质分开放', '让朋友拿着', '不带'], answer: 1, explain: '分放防全失' },
      { q: '在景区迷路了应该？', options: ['乱走找路', '原地不动打电话求助', '跑', '哭'], answer: 1, explain: '原地更易被找到' },
      { q: '预案不是焦虑——是让你放开玩的 ___', options: ['底气', '负担'], answer: 0, explain: '准备换自由', type: 'blank', blank: { answerText: '底气', bank: ['底气', '负担'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成 8 节:', LESSONS.map((l) => l.id).join(', '));
