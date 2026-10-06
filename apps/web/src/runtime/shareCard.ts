import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { computeBadges, readRecords, streakFrom } from './achievements.ts';
import type { WeeklyReport, WeekDelta } from './weeklyReport.ts';

/** 分享卡片统计（纯数据，可测试；绘制与数据分离） */
export interface ShareStats {
  name: string;
  avatar: string;
  /** 按完成课数授予的称号 */
  title: string;
  streak: number;
  totalMinutes: number;
  lessonsDone: number;
  totalLessons: number;
  badgesUnlocked: number;
  badgesTotal: number;
  wrongCleared: number;
  wrongPending: number;
  /** 正确率最高的学科（练习 ≥5 题才参评） */
  bestSubject: string;
  bestAccuracy: number;
  generatedAt: string;
}

const TITLES: [number, string][] = [
  [100, '🏆 学霸岛主'],
  [50, '🌊 知识海洋冲浪手'],
  [20, '🚀 学习小达人'],
  [5, '🎒 知识收集者'],
  [0, '🐣 新手探险家'],
];

function titleFor(done: number): string {
  for (const [min, t] of TITLES) if (done >= min) return t;
  return TITLES[TITLES.length - 1][1];
}

/** 从本地数据构建分享统计（records 传 localStorage 解析结果，缺省空战绩） */
export function buildShareStats(
  lessons: Lesson[],
  progress: ProfileProgress | null,
  profile: { name: string; avatar: string },
  records?: unknown,
): ShareStats {
  const done = progress ? Object.values(progress.lessons).filter((l) => l.status === 'completed').length : 0;
  const minutes = progress ? Object.values(progress.dailyUsage).reduce((a, b) => a + b, 0) : 0;
  const badges = computeBadges(lessons, progress, readRecords(records ?? {}));
  const unlocked = badges.filter((b) => b.unlocked).length;

  // 最强学科：聚合各课练习正确数/总题数（≥5 题才参评，防止 1/1=100% 虚高）
  const acc = new Map<string, { c: number; t: number }>();
  for (const [lessonId, ex] of Object.entries(progress?.exercises ?? {})) {
    if (!ex || ex.total <= 0) continue;
    const area = lessons.find((l) => l.id === lessonId)?.subjectArea;
    if (!area) continue;
    const cur = acc.get(area) ?? { c: 0, t: 0 };
    acc.set(area, { c: cur.c + ex.correct, t: cur.t + ex.total });
  }
  let bestSubject = '—';
  let bestAccuracy = 0;
  for (const [area, { c, t }] of acc) {
    if (t < 5) continue;
    const pct = Math.round((c / t) * 100);
    if (pct > bestAccuracy) { bestSubject = area; bestAccuracy = pct; }
  }

  return {
    name: profile.name,
    avatar: profile.avatar,
    title: titleFor(done),
    streak: streakFrom(progress?.dailyUsage ?? {}),
    totalMinutes: minutes,
    lessonsDone: done,
    totalLessons: lessons.length,
    badgesUnlocked: unlocked,
    badgesTotal: badges.length,
    wrongCleared: progress?.wrongCleared ?? 0,
    wrongPending: progress?.wrongBook?.length ?? 0,
    bestSubject,
    bestAccuracy,
    generatedAt: new Date().toISOString(),
  };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * 把统计画成 750×1000 的分享卡（朋友圈/家庭群晒成长用）。
 * 只用 canvas 2D 基础 API + 系统字体，emoji 由平台渲染。
 */
export function drawShareCard(canvas: HTMLCanvasElement, s: ShareStats): void {
  const W = 750, H = 1000;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 背景：海岛渐变天空
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#7dd3fc');
  sky.addColorStop(0.55, '#e0f2fe');
  sky.addColorStop(1, '#fef9c3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // 太阳
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(640, 110, 52, 0, Math.PI * 2);
  ctx.fill();

  // 海面
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(0, 700, W, H - 700);
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(0, 700, W, 14);

  // 小岛
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.ellipse(375, 720, 210, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '64px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏝', 375, 700);

  // 头像 + 名字 + 称号
  ctx.font = '76px sans-serif';
  ctx.fillText(s.avatar, 375, 170);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(s.name, 375, 248);
  ctx.fillStyle = '#7c3aed';
  roundRect(ctx, 255, 272, 240, 54, 27);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(s.title, 375, 309);

  // 六宫格数据卡
  const cells: [string, string][] = [
    ['🔥 连续学习', `${s.streak} 天`],
    ['⏱ 累计时长', `${Math.round(s.totalMinutes / 60)} 小时`],
    ['📚 完成课程', `${s.lessonsDone} / ${s.totalLessons}`],
    ['🏅 解锁徽章', `${s.badgesUnlocked} / ${s.badgesTotal}`],
    ['🎯 错题消灭', `${s.wrongCleared} 道`],
    ['💪 最强学科', s.bestSubject === '—' ? '待解锁' : `${s.bestSubject} ${s.bestAccuracy}%`],
  ];
  const cw = 316, ch = 120, gx = (W - cw * 2 - 24) / 2, gy = 380;
  cells.forEach(([label, value], i) => {
    const x = gx + (i % 2) * (cw + 24);
    const y = gy + Math.floor(i / 2) * (ch + 20);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    roundRect(ctx, x, y, cw, ch, 24);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(label, x + cw / 2, y + 42);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText(value, x + cw / 2, y + 92);
  });

  // 底部标语
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('每天进步一点点，知识海岛在长大！', 375, 850);
  ctx.fillStyle = '#475569';
  ctx.font = '24px sans-serif';
  ctx.fillText('🏝 AI学学乐 · 本地学习档案', 375, 930);
}

/** 触发 PNG 下载（a[download] 兼容各端） */
export function downloadShareCard(canvas: HTMLCanvasElement, name: string): void {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `AI学学乐-成长卡片-${name}.png`;
  a.click();
}

// ---------------- 周报分享卡 ----------------

export interface WeeklyCardStats {
  name: string;
  avatar: string;
  /** 如 09.30 - 10.06 */
  dateRange: string;
  totalMinutes: number;
  activeDays: number;
  streak: number;
  lessons: number;
  delta: { minutes: number; activeDays: number; lessons: number };
  /** 正确率条（最多4条） */
  subjects: { subject: string; accuracy: number }[];
  comment: string;
  commentSource: 'llm' | 'template' | 'headline';
}

/** 评语换行（纯函数）：按固定字数折行，超长截断加省略号 */
export function wrapComment(text: string, perLine = 26, maxLines = 6): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const lines: string[] = [];
  for (let i = 0; i < clean.length && lines.length < maxLines; i += perLine) {
    lines.push(clean.slice(i, i + perLine));
  }
  if (clean.length > maxLines * perLine && lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, perLine - 1) + '…';
  }
  return lines;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const mmdd = (d: Date) => `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;

/** 组装周报卡数据（纯函数，可测试） */
export function buildWeeklyCardStats(
  profile: { name: string; avatar: string },
  report: WeeklyReport,
  delta: WeekDelta,
  comment: string | null,
  now: Date = new Date(),
): WeeklyCardStats {
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  const subjects = report.subjectStats
    .filter((s) => s.accuracy !== null && s.total >= 3)
    .slice(0, 4)
    .map((s) => ({ subject: s.subject, accuracy: s.accuracy as number }));
  const source: WeeklyCardStats['commentSource'] = comment ? 'llm' : 'headline';
  return {
    name: profile.name,
    avatar: profile.avatar,
    dateRange: `${mmdd(start)} - ${mmdd(now)}`,
    totalMinutes: report.totalMinutes,
    activeDays: report.activeDays,
    streak: report.streak,
    lessons: report.lessonsDone.length,
    delta,
    subjects,
    comment: (comment ?? report.headline).slice(0, 400),
    commentSource: source,
  };
}

/** 画 750×(1000~1250 自适应) 周报分享卡（家庭群晒本周成长） */
export function drawWeeklyCard(canvas: HTMLCanvasElement, s: WeeklyCardStats): void {
  const W = 750;
  // 先按内容算高度：头部210 + 四格288 + 学科区 + 评语区 + 页脚
  const lines = wrapComment(s.comment);
  const commentBoxH = lines.length > 0 ? 64 + lines.length * 40 : 0;
  const barsH = s.subjects.length > 0 ? 50 + s.subjects.length * 46 + 26 : 0;
  const H = Math.max(1000, Math.min(1250, 246 + 288 + 22 + barsH + commentBoxH + 130));
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#c7d2fe');
  sky.addColorStop(0.5, '#e0f2fe');
  sky.addColorStop(1, '#f0fdfa');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  // 头部：头像 + 名字 + 标题 + 日期
  ctx.font = '64px sans-serif';
  ctx.fillText(s.avatar, 375, 110);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText(`${s.name} 的本周学习周报`, 375, 172);
  ctx.fillStyle = '#64748b';
  ctx.font = '26px sans-serif';
  ctx.fillText(s.dateRange, 375, 212);

  // 四格数据（带较上周增减）
  const cells: [string, string, string][] = [
    ['⏱ 学习时长', `${s.totalMinutes} 分钟`, s.delta.minutes === 0 ? '' : `较上周 ${s.delta.minutes > 0 ? '↑' : '↓'}${Math.abs(s.delta.minutes)}`],
    ['📅 学习天数', `${s.activeDays} 天`, s.delta.activeDays === 0 ? '' : `较上周 ${s.delta.activeDays > 0 ? '↑' : '↓'}${Math.abs(s.delta.activeDays)}`],
    ['🔥 连续打卡', `${s.streak} 天`, ''],
    ['📘 完成新课', `${s.lessons} 节`, s.delta.lessons === 0 ? '' : `较上周 ${s.delta.lessons > 0 ? '↑' : '↓'}${Math.abs(s.delta.lessons)}`],
  ];
  const cw = 340, ch = 128, gx = (W - cw * 2 - 20) / 2, gy = 246;
  cells.forEach(([label, value, d], i) => {
    const x = gx + (i % 2) * (cw + 20);
    const y = gy + Math.floor(i / 2) * (ch + 16);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    roundRect(ctx, x, y, cw, ch, 22);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 23px sans-serif';
    ctx.fillText(label, x + cw / 2, y + 38);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(value, x + cw / 2, y + 82);
    if (d) {
      ctx.fillStyle = d.includes('↑') ? '#059669' : '#e11d48';
      ctx.font = 'bold 21px sans-serif';
      ctx.fillText(d, x + cw / 2, y + 112);
    }
  });

  // 学科正确率条
  let y = gy + 2 * (ch + 16) + 22;
  if (s.subjects.length > 0) {
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📊 各学科正确率', gx, y);
    y += 22;
    for (const sub of s.subjects) {
      y += 46;
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText(sub.subject, gx, y + 20);
      ctx.fillStyle = '#e2e8f0';
      roundRect(ctx, gx + 120, y, cw * 2 - 120, 26, 13);
      ctx.fill();
      const color = sub.accuracy >= 80 ? '#10b981' : sub.accuracy >= 60 ? '#f59e0b' : '#f43f5e';
      ctx.fillStyle = color;
      roundRect(ctx, gx + 120, y, Math.max(26, (cw * 2 - 120) * sub.accuracy / 100), 26, 13);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${sub.accuracy}%`, gx + cw * 2, y + 21);
      ctx.textAlign = 'left';
    }
    y += 26;
  }

  // 老师评语卡（高度按行数自适应，画布高度已预留，不再上提遮挡学科条）
  if (lines.length > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    roundRect(ctx, gx, y, cw * 2 + 20, commentBoxH, 22);
    ctx.fill();
    const ty = y + 42;
    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 27px sans-serif';
    ctx.fillText(s.commentSource === 'headline' ? '💡 本周小结' : '✨ 老师评语', gx + 28, ty);
    ctx.fillStyle = '#1e293b';
    ctx.font = '26px sans-serif';
    lines.forEach((ln, i) => ctx.fillText(ln, gx + 28, ty + 44 + i * 40));
  }

  // 底部
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';
  ctx.font = '24px sans-serif';
  ctx.fillText('🏝 AI学学乐 · 本地学习档案', 375, H - 52);
}

export function downloadWeeklyCard(canvas: HTMLCanvasElement, name: string): void {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `AI学学乐-周报-${name}-${new Date().toISOString().slice(0, 10)}.png`;
  a.click();
}
