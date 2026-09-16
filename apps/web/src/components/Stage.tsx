import { useEffect, useRef } from 'react';
import { STAGE_W, STAGE_H, type StageState } from '../runtime/stageState.ts';

// 轨迹线（画笔）渲染在背景之上、角色之下

interface Props {
  stage: StageState;
  onSpriteClick?: () => void;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  /** 沉浸模式：canvas 填满父容器并保持 4:3 居中（父容器必须有确定尺寸） */
  fit?: boolean;
  /** 实验室模式：白底坐标网格 + 轴刻度（替代天空草地背景，画函数图像/曲线用） */
  grid?: boolean;
}

/** 小剧场：把 StageState 画到 canvas（中心原点、y 向上） */
export default function Stage({ stage, onSpriteClick, onCanvasReady, fit = false, grid = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(stage);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  stageRef.current = stage;

  // fit 模式：按容器尺寸算出最大 4:3 内接矩形，避免 aspect-ratio 在 max 约束下破比例
  useEffect(() => {
    if (!fit) return;
    const wrap = wrapRef.current;
    const box = boxRef.current;
    if (!wrap || !box) return;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      const tw = Math.min(w, (h * 4) / 3);
      box.style.width = `${Math.floor(tw)}px`;
      box.style.height = `${Math.floor((tw * 3) / 4)}px`;
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [fit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = STAGE_W * dpr;
    canvas.height = STAGE_H * dpr;
    onCanvasReady?.(canvas);

    let raf = 0;
    const draw = () => {
      const s = stageRef.current;
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, STAGE_W, STAGE_H);

      const toCanvas = (x: number, y: number): [number, number] => [STAGE_W / 2 + x, STAGE_H / 2 - y];

      if (gridRef.current) {
        drawGrid(ctx, toCanvas);
      } else {
        // 背景：天空 + 草地
        const sky = ctx.createLinearGradient(0, 0, 0, STAGE_H);
        sky.addColorStop(0, '#bae6fd');
        sky.addColorStop(0.75, '#e0f2fe');
        sky.addColorStop(1, '#bbf7d0');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, STAGE_W, STAGE_H);
        ctx.fillStyle = '#86efac';
        ctx.fillRect(0, STAGE_H - 26, STAGE_W, 26);
      }

      // 画笔轨迹（数学动态演示）
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      for (const ln of s.penLines) {
        const [ax, ay] = toCanvas(ln.x1, ln.y1);
        const [bx, by] = toCanvas(ln.x2, ln.y2);
        ctx.strokeStyle = ln.color;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // 画布文字标注（实验室图表数值/刻度）
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const lb of s.labels) {
        const [lx, ly] = toCanvas(lb.x, lb.y);
        ctx.font = `${lb.size}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = lb.color;
        ctx.fillText(lb.text, lx, ly);
      }

      // 目标点
      ctx.font = '30px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const t of s.targets) {
        const [tx, ty] = toCanvas(t.x, t.y);
        ctx.globalAlpha = t.reached ? 0.55 : 1;
        ctx.fillText(t.emoji, tx, ty);
        if (t.reached) ctx.fillText('✅', tx + 18, ty - 20);
        ctx.globalAlpha = 1;
      }

      // 角色
      if (s.visible) {
        const [cx, cy] = toCanvas(s.x, s.y);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(((s.dir - 90) * Math.PI) / 180);
        ctx.font = `${Math.round(48 * s.size / 100)}px serif`;
        ctx.fillText(s.costume, 0, 6); // emoji 基线补偿
        ctx.restore();

        // 说话气泡
        if (s.bubble && performance.now() < s.bubble.until) {
          drawBubble(ctx, cx, cy - 34 - 24 * s.size / 100, s.bubble.text);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onSpriteClick) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * STAGE_W;
    const py = ((e.clientY - rect.top) / rect.height) * STAGE_H;
    const sx = STAGE_W / 2 + stage.x, sy = STAGE_H / 2 - stage.y;
    if (Math.hypot(px - sx, py - sy) < 45) onSpriteClick();
  };

  if (fit) {
    return (
      <div ref={wrapRef} className="flex h-full w-full items-center justify-center">
        <div ref={boxRef} className="relative" style={{ aspectRatio: '4 / 3', width: '100%', maxWidth: '100%' }}>
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            className="h-full w-full rounded-2xl border-4 border-white shadow-xl cursor-pointer"
          />
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full rounded-2xl border-4 border-white shadow-md cursor-pointer"
      style={{ aspectRatio: '4 / 3' }}
    />
  );
}

/** 实验室坐标网格：白底 + 40 单位浅网格 + 中心轴 + 整百刻度数字 */
function drawGrid(ctx: CanvasRenderingContext2D, toCanvas: (x: number, y: number) => [number, number]): void {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  // 浅网格（每 40 单位一格）
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = -STAGE_W / 2 + 40; x < STAGE_W / 2; x += 40) {
    const [cx] = toCanvas(x, 0);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, STAGE_H);
  }
  for (let y = -STAGE_H / 2 + 40; y < STAGE_H / 2; y += 40) {
    const [, cy] = toCanvas(0, y);
    ctx.moveTo(0, cy);
    ctx.lineTo(STAGE_W, cy);
  }
  ctx.stroke();
  // 中心坐标轴
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  const [ox, oy] = toCanvas(0, 0);
  ctx.beginPath();
  ctx.moveTo(ox, 0); ctx.lineTo(ox, STAGE_H);
  ctx.moveTo(0, oy); ctx.lineTo(STAGE_W, oy);
  ctx.stroke();
  // 整百刻度数字
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let x = -200; x <= 200; x += 100) {
    if (x === 0) continue;
    const [cx, cy] = toCanvas(x, 0);
    ctx.fillText(String(x), cx, cy + 9);
  }
  for (let y = -100; y <= 100; y += 50) {
    if (y === 0) continue;
    const [cx, cy] = toCanvas(0, y);
    ctx.fillText(String(y), cx - 14, cy);
  }
}

function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string): void {
  const charsPerLine = 10;
  const lines: string[] = [];
  for (let i = 0; i < text.length && lines.length < 4; i += charsPerLine) lines.push(text.slice(i, i + charsPerLine));
  const w = Math.min(200, Math.max(60, charsPerLine * 16 + 20));
  const h = lines.length * 22 + 14;
  const bx = Math.max(w / 2 + 4, Math.min(STAGE_W - w / 2 - 4, x));
  const by = Math.max(h / 2 + 4, y);

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bx - w / 2, by - h / 2, w, h, 12);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx - 6, by + h / 2);
  ctx.lineTo(bx + 8, by + h / 2);
  ctx.lineTo(bx + 2, by + h / 2 + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.font = '15px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  lines.forEach((l, i) => ctx.fillText(l, bx, by - h / 2 + 18 + i * 22));
  ctx.restore();
}
