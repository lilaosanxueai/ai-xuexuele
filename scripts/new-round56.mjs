import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第56轮拓展批：信息科技高中+2 + 语文初中+2 + 英语初中+2 + 音乐初中+1 + 体育小学+1 = 8 节（订单号 472-479） */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const L = {};
const mk = (o) => ({ toolbox: [], actor: { costume: o.emoji, x: 0, y: 0 }, targets: [], tasks: [],
  codeLesson: true, starterCode: o.lab.code, celebrate: '新知识到手！', ...o });

/* ================= 信息科技·高中 +2 ================= */

L['it-20'] = mk({ id: 'it-20', island: 'cross', order: 472, title: '图的遍历：BFS 与 DFS', emoji: '🕸️',
  subjectArea: '信息科技', gradeBand: 'senior', grade: 11, textbook: '人教版信息科技（高中）',
  curriculum: { module: '数据结构', points: ['广度优先 BFS', '深度优先 DFS', '两者的适用场景'] },
  story: '在迷宫里找出口：DFS 是一条路走到黑再回头，BFS 是每层房间挨个看。社交网络找"三度好友"用 BFS（同层即同度），走迷宫用 DFS（一条道探到底）。',
  goals: ['理解 BFS 的队列实现', '理解 DFS 的栈实现', '会选择合适遍历'],
  aiIntro: '🕸️ 切换遍历策略，看搜索的脚印完全不同——图遍历演示台！',
  lab: { params: [{ name: 'mode', label: '策略', min: 1, max: 2, step: 1, value: 1 }],
    grid: false, explore: ['mode=1 为什么 BFS 找最短路更合适？', 'mode=2 DFS 为什么会"回头"？', '什么问题只能用 BFS？'],
    code: `# 图遍历演示台
mode = 1   # 1BFS 2DFS

hide()
t = "BFS 广度优先"
d = "队列实现：起点入队→出队访问→邻居全入队→层序扩散"
use2 = "最短路·社交好友度·层级遍历"
col = "#2563eb"
if mode == 2:
    t = "DFS 深度优先"
    d = "栈实现：走到最深处→无路可走→回溯到岔口→换条路"
    use2 = "走迷宫·拓扑排序·判断连通"
    col = "#dc2626"
fill_rect(0, 130, 360, 30, col)
write(t, 0, 130, "#fff", 13)
fill_rect(0, 76, 360, 42, "#f1f5f9")
write(d, 0, 76, "#0f172a", 10)
fill_rect(0, 16, 360, 54, "#fef3c7")
write("适用：" + use2, 0, 16, "#b45309", 10)
if mode == 1:
    fill_rect(-120, -50, 60, 36, col)
    fill_rect(-50, -50, 60, 36, col)
    fill_rect(20, -50, 60, 36, col)
    write("层1", -120, -50, "#fff", 10)
    write("层2", -50, -50, "#fff", 10)
    write("层3", 20, -50, "#fff", 10)
    pen_color("#94a3b8")
    pen_down()
    go_to(-90, -50)
    go_to(-80, -50)
    pen_up()
    pen_down()
    go_to(10, -50)
    go_to(10, -50)
    pen_up()
if mode == 2:
    write("1", -120, -50, col, 14)
    write("→ 2", -60, -50, col, 12)
    write("→ 3", 0, -50, col, 12)
    write("→ 回 → 4", 70, -50, col, 10)
`,
  },
  teach: { sections: [
      { title: 'BFS', body: '【队列（先进先出）实现：起点入队→队头出队→未访问邻居全部入队→循环】\n"一圈一圈扩散"——先访问近的再访问远的。\n性质：第一次到达某点时走过的边数=最短距离（无权图）。\n找最短路/最少步数→必用 BFS。' },
      { title: 'DFS', body: '【栈（后进先出）/递归实现：沿一条路走到底→无路→回溯上一个岔口→换路】\n"一条道走到黑"——适合探所有可能路径。\n特点：不保证最短，但代码简洁（递归 3 行）。\n适合：全排列/走迷宫/判断有没有解。' },
      { title: '对比选择', body: '【最短路→BFS；遍历所有路径/判断连通→DFS 均可】\n空间：BFS 存整层（队列可能很大）；DFS 存路径（栈深=图深）。\n形象比喻：BFS 是雷达扫描（一圈圈），DFS 是走迷宫（钻到底再回头）。\n实际工程：地图导航用 BFS 变体，编译器语法分析用 DFS。' },
    ], examples: [
      { q: '社交网络中找"你的二度好友"该用什么遍历？', steps: ['二度好友=距离为 2 的节点', 'BFS 按层扩散：第 2 层即二度', '答案：BFS', 'DFS 不保证先到近的'], tip: '按度分层' },
      { q: '走迷宫判断是否存在出口，DFS 怎么做？', steps: ['从起点出发选一个方向走到底', '碰壁回溯到上一个岔口', '换一条没走过的路继续', '所有路都试完没到出口=无解'], tip: '回溯是灵魂' },
    ], mistakes: ['用 DFS 找最短路（不保证最短）', 'BFS 空间溢出不知原因（队列存了太多同层节点）'] },
  exercises: [
    { q: 'BFS 用什么数据结构？', options: ['队列', '栈', '链表', '堆'], answer: 0, explain: '先进先出' },
    { q: 'DFS 用什么数据结构？', options: ['栈', '队列', '数组', '图'], answer: 0, explain: '后进先出' },
    { q: '找最短路应该用？', options: ['BFS', 'DFS', '随机', '都不行'], answer: 0, explain: '第一次到=最短' },
    { q: 'DFS 的核心机制是？', options: ['回溯', '排序', '哈希', '分页'], answer: 0, explain: '碰壁回头' },
    { q: 'BFS 的扩散方式是？', options: ['一层一层', '一条到底', '随机', '倒序'], answer: 0, explain: '同层先访问' },
    { q: 'DFS 递归 3 行核心代码的终止条件是？', options: ['无路可走或已到终点', '栈空', '队列满', '遍历次数超限'], answer: 0, explain: '回溯条件' },
  ],
});

