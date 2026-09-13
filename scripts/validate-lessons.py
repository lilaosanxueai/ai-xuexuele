# -*- coding: utf-8 -*-
"""全量课程校验：v3 schema + 代码课 starterCode 解释器兼容性（本地扩展课程的质检工具）。用法: python scripts/validate-lessons.py"""
import json, re, sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
LESSONS = Path(__file__).resolve().parent.parent / "content" / "lessons"

VALID_BLOCKS = {
    "island_when_run", "island_when_key", "island_when_clicked", "island_when_recognized",
    "island_move", "island_turn_right", "island_turn_left", "island_goto", "island_bounce",
    "island_say", "island_say_for", "island_costume", "island_change_size", "island_show", "island_hide",
    "island_play", "island_repeat", "island_forever", "island_wait", "island_if", "island_if_else",
    "island_touching_edge", "island_key_down", "island_recognize",
    "island_number", "island_eq", "island_random",
    "island_pen_down", "island_pen_up", "island_pen_color",
}
VALID_ISLANDS = {"basics", "extra", "cross", "math"}
VALID_CHECKS = {"block_used", "block_used_any", "block_count_min", "block_count_total_min", "say_text", "actor_reach", "manual"}
VALID_AREAS = {"信息科技", "数学", "语文", "英语", "科学", "物理", "化学", "生物", "地理", "音乐", "艺术", "道德与法治", "劳动", "体育与健康"}
VALID_BANDS = {"primary", "junior", "senior"}
REQUIRED = ["id", "island", "order", "title", "emoji", "story", "goals", "toolbox", "actor", "tasks", "aiIntro", "celebrate"]
PY_COMMANDS = {"move","turn_right","turn_left","go_to","bounce","say","say_for","costume","change_size","show","hide","play","wait","pen_down","pen_up","pen_color"}
PY_FUNCS = {"touching_edge","key_down","recognize","random","range","sin","cos","sqrt","abs","eq","print"}
PY_BLACKLIST = [(r"\bdef\s", "不支持 def 函数定义"), (r"\belif\b", "不支持 elif（用嵌套 if）"), (r"\.append", "不支持列表方法"), (r"\[", "不支持列表"), (r"\*\*", "不支持幂运算（用连乘）"), (r"\blen\s*\(", "不支持 len"), (r"\bround\s*\(", "不支持 round"), (r"\bpow\s*\(", "不支持 pow"), (r"\bimport\b", "不支持 import"), (r"\"", "双引号检查")]  # 最后一条单独处理

