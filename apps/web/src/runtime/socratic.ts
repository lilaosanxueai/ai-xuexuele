import type { LabParam } from '@shared/types.ts';

/**
 * 苏格拉底式本地引导引擎（Khanmigo 模式的离线实现）：
 * 绝不直接给答案，只问引导性问题——"你觉得呢？""如果反过来会怎样？"
 * 覆盖四条链：探索勾选 / 挑战达成 / 练习答错 / 练习全对。
 */

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** 探索问题勾选后：追问验证方法与反向思考 */
export function socraticOnExplore(question: string): string {
  return pick([
    `👀 你勾了「${question.slice(0, 18)}…」——你是动手验证过，还是凭感觉？说说你的证据。`,
    `🤔 有意思！如果把这个问题的条件反过来（比如参数调到另一个极端），结论还成立吗？`,
    `🔍 你是怎么确认这个发现的？试着把你的理由说成一句"因为…所以…"。`,
    `💬 如果让你把这个发现讲给同学听，你会先演示哪一步？`,
  ]);
}

/** 挑战达成后：追问"为什么是这个值"（理解而非碰巧） */
export function socraticOnChallenge(text: string): string {
  return pick([
    `🏅 挑战达成！但想一想：为什么偏偏是这个参数值能成功？换成它旁边的一格会发生什么？`,
    `🎯 你是怎么找到正确位置的——试出来的，还是算出来的？两种都值得说说看！`,
    `⚡ 达成了！现在闭上眼睛：能不看屏幕说出这背后的道理吗？说给自己听一遍。`,
    `🔬 「${text.slice(0, 14)}…」成功了！如果是考试题不许动手，你能写下推理过程吗？`,
  ]);
}

/** 练习完成（有错题）：引导回看讲解而非直接讲解 */
export function socraticOnWrong(correct: number, total: number, lessonTitle: string): string {
  return `📝 答对 ${correct}/${total}。错的那题先别急着看解析——回「📖 课本讲解」找到对应的那一节重读一遍，再回来告诉我：你原来是哪一步想岔了？`;
}

/** 练习全对：理解度检验（能举例才算真懂——费曼技巧） */
export function socraticOnPerfect(): string {
  return pick([
    `🎉 全对！最后一关：能自己编一道类似的题考考爸妈吗？出题比做题更难哦。`,
    `🌟 满分！检验一下：能举一个生活里的例子用上今天学的知识吗？举得出才是真懂。`,
    `👏 全对！如果同桌没听懂这课，你会用哪一句话让他秒懂？`,
  ]);
}