L['it-21'] = mk({ id: 'it-21', island: 'cross', order: 473, title: '数据库入门：SQL 查询', emoji: '🗄️',
  subjectArea: '信息科技', gradeBand: 'senior', grade: 12, textbook: '人教版信息科技（高中）',
  curriculum: { module: '数据管理', points: ['表·行·列概念', 'SELECT 基本语法', 'WHERE 条件筛选'] },
  story: '你每天的聊天记录、购物历史、视频推荐——背后都是数据库。一张表就像一个 Excel：行是记录，列是字段。学会 SELECT 就能向数据库提问：帮我找出所有 90 分以上的数学作业。',
  goals: ['理解关系型数据库结构', '掌握 SELECT 基本语法', '会用 WHERE 筛选条件'],
  aiIntro: '🗄️ 切换查询示例，看 SQL 怎么向数据库提问——SQL 查询工作台！',
  lab: { params: [{ name: 'ex', label: '查询示例', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['ex=2 WHERE 后面怎么写条件？', 'ORDER BY 默认从小到大还是从大到小？', 'SELECT * 中的 * 是什么意思？'],
    code: `# SQL 查询工作台
ex = 1   # 示例

hide()
t = "① 查全部"
sql = "SELECT * FROM students;"
d = "取出 students 表的所有行和所有列（* = 全部）"
if ex == 2:
    t = "② 条件筛选"
    sql = "SELECT name, score FROM students WHERE score >= 90;"
    d = "只取 name 和 score 列，且 score ≥ 90 的行"
if ex == 3:
    t = "③ 排序取前 N"
    sql = "SELECT name, score FROM students ORDER BY score DESC LIMIT 5;"
    d = "按 score 从高到低排，取前 5 名"
fill_rect(0, 130, 360, 30, "#0f766e")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 74, 360, 46, "#f0fdfa")
write(sql, 0, 74, "#0f766e", 12)
fill_rect(0, 12, 360, 58, "#fef3c7")
write(d, 0, 12, "#b45309", 11)
write("SQL 四件套：SELECT 选列 · FROM 选表 · WHERE 筛行 · ORDER BY 排序", -15, -55, "#dc2626", 10)
`,
  },
  teach: { sections: [
      { title: '表·行·列', body: '【表=一类数据（学生表/订单表）；行=一条记录（一个学生）；列=一个字段（姓名/分数）】\n主键：唯一标识一行的列（学号）——不重复不为空。\n关系型数据库：多张表通过外键关联（学生表 ↔ 班级表）。\n常见 DB：MySQL/SQLite/PostgreSQL。' },
      { title: 'SELECT 语法', body: '【SELECT 列名 FROM 表名 → 查指定列】\n【SELECT * FROM 表名 → 查全部列】\n【WHERE 条件 → 筛选行（> < >= <= = <>）】\n【ORDER BY 列 DESC/ASC → 排序（DESC 降序，ASC 升序默认）】\n【LIMIT n → 取前 n 条】\n执行顺序：FROM → WHERE → SELECT → ORDER BY → LIMIT。' },
      { title: '进阶', body: '【聚合函数：COUNT(计数) SUM(求和) AVG(平均) MAX MIN】\nSELECT COUNT(*) FROM students WHERE score >= 60; → 及格人数\n【LIKE 模糊匹配：WHERE name LIKE \'张%\' → 姓张的】\n应用场景：学校成绩统计/电商销量分析/App 后台数据——SQL 是数据时代的"识字能力"。' },
    ], examples: [
      { q: '查出所有英语成绩高于 85 的学生姓名。', steps: ['选列：SELECT name', '选表：FROM students', '条件：WHERE english > 85', '完整：SELECT name FROM students WHERE english > 85;'], tip: '列→表→条件' },
      { q: '统计数学不及格（<60）的人数。', steps: ['用 COUNT 函数', 'SELECT COUNT(*) FROM students', '加条件 WHERE math < 60', '返回一个数字'], tip: '聚合+条件' },
    ], mistakes: ['忘记 FROM 指定表（SELECT 后必须有 FROM）', 'WHERE 用 = 而不是 ==（SQL 用单等号）'] },
  exercises: [
    { q: 'SELECT * 中的 * 表示？', options: ['所有列', '乘法', '指针', '注释'], answer: 0, explain: '全选' },
    { q: 'WHERE 子句的作用是？', options: ['筛选行', '选列', '排序', '删除'], answer: 0, explain: '条件过滤' },
    { q: 'ORDER BY score DESC 是？', options: ['降序排列', '升序', '随机', '删除'], answer: 0, explain: 'DESC=大→小' },
    { q: '表的"行"对应什么？', options: ['一条记录', '一个字段', '一种类型', '一个文件'], answer: 0, explain: '行=记录' },
    { q: 'LIMIT 5 的作用？', options: ['取前 5 条', '删除 5 条', '乘 5', '循环 5 次'], answer: 0, explain: '截取' },
    { q: 'COUNT(*) 用于？', options: ['统计行数', '求和', '平均', '最大'], answer: 0, explain: '计数' },
  ],
});

/* ================= 语文·初中 +2 ================= */

L['chn-31'] = mk({ id: 'chn-31', island: 'cross', order: 474, title: '散文阅读：形散神不散', emoji: '🍃',
  subjectArea: '语文', gradeBand: 'junior', grade: 8, textbook: '统编版语文（初中）',
  curriculum: { module: '文学类文本·散文', points: ['散文的特点', '线索的把握', '情感的体悟'] },
  story: '朱自清写背影只写了一个车站买橘子的瞬间，却让几代人落泪——散文不靠情节取胜，靠的是"形散神聚"：材料可以天马行空，情感主线始终一条。',
  goals: ['理解形散神不散', '会找散文线索', '会体悟作者情感'],
  aiIntro: '🍃 切换阅读要素，看散文怎么"散"中有"聚"——散文阅读透视台！',
  lab: { params: [{ name: 'el', label: '要素', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['el=1 为什么散文"散"？', 'el=2 线索一般有哪几种？', 'el=3 情感线索怎么找？'],
    code: `# 散文阅读透视台
el = 1   # 要素

hide()
t = "形散"
d = "取材自由：可写人（阿长）可状物（白杨）可绘景（荷塘）可叙事（背影）"
tip = "表面看东写西写，其实都围绕一个中心"
if el == 2:
    t = "神聚"
    d = "一条线索贯穿全文：物（背影）·情（怀念）·人（藤野）·地点（百草园）"
    tip = "找线索：反复出现的词/物/情感就是线索"
if el == 3:
    t = "情韵"
    d = "散文的落脚点是情感：叙事是表，抒情是里；结尾往往点睛升华"
    tip = "抓首尾和转折处——情感最浓的地方"
fill_rect(0, 130, 360, 30, "#0f766e")
write(t, 0, 130, "#fff", 14)
fill_rect(0, 76, 360, 42, "#f0fdfa")
write(d, 0, 76, "#0f766e", 10)
fill_rect(0, 16, 360, 56, "#fef3c7")
write("要点：" + tip, 0, 16, "#b45309", 10)
pen_color("#0f766e")
pen_down()
go_to(-100, -50)
go_to(0, -50)
go_to(100, -50)
pen_up()
write("线索串起散落的珠子", 0, -70, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '形散', body: '【取材广泛：不受时间空间限制，上天入地随手拈来】\n《背影》：车站的一个瞬间；《白杨礼赞》：从树写到人写到精神。\n"散"不是乱——每则材料都为中心服务。\n判断：去掉某段，中心是否受损？不受损=真正的散（可删）。' },
      { title: '神聚', body: '【一条线索（物/人/情/地/时间）把散珠串成项链】\n《背影》：四次"背影"贯穿，父爱是神；《朝花夕拾》：十篇散文，对往事的深情是神。\n找线索三看：标题（白杨礼赞→白杨）；反复出现的词（背影）；首尾呼应处。' },
      { title: '情感体悟', body: '【散文的终点是情感：或怀念（藤野先生）、或赞美（白杨）、或批判、或感悟（紫藤萝瀑布）】\n情感藏在细节里：一个动作（父亲的攀爬）、一句话、一个物件。\n答题：结合具体细节+点明情感+联系写作背景。\n"一切景语皆情语"——写景散文尤其如此。' },
    ], examples: [
      { q: '《背影》为什么反复写"背影"而不写父亲的正面？', steps: ['背影是父爱最沉默的载体', '四次背影串成线索（神聚）', '避免正面写脸的直白', '背影更能传达含蓄深沉的父爱'], tip: '线索+情感' },
      { q: '散文某段写了与主题无关的风景，能不能删？', steps: ['先判断是否真无关', '看景中是否含情（借景抒情）', '看是否为下文铺垫', '散文的"散"有边界——一切为中心服务'], tip: '真散可删' },
    ], mistakes: ['把散文当小说找情节（散文重情感不重故事）', '找线索只看标题（还有反复出现的词和首尾）'] },
  exercises: [
    { q: '散文的特点概括为？', options: ['形散神不散', '情节曲折', '韵律工整', '议论为主'], answer: 0, explain: '核心特征' },
    { q: '散文的线索可以是？', options: ['物·人·情·地点', '只有物', '只有人', '没有线索'], answer: 0, explain: '多种线索' },
    { q: '散文的落脚点是？', options: ['情感', '情节', '人物', '环境'], answer: 0, explain: '抒情为本' },
    { q: '找线索最直接的方法是看？', options: ['标题和反复出现的词', '字数', '页码', '作者'], answer: 0, explain: '标题即线' },
    { q: '"一切景语皆情语"的意思是？', options: ['景描写承载情感', '景和情无关', '景不重要', '只有情'], answer: 0, explain: '情景交融' },
    { q: '散文答题应结合？', options: ['具体细节+情感', '只有情节', '只有结构', '只有修辞'], answer: 0, explain: '细节支撑' },
  ],
});

L['chn-32'] = mk({ id: 'chn-32', island: 'cross', order: 475, title: '综合性学习：孝亲敬老', emoji: '❤️',
  subjectArea: '语文', gradeBand: 'junior', grade: 7, textbook: '统编版语文（初中）',
  curriculum: { module: '综合性学习', points: ['活动方案设计', '孝亲故事讲述', '感恩卡写作'] },
  story: '语文不只在课本里——给爷爷奶奶讲一个故事、给妈妈写一张感恩卡，这些也是语文。综合性学习把读、写、说、做连成一片，让语文走进生活。',
  goals: ['会设计活动方案', '会讲述孝亲故事', '会写感恩卡'],
  aiIntro: '❤️ 切换活动形式，看语文怎么融入生活——综合性学习活动台！',
  lab: { params: [{ name: 'act', label: '活动', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['act=1 什么故事适合讲给老人听？', '感恩卡该写多长？', '这个活动提升哪些语文能力？'],
    code: `# 综合性学习活动台
act = 1   # 活动

hide()
t = "📖 孝亲故事会"
d = "给爷爷奶奶讲一个二十四孝故事或身边的孝心故事，注意语气生动、适当停顿"
tip = "讲故事的技巧：开头设悬念·中间有细节·结尾有感悟"
if act == 2:
    t = "💌 感恩卡制作"
    d = "给父母写一张感恩卡：称呼+感恩的具体事+祝福语+署名"
    tip = "感恩要具体：不写谢谢妈妈，写谢谢您每天早起为我做早餐"
if act == 3:
    t = "📋 活动方案设计"
    d = "主题+时间地点+参与者+流程分工+预期效果——五要素缺一不可"
    tip = "方案要可执行：时间精确到时段，分工精确到人"
fill_rect(0, 130, 360, 30, "#dc2626")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 76, 360, 42, "#fef2f2")
write(d, 0, 76, "#991b1b", 10)
fill_rect(0, 16, 360, 56, "#fef3c7")
write("要点：" + tip, 0, 16, "#b45309", 10)
write("读 → 讲 → 写 → 做：综合性学习是语文的实战演练场", -15, -55, "#7c3aed", 10)
`,
  },
  teach: { sections: [
      { title: '活动方案', body: '【五要素：主题（孝亲敬老从我做起）+ 时间地点 + 参与者 + 流程分工 + 预期效果】\n格式：标题居中；正文分段；分工用表格清晰。\n注意：方案是"计划书"不是"作文"——语言简洁、步骤明确、可操作。' },
      { title: '故事讲述', body: '【选材：传统故事（黄香温席/子路负米）或身边真实事（同学照顾生病奶奶）】\n技巧：开头设悬念（"那年冬天特别冷……"）；中间有细节（动作/对话）；结尾有感悟。\n口语表达：语速适中、有停顿、有感情、面对听众有眼神交流。' },
      { title: '感恩卡写作', body: '【结构：称呼（亲爱的妈妈）→ 感恩的具体事件（具体到某一件事）→ 感悟/祝福 → 署名日期】\n关键：感恩要具体——"谢谢您每天早起为我做早餐"胜过"谢谢您"。\n语言：真诚朴实，不用华丽辞藻堆砌。\n卡片美化：配简笔画/贴花边——形式也是心意。' },
    ], examples: [
      { q: '给妈妈写感恩卡的开头怎么写？', steps: ['称呼另起一行顶格', '亲爱的妈妈：', '冒号引出正文', '简洁真诚'], tip: '格式+真诚' },
      { q: '设计一次"孝亲敬老"主题班会方案。', steps: ['主题：孝亲敬老从我做起', '时间：周五班会课·地点：本班教室', '流程：故事分享→情景剧→感恩卡互读→合唱', '分工：主持1人·剧本2人·后勤2人'], tip: '五要素齐全' },
    ], mistakes: ['感恩卡写得太笼统（要具体事例）', '活动方案写成作文（应是操作清单）'] },
  exercises: [
    { q: '综合性学习的核心是？', options: ['语文综合运用', '背诵课文', '做题', '考试'], answer: 0, explain: '实践导向' },
    { q: '活动方案的五要素不包括？', options: ['字数', '主题', '时间', '分工'], answer: 0, explain: '方案≠作文' },
    { q: '感恩卡的关键是？', options: ['感恩要具体', '用词华丽', '字数多', '配图精美'], answer: 0, explain: '真情实感' },
    { q: '讲故事的技巧不包括？', options: ['语速越快越好', '开头设悬念', '有细节', '结尾有感悟'], answer: 0, explain: '适中语速' },
    { q: '"黄香温席"属于哪类故事？', options: ['传统孝亲故事', '寓言', '神话', '科幻'], answer: 0, explain: '二十四孝' },
    { q: '活动方案的语言应？', options: ['简洁可操作', '华丽优美', '含蓄委婉', '长篇大论'], answer: 0, explain: '工具文体' },
  ],
});

/* ================= 英语·初中 +2 ================= */

L['eng-32'] = mk({ id: 'eng-32', island: 'cross', order: 476, title: '情景交际：问路与指路', emoji: '🗺️',
  subjectArea: '英语', gradeBand: 'junior', grade: 7, textbook: '人教版英语（初中）',
  curriculum: { module: '交际用语', points: ['问路句型', '方位介词', '指路表达'] },
  story: '在国外旅行迷路了怎么办？Excuse me, how can I get to...? 一句话打开对话。学会问路和指路，你就有了英语世界的"导航仪"！',
  goals: ['掌握问路句型', '会用方位介词', '会指路描述'],
  aiIntro: '🗺️ 切换问路场景，看怎么用英语找方向——问路指路导航仪！',
  lab: { params: [{ name: 'sc', label: '场景', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['sc=2 "go along" 和 "go straight" 一样吗？', 'on the corner 是在角落里吗？', '问路前为什么说 Excuse me？'],
    code: `# 问路指路导航仪
sc = 1   # 场景

hide()
t = "问路"
a1 = "Excuse me, how can I get to the library?"
a2 = "Is there a bank near here? / Where is the nearest bus stop?"
tip = "先说 Excuse me（打扰了）再问——礼貌是通行证"
if sc == 2:
    t = "指路（方向）"
    a1 = "Go along this street and turn left at the second crossing."
    a2 = "Go straight on until you see a hospital, then turn right."
    tip = "along=沿着 / straight=直走 / crossing=十字路口"
if sc == 3:
    t = "指路（位置）"
    a1 = "It's next to the supermarket. / It's across from the park."
    a2 = "It's between the bank and the post office. / It's on your right."
    tip = "next to=旁边 / across from=对面 / between...and=在…之间"
fill_rect(0, 130, 360, 30, "#16a34a")
write(t, 0, 130, "#fff", 13)
fill_rect(0, 74, 360, 48, "#f0fdf4")
write(a1, 0, 74, "#166534", 10)
fill_rect(0, 12, 360, 58, "#fef3c7")
write(a2, 0, 12, "#b45309", 9)
write("词汇：" + tip, -20, -55, "#dc2626", 10)
`,
  },
  teach: { sections: [
      { title: '问路句型', body: '【Excuse me, how can I get to + 地点？】\n【Is there a + 地点 near here?】\n【Where is the nearest + 地点？】\n【Could you tell me the way to + 地点？】（更礼貌）\n回答不知道：Sorry, I am new here. / Sorry, I do not know.' },
      { title: '方位介词', body: '【next to = 旁边 / beside = 在…旁边】\n【across from = 对面 / opposite = 对面】\n【between...and... = 在…和…之间】\n【in front of = 在…前面（外部）/ behind = 在…后面】\n【on the left/right = 在左/右边 / at the corner = 在拐角】\n方位介词+名词：next to the bank（在银行旁边）。' },
      { title: '指路表达', body: '【Go along this street. 沿这条街走】\n【Turn left/right at the... 在…处左/右转】\n【Go straight on. 直走】\n【Take the first turning on the left. 第一个路口左转】\n【It is about 5 minute walk. 步行约5分钟】\n结束时可以说：You cannot miss it.（你不会错过的）' },
    ], examples: [
      { q: '礼貌地问图书馆怎么走？', steps: ['先说 Excuse me', '用 how can I get to 句型', 'Excuse me, how can I get to the library?', '或 Could you tell me the way to the library?'], tip: '礼貌开头' },
      { q: '"在超市对面"怎么说？', steps: ['对面 = across from', 'It\'s across from the supermarket', '也可用 opposite the supermarket', '答案'], tip: 'across from' },
    ], mistakes: ['问路不说 Excuse me（不礼貌）', 'across from 和 through 混淆（across 从表面穿过，through 从内部穿过）'] },
  exercises: [
    { q: '礼貌问路应先说？', options: ['Excuse me', 'Hey', 'Hello', 'Look'], answer: 0, explain: '礼貌用语' },
    { q: '"在银行旁边"是？', options: ['next to the bank', 'in the bank', 'on the bank', 'at the bank'], answer: 0, explain: 'next to' },
    { q: '"直走"是？', options: ['Go straight', 'Go left', 'Go right', 'Go back'], answer: 0, explain: 'straight=直' },
    { q: 'across from 的意思是？', options: ['在…对面', '在…上面', '穿过', '在…里面'], answer: 0, explain: '对面' },
    { q: 'between...and... 表示？', options: ['在…和…之间', '在…后面', '在…旁边', '在…上面'], answer: 0, explain: '两者之间' },
    { q: 'Turn left at the second crossing 的意思是？', options: ['第二个路口左转', '左转两次', '在左边第二个', '向左走两步'], answer: 0, explain: 'crossing=路口' },
  ],
});

L['eng-33'] = mk({ id: 'eng-33', island: 'cross', order: 477, title: '现在完成时：have done', emoji: '✅',
  subjectArea: '英语', gradeBand: 'junior', grade: 8, textbook: '人教版英语（初中）',
  curriculum: { module: '时态·现在完成时', points: ['have/has + 过去分词', '与一般过去时的区别', 'for/since 时间状语'] },
  story: '"I have finished my homework" 和 "I finished my homework" 差在哪？完成时强调"现在的结果"（作业写完了，所以现在可以玩），过去时只说"过去做了"（跟现在无关）。',
  goals: ['掌握现在完成时结构', '区分与过去时', '会用 for/since'],
  aiIntro: '✅ 切换时间轴场景，看 have done 的用法——现在完成时透视镜！',
  lab: { params: [{ name: 'use', label: '用法', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['use=2 怎么区分完成时和过去时？', 'for 和 since 后面接什么？', 'have been to 和 have gone to 差在哪？'],
    code: `# 现在完成时透视镜
use = 1   # 用法

hide()
t = "① 强调结果（对现在的影响）"
ex = "I have lost my key. → 钥匙丢了（所以现在进不了门）"
tip = "重点不在过去丢了，在现在进不去"
if use == 2:
    t = "② 与一般过去时的区别"
    ex = "I have seen the film.（看过——现在知道内容）\\nI saw the film yesterday.（昨天看的——跟现在无关）"
    tip = "有 yesterday/last week 等过去时间 → 用过去时"
if use == 3:
    t = "③ for 与 since"
    ex = "I have lived here for 5 years.（住了5年——时间段）\\nI have lived here since 2021.（自2021年——时间点）"
    tip = "for + 时间段；since + 时间点/从句"
fill_rect(0, 130, 360, 30, "#2563eb")
write(t, 0, 130, "#fff", 11)
fill_rect(0, 72, 360, 54, "#eff6ff")
write(ex, 0, 72, "#1d4ed8", 9)
fill_rect(0, 8, 360, 58, "#fef3c7")
write("要点：" + tip, 0, 8, "#b45309", 10)
write("结构：主语 + have/has + 过去分词（done）", -20, -60, "#dc2626", 11)
`,
  },
  teach: { sections: [
      { title: '结构与用法', body: '【结构：have/has + 过去分词（I have finished / She has gone）】\n用法一：过去动作对现在的影响（I have lost my key→现在进不了门）\n用法二：从过去持续到现在的状态（I have lived here for 5 years）\n否定：haven\'t/hasn\'t + done；疑问：Have/Has + 主语 + done？' },
      { title: '与过去时区别', body: '【现在完成时：跟现在有关（影响/持续）】\n【一般过去时：只说过去的事，与现在无关】\n有明确过去时间词（yesterday/last week/just now/in 2020）→ 必须用过去时，不能用完成时。\n对比：I have been to Beijing（去过，经历）vs I went to Beijing last year（去年去的）。' },
      { title: '标志词与易混', body: '【already（已经）/ yet（还，否定疑问）/ just（刚刚）/ ever（曾经）/ never（从未）】\n【for + 时间段（for 3 years）/ since + 时间点（since 2020）】\nhave been to：去过（人已回来）≠ have gone to：去了（人不在）\nHe has been to Shanghai.（去过上海，现在在这儿）\nHe has gone to Shanghai.（去上海了，现在不在这儿）' },
    ], examples: [
      { q: 'I ___ my homework already. 填什么？', steps: ['already 是完成时标志', '主语 I → have + 过去分词', 'have finished', '答案'], tip: 'already→完成时' },
      { q: 'I ___ him yesterday.（meet）', steps: ['yesterday 是过去时间', '过去时间→一般过去时', 'met', '不能用 have met'], tip: '过去时间→过去时' },
    ], mistakes: ['有 yesterday 还用完成时（过去时间禁用完成时）', 'have been to 和 have gone to 混淆（一个回来了一个没回来）'] },
  exercises: [
    { q: '现在完成时的结构是？', options: ['have/has + 过去分词', 'had + 动词', 'will + 动词', 'am/is/are + doing'], answer: 0, explain: 'have done' },
    { q: 'I have lived here ___ 2020.', options: ['since', 'for', 'from', 'at'], answer: 0, explain: 'since+时间点' },
    { q: '___ you ever ___ to Beijing?', options: ['Have, been', 'Have, gone', 'Did, go', 'Are, going'], answer: 0, explain: 'ever+been' },
    { q: 'yesterday 出现应用什么时态？', options: ['一般过去时', '现在完成时', '现在进行时', '将来时'], answer: 0, explain: '过去时间' },
    { q: 'for 后面接？', options: ['时间段', '时间点', '地点', '人'], answer: 0, explain: 'for 5 years' },
    { q: 'He has ___ to Shanghai.（人还在上海）', options: ['gone', 'been', 'went', 'going'], answer: 0, explain: '去了没回来' },
  ],
});

/* ================= 音乐·初中 +1 ================= */

L['mus-21'] = mk({ id: 'mus-21', island: 'cross', order: 478, title: '节奏创编：从模仿到创作', emoji: '🥁',
  subjectArea: '音乐', gradeBand: 'junior', grade: 8, textbook: '人音版音乐（初中）',
  curriculum: { module: '创编活动', points: ['节奏型设计', '为诗词配节奏', '小组合奏'] },
  story: '一杯水、一支笔、一个巴掌——万物皆可成乐器。今天你不只是演奏者，还是创作者：为《静夜思》设计一段伴奏节奏，让千年古诗与现代节拍碰撞。',
  goals: ['会设计节奏型', '会为诗词配节奏', '能合作创编合奏'],
  aiIntro: '🥁 拨动节奏配方，看四拍怎么变成千变万化——节奏创编实验室！',
  lab: { params: [{ name: 'mix', label: '节奏配方', min: 1, max: 3, step: 1, value: 1 }],
    grid: false, explore: ['同一首诗配不同节奏感觉一样吗？', '四拍可以有几种节奏型？', '小组合奏怎么分配声部？'],
    code: `# 节奏创编实验室
mix = 1   # 节奏配方

hide()
t = "配方A：X X X X（四分音符·匀速）"
feel = "感觉：稳健·行进·庄严"
use2 = "适合《静夜思》：安静平和的夜晚"
if mix == 2:
    t = "配方B：XX XX X —（八分+四分）"
    feel = "感觉：轻快·跳动·活泼"
    use2 = "适合《春晓》：春日鸟鸣的欢快"
if mix == 3:
    t = "配方C：X - XX X（含休止·张弛）"
    feel = "感觉：顿挫·有力·变化"
    use2 = "适合《满江红》：壮怀激烈的情感"
fill_rect(0, 130, 360, 30, "#7c3aed")
write(t, 0, 130, "#fff", 11)
fill_rect(0, 76, 360, 40, "#f5f3ff")
write(feel, 0, 76, "#6d28d9", 11)
fill_rect(0, 16, 360, 56, "#fef3c7")
write("诗配乐：" + use2, 0, 16, "#b45309", 10)
i = 0
while i < 4:
    x = -120 + i * 80
    if mix == 1:
        fill_rect(x, -50, 56, 40, "#7c3aed")
        write("X", x, -50, "#fff", 14)
    if mix == 2:
        if i < 2:
            fill_rect(x, -50, 32, 40, "#7c3aed")
            write("XX", x, -50, "#fff", 10)
        if i == 2:
            fill_rect(x, -50, 56, 40, "#7c3aed")
            write("X", x, -50, "#fff", 14)
        if i == 3:
            write("—", x, -50, "#94a3b8", 14)
    if mix == 3:
        if i == 0:
            fill_rect(x, -50, 56, 40, "#7c3aed")
            write("X", x, -50, "#fff", 14)
        if i == 1:
            write("—", x, -50, "#94a3b8", 14)
        if i >= 2:
            fill_rect(x, -50, 32, 40, "#7c3aed")
            write("XX", x, -50, "#fff", 9)
    i = i + 1
write("X=击一下 XX=快击两下 —=休止", -20, -95, "#0369a1", 10)
`,
  },
  teach: { sections: [
      { title: '节奏型设计', body: '【四拍一小节的常见节奏型：】\nXXXX（四分均匀）· XXXX XX X（八四混合）· X—XX（含休止）· XXXXXXXX（全八分）\n设计原则：先定情绪（安静用疏、热烈用密），再选节奏型。\n从模仿开始：拍打出老师给的节奏→改动一两处→变成自己的。' },
      { title: '诗配节奏', body: '【步骤：①读诗定情绪（静夜思=安静）②选节奏型（疏为主）③标注在诗旁④试拍调整】\n诗的节拍与音乐节拍对应：五言诗=2+3拍，七言诗=2+2+3拍。\n"床前/明月光"→前两字占前两拍，后三字占后两拍。\n高级玩法：两个人一组，一人念诗一人伴奏。' },
      { title: '小组合奏', body: '【三声部分工：低声部（跺脚·稳定拍）+ 中声部（拍腿·节奏型）+ 高声部（拍手·即兴花拍）】\n步骤：定节奏型→分声部练习→慢速合→原速合→加念白/演唱。\n创编的核心不是"写得多复杂"，而是"合作得有多好"。\n演出后互评：哪里最精彩？哪里可以更好？' },
    ], examples: [
      { q: '为《静夜思》选什么节奏型？', steps: ['诗的情感：安静思念', '安静用疏的节奏', '选 XXXX 均匀慢拍', '不选密集的 XXXXXXXX'], tip: '情绪定节奏' },
      { q: '三声部合奏怎么开始排练？', steps: ['先各自练熟自己声部', '从最简单的四拍均匀开始', '慢速合→逐步提速', '最后加入变化和即兴'], tip: '先分后合' },
    ], mistakes: ['节奏密=好听（要与情绪匹配）', '合奏各打各的（要听别人保持同步）'] },
  exercises: [
    { q: '四拍一小节用四分音符是几个？', options: ['4 个', '2 个', '8 个', '1 个'], answer: 0, explain: 'XXXX' },
    { q: '安静的诗适合什么节奏？', options: ['疏缓均匀', '密集快速', '强烈顿挫', '没有节奏'], answer: 0, explain: '疏=静' },
    { q: 'X 在节奏谱中表示？', options: ['击一下', '休止', '两下', '轻拍'], answer: 0, explain: '一个击拍' },
    { q: '五言诗"床前明月光"的分拍是？', options: ['2+3', '1+4', '3+2', '5'], answer: 0, explain: '前2后3' },
    { q: '小组合奏的第一步是？', options: ['分声部各自练', '直接合', '选指挥', '买乐器'], answer: 0, explain: '先分后合' },
    { q: '节奏创编的核心能力是？', options: ['合作与创造', '技术复杂', '速度快', '音量大'], answer: 0, explain: '创编=合作' },
  ],
});

/* ================= 体育·小学 +1 ================= */

L['pe-19'] = mk({ id: 'pe-19', island: 'cross', order: 479, title: '坐位体前屈：柔韧性训练', emoji: '🧘',
  subjectArea: '体育与健康', gradeBand: 'primary', grade: 4, textbook: '人教版体育（小学）',
  curriculum: { module: '体质健康', points: ['坐位体前屈要领', '柔韧性练习方法', '体测标准'] },
  story: '手够不到脚尖不是因为手短——是因为大腿后面的肌肉太紧！坐位体前屈测的是柔韧性，柔韧好的人不容易拉伤。每天压一压，一个月就能进步 5 厘米！',
  goals: ['掌握坐位体前屈动作', '会做柔韧练习', '知道体测标准'],
  aiIntro: '🧘 拨动训练天数，看柔韧性怎么一天天进步——柔韧性成长曲线！',
  lab: { params: [{ name: 'wk', label: '训练周数', min: 0, max: 4, step: 1, value: 0 }],
    grid: true, explore: ['wk=4 大约能进步多少？', '柔韧练习什么时候做最好？', '怎么呼吸能压得更低？'],
    code: `# 柔韧性成长曲线
wk = 0   # 训练周数

hide()
base = -5
gain = wk * 2
cur = base + gain
fill_rect(0, 130, 340, 30, "#f59e0b")
write("当前推算成绩：" + cur + " cm（起点 -5，每周+2cm）", 0, 130, "#fff", 10)
pen_color("#0f172a")
pen_down()
go_to(-160, -40)
go_to(160, -40)
pen_up()
go_to(0, -40)
pen_down()
go_to(0, 90)
pen_up()
pen_color("#dc2626")
pen_down()
go_to(-140, -40 + (base + 10) * 8)
i = 0
while i < wk:
    go_to(-140 + (i + 1) * 35, -40 + (base + (i + 1) * 2 + 10) * 8)
    i = i + 1
pen_up()
if wk > 0:
    write("第" + wk + "周", 140, -40 + (cur + 10) * 8 + 15, "#dc2626", 10)
write("及格 0cm · 良好 8cm · 优秀 14cm（四年级参考）", -20, 100, "#0369a1", 9)
write("每天 5 分钟：压腿→体前屈→横叉", -30, -80, "#7c3aed", 11)
`,
  },
  teach: { sections: [
      { title: '动作要领', body: '【坐位体前屈：坐地双腿伸直→脚跟并拢蹬板→上身前倾→双臂伸直推挡板】\n要点：膝盖不弯（弯了=0分）；匀速推进不猛弹；呼气时下压更深入。\n常见错误：弓背（弓背看着压得低但膝盖必弯）。\n替代练习：站姿体前屈手触地。' },
      { title: '柔韧练习', body: '【压腿：正压（面对横杆腿放上去）·侧压·后压——每个 15 秒×3 组】\n【体前屈：坐姿前屈保持 10 秒；站姿前屈手触脚尖】\n【横叉/竖叉：循序渐进，感觉到拉紧不痛即可，不硬掰】\n最佳时间：热身后（体温高肌肉拉伸效果好），不要冷身就拉。' },
      { title: '体测标准', body: '【四年级参考：及格 0cm·良好 8cm·优秀 14cm（男女略有差异）】\n初中及格约 2-8cm，高中更高。\n柔韧的提升需要持续：每天 5 分钟比一周一次 30 分钟有效。\n柔韧好的好处：运动不易拉伤、体态更舒展、协调性更好。' },
    ], examples: [
      { q: '坐位体前屈时膝盖弯了怎么办？', steps: ['弯膝=成绩无效', '先减低前倾幅度', '保持膝直哪怕压得浅', '柔韧上来后自然压得更低'], tip: '膝直比深度重要' },
      { q: '什么时候做柔韧练习最好？', steps: ['先做 3 分钟热身（原地跑跳）', '体温升高肌肉变"软"', '再做拉伸效果好且不易伤', '冷身硬拉容易拉伤'], tip: '热身后再拉' },
    ], mistakes: ['弓背弯膝追求深度（动作无效）', '猛弹式拉伸（容易拉伤，要匀速保持）'] },
  exercises: [
    { q: '坐位体前屈时膝盖应该？', options: ['伸直不弯', '微弯', '全弯', '随意'], answer: 0, explain: '弯=无效' },
    { q: '下压时应该怎么呼吸？', options: ['呼气下压', '憋气', '大口吸气', '不呼吸'], answer: 0, explain: '呼气放松' },
    { q: '柔韧练习最佳时机是？', options: ['热身后', '刚起床', '吃饭后', '睡觉前'], answer: 0, explain: '体温高拉得好' },
    { q: '四年级及格线大约是？', options: ['0cm', '20cm', '-10cm', '50cm'], answer: 0, explain: '触到脚尖' },
    { q: '拉伸的正确方式是？', options: ['匀速保持', '猛弹', '快速抖动', '大力压'], answer: 0, explain: '静态拉伸' },
    { q: '柔韧好的好处是？', options: ['不易拉伤', '跑得快', '跳得高', '吃得香'], answer: 0, explain: '肌肉弹性好' },
  ],
});

/* ================= 写入 ================= */
let n = 0;
for (const [id, lesson] of Object.entries(L)) {
  fs.writeFileSync(path.join(D, id + '.json'), JSON.stringify(lesson, null, 2) + '\n');
  n++;
}
console.log(`第56轮拓展批写入 ${n} 节：${Object.keys(L).join(', ')}`);
