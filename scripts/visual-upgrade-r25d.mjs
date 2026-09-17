import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第24轮视觉升级·批D（地理/科学/数学增强 12 节）：只换 lab.code，params 等原样保留 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const CODES = {

'cross-16': `# 地球公转与四季探索台
deg = 0   # 地球在公转轨道上的角度（0°=春分）

hide()
# 太阳（发光）
circle(0, 0, 26, "#fbbf24")
ring(0, 0, 34, "#fde68a")
ring(0, 0, 42, "#fef3c7")
# 公转轨道
ring(0, 0, 120, "#94a3b8")
# 阳光照射方向（指向地球的黄色光柱）
ex = 120 * cos(deg)
ey = 120 * sin(deg)
fill_rect(ex / 2 + 13 * cos(deg), ey / 2 + 13 * sin(deg), 60, 10, "#fde047")
# 地球（蓝球 + 绿色大陆 + 地轴斜线）
circle(ex, ey, 15, "#3b82f6")
circle(ex - 4, ey + 4, 5, "#22c55e")
circle(ex + 6, ey - 3, 4, "#22c55e")
pen_color("#0f172a")
pen_down()
go_to(ex - 20 * cos(23), ey + 20 * sin(23))
go_to(ex + 20 * cos(23), ey - 20 * sin(23))
pen_up()
season = "春 🌸"
if deg > 90:
    season = "夏 ☀️"
if deg > 180:
    season = "秋 🍂"
if deg > 270:
    season = "冬 ❄️"
write("北半球：" + season, -150, -130, "#dc2626", 15)
write("公转到 " + deg + "°", -150, -152, "#0f172a", 12)
write("轨道是近圆的：四季由地轴倾斜造成，不是距离远近", -215, 150, "#1d4ed8", 11)
write("🌍=地球（黑线=倾斜的地轴）", -215, 128, "#64748b", 10)`,

'cross-17': `# 纬度带探险探索台
lat = 40   # 纬度

hide()
# 地球（蓝色实心球）
circle(0, 0, 110, "#3b82f6")
circle(-30, 30, 16, "#22c55e")
circle(35, -20, 20, "#22c55e")
circle(20, 60, 10, "#22c55e")
# 纬线（绿色横线；选中的变红加粗）
qq = -80
while qq < 81:
    x = 110 * cos(qq)
    if qq == lat:
        fill_rect(0, 110 * sin(lat), x * 2, 6, "#dc2626")
    qq = qq + 10
qq = -80
while qq < 81:
    x = 110 * cos(qq)
    if qq != lat:
        pen_color("#86efac")
        pen_down()
        go_to(-x, 110 * sin(qq))
        go_to(x, 110 * sin(qq))
        pen_up()
    qq = qq + 10
# 选中纬线上的定位点
y = 110 * sin(lat)
x = 110 * cos(lat)
circle(x, y, 8, "#dc2626")
zone = "北温带"
if lat > 66:
    zone = "北寒带 ❄️"
if lat < 23:
    if lat > -23:
        zone = "热带 🌴"
if lat < -66:
    zone = "南寒带 ❄️"
if lat < -23:
    if lat > -66:
        zone = "南温带"
write("纬度 " + lat + "° → " + zone, -190, 145, "#dc2626", 14)
write("红线=你选的纬线", -190, 120, "#ea580c", 10)
write("纬度越高太阳越斜 → 越冷", -190, -135, "#1d4ed8", 11)`,

'cross-95': `# 等高线探索台：把山一层层切给你看
peak = 400   # 山的海拔（米）

hide()
layers = peak / 100
# 俯视：一圈圈实心等高线（由外到内颜色随高度变浅）
i = layers
while i > 0:
    r = 15 + i * 30
    col = "#4d7c0f"
    if i == 2:
        col = "#a16207"
    if i == 3:
        col = "#d6d3d1"
    if i == 4:
        col = "#f5f5f4"
    if i == 5:
        col = "#ffffff"
    circle(0, 0, r, col)
    ring(0, 0, r, "#78350f")
    i = i - 1
write("⛰", 0, 4, "#0f172a", 13)
write("海拔 " + peak + " 米，切了 " + layers + " 层", -190, 152, "#dc2626", 13)
write("从天上看：同一圈上高度相同", -190, 130, "#1d4ed8", 11)
write("圈挤在一起=坡陡，圈疏=坡缓", -190, 108, "#ea580c", 11)
write("绿色山脚→雪白山顶", -190, -150, "#64748b", 10)`,

'hb-11': `# 中国三级阶梯探索台
step = 1   # 阶梯编号

hide()
# 三级阶梯（实心台阶：西高东低）
fill_rect(-160, 40, 130, 120, "#f59e0b")
fill_rect(-30, -10, 130, 70, "#a16207")
fill_rect(100, -60, 100, 50, "#4d7c0f")
fill_rect(0, -95, 420, 10, "#38bdf8")
write("第一级 青藏高原 >4000m", -215, 70, "#7c2d12", 10)
write("第二级 高原盆地 1000-2000m", -205, 8, "#7c2d12", 9)
write("第三级 平原丘陵 <500m", 108, -28, "#365314", 9)
write("🌊 海", 150, -110, "#0369a1", 10)
# 高亮当前阶梯 + 小旗
if step == 1:
    fill_rect(-160, 40, 130, 120, "#fbbf24")
    write("🚩", -95, 105, "#dc2626", 16)
    write("第一级：青藏高原「世界屋脊」", -190, 150, "#dc2626", 12)
    write("雪山连绵，长江黄河从这里出发", -190, 128, "#1d4ed8", 10)
if step == 2:
    fill_rect(-30, -10, 130, 70, "#facc15")
    write("🚩", 35, 25, "#dc2626", 16)
    write("第二级：高原和盆地", -190, 150, "#dc2626", 12)
    write("黄土高原/云贵高原/四川盆地…", -190, 128, "#1d4ed8", 10)
if step == 3:
    fill_rect(100, -60, 100, 50, "#86efac")
    write("🚩", 150, -32, "#dc2626", 16)
    write("第三级：平原丘陵", -190, 150, "#dc2626", 12)
    write("华北平原/长江中下游平原：人口密集", -190, 128, "#1d4ed8", 10)
# 大江东流（蓝色箭头）
fill_rect(-140, -85, 330, 8, "#3b82f6")
fill_rect(180, -85, 12, 16, "#1d4ed8")
write("江河东流入海（地势西高东低）", -140, -118, "#15803d", 11)`,

'hb-16': `# 大气受热探索台：太阳→大气→地面→逆辐射
cloud = 20   # 云层遮挡掉的短波
back = 60    # 大气逆辐射送还地面

hide()
sun = 100
reach = sun - cloud
net = reach + back
# 地面（绿色）+ 大气层（浅蓝带）
fill_rect(0, -90, 480, 50, "#4d7c0f")
fill_rect(0, 40, 480, 100, "#bae6fd")
# 太阳与阳光（被云挡掉一部分）
circle(-170, 120, 20, "#fbbf24")
i = 0
while i < 10:
    h2 = 200 - i * 20
    if i * 10 < reach:
        fill_rect(-120 + i * 22, 30, 10, 100, "#fde047")
    i = i + 1
# 云（灰色团块，数量∝遮挡）
i = 0
while i * 12 < cloud:
    circle(-110 + i * 20, 90, 14, "#e2e8f0")
    i = i + 1
if cloud > 0:
    circle(-118, 98, 12, "#f1f5f9")
# 地面受热（橙红光晕 ∝ 净收入）
glow = net / 2
if glow > 95:
    glow = 95
fill_rect(0, -50, 480, 18, "#f97316")
fill_rect(0, -40, 480, 6, "#fdba74")
# 大气逆辐射（红色箭头指回地面，宽度∝back）
i = 0
while i * 20 < back:
    fill_rect(-100 + i * 40, -10, 12, 40, "#dc2626")
    fill_rect(-106 + i * 40, -18, 24, 10, "#b91c1c")
    i = i + 1
write("太阳 100 → 穿过云到地面 " + reach, -190, 152, "#b45309", 11)
write("大气逆辐射还回 " + back + "（地面的棉被）", -190, 130, "#dc2626", 11)
write("地面净收入 = " + reach + " + " + back + " = " + net, -190, -130, "#0f172a", 13)
write("多云的夜里逆辐射更强 → 更暖和", -190, -150, "#1d4ed8", 11)`,

'geo-04': `# 海拔攀登探索台
alt = 2000   # 海拔（米）

hide()
h = alt / 8848 * 150
# 大海（左）与山（右侧逐层收缩的山体）
fill_rect(-200, -90 + 50, 100, 100, "#3b82f6")
i = 0
while i < 6:
    w = 320 - i * 48
    if w < 40:
        w = 40
    y = -95 + i * 28
    col = "#4d7c0f"
    if i == 2:
        col = "#a16207"
    if i == 3:
        col = "#78716c"
    if i == 4:
        col = "#d6d3d1"
    if i > 4:
        col = "#ffffff"
    fill_rect(90 - w / 2 + 90, y + 14, w, 28, col)
    i = i + 1
# 海平面基准线（红色虚线）
i = 0
while i < 8:
    fill_rect(-230 + i * 60, -48, 40, 4, "#dc2626")
    i = i + 1
write("海平面 0m", -215, -60, "#dc2626", 9)
# 攀登者（高度=海拔）
write("🧗", 60, -50 + h, "#0f172a", 15)
# 海拔标尺（右侧）
fill_rect(210, 30, 20, 140, "#e2e8f0")
fill_rect(210, 100 - h / 2 + 0, 20, h, "#f59e0b")
temp = 20 - alt / 100 * 0.6
band = "山地"
if alt < 1500:
    band = "丘陵/平原"
if alt > 3500:
    band = "高山"
if alt > 5500:
    band = "雪山带"
write("海拔 " + alt + " 米（" + band + "）", -190, 148, "#dc2626", 13)
write("气温约 " + temp + "℃（每升百米降 0.6℃）", -190, 126, "#1d4ed8", 12)
write("相对高度 = 两地海拔之差", -190, -140, "#ea580c", 10)`,

'cross-35': `# 光与影探索台
w = 30   # 遮挡物宽度

hide()
# 灯 + 光线边界
write("💡", -12, 108, "#f59e0b", 18)
# 遮挡物（实心深绿块）
fill_rect(0, 42, w, 26, "#166534")
# 光线（灯到物体顶再到影子边）
pen_color("#fde047")
pen_down()
go_to(-w / 2, 100)
go_to(0 - w, -66)
pen_up()
pen_down()
go_to(w / 2, 100)
go_to(w, -66)
pen_up()
# 地面 + 影子（实心深灰）
fill_rect(0, -100, 480, 12, "#a8a29e")
sw = w * 2
fill_rect(0, -90, sw, 10, "#44403c")
write("物体宽 " + w + "，影子宽 " + sw, -190, 145, "#dc2626", 12)
write("光是直线传播：被挡住的地方才有影子", -190, 120, "#1d4ed8", 11)
write("离灯越近，影子越大", -190, -130, "#64748b", 10)`,

'cross-37': `# 摩擦力大比拼探索台
surface = 1   # 1=冰面 2=木地板 3=毛毯
v0 = 20       # 初速度

hide()
d1 = v0 * 7
if d1 > 380:
    d1 = 380
d2 = v0 * 7 / 2
if d2 > 380:
    d2 = 380
d3 = v0 * 7 / 3
if d3 > 380:
    d3 = 380
# 三种路面（冰蓝/木黄/毯灰），选中的加亮框
fill_rect(0, 62, 440, 28, "#bae6fd")
fill_rect(0, 0, 440, 28, "#fcd34d")
fill_rect(0, -62, 440, 28, "#a3a3a3")
if surface == 1:
    fill_rect(0, 62, 440, 28, "#7dd3fc")
if surface == 2:
    fill_rect(0, 0, 440, 28, "#fde047")
if surface == 3:
    fill_rect(0, -62, 440, 28, "#d4d4d8")
write("🚗", -212 + d1, 62, "#0369a1", 15)
write("🚗", -212 + d2, 0, "#a16207", 15)
write("🚗", -212 + d3, -62, "#404040", 15)
fill_rect(-200, 47, d1 / 2, 4, "#e0f2fe")
fill_rect(-200, -15, d2 / 2, 4, "#fef9c3")
fill_rect(-200, -77, d3 / 2, 4, "#e5e5e5")
sname = "冰面（摩擦小）"
if surface == 2:
    sname = "木地板（摩擦中）"
if surface == 3:
    sname = "毛毯（摩擦大）"
write(sname + "：初速 " + v0 + " 滑 " + v0 * 7 / surface + " 格", -190, 140, "#dc2626", 12)
write("冰 " + d1 + " 格 ｜ 木 " + d2 + " 格 ｜ 毯 " + d3 + " 格", -190, 116, "#0f172a", 11)
write("摩擦把动能变成热，车慢慢停下", -190, -130, "#1d4ed8", 10)`,

'cross-39': `# 营养家族分类探索台
food = 1   # 食物编号

hide()
# 餐盘（大盘 + 边圈）
circle(0, -20, 110, "#f8fafc")
ring(0, -20, 110, "#cbd5e1")
circle(0, -20, 78, "#f1f5f9")
# 六类食物摆在盘边（选中的放大到盘子中心）
i = 1
while i < 7:
    a = i * 51 - 90
    ix = 94 * cos(a)
    iy = -20 + 94 * sin(a)
    write("·", ix, iy, "#94a3b8", 14)
    i = i + 1
write("🍚", -58, 34, "#0f172a", 13)
write("🥩", 0, 52, "#0f172a", 13)
write("🥑", 58, 34, "#0f172a", 13)
write("🥬", 58, -74, "#0f172a", 13)
write("🍞", 0, -92, "#0f172a", 13)
write("💧", -58, -74, "#0f172a", 13)
big = "🍚"
if food == 2:
    big = "🥩"
if food == 3:
    big = "🥑"
if food == 4:
    big = "🥬"
if food == 5:
    big = "🍞"
if food == 6:
    big = "💧"
write(big, 0, -22, "#0f172a", 30)
name = "米饭面条"
nutri = "碳水化合物"
group = "供能主力"
if food == 2:
    name = "肉蛋奶豆"
    nutri = "蛋白质"
    group = "长身体修组织"
if food == 3:
    name = "坚果植物油"
    nutri = "脂肪"
    group = "储备能量"
if food == 4:
    name = "蔬菜水果"
    nutri = "维生素+矿物质"
    group = "身体调节剂"
if food == 5:
    name = "全谷物"
    nutri = "膳食纤维"
    group = "肠道清道夫"
if food == 6:
    name = "水"
    nutri = "不是营养但最重要"
    group = "占体重 60%"
write("「" + name + "」营养：" + nutri, -120, 152, "#dc2626", 12)
write("作用：" + group, -120, 130, "#15803d", 11)
write("六大营养素都要吃，偏食长不高！", -120, -152, "#ea580c", 11)`,

'hb-04': `# 土壤小侦探探索台
water = 1.5   # 含水量

hide()
# 透明取样杯 + 三层实心
fill_rect(-60, 0, 150, 14, "#94a3b8")
fill_rect(-52, -6, 134, 120, "#f5f5f4")
fill_rect(-52, -6 + 55, 134, 60, "#d6a76c")
fill_rect(-52, -6 + 30, 134, 44, "#b45309")
h2 = water * 28
if h2 > 82:
    h2 = 82
fill_rect(-52, -6 + h2 / 2, 134, h2, "#7dd3fc")
# 腐殖质（深色小点）
i = 0
while i < 8:
    circle(-40 + i * 17, -12, 4, "#365314")
    i = i + 1
write("水 ↑", -95, 40, "#0369a1", 10)
write("黏粒 ↓ 中层", -95, 6, "#7c2d12", 9)
write("砂粒 ↓ 底层", -95, -26, "#92400e", 9)
write("黑点=腐殖质（烂叶子变的宝贝）", -190, -125, "#365314", 10)
type = "壤土（最好种菜！）"
if water > 2.5:
    type = "太湿成泥了！"
if water < 0.5:
    type = "太干，植物喝不到水"
write("含水量 " + water + " → " + type, -190, 148, "#dc2626", 12)
write("砂粒多渗水快，黏粒多保水强", -190, 126, "#1d4ed8", 11)
write("渗水实验：沙土最快、黏土最慢", -190, -148, "#64748b", 10)`,

'math-10': `# 二次函数 y = a·x² 探索台
a = 1    # 开口系数 a

hide()
col = "#16a34a"
if a < 0:
    col = "#dc2626"
if a == 0:
    col = "#ea580c"
pen_color(col)
pen_down()
go_to(-6 * 30, a * -6 * -6 * 8)
for x in range(-6, 7):
    go_to(x * 30, a * x * x * 8)
pen_up()
if a != 0:
    # 曲线上的滚动球（在 x=3 处）+ 顶点大圆点
    circle(3 * 30, a * 3 * 3 * 8, 10, "#f97316")
    circle(0, 0, 6, "#1d4ed8")
write("y = " + a + "x²", 120, 140, col, 15)
if a > 0:
    write("开口向上（笑脸碗）", 100, 116, "#15803d", 12)
if a < 0:
    write("开口向下（雨伞顶）", 100, 116, "#dc2626", 12)
if a == 0:
    write("a=0 时变成直线啦", 100, 116, "#ea580c", 12)
if a != 0:
    write("|a| 越大碗越瘦、越小越胖", -190, -140, "#64748b", 10)
if a != 0:
    write("橙球在曲线上：x=3 时 y=" + a * 9, -190, -155, "#c2410c", 10)`,

'math-44': `# 二次函数 y = ax² + bx + c 与顶点探索台
a = 0.5  # 二次系数 a
b = 2    # 一次系数 b
c = -3   # 常数 c

hide()
vx = -b / (2 * a)
vy = c - b * b / (4 * a)
pen_color("#1d4ed8")
pen_down()
x = -7
y = a * x * x + b * x + c
go_to(x * 25, y * 12)
while x < 7.01:
    y = a * x * x + b * x + c
    go_to(x * 25, y * 12)
    x = x + 0.25
pen_up()
# 顶点（大红点）+ 对称轴（红色虚线）
circle(vx * 25, vy * 12, 9, "#dc2626")
i = 0
while i < 12:
    fill_rect(vx * 25, -150 + i * 26, 4, 16, "#f87171")
    i = i + 1
# 从顶点投到两轴的参考虚线
i = 0
while i < 6:
    fill_rect(vx * 25 + i * 7, vy * 12 - 2, 5, 4, "#fca5a5")
    i = i + 1
if a > 0:
    write("顶点是最低点（最小值）", -190, 150, "#15803d", 12)
if a < 0:
    write("顶点是最高点（最大值）", -190, 150, "#dc2626", 12)
write("对称轴 x = -b/2a（红虚线）", -190, 128, "#ea580c", 11)
write("y = " + a + "x² + " + b + "x + " + c, -190, -150, "#1d4ed8", 12)
write("红点=顶点：最值就发生在它身上", -190, -128, "#64748b", 10)`,

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
console.log(`视觉升级批D（地理/科学/数学）: ${changed} 节`);
