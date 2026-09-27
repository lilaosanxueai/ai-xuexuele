import { useMemo } from 'react';

/** 捕获的舞台命令（Python 演示离屏执行后输出） */
export type StageCmd =
  | { t: 'rect'; x: number; y: number; w: number; h: number; color: string }
  | { t: 'circle'; x: number; y: number; r: number; color: string }
  | { t: 'ring'; x: number; y: number; r: number; color: string }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; width: number }
  | { t: 'text'; text: string; x: number; y: number; color: string; size: number };

const VW = 400; // 舞台坐标 -200..200
const VH = 330; // -165..165（部分课的标题画在 y=155，留足上下边距）
const toX = (x: number) => x + VW / 2;
const toY = (y: number) => VH / 2 - y;

/** 给原始 hex 提亮，作边框色（非 #rrggbb 一律回退灰） */
function shade(hex: string): string {
  if (typeof hex !== 'string' || hex.length !== 7 || hex[0] !== '#') return '#334155';
  const n = parseInt(hex.slice(1), 16);
  if (!Number.isFinite(n)) return '#334155';
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * 0.18));
  return '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
}

/**
 * 现代 SVG 舞台渲染器：把 Python 演示输出的图形命令流渲染为原生 SVG。
 * 替代旧 canvas 色块：圆角矩形、平滑线条、清晰字体——全部矢量抗锯齿。
 */
export default function StageSvg({ cmds, grid = false }: { cmds: StageCmd[]; grid?: boolean }) {
  const els = useMemo(() => {
    const out: { key: string; node: React.ReactNode }[] = [];
    // 先画线（底层），再矩形/圆，最后文字（顶层）
    const lines = cmds.filter((c) => c.t === 'line') as Extract<StageCmd, { t: 'line' }>[];
    const rects = cmds.filter((c) => c.t === 'rect') as Extract<StageCmd, { t: 'rect' }>[];
    const circles = cmds.filter((c) => c.t === 'circle') as Extract<StageCmd, { t: 'circle' }>[];
    const rings = cmds.filter((c) => c.t === 'ring') as Extract<StageCmd, { t: 'ring' }>[];
    const texts = cmds.filter((c) => c.t === 'text') as Extract<StageCmd, { t: 'text' }>[];

    lines.forEach((c, i) => {
      out.push({
        key: 'l' + i,
        node: <line x1={toX(c.x1)} y1={toY(c.y1)} x2={toX(c.x2)} y2={toY(c.y2)} stroke={c.color} strokeWidth={Math.max(1.5, c.width)} strokeLinecap="round" />,
      });
    });
    rects.forEach((c, i) => {
      const banner = c.w >= 200 && c.h <= 45 && c.y + c.h / 2 >= 100;
      const bar = c.h >= 12 && c.h <= 40 && c.w <= 60;
      const rx = banner ? 10 : bar ? 5 : 12;
      out.push({
        key: 'r' + i,
        node: (
          <rect x={toX(c.x - c.w / 2)} y={toY(c.y + c.h / 2)} width={c.w} height={c.h} rx={rx} fill={c.color} opacity={banner ? 1 : 0.92} stroke={shade(c.color)} strokeWidth={1} />
        ),
      });
    });
    circles.forEach((c, i) => {
      out.push({ key: 'c' + i, node: <circle cx={toX(c.x)} cy={toY(c.y)} r={c.r} fill={c.color} stroke={shade(c.color)} strokeWidth={1} /> });
    });
    rings.forEach((c, i) => {
      out.push({ key: 'g' + i, node: <circle cx={toX(c.x)} cy={toY(c.y)} r={c.r} fill="none" stroke={c.color} strokeWidth={2.5} /> });
    });
    texts.forEach((c, i) => {
      const fs = Math.max(9, Math.min(22, c.size));
      out.push({
        key: 't' + i,
        node: (
          <text x={toX(c.x)} y={toY(c.y) + fs * 0.36} textAnchor="middle" fontSize={fs} fill={c.color} fontWeight={fs >= 12 ? 800 : 600} style={{ paintOrder: 'stroke', stroke: 'rgba(255,255,255,0.55)', strokeWidth: fs >= 12 ? 2 : 0 }}>
            {c.text}
          </text>
        ),
      });
    });
    return out;
  }, [cmds]);

  return (
    <div className="h-full w-full overflow-hidden rounded-3xl bg-white shadow-inner ring-1 ring-slate-200">
      <svg viewBox={'0 0 ' + VW + ' ' + VH} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {grid && (
          <g>
            {Array.from({ length: 17 }, (_, i) => (
              <line key={'gx' + i} x1={(i * VW) / 16} y1={0} x2={(i * VW) / 16} y2={VH} stroke="#e2e8f0" strokeWidth={0.6} />
            ))}
            {Array.from({ length: 14 }, (_, i) => (
              <line key={'gy' + i} x1={0} y1={(i * VH) / 13} x2={VW} y2={(i * VH) / 13} stroke="#e2e8f0" strokeWidth={0.6} />
            ))}
            <line x1={0} y1={toY(0)} x2={VW} y2={toY(0)} stroke="#94a3b8" strokeWidth={1.4} />
            <line x1={toX(0)} y1={0} x2={toX(0)} y2={VH} stroke="#94a3b8" strokeWidth={1.4} />
            {[-150, -100, -50, 50, 100, 150].map((x) => (
              <text key={'tx' + x} x={toX(x)} y={toY(0) + 12} textAnchor="middle" fontSize={8} fill="#94a3b8">{x}</text>
            ))}
            {[-100, -50, 50, 100].map((y) => (
              <text key={'ty' + y} x={toX(0) - 6} y={toY(y) + 3} textAnchor="end" fontSize={8} fill="#94a3b8">{y}</text>
            ))}
          </g>
        )}
        {els.map((e) => (
          <g key={e.key}>{e.node}</g>
        ))}
      </svg>
    </div>
  );
}

/** 捕获用舞台 API：跑 Python 演示并输出图形命令流（含画笔轨迹跟踪） */
export function createCaptureApi() {
  const cmds: StageCmd[] = [];
  let px = 0, py = 0, heading = 90, pen = false, penColor = '#dc2626', penWidth = 2;
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
      ring: (x: number, y: number, r: number, color?: string) => { cmds.push({ t: 'ring', x, y, r, color: color ?? '#3b82f6' }); return Promise.resolve(); },
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
