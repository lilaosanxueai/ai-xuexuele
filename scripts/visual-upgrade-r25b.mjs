import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第24轮视觉升级·批B（化学 9 节）：只换 lab.code，params 等原样保留 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const CODES = {

'cross-10': `# 水的三态探索台
temp = 20   # 温度

hide()
state = "液态水"
spread = 30
jig = 0
if temp < 0:
    state = "固态冰"
    spread = 18
if temp > 100:
    state = "气态水蒸气"
    spread = 60
    jig = 20
# 容器
pen_color("#64748b")
pen_down()
go_to(-110, 80)
go_to(-110, -90)
go_to(110, -90)
go_to(110, 80)
pen_up()
# 分子（实心蓝球）：固态整齐 / 液态较散 / 气态到处飞
i = 0
while i < 16:
    col = i - (i / 4) * 4
    row = i / 4
    x = -spread * 1.5 + col * spread
    y = 40 - row * spread
    if temp > 100:
        x = -150 + col * 90 + jig * 2
        y = 60 - row * 70 - jig
    circle(x, y, 6, "#3b82f6")
    i = i + 1
write(temp + "℃ → " + state, -190, 145, "#dc2626", 14)
if temp < 0:
    write("分子手拉手排排站（形状固定）", -190, 115, "#1d4ed8", 11)
if temp > 100:
    write("分子自由飞翔（充满整个空间）", -190, 115, "#ea580c", 11)
if temp >= 0:
    if temp <= 100:
        write("分子可以滑动（随容器形状）", -190, 115, "#16a34a", 11)
write("温度 = 分子运动的剧烈程度", -190, -130, "#64748b", 11)`,

'cross-11': `# 分子运动会探索台
temp = 40   # 温度

hide()
speed = temp / 5
# 温度计（红柱高度∝温度 + 球泡）
circle(-185, -130, 12, "#dc2626")
fill_rect(-185, -130 + (temp * 2.3 + 24) / 2, 12, temp * 2.3 + 24, "#ef4444")
write("温度计", -215, -120, "#dc2626", 10)
write("温度 " + temp + "℃", -100, 145, "#dc2626", 14)
# 分子（实心球）+ 速度尾巴（线长∝速度）
i = 0
while i < 10:
    r1 = random(0, speed * 4)
    r2 = random(0, speed * 4)
    x = -60 + i * 22 + r1 - speed * 2
    y = 30 + r2 - speed * 2
    pen_color("#93c5fd")
    pen_down()
    go_to(x, y)
    go_to(x + 2 + speed / 2, y + 1)
    pen_up()
    circle(x, y, 5, "#3b82f6")
    i = i + 1
if temp > 70:
    write("分子横冲直撞！", 60, 80, "#ea580c", 12)
if temp < 25:
    write("分子慢悠悠", 60, 80, "#16a34a", 12)
if temp >= 25:
    if temp <= 70:
        write("不快不慢地逛", 60, 80, "#1d4ed8", 12)
write("蓝球=分子，尾巴越长跑得越快", -120, -80, "#64748b", 11)
write("热 = 分子运动", -120, -105, "#16a34a", 12)`,

'cross-129': `# 金属活动性排行榜探索台
h = 2   # 氢的分界分

hide()
zn = 4
fe = 3
cu = 1
# 三根金属柱（实心）
fill_rect(-170, -100 + zn * 30 / 2, 50, zn * 30, "#94a3b8")
write("锌 4 分", -170, -100 + zn * 30 + 16, "#475569", 11)
fill_rect(-80, -100 + fe * 30 / 2, 50, fe * 30, "#78716c")
write("铁 3 分", -80, -100 + fe * 30 + 16, "#44403c", 11)
fill_rect(10, -100 + cu * 30 / 2, 50, cu * 30, "#f59e0b")
write("铜 1 分", 10, -100 + cu * 30 + 16, "#b45309", 11)
# 氢的分界线（蓝色虚线段）
i = 0
while i < 9:
    fill_rect(-200 + i * 46, -100 + h * 30, 30, 4, "#1d4ed8")
    i = i + 1
write("氢的分界 " + h + " 分", 120, -100 + h * 30 + 16, "#1d4ed8", 11)
if zn > h:
    write("锌 > 氢：锌 + 稀酸 → 放氢气 ✓", -190, 140, "#16a34a", 11)
if zn <= h:
    write("锌 < 氢：不反应 ✗（现实里不可能）", -190, 140, "#ea580c", 11)
if fe > h:
    write("铁 > 氢：铁 + 稀酸 → 放氢气 ✓", -190, 118, "#16a34a", 11)
if fe <= h:
    write("铁 < 氢：不反应 ✗", -190, 118, "#ea580c", 11)
if cu > h:
    write("铜 > 氢：反应（现实里不可能！）", -190, 96, "#dc2626", 11)
if cu <= h:
    write("铜 < 氢：铜 + 稀酸不反应 ✗", -190, 96, "#ea580c", 11)
write("把氢的分界调到 2：线下方的不跟酸反应", -210, -140, "#64748b", 10)`,

'cross-18': `# 质量守恒探索台：2H₂ + O₂ = 2H₂O
o2c = 1   # O₂ 分子数（几个才守恒？）

hide()
h2c = 2
h_left = h2c * 2
o_left = o2c * 2
h_right = h2c * 2
o_right = h2c
write("2H₂ + " + o2c + " O₂ = 2H₂O", -110, 145, "#1d4ed8", 13)
# 四根实心原子柱 + 原子珠
fill_rect(-150, -100 + h_left * 15, 60, h_left * 30, "#3b82f6")
fill_rect(-40, -100 + h_right * 15, 60, h_right * 30, "#3b82f6")
fill_rect(60, -100 + o_left * 15, 56, o_left * 30, "#ef4444")
fill_rect(136, -100 + o_right * 15, 56, o_right * 30, "#ef4444")
i = 0
while i < h_left:
    circle(-120, -86 + i * 30, 8, "#93c5fd")
    i = i + 1
i = 0
while i < h_right:
    circle(-10, -86 + i * 30, 8, "#93c5fd")
    i = i + 1
i = 0
while i < o_left:
    circle(88, -86 + i * 30, 8, "#fca5a5")
    i = i + 1
i = 0
while i < o_right:
    circle(164, -86 + i * 30, 8, "#fca5a5")
    i = i + 1
write("左H " + h_left, -150, -122, "#1d4ed8", 11)
write("右H " + h_right, -40, -122, "#1d4ed8", 11)
write("左O " + o_left, 60, -122, "#dc2626", 11)
write("右O " + o_right, 136, -122, "#dc2626", 11)
if o_left == o_right:
    fill_rect(0, 60, 300, 32, "#dcfce7")
    write("✓ 氧原子守恒！2H₂+O₂=2H₂O 配平正确", -130, 66, "#15803d", 14)
if o_left > o_right:
    write("✗ 氧多了：O₂ 太多，多余的剩下", -110, 66, "#ea580c", 13)
if o_left < o_right:
    write("✗ 氧不够：O₂ 太少！", -90, 66, "#dc2626", 13)
write("反应只是原子重新组合，一个都不会多、不会少", -215, -145, "#64748b", 10)`,

'cross-25': `# 燃烧三要素探索台
fuel = 1     # 可燃物
oxygen = 1   # 氧气
hot = 1      # 达到着火点

hide()
# 三要素徽章（绿=齐 / 红=缺）
circle(-120, 120, 12, "#16a34a")
write("可燃物", -120, 120, "#ffffff", 8)
if fuel == 0:
    circle(-120, 120, 12, "#dc2626")
    write("可燃物", -120, 120, "#ffffff", 8)
circle(0, 120, 12, "#16a34a")
write("氧气", 0, 120, "#ffffff", 9)
if oxygen == 0:
    circle(0, 120, 12, "#dc2626")
    write("氧气", 0, 120, "#ffffff", 9)
circle(120, 120, 12, "#16a34a")
write("着火点", 120, 120, "#ffffff", 8)
if hot == 0:
    circle(120, 120, 12, "#dc2626")
    write("着火点", 120, 120, "#ffffff", 8)
# 蜡烛（烛身 + 烛芯）
fill_rect(-16, -70, 32, 80, "#f1f5f9")
fill_rect(-2, -80, 4, 12, "#78350f")
# 火焰（三层圆：外橙内黄）——三要素齐才点燃
if fuel == 1:
    if oxygen == 1:
        if hot == 1:
            circle(0, -92, 16, "#f97316")
            circle(0, -94, 10, "#fbbf24")
            circle(0, -96, 5, "#fef9c3")
# 隔绝氧气时的杯子
if oxygen == 0:
    pen_color("#64748b")
    pen_down()
    go_to(-46, -30)
    go_to(-46, -120)
    go_to(46, -120)
    go_to(46, -30)
    pen_up()
if fuel == 1:
    if oxygen == 1:
        if hot == 1:
            write("🔥 燃烧！三要素齐了", -80, 60, "#dc2626", 14)
if fuel == 0:
    write("没有可燃物，烧不起来", -80, 60, "#ea580c", 13)
if oxygen == 0:
    write("隔绝氧气 → 火灭（盖杯子/盖锅盖）", -110, 60, "#1d4ed8", 13)
if hot == 0:
    write("没到着火点，点不着", -80, 60, "#16a34a", 13)
if fuel == 0:
    if oxygen == 0:
        write("缺俩？更烧不起来", -80, 40, "#64748b", 12)
write("三者缺一不可：灭火就是拆掉其中一个", -190, -140, "#64748b", 11)`,

'cross-27': `# 元素周期表前 10 号探索台
num = 1   # 原子序数

hide()
# 10 块元素瓷砖（按类别着色，选中变红）
i = 1
while i < 11:
    col = i - (i / 5) * 5
    row = i / 5
    x = -130 + col * 56
    y = 60 - row * 66
    tile = "#94a3b8"
    if i < 3:
        tile = "#5eead4"
    if i == 2:
        tile = "#c4b5fd"
    if i == 5:
        tile = "#fdba74"
    if i == 6:
        tile = "#a3a3a3"
    if i == 7:
        tile = "#5eead4"
    if i == 8:
        tile = "#fca5a5"
    if i == 9:
        tile = "#c4b5fd"
    if i == 10:
        tile = "#c4b5fd"
    if i == num:
        tile = "#dc2626"
    fill_rect(x + 24, y - 26, 48, 52, tile)
    write(i, x + 24, y - 8, "#ffffff", 12)
    i = i + 1
# 元素名片
name = ""
if num == 1:
    name = "氢 H：宇宙最多"
if num == 2:
    name = "氦 He：气球安全气"
if num == 3:
    name = "锂 Li：电池心脏"
if num == 4:
    name = "铍 Be：轻而硬"
if num == 5:
    name = "硼 B：洗涤剂"
if num == 6:
    name = "碳 C：钻石铅笔芯"
if num == 7:
    name = "氮 N：空气 78%"
if num == 8:
    name = "氧 O：生命之气"
if num == 9:
    name = "氟 F：牙膏防蛀"
if num == 10:
    name = "氖 Ne：霓虹灯"
write(name, -190, 145, "#dc2626", 13)
write(num + " 号", -190, 120, "#0f172a", 14)
write("红=选中｜青=非金属 紫稀有灰金属", -200, -140, "#64748b", 10)
write("原子序数 = 质子数 = 核外电子数", -200, -155, "#1d4ed8", 10)`,

'cross-71': `# 化学平衡探索台：A ⇌ B，看 B 的浓度怎么收敛
kf = 20   # 正反应速率系数
kr = 5    # 逆反应速率系数

hide()
xeq = 100 * kf / (kf + kr)
# 两个烧瓶：A（蓝）⇌ B（橙），液面高度=浓度比例
hA = (100 - xeq) * 1.3
hB = xeq * 1.3
fill_rect(-170, 0, 90, 10, "#94a3b8")
fill_rect(-164, -6, 76, 130, "#f8fafc")
fill_rect(-164, -6 + hA / 2, 76, hA, "#bfdbfe")
write("A 反应物", -170, 20, "#1d4ed8", 11)
fill_rect(80, 0, 90, 10, "#94a3b8")
fill_rect(86, -6, 76, 130, "#f8fafc")
fill_rect(86, -6 + hB / 2, 76, hB, "#fdba74")
write("B 生成物", 80, 20, "#c2410c", 11)
# 正逆箭头（粗细∝速率）
fill_rect(-64, 26, kf * 2, 8, "#16a34a")
write("正反应 kf=" + kf, -64, 44, "#15803d", 10)
fill_rect(-64, -16, kr * 2, 8, "#dc2626")
write("逆反应 kr=" + kr, -64, -34, "#dc2626", 10)
# 收敛曲线 + 平衡线
pen_color("#1d4ed8")
pen_down()
cb = 0
t = 0
go_to(-190, -130)
while t < 10.01:
    cb = cb + (kf * (100 - cb) / 100 - kr * cb / 100)
    if cb > 100:
        cb = 100
    go_to(-190 + t * 38, -130 + cb * 2.4)
    t = t + 1
pen_up()
i = 0
while i < 9:
    fill_rect(-190 + i * 46, -130 + xeq * 2.4, 30, 3, "#dc2626")
    i = i + 1
write("B 浓度最终停在平衡线", -60, 145, "#dc2626", 11)
write("平衡不是停止：正逆速率相等、你来我往", -215, -150, "#64748b", 10)`,

'hb-07': `# 空气成分探索台
o2pct = 21   # 氧气占比（%）

hide()
n2 = 100 - o2pct - 1
# 一根空气柱：氮气（蓝）/ 氧气（红）/ 其他（绿）按比例堆叠
hN = n2 * 2.6
hO = o2pct * 2.6
fill_rect(-140, -100 + hN / 2, 70, hN, "#3b82f6")
write("氮气 " + n2 + "%", -140, -100 + hN + 16, "#1d4ed8", 12)
fill_rect(-140, -100 + hN + hO / 2, 70, hO, "#ef4444")
write("氧气 " + o2pct + "%", -140, 90, "#dc2626", 12)
fill_rect(-140, -100 + hN + hO + 2, 70, 4, "#22c55e")
write("其他 1%", -60, -20, "#15803d", 10)
write("空气", -200, 0, "#0f172a", 12)
# 蜡烛能烧多久（条∝氧气）
fill_rect(120, 150, 90, 10, "#e2e8f0")
fill_rect(30, 150, o2pct * 4.3, 10, "#f97316")
write("蜡烛可燃时间", 30, 130, "#c2410c", 10)
if o2pct == 21:
    write("正常空气：红磷实验水面升约 1/5", -190, -130, "#ea580c", 11)
if o2pct > 25:
    write("富氧！烧得更旺更久", -190, -130, "#16a34a", 11)
if o2pct < 18:
    write("缺氧：呼吸都困难", -190, -130, "#ea580c", 11)
write("氧气只占约 1/5，氮气占了近 4/5", -190, -150, "#1d4ed8", 11)`,

'hb-14': `# 物质的量探索台：n = m / M
m = 18   # 水的质量（克）

hide()
M = 18
n = m / M
particles = n * 6.02
# 一组组水分子（红氧 + 蓝氢）
cnt = n
if cnt > 5:
    cnt = 5
i = 0
while i < cnt:
    x = -150 + i * 62
    circle(x, 30, 13, "#ef4444")
    circle(x - 14, 48, 8, "#93c5fd")
    circle(x + 14, 48, 8, "#93c5fd")
    i = i + 1
if n > 5:
    write("… 共 " + n + " 组", 120, 30, "#ea580c", 11)
write("每组 = 1 个水分子（2 氢 + 1 氧）", -170, -30, "#64748b", 10)
# 摩尔数标尺（1 摩尔 = 18 克一格）
i = 0
while i < 6:
    fill_rect(-190 + i * 66, -90, 60, 8, "#e2e8f0")
    i = i + 1
nb = n
if nb > 5:
    nb = 5
fill_rect(-190, -90, nb * 66, 8, "#3b82f6")
write("摩尔数标尺（每格 1 摩尔 = 18 克水）", -190, -108, "#1d4ed8", 10)
write(m + " 克水 = " + n + " 摩尔", -190, 145, "#dc2626", 14)
write("含 " + particles + " ×10²³ 个水分子", -190, 118, "#1d4ed8", 13)
write("1 摩尔 = 6.02×10²³ 个（阿伏加德罗常数）", -190, -140, "#ea580c", 11)`,

};

let changed = 0;
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  const p = path.join(D, f);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (CODES[j.id] && j.lab) {
    j.lab.code = CODES[j.id];
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
    changed++;
  }
}
console.log(`视觉升级批B（化学）: ${changed} 节`);
