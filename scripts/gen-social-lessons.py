# -*- coding: utf-8 -*-
"""交叉学院扩展：英语 2 + 地理 2 + 化学进阶 1 + 语文进阶 1（order 35-40）"""
import json, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'content', 'lessons')

def lesson(id, order, title, emoji, story, goals, toolbox, actor, targets, tasks, subj, curr, intro, celeb, code=False, starter=None):
    d = {
        "id": id, "island": "cross", "order": order, "title": title, "emoji": emoji,
        "story": story, "goals": goals, "toolbox": toolbox, "actor": actor,
        "tasks": tasks,
        "curriculum": curr, "subject": subj,
        "aiIntro": intro, "celebrate": celeb,
    }
    if targets: d["targets"] = targets
    if code:
        d["codeLesson"] = True
        d["starterCode"] = starter
    with open(os.path.join(OUT, id + '.json'), 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=2)

def T(id, text, hints, check, opt=False):
    t = {"id": id, "text": text, "hintPrompts": hints, "check": check}
    if opt: t["optional"] = True
    return t

BR = ["island_when_run","island_say","island_say_for","island_move","island_turn_right","island_turn_left","island_goto","island_wait","island_play","island_repeat","island_number","island_random","island_costume","island_change_size"]
PY = []

# ================= 英语 =================

lesson("cross-14", 35, "英语单词快闪剧场", "🔤",
"英语要开口说！让角色当你的脱口秀搭档：说 Hello、报单词、喊口号——每句话都是一块「说」积木。今天的任务只有一个：大声把英语说出来（拼对了才好玩）！",
["开口说基础英语问候与单词","把英文句子和动作连起来"],
BR, {"costume":"🎤","x":0,"y":0},
None,
[
 T("t1","开场问候：让角色说「Hello! My name is Neo!」（名字换成你自己的英文名）",["「说」积木里直接打英文"],{"type":"say_text"}),
 T("t2","单词三连：连说 apple、banana、orange 三个单词，每个配一个音效",["说一个词播一个音，节奏感出来"],{"type":"block_count_min","block":"island_say","count":3}),
 T("t3","互动问答：说「How are you?」等 1 秒，再说「I am fine, thank you!」",["用「等待」模拟一问一答的停顿"],{"type":"block_count_min","block":"island_say","count":5}),
 T("c1","⭐ 挑战：演一段 3 句的自我介绍（名字、年龄、喜欢的食物），全英文",["My name is... / I am ... years old / I like ..."],{"type":"manual"},opt=True),
],
{"name":"英语·口语表达","emoji":"🔤","points":["日常问候用语","常见单词","自我介绍句型"]},
{"stage":"第二学段（3-6年级）","module":"身边的算法","points":["顺序结构与台词"]},
"🎤 Welcome to English Theater! 今天不背单词表——你的角色替你说、你听、你笑。英语是说出来会的，不是背出来会的！",
"You did it! 开口说英语的第一关过了！记住这个感觉：说错没关系，说出来就赢。你的角色已经是你的英语搭档了 🔤")

lesson("cross-15", 36, "英语数字报数员", "🔢",
"one two three four five——用程序报数学英文数字！for 循环从 1 数到 5，if 判断当前数字该说哪个英文单词。改一个数字，全场跟着换——这就是「变量」的魔力英语课。",
["掌握 one 到 ten 英文数字","练习 if 条件判断"],
PY, {"costume":"🦜","x":0,"y":0},
None,
[
 T("t1","运行程序：鹦鹉从 one 报到 five，一个不落",["for i in range(1, 6) 让 i 从 1 走到 5；if i == 1 就说 one"],{"type":"say_text"}),
 T("t2","扩展报数：加上 six 到 ten（再复制五组 if），看鹦鹉报到十",["照着上面的样子写 if i == 6: say(\"six\")"],{"type":"manual"}),
 T("t3","倒着数：改成 range(5, 0, -1)？我们不支持倒序——那就手动把五组 say 倒着排！报 five four three two one",["倒着报数 = 顺序反过来写"],{"type":"manual"}),
 T("c1","⭐ 挑战：数到几就跳几步：if i == 3 时顺便 move(30)，数到 5 时播放欢呼",["报数+动作结合，全英语沉浸"],{"type":"manual"},opt=True),
],
{"name":"英语·数字与句型","emoji":"🔢","points":["one~ten 英文数字","数字与动作结合"]},
{"stage":"第二学段（3-6年级）","module":"身边的算法","points":["循环变量与多重条件"]},
"🦜 Polly wants a cracker... and numbers! 今天你的鹦鹉学会用英语报数——它会一个一个判断再开口，跟小学生数数一模一样。",
"英语报数通关！one 到 ten 你已经用程序验证过——顺便你还练了 if 判断。英语+编程，一次学两样，这就是交叉学院的效率 🔢",
code=True,
starter='''# 英语数字报数员：one 到 five
for i in range(1, 6):
    if i == 1:
        say("one")
    if i == 2:
        say("two")
    if i == 3:
        say("three")
    if i == 4:
        say("four")
    if i == 5:
        say("five")
        play("cheer")
''')

