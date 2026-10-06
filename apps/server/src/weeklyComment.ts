/**
 * 家长端周报评语：离线模板生成器（未配置 LLM 或调用失败时的兜底）。
 * 纯函数：同样的数据与日期 → 同样的评语（按日期轮换措辞，一周内稳定）。
 */

export interface WeeklySummary {
  name?: string;
  totalMinutes: number;
  activeDays: number;
  streak: number;
  lessonsDone: string[];
  subjectStats: { subject: string; accuracy: number | null; correct: number; total: number }[];
  weakLessons: { title: string; subject: string; accuracy: number }[];
  delta?: { minutes: number; activeDays: number; lessons: number };
}

/** 日期种子：同一周内措辞稳定，跨周自然轮换 */
function daySeed(now: Date): number {
  return Math.floor(now.getTime() / 86400000);
}

const pick = <T,>(arr: T[], seed: number): T => arr[Math.abs(seed) % arr.length];

export function offlineWeeklyComment(s: WeeklySummary, now: Date = new Date()): string {
  const seed = daySeed(now);
  const kid = s.name ? `${s.name}同学` : '孩子';

  // 1) 开场：按投入档位肯定
  let open: string;
  if (s.activeDays === 0 || s.totalMinutes === 0) {
    open = pick([
      `这周 ${kid} 还没开始学习，正好从一节 15 分钟的小课起步，慢慢来。`,
      `新的一周从零开始——建议陪 ${kid} 挑一节感兴趣的课程开个头。`,
    ], seed);
  } else if (s.activeDays >= 5 || s.totalMinutes >= 180) {
    open = pick([
      `本周 ${kid} 学习了 ${s.totalMinutes} 分钟、覆盖 ${s.activeDays} 天，投入非常扎实。`,
      `${kid} 这周坚持了 ${s.activeDays} 天、共 ${s.totalMinutes} 分钟，学习习惯正在养成。`,
    ], seed);
  } else if (s.activeDays >= 2) {
    open = pick([
      `本周 ${kid} 学了 ${s.totalMinutes} 分钟（${s.activeDays} 天），节奏平稳。`,
      `这周 ${kid} 有 ${s.activeDays} 天打开学习了，共 ${s.totalMinutes} 分钟，稳中有进。`,
    ], seed);
  } else {
    open = pick([
      `本周 ${kid} 学习了 ${s.totalMinutes} 分钟，开了个头。`,
      `这周 ${kid} 学了 1 天共 ${s.totalMinutes} 分钟，起步了。`,
    ], seed);
  }

  // 2) 亮点句：进步趋势 / 连击 / 优势学科（最多挑一句最有分量的）
  const parts: string[] = [];
  if (s.delta && s.delta.minutes >= 30) parts.push(`比上周多学了 ${s.delta.minutes} 分钟，劲头很足`);
  else if (s.streak >= 3) parts.push(`已连续学习 ${s.streak} 天，坚持是最好的天赋`);
  const best = [...s.subjectStats].filter((x) => x.accuracy !== null && x.total >= 3).sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0))[0];
  if (best && (best.accuracy ?? 0) >= 85) parts.push(`${best.subject}正确率 ${best.accuracy}%，状态出色`);
  const highlight = parts.length > 0 ? pick(parts, seed >> 1) + '。' : '';

  // 3) 建议 + 下周小目标：围绕最薄弱课（做过题的才提）
  let advice: string;
  if (s.weakLessons.length > 0) {
    const w = s.weakLessons[0];
    advice = pick([
      `下周建议用「错题重练」优先补一补${w.subject}的《${w.title}》（当前正确率 ${w.accuracy}%），目标把它拉回 70% 以上。`,
      `可以把${w.subject}《${w.title}》定为下周重点（现在 ${w.accuracy}%），先看讲解再做随堂小练，一次就能上一个台阶。`,
    ], seed >> 2);
  } else if (s.activeDays > 0) {
    advice = pick([
      `各科正确率都在 70% 以上，下周可以挑战一节「挑战级 ⭐⭐⭐⭐」课程，往上够一够。`,
      `掌握得很稳，下周试试每天多 10 分钟，或者用「变式训练」做一组举一反三。`,
    ], seed >> 2);
  } else {
    advice = `下周的小目标：完成 2 节课并做完随堂小练——小目标容易达成，也容易变成习惯。`;
  }

  return (open + highlight + advice).replace(/\s+/g, ' ');
}
