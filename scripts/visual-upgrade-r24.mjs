import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 第24轮·实验室视觉大升级：用新图形原语（fill_rect/circle/ring）重写招牌实验演示。
 * 只替换 lab.code；params/grid/animate/explore/challenges 全部原样保留（滑块与挑战不受影响）。
 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const CODES = {

'cross-97': `# 浮力与密度探索台：ρ物 vs ρ液 决定沉浮
rho_obj = 0.6   # 物体密度
rho_liq = 1     # 液体密度

hide()
# 玻璃缸：缸体 + 液体
fill_rect(0, -22, 340, 16, "#cbd5e1")
fill_rect(0, -20, 320, 100, "#bfdbfe")
pen_color("#64748b")
pen_down()
go_to(-160, 30)
go_to(-160, -70)
go_to(160, -70)
go_to(160, 30)
pen_up()
# 方块：漂浮按浸入比例，悬浮全没，沉底贴底
top = 30
if rho_obj < rho_liq:
    part = rho_obj / rho_liq
    top = 30 - 50 * (1 - part)
if rho_obj == rho_liq:
    top = -45
if rho_obj > rho_liq:
    top = -70
fill_rect(0, top - 25, 64, 50, "#f59e0b")
pen_color("#92400e")
pen_down()
go_to(-32, top)
go_to(32, top)
go_to(32, top - 50)
go_to(-32, top - 50)
go_to(-32, top)
pen_up()
# 力的示意
if rho_obj < rho_liq:
    fill_rect(60, top + 6, 10, 44, "#16a34a")
    write("浮力=重力", 80, top + 10, "#16a34a", 11)
if rho_obj > rho_liq:
    fill_rect(-90, top - 42, 10, 44, "#dc2626")
    write("重力>浮力", -150, top - 30, "#dc2626", 11)
if rho_obj == rho_liq:
    write("悬浮：停在任意深度", 70, top - 30, "#1d4ed8", 11)
# 浸入比例计（漂浮时）
write("ρ物=" + rho_obj + "  ρ液=" + rho_liq, -150, 130, "#0f172a", 13)
if rho_obj < rho_liq:
    part = rho_obj / rho_liq
    fill_rect(-40, 100, 120, 10, "#e2e8f0")
    fill_rect(-60 + part * 60, 100, part * 120, 10, "#1d4ed8")
    write("浸入水中的比例", -150, 96, "#64748b", 10)
if rho_obj > rho_liq:
    write("下沉：ρ物 > ρ液", -150, 100, "#ea580c", 14)
if rho_obj == rho_liq:
    write("悬浮：ρ物 = ρ液", -150, 100, "#1d4ed8", 14)
write("排开的液体越多，托力越大 —— 阿基米德", -190, -130, "#64748b", 11)`,

'cross-04': `# 太阳系运转探索台
planet = 3   # 行星编号

hide()
# 太阳（发光圆 + 光环）
circle(0, 0, 18, "#fbbf24")
ring(0, 0, 24, "#fde68a")
i = 1
while i < 6:
    r = 25 + i * 22
    col = "#cbd5e1"
    if i == planet:
        col = "#dc2626"
    ring(0, 0, r, col)
    # 每颗行星：角度错开，大小颜色不同
    a = 30 + i * 55
    px = r * cos(a)
    py = r * sin(a)
    sz = 4
    pc = "#94a3b8"
    if i == 1:
        sz = 3
        pc = "#a8a29e"
    if i == 2:
        sz = 5
        pc = "#f5c98b"
    if i == 3:
        sz = 6
        pc = "#3b82f6"
    if i == 4:
        sz = 4
        pc = "#ef4444"
    if i == 5:
        sz = 11
        pc = "#d97706"
    circle(px, py, sz, pc)
    if i == 3:
        circle(px + 9, py, 2, "#cbd5e1")
    i = i + 1
write("☀ 太阳", -26, 34, "#b45309", 11)
name = "地球（365天一圈）"
if planet == 1:
    name = "水星（88天）最最快"
if planet == 2:
    name = "金星（225天）"
if planet == 4:
    name = "火星（687天）"
if planet == 5:
    name = "木星（12年！）大个子"
write("选中：第 " + planet + " 号 " + name, -190, 150, "#dc2626", 12)
write("红圈=选中轨道：越近绕得越快", -190, -155, "#b45309", 11)`,

'cross-118': `# 卫星轨道探索台：r 越大，绕一圈越慢
r = 110   # 轨道半径

hide()
# 地球（蓝球 + 大气光环）
circle(0, 0, 26, "#3b82f6")
circle(-8, 8, 9, "#22c55e")
circle(10, -6, 7, "#22c55e")
ring(0, 0, 31, "#93c5fd")
# 轨道
ring(0, 0, r, "#94a3b8")
# 卫星（轨道 45° 处）
sx = r * cos(45)
sy = r * sin(45)
circle(sx, sy, 6, "#dc2626")
fill_rect(sx + 8, sy + 8, 16, 4, "#64748b")
fill_rect(sx + 8, sy - 8, 16, 4, "#64748b")
# 引力箭头（指向地心）与速度箭头（切线方向）
fill_rect(sx - 16, sy - 3, 14, 6, "#f59e0b")
write("引力", sx - 34, sy + 12, "#b45309", 9)
fill_rect(sx + 4, sy + 14, 6, 16, "#16a34a")
write("速度", sx + 12, sy + 26, "#15803d", 9)
# 周期对比条：近轨道短、远轨道长
fill_rect(-100, -130, 60, 12, "#e2e8f0")
w = r
fill_rect(-130, -130, w, 12, "#3b82f6")
write("轨道周期（条越长=绕一圈越久）", -100, -118, "#64748b", 10)
write("r = " + r, 60, 130, "#dc2626", 13)
write("引力提供向心力：近处快、远处慢", -190, 150, "#1d4ed8", 11)`,

'cross-67': `# 平抛运动探索台：x = v0·t，y 下落 = ½gt²
g = 10  # 重力加速度（固定值）
v0 = 15  # 水平初速度

hide()
# 出发台
fill_rect(-212, 134, 24, 10, "#64748b")
# 轨迹（描点）
pen_color("#1d4ed8")
pen_down()
t = 0
x = 0
y = 130
go_to(-200, 130)
while y > -152:
    x = v0 * t * 7
    y = 130 - 35 * t * t
    go_to(-200 + x, y)
    t = t + 0.1
pen_up()
# 整秒位置的"影子球"
t2 = 0
while t2 < 6:
    gx = -200 + v0 * t2 * 7
    gy = 130 - 35 * t2 * t2
    if gy > -150:
        circle(gx, gy, 4, "#93c5fd")
    t2 = t2 + 1
# 落点：篮球 + 落点标记
circle(-200 + x, y, 9, "#f97316")
ring(-200 + x, y, 15, "#dc2626")
fill_rect(-230, -160, 60, 8, "#4d7c0f")
write("v0 = " + v0 + " m/s", -190, 150, "#1d4ed8", 12)
write("浅色球=每 1 秒的位置：横着匀速、竖着越掉越快", -190, -130, "#dc2626", 11)`,

'cross-07': `# 自由落体·双视图：轨迹 + 小球 + 速度箭头
g = 10   # 重力加速度

hide()
# 高塔
fill_rect(-218, 60, 24, 150, "#94a3b8")
fill_rect(-218, 134, 30, 8, "#64748b")
# 轨迹曲线
pen_color("#1d4ed8")
pen_down()
tt = 0
lastX = -200
lastY = 130
go_to(-200, 130)
while tt < 5.01:
    h = 130 - 5 * g * tt * tt
    if h < -150:
        h = -150
    lastX = -200 + tt * 70
    lastY = h
    go_to(lastX, lastY)
    tt = tt + 0.2
pen_up()
# 地面
fill_rect(0, -158, 460, 8, "#4d7c0f")
# 落点小球（大球+阴影）
circle(lastX, lastY, 10, "#f97316")
fill_rect(lastX, -150, 26, 4, "#00000033")
# 速度箭头：长度 ∝ g
fill_rect(lastX + 16, lastY + 30 - g, 8, g, "#dc2626")
write("g = " + g, -150, 150, "#dc2626", 13)
write("1 秒末速度 = " + g + " m/s（箭头越长越快）", -150, 125, "#ea580c", 11)
write("越重的地方（g 大）掉得越快", -150, -125, "#1d4ed8", 11)`,

'cross-24': `# 过山车能量探索台
h0 = 110   # 最高点高度

hide()
m = 1
g = 10
# 轨道（山坡线 + 地面）
fill_rect(0, -152, 460, 8, "#4d7c0f")
pen_color("#1d4ed8")
pen_down()
go_to(-170, -150)
go_to(-170, -110 + h0)
go_to(170, -150)
pen_up()
# 车厢：停在坡顶
cx = -170
cy = -110 + h0 + 10
circle(cx, cy, 9, "#dc2626")
fill_rect(cx - 2, cy - 2, 16, 4, "#64748b")
# 能量账本：两条实心柱（势能 / 动能）
fill_rect(-60, -40, 30, 8, "#e2e8f0")
fill_rect(-60 + h0 * 0.55, -40, h0 * 1.1, 8, "#f59e0b")
write("势能 Ep=mgh", -110, -30, "#b45309", 10)
fill_rect(-60, -70, 30, 8, "#e2e8f0")
fill_rect(-60, -70, 8, 8, "#16a34a")
write("坡顶动能 = 0", -110, -60, "#15803d", 10)
write("坡顶：Ep = " + h0 * 10 + " J", -190, 150, "#b45309", 12)
write("冲到底：Ep 全部变成动能 Ek", -190, 125, "#15803d", 12)
write("总能量 Ep + Ek 永远 = " + h0 * 10 + " J", -190, 100, "#ea580c", 12)
write("摩擦会把一部分能量变成热（第二座山更矮）", -190, -125, "#64748b", 10)`,

'cross-26': `# 酸碱 pH 标尺探索台
ph = 7   # 溶液的 pH 值

hide()
# 彩虹色标尺（15 段实心块）
i = 0
while i < 15:
    px = -196 + i * 27
    col = "#dc2626"
    if i == 1:
        col = "#ef4444"
    if i == 2:
        col = "#f87171"
    if i == 3:
        col = "#fb923c"
    if i == 4:
        col = "#fbbf24"
    if i == 5:
        col = "#facc15"
    if i == 6:
        col = "#a3e635"
    if i == 7:
        col = "#22c55e"
    if i == 8:
        col = "#2dd4bf"
    if i == 9:
        col = "#38bdf8"
    if i == 10:
        col = "#60a5fa"
    if i == 11:
        col = "#3b82f6"
    if i == 12:
        col = "#4f46e5"
    if i == 13:
        col = "#7c3aed"
    if i == 14:
        col = "#9333ea"
    fill_rect(px + 13, 40, 26, 40, col)
    write(i, px + 13, 72, "#475569", 9)
    i = i + 1
# 指示三角 + 试管
px2 = -196 + ph * 27
fill_rect(px2, -4, 10, 14, "#f97316")
fill_rect(px2, 52, 10, 20, "#f97316")
fill_rect(-40, -110, 24, 90, "#e2e8f0")
mycol = "#22c55e"
if ph < 6.8:
    mycol = "#dc2626"
if ph > 7.2:
    mycol = "#4f46e5"
fill_rect(-40, -105, 18, 55, mycol)
write("pH = " + ph, 90, -80, mycol, 20)
if ph < 6.8:
    write("酸性：数值越小越酸", 30, -40, "#dc2626", 13)
if ph > 7.2:
    write("碱性：数值越大越碱", 30, -40, "#4f46e5", 13)
if ph >= 6.8:
    if ph <= 7.2:
        write("中性（纯水）", 30, -40, "#16a34a", 13)`,

'cross-28': `# 蔗糖溶解度随温度变化探索台
T = 20   # 当前水温（摄氏度）

hide()
# 左：烧杯 + 水 + 沉底的糖
fill_rect(-160, -110, 130, 12, "#94a3b8")
fill_rect(-155, -104, 118, 90, "#bfdbfe")
sol = 180 + (T - 20) * 1.6
sugar = 250 - sol
if sugar < 0:
    sugar = 0
row = 0
while row * 96 < sugar:
    coln = 0
    while coln < 8:
        idx = row * 8 + coln
        if idx * 12 < sugar:
            circle(-148 + coln * 15, -95 - row * 12, 5, "#fde68a")
        coln = coln + 1
    row = row + 1
write("加 250g 糖，溶掉 " + sol + "g", -190, 40, "#b45309", 11)
if sugar > 0:
    write("沉底 " + sugar + "g：饱和了", -190, 18, "#ea580c", 11)
if sugar < 1:
    write("全部溶解！还能再溶", -190, 18, "#16a34a", 11)
# 右：溶解度曲线
pen_color("#1d4ed8")
pen_down()
t2 = 0
go_to(20 + 0 * 3, -120 + 148 * 0.5)
while t2 < 100.01:
    s2 = 180 + (t2 - 20) * 1.6
    go_to(20 + t2 * 3, -120 + s2 * 0.5)
    t2 = t2 + 5
pen_up()
# 当前温度竖线 + 点
circle(20 + T * 3, -120 + sol * 0.5, 6, "#dc2626")
pen_color("#dc2626")
pen_down()
go_to(20 + T * 3, -125)
go_to(20 + T * 3, 140)
pen_up()
write("T = " + T + " ℃", 30 + T * 3, 150, "#dc2626", 12)
write("溶解度曲线：越热溶得越多", 60, 90, "#1d4ed8", 11)`,

'cross-108': `# 配平探索台：2H₂ + O₂ = ?H₂O
w = 1   # H₂O 前面的系数（调成几能配平？）

hide()
lh = 2 * 2
lo = 2
rh = w * 2
ro = w
write("2H₂ + O₂ = " + w + " H₂O —— 数一数两边的原子：", -190, 140, "#0f172a", 12)
# 四根实心柱：左H / 右H / 左O / 右O
hcol = "#3b82f6"
ocol = "#ef4444"
fill_rect(-150, -110 + lh * 18, 40, lh * 18, hcol)
write("左 H×" + lh, -150, -130, hcol, 12)
fill_rect(-60, -110 + rh * 18, 40, rh * 18, hcol)
write("右 H×" + rh, -60, -130, hcol, 12)
fill_rect(50, -110 + lo * 18, 40, lo * 18, ocol)
write("左 O×" + lo, 50, -130, ocol, 12)
fill_rect(140, -110 + ro * 18, 40, ro * 18, ocol)
write("右 O×" + ro, 140, -130, ocol, 12)
# 每个原子一颗小圆珠（直观数数）
i = 0
while i < lh:
    circle(-150, -100 + i * 18, 6, "#93c5fd")
    i = i + 1
i = 0
while i < rh:
    circle(-60, -100 + i * 18, 6, "#93c5fd")
    i = i + 1
i = 0
while i < lo:
    circle(50, -100 + i * 18, 6, "#fca5a5")
    i = i + 1
i = 0
while i < ro:
    circle(140, -100 + i * 18, 6, "#fca5a5")
    i = i + 1
if lh == rh:
    if lo == ro:
        fill_rect(0, 60, 240, 30, "#dcfce7")
        write("✓ 配平成功！两边原子一样多", -105, 65, "#15803d", 14)
if lh != rh:
    write("✗ 氢原子不守恒：左边多", -90, 65, "#ea580c", 13)
if lo != ro:
    write("✗ 氧原子不守恒：右边缺", -90, 40, "#ea580c", 13)`,

'cross-99': `# 物质的三层楼探索台
level = 1   # 1=宏观物质 2=分子 3=原子

hide()
if level == 1:
    write("第 1 层：一杯水（肉眼看得见）", -150, 130, "#0f172a", 13)
    fill_rect(-30, -70, 100, 12, "#94a3b8")
    fill_rect(-24, -64, 88, 120, "#bfdbfe")
    write("水", -10, 0, "#1d4ed8", 16)
    write("杯子里的水由无数水分子组成 →", -190, -120, "#64748b", 11)
if level == 2:
    write("第 2 层：放大看到水分子 H₂O", -150, 130, "#0f172a", 13)
    i = 0
    while i < 4:
        x = -130 + i * 75
        circle(x, -10, 14, "#ef4444")
        circle(x - 14, 14, 8, "#93c5fd")
        circle(x + 14, 14, 8, "#93c5fd")
        i = i + 1
    circle(-155, 120, 8, "#93c5fd")
    write("= 氢原子（小）", -140, 116, "#1d4ed8", 10)
    circle(-155, 96, 12, "#ef4444")
    write("= 氧原子（大）", -140, 92, "#dc2626", 10)
    write("一个水分子 = 2 个氢 + 1 个氧", -150, -120, "#16a34a", 12)
if level == 3:
    write("第 3 层：原子（化学变化的最小棋子）", -150, 130, "#0f172a", 13)
    i = 0
    while i < 7:
        x = -160 + i * 52
        sz = 12
        col = "#ef4444"
        if i > 2:
            sz = 9
            col = "#3b82f6"
        if i > 4:
            sz = 14
            col = "#f59e0b"
        circle(x, 0, sz, col)
        i = i + 1
    write("红=氢  蓝=氧  橙=其他原子", -100, -80, "#64748b", 11)
    write("化学变化里原子不生不灭，只是重新组合", -190, -120, "#16a34a", 12)
write("按 1 → 2 → 3 逐层放大看", -190, -150, "#ea580c", 11)`,

'cross-72': `# 孟德尔豌豆 3:1 探索台
n = 200   # 第二代豌豆株数

hide()
tall = 0
i = 0
while i < n:
    r = random(0, 3)
    if r < 3:
        tall = tall + 1
    i = i + 1
short = n - tall
# 两根实心柱 + 豌豆点缀
hT = tall * 300 / n
hS = short * 300 / n
fill_rect(-100, -90 + hT / 2, 70, hT, "#16a34a")
fill_rect(60, -90 + hS / 2, 70, hS, "#f59e0b")
i = 0
while i * 60 < hT:
    circle(-100, -80 + i * 60 + 16, 7, "#4ade80")
    i = i + 1
i = 0
while i * 60 < hS:
    circle(60, -80 + i * 60 + 16, 7, "#fbbf24")
    i = i + 1
write("高茎 " + tall + " 株", -110, 100, "#15803d", 13)
write("矮茎 " + short + " 株", 60, 100, "#b45309", 13)
ratio = tall / short
if ratio > 2.6:
    if ratio < 3.4:
        write("高 : 矮 ≈ 3 : 1 ！", -70, 135, "#dc2626", 16)
if ratio <= 2.6:
    write("比例还没到 3:1，再跑一次？", -110, 135, "#64748b", 12)
if ratio >= 3.4:
    write("这次运气偏了，多跑几次更准", -120, 135, "#64748b", 12)
write("每一株都像掷骰子：3 份高 1 份矮", -150, -130, "#1d4ed8", 11)`,

'cross-115': `# 水循环探索台
sun = 2   # 阳光强度

hide()
# 大海（实心水体）
fill_rect(0, -85, 460, 60, "#3b82f6")
i = 0
while i < 9:
    circle(-200 + i * 50, -58, 10, "#60a5fa")
    i = i + 1
# 太阳（强度=大小和光线）
circle(-150, 100, 6 + sun * 5, "#fbbf24")
i = 0
while i < 4:
    ring(-150, 100, 30 + i * 12 + sun * 5, "#fde68a")
    i = i + 1
# 蒸发箭头（数量 ∝ 阳光）
evap = sun * 10
i = 0
while i < sun * 2:
    fill_rect(-130 + i * 26, -20, 6, 26, "#38bdf8")
    circle(-127 + i * 26, 12, 5, "#7dd3fc")
    i = i + 1
write("蒸发 ↑（阳光越强蒸发越快）", -190, 30, "#0284c7", 10)
# 云（三个圆拼成，厚度 ∝ 阳光）
cr = 10 + sun * 4
circle(-30, 90, cr, "#e2e8f0")
circle(0, 96, cr, "#f1f5f9")
circle(30, 90, cr, "#e2e8f0")
write("云（攒的水越多越厚）", -20, 130, "#64748b", 10)
# 雨滴（数量 ∝ 阳光）
i = 0
while i < sun:
    circle(-40 + i * 20, 60, 4, "#3b82f6")
    circle(-30 + i * 20, 40, 4, "#3b82f6")
    i = i + 1
if sun > 0:
    write("降水 ↓", -50, 45, "#1d4ed8", 10)
if sun < 0.1:
    write("没有太阳：循环停摆！", -100, 45, "#ea580c", 12)
write("阳光 " + sun + " → 蒸发 " + evap + " 份水汽", -190, 155, "#dc2626", 11)
write("海水蒸发 → 成云 → 降水 → 汇回大海，循环不止", -200, -130, "#1d4ed8", 10)`,

'cross-73': `# 环球时钟探索台：拨动北京时间，看世界时间
beijing_hour = 20   # 北京时间（点）

hide()
# 地球
circle(0, 0, 110, "#1e40af")
# 24 小时刻度
i = 0
while i < 24:
    a = i * 15 - 90
    tx = 98 * cos(a)
    ty = 98 * sin(a)
    fill_rect(tx, ty, 4, 4, "#93c5fd")
    i = i + 1
# 城市标记：角度 = 该城市的小时数×15°-90°
jet = beijing_hour - 8
London = jet
if London < 0:
    London = London + 24
NewYork = jet - 5
if NewYork < 0:
    NewYork = NewYork + 24
Tokyo = beijing_hour + 1
if Tokyo > 23:
    Tokyo = Tokyo - 24
Sydney = beijing_hour + 2
if Sydney > 23:
    Sydney = Sydney - 24
a1 = beijing_hour * 15 - 90
circle(88 * cos(a1), 88 * sin(a1), 9, "#dc2626")
write("北京 " + beijing_hour + "点", 88 * cos(a1) + 14, 88 * sin(a1), "#dc2626", 11)
a2 = London * 15 - 90
circle(88 * cos(a2), 88 * sin(a2), 7, "#38bdf8")
write("伦敦 " + London + "点", 88 * cos(a2) + 12, 88 * sin(a2), "#0369a1", 11)
a3 = NewYork * 15 - 90
circle(88 * cos(a3), 88 * sin(a3), 7, "#22c55e")
write("纽约 " + NewYork + "点", 88 * cos(a3) + 12, 88 * sin(a3), "#15803d", 11)
a4 = Tokyo * 15 - 90
circle(88 * cos(a4), 88 * sin(a4), 7, "#f59e0b")
write("东京 " + Tokyo + "点", 88 * cos(a4) + 12, 88 * sin(a4), "#b45309", 11)
a5 = Sydney * 15 - 90
circle(88 * cos(a5), 88 * sin(a5), 7, "#a855f7")
write("悉尼 " + Sydney + "点", 88 * cos(a5) + 12, 88 * sin(a5), "#7e22ce", 11)
write("圆盘=地球24小时：每 15° 差 1 小时", -190, 158, "#1d4ed8", 11)`,

'cross-116': `# 磁铁的力量探索台
power = 3   # 磁力强度

hide()
# 条形磁铁（红 N + 蓝 S，实心）
fill_rect(-160, 10, 80, 44, "#dc2626")
fill_rect(-80, 10, 80, 44, "#1d4ed8")
write("N", -140, 30, "#ffffff", 15)
write("S", -60, 30, "#ffffff", 15)
# 磁场线（右端半圆弧）
i = 0
while i < power:
    ring(-80, 32, 30 + i * 26, "#94a3b8")
    i = i + 1
# 回形针（距离 = 磁力强度决定）
dist = 150 - power * 24
write("📎", dist - 10, 24, "#475569", 20)
# 吸力箭头
fill_rect(dist - 46, 28, 30, 7, "#16a34a")
write("吸！越强的磁铁隔越远也能吸住", -190, 150, "#dc2626", 12)
write("磁力 " + power + " 级：隔 " + dist + " 格吸住回形针", -190, 122, "#15803d", 12)
if power > 3:
    write("强磁铁：小心电脑、手机和手表！", -190, 96, "#ea580c", 11)
if power < 2:
    write("弱磁铁：要贴得很近才吸得住", -190, 96, "#0369a1", 11)
write("磁力随距离迅速变弱（弧线=磁场）", -190, -60, "#64748b", 10)`,

'cross-103': `# 对数：地震能量阶梯探索台
mag1 = 5   # 地震 A 震级
mag2 = 7   # 地震 B 震级

hide()
# 两根"震级柱"（实心 + 顶部数值）
h1 = mag1 * 26
h2 = mag2 * 26
fill_rect(-110, -100 + h1 / 2, 70, h1, "#3b82f6")
fill_rect(60, -100 + h2 / 2, 70, h2, "#dc2626")
write("A：" + mag1 + " 级", -110, -100 + h1 + 16, "#1d4ed8", 12)
write("B：" + mag2 + " 级", 60, -100 + h2 + 16, "#dc2626", 12)
# 能量倍数：差 1 级 ×32，差 2 级 ×1000
dm = mag2 - mag1
msg = "把 B 调得比 A 大，看看能量差多少"
if dm > 0:
    if dm < 0.75:
        msg = "差半级：能量约 ×5.6"
if dm >= 0.75:
    if dm < 1.25:
        msg = "差 1 级：能量约 ×32！"
if dm >= 1.25:
    if dm < 1.75:
        msg = "差 1.5 级：能量约 ×178"
if dm >= 1.75:
    if dm < 2.25:
        msg = "差 2 级：能量约 ×1000！！"
if dm >= 2.25:
    if dm < 3:
        msg = "差快 3 级：能量差上万倍！"
if dm >= 3:
    msg = "差 3 级以上：能量差百万倍级别！"
if dm == 0:
    msg = "同级地震：能量相同"
if dm < 0:
    msg = "B 比 A 小：把 B 调大看能量差"
write(msg, -190, 130, "#ea580c", 14)
# 能量倍数可视化：×32 的小方块阶梯
fill_rect(-190, -150, 380, 6, "#e2e8f0")
i = 0
while i < dm * 60:
    fill_rect(-190 + i, -150, 6, 6, "#f97316")
    i = i + 60
write("震级每 +1 级 ≈ 能量 ×32（10^1.5）", -190, 105, "#1d4ed8", 12)
write("问「几倍是几个 32 相乘」→ 就是对数！", -190, -130, "#16a34a", 11)`,

'cross-127': `# 声音的产生探索台：音叉振动
amp = 3   # 振动幅度

hide()
# 音叉（两根实心叉臂 + 手柄）
xoff = amp * 4
fill_rect(-150, 40, 12, 160, "#94a3b8")
fill_rect(-190, -70, 90, 14, "#64748b")
# 振动时的左右偏移（示意）
if amp > 0:
    fill_rect(-150 - xoff, 40, 12, 160, "#cbd5e1")
    fill_rect(-150 + xoff, 40, 12, 160, "#cbd5e1")
# 声波（一圈圈扩散的环）
if amp > 0:
    i = 0
    while i < amp:
        ring(-144, 130, 24 + i * 24, "#fdba74")
        i = i + 1
# 波形（实心点连成的正弦带）
pen_color("#ea580c")
pen_down()
x = -80
go_to(-80, amp * 14 * sin(x * 4))
while x < 200:
    go_to(x, amp * 14 * sin(x * 4))
    x = x + 4
pen_up()
# 波峰上的小圆点
x = -80
while x < 200:
    circle(x, amp * 14 * sin(x * 4), 3, "#f97316")
    x = x + 20
write("振动幅度 " + amp + "：振得越猛，声音越响", -190, 158, "#dc2626", 12)
write("音叉振动 → 推挤空气 → 声波传进耳朵", -190, 132, "#1d4ed8", 11)
if amp > 4:
    write("太响啦！长时间会伤听力", -100, -120, "#ea580c", 11)
if amp == 1:
    write("幅度最小：轻轻的声音", -100, -120, "#16a34a", 11)`,

'math-12': `# 国王的麦粒探索台：每格翻倍
n = 10   # 棋盘格数

hide()
p = 1
i = 0
while i < n:
    p = p * 2
    h = 12 + i * 8
    if h > 150:
        h = 150
    x = -200 + i * 20
    col = "#bfdbfe"
    if i > 3:
        col = "#60a5fa"
    if i > 7:
        col = "#3b82f6"
    if i > 11:
        col = "#1d4ed8"
    if i > 15:
        col = "#1e3a8a"
    fill_rect(x + 8, -110 + h / 2, 14, h, col)
    i = i + 1
fill_rect(-210, -118, 420, 8, "#64748b")
write("第 " + n + " 格 = " + p + " 粒麦子！", -190, 140, "#dc2626", 13)
write("第 1 格 1 粒、第 2 格 2 粒、每格翻倍", -190, 115, "#1d4ed8", 11)
write("柱子早早顶到天：这就是指数爆炸", -190, -150, "#ea580c", 11)`,

'math-33': `# 频率估计概率探索台（掷出 6 的频率）
n = 300   # 掷的次数

hide()
count = 0
i = 0
while i < n:
    if random(1, 6) == 6:
        count = count + 1
    i = i + 1
freq = count * 100 / n
# 主柱：实测频率（高度 1 格 = 1%）
fill_rect(-90, -100 + freq * 2.4, 120, freq * 4.8, "#3b82f6")
write("开出 6 共 " + count + " 次", -150, 130, "#dc2626", 14)
write("实测频率 " + freq + " %", -150, 100, "#1d4ed8", 14)
# 理论线 1/6 ≈ 16.7%（红色虚线段拼成）
i = 0
while i < 8:
    fill_rect(-160 + i * 44, -100 + 16.7 * 4.8, 24, 4, "#dc2626")
    i = i + 1
write("理论概率 1/6 ≈ 16.7%", -150, -100 + 16.7 * 4.8 + 18, "#dc2626", 12)
# 底轴
fill_rect(0, -116, 400, 6, "#94a3b8")
write("掷 " + n + " 次：柱子越高=出 6 越多", -190, 158, "#0f172a", 12)
write("掷得越多，柱子越贴近红线（大数定律）", -190, -150, "#16a34a", 11)`,

'math-14': `# 掷骰子统计探索台
n = 120   # 掷的次数

hide()
c1 = 0
c2 = 0
c3 = 0
c4 = 0
c5 = 0
c6 = 0
i = 0
while i < n:
    f = random(1, 6)
    if f == 1:
        c1 = c1 + 1
    if f == 2:
        c2 = c2 + 1
    if f == 3:
        c3 = c3 + 1
    if f == 4:
        c4 = c4 + 1
    if f == 5:
        c5 = c5 + 1
    if f == 6:
        c6 = c6 + 1
    i = i + 1
i = 1
while i < 7:
    if i == 1:
        cnt = c1
    if i == 2:
        cnt = c2
    if i == 3:
        cnt = c3
    if i == 4:
        cnt = c4
    if i == 5:
        cnt = c5
    if i == 6:
        cnt = c6
    x = -170 + i * 52
    h = cnt * 260 / n
    if h < 4:
        h = 4
    col = "#3b82f6"
    if i == 6:
        col = "#f59e0b"
    fill_rect(x + 16, -100 + h / 2, 30, h, col)
    write(i, x + 16, -120, "#dc2626", 13)
    write(cnt, x + 16, -100 + h + 15, "#1d4ed8", 11)
    i = i + 1
fill_rect(0, -112, 440, 6, "#94a3b8")
write("掷 " + n + " 次：六个面谁多谁少？", -190, 155, "#0f172a", 12)
write("橙色=6 点。掷得越多，六根柱子越整齐！", -190, -150, "#16a34a", 11)`,

'math-40': `# 掷骰子画统计图探索台
n = 120   # 掷的次数

hide()
c1 = 0
c2 = 0
c3 = 0
c4 = 0
c5 = 0
c6 = 0
i = 0
while i < n:
    f = random(1, 6)
    if f == 1:
        c1 = c1 + 1
    if f == 2:
        c2 = c2 + 1
    if f == 3:
        c3 = c3 + 1
    if f == 4:
        c4 = c4 + 1
    if f == 5:
        c5 = c5 + 1
    if f == 6:
        c6 = c6 + 1
    i = i + 1
i = 1
while i < 7:
    if i == 1:
        cnt = c1
    if i == 2:
        cnt = c2
    if i == 3:
        cnt = c3
    if i == 4:
        cnt = c4
    if i == 5:
        cnt = c5
    if i == 6:
        cnt = c6
    x = -170 + i * 52
    h = cnt * 260 / n
    if h < 4:
        h = 4
    col = "#8b5cf6"
    if i == 6:
        col = "#f59e0b"
    fill_rect(x + 16, -100 + h / 2, 30, h, col)
    write(cnt, x + 16, -100 + h + 15, "#5b21b6", 11)
    i = i + 1
fill_rect(0, -112, 440, 6, "#94a3b8")
write("n = " + n + " 的柱状统计图", -190, 155, "#0f172a", 12)
write("把统计数字画成图，一眼看出规律", -190, -150, "#6d28d9", 11)`,

'math-19': `# 高斯求和探索台：1+2+…+n
n = 100   # 加到几

hide()
gauss = n * (n + 1) / 2
# 阶梯柱（20 根，从矮到高）
i = 1
while i < 21:
    h = i * n * 0.07
    if h > 150:
        h = 150
    x = -180 + i * 15
    col = "#bfdbfe"
    if i > 12:
        col = "#60a5fa"
    if i > 18:
        col = "#1d4ed8"
    fill_rect(x + 6, -100 + h / 2, 12, h, col)
    i = i + 1
fill_rect(0, -108, 400, 6, "#94a3b8")
write("1", -190, -95, "#1d4ed8", 10)
write("…", -130, -95, "#64748b", 10)
write(n, 90, 60, "#1d4ed8", 10)
write("高斯公式 n(n+1)/2", -190, 155, "#1d4ed8", 12)
write("1+2+…+" + n + " = " + gauss, -190, 128, "#dc2626", 15)
write("像梯形面积：(首+末)×项数÷2", -190, -150, "#16a34a", 11)`,

'math-26': `# 平均数探索台
spread = 2   # 波动幅度

hide()
# 十根成绩柱（围绕平均线波动）
i = 0
while i < 10:
    x = -180 + i * 38
    if i < 5:
        v = 40 + spread * (10 - i * 2)
    if i >= 5:
        v = 40 - spread * (10 - (i - 5) * 4 - 5)
    col = "#60a5fa"
    if v > 40:
        col = "#3b82f6"
    if v < 40:
        col = "#93c5fd"
    fill_rect(x + 14, 40 + (v - 40) / 2, 22, abs(v - 40), col)
    i = i + 1
# 平均线（红色虚线段）
i = 0
while i < 9:
    fill_rect(-190 + i * 44, 40, 30, 4, "#dc2626")
    i = i + 1
write("平均线（红）：大家都在它上下波动", -190, 80, "#dc2626", 11)
write("波动幅度 " + spread, -190, 155, "#0f172a", 13)
if spread > 3:
    write("忽高忽低：平均线依然稳稳居中", -190, 130, "#ea580c", 11)
if spread < 0.6:
    write("大家都一样：柱子几乎齐平", -190, 130, "#16a34a", 11)
write("平均数 = 总和 ÷ 个数：抹平了波动", -190, -120, "#1d4ed8", 11)`,

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
console.log(`视觉升级 ${changed} 节实验`);
