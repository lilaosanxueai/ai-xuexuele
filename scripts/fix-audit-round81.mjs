import fs from 'node:fs';
import path from 'node:path';

/**
 * 第81轮：按体检报告修复 15 节问题课。
 * - 3 节跑挂（art-07 未赋值 / cross-72 除零 / meta-04 未定义变量）→ 修复逻辑
 * - 6 节空白舞台（只 say 不画图：ai-07/08/09、cross-15/75、extra-03）→ 重写为真实可视化
 * - 4 节空壳（eng-09/eng-12/mus-06/sci-14 只有两行字）→ 补参数驱动的完整内容
 * - 2 节细长（geo-05/math-31 数轴本就该宽）→ 加标题横幅改善构图
 * 用法: npx tsx scripts/fix-audit-round81.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const FIX = {
  'art-07': {
    params: [{ name: 'focus', label: '聚焦原则', min: 1, max: 3, step: 1, value: 1 }],
    code: `# 设计原则探索台：聚焦哪条原则？
focus = 1   # 聚焦：1实用 2经济 3美观

hide()
fill_rect(0, 140, 330, 34, "#2563eb")
write("好设计三足鼎立：实用 · 经济 · 美观", 0, 140, "#fff", 13)
i = 0
while i < 3:
    x = -105 + i * 105
    if i == 0:
        h = 130
        nm = "实用"
        d1 = "好不好用最要紧"
        d2 = "椅子高≈小腿长"
    if i == 1:
        h = 85
        nm = "经济"
        d1 = "成本可控做得成"
        d2 = "材料工艺要匹配"
    if i == 2:
        h = 50
        nm = "美观"
        d1 = "看着舒服想拥有"
        d2 = "比例色彩有秩序"
    if i + 1 == focus:
        nmc = "#1d4ed8"
        bg = "#2563eb"
    if i + 1 != focus:
        nmc = "#64748b"
        bg = "#94a3b8"
    fill_rect(x, -34 + h / 2, 96, h, bg)
    write(nm, x, -22 + h, nmc, 15)
    write(d1, x, -50 + h, "#ffffff", 9)
    write(d2, x, -66 + h, "#ffffff", 9)
    if i + 1 == focus:
        fill_rect(x, -40, 86, 6, "#2563eb")
    i = i + 1
write("设计流程：发现问题 → 构思方案 → 打样测试 → 改进", 0, -108, "#b45309", 11)
write("拖动滑块聚焦一条原则：名称会变蓝并亮蓝条", 0, -128, "#64748b", 10)`,
  },
  'cross-72': {
    patch: (code) => code.includes('if short < 1') ? code : code.replace('ratio = tall / short', 'if short < 1:\n    short = 1\nif tall < 1:\n    tall = 1\nratio = tall / short'),
  },
  'meta-04': {
    params: [{ name: 'st', label: '阅读第几步', min: 1, max: 5, step: 1, value: 1 }],
    code: `# 教科书阅读五步法：拖动滑块走一遍
st = 1   # 阅读第几步（1~5）

hide()
if st == 1:
    cur_step = "第 1 步 · 预习提问"
    cur_desc = "读标题、看插图，猜这课讲什么"
    cur_tip = "带着问题读，比闷头读快 3 倍"
if st == 2:
    cur_step = "第 2 步 · 通读圈画"
    cur_desc = "快速读一遍，圈出不认识的词"
    cur_tip = "第一遍不抠细节，先抓大貌"
if st == 3:
    cur_step = "第 3 步 · 精读标记"
    cur_desc = "细读重点段落，划出关键句"
    cur_tip = "一段话往往只有一个中心句"
if st == 4:
    cur_step = "第 4 步 · 追问答疑"
    cur_desc = "把没懂的问出来：问老师、问同学"
    cur_tip = "能提出好问题 = 真读懂了一半"
if st == 5:
    cur_step = "第 5 步 · 合书复述"
    cur_desc = "合上书，用自己的话讲一遍"
    cur_tip = "讲不出来的地方 = 没学会的地方"
fill_rect(0, 130, 340, 32, "#1d4ed8")
write(cur_step, 0, 130, "#fff", 13)
fill_rect(0, 76, 340, 42, "#eff6ff")
write(cur_desc, 0, 76, "#1d4ed8", 11)
fill_rect(0, 16, 340, 52, "#fef3c7")
write("要领：" + cur_tip, 0, 16, "#b45309", 11)
i = 0
while i < 5:
    x = -120 + i * 60
    if i + 1 <= st:
        circle(x, -50, 20, "#1d4ed8")
    if i + 1 > st:
        circle(x, -50, 20, "#e2e8f0")
    if i + 1 <= st:
        write(i + 1, x, -50, "#fff", 11)
    if i + 1 > st:
        write(i + 1, x, -50, "#94a3b8", 11)
    i = i + 1
write("读书五步：预习 → 通读 → 精读 → 追问 → 复述", 0, -110, "#64748b", 11)`,
  },
  'ai-07': {
    params: [{ name: 'secret', label: '目标数', min: 1, max: 100, step: 1, value: 50 }],
    code: `# 二分查找：每次猜中间，范围砍一半！
secret = 50   # 程序心里想的数（1~100）

hide()
fill_rect(0, 140, 330, 34, "#2563eb")
write("二分查找：每猜一次，范围砍一半", 0, 140, "#fff", 13)
write("不管目标数是几，最多 7 次必中", 0, 114, "#64748b", 10)
left = 100
k = 0
while k < 7:
    y = 88 - k * 32
    w = left * 3.1
    fill_rect(20, y, w, 22, "#10b981")
    write("第" + (k + 1) + "次", -158, y, "#64748b", 10)
    write("剩 " + left + " 个", 20 + w / 2 + 34, y, "#065f46", 10)
    q = 0
    r = left
    while r >= 2:
        r = r - 2
        q = q + 1
    left = q
    k = k + 1
write("100 个数：7 次必中；顺序找最多 100 次", 0, -132, "#dc2626", 12)`,
  },
  'ai-08': {
    params: [{ name: 'round', label: '看第几趟', min: 1, max: 2, step: 1, value: 1 }],
    code: `# 冒泡排序：相邻比较，大的往后冒
round = 1   # 看第几趟（1~2）

hide()
fill_rect(0, 140, 330, 34, "#2563eb")
write("冒泡排序：相邻两个比，大的往后冒", 0, 140, "#fff", 13)
if round == 1:
    v1 = 3
    v2 = 1
    v3 = 2
    tag = "排队前：3 1 2"
if round == 2:
    v1 = 1
    v2 = 2
    v3 = 3
    tag = "排好队：1 2 3"
i = 0
while i < 3:
    x = -90 + i * 90
    if i == 0:
        v = v1
    if i == 1:
        v = v2
    if i == 2:
        v = v3
    fill_rect(x, -40 + v * 18, 60, v * 36, "#7dd3fc")
    write(v, x, -28 + v * 36, "#0369a1", 14)
    write("第" + (i + 1) + "位", x, -60, "#64748b", 10)
    i = i + 1
write(tag, 0, 116, "#b45309", 12)
write("第1趟：3和1换、1和2换 → 1 3 2", 0, -96, "#64748b", 10)
write("第2趟：3和2换 → 1 2 3 完成！", 0, -118, "#64748b", 10)`,
  },
  'ai-09': {
    params: [{ name: 'n', label: '数据规模 n', min: 10, max: 1000, step: 10, value: 100 }],
    code: `# 算法竞速：同样找 1 个数，步数天差地别
n = 100   # 数据规模 n

hide()
fill_rect(0, 140, 330, 34, "#2563eb")
write("算法快慢：数一数步数（n = " + n + "）", 0, 140, "#fff", 13)
cnt = 0
left = n
while left > 1:
    left = left / 2
    cnt = cnt + 1
write("二分查找 ≈ " + cnt + " 步", 0, 104, "#047857", 11)
fill_rect(0, 88, 320, 20, "#10b981")
write("顺序查找 = " + n + " 步", 0, 64, "#b45309", 11)
fill_rect(0, 48, 320, 20, "#f59e0b")
write("冒泡排序 = " + (n * n) + " 步", 0, 24, "#be123c", 11)
fill_rect(0, 8, 320, 20, "#f43f5e")
write("条一样长？差距太大画不下——", 0, -24, "#64748b", 10)
write("如果画准：绿的 " + cnt + "，黄的 " + n + "，红的 " + (n * n) + "！", 0, -46, "#64748b", 10)
write("n 变 10 倍：二分只多几步，排序慢 100 倍", 0, -74, "#dc2626", 11)`,
  },
  'cross-15': {
    params: [{ name: 'num', label: '报到几', min: 1, max: 5, step: 1, value: 5 }],
    code: `# 英语数字报数员：one 到 five
num = 5   # 报到几（1~5）

hide()
fill_rect(0, 140, 330, 34, "#2563eb")
write("英语数字报数员：跟我一起数！", 0, 140, "#fff", 13)
i = 0
while i < num:
    x = -120 + i * 60
    y = 60 - i * 12
    if i == 0:
        wd = "one"
    if i == 1:
        wd = "two"
    if i == 2:
        wd = "three"
    if i == 3:
        wd = "four"
    if i == 4:
        wd = "five"
    circle(x, y, 24, "#fde68a")
    write(i + 1, x, y, "#b45309", 15)
    write(wd, x, y - 40, "#0369a1", 12)
    i = i + 1
write("数词要背熟：one two three four five", 0, -90, "#64748b", 11)`,
  },
  'cross-75': {
    params: [{ name: 'semi', label: '升几个半音', min: 0, max: 12, step: 1, value: 12 }],
    code: `# 十二平均律：每升半音频率 × 1.0595
semi = 12   # 升几个半音（0~12）

hide()
fill_rect(0, 140, 330, 34, "#2563eb")
write("十二平均律：频率一格格翻着涨", 0, 140, "#fff", 13)
i = 0
while i <= semi:
    h = 4 + i * 9
    x = -150 + i * 25
    fill_rect(x, -70 + h / 2, 16, h, "#7dd3fc")
    i = i + 1
write("do 262Hz", -150, -90, "#0369a1", 9)
write("高音do 524Hz", 145, 62, "#dc2626", 10)
write("12 个半音正好翻一倍：262 × 2 = 524", 0, -108, "#b45309", 11)
write("每升半音频率 × 1.0595（2 的 1/12 次方）", 0, -130, "#64748b", 10)`,
  },
  'extra-03': {
    code: `# 欢迎来到 Python 的世界！
# 下面这些字就是真正的代码——点「▶ 慢速看过程」看它怎么画图
hide()
go_to(-70, -20)
pen_color("#2563eb")
pen_down()
i = 0
while i < 4:
    move(110)
    turn_right(90)
    i = i + 1
pen_up()
write("你好，Python！", 0, 115, "#dc2626", 15)
write("这个方块就是 4 行循环画出来的", 0, -60, "#2563eb", 12)
write("去「⌨ 代码」里改改 move(110) 的数字试试？", 0, -85, "#64748b", 10)`,
  },
  'eng-09': {
    params: [{ name: 'verb', label: '哪类动词', min: 1, max: 3, step: 1, value: 1 }],
    code: `# 一般过去时：动词怎么变？
verb = 1   # 哪类动词（1~3）

hide()
fill_rect(0, 140, 330, 34, "#2563eb")
write("一般过去时：昨天的事，动词要变形", 0, 140, "#fff", 13)
if verb == 1:
    t1 = "规则动词 + ed"
    e1 = "play → played"
    e2 = "watch → watched"
if verb == 2:
    t1 = "结尾是 e 只 + d"
    e1 = "like → liked"
    e2 = "live → lived"
if verb == 3:
    t1 = "不规则动词要背"
    e1 = "go → went"
    e2 = "eat → ate"
fill_rect(0, 80, 300, 48, "#fde68a")
write(t1, 0, 90, "#b45309", 13)
write(e1, 0, 66, "#334155", 12)
write(e2, 0, 44, "#334155", 12)
fill_rect(0, 0, 300, 58, "#eff6ff")
write("口诀：did 后用原形", 0, 16, "#1d4ed8", 12)
write("did not 后也用原形", 0, -6, "#1d4ed8", 12)
write("否定例：I didn't go.", 0, -24, "#64748b", 10)
write("标志词：yesterday · last week · 2 days ago", 0, -60, "#ea580c", 11)`,
  },
  'eng-12': {
    params: [{ name: 'scene', label: '哪个场景', min: 1, max: 3, step: 1, value: 1 }],
    code: `# 现在进行时：Be + V-ing
scene = 1   # 哪个场景（1~3）

hide()
fill_rect(0, 140, 330, 34, "#059669")
write("现在进行时：Be + V-ing = 正在做", 0, 140, "#fff", 13)
if scene == 1:
    s1 = "I am reading a book."
    s2 = "我正在读书"
if scene == 2:
    s1 = "She is cooking dinner."
    s2 = "她正在做晚饭"
if scene == 3:
    s1 = "They are playing football."
    s2 = "他们正在踢球"
fill_rect(0, 80, 310, 48, "#d1fae5")
write(s1, 0, 90, "#065f46", 13)
write(s2, 0, 66, "#334155", 11)
write("V-ing 规则：+ing / 去e+ing / 双写+ing", 0, 24, "#7c3aed", 11)
write("标志词：now · look! · listen!", 0, 0, "#b45309", 11)
write("对比：She reads every day.（习惯用一般现在时）", 0, -30, "#64748b", 10)`,
  },
  'mus-06': {
    params: [{ name: 'family', label: '乐器家族', min: 1, max: 4, step: 1, value: 1 }],
    code: `# 民族乐器四大家族
family = 1   # 家族（1吹 2拉 3弹 4打）

hide()
fill_rect(0, 140, 330, 34, "#7c3aed")
write("民族乐器四大家族", 0, 140, "#fff", 13)
if family == 1:
    em = "🎼"
    nm = "吹管家族"
    d1 = "笛子 · 箫 · 唢呐"
    d2 = "吹出旋律，是乐队骨干"
if family == 2:
    em = "🎻"
    nm = "拉弦家族"
    d1 = "二胡 · 高胡 · 马头琴"
    d2 = "弓弦相摩，最像人声"
if family == 3:
    em = "🎸"
    nm = "弹拨家族"
    d1 = "琵琶 · 古筝 · 柳琴"
    d2 = "手指拨弦，大珠小珠"
if family == 4:
    em = "🥁"
    nm = "打击家族"
    d1 = "鼓 · 锣 · 钹 · 木鱼"
    d2 = "掌管节奏，全场指挥"
write(em, 0, 85, "#000", 34)
write(nm, 0, 40, "#6d28d9", 15)
fill_rect(0, 5, 300, 52, "#ede9fe")
write(d1, 0, 16, "#334155", 12)
write(d2, 0, -6, "#64748b", 10)
write("四家族合奏 = 民族管弦乐", 0, -55, "#b45309", 11)`,
  },
  'sci-14': {
    params: [{ name: 'rock', label: '岩石类型', min: 1, max: 3, step: 1, value: 1 }],
    code: `# 三大岩石：火成 · 沉积 · 变质
rock = 1   # 岩石类型（1~3）

hide()
fill_rect(0, 140, 330, 34, "#b45309")
write("三大岩石：石头也会转世", 0, 140, "#fff", 13)
if rock == 1:
    nm = "火成岩"
    d1 = "岩浆冷凝而成"
    e1 = "花岗岩 · 玄武岩"
    d2 = "常有晶体颗粒，硬！"
if rock == 2:
    nm = "沉积岩"
    d1 = "碎屑一层层压成"
    e1 = "砂岩 · 石灰岩 · 页岩"
    d2 = "常有化石和层理"
if rock == 3:
    nm = "变质岩"
    d1 = "深埋高温高压变质"
    e1 = "大理岩 · 板岩 · 片麻岩"
    d2 = "条纹片理，会变形"
write(nm, 0, 90, "#b45309", 16)
fill_rect(0, 55, 300, 44, "#fef3c7")
write(d1, 0, 64, "#334155", 12)
write(e1, 0, 44, "#b45309", 11)
write(d2, 0, 12, "#64748b", 11)
write("岩石循环：熔化 → 冷凝 → 风化 → 压固 → 变质 → 再熔化", 0, -45, "#7c3aed", 10)`,
  },
  'geo-05': {
    patch: (code) => code.includes('fill_rect(0, 150') ? code : code.replace('hide()\n', 'hide()\nfill_rect(0, 150, 340, 30, "#2563eb")\nwrite("时区环球旅行：每 15° 差 1 小时", 0, 150, "#fff", 12)\n', 1),
  },
  'cross-98': {
    params: [
      { name: 'h', label: '楼高（米）', min: 3, max: 22, step: 1, value: 15 },
      { name: 'm', label: '你的体重（千克）', min: 20, max: 60, step: 1, value: 35 },
    ],
    code: `# 功与功率探索台：W = mgh，P = W/t
h = 15   # 楼高（米）
m = 35   # 你的体重（千克）

hide()
g = 10
w1 = m * g * h
m2 = 70
w2 = m2 * g * h
p1 = w1 / 30
p2 = w2 / 20
fill_rect(0, 140, 330, 34, "#2563eb")
write("功与功率：爬楼冠军赛", 0, 140, "#fff", 13)
# 左：楼房从地面向上盖（舞台 y 越大越靠上），两人比谁先到顶
i = 0
while i < h:
    fill_rect(-150, -100 + i * 9, 80, 8, "#64748b")
    i = i + 1
write("🧒", -165, -85 + (h - 1) * 9, "#1d4ed8", 14)
write("👨", -135, -85 + (h - 1) * 9, "#dc2626", 14)
write("你 30 秒 · 爸 20 秒", -150, -118, "#64748b", 10)
# 右：做功与功率对比条（同组内按最大值拉满，长度可比）
wmax = w1
if w2 > wmax:
    wmax = w2
b1 = w1 / wmax * 240
b2 = w2 / wmax * 240
pmax = p1
if p2 > pmax:
    pmax = p2
q1 = p1 / pmax * 240
q2 = p2 / pmax * 240
write("你做的功 " + w1 + " J", 80, -8, "#1d4ed8", 11)
fill_rect(-40 + b1 / 2, -26, b1, 12, "#2563eb")
write("爸爸做的功 " + w2 + " J", 80, -54, "#c2410c", 11)
fill_rect(-40 + b2 / 2, -72, b2, 12, "#f97316")
write("你的功率（30 秒登顶）", 80, -100, "#1d4ed8", 10)
fill_rect(-40 + q1 / 2, -118, q1, 10, "#2563eb")
write("爸爸的功率（20 秒登顶）", 80, -146, "#c2410c", 10)
fill_rect(-40 + q2 / 2, -164, q2, 10, "#f97316")
write("功 W=mgh：爸爸体重大，做功更多", 60, -198, "#334155", 11)
write("功率 P=W/t：爸爸用时短，功率更大，先到顶", 60, -220, "#dc2626", 11)`,
  },
  'geo-11': {
    patch: (code) => code.includes('area / 16') ? code : code.replace(
      'w = area / 44\nfill_rect(-150, -20, w * 30, 46, "#1d4ed8")\nwrite("面积条", -150, -20, "#fff", 10)',
      'w = area / 16\nfill_rect(-160 + w / 2, -20, w, 46, "#1d4ed8")\nwrite(name, -160 + w / 2, -20, "#fff", 13)\nwrite("0", -160, -48, "#94a3b8", 9)\nwrite("4400 万km² 是最大（亚洲）", 105, -48, "#94a3b8", 9)',
    ),
  },
  'math-31': {
    patch: (code) => code.includes('fill_rect(0, 150') ? code : code.replace('hide()\n', 'hide()\nfill_rect(0, 150, 340, 30, "#2563eb")\nwrite("不等式解集地图", 0, 150, "#fff", 12)\n', 1),
  },
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const done = [], missed = [];
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    const fix = FIX[l.id];
    if (!fix) continue;
    if (fix.code) {
      if (!l.lab) l.lab = {};
      l.lab.code = fix.code;
      if (fix.params) l.lab.params = fix.params;
      if (l.starterCode !== undefined) l.starterCode = fix.code;
    } else if (fix.patch) {
      const cur = l.lab?.code ?? l.starterCode ?? '';
      const next = fix.patch(cur);
      if (next !== cur) {
        if (!l.lab) l.lab = {};
        l.lab.code = next;
        if (l.starterCode !== undefined) l.starterCode = next;
      }
    }
    changed = true;
    done.push(l.id);
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
for (const id of Object.keys(FIX)) if (!done.includes(id)) missed.push(id);
console.log('已修复:', done.join(', '));
if (missed.length) console.log('!! 未找到:', missed.join(', '));
