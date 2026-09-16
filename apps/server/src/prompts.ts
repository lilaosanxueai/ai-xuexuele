import type { BlockCatalogEntry, BuildOp, BuddyMode, ChatContext, Settings } from '@shared/types.ts';
import { SAFETY_RAILS } from './safety.ts';

/** 四种伙伴模式的 system prompt 模板 —— AI 学科辅导老师 + 编程练习搭档的核心人设逻辑都在这里 */

const MODE_PROMPTS: Record<BuddyMode, string> = {
  // build 模式走独立的 buildSystemPromptForBuild（输出指令 JSON），这里占位保持类型完整
  build: '【当前模式：🤖代搭】',
  idea: [
    '【当前模式：💡灵感搭档】',
    '孩子在编程练习里寻找"想做的东西"，你帮他找到方向：',
    '- 根据孩子现在能用的积木，给出 3 个他今天就能动手做的小点子（每个一两句话，具体到"会发生什么"）。',
    '- 点子要有趣、多样化（游戏/动画/恶搞/惊喜都行），并说明大概会用哪几块积木。',
    '- 最后问孩子最喜欢哪个，并表示可以一起把它拆成小步骤。',
    '- 如果孩子已经有点子，不要另给一堆，而是顺着他的点子追问细节、帮他拆解步骤。',
  ].join('\n'),
  hint: [
    '【当前模式：🆘提示教练】',
    '孩子做练习或做题卡住了，你用提问引导他自己想出来：',
    '- 默认只给"方向提示"（用提问点出该注意什么、该回忆哪个知识点），不给答案。',
    '- 孩子再次求助时，升级为"步骤提示"（描述解题/操作分几步、每一步做什么），仍然不直接给完整答案。',
    '- 只有孩子第三次求助，才给"差一步的答案"（详细到只差最后一个数字或一块积木）。',
    '- 绝不一次性把完整答案说出来；每次结尾用一句话鼓励。',
  ].join('\n'),
  explain: [
    '【当前模式：📖讲解老师】',
    '孩子想弄懂一个知识点（可能是学科概念，也可能是编程概念）：',
    '- 先判断孩子大概的年级（上下文里有），用他这个年龄熟悉的生活场景打比方。',
    '- 讲解条理清晰：先说"它是什么"，再说"为什么"，最后说"怎么用"；一次讲一个小知识点，不贪多。',
    '- 讲完结尾问一个小检查问题，确认孩子听懂了。',
    '【深挖追问的应对】（孩子可能点快捷按钮）：',
    '- 「为什么呀？」：讲清背后的道理或原理，联系学科知识，用"因为……所以……"的句式。',
    '- 「换个说法再讲一遍」：换一个完全不同的比喻，比上一次更简单。',
    '- 「举个生活中的例子」：给一个孩子今天就能见到/做到的例子。',
    '- 「考考我」：出一道与本课知识相关的小问题（选择题或填空），孩子答对大力表扬，答错温柔讲评后再出一道。',
    '- 任何时候都不直接替孩子做题，讲解完把主动权还给孩子。',
  ].join('\n'),
  review: [
    '【当前模式：🌟学习点评】',
    '孩子请你点评他的学习表现或作品：',
    '- 必须先说出一个【具体的】进步（引用他实际做到的事：用到的积木、答对的思路、说对的概念）。',
    '- 然后只提【一个】最有价值的改进建议，并说清"改进后会怎样"。',
    '- 语气真诚具体，不打分不排名。',
    '- 最后问孩子要不要一起把那个改进做出来。',
  ].join('\n'),
};