# ================= 地理 =================

lesson("cross-16", 37, "地球公转与四季", "🌍",
"地球绕太阳转一圈 = 一年，转过四个关键位置 = 春夏秋冬！用 cos 和 sin 让地球沿圆形轨道飞行，每飞过 90° 就报一个节气——高中三角函数落地地理课，转一圈你就懂了四季怎么来的。",
["理解地球公转与四季成因","用圆周运动模拟轨道"],
PY, {"costume":"🌍","x":130,"y":0},
[{"emoji":"☀️","x":0,"y":0}],
[
 T("t1","运行程序：地球沿圆形轨道绕太阳飞行一圈（36 步 × 10°）",["cos(angle)*130 和 sin(angle)*130 算出轨道上每一点"],{"type":"actor_reach","targetIndex":0}),
 T("t2","四季报时：程序在四个关键位置报「春分/夏至/秋分/冬至」",["每 9 步（90°）报一个节气"],{"type":"say_text"}),
 T("t3","思考题（说给伙伴听）：为什么夏至时北半球最热？——地轴是斜的！",["太阳直射北回归线，阳光更集中"],{"type":"manual"}),
 T("c1","⭐ 挑战：转两圈（range(72)），第二圈报「第二年的春…」",["公转一圈是一年，两圈两年"],{"type":"manual"},opt=True),
],
{"name":"地理·地球运动","emoji":"🌍","points":["地球公转","四季与节气成因","轨道是圆周运动"]},
{"stage":"第四学段（7-9年级）衔接高中地理","module":"过程与控制","points":["三角函数模拟轨道"]},
"🌍 地理课最抽象的一节：为什么有四季？课本画个斜着的地球你也未必懂——今天你亲手让地球飞起来，转完这一圈，四季不再神秘。",
"四季之谜破解！你用 cos 和 sin 画出了地球的真实轨道——高中地理和高中数学在这一刻合体。开普勒看了都点赞 🌍",
code=True,
starter='''# 地球公转与四季：轨道半径 130
for i in range(37):
    angle = i * 10
    go_to(cos(angle) * 130, sin(angle) * 130)
    wait(0.1)
    if i == 9:
        say("\u590f\u81f3\uff01\u5317\u534a\u7403\u76f4\u5c04\u5317\u56de\u5f52\u7ebf")
    if i == 18:
        say("\u79cb\u5206\uff01\u9633\u5149\u76f4\u5c04\u8d64\u9053")
    if i == 27:
        say("\u51ac\u81f3\uff01\u5317\u534a\u7403\u9633\u5149\u6700\u659c")
''')

lesson("cross-17", 38, "纬度带探险", "🧭",
"舞台的竖线就是经线！从赤道出发一路向北：赤道最热、北回归线是热带的北边界、北极圈里全是冰雪。让探险家走三站，每一站都是地球上一条真实的纬线。",
["认识赤道、回归线与极圈","了解五带与气候分布"],
BR, {"costume":"🧭","x":-60,"y":-110},
[{"emoji":"🌊","x":-60,"y":-100},{"emoji":"🌴","x":-60,"y":0},{"emoji":"❄️","x":-60,"y":100}],
[
 T("t1","第一站·赤道 🌊：移到赤道（y=-100 的位置），说「赤道最热，阳光直射！」",["「移到 y:-100」——舞台竖轴就是纬度"],{"type":"actor_reach","targetIndex":0}),
 T("t2","第二站·北回归线 🌴（y=0）：说「热带的北边界，北纬 23.5°！」",["回归线附近沙漠多——撒哈拉就在这"],{"type":"actor_reach","targetIndex":1}),
 T("t3","第三站·北极圈 ❄️（y=100）：说「极昼极夜出现的地方，北纬 66.5°！」",["夏天太阳不落、冬天太阳不升"],{"type":"actor_reach","targetIndex":2}),
 T("c1","⭐ 挑战：一口气从赤道走到北极圈，每站配不同造型（🌴→🍂→❄️）表现气候变冷",["越走越北越冷——纬度决定气候"],{"type":"block_used","block":"island_costume"},opt=True),
],
{"name":"地理·纬度与气候","emoji":"🧭","points":["赤道与回归线","极圈与五带","纬度影响气候"]},
{"stage":"第三学段（5-6年级）衔接初中地理","module":"过程与控制","points":["坐标即地理模型"]},
"🧭 纬度带探险队出发！从炎热的赤道一路向北走到冰天雪地的北极圈——三站路，走完你就懂了为什么「越北越冷」。",
"三站通关！你用舞台的 y 坐标当纬度走了一遍地球——从赤道到北极圈，热温寒三带刻进了脚步里。地理考试的经纬网图，从此就是你的舞台 🌐")

