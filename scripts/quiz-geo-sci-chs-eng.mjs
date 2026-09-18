import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第30轮·题库扩容·地理 10 + 科学 12 + 语文 20 + 英语 16 课 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const Q = {

// ---------- 地理 ----------
'cross-16': [
  { q: '地球自转产生的现象是？', options: ['昼夜交替', '四季变化', '月相', '极光'], answer: 0, explain: '自转→昼夜交替；公转+地轴倾斜→四季' },
  { q: '当地球公转到远日点（7 月初）时，北半球是？', options: ['夏季（距离不是主因）', '冬季', '春秋', '无法确定'], answer: 0, explain: '近日点反而是 1 月（冬季）：四季由地轴倾斜决定，不是距离' },
  { q: '南半球 12 月是什么季节？', options: ['夏季', '冬季', '春季', '秋季'], answer: 0, explain: '12 月太阳直射南回归线，南半球是夏季' },
],

'cross-17': [
  { q: '回归线的纬度是？', options: ['23.5°', '66.5°', '30°', '45°'], answer: 0, explain: '南北回归线 23.5°，极圈 66.5°' },
  { q: '一年中有极昼极夜现象的地区是？', options: ['寒带（极圈以内）', '热带', '温带', '赤道'], answer: 0, explain: '极圈内夏季极昼、冬季极夜' },
  { q: '我国大部分地区位于五带中的？', options: ['北温带', '热带', '北寒带', '南温带'], answer: 0, explain: '以中纬度北温带为主，四季分明' },
],

'geo-03': [
  { q: '地图上判断方向，在没有指向标时通常？', options: ['上北下南左西右东', '上南下北', '随意判断', '上东下西'], answer: 0, explain: '无指向标和经纬网时按"上北下南左西右东"' },
  { q: '有经纬网的地图上，经线指示什么方向？', options: ['南北', '东西', '东北', '无法确定'], answer: 0, explain: '经线指示南北，纬线指示东西' },
  { q: '面对北极星的方向是？', options: ['正北', '正南', '正东', '正西'], answer: 0, explain: '北极星基本在地轴北端的延长线上，指向正北' },
],

'geo-04': [
  { q: '等高线图上闭合圈数值从外到内递增，该地形是？', options: ['山顶', '洼地', '山谷', '山脊'], answer: 0, explain: '越往里越高是山顶（示坡线向内则是洼地）' },
  { q: '等高线重叠的地方表示？', options: ['峭壁（陡崖）', '平原', '盆地', '河谷'], answer: 0, explain: '多条等高线重合 → 坡度接近垂直的陡崖' },
  { q: '攀岩爱好者应选择等高线怎样的区域？', options: ['密集区（坡陡）', '稀疏区', '重叠闭合区都不行', '任意'], answer: 0, explain: '等高线密集坡陡，适合攀岩挑战' },
],

'geo-05': [
  { q: '中时区（零时区）的中央经线是？', options: ['0° 经线', '180°', '120°E', '20°W'], answer: 0, explain: '本初子午线（0°）是零时区的中央经线' },
  { q: '东八区和西五区相差几小时？', options: ['13 小时', '3 小时', '8 小时', '5 小时'], answer: 0, explain: '8 + 5 = 13 个时区，每区差 1 小时' },
  { q: '上海比伦敦时间早 8 小时，当伦敦是 12 月 31 日 20 点时，上海是？', options: ['1 月 1 日 4 点', '12 月 31 日 12 点', '1 月 1 日 20 点', '12 月 30 日 16 点'], answer: 0, explain: '20 + 8 = 28 → 24 点进位：1 月 1 日 4 点' },
],

'cross-63': [
  { q: '"今天下午有雷阵雨"描述的是？', options: ['天气', '气候', '气温', '降水'], answer: 0, explain: '短时间的阴晴风雨是天气' },
  { q: '天气预报中 ☔ 符号表示？', options: ['有雨', '晴天', '下雪', '大风'], answer: 0, explain: '伞 = 降雨' },
  { q: '下列描述属于气候的是？', options: ['昆明四季如春', '明天大风降温', '今天晴', '刚才打雷了'], answer: 0, explain: '多年的平均状况才是气候' },
],

'cross-73': [
  { q: '自西向东穿越日界线，日期要？', options: ['减一天', '加一天', '不变', '加两小时'], answer: 0, explain: '日界线西侧比东侧早一天：从西过到东要减一天' },
  { q: '东十二区和西十二区的钟点？', options: ['相同（只差日期）', '相差 24 小时', '相差 1 小时', '无法比较'], answer: 0, explain: '两区共用同一时刻，日期相差一天' },
  { q: '北京（东八区）20 点对应纽约（西五区）的？', options: ['7 点', '9 点', '20 点', '12 点'], answer: 0, explain: '20 − 13 = 7 点（同一天）' },
],

'cross-95': [
  { q: '等高线稀疏表示？', options: ['坡缓', '坡陡', '平原一定', '有河流'], answer: 0, explain: '疏缓密陡：稀疏说明等高度的水平距离长' },
  { q: '盘山公路修成"之"字形是为了？', options: ['拉长路程减小坡度', '好看', '绕开动物', '省油'], answer: 0, explain: '斜穿等高线延长路线，把陡坡分成缓坡' },
  { q: '水库大坝一般选建在？', options: ['等高线密集的峡谷口', '山顶', '平原中央', '任意河段'], answer: 0, explain: '峡谷口工程量小、蓄水区域大' },
],

'hb-11': [
  { q: '我国地势的特点是？', options: ['西高东低呈阶梯状', '东高西低', '中间高四周低', '平坦'], answer: 0, explain: '三级阶梯自西向东降低' },
  { q: '二三级阶梯的分界山脉是？', options: ['大兴安岭-太行山-巫山-雪峰山', '昆仑山-祁连山', '天山', '秦岭'], answer: 0, explain: '一二级：昆仑山-祁连山-横断山；二三级：大兴安岭-太行山-巫山-雪峰山' },
  { q: '阶梯交界处水能资源丰富的原因是？', options: ['落差大水流急', '降水多', '河面宽', '海拔高'], answer: 0, explain: '落差大 → 水流的势能可转化为电能' },
],

'hb-16': [
  { q: '大气对太阳辐射（短波）和地面辐射（长波）的态度是？', options: ['短波易透过、长波易吸收', '都吸收', '都不吸收', '只吸收短波'], answer: 0, explain: '"太阳穿大气、大气捂地面"——温室效应的原理' },
  { q: '大气的直接热源是？', options: ['地面长波辐射', '太阳辐射', '月球', '地核'], answer: 0, explain: '大气主要吸收地面辐射升温（对流层）' },
  { q: '多云的夜晚比晴朗夜晚暖和，因为？', options: ['云增强了大气逆辐射', '云会发热', '云挡住了风', '白天更热'], answer: 0, explain: '云吸收地面辐射多，逆辐射还给地面的热量多' },
],

// ---------- 科学 ----------
'cross-04': [
  { q: '太阳系中距离太阳最近的行星是？', options: ['水星', '金星', '地球', '火星'], answer: 0, explain: '顺序：水金地火木土天海' },
  { q: '太阳系中体积最大的行星是？', options: ['木星', '地球', '土星', '海王星'], answer: 0, explain: '木星是巨行星，体积约为地球 1300 倍' },
  { q: '地球公转一圈的时间是？', options: ['约 365 天（一年）', '24 小时', '一个月', '12 小时'], answer: 0, explain: '公转一年，自转一天' },
],

'cross-35': [
  { q: '影子形成的原理是？', options: ['光沿直线传播被遮挡', '光的反射', '光的折射', '光的色散'], answer: 0, explain: '不透明体挡住直线传播的光形成影' },
  { q: '一天中影子最短的时刻约是？', options: ['正午', '清晨', '傍晚', '午夜'], answer: 0, explain: '太阳高度角最大时影子最短' },
  { q: '古代利用影子计时的工具叫？', options: ['日晷', '沙漏', '水钟', '浑天仪'], answer: 0, explain: '日晷靠晷针影子指向刻度计时' },
],

'cross-36': [
  { q: '把条形磁铁从中间锯断，得到？', options: ['两根各有 N、S 极的磁铁', '单独的 N 极和 S 极', '普通铁块', '磁性消失'], answer: 0, explain: '磁极不可分离：每段仍是完整磁体' },
  { q: '磁铁上磁性最强的部位是？', options: ['两极', '中间', '均匀分布', '表面全部'], answer: 0, explain: '磁极处磁性最强，中间最弱' },
  { q: '指南针能指南北是因为？', options: ['地球是个大磁体', '有电池', '受太阳吸引', '风的吹动'], answer: 0, explain: '地磁场对磁针的作用' },
],

'cross-37': [
  { q: '减小摩擦的方法是？', options: ['加润滑油', '增大压力', '使表面粗糙', '增大接触面'], answer: 0, explain: '润滑油使接触面分离，减小摩擦' },
  { q: '鞋底做花纹是为了？', options: ['增大摩擦防滑', '美观', '减小摩擦', '省材料'], answer: 0, explain: '增大接触面粗糙程度 → 摩擦增大行走稳' },
  { q: '自行车轴承用滚动代替滑动是为了？', options: ['减小摩擦', '增大摩擦', '美观', '增加重量'], answer: 0, explain: '滚动摩擦远小于滑动摩擦' },
],

'cross-38': [
  { q: '天气预报显示 ❄，应该准备？', options: ['保暖衣物', '雨伞', '防晒霜', '风扇'], answer: 0, explain: '❄ 是下雪，注意保暖防滑' },
  { q: '下列天气适合晒被子的是？', options: ['晴天 ☀', '雨天 ☔', '雾天 🌫', '雷雨 ⛈'], answer: 0, explain: '晴天干燥阳光足' },
  { q: '雾天出行要注意？', options: ['慢行开启雾灯', '开快车', '关窗睡觉', '戴墨镜'], answer: 0, explain: '能见度低，安全第一' },
],

'cross-39': [
  { q: '主要供能的营养素是？', options: ['糖类', '维生素', '水', '膳食纤维'], answer: 0, explain: '糖类是供能主力（米饭面条）' },
  { q: '建造和修复身体组织的原料是？', options: ['蛋白质', '糖类', '脂肪', '维生素'], answer: 0, explain: '肉蛋奶豆的蛋白质是"建筑材料"' },
  { q: '蔬菜水果主要提供？', options: ['维生素和矿物质', '蛋白质', '脂肪', '糖类'], answer: 0, explain: '维生素是身体调节剂' },
],

'cross-59': [
  { q: '科学观察记录应该？', options: ['如实记录看到的细节', '凭印象写', '只写好看的', '抄同学的'], answer: 0, explain: '客观、如实、有细节是科学的起点' },
  { q: '描述一片叶子"挺好看的"，问题在于？', options: ['不可检验不具体', '太短', '太长', '有错别字'], answer: 0, explain: '科学描述要具体可检验（颜色、形状、叶脉）' },
  { q: '测量叶长应该用？', options: ['直尺', '手拃', '目测', '称重'], answer: 0, explain: '量化观察用合适的测量工具' },
],

'cross-115': [
  { q: '使水循环不断进行的能量来自？', options: ['太阳', '月亮', '风', '电'], answer: 0, explain: '太阳提供蒸发所需的能量' },
  { q: '水蒸气变成小水珠的过程叫？', options: ['凝结', '蒸发', '融化', '升华'], answer: 0, explain: '气→液是凝结（云的形成）' },
  { q: '地球上的水绝大部分是？', options: ['海水（咸水）', '河水', '冰川', '地下水'], answer: 0, explain: '97.5% 是海水，淡水仅约 2.5%' },
],

'cross-116': [
  { q: '磁铁能吸引的物体是？', options: ['铁钉', '铜片', '铝箔', '木块'], answer: 0, explain: '磁铁只吸引铁钴镍等铁磁性物质' },
  { q: '磁悬浮列车"浮"起来利用了？', options: ['同名磁极相斥', '重力', '空气浮力', '静电'], answer: 0, explain: '轨道与车身磁极同名相斥托起车身' },
  { q: '磁力随距离增大而？', options: ['迅速减弱', '增强', '不变', '消失后恢复'], answer: 0, explain: '距离是磁力的"衰减器"' },
],

'cross-127': [
  { q: '敲响的音叉插入水中水花四溅，说明？', options: ['音叉在振动', '水很浅', '音叉很重', '水会动'], answer: 0, explain: '把振动"可视化"：发声体在振动' },
  { q: '真空罩里的闹钟抽气后声音变小直至听不见，说明？', options: ['真空不能传声', '闹钟坏了', '声音变小了', '耳朵问题'], answer: 0, explain: '传声需要介质，抽走空气就没介质' },
  { q: '宇航员太空舱外交流靠？', options: ['无线电（电磁波）', '直接喊话', '手势', '绳子传声'], answer: 0, explain: '电磁波可在真空中传播，声音不能' },
],

'cross-128': [
  { q: '影子的形成说明光在同一介质中？', options: ['沿直线传播', '会转弯', '速度无限', '有色'], answer: 0, explain: '直线传播被挡形成影子' },
  { q: '小孔成像的像是什么样的？', options: ['倒立的实像', '正立的虚像', '放大的正像', '没有像'], answer: 0, explain: '光线交叉穿过小孔，上下颠倒' },
  { q: '光源移远，同一物体的影子会？', options: ['变小', '变大', '不变', '消失'], answer: 0, explain: '光源远光线更接近平行，影子边缘收缩变小' },
],

'hb-04': [
  { q: '土壤中让土壤肥沃的物质是？', options: ['腐殖质', '砂粒', '黏粒', '水分'], answer: 0, explain: '动植物残体分解成的腐殖质是天然肥料' },
  { q: '渗水最快、保水最差的土壤是？', options: ['砂土', '黏土', '壤土', '都一样'], answer: 0, explain: '砂粒大缝隙大，水很快漏走' },
  { q: '最适合种菜（既保水又透气）的土壤是？', options: ['壤土', '砂土', '黏土', '石块地'], answer: 0, explain: '壤土沙黏适中 + 腐殖质多' },
],

// ---------- 语文 ----------
'cross-01': [
  { q: '"举头望明月"的"举"意思是？', options: ['抬', '放', '指', '举起来扔'], answer: 0, explain: '举头 = 抬起头' },
  { q: '《静夜思》表达了诗人怎样的感情？', options: ['思念故乡', '喜悦', '愤怒', '恐惧'], answer: 0, explain: '望月思乡，"思故乡"点明主题' },
  { q: '"疑是地上霜"把月光比作什么？', options: ['霜', '雪', '水', '盐'], answer: 0, explain: '霜写出了月光的洁白清冷' },
],

'cross-19': [
  { q: '"画蛇添足"出自哪部书？', options: ['《战国策》', '《论语》', '《史记》', '《西游记》'], answer: 0, explain: '出自《战国策·齐策》' },
  { q: '与"画蛇添足"意思相近的成语是？', options: ['多此一举', '锦上添花', '精益求精', '雪中送炭'], answer: 0, explain: '都表示做了不必要的事' },
  { q: '故事中先画完蛇的人为什么输了？', options: ['多此一举给蛇画脚', '画得太慢', '画得不像', '违反规则'], answer: 0, explain: '添上的脚让"蛇"不再是蛇' },
],

'cross-40': [
  { q: '"红掌拨清波"的"拨"写出了什么？', options: ['鹅划水的动作', '水的深度', '鹅的叫声', '毛的颜色'], answer: 0, explain: '拨：划动，写活鹅游泳的姿态' },
  { q: '《咏鹅》中没有出现的颜色是？', options: ['黑', '白', '绿', '红'], answer: 0, explain: '白毛、绿水、红掌——无黑色' },
  { q: '"曲项向天歌"写的是鹅的哪个部位？', options: ['脖颈', '脚掌', '翅膀', '尾巴'], answer: 0, explain: '曲项 = 弯着脖子' },
],

'cross-41': [
  { q: '"处处闻啼鸟"的"闻"意思是？', options: ['听见', '闻到', '看见', '打听'], answer: 0, explain: '闻鸟啼 = 听见鸟叫' },
  { q: '"花落知多少"表达了诗人什么情感？', options: ['惜春（担心花被雨打落）', '开心', '愤怒', '好奇'], answer: 0, explain: '由昨夜风雨联想落花，含蓄表达怜惜' },
  { q: '《春晓》的作者是？', options: ['孟浩然', '李白', '王维', '杜甫'], answer: 0, explain: '孟浩然，唐代山水田园诗人' },
],

'cross-42': [
  { q: '"粒粒皆辛苦"中的"皆"意思是？', options: ['都', '很', '才', '只'], answer: 0, explain: '皆 = 都：每一粒都辛苦' },
  { q: '"汗滴禾下土"描绘的是？', options: ['农民烈日下劳作的辛苦', '下雨天', '收获的喜悦', '播种'], answer: 0, explain: '正午锄地、汗水入土，写劳动艰辛' },
  { q: '这首诗给我们的启示是？', options: ['珍惜粮食', '多吃米饭', '不怕热', '早点吃饭'], answer: 0, explain: '体会辛苦 → 珍惜粮食' },
],

'cross-43': [
  { q: '"遥看瀑布挂前川"的"挂"字好在哪里？', options: ['化动为静，写出瀑布如白练悬垂', '说明很重', '表示挂着东西', '凑字数'], answer: 0, explain: '化动为静是炼字经典' },
  { q: '"疑是银河落九天"运用的修辞是？', options: ['比喻和夸张', '拟人', '排比', '设问'], answer: 0, explain: '把瀑布比作银河 + 三千尺夸大' },
  { q: '《望庐山瀑布》写的山在哪个省？', options: ['江西', '安徽', '浙江', '湖南'], answer: 0, explain: '庐山在江西省九江市' },
],

'cross-44': [
  { q: '"兔走触株"中的"走"应译为？', options: ['跑', '走开', '散步', '逃跑'], answer: 0, explain: '文言"走"是跑，"行"才是走' },
  { q: '"因释其耒而守株"的"释"意思是？', options: ['放下', '解释', '释放', '喜欢'], answer: 0, explain: '释 = 放下（耒是农具）' },
  { q: '守株待兔的人被宋国人笑话，因为他？', options: ['把偶然当必然', '太懒', '运气差', '不会种田'], answer: 0, explain: '偶然事件不会天天发生' },
],

'cross-45': [
  { q: '刻舟求剑的人错在？', options: ['船动了他没考虑（参照物变了）', '剑太重', '记号刻错了地方', '水太深'], answer: 0, explain: '船在动剑没动，记号失效' },
  { q: '这个成语讽刺什么样的人？', options: ['墨守成规不知变通', '认真仔细', '乐于助人', '勇敢的人'], answer: 0, explain: '情况变了方法不变' },
  { q: '"舟已行矣，而剑不行"说明？', options: ['运动和静止是相对的', '船很慢', '剑会浮', '水在流'], answer: 0, explain: '以岸为参照船动剑静——参照物不同结论不同' },
],

'cross-46': [
  { q: '掩耳盗铃者的错误逻辑是？', options: ['以为自己听不见别人也听不见', '铃不响', '耳朵不好', '跑得快'], answer: 0, explain: '主观掩盖不了客观事实' },
  { q: '"掩耳盗铃"常用来形容？', options: ['自欺欺人', '聪明机智', '胆大心细', '勤劳'], answer: 0, explain: '自己骗自己' },
  { q: '正确的做法是？', options: ['承认事实不去偷铃', '更大声捂耳朵', '跑快点', '找帮手'], answer: 0, explain: '正视现实 + 不做坏事' },
],

'cross-47': [
  { q: '"月亮笑弯了腰"是什么修辞？', options: ['拟人', '比喻', '排比', '对偶'], answer: 0, explain: '把月亮当人来写（笑、弯腰）' },
  { q: '"远看是山，近看是石，细看是画"是什么修辞？', options: ['排比', '拟人', '比喻', '夸张'], answer: 0, explain: '三个结构相似的句并列' },
  { q: '"忽如一夜春风来，千树万树梨花开"把雪比作梨花，是？', options: ['比喻', '拟人', '排比', '设问'], answer: 0, explain: '本体雪、喻体梨花，有比喻词意境' },
],

'cross-48': [
  { q: '句末用问号的句子是？', options: ['你去哪儿', '今天真热', '我吃饭了', '快来看'], answer: 0, explain: '疑问语气用问号（前两项也含语气词判断：热是感叹）' },
  { q: '"多么美丽的花园呀"句末应用？', options: ['感叹号！', '句号。', '问号？', '冒号：'], answer: 0, explain: '强烈感情用感叹号' },
  { q: '妈妈说："快来吃饭。"中标点使用正确的是？', options: ['先冒号后引号', '先句号后冒号', '只用逗号', '不用标点'], answer: 0, explain: '提示语在前：冒号 + 引号' },
],

'cross-49': [
  { q: '"江、河、湖、海"的偏旁是？', options: ['三点水', '木字旁', '草字头', '提手旁'], answer: 0, explain: '氵表示与水有关' },
  { q: '"烧、烤、炒、灯"的共同偏旁说明与什么有关？', options: ['火', '水', '山', '人'], answer: 0, explain: '火字旁（灯为火字底）都与热、光有关' },
  { q: '遇到不认识的字，可先用哪种查字法？', options: ['部首查字法', '拼音查字法', '笔画查字法', '问别人'], answer: 0, explain: '不知读音时按部首查' },
],

'cross-50': [
  { q: '"还"在"归还"中读？', options: ['huán', 'hái', 'hài', 'huàn?（同 huán）'], answer: 0, explain: '归还 huán；还有 hái' },
  { q: '"音乐"的"乐"读？', options: ['yuè', 'lè', 'yuě', 'liàng'], answer: 0, explain: '音乐 yuè；快乐 lè' },
  { q: '"背着书包"的"背"读？', options: ['bēi', 'bèi', 'bái', 'péi'], answer: 0, explain: '背东西 bēi（动词）；后背 bèi（名词）' },
],

'cross-51': [
  { q: '"天对地"出自？', options: ['《笠翁对韵》', '《三字经》', '《千字文》', '《弟子规》'], answer: 0, explain: '李渔《笠翁对韵》是属对启蒙' },
  { q: '对联"书山有路勤为径"的下句是？', options: ['学海无涯苦作舟', '大海无边天作岸', '高山流水觅知音', '春风又绿江南岸'], answer: 0, explain: '经典励志对：书山/学海、勤/苦相对' },
  { q: '对联上联和下联的字数必须？', options: ['相等', '上多下少', '随意', '差一个'], answer: 0, explain: '字数相等是对联的基本要求' },
],

'cross-91': [
  { q: '"因释其耒而守株，冀复得兔"的"冀"意思是？', options: ['希望', '翅膀', '已经', '失望'], answer: 0, explain: '冀 = 希望（他希望再捡到兔子）' },
  { q: '"身为宋国笑"说明？', options: ['他被全国人嘲笑', '他成了英雄', '宋国灭亡', '他离开宋国'], answer: 0, explain: '被动的"为…笑" = 被…嘲笑' },
  { q: '《守株待兔》给我们的道理是？', options: ['不能靠侥幸，要靠劳动', '兔子跑得快', '树桩有用', '种田辛苦'], answer: 0, explain: '把偶然当必然注定落空' },
],

'cross-92': [
  { q: '"海上生明月，天涯共此时"中月的意象是？', options: ['思念远人', '战争', '丰收', '欢庆'], answer: 0, explain: '明月千里寄相思' },
  { q: '古诗中"柳"常与什么情感相关？', options: ['离别（柳谐音留）', '丰收', '战斗', '睡眠'], answer: 0, explain: '折柳赠别是千年习俗' },
  { q: '"意象"是指？', options: ['融入主观情感的客观物象', '诗人的想象', '修辞手法', '诗的题目'], answer: 0, explain: '意象 = 物象 + 情感' },
],

'cross-114': [
  { q: '三幕结构中的第二幕主要是？', options: ['对抗（冲突不断升级）', '交代背景', '大团圆结局', '抒情'], answer: 0, explain: '第二幕是"对抗"，冲突推动情节' },
  { q: '"最黑暗时刻"通常出现在？', options: ['第二幕结尾（高潮之前）', '故事开头', '中间', '结局之后'], answer: 0, explain: '至暗时刻为第三幕反弹蓄力' },
  { q: '推动故事发展的核心动力是？', options: ['冲突（障碍与挑战）', '环境描写', '辞藻', '篇幅'], answer: 0, explain: '没有冲突就没有故事' },
],

'cross-125': [
  { q: '"推敲"典故涉及哪两位诗人？', options: ['贾岛和韩愈', '李白和杜甫', '王维和孟浩然', '白居易和元稹'], answer: 0, explain: '贾岛作诗遇韩愈，韩愈建议用"敲"' },
  { q: '"春风又绿江南岸"的"绿"妙在？', options: ['形容词作动词，写活春风', '笔画少', '颜色鲜艳', '押韵'], answer: 0, explain: '绿 = 吹绿了，画面与生机全出' },
  { q: '炼字的关键标准是？', options: ['是否最传神地表达意境', '是否生僻', '是否押韵', '字数多少'], answer: 0, explain: '好字让画面动起来' },
],

'hb-01': [
  { q: '蒲公英传播种子靠？', options: ['风（冠毛像降落伞）', '水', '动物皮毛', '弹射'], answer: 0, explain: '蒲公英种子有冠毛乘风飞行' },
  { q: '苍耳种子的"旅行"方式是？', options: ['挂动物皮毛', '随风', '水流', '弹射'], answer: 0, explain: '带刺的苍耳挂住动物"搭车"' },
  { q: '豌豆传播种子的方式是？', options: ['豆荚晒干炸开弹射', '风', '水', '鸟吃'], answer: 0, explain: '干豆荚收缩"啪"地弹开' },
],

'hb-08': [
  { q: '雪地捕鸟片段出自鲁迅的哪篇文章？', options: ['《从百草园到三味书屋》', '《故乡》', '《社戏》', '《藤野先生》'], answer: 0, explain: '出自散文集《朝花夕拾》' },
  { q: '捕鸟的正确顺序是？', options: ['扫雪→支筛→撒谷→拉绳', '撒谷→扫雪→支筛', '支筛→扫雪→撒谷', '拉绳→支筛→撒谷'], answer: 0, explain: '扫开雪露出空地，支起筛撒秕谷诱鸟，鸟进下拉绳' },
  { q: '这段文字连用多个动词的作用是？', options: ['准确写出捕鸟的条理与娴熟', '凑字数', '显得啰嗦', '押韵'], answer: 0, explain: '动词精准让过程如在眼前' },
],

// ---------- 英语 ----------
'cross-14': [
  { q: '"cat"是什么意思？', options: ['猫', '狗', '帽子', '汽车'], answer: 0, explain: 'cat = 猫 🐱' },
  { q: '与 "dog" 同类的词是？', options: ['bird', 'book', 'pen', 'sun'], answer: 0, explain: 'dog（狗）和 bird（鸟）都是动物' },
  { q: '"apple" 和哪个词同类？', options: ['banana', 'desk', 'chair', 'bag'], answer: 0, explain: 'apple（苹果）和 banana（香蕉）都是水果' },
],

'cross-15': [
  { q: 'six 后面的数字是？', options: ['seven', 'five', 'eight', 'nine'], answer: 0, explain: '顺序 six → seven → eight' },
  { q: 'eight 的中文是？', options: ['八', '三', '十八', '八十'], answer: 0, explain: 'eight = 8；eighteen = 18' },
  { q: '"十三"的英文是？', options: ['thirteen', 'threeteen', 'thirty', 'three'], answer: 0, explain: 'three → thirteen（30 是 thirty）' },
],

'eng-03': [
  { q: '字母表一共有几个字母？', options: ['26 个', '24 个', '28 个', '30 个'], answer: 0, explain: '26 个字母（Aa~Zz），5 个元音 21 个辅音' },
  { q: '下列哪个是元音字母？', options: ['E', 'B', 'D', 'F'], answer: 0, explain: '元音字母：A E I O U' },
  { q: '大写字母用于？', options: ['句首和人名', '所有单词', '句中', '随意'], answer: 0, explain: '句首、人名、地名、国家名等要大写' },
],

'eng-04': [
  { q: 'How many books do you have? 正确回答（3 本）？', options: ['Three.', 'It is three book.', 'Yes, I do.', 'I have book.'], answer: 0, explain: 'How many 问数量，直接用数字回答' },
  { q: 'nine 的前一个数字是？', options: ['eight', 'ten', 'seven', 'five'], answer: 0, explain: 'eight (8) → nine (9) → ten (10)' },
  { q: '"你有几支铅笔？"英语是？', options: ['How many pencils do you have?', 'How much pencils?', 'What pencils?', 'How old pencils?'], answer: 0, explain: '可数名词问数量用 How many + 复数' },
],

'eng-05': [
  { q: '香蕉的颜色用英语说是？', options: ['yellow', 'red', 'blue', 'black'], answer: 0, explain: '香蕉是黄色的：banana is yellow' },
  { q: 'What color is the grass? 答：？', options: ['It is green.', 'It is blue.', 'It is red.', 'It is big.'], answer: 0, explain: '草是绿色的' },
  { q: '蓝天用英语说是？', options: ['blue sky', 'sky blue color', 'blue the sky', 'the sky blue'], answer: 0, explain: '形容词在名词前：blue sky' },
],

'eng-06': [
  { q: '介绍自己的名字用？', options: ['My name is…', 'Your name is…', 'I name is…', 'Name is my…'], answer: 0, explain: 'My name is + 名字' },
  { q: '表达"我十岁了"用？', options: ['I am ten years old.', 'I have ten years.', 'My age ten.', 'I is ten.'], answer: 0, explain: 'I am + 数字 + years old' },
  { q: '说"我喜欢游泳"用？', options: ['I like swimming.', 'I like swim.', 'I likes swimming.', 'Me like swim.'], answer: 0, explain: 'like + doing（动词 -ing 形式）' },
],

'eng-07': [
  { q: '别人问 How are you? 你应回答？', options: ["I'm fine, thank you.", 'I am nine.', 'My name is Li.', 'How do you do?'], answer: 0, explain: 'How are you 问状态（你好吗）' },
  { q: '初次见面应说？', options: ['Nice to meet you!', 'How old are you?', 'Goodbye!', 'See you.'], answer: 0, explain: '初次见面问好用 Nice to meet you' },
  { q: 'What\'s your name? 中的 What\'s 是什么缩写？', options: ['What is', 'What are', 'What does', 'What has'], answer: 0, explain: "What's = What is" },
],

'eng-08': [
  { q: '周末（周六和周日）的英语是？', options: ['weekend', 'weekday', 'Sunday', 'Monday'], answer: 0, explain: 'weekend = 周末（week 末尾）' },
  { q: 'What day is it today? 问的是？', options: ['星期几', '日期', '天气', '时间'], answer: 0, explain: 'What day 问星期；问日期用 What is the date' },
  { q: '星期几的首字母要？', options: ['大写', '小写', '斜体', '加粗'], answer: 0, explain: 'Monday、Sunday 等星期名首字母大写' },
],

'cross-58': [
  { q: 'an apple 中用 an 是因为？', options: ['apple 以元音音开头', 'apple 是水果', '单数', '复数'], answer: 0, explain: '元音音开头用 an：an apple / an orange' },
  { q: '一 a book 还是 an book？', options: ['a book', 'an book', 'the book 都行', 'books'], answer: 0, explain: 'book 以辅音音 /b/ 开头，用 a' },
  { q: '"书包"的英语是？', options: ['bag', 'bad', 'big', 'bed'], answer: 0, explain: 'bag 书包；bad 坏的；big 大的；bed 床' },
],

'cross-62': [
  { q: '彩虹中 purple 是什么颜色？', options: ['紫色', '红色', '黄色', '绿色'], answer: 0, explain: 'purple = 紫，红橙黄绿蓝靛紫的最后一色' },
  { q: 'The sky is blue. 中 blue 是？', options: ['颜色形容词', '名词（天空）', '动词', '代词'], answer: 0, explain: 'be 动词后接形容词作表语' },
  { q: '复数句 The apples ___ red. 填？', options: ['are', 'is', 'am', 'be'], answer: 0, explain: '复数主语用 are' },
],

'cross-93': [
  { q: 'He ___ to school at seven. 填？', options: ['goes', 'go', 'going', 'went'], answer: 0, explain: '三单 he 的一般现在时动词加 es' },
  { q: '"在七点"用英语说是？', options: ['at seven', 'on seven', 'in seven', 'to seven'], answer: 0, explain: '钟点前用介词 at' },
  { q: 'always, usually, often, sometimes, never 中频率最高的是？', options: ['always', 'sometimes', 'never', 'often'], answer: 0, explain: 'always 总是（100%）> usually > often > sometimes > never（0%）' },
],

'cross-113': [
  { q: '顾客想买文具，礼貌的表达是？', options: ["I'd like a pen, please.", 'Give me pen!', 'Pen!', 'You give pen.'], answer: 0, explain: "I'd like…, please. 委婉表达想要" },
  { q: '店员问"Can I help you?" 你的回答可能是？', options: ['Yes, I want a ruler.', 'No, you cannot.', 'I help you.', 'Help!'], answer: 0, explain: '购物场景：说出想要的商品' },
  { q: '问价格"多少钱"用？', options: ['How much is it?', 'How many is it?', 'What money?', 'How price?'], answer: 0, explain: '价格不可数，用 How much' },
],

'cross-123': [
  { q: 'one 的下一个是？', options: ['two', 'ten', 'three', 'six'], answer: 0, explain: 'one, two, three…顺序' },
  { q: 'four 和 five 哪个大？', options: ['five', 'four', '一样', '没法比'], answer: 0, explain: '5 > 4' },
  { q: '火箭倒数从几开始？', options: ['ten', 'one', 'five', 'three'], answer: 0, explain: 'Ten, nine…one, lift off!' },
],

'cross-124': [
  { q: 'grandfather 是？', options: ['爷爷/外公', '爸爸', '叔叔', '哥哥'], answer: 0, explain: 'grand- 表示上一辈' },
  { q: 'This is ___ mother.（我的）填？', options: ['my', 'me', 'I', 'mine'], answer: 0, explain: '形容词性物主代词 my 修饰名词' },
  { q: '介绍妹妹用哪句？', options: ['This is my sister.', 'I am sister.', 'She is I sister.', 'This is sister my.'], answer: 0, explain: 'This is my + 称谓' },
],

'hb-03': [
  { q: 'knees 指的是？', options: ['膝盖（两个）', '脚趾', '手指', '肩膀'], answer: 0, explain: 'knee 的复数 knees（成对部位用复数）' },
  { q: 'Touch your ___.（摸你的鼻子）填？', options: ['nose', 'mouth', 'head', 'eyes'], answer: 0, explain: 'nose 鼻子' },
  { q: 'foot 的复数是？', options: ['feet', 'foots', 'feets', 'foot'], answer: 0, explain: '不规则变化：foot → feet' },
],

'hb-10': [
  { q: 'He has a fever. 他怎么了？', options: ['发烧了', '头疼', '感冒', '胃疼'], answer: 0, explain: 'fever 发烧；headache 头疼' },
  { q: 'You ___ drink more water.（应该）填？', options: ['should', 'shall', 'will', 'would like'], answer: 0, explain: 'should + 动词原形表建议' },
  { q: '牙疼应该建议？', options: ["You should see a dentist.", 'You should eat candy.', 'You should not sleep.', 'You should run.'], answer: 0, explain: 'see a dentist 看牙医' },
],

};

let changed = 0;
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  const p = path.join(D, f);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (Q[j.id] && j.exercises) {
    j.exercises.push(...Q[j.id].map(x => ({ q: x.q, options: x.options, answer: x.answer, explain: x.explain })));
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    changed++;
  }
}
console.log(`地理+科学+语文+英语题库扩容 ${changed} 课`);