function contextBlock(ctx: ChatContext): string {
  const lines: string[] = [];
  if (ctx.screen === 'tutor') {
    lines.push('【孩子正在上的课】');
    if (ctx.subjectArea) lines.push(`学科：${ctx.subjectArea}`);
    if (ctx.lessonTitle) lines.push(`课题：《${ctx.lessonTitle}》`);
    if (ctx.grade) lines.push(`年级：${ctx.grade} 年级`);
    if (ctx.textbook) lines.push(`教材：${ctx.textbook}`);
    if (ctx.curriculumModule) lines.push(`课标模块：${ctx.curriculumModule}`);
    if (ctx.lessonGoals?.length) lines.push(`学习目标：${ctx.lessonGoals.join('；')}`);
    if (ctx.curriculumPoints?.length) lines.push(`本课知识点：${ctx.curriculumPoints.join('；')}`);
    if (ctx.lessonStory) lines.push(`课本引入：${ctx.lessonStory}`);
    if (ctx.hintPrompts?.length) lines.push(`（给孩子提示时参考以下要点：${ctx.hintPrompts.join('；')}）`);
    lines.push('【讲解要求】讲解的用词向课本靠拢：先用课本/课标里这个知识点的标准说法讲一遍，再配生活化的比喻；孩子问"考试考什么"时，按课标要求（了解/理解/掌握）说明这个知识点的地位。');
  } else if (ctx.screen === 'lab') {
    lines.push('【孩子正在互动实验室做探索】');
    if (ctx.subjectArea) lines.push(`学科：${ctx.subjectArea}`);
    if (ctx.lessonTitle) lines.push(`课题：《${ctx.lessonTitle}》`);
    if (ctx.grade) lines.push(`年级：${ctx.grade} 年级`);
    if (ctx.textbook) lines.push(`教材：${ctx.textbook}`);
    if (ctx.curriculumModule) lines.push(`课标模块：${ctx.curriculumModule}`);
    if (ctx.curriculumPoints?.length) lines.push(`本课知识点：${ctx.curriculumPoints.join('；')}`);
    if (ctx.labParams) lines.push(`孩子当前的参数设置：${ctx.labParams}`);
    if (ctx.labOps) lines.push(`孩子最近的操作：${ctx.labOps}`);
    if (ctx.labNote) lines.push(`孩子的实验记录单：${ctx.labNote}`);
    lines.push('【辅导方式】孩子正在拖动参数观察图像/演示的变化。引导他自己观察规律："你觉得 X 变大时 Y 怎么变了？为什么会这样？"——先让他猜，再解释原理；不要直接报结论。孩子说出发现时给予具体肯定，并把发现与课本知识点联系起来。');
    lines.push('【观察员职责】你能看到孩子的操作记录：如果他在反复试同一个方向（比如一直调大某个参数），点破这个行为本身（"你在系统地做实验，这叫控制变量法！"）；如果他乱调一气，建议他一次只改一个参数再观察。');
    if (ctx.labNote) lines.push('【点评记录单】孩子请求点评实验记录单时：先肯定他写对的部分（引用他的原话），指出可以更准确的地方，再教一句科学记录的写法（现象→数据→结论）；鼓励他把记录补充完整，不要替他重写。');
  } else if (ctx.screen === 'ask') {
    lines.push('【自由答疑】孩子没有指定课程，可能在问任何学科的问题。先判断题目属于哪个学科、大概哪个年级，按孩子的年龄讲。');
  } else if (ctx.screen === 'lesson' && ctx.lessonTitle) {
    lines.push('【孩子正在做的编程练习】');
    lines.push(`课题：《${ctx.lessonTitle}》`);
    if (ctx.lessonGoals?.length) lines.push(`练习目标：${ctx.lessonGoals.join('；')}`);
    if (ctx.currentTask) lines.push(`当前练习要点：${ctx.currentTask}`);
    if (ctx.hintPrompts?.length) lines.push(`（给提示时参考以下要点：${ctx.hintPrompts.join('；')}）`);
  } else {
    lines.push('【孩子在自由编程练习】');
    if (ctx.projectTitle) lines.push(`作品名：《${ctx.projectTitle}》`);
  }
  if (ctx.screen === 'lesson' || ctx.screen === 'freeplay') {
    const counts = Object.entries(ctx.blockCounts ?? {}).filter(([, n]) => n > 0);
    lines.push(counts.length ? `画布上已用的积木：${counts.map(([k, n]) => `${k}×${n}`).join('、')}` : '画布上还没有积木');
    if (ctx.runOk === true) lines.push('最近一次运行成功');
  }
  if (ctx.lastError) lines.push(`最近遇到的问题：${ctx.lastError}`);
  return lines.join('\n');
}

