# -*- coding: utf-8 -*-
"""英语(+6) 地理(+3) 音乐(+2) 课程扩容：每课 3 道随堂练习
沿用 content/lessons/cross-*.json 结构；order 从 104 起接续。
"""
import json, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'content', 'lessons')

BASE_TOOLBOX = ["island_when_run", "island_say", "island_say_for", "island_move",
                "island_turn_right", "island_turn_left", "island_goto", "island_wait",
                "island_play", "island_repeat", "island_number", "island_random",
                "island_costume", "island_change_size", "island_pen_down", "island_pen_up", "island_pen_color"]


def lesson(id_, order, title, emoji, story, goals, actor, tasks, curriculum, subject, ai, celeb, targets=None,
           code=False, starter=None, band='primary', area=None):
    d = {
        "id": id_, "island": "cross", "order": order, "title": title, "emoji": emoji,
        "story": story, "goals": goals, "toolbox": BASE_TOOLBOX, "actor": actor,
        "tasks": tasks, "curriculum": curriculum, "subject": subject,
        "aiIntro": ai, "celebrate": celeb,
        "subjectArea": area, "gradeBand": band,
    }
    if targets: d["targets"] = targets
    if code:
        d["codeLesson"] = True
        d["starterCode"] = starter
    return d


def t(id_, text, hints, check, optional=False):
    return {"id": id_, "text": text, "hintPrompts": hints, "check": check, **({"optional": True} if optional else {})}


def ex(q, options, answer, explain):
    return {"q": q, "options": options, "answer": answer, "explain": explain}


