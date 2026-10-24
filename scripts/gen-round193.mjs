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
    area: '英语', band: 'senior', grade: 10, id: 'eng-46', order: 1052, title: '网络用语与缩写：数字英语', emoji: '💬', textbook: '英语（高中拓展）',
    curriculum: { module: '语言与文化', points: ['常见网络用语', '缩写的规律', '正式与非正式的边界'] },
    story: 'brb·lol·FYI·ASAP——聊天窗口里的英语像另一种语言。它是英语的「堕落」还是活力？这一课读懂数字时代的英语·更学会什么时候该用·什么时候千万别用。',
    goals: ['认识常见网络用语', '掌握缩写规律', '分清正式与非正式场合'],
    aiIntro: '💬 键盘上的英语——网络用语与缩写',
    param: { name: 'nw', label: '网络语站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['lol 是什么意思？', '缩写有规律吗？', '作文里能用吗？'],
    views: [
      { when: 1, title: '词表', subtitle: '高频用语', color: 'blue', emoji: '📇', blocks: [
        { kind: 'compare', title: '高频缩写', items: [
          { label: 'ASAP', value: 'as soon as possible 尽快——商务邮件也常用（不算太随意）' },
          { label: 'FYI', value: 'for your information 供参考——转发资料时的开头' },
          { label: 'brb', value: 'be right back 马上回来——聊天临时离开' },
          { label: 'tbh / imo', value: 'to be honest 说实话 / in my opinion 依我看——表达观点的缓冲垫' },
        ] },
        { kind: 'compare', title: '高频俚语', items: [
          { label: 'lol', value: 'laugh out loud 大声笑——注意：在长辈聊天里可能被理解成 lots of love（闹过大笑话）：语境！' },
          { label: 'meme', value: '网络梗图——文化单位：一张图一个梗传播全球' },
          { label: 'vlog / blog', value: 'video blog / web log——v 和 b 开头的组合造词' },
          { label: 'GOAT', value: 'Greatest Of All Time 史上最佳（夸偶像用）——大写缩写成新词' },
        ] },
        { kind: 'highlight', text: 'ASAP 谈工作·lol 发梗图——数字英语有自己的词典' },
      ] },
      { when: 2, title: '规律', subtitle: '造词三招', color: 'green', emoji: '🧩', blocks: [
        { kind: 'steps', title: '缩写三规律', items: ['首字母法：FYI·ASAP·BTW（by the way 顺便说）——取每个词首字母', '谐音法：u=you·c=see·b4=before·2moro=tomorrow——数字和字母代音：拼音输入的英语版', '截短法：info(information)·app(application)·vocab(vocabulary)——砍尾巴留前段：很多已转正（app 谁还写全称？）' ] },
        { kind: 'info', icon: '⏳', title: '语言的达尔文', text: '语言一直在变——莎士比亚时代的拼写和今天天差地别：网络用语是语言在数字环境的适应：有的会消失（谁还记得冲浪「surfing the web」的字面义）·有的会转正（OK 最初也是缩写梗）：活的语言不守规矩·但有自己的淘汰赛' },
        { kind: 'highlight', text: '首字母·谐音·截短——三招看懂大多数缩写' },
      ] },
      { when: 3, title: '边界', subtitle: '正式与非正式', color: 'amber', emoji: '⚖️', blocks: [
        { kind: 'compare', title: '场合对照', items: [
          { label: '可以用的地方', value: '和朋友聊天·游戏语音·社交媒体评论——非正式场合用缩写自然亲切（全拼反而显得生分）' },
          { label: '别用的地方', value: '高考作文·申请信·正式邮件·学术论文——阅卷老师和招生官眼里 lol=u（you）是硬伤：正式文书一个缩写都不该出现' },
          { label: '灰色地带', value: '给老师的邮件（部分常用的 FYI/ASAP 尚可·lol 绝不）；公司内部聊天（看公司文化）：拿不准就全拼——全拼永远不会错' },
        ] },
        { kind: 'info', icon: '🎯', title: '考察方式', text: '高考不考网络用语·但读理解可能出现（科技与文化类文章谈语言变迁）——读懂它即可：写作文用它=主动扣分：认识它·不成为它' },
        { kind: 'highlight', text: '聊天随意用·考试全拼——拿不准就完整拼写' },
      ] },
    ],
    teach: { sections: [
      { title: '高频词表', body: '【缩写】ASAP尽快·FYI参考·brb回来说。\n【俚语】lol笑·meme梗·GOAT史上最佳。' },
      { title: '三规律', body: '【首字母】FYI·BTW。【谐音】u·b4·2moro。\n【截短】info·app·vocab（多数已转正）。' },
      { title: '使用边界', body: '【可用】聊天社交媒体。【禁用】作文申请信论文。\n【灰色】邮件看对象——拿不准全拼。' },
    ], examples: [
      { q: '读游戏聊天记录', steps: ['识别缩写类别', '首字母/谐音/截短', '上下文验证理解', '积累进小本'], tip: '三招拆解' },
      { q: '给外教写邮件想用 thx', steps: ['邮件属正式文书', '改成 Thank you', '全文检查无缩写', '养成场合意识'], tip: '正式全拼' },
    ], mistakes: ['作文里用 u/thx 省字数（正式文书零缩写）', '把网络用语当「错误英语」（是语言的活变化·分场合即可）'] },
    exercises: [
      { q: 'ASAP 的意思是？', options: ['尽快', '再见', '谢谢', '晚安'], answer: 0, explain: 'as soon as possible' },
      { q: 'FYI 用于？', options: ['道歉', '供对方参考', '点餐', '报警'], answer: 1, explain: 'for your information' },
      { q: 'b4（before）的造词方法是？', options: ['首字母', '数字代音', '截短', '倒写'], answer: 1, explain: '4=fore' },
      { q: 'app（application）属于哪种缩写？', options: ['首字母', '谐音', '截短', '外来语'], answer: 2, explain: '砍尾巴留前段' },
      { q: '高考作文里应该？', options: ['多用缩写显水平', '零缩写全拼', '用表情符号', '中英混杂'], answer: 1, explain: '正式文书' },
      { q: '网络用语是语言对数字环境的？', options: ['堕落', '适应'], answer: 1, explain: '活的语言总在变', type: 'blank', blank: { answerText: '适应', bank: ['适应', '堕落'] } },
    ],
  }),
  L({
    area: '英语', band: 'senior', grade: 11, id: 'eng-47', order: 1053, title: '图表描述：用英语说数据', emoji: '📊', textbook: '英语（高中拓展）',
    curriculum: { module: '学术英语', points: ['趋势词汇', '比较句型', '小作文实战'] },
    story: '一张折线图——英语怎么说「先涨后跌」「稳中有升」？新课标和高考越来越爱考图表描述。这一课装上一套「数据语言」工具箱·让图表开口说英语。',
    goals: ['掌握趋势描述词汇', '学会比较句型', '完成图表小作文'],
    aiIntro: '📊 让图表开口说英语——图表描述',
    param: { name: 'cd2', label: '图表站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['「先涨后跌」怎么说？', '怎样比较两组数据？', '小作文怎样谋篇？'],
    views: [
      { when: 1, title: '趋势', subtitle: '动词工具箱', color: 'blue', emoji: '📈', blocks: [
        { kind: 'compare', title: '趋势三态', items: [
          { label: '上升', value: 'rise / increase / go up / climb（升）·soar / surge / rocket（飙升）——程度副词：sharply 急剧·steadily 稳步·slightly 略微' },
          { label: '下降', value: 'fall / drop / decline / decrease（降）·plunge / plummet（暴跌）——记住成对：升就配 sharply·降也配 sharply' },
          { label: '平稳与拐点', value: 'remain stable / level off（走平）·fluctuate（波动）·peak at（达峰）·bottom out（触底）：先涨后跌 = rise to a peak in June, then decline' },
        ] },
        { kind: 'info', icon: '🔁', title: '换词的学问', text: '一幅图写三段——rise 不能用三遍：第一段 rise·第二段 increase·第三段 climb up：词汇多样性是小作文的评分点：同义词轮换是最简单的提分术' },
        { kind: 'highlight', text: '升·降·平三态+程度副词——同义词轮换取高分' },
      ] },
      { when: 2, title: '比较', subtitle: '句型四式', color: 'green', emoji: '⚖️', blocks: [
        { kind: 'steps', title: '四组万能句型', items: ['倍数：A is twice / three times as high as B——A 是 B 的两倍/三倍', '差值：A is 20% higher than B / higher by 20%——比 B 高两成', '最值：A is the largest / ranks first among all categories——居首', '占 比：A accounts for 40% of the total / makes up...——占比四成' ] },
        { kind: 'info', icon: '📊', title: '图表类型对应', text: '折线图写趋势（rise/decline）·柱状图写比较（higher than）·饼图写占比（account for）——先看懂图的「问题」再选句型：图会告诉你答案的形状' },
        { kind: 'highlight', text: '倍数·差值·最值·占比——四式应对所有比较' },
      ] },
      { when: 3, title: '成文', subtitle: '小作文三段', color: 'amber', emoji: '✍️', blocks: [
        { kind: 'steps', title: '三段式模板', items: ['开头一句总述：The chart shows the changes in... from 2010 to 2020.（转述题目·别抄原句）', '主体两三句抓关键：最大的变化+最值的对比——不必每个数据都写：抓大放小是图表作文第一心法', '结尾一句概括：Overall, ... witnessed a significant increase / the gap between A and B widened.（总体趋势·不引入新数据）' ] },
        { kind: 'info', icon: '⏱️', title: '考场节奏', text: '限时 15 分钟：2 分钟读图找关键→10 分钟写（6-8 句足矣）→3 分钟检查（时态！描述过去图表用过去时 rose/fell·普遍现状用现在时）：时态错误是图表作文头号扣分点' },
        { kind: 'info', icon: '🧠', title: '底层能力', text: '图表描述=观察（哪根线最陡）+选择（写什么不写什么）+语言（句型词汇）：它同时训练理科的数据思维和文科的表达——难怪考试越来越爱考' },
        { kind: 'highlight', text: '总述→关键两三句→概括：时态是头号陷阱' },
      ] },
    ],
    teach: { sections: [
      { title: '趋势词汇', body: '【升】rise/increase/climb·soar飙升。\n【降】fall/decline/plunge暴跌。\n【平】level off·fluctuate·peak at。\n【副词】sharply/steadily/slightly。' },
      { title: '比较句型', body: '【倍数】twice as high as。【差值】20% higher than。\n【最值】ranks first。【占比】account for 40%。' },
      { title: '三段成文', body: '【结构】总述→关键数据→Overall概括。\n【心法】抓大放小·同义词轮换。\n【时态】过去图表用过去时。' },
    ], examples: [
      { q: '描述一条先升后降的曲线', steps: ['rise steadily from Jan to May', 'peak at 60% in June', 'then decline sharply to 20%', '检查时态统一'], tip: '拐点句' },
      { q: '比较两根柱子的高低', steps: ['A is twice as high as B', '或 A exceeds B by 30%', '选一个句型写准', '数据核對'], tip: '四式选一' },
    ], mistakes: ['每个数据都写一遍（抓大放小·只写关键点）', '描述过去年份的图表用现在时（应用过去时 rose/fell）'] },
    exercises: [
      { q: '「飙升」最贴切的表达是？', options: ['go up a little', 'soar / surge', 'stay stable', 'sit down'], answer: 1, explain: '急剧上升' },
      { q: 'remain stable 的意思是？', options: ['暴涨', '保持平稳', '暴跌', '消失'], answer: 1, explain: '走平' },
      { q: '「A 是 B 的三倍」用英语？', options: ['A is three times as high as B', 'A is three high than B', 'A has three B', 'A triples B up'], answer: 0, explain: '倍数句型' },
      { q: '「占比 40%」的表达是？', options: ['accounts for 40%', 'makes 40 tall', 'takes 40 up', 'gets 40% out'], answer: 0, explain: 'account for' },
      { q: '描述 2015 年数据应使用？', options: ['现在时', '过去时', '将来时', '虚拟语气'], answer: 1, explain: 'rose/fell' },
      { q: '图表作文第一心法是抓大放 ___', options: ['小', '大'], answer: 0, explain: '只写关键点', type: 'blank', blank: { answerText: '小', bank: ['小', '大'] } },
    ],
  }),
  L({
    area: '艺术', band: 'senior', grade: 11, id: 'art-56', order: 1054, title: '包豪斯：现代设计的摇篮', emoji: '📐', textbook: '美术（高中拓展）',
    curriculum: { module: '设计史', points: ['包豪斯的诞生', '三大理念', '它塑造了今天'] },
    story: '你的椅子·手机界面·这栋教学楼——几乎一切现代设计都流淌着一所学校的基因。它只存在了 14 年·学生不足千人·却改写了全世界的样子：包豪斯。',
    goals: ['了解包豪斯的历史', '掌握其核心理念', '发现它对今天的影响'],
    aiIntro: '📐 一所学校改变世界——包豪斯',
    param: { name: 'bh', label: '包豪斯站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['包豪斯是做什么的？', '它主张什么？', '今天哪里能看到它？'],
    views: [
      { when: 1, title: '诞生', subtitle: '乱世立校', color: 'blue', emoji: '🏛️', blocks: [
        { kind: 'info', icon: '📅', title: '1919·魏玛', text: '一战后·建筑师格罗皮乌斯在德国魏玛创办包豪斯（Bauhaus=建造之家）——一所艺术与手工艺学校：把画家·雕塑家·工匠和建筑师拉进同一间教室：艺术不该挂在墙上·应该走进生活' },
        { kind: 'info', icon: '🌪️', title: '短暂而灿烂', text: '14 年间三迁校址（魏玛→德绍→柏林）·1933 年被纳粹强行关闭——师生流散世界各地：很多去了美国（哈佛·芝加哥）——把火种带到全球：被迫解散反而成就了世界性的传播' },
        { kind: 'highlight', text: '只存在 14 年·却把现代设计的火种撒遍世界' },
      ] },
      { when: 2, title: '理念', subtitle: '三大主张', color: 'green', emoji: '💡', blocks: [
        { kind: 'compare', title: '三大核心理念', items: [
          { label: '形式追随功能', value: '设计先问「干什么用」再谈好看——椅子先坐得舒服·再谈雕花：反对一切无功能的装饰：这句话是现代设计的宪法' },
          { label: '艺术与技术统一', value: '打破艺术家看不起工匠的等级——绘画雕塑与金工木工同校学习：为机器时代而设计（能批量生产的好设计才能走进千家万户）' },
          { label: '少即是多', text: '', value: '（教师密斯·凡德罗的名言）用最简单的几何形·最少的元素解决问题——方·圆·直线·原色：简洁不是简陋·是精确', hint: '' },
        ] },
        { kind: 'info', icon: '🎨', title: '包豪斯的样子', text: '几何形+三原色（红黄蓝）+黑白灰——康定斯基·克利在这里教书：家具是钢管的·建筑是白盒子方窗·海报是粗黑字加大色块：一眼能认出来的「现代感」就是它的遗产' },
        { kind: 'highlight', text: '功能优先·艺技统一·少即是多——现代设计三部宪法' },
      ] },
      { when: 3, title: '今天', subtitle: '无处不在', color: 'amber', emoji: '🏙️', blocks: [
        { kind: 'compare', title: '身边的包豪斯', items: [
          { label: '建筑', value: '玻璃幕墙方盒子办公楼·「国际式」风格——全世界城市天际线的默认值：你抬头看到的大楼·多半是它的徒孙' },
          { label: '产品', value: '钢管椅（瓦西里椅至今在卖）·极简家电·宜家风——「好看又便宜」的批量好设计：你坐的椅子可能就是包豪斯作业的后代' },
          { label: '界面', value: '手机 UI 的扁平化·大色块·无衬线字体——包豪斯海报的原理搬进了屏幕：谷歌苹果的设计语言里全是它的基因' },
        ] },
        { kind: 'info', icon: '🤔', title: '一句冷思考', text: '包豪斯反对装饰·追求普适——但也让全世界的城市越来越像（方盒子复制粘贴）：统一与个性的张力至今没解完：学习它的方法·不盲从它的答案' },
        { kind: 'highlight', text: '从钢管椅到手机 UI——包豪斯是你正在使用的「默认现代」' },
      ] },
    ],
    teach: { sections: [
      { title: '诞生', body: '【1919】格罗皮乌斯创于魏玛。\n【14年】三迁校址·1933被纳粹关闭。\n【传播】师生赴美·火种全球。' },
      { title: '三大理念', body: '【功能】形式追随功能·反对无谓装饰。\n【统一】艺术+技术·为批量生产设计。\n【少即是多】几何·原色·精确的简洁。' },
      { title: '今天', body: '【建筑】方盒子玻璃幕墙国际式。\n【产品】钢管椅·极简家电。\n【界面】扁平UI即包豪斯海报。\n【冷思】统一与个性的张力。' },
    ], examples: [
      { q: '用包豪斯原则改造一张花哨海报', steps: ['列出必须传达的信息', '删掉纯装饰元素', '几何形+无衬线粗字重排', '对比前后效果'], tip: '做减法' },
      { q: '找出教室里的包豪斯基因', steps: ['看桌椅的几何简洁', '看灯具的钢管结构', '看标识的字体用色', '记录三处并说明'], tip: '眼见为实' },
    ], mistakes: ['以为包豪斯是一种建筑风格（是设计学校与理念体系）', '把「少即是多」理解为简陋偷工（是精确删减到本质）'] },
    exercises: [
      { q: '包豪斯创办于哪一年？', options: ['1800年', '1919年', '1949年', '2000年'], answer: 1, explain: '战后魏玛' },
      { q: '「形式追随功能」的意思是？', options: ['好看最重要', '先满足用途再谈形式', '装饰越多越好', '随机设计'], answer: 1, explain: '现代设计宪法' },
      { q: '「少即是多」出自包豪斯的？', options: ['学生', '教师密斯·凡德罗', '纳粹', '校长格罗皮乌斯'], answer: 1, explain: '精确的简洁' },
      { q: '包豪斯的典型配色是？', options: ['金银黑', '红黄蓝三原色+黑白灰', '粉紫渐变', '彩虹七色'], answer: 1, explain: '康定斯基时代' },
      { q: '手机 UI 的扁平化是包豪斯哪个领域的延续？', options: ['服装', '海报平面设计', '舞蹈', '音乐'], answer: 1, explain: '大色块无衬线' },
      { q: '包豪斯一共存在了约多少年？', options: ['一百年', '十四年', '五十年', '三年'], answer: 1, explain: '1919-1933', type: 'blank', blank: { answerText: '十四年', bank: ['十四年', '一百年'] } },
    ],
  }),
  L({
    area: '音乐', band: 'senior', grade: 11, id: 'mus-50', order: 1055, title: '为什么旋律抓耳：音乐心理学', emoji: '🎧', textbook: '音乐鉴赏（拓展）',    curriculum: { module: '音乐心理学', points: ['耳虫现象', '期待与意外', '音乐的开关'] },
    story: '为什么有的歌听一遍就挥之不去？为什么副歌总要重复？为什么高音让人起鸡皮疙瘩？你的大脑听音乐时其实在「预测」——好音乐就是恰到好处的「意料之外」。',
    goals: ['理解耳虫现象', '掌握期待与意外原理', '了解音乐与情绪的科学'],
    aiIntro: '🎧 大脑里的单曲循环——音乐心理学',
    param: { name: 'ew', label: '耳虫站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么旋律会「粘」在脑子里？', '好听的秘密是什么？', '音乐怎样操纵情绪？'],
    views: [
      { when: 1, title: '耳虫', subtitle: '脑内循环', color: 'violet', emoji: '🔁', blocks: [
        { kind: 'info', icon: '🧠', title: '什么是耳虫', text: '一段旋律不请自来地在脑内循环——90% 以上的人每周都经历：研究表明「抓耳」的旋律往往：节奏较简单+音程跳跃不大+有重复片段+略有意外——好记又「有钩子」' },
        { kind: 'info', icon: '🪝', title: 'Hook：钩子写法', text: '流行歌的「记忆点」常在副歌第一句——短句·高音区·重复+一点点新意（突然的跳音或停顿）：写歌的人专门设计「钩子」——三秒内让你上头：抓耳是精心计算的' },
        { kind: 'info', icon: '💤', title: '怎么赶走耳虫', text: '嚼口香糖（占用发音相关脑区）·听完整首歌（未完成的事更惦记——蔡格尼克效应）·或换一首「解药歌」：脑内循环不是故障·是大脑热爱模式的副产品' },
        { kind: 'highlight', text: '耳虫=简单+重复+小意外——抓耳是精心设计的钩子' },
      ] },
      { when: 2, title: '期待', subtitle: '意料之外', color: 'blue', emoji: '🎯', blocks: [
        { kind: 'info', icon: '🔮', title: '大脑是预测机器', text: '听音乐时大脑不断预测下一个音——预测对了：满足感（和声解决到主音的那一刻最「舒坦」）；预测错了但「错得漂亮」：惊喜感（突然转调·一个意外和弦）：音乐=预测游戏' },
        { kind: 'info', icon: '⚖️', title: '重复与新鲜的最佳配比', text: '心理学家发现「曝光效应」：听过的更好听——但重复太多会腻：流行歌的配方=重复的段落（主歌副歌）+新鲜的变化（第二段换词·桥段转调）：熟悉的安全+陌生的刺激' },
        { kind: 'info', icon: '🐔', title: '鸡皮疙瘩的秘密', text: '动人时刻（高潮前的渐强·突然的和声转折）触发多巴胺释放——起鸡皮疙瘩（颤栗感）与大脑奖赏系统相关：为什么有人容易起·有人不起——部分与听音乐时投入的专注度有关：越专注越容易被击中' },
        { kind: 'highlight', text: '预测游戏：对了是满足·「漂亮地错」是惊喜' },
      ] },
      { when: 3, title: '开关', subtitle: '情绪的遥控器', color: 'green', emoji: '🎛️', blocks: [
        { kind: 'compare', title: '音乐的三个开关', items: [
          { label: '速度', value: '快歌让人想动（锻炼音乐都 120+ BPM）·慢歌放慢心跳：心率会向音乐节奏靠拢（entrainment）' },
          { label: '大调小调', value: '大调明亮（生日歌）·小调忧郁（许多伤感情歌）——文化习得的联想+声学微妙差异：不是绝对·但统计上有效' },
          { label: '音高上行', value: '音越来越高=张力越来越强（副歌比主歌高八度的原因）——上行的旋律「推着」情绪走：歌曲的高潮都往高走' },
        ] },
        { kind: 'info', icon: '🎬', title: '谁在用这些开关', text: '影视配乐（恐怖片用不和谐音制造不安）·商场音乐（慢音乐让人逛得久）·运动耳机（快节奏提升表现）：懂了原理·你就是清醒的听众——听得见音乐·也看得见手法' },
        { kind: 'highlight', text: '速度·调性·音高走向——音乐情绪的三个物理开关' },
      ] },
    ],
    teach: { sections: [
      { title: '耳虫', body: '【定义】90%人经历的脑内循环。\n【配方】简单节奏+小音程+重复+小意外。\n【Hook】副歌第一句三秒上头。\n【解药】嚼口香糖·听完·换歌。' },
      { title: '期待原理', body: '【预测】大脑预测下一个音。\n【对】满足（解决到主音）。【错得漂亮】惊喜（转调）。\n【配比】重复的安全+新鲜的变化。\n【颤栗】多巴胺奖赏。' },
      { title: '情绪开关', body: '【速度】快歌促动·慢歌缓心。\n【调性】大调明·小调郁。\n【上行】张力推情绪。\n【应用】影视·商场·运动。' },
    ], examples: [
      { q: '分析一首单曲循环的歌', steps: ['找副歌钩子在哪几秒', '数主歌副歌的重复结构', '找出「意外」的转折点', '对应期待原理记录'], tip: '拆解钩子' },
      { q: '被广告歌洗脑了', steps: ['意识到是耳虫效应', '把整首听完补全缺口', '或嚼口香糖打断', '不必烦躁·会自己退'], tip: '科学解药' },
    ], mistakes: ['以为抓耳全靠运气（钩子是被精确设计的）', '认为音乐与情绪无关只是「感觉」（速度调性有 measurable 效应）'] },
    exercises: [
      { q: '「耳虫」指的是？', options: ['耳朵里的虫子', '旋律在脑内不受控循环', '一种乐器', '耳机品牌'], answer: 1, explain: '90%人经历过' },
      { q: '抓耳旋律的常见配方是？', options: ['复杂+随机', '简单+重复+小意外', '超长+安静', '全是高音'], answer: 1, explain: '好记又有钩子' },
      { q: '听音乐时大脑在做什么？', options: ['休息', '不断预测下一个音', '做梦', '自动关机'], answer: 1, explain: '预测机器' },
      { q: '副歌常比主歌高·是为了？', options: ['省力', '上行音高推高情绪张力', '规矩', '省时间'], answer: 1, explain: '高潮往高走' },
      { q: '商场放慢节奏音乐是为了？', options: ['省钱', '让顾客逛得更久', '员工休息', '赶客'], answer: 1, explain: '节奏影响行为' },
      { q: '音乐是大脑玩的一场什么游戏？', options: ['记忆游戏', '预测游戏', '运气游戏', '体力游戏'], answer: 1, explain: '对了满足·错了惊喜', type: 'blank', blank: { answerText: '预测游戏', bank: ['预测游戏', '记忆游戏'] } },
    ],
  }),
  L({
    area: '地理', band: 'senior', grade: 10, id: 'geo-41', order: 1056, title: '垂直地带性：一座山的四季', emoji: '⛰️', textbook: '地理（人教版选择性必修一）',
    curriculum: { module: '自然地理规律', points: ['垂直带谱', '基带与坡向', '应用与观察'] },
    story: '从山脚的热带雨林到山顶的积雪冰川——爬一座赤道高山·等于从赤道走到北极。这是地理最壮观的规律：垂直地带性。一座山就是一部微缩的地球。',
    goals: ['理解垂直带谱的成因', '掌握基带与坡向规律', '学会判读带谱图'],
    aiIntro: '⛰️ 一座山走完地球——垂直地带性',
    param: { name: 'va', label: '垂直站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么山脚山顶像两个世界？', '山坡两侧带谱一样吗？', '判读带谱图有什么口诀？'],
    views: [
      { when: 1, title: '原理', subtitle: '微缩地球', color: 'blue', emoji: '🌡️', blocks: [
        { kind: 'info', icon: '📉', title: '海拔每升1000米降温约6℃', text: '气温随海拔递减·降水先增后减——水热的垂直变化让植被土壤跟着变：山脚是雨林·山腰是森林·再往上是草甸苔原·顶部积雪：一座山叠着好几个气候带' },
        { kind: 'info', icon: '🗺️', title: '跟水平地带的对应', text: '垂直的带谱≈从山脚纬度向高纬度的排列——赤道的高山（乞力马扎罗）能从雨林排到冰雪·相当于从赤道走到极地：所以「一座山=一部微缩地球」' },
        { kind: 'highlight', text: '海拔升·温降·植被换——垂直带谱是躺倒的纬度带' },
      ] },
      { when: 2, title: '规律', subtitle: '两个要点', color: 'green', emoji: '📏', blocks: [
        { kind: 'compare', title: '基带与坡向', items: [
          { label: '基带=起点', value: '山脚第一带反映当地水平地带（赤道山脚是雨林·温带山脚是落叶林）——判读带谱图先看基带·立刻知道这座山「住」在哪个纬度：基带是山的户口本' },
          { label: '坡向差异', value: '迎风坡降水多——带谱更完整·森林带更厚；背风坡少雨——可能缺森林带直接草原（焚风效应）：同一座山·两副面孔' },
          { label: '山体效应', value: '纬度越低·相对高度越大——带谱越丰富（乞力马扎罗比长白山带多）；山顶够不够雪线看纬度和高度：高山要「长得够高住得够低」才有全谱' },
        ] },
        { kind: 'highlight', text: '基带定纬度·坡向定干湿·低纬高山谱最全' },
      ] },
      { when: 3, title: '判读', subtitle: '做题三步', color: 'amber', emoji: '🔍', blocks: [
        { kind: 'steps', title: '带谱图判读三步', items: ['看基带：山脚是什么带？→确定该山所在纬度带（户口本）', '数带目·看顺序：带越多说明山越高或纬度越低；顺序应与向高纬排列一致——乱序图有诈', '比坡向：两侧带谱不一致→判断迎风坡（带多而全的一侧）和盛行风向：藏着一道风的知识' ] },
        { kind: 'info', icon: '🇨🇳', title: '中国实例', text: '长白山（温带·从针阔混交林到苔原）·珠峰（从河谷森林到冰壳·南坡比北坡带多——西南季风迎风）·横断山区「一山有四季·十里不同天」——垂直地带性是立体气候的教科书' },
        { kind: 'info', icon: '🌿', title: '为什么重要', text: '垂直带谱意味着「生物多样性仓库」——一座高山挤进多个生态位：也意味着脆弱——气候变化让带谱整体上移·山顶的雪和苔原无处可退：读懂带谱·就读懂了山的命运' },
        { kind: 'highlight', text: '基带→带目顺序→坡向——三步拆任何带谱图' },
      ] },
    ],
    teach: { sections: [
      { title: '原理', body: '【递减】每升高1000米降约6℃。\n【变化】降水先增后减·植被随水热变。\n【对应】垂直谱≈向高纬排列。' },
      { title: '两要点', body: '【基带】山脚第一带=当地水平带（户口本）。\n【坡向】迎风带全·背风缺林。\n【山体】低纬+高差大=谱最全。' },
      { title: '判读', body: '【三步】看基带→数带目核顺序→比坡向断风向。\n【实例】长白山·珠峰南坡·横断一山四季。\n【意义】多样性仓库·气候变化的晴雨表。' },
    ], examples: [
      { q: '判读带谱图确定山脉纬度', steps: ['看山脚第一带', '若是雨林基带', '推断位于赤道附近', '再数带目估高度'], tip: '基带户口本' },
      { q: '同一山两侧带谱差异大', steps: ['带全的一侧为迎风坡', '推知盛行风向', '背风坡可能焚风干热', '结合位置定季风或西风'], tip: '坡向断风' },
    ], mistakes: ['认为山顶植被只由海拔决定（坡向干湿同样关键）', '以为任何山都有完整带谱（需足够海拔+合适纬度）'] },
    exercises: [
      { q: '海拔每升高1000米气温约降？', options: ['0.6℃', '6℃', '60℃', '不降'], answer: 1, explain: '递减率' },
      { q: '垂直带谱大致相当于？', options: ['向低纬排列', '向高纬（极地）排列', '随机排列', '向海洋排列'], answer: 1, explain: '躺倒的纬度带' },
      { q: '判断山地纬度位置最该看？', options: ['山顶', '基带（山脚第一带）', '云量', '游客'], answer: 1, explain: '山的户口本' },
      { q: '带谱更完整的一侧通常是？', options: ['背风坡', '迎风坡', '阴坡', '悬崖'], answer: 1, explain: '降水多带全' },
      { q: '垂直带谱最丰富的高山是？', options: ['高纬矮山', '低纬高山', '温带丘陵', '极地雪峰'], answer: 1, explain: '赤道高山从雨林到雪' },
      { q: '横断山区「一山有 ___ ·十里不同天」形容的是？', options: ['两季', '四季'], answer: 1, explain: '垂直分异', type: 'blank', blank: { answerText: '四季', bank: ['四季', '两季'] } },
    ],
  }),
  L({
    area: '劳动', band: 'senior', grade: 11, id: 'lab-54', order: 1057, title: '家电选购：参数怎么看', emoji: '🛒', textbook: '劳动（高中拓展）',
    curriculum: { module: '消费技能', points: ['需求优先', '看懂参数', '避坑清单'] },
    story: '买台冰箱——「一级能效」「风冷无霜」「变频压缩机」……广告词像天书。这一课教你把参数表当说明书读：花明白钱·不当冤大头。',
    goals: ['学会按需求定预算', '掌握关键参数', '识别营销套路'],
    aiIntro: '🛒 看懂参数不花冤枉钱——家电选购',
    param: { name: 'ap', label: '选购站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['买之前先想什么？', '哪些参数是干货？', '怎样识破套路？'],
    views: [
      { when: 1, title: '需求', subtitle: '先问自己', color: 'blue', emoji: '❓', blocks: [
        { kind: 'steps', title: '选购三问', items: ['给谁用·放哪里？冰箱几口人（人均50-70升）·空调按房间面积算匹数（1匹约管12㎡）——尺寸先量门和位置：量了再买是铁律', '核心需求排前三：静音？保鲜？省电？——没有全能王·排序才能取舍：预算花在第一需求上', '预算含隐形成本：电费（能效差一台冰箱一年差百元电）·安装费·耗材（净水器滤芯）——只看标价会算错账' ] },
        { kind: 'highlight', text: '量尺寸→排需求→算总账——买之前的三件事' },
      ] },
      { when: 2, title: '参数', subtitle: '干货词典', color: 'green', emoji: '📖', blocks: [
        { kind: 'compare', title: '通用参数', items: [
          { label: '能效等级', value: '中国能效标识1-5级·1级最省电——长期开机的家电（冰箱空调）优先1级；贴纸上有年耗电量·直接算电费' },
          { label: '噪音dB', value: '冰箱≤38dB图书馆级·洗衣机脱水≤72dB——卧室和客厅隔墙要留心：参数表角落里的生活质量' },
          { label: '保修', value: '整机几年？压缩机电机等主要部件几年？——越长越实在（行业卷到10年）：保修是厂商对质量的表态' },
        ] },
        { kind: 'compare', title: '品类要点', items: [
          { label: '冰箱', value: '定频变频（变频更省更静）·风冷无霜（不用手动除霜）·循环系统（双循环不串味）' },
          { label: '空调', value: '匹数匹配面积·新一级能效·变频（温度稳更省）——「匹数买小」是最常见错误' },
          { label: '洗衣机', value: '滚筒护衣·直驱电机更静——洗净比参数≥1.03达标' },
        ] },
        { kind: 'highlight', text: '能效·噪音·保修是通识——品类再记两三个要点' },
      ] },
      { when: 3, title: '避坑', subtitle: '套路清单', color: 'amber', emoji: '⚠️', blocks: [
        { kind: 'compare', title: '四大套路', items: [
          { label: '参数轰炸', value: '列一堆无关参数（「纳米」「量子」「航天级」）掩盖关键项（能效噪音）——只回答你排的前三需求·其他当不存在' },
          { label: '低价引流', value: '页面最低价是「丐版」（小容量/旧款）——点进规格表核对型号末位字母：一字之差差一代' },
          { label: '伪需求', value: '「智能联网洗菜」——听起来酷·用三次就吃灰：为真需求付费·为噱头省钱' },
          { label: '好评如潮', value: '刷出来的评价看不出差评——看追评和带图差评·搜「型号+故障」：真话在角落' },
        ] },
        { kind: 'info', icon: '🧾', title: '下单前最后一查', text: '历史价格（防先涨后降）·安装收费项（空调高空费打孔费）·退换政策（大家电拆了包装还退吗）：三查完·安心付款' },
        { kind: 'highlight', text: '参数轰炸·低价引流·伪需求·刷好评——见招拆招' },
      ] },
    ],
    teach: { sections: [
      { title: '需求三问', body: '【尺寸】量门量位再买。【排序】需求排前三取舍。\n【总账】电费安装耗材都算。' },
      { title: '参数干货', body: '【通识】能效1级·噪音dB·保修年限。\n【冰箱】变频+风冷+双循环。\n【空调】匹数配面积+新一级。【洗衣机】直驱+洗净比。' },
      { title: '避坑', body: '【轰炸】无关词掩盖关键参数。\n【引流】丐版低价核对型号。\n【伪需求】为噱头省钱。【评价】看追评差评。\n【最后】历史价+安装费+退换。' },
    ], examples: [
      { q: '给奶奶买一台冰箱', steps: ['量厨房位置和门宽', '需求：静音+简单好用', '选能效1级噪音≤38dB', '基础款胜过智能款'], tip: '按人按位' },
      { q: '空调卖家说1.5匹都一样', steps: ['先量房间面积', '12㎡以上考虑大1.5匹', '匹小了费电还不凉', '参数说话不靠嘴'], tip: '匹数公式' },
    ], mistakes: ['只看标价不算电费耗材（长期成本常反超差价）', '被「纳米航天级」等营销词唬住（回到关键参数）'] },
    exercises: [
      { q: '家电选购第一步应该？', options: ['看广告', '量尺寸列需求排预算', '挑颜色', '抢购'], answer: 1, explain: '三件事先行' },
      { q: '中国能效标识几级最省电？', options: ['5级', '1级', '3级', '都一样'], answer: 1, explain: '1级最省' },
      { q: '空调「匹数买小」的后果是？', options: ['更省电', '制冷不足反而费电', '更安静', '更便宜持久'], answer: 1, explain: '小马拉大车' },
      { q: '识别刷好评的方法是看？', options: ['好评数', '追评和带图差评', '店铺装修', '客服态度'], answer: 1, explain: '真话在角落' },
      { q: '「航天级纳米」类宣传词的正确态度是？', options: ['很厉害必买', '回归关键参数核实', '打折就买', '转发'], answer: 1, explain: '参数轰炸套路' },
      { q: '长期开机的家电应选能效几级？', options: ['五级', '一级'], answer: 1, explain: '电费大项', type: 'blank', blank: { answerText: '一级', bank: ['一级', '五级'] } },
    ],
  }),
  L({
    area: '社会学', band: 'senior', grade: 11, id: 'soc-55', order: 1058, title: '戈夫曼：人生如戏的拟剧论', emoji: '🎭', textbook: '社会学概论（拓展）',
    curriculum: { module: '微观社会学', points: ['前台与后台', '印象管理', '看破与入戏'] },
    story: '你在老师面前一个样·在朋友面前一个样·独处时又一个样——是虚伪吗？社会学家戈夫曼说：不·这就是社会生活本身。人人都是演员·社会是舞台。这一课看懂这出戏。',
    goals: ['掌握拟剧论核心概念', '理解印象管理', '辩证看待「表演」'],
    aiIntro: '🎭 人人都是演员——戈夫曼拟剧论',
    param: { name: 'dg2', label: '拟剧站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么人前人后不一样？', '朋友圈是前台吗？', '「表演」是不真诚吗？'],
    views: [
      { when: 1, title: '舞台', subtitle: '前台后台', color: 'blue', emoji: '🎪', blocks: [
        { kind: 'compare', title: '两个区域', items: [
          { label: '前台', value: '观众在场的区域——按角色要求「演出」：课堂上的认真·面试时的稳重·服务员的微笑：前台有「道具」（校服工牌）和「剧本」（礼仪规范）' },
          { label: '后台', value: '观众不在的区域——卸下角色「休息排练」：教师办公室的吐槽·服务员后厨的叹气·你关上房门的样子：后台不是假的·是另一种真实' },
        ] },
        { kind: 'info', icon: '🎬', title: '戈夫曼的洞见', text: '欧文·戈夫曼（1922-1982）《日常生活中的自我呈现》：用戏剧学的眼光看社会——人与人的互动=一场持续的演出：这个视角叫「拟剧论」（戏剧主义）：不是比喻·是严肃的分析框架' },
        { kind: 'highlight', text: '前台演出·后台卸妆——社会生活是一场持续的表演' },
      ] },
      { when: 2, title: '管理', subtitle: '印象经营', color: 'green', emoji: '🪞', blocks: [
        { kind: 'info', icon: '👔', title: '印象管理', text: '我们有意无意地控制别人对自己的印象——得体的穿着·措辞·朋友圈的精修图：这不是欺骗——是社会互动的基本功（面试不管理印象才是失礼）：人人都在做·只是水平不同' },
        { kind: 'info', icon: '📱', title: '社交媒体：超级前台', text: '朋友圈=精心搭建的前台（九宫格是舞台美术）·草稿箱和仅自己可见=后台：研究发现人们平均会编辑删除多次才发一条——数字时代的印象管理更精细也更累：表演成本变高了' },
        { kind: 'info', icon: '💔', title: '翻车与补救', text: '前台失手（发错群·人设崩塌）——戈夫曼也研究了补救：道歉（对观众）·找借口（拆台解释）·幽默化解：社会对「会补救的演员」格外宽容' },
        { kind: 'highlight', text: '印象管理是互动基本功——社交媒体把前台卷到了极致' },
      ] },
      { when: 3, title: '辩证', subtitle: '看破与入戏', color: 'amber', emoji: '🧘', blocks: [
        { kind: 'info', icon: '🤝', title: '表演≠虚伪', text: '区分「扮演好角色」和「欺骗」：教师认真讲课是表演（在履行角色）·不是假的；骗子扮演警察才是欺骗（角色是偷来的）：表演是社会协作的润滑剂——都「真实自我」到场·社会反而没法运转' },
        { kind: 'info', icon: '🧳', title: '后台 disappearing 的时代', text: '工作和生活的边界模糊——微信让老板进了你的「后台」·直播把后台当卖点：当后台越来越少·人容易疲惫（一直演）：给自己留后台（独处·不打卡的空间）是现代生活的必需品' },
        { kind: 'info', icon: '🪅', title: '用这个眼睛看世界', text: '看懂拟剧论不是让你怀疑一切——而是多一分从容：人前的别扭不必自责（谁都在演）·他人的光环不必焦虑（那是前台）：入戏时认真·看破时宽容——这是社会学给的生活智慧' },
        { kind: 'highlight', text: '扮演≠欺骗·后台是必需品——入戏认真·看破宽容' },
      ] },
    ],
    teach: { sections: [
      { title: '前台后台', body: '【前台】观众在场按角色演出·有道具剧本。\n【后台】卸下角色休息排练的另一种真实。\n【出处】戈夫曼《日常生活中的自我呈现》。' },
      { title: '印象管理', body: '【定义】控制他人对自己的印象。\n【社媒】朋友圈=超级前台·编辑删除成常态。\n【翻车】道歉·解释·幽默三补救。' },
      { title: '辩证', body: '【区分】履行角色≠欺骗。\n【时代】后台 shrinking·留后台防耗竭。\n【智慧】入戏认真·看破宽容。' },
    ], examples: [
      { q: '分析「朋友圈精修图」', steps: ['识别为印象管理', '九宫格是舞台美术', '人人都做非你独有', '别因别人前台而焦虑'], tip: '前台理论' },
      { q: '下班后还被拉进工作群', steps: ['识别后台被入侵', '协商边界时间', '保留独处空间', '后台是心理必需品'], tip: '守住后台' },
    ], mistakes: ['把所有角色扮演都当虚伪（履行角色是社会协作）', '以为只有「线上人设」才是表演（线下互动同样是）'] },
    exercises: [
      { q: '拟剧论的提出者是？', options: ['韦伯', '戈夫曼', '马克思', '涂尔干'], answer: 1, explain: '自我呈现' },
      { q: '「前台」指的是？', options: ['舞台前方', '观众在场的演出区', '网页首页', '教室第一排'], answer: 1, explain: '有观众就有前台' },
      { q: '服务员在后厨叹气属于？', options: ['前台表演', '后台行为', '违规', '演出事故'], answer: 1, explain: '卸下角色的真实' },
      { q: '「印象管理」的正确理解是？', options: ['欺骗艺术', '社会互动的基本功', '只有虚伪者才做', '新发明'], answer: 1, explain: '人人都在做' },
      { q: '扮演角色与欺骗的区别在于？', options: ['演技好坏', '角色名正言顺与否', '观众多少', '收入高低'], answer: 1, explain: '履行≠冒充' },
      { q: '入戏时认真·看破时 ___', options: ['宽容', '拆穿'], answer: 0, explain: '社会学智慧', type: 'blank', blank: { answerText: '宽容', bank: ['宽容', '拆穿'] } },
    ],
  }),
  L({
    area: '经济学', band: 'senior', grade: 11, id: 'eco-55', order: 1059, title: '基尼系数：贫富差距的温度计', emoji: '🌡️', textbook: '经济学（高中拓展）',
    curriculum: { module: '分配与公平', points: ['什么是基尼系数', '洛伦兹曲线', '公平与效率的平衡'] },
    story: '一个国家穷不穷看人均 GDP·但「大家过得像不像」要看另一个数——基尼系数：从 0 到 1 的一把尺·量出财富分配的体温。这一课学会读这把尺·也思考公平的分寸。',
    goals: ['理解基尼系数的含义', '了解洛伦兹曲线', '思考公平与效率'],
    aiIntro: '🌡️ 量贫富差距的尺——基尼系数',
    param: { name: 'gc', label: '基尼站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['0 和 1 代表什么？', '曲线怎样读？', '差距多少算合适？'],
    views: [
      { when: 1, title: '尺子', subtitle: '0 到 1', color: 'blue', emoji: '📏', blocks: [
        { kind: 'info', icon: '0️⃣', title: '两个极端', text: '0=绝对平均（人人收入一模一样——像无论考多少分都给60分）；1=绝对不均（一人拿走全部——像全班分数都归一个人）：现实都在两者之间·没有国家是 0 或 1' },
        { kind: 'info', icon: '📊', title: '常用的刻度', text: '国际上通常：低于0.2 过于平均（动力不足）·0.2-0.3 较平均·0.3-0.4 较合理·0.4 是「警戒线」·0.4-0.6 差距偏大·超过0.6 悬殊：0.4 警戒线是经验参考·不是物理定律' },
        { kind: 'highlight', text: '0 绝对平均·1 全归一人——0.4 是国际警戒线' },
      ] },
      { when: 2, title: '曲线', subtitle: '洛伦兹', color: 'green', emoji: '📈', blocks: [
        { kind: 'steps', title: '读洛伦兹曲线', items: ['横轴：人口按收入从低到高累计（最穷的20%…100%）', '纵轴：收入的累计百分比', '45°对角线=绝对平均线（最穷20%人拿20%收入）', '实际曲线在对角线下方——弯得越狠离对角线越远·基尼系数越大：面积算出来的就是基尼系数' ] },
        { kind: 'info', icon: '🔍', title: '一个直观判断', text: '看「最穷的 50% 人拿到多少收入」：如果不到 20%·说明差距可观：曲线比数字直观——考试也爱考「曲线更弯→分配更不均」' },
        { kind: 'info', icon: '⚠️', title: '尺子的局限', text: '基尼系数只看「结果差距」——看不出差距是勤劳合法还是垄断腐败；全国口径会低估（城乡分别算更高）；也看不出财富存量（只算当期收入）：一把好尺·但量不出一切' },
        { kind: 'highlight', text: '曲线越弯差距越大——好尺也有量不到的角落' },
      ] },
      { when: 3, title: '平衡', subtitle: '公平的分数', color: 'amber', emoji: '⚖️', blocks: [
        { kind: 'compare', title: '两个极端的病', items: [
          { label: '过度平均', value: '干多干少一个样→没人努力（大锅饭的历史教训）——效率死掉·蛋糕做不大：最后「平均地穷」' },
          { label: '差距悬殊', value: '机会被垄断→底层失去希望（「躺平」的社会成本）·消费不足·社会不稳定：蛋糕大了但切法在撕裂社会' },
        ] },
        { kind: 'info', icon: '🇨🇳', title: '共同富裕的方向', text: '中国的路径：初次分配讲效率（市场）·再分配讲公平（税收社保转移支付）·三次分配讲自愿（慈善）：先把蛋糕做大·再把蛋糕分好——两头都要抓' },
        { kind: 'info', icon: '🧠', title: '关键区分', text: '机会公平 vs 结果公平——让每个孩子都有好学校上（机会）比让每人收入一样（结果）更重要也更可行：好的社会盯机会·用再分配托底线：这是这把尺子教我们的分寸' },
        { kind: 'highlight', text: '既不做大锅饭也不做赢家通吃——盯机会公平·托结果底线' },
      ] },
    ],
    teach: { sections: [
      { title: '基尼系数', body: '【区间】0绝对平均-1绝对不均。\n【刻度】0.4国际警戒线·0.3-0.4较合理。\n【注意】经验参考非定律。' },
      { title: '洛伦兹曲线', body: '【轴】人口累计×收入累计·45°线=绝对平均。\n【读法】越弯曲→越不均·面积=基尼。\n【局限】看不出成因·城乡口径·存量财富。' },
      { title: '公平效率', body: '【过度平均】大锅饭杀效率。\n【过度悬殊】失希望·不稳。\n【路径】初次效率+再分配公平+三次分配。\n【核心】机会公平优先·托结果底线。' },
    ], examples: [
      { q: '两国人均GDP接近怎样比公平', steps: ['查基尼系数对比', '再看最穷50%占比', '曲线更平的分配更均', 'GDP量不出分配'], tip: '换尺子' },
      { q: '判断「把基尼压到0」好不好', steps: ['0=绝对平均', '干多干少一个样', '努力失去回报', '效率崩溃最终都穷'], tip: '平均的代价' },
    ], mistakes: ['以为基尼系数越低越好（过低说明激励不足）', '把 0.4 警戒线当硬性标准（是经验参考·各国国情不同）'] },
    exercises: [
      { q: '基尼系数等于 0 表示？', options: ['绝对不均', '绝对平均', '没有收入', '最富有'], answer: 1, explain: '人人一样' },
      { q: '国际常用的「警戒线」是？', options: ['0.2', '0.4', '0.6', '1.0'], answer: 1, explain: '经验参考' },
      { q: '洛伦兹曲线越弯曲说明？', options: ['分配越平均', '差距越大', '人口越多', 'GDP越高'], answer: 1, explain: '离对角线越远' },
      { q: '45° 对角线代表的含义是？', options: ['绝对贫困', '绝对平均线', '警戒线', '人口线'], answer: 1, explain: '最穷20%拿20%' },
      { q: '下列哪种公平应被优先保障？', options: ['人人收入相同', '机会公平', '论资排辈', '平均一切'], answer: 1, explain: '结果靠再分配托底' },
      { q: '好社会更应优先保障哪种公平？', options: ['结果完全相同', '机会公平为主', '随机分配', '论资排辈'], answer: 1, explain: '托底线靠再分配', type: 'blank', blank: { answerText: '机会公平为主', bank: ['机会公平为主', '结果完全相同'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id + ' order=' + l.order).join(', '));
