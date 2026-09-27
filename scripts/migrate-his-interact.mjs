import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 第75轮：历史 8 课迁移到原生互动卡形态（interact.views）。
 * 移除 Python 演示代码（lab.code/starterCode/codeLesson），保留 lab.params 供滑块与路由。
 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const V = {
  'his-01': {
    explore: ['北京人会用火为什么很重要？', '河姆渡和半坡的房屋为什么长得不一样？', '原始农业给人类生活带来了什么变化？'],
    views: [
      { when: 1, title: '北京人', subtitle: '约 70 万—20 万年前 · 北京周口店', color: 'red', emoji: '🔥',
        blocks: [
          { kind: 'info', icon: '🔥', title: '会使用天然火', text: '用火烧烤食物、御寒、驱赶野兽——火种被小心保存，是人类进化的重要阶段' },
          { kind: 'info', icon: '🪨', title: '打制石器', text: '旧石器时代：粗打粗砸，但已经是了不起的工具' },
          { kind: 'compare', title: '一张名片记住北京人', items: [
            { label: '时间', value: '约70万—20万年前' }, { label: '地点', value: '北京周口店龙骨山' },
            { label: '相貌', value: '保留猿的特征·能直立行走', hint: '猿人之间的人类' }, { label: '生活', value: '群居生活', hint: '一起打猎采集' },
          ] },
          { kind: 'highlight', text: '从猿到人，火与工具是两把钥匙' },
        ] },
      { when: 2, title: '河姆渡人', subtitle: '约 7000 年前 · 浙江余姚 · 长江流域', color: 'green', emoji: '🌾',
        blocks: [
          { kind: 'info', icon: '🌾', title: '种植水稻', text: '长江流域是世界稻作农业的重要起源地——我国是世界上最早种植水稻的国家' },
          { kind: 'info', icon: '🏠', title: '干栏式建筑', text: '木结构房屋高出地面：防潮防虫，适合长江流域潮湿多雨的环境' },
          { kind: 'compare', title: '一张名片记住河姆渡', items: [
            { label: '农作物', value: '水稻' }, { label: '工具', value: '磨制石器', hint: '新石器时代' },
            { label: '房屋', value: '干栏式', hint: '住得高防潮' }, { label: '陶器', value: '黑陶' },
          ] },
          { kind: 'highlight', text: '南稻北粟——地理环境决定生活方式' },
        ] },
      { when: 3, title: '半坡人', subtitle: '约 6000 年前 · 陕西西安 · 黄河流域', color: 'orange', emoji: '🏺',
        blocks: [
          { kind: 'info', icon: '🌾', title: '种植粟（小米）', text: '黄河流域是粟作农业的起源地——我国也是世界上最早种植粟的国家' },
          { kind: 'info', icon: '🏠', title: '半地穴式房屋', text: '房屋一半深入地下：冬暖夏凉，适合黄河流域干燥寒冷的环境' },
          { kind: 'info', icon: '🎨', title: '会制彩陶', text: '陶器上画着人面鱼纹等图案——生活里开始有了"美"' },
          { kind: 'compare', title: '一张名片记住半坡', items: [
            { label: '农作物', value: '粟（小米）' }, { label: '工具', value: '磨制石器' },
            { label: '房屋', value: '半地穴式', hint: '住得深保暖' }, { label: '陶器', value: '彩陶' },
          ] },
          { kind: 'highlight', text: '定居 + 农业 + 制陶 = 迈入新石器时代' },
        ] },
    ],
  },
  'his-02': {
    explore: ['甲骨文主要记载了什么内容？', '司母戊鼎为什么能铸得那么重？', '三星堆文化说明了什么？'],
    views: [
      { when: 1, title: '甲骨文', subtitle: '商朝 · 河南安阳殷墟', color: 'amber', emoji: '🐢',
        blocks: [
          { kind: 'info', icon: '🔎', title: '发现故事', text: '1899 年，金石学家王懿荣在中药「龙骨」上发现了奇怪的刻痕——三千年前的文字重见天日' },
          { kind: 'info', icon: '📜', title: '记了什么', text: '祭祀、战争、收成、天象……商王占卜的记录，样样都刻在龟甲兽骨上' },
          { kind: 'compare', title: '一张名片记住甲骨文', items: [
            { label: '载体', value: '龟甲·兽骨' }, { label: '内容', value: '占卜记录' },
            { label: '地位', value: '最早的成熟文字', hint: '汉字的前身' }, { label: '出土地', value: '殷墟', hint: '证实商朝存在' },
          ] },
          { kind: 'highlight', text: '今天的汉字与甲骨文一脉相承' },
        ] },
      { when: 2, title: '青铜器', subtitle: '商周 · 铸造巅峰', color: 'teal', emoji: '🗿',
        blocks: [
          { kind: 'info', icon: '⚖️', title: '司母戊鼎', text: '迄今出土最重的青铜器——重 800 多公斤，需要上百名工匠协作浇铸' },
          { kind: 'info', icon: '🐑', title: '四羊方尊', text: '造型最精美的青铜器之一——四只卷角羊栩栩如生' },
          { kind: 'steps', title: '泥范铸造三步', items: ['制模：用泥塑出器物模样', '翻范：泥模翻制成外范与内范', '浇铸：铜液浇入范腔·冷却后打磨'] },
          { kind: 'highlight', text: '青铜器是礼器与兵器——权力与等级的象征' },
        ] },
      { when: 3, title: '三星堆', subtitle: '商朝 · 四川广汉', color: 'violet', emoji: '👁️',
        blocks: [
          { kind: 'info', icon: '🗿', title: '青铜大立人', text: '高约 2.6 米的青铜巨人，双手夸张地环握，庄严神秘' },
          { kind: 'info', icon: '🌳', title: '青铜神树', text: '近 4 米高的神树挂满铜鸟——古蜀人想象中的通天之树' },
          { kind: 'info', icon: '🎭', title: '黄金面具', text: '贴金面罩与大耳造型独具一格，与中原风格既联系又不同' },
          { kind: 'highlight', text: '印证中华文明起源「多元一体」的格局' },
        ] },
    ],
  },
  'his-03': {
    explore: ['儒家的核心思想是什么？', '法家为什么特别受秦国欢迎？', '哪家主张顺应自然、无为而治？'],
    views: [
      { when: 1, title: '儒家 · 孔子', subtitle: '春秋晚期 · 儒家学派创始人', color: 'red', emoji: '🎓',
        blocks: [
          { kind: 'info', icon: '💗', title: '核心：仁 与 礼', text: '仁者爱人·克己复礼；为政以德——用道德感化而不是严刑酷法' },
          { kind: 'info', icon: '🏫', title: '大教育家', text: '创办私学·有教无类·因材施教——不管贫富贵贱，人人都该读书' },
          { kind: 'compare', title: '一张名片记住孔子', items: [
            { label: '学派', value: '儒家' }, { label: '时期', value: '春秋晚期' },
            { label: '思想', value: '仁·礼·德' }, { label: '著作', value: '《论语》', hint: '弟子整理的言行录' },
          ] },
          { kind: 'highlight', text: '儒家后来成为两千多年封建社会的正统思想' },
        ] },
      { when: 2, title: '道家 · 老子', subtitle: '春秋晚期 · 道家学派创始人', color: 'sky', emoji: '☯️',
        blocks: [
          { kind: 'info', icon: '🌿', title: '核心：道法自然', text: '万物运行有它的规律，人应当顺应而不是强行改变' },
          { kind: 'info', icon: '🧘', title: '无为而治', text: '不妄为、不扰民——让事情按自身规律发展' },
          { kind: 'info', icon: '☯️', title: '辩证智慧', text: '「祸兮福之所倚，福兮祸之所伏」——对立的双方可以互相转化' },
          { kind: 'highlight', text: '《道德经》五千言，说尽自然与人生' },
        ] },
      { when: 3, title: '墨家 · 墨子', subtitle: '战国 · 平民的学派', color: 'green', emoji: '🛡️',
        blocks: [
          { kind: 'info', icon: '💞', title: '兼爱', text: '无差别地爱一切人——不分亲疏贵贱' },
          { kind: 'info', icon: '🕊️', title: '非攻', text: '反对不义的战争——但墨家也擅长守城，帮弱国自卫' },
          { kind: 'info', icon: '💪', title: '尚贤 · 节俭', text: '用人看才能不看出身；反对铺张浪费' },
          { kind: 'highlight', text: '墨家代表着平民百姓的愿望' },
        ] },
      { when: 4, title: '法家 · 韩非', subtitle: '战国末期 · 君主的最爱', color: 'violet', emoji: '📜',
        blocks: [
          { kind: 'info', icon: '⚖️', title: '核心：以法治国', text: '法律面前赏罚分明——治理国家靠制度，不靠人情' },
          { kind: 'info', icon: '👑', title: '中央集权', text: '权力集中到君主手中，建立强有力的统一国家' },
          { kind: 'info', icon: '⚔️', title: '秦国为何买账', text: '商鞅变法正是法家实践——奖励耕战·以法强国，为秦统一打下基础' },
          { kind: 'highlight', text: '法家为秦的统一提供了理论武器' },
        ] },
    ],
  },
  'his-04': {
    explore: ['统一文字为什么影响最深远？', '郡县制比分封制好在哪里？', '四项措施共同解决了什么问题？'],
    views: [
      { when: 1, title: '统一文字：小篆', subtitle: '书同文', color: 'red', emoji: '✍️',
        blocks: [
          { kind: 'info', icon: '🔀', title: '问题', text: '战国七雄文字各写各的，一道政令出门就「看不懂」' },
          { kind: 'info', icon: '🧩', title: '办法', text: '全国统一使用小篆——后来隶书逐渐流行，书写更方便' },
          { kind: 'compare', title: '为什么最重要', items: [
            { label: '政令', value: '全国通行无阻' }, { label: '交流', value: '不同地区读同一种字' },
            { label: '文化', value: '文化认同从此凝聚', hint: '作用最深远' },
          ] },
          { kind: 'highlight', text: '文字是文化黏合剂——统一从「写得一样」开始' },
        ] },
      { when: 2, title: '统一货币：半两钱', subtitle: '一种钱花遍天下', color: 'amber', emoji: '🪙',
        blocks: [
          { kind: 'info', icon: '🔀', title: '问题', text: '布币、刀币、蚁鼻钱……做买卖要先换钱，太麻烦' },
          { kind: 'info', icon: '🪙', title: '办法', text: '全国统一铸造圆形方孔半两钱——从此一种钱走天下' },
          { kind: 'compare', title: '作用', items: [
            { label: '贸易', value: '交易便利' }, { label: '经济', value: '全国市场连成一片' },
            { label: '细节', value: '钱币形制沿用两千多年', hint: '圆形方孔成为经典' },
          ] },
          { kind: 'highlight', text: '经济统一支撑政治统一' },
        ] },
      { when: 3, title: '统一度量衡', subtitle: '一把尺子量天下', color: 'sky', emoji: '📏',
        blocks: [
          { kind: 'info', icon: '🔀', title: '问题', text: '同样叫「一尺」，各国长短不同；收租收税全对不上账' },
          { kind: 'info', icon: '📏', title: '办法', text: '统一长度（度）、容量（量）、重量（衡）三套标准' },
          { kind: 'compare', title: '作用', items: [
            { label: '赋税', value: '征收有统一准绳' }, { label: '工匠', value: '器物可以互换配件' },
            { label: '生活', value: '买卖公平透明' },
          ] },
          { kind: 'highlight', text: '标准化——现代工业思想的古代原型' },
        ] },
      { when: 4, title: '郡县制', subtitle: '中央直接管地方', color: 'violet', emoji: '🏛️',
        blocks: [
          { kind: 'info', icon: '🔀', title: '问题', text: '分封制下诸侯世袭，地盘越坐越大，最终尾大不掉' },
          { kind: 'info', icon: '🏛️', title: '办法', text: '全国分 36 郡，郡守县令由皇帝直接任免，随时可以撤换' },
          { kind: 'steps', title: '权力怎么走', items: ['皇帝总揽大权', '中央设丞相·太尉·御史大夫', '地方郡县长官由中央任免', '政令一竿子插到县'] },
          { kind: 'highlight', text: '郡县制开创此后两千年地方行政的基本模式' },
        ] },
    ],
  },
  'his-05': {
    explore: ['张骞出使为什么被称为「凿空」？', '河西走廊为什么是咽喉要道？', '哪些东西是沿着丝路传入中原的？'],
    views: [
      { when: 1, title: '第一站：长安', subtitle: '丝路起点 · 今西安', color: 'red', emoji: '🏯',
        blocks: [
          { kind: 'info', icon: '🐪', title: '驼队出发', text: '丝绸、漆器在这里装上骆驼，商队踏上西去的漫漫长路' },
          { kind: 'steps', title: '张骞「凿空」', items: ['前138年：第一次出使西域·联络大月氏', '被扣十余年·持节不失', '前119年：第二次出使·西域各国与汉交往', '前60年：设西域都护·新疆正式归属中央'] },
          { kind: 'highlight', text: '「凿空」——在坚壁上凿开一个孔，东西方交往从此开始' },
        ] },
      { when: 2, title: '第二站：河西走廊', subtitle: '祁连山下的咽喉要道', color: 'amber', emoji: '🏜️',
        blocks: [
          { kind: 'info', icon: '🗺️', title: '狭长的通道', text: '祁连山与北山夹出一条窄窄的走廊，是中原通往西域的必经之路' },
          { kind: 'info', icon: '🏯', title: '汉朝的经营', text: '设河西四郡（武威·张掖·酒泉·敦煌），出玉门关、阳关通往西域' },
          { kind: 'compare', title: '为什么重要', items: [
            { label: '军事', value: '抗击匈奴的前哨' }, { label: '商贸', value: '商旅必经的通道' },
            { label: '今天', value: '「一带一路」的枢纽地带' },
          ] },
          { kind: 'highlight', text: '敦煌——走廊西端的世界级宝库' },
        ] },
      { when: 3, title: '第三站：西域 → 欧洲', subtitle: '翻葱岭 · 到大秦（罗马）', color: 'sky', emoji: '🌍',
        blocks: [
          { kind: 'steps', title: '完整路线', items: ['长安出发', '穿河西走廊', '经西域（今新疆）', '翻葱岭到中亚·西亚', '最终抵达欧洲的大秦（罗马帝国）'] },
          { kind: 'compare', title: '双向的交流', items: [
            { label: '西去', value: '丝绸·漆器', hint: '冶铁·凿井技术' },
            { label: '东来', value: '葡萄·核桃·苜蓿', hint: '良马·乐器·佛教' },
          ] },
          { kind: 'highlight', text: '罗马贵族为丝绸一掷千金——这条路叫「丝绸之路」' },
        ] },
    ],
  },
  'his-06': {
    explore: ['推恩令「妙」在哪里？', '尊崇儒术带来了什么变化？', '四张王牌共同解决了什么问题？'],
    views: [
      { when: 1, title: '政治：推恩令', subtitle: '主父偃建议 · 柔性削藩', color: 'red', emoji: '🃏',
        blocks: [
          { kind: 'info', icon: '🔀', title: '问题', text: '汉初分封的诸侯王地盘大、兵力强，随时威胁中央' },
          { kind: 'info', icon: '✂️', title: '妙招', text: '让诸侯王把封地分给所有子弟（原来只传嫡长子）——王国越分越小' },
          { kind: 'compare', title: '为什么高明', items: [
            { label: '诸侯子弟', value: '人人有份·感激皇帝' }, { label: '诸侯王国', value: '层层瓜分·越分越小' },
            { label: '代价', value: '不费一兵一卒', hint: '对比七国之乱的教训' },
          ] },
          { kind: 'highlight', text: '温水煮诸侯——软刀子解决硬问题' },
        ] },
      { when: 2, title: '思想：尊崇儒术', subtitle: '董仲舒建议 · 思想大一统', color: 'amber', emoji: '📜',
        blocks: [
          { kind: 'info', icon: '🏫', title: '办法', text: '把儒家学说立为正统；长安兴办太学，以儒家经典培养官员' },
          { kind: 'compare', title: '影响', items: [
            { label: '积极', value: '思想统一服务政治统一' }, { label: '消极', value: '限制了其他学派的发展' },
            { label: '长远', value: '儒学成为正统思想两千多年' },
          ] },
          { kind: 'highlight', text: '从此读书人的课本，一读就是两千年' },
        ] },
      { when: 3, title: '经济：盐铁官营', subtitle: '把财源抓在朝廷手里', color: 'green', emoji: '💰',
        blocks: [
          { kind: 'info', icon: '🧂', title: '盐铁收归官府', text: '煮盐、冶铁这两门最赚钱的生意由官府垄断经营' },
          { kind: 'info', icon: '🪙', title: '统一铸币', text: '铸币权收归中央，统一铸造五铢钱——大商人富可敌国的时代结束' },
          { kind: 'compare', title: '作用', items: [
            { label: '财政', value: '国家财源充裕' }, { label: '商人', value: '抑制豪强坐大' },
            { label: '打仗', value: '北击匈奴有了钱袋子' },
          ] },
          { kind: 'highlight', text: '经济命脉握在手里，大一统才有底气' },
        ] },
      { when: 4, title: '军事：北击匈奴', subtitle: '卫青 · 霍去病', color: 'violet', emoji: '⚔️',
        blocks: [
          { kind: 'info', icon: '🏹', title: '三次大战', text: '河南之战·河西之战·漠北之战——卫青霍去病率领汉军连战连捷' },
          { kind: 'compare', title: '作用', items: [
            { label: '边防', value: '北部边郡安定' }, { label: '丝路', value: '扫清开通的障碍' },
            { label: '名言', value: '匈奴未灭·何以家为', hint: '霍去病' },
          ] },
          { kind: 'highlight', text: '政治·思想·经济·军事四管齐下——大一统格局形成' },
        ] },
    ],
  },
  'his-07': {
    explore: ['官渡之战曹操为什么能以少胜多？', '赤壁之战奠定了什么格局？', '三国鼎立包含着怎样的统一趋势？'],
    views: [
      { when: 1, title: '官渡之战', subtitle: '公元 200 年 · 曹操 vs 袁绍', color: 'red', emoji: '🔥',
        blocks: [
          { kind: 'compare', title: '兵力对比', items: [
            { label: '曹操', value: '约 2 万', hint: '以少胜多' }, { label: '袁绍', value: '约 10 万' },
          ] },
          { kind: 'steps', title: '胜负手', items: ['袁绍粮草囤于乌巢', '曹操亲率轻兵夜袭乌巢', '一把火烧尽袁军粮草', '袁军军心大乱·全线崩溃'] },
          { kind: 'info', icon: '📍', title: '影响', text: '为曹操统一北方奠定基础' },
          { kind: 'highlight', text: '第一把火：烧出一个北方霸主' },
        ] },
      { when: 2, title: '赤壁之战', subtitle: '公元 208 年 · 孙刘联军 vs 曹操', color: 'sky', emoji: '⛵',
        blocks: [
          { kind: 'compare', title: '兵力对比', items: [
            { label: '孙刘联军', value: '约 5 万', hint: '以少胜多' }, { label: '曹操', value: '20 余万（号称80万）' },
          ] },
          { kind: 'steps', title: '胜负手', items: ['曹军北方兵不习水战', '战船铁索相连·行动不便', '周瑜定火攻·黄盖诈降', '东南风起·火烧连营'] },
          { kind: 'info', icon: '📍', title: '影响', text: '曹操退守北方，为三国鼎立局面的形成奠定基础' },
          { kind: 'highlight', text: '第二把火：烧出三分天下' },
        ] },
    ],
  },
  'his-08': {
    explore: ['孝文帝为什么要主动汉化？', '迁都洛阳遇到了什么阻力？', '民族交融带来了什么深远影响？'],
    views: [
      { when: 1, title: '迁都洛阳', subtitle: '公元 494 年 · 一次「骗」出来的迁都', color: 'red', emoji: '🐎',
        blocks: [
          { kind: 'steps', title: '迁都妙计', items: ['借口南伐·率大军南下', '行至洛阳·阴雨连绵', '群臣不愿再走·请罢兵', '孝文帝：要么南伐·要么迁都——群臣妥协', '定都洛阳·摆脱旧势力束缚'] },
          { kind: 'info', icon: '📍', title: '为什么是洛阳', text: '中原文化与经济中心，靠近汉文化腹地，改革有了根据地' },
          { kind: 'highlight', text: '迁都是汉化改革的第一颗棋子' },
        ] },
      { when: 2, title: '推行汉制', subtitle: '说汉语 · 穿汉服 · 改汉姓', color: 'amber', emoji: '👘',
        blocks: [
          { kind: 'compare', title: '改了什么', items: [
            { label: '语言', value: '朝中禁鲜卑语·说汉语' }, { label: '服饰', value: '鲜卑人改穿汉服' },
            { label: '姓氏', value: '拓跋 → 元', hint: '孝文帝即元宏' }, { label: '制度', value: '采用中原官制·律令' },
          ] },
          { kind: 'info', icon: '🎯', title: '目的', text: '减少民族隔阂、巩固统治——让鲜卑融入中原文明的大家庭' },
          { kind: 'highlight', text: '不是消灭谁，而是彼此靠近' },
        ] },
      { when: 3, title: '鼓励联姻', subtitle: '胡汉通婚 · 血脉相融', color: 'green', emoji: '🤝',
        blocks: [
          { kind: 'info', icon: '💍', title: '皇族带头', text: '孝文帝倡导鲜卑贵族与汉人高门联姻，皇族率先娶汉人士族之女' },
          { kind: 'info', icon: '🍚', title: '生活互鉴', text: '「胡人汉服、汉人胡食」——胡床、胡服传入中原，汉人的餐桌多了胡饼奶酪' },
          { kind: 'info', icon: '🌾', title: '更大的图景', text: '北民南迁开发江南，各族人民共同劳动生活，交融成为时代的潮流' },
          { kind: 'highlight', text: '民族交融为隋唐盛世的多民族统一国家奠定基础' },
        ] },
    ],
  },
};

let n = 0;
for (const [id, def] of Object.entries(V)) {
  const p = path.join(D, id + '.json');
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  const params = l.lab?.params ?? [];
  // 保留 lab（路由 + 滑块），去掉 Python 演示代码；新增 interact 原生卡片
  l.lab = { params };
  l.interact = { views: def.views, explore: def.explore };
  delete l.starterCode;
  delete l.codeLesson;
  fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n');
  n++;
}
console.log(`已迁移 ${n} 节到原生互动卡形态`);
