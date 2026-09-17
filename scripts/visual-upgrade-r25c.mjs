import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第24轮视觉升级·批C（生物 9 节）：只换 lab.code，params 等原样保留 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));

const CODES = {

'cross-104': `# 血液循环探索台
loops = 1   # 循环圈数

hide()
# 心脏（两颗红球）在中心
circle(-16, 0, 22, "#dc2626")
circle(16, 0, 18, "#b91c1c")
write("❤", -16, 2, "#ffffff", 14)
# 肺循环（蓝色回路：右心→肺→左心）
pen_color("#1d4ed8")
pen_down()
go_to(-30, 20)
go_to(-30, 80)
go_to(30, 80)
go_to(30, 20)
pen_up()
circle(-30, 80, 14, "#93c5fd")
circle(30, 80, 14, "#93c5fd")
write("肺（换氧气）", -24, 106, "#1d4ed8", 11)
# 体循环（红色回路：左心→全身→右心）
pen_color("#dc2626")
pen_down()
go_to(36, -20)
go_to(150, -20)
go_to(150, -80)
go_to(0, -80)
go_to(0, -24)
pen_up()
write("🦵🧠 全身细胞用氧气", 60, -55, "#dc2626", 11)
# 血流方向箭头（圈数越多箭头越多）
i = 0
while i < loops:
    fill_rect(-30 + i * 12, 55, 8, 14, "#1d4ed8")
    fill_rect(80 + i * 12, -80, 8, 14, "#dc2626")
    i = i + 1
write("肺循环（蓝）：右心→肺→左心", -195, 140, "#1d4ed8", 11)
write("体循环（红）：左心→全身→右心", -195, 115, "#dc2626", 11)
write("跑 " + loops + " 圈 = 经过了 " + loops * 2 + " 段循环", -195, 88, "#0f172a", 12)
write("动脉血鲜红携氧出发，静脉血暗红载 CO₂ 回来", -215, -120, "#64748b", 10)`,

'cross-12': `# 种子生长探索台
days = 10   # 生长天数

hide()
h = days * 5
if h > 120:
    h = 120
# 天空太阳 + 土壤（地表线以下棕色）
circle(150, 120, 16, "#fbbf24")
ring(150, 120, 24, "#fde68a")
fill_rect(0, -100, 480, 60, "#a16207")
fill_rect(0, -45, 480, 6, "#4d7c0f")
# 种子（地下）与根
fill_rect(0, -62, 14, 10, "#78350f")
pen_color("#d97706")
pen_down()
go_to(0, -62)
go_to(-14, -84)
pen_up()
go_to(0, -62)
pen_down()
go_to(14, -84)
pen_up()
# 茎（绿色实心条）+ 叶
fill_rect(0, -46 + h / 2, 8, h, "#16a34a")
stage = "破土发芽"
if days > 6:
    circle(-20, -46 + h * 0.6, 12, "#22c55e")
    circle(20, -46 + h * 0.6 + 8, 12, "#22c55e")
    stage = "长出子叶"
if days > 15:
    circle(0, -46 + h, 10, "#f472b6")
    stage = "花苞出现"
if days > 25:
    circle(0, -46 + h, 14, "#ec4899")
    circle(-10, -46 + h + 12, 8, "#f9a8d4")
    circle(10, -46 + h + 12, 8, "#f9a8d4")
    stage = "开花结果"
write("第 " + days + " 天：" + stage, -190, 145, "#16a34a", 13)
write("地下根也在悄悄长：先扎根，后长叶", -190, 118, "#b45309", 10)
if days > 25:
    write("🐝 蜜蜂来了，果实里有新种子！", -190, 92, "#be185d", 11)`,

'cross-120': `# DNA 复制与突变探索台：A-T、C-G 配对
mut = 10   # 突变率（%）

hide()
n = 14
# 两条骨架（灰色竖条）
fill_rect(-110, 0, 8, 270, "#94a3b8")
fill_rect(110, 0, 8, 270, "#94a3b8")
i = 0
wrong = 0
while i < n:
    base = random(0, 3)
    pair = 1 - base
    if base == 2:
        pair = 3
    if base == 3:
        pair = 2
    r = random(0, 99)
    if r < mut:
        pair = random(0, 3)
        wrong = wrong + 1
    y = 128 - i * 19
    # 碱基颜色：A红 T橙 C蓝 G青；左边=母链，右边=新链
    cl = "#ef4444"
    if base == 1:
        cl = "#f97316"
    if base == 2:
        cl = "#3b82f6"
    if base == 3:
        cl = "#22d3ee"
    cr = "#f97316"
    if pair == 0:
        cr = "#ef4444"
    if pair == 2:
        cr = "#22d3ee"
    if pair == 3:
        cr = "#3b82f6"
    fill_rect(-60, y, 90, 12, cl)
    fill_rect(60, y, 90, 12, cr)
    i = i + 1
write("母链（左）→ 配对 → 新链（右）", -85, 152, "#475569", 10)
write("红A配橙T　蓝C配青G", -60, -150, "#475569", 10)
write("突变率 " + mut + "%：14 个碱基错了 " + wrong + " 个", -190, -120, "#dc2626", 13)
if wrong > 0:
    write("错配=突变：大多数无害，少数改变性状", -190, -95, "#ea580c", 11)
if wrong == 0:
    write("这次完美复制，一个都没错！", -190, -95, "#16a34a", 12)`,

'cross-13': `# 食物链能量金字塔探索台
chain = 3   # 食物链级数

hide()
# 能量金字塔（逐级缩小的实心层）
energy = 10000
i = 0
while i < chain:
    w = 90 + i * 0
    w = 250 - i * 70
    x = 0 - i * 35
    y = -90 + i * 52
    col = "#16a34a"
    if i == 1:
        col = "#65a30d"
    if i == 2:
        col = "#f59e0b"
    if i == 3:
        col = "#ea580c"
    if i > 3:
        col = "#dc2626"
    fill_rect(x, y + 22, w, 44, col)
    emoji = "🌿"
    if i == 1:
        emoji = "🐇"
    if i == 2:
        emoji = "🦊"
    if i == 3:
        emoji = "🦅"
    if i > 3:
        emoji = "🐯"
    write(emoji, x, y + 22, "#0f172a", 15)
    write(energy, x + 70, y + 22, "#ffffff", 10)
    energy = energy / 10
    i = i + 1
write("草 → 兔 → 狐 → 鹰 → 虎", -80, 145, "#0f172a", 12)
write("每级只把 10% 能量传给下一级", -90, 120, "#dc2626", 12)
if chain >= 4:
    write("顶级捕食者能量最少 → 数量最少", -110, 95, "#ea580c", 11)
write("数字=该级拥有的能量份数", -90, -135, "#64748b", 10)`,

'cross-30': `# 细胞大游览探索台
idx = 1   # 参观站点

hide()
# 细胞本体：细胞壁（深绿厚框）+ 内部浅绿
fill_rect(0, 0, 320, 180, "#bbf7d0")
fill_rect(0, 0, 304, 164, "#dcfce7")
# 细胞膜（贴壁的蓝线，站点2时高亮）
if idx == 2:
    fill_rect(0, 76, 304, 8, "#1d4ed8")
    fill_rect(0, -76, 304, 8, "#1d4ed8")
    fill_rect(152, 0, 8, 160, "#1d4ed8")
    fill_rect(-152, 0, 8, 160, "#1d4ed8")
# 细胞核（站点3高亮：红球+核仁）
circle(-50, 10, 34, "#fca5a5")
circle(-50, 12, 12, "#dc2626")
# 细胞质里的营养流（站点4高亮：橙色小点）
i = 0
while i < 8:
    circle(-90 + i * 26, -40 + (i / 2) * 20, 5, "#fdba74")
    i = i + 1
# 液泡（站点5高亮：大蓝泡）
circle(80, 10, 40, "#93c5fd")
if idx == 5:
    ring(80, 10, 46, "#1d4ed8")
if idx == 3:
    ring(-50, 10, 40, "#b91c1c")
if idx == 1:
    write("细胞壁（最外圈绿壳）正被选中！", -150, 118, "#15803d", 12)
if idx == 2:
    write("细胞膜：门卫，控制进出", -190, 140, "#1d4ed8", 13)
if idx == 3:
    write("细胞核：总指挥部（DNA 在核里）", -190, 140, "#dc2626", 13)
if idx == 4:
    write("细胞质：流动的工作车间", -190, 140, "#ea580c", 13)
if idx == 5:
    write("液泡：储水储养分（西红柿的酸汁）", -190, 140, "#1d4ed8", 13)
write("按 1-5 逐站参观", -190, -130, "#ea580c", 11)
write("植物细胞才有细胞壁和液泡哦", -190, -150, "#16a34a", 10)`,

'cross-31': `# 光合作用探索台：光 → 氧气产量
sun = 2   # 光照强度（0=阴天 3=烈日）

hide()
# 太阳与叶片
if sun > 0:
    circle(-160, 120, 8 + sun * 5, "#fbbf24")
    i = 0
    while i < 3:
        ring(-160, 120, 26 + i * 12, "#fde68a")
        i = i + 1
circle(150, 110, 40, "#16a34a")
circle(120, 130, 24, "#22c55e")
circle(180, 130, 24, "#22c55e")
write("🍃", 150, 108, "#ffffff", 13)
# 冒出的氧气泡（数量∝光照）
o2 = 0
i = 0
while i < 8:
    o2 = o2 + sun * 8
    col = -190 + i * 48
    h = o2 / 4
    if h > 150:
        h = 150
    fill_rect(col + 20, -110 + h / 2, 40, h, "#22c55e")
    circle(col + 20, -110 + h + 10, 5, "#7dd3fc")
    i = i + 1
fill_rect(0, -118, 400, 6, "#94a3b8")
write("白天 8 小时累计氧气（气泡=产出）", -190, 88, "#0369a1", 11)
write("光照 " + sun + "：累计产氧 " + o2 + " 份", -190, 140, "#16a34a", 13)
if sun < 0.1:
    write("没有光：光合作用停止！", -80, 60, "#dc2626", 13)
if sun > 2.5:
    write("烈日当空：开足马力生产！", -80, 60, "#15803d", 13)
write("二氧化碳 + 水 →（光能+叶绿体）→ 养分 + 氧气", -215, -140, "#64748b", 10)`,

'cross-33': `# 呼吸作用探索台：细胞在吃饭
glu = 3   # 葡萄糖份数

hide()
energy = glu * 30
# 线粒体（橙色椭圆 + 内嵴）
circle(-30, 40, 46, "#fb923c")
i = 0
while i < 3:
    ring(-30, 40, 20 + i * 10, "#c2410c")
    i = i + 1
write("线粒体", -30, 40, "#ffffff", 10)
# 投料：葡萄糖（黄球）+ 氧气（蓝球）
i = 0
while i < glu:
    circle(-140, 80 - i * 22, 9, "#facc15")
    i = i + 1
write("葡萄糖", -140, 110, "#a16207", 10)
i = 0
while i < glu:
    circle(-80, 80 - i * 22, 8, "#93c5fd")
    i = i + 1
write("氧气", -80, 110, "#1d4ed8", 10)
# 产出：能量柱（绿）+ CO₂ 泡 + 水
fill_rect(120, -60 + energy * 0.4 / 2, 50, energy * 0.4, "#16a34a")
write("能量 ATP", 120, -60 + energy * 0.4 + 18, "#15803d", 10)
circle(60, -60, 10, "#a8a29e")
circle(78, -80, 8, "#a8a29e")
write("CO₂", 68, -100, "#57534e", 10)
circle(150, -90, 7, "#7dd3fc")
write("水", 150, -108, "#0369a1", 9)
write(glu + " 份葡萄糖 → " + energy + " 份能量(ATP)", -190, 148, "#dc2626", 13)
write("养分 + 氧 → 能量 + CO₂ + 水（日夜不停）", -190, -135, "#1d4ed8", 11)
write("线粒体：细胞的发电厂", -190, -152, "#ea580c", 10)`,

'cross-85': `# 反射弧探索台
stim = 3   # 刺激强度

hide()
# 手碰到火（刺激源）
write("🔥", -215, 40, "#ea580c", 18)
# 五个接力站（神经元：细胞体圆球 + 突起）
i = 0
while i < 5:
    x = -150 + i * 88
    col = "#3b82f6"
    if i == 2:
        col = "#7c3aed"
    if i == 4:
        col = "#16a34a"
    circle(x, 0, 22, col)
    write(i + 1, x, 2, "#ffffff", 12)
    if i < 4:
        fill_rect(x + 24, 0, 40, 6, "#cbd5e1")
        fill_rect(x + 58, 0, 8, 12, "#94a3b8")
    i = i + 1
# 信号脉冲（红点正在传递，位置∝刺激强度示意）
i = 0
while i < stim:
    circle(-124 + i * 88, 22, 6, "#dc2626")
    i = i + 1
# 效应器动作：肌肉收缩（手臂缩回箭头）
fill_rect(150, -40, 40, 10, "#16a34a")
write("缩手！", 168, -58, "#15803d", 11)
write("1感受器→2传入神经→3神经中枢→4传出神经→5效应器", -215, 90, "#dc2626", 10)
write("刺激强度 " + stim + "：全程约 0.1 秒！", -190, 140, "#1d4ed8", 12)
write("先缩手、后觉疼：反射比意识快", -190, -80, "#ea580c", 11)
write("中枢在脊髓（第3站），不用等大脑", -190, -100, "#6d28d9", 10)`,

'hb-09': `# 化石时间线探索台
era = 1   # 1太古代 2古生代 3中生代 4新生代 5现代

hide()
# 时间带（五段彩色横带，越右越近）
i = 0
while i < 5:
    x = -190 + i * 76
    col = "#a3a3a3"
    if i == 1:
        col = "#84cc16"
    if i == 2:
        col = "#f59e0b"
    if i == 3:
        col = "#fbbf24"
    if i == 4:
        col = "#38bdf8"
    if i == era - 1:
        fill_rect(x + 38, 110, 76, 34, col)
    fill_rect(x + 38, 76, 72, 8, col)
    i = i + 1
# 地层剖面（越深越古老）：当前年代的地层高亮
i = 0
while i < 5:
    y = 10 - i * 34
    col = "#d6d3d1"
    if i == 2:
        col = "#fcd34d"
    if i == 0:
        col = "#fda4af"
    if 5 - i == era:
        col = "#f97316"
    fill_rect(0, y, 400, 30, col)
    i = i + 1
emoji = "🦠"
if era == 1:
    emoji = "🦠"
if era == 2:
    emoji = "🐟"
if era == 3:
    emoji = "🦕"
if era == 4:
    emoji = "🦣"
if era == 5:
    emoji = "🧑"
write(emoji, 0, 10 - (5 - era) * 34, "#0f172a", 16)
info = "最原始的生命（蓝藻）"
if era == 2:
    info = "三叶虫繁盛，鱼类登陆"
if era == 3:
    info = "恐龙统治地球"
if era == 4:
    info = "哺乳动物崛起，冰川期"
if era == 5:
    info = "人类文明"
write(info, -110, 150, "#dc2626", 15)
write("带=年代｜地层越深化石越古老", -195, -145, "#64748b", 10)
write("橙=你选的年代对应的地层", -195, -160, "#ea580c", 10)`,

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
console.log(`视觉升级批C（生物）: ${changed} 节`);
