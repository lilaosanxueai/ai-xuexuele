import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第24轮视觉升级·批A（物理器材类 11 节）：只换 lab.code，params 等原样保留 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const CODES = {

'cross-08': `# 音调与频率探索台
freq = 3   # 振动频率

hide()
# 音箱（发出声音的盒子）
fill_rect(-215, 0, 26, 60, "#475569")
circle(-215, 10, 8, "#94a3b8")
circle(-215, -16, 4, "#64748b")
# 声波：曲线 + 波峰圆点
pen_color("#1d4ed8")
pen_down()
x = -190
go_to(-190, 60 * sin(x * freq))
while x < 200:
    go_to(x, 60 * sin(x * freq))
    x = x + 4
pen_up()
x = -190
while x < 195:
    circle(x, 60 * sin(x * freq), 4, "#f97316")
    x = x + 20
# 中轴线
fill_rect(0, 0, 400, 2, "#e2e8f0")
write("频率 " + freq + " 次/拍", -190, 145, "#dc2626", 14)
if freq > 8:
    write("波形密集 → 音调高（尖细）", -190, 115, "#ea580c", 12)
if freq < 4:
    write("波形稀疏 → 音调低（低沉）", -190, 115, "#16a34a", 12)
if freq >= 4:
    if freq <= 8:
        write("中等音调", -190, 115, "#1d4ed8", 12)
write("振动越快，音调越高", -190, -130, "#64748b", 11)`,

'cross-109': `# 凸透镜成像探索台（焦距 f=10cm）
u = 25   # 物距（厘米）

hide()
f = 10
# 光具座 + 透镜（蓝色竖片）
fill_rect(0, -2, 400, 4, "#94a3b8")
fill_rect(0, 0, 16, 210, "#bfdbfe")
pen_color("#1d4ed8")
pen_down()
go_to(-8, -105)
go_to(-8, 105)
go_to(8, 105)
go_to(8, -105)
go_to(-8, -105)
pen_up()
write("f=10", 18, 108, "#1d4ed8", 10)
# 焦点标记
circle(-80, 0, 5, "#dc2626")
circle(80, 0, 5, "#dc2626")
write("F", -80, 14, "#dc2626", 9)
write("F", 76, 14, "#dc2626", 9)
# 物体（绿色向上箭头）
xobj = 0 - u * 8
if xobj < -195:
    xobj = -195
fill_rect(xobj, 20, 14, 40, "#16a34a")
circle(xobj, 44, 7, "#16a34a")
write("物体", xobj - 18, 62, "#15803d", 11)
# 像：u>f 实像（右侧倒立），u<f 虚像（左侧正立）
v = f * u / (u - f)
if u > 10:
    xi = v * 8
    if xi > 190:
        xi = 190
    hi = 40 * v / u
    if hi > 90:
        hi = 90
    fill_rect(xi, -hi / 2, 12, hi, "#f97316")
    write("像（倒立）", xi - 24, -hi / 2 - 16, "#c2410c", 10)
if u <= 10:
    xi = xobj + v * 8
    if xi > 190:
        xi = 190
    hi = 40 * v / u
    if hi > 90:
        hi = 90
    fill_rect(xi, 10, 12, hi, "#f97316")
    write("虚像（正立放大）", xi - 30, hi + 24, "#c2410c", 10)
write("物体在 " + u + "cm 处", -190, 145, "#0f172a", 12)
if u > 20:
    write("u>2f：倒立缩小实像（照相机）", -100, -130, "#ea580c", 13)
if u <= 20:
    if u > 10:
        write("f<u<2f：倒立放大实像（投影仪）", -110, -130, "#ea580c", 13)
if u <= 10:
    write("u<f：正立放大虚像（放大镜）", -100, -130, "#dc2626", 13)`,

'cross-110': `# 比热容探索台：同样加热，谁升温快？
q = 8400   # 吸收的热量（焦耳）

hide()
dt_water = q / 4200
dt_sand = q / 900
# 两只烧杯：水（蓝）和砂石（沙色）
fill_rect(-130, -70, 110, 12, "#94a3b8")
fill_rect(-124, -64, 96, 84, "#bfdbfe")
fill_rect(30, -70, 110, 12, "#94a3b8")
fill_rect(36, -64, 96, 84, "#fde68a")
write("水", -130, 32, "#1d4ed8", 13)
write("砂石", 34, 32, "#b45309", 13)
# 温度计（升温条：砂石总是更快更高）
fill_rect(-130, 90, 96, 10, "#e2e8f0")
fill_rect(-178, 90, dt_water * 3.4, 10, "#3b82f6")
write("水升温", -215, 86, "#1d4ed8", 10)
fill_rect(30, 70, 96, 10, "#e2e8f0")
fill_rect(30 - dt_sand * 1.7, 70, dt_sand * 3.4, 10, "#f59e0b")
write("砂石升温", -70, 66, "#b45309", 10)
# 太阳（热量来源）
circle(-160, 130, 10, "#fbbf24")
write("同样吸热 " + q + " J", 60, 135, "#dc2626", 13)
write("砂石升温≈水的 4.7 倍：水的比热容大", -215, -110, "#ea580c", 12)
write("海边白天砂子烫脚、海水凉凉", -215, -132, "#1d4ed8", 11)`,

'cross-111': `# 压强探索台：P = F / S，面积越小压强越大
f = 10   # 按压力（牛）

hide()
# 墙面
fill_rect(-230, 0, 20, 300, "#cbd5e1")
# 图钉：尖头（深色小面积）+ 钉帽（宽大面积）
fill_rect(-160, 0, 70, 12, "#64748b")
fill_rect(-92, 0, 6, 10, "#334155")
write("图钉尖（面积超小）", -175, 30, "#dc2626", 11)
# 手指（宽大面积）
fill_rect(-20, -6, 90, 26, "#fbc4b4")
fill_rect(80, 0, 6, 10, "#334155")
write("手指肚（面积大）", -30, 30, "#1d4ed8", 11)
# 压力箭头（长度∝按压力）
fill_rect(-130, 60, f, 10, "#dc2626")
write("F=" + f + "牛", -130, 80, "#dc2626", 11)
fill_rect(10, 60, f, 10, "#dc2626")
# 压强对比柱（同样压力，尖的压强巨大）
fill_rect(-60, -80, 40, 8, "#e2e8f0")
fill_rect(-60, -80, 20, 8, "#1d4ed8")
write("手指压强（短条）", -140, -84, "#1d4ed8", 10)
fill_rect(100, -110, 40, 8, "#e2e8f0")
fill_rect(100, -110, 36, 8, "#dc2626")
write("钉尖压强（顶格长条）", 30, -114, "#dc2626", 10)
write("同样按 " + f + " 牛", -190, 145, "#0f172a", 13)
write("钉尖压强是指肚的 100 倍：P=F/S", -190, 122, "#ea580c", 12)
write("书包带做宽、图钉做尖，都是改面积调压强", -210, -140, "#1d4ed8", 10)`,

'cross-21': `# 惯性滑行探索台：摩擦吃掉了滑行距离
v0 = 10    # 初速度
fric = 1   # 摩擦档位（1=冰面 2=木地板 3=毛毯）

hide()
d1 = v0 * 9 / 2
if d1 > 400:
    d1 = 400
d2 = v0 * 9 / 4
if d2 > 400:
    d2 = 400
d3 = v0 * 9 / 6
if d3 > 400:
    d3 = 400
# 三条车道：冰面/木地板/毛毯
fill_rect(0, 60, 440, 26, "#bae6fd")
fill_rect(0, 0, 440, 26, "#fcd34d")
fill_rect(0, -60, 440, 26, "#a3a3a3")
write("冰面", -224, 60, "#0369a1", 11)
write("木地板", -232, 0, "#a16207", 11)
write("毛毯", -226, -60, "#404040", 11)
# 三辆小车：停在各自的滑行终点
write("🚗", -214 + d1, 60, "#1d4ed8", 16)
write("🚗", -214 + d2, 0, "#a16207", 16)
write("🚗", -214 + d3, -60, "#404040", 16)
# 滑行轨迹（速度渐减的点）
fill_rect(-200 + d1 / 2, 47, d1 / 2, 3, "#93c5fd")
fill_rect(-200 + d2 / 2, -13, d2 / 2, 3, "#fde68a")
fill_rect(-200 + d3 / 2, -73, d3 / 2, 3, "#d4d4d4")
write("冰面滑 " + d1 + " 格", -195, 88, "#0369a1", 11)
write("木板滑 " + d2 + " 格", -195, 28, "#a16207", 11)
write("毛毯滑 " + d3 + " 格", -195, -34, "#404040", 11)
write("初速度 " + v0 + "：摩擦越小滑得越远", -195, 135, "#ea580c", 12)
write("要是完全没有摩擦，会一直滑下去（牛顿第一定律）", -215, -120, "#1d4ed8", 11)`,

'cross-22': `# 杠杆平衡探索台：左力矩 = 右力矩？
L1 = 2   # 左力臂（米）
m1 = 5   # 左边物重（千克）

hide()
torqueL = L1 * m1
torqueR = 2 * 5
dip = torqueL - torqueR
leftY = 0 - dip * 3
rightY = 0 + dip * 3
if leftY < -70:
    leftY = -70
if leftY > 70:
    leftY = 70
if rightY < -70:
    rightY = -70
if rightY > 70:
    rightY = 70
# 平衡参考线（虚线）
i = 0
while i < 9:
    fill_rect(-200 + i * 46, 0, 30, 2, "#e2e8f0")
    i = i + 1
# 杠杆（粗梁）+ 支点（三角）
pen_color("#7c2d12")
pen_down()
go_to(-150, leftY)
go_to(150, rightY)
pen_up()
fill_rect(-14, -20, 10, 16, "#7c2d12")
fill_rect(-18, -26, 18, 8, "#7c2d12")
fill_rect(-22, -34, 26, 10, "#7c2d12")
# 左右重物（大小∝重量，挂在梁端）
fill_rect(-150, leftY + 14 + m1 * 2, m1 * 4, m1 * 4, "#7c3aed")
write(m1 + "kg", -150, leftY + 16 + m1 * 4, "#6d28d9", 10)
fill_rect(150, rightY + 24, 20, 20, "#f59e0b")
write("5kg", 150, rightY + 48, "#b45309", 10)
# 力臂标注
pen_color("#94a3b8")
pen_down()
go_to(-150, leftY - 30)
go_to(-150, leftY - 18)
go_to(0, -18)
go_to(0, -30)
pen_up()
write("L₁=" + L1 + "m", -110, leftY - 36, "#64748b", 10)
write("L₂=2m", 60, rightY - 36, "#64748b", 10)
if torqueL == torqueR:
    write("平衡！两边力矩都是 " + torqueL, -60, 130, "#16a34a", 14)
if torqueL > torqueR:
    write("左边沉！左力矩 " + torqueL + " > 右边 10", -80, 130, "#ea580c", 13)
if torqueL < torqueR:
    write("右边沉：左力矩 " + torqueL + " < 10", -80, 130, "#1d4ed8", 13)
write("杠杆原理：动力×动力臂 = 阻力×阻力臂", -190, -120, "#64748b", 11)`,

'cross-23': `# 串并联电阻探索台
r1 = 3   # 电阻一
r2 = 3   # 电阻二

hide()
series = r1 + r2
parallel = 1 / (1 / r1 + 1 / r2)
# 上：串联电路（一个回路串两个电阻块）
pen_color("#334155")
pen_down()
go_to(-170, 90)
go_to(170, 90)
go_to(170, 40)
go_to(-170, 40)
go_to(-170, 90)
pen_up()
fill_rect(-100, 84, 44, 14, "#f59e0b")
write("R₁", -100, 90, "#ffffff", 9)
fill_rect(20, 84, 44, 14, "#f59e0b")
write("R₂", 20, 90, "#ffffff", 9)
fill_rect(-40, 33, 20, 6, "#334155")
fill_rect(-30, 26, 6, 20, "#334155")
write("串联：一条路排队走", -80, 118, "#334155", 11)
# 下：并联电路（两条支路各一个电阻）
pen_color("#334155")
pen_down()
go_to(-170, -30)
go_to(-110, -30)
go_to(-110, -80)
go_to(110, -80)
go_to(110, -30)
go_to(170, -30)
go_to(170, 10)
go_to(110, 10)
go_to(110, -40)
go_to(-110, -40)
go_to(-110, 10)
go_to(-170, 10)
go_to(-170, -30)
pen_up()
fill_rect(-40, -86, 44, 14, "#f59e0b")
write("R₁", -40, -80, "#ffffff", 9)
fill_rect(-40, -46, 44, 14, "#f59e0b")
write("R₂", -40, -40, "#ffffff", 9)
write("并联：两条路分头走", -80, -8, "#334155", 11)
# 结果柱
fill_rect(-206, 145, 44, 12, "#e2e8f0")
fill_rect(-230, 145, series * 6, 12, "#dc2626")
write("串联 " + series + "Ω（更大）", -190, 160, "#dc2626", 11)
fill_rect(40, 130, 44, 12, "#e2e8f0")
fill_rect(20, 130, parallel * 6, 12, "#1d4ed8")
write("并联 " + parallel + "Ω（更小）", 60, 145, "#1d4ed8", 11)
write("R₁=" + r1 + "Ω  R₂=" + r2 + "Ω：并联总电阻比任何一个都小", -215, -130, "#ea580c", 12)`,

'cross-68': `# 简谐运动探索台：x = A·sin(ωt)
A = 80   # 振幅
w = 36   # 角速度（度/秒）

hide()
# 秋千：横梁 + 吊绳 + 摆到最大角的座椅
fill_rect(-60, 140, 120, 8, "#7c2d12")
circle(0, 136, 5, "#334155")
ang = A / 2
bx = 120 * sin(ang)
by = 136 - 120 * cos(ang)
pen_color("#7c2d12")
pen_down()
go_to(0, 136)
go_to(bx, by)
pen_up()
fill_rect(bx, by - 8, 30, 12, "#f59e0b")
# 中间与另一侧的"影子"秋千
bx0 = 0
by0 = 16
fill_rect(bx0 - 15, by0 - 8, 30, 12, "#fde68a")
bx2 = 0 - bx
fill_rect(bx2 - 15, by0 - 8, 30, 12, "#fed7aa")
# 振动曲线（x-t 图）+ 圆点
pen_color("#16a34a")
pen_down()
t = 0
go_to(-200, -60 + A * sin(w * t) / 2)
while t < 24.1:
    x = A * sin(w * t)
    go_to(-200 + t * 16, -60 + x / 2)
    t = t + 0.25
pen_up()
t = 0
while t < 24:
    circle(-200 + t * 16, -60 + A * sin(w * t) / 2, 3, "#ea580c")
    t = t + 6
write("A=" + A + "（摆得越远）  ω=" + w + "（摆得越快）", -190, 118, "#16a34a", 12)
write("横轴=时间，纵轴=偏离中心的距离", -190, -130, "#1d4ed8", 11)
write("秋千、弹簧、声音振动都是简谐运动", -190, -150, "#64748b", 10)`,

'cross-98': `# 功与功率探索台：W = mgh，P = W/t
h = 15   # 楼高（米）
m = 35   # 你的体重（千克）

hide()
g = 10
w1 = m * g * h
p1 = w1 / 30
m2 = 70
w2 = m2 * g * h
p2 = w2 / 45
# 楼房（每层一格）
i = 0
while i < h:
    fill_rect(-150, -150 + i * 10, 80, 8, "#cbd5e1")
    i = i + 1
if h > 15:
    write("楼高 h=" + h + "m", -190, 155, "#64748b", 10)
# 两个爬楼人（所在高度=楼顶）
write("🧒", -135, -150 + h * 10 + 6, "#1d4ed8", 15)
write("👨", -90, -150 + h * 10 + 6, "#dc2626", 15)
# 做功对比柱
fill_rect(-50, -80, 100, 12, "#e2e8f0")
fill_rect(-100, -80, w1 / 12, 12, "#3b82f6")
write("你做功 " + w1 + " J", -100, -60, "#1d4ed8", 11)
fill_rect(120, -80, 100, 12, "#e2e8f0")
fill_rect(20, -80, w2 / 12, 12, "#f97316")
write("爸爸做功 " + w2 + " J", 60, -60, "#c2410c", 11)
# 功率对比柱（同样按比例）
fill_rect(-50, -120, 100, 10, "#e2e8f0")
fill_rect(-100, -120, p1 * 6, 10, "#22c55e")
write("你的功率（30 秒登顶）", -100, -138, "#15803d", 10)
fill_rect(120, -120, 100, 10, "#e2e8f0")
fill_rect(20, -120, p2 * 6, 10, "#a855f7")
write("爸爸的功率（45 秒登顶）", 60, -138, "#7e22ce", 10)
write("体重 " + m + "kg，楼高 " + h + "m：W=mgh", -190, 130, "#0f172a", 12)
if p1 > p2:
    write("你先到顶：功率更大（做功快）！", -90, 105, "#16a34a", 12)
if p1 < p2:
    write("爸爸先到顶：功率更大！", -90, 105, "#16a34a", 12)`,

'hb-06': `# 密度鉴定所探索台：ρ = m / V
m = 79   # 质量（克）
v = 10   # 体积（立方厘米）

hide()
rho = m / v
# 三块金属（实心立方块，柱高∝密度）
fill_rect(-170, -80 + 2.7 * 20 / 2, 40, 2.7 * 20, "#94a3b8")
write("铝 2.7", -170, -80 + 2.7 * 20 + 16, "#475569", 11)
fill_rect(-90, -80 + 7.9 * 20 / 2, 40, 7.9 * 20, "#78716c")
write("铁 7.9", -90, -80 + 7.9 * 20 + 16, "#44403c", 11)
rh = rho * 20
if rh > 170:
    rh = 170
fill_rect(0, -80 + rh / 2, 40, rh, "#dc2626")
write("你的", 0, -80 + rh + 16, "#dc2626", 11)
# 天平托盘（称质量的场景）
fill_rect(120, -85, 80, 8, "#94a3b8")
fill_rect(120, -70, 8, 50, "#64748b")
write("⚖️ 称质量 m=" + m + "g", 60, -110, "#0f172a", 11)
write("量体积 V=" + v + "cm³", 60, -130, "#0f172a", 11)
write(m + "g ÷ " + v + "cm³ → 密度", -190, 145, "#dc2626", 14)
if rho > 2.5:
    if rho < 3:
        write("和铝一样轻：可能是一块铝！", 60, 100, "#16a34a", 12)
if rho > 7:
    if rho < 9:
        write("和铁相仿：可能是一块铁！", 60, 100, "#16a34a", 12)
if rho > 15:
    write("比铁还密——重金属！", 60, 100, "#ea580c", 12)
write("同体积比质量：密度是物质的身份证", -210, -140, "#1d4ed8", 11)`,

'hb-13': `# 牛顿第二定律·双视图：v-t 图 + 小车位移
F = 20   # 作用力
m = 4    # 质量

hide()
a = F / m
# v-t 折线 + 整秒圆点
pen_color("#dc2626")
pen_down()
go_to(-200, 30)
tt = 0
while tt < 6.01:
    go_to(-200 + tt * 60, 30 + a * tt * 8)
    tt = tt + 1
pen_up()
tt = 0
while tt < 7:
    circle(-200 + tt * 60, 30 + a * tt * 8, 4, "#dc2626")
    tt = tt + 1
write("v-t 图：斜率=加速度", 60, 40, "#dc2626", 10)
# 地面 + 小车 + 力箭头 + 质量砝码
fill_rect(0, -118, 440, 8, "#4d7c0f")
write("🚙", -184, -100, "#0f172a", 18)
fill_rect(-160, -88, m * 5, 12, "#7c3aed")
write("m", -160, -82, "#ffffff", 9)
fill_rect(-215, -100, F, 8, "#16a34a")
write("F", -220, -90, "#15803d", 11)
# 位移条（6 秒走了多远）
d2 = a * 25 * 1.4
if d2 > 400:
    d2 = 400
fill_rect(-200 + d2 / 2, -70, d2, 6, "#f59e0b")
write("F=" + F + "N，m=" + m + "kg：a=F/m", -190, 150, "#dc2626", 12)
write("力越大/越轻 → 加速度越大（斜率越陡）", -190, 128, "#ea580c", 11)
write("6 秒滑行的距离（橙条）也随之变长", -190, -140, "#b45309", 11)`,

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
console.log(`视觉升级批A（物理）: ${changed} 节`);
