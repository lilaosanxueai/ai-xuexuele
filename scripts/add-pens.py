# -*- coding: utf-8 -*-
"""课程升级：给函数/几何/物理课加画笔任务与轨迹绘制"""
import json, os

LESSONS = os.path.join(os.path.dirname(__file__), '..', 'content', 'lessons')
PEN_BLOCKS = ["island_pen_down", "island_pen_up", "island_pen_color"]

def load(fid):
    return json.load(open(os.path.join(LESSONS, fid + '.json'), encoding='utf-8'))

def save(fid, d):
    json.dump(d, open(os.path.join(LESSONS, fid + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

def add_blocks(d):
    for b in PEN_BLOCKS:
        if b not in d['toolbox']:
            d['toolbox'].append(b)

# ---------- Python 函数课：starter 加落笔 ----------
FUNCS = {
    'math-08': ('# 一次函数 y = kx + b 画图机（落笔画出真直线）\nk = 1\nb = 0\n\npen_color("blue")\npen_down()\nfor x in range(-6, 7):\n    go_to(x * 30, (k * x + b) * 30)\n    wait(0.1)\npen_up()\ngo_to(0, -150)\n\nsay("y = " + k + "x + " + b + " 画好了！")\n', '落笔画出直线：蓝色的线就是 y=kx+b 的真身'),
    'math-10': ('# 二次函数 y = x² 画图机（画出真抛物线）\npen_color("blue")\npen_down()\nfor x in range(-5, 6):\n    go_to(x * 30, x * x * 6)\n    wait(0.1)\npen_up()\ngo_to(0, -150)\n\nsay("抛物线 y = x² 画好了！")\n', '落笔画出抛物线：开口向上的一串弯'),
    'math-15': ('# 反比例函数 y = k / x 双曲线（画出真曲线）\nk = 180\n\npen_color("blue")\npen_down()\nfor x in range(2, 12):\n    go_to(x * 20, k / x)\n    wait(0.1)\npen_up()\ngo_to(0, -150)\n\nsay("x 越大 y 越小——反比例！")\n', '落笔画出双曲线：越靠右越贴近横轴'),
    'math-11': ('# 正弦波发生器：y = sin(t) × 120（画出真波形）\npen_color("blue")\npen_down()\nfor i in range(13):\n    t = i * 30\n    go_to(t - 160, sin(t) * 120)\n    wait(0.1)\npen_up()\ngo_to(0, -150)\n\nsay("正弦波画好了！一个周期 360 度")\n', '落笔画出正弦波：山峰山谷交替的波浪'),
}
for fid, (starter, hint) in FUNCS.items():
    d = load(fid)
    d['starterCode'] = starter
    d['tasks'][0]['hintPrompts'].insert(0, hint)
    save(fid, d)
    print(fid, 'starter + pen')

# ---------- 导数课：动态割线动画（本轮重头）----------
d = load('math-34')
d['starterCode'] = '''# 导数：割线如何逼近切线（动态演示）
# 第一步：画抛物线 y=x²（蓝）
pen_color("blue")
pen_down()
for x in range(-5, 6):
    go_to(x * 25, x * x * 6)
pen_up()

# 第二步：从远处拉来多条割线（红），看它们逐渐贴到切线上
for i in range(4):
    b = 3 - i * 0.3          # 第二点从 3 逼近 2
    go_to(2 * 25, 2 * 2 * 6)   # 固定点 (2, 4)
    pen_color("red")
    pen_down()
    go_to(b * 25, b * b * 6)
    pen_up()
    wait(0.5)

# 第三步：算出割线斜率，看它趋于 4
b = 3
k = (b * b - 2 * 2) / (b - 2)
say("从 2 到 3 的斜率 = " + k)
say("割线越来越贴近曲线——切线斜率就是导数！")
'''
d['tasks'][0]['text'] = '运行演示：先画出蓝色抛物线，再看红色割线一条条逼近切线（动态！）'
d['tasks'][0]['hintPrompts'] = ['割线的两端：固定点 (2,4) 和移动点 (b, b²)——b 越接近 2，割线越像切线', '看红色割线的角度变化：越来越「贴」着曲线']
save('math-34', d)
print('math-34 dynamic tangent')

# ---------- 积木课：toolbox 加画笔 + 提示 ----------
BLOCK_LESSONS = {
    'math-06': '先「🖊 落笔」再走正多边形——12 边形、36 边形、72 边形叠加画在一起，看它们一步步逼近圆！',
    'math-13': '先「🖊 落笔」再绕圈——正方形和长方形真的画在纸上，周长一目了然！',
    'math-24': '先「🖊 落笔」再走 Λ——画出来的形状左右对称，一眼验证！',
    'math-29': '先「🖊 落笔」再走三角形——外角转弯处看得清清楚楚！',
    'math-02': '先「🖊 落笔」再跳格子——跳过的距离连成线，乘法就是长度！',
    'math-21': '先「🖊 落笔」再分组跳——每组一段线，除法就是分段！',
    'cross-04': '先「🖊 落笔」再转圈——地球的轨道真的画出来了！',
    'cross-09': '先「🖊 落笔」再走光路——入射光和反射光画成折线，对称看得见！',
}
for fid, hint in BLOCK_LESSONS.items():
    d = load(fid)
    add_blocks(d)
    d['tasks'][0]['hintPrompts'].insert(0, hint)
    save(fid, d)
    print(fid, 'pen toolbox')

print('all lessons upgraded')