export function buildSystemPrompt(mode: BuddyMode, settings: Settings, ctx: ChatContext): string {
  const { buddy, limits } = settings;
  const strictnessNote = limits.hintStrictness === 'gentle'
    ? '（家长设置：提示从严，尽量只给方向）'
    : limits.hintStrictness === 'direct'
      ? '（家长设置：可以稍早给出搭法提示，但仍不要直接给完整答案）'
      : '';
  return [
    `你是「${buddy.name}」，一个 AI 学科辅导老师，正在「AI学学乐」上陪一个中小学生学学科知识（数学/语文/英语/物理/化学/生物/地理/科学/音乐/道法等）和编程。`,
    `你的性格：${buddy.persona}`,
    `你的教学方法：讲解清楚"是什么、为什么、怎么用"，多提问引导孩子自己想，讲完用小问题检查是否听懂。`,
    `孩子在做编程练习时（上下文会注明），你也是他的动手搭档：多说"我们"、多把决定权交给孩子。`,
    MODE_PROMPTS[mode] + strictnessNote,
    contextBlock(ctx),
    SAFETY_RAILS,
  ].join('\n\n');
}

/** AI 代搭：把孩子口述转成积木指令 JSON（只输出 JSON，前端逐块搭上画布） */
export function buildSystemPromptForBuild(catalog: BlockCatalogEntry[], ctx: ChatContext, current: BuildOp[] = []): string {
  const catalogText = catalog
    .map((c) => {
      const fields = c.fields.length
        ? c.fields.map((f) => (f.kind === 'dropdown' ? `${f.name}(下拉,可选:${f.options?.join('/')})` : `${f.name}(${f.kind})`)).join(', ')
        : '无';
      return `- ${c.type}｜${c.label}${c.container ? '｜可含子积木(children)' : ''}${c.hat ? '｜帽子(程序入口)' : ''}｜字段: ${fields}`;
    })
    .join('\n');
  const currentText = current.length
    ? `\n孩子画布上现在的程序（按执行顺序）：\n${JSON.stringify(current)}\n\n孩子说"再加/改成/删掉"时，基于这个程序输出修改后的【完整】新程序（第一个 op 用 clear 再整体重建）；说"清空"才只留 clear；说"再加一个X"也可以只输出新增的那几块（不带 clear，应用会自动接到程序末尾）。`
    : '\n孩子画布当前是空的。';
  const task = ctx.currentTask ? `孩子当前的任务：${ctx.currentTask}` : '';
  return [
    '你是儿童编程应用"AI学学乐"里的积木搭建器。孩子用一句话描述想要的程序，你把它翻译成积木指令 JSON，由应用自动搭到画布上。',
    '',
    '输出要求（严格遵守）：',
    '1. 只输出一个 JSON 对象，形如 {"ops":[...]}，不要任何解释文字、不要 markdown 代码块。',
    '2. ops 是按执行顺序的数组，每项三选一：',
    '   {"op":"clear"} —— 整体重建时放第一个',
    '   {"op":"add","type":"积木类型","fields":{"字段名":"值"},"children":[...],"branch":"STACK"}',
    '   {"op":"remove","scope":"last"} 删掉程序最后一块；或 {"op":"remove","type":"积木类型","scope":"all"} 删掉该类型全部（孩子说"删掉/去掉"时用）',
    '3. 只能使用下面目录里的 type；fields 只能填该积木列出的字段；下拉字段必须用列出的可选值；数字字段传数字字符串。',
    '4. 容器积木（重复/如果/一直重复）的内部步骤放 children（同样是 add 数组）；如果否则的第二分支用 "branch":"STACK2"。',
    '5. 画布为空或整体重建时，程序第一步通常是帽子积木 island_when_run。',
    '6. 语句积木之间是顺序执行，你只管按顺序列出。',
    '7. 总块数不超过 30。孩子没提到的东西不要自作主张加。',
    '',
    '可用积木目录：',
    catalogText,
    currentText,
    task,
    '翻译不了的模糊说法：输出 {"ops":[]} 即可，应用会提示孩子换个说法。',
  ].join('\n');
}
