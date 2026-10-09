import fs from 'node:fs';
import path from 'node:path';

/**
 * 第165轮：实用技能+学段拉平——8节。
 * 急救CPR/规则与公平/家庭社会学/英语日常对话/英语邮件/运动习惯/环保实践/学术写作。
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
    area: '道德与法治', band: 'junior', grade: 8, id: 'eth-44', order: 869, title: '急救技能：CPR 与海姆立克', emoji: '🫀', textbook: '统编版道德与法治（八年级）',
    curriculum: { module: '生命安全', points: ['心肺复苏CPR', '海姆立克法', 'AED使用'] },
    story: '中国每年心脏骤停约 55 万例·抢救成功率不到 3%（发达国家约 10%）——差距在哪？在"第一目击者会不会急救"。黄金抢救时间只有 4 分钟——等救护车来不及。这一课教两个可能救命的技能。',
    goals: ['掌握CPR的基本步骤', '掌握海姆立克急救法', '了解AED的使用'],
    aiIntro: '🫀 你可能在某一天救一条命——急救课！',
    param: { name: 'fa', label: '急救站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['有人倒地无呼吸第一步做什么？', '食物卡住气管怎样急救？', 'AED是什么？'],
    views: [
      { when: 1, title: 'CPR', subtitle: '心肺复苏', color: 'rose', emoji: '🫀', blocks: [
        { kind: 'steps', title: 'CPR 五步', items: ['判断：拍肩喊"你还好吗"→无反应·无呼吸（或仅有喘息）→需要CPR', '呼救：大声喊人帮忙→拨打120→让人取AED（指定具体的人："穿红衣服的你去打120"）', '位置：两乳头连线中点（胸骨下半段）', '按压：双手交叠·掌根接触·手臂垂直→深度5-6cm·频率100-120次/分（跟着歌曲Stayin Alive的节奏）', '持续：不停·直到专业人员到达或AED可用·每2分钟换人（按压很累）' ] },
        { kind: 'info', icon: '⚠️', title: '三个关键', text: '①压得够深（5-6cm不是轻轻碰）；②压得够快（每秒约2次）；③尽量不中断（中断超过10秒效果大减）——记住：你压的不是完美的·但压了比不压强一百倍' },
        { kind: 'highlight', text: '黄金4分钟——你压的每一秒都在跟死神赛跑' },
      ] },
      { when: 2, title: '海姆立克', subtitle: '气道异物', color: 'amber', emoji: '🫁', blocks: [
        { kind: 'compare', title: '识别与施救', items: [
          { label: '识别信号', value: '突然不能说话·不能咳嗽·手抓喉咙·脸色青紫——" universal choking sign"（ universally understood）' },
          { label: '成人/儿童施救', value: '站TA身后·双手环抱肚脐上方两横指→一手握拳·拇指侧抵住→另一手包住→快速向内向上冲击——像字母J的方向：重复直到异物排出' },
          { label: '婴儿（<1岁）', value: '面朝下放在前臂·头部低于身体→掌根拍背5次→翻正面→两指按压胸骨5次→交替直到排出' },
        ] },
        { kind: 'info', icon: '🚫', title: '能咳嗽就咳嗽', text: '如果TA还能咳嗽——鼓励TA用力咳（咳嗽是最强的排出力量）：只有在完全不能出声时才用海姆立克——咳嗽是自救·冲击是最后的手段' },
        { kind: 'highlight', text: '能咳→用力咳；不能咳→海姆立克' },
      ] },
      { when: 3, title: 'AED', subtitle: '自动体外除颤器', color: 'blue', emoji: '⚡', blocks: [
        { kind: 'info', icon: '📍', title: '什么是AED', text: '自动体外除颤器——分析心律并在需要时电击复位：全自动化·有语音提示·"傻瓜式"操作：机场·地铁站·商场·学校 increasingly 配备' },
        { kind: 'steps', title: '使用三步', items: ['开机：按电源键（或打开盖子自动开机）→听从语音指示', '贴电极片：按图示贴在裸露的胸部右上+左下→仪器自动分析心律（不要碰患者）', '需要电击时：确保没人碰TA→按闪烁的按钮→电击后立刻继续CPR：AED不会"电死人"——它只在需要时电击' ] },
        { kind: 'info', icon: '🎓', title: '怎样学会', text: '看视频+参加学校红十字会培训——CPR和AED在很多国家是驾照/毕业的必修课：学会它你就有可能成为那个"第一目击者"——从3%到10%的距离就是更多人会急救' },
        { kind: 'highlight', text: 'AED是"傻瓜机"——打开听指示·你能救人' },
      ] },
    ],
    teach: { sections: [
      { title: '心肺复苏CPR', body: '【判断】无反应+无呼吸→启动。\n【步骤】呼救120→乳头连线中点→深5-6cm快100-120/min→不中断。\n【关键】黄金4分钟。' },
      { title: '海姆立克法', body: '【识别】不能说不能咳手抓喉咙。\n【施救】双手环抱→向内向上冲击。\n【原则】能咳→咳；不能咳→冲击。' },
      { title: 'AED使用', body: '【性质】全自动除颤器有语音提示。\n【三步】开机→贴片→按按钮。\n【要点】电击后继续CPR。' },
    ], examples: [
      { q: '同学吃饭突然捂喉咙不能说话', steps: ['识别：完全梗阻信号', '站身后双手环抱', '向内向上快速冲击', '直到异物排出或TA晕倒（转CPR）'], tip: '海姆立克' },
      { q: '运动时有人倒地无呼吸', steps: ['拍肩喊无反应→需要CPR', '指定人打120取AED', '开始按压：深5-6cm快2次/秒', 'AED到了按指示用'], tip: '黄金4分钟' },
    ], mistakes: ['等救护车来再施救（黄金4分钟等不到）', 'CPR按压太轻太慢（5-6cm深100-120次/分才有效）'] },
    exercises: [
      { q: '心脏骤停的黄金抢救时间约？', options: ['30分钟', '4分钟', '2小时', '24小时'], answer: 1, explain: '每拖一分钟存活率降10%' },
      { q: 'CPR 按压的深度应为？', options: ['1cm', '5-6厘米', '10cm', '越深越好'], answer: 1, explain: '深了危险浅了无效' },
      { q: 'CPR 按压频率每分钟约？', options: ['40次', '60次', '100-120次', '200次'], answer: 2, explain: '每秒约两次' },
      { q: '食物卡住还能咳嗽时应该？', options: ['立刻海姆立克', '鼓励用力咳（咳嗽是最强排出力）', '喝水', '倒立'], answer: 1, explain: '能咳=不完全梗阻' },
      { q: 'AED 的特点是？', options: ['需要医生操作', '全自动有语音提示（傻瓜式）', '很危险', '只在医院有'], answer: 1, explain: '普通人可用' },
      { q: '你压的不是完美的·但压了比不压强一百 ___', options: ['倍', '年'], answer: 0, explain: '行动>完美', type: 'blank', blank: { answerText: '倍', bank: ['倍', '年'] } },
    ],
  }),
  L({
    area: '社会学', band: 'primary', grade: 5, id: 'soc-36', order: 870, title: '合作与竞争：游戏里的大道理', emoji: '🤝', textbook: '综合素养读本·社会',
    curriculum: { module: '社会交往', points: ['合作的力量', '竞争的规则', '合作与竞争并存'] },
    story: '拔河比赛要合作·跑步比赛要竞争——但拔河的两个队之间也在竞争！生活里合作和竞争像一枚硬币的两面·谁也离不开谁。这一课学会在"赢"的同时不忘记"我们一起玩"。',
    goals: ['理解合作的力量', '理解竞争需要规则', '学会合作与竞争的平衡'],
    aiIntro: '🤝 合作+竞争=社会的大游戏！',
    param: { name: 'cc', label: '游戏站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么一个人做不了的事很多人一起可以？', '竞争为什么需要规则？', '竞争对手可以做朋友吗？'],
    views: [
      { when: 1, title: '合作', subtitle: '1+1>2', color: 'green', emoji: '💪', blocks: [
        { kind: 'info', icon: '🐜', title: '蚂蚁的智慧', text: '一只蚂蚁搬不动一粒米——一群蚂蚁能搬走一块糖：合作让每个人的力气加在一起还多出来——多出来的部分叫"团队力"：1+1>2的原因是分工和配合' },
        { kind: 'steps', title: '好合作的三个秘密', items: ['分工明确：谁做什么说清楚——你传球我投篮', '互相补台：TA失误了鼓励而不是责怪——"没事再来"', '共享成果：赢了是大家的——不说"都靠我"' ] },
        { kind: 'highlight', text: '合作=把每个人的力气加在一起再乘一个"配合系数"' },
      ] },
      { when: 2, title: '竞争', subtitle: '规则与风度', color: 'blue', emoji: '🏁', blocks: [
        { kind: 'info', icon: '⚽', title: '为什么需要规则', text: '如果没有规则·跑得快的可以抄近道·力气大的可以推人——比赛就不公平了：规则让竞争变成"比谁更好"而不是"比谁更坏"：公平的输赢才让人服气' },
        { kind: 'compare', title: '好选手vs坏选手', items: [
          { label: '好选手', value: '输了说"恭喜你·下次再比"——赢了说"你也很棒"' },
          { label: '坏选手', value: '输了怪队友怪裁判——赢了嘲笑对手' },
        ] },
        { kind: 'info', icon: '🏆', title: '竞争的意义', text: '不是为了打败别人——是让自己变得更好：有对手你才跑得更快（没人追你你就慢慢走了）：感谢对手——TA让你更强' },
        { kind: 'highlight', text: '最好的竞争=跟昨天的自己比+感谢让你进步的对手' },
      ] },
      { when: 3, title: '平衡', subtitle: '既是队友也是对手', color: 'amber', emoji: '⚖️', blocks: [
        { kind: 'info', icon: '🏟️', title: '运动场上的真相', text: 'NBA 球星场上是对手·场下是朋友——比赛时全力以赴是对对手的尊重·比赛后握手拥抱是对友谊的尊重："场上是对手·场下是朋友"' },
        { kind: 'info', icon: '🏫', title: '学校里的版本', text: '小组作业=合作（一起做手抄报）；考试排名=竞争（各自考最好的分）；班级拔河=合作+竞争（队内合作队间竞争）——知道什么时候合作什么时候竞争是聪明人的本事' },
        { kind: 'highlight', text: '知道什么时候合作·什么时候竞争——这是社会生活的开关' },
      ] },
    ],
    teach: { sections: [
      { title: '合作的力量', body: '【本质】分工+配合→1+1>2。\n【三秘】分工明确·互相补台·共享成果。' },
      { title: '竞争与规则', body: '【规则】让竞争比谁更好不比谁更坏。\n【风度】赢了不嘲笑·输了不找借口。\n【意义】让自己变好·不是打倒别人。' },
      { title: '平衡', body: '【场上对手场下朋友。\n【场景】小组=合作·考试=竞争·拔河=合作+竞争。\n【智慧】知道什么时候开哪个开关。' },
    ], examples: [
      { q: '小组作业里有人不干活', steps: ['先私下问：遇到困难了吗', '帮他：分工缩小', '还不行：告诉老师（如实汇报）', '记住：合作需要每个人都出力'], tip: '合作的原则' },
      { q: '比赛输给了好朋友', steps: ['说"恭喜你·你真棒"', '问问TA怎样练的', '下次一起练', '朋友赢了也是开心的事'], tip: '竞争的风度' },
    ], mistakes: ['认为竞争=打败别人（是让自己更好）', '输了就怪队友怪裁判（输了也要有风度）'] },
    exercises: [
      { q: '合作能"1+1>2"的原因是？', options: ['人数多', '分工和配合产生额外效率', '嗓门大', '运气好'], answer: 1, explain: '配合系数' },
      { q: '竞争需要规则因为？', options: ['好看', '让竞争公平（比谁更好不比谁更坏）', '老师要求', '浪费时间'], answer: 1, explain: '公平是基础' },
      { q: '比赛输了正确的心态是？', options: ['怪队友', '恭喜对手·下次再战', '再也不比了', '大哭'], answer: 1, explain: '竞争的风度' },
      { q: '竞争的真正意义是？', options: ['打倒别人', '让自己变得更好', '拿奖品', '炫耀'], answer: 1, explain: '跟自己比' },
      { q: '"场上是对手·场下是___"', options: ['敌人', '朋友', '陌生人', '仇人'], answer: 1, explain: '竞争与合作并存' },
      { q: '知道什么时候合作·什么时候竞争——这是社会生活的 ___', options: ['开关', '障碍'], answer: 0, explain: '社交智慧', type: 'blank', blank: { answerText: '开关', bank: ['开关', '障碍'] } },
    ],
  }),
  L({
    area: '社会学', band: 'primary', grade: 6, id: 'soc-37', order: 871, title: '家庭是什么：爱的社会组织', emoji: '🏠', textbook: '综合素养读本·社会',
    curriculum: { module: '家庭与社会', points: ['家庭的形态多样', '家人的角色', '我能为家做什么'] },
    story: '有的同学跟爸爸妈妈住·有的跟爷爷奶奶住·有的只有一个爸爸或妈妈——家有很多种形状。但不管什么形状·家都是那个"有人等你回来"的地方。这一课认识家的多样性·也想想自己能为家做什么。',
    goals: ['了解家庭的多样性', '理解家人的角色分工', '思考自己能为家做的事'],
    aiIntro: '🏠 家是有很多形状的——爱的组织！',
    param: { name: 'fm', label: '家庭站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么同学家的形状跟我不一样？', '为什么爸妈总要我做家务？', '我怎样让家更温暖？'],
    views: [
      { when: 1, title: '形状', subtitle: '各种家', color: 'rose', emoji: '🏡', blocks: [
        { kind: 'compare', title: '家的多样性', items: [
          { label: '核心家庭', value: '爸爸妈妈+孩子——最常见的形状（三口或四口之家）' },
          { label: '大家庭', value: '爷爷奶奶+爸爸妈妈+孩子（甚至更大家庭成员一起住）——传统中国家庭的形状' },
          { label: '单亲家庭', value: '只有一个爸爸或妈妈+孩子——不是因为不爱·是因为生活有时会变：单亲的家一样有爱' },
          { label: '其他形状', value: '重组家庭（新爸妈+孩子）·隔代家庭（爷爷奶奶照顾）——家的形状不重要·有爱才重要' },
        ] },
        { kind: 'info', icon: '💖', title: '家的定义', text: '家不是"必须有什么人"——是"有人关心你·你也关心TA"的地方：不管你的家是什么形状·都值得被尊重——嘲笑别人的家庭形状=最大的不礼貌' },
        { kind: 'highlight', text: '家的形状有很多种——爱的形式也有很多种' },
      ] },
      { when: 2, title: '角色', subtitle: '谁做什么', color: 'green', emoji: '👨‍👩‍👧', blocks: [
        { kind: 'info', icon: '💼', title: '家人的分工', text: '爸妈挣钱养家（经济支柱）·做饭洗衣（家务劳动）·辅导功课（教育）——每个人的角色不同但都重要：家务活"看不见"但不可缺少（做一天家务就知道多累）' },
        { kind: 'info', icon: '🔄', title: '角色在变', text: '以前"爸爸挣钱妈妈做饭"——现在越来越多家庭"爸妈都挣钱也一起做饭"：角色不是固定的·商量着来就好：重要的是每个人都参与' },
        { kind: 'info', icon: '🧒', title: '我的角色', text: '你不是"客人"——你是家的一员：你能做的=自己的事自己做+力所能及的家务+表达爱——三样做到了你就是家里真正的"合伙人"' },
        { kind: 'highlight', text: '家里的每个人都是合伙人——包括你' },
      ] },
      { when: 3, title: '贡献', subtitle: '我能做什么', color: 'amber', emoji: '🌟', blocks: [
        { kind: 'steps', title: '五件你能做的', items: ['自己的事自己做：整理书包·叠被子·洗自己的碗——不让爸妈帮你做你能做的', '每周做一件家务：扫地·倒垃圾·擦桌子——参与家务=参与这个家', '说谢谢和晚安：别把家人的付出当"理所当然"——每天一句谢谢·睡前一句晚安', '考好不是唯一的报答：健康快乐·善良努力·体谅爸妈——这些比分数更让爸妈安心', '家人吵架时不当"观众"：不说"别吵了烦死了"——回自己房间·或给爸妈倒杯水（让他们知道你在乎）' ] },
        { kind: 'info', icon: '💝', title: '为什么家务重要', text: '做家务=我在乎这个家=我是家里的一员——研究：从小做家务的孩子长大后独立能力和幸福感都更强：做家务不是"帮爸妈干活"是"建设自己的家"' },
        { kind: 'highlight', text: '家不是旅馆——你住在这里·你就建设这里' },
      ] },
    ],
    teach: { sections: [
      { title: '家庭多样性', body: '【形态】核心·大家庭·单亲·重组·隔代。\n【核心】形状不重要有爱才重要。\n【尊重】不嘲笑别人的家庭形状。' },
      { title: '家人角色', body: '【分工】挣钱+家务+教育——每样都重要。\n【变化】角色不是固定的·商量着来。\n【你】不是客人——是合伙人。' },
      { title: '我的贡献', body: '【五件】自己的事+做家务+说谢谢+健康快乐+体谅。\n【研究】做家务的孩子更独立幸福。\n【本质】参与家务=建设自己的家。' },
    ], examples: [
      { q: '同学来自单亲家庭被人笑话', steps: ['家的形状有很多种', '单亲的家一样有爱', '嘲笑家庭=最大的不礼貌', '你可以站出来说"别这样"'], tip: '尊重多样性' },
      { q: '爸妈总让我做家务觉得烦', steps: ['家务=我是家里的一员', '试试做一天全部家务感受一下', '分工合作比一个人做轻松', '做家务的孩子长大后更独立'], tip: '合伙人心态' },
    ], mistakes: ['认为只有一种"正常"的家的形状（多样性是常态）', '认为自己在家是"客人"什么都不用做（是合伙人）'] },
    exercises: [
      { q: '最常见的"核心家庭"是？', options: ['一个人住', '爸爸妈妈+孩子', '二十个人', '只有老人'], answer: 1, explain: '最常见形状' },
      { q: '判断一个"家"的标准是？', options: ['房子大小', '有人关心你你也关心TA', '钱多少', '人数'], answer: 1, explain: '爱的联结' },
      { q: '嘲笑别人的家庭形状是？', options: ['有趣', '最大的不礼貌', '正常', '没关系'], answer: 1, explain: '尊重多样性' },
      { q: '在家里的角色你应该是？', options: ['客人', '合伙人（参与建设）', '老板', '观众'], answer: 1, explain: '参与家务=参与家' },
      { q: '研究显示从小做家务的孩子长大后？', options: ['更懒', '更独立更幸福', '更穷', '更胖'], answer: 1, explain: '能力的锻炼' },
      { q: '家不是旅馆——你住在这里·你就 ___ 这里', options: ['建设', '破坏'], answer: 0, explain: '合伙人心态', type: 'blank', blank: { answerText: '建设', bank: ['建设', '破坏'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 7, id: 'eng-38', order: 872, title: 'Daily English: 点餐·购物·问路', emoji: '🍔', textbook: '人教PEP（七年级）',
    curriculum: { module: '实用英语', points: ['点餐用语', '购物砍价', '问路指路'] },
    story: '想象你在国外旅行：饿了要点餐·想买纪念品·迷路要问路——课本上的"Is this a pen?"帮不了你。这一课教三个最实用的日常场景——学完就能开口用。',
    goals: ['掌握点餐基本用语', '掌握购物问价用语', '掌握问路指路用语'],
    aiIntro: '🍔 出国也不怕——实用场景英语！',
    param: { name: 'de', label: '场景站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['怎样用英语点一份汉堡？', '怎样问"多少钱"？', '迷路了怎样用英语问路？'],
    views: [
      { when: 1, title: '点餐', subtitle: 'Restaurant', color: 'amber', emoji: '🍽️', blocks: [
        { kind: 'steps', title: '点餐四句', items: ['Could I have a cheeseburger and fries, please?（请给我一个芝士汉堡和薯条）——加 please 是礼貌', 'For here or to go?（在这儿吃还是带走？）——店员会问你', 'For here, please. / To go, please.', 'Anything else? No, thanks. That is all.（还要别的吗？不了谢谢）——收尾' ] },
        { kind: 'info', icon: '💧', title: '加一句', text: 'Could I get some water, please?（可以给我一些水吗？）——免费的水在大部分餐厅可以要：渴了别忍着' },
        { kind: 'highlight', text: 'Could I have... please? = 万能点餐句' },
      ] },
      { when: 2, title: '购物', subtitle: 'Shopping', color: 'green', emoji: '🛍️', blocks: [
        { kind: 'compare', title: '购物三句', items: [
          { label: '问价', value: 'How much is this? / How much are these?（这个/这些多少钱？）——最简单最万能' },
          { label: '试穿', value: 'Can I try this on?（我可以试试吗？）——买衣服必问' },
          { label: '决定', value: 'I will take it.（我要买它）/ I am just looking.（我只是看看）——买或不买都礼貌' },
        ] },
        { kind: 'info', icon: '💰', title: '付钱', text: 'Do you take credit cards?（可以刷卡吗？）/ Cash, please.（现金）——国外的支付方式跟国内不同·提前问清楚' },
        { kind: 'highlight', text: 'How much + I will take it = 购物闭环' },
      ] },
      { when: 3, title: '问路', subtitle: 'Directions', color: 'blue', emoji: '🗺️', blocks: [
        { kind: 'steps', title: '问路三句', items: ['Excuse me, how can I get to the train station?（打扰一下·怎样到火车站？）——Excuse me 开头是礼貌', 'Is it far from here?（离这里远吗？）/ How long does it take to walk?（走路要多久？）', 'Thank you so much! / Thanks for your help!（非常感谢）——问完一定说谢谢' ] },
        { kind: 'info', icon: '↩️', title: '听懂回答', text: 'Go straight.（直走）/ Turn left.（左转）/ Turn right.（右转）/ It is next to the bank.（在银行旁边）——四个方向词+两个方位词就能听懂大部分指路' },
        { kind: 'info', icon: '📱', title: '兜底策略', text: 'Could you show me on the map?（能在地图上指给我看吗？）——听不懂没关系·打开手机地图让对方指：万无一失' },
        { kind: 'highlight', text: 'Excuse me + How can I get to... + Thank you = 问路三件套' },
      ] },
    ],
    teach: { sections: [
      { title: '点餐用语', body: '【万能】Could I have... please?\n【问答】For here or to go?\n【结尾】That is all. Thanks.' },
      { title: '购物用语', body: '【问价】How much is/are...?\n【试穿】Can I try it on?\n【决定】I will take it. / Just looking.' },
      { title: '问路用语', body: '【开头】Excuse me...\n【核心】How can I get to...?\n【听懂】straight/left/right/next to。\n【兜底】Show me on the map.' },
    ], examples: [
      { q: '在麦当劳想点一个汉堡和可乐', steps: ['Could I have a burger and a Coke, please?', 'For here or to go?', 'For here, please.', 'Thanks!'], tip: '万能句式' },
      { q: '在国外迷路了找不到酒店', steps: ['Excuse me, how can I get to the hotel?', 'Is it far?', '听不懂→Could you show me on the map?', 'Thank you so much!'], tip: '问路三件套' },
    ], mistakes: ['直接说"Give me..."（不礼貌——用 Could I have... please?）', '问完路不说谢谢（Thank you 是必须的）'] },
    exercises: [
      { q: '点餐最礼貌的说法是？', options: ['Give me a burger', 'Could I have a burger, please?', 'Burger!', 'I want want want'], answer: 1, explain: 'Could+please' },
      { q: '"For here or to go?"的意思是？', options: ['你好吗', '在这儿吃还是带走', '多少钱', '你是谁'], answer: 1, explain: '点餐高频问句' },
      { q: '问价钱应该用？', options: ['What is this?', 'How much is it?', 'Where is it?', 'Who are you?'], answer: 1, explain: '万能问价' },
      { q: '问路时开头应该先说？', options: ['Hey!', 'Excuse me', 'Look!', 'Stop!'], answer: 1, explain: '礼貌开头' },
      { q: '听不懂对方指路怎么办？', options: ['假装听懂', 'Could you show me on the map?', '跑走', '不说'], answer: 1, explain: '地图兜底' },
      { q: 'Excuse me + How can I get to... + Thank you = 问路 ___', options: ['三件套', '三座山'], answer: 0, explain: '完整流程', type: 'blank', blank: { answerText: '三件套', bank: ['三件套', '三座山'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 8, id: 'eng-39', order: 873, title: '英语邮件：怎样写得清楚又礼貌', emoji: '📧', textbook: '人教PEP（八年级）',
    curriculum: { module: '实用写作', points: ['邮件结构', '礼貌用语', '常见错误'] },
    story: '给外国笔友写邮件·给国外学校写申请——英语邮件不是"把中文翻译过去"就行：它有自己的格式和礼貌规则。一封写好的邮件让人印象深刻·一封写差的邮件可能直接被忽略。这一课学会写一封"Professional"的邮件。',
    goals: ['掌握英语邮件结构', '学会礼貌用语', '避免中式英语'],
    aiIntro: '📧 写一封让人印象深刻的英语邮件！',
    param: { name: 'em', label: '邮件站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['英语邮件的固定格式是什么？', '怎样开头和结尾最礼貌？', '中式英语最常犯的错？'],
    views: [
      { when: 1, title: '结构', subtitle: '四段式', color: 'blue', emoji: '📐', blocks: [
        { kind: 'steps', title: '邮件四件套', items: ['Subject 主题：简短说明来意——"Question about Homework" 不是"Help!!!"', 'Greeting 称呼：Dear Mr. Smith, / Hi Amy,（正式/非正式）', 'Body 正文：第一段说明来意·中间段展开·最后段说明希望对方做什么', 'Closing 结尾：Thank you. / Best wishes, / Best regards, + 签名' ] },
        { kind: 'info', icon: '📏', title: '正文三句起步', text: '第一句为什么写（I am writing to ask about...）·中间具体内容·最后说期望（I would appreciate your reply）——不需要长·清楚就行' },
        { kind: 'highlight', text: 'Subject+Greeting+Body+Closing=邮件的骨架' },
      ] },
      { when: 2, title: '礼貌', subtitle: '正式vs非正式', color: 'green', emoji: '🎩', blocks: [
        { kind: 'compare', title: '两种语气', items: [
          { label: '正式（老师·机构）', value: 'Dear Professor Brown, / I would like to inquire about... / I look forward to hearing from you. / Best regards,' },
          { label: '非正式（朋友）', value: 'Hi Tom! / Just wanted to ask... / See you soon! / Cheers,' },
          { label: '选哪种', value: '看你写给谁——正式场合用正式·朋友用非正式：搞不清楚时宁正式勿随意' },
        ] },
        { kind: 'info', icon: '🤝', title: '礼貌三宝', text: '①Please 和 Thank you 永远不嫌多；②用请求语气（Could you...? / Would you mind...?）而不是命令（Send me...）；③道歉及时（I am sorry for the late reply）——三样到位·好感翻倍' },
        { kind: 'highlight', text: '礼貌不是客气话堆砌——是让对方感到被尊重' },
      ] },
      { when: 3, title: '避坑', subtitle: '中式英语', color: 'rose', emoji: '🚫', blocks: [
        { kind: 'compare', title: '中式 vs 地道', items: [
          { label: '开头', value: '中式：I am a student. I want to ask you a question. / 地道：I am writing to ask about...' },
          { label: '请求', value: '中式：Please answer me quickly. / 地道：I would appreciate your prompt reply.' },
          { label: '结尾', value: '中式：I have no more words. / 地道：Thank you for your time. I look forward to hearing from you.' },
        ] },
        { kind: 'info', icon: '💡', title: '万能模板', text: '主题：Question About [具体事]\\n Dear [称呼],\\n I am writing to [说明来意].\\n [具体内容1-2句]\\n Could you please [希望对方做什么]?\\n Thank you for your time.\\n Best regards,\\n [你的名字]——照填就能用' },
        { kind: 'highlight', text: 'I am writing to... + Could you please... + Thank you = 万能邮件公式' },
      ] },
    ],
    teach: { sections: [
      { title: '邮件结构', body: '【四件套】Subject+Greeting+Body+Closing。\n【正文】来意+内容+期望。' },
      { title: '礼貌用语', body: '【正式】Dear...+I would like to+Best regards。\n【非正式】Hi...+Just wanted to+Cheers。\n【三宝】Please·请求语气·及时道歉。' },
      { title: '中式英语', body: '【避免】直译中文句式。\n【用地道】I am writing to... / Could you please...\n【万能】模板照填就能用。' },
    ], examples: [
      { q: '给外教写邮件问作业', steps: ['Subject: Question About Homework', 'Dear Ms. Smith,', 'I am writing to ask about...', 'Could you please clarify...?', 'Thank you. Best regards,'], tip: '正式模板' },
      { q: '给外国笔友回邮件', steps: ['Hi Amy!', 'Thanks for your email!', '回答她的问题+分享你的', 'See you soon! Cheers,'], tip: '非正式' },
    ], mistakes: ['把中文逐字翻译成英语（用英语的惯用表达）', '正式场合用太随意的语气（宁正式勿随意）'] },
    exercises: [
      { q: '邮件主题行的最佳写法？', options: ['Help!!!', 'Question About Homework（简短说明来意）', '很长的句子', '空白'], answer: 1, explain: '让人一眼知道来意' },
      { q: '给老师的邮件称呼用？', options: ['Hey!', 'Dear Mr./Ms. + 姓氏', '喂', '不写称呼'], answer: 1, explain: '正式称呼' },
      { q: '请求对方做某事最礼貌的是？', options: ['Do it now', 'Could you please...?', 'You must', 'Hurry up'], answer: 1, explain: '请求语气' },
      { q: '"中式英语"指的是？', options: ['中国人说英语', '直接翻译中文句式而不用地道表达', '发音不准', '写太短'], answer: 1, explain: '句式直译' },
      { q: '邮件万能公式的第一步是？', options: ['Hi!!!', 'I am writing to...（说明来意）', 'Help me', 'Thank you'], answer: 1, explain: '开头说明来意' },
      { q: 'I am writing to... + Could you please... + Thank you = 万能邮件 ___', options: ['公式', '灾难'], answer: 0, explain: '照填就能用', type: 'blank', blank: { answerText: '公式', bank: ['公式', '灾难'] } },
    ],
  }),
  L({
    area: '体育与健康', band: 'primary', grade: 4, id: 'pe-41', order: 874, title: '运动习惯：让身体爱上动起来', emoji: '🏃', textbook: '人教版体育（小学）',
    curriculum: { module: '健康习惯', points: ['为什么要天天动', '怎样坚持不放弃', '选择适合的运动'] },
    story: '你有没有发现：跑了一天很累但睡得特别香？打了一下午球虽然出汗但心情特别好？——因为运动时大脑会分泌"快乐分子"（内啡肽）。运动不是任务·是身体最喜欢的礼物。这一课学会让运动变成习惯。',
    goals: ['理解运动的好处', '掌握养成习惯的方法', '选择适合自己的运动'],
    aiIntro: '🏃 让身体爱上动起来——运动习惯课！',
    param: { name: 'hb', label: '习惯站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么运动完心情好？', '怎样坚持不半途而废？', '什么运动最适合我？'],
    views: [
      { when: 1, title: '好处', subtitle: '为什么动', color: 'green', emoji: '💪', blocks: [
        { kind: 'info', icon: '🧠', title: '大脑的快乐分子', text: '运动时大脑分泌内啡肽——天然的"快乐药"：跑完步心情好·打球后烦恼少了——这不是巧合是化学：运动是最便宜的心情调节器' },
        { kind: 'info', icon: '😴', title: '睡得香', text: '白天运动消耗能量→晚上身体需要休息→入睡快·睡得沉：不运动的孩子容易睡不好——白天多动=晚上多睡' },
        { kind: 'info', icon: '📏', title: '长得高', text: '跳跃和跑步刺激骨骼生长板——游泳·跳绳·篮球都帮助长个子：光吃钙片不如出门跳十分钟绳' },
        { kind: 'highlight', text: '运动=心情好+睡得香+长得高——一石三鸟' },
      ] },
      { when: 2, title: '坚持', subtitle: '习惯养成', color: 'blue', emoji: '🔗', blocks: [
        { kind: 'steps', title: '习惯三个魔法', items: ['定时间：每天固定时间运动（放学后第一件事=换运动鞋）——固定时间=大脑自动提醒你', '从小开始：第一天跳绳50个就够了——不要一上来就500个：慢慢加·身体才跟得上', '找伙伴：跟朋友或爸妈一起——有人陪你坚持的概率翻倍：一个人容易放弃·两个人互相拉' ] },
        { kind: 'info', icon: '📅', title: '21天不是魔法', text: '"21天养成习惯"不完全对——有人7天有人3个月：关键是"不中断超过2天"——断了2天以上习惯就松了：断了1天没关系·第2天一定要接上' },
        { kind: 'info', icon: '🎯', title: '记录打卡', text: '日历上画✓——看着一排✓很有成就感：不要小看画✓的力量·大脑喜欢"看到进步"' },
        { kind: 'highlight', text: '固定时间+从小开始+找伙伴=习惯养成的三板斧' },
      ] },
      { when: 3, title: '选择', subtitle: '什么适合我', color: 'amber', emoji: '🎯', blocks: [
        { kind: 'compare', title: '按喜好选', items: [
          { label: '喜欢团队', value: '篮球·足球·排球——跟朋友一起跑一起笑' },
          { label: '喜欢个人', value: '跳绳·跑步·游泳——自己节奏自己掌控' },
          { label: '喜欢挑战', value: '武术·攀岩·滑冰——学新技能很有成就感' },
          { label: '不喜欢激烈', value: '散步·骑车·太极拳——轻柔的运动也是运动' },
        ] },
        { kind: 'info', icon: '💡', title: '最好的运动', text: '你愿意坚持的就是最好的——不需要跟别人一样：试几种·找到"做的时候不觉得苦"的那种：喜欢的才能长久' },
        { kind: 'highlight', text: '最好的运动=你愿意坚持的那种' },
      ] },
    ],
    teach: { sections: [
      { title: '运动的好处', body: '【心情】内啡肽=天然快乐药。\n【睡眠】白天消耗→晚上睡得香。\n【身高】跳跃刺激生长板。' },
      { title: '习惯养成', body: '【三招】固定时间+从小开始+找伙伴。\n【关键】不中断超过2天。\n【打卡】日历画✓看到进步。' },
      { title: '选择运动', body: '【团队】球类——社交+运动。\n【个人】跳绳跑步——自己节奏。\n【标准】愿意坚持的就是最好的。' },
    ], examples: [
      { q: '想每天跳绳但坚持不了', steps: ['从50个开始不贪多', '固定放学后时间', '找同学一起', '日历画✓'], tip: '三板斧' },
      { q: '不知道选什么运动', steps: ['想喜欢团队还是个人', '试2-3种', '选"做的时候不觉得苦"的', '开始了就不轻易换'], tip: '试了才知道' },
    ], mistakes: ['一开始就大量运动（从小量开始·身体需要适应）', '断了几天就放弃（断了1天没关系·第2天接上就好）'] },
    exercises: [
      { q: '运动后心情好是因为大脑分泌了？', options: ['毒药', '内啡肽（天然快乐分子）', '糖', '盐'], answer: 1, explain: '化学的快乐' },
      { q: '帮助长高的运动特点是？', options: ['躺着', '有跳跃（刺激骨骼生长板）', '只动手', '只说话'], answer: 1, explain: '跳绳篮球' },
      { q: '养成运动习惯的三板斧不包括？', options: ['固定时间', '从小开始', '找伙伴', '一次做够一年的量'], answer: 3, explain: '要循序渐进' },
      { q: '习惯中断几天以上容易松掉？', options: ['1天', '2天', '一个月', '无所谓'], answer: 1, explain: '断了就接上' },
      { q: '最好的运动是什么？', options: ['最贵的', '你愿意坚持的那种', '别人都做的', '最难的'], answer: 1, explain: '能坚持才有效' },
      { q: '最好的运动=你愿意 ___ 的那种', options: ['坚持', '放弃'], answer: 0, explain: '喜欢才能长久', type: 'blank', blank: { answerText: '坚持', bank: ['坚持', '放弃'] } },
    ],
  }),
  L({
    area: '科学', band: 'primary', grade: 5, id: 'sci-36', order: 875, title: '环保小卫士：怎样在生活里保护地球', emoji: '🌍', textbook: '浙教版科学（五年级）',
    curriculum: { module: '环境与生活', points: ['垃圾分类实战', '节能节水习惯', '减少浪费的选择'] },
    story: '北极熊的家在融化·海里的塑料比鱼还多——听起来很远？其实你今天扔的每一个塑料瓶·开的每一盏灯·都在参与这个大故事。好消息是：反过来的每一个小行动也在参与。这一课学会做环保小卫士。',
    goals: ['掌握垃圾分类的正确方法', '养成节能节水的日常习惯', '学会减少浪费的选择'],
    aiIntro: '🌍 你的每个小行动都在改变地球——环保课！',
    param: { name: 'en', label: '环保站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['外卖盒应该扔哪个桶？', '刷牙时水龙头该不该关？', '怎样用更少的东西过一样好的生活？'],
    views: [
      { when: 1, title: '分类', subtitle: '四色桶', color: 'green', emoji: '🗑️', blocks: [
        { kind: 'compare', title: '垃圾分类', items: [
          { label: '蓝色·可回收', value: '纸张·塑料瓶·金属罐·玻璃——洗干净压扁扔：这些能变成新东西（100个塑料瓶=一件 fleece 外套）' },
          { label: '绿色·厨余', value: '剩饭剩菜·果皮·菜叶——能变成肥料：外卖吃剩的饭倒进厨余·盒子另扔' },
          { label: '红色·有害', value: '电池·灯管·过期药品——量少但危害大：一节电池污染一立方米土壤' },
          { label: '灰色·其他', value: '用过的纸巾·尿布·陶瓷碎片——不能回收也不能堆肥的' },
        ] },
        { kind: 'info', icon: '❓', title: '搞不清楚怎么办', text: '不知道扔哪个桶→扔"其他"（灰色）——扔错可回收会污染一整批·宁可保守：记不住就记住一个原则：拿不准·扔灰色' },
        { kind: 'highlight', text: '四色桶记不住？拿不准就扔灰色"其他"' },
      ] },
      { when: 2, title: '节能', subtitle: '日常习惯', color: 'blue', emoji: '💡', blocks: [
        { kind: 'steps', title: '五个节能习惯', items: ['随手关灯：离开房间关灯·白天用自然光——一年省的电够手机充几百次', '刷牙关水龙头：刷牙2分钟不关水=流掉6升水（一瓶大可乐）——湿了牙刷就关·漱口再开', '空调26度：每调高1度省电6-8%——26度+风扇=又舒服又省电', '拔插头：不用的充电器插在插座上也在耗电（ vampire power吸血电）——拔掉=省钱', '自带水瓶：少买一瓶矿泉水=少一个塑料瓶——好水瓶用几年·环保又省钱' ] },
        { kind: 'info', icon: '🚿', title: '淋浴vs盆浴', text: '淋浴5分钟用水约50升·盆浴一次约150升——淋浴用水的三分之一：快速淋浴=省水+省时间+省钱三赢' },
        { kind: 'highlight', text: '节能不是吃苦——是用聪明的方式做同样的事' },
      ] },
      { when: 3, title: '减废', subtitle: '少买少扔', color: 'amber', emoji: '♻️', blocks: [
        { kind: 'compare', title: '3R 原则', items: [
          { label: 'Reduce 减量', value: '最好的环保=不制造垃圾——少买不需要的·少用一次性的：最好的回收是不用回收' },
          { label: 'Reuse 重复使用', value: '玻璃瓶当花瓶·旧衣服当抹布·快递盒当收纳——用第二次就是帮地球一次' },
          { label: 'Recycle 回收', value: '扔进正确的桶让工厂变成新材料——最后的选择（因为回收也需要能源）' },
        ] },
        { kind: 'info', icon: '📦', title: '外卖怎么办', text: '选"不需要餐具"——家里有筷子为什么要一次性？一个月少用20套餐具=少20份塑料垃圾：点外卖时勾一个选项就能做到' },
        { kind: 'highlight', text: '最好的环保不是回收更多——是浪费更少' },
      ] },
    ],
    teach: { sections: [
      { title: '垃圾分类', body: '【蓝】可回收——洗净压扁。\n【绿】厨余——能堆肥。\n【红】有害——电池灯管药品。\n【灰】其他——拿不准扔这里。' },
      { title: '节能习惯', body: '【五招】关灯·关水·26度·拔插头·自带瓶。\n【淋浴】比盆浴省三分之二。' },
      { title: '3R减废', body: '【Reduce】减量是最好的环保。\n【Reuse】重复使用排第二。\n【Recycle】回收是最后的选择。\n【外卖】勾"不需要餐具"。' },
    ], examples: [
      { q: '喝完的奶茶杯扔哪个桶', steps: ['倒掉液体→厨余', '珍珠倒厨余', '杯子 rinsed 后→可回收（没洗→其他）', '吸管→其他'], tip: '分步处理' },
      { q: '想为环保做一件事', steps: ['从最简单的开始：自带水瓶', '坚持一周', '加第二个：随手关灯', '小习惯×多人=大改变'], tip: '从小做起' },
    ], mistakes: ['搞不清分类就不分类了（拿不准扔灰色"其他"）', '认为环保=吃苦（是用聪明方式做同样的事）'] },
    exercises: [
      { q: '废旧电池应该扔哪个桶？', options: ['蓝色可回收', '红色有害垃圾', '绿色厨余', '灰色其他'], answer: 1, explain: '一节污染一立方土' },
      { q: '刷牙时不关水龙头2分钟约流掉？', options: ['一杯水', '6升水（一大瓶可乐）', '一桶水', '一滴水'], answer: 1, explain: '湿牙刷就关' },
      { q: '空调每调高1度约省电？', options: ['1%', '6-8%', '50%', '不省'], answer: 1, explain: '26度+风扇' },
      { q: '3R原则的优先顺序是？', options: ['回收>重复>减量', '减量>重复使用>回收', '都一样', '只要回收'], answer: 1, explain: '不制造>再利用>再加工' },
      { q: '点外卖时最简单的环保行为？', options: ['多点菜', '勾"不需要餐具"', '不用手机点', '多要纸巾'], answer: 1, explain: '一个勾的事' },
      { q: '最好的环保不是回收更多——是浪费更 ___', options: ['少', '多'], answer: 0, explain: 'Reduce第一', type: 'blank', blank: { answerText: '少', bank: ['少', '多'] } },
    ],
  }),
  L({
    area: '语文', band: 'senior', grade: 10, id: 'chn-41', order: 876, title: '学术写作：怎样写研究报告', emoji: '📝', textbook: '统编版必修',
    curriculum: { module: '学术写作', points: ['研究问题与假设', '论证结构', '引用规范'] },
    story: '大学的第一篇论文·很多人从"复制粘贴"开始·被导师打回重写——不是内容不好·是不知道学术写作有它的规则。跟写记叙文完全不同的思维方式：不是为了感动人·是为了说服人。这一课提前学会。',
    goals: ['学会提出研究问题', '掌握论证的结构', '了解引用规范'],
    aiIntro: '📝 说服而不是感动——学术写作课！',
    param: { name: 'aw', label: '写作站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['什么是好的研究问题？', '学术论文的结构是什么？', '为什么引用这么重要？'],
    views: [
      { when: 1, title: '提问', subtitle: '研究的起点', color: 'blue', emoji: '❓', blocks: [
        { kind: 'compare', title: '好问题vs坏问题', items: [
          { label: '坏问题', value: '"社交媒体好吗？"——太宽·无法研究（好/坏取决于角度和标准）' },
          { label: '好问题', value: '"社交媒体使用时间与中学生睡眠质量的关系"——具体·可测量·有变量' },
          { label: '公式', value: '好问题=具体变量+明确关系+可回答的范围——把大话题缩到你能搞定的切口' },
        ] },
        { kind: 'info', icon: '🧪', title: '假设：你的预判', text: '假设=你对研究问题的初步回答（可验证的）——"社交媒体使用时间与睡眠质量负相关"：假设不是"我觉得"·是基于已有文献的可检验预测' },
        { kind: 'highlight', text: '好问题比好答案更重要——问题错了全白写' },
      ] },
      { when: 2, title: '结构', subtitle: '论文骨架', color: 'green', emoji: '🏗️', blocks: [
        { kind: 'steps', title: '学术论文五段', items: ['引言：提出问题+为什么重要+你的论点（thesis）——让别人知道你要说什么', '文献综述：别人已经研究了什么——站在巨人肩膀上·不是从零开始', '方法/论据：你怎样研究的——数据来源·实验设计·逻辑推理', '结果/分析：你发现了什么——用事实和数据说话', '结论：回答了问题+意义+局限+展望——诚实地说"还有什么没做到"' ] },
        { kind: 'info', icon: '⚠️', title: '学术写作大忌', text: '①"我觉得"（用"数据显示"代替）；②只有观点没有证据（每个论点至少一个论据）；③先写结论再找证据（这叫确认偏误——应该让证据决定结论）；④抄袭不注明（=学术死刑）' },
        { kind: 'highlight', text: '学术论文的说服力=证据的质量·不是修辞的华丽' },
      ] },
      { when: 3, title: '引用', subtitle: '学术诚信', color: 'amber', emoji: '📚', blocks: [
        { kind: 'info', icon: '📝', title: '为什么要引用', text: '①尊重原作者的知识产权；②让读者可以查证你的来源；③让你的论证更有可信度——引用不是形式主义·是学术共同体的信任系统：没有引用=你说的可能是编的' },
        { kind: 'steps', title: '引用三原则', items: ['直接引用加引号+注明出处——原话照抄必须加引号', '间接引用（改写）也要注明——换了说法但观点是别人的', '在文末列出完整的参考文献列表——作者+标题+年份+来源' ] },
        { kind: 'info', icon: '🚫', title: '什么是抄袭', text: '不加引号抄原话=抄袭；改了几个字但不注明=抄袭；交别人写的=抄袭——抄袭的后果从零分到开除：学术诚信是底线不是选择' },
        { kind: 'highlight', text: '引用是学术的氧气——没有它论文就"窒息"了' },
      ] },
    ],
    teach: { sections: [
      { title: '研究问题', body: '【好问题】具体变量+明确关系+可回答范围。\n【假设】可验证的预测（基于文献）。\n【原则】问题比答案重要。' },
      { title: '论文结构', body: '【五段】引言+文献+方法+结果+结论。\n【大忌】只有观点没证据·先定论后找据。\n【说服力】证据质量>修辞华丽。' },
      { title: '引用规范', body: '【原因】尊重知识产权+可查证+可信度。\n【三原则】引号+改写也注明+参考文献列表。\n【底线】抄袭=学术死刑。' },
    ], examples: [
      { q: '想研究短视频对青少年的影响', steps: ['缩小：短视频使用时长与初中生专注力的关系', '假设：时长越长专注力测试得分越低', '设计：问卷+专注力测试', '结论基于数据'], tip: '问题具体化' },
      { q: '论文被批"没有证据"', steps: ['检查每个论点有没有支撑', '找数据/文献/案例', '用"研究表明"替代"我觉得"', '每个观点至少一个证据'], tip: '证据优先' },
    ], mistakes: ['认为学术论文=把想到的全写下来（是有结构的论证）', '改写别人的话不加引用（也是抄袭）'] },
    exercises: [
      { q: '好的研究问题的特征是？', options: ['越大越好', '具体变量+明确关系+可回答范围', '越难越好', '没有标准'], answer: 1, explain: '切口要小' },
      { q: '学术论文的说服力来自？', options: ['修辞华丽', '证据的质量', '字数多', '作者名气'], answer: 1, explain: '证据为王' },
      { q: '"先写结论再找证据"的问题在于？', options: ['效率高', '确认偏误（忽略不利证据）', '节省时间', '没有问题'], answer: 1, explain: '应该让证据决定结论' },
      { q: '引用他人观点的主要原因是？', options: ['凑字数', '尊重知识产权+让论证可信', '好看', '老师要求'], answer: 1, explain: '信任系统' },
      { q: '改写别人的话不加引用算什么？', options: ['没问题', '抄袭（换了说法观点还是别人的）', '原创', '引用'], answer: 1, explain: '间接抄袭' },
      { q: '引用是学术的 ___——没有它论文就窒息了', options: ['氧气', '装饰'], answer: 0, explain: '不可或缺', type: 'blank', blank: { answerText: '氧气', bank: ['氧气', '装饰'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id).join(', '));
