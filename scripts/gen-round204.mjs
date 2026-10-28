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
    area: '英语', band: 'senior', grade: 10, id: 'eng-50', order: 1122, title: '名词性从句：句子当名词用', emoji: '📦', textbook: '人教版英语（必修）',
    curriculum: { module: '语法', points: ['宾语从句', '主语从句与表语从句', '同位语从句'] },
    story: '一个完整的句子·可以打包当名词用——当宾语·当主语·当表语·当同位语。这就是名词性从句：句子的「集装箱化」。四种位置一个核心：怎么连接·怎么语序。',
    goals: ['掌握四种名词性从句', '掌握连接词的选择', '注意语序与时态'],
    aiIntro: '📦 句子当名词用——名词性从句',
    param: { name: 'nc', label: '名从站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['宾语从句和主语从句差在哪？', 'that 和 what 怎样选？', '从句里用什么语序？'],
    views: [
      { when: 1, title: '四种', subtitle: '四个位置', color: 'blue', emoji: '🧭', blocks: [
        { kind: 'compare', title: '四种名词性从句', items: [
          { label: '宾语从句', value: '从句当宾语——I know (that) he is honest. 动词/介词之后：最常见的一种' },
          { label: '主语从句', value: '从句当主语——What he said is true. / That he came late surprised us.（谓语前的「句子主语」）' },
          { label: '表语从句', value: '从句当表语（系动词后）——The problem is that we have no time. / The question is whether we should go.' },
          { label: '同位语从句', value: '解释前面抽象名词的内容——The news that he won made us happy.（news 的内容就是 he won）：常考与定语从句的区分' },
        ] },
        { kind: 'highlight', text: '宾·主·表·同位——位置不同·内核相同' },
      ] },
      { when: 2, title: '连接', subtitle: '选词', color: 'green', emoji: '🔗', blocks: [
        { kind: 'compare', title: '三类连接词', items: [
          { label: 'that', value: '只起连接作用·不充当成分·无词义（宾从中可省略）：句子完整不缺成分就用 that' },
          { label: 'what', value: '既连接又充当成分（主语/宾语）= the thing(s) that——What he needs is time（what 作 needs 的宾语）：句子缺主语或宾语就用 what' },
          { label: 'whether / if', value: '表「是否」——Whether we go depends on the weather.（主语从句只能用 whether·if 不可提前）：介词后·同位语从句也只用 whether' },
          { label: 'who / when / where / why / how', value: '保留疑问含义并充当成分——I do not know where he lives.（where 作地点状语）：按句意选词' },
        ] },
        { kind: 'info', icon: '🔑', title: '选词口诀', text: '句意完整用 that·缺主宾用 what·「是否」用 whether/ if·其他按意思选 wh-：先判断从句缺不缺成分——这是所有选词题的第一问' },
        { kind: 'highlight', text: '完整用 that·缺件用 what·是否 whether：先查缺不缺' },
      ] },
      { when: 3, title: '注意', subtitle: '三大考点', color: 'amber', emoji: '⚠️', blocks: [
        { kind: 'steps', title: '三大注意事项', items: ['语序：从句一律用陈述语序（不是疑问语序）——I do not know where he lives（不是 where does he live）：名词性从句第一坑', '时态呼应：主句过去时→从句用相关过去时态（He said he was tired）；客观真理除外（The teacher said the earth is round）', 'it 作形式主语：That he passed is good news. → It is good news that he passed.（避免头重脚轻）：主语从句的标配改写' ] },
        { kind: 'info', icon: '⚔️', title: '同位语从句 vs 定语从句', text: '同位语从句：that 不充当成分·解释内容（news/ fact/ idea/ hope 的内容）；定语从句：that 充当主语或宾语·修饰限定（the news that you told me——told 缺宾语·that 当宾语=定从）：一看 that 是否缺成分·二看抽象名词是否等于从句内容' },
        { kind: 'highlight', text: '陈述语序·时态呼应·it 形式主语——同位语看 that 缺不缺件' },
      ] },
    ],
    teach: { sections: [
      { title: '四种从句', body: '【宾】动词后。【主】谓语前·常用 it 形式主语。\n【表】系动词后。【同位】解释 news/fact/idea。' },
      { title: '连接词', body: '【that】完整句用·宾可省。【what】缺主宾=the thing that。\n【whether/if】是否。【wh-】按意选。\n【口诀】先查缺不缺。' },
      { title: '三考点', body: '【语序】陈述不疑问。【时态】主过从过·真理除外。\n【it】形式主语防头重。\n【辨析】同位语 that 不缺件·定从 that 缺件。' },
    ], examples: [
      { q: '选 that 还是 what', steps: ['看从句缺不缺成分', '___ he said is true（said 缺宾语）', '用 what', 'I believe ___ you said（不缺）用 that 可省'], tip: '先查缺件' },
      { q: '改写头重脚轻的主语从句', steps: ['That he passed is good news', '主语太长用 it 替', 'It is good news that he passed', '真正主语后移'], tip: 'it 形式主语' },
    ], mistakes: ['从句用疑问语序（一律陈述语序 where he lives）', '主语从句的「是否」用 if（只能 whether）'] },
    exercises: [
      { q: 'I know ___ he is honest. 填？', options: ['what', 'that', 'which', 'who'], answer: 1, explain: '句意完整用 that' },
      { q: '___ he needs is time. 填？', options: ['That', 'Which', 'What', 'Whether'], answer: 2, explain: 'needs 缺宾语' },
      { q: '从句必须用哪种语序？', options: ['疑问语序', '陈述语序', '倒装语序', '任意'], answer: 1, explain: '第一坑' },
      { q: '主语从句表「是否」只能用？', options: ['if', 'whether', 'that', 'what'], answer: 1, explain: 'if 不能提前' },
      { q: 'It is good news ___ he passed.', options: ['what', 'that', 'which', 'how'], answer: 1, explain: '形式主语句' },
      { q: '名词性从句选词第一问：从句缺不缺 ___', options: ['成分', '字母'], answer: 0, explain: '缺件用 what', type: 'blank', blank: { answerText: '成分', bank: ['成分', '字母'] } },
    ],
  }),
  L({
    area: '英语', band: 'senior', grade: 10, id: 'eng-51', order: 1123, title: '状语从句：句子的副词', emoji: '🕐', textbook: '人教版英语（必修）',
    curriculum: { module: '语法', points: ['九类状语从句', '易混连词', '主将从现'] },
    story: '什么时候做（时间）·为什么做（原因）·如果怎样（条件）……修饰动作的句子=状语从句。九种逻辑关系·九组连接词——这一课把英语的「逻辑词地图」装进口袋。',
    goals: ['掌握九类状语从句', '区分易混连词', '掌握主将从现'],
    aiIntro: '🕐 句子的副词——状语从句',
    param: { name: 'ac2', label: '状从站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['九类状语从句各管什么？', 'because 和 since 差在哪？', '「主将从现」是什么？'],
    views: [
      { when: 1, title: '九类', subtitle: '逻辑地图', color: 'blue', emoji: '🗺️', blocks: [
        { kind: 'compare', title: '九类状语从句', items: [
          { label: '时间', value: 'when/ while/ as/ before/ after/ until/ as soon as——When I got home, Mom was cooking.：最多的一族' },
          { label: '原因', value: 'because/ since/ as/ now that——Because it rained, we stayed home.：直接回答 why' },
          { label: '条件', value: 'if/ unless（如果不）/ as long as——If you work hard, you will pass.：与主将从现联动的高频' },
          { label: '目的·结果', value: 'so that（为了）/ so…that（如此…以至于）——He got up early so that he could catch the bus.（目的）；He was so tired that he fell asleep.（结果）' },
          { label: '让步·比较·方式·地点', value: 'although/ though/ even if（虽然）；than/ as…as（比较）；as if/ as though（好像）；where/ wherever（地点）：后四类 lesser 高频但常考' },
        ] },
        { kind: 'highlight', text: '时·因·条·目·果·让·比·方·地——九种逻辑九组词' },
      ] },
      { when: 2, title: '辨析', subtitle: '易混词', color: 'green', emoji: '⚔️', blocks: [
        { kind: 'compare', title: '三组易混', items: [
          { label: 'because / since / as', value: 'because：语气最强·回答 why·可直接回答提问；since：显而易见的原因「既然」；as：附带原因·语气最弱：口气从重到轻' },
          { label: 'so that vs so…that', value: 'so that（目的·常配 could/can）：为了；so…that（结果）：如此…以至于——有无「…」是天壤之别' },
          { label: 'if vs unless', value: 'if（如果·正条件）；unless= if not（如果不·反条件）——Unless you hurry, you will miss it = If you do not hurry…' },
        ] },
        { kind: 'info', icon: '⚠️', title: 'although/ but 不共存', text: '中文「虽然…但是」成对出现——英语 although 和 but 只能用一个：Although he is poor, he is happy.（√）Although…but…（×）：中英思维的硬差异·写作第一检查点' },
        { kind: 'highlight', text: 'because 到 as 语气渐弱·although 和 but 势不两立' },
      ] },
      { when: 3, title: '规则', subtitle: '主将从现', color: 'amber', emoji: '⚡', blocks: [
        { kind: 'steps', title: '主将从现三大应用', items: ['时间条件状从（when/ if/ as soon as/ until…）——主句将来·从句现在：If it rains tomorrow, we will stay home（不是 will rain）', '「一…就…」家族——as soon as/ the moment/ on doing：As soon as he arrives, I will call you', '陷阱识别：宾语从句不受限——I do not know when he will come（宾从照常用将来）：只限状从·别扩大化' ] },
        { kind: 'info', icon: '📝', title: '写作运用', text: '状语从句是句式升级的利器——把 I was tired. I kept working. 合成 Although I was tired, I kept working：简单句+逻辑词=复合句：阅卷眼中的「语法多样性」主要就看这个' },
        { kind: 'highlight', text: '状从主将从现·宾从不受限——合成句是写作升级术' },
      ] },
    ],
    teach: { sections: [
      { title: '九类', body: '【时间】when while until。【原因】because since as。\n【条件】if unless。【目的】so that。【结果】so…that。\n【让步】although。【比较】than as…as。【方式】as if。【地点】where。' },
      { title: '易混', body: '【因三兄弟】because强→as弱·since=既然。\n【so that】目的 vs so…that结果。\n【unless】=if not。【禁】although不与but连用。' },
      { title: '主将从现', body: '【规则】时/条状从用现在时表将来。\n【一…就…】as soon as 同理。\n【例外】宾语从句照常用将来。' },
    ], examples: [
      { q: 'If it ___ tomorrow, we will stay home', steps: ['if 条件状语从句', '主将从现', '用 rains', '不是 will rain'], tip: '状从禁将来' },
      { q: '合并 He is young. He knows a lot', steps: ['逻辑=让步', 'Although he is young, he knows a lot', '不能加 but', '句式升级'], tip: '二选一' },
    ], mistakes: ['时间/条件状语从句用 will（主将从现用一般现在时）', 'although 和 but 连用（只能留一个）'] },
    exercises: [
      { q: '主句将来时·if 从句用什么时态？', options: ['将来时', '现在时', '过去时', '完成时'], answer: 1, explain: '主将从现' },
      { q: 'He was ___ tired ___ he fell asleep.', options: ['so…that', 'so that', 'such…that', 'too…to'], answer: 0, explain: '如此…以至于' },
      { q: 'unless 的意思是？', options: ['只要', '如果不', '因为', '虽然'], answer: 1, explain: '= if not' },
      { q: '语气最强的原因连词是？', options: ['as', 'since', 'because', 'for'], answer: 2, explain: '回答 why' },
      { q: 'Although he is poor, ___ is happy（补主句）', options: ['but he', 'he', 'and but he', 'however'], answer: 1, explain: '不再用 but' },
      { q: '时间条件状语从句遵循主将从 ___', options: ['现', '去'], answer: 0, explain: '现在时表将来', type: 'blank', blank: { answerText: '现', bank: ['现', '去'] } },
    ],
  }),
  L({
    area: '英语', band: 'senior', grade: 11, id: 'eng-52', order: 1124, title: '倒装句：语序的反转', emoji: '🔄', textbook: '人教版英语（选择性必修）',
    curriculum: { module: '语法', points: ['完全倒装', '部分倒装', '常见触发条件'] },
    story: '英语语序一般是「主语+谓语」——但有时要把动词搬到主语前面：这就是倒装。为了强调·为了平衡·为了衔接——反常的语序反而制造出庄重与文采。',
    goals: ['区分完全与部分倒装', '掌握触发条件', '会在写作中运用'],
    aiIntro: '🔄 反转的语序——倒装句',
    param: { name: 'inv', label: '倒装站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['完全倒装和部分倒装差在哪？', '什么情况必须倒装？', 'Only 放句首一定倒装吗？'],
    views: [
      { when: 1, title: '两类', subtitle: '倒装深浅', color: 'blue', emoji: '🪜', blocks: [
        { kind: 'compare', title: '完全 vs 部分倒装', items: [
          { label: '完全倒装', value: '整个谓语动词搬到主语前——Here comes the bus. / On the hill stands a tower.：简单·「整个搬家」' },
          { label: '部分倒装', value: '只把助动词/ be/情态动词提前——Never have I seen such a thing.（have 提前·seen 留下）：像一般疑问句的结构：考点主力' },
        ] },
        { kind: 'info', icon: '📍', title: '完全倒装两场景', text: 'here/ there/ up/ down 开头+位移动词（come/ go/ rush）；介词短语开头+ be/ stand/ lie/ sit（地点存在句）：主语是代词时不倒装（Here he comes·不倒）：判断第一问——代词主语除外' },
        { kind: 'highlight', text: '整个搬=完全·只提助动词=部分·代词主语不倒' },
      ] },
      { when: 2, title: '触发', subtitle: '部分倒装条件', color: 'green', emoji: '⚡', blocks: [
        { kind: 'compare', title: '四大触发器', items: [
          { label: '否定词开头', value: 'Never/ Seldom/ Little/ Not only/ By no means 放句首——Never have I heard of it. / Not only did he come, but he also sang.' },
          { label: 'only + 状语开头', value: 'Only then did I realize. / Only in this way can we win.（only+状语才触发·only+主语不触发：Only he knows—不倒）' },
          { label: 'so/ neither 开头', text: '', value: 'So am I. / Neither do I.（「我也/我也不」的倒装应答）：口语高频', hint: '' },
          { label: '省略 if 的虚拟', value: 'Had I known, I would have helped. = If I had known…（had/ were/ should 提前替代 if）：书面高级句' },
        ] },
        { kind: 'info', icon: '🏫', title: '考场口诀', text: '否定开头·only 加状语·so/neither 应答·虚拟去 if——四大触发器罩住 90% 的考题：先认触发器·再找助动词提前' },
        { kind: 'highlight', text: '否定词·only状·so/neither·虚拟去if——四大触发' },
      ] },
      { when: 3, title: '运用', subtitle: '写作加分', color: 'amber', emoji: '✍️', blocks: [
        { kind: 'steps', title: '升级你的作文', items: ['普通句：I have never seen a better performance.', '倒装升级：Never have I seen a better performance.', '效果：否定词倒装自带强调语气·阅卷眼前一亮', '同法：Only by working hard can we succeed.（替换 We can succeed only by working hard）' ] },
        { kind: 'info', icon: '⚖️', title: '用而不过', text: '一篇文章用一两处倒装是亮点·满篇倒装是灾难——高级句式的法则是「点缀」不是「堆砌」：开头结尾各一处·效果最佳' },
        { kind: 'highlight', text: '一两处倒装是亮点——点缀不堆砌' },
      ] },
    ],
    teach: { sections: [
      { title: '两类倒装', body: '【完全】整个谓语提前（Here comes the bus）。\n【部分】只提助/be/情态（Never have I…）。\n【例外】代词主语不倒。' },
      { title: '四触发器', body: '【否定词】Never Seldom Not only。\n【only+状语】Only then did I…（only+主语不倒）。\n【so/neither】So am I。【虚拟】Had I known=If I had。' },
      { title: '写作运用', body: '【升级】普通句→倒装句强调。\n【节制】一篇一两处最佳。\n【常用】Never have I…/ Only by…can we…' },
    ], examples: [
      { q: '改写 I have never heard such a story', steps: ['否定词 never 开头', '触发部分倒装', 'Never have I heard such a story', '助动词 have 提前'], tip: '否定词搬家' },
      { q: '判断 Only he knows the answer 要不要倒装', steps: ['only+主语 he', '不是 only+状语', '不触发倒装', 'Only then did he know 才倒'], tip: '看 only 后面' },
    ], mistakes: ['only + 主语也倒装（只有 only+状语才触发）', '代词主语也完全倒装（Here he comes 不倒）'] },
    exercises: [
      { q: 'Never ___ I seen such a thing. 填？', options: ['did', 'have', 'do', 'was'], answer: 1, explain: 'have seen 现在完成' },
      { q: 'Here ___ the bus!', options: ['comes', 'does come', 'came he', 'he come'], answer: 0, explain: '完全倒装' },
      { q: 'Only then ___ I realize the truth.', options: ['I did', 'did I', 'I do', 'do I did'], answer: 1, explain: 'only+状语倒装' },
      { q: '「我也不」的倒装表达？', options: ['So do I', 'Neither do I', 'I not too', 'Me too not'], answer: 1, explain: 'neither 应答' },
      { q: 'Had I known earlier 是省略了？', options: ['that', 'if', 'what', 'which'], answer: 1, explain: '虚拟倒装' },
      { q: '倒装在作文中的使用原则是 ___ 不堆砌', options: ['点缀', '全用'], answer: 0, explain: '一两处最佳', type: 'blank', blank: { answerText: '点缀', bank: ['点缀', '全用'] } },
    ],
  }),
  L({
    area: '英语', band: 'senior', grade: 11, id: 'eng-53', order: 1125, title: '强调句：It is…that 的聚光灯', emoji: '🔦', textbook: '人教版英语（选择性必修）',
    curriculum: { module: '语法', points: ['强调句结构', '强调什么成分', '与相似句型辨析'] },
    story: '一句话里最想让人记住的部分·可以用一盏「聚光灯」打亮——It is…that… 就是这盏灯。 spotlight 打在主语·宾语·状语上·语气瞬间翻倍。',
    goals: ['掌握强调句结构', '会强调各成分', '辨析相似句型'],
    aiIntro: '🔦 句子的聚光灯——强调句',
    param: { name: 'em2', label: '强调站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['强调句怎样构成？', '能强调哪些成分？', '怎样和定语从句区分？'],
    views: [
      { when: 1, title: '结构', subtitle: '公式', color: 'blue', emoji: '📐', blocks: [
        { kind: 'info', icon: '📜', title: '基本结构', text: 'It is/ was + 被强调部分 + that/ who + 其余部分——It was Tom that/ who broke the window.（强调 Tom）：把 It is…that 去掉·句子依然完整（Tom broke the window）——这是判断强调句的金标准' },
        { kind: 'info', icon: '🔧', title: '怎样「还原检验」', text: '任何强调句都能去掉「外壳」还原成普通句——It was in the park that I met her. → I met her in the park.：去掉后读不通的就不是强调句（是别的句型）——解题万能钥匙' },
        { kind: 'highlight', text: 'It is + 强调 + that + 其余——去掉外壳句子依然完整' },
      ] },
      { when: 2, title: '强调', subtitle: '谁被照亮', color: 'green', emoji: '🎯', blocks: [
        { kind: 'compare', title: '三种常见强调', items: [
          { label: '强调主语', value: 'It was my mother who called me.（人可用 who）——突出「是谁」' },
          { label: '强调宾语', value: 'It was this book that I wanted.——突出「要什么」' },
          { label: '强调状语', value: 'It was yesterday that we met. / It was in Beijing that…（时间地点）——最常见·叙事作文高频' },
        ] },
        { kind: 'info', icon: '❌', title: '不能强调什么', text: '谓语动词不能被强调（要强调语气就用 do/ does/ did——I DO like it）：表语也不能。只能强调主·宾·状：强调句的禁区记两条就够' },
        { kind: 'highlight', text: '主宾状可以强调·谓语只能靠 do/ does/ did' },
      ] },
      { when: 3, title: '辨析', subtitle: '三大相似', color: 'amber', emoji: '🔍', blocks: [
        { kind: 'compare', title: '三面辨析', items: [
          { label: 'vs 定语从句', value: 'It was in the room that we met（还原通顺=强调句）；It was the room where we met（where 引导定从·修饰 room）：去掉 that 读不通=定从' },
          { label: 'vs it 形式主语', value: 'It is clear that he is right（clear 是形容词·that 从句是真主语——形式主语句）；It was he that was right（还原 he was right·强调句）：看 It is 后是形容词还是被强调成分' },
          { label: 'vs 时间状语从句', value: 'It was 8 o when we arrived（when 引导时间从句）；It was at 8 o that we arrived（强调 at 8 o·还原可通）：有 at=强调·无 at=时间从句·一介之差' },
        ] },
        { kind: 'info', icon: '✍️', title: '写作运用', text: '读后续写点睛句：It was at that moment that I understood her love.（强调那一刻）——叙事高潮的标配：比 I understood at that moment 强十倍·阅卷看得见的文采' },
        { kind: 'highlight', text: '还原检验一招通杀——去掉外壳读得通就是强调句' },
      ] },
    ],
    teach: { sections: [
      { title: '结构', body: '【公式】It is/was+强调+that/who+其余。\n【检验】去掉外壳句子完整。' },
      { title: '强调对象', body: '【主】人可用who。【宾】this book that…。\n【状】时间地点最高频。【禁】谓语（用do强调）。' },
      { title: '辨析', body: '【定从】去掉读不通=定从。\n【形式主语】It is 形容词 that…。\n【时间从句】at 8 that=强调·8 when=从句。\n【写作】叙事高潮点睛句。' },
    ], examples: [
      { q: '判断 It was in the room ___ we met', steps: ['去掉 It was…that', 'we met in the room 通顺', '是强调句·用 that', '若 the room 后接 where 则是定从'], tip: '还原检验' },
      { q: '强调 I met her yesterday', steps: ['想强调 yesterday', 'It was yesterday that I met her', '也可强调 her：It was her that I met yesterday', '按需要选灯'], tip: '想照亮谁就框谁' },
    ], mistakes: ['强调谓语动词用 It is…that（谓语只能用 do/does/did 强调）', '把定语从句当强调句（还原读不通的是定从）'] },
    exercises: [
      { q: '强调句的万能判断法是？', options: ['看长度', '看时态', '还原检验', '数词数'], answer: 2, explain: '去掉外壳句子仍完整' },
      { q: 'It was Tom ___ broke the window.', options: ['which', 'who', 'what', 'whom'], answer: 1, explain: '人可用 who' },
      { q: '强调谓语动词应该用？', options: ['It is…that', 'do/ does/ did', 'so that', 'such that'], answer: 1, explain: 'I DO like it' },
      { q: 'It was 8 o\'clock ___ we arrived.', options: ['that', 'when', 'which', 'who'], answer: 1, explain: '无 at=时间从句' },
      { q: '读后续写的高潮点睛常用？', options: ['It was at that moment that…', 'I very understand', 'And then and then', 'The end'], answer: 0, explain: '强调那一刻' },
      { q: '强调句像给句子打 ___', options: ['聚光灯', '马赛克'], answer: 0, explain: '照亮重点', type: 'blank', blank: { answerText: '聚光灯', bank: ['聚光灯', '马赛克'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 9, id: 'eng-54', order: 1126, title: '情态动词表推测：把握几何', emoji: '🎲', textbook: '人教版英语（九年级）',
    curriculum: { module: '语法', points: ['肯定推测', '否定推测', '推测的把握等级'] },
    story: 'must·might·can not·could not——同样的情态动词·在推测语境里是四个把握等级：从「肯定是」到「绝不可能是」。这一课学会用英语表达「我有几成把握」。',
    goals: ['掌握推测用法', '区分把握等级', '注意时态搭配'],
    aiIntro: '🎲 几成把握——情态动词表推测',
    param: { name: 'md', label: '推测站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['must 一定是「必须」吗？', 'can not 和 may not 差多远？', '对过去的推测怎么说？'],
    views: [
      { when: 1, title: '等级', subtitle: '把握光谱', color: 'blue', emoji: '📊', blocks: [
        { kind: 'steps', title: '把握从高到低', items: ['must（90%+）：肯定——He must be tired（他一定是累了）：最接近确定', 'may / might / could（50% 上下）：可能——She might know（她可能知道）：might 比 may 更不确定', 'can not（95%-）：不可能——It can not be true（不可能是真的）', 'could not / must not（极少作推测）：注意 must not 是「禁止」不是「不可能」——不可能只认 can not' ] },
        { kind: 'info', icon: '🎭', title: '一词多义的 must', text: 'must 的两个身份：①义务「必须」（You must go）②推测「一定」（You must be hungry）：语境辨身份——后接状态动词（be/ know）多为推测·后接动作多为义务：考试最爱考的双重身份' },
        { kind: 'highlight', text: 'must 肯定→may 可能→can not 不可能：把握的光谱' },
      ] },
      { when: 2, title: '过去', subtitle: '对已发生的事', color: 'green', emoji: '⏮️', blocks: [
        { kind: 'info', icon: '📖', title: '情态+ have done', text: '对过去的推测：情态动词 + have + 过去分词——He must have missed the bus（他一定错过了公交车）；She might have forgotten（她可能忘了）：推断「已经发生的事」的标配' },
        { kind: 'info', icon: '❗', title: 'can not have done', text: '对过去的否定推测——He can not have said that（他不可能说过那话）：can 表推测只用于否定和疑问（Can it be true? / It can not be true）·肯定推测不用 can：这是 can 的独特规矩' },
        { kind: 'info', icon: '💭', title: 'should have done', text: '本应该做而没做（含责备）——You should have told me earlier（你本该早点告诉我）：不是推测·是「虚拟责备」·常与推测一起考' },
        { kind: 'highlight', text: '推测过去=情态+have done·can 推测只用否定疑问' },
      ] },
      { when: 3, title: '语境', subtitle: '实战推理', color: 'amber', emoji: '🕵️', blocks: [
        { kind: 'steps', title: '解题三步', items: ['看线索：句中给了什么证据（灯亮着→有人在家）', '定把握：证据强→must·证据弱→might·证据矛盾→can not', '定时态：现在的事用原形·过去的事用 have done：三步锁定答案' ] },
        { kind: 'info', icon: '🔦', title: '经典情境', text: 'The lights are on. They must be at home.（强证据·高把握）；He is not answering. He might be sleeping.（弱证据·低把握）；That can not be John—John is in Beijing.（直接矛盾·否定）：证据决定把握——情态推测题本质是逻辑题' },
        { kind: 'highlight', text: '证据定把握·时态看远近——情态推测=逻辑推理' },
      ] },
    ],
    teach: { sections: [
      { title: '把握等级', body: '【must】90%肯定。【may/might】可能（might更弱）。\n【can not】不可能。【must not】=禁止不是推测。' },
      { title: '推测过去', body: '【结构】情态+have+done（must have missed）。\n【can】推测只用于否定疑问。\n【should have done】本该做（责备）。' },
      { title: '解题三步', body: '【看证据】【定把握】【定时态】。\n【本质】逻辑推理题。' },
    ], examples: [
      { q: '地上是湿的·推测', steps: ['线索：地湿', '可能是下雨（也可能洒水）→不百分百', 'It might have rained', '不是 must have（证据不够铁）'], tip: '证据定词' },
      { q: '选 must not 还是 can not', steps: ['意思=不可能', '推测否定只用 can not', 'must not 是禁止', 'It can not be him'], tip: '身份辨析' },
    ], mistakes: ['用 must not 表「不可能」（那是禁止·不可能用 can not）', '对过去的推测忘记 have done（must have missed 不是 must missed）'] },
    exercises: [
      { q: '把握最高的推测用？', options: ['might', 'must', 'may', 'could'], answer: 1, explain: '90%+肯定' },
      { q: '表示「不可能」用？', options: ['must not', 'can not', 'need not', 'may not'], answer: 1, explain: 'can 的否定推测' },
      { q: 'He ___ have missed the bus（他一定没赶上）', options: ['must', 'can', 'might', 'should'], answer: 0, explain: '强证据推测过去' },
      { q: 'might 表示的把握约为？', options: ['90%', '50% 上下', '0%', '100%'], answer: 1, explain: '可能而已' },
      { q: 'You should have told me 的意思是？', options: ['你已经告诉我', '你本该告诉我（责备）', '你将要告诉我', '别告诉我'], answer: 1, explain: '虚拟责备' },
      { q: '情态推测题的本质是 ___ 推理', options: ['逻辑', '抽奖'], answer: 0, explain: '证据定把握', type: 'blank', blank: { answerText: '逻辑', bank: ['逻辑', '抽奖'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 9, id: 'eng-55', order: 1127, title: '过去完成时：过去的过去', emoji: '⏪', textbook: '人教版英语（九年级）', 
    curriculum: { module: '时态', points: ['结构与时序', '常见信号词', '与一般过去时区分'] },
    story: '昨天到达电影院时·电影已经开始了——「到达」是过去·「开始」是过去的过去：这就需要过去完成时。时态的「时间机器」·专门回到过去某一时刻之前。',
    goals: ['掌握过去完成时结构', '识别信号词', '区分与一般过去时'],
    aiIntro: '⏪ 过去的过去——过去完成时',
    param: { name: 'pp3', label: '过完站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['过去完成时怎样构成？', 'by the time 是什么信号？', '两个过去动作怎样排先后？'],
    views: [
      { when: 1, title: '结构', subtitle: 'had done', color: 'blue', emoji: '📐', blocks: [
        { kind: 'info', icon: '📜', title: '基本结构', text: 'had + 过去分词——When I arrived, the train had left.（到达之前·火车已走）：核心是「过去的过去」——以过去某时刻为参照·描述在那之前完成的事' },
        { kind: 'info', icon: '⏰', title: '时间轴理解', text: '画一条线：had left（更早）→ arrived（参照点过去）→ 现在：过去完成时永远依附一个「过去的参照点」（when I arrived/ by 5 p.m. yesterday）：没有参照点的孤立过去·用一般过去时就够' },
        { kind: 'highlight', text: 'had done=参照点之前已完成——必须有个过去锚点' },
      ] },
      { when: 2, title: '信号', subtitle: '提示词', color: 'green', emoji: '🚨', blocks: [
        { kind: 'compare', title: '常见信号词', items: [
          { label: 'by + 过去时间', value: 'By the time we got there, they had finished dinner. / By 2020, he had written three books.：最经典的触发' },
          { label: 'before/ after', value: 'He had studied English before he went to the UK.（before 天然标注先后）' },
          { label: 'when/ as soon as', value: 'When I had done my homework, I went out.（先完成→再出去）' },
          { label: 'said/ told/ asked 引导的宾从', value: 'He said he had seen the film.（转述时那件事更早发生）：间接引语的高频搭档' },
        ] },
        { kind: 'info', icon: '🎯', title: '解题口诀', text: '看到 by the time/ before + 过去动作 → 优先考虑 had done；两个过去动作比先后 → 早的用 had done 晚的用过去时：先找锚点再定时态' },
        { kind: 'highlight', text: 'by the time·before·宾从转述——had done 三大信号' },
      ] },
      { when: 3, title: '辨析', subtitle: 'vs 一般过去时', color: 'amber', emoji: '⚔️', blocks: [
        { kind: 'compare', title: '两时态对比', items: [
          { label: '一般过去时', value: '只描述「过去发生了什么」——I lost my key.（丢了·什么时候不确定）' },
          { label: '过去完成时', value: '强调「过去某点之前已完成」——When I got home, I found I had lost my key.（到家之前已丢）：多了「截至过去某时」的限定' },
          { label: '判断法', value: '两件事都在过去·需要排先后才用过完；只有一件事·老实用过去时：别见过去就 had——过完必须有参照' },
        ] },
        { kind: 'info', icon: '📖', title: '叙事写作运用', text: '读后续写的高级开头：By the time the sun rose, we had reached the top.（先到顶·后日出）：一句话交代两件事的先后·叙事紧凑的利器：阅卷眼中的时态多样性' },
        { kind: 'highlight', text: '两事排序用过完·单事过去就过去——写作紧凑利器' },
      ] },
    ],
    teach: { sections: [
      { title: '结构', body: '【公式】had+过去分词。\n【核心】过去某参照点之前完成。\n【必须】有过去锚点。' },
      { title: '信号词', body: '【by the time】By the time we got there, they had finished.\n【before/after】先后标注。\n【宾从】He said he had seen it。' },
      { title: '辨析运用', body: '【过去时】只说发生。【过完】截至过去某时已完成。\n【判断】两事排序→had done。\n【写作】By the time…, we had…' },
    ], examples: [
      { q: 'When I arrived, the film ___ (begin)', steps: ['两个过去动作', 'begin 更早', 'arrived 是锚点', 'had begun'], tip: '先找锚点' },
      { q: '转述 He said he ___ (finish) it', steps: ['said 过去', 'finish 在 said 之前', '宾从时态后移', 'had finished'], tip: '转述后移' },
    ], mistakes: ['孤立的过去动作也用 had done（没有参照点就用过去时）', '忘记过去分词形式（had went 应为 had gone）'] },
    exercises: [
      { q: '过去完成时的结构是？', options: ['have done', 'had done', 'will do', 'do did'], answer: 1, explain: 'had+过去分词' },
      { q: '过去完成时描述的是？', options: ['现在', '过去', '过去的过去', '将来'], answer: 2, explain: '以过去为锚' },
      { q: 'By the time we ___, they had left.', options: ['arrive', 'had arrived', 'arrived', 'will arrive'], answer: 2, explain: '锚点用过去时' },
      { q: 'He said he ___ the film already.', options: ['saw', 'had seen', 'sees', 'has seen'], answer: 1, explain: '转述后移' },
      { q: '只有一件过去的事应该用？', options: ['过去完成时', '一般过去时', '将来时', '进行时'], answer: 1, explain: '别见过去就 had' },
      { q: '过去完成时必须有过去的 ___ 点', options: ['锚', '字母'], answer: 0, explain: '参照时刻', type: 'blank', blank: { answerText: '锚', bank: ['锚', '字母'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id + ' order=' + l.order).join(', '));
