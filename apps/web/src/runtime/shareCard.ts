import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { computeBadges, readRecords, streakFrom } from './achievements.ts';

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
