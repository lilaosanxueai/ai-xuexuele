import fs from 'node:fs';
import path from 'node:path';

/**
 * 第154轮：英语 +4（eng-32~35）、地理 +4（geo-23~26）——高二三加密收尾。
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
    area: '英语', band: 'senior', grade: 12, id: 'eng-32', order: 786, title: '概要写作：把长文读薄', emoji: '📝', textbook: '人教版选择性必修',
    curriculum: { module: '写作', points: ['概要的要素', '同义替换技巧', '一步压缩法'] },
    story: '60 词写清一篇 350 词的文章——概要写作像榨果汁：把果肉（细节例子）滤掉，只留最纯的那杯（主旨大意）。它考的其实是阅读理解的终极功力：你能不能用自己的话，把文章的灵魂说出来。',
    goals: ['掌握概要四要素', '学会同义替换', '掌握压缩三步法'],
    aiIntro: '📝 把长文榨成一杯精华——概要写作！',
    param: { name: 'sm', label: '概要站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['哪些内容该留哪些该删？', '为什么不能照抄原句？', '怎样一步步压到 60 词？'],
    views: [
      { when: 1, title: '留什么', subtitle: '四要素', color: 'blue', emoji: '✂️', blocks: [
        { kind: 'info', icon: '🎯', title: '只留主旨骨', text: '保留：每段的主旨句·关键逻辑（因果/对比/转折）·结论——删掉：例子·数据·重复·细节描写——概要 = 文章的骨架投影' },
        { kind: 'steps', title: '四步定位', items: ['首段尾句常是全文主旨', '每段首句常是该段 topic sentence', '转折词（but/however）后是重点', '尾段总结全文——四点抓到·概要成了一半' ] },
        { kind: 'highlight', text: '概要不是缩写——是把文章"再想一遍"再简说' },
      ] },
      { when: 2, title: '替换', subtitle: '不许照抄', color: 'green', emoji: '🔄', blocks: [
        { kind: 'compare', title: '同义替换三招', items: [
          { label: '换词', value: 'important → crucial/vital；solve → address/tackle——高级词上分的关键' },
          { label: '换句式', value: '主动↔被动·从句↔短语（when he was young → young as he was）——句式多样加分' },
          { label: '换视角', value: '正话反说（not difficult → easy）·合并两句（因果连词串起）——逻辑显性化' },
        ] },
        { kind: 'info', icon: '⚠️', title: '扣分雷区', text: '照抄原文连续 5 词以上（判为 copy）·加入自己的观点（概要≠评论）·遗漏要点（漏一段主旨）——概要的扣分往往不是语言·是"跑偏"' },
        { kind: 'highlight', text: '好概要=忠实原文的灵魂+全新的语言外衣' },
      ] },
      { when: 3, title: '压缩', subtitle: '三步到 60', color: 'amber', emoji: '🗜️', blocks: [
        { kind: 'steps', title: '从 350 到 60', items: ['第一轮：每段一句话（各 15 词左右）——四句共 60：主旨句的串联', '第二轮：合并可连的句子（因果/转折词连接）·删冗词（very/really 类）', '第三轮：替换升级词·检查语法拼写·数字控制（不超过 70 为宜）' ] },
        { kind: 'info', icon: '📐', title: '衔接词弹药库', text: '表因果 therefore/thus/as a result；转折 however/nevertheless；递进 moreover/furthermore；总结 in conclusion——四个衔接词把四句话缝成一件衣服' },
        { kind: 'highlight', text: '60 词的概要考验的不是短——是"想得清楚"' },
      ] },
    ],
    teach: { sections: [
      { title: '概要要素', body: '【保留】主旨+关键逻辑+结论。\n【删除】例子数据细节重复。\n【定位】首段尾句·段首句·转折后·尾段。' },
      { title: '同义替换', body: '【词】important→crucial 等升级。\n【句】主被互换·从句短语化。\n【雷区】连续照抄5词+·加观点·漏要点。' },
      { title: '压缩三步', body: '【一】每段一句共60词。\n【二】衔接合并·删冗词。\n【三】升级替换·查语法控词数。' },
    ], examples: [
      { q: '概要被批"copy"了，怎样改？', steps: ['找连续照抄的部分', '换词换句式重写', '对照原文逐句核查', '最后自问：这句话是我的话吗'], tip: '改写不改动意思' },
      { q: '四段文章写到 85 词了', steps: ['删 very/quite/really 类修饰词', '合并因果相关的两句', '例子一律删', '控制在70以内——宁精勿长'], tip: '减肥不减骨' },
    ], mistakes: ['把概要写成读后感（不评论只转述）', '逐句压缩（只留主干·不抄原句）'] },
    exercises: [
      { q: '概要写作最不该做的是？', options: ['保留主旨', '加入个人观点', '同义替换', '控制词数'], answer: 1, explain: '转述不评论' },
      { q: '每段的 topic sentence 通常在？', options: ['段尾', '段首', '段中', '任意'], answer: 1, explain: '英文学术写作惯例' },
      { q: '概要中被判"照抄"的红线大约是？', options: ['连续 5 词以上相同', '任何 1 词', '3 词', '整段'], answer: 0, explain: '查重机制' },
      { q: '四句概要串联成篇的"针线"是？', options: ['感叹词', '衔接词（因果转折递进）', '数字', '问句'], answer: 1, explain: '逻辑显性化' },
      { q: '概要的理想词数是？', options: ['原文一半', '题目要求内（如60词左右不超70）', '越短越好10词', '原文的3/4'], answer: 1, explain: '宁精勿长' },
      { q: '好概要=忠实原文的灵魂+全新的语言 ___', options: ['外衣', '考试'], answer: 0, explain: '转述的艺术', type: 'blank', blank: { answerText: '外衣', bank: ['外衣', '考试'] } },
    ],
  }),
  L({
    area: '英语', band: 'senior', grade: 12, id: 'eng-33', order: 787, title: '高考阅读推断题：读懂字里行间', emoji: '🔎', textbook: '人教版选择性必修',
    curriculum: { module: '阅读理解', points: ['推断题类型', '证据链思维', '排除法'] },
    story: '"What can we infer from the passage?"——这五个单词是无数考生的噩梦。答案从不在原文里写着，但又必须从原文里长出来。推断题考的是侦探式阅读：字面是现场·证据是指纹·答案是根据指纹还原的真相。',
    goals: ['识别推断题的四种类型', '掌握证据链解题法', '用好排除法'],
    aiIntro: '🔎 当一回阅读侦探——推断题！',
    param: { name: 'in', label: '推断站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['推断和瞎猜差在哪？', '为什么"原文提及"的选项往往是错的？', '怎样用排除法锁定答案？'],
    views: [
      { when: 1, title: '四型', subtitle: '对号入座', color: 'blue', emoji: '🗂️', blocks: [
        { kind: 'compare', title: '推断题四大家族', items: [
          { label: '细节推断', value: '根据某段细节推出隐含信息（"作者为什么提到 X？"——目的推断）' },
          { label: '态度推断', value: '"attitude/tone"——褒（positive/approving）·贬（critical/doubtful）·中（objective/neutral）：从用词的形容词副词里读情绪' },
          { label: '写作目的', value: '"purpose—to...?"——说明文 inform·议论文 persuade·记叙文 entertain/share：文体+对象定答案' },
          { label: '出处推断', value: '"Where is the passage likely from?"——科学杂志/广告/小说/通知：从文体特征反推' },
        ] },
        { kind: 'highlight', text: '先判断题型再选策略——对症下药' },
      ] },
      { when: 2, title: '证据链', subtitle: '推断=推理', color: 'green', emoji: '⛓️', blocks: [
        { kind: 'steps', title: '三步证据法', items: ['定位：题干关键词回原文锁定段落/句子', '取证据：划出可支撑推断的原句（形容词·数字·转折·例子）', '推一步：从证据做"一小步"推理——推断≠脑补：多推一步就错' ] },
        { kind: 'info', icon: '⚖️', title: '黄金标准', text: '正确答案的特征：原文没直说·但能从证据合理推出（"最保险的一步"）；错误答案特征：原文直说（太浅·是细节不是推断）·无证据支撑（脑补·常识陷阱）·推理过度（超出原文范围）' },
        { kind: 'info', icon: '🎭', title: '态度题词汇表', text: '褒义：supportive·optimistic·enthusiastic；贬义：skeptical·disapproving·sympathetic(中性偏怜)；中性：objective·uninterested——背这张表·态度题变词汇题' },
        { kind: 'highlight', text: '推断的每一步都要踩在原文的石头上——否则就是落水的脑补' },
      ] },
      { when: 3, title: '排除', subtitle: '反向排除', color: 'amber', emoji: '❌', blocks: [
        { kind: 'steps', title: '排除三板斧', items: ['砍"无据项"：原文完全找不到影子的选项最先排除', '砍"原文直说项"：推断题里"原文照抄"的选项往往是细节干扰', '砍"过度推"：推得比原文远（绝对化 always/never 或新信息）——砍完剩下的就是它' ] },
        { kind: 'info', icon: '⏱️', title: '实战节奏', text: '推断题控制在 90 秒内：30 秒定位·40 秒比对排除·20 秒确认——卡壳先标记跳过·全篇做完回来再看：上下文读全后推断常自动清晰' },
        { kind: 'highlight', text: '选不出"最好"的，就先删掉"最坏"的——排除法是阅读的保底武功' },
      ] },
    ],
    teach: { sections: [
      { title: '题型识别', body: '【细节推断】目的/原因隐含信息。\n【态度】褒贬中三档词汇表。\n【写作目的】inform/persuade/entertain。\n【出处】文体特征反推。' },
      { title: '证据链法', body: '【三步】定位→取证据→推一小步。\n【正确项】没直说但可合理推出。\n【错误项】无据·直说·过度。' },
      { title: '排除法', body: '【三砍】无据项·直说项·过度项。\n【节奏】90秒分配·卡壳先跳。\n【保底】删最坏比选最好更稳。' },
    ], examples: [
      { q: '原文说 "He forced a smile and left quietly."，可推断？', steps: ['证据：forced（勉强的）·quietly（安静）', '推断：他并不开心/有难言之隐', '选项"he was happy"违背证据', '推一小步：unhappy→正确'], tip: '形容词是态度指纹' },
      { q: '选项里有一项是原文原句', steps: ['推断题中出现原句多为干扰', '它可能答非所问（对象错了）', '标记为可疑项不急着选', '用证据链验证其他项后再判'], tip: '原句≠正确' },
    ], mistakes: ['把推断当"合理想象"（必须有原文证据）', '选"原文直说"的选项（推断题要的是隐含信息）'] },
    exercises: [
      { q: '推断题与细节题的最大区别？', options: ['更短', '答案不能从原文直接找到', '更简单', '不用读原文'], answer: 1, explain: '字里行间' },
      { q: '态度推断最可靠的证据来自？', options: ['标题', '形容词副词等评价性用词', '文章长度', '图片'], answer: 1, explain: '用词的指纹' },
      { q: '推断题中"原文原句"选项通常是？', options: ['正确答案', '细节干扰项', '主题句', '翻译'], answer: 1, explain: '太浅不是推断' },
      { q: '含 always/never 的绝对化选项应该？', options: ['优先选', '警惕（推断常过度）', '无所谓', '翻译它'], answer: 1, explain: '过度推断信号' },
      { q: '"推一小步"的含义是？', options: ['只推最保险的一步', '想得越远越好', '不推', '随机猜'], answer: 0, explain: '踩在证据上' },
      { q: '推断的每一步都要踩在原文的 ___ 上', options: ['石头', '封面'], answer: 0, explain: '证据链原则', type: 'blank', blank: { answerText: '石头', bank: ['石头', '封面'] } },
    ],
  }),
  L({
    area: '英语', band: 'senior', grade: 12, id: 'eng-34', order: 788, title: '英语听说考试：口语实战', emoji: '🎤', textbook: '人教版选择性必修',
    curriculum: { module: '听说', points: ['朗读技巧', '听后复述', '情景问答'] },
    story: '听力最后一大题让你开口说——朗读·复述·问答三连，很多学生当场"宕机"。其实口语考试是最"可控"的题型：它考的是可以提前准备的动作，而不是临场灵感。这一课把三个环节拆成可练习的肌肉记忆。',
    goals: ['掌握朗读评分点', '学会复述三步法', '掌握问答应答模板'],
    aiIntro: '🎤 开口就是分——听说考试实战！',
    param: { name: 'ls', label: '听说站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['机器评分看什么？', '复述记不住全部怎么办？', '没听懂问题怎么救场？'],
    views: [
      { when: 1, title: '朗读', subtitle: '评分四维', color: 'blue', emoji: '📖', blocks: [
        { kind: 'compare', title: '机器看什么', items: [
          { label: '准确', value: '音标准确·不吞尾音（-ed/-s）——词读对是一切的前提' },
          { label: '流利', value: '不打长久停顿·错了继续读不回读（机器按完整度扣分——读错一个词别慌·止损前进）' },
          { label: '完整', value: '不漏行不跳词——用手指导读最防漏' },
          { label: '节奏', value: '意群停顿（短语间换气）·语调升降（疑问升·陈述降）——有节奏感的朗读像唱歌' },
        ] },
        { kind: 'info', icon: '🎯', title: '练习法', text: '每天 3 分钟跟读（影子跟读法）：放一句音频跟一句·模仿到语调一致——坚持一个月·机器评分肉眼可见地涨：口语是肌肉不是天赋' },
        { kind: 'highlight', text: '朗读不追求完美——追求止损和完整' },
      ] },
      { when: 2, title: '复述', subtitle: '听后转述', color: 'green', emoji: '🔁', blocks: [
        { kind: 'steps', title: '复述三步', items: ['听时记：关键词骨架（who/when/what/why/result）——中文记也可·省时间', '听后理：30 秒把骨架串成 5-6 句英语——先搭骨再穿衣', '说时稳：第一句定调（The story is about...）·简单句优先·卡住用 in other words 绕过' ] },
        { kind: 'info', icon: '🧠', title: '记忆技巧', text: '记"故事链"不记句子：开端-发展-转折-结局四格——听时画四格图：复述=看图说话（压力骤减）：比逐句记效率高数倍' },
        { kind: 'info', icon: '🛟', title: '救命句式', text: '忘了细节：It was said that... / As far as I remember...；卡壳连接：well/you know（买思考时间不算大扣分）——救场话术先备好' },
        { kind: 'highlight', text: '复述考的不是记性——是"重组"能力' },
      ] },
      { when: 3, title: '问答', subtitle: '情景应答', color: 'amber', emoji: '💬', blocks: [
        { kind: 'steps', title: '答题公式', items: ['听清问题类型：事实题（What/When）直接答·观点题（Do you think...）先亮观点再给理由', '公式化开头：In my opinion.../I think.../From my perspective...——先开口再完善', '两句话原则：观点一句+理由一句（Because.../For example...）——不贪长·不出错', '礼貌兜底：没听清→Pardon? / Could you say that again?（比乱答扣分少）' ] },
        { kind: 'info', icon: '📋', title: '万能理由库', text: '观点题的理由准备 5 个万能角：save time / good for health / make friends / learn new things / protect the environment——任何话题都能靠上两三个：题库是死的·角度是活的' },
        { kind: 'highlight', text: '口语考试的秘密：三分考英语·七分考敢说' },
      ] },
    ],
    teach: { sections: [
      { title: '朗读技巧', body: '【四维】准确·流利·完整·节奏。\n【止损】读错不回读·继续前进。\n【练习】每日3分钟影子跟读。' },
      { title: '听后复述', body: '【三步】记关键词骨架→30秒串句→稳定输出。\n【四格法】开端发展转折结局。\n【救场】It was said that / in other words。' },
      { title: '情景问答', body: '【分类】事实题直答·观点题观点+理由。\n【模板】In my opinion + Because。\n【两句话原则】不贪长不出错。\n【兜底】Pardon 礼貌确认。' },
    ], examples: [
      { q: '朗读时读错了一个词', steps: ['不要停', '不要回读', '按错误版本读完', '机器扣错误词的分·回读再多扣完整度'], tip: '止损前进' },
      { q: '复述只记住一半信息', steps: ['按四格串起来已知部分', 'It was said that 补衔接', '流畅说完比吞吞吐吐说全更重要', '练习记骨架·漏一两条不致命'], tip: '四格法保底' },
    ], mistakes: ['朗读错了回读重念（双倍扣分）', '观点问答只说 Yes/No 不给理由（内容分照扣）'] },
    exercises: [
      { q: '机器朗读评分的四个维度不包括？', options: ['准确', '流利', '完整', '词汇量'], answer: 3, explain: '朗读不考词汇深度' },
      { q: '朗读读错了正确做法是？', options: ['停下来重读', '继续读不回读', '道歉', '跳过整段'], answer: 1, explain: '止损原则' },
      { q: '复述最推荐的笔记方式是？', options: ['逐句默写', '记四格故事链关键词', '画插图', '不记'], answer: 1, explain: '看图说话' },
      { q: '没听清问题最好说？', options: ['乱答一通', 'Pardon?/Could you repeat?', '沉默', '换话题'], answer: 1, explain: '礼貌确认扣分少' },
      { q: '观点类问答的公式是？', options: ['只答Yes', '观点一句+理由一句', '长篇大论', '反问'], answer: 1, explain: '两句话原则' },
      { q: '三分考英语，七分考 ___', options: ['敢说', '运气'], answer: 0, explain: '口语心理关', type: 'blank', blank: { answerText: '敢说', bank: ['敢说', '运气'] } },
    ],
  }),
  L({
    area: '英语', band: 'senior', grade: 12, id: 'eng-35', order: 789, title: '高考英语时间管理：考场策略', emoji: '⏱️', textbook: '人教版选择性必修',
    curriculum: { module: '考试策略', points: ['时间分配', '答题顺序', '检查取舍'] },
    story: '同样的水平，会安排时间的人比不会安排的多拿 10-15 分——英语考试题量大时间紧，它不光考英语，还考"项目管理"。这一课把 120 分钟（或各省不同）拆到每分钟，让你的实力一分不漏地变现。',
    goals: ['掌握四大部分时间分配', '设计自己的答题顺序', '学会检查的取舍'],
    aiIntro: '⏱️ 让实力一分不漏——考场时间管理！',
    param: { name: 'tm', label: '考场站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['作文该留多少分钟？', '答题顺序可以变吗？', '剩 10 分钟检查什么最划算？'],
    views: [
      { when: 1, title: '分配', subtitle: '分钟预算', color: 'blue', emoji: '📊', blocks: [
        { kind: 'compare', title: '120 分钟参考预算（按各省调整）', items: [
          { label: '阅读', value: '约 35 分钟——分值最大头：每篇 7-8 分钟·卡壳的题标记后跳' },
          { label: '语言运用', value: '完形+语法填空 约 25 分钟——完形 15 分钟·语法填空 10 分钟：先通读后逐题' },
          { label: '写作', value: '应用文 15 分钟 + 读后续写/概要 25 分钟 = 40 分钟——写作占总分 35 分以上·时间不许被阅读挤占' },
          { label: '涂卡+检查', value: '留 10-15 分钟——做完一篇涂一篇（不攒到最后）' },
        ] },
        { kind: 'highlight', text: '先给作文上锁——阅读的弹性远大于写作' },
      ] },
      { when: 2, title: '顺序', subtitle: '因人而异', color: 'green', emoji: '🔀', blocks: [
        { kind: 'compare', title: '三种顺序', items: [
          { label: '标准顺序', value: '按卷面：听力→阅读→语言运用→写作——适合心理稳定型' },
          { label: '作文优先', value: '听力后先写作文（头脑最清醒时拿最大分值）——适合写作强·阅读快的' },
          { label: '阅读优先', value: '先攻阅读再回头（怕写作占用过多时间的）——适合写作慢的同学先限时代写' },
        ] },
        { kind: 'info', icon: '🧪', title: '找到自己的顺序', text: '考前用 3 套真题各试一种顺序·记录每种的总得分与心态感受——你的最优顺序是测出来的·不是抄来的：模拟考就是实验室' },
        { kind: 'highlight', text: '顺序无对错——有实验数据支撑的才叫策略' },
      ] },
      { when: 3, title: '检查', subtitle: '最后一刻', color: 'amber', emoji: '🔍', blocks: [
        { kind: 'steps', title: '检查优先级', items: ['第一查：涂卡错位（一道错位=灾难）——对题号再核一遍', '第二查：作文拼写与主谓一致（最快的丢分点）', '第三查：标记过的卡壳题（用排除法再砍两个选项）', '不查：已经确定对的题——别把对的改错' ] },
        { kind: 'info', icon: '🎲', title: '蒙题伦理与技巧', text: '完全不会的题：统一蒙一个选项（统计上优于乱选）·三长一短选短是玄学但别空题——英语没有倒扣分：空白是最差选项' },
        { kind: 'info', icon: '😰', title: '心态急救', text: '听力没听清：let it go（它已过去·纠缠会连累下一题）；阅读一篇看不懂：先做题干能定位的细节题——整场考试最大的敌人是"上头"' },
        { kind: 'highlight', text: '考场的胜利=实力×时间×心态——后两项都可以练' },
      ] },
    ],
    teach: { sections: [
      { title: '时间分配', body: '【参考】阅读35·语言运用25·写作40·涂检15。\n【原则】写作时间先上锁。\n【节奏】一篇一涂不攒尾。' },
      { title: '答题顺序', body: '【三式】标准·作文优先·阅读优先。\n【方法】三套真题实测选优。\n【原则】顺序服务心态与分值。' },
      { title: '检查与心态', body: '【查】涂卡位·拼写主谓·标记题。\n【不查】已确定项。\n【蒙】统一选项不空题。\n【心态】let it go·定位式答题。' },
    ], examples: [
      { q: '还剩 5 分钟·作文没写完', steps: ['立刻收尾：结论句+呼应开头', '砍中间例子的展开部分', '保证结构完整字数达标', '结尾潦草好过没有结尾'], tip: '结构分优先' },
      { q: '阅读第二篇完全看不懂', steps: ['跳到第三篇（保护节奏）', '回头用时题干定位细节题', '主旨题留最后用排除法', '不让一篇拖垮全卷'], tip: '止损跳读' },
    ], mistakes: ['先做完全部选择再写作文（常导致作文仓促失分最多）', '把对的答案改错（检查以核对为主·非重做）'] },
    exercises: [
      { q: '写作时间应该？', options: ['挤到最后', '优先锁定（约1/3时间）', '5分钟', '先看题再说'], answer: 1, explain: '最大分值保时间' },
      { q: '确定自己的答题顺序应？', options: ['抄学霸的', '用真题实测对比', '抽签', '每次随机'], answer: 1, explain: '实验出真知' },
      { q: '检查的第一优先级是？', options: ['重做阅读', '涂卡错位核对', '数字草稿', '背单词'], answer: 1, explain: '错位是灾难' },
      { q: '已经确定的答案检查时应该？', options: ['反复怀疑', '保持不动', '全部重做', '擦掉'], answer: 1, explain: '防改错' },
      { q: '完全不会的题最好？', options: ['空着', '统一蒙一个选项', '乱选', '交白卷'], answer: 1, explain: '无倒扣分' },
      { q: '考场的胜利=实力×时间×___', options: ['心态', '运气'], answer: 0, explain: '两项都可练', type: 'blank', blank: { answerText: '心态', bank: ['心态', '运气'] } },
    ],
  }),
  L({
    area: '地理', band: 'senior', grade: 11, id: 'geo-23', order: 790, title: '资源安全：水·土·能源的账本', emoji: '💧', textbook: '人教版选择性必修3',
    curriculum: { module: '资源环境与国家安全', points: ['水资源安全', '耕地保护', '能源安全'] },
    story: '一杯牛奶背后的虚拟水是 1000 升·一部手机里的稀土来自全球十几个国家——现代生活建立在一张巨大的资源网络之上。这张网一旦波动，价格上涨·工厂停工·甚至国际冲突。资源安全，是国家安全的底仓。',
    goals: ['理解水资源安全与调配', '了解耕地红线', '掌握能源安全战略'],
    aiIntro: '💧 算一算国家的资源账本！',
    param: { name: 'rs', label: '资源站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['南水北调怎样改写华北水账？', '18 亿亩耕地红线为什么不能破？', '能源饭碗为什么端在自己手里？'],
    views: [
      { when: 1, title: '水', subtitle: '南水北调', color: 'sky', emoji: '🌊', blocks: [
        { kind: 'info', icon: '📉', title: '中国的水账失衡', text: '北方耕地占 60%·水资源只有 19%——人多水少+时空分布不均：华北平原超采地下水形成"漏斗区"——水安全是华北的心病' },
        { kind: 'steps', title: '南水北调三线', items: ['东线：扬州取水沿京杭运河北送——利用现有河道·成本低·水质需治理', '中线：丹江口水库自流到京津——水质好·惠及沿线大中城市（北京七成供水来自这里）', '西线（规划中）：从长江上游调水入黄河——补充西北·工程难度极大', '效果：累计调水数百亿方·1.5 亿人受益——一张水网重构半壁江山' ] },
        { kind: 'highlight', text: '跨流域调水是国家层面"移丰补歉"的水利平衡术' },
      ] },
      { when: 2, title: '土', subtitle: '耕地红线', color: 'amber', emoji: '🌾', blocks: [
        { kind: 'info', icon: '📊', title: '用 9% 的耕地养 19% 的人口', text: '中国人均耕地不足世界平均一半——城市化每扩张一寸·耕地就少一分：18 亿亩耕地红线由此而来（粮食安全的底线数字）' },
        { kind: 'steps', title: '保护组合拳', items: ['占补平衡：建设占用多少耕地·必须补充开垦同质等量', '高标准农田：改造中低产田（旱涝保收·吨粮田）', '耕地"非农化·非粮化"整治：农田就是农田·而且必须是良田', '黑土地保护：东北"耕地中的大熊猫"——秸秆还田·免耕保墒' ] },
        { kind: 'info', icon: '🧂', title: '看不见的土危机', text: '土壤盐碱化（不合理灌溉）·水土流失（黄土高原曾年流失亿吨）·污染——土的生成以百年计·毁掉只要几年：土地保护的紧迫感常被低估' },
        { kind: 'highlight', text: '耕地红线不是数字游戏——是"中国人的饭碗"的物理底线' },
      ] },
      { when: 3, title: '能源', subtitle: '多元安全', color: 'green', emoji: '⚡', blocks: [
        { kind: 'compare', title: '能源安全四面下注', items: [
          { label: '传统稳盘', value: '煤炭主体地位（储量丰富）+ 石油天然气进口多元化（管道+LNG+多条海运线）——不被单一通道卡脖子' },
          { label: '新能源加速', value: '风光水核齐上：2023 年可再生能源装机历史性超过煤电——既是减排也是安全：新能源的发电权=未来的能源主权' },
          { label: '战略储备', value: '石油战略储备+天然气储气库——应对国际波动缓冲垫：储备是能源的"弹药库"' },
          { label: '科技突围', value: '特高压输电（西电东送）·储能技术·可控核聚变研究——把资源优势转化为技术优势' },
        ] },
        { kind: 'info', icon: '🔗', title: '资源与地缘', text: '马六甲困局（八成石油海运经此）→ 中缅/中巴经济走廊绕行；稀土牌（全球 60% 产量）——资源地图就是地缘棋盘：理解新闻的钥匙' },
        { kind: 'highlight', text: '能源安全=来源多元×通道多元×技术自主×储备充足' },
      ] },
    ],
    teach: { sections: [
      { title: '水资源安全', body: '【矛盾】北方地多水少·时空不均。\n【工程】南水北调三线路与各自特点。\n【配套】节水优先·地下水限采·海绵城市。' },
      { title: '耕地安全', body: '【国情】9%耕地养19%人口·人均少。\n【红线】18亿亩+占补平衡+高标准农田。\n【危机】盐碱化·流失·污染的隐形账。' },
      { title: '能源安全', body: '【策略】多元进口+新能源替代+战略储备+技术（特高压储能）。\n【地缘】马六甲困局与走廊绕行·稀土话语权。\n【趋势】新能源装机超煤电的历史转折。' },
    ], examples: [
      { q: '华北为什么要南水北调？', steps: ['人口产业密集需水大', '降水偏少资源性缺水', '地下水超采生态恶化', '跨流域调水+节水双管齐下'], tip: '资源账+生态账' },
      { q: '为什么强调"能源饭碗端在自己手里"？', steps: ['石油对外依存度高', '国际波动直接传导国内', '多元进口+新能源+储备', '资源安全是发展安全的前提'], tip: '四面下注' },
    ], mistakes: ['认为资源安全只是"够用"问题（含通道·技术·储备多维）', '把耕地保护理解为限制发展（粮食安全是不可替代的底线）'] },
    exercises: [
      { q: '南水北调中线的水源地是？', options: ['太湖', '丹江口水库', '三峡', '鄱阳湖'], answer: 1, explain: '自流进京' },
      { q: '我国耕地红线是？', options: ['10 亿亩', '18 亿亩', '25 亿亩', '30 亿亩'], answer: 1, explain: '粮食安全底线' },
      { q: '"占补平衡"指建设占用的耕地要？', options: ['不用管', '补充等质等量耕地', '罚款即可', '种树'], answer: 1, explain: '占一补一' },
      { q: '中国能源安全的思路不包括？', options: ['进口多元化', '发展新能源', '战略储备', '完全依赖进口'], answer: 3, explain: '自主是核心' },
      { q: '2023 年中国可再生能源装机历史性地超过了？', options: ['燃气', '煤电', '核电', '水电'], answer: 1, explain: '结构性转折' },
      { q: '耕地红线是"中国人的饭碗"的 ___ 底线', options: ['物理', '心理'], answer: 0, explain: '不可替代', type: 'blank', blank: { answerText: '物理', bank: ['物理', '心理'] } },
    ],
  }),
  L({
    area: '地理', band: 'senior', grade: 11, id: 'geo-24', order: 791, title: '产业转型：资源型城市怎样新生', emoji: '🏭', textbook: '人教版选择性必修2',
    curriculum: { module: '区域发展', points: ['资源型城市的困境', '转型路径', '典型案例'] },
    story: '一些城市因矿而生——矿竭了呢？德国鲁尔区曾是欧洲工业心脏·污染到"穿白衬衣出门变黑"；如今是大学城与创意之都。中国的东北老工业区·山西煤城·鞍山钢铁都在走同一条转型路。资源型城市的命运，是发展方式的一面镜子。',
    goals: ['理解资源型城市的生命周期', '掌握转型的主要路径', '了解国内外的经典案例'],
    aiIntro: '🏭 矿挖完了怎么办——资源型城市转型！',
    param: { name: 'tr', label: '转型站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么资源城市会衰败？', '鲁尔区怎样起死回生？', '转型最怕什么？'],
    views: [
      { when: 1, title: '困境', subtitle: '资源诅咒', color: 'rose', emoji: '📉', blocks: [
        { kind: 'steps', title: '生命周期曲线', items: ['兴起期：发现资源·资本涌入·城市暴发式成长', '繁荣期：产业单一但就业充分——"一矿独大"的黄金岁月', '衰退期：资源枯竭/价格下跌·主导产业塌方·人口外流', '再生或消亡：转型成功→新生；失败→"收缩城市"（如一些美国铁锈带城市）' ] },
        { kind: 'info', icon: '⚠️', title: '资源诅咒的机制', text: '单一依赖→抗风险弱；资源部门高工资挤压其他产业（"荷兰病"）；资源收益替代创新动力——"躺在矿上"反而错失工业升级：富资源≠富未来' },
        { kind: 'highlight', text: '资源是启动资金不是终身饭票——这是所有资源城市的共同教训' },
      ] },
      { when: 2, title: '路径', subtitle: '转型四路', color: 'green', emoji: '🛤️', blocks: [
        { kind: 'compare', title: '四条出路', items: [
          { label: '产业延伸', value: '从挖矿卖矿到加工制造（资源→材料→制品）：附加值留在本地——榆林从卖煤到煤化工' },
          { label: '产业替代', value: '培育全新产业接棒：文旅·大数据·新能源——大庆接续风电·光伏（油城变绿城）' },
          { label: '生态修复', value: '矿坑变公园·沉陷区变湿地（徐州潘安湖·黄石国家矿山公园）——生态本身就是新资产' },
          { label: '人力升级', value: '再就业培训+引进大学研究所——鲁尔区建了十几所大学：人是最重要的转型资本' },
        ] },
        { kind: 'info', icon: '⏳', title: '转型的时间观', text: '鲁尔区转型用了 50 年仍在路上——转型是"换发动机的飞行"：既不能停（财政崩）又不能急（新旧断档）：政府的耐心与连续性至关重要' },
        { kind: 'highlight', text: '转型四路通常组合使用——没有单一答案' },
      ] },
      { when: 3, title: '案例', subtitle: '三面镜子', color: 'blue', emoji: '🪞', blocks: [
        { kind: 'compare', title: '国内外对照', items: [
          { label: '鲁尔区（德）', value: '煤钢→衰退→大学+创意+物流+工业遗产旅游（关税同盟煤矿成世界遗产）——转型教科书' },
          { label: '休斯敦（美）', value: '石油城→主动多元化：航天（NASA）+医疗（德州医学中心全球最大）——"油城上天"的想象' },
          { label: '山西/东北（中）', value: '煤炭钢铁→去产能+文旅（大同古城·焦作云台山）+新能源——转型进行时：阵痛与希望同在' },
        ] },
        { kind: 'info', icon: '🏭', title: '工业遗产的浪漫', text: '首钢园从高炉到冬奥赛场·798 从军工厂到艺术区——旧厂房的粗粝感成了新消费的背景板：记忆不是包袱·是文创业的矿藏' },
        { kind: 'highlight', text: '城市和人一样：最危险的不是失去资源·是失去再学习的能力' },
      ] },
    ],
    teach: { sections: [
      { title: '资源型城市生命周期', body: '【四段】兴起→繁荣→衰退→再生/收缩。\n【诅咒】单一依赖·荷兰病·创新惰性。\n【本质】资源是启动资金不是终身饭票。' },
      { title: '转型路径', body: '【延伸】资源→加工→制品增附加值。\n【替代】文旅大数据新能源接棒。\n【修复】矿坑公园化（生态资产化）。\n【人力】培训+高校引进。\n【时间观】换发动机的飞行·耐心连续。' },
      { title: '典型案例', body: '【鲁尔】煤钢→大学创意遗产旅游（50年）。\n【休斯敦】油→航天医疗多元化。\n【中国】去产能+文旅+新能源进行时。\n【遗产】首钢园/798：记忆变矿藏。' },
    ], examples: [
      { q: '煤城大同可选择的转型组合？', steps: ['延伸：煤电一体化深加工', '替代：古建文旅（云冈）+新能源', '修复：采空区治理', '人力：职业再培训——四路组合'], tip: '组合拳思维' },
      { q: '为什么说转型是"换发动机的飞行"？', steps: ['旧产业不能立刻停（就业财政）', '新产业不能等建成（断档风险）', '双轨并行期最考验治理', '鲁尔50年说明耐心必要'], tip: '时间观' },
    ], mistakes: ['认为资源城市衰败只是"矿挖完了"（价格波动+单一结构早埋祸根）', '把转型理解为建几个新工厂（人力·生态·制度多维并举）'] },
    exercises: [
      { q: '资源型城市衰退的核心原因是？', options: ['人口太多', '产业结构单一依赖资源', '气候差', '交通不便'], answer: 1, explain: '一矿独大' },
      { q: '"荷兰病"指资源繁荣反而？', options: ['提高科技', '挤压其他产业发展', '增加人口', '改善教育'], answer: 1, explain: '单一繁荣的排挤效应' },
      { q: '鲁尔区转型的关键举措是？', options: ['继续扩煤', '建大学引人才发展多元产业', '整体搬迁', '只做旅游'], answer: 1, explain: '人力资本优先' },
      { q: '休斯敦转型的代表方向是？', options: ['农业', '航天与医疗', '博彩', '渔业'], answer: 1, explain: '油城上天' },
      { q: '首钢园的变迁体现了？', options: ['工业遗产再利用', '工厂扩张', '退回农业', '填海造陆'], answer: 0, explain: '记忆变资产' },
      { q: '最危险的不是失去资源·是失去再 ___ 的能力', options: ['学习', '呼吸'], answer: 0, explain: '城市如人', type: 'blank', blank: { answerText: '学习', bank: ['学习', '呼吸'] } },
    ],
  }),
  L({
    area: '地理', band: 'senior', grade: 12, id: 'geo-25', order: 792, title: '海洋权益：蓝色国土', emoji: '🌊', textbook: '人教版选择性必修1',
    curriculum: { module: '海洋地理', points: ['海洋权益划分', '海洋资源', '海洋保护'] },
    story: '地球表面 71% 是海洋，但"谁的海洋"这个问题直到 1982 年《联合国海洋法公约》才有了规则：领海·毗连区·专属经济区……每一海里都连着渔业·石油和航道。中国有 300 万平方公里的"蓝色国土"——读懂海洋权益，才算完整读懂世界地图。',
    goals: ['掌握海洋权益的划分', '了解海洋资源开发', '理解海洋生态保护'],
    aiIntro: '🌊 读懂蓝色国土的游戏规则！',
    param: { name: 'oc', label: '海洋站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['12 海里领海是怎么来的？', '专属经济区为什么常起争端？', '海洋怎样用又怎样护？'],
    views: [
      { when: 1, title: '规则', subtitle: '海洋法公约', color: 'blue', emoji: '📏', blocks: [
        { kind: 'compare', title: '五大水域', items: [
          { label: '领海 12 海里', value: '等于领土（外国船舶可"无害通过"）——历史渊源：大炮射程所及（18世纪约 3 海里×后来扩展）' },
          { label: '毗连区 24 海里', value: '海关·卫生·移民管制的延伸区——"门廊"性质' },
          { label: '专属经济区 200 海里', value: '资源专属（鱼·油·气）但不算领土：他国可航行飞越——争端最集中的一层' },
          { label: '大陆架', value: '陆地自然延伸的海底·资源权利可超 200 海里（需提交科学证据）' },
        ] },
        { kind: 'info', icon: '⚔️', title: '为什么争', text: '岛屿决定权利半径：一个岛=周围 200 海里资源权——所以小岛礁主权必争；"历史性权利"与公约的叠合解释是南海问题的法理核心：地图上的每个点都是利益' },
        { kind: 'highlight', text: '《公约》像海洋的交通法+产权法——读懂它才读懂海上新闻' },
      ] },
      { when: 2, title: '资源', subtitle: '蓝色宝库', color: 'green', emoji: '💎', blocks: [
        { kind: 'compare', title: '四类资源', items: [
          { label: '生物', value: '渔业（年捕捞量亿吨级·中国世界第一）+深远海养殖（"深蓝一号"网箱）——优质蛋白的蓝色粮仓' },
          { label: '油气', value: '近海油田（渤海·南海油气）+可燃冰试采——海洋贡献全国油气增量的重要部分' },
          { label: '能源', value: '潮汐能·温差能·海上风电（中国装机全球第一）——新能源主战场之一' },
          { label: '通道', value: '全球 80% 货物贸易走海运：马六甲·苏伊士·巴拿马三大咽喉——航道安全=经济命脉' },
        ] },
        { kind: 'info', icon: '🧪', title: '深海与极地', text: '国际海底区域（"区域"）资源属全人类共有（多金属结核勘探合同）·"雪龙"号南北极科考·深海勇士/奋斗者号深潜——新疆域的规则正在书写：中国是参与者也是规则塑造者' },
        { kind: 'highlight', text: '海洋是资源库+高速路+能源场三合一' },
      ] },
      { when: 3, title: '保护', subtitle: '蓝色可持续', color: 'amber', emoji: '🛟', blocks: [
        { kind: 'steps', title: '三重压力与应对', items: ['过度捕捞→伏季休渔（每年夏季禁渔数月让鱼繁衍）+总量控制·增殖放流', '污染（塑料·溢油·陆源排污）→限塑令·海洋垃圾监测·入海排污口整治', '生态退化→红树林修复（海岸卫士）·珊瑚移植·海洋自然保护区网络' ] },
        { kind: 'info', icon: '🌍', title: '全球协作', text: '海洋是流动的整体：联合国"海洋十年"计划·BBNJ 公约（公海生物多样性）——没有一个国家能独自管好海洋：国际规则+国家行动+公民参与（少一根吸管也算）' },
        { kind: 'highlight', text: '海洋给了我们半个未来——保护它是使用权的一部分' },
      ] },
    ],
    teach: { sections: [
      { title: '海洋权益划分', body: '【领海】12海里=领土（无害通过）。\n【毗连区】24海里管制延伸。\n【专属经济区】200海里资源专属非领土。\n【大陆架】自然延伸可超200海里。\n【争端】岛屿决定半径·历史权利解释。' },
      { title: '海洋资源', body: '【生物】渔业+深远海养殖蓝色粮仓。\n【油气】近海油田+可燃冰。\n【能源】海上风电潮汐温差。\n【通道】80%贸易海运·三大咽喉。\n【新疆域】深海采矿极地科考。' },
      { title: '海洋保护', body: '【捕捞】伏季休渔+增殖放流。\n【污染】限塑+排污口整治。\n【生态】红树林珊瑚修复保护区。\n【协作】海洋十年+BBNJ公约。' },
    ], examples: [
      { q: '为什么各国重视南海岛礁？', steps: ['岛礁=主权标志', '决定200海里专属经济区范围', '渔业油气资源权', '航道位置叠加战略价值'], tip: '权利半径' },
      { q: '休渔期的地理逻辑？', steps: ['夏季是多数鱼类繁殖生长期', '暂停捕捞让种群恢复', '总量控制配额长期管理', '短期禁捕换长期可持续'], tip: '可持续渔业' },
    ], mistakes: ['把专属经济区当领土（只是资源权利）', '认为海洋保护与开发对立（可持续利用是主线）'] },
    exercises: [
      { q: '领海的宽度是？', options: ['3 海里', '12 海里', '200 海里', '24 海里'], answer: 1, explain: '主权范围' },
      { q: '专属经济区的宽度是？', options: ['12 海里', '24 海里', '200 海里', '无限'], answer: 2, explain: '资源专属层' },
      { q: '专属经济区内他国船舶？', options: ['禁止进入', '可航行飞越', '可捕鱼', '可开采'], answer: 1, explain: '非领土' },
      { q: '国际海底区域的资源属于？', options: ['最近国家', '全人类共同继承财产', '强国', '公司'], answer: 1, explain: '公约原则' },
      { q: '伏季休渔的主要目的是？', steps: [], options: ['渔民休息', '鱼类繁殖期保护种群', '省油', '节日'], answer: 1, explain: '可持续' },
      { q: '海洋给了我们半个未来——保护它是使用权的一 ___', options: ['部分', '辈子'], answer: 0, explain: '权利与义务同在', type: 'blank', blank: { answerText: '部分', bank: ['部分', '辈子'] } },
    ],
  }),
  L({
    area: '地理', band: 'senior', grade: 12, id: 'geo-26', order: 793, title: '地理信息技术：3S 改变世界', emoji: '🛰️', textbook: '人教版选择性必修1',
    curriculum: { module: '地理信息技术', points: ['GPS/BDS', 'GIS 分析', '遥感 RS'] },
    story: '外卖小哥的最优路线·台风路径预报·汶川地震的灾情评估——背后是同一套"3S 技术"：GPS 定位·GIS 分析·遥感感知。中国的北斗系统 2020 年全球组网完成，从此头顶的导航星里有中国自己的。这一课看懂数字时代的"地理眼睛"。',
    goals: ['理解 3S 各自的功能', '了解北斗的意义', '掌握 3S 的应用场景'],
    aiIntro: '🛰️ 看懂数字时代的地理眼睛——3S！',
    param: { name: 'ts', label: '3S站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['北斗和 GPS 有什么不同？', 'GIS 怎样帮奶茶店选址？', '遥感怎样看庄稼长势？'],
    views: [
      { when: 1, title: '定位', subtitle: 'GPS/北斗', color: 'blue', emoji: '📍', blocks: [
        { kind: 'info', icon: '🛰️', title: '原理：到达时间差', text: '你的手机测出至少 4 颗卫星信号到达的时间差·算出距离·交会出位置——三角定位的太空版：米级到毫米级（差分增强后）' },
        { kind: 'compare', title: '北斗的特色', items: [
          { label: '三频信号', value: '比 GPS 双频更高精度更快定位' },
          { label: '短报文', value: '能"发短信"（无手机信号的海上/灾区救命功能）——北斗独有的双向通信' },
          { label: '全球+区域', value: '全球组网 2020 完成·亚太精度更高' },
        ] },
        { kind: 'info', icon: '🚀', title: '为什么必须自建', text: '1993 银河号被关 GPS 事件（在公海"失明"漂泊 22 天）刺痛国人——命脉技术买不来：北斗从 1994 立项到组网 26 年·两代人的"争气星"' },
        { kind: 'highlight', text: '定位告诉你"在哪"——这是所有数字地图的第一颗钮扣' },
      ] },
      { when: 2, title: '分析', subtitle: 'GIS 大脑', color: 'green', emoji: '🗺️', blocks: [
        { kind: 'steps', title: 'GIS 是什么', items: ['图层叠加：把人口·交通·地价·竞争店画成透明胶片·叠起来看——空间分析的魔法', '选址模型：奶茶店=人流量×租金×竞品距离的加权——数据替你跑腿', '缓冲区分析：学校周边 500 米不能开网吧——规则自动落地地图', '路径优化：外卖算法=GIS+实时路况——每分钟重算最优' ] },
        { kind: 'info', icon: '🏥', title: '公共卫生里的 GIS', text: '约翰·斯诺 1854 年把霍乱死亡标在地图上·发现围绕某水井分布——关掉那口井疫情结束：GIS 诞生前的第一次空间分析（流行病学地图的鼻祖）' },
        { kind: 'highlight', text: 'GIS 把地理从描述变成计算——地图会思考' },
      ] },
      { when: 3, title: '遥感', subtitle: '天眼 RS', color: 'violet', emoji: '👁️', blocks: [
        { kind: 'info', icon: '📸', title: '原理：电磁波指纹', text: '不同地物反射不同波段（健康植被强反射近红外·缺水的弱）——卫星拍下光谱·反演出植被指数·水分·污染：不用到现场·太空体检' },
        { kind: 'compare', title: '应用现场', items: [
          { label: '农业', value: '长势监测·估产（提前预判粮食产量）·精准施肥（变量作业省肥 20%）——"看天吃饭"变"看星种田"' },
          { label: '灾害', value: '台风云图·洪水淹没范围圈定·滑坡隐患识别·火点监测——遥感是灾害响应的第一双眼' },
          { label: '环境', value: '秸秆焚烧火点·大气气溶胶·湖泊蓝藻·城市热岛——环境监察的天眼' },
        ] },
        { kind: 'info', icon: '🤝', title: '3S 合体', text: 'RS 采集（发生什么）→ GIS 分析（意味着什么）→ BDS/GPS 定位（在哪执行）——共享单车调度·精准农业·智慧城市都是三者协同：一只眼一只脑一双手' },
        { kind: 'highlight', text: '3S 让"地理"从课本走进每个人的手机' },
      ] },
    ],
    teach: { sections: [
      { title: '定位技术', body: '【原理】多星测距交会（时间差）。\n【北斗】三频·短报文·2020全球组网。\n【意义】命脉自主（银河号之痛）。' },
      { title: 'GIS', body: '【核心】图层叠加空间分析。\n【功能】选址·缓冲区·路径优化。\n【起源】斯诺霍乱地图。\n【本质】地图会思考。' },
      { title: '遥感 RS 与协同', body: '【原理】地物光谱指纹。\n【应用】农业估产·灾害响应·环境监察。\n【3S】RS感知→GIS分析→BDS定位执行。' },
    ], examples: [
      { q: '台风即将登陆，怎样用 3S 应对？', steps: ['RS：云图监测强度路径', 'GIS：叠加人口图层圈定风险区', 'BDS：救援队车辆实时调度', '预警短信短报文到渔船'], tip: '3S 合体' },
      { q: '农场怎样"看星种田"？', steps: ['RS 拍摄地块植被指数图', '找出缺水缺肥区域', 'GIS 生成变量施肥处方图', '导航农机精准作业'], tip: '精准农业' },
    ], mistakes: ['认为北斗只是"国产替代"（短报文等独有功能）', '把遥感当"拍照片"（光谱反演信息远超可见光）'] },
    exercises: [
      { q: '卫星定位至少需要收到几颗卫星信号？', options: ['1 颗', '2 颗', '4 颗', '10 颗'], answer: 2, explain: '三维+钟差' },
      { q: '北斗系统独有的特色功能是？', options: ['三频', '短报文通信', '全球组网', '免费'], answer: 1, explain: '无信号区救命' },
      { q: 'GIS 的核心技术思想是？', options: ['拍照', '图层叠加空间分析', '打电话', '测距'], answer: 1, explain: '胶片叠加' },
      { q: '斯诺的霍乱地图是哪项技术的鼻祖？', options: ['遥感', 'GIS 空间分析', '北斗', '雷达'], answer: 1, explain: '1854' },
      { q: '遥感估算庄稼长势利用的是？', options: ['颜色好看', '不同长势植被光谱差异', '温度计', '雨量'], answer: 1, explain: '光谱指纹' },
      { q: 'RS 采集→GIS 分析→BDS 定位：一只眼一只脑一 ___', options: ['双手', '双脚'], answer: 0, explain: '3S 协同', type: 'blank', blank: { answerText: '双手', bank: ['双手', '双脚'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成 8 节:', LESSONS.map((l) => l.id).join(', '));
