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
    area: '信息科技', band: 'senior', grade: 11, id: 'ai-25', order: 912, title: '网络协议：数据怎样跑', emoji: '🌐', textbook: '信息科技（高中）',
    curriculum: { module: '网络原理', points: ['TCP/IP分层', 'IP地址与路由', 'DNS域名解析'] },
    story: '你输入 baidu.com 按回车——0.3秒后页面出现。中间发生了什么？你的"请求"被拆成小包·穿过几十根网线·被路由器转发无数次·再在服务器重组——这就是网络协议的工作。',
    goals: ['理解TCP/IP分层', '理解IP地址和路由', '理解DNS的作用'],
    aiIntro: '🌐 0.3秒环游世界——网络协议',
    param: { name: 'np2', label: '协议站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['数据怎样拆成包？', '路由器怎样知道往哪送？', 'DNS是什么？'],
    views: [
      { when: 1, title: '分层', subtitle: 'TCP/IP四层', color: 'blue', emoji: '🏗️', blocks: [
        { kind: 'compare', title: '四层模型', items: [
          { label: '应用层', value: '你看到的：浏览器·微信·游戏——HTTP·DNS·SMTP 协议住在这' },
          { label: '传输层', value: 'TCP（可靠·拆包编号·丢包重发）·UDP（快但不保证）——视频用UDP·文件用TCP' },
          { label: '网络层', value: 'IP地址+路由——给每个包写上"从哪来到哪去"的地址：像快递单' },
          { label: '链路层', value: '网线·WiFi·光纤——物理传输：比特流' },
        ] },
        { kind: 'info', icon: '📦', title: '拆包与重组', text: '一个大文件拆成上千个小包——每个包独立走不同的路→到目的地再按编号拼回来。为什么拆？小包丢了只重发那一个·大文件整个重来太浪费。 TCP 的编号=拼图编号' },
        { kind: 'highlight', text: 'TCP/IP四层=快递系统：写信（应用）→编号拆包（传输）→写地址选路（网络）→卡车送（链路）' },
      ] },
      { when: 2, title: 'IP路由', subtitle: '地址', color: 'green', emoji: '📍', blocks: [
        { kind: 'info', icon: '🔢', title: 'IP地址', text: 'IPv4：192.168.1.1（四个数字·每个0-255→约43亿个）：不够用了→IPv6（128位→够宇宙每粒沙子分一个）：你家WiFi分配的192.168.x.x = 内网地址（小区内部编号）' },
        { kind: 'info', icon: '🗺️', title: '路由', text: '你发一个包到百度服务器→经过你家路由器→小区→运营商→骨干网→百度的机房——每一站都"看一眼地址然后递给下一站"：像接力赛——每一棒只送一小段' },
        { kind: 'info', icon: '🚦', title: ' tracert 可视化', text: '命令行 tracert baidu.com——显示你的包经过的每一站（路由器）：通常10-20跳·每跳几毫秒。跨国的包可能走海底光缆——200ms 延迟=信号走了几万公里' },
        { kind: 'highlight', text: '路由=接力赛——每一站只送一小段·地址告诉下一站往哪递' },
      ] },
      { when: 3, title: 'DNS', subtitle: '翻译官', color: 'amber', emoji: '📖', blocks: [
        { kind: 'info', icon: '🔤', title: 'IP太难记了', text: '111.13.100.92——你记不住吧？但 baidu.com 谁都能记。DNS（域名系统）=互联网的电话簿：输入域名→DNS服务器查出对应IP→浏览器再连那个IP。查一次通常<10ms' },
        { kind: 'info', icon: '⚡', title: '为什么有时候"网页打不开"', text: 'DNS服务器出故障→名字翻译不了→"找不到服务器"：跟网站本身无关。解决：换DNS（114.114.114.114 / 8.8.8.8）——DNS是上网的第一步' },
        { kind: 'info', icon: '🔄', title: '完整流程', text: '输入baidu.com → DNS查出IP 111.x.x.x → 建立TCP连接（三次握手）→ 发HTTP请求 → 服务器返回HTML → 浏览器渲染页面——全部0.3秒内完成' },
        { kind: 'highlight', text: 'DNS=互联网的电话簿——没有它你只能记数字' },
      ] },
    ],
    teach: { sections: [
      { title: 'TCP/IP四层', body: '【应用】HTTP DNS浏览器。\n【传输】TCP拆包编号·UDP快。\n【网络】IP地址+路由。\n【链路】物理传输。' },
      { title: 'IP与路由', body: '【地址】IPv4四段数字·IPv6够用。\n【路由】接力送·每站看地址递下一站。\n【工具】tracert可视化路径。' },
      { title: 'DNS', body: '【功能】域名翻译成IP的电话簿。\n【故障】DNS挂→名字翻译不了→打不开。\n【流程】输域名→查IP→连TCP→发请求→收页面。' },
    ], examples: [
      { q: '网页打不开但QQ能用', steps: ['QQ用IP直连不依赖DNS', '浏览器需要DNS翻译', 'DNS可能出故障', '换114.114.114.114试试'], tip: 'DNS排查' },
      { q: '为什么看视频不卡但下载文件慢', steps: ['视频用UDP快但可丢帧', '文件用TCP保证完整', 'TCP丢包重发→慢', '协议选择有道理'], tip: '两种协议' },
    ], mistakes: ['认为网线直连到目标服务器（经过十几站路由器）', '认为IP只有一个（内网外网不同）'] },
    exercises: [
      { q: 'TCP/IP四层模型中"传输层"的作用是？', options: ['显示网页', '拆包编号保证可靠', '物理传输', '查IP'], answer: 1, explain: 'TCP住这里' },
      { q: '视频直播通常用什么协议？', options: ['TCP可靠慢', 'UDP快可丢帧', 'HTTP', 'DNS'], answer: 1, explain: '实时优先' },
      { q: 'DNS的功能是？', options: ['把域名翻译成IP地址', '加速网络', '加密数据', '杀毒'], answer: 0, explain: '互联网电话簿' },
      { q: 'IPv6取代IPv4的原因是？', options: ['更安全', '更快', '更便宜', 'IPv4地址不够用'], answer: 3, explain: '43亿不够了' },
      { q: '你的包从北京到纽约大约经过？', options: ['1站', '10-20站路由器', '10000站', '0站'], answer: 1, explain: '接力赛' },
      { q: 'DNS=互联网的 ___', options: ['电话簿', '警察'], answer: 0, explain: '名字翻译', type: 'blank', blank: { answerText: '电话簿', bank: ['电话簿', '警察'] } },
    ],
  }),
  L({
    area: '音乐', band: 'senior', grade: 11, id: 'mus-41', order: 913, title: '电子音乐：合成器的魔法', emoji: '🎹', textbook: '音乐鉴赏（人音版）',
    curriculum: { module: '电子音乐', points: ['声音的合成', 'MIDI与制作', '电子音乐的流派'] },
    story: '一个音符不需要乐器——用数学公式就能"算"出来。合成器把电波变成音乐·电脑变成录音棚·你变成制作人。从Kraftwerk到EDM到电影配乐——电子音乐改变了整个音乐工业。',
    goals: ['理解声音合成的基本原理', '了解MIDI制作流程', '认识电子音乐流派'],
    aiIntro: '🎹 用数学造音乐——电子音乐',
    param: { name: 'em2', label: '电音站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['声音怎样被"造"出来？', 'MIDI是什么？', 'EDM为什么让人想跳？'],
    views: [
      { when: 1, title: '合成', subtitle: '造声音', color: 'violet', emoji: ' oscillator', blocks: [
        { kind: 'info', icon: '〰️', title: '波形=声音的DNA', text: '正弦波（纯·像笛子）·方波（复古游戏机）·锯齿波（刺·像铜管）·噪声（鼓的沙沙声）——四种基本波叠加就能造出几乎所有音色：加法合成=调色' },
        { kind: 'compare', title: '合成三招', items: [
          { label: '振荡器', value: '发出基础波形——数学公式生成电信号：频=音高·波=音色' },
          { label: '滤波器', value: '砍掉某些频率——低通让声音闷·高通让声音薄' },
          { label: '包络ADSR', value: 'Attack起音·Decay衰减·Sustain持续·Release释放——控制音量随时间变化：钢琴瞬间到峰（快A）·弦乐慢慢到峰（慢A）' },
        ] },
        { kind: 'highlight', text: '合成器=数学造声音：振荡器出波形·滤波器调色·包络管呼吸' },
      ] },
      { when: 2, title: 'MIDI', subtitle: '数字乐谱', color: 'green', emoji: '🎹', blocks: [
        { kind: 'info', icon: '📝', title: 'MIDI是什么', text: 'Musical Instrument Digital Interface——不录音·只录"弹了哪个键·多大力·多长时间"的指令：像数字乐谱。播放时让合成器"照谱演奏"——随时换音色' },
        { kind: 'steps', title: '制作流程', items: ['编曲：在DAW（数字音频工作站·GarageBand/FL Studio）里写MIDI', '选音色：同一旋律用钢琴·合成器·鼓——一秒换', '混音：调整每条轨道的音量·声像·效果', '导出：合成最终音频文件——一首歌完成' ] },
        { kind: 'info', icon: '💻', title: '一个人的乐队', text: '传统需要一个乐队（鼓手·贝斯手·吉他手）——现在一台电脑搞定全部：这就是为什么独立音乐人爆发式增长：工具的民主化' },
        { kind: 'highlight', text: 'MIDI=弹奏指令·合成器=执行演奏——两者组合=一个人的乐队' },
      ] },
      { when: 3, title: '流派', subtitle: '从地下到主流', color: 'amber', emoji: '🎧', blocks: [
        { kind: 'compare', title: '电音家族', items: [
          { label: 'Techno', value: '底特律起源·机械重复——120-130BPM：地下文化的代表' },
          { label: 'House', value: '芝加哥起源·律动感——Disco的电子后代：今天主流' },
          { label: 'EDM', value: '电子舞曲的统称——Drop（爆点）让人跳起来：音乐节的主角' },
          { label: 'Ambient', value: '氛围音乐·没有节拍—— Brian Eno——冥想和专注用的' },
        ] },
        { kind: 'info', icon: '🎬', title: '电影配乐', text: '汉斯·季默用合成器+管弦乐混合——《星际穿越》的管风琴+电子低频：电子音乐不只是"舞曲"——它可以宇宙般宏大。今天的配乐大多混合电子+实录' },
        { kind: 'highlight', text: '电子音乐从地下舞曲到电影配乐——数字工具重新定义了音乐' },
      ] },
    ],
    teach: { sections: [
      { title: '声音合成', body: '【波形】正弦纯·方波复古·锯齿刺。\n【三招】振荡器出波·滤波器调色·包络管呼吸。\n【ADSR】起衰持释。' },
      { title: 'MIDI制作', body: '【本质】数字乐谱只录指令。\n【流程】编曲→选音色→混音→导出。\n【工具】DAW一台电脑=一个乐队。' },
      { title: '流派', body: '【Techno】底特律机械重复。\n【House】律动主流。【EDM】Drop爆点。\n【Ambient】无节拍冥想。' },
    ], examples: [
      { q: '同一旋律怎样"一秒换乐器"', steps: ['MIDI录的是指令不是声音', '播放时选音色', '选钢琴→钢琴版', '选合成器→电音版——MIDI灵活性'], tip: '数字乐谱' },
      { q: '游戏音乐为什么常用8-bit风格', steps: ['早期芯片只能发方波声', '方波成了那代人的游戏记忆', '今天故意用它唤起怀旧', '音色也能变成文化符号'], tip: '音色与记忆' },
    ], mistakes: ['认为电子音乐"不真实"（合成器创造了真实乐器做不到的声音）', '认为MIDI就是音频文件（是弹奏指令不是录音）'] },
    exercises: [
      { q: '合成器产生声音的核心部件是？', options: ['吉他弦', '振荡器（发出波形）', '鼓面', '话筒'], answer: 1, explain: '数学造波' },
      { q: 'ADSR包络的A指的是？', options: ['音量', '起音Attack', '音高', '节拍'], answer: 1, explain: '四种变化之一' },
      { q: 'MIDI记录的是什么？', options: ['声音', '弹奏指令', '歌词', '视频'], answer: 1, explain: '数字乐谱' },
      { q: 'EDM中让人想跳的"爆点"叫？', options: ['Verse', 'Drop', 'Intro', 'Outro'], answer: 1, explain: '电子舞曲高潮' },
      { q: '没有节拍适合冥想的电音流派是？', options: ['EDM', 'Techno', 'Ambient', 'House'], answer: 2, explain: '氛围音乐' },
      { q: 'MIDI=弹奏指令·合成器= ___', options: ['执行演奏', '记录声音'], answer: 0, explain: '分工合作', type: 'blank', blank: { answerText: '执行演奏', bank: ['执行演奏', '记录声音'] } },
    ],
  }),
  L({
    area: '艺术', band: 'senior', grade: 11, id: 'art-45', order: 914, title: '插画与绘本：画笔讲故事', emoji: '🖌️', textbook: '美术（简编版）',
    curriculum: { module: '插画艺术', points: ['插画的叙事功能', '绘本的结构', '风格多样性'] },
    story: '文字告诉你"女孩走在森林里"——插画让你看到她的表情·森林的光影·和她身后若隐若现的东西。插画不是"配图"——是用画笔写故事的另一半。这一课学会用画讲故事。',
    goals: ['理解插画的叙事功能', '了解绘本的结构', '认识插画的多种风格'],
    aiIntro: '🖌️ 用画笔写另一半故事——插画课',
    param: { name: 'il', label: '插画站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['插画和纯绘画的区别？', '绘本怎样翻页制造惊喜？', '不同风格怎样讲故事？'],
    views: [
      { when: 1, title: '叙事', subtitle: '画的一半', color: 'blue', emoji: '📖', blocks: [
        { kind: 'info', icon: '🎭', title: '插画vs纯绘画', text: '纯绘画：自我表达（看的人自己解读）；插画：为内容服务（帮助理解文字·增强氛围·补充文字没说的）——插画是"配角"但好配角能让故事活起来' },
        { kind: 'info', icon: '🎬', title: '插画怎样"说"文字没说的', text: '文字说"他很伤心"——好的插画不画眼泪：画他一个人坐在操场角落·午餐盒没打开——留白让观众自己感受到。展示不说（Show·not·tell）——这是插画的核心功夫' },
        { kind: 'highlight', text: '插画是文字的搭档——不是重复文字而是补充文字' },
      ] },
      { when: 2, title: '绘本', subtitle: '翻页的魔法', color: 'green', emoji: '📚', blocks: [
        { kind: 'steps', title: '绘本的翻页结构', items: ['32页经典结构：开头（4页）·展开（20页）·高潮（4页）·结尾（4页）——跟电影三幕一样', '翻页前是悬念·翻页后是惊喜：上一个画面暗示→下一个画面揭晓：翻页本身就是节奏', '图与文的空隙：文字说A·画说B——读者在两个之间自己填C：这是绘本最迷人的部分' ] },
        { kind: 'info', icon: '🖼️', title: '经典赏析', text: '《猜猜我有多爱你》——画面留白+大小对比（大兔子和小兔子）；《野兽国》——画面从小变大（情绪爆发）·从大变小（回归平静）：画面大小=情绪强弱' },
        { kind: 'highlight', text: '绘本的翻页=电影的剪辑——节奏全在"翻"的瞬间' },
      ] },
      { when: 3, title: '风格', subtitle: '千面插画', color: 'violet', emoji: '🎨', blocks: [
        { kind: 'compare', title: '四种风格', items: [
          { label: '水彩', value: '透明·轻盈·温柔——宫崎骏·几米：适合情感·梦境·自然' },
          { label: '版画', value: '粗犷·有力·对比强——适合冲突·原始·黑暗主题' },
          { label: '扁平', value: '简洁·现代·几何——品牌插画·儿童产品：干净直接' },
          { label: '手绘涂鸦', value: '随性·有温度——像个性的手写笔记：小红书·独立插画师' },
        ] },
        { kind: 'info', icon: '💡', title: '选风格的逻辑', text: '故事的情绪决定风格——温柔故事用水彩·悬疑故事用版画·轻松科普用扁平：不是"我会哪种"而是"故事需要哪种"' },
        { kind: 'highlight', text: '风格为故事服务——选对风格故事就成功了一半' },
      ] },
    ],
    teach: { sections: [
      { title: '插画的叙事', body: '【功能】补充文字·增强氛围·不说而示。\n【核心】Show not tell。' },
      { title: '绘本结构', body: '【32页】开头4+展开20+高潮4+结尾4。\n【翻页】悬念→惊喜=节奏。\n【图文空隙】读者自己填的部分。' },
      { title: '风格选择', body: '【水彩】温柔。【版画】冲突。【扁平】现代。\n【选择】情绪决定风格。' },
    ], examples: [
      { q: '给"孤独"画一幅插画', steps: ['不画哭脸', '画一个人在人群中但没人看他', '或者一个人在空旷的教室', '留白让观众自己感受孤独'], tip: '展示不说' },
      { q: '选一种风格画"森林冒险"', steps: ['故事情绪：神秘+紧张', '版画的强烈对比适合', '或者水彩的森林光影', '情绪决定风格'], tip: '匹配' },
    ], mistakes: ['认为插画就是"把文字画出来"（是补充和增强）', '认为风格是个人喜好（故事需要决定风格）'] },
    exercises: [
      { q: '插画和纯绘画的最大区别是？', options: ['工具不同', '插画为内容服务', '大小不同', '价钱多少'], answer: 1, explain: '配角但有力量' },
      { q: '「展示而非讲述」的意思是？', options: ['多用文字说明', '不说而用画展示', '闭口不谈', '画得漂亮'], answer: 1, explain: '插画核心' },
      { q: '绘本32页结构中的高潮占约？', options: ['2页', '16页', '4页', '30页'], answer: 2, explain: '跟电影三幕一样' },
      { q: '野兽国的画面大小变化暗示什么？', options: ['主角的情绪强弱', '纸张不够', '作者偷懒', '随机'], answer: 0, explain: '画面=情绪' },
      { q: '温柔梦境类故事适合什么风格？', options: ['版画', '水彩', '涂鸦', '像素'], answer: 1, explain: '轻盈透明' },
      { q: '插画是文字的 ___——不是重复而是补充', options: ['搭档', '敌人'], answer: 0, explain: '合作关系', type: 'blank', blank: { answerText: '搭档', bank: ['搭档', '敌人'] } },
    ],
  }),
  L({
    area: '劳动', band: 'senior', grade: 11, id: 'lab-44', order: 915, title: '阳台种植：从种子到餐桌', emoji: '🌱', textbook: '人教版劳动（高中）',
    curriculum: { module: '种植技能', points: ['适合阳台的植物', '日常养护', '常见问题'] },
    story: '吃自己种的番茄——味道跟买的不一样。不是因为"爱心加成"·是因为从枝头到餐桌只有一米而不是一千公里。这一课从一粒种子开始·在阳台上建一个小菜园。',
    goals: ['选择适合阳台的植物', '掌握日常养护方法', '学会诊断常见问题'],
    aiIntro: '🌱 从种子到餐桌——阳台种植',
    param: { name: 'gl', label: '种植站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['什么植物最适合新手？', '浇水多少才对？', '叶子发黄怎么办？'],
    views: [
      { when: 1, title: '选植物', subtitle: '新手友好', color: 'green', emoji: '🥬', blocks: [
        { kind: 'compare', title: '阳台植物推荐', items: [
          { label: '最容易', value: '葱·蒜苗·生菜——把根部插土里就长：一周见效·成就感爆棚' },
          { label: '进阶', value: '小番茄·辣椒·草莓——3个月收获果实：需要阳光充足' },
          { label: '香草', value: '薄荷·罗勒·迷迭香——随掐随长·做菜用：可以水培' },
          { label: '观赏', value: '多肉·绿萝·太阳花——好养好看：净化空气加分' },
        ] },
        { kind: 'info', icon: '☀️', title: '先看阳光', text: '朝南阳台（全日照6h+）：番茄辣椒草莓都行。朝北阳台（散光）：生菜薄荷绿萝。先数你家阳台每天几小时直射阳光→再选植物：光照是第一条件' },
        { kind: 'highlight', text: '新手从葱蒜生菜开始——一周见效建立信心' },
      ] },
      { when: 2, title: '养护', subtitle: '日常', color: 'blue', emoji: '💧', blocks: [
        { kind: 'steps', title: '浇水原则', items: ['"见干见湿"：土干了再浇·浇就浇透（盆底流出水）——不干不浇', '判断干不干：手指插入土中第二关节——干的就浇。不是每天定时浇', '夏天早晚浇·冬天中午浇（避开暴晒和严寒时间）', '浇多了比浇少了更危险（烂根死掉了）——新手八成是浇死不是渴死' ] },
        { kind: 'info', icon: '🌱', title: '土壤和施肥', text: '土：营养土（花市2元一袋）就行——不要挖公园的土（可能板结有虫）；肥：有机复合肥每月一次·宁少勿多' },
        { kind: 'info', icon: '🪴', title: '容器', text: '花盆·泡沫箱·饮料瓶剪开都行——底部必须有排水孔：无孔=积水烂根。深度：叶菜10cm·番茄辣椒20cm+' },
        { kind: 'highlight', text: '浇水宁少勿多——新手的花是浇死的不是渴死的' },
      ] },
      { when: 3, title: '诊断', subtitle: '看叶识病', color: 'amber', emoji: '🔍', blocks: [
        { kind: 'compare', title: '叶片信号', items: [
          { label: '发黄', value: '老叶黄→缺肥。新叶黄→浇多了。全株黄→光照不够。看哪片黄就知道哪出问题' },
          { label: '发蔫', value: '土干→缺水浇透。土湿还蔫→烂根（停止浇水·松土通风）' },
          { label: '虫子', value: '蚜虫（绿小虫）→用水冲或肥皂水。白色小飞虫→土壤太湿' },
        ] },
        { kind: 'info', icon: '🌾', title: '从种子到收获', text: '生菜30天·葱蒜15天·小番茄80天·辣椒90天。播种深度=种子直径的2倍·间距按品种。发芽前保持湿润不暴晒' },
        { kind: 'highlight', text: '叶子是植物的表情——学会看叶就学会了种植物' },
      ] },
    ],
    teach: { sections: [
      { title: '植物选择', body: '【新手】葱蒜生菜一周见效。\n【进阶】番茄辣椒草莓。\n【光照】朝南全日照·朝北散光。' },
      { title: '日常养护', body: '【浇水】见干见湿·宁少勿多。\n【判断】手指插土二关节。\n【容器】有排水孔。' },
      { title: '诊断', body: '【老叶黄】缺肥。【新叶黄】浇多。\n【蔫+土干】缺水。【蔫+土湿】烂根。\n【收获】生菜30天·番茄80天。' },
    ], examples: [
      { q: '想在阳台种菜从哪种开始', steps: ['看阳台朝向', '南→选生菜小番茄', '北→选葱蒜薄荷', '一周浇一次不贪多'], tip: '先易后难' },
      { q: '叶子发蔫了', steps: ['先摸土', '土干→浇透', '土湿→可能烂根', '停水松土通风'], tip: '摸土判断' },
    ], mistakes: ['每天定时浇水（见干见湿不是定时定量）', '认为种植物需要天赋（是观察和耐心）'] },
    exercises: [
      { q: '浇水的正确原则是？', options: ['每天浇', '见干见湿宁少勿多', '浇越多越好', '不浇'], answer: 1, explain: '干透再浇透' },
      { q: '新手种花最常见的死因是？', options: ['渴死', '浇多烂根', '虫咬', '老死'], answer: 1, explain: '浇水过多' },
      { q: '老叶发黄通常说明？', options: ['浇多了', '缺肥', '太晒', '太暗'], answer: 1, explain: '该施肥了' },
      { q: '花盆底部必须有？', options: ['颜色', '排水孔', '花纹', '盖子'], answer: 1, explain: '无孔=烂根' },
      { q: '最适合朝北阳台的植物？', options: ['小番茄', '辣椒', '生菜薄荷绿萝', '草莓'], answer: 2, explain: '耐阴' },
      { q: '叶子是植物的 ___', options: ['表情', '衣服'], answer: 0, explain: '看叶知健康', type: 'blank', blank: { answerText: '表情', bank: ['表情', '衣服'] } },
    ],
  }),
  L({
    area: '英语', band: 'junior', grade: 7, id: 'eng-42', order: 916, title: '英语词汇记忆法：告别死记硬背', emoji: '🧠', textbook: '人教PEP（七年级）',
    curriculum: { module: '学习策略', points: ['词根词缀法', '联想法', '间隔重复法'] },
    story: '背了忘忘了背——词汇是英语最痛的事。但你知道吗：记不住不是记性差·是方法不对。这一课教你三个科学验证的记忆方法——让每个单词花更少时间记得更牢。',
    goals: ['掌握词根词缀法', '学会联想记忆法', '了解间隔重复法'],
    aiIntro: '🧠 告别死记硬背——词汇记忆法',
    param: { name: 'vm', label: '记忆站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['为什么总是背了就忘？', '词根词缀怎样帮记忆？', '什么时候复习最科学？'],
    views: [
      { when: 1, title: '词根', subtitle: '拆单词', color: 'blue', emoji: '🧩', blocks: [
        { kind: 'info', icon: 'pre', title: '前缀=方向', text: 'un-（不）·re-（再）·pre-（前）·dis-（否定）——unhappy不快乐·rewrite重写·preview预习——学会20个前缀=猜出几百个新词' },
        { kind: 'info', icon: '📖', title: '词根=核心', text: 'port=搬运：import进口（往里搬）·export出口（往外搬）·transport运输（跨着搬）——知道port=搬·看新词都能猜：一个词根串一串单词' },
        { kind: 'info', icon: 'post', title: '后缀=词性', text: '-tion名词·-ful形容词·-ly副词——action行动·careful小心的·quickly快速地：知道后缀→猜词性→语法不犯错' },
        { kind: 'highlight', text: '前缀定方向+词根定意思+后缀定词性=拆解一切生词' },
      ] },
      { when: 2, title: '联想', subtitle: '挂钩', color: 'green', emoji: '🔗', blocks: [
        { kind: 'compare', title: '三种联想', items: [
          { label: '谐音法', value: 'ambulance救护车 → 谐音"俺不能死"→记住意思。不是每个词都能谐音·能谐音的都是好记的' },
          { label: '词中词法', value: 'island岛 → is+land（是陆地但被水围→岛）：拆出认识的短词+联想——好拆=好记' },
          { label: '画面法', value: 'gloomy阴暗 → 想象一个房间gl-oom-y（昏暗的房间）：画面比文字的记忆深十倍' },
        ] },
        { kind: 'info', icon: '😄', title: '越荒谬越好记', text: '联想的画面越离谱越忘不掉——"俺不能死"比"A-M-B-U..."好记一万倍。有趣的联想本身就是记忆的胶水' },
        { kind: 'highlight', text: '联想=给新词挂钩——越荒谬挂得越牢' },
      ] },
      { when: 3, title: '间隔', subtitle: '科学复习', color: 'violet', emoji: '⏰', blocks: [
        { kind: 'steps', title: '遗忘曲线', items: ['刚背完：记住100%', '20分钟后：忘42%', '1天后：忘67%', '7天后：忘75%——然后趋于稳定。如果不复习大部分一天就忘了' ] },
        { kind: 'info', icon: '🔄', title: '对抗遗忘', text: '在快忘的时候复习一次→忘得慢十倍。节奏：当天→第2天→第4天→第7天→第15天——五次就能转入长期记忆。这叫间隔重复——AnkiApp自动化帮你做' },
        { kind: 'info', icon: '📝', title: '组合拳', text: '新词：拆词根+联想 → 用手写三遍（肌肉记忆）→ 造一个句（用出来）→ 第二天复习。四步+间隔=记得又牢又久' },
        { kind: 'highlight', text: '对抗遗忘的武器=在快忘的时候复习一次' },
      ] },
    ],
    teach: { sections: [
      { title: '词根词缀', body: '【前缀】un不·re再·pre前·dis否。\n【词根】port搬→import/export/transport。\n【后缀】tion名·ful形·ly副。' },
      { title: '联想记忆', body: '【谐音】俺不能死=ambulance。\n【词中词】is+land。\n【画面】越荒谬越好记。' },
      { title: '间隔重复', body: '【遗忘】1天忘67%。\n【对策】当天→2天→4天→7天→15天。\n【四步】拆+写+造句+复习。' },
    ], examples: [
      { q: '记住 telescope（望远镜）', steps: ['拆：tele（远）+ scope（看）', '联想：看远处的东西', '写三遍+造句：I look at stars with a telescope', '明天复习一次'], tip: '词根+四步' },
      { q: '总是今天背明天忘', steps: ['正常：1天忘67%', '不是记性差是没复习', '当天+第2天各复习一次', '用Anki或自制卡片'], tip: '间隔重复' },
    ], mistakes: ['一遍一遍抄写（被动重复效果差）', '今天背完不复习（一天忘67%）'] },
    exercises: [
      { q: '前缀 un- 的意思是？', options: ['再', '不·否定', '之前', '之后'], answer: 1, explain: 'unhappy不快乐' },
      { q: '词根 port 的意思是？', options: ['看', '搬运', '说话', '水'], answer: 1, explain: 'import出口' },
      { q: 'ambulance的谐音记忆法是？', options: ['安不冷死', '俺不能死', '安静', '阿妈'], answer: 1, explain: '荒谬=好记' },
      { q: '根据遗忘曲线一天后约忘多少？', options: ['10%', '30%', '67%', '100%'], answer: 2, explain: '所以要第2天复习' },
      { q: '科学的复习间隔是？', options: ['每天十遍', '当天起间隔复习5次', '只背一次', '每年一次'], answer: 1, explain: '间隔重复' },
      { q: '在快忘的时候复习一次——忘得慢 ___ 倍', options: ['十', '一'], answer: 0, explain: '科学验证', type: 'blank', blank: { answerText: '十', bank: ['十', '一'] } },
    ],
  }),
  L({
    area: '体育与健康', band: 'junior', grade: 8, id: 'pe-45', order: 917, title: '篮球防守：滑步与篮板', emoji: '🛡️', textbook: '人教版体育（初中）',
    curriculum: { module: '球类运动', points: ['防守滑步', '篮板争抢', '防守原则'] },
    story: '进攻得分手拿手·防守没人管——但篮球界有句老话：进攻赢比赛·防守赢冠军。最好的防守者不靠身高和弹跳——靠脚步和预判。这一课学"让人投不进"的本事。',
    goals: ['掌握防守滑步', '学会抢篮板卡位', '理解防守原则'],
    aiIntro: '🛡️ 防守赢冠军——篮球防守课',
    param: { name: 'df2', label: '防守站', min: 1, max: 3, step: 1, value: 1 },
    explore: ['怎样跟上突破的人？', '抢篮板为什么要卡位？', '好的防守者不靠什么？'],
    views: [
      { when: 1, title: '滑步', subtitle: '防守的脚', color: 'blue', emoji: '🦶', blocks: [
        { kind: 'steps', title: '防守滑步', items: ['基本姿势：膝盖弯曲·重心低·双臂张开——比进攻站姿更矮：矮了才快', '侧滑步：不交叉脚·像螃蟹横着移动——左脚先迈右脚跟：不交叉=随时变向', '速度来自步频不是步幅——小碎步快速移动比大步跳更稳更快', '手跟着动：一只手挡传球线·一只手干扰投篮——脚到手也到' ] },
        { kind: 'info', icon: '⚡', title: '防守距离', text: '有球的人：一臂距离（能干扰投篮）。无球的人：两步（能协防）。对方运球停了→贴上去（他不能走了）。对方比你高→远一点（防投）；比你快→近一点（防突）' },
        { kind: 'highlight', text: '防守的脚步=螃蟹步·矮重心·碎步快移' },
      ] },
      { when: 2, title: '篮板', subtitle: '第二跳', color: 'green', emoji: '🏀', blocks: [
        { kind: 'steps', title: '抢篮板四步', items: ['预判：球一出手就开始找落点——大部分篮板落在篮筐对侧或罚球线附近', '卡位：转身把对手挡在身后——用背和屁股把他"坐"在外面：先卡人再抢球', '跳：双手起跳·双手抢球（比单手稳）·抢到球收在下巴前保护', '落地：双脚着地护球·立刻做第一传或强力运球——抢完不运球=白抢' ] },
        { kind: 'info', icon: '📊', title: '篮板赢得比赛', text: '一场40分钟的比赛约有70次投篮不中=70个篮板机会。多抢10个=多10次进攻——比多进三个三分还多。篮板=最大的"隐藏得分"——从这赢球' },
        { kind: 'highlight', text: '先卡人再抢球——不卡位的抢板是碰运气' },
      ] },
      { when: 3, title: '原则', subtitle: '防守智慧', color: 'amber', emoji: '🧠', blocks: [
        { kind: 'compare', title: '防守四原则', items: [
          { label: '不轻易跳', value: '跳起来就回不来了——对方一个假动作你飞了：脚不离地=永远能反应' },
          { label: '逼弱侧手', value: '对方右手强就逼他用左手——让他做不舒服的事。了解对手=防守的一半' },
          { label: '协防', value: '队友被过了→你补上去。防守不是1对1——五个人是一条链' },
          { label: '防守态度', value: '进攻可以不准·防守不能不拼——防守100%靠态度。愿不愿意弯腰·愿不愿意跑——这是选择不是天赋' },
        ] },
        { kind: 'info', icon: '🏆', title: '最佳防守球员', text: 'NBA最佳防守球员通常不是最高最壮的——是预判最好·脚步最快·最拼的。防守是技术+意志——努力练滑步和卡位你就能防守' },
        { kind: 'highlight', text: '进攻可以不准·防守不能不拼——防守是态度' },
      ] },
    ],
    teach: { sections: [
      { title: '防守滑步', body: '【姿势】矮重心张开臂。\n【步法】侧滑步不交叉脚·碎步快移。\n【距离】有球一臂无球两步。' },
      { title: '篮板技术', body: '【四步】预判→卡人→跳抢→保护第一传。\n【价值】一场约70个板=最大隐藏得分。' },
      { title: '防守原则', body: '【不跳】假动作骗跳。逼弱手。协防。\n【态度】防守100%靠意愿。' },
    ], examples: [
      { q: '对方速度快总被突破', steps: ['重心再矮一点', '碎步移不是跳', '距离退半步防突', '逼他弱手方向'], tip: '脚步修' },
      { q: '总抢不到篮板', steps: ['球出手就开始移动', '先转身卡人', '双手跳抢', '落地护球'], tip: '卡位优先' },
    ], mistakes: ['见球就跳（假动作骗你飞过去）', '抢板不卡人直接跳（被人挡在身后）'] },
    exercises: [
      { q: '防守滑步的特点是？', options: ['交叉腿跑', '不交叉脚像螃蟹横移', '跳着走', '转身跑'], answer: 1, explain: '随时变向' },
      { q: '抢篮板的第一步是？', options: ['跳', '卡位把人挡身后', '举双手', '喊人'], answer: 1, explain: '先卡人再抢球' },
      { q: '防守时最不该做的是？', options: ['弯腰低重心', '碎步快速移动', '见球就跳', '张开双臂'], answer: 2, explain: '假动作骗跳' },
      { q: '防守无球队员的距离约？', options: ['贴身', '两步（能协防）', '五米', '无所谓'], answer: 1, explain: '协防距离' },
      { q: '一句话概括防守？', options: ['靠身高', '靠弹跳', '态度+脚步+预判', '靠运气'], answer: 2, explain: '可以练' },
      { q: '进攻可以不准·防守不能不 ___', options: ['拼', '笑'], answer: 0, explain: '态度决定', type: 'blank', blank: { answerText: '拼', bank: ['拼', '笑'] } },
    ],
  }),
];

for (const l of LESSONS) fs.writeFileSync(path.join(DIR, l.id + '.json'), JSON.stringify(l, null, 2) + '\n', 'utf8');
console.log('已生成', LESSONS.length, '节:', LESSONS.map((l) => l.id).join(', '));
