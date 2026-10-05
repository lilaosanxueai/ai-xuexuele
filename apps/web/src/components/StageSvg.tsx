import { useMemo, useState, type MouseEvent } from 'react';

/** 捕获的舞台命令（Python 演示离屏执行后输出） */
export type StageCmd =
  | { t: 'rect'; x: number; y: number; w: number; h: number; color: string }
  | { t: 'circle'; x: number; y: number; r: number; color: string }
  | { t: 'ring'; x: number; y: number; r: number; color: string }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; width: number }
  | { t: 'text'; text: string; x: number; y: number; color: string; size: number };

const VW = 420;
const VH = 330;

/** 客户端像素 → viewBox 坐标（preserveAspectRatio=xMidYMid meet 的逆映射）；用于取点读数 */
export function mapClientToView(px: number, py: number, w: number, h: number): { vx: number; vy: number } {
  if (w <= 0 || h <= 0) return { vx: NaN, vy: NaN };
  const s = Math.min(w / VW, h / VH);
  const ox = (w - VW * s) / 2;
  const oy = (h - VH * s) / 2;
  return { vx: (px - ox) / s, vy: (py - oy) / s };
}

/** 坐标读数格式：保留 1 位小数，整数不带 .0 */
export const fmtCoord = (n: number): string => {
  if (!Number.isFinite(n)) return '—';
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
};

/**
 * 配色纪律：全部课程色收敛到 5 个教育主题色（蓝·绿·琥珀·玫红·紫罗兰），
 * 任何原始颜色都吸附到最近的主题色——一页不再出现六色彩虹。
 */
const THEME = {
  blue: { fill: '#3b82f6', soft: '#dbeafe', text: '#1d4ed8' },
  green: { fill: '#10b981', soft: '#d1fae5', text: '#047857' },
  amber: { fill: '#f59e0b', soft: '#fef3c7', text: '#b45309' },
  rose: { fill: '#f43f5e', soft: '#ffe4e6', text: '#be123c' },
  violet: { fill: '#8b5cf6', soft: '#ede9fe', text: '#6d28d9' },
  slate: { fill: '#64748b', soft: '#e2e8f0', text: '#475569' },
};
type ThemeKey = keyof typeof THEME;
const THEME_KEYS = Object.keys(THEME) as ThemeKey[];

function clampColor(hex: string, mode: 'fill' | 'text'): string {
  if (typeof hex !== 'string' || hex.length !== 7 || hex[0] !== '#') return THEME.slate[mode];
  const n = parseInt(hex.slice(1), 16);
  if (!Number.isFinite(n)) return THEME.slate[mode];
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  let best: ThemeKey = 'blue', bd = Infinity;
  for (const k of THEME_KEYS) {
    const f = THEME[k].fill;
    const fr = [parseInt(f.slice(1, 3), 16), parseInt(f.slice(3, 5), 16), parseInt(f.slice(5, 7), 16)];
    const d = (rgb[0] - fr[0]) ** 2 + (rgb[1] - fr[1]) ** 2 + (rgb[2] - fr[2]) ** 2;
    if (d < bd) { bd = d; best = k; }
  }
  return THEME[best][mode];
}
const keyOf = (hex: string): ThemeKey => {
  const fill = clampColor(hex, 'fill');
  return (THEME_KEYS.find((k) => THEME[k].fill === fill) ?? 'blue');
};

/** 文字分级：小注/正文/标题三档；大号焦点字（emoji/主角数字）原样保留，不被钳平 */
function fontSizeOf(size: number): number {
  if (size >= 18) return Math.round(size);
  if (size >= 13) return 15;
  if (size >= 10) return 12;
  return 10;
}

/**
 * 现代 SVG 舞台渲染器 v2：
 * 自动构图（内容包围盒缩放居中，杜绝偏心/裁切）+ 主题配色收敛 + 统一文字分级。
 */
