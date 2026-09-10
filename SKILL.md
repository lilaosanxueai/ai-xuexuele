---
name: creative-island
description: AI学学乐（原 AI 创意岛）— 面向中小学生的 AI 编程学习应用（积木编程+Python+AI 伙伴+AI 训练场，学科×学段架构，本地自用，数据全部在本机）。当用户提到 creative-island、创意岛、ai-xuexuele、学学乐、孩子的编程学习、积木编程、启动创意岛时触发。
version: "3.0.0"
icon: "🏝"
metadata:
  source: "https://github.com/lilaosanxueai/ai-xuexuele"
  installed_by: "github-installer"
  installed_at: "2026-09-06T17:43:00.705159"
  updated_at: "2026-09-07"
---

# 🏝 AI学学乐（原「AI 创意岛」，上游已更名）

> 上游仓库已从 creative-island 更名为 [lilaosanxueai/ai-xuexuele](https://github.com/lilaosanxueai/ai-xuexuele)，本地 remote 已同步。应用更名为「AI学学乐」，端口仍是 8787。

## 简介

面向中小学生的学科编程学习应用（本地自用）：v3 采用**学科 × 学段**主轴（学科中心 + 学科页按小学/初中/高中衔接分组），116 门课程覆盖 14 个学科，积木编程 + 真 Python 代码模式 + 画笔系统（可视化动态演示）+ AI 创意伙伴 + AI 训练场 + 随堂小练 + 智能推荐。所有数据仅存本机。

## 启动

```bat
cd /d C:\Users\10166\.agents\skills\creative-island
start.bat
```

- 浏览器访问 **http://127.0.0.1:8787**；开发模式 `start-dev.bat`；测试 `npm test`（vitest，53 用例）
- AI 伙伴：编辑 `data/config.json` 填 OpenAI 兼容 apiKey（默认智谱 GLM 模板；DeepSeek 换 baseURL `https://api.deepseek.com` + `deepseek-chat`），不填则离线替身模式
- 家长中心 PIN 默认 `1234`（务必修改）；平板同 WiFi：`server.host` 改 `"0.0.0.0"`
- **孩子数据全在 `data/`（gitignore，永不入库）——勿删**

## 本地相对上游的增量（2026-09-07，未提交）

1. **全面均衡扩展（第五~十轮，45 课，154→199 课，高中 38→47）**：
   - 第五轮·填平洼地 11 课（cross-86~96）：劳动×2（整理书包/家务计时）、体育热身操、道法网络文明、艺术对称画笔、初中语文×2（守株待兔文言剧场/月亮意象发布会）、初中英语 My Day、初中音乐拍号、初中地理等高线（代码课）、小学生物动物分类——各学科空学段全部填平
   - 第六轮·主干加深 7 课：物理浮力/功与功率、化学原子分子/方程式配平（cross-108）、生物光合作用（积木版）、数学向量加法/对数震级
   - 第七轮·结构与系统 6 课：信息科技 ai-10 分支结构/ai-11 流程图（补齐初中「程序结构」主线）、生物血液循环/消化系统（积木版，与上游 Python 版分层共存）、物理回声测距、数学掷硬币二项分布
   - 第八轮·专题与情景 6 课（cross-109~114）：物理透镜成像/比热容/压强、数学相似三角形影子测高、英语购物情景剧、语文三幕结构
   - 第九轮·科学启蒙与高中深化 6 课（cross-115~120）：小学生物科学水循环/磁铁、高中排列组合密码锁/万有引力轨道/数据可视化柱状图/DNA 配对与突变
   - 第十轮·主要学科升级 9 课（cross-121~129）：数学全等三角形（SSS 演示）/数学归纳法（多米诺）、英语小学数字歌/My Family、语文炼字推敲、生物激素调节（神经 vs 激素快慢对比）、科学声音产生/光的直线传播、化学金属活动性排行榜（代码课）
   - **查重修正**：删除与上游 cross-28 重复的溶解度课，替换为 cross-108 化学方程式配平；光合作用/消化系统保留积木版（与上游 Python 版构成低/高门槛分层）
   - **工具沉淀**：全量校验脚本归档至 `scripts/validate-lessons.py`（schema + 解释器语法双检）；`scripts/test-startercode.ts`（`npx tsx scripts/test-startercode.ts`）用项目自身解释器对全部代码课 starterCode 做真实解析测试——新课后两个都要跑
   - **实用驱动质检（2026-09-07）**：`npx tsx scripts/test-startercode.ts`（项目自身解释器真实解析）发现并修复 3 个「一运行必挂」的 bug——cross-27/math-40 用了不支持的**单行 if 和分号**（重写为多行兼容版，math-40 顺带修了 h=h 逻辑错乱）；cross-75 字符串内的 `#` 被注释剥离误伤（**字符串里永远不要用 # 号**）；修复后 91/91 代码课解析全过
   - **随堂题全覆盖（2026-09-07）**：为上游 63 课缺题课程分三批补齐 189 道随堂题（basics/extra 结业路线 9 课 + cross-01~19 上游旧课 19 课 + math 系列 35 课），**190 课随堂题 100% 覆盖（共 570 道题）**
   - **儿童易用性改进（2026-09-07，WorkshopScreen.tsx）**：撤销/重做按钮加中文文字；空画布时显示「第一步」新手引导条（blockTotal≤1 时出现、拖入积木自动消失，pointer-events-none 不挡操作）；onReady 时同步初始积木数。遗留优化方向（未做）：引导条加指向积木区的箭头动效、顶栏按钮收纳分组
   - **离线替身升级 + 上游崩溃 bug 修复（2026-09-07）**：llm.ts 的 mock 模式从 2 条固定回复升级为「求助/物理/化学/数学/语文/英语/音乐/AI/画笔」9 类关键词本地词典（**只匹配用户消息**——system 提示词含「提示」等词会污染匹配）；修复上游 prompts.ts:51 `Object.entries(ctx.blockCounts)` 对缺失 context 字段直接 500 崩溃（加 `?? {}` 兜底）。已实测三类场景回复正确
2. **理科 × AI 融合扩展（第四轮，9 课）**：
   - 数学·AI 3 课（`cross-77~79`，全代码课）：线性回归（拟合预测）、分类边界（调参分点）、神经元（加权求和实现与门/或门）——机器学习的数学内核
   - 物理·AI 2 课：`cross-80` 数据学重力（数据归纳 vs 公式推导，代码课）、`cross-81` AI 认电路元件（AI 积木课）
   - 化学·AI 2 课：`cross-82` AI 化学实验员认试剂（AI 积木课）、`cross-83` 周期律=最早的聚类（代码课）
   - 生物·AI 2 课：`cross-84` AI 叶脉侦探（AI 积木课）、`cross-85` 反射弧与神经元（代码课）
   - 全站 AI 积木融合课 11 → 14 节；理科（数理化生）AI 融合从 0 → 9 课
2. **高中补全扩展（第三轮，14 课，全部 Python 代码课，高中 19→38 课）**：
   - `cross-66~70` 物理·高中 5 课（匀变速 v-t 图/平抛轨迹/简谐运动/机械能守恒记账/斯涅尔定律与全反射）——物理高中从 0 补齐
   - `ai-07~09` 信息科技·高中 3 课（二分查找/冒泡排序/算法效率步数）——对标高中信息技术「算法与程序实现」，信息科技高中从 0 补齐
   - `cross-71~76` 化学（化学平衡收敛模拟）/生物（孟德尔 3:1 随机模拟）/地理（时区环球时钟）/数学（蒙提霍尔蒙特卡洛）/音乐（十二平均律等比数列）/艺术（黄金分割构图）各 1 课
   - **修复上游 bug**：cross-21 牛顿第一定律 starterCode 用了列表（解释器不支持，运行即报错）→ 改平铺变量；错别字「毛毬/摩擥」→「毛毯/摩擦」
2. **AI 融合扩展（第二轮，15 课）**：
   - **AI 通识线 ai-01~06**（信息科技学科）：AI 是怎么学习的/教 AI 认手势/AI 的饭量（数据实验）/AI 会犯错吗/AI 与我的隐私/智慧社会身边的 AI——对标信息科技课标「人工智能与智慧社会」模块（上游空缺），小学 3 + 初中 3
   - **AI×学科线 cross-57~61**：道法·AI 垃圾分类、英语·AI 单词闪卡、科学·AI 自然观察家、音乐·AI 乐器点名、体育·AI 运动计数员——全部实操 AI 训练场 + `island_when_recognized` 积木
   - **薄弱学科线 cross-62~65**：英语·彩虹颜色歌、地理·天气符号播报员、音乐·do re mi 音阶梯、道法·排队小明星
3. **4 个新学科 + 5 节课**（第一轮，上游 14 学科中艺术/道德与法治/劳动/体育与健康由本地补齐）：
   - `cross-52~56.json`（艺术×2、道法、劳动、体育），均含 `subjectArea`/`gradeBand`/`exercises`
4. `apps/web/src/components/subjectMeta.ts`：SUBJECTS/SUBJECT_STYLE 注册上述 4 学科
5. `apps/web/src/blocks/definitions.ts`：BLOCK_LABELS 补 `island_eq` + 3 块画笔积木（上游遗漏）
6. git stash 存有合并前的旧版学段规范化改动（上游已改用 gradeBand 主轴，未重新应用，仅留档）

课程总量：上游 116 + 本地 83 = **199 课 / 14 学科 / 高中 47 课**（各学科原空学段已全部填平）；AI 积木融合课 1 → 14 节，AI 相关课合计 25 节。

**代码课解释器能力边界**（写 starterCode 必守，否则孩子一运行就报错）：支持变量/if-else/for（range 仅 1-2 参，步长恒 1）/while/嵌套块/字符串拼接 `+`/`random(a,b)`/`sin`/`cos`（角度制）/`sqrt`/`abs`/画笔与舞台命令；**不支持** def/elif/列表/索引/幂运算/pow/len/round/import/f-string/单引号字符串。校验脚本 `%TEMP%\gh-installer\creative-island\validate_senior.py` 会全量检查这些（含剥注释与字符串后扫描）。

## 更新上游

```bat
cd /d C:\Users\10166\.agents\skills\creative-island
git stash push -u -m "local mods" && git fetch origin main && git merge --ff-only origin/main && git stash pop
```

注意：本地 cross-52~56 与上游后续新课程可能在 id/order 上撞车，合并后需检查 `content/lessons/` 的 id 唯一性（可跑全量校验脚本）。

## 课程 schema 要点（v3）

- 必填 12 字段（id/island/order/title/emoji/story/goals/toolbox/actor/tasks/aiIntro/celebrate）；新字段 `subjectArea`（14 学科枚举）、`gradeBand`（primary/junior/senior）、`exercises[]`（{q,options,answer,explain}）
- 30 块积木 id 以 `island_` 前缀（含画笔 island_pen_down/up/color）；check 恰好 7 种类型
- **无运行时 schema 校验**：island/积木 id/check.type 写错会静默失效，改课程后务必校验
- 上游带 scripts/gen-*.py 课程生成脚本，可参考其风格

## 安装来源

- **GitHub**: [lilaosanxueai/ai-xuexuele](https://github.com/lilaosanxueai/ai-xuexuele)（原名 creative-island）
- **语言**: TypeScript（Vite · React · Blockly · Express 5 · tsx）
- **本地路径**: `C:\Users\10166\.agents\skills\creative-island`
- **更新验证**: 2026-09-07 合并至 d9403fe；npm test 53/53；全量校验 116 课 0 错误；浏览器验证学科中心 14 卡片正常

---

🏝 *github-installer 安装，2026-09-07 跟随上游 v3 更新并保留本地学科扩展*