# ================= 化学进阶 =================

lesson("cross-18", 39, "质量守恒验证器", "⚖️",
"2H₂ + O₂ = 2H₂O——方程式凭什么成立？因为反应前后原子一个不多一个不少（质量守恒定律）！用变量数一数两边的氢原子和氧原子：左边=右边，配平成功；不等，就得调整系数。",
["理解质量守恒定律","学会检查方程式配平"],
PY, {"costume":"⚗️","x":0,"y":0},
None,
[
 T("t1","运行程序：数出 2H₂+O₂ 两边的 H 原子和 O 原子数，验证左右相等",["H 左边：2个H₂×2=4个；O 左边：O₂×2=2个"],{"type":"say_text"}),
 T("t2","破坏实验：把右边 2H₂O 改成 H₂O（水只写 1 个），再跑——两边不等了！说「没配平！」",["右边 H 只有 2 个 ≠ 左边 4 个"],{"type":"manual"}),
 T("t3","修复配平：把右边改回 2，守恒恢复——这就是配平的过程！",["系数就是调到两边相等为止"],{"type":"manual"}),
 T("c1","⭐ 挑战：配平 CH₄ + 2O₂ = CO₂ + 2H₂O——用程序数 C、H、O 三种原子验证",["C:1=1，H:4=4，O:4=4 ✓"],{"type":"manual"},opt=True),
],
{"name":"化学·化学方程式（初中）","emoji":"⚖️","points":["质量守恒定律","化学方程式的配平","原子个数前后相等"]},
{"stage":"第四学段（9年级）","module":"身边的算法","points":["变量对比验证"]},
"⚗️ 化学反应不是魔法：原子只是重新排队，一个都不会多、一个都不会少。今天你写程序当「配平检查员」——这可是化学老师批改作业时干的事！",
"质量守恒验证通过！你不是背了「配平」——你是像化学家一样数了原子。初中化学最容易被扣分的配平题，你已经会写程序自动检查了 ⚖️",
code=True,
starter='''# 质量守恒验证：2H2 + O2 = 2H2O
h_left = 2 * 2     # 2 个 H2，每个 2 个氢原子
o_left = 2         # 1 个 O2，2 个氧原子
h_right = 2 * 2    # 2 个 H2O，每个 2 个氢
o_right = 2        # 2 个 H2O，每个 1 个氧

say("H: 左边 " + h_left + " 个 vs 右边 " + h_right + " 个")
say("O: 左边 " + o_left + " 个 vs 右边 " + o_right + " 个")

if h_left == h_right:
    say("氢原子守恒，配平正确！")
''')

# ================= 语文进阶 =================

lesson("cross-19", 40, "成语动作剧场：画蛇添足", "🎭",
"画蛇添足——多此一举！这个成语今天由你演出来：先认真「画」一条蛇（走一条 S 形路线），蛇成了宣布完工，然后……手贱给它添四只脚！演完这个典故，这个成语一辈子忘不了。",
["理解成语「画蛇添足」的寓意","用动作序列演典故"],
BR, {"costume":"🐍","x":-140,"y":60,"dir":45},
[{"emoji":"🍷","x":130,"y":-40}],
[
 T("t1","画蛇身：重复 4 次 { 移动 70， 右转 60， 移动 70， 左转 60 }——走出一条弯弯的 S 形蛇",["重复里放两组「移动+转向」，蛇身就扭起来了"],{"type":"block_used","block":"island_repeat"}),
 T("t2","宣布完工：走到酒杯 🍷 旁边，说「蛇先画完，酒是我的了！」",["典故里：最先画完蛇的人赢得那壶酒"],{"type":"actor_reach","targetIndex":0}),
 T("t3","手贱时刻：回去「添足」——在蛇尾画四只小脚（移动小段×4），然后说「哎呀，多此一举！」",["给蛇添脚 = 丢了酒——成语的教训来了"],{"type":"say_text"}),
 T("c1","⭐ 挑战：再演一个「守株待兔」：角色站着不动等待 3 秒，说「兔子没来，田却荒了…」",["不劳而获的教训"],{"type":"manual"},opt=True),
],
{"name":"语文·成语典故","emoji":"🎭","points":["成语「画蛇添足」","典故的表演化理解","寓意：多余的反而坏事"]},
{"stage":"第二、三学段（3-6年级）","module":"身边的算法","points":["动作序列编排"]},
"🎭 今天的剧场排的是两千年前楚国的故事：一群人比赛画蛇，赢的人得意忘形给蛇添了脚——结果酒没了。你是导演兼主演，开演！",
"演出成功！「画蛇添足」不再是一个要背的成语——它是你亲手演过的故事。语文里几百个成语，都能这么「演」着学 🎭")

print('6 social/english lessons written')