export default function StageSvg({ cmds, grid = false }: { cmds: StageCmd[]; grid?: boolean }) {
  /** 取点读数（grid 舞台悬停时）：bx/by=气泡像素位，vx/vy=viewBox 准线位，x/y=数据坐标，w=容器宽 */
  const [probe, setProbe] = useState<{ bx: number; by: number; vx: number; vy: number; x: number; y: number; w: number } | null>(null);
  const view = useMemo(() => {
    // 1) 计算内容包围盒（含文字宽度估计）
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const touch = (x: number, y: number, r = 0) => {
      minX = Math.min(minX, x - r); maxX = Math.max(maxX, x + r);
      minY = Math.min(minY, y - r); maxY = Math.max(maxY, y + r);
    };
    for (const c of cmds) {
      if (c.t === 'rect') { touch(c.x - c.w / 2, c.y - c.h / 2); touch(c.x + c.w / 2, c.y + c.h / 2); }
      else if (c.t === 'circle' || c.t === 'ring') touch(c.x, c.y, c.r);
      else if (c.t === 'line') { touch(c.x1, c.y1); touch(c.x2, c.y2); }
      else { const tw = c.text.length * c.size * (/[\u4e00-\u9fff]/.test(c.text) ? 1.05 : 0.6); touch(c.x - tw / 2, c.y - c.size * 0.7, c.size); touch(c.x + tw / 2, c.y + c.size * 0.7, c.size); }
    }
    if (!Number.isFinite(minX)) { minX = -100; minY = -80; maxX = 100; maxY = 80; }
    // 2) 留 13% 边距自适应缩放（内容小则放大，超界则缩小居中；边距保证图形与画框呼吸感）
    const PAD = 0.13;
    const availW = VW * (1 - PAD * 2), availH = VH * (1 - PAD * 2);
    const scale = Math.min(availW / Math.max(maxX - minX, 1), availH / Math.max(maxY - minY, 1), 2.2);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const toX = (x: number) => VW / 2 + (x - cx) * scale;
    const toY = (y: number) => VH / 2 - (y - cy) * scale;
    const toS = (s: number) => Math.max(9, s * Math.min(scale, 1.15));

    const els: { key: string; node: React.ReactNode }[] = [];
    const lines = cmds.filter((c) => c.t === 'line') as Extract<StageCmd, { t: 'line' }>[];
    const rects = cmds.filter((c) => c.t === 'rect') as Extract<StageCmd, { t: 'rect' }>[];
    const circles = cmds.filter((c) => c.t === 'circle') as Extract<StageCmd, { t: 'circle' }>[];
    const rings = cmds.filter((c) => c.t === 'ring') as Extract<StageCmd, { t: 'ring' }>[];
    const texts = cmds.filter((c) => c.t === 'text') as Extract<StageCmd, { t: 'text' }>[];

    // 线条（底层）
    lines.forEach((c, i) => {
      els.push({
        key: 'l' + i,
        node: <line x1={toX(c.x1)} y1={toY(c.y1)} x2={toX(c.x2)} y2={toY(c.y2)} stroke={clampColor(c.color, 'fill')} strokeWidth={Math.max(1.6, c.width * Math.min(scale, 1.2))} strokeLinecap="round" opacity={0.9} />,
      });
    });
    // 填充圆
    circles.forEach((c, i) => {
      const key = keyOf(c.color);
      els.push({
        key: 'c' + i,
        node: <circle cx={toX(c.x)} cy={toY(c.y)} r={Math.max(2, c.r * scale)} fill={THEME[key].soft} stroke={THEME[key].fill} strokeWidth={2} />,
      });
    });
    // 空心环（套娃/示意）——统一细线风格
    rings.forEach((c, i) => {
      const key = keyOf(c.color);
      els.push({
        key: 'g' + i,
        node: <circle cx={toX(c.x)} cy={toY(c.y)} r={Math.max(3, c.r * scale)} fill="none" stroke={THEME[key].fill} strokeWidth={2.5} opacity={0.9} />,
      });
    });
    // 矩形：横幅=实底圆角条；饱和色（近主题fill）=实底强调块+白字；浅色=浅底卡片
    const solidRects: { x: number; y: number; w: number; h: number }[] = [];
    rects.forEach((c, i) => {
      const key = keyOf(c.color);
      const n = typeof c.color === 'string' && c.color.length === 7 ? parseInt(c.color.slice(1), 16) : NaN;
      const rgb = Number.isFinite(n) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : [148, 163, 184];
      const f = THEME[key].fill;
      const fr = [parseInt(f.slice(1, 3), 16), parseInt(f.slice(3, 5), 16), parseInt(f.slice(5, 7), 16)];
      const s = THEME[key].soft;
      const sr = [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
      const dFill = (rgb[0] - fr[0]) ** 2 + (rgb[1] - fr[1]) ** 2 + (rgb[2] - fr[2]) ** 2;
      const dSoft = (rgb[0] - sr[0]) ** 2 + (rgb[1] - sr[1]) ** 2 + (rgb[2] - sr[2]) ** 2;
      const solid = dFill <= dSoft;
      const x = toX(c.x - c.w / 2), y = toY(c.y + c.h / 2);
      const w = c.w * scale, h = c.h * scale;
      const banner = c.w >= 200 && c.h <= 45 && c.y + c.h / 2 >= 100;
      const bar = c.h >= 10 && c.h <= 40 && c.w <= 70;
      if (banner) {
        els.push({ key: 'r' + i, node: <rect x={x} y={y} width={w} height={h} rx={11} fill={THEME[key].fill} /> });
      } else if (solid) {
        els.push({ key: 'r' + i, node: <rect x={x} y={y} width={w} height={h} rx={Math.min(10, h / 2, w / 2)} fill={THEME[key].fill} /> });
        solidRects.push({ x: c.x, y: c.y, w: c.w, h: c.h });
      } else if (bar) {
        els.push({ key: 'r' + i, node: <rect x={x} y={y} width={w} height={h} rx={Math.min(5, h / 2)} fill={THEME[key].soft} stroke={THEME[key].fill} strokeWidth={1.6} /> });
      } else {
        els.push({ key: 'r' + i, node: <rect x={x} y={y} width={w} height={h} rx={13} fill={THEME[key].soft} stroke={THEME[key].fill} strokeWidth={1.6} opacity={0.95} /> });
      }
    });
    // 文字（顶层）：横幅/实底块上的字强制白色，其余白描边+主题文字色+分级字号
    const bannerRects = rects.filter((c) => c.w >= 200 && c.h <= 45 && c.y + c.h / 2 >= 100);
    const inBanner = (t: Extract<StageCmd, { t: 'text' }>) => bannerRects.some((r) => Math.abs(t.x - r.x) < r.w / 2 + 4 && Math.abs(t.y - r.y) < r.h / 2 + 4);
    const inSolid = (t: Extract<StageCmd, { t: 'text' }>) => solidRects.some((r) => Math.abs(t.x - r.x) < r.w / 2 - 2 && Math.abs(t.y - r.y) < r.h / 2 - 2);
    texts.forEach((c, i) => {
      const fs = fontSizeOf(toS(c.size));
      const onBlock = inBanner(c) || inSolid(c);
      const fill = onBlock ? '#ffffff' : clampColor(c.color, 'text');
      els.push({
        key: 't' + i,
        node: (
          <text x={toX(c.x)} y={toY(c.y) + fs * 0.36} textAnchor="middle" fontSize={fs} fill={fill} fontWeight={fs >= 15 ? 800 : 600}
            style={onBlock ? undefined : { paintOrder: 'stroke', stroke: 'rgba(255,255,255,0.95)', strokeWidth: 4.5, strokeLinejoin: 'round' }}>
            {c.text}
          </text>
        ),
      });
    });
    return { els, toX, toY, scale, cx, cy };
  }, [cmds]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!grid) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { vx, vy } = mapClientToView(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
    if (!Number.isFinite(vx) || !Number.isFinite(vy)) return;
    // toX/toY 的逆变换：viewBox 坐标 → 数据坐标（y 轴翻转）
    const x = view.cx + (vx - VW / 2) / view.scale;
    const y = view.cy - (vy - VH / 2) / view.scale;
    setProbe({ bx: e.clientX - rect.left, by: e.clientY - rect.top, vx, vy, x, y, w: rect.width });
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 shadow-inner ring-1 ring-slate-200 ${grid ? 'cursor-crosshair' : ''}`}
      onMouseMove={grid ? onMove : undefined}
      onMouseLeave={grid ? () => setProbe(null) : undefined}
    >
      <svg viewBox={'0 0 ' + VW + ' ' + VH} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {grid && (
          <g>
            {Array.from({ length: 13 }, (_, i) => (
              <line key={'vx' + i} x1={(i * VW) / 12} y1={0} x2={(i * VW) / 12} y2={VH} stroke={i === 6 ? '#cbd5e1' : '#eef2f7'} strokeWidth={i === 6 ? 1.2 : 0.6} />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={'hy' + i} x1={0} y1={(i * VH) / 10} x2={VW} y2={(i * VH) / 10} stroke={i === 5 ? '#cbd5e1' : '#eef2f7'} strokeWidth={i === 5 ? 1.2 : 0.6} />
            ))}
          </g>
        )}
        {view.els.map((e) => (
          <g key={e.key}>{e.node}</g>
        ))}
        {grid && probe && (
          <g>
            <line x1={probe.vx} y1={0} x2={probe.vx} y2={VH} stroke="#38bdf8" strokeWidth={0.9} strokeDasharray="5 4" opacity={0.85} />
            <line x1={0} y1={probe.vy} x2={VW} y2={probe.vy} stroke="#38bdf8" strokeWidth={0.9} strokeDasharray="5 4" opacity={0.85} />
          </g>
        )}
      </svg>
      {grid && probe && (
        <div
          className="pointer-events-none absolute rounded-lg bg-sky-600/90 px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-md"
          style={{
            left: Math.min(Math.max(probe.bx, 36), Math.max(probe.w - 36, 36)),
            top: Math.max(probe.by - 30, 4),
            transform: 'translateX(-50%)',
          }}
        >
          ({fmtCoord(probe.x)}, {fmtCoord(probe.y)})
        </div>
      )}
    </div>
  );
}

/** 捕获用舞台 API：跑 Python 演示并输出图形命令流（含画笔轨迹跟踪） */
export function createCaptureApi() {
  const cmds: StageCmd[] = [];
  let px = 0, py = 0, heading = 90, pen = false, penColor = '#3b82f6', penWidth = 2;
  const lineTo = (nx: number, ny: number) => {
    if (pen) cmds.push({ t: 'line', x1: px, y1: py, x2: nx, y2: ny, color: penColor, width: penWidth });
    px = nx; py = ny;
  };
  return {
    cmds,
    api: {
      write: (text: string, x: number, y: number, color?: string, size?: number) => { cmds.push({ t: 'text', text, x, y, color: color ?? '#334155', size: size ?? 11 }); return Promise.resolve(); },
      fillRect: (x: number, y: number, w: number, h: number, color?: string) => { cmds.push({ t: 'rect', x, y, w, h, color: color ?? '#3b82f6' }); return Promise.resolve(); },
      circle: (x: number, y: number, r: number, color?: string) => { cmds.push({ t: 'circle', x, y, r, color: color ?? '#3b82f6' }); return Promise.resolve(); },
      ring: (x: number, y: number, r: number, color?: string) => { cmds.push({ t: 'ring', x, y, r, color: color ?? '#8b5cf6' }); return Promise.resolve(); },
      move: (d: number) => {
        const rad = (heading * Math.PI) / 180;
        lineTo(px + d * Math.cos(rad), py + d * Math.sin(rad));
        return Promise.resolve();
      },
      turnRight: (a: number) => { heading -= a; return Promise.resolve(); },
      turnLeft: (a: number) => { heading += a; return Promise.resolve(); },
      goTo: (x: number, y: number) => { lineTo(x, y); return Promise.resolve(); },
      penDown: () => { pen = true; return Promise.resolve(); },
      penUp: () => { pen = false; return Promise.resolve(); },
      penColor: (c: string) => { penColor = c; return Promise.resolve(); },
      bounce: () => Promise.resolve(), say: () => Promise.resolve(), sayFor: () => Promise.resolve(),
      costume: () => Promise.resolve(), changeSize: () => Promise.resolve(), show: () => Promise.resolve(),
      hide: () => Promise.resolve(), play: () => Promise.resolve(), wait: () => Promise.resolve(),
      touchingEdge: () => false, keyDown: () => false, recognize: () => false,
      random: (a: number, b: number) => (a + b) / 2,
      eq: (a: unknown, b: unknown) => Number(a) === Number(b),
    },
  };
}