LESSONS = [
    # ---------------- 英语 6 课 ----------------
    lesson("eng-03", 104, "字母操教练", "🅰️",
        "A 是站直，B 是弯腰……今天你的角色是字母操教练！按顺序报字母，每报一个做一个动作——26 个字母跳完，顺序就刻进身体记忆里了。",
        ["掌握 26 个字母顺序", "把字母和动作配对记忆"],
        {"costume": "🏀", "x": 0, "y": 0},
        [
            t("t1", "开场：说「ABC time! Let's go!」", ["英文直接打在「说」积木里"], {"type": "say_text"}),
            t("t2", "字母三连：连说 A、B、C，每个字母配一个音效", ["说一个字母播一个音效"], {"type": "block_count_min", "block": "island_say", "count": 4}),
            t("t3", "动作配对：说「A!」→ 跳一下（移动 50），说「B!」→ 转一圈（右转 360）", ["说完就动，动作跟字母"], {"type": "block_count_min", "block": "island_move", "count": 1}),
            t("c1", "⭐ 挑战：用重复积木让「C! D! E!」三个字母快速连报", ["重复 3 次里放说+等待"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第一学段（1-2年级）", "module": "身边的算法", "points": ["顺序结构"]},
        {"name": "英语·字母", "emoji": "🅰️", "points": ["字母表顺序", "字母大小写"]},
        "🅰️ 26 个字母是英语的地基！今天你的角色带你做字母操——身体记住了，顺序就不会忘。",
        "字母操毕业！A 到 Z 的顺序已经长在你身上了。下次背单词拼不出来时，跳一遍字母操找感觉！",
        band='primary', area='英语',
    ),
    lesson("eng-04", 105, "数字报数员", "🔢",
        "one, two, three, go! 你的角色今天当报数员：从 one 报到 ten，边报边往前走一步——数字和英语同时装进脑袋。",
        ["掌握 one~ten 英文数字", "练习重复结构报数"],
        {"costume": "🦊", "x": -150, "y": 0},
        [
            t("t1", "报数开始：说「Let's count!」", ["开场白先说"], {"type": "say_text"}),
            t("t2", "连报 one、two、three，每报一个移动 40 步", ["说+移动交替"], {"type": "block_count_min", "block": "island_say", "count": 4}),
            t("t3", "重复的力量：用重复 3 次积木把「four five six」节奏报出来", ["重复里放说+等待"], {"type": "block_count_min", "block": "island_repeat", "count": 1}),
            t("c1", "⭐ 挑战：一直报到 ten，报完说「Ten! We did it!」", ["耐心排完 10 个数"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第一学段（1-2年级）", "module": "身边的算法", "points": ["循环结构"]},
        {"name": "英语·数字", "emoji": "🔢", "points": ["one~ten", "数字问答 How many"]},
        "🔢 数数是每种语言的第一课！one two three 走起来，走到 ten 你就赢。",
        "从 one 数到 ten！下次数楼梯、数糖果，试着用英语数——生活里全是练习场。",
        band='primary', area='英语',
    ),
    lesson("eng-05", 105.5, "颜色变变秀", "🎨",
        "红色的苹果 red apple、绿色的小草 green grass……你的角色是变色龙！每换一个造型就说一个颜色单词——颜色和单词一起变出来。",
        ["掌握 red/blue/green/yellow 等颜色词", "练习外观与台词配合"],
        {"costume": "🍏", "x": 0, "y": 0},
        [
            t("t1", "开场：说「Color magic show!」", ["先报幕再表演"], {"type": "say_text"}),
            t("t2", "变红色：换成苹果造型，说「Red! Like an apple!」", ["先换造型再说话"], {"type": "block_count_min", "block": "island_costume", "count": 1}),
            t("t3", "三连变：再变两次造型，分别说「Blue!」和「Green!」", ["造型和颜色要对上"], {"type": "block_count_min", "block": "island_say", "count": 4}),
            t("c1", "⭐ 挑战：加一个自己喜欢的颜色（如 yellow），配上打节奏的音效", ["yellow 黄色，太阳的颜色"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第一学段（1-2年级）", "module": "身边的算法", "points": ["顺序结构"]},
        {"name": "英语·颜色", "emoji": "🎨", "points": ["常见颜色单词", "What color is it?"]},
        "🎨 颜色是最好记的单词——因为你天天见！今天把 red blue green 变成你的口头禅。",
        "颜色秀成功！你现在能用英语叫出好几种颜色了。看看窗外，用英语说说你看到了什么颜色？",
        band='primary', area='英语',
    ),
    lesson("eng-06", 106, "自我介绍机器人", "🤖",
        "Hello! My name is... 你的英语第一句话从这里开始！让机器人替你做一段三句式自我介绍：名字、年龄、爱好——学会这个句型，走到哪儿都能交朋友。",
        ["掌握自我介绍三句句型", "熟练组合说积木"],
        {"costume": "🤖", "x": 0, "y": 0},
        [
            t("t1", "打招呼：说「Hello! My name is...」（换成你的英文名）", ["name 前加 My"], {"type": "say_text"}),
            t("t2", "报年龄：等 1 秒，说「I am nine years old.」（年龄换成你的）", ["I am + 数字 + years old"], {"type": "block_count_min", "block": "island_say", "count": 2}),
            t("t3", "说爱好：说「I like playing football!」（换成你喜欢的）", ["I like + doing"], {"type": "block_count_min", "block": "island_say", "count": 3}),
            t("c1", "⭐ 挑战：介绍完转一圈鞠躬（右转 360），说「Thank you!」", ["谢幕也要有仪式感"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第二学段（3-6年级）", "module": "身边的算法", "points": ["顺序结构"]},
        {"name": "英语·口语表达", "emoji": "🤖", "points": ["自我介绍句型", "I like... 表达"]},
        "🤖 交朋友的第一步是介绍自己！三句话句型今天打包给你——名字、年龄、爱好，学会就是社交达人。",
        "自我介绍毕业！这套句型在任何英语角都能用。明天试着真的用英语介绍一次自己？",
        band='junior', area='英语',
    ),
    lesson("eng-07", 107, "问答小剧场", "💬",
        "What's your name? — I'm Neo! 一问一答才叫对话！你的角色一人分饰两角：问完等 1 秒，换个造型再答——英语对话的节奏感就练出来了。",
        ["掌握基本问答句型", "用等待模拟对话节奏"],
        {"costume": "🐱", "x": 0, "y": 0},
        [
            t("t1", "提问方登场：说「What's your name?」", ["问句用 What's your name"], {"type": "say_text"}),
            t("t2", "停顿换角：等 1 秒，换一个造型", ["等待让对话有呼吸感"], {"type": "block_count_min", "block": "island_wait", "count": 1}),
            t("t3", "回答方上线：说「My name is Kitty! Nice to meet you!」", ["Nice to meet you 是回应问好的"], {"type": "block_count_min", "block": "island_say", "count": 2}),
            t("c1", "⭐ 挑战：再演一轮「How old are you? — I am ten!」", ["换造型等于换演员"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第二学段（3-6年级）", "module": "身边的算法", "points": ["顺序与事件"]},
        {"name": "英语·口语表达", "emoji": "💬", "points": ["问答句型", "Nice to meet you"]},
        "💬 一问一答，英语就活了！今天你的角色学会分身术——问的人是你，答的人也是你。",
        "对话小剧场杀青！你已经掌握了英语对话的骨架：问句 + 停顿 + 回答。下次遇到外国朋友别紧张，就是这个节奏。",
        band='junior', area='英语',
    ),
    lesson("eng-08", 108, "星期播报员", "📅",
        "Monday, Tuesday, Wednesday... 七天一个循环，用程序来表达最合适！让角色当电视台播报员，用循环把一周 7 天按顺序播出来——比死记硬带劲多了。",
        ["掌握 Monday~Sunday 七个单词", "用循环表达周期"],
        {"costume": "📺", "x": 0, "y": 0},
        [
            t("t1", "开播：说「This week on AI Island!」", ["先说开播词"], {"type": "say_text"}),
            t("t2", "播前三天：连说 Monday、Tuesday、Wednesday，每天配一个音效", ["一天一音效像新闻联播"], {"type": "block_count_min", "block": "island_say", "count": 4}),
            t("t3", "周末高潮：说「Saturday! Sunday! Weekend is here!」再欢呼", ["周末要播得最兴奋"], {"type": "block_count_min", "block": "island_say", "count": 6}),
            t("c1", "⭐ 挑战：用重复 7 次的积木结构表达「一周有 7 天」的概念", ["循环结构对应周期"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第二学段（3-6年级）", "module": "身边的算法", "points": ["循环结构"]},
        {"name": "英语·日常用语", "emoji": "📅", "points": ["星期表达", "What day is it today?"]},
        "📅 一周七天是个天然的循环！用程序员的脑子学英语：Monday 到 Sunday 就是循环体跑 7 遍。",
        "一周播报完美收官！Monday 到 Sunday 再也不是乱码——它们是有顺序、有周末、有盼头的一串日子。",
        band='junior', area='英语',
    ),

    # ---------------- 地理 3 课 ----------------
    lesson("geo-03", 109, "地图方位侦查兵", "🧭",
        "上北下南左西右东——地图的铁律！让角色在舞台上走方位：向北、向东、再转向南……走一遍，方位感就在脚下长出来了。",
        ["掌握地图方位法则", "用转向积木表达方位变化"],
        {"costume": "🧭", "x": 0, "y": 0},
        [
            t("t1", "出发报到：说「上北下南，左西右东!」", ["先背口诀再出发"], {"type": "say_text"}),
            t("t2", "向北侦查：向上移动 80 步（北是上方），说「North! 北!」", ["舞台上方就是北"], {"type": "block_count_min", "block": "island_move", "count": 1}),
            t("t3", "转向东进：右转 90 度，移动 80 步，说「East! 东!」", ["面向右转 90 度是东"], {"type": "block_count_min", "block": "island_turn_right", "count": 1}),
            t("c1", "⭐ 挑战：走一个「北→东→南→西」的完整方位圈，回到起点", ["走四边回原点就是绕一圈"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第二学段（3-6年级）", "module": "过程与控制", "points": ["方位与运动"]},
        {"name": "地理·地图三要素", "emoji": "🧭", "points": ["方向判定", "上北下南左西右东"]},
        "🧭 会看方向的人永远不会迷路！今天的舞台就是地图——上北下南左西右东，用脚走出来。",
        "方位侦查兵结业！你现在闭上眼都知道东南西北在哪儿——这是野外探险的第一项硬功夫。",
        targets=[{"emoji": "🗺️", "x": 80, "y": 80}],
        band='primary', area='地理',
    ),
    lesson("geo-04", 110, "海拔攀登队", "⛰️",
        "海平面是 0 米，珠峰是 8848 米——海拔就是离海平面的高度！用代码控制登山队沿 Y 轴爬升，每升一档报一次海拔：山脚、山腰、山顶……数学坐标直接变等高线！",
        ["理解海拔与等高线概念", "用 Y 坐标模拟海拔爬升"],
        {"costume": "🧗", "x": -100, "y": -100},
        [
            t("t1", "大本营报到：运行程序，登山队从海拔 -100（山脚）出发", ["y=-100 是起点"], {"type": "say_text"}),
            t("t2", "爬到山腰：程序在中途报「海拔升高！山腰到了」", ["y 逐步变大"], {"type": "say_text"}),
            t("t3", "登顶：到达山顶旗子处，报「8848 米！登顶成功!」", ["旗子就是山顶"], {"type": "actor_reach", "targetIndex": 0}),
            t("c1", "⭐ 挑战：让登山速度慢下来（等待变长），体会「越高越难爬」", ["真实登山也是越往上越慢"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第三学段（7-9年级）", "module": "过程与控制", "points": ["循环与坐标"]},
        {"name": "地理·地形与海拔", "emoji": "⛰️", "points": ["海拔概念", "等高线原理", "地形分层"]},
        "⛰️ 等高线图看得头晕？那是你没爬过！今天用 Y 坐标当海拔，亲手从山脚爬到山顶——等高线就是一圈圈的海拔刻度。",
        "登顶成功！你用代码理解了海拔：数字越高，离海平面越远。下次看地形图，想象自己在爬它！",
        targets=[{"emoji": "🚩", "x": -100, "y": 110}],
        code=True,
        starter="# 海拔攀登队：Y 坐标就是海拔\nsay(\"大本营！海拔 -100 米\")\nfor i in range(8):\n    go_to(-100, -100 + i * 30)\n    wait(0.2)\n    if i == 4:\n        say(\"山腰！呼吸有点急了\")\nsay(\"8848 米！登顶成功!\")\n",
        band='junior', area='地理',
    ),
    lesson("geo-05", 111, "时区环球旅行", "🕐",
        "北京晚上 8 点，纽约早上 7 点——地球是圆的，太阳照到哪儿哪儿就是白天！环球飞一圈，每停一站算当地时间：时差不再神秘，全是数学。",
        ["理解时区与经度关系", "用取余运算计算时差"],
        {"costume": "✈️", "x": -150, "y": 0},
        [
            t("t1", "起飞：说「环球时区之旅，出发!」", ["先报旅程名"], {"type": "say_text"}),
            t("t2", "经停三站：运行程序，飞机依次停靠并报出当地时区名", ["每 15 度经度差 1 小时"], {"type": "say_text"}),
            t("t3", "到达本初子午线：飞到 🌍 目标处，说「Greenwich! 0 度经线!」", ["0 度经线经过伦敦"], {"type": "actor_reach", "targetIndex": 0}),
            t("c1", "⭐ 挑战：算一算：北京 20 点时，纽约几点？（说给伙伴听）", ["北京比纽约快 13 小时左右"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第三学段（7-9年级）", "module": "过程与控制", "points": ["取余运算"]},
        {"name": "地理·地球与地图", "emoji": "🕐", "points": ["时区划分", "经度与时间", "东西半球"]},
        "🕐 为什么打越洋电话要看时间？因为地球在转，太阳在挪！今天飞一圈地球，你就懂了所有时差的秘密。",
        "环球完成！时区 = 经度 ÷ 15，这个公式你亲手用过。以后跟国外朋友约时间，你就是人肉时差计算器！",
        targets=[{"emoji": "🌍", "x": 150, "y": 0}],
        code=True,
        starter="# 时区环球旅行：每 15 度经度 = 1 小时时差\nsay(\"环球时区之旅，出发!\")\nfor i in range(6):\n    go_to(-150 + i * 60, 0)\n    wait(0.3)\n    if i == 2:\n        say(\"东京站：东九区，比北京快 1 小时\")\n    if i == 5:\n        say(\"Greenwich! 0 度经线，一切时间的起点!\")\n",
        band='senior', area='地理',
    ),

    # ---------------- 音乐 2 课 ----------------
    lesson("mus-02", 112, "音阶爬楼梯", "🎵",
        "do re mi fa sol la xi do——音阶像楼梯，一级比一级高！你的角色一边放音阶一边往上走：耳朵听音高，眼睛看高度，音乐理论变成看得见的台阶。",
        ["认识八度音阶顺序", "把音高和高度建立联觉"],
        {"costume": "🎹", "x": -150, "y": -80},
        [
            t("t1", "起音：播放 do，说「do——出发!」", ["音阶第一个音是 do"], {"type": "say_text"}),
            t("t2", "爬四级：播放 re、mi、fa、sol，每播一个向上移动 40 步", ["音高一级，人上一层"], {"type": "block_count_min", "block": "island_move", "count": 2}),
            t("t3", "到高音 do：爬完 la、xi，最后播 do（高）并到顶说「High do! 一个八度!」", ["从 do 到高音 do 共 8 个音"], {"type": "block_count_min", "block": "island_play", "count": 8}),
            t("c1", "⭐ 挑战：再倒着爬下来（do xi la sol...），体会音阶对称", ["倒过来也是音阶"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第二学段（3-6年级）", "module": "过程与控制", "points": ["顺序结构"]},
        {"name": "音乐·音阶与音高", "emoji": "🎵", "points": ["自然大调音阶", "八度概念"]},
        "🎵 声音有高低，楼梯有层级——今天把它们连起来！每上一层楼就是一个音，爬到顶你就唱完一个八度。",
        "一个八度爬完！do re mi fa sol la xi do 再也不是一串咒语——它们是你脚下的八级台阶。",
        targets=[{"emoji": "🎯", "x": -150, "y": 120}],
        band='primary', area='音乐',
    ),
    lesson("mus-03", 113, "节奏编程大师", "🥁",
        "动次打次、动次打次——节奏就是时间的代码！快节奏 = 等待短，慢节奏 = 等待长。今天用循环和等待写出你的第一段电子鼓点。",
        ["理解节拍与速度（BPM）", "用循环+等待构造节奏型"],
        {"costume": "🥁", "x": 0, "y": 0},
        [
            t("t1", "打第一拍：播放「砰」，说「动!」", ["砰就是底鼓"], {"type": "say_text"}),
            t("t2", "四拍循环：用重复 4 次积木，里面放「播放+等待 0.5」", ["0.5 秒一拍是标准节奏"], {"type": "block_count_min", "block": "island_repeat", "count": 1}),
            t("t3", "加速度：再写一段等待 0.25 的循环，节奏明显变快", ["等待减半，速度快一倍"], {"type": "block_count_min", "block": "island_wait", "count": 2}),
            t("c1", "⭐ 挑战：混搭两种节奏——先慢 4 拍再快 8 拍，演出层次感", ["慢起快收最带感"], {"type": "manual"}, optional=True),
        ],
        {"stage": "第三学段（7-9年级）", "module": "过程与控制", "points": ["循环与延时"]},
        {"name": "音乐·节奏与节拍", "emoji": "🥁", "points": ["节拍概念", "BPM 与速度"]},
        "🥁 电子音乐人也是程序员——他们用循环和延时写歌！今天你写的是节奏：动次打次的秘密全在「等待」积木里。",
        "节奏大师出道！你已经发现了音乐和代码的共同秘密：节奏 = 声音 + 时间间隔。说不定未来的电音大神就是你！",
        band='junior', area='音乐',
    ),
]

# 每课 3 道练习
EXERCISES = {
    "eng-03": [
        ex("字母表一共有多少个字母？", ["23 个", "26 个", "28 个", "30 个"], 1, "26 个字母从 A 到 Z，是英语世界的基石。"),
        ex("字母表中 A 的下一个是？", ["B", "C", "D", "E"], 0, "A B C D E F G……字母歌就是这么唱的！"),
        ex("下面哪个是小写字母？", ["A", "B", "c", "D"], 2, "大写 A B D，小写 c——每个字母都有大小写两副面孔。"),
    ],
    "eng-04": [
        ex("数字 3 的英文是？", ["two", "three", "tree", "ten"], 1, "three 是 3；tree 是树，发音相近别混淆！"),
        ex("「one, two, ___」横线处是？", ["four", "five", "three", "six"], 2, "one two three——数数顺序不能乱。"),
        ex("英语问「多少」用哪个词？", ["How many", "How old", "What", "Where"], 0, "How many 问数量，How old 问年龄。"),
    ],
    "eng-05": [
        ex("「红色」的英文是？", ["blue", "green", "red", "yellow"], 2, "red 红色——红旗 red flag。"),
        ex("苹果常见的颜色用英语说是？", ["red", "black", "purple", "pink"], 0, "Red apple！红色的苹果最常见。"),
        ex("「What color is it?」是在问什么？", ["这是什么", "它是什么颜色", "它在哪儿", "它是谁的"], 1, "color 是颜色——这句问的是颜色。"),
    ],
    "eng-06": [
        ex("自我介绍名字应该说：", ["I am nine.", "My name is Lily.", "I like fish.", "How are you?"], 1, "My name is + 名字，这是报姓名的标准句型。"),
        ex("「I am ten years old.」说的是？", ["名字", "年龄", "爱好", "家庭"], 1, "years old 表示岁数——我十岁了。"),
        ex("表达爱好应该用哪个句型？", ["I am...", "I have...", "I like...", "I can..."], 2, "I like + 事物/doing，表达喜欢什么。"),
    ],
    "eng-07": [
        ex("问对方名字应该说：", ["What's your name?", "How are you?", "How old are you?", "What's this?"], 0, "What's your name? 是问姓名的标准问句。"),
        ex("别人说「Nice to meet you!」你应该回：", ["Thank you!", "Nice to meet you, too!", "Goodbye!", "I'm fine."], 1, "too 表示「也」——很高兴见到你，我也是！"),
        ex("「How old are you?」是在问？", ["名字", "年龄", "爱好", "时间"], 1, "how old 固定搭配，问多大年纪。"),
    ],
    "eng-08": [
        ex("一周有几天？", ["5 天", "6 天", "7 天", "8 天"], 2, "Monday 到 Sunday 共 7 天——正好是一个循环！"),
        ex("「星期六」的英文是？", ["Sunday", "Saturday", "Monday", "Friday"], 1, "Saturday 周六，Sunday 周日——周末两兄弟。"),
        ex("一周的第一天（国际惯例）是？", ["Monday", "Sunday", "Saturday", "Tuesday"], 1, "国际惯例 Sunday 是一周第一天，中国习惯把 Monday 当第一天。"),
    ],
    "geo-03": [
        ex("地图上「上方」通常表示哪个方向？", ["南", "北", "东", "西"], 1, "上北下南左西右东——地图的铁口诀。"),
        ex("你面向北站着，右手边是？", ["东", "西", "南", "北"], 0, "面北而立，右东左西，背后是南。"),
        ex("指南针的作用是？", ["量距离", "辨方向", "测温度", "看时间"], 1, "指南针靠地磁指向南北，是辨方向的祖师爷。"),
    ],
    "geo-04": [
        ex("海拔是指距离哪个面的高度？", ["地面", "海平面", "山顶", "赤道"], 1, "海拔 = 某点相对于海平面的垂直高度。"),
        ex("珠穆朗玛峰的海拔约是？", ["884 米", "4880 米", "8848 米", "18848 米"], 2, "8848.86 米（2020 年测定）——世界第三极！"),
        ex("等高线越密集说明地形？", ["越平坦", "坡越陡", "海拔越低", "离海越近"], 1, "等高线挤在一起 = 高度快速变化 = 陡坡！"),
    ],
    "geo-05": [
        ex("地球上每差多少经度，时间差 1 小时？", ["10 度", "15 度", "30 度", "45 度"], 1, "360° ÷ 24 小时 = 15°/小时。"),
        ex("本初子午线（0 度经线）经过哪里？", ["巴黎", "纽约", "伦敦格林尼治", "北京"], 2, "英国伦敦格林尼治天文台——世界时间的起点。"),
        ex("北京是晚上 8 点时，地球另一侧的纽约大约是？", ["早上 7 点", "中午 12 点", "晚上 8 点", "凌晨 1 点"], 0, "北京比纽约快约 13 小时：20 - 13 = 早 7 点。"),
    ],
    "mus-02": [
        ex("自然大调音阶的顺序是？", ["do mi re fa...", "do re mi fa sol la xi do", "do do re re mi", "la xi do re..."], 1, "do re mi fa sol la xi do（高）——音乐课必唱！"),
        ex("从 do 到高音 do 叫做？", ["半个八度", "一个八度", "两个八度", "四分之一"], 1, "8 个音组成一个八度（octave）。"),
        ex("音阶中「fa」后面是哪个音？", ["mi", "re", "sol", "la"], 2, "do re mi fa sol——fa 的下一个是 sol。"),
    ],
    "mus-03": [
        ex("节奏变快，应该把「等待」积木的秒数？", ["变大", "变小", "不变", "删掉"], 1, "等待越短，拍子越密，节奏越快。"),
        ex("BPM 指的是？", ["每分钟拍数", "音量大小", "音高高低", "乐器数量"], 0, "Beats Per Minute——每分钟多少拍，音乐的时速表。"),
        ex("「动次打次」中「动」通常是？", ["高音镲", "底鼓", "人声", "贝斯"], 1, "动 = 底鼓（低沉有力），次 = 镲片（清脆）。"),
    ],
}

for l in LESSONS:
    l["exercises"] = EXERCISES[l["id"]]
    path = os.path.join(OUT, f"{l['id']}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(l, f, ensure_ascii=False, indent=2)
    print("生成", path)
print("完成：新增", len(LESSONS), "课")
