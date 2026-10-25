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
    area: '数学', band: 'senior', grade: 11, id: 'math-121', order: 1080, title: '变化率与导数的概念', emoji: '📉', textbook: '人教A版数学（选择性必修二）',
    curriculum: { module: '一元函数导数', points: ['平均变化率', '导数的定义', '导数的几何意义'] },
    story: '速度表上的指针——每一刻的速度到底是多少？「变化得多快」这件事需要一个精确的语言。这一课回到导数的出生地：从「一段的平均」逼近「一点的瞬间」。',
    goals: ['理解平均变化率', '理解导数定义与极限思想', '掌握导数的几何意义'],
    aiIntro: '📉 从平均到瞬间——变化率与导数',
    param: { name: 'dr', label: '导数站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['速度表怎样定义「此刻速度」？', '割线怎样变切线？', '导数定义的三步是什么？'],
    views: [
      { when: 1, title: '平均', subtitle: '一段的快慢', color: 'blue', emoji: '🏃', blocks: [
        { kind: 'info', icon: '🚗', title: '平均变化率', text: '位移从 s(1) 到 s(3)——平均速度 = [s(3)−s(1)] / (3−1) = Δs/Δt：一段路的总变化除以总时间：图像上是割线的斜率' },
        { kind: 'info', icon: '⚠️', title: '平均的局限', text: '平均 60 km/h 不代表每一刻都是 60——中间可能踩过刹车也飙过 100：想知道「某一刻」的真实速度·平均就不够用了——需要让 Δt 越来越小' },
        { kind: 'highlight', text: 'Δy/Δx = 割线斜率——平均的快慢' },
      ] },
      { when: 2, title: '瞬间', subtitle: '极限逼近', color: 'green', emoji: '🎯', blocks: [
        { kind: 'steps', title: '导数定义三步', items: ['给增量：x₀ 处给 x 一个增量 Δx·算出 Δy = f(x₀+Δx) − f(x₀)', '作比值：Δy/Δx（平均变化率·割线斜率）', '取极限：Δx→0 时比值的极限——如果存在·就叫 f 在 x₀ 处的导数 f′(x₀)：瞬间斜率诞生' ] },
        { kind: 'info', icon: '🏔️', title: '切线的诞生', text: 'Δx→0 时·第二点无限逼近第一点——割线「转」成切线：f′(x₀) = 切线斜率——这就是导数的几何意义：切线方程 y = f(x₀) + f′(x₀)(x−x₀)' },
        { kind: 'info', icon: '⚡', title: '物理原型', text: '位移对时间的导数 = 瞬时速度（v = s′(t)）；速度对时间的导数 = 加速度（a = v′(t)）——「求导」就是物理里的「再往细看一层」：牛顿为此发明了微积分' },
        { kind: 'highlight', text: 'f′(x₀)=切线斜率——割线的极限是切线' },
      ] },
      { when: 3, title: '思想', subtitle: '以直代曲', color: 'amber', emoji: '🌀', blocks: [
        { kind: 'info', icon: '🔬', title: '无穷小与极限', text: '0/0 不能直接算——但「趋近过程的稳定趋势」可以定义（极限）：导数是「无限细分再取趋势」的思想：从阿基米德割圆到牛顿流数·人类花了两千年迈出这一步' },
        { kind: 'info', icon: '🌉', title: '以直代曲', text: '小到一定程度·曲线和切线几乎分不清——用切线（直线）近似代替曲线（局部线性化）：工程估算·物理建模·泰勒展开·全靠这一招：微积分的核心哲学' },
        { kind: 'info', icon: '📱', title: '现代应用', text: 'AI 训练（梯度下降——沿导数方向调参）·天气预报·股市模型·电路设计——一切「动态变化」的建模都从 f′ 开始：今天手机里的每一次智能推荐都有导数在跑' },
        { kind: 'highlight', text: '以直代曲——微积分的核心哲学·AI 的地基' },
      ] },
    ],
    teach: { sections: [
      { title: '平均变化率', body: '【定义】Δy/Δx。\n【局限】一段的平均非每刻。\n【图像】割线斜率。' },
      { title: '导数定义', body: '【三步】增量·比值·极限。\n【记号】f′(x₀)=lim(Δx→0)Δy/Δx。\n【几何】切线斜率·切线方程可写。\n【物理】s′=v·v′=a。' },
      { title: '极限思想', body: '【无穷小】趋近趋势可定义。\n【以直代曲】局部线性化近似。\n【现代】梯度下降·一切动态建模。' },
    ], examples: [
      { q: '用定义求 f(x)=x² 在 x=1 的导数', steps: ['Δy=(1+Δx)²−1=2Δx+Δx²', 'Δy/Δx=2+Δx', 'Δx→0 得极限 2', 'f′(1)=2'], tip: '三步定义' },
      { q: '求曲线 y=x² 在 (1,1) 的切线', steps: ['f′(1)=2（斜率）', '点斜式 y−1=2(x−1)', 'y=2x−1', '验证点在曲线上'], tip: '导数即斜率' },
    ], mistakes: ['把平均变化率当成瞬时速度（只有 Δ→0 才是瞬时）', '求切线忘了验证点在曲线上（可能不是切点）'] },
    exercises: [
      { q: '平均变化率的表达式是？', options: ['Δy+Δx', 'y·x', 'Δy/Δx', 'y−x'], answer: 2, explain: '变化量之比' },
      { q: 'Δx→0 时割线的极限位置是？', options: ['x轴', '切线', '法线', '渐近线'], answer: 1, explain: '几何意义' },
      { q: 'f′(x₀) 的几何意义是？', options: ['函数值', '切线斜率', '面积', '周长'], answer: 1, explain: '以直代曲' },
      { q: '位移对时间求导得到？', options: ['加速度', '瞬时速度', '路程', '平均速度'], answer: 1, explain: 's′(t)=v' },
      { q: 'AI 中的梯度下降利用了导数的什么？', options: ['切点', '变化方向信息', '面积', '极值点个数'], answer: 1, explain: '沿导数方向调整' },
      { q: '导数=割线斜率的 ___ 值', options: ['极限', '平均'], answer: 0, explain: 'Δx→0', type: 'blank', blank: { answerText: '极限', bank: ['极限', '平均'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 11, id: 'math-122', order: 1081, title: '求导法则：导数的运算', emoji: '🧮', textbook: '人教A版数学（选择性必修二）',
    curriculum: { module: '一元函数导数', points: ['基本导数公式', '四则运算法则', '复合函数求导'] },
    story: '用定义三步算每一个导数太累——数学家整理出「公式表+运算法则」：从此复杂函数也能像查词典一样快速求导。这一课把导数的「乘法口诀」装进口袋。',
    goals: ['记住基本导数公式', '掌握四则运算法则', '会复合函数求导（链式法则）'],
    aiIntro: '🧮 导数的乘法口诀——求导法则',
    param: { name: 'df', label: '求导站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['常用导数公式有哪些？', '加减乘除怎样处理？', '套娃函数怎样剥？'],
    views: [
      { when: 1, title: '公式', subtitle: '必背表', color: 'blue', emoji: '📋', blocks: [
        { kind: 'compare', title: '核心公式表', items: [
          { label: '幂函数', value: '(xⁿ)′ = n·xⁿ⁻¹——幂次落下来·指数减一（最常用·必须条件反射）' },
          { label: '指数·对数', value: '(eˣ)′ = eˣ（唯一导数等于自己的函数）；(lnx)′ = 1/x' },
          { label: '三角', value: '(sinx)′ = cosx·(cosx)′ = −sinx——「正余互换·余变号」' },
        ] },
        { kind: 'info', icon: '⚡', title: 'eˣ 的特殊地位', text: '导数等于自己——增长速度与自身一样大（「滚雪球式增长」的数学原型）：银行复利·人口增长· radioactive 衰变全都用它建模：一个公式连接整个自然界' },
        { kind: 'highlight', text: 'xⁿ 落幂减一·eˣ 原封不动·sin/cos 互换变号' },
      ] },
      { when: 2, title: '四则', subtitle: '加减乘除', color: 'green', emoji: '➗', blocks: [
        { kind: 'compare', title: '四条法则', items: [
          { label: '加减', value: '[f±g]′ = f′±g′——各求各的·简单' },
          { label: '乘法', value: '(fg)′ = f′g + fg′——「前导后不导 + 前不导后导」：乘法不能各自求导再乘（常见错误！）' },
          { label: '除法', value: '(f/g)′ = (f′g − fg′)/g²——「分子导乘分母减原乘分母导·除以分母平方」：复杂但机械' },
        ] },
        { kind: 'info', icon: '⚠️', title: '两大高频错误', text: '(fg)′ ≠ f′·g′！（乘法要展开两项）；(f/g)′ 别忘了分母平方：这两个错误占导数计算失分的一半——记法则别「想当然」' },
        { kind: 'highlight', text: '乘法分两项·除法分母平方——别想当然' },
      ] },
      { when: 3, title: '链式', subtitle: '剥洋葱', color: 'violet', emoji: '🧅', blocks: [
        { kind: 'steps', title: '复合函数求导（链式法则）', items: ['识别层次：y = f(g(x))——外层 f·内层 g（像洋葱有几层）', '由外到内逐层求导·再把各层导数相乘：y′ = f′(g(x))·g′(x)', '例：y = sin(x²)：外层 sin 的导数 cos·内层 x² 的导数 2x → y′ = cos(x²)·2x' ] },
        { kind: 'info', icon: '🧠', title: '剥洋葱心法', text: '从最外层剥起·每剥一层乘一个导数——三层套娃 y=f(g(h(x)))：f′·g′·h′ 连乘：链式法则是「复杂问题的分解术」——AI 里的反向传播就是链式法则的工业化版本' },
        { kind: 'info', icon: '🏭', title: '工程与科学', text: '物理公式代入（复合量的变化率）·经济学（边际成本链式传导）·机器学习（梯度计算每层连乘）——这条「洋葱公式」是现代计算数学的中枢神经' },
        { kind: 'highlight', text: '由外到内·层层求导·导数连乘——AI 反传的心脏' },
      ] },
    ],
    teach: { sections: [
      { title: '公式表', body: '【幂】(xⁿ)′=nxⁿ⁻¹。【指对】(eˣ)′=eˣ·(lnx)′=1/x。\n【三角】sin↔cos·余变号。' },
      { title: '四则', body: '【加减】各自求。【乘】f′g+fg′。\n【除】(f′g−fg′)/g²。\n【警告】(fg)′≠f′g′。' },
      { title: '链式', body: '【公式】[f(g(x))]′=f′(g)·g′(x)。\n【心法】由外到内·导数连乘。\n【应用】AI反向传播=链式工业化。' },
    ], examples: [
      { q: '求 y=x³·sinx 的导数', steps: ['乘法法则两项', '3x²·sinx + x³·cosx', '别偷懒各自乘', '完成'], tip: '前导后不导' },
      { q: '求 y=e^(2x) 的导数', steps: ['外层 e^u 导数还是 e^u', '内层 2x 导数是 2', '链式相乘', '2e^(2x)'], tip: '剥两层' },
    ], mistakes: ['乘积求导直接相乘（漏了交叉项）', '复合函数忘记乘内层导数（链式漏乘）'] },
    exercises: [
      { q: '(x⁵)′ 等于？', options: ['x⁴', '5x⁴', '5x⁵', '4x⁵'], answer: 1, explain: '落幂减一' },
      { q: '(eˣ)′ 等于？', options: ['x·eˣ⁻¹', 'eˣ', '1/eˣ', '常数'], answer: 1, explain: '唯一不变函数' },
      { q: '乘法法则的正确形式是？', options: ['f′g′', 'f′g+fg′', 'f′g−fg′', 'f+g'], answer: 1, explain: '交叉两项' },
      { q: '[sin(x²)]′ 等于？', options: ['cos(x²)', '2x', 'cos(x²)·2x', '−sin(x²)·2x'], answer: 2, explain: '链式相乘' },
      { q: '(lnx)′ 等于？', options: ['lnx', 'x', '1/x', 'eˣ'], answer: 2, explain: '对数导数' },
      { q: '复合函数求导由外到内·各层导数 ___', options: ['相乘', '相加'], answer: 0, explain: '链式法则', type: 'blank', blank: { answerText: '相乘', bank: ['相乘', '相加'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 11, id: 'math-123', order: 1082, title: '定积分：求和的极限', emoji: '∫', textbook: '人教A版数学（选择性必修二）',
    curriculum: { module: '积分', points: ['定积分的思想', '微积分基本定理', '面积与路程'] },
    story: '求曲线下的面积——把区域切成无数细条·每条当矩形算·再全部加起来。这个两千年前的朴素想法·加上牛顿-莱布尼茨公式·成为科学与工程最强工具。',
    goals: ['理解定积分的分割求和思想', '会用牛顿-莱布尼茨公式', '理解导数与积分的互逆关系'],
    aiIntro: '∫ 无限求和的魔法——定积分',
    param: { name: 'it', label: '积分站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['曲边面积怎样求？', '牛顿-莱布尼茨公式是什么？', '积分能算什么？'],
    views: [
      { when: 1, title: '思想', subtitle: '切条求和', color: 'blue', emoji: '📊', blocks: [
        { kind: 'steps', title: '曲边面积四步', items: ['分割：把区间 [a,b] 切成 n 小段（切得越细越好）', '近似：每小段上方当矩形·高取左端或右端的函数值', '求和：把 n 个小矩形面积全加起来（黎曼和）', '取极限：n→∞·矩形之和的极限就是曲边面积——这个极限值记作 ∫ₐᵇ f(x)dx 定积分' ] },
        { kind: 'info', icon: '🏛️', title: '思想的传承', text: '阿基米德用「穷竭法」算抛物线弓形面积（没有极限概念·差最后一步）；牛顿·莱布尼茨在17世纪补上了关键一环：从此「以直代曲·无限求和」成为系统方法' },
        { kind: 'highlight', text: '分割·近似·求和·取极限——定积分四步' },
      ] },
      { when: 2, title: '公式', subtitle: '牛顿-莱布尼茨', color: 'green', emoji: '🔑', blocks: [
        { kind: 'info', icon: '📜', title: '微积分基本定理', text: '∫ₐᵇ f(x)dx = F(b) − F(a)（F 是 f 的原函数·即 F′=f）——定积分=原函数在两端的差：面积问题瞬间转化为求原函数·从「无限求和」的苦海解放出来' },
        { kind: 'info', icon: '🔁', title: '导数与积分互逆', text: '求导与求原函数互为逆运算（像加法与减法）：微分「切块」·积分「拼回」：这对互逆关系是微积分基本定理的灵魂——人类发现它花了千年·用它只须一行' },
        { kind: 'info', icon: '🧮', title: '速算一例', text: '∫₀¹ x² dx：x² 的原函数是 x³/3 → 1³/3 − 0³/3 = 1/3——抛物线在 [0,1] 下的面积恰好三分之一：不用切条·一步到位' },
        { kind: 'highlight', text: '∫ₐᵇf(x)dx = F(b)−F(a)——无限求和一行搞定' },
      ] },
      { when: 3, title: '应用', subtitle: '万物皆可积', color: 'amber', emoji: '🌍', blocks: [
        { kind: 'compare', title: '三类经典应用', items: [
          { label: '几何', value: '曲边面积·旋转体体积·弧长——工程制图·CAD 的底层算法' },
          { label: '物理', value: '速度积分得路程（v≥0）；力对位移积分得功——「反过来算」的物理量全靠积分' },
          { label: '概率统计', value: '概率密度曲线下的面积=概率——正态分布那张钟形图·每个概率都是一次积分' },
        ] },
        { kind: 'info', icon: '🚀', title: '现代世界', text: '火箭轨道（推力积分成速度·速度积分成位置）·CT 扫描（Radon 变换的逆·本质是积分方程）·音频处理（傅里叶变换·信号分解）·AI 损失函数优化——积分是「连续世界」的算术' },
        { kind: 'highlight', text: '面积·路程·概率·轨道——积分是连续世界的算术' },
      ] },
    ],
    teach: { sections: [
      { title: '思想四步', body: '【分割】切 n 段。【近似】每段作矩形。\n【求和】黎曼和。【极限】n→∞ 即定积分。' },
      { title: '基本定理', body: '【公式】∫ₐᵇf(x)dx=F(b)−F(a)。\n【F】f 的原函数（F′=f）。\n【互逆】微分与积分互逆。\n【例】∫₀¹x²dx=1/3。' },
      { title: '应用', body: '【几何】面积体积弧长。【物理】v→s·F→W。\n【概率】密度曲线下面积=概率。\n【现代】CT·信号·火箭轨道。' },
    ], examples: [
      { q: '算 ∫₀² 3x² dx', steps: ['原函数 F=x³', 'F(2)−F(0)', '8−0', '=8'], tip: '原函数两端差' },
      { q: '速度 v(t)=2t·前3秒路程', steps: ['路程=∫₀³2t·dt', '原函数 t²', '9−0=9', '路程9米'], tip: '积分回路程' },
    ], mistakes: ['忘记代上限减下限（写成 F(b)+F(a)）', '被积函数在区间内变号时直接当面积（需分段取绝对值）'] },
    exercises: [
      { q: '定积分的思想是？', options: ['等差求和', '分割近似求和取极限', '开根号', '配方'], answer: 1, explain: '黎曼和' },
      { q: '牛顿-莱布尼茨公式用的是什么？', options: ['切线斜率', '原函数两端之差', '平均变化率', '最大值'], answer: 1, explain: 'F(b)−F(a)' },
      { q: '∫₀¹x²dx 的值是？', options: ['1', '1/2', '1/3', '2/3'], answer: 2, explain: '1³/3' },
      { q: '积分与微分的关系是？', options: ['无关', '互逆运算', '相等', '相反数'], answer: 1, explain: '基本定理' },
      { q: '速度对时间积分得到？', options: ['加速度', '路程', '质量', '功率'], answer: 1, explain: '反过来算' },
      { q: '∫ₐᵇf(x)dx = F(b) − F( ___ )', options: ['a', '0'], answer: 0, explain: '下限代入', type: 'blank', blank: { answerText: 'a', bank: ['a', '0'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 10, id: 'math-124', order: 1083, title: '数列求和方法：裂项与错位', emoji: '🧩', textbook: '人教A版数学（选择性必修二）',
    curriculum: { module: '数列', points: ['裂项相消', '错位相减', '分组与并项'] },
    story: '等差·等比的单项公式不难——但要求前 n 项之和·像 1/(1×2)+1/(2×3)+… 这样的「混合体」怎么办？两大求和神技：裂项相消·错位相减。这一课把技巧背后的结构看清。',
    goals: ['掌握裂项相消法', '掌握错位相减法', '识别何时用哪种方法'],
    aiIntro: '🧩 求和两大神技——裂项与错位',
    param: { name: 'sg', label: '求和站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['裂项为什么能相消？', '错位相减怎样操作？', '怎样一眼识别题型？'],
    views: [
      { when: 1, title: '裂项', subtitle: '拆开相消', color: 'blue', emoji: '✂️', blocks: [
        { kind: 'info', icon: '📜', title: '基本模式', text: '分母是两项相乘时——1/[n(n+1)] = 1/n − 1/(n+1)：一项拆成两项之差·求和时中间项全部抵消——只剩头和尾：像多米诺骨牌依次倒下' },
        { kind: 'steps', title: '经典一例', items: ['S = 1/(1×2) + 1/(2×3) + … + 1/[n(n+1)]', '每项裂开 = (1/1−1/2)+(1/2−1/3)+…+(1/n−1/(n+1))', '中间项 ±1/2·±1/3…全部成对抵消', 'S = 1 − 1/(n+1) → n→∞ 时 S→1：一列消去·答案自现' ] },
        { kind: 'info', icon: '🎯', title: '常见裂项模板', text: '1/[n(n+k)] → (1/k)[1/n − 1/(n+k)]；1/[√n+√(n+1)] → √(n+1)−√n（分母有理化也是裂项）：识别分母「两因子之差恰与分子相关」——就上裂项' },
        { kind: 'highlight', text: '拆成差·中间消——只剩头尾' },
      ] },
      { when: 2, title: '错位', subtitle: '差比数列', color: 'green', emoji: '↔️', blocks: [
        { kind: 'steps', title: '错位相减五步', items: ['识别：等差×等比（如 aₙ = n·2ⁿ）——「差比数列」', '写 Sₙ = 1·2 + 2·2² + 3·2³ + … + n·2ⁿ', '两边乘公比：2Sₙ = 1·2² + 2·2³ + … + n·2ⁿ⁺¹', '两式错位相减（同幂对齐）：大部分项消去', '解出 Sₙ——剩下首尾几项·一算即得' ] },
        { kind: 'info', icon: '⚠️', title: '两个易错点', text: '①相减时最后一项 n·2ⁿ⁺¹ 别漏（它是「多出来的尾巴」）；②除以 (1−q) 时符号——除以负数要变号：错位相减的失分九成在这两处' },
        { kind: 'highlight', text: '差比结构→乘公比→错位减——盯住尾巴' },
      ] },
      { when: 3, title: '识别', subtitle: '选对武器', color: 'amber', emoji: '🧭', blocks: [
        { kind: 'compare', title: '三大求和策略', items: [
          { label: '裂项相消', value: '信号：分母两因子相乘（且差可通分子）；本质：拆差抵消' },
          { label: '错位相减', value: '信号：等差×等比；本质：乘公比构造相同结构' },
          { label: '分组求和', value: '信号：奇偶项规律不同或可拆成等差+等比；本质：拆开各算各的再合' },
        ] },
        { kind: 'info', icon: '🧠', title: '更高一层', text: '所有求和技巧的哲学：不是「硬加」而是「改造结构让项自我抵消」——化归思想的巅峰：考试看到 Sₙ 别急着算·先花 30 秒识别类型·选对武器再动手' },
        { kind: 'highlight', text: '看结构选方法——改造结构让项自己消' },
      ] },
    ],
    teach: { sections: [
      { title: '裂项相消', body: '【模板】1/[n(n+1)]=1/n−1/(n+1)。\n【推广】1/[n(n+k)]=(1/k)(1/n−1/(n+k))。\n【结果】中间消·剩头尾。' },
      { title: '错位相减', body: '【对象】等差×等比（差比数列）。\n【五步】写和·乘公比·错位减·解出·验尾项。\n【易错】漏尾项·除负变号。' },
      { title: '识别策略', body: '【分母积】裂项。【差×比】错位减。\n【奇偶异】分组。核心：改造结构促消。' },
    ], examples: [
      { q: '求 1/(1×2)+…+1/(9×10)', steps: ['裂项：(1/1−1/2)+…+(1/9−1/10)', '中间全消', '1 − 1/10', '= 9/10'], tip: '头尾之差' },
      { q: '求 S=1+2·2+3·2²+…+n·2ⁿ⁻¹', steps: ['差比结构→错位相减', '2S=2+2·2²+…+n·2ⁿ', '相减得 −S=1+(2+…+2ⁿ⁻¹)−n·2ⁿ', 'S=(n−1)2ⁿ+1'], tip: '盯尾项' },
    ], mistakes: ['裂项时系数忘了乘 1/k（差不是1）', '错位相减漏掉最后一项或多减一项'] },
    exercises: [
      { q: '1/[n(n+1)] 裂项后的形式是？', options: ['1/n + 1/(n+1)', '1/n − 1/(n+1)', 'n − (n+1)', '1/n·1/(n+1)'], answer: 1, explain: '拆差' },
      { q: '错位相减法适用于？', options: ['纯等差', '纯等比', '等差×等比', '质数列'], answer: 2, explain: '差比数列' },
      { q: '裂项相消的本质是？', options: ['硬算', '拆差后中间项抵消', '配方', '换元'], answer: 1, explain: '骨牌效应' },
      { q: 'S=1/(1×2)+1/(2×3)+…+1/(99×100)=？', options: ['1/100', '99/100', '1', '1/2'], answer: 1, explain: '1−1/100' },
      { q: '错位相减最常丢分在？', options: ['首项', '尾项与符号', '定义域', '算两次'], answer: 1, explain: '盯住尾巴' },
      { q: '看到分母两因子相乘→用 ___ 相消', options: ['裂项', '错位'], answer: 0, explain: '结构识别', type: 'blank', blank: { answerText: '裂项', bank: ['裂项', '错位'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 10, id: 'math-125', order: 1084, title: '圆锥曲线的统一定义', emoji: '🔲', textbook: '人教A版数学（选择性必修一）',
    curriculum: { module: '圆锥曲线', points: ['第二定义', '离心率的含义', '轨迹方程'] },
    story: '用一个点·一条线·一个数——能同时造出椭圆·抛物线·双曲线。古希腊的圆锥截痕·在解析几何手里变成「到焦点与到准线的距离之比」的统一定义。这一课看三种曲线的一家人。',
    goals: ['理解统一定义（焦点+准线）', '理解离心率的角色', '会求轨迹方程'],
    aiIntro: '🔲 一家三口的密码——圆锥曲线统一定义',
    param: { name: 'cc', label: '圆锥站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['离心率决定什么形状？', '统一定义怎样写方程？', '现实里哪里有它们？'],
    views: [
      { when: 1, title: '统一', subtitle: '一个定义', color: 'blue', emoji: '📜', blocks: [
        { kind: 'info', icon: '⚖️', title: '统一定义', text: '到定点（焦点 F）的距离与到定直线（准线 l）的距离之比等于常数 e（离心率）的点的轨迹：0 < e < 1 → 椭圆；e = 1 → 抛物线；e > 1 → 双曲线——一个公式三种命运' },
        { kind: 'compare', title: '离心率三档', items: [
          { label: 'e<1 椭圆', value: '「圆扁的程度」——e 越接近 0 越圆·越接近 1 越扁：地球轨道 e≈0.017（近圆）·哈雷彗星 e≈0.97（极扁椭圆）' },
          { label: 'e=1 抛物线', value: '刚好「临界」——到焦点与到准线一样远：卫星的转移轨道常是抛物线（刚好逃逸）' },
          { label: 'e>1 双曲线', value: '「逃离型」——距离比超1：两支张开·张口随 e 增大而变宽' },
        ] },
        { kind: 'highlight', text: '焦点+准线+离心率——一个定义分出三种曲线' },
      ] },
      { when: 2, title: '轨迹', subtitle: '建系列方程', color: 'green', emoji: '✍️', blocks: [
        { kind: 'steps', title: '求轨迹方程五步', items: ['建系：让对称轴落在坐标轴上（事半功倍）', '设点：P(x, y) 写出两个距离（到焦点·到准线）', '列式：|PF| = e·d(P, l)——按定义列等式', '化简：去根号（两边平方）·整理成标准形式', '检验：确认没有增根·写明范围' ] },
        { kind: 'info', icon: '🛰️', title: '开普勒的遗产', text: '行星轨道是椭圆（开普勒第一定律）·太阳在焦点——天体力学就是圆锥曲线的力学：彗星·小行星·人造卫星的轨道按能量大小恰好分成三类：椭圆/抛物线/双曲线——数学定义与物理能量的完美对应' },
        { kind: 'highlight', text: '设点·列定义式·平方化简——轨迹方程五步' },
      ] },
      { when: 3, title: '应用', subtitle: '现实身影', color: 'amber', emoji: '📡', blocks: [
        { kind: 'compare', title: '身边的圆锥曲线', items: [
          { label: '抛物线', value: '探照灯·汽车大灯（焦点光源→平行光）；卫星接收锅（平行信号→聚于焦点）：「焦点」名副其实' },
          { label: '椭圆', value: '激光打印机（椭圆柱面聚光）；「 whispering gallery 」回音壁——站在椭圆焦点能听到对面焦点悄声说话：两个焦点轮流当主角' },
          { label: '双曲线', value: '导航双曲线定位（到两基站距离差恒定的轨迹）；冷却塔的轮廓（双曲面·强度最优）：差恒定→双曲线' },
        ] },
        { kind: 'info', icon: '🚀', title: '航天中的应用', text: '飞船加速到不同速度——轨道从椭圆变抛物线（刚好脱离地球）再变双曲线（飞向外太阳系）：「逃逸速度」就是那个 e=1 的临界点：圆锥曲线是航天动力学的基本语言' },
        { kind: 'highlight', text: '探照灯·回音壁·导航·航天——焦点准线不只是公式' },
      ] },
    ],
    teach: { sections: [
      { title: '统一定义', body: '【定义】|PF|/d(P,l)=e。\n【e<1】椭圆·越近0越圆。\n【e=1】抛物线。【e>1】双曲线。' },
      { title: '轨迹方程', body: '【五步】建系·设点·列定义式·平方化简·检验。\n【天体】开普勒定律·焦点即太阳。\n【能量】三类轨道对应三档速度。' },
      { title: '现实应用', body: '【抛】探照灯·卫星锅。【椭】回音壁·打印机。\n【双】导航定位·冷却塔。【航天】逃逸速度=e1。' },
    ], examples: [
      { q: '判断 e=0.5 的曲线类型', steps: ['e<1', '是椭圆', '较接近圆', '如金星轨道'], tip: '看离心率' },
      { q: '求到点F(1,0)与到直线x=−1等距的轨迹', steps: ['等距即 e=1', '抛物线', '设(x−1)²+y²=(x+1)²', '化简 y²=4x'], tip: '定义直译' },
    ], mistakes: ['认为离心率越大越圆（e→0 才最圆）', '求轨迹方程后不化简成标准形（判不了类型）'] },
    exercises: [
      { q: '离心率 e 满足什么条件时是椭圆？', options: ['e>1', 'e=1', '0<e<1', 'e=0'], answer: 2, explain: '小于1' },
      { q: '抛物线的离心率是？', options: ['0', '1', '2', '不确定'], answer: 1, explain: '临界情形' },
      { q: '椭圆离心率越接近 0 说明？', options: ['越扁', '越接近圆', '越大', '张口宽'], answer: 1, explain: '地球 e≈0.017' },
      { q: '到两定点距离差恒定的轨迹是？', options: ['椭圆', '抛物线', '双曲线', '圆'], answer: 2, explain: '差定→双' },
      { q: '卫星锅的形状利用了抛物线的？', options: ['对称性', '焦点聚光性', '渐近线', '离心率'], answer: 1, explain: '平行→聚焦' },
      { q: '统一定义用到定点和定 ___ 的距离比', options: ['直线', '圆'], answer: 0, explain: '准线', type: 'blank', blank: { answerText: '直线', bank: ['直线', '圆'] } },
    ],
  }),
  L({
    area: '数学', band: 'senior', grade: 10, id: 'math-126', order: 1085, title: '方差与标准差：波动的度量', emoji: '📊', textbook: '人教A版数学（必修二）',
    curriculum: { module: '统计', points: ['方差的概念', '标准差的意义', '方差的运算性质'] },
    story: '两名射手的平均分都是 8.9 环——一个发挥稳定·一个忽高忽低。只看平均不够·还要看「波动」：方差就是波动大小的尺子。这一课让「稳」也能被量化。',
    goals: ['理解方差的概念', '掌握标准差的意义', '会用方差的运算性质'],
    aiIntro: '📊 量「稳」的尺子——方差与标准差',
    param: { name: 'vr', label: '方差站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['平均一样谁更稳？', '为什么平方不取绝对值？', '线性变换后方差怎样变？'],
    views: [
      { when: 1, title: '方差', subtitle: '偏离的平方', color: 'blue', emoji: '📐', blocks: [
        { kind: 'info', icon: '📖', title: '定义', text: 'D(X) = E[(X−E(X))²]——每个值与平均的差·平方后取期望（加权平均）：「偏差平方的平均」——平方消除了正负抵消·放大了离群值' },
        { kind: 'info', icon: '📏', title: '标准差', text: 'σ = √D(X)——开根号回到原始量纲：方差单位是「环²」·标准差是「环」（可比较·可画图）：统计图表报的多是标准差' },
        { kind: 'info', icon: '🧮', title: '简化公式', text: 'D(X) = E(X²) − [E(X)]²（平方的期望减期望的平方）——手算更方便：像「勾股式」的漂亮关系·考试速算主力' },
        { kind: 'highlight', text: 'D=E(X²)−E(X)²·标准差开根号回量纲' },
      ] },
      { when: 2, title: '意义', subtitle: '稳不稳定', color: 'green', emoji: '🎯', blocks: [
        { kind: 'compare', title: '两名射手的故事', items: [
          { label: '甲：9,9,9,9,9', value: '平均 9·方差 0——绝对稳定（每发一样）' },
          { label: '乙：7,10,10,8,10', value: '平均 9·方差>0——平均同·波动大：教练选人先看方差（关键比赛要「不崩」）' },
          { label: '生活场景', value: '投资回报率（高风险=大方差）·产品质量（零方差=六西格玛）·运动员稳定性——「均值定档次·方差定风险」' },
        ] },
        { kind: 'info', icon: '❓', title: '为什么平方不绝对值', text: '绝对值也可以度量偏离（平均绝对偏差）——但平方可导·运算性质完美（下面马上看）·数学处理方便：微积分时代的选择·沿用至今' },
        { kind: 'highlight', text: '均值定档次·方差定风险——两个数合起来才完整' },
      ] },
      { when: 3, title: '性质', subtitle: '运算规则', color: 'amber', emoji: '⚙️', blocks: [
        { kind: 'compare', title: '三条核心性质', items: [
          { label: '数乘', value: 'D(aX+b) = a²·D(X)——放大 a 倍·波动放大 a² 倍（平移 b 不改变波动！）·与期望的线性形成对照' },
          { label: '方差加法', value: 'X·Y 独立 ⇒ D(X+Y) = D(X)+D(Y)——注意：这里需要独立！（期望加法不需要）：常考辨析' },
          { label: '独立 vs 不独立', value: '若 X·Y 不独立·D(X+Y)=D(X)+D(Y)+2Cov(X,Y)——协方差项登场：方差加法「要独立」是高一档的要求' },
        ] },
        { kind: 'info', icon: '🌉', title: '与正态分布的联系', text: '正态曲线 N(μ, σ²) 由两个参数完全决定——μ（均值）定中心·σ（标准差）定胖瘦：σ 小→又高又瘦（数据集中）·σ 大→矮胖（分散）：均值方差就是分布的「身份证号」' },
        { kind: 'highlight', text: '数乘平方·平移不变·相加要独立——三条性质走天下' },
      ] },
    ],
    teach: { sections: [
      { title: '定义', body: '【方差】D(X)=E[(X−E(X))²]。\n【速算】D=E(X²)−E(X)²。【标准差】σ=√D。' },
      { title: '意义', body: '【对照】均值定档次·方差定风险。\n【场景】投资·质量·体育。\n【平方】消正负·放离群·可微。' },
      { title: '性质', body: '【数乘】D(aX+b)=a²D(X)·平移不变。\n【加法】独立才可 D(X+Y)=D(X)+D(Y)。\n【正态】σ 定胖瘦。' },
    ], examples: [
      { q: '比较两组稳定性', steps: ['先比均值（档次）', '再比方差（波动）', '方差小者更稳', '教练选方差小的'], tip: '两把尺子' },
      { q: 'D(X)=4·求 D(2X+3)', steps: ['数乘 a=2·b=3', 'D=2²×4+3不进入', '=4×4', '=16'], tip: '平移不变' },
    ], mistakes: ['认为平移改变方差（D(X+b)=D(X)）', '方差相加时不检查独立性（不独立有协方差项）'] },
    exercises: [
      { q: '方差度量的是？', options: ['波动大小', '平均水平', '最大值', '总和'], answer: 0, explain: '偏离程度' },
      { q: '方差的简化计算公式是？', options: ['E(X²)', 'E(X²)−E(X)²', 'E(X)²−E(X²)', '√E(X)'], answer: 1, explain: '平方期望减期望平方' },
      { q: 'D(X+b) 等于？', options: ['D(X)+b', 'b²·D(X)', 'D(X)', '0'], answer: 2, explain: '平移不变' },
      { q: '标准差与方差的关系是？', options: ['相等', '方差开根号得标准差', '标准差平方=方差', '无关'], answer: 2, explain: '回量纲' },
      { q: 'D(X+Y)=D(X)+D(Y) 需要？', options: ['互斥', 'X,Y 独立', '相等', '无关'], answer: 1, explain: '与期望不同' },
      { q: '正态分布中 σ 越大曲线越 ___', options: ['瘦高', '矮胖'], answer: 1, explain: '数据分散', type: 'blank', blank: { answerText: '矮胖', bank: ['矮胖', '瘦高'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id + ' order=' + l.order).join(', '));