files = sorted(LESSONS.glob("*.json"))
print(f"== 全量校验 {len(files)} 课 ==")
errors, warns = [], []
seen = {}
for f in files:
    n = f.name
    try:
        d = json.loads(f.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"{n}: JSON 解析失败 {e}"); continue
    for k in REQUIRED:
        if k not in d: errors.append(f"{n}: 缺必填 {k}")
    if d.get("id") in seen: errors.append(f"{n}: id 重复 with {seen[d['id']]}")
    seen[d.get("id")] = n
    if d.get("island") not in VALID_ISLANDS: errors.append(f"{n}: island 非法 {d.get('island')!r}")
    if not isinstance(d.get("order"), (int, float)): errors.append(f"{n}: order 非数字")
    if d.get("subjectArea") is not None and d["subjectArea"] not in VALID_AREAS:
        errors.append(f"{n}: subjectArea 非法 {d['subjectArea']!r}")
    if d.get("gradeBand") is not None and d["gradeBand"] not in VALID_BANDS:
        errors.append(f"{n}: gradeBand 非法 {d['gradeBand']!r}")
    for i, ex in enumerate(d.get("exercises") or []):
        if not ex.get("q") or not isinstance(ex.get("options"), list) or len(ex["options"]) < 2:
            errors.append(f"{n}/ex{i}: 题目或选项非法")
        elif not isinstance(ex.get("answer"), int) or not (0 <= ex["answer"] < len(ex["options"])):
            errors.append(f"{n}/ex{i}: answer 下标越界")
    tb = d.get("toolbox", [])
    bad = [b for b in tb if b not in VALID_BLOCKS]
    if bad: errors.append(f"{n}: toolbox 未知积木 {bad}")
    if d.get("codeLesson") and not d.get("starterCode"): errors.append(f"{n}: codeLesson 缺 starterCode")
    targets = d.get("targets") or []
    tasks = d.get("tasks") or []
    if not any(not t.get("optional") for t in tasks) and not d.get("freeplayLesson"):
        errors.append(f"{n}: 没有必做任务")
    for t in tasks:
        tid = t.get("id", "?")
        if not t.get("hintPrompts"): warns.append(f"{n}/{tid}: hintPrompts 为空")
        c = t.get("check") or {}
        ct = c.get("type")
        if ct not in VALID_CHECKS: errors.append(f"{n}/{tid}: check.type 非法 {ct!r}"); continue
        if ct in ("block_used", "block_count_min") and c.get("block") not in VALID_BLOCKS:
            errors.append(f"{n}/{tid}: block 非法 {c.get('block')!r}")
        if ct in ("block_count_min", "block_count_total_min") and (not isinstance(c.get("count"), int) or c["count"] < 1):
            errors.append(f"{n}/{tid}: count 非法")
        if ct == "actor_reach":
            ti = c.get("targetIndex", -1)
            if not isinstance(ti, int) or not (0 <= ti < len(targets)):
                errors.append(f"{n}/{tid}: actor_reach targetIndex={ti} 越界(targets={len(targets)})")
        need = [c["block"]] if ct in ("block_used", "block_count_min") else (c.get("blocks", []) if ct == "block_used_any" else [])
        missing = [b for b in need if b not in tb]
        if missing and not d.get("codeLesson"):
            errors.append(f"{n}/{tid}: 校验要求积木 {missing} 不在 toolbox")

    # ---- 代码课 starterCode 静态检查 ----
    if d.get("codeLesson"):
        code = d.get("starterCode", "")
        # 剥掉注释与字符串字面量，只检查真实代码
        code_only = "\n".join(re.sub(r'"[^"]*"', '""', ln.split("#")[0]) for ln in code.splitlines())
        for pat, msg in PY_BLACKLIST[:-1]:
            if re.search(pat, code_only):
                errors.append(f"{n}: starterCode {msg}（命中 {pat!r}）")
        for m in re.finditer(r"range\s*\(([^()]*)\)", code_only):
            nargs = len([p for p in m.group(1).split(",") if p.strip()])
            if nargs > 2:
                errors.append(f"{n}: starterCode range 最多 2 参（发现 {nargs} 参: range({m.group(1)})）")
        for m in re.finditer(r"([A-Za-z_]\w*)\s*\(", code_only):
            fname = m.group(1)
            if fname in ("if", "while", "for", "range", "on_key", "on_click", "on_recognize"): continue
            if fname not in PY_COMMANDS and fname not in PY_FUNCS:
                errors.append(f"{n}: starterCode 调用了未知函数 {fname}")
        for ln_no, ln in enumerate(code_only.splitlines(), 1):
            if re.search(r"(?<![A-Za-z_])'", ln):
                errors.append(f"{n}: starterCode 第{ln_no}行 含单引号（解释器只认双引号）")

print(f"错误 {len(errors)} 条 / 警告 {len(warns)} 条")
for e in errors: print("  [ERROR] " + e)
for w in warns[:10]: print("  [WARN]  " + w)

print()
from collections import Counter
c = Counter(); band = {}
for f in files:
    d = json.loads(f.read_text(encoding="utf-8"))
    a = d.get("subjectArea") or "信息科技(默认)"
    c[a] += 1
    band.setdefault(a, Counter())[d.get("gradeBand", "primary")] += 1
print("== 学科 × 学段 ==")
for k, v in c.most_common():
    b = band[k]
    print(f"  {k}: {v} 课 (小学 {b['primary']} / 初中 {b['junior']} / 高中 {b['senior']})")
print(f"  合计 {sum(c.values())} 课 / {len(c)} 学科 / 高中合计 {sum(b['senior'] for b in band.values())} 课")
