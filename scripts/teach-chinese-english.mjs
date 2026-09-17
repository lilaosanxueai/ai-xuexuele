import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第27轮·教材级讲解·语文 20 课 + 英语 16 课 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const T = {

// ---------- 语文 ----------
'cross-01': {
  sections: [
    { title: '《静夜思》李白', body: '【床前明月光，疑是地上霜。举头望明月，低头思故乡。】\n作者：李白（唐），"诗仙"。\n主题：望月思乡——明月是思乡的经典意象。' },
    { title: '诗意与字词', body: '疑：好像、以为。霜：写出了月光的皎洁清冷。\n"举头""低头"两个动作，写尽了游子的心绪起伏。\n全诗仅 20 字，情景交融。' },
  ],
  examples: [
    { q: '"疑是地上霜"中的"疑"是什么意思？', steps: ['联系上下文：月光洒地，白得像霜', '"疑"是"以为、好像"', '不是"怀疑谁"的意思'], tip: '古诗字义要看语境，不能只记今义' },
  ],
  mistakes: ['把"疑"理解成"怀疑某人"——这里是"以为、好似"'],
},

'cross-19': {
  sections: [
    { title: '成语：画蛇添足', body: '【比喻做了多余的事，反而坏了事】\n典故：楚国人比赛画蛇，先画完的人给蛇添上脚，反而输了。\n出自《战国策》。' },
    { title: '寓言的智慧', body: '故事结构：起因（比赛画蛇）→ 经过（添足）→ 结果（输掉）。\n道理：过犹不及，多余的举动适得其反。\n近义：多此一举。' },
  ],
  examples: [
    { q: '用"画蛇添足"造一句通顺的话。', steps: ['先想场景：本来已经完成/很好', '再加的动作是多余的、坏的', '如：作文结尾再抄一遍题目，真是画蛇添足'], tip: '造句三要素：谁 + 本已完成 + 多余动作坏事' },
  ],
  mistakes: ['把"画蛇添足"当褒义词（认真细致）——它是贬义，指多此一举'],
},

'cross-40': {
  sections: [
    { title: '《咏鹅》骆宾王', body: '【鹅，鹅，鹅，曲项向天歌。白毛浮绿水，红掌拨清波。】\n作者：骆宾王，唐代诗人，此诗为其七岁时所作。\n全诗白描：写活了鹅的姿态与色彩。' },
    { title: '诗中的颜色与动作', body: '颜色：白毛、绿水、红掌、清波——四色相映。\n动作：曲、歌、浮、拨——静中有动。\n"曲项"是弯着脖子，写出了鹅的形态。' },
  ],
  examples: [
    { q: '"曲项向天歌"描绘了怎样的画面？', steps: ['曲项：弯着长长的脖子', '向天歌：仰头鸣叫', '一只伸长脖子朝天鸣唱的白鹅跃然纸上'], tip: '答画面题：抓住动作词，把诗变成"镜头"' },
  ],
  mistakes: ['"曲"读成 qǔ（歌曲的曲）——这里读 qū，弯曲的意思'],
},

'cross-41': {
  sections: [
    { title: '《春晓》孟浩然', body: '【春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。】\n作者：孟浩然（唐），山水田园诗人。\n写春晨：酣睡、鸟啼、忆夜雨、惜落花。' },
    { title: '惜春之情', body: '晓：天亮。闻：听见。"花落知多少"是怜惜春花被夜雨打落。\n全诗不写"我爱春天"，惜春之情却处处流露——含蓄之美。' },
  ],
  examples: [
    { q: '"春眠不觉晓"的"晓"是什么意思？', steps: ['联系"眠"（睡）与后文鸟啼', '睡到自然醒都不知天亮', '"晓"是天亮、清晨'], tip: '题目《春晓》就是"春天的早晨"' },
  ],
  mistakes: ['把"晓"当成"晓得、知道"——诗中指天亮'],
},

'cross-42': {
  sections: [
    { title: '《悯农》李绅', body: '【锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。】\n"悯"：怜悯、同情。\n前两句写烈日劳作，后两句发出感叹。' },
    { title: '珍惜粮食', body: '日当午：正午烈日，最热的时候——写劳作之苦。\n"粒粒皆辛苦"由一粒推及每一粒。\n感恩劳动者、不浪费粮食，是这首诗送给我们的品格。' },
  ],
  examples: [
    { q: '"锄禾日当午"点明了什么？', steps: ['日当午 = 正午', '正午烈日下锄地', '点明了时间和劳作的艰辛'], tip: '时间+场景+人物感受，一句写全' },
  ],
  mistakes: ['把"悯"解释为"描写"——悯是同情'],
},

'cross-43': {
  sections: [
    { title: '《望庐山瀑布》李白', body: '【日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。】\n庐山：在江西。\n"三千尺"极言其高——夸张手法。' },
    { title: '夸张的作用', body: '夸张 = 故意放大（或缩小）事物特征，增强感染力。\n"三千尺"并非实测，却让瀑布的磅礴扑面而来。\n比喻+夸张连用："疑是银河落九天"。' },
  ],
  examples: [
    { q: '"飞流直下三千尺"用了什么修辞？有什么好处？', steps: ['三千尺：远超实际高度', '是夸张', '突出瀑布高大湍急的气势，画面震撼'], tip: '答修辞题格式：手法 + 内容 + 效果' },
  ],
  mistakes: ['把夸张当"说谎"——夸张是艺术手法，说谎是欺骗'],
},

'cross-44': {
  sections: [
    { title: '文言文《守株待兔》', body: '【宋人有耕者。田中有株。兔走触株，折颈而死。】\n株：树桩。走：跑（古今异义！）。\n释：放下。耒：古代农具。冀：希望。' },
    { title: '寓意', body: '农夫偶然捡到撞死的兔子，便放下农具天天等——再没等到，田也荒了。\n寓意：不能把偶然当必然，要靠劳动获得成果。\n"守株待兔"也讽刺死守经验、不知变通。' },
  ],
  examples: [
    { q: '翻译："兔走触株，折颈而死。"', steps: ['走 = 跑（不是走路）', '触 = 撞到', '译文：兔子跑过来撞在树桩上，折断脖子死了'], tip: '文言翻译先圈出古今异义词，再串句' },
  ],
  mistakes: ['"走"翻译成"走路"——文言中"走"是跑，"行"才是走'],
},

'cross-45': {
  sections: [
    { title: '成语：刻舟求剑', body: '【比喻拘泥成例、不知随情况变化而改变办法】\n故事：楚国人的剑掉入江中，他在船帮刻记号，船靠岸后从记号处下水找剑。\n出自《吕氏春秋》。' },
    { title: '为什么会错', body: '船在动，剑没动——参照物变了，记号早已不对位。\n讽刺：情况已变，方法不变。\n近义：守株待兔、墨守成规。' },
  ],
  examples: [
    { q: '刻舟人错在哪里？用一句话说清。', steps: ['剑沉在水底不动', '船带着记号移动了', '记号位置≠剑的位置——他没考虑船在动'], tip: '一句话抓"什么变了、什么没变"' },
  ],
  mistakes: ['把"刻舟求剑"用于形容"细心做记号"——它是贬义，讽刺不知变通'],
},

'cross-46': {
  sections: [
    { title: '成语：掩耳盗铃', body: '【捂住自己的耳朵去偷铃铛，以为自己听不见别人也听不见——自欺欺人】\n出自《吕氏春秋》。' },
    { title: '荒谬在哪里', body: '客观事实（铃会响、别人有耳朵）不因主观意愿改变。\n堵住自己的耳朵只改变了自己的感知，没改变事实。\n正确做法：承认事实、直面现实。' },
  ],
  examples: [
    { q: '生活中哪些行为是"掩耳盗铃"？', steps: ['特征：以为别人不知道，其实掩盖不了', '如：没复习骗自己"都会了"', '如：删掉错题假装没错'], tip: '找特征再套场景：骗自己 + 事实仍在' },
  ],
  mistakes: ['把"掩耳盗铃"用来形容"安静"——它讽刺的是自欺欺人'],
},

'cross-47': {
  sections: [
    { title: '三种修辞', body: '【比喻：打比方（像、如、仿佛）；拟人：把物当人写；排比：三个及以上结构相似的句子】\n"月亮像银盘"——比喻；"月亮笑弯了腰"——拟人；"爱心是风，是雨，是光"——排比。\n判断抓标志词和写法。' },
    { title: '修辞的表达效果', body: '比喻：化抽象为具体；拟人：生动亲切有感情；排比：气势充沛节奏强。\n答效果题：手法 + 把什么写得怎样 + 表达了什么。' },
  ],
  examples: [
    { q: '"小草从土里探出头来"是什么修辞？好在哪？', steps: ['探出头：人的动作给了小草', '是拟人', '写出小草破土而出的可爱与生机'], tip: '动词是"人干的"而主语是物——八成是拟人' },
  ],
  mistakes: ['见到"像"就判比喻——"他长得像爸爸"是同类比较，不是比喻'],
},

'cross-48': {
  sections: [
    { title: '句末标点', body: '【陈述用句号。；疑问用问号？；强烈感情用感叹号！】\n祈使句表命令请求，语气强时也用感叹号。\n标点是"语气魔法师"：同样一句话，标点不同语气全变。' },
    { title: '引号与冒号', body: '提示语在前：妈妈说："快来吃饭。"（冒号+引号）\n提示语在后："快来吃饭。"妈妈说。（句号在引号内）\n提示语在中间："快来，"妈妈说，"吃饭了。"' },
  ],
  examples: [
    { q: '给下面句子加标点：你今天去图书馆吗', steps: ['"吗"提示疑问', '句末用问号', '你今天去图书馆吗？'], tip: '先判断句型（陈述/疑问/感叹），再选标点' },
  ],
  mistakes: ['有"吗"却打句号——疑问词是问号的信号灯'],
},

'cross-49': {
  sections: [
    { title: '偏旁与字义', body: '【偏旁往往暗示字义：氵与水有关（江河湖）；火与热有关（烤灯炉）】\n木旁与树有关、口旁与嘴有关、艹头与植物有关。\n"部首查字法"就是利用这个规律。' },
    { title: '猜字法', body: '遇到生字先看偏旁猜大类，再结合上下文定词义。\n"闻"：门+耳——门里有耳，本义是听见。\n形声字形旁表义、声旁表音（如"湖"：氵表义、胡表音）。' },
  ],
  examples: [
    { q: '"沐、浴、洗、澡"共同的偏旁是什么？说明什么？', steps: ['都是三点水（氵）', '都与水有关', '这四个字都表示用水清洁身体'], tip: '一串字偏旁相同 = 语义同一家族' },
  ],
  mistakes: ['把"闻"当"用鼻子闻"就完事——本义是"听见"（耳听门内声）'],
},

'cross-50': {
  sections: [
    { title: '多音字', body: '【一个字有多个读音，读音不同意义不同】\n长：cháng（长度）/ zhǎng（长大）。\n行：xíng（行走）/ háng（银行）。\n好：hǎo（好坏）/ hào（爱好）。' },
    { title: '怎么判断读音', body: '看词语定读音：银行→háng；自行车→xíng。\n"爱好"的"好"读四声 hào（喜爱的意思）。\n多积累词语，用词境锁读音。' },
  ],
  examples: [
    { q: '给加点字选择正确读音：长大（A.cháng B.zhǎng）', steps: ['"长大"是生长的意思', '表示生长读 zhǎng', '选 B'], tip: '先说词语的意思，再对应读音' },
  ],
  mistakes: ['见"长"就读 cháng——表示"生长"时读 zhǎng'],
},

'cross-51': {
  sections: [
    { title: '对仗规则', body: '【字数相等、词性相对、平仄相协、意思相关】\n"天对地，雨对风"出自《笠翁对韵》。\n上下联意思相关但不相同。' },
    { title: '经典对子', body: '【书山有路勤为径，学海无涯苦作舟】\n书山对学海、路对涯、勤对苦。\n对仗让语言整齐有韵律美。\n春联是对仗最常见的形式。' },
  ],
  examples: [
    { q: '"天对地"，那"雨"对什么？"大陆"对什么？', steps: ['《笠翁对韵》：天对地，雨对风，大陆对长空', '"雨"对"风"（自然现象对自然现象）', '"大陆"对"长空"'], tip: '同类对同类：天文对天文、地理对地理' },
  ],
  mistakes: ['认为上下联意思要一样——要相关而不同，一样就重复了'],
},

'cross-91': {
  sections: [
    { title: '文言词积累', body: '【走=跑；释=放下；株=树桩；耒=农具；冀=希望】\n"因释其耒而守株"：于是放下农具守在树桩旁。\n古今异义是文言学习第一关。' },
    { title: '译文与寓意', body: '全文：宋国有个耕田人，田里有树桩，兔子跑来撞死在桩上。他于是放下农具守桩等兔。\n寓意：把偶然当必然，一无所获；幸福靠劳动不靠侥幸。' },
  ],
  examples: [
    { q: '翻译"因释其耒而守株"，并指出两个关键字。', steps: ['因：于是；释：放下', '耒：农具；守株：守着树桩', '译文：于是放下农具，守在树桩旁（等兔子）'], tip: '逐字标注→连词成句→再顺一遍' },
  ],
  mistakes: ['"释"翻译成"解释"——文言语境里是"放下"'],
},

'cross-92': {
  sections: [
    { title: '意象是什么', body: '【融入了作者主观情感的客观物象 = 意象】\n月：思乡（举头望明月）；柳：离别（"柳"谐"留"）；雁：书信思念。\n意象是读诗的钥匙。' },
    { title: '月的意蕴', body: '明月千里寄相思——月是思乡团圆的共同符号。\n不同诗人笔下月又有多副面孔：李白的豪放月、苏轼的哲思月。\n"代表团"式读诗：把同类意象归堆比较。' },
  ],
  examples: [
    { q: '古人送别为什么折柳相赠？', steps: ['"柳"谐音"留"', '折柳表达挽留与不舍', '柳成为离别意象'], tip: '谐音寄托情思：柳=留，莲=怜' },
  ],
  mistakes: ['把意象当"比喻"——意象是"物+情"的融合，比喻只是一种修辞'],
},

'cross-114': {
  sections: [
    { title: '三幕结构', body: '【第一幕·建置（交代目标）；第二幕·对抗（冲突升级）；第三幕·解决（高潮与结局）】\n起承转合是中文传统的对应说法。\n"最黑暗时刻"常在第二幕结尾——为反弹蓄力。' },
    { title: '冲突推动情节', body: '【故事 = 人物 + 目标 + 障碍】\n没有冲突就没有故事：主角越想达成，障碍越大，张力越强。\n结尾要回应开头（伏笔回收）。' },
  ],
  examples: [
    { q: '用三幕结构给"学骑自行车"编个故事骨架。', steps: ['建置：我决定一周学会骑车', '对抗：摔倒、怕被笑、想放弃（最黑暗时刻）', '解决：爸爸扶一把后悄悄松手——我竟然自己骑起来了'], tip: '第二幕至少设两个障碍，故事才立得住' },
  ],
  mistakes: ['流水账当故事——没有冲突的"顺利经过"不构成情节'],
},

'cross-125': {
  sections: [
    { title: '炼字', body: '【反复推敲用哪个字更好——古人叫"炼字"】\n典故：贾岛"僧敲月下门"，韩愈建议用"敲"：静夜敲门声以声衬静，且显礼貌。\n"推敲"一词由此而来。' },
    { title: '一字之师', body: '【春风又绿江南岸的"绿"：形容词作动词，写活春风】\n王安石改过十多次（到、过、入、满……），最终选"绿"。\n炼字标准：是否让画面动起来、意境出得来。' },
  ],
  examples: [
    { q: '"僧敲月下门"的"敲"好在哪里？', steps: ['静夜敲门：轻微声响反衬夜晚的寂静', '敲门比推门礼貌，符合僧人身份', '有声音的画面比无声更生动——以声衬静'], tip: '赏析字词：义 → 境 → 情，三层递进' },
  ],
  mistakes: ['赏析只翻译字面——炼字题要答出"为什么这个字比别的字好"'],
},

'hb-01': {
  sections: [
    { title: '课文：《植物妈妈有办法》', body: '【蒲公英靠风（降落伞）、苍耳挂动物皮毛、豌豆晒干弹射】\n植物传播种子的三大法宝：风、动物、自身弹力。\n"孩子""旅行"是拟人写法，亲切生动。' },
    { title: '植物为什么想办法', body: '种子离母体远一些，才能获得更多阳光水分空间。\n这是植物繁衍扩散的生存智慧。\n观察身边的植物：柳絮、樱桃、凤仙花各用哪招？' },
  ],
  examples: [
    { q: '蒲公英和苍耳的"办法"有什么不同？', steps: ['蒲公英：种子有冠毛，像降落伞，乘风飞', '苍耳：果实带刺，挂住动物皮毛"搭车"', '一个靠风，一个靠动物'], tip: '答比较题：分别说 + 一句总结差异' },
  ],
  mistakes: ['认为椰子也是动物传播——椰子靠水流传播（能漂的海滩常见椰树）'],
},

'hb-08': {
  sections: [
    { title: '《从百草园到三味书屋》雪地捕鸟', body: '【作者：鲁迅，出自散文集《朝花夕拾》】\n捕鸟步骤：扫开雪→支起竹筛→撒些秕谷→系一条长绳→牵着看鸟走到底下→拉绳罩住。\n连续动词写出过程的条理与娴熟。' },
    { title: '动词的力量', body: '【扫、支、撒、系、牵、看、拉——七个动词一步不乱】\n准确的动词让读者"看见"整个过程。\n写作借鉴：写连续动作时，选准动词、按序排列。' },
  ],
  examples: [
    { q: '捕鸟片段中，"扫开一块雪"为什么用"扫"不用"擦"？', steps: ['扫：用工具快速清理积雪，露出地面', '擦：来回摩擦使干净，对象不是大片雪', '"扫"准确写出清理雪的动作'], tip: '比较近义动词：对象 + 方式 + 效果' },
  ],
  mistakes: ['以为是《故乡》里的情节——雪地捕鸟出自《从百草园到三味书屋》'],
},

// ---------- 英语 ----------
'cross-14': {
  sections: [
    { title: '单词速记：分主题', body: '【把单词按主题归类记：动物类 cat/dog/bird/fish】\n归类记忆比零散背高效——大脑喜欢"成串"。\n每类配图、配动作，多感官记得牢。' },
    { title: '看词反应训练', body: '闪卡训练：看单词 1 秒内说出中文意思。\n由慢到快，建立"见词知意"的自动反应。\n每天 5 分钟，比周末猛背 1 小时有效。' },
  ],
  examples: [
    { q: '把 cat、sun、dog、moon、bird 按主题分成两组。', steps: ['动物类：cat、dog、bird', '天体类：sun、moon', '同类事物一起记'], tip: '分组后自己造串句：The cat sees a bird.' },
  ],
  mistakes: ['按字母顺序死背——按主题和场景记更牢'],
},

'cross-15': {
  sections: [
    { title: '数字 1-10', body: '【one two three four five six seven eight nine ten】\n特别注意拼写的：three（thr）、eight（eigh）、nine。\n用手势边比边说，身体记忆最牢。' },
    { title: '13-19 的规律', body: '【-teen 结尾：thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen】\n注意特殊拼写：thirteen、fifteen（不是 threeteen/fiveteen）。\n整十是 -ty：twenty, thirty, forty。' },
  ],
  examples: [
    { q: '"十五"用英语怎么说？拼一拼。', steps: ['15 = fifteen', 'five → fif + teen', 'f-i-f-t-e-e-n'], tip: 'five 变 fifteen、twelve 变 twelve+two=t twenty，变化处最容易错' },
  ],
  mistakes: ['fifteen 拼成 fiveteen——five 要先变成 fif'],
},

'eng-03': {
  sections: [
    { title: '26 个字母', body: '【Aa Bb Cc … Zz 共 26 对，每对有大写和小写】\n顺序：字母歌是最快的记忆法。\n大写用于句首、人名、地名；小写用于一般单词。' },
    { title: '书写规范', body: '四线三格：大写占上两格，小写各有位置（a 占中格，b 占上两格）。\n字母笔顺要正确，先 habit 后速度。\nc C、p P 形状相似，注意大小写区别。' },
  ],
  examples: [
    { q: '写出 5 个元音字母（大写小写都要）。', steps: ['元音字母：A a、E e、I i、O o、U u', '其余 21 个是辅音字母', '元音是拼读的"骨架"'], tip: '记口诀：A E I O U，剩下都是辅音' },
  ],
  mistakes: ['把 c 的大写写成 C 的镜像——注意书写方向'],
},

'eng-04': {
  sections: [
    { title: '数字与 How many', body: '【How many + 复数名词…? 问数量】\nHow many apples? Three.\n回答可以直接说数字。' },
    { title: 'one 到 ten 的听与说', body: 'three 与 tree 发音相近：th 咬舌！\nsix 与 seven 开头都是 s，注意区分。\n报数游戏：one, two, three…轮流接龙。' },
  ],
  examples: [
    { q: '用 How many 提问："你有几本书？"（book → books）', steps: ['问数量用 How many', '名词用复数 books', 'How many books do you have?'], tip: 'How many 后面的名词必须加 s（复数）' },
  ],
  mistakes: ['How many book（漏 s）——可数名词复数不能忘'],
},

'eng-05': {
  sections: [
    { title: '颜色单词', body: '【red 红、blue 蓝、green 绿、yellow 黄、orange 橙、purple 紫、black 黑、white 白】\norange 既指橙色也指橙子——一词多义。\n配实物记忆最牢。' },
    { title: 'What color...? 句型', body: '【What color is it? — It is red.】\n问颜色固定用 What color。\n答句：It is / They are + 颜色。' },
  ],
  examples: [
    { q: '看图问答：天空是什么颜色？', steps: ['问：What color is the sky?', '答：It is blue.', 'It 指代 the sky'], tip: '问单样东西用 is；问 several things 用 are' },
  ],
  mistakes: ['How color（错）——问颜色固定 What color'],
},

'eng-06': {
  sections: [
    { title: '自我介绍', body: '【My name is…（名字）I am … years old.（年龄）I like…（爱好）】\n三句连起来就是一段完整自我介绍。\nI am 也可缩写成 I\'m。' },
    { title: 'like 的用法', body: '【I like + 名词 / doing】\nI like fish. / I like swimming.\n喜欢做某事常用 -ing 形式。' },
  ],
  examples: [
    { q: '把三句连成自我介绍：Lily、10 岁、喜欢画画。', steps: ['名字：My name is Lily.', '年龄：I am ten years old.', '爱好：I like drawing.', '连起来大声说一遍'], tip: '名字首字母大写：Lily 不是 lily' },
  ],
  mistakes: ['I am ten year old（year 漏 s）——years old 固定搭配'],
},

'eng-07': {
  sections: [
    { title: '问候与问答', body: '【What\'s your name? — My name is…；How are you? — I\'m fine, thank you.】\n初次见面：Nice to meet you! — Nice to meet you, too!\ntoo 放句尾表示"也"。' },
    { title: '问句家族', body: 'What\'s your name? 问姓名；How old are you? 问年龄；How are you? 问状态。\nWhat 问"什么"，How 问"怎样"。' },
  ],
  examples: [
    { q: '别人说 "Nice to meet you!"，你该怎么回答？', steps: ['这是见面问候', '回应要加 too（我也是）', 'Nice to meet you, too!'], tip: '问候要"礼尚往来"：别人问，你答+反问' },
  ],
  mistakes: ['用 Thank you 回应 Nice to meet you——谢谢用错场合'],
},

'eng-08': {
  sections: [
    { title: '星期的表达', body: '【Monday Tuesday Wednesday Thursday Friday Saturday Sunday】\n首字母必须大写。\n周末 = weekend（Saturday + Sunday）。' },
    { title: 'What day...? 句型', body: '【What day is it today? — It\'s Monday.】\n问星期用 What day。\n国际惯例 Sunday 是一周第一天，中国习惯 Monday 开始。' },
  ],
  examples: [
    { q: '翻译："星期六你做什么？"（do homework）', steps: ['问星期几做的事：What do you do on Saturday?', '回答：I do my homework.', '星期前用介词 on'], tip: 'on + 星期；at + 钟点——两个介词分清' },
  ],
  mistakes: ['星期小写（monday）——星期名首字母永远大写'],
},

'cross-58': {
  sections: [
    { title: '高频实物词', body: '【apple 苹果、book 书、pen 笔、bag 书包、cat 猫、dog 狗、sun 太阳】\n名词是句子的"砖块"，先攒名词。\n看物说词：扫视房间，见什么说什么。' },
    { title: 'a / an 的选择', body: '【元音音开头用 an：an apple；辅音音开头用 a：a book】\nan apple、an orange；a pen、a bag。\n看"发音"不看"字母"：an hour（h 不发音）。' },
  ],
  examples: [
    { q: '选 a 还是 an：___ apple、___ book、___ orange', steps: ['apple 元音音开头 → an apple', 'book 辅音音开头 → a book', 'orange 元音音开头 → an orange'], tip: '读出声判断：张口音（a e i o u 开头）用 an' },
  ],
  mistakes: ['见字母 u 就用 a uniform——u 发 /juː/ 辅音音，用 a'],
},

'cross-62': {
  sections: [
    { title: '彩虹七色', body: '【red 红橙 orange 黄 yellow 绿 green 蓝 blue 靛 indigo 紫 purple】\n彩虹外圈红、内圈紫。\n颜色 + 名词：red apple、blue sky（颜色在名词前）。' },
    { title: 'The sky is blue. 句型', body: '【主语 + is + 颜色：描述物体颜色】\nThe sky is blue. 天空是蓝色的。\n复数：The apples are red.（is 变 are）。' },
  ],
  examples: [
    { q: '翻译："彩虹是多彩的。"（rainbow）', steps: ['主语 the rainbow', '多彩的：colorful', 'The rainbow is colorful.'], tip: '先找主语和 be 动词，颜色/形容词放后面' },
  ],
  mistakes: ['说 blue the sky——英文语序是"颜色+名词"：the blue sky'],
},

'cross-93': {
  sections: [
    { title: '一般现在时作息', body: '【I get up at seven. 用动词原形描述日常】\n主语是 he/she/it 时动词加 s/es：He goes to school at eight.\n钟点前用 at。' },
    { title: '频率词', body: '【always 总是 > usually 通常 > often 常常 > sometimes 有时 > never 从不】\n频率词放在动词前：I always brush my teeth.\n用作息表练习：I get up / have breakfast / go to school。' },
  ],
  examples: [
    { q: '翻译："她每天七点起床。"', steps: ['主语 she → 动词加 s', '起床 get up → gets up', '七点 at seven', 'She gets up at seven every day.'], tip: '三单口诀：he/she/it，动词穿鞋（加 s）' },
  ],
  mistakes: ['She get up（漏 s）——三单动词必须加 s/es'],
},

'cross-113': {
  sections: [
    { title: '购物句型', body: '【How much is it? 问价格；I\'d like…, please. 表达想买】\nHow much 问"多少钱"；How many 问"多少个"。\nI\'d like = I would like，比 I want 更礼貌。' },
    { title: '礼貌用语', body: '【Here you are. 给你。— Thank you.】\nCan I help you? 店员招呼；I\'m just looking. 随便看看。\n购物对话：招呼→问价→决定→付款→道谢。' },
  ],
  examples: [
    { q: '排序购物对话：A. Here you are. B. How much is it? C. Can I help you? D. I\'d like a pen.', steps: ['店员先招呼：C', '顾客说出需求：D', '问价：B', '付款拿货：A'], tip: '对话排序找"谁先开口"和问答配对' },
  ],
  mistakes: ['问价用 How many——价格不可数，用 How much'],
},

'cross-123': {
  sections: [
    { title: '数字歌', body: '【One, two, three, four, five, …ten】\n倒着数是火箭发射倒数：Ten, nine, eight… one, lift off!\n唱歌+拍手，节奏帮助记忆。' },
    { title: '数字与数量对应', body: '伸出手指边数边说：one finger, two fingers…\n"几 + and + 几"：two and three is five.\n生活数学英语两不误。' },
  ],
  examples: [
    { q: '听口令做动作：Show me five!（用手势表示 5）', steps: ['听懂数字 five', '伸出五根手指', '可以进阶：Show me three and four!'], tip: 'TPR 全身反应法：听→做→说，记忆最深' },
  ],
  mistakes: ['four 与 five 混读——four 是 /fɔː/，five 是 /faɪv/'],
},

'cross-124': {
  sections: [
    { title: '家庭成员', body: '【father 爸爸 mother 妈妈 brother 兄弟 sister 姐妹 grandfather 爷爷/外公 grandmother 奶奶/外婆】\ngrand- 前缀表示"上一辈"。\ncousin 表兄弟姐妹（不分父母系）。' },
    { title: 'This is… 介绍句型', body: '【This is my mother. 这是我妈妈】\n介绍身边的人用 This is + 称谓。\n回答介绍：Nice to meet you!' },
  ],
  examples: [
    { q: '看全家福介绍爷爷，该说哪句？', steps: ['介绍句型：This is my…', '爷爷：grandfather', 'This is my grandfather.'], tip: '介绍谁就 This is + 谁' },
  ],
  mistakes: ['说 I am grandfather——介绍别人用 This is，不是 I am'],
},

'hb-03': {
  sections: [
    { title: '身体部位', body: '【head 头 nose 鼻子 mouth 嘴 eyes 眼睛 ears 耳朵 arms 手臂 hands 手 legs 腿 knees 膝盖 feet 脚】\n成对部位用复数：eyes、ears、knees、feet。\nfoot 的复数是 feet（不规则）。' },
    { title: 'Touch your… 祈使句', body: '【Touch your head! 摸摸你的头】\n祈使句以动词开头，省略主语 you。\n边说边做，反应游戏最好玩。' },
  ],
  examples: [
    { q: '"摸摸你的膝盖"怎么说？', steps: ['摸：Touch your…', '膝盖（两只）：knees', 'Touch your knees!'], tip: '身体部位歌：Head, shoulders, knees and toes!' },
  ],
  mistakes: ['Touch your knee 说成 Touch your knee`s——两只膝盖用复数 knees'],
},

'hb-10': {
  sections: [
    { title: 'What\'s the matter? 问诊', body: '【What\'s the matter? 怎么了 — I have a headache. 我头疼】\nhave a + 病症：headache 头疼、fever 发烧、cold 感冒。\nstomachache 胃疼（拼写长，多写几遍）。' },
    { title: 'should 提建议', body: '【You should drink more water. 你该多喝水】\nshould + 动词原形；否定 shouldn\'t。\nYou shouldn\'t stay up late. 你不该熬夜。' },
  ],
  examples: [
    { q: '同学牙疼，给他两条建议。', steps: ['牙疼：I have a toothache.', '建议1：You should see a dentist.', '建议2：You shouldn\'t eat too much candy.'], tip: 'should 后面永远接动词原形' },
  ],
  mistakes: ['You should to drink——should 后不加 to'],
},

};

let changed = 0;
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  const p = path.join(D, f);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (T[j.id]) { j.teach = T[j.id]; fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8'); changed++; }
}
console.log(`语文+英语讲解写入 ${changed} 课`);
