import { useMemo } from 'react';
import type { Lesson } from '@shared/types.ts';
import { buildMindmap, layoutMindmap, depthColor, depthW, depthH, depthFont } from '../runtime/mindmap.ts';

/** 课程思维导图：自动从课题+讲解章节+课标知识点生成（SVG 渲染） */
export default function MindmapView({ lesson }: { lesson: Lesson }) {
  const nodes = useMemo(() => layoutMindmap(buildMindmap(lesson)), [lesson]);
  if (nodes.length <= 1) return null;
  const W = 560, H = 340;

  return (
    <div className="overflow-x-auto rounded-2xl bg-slate-50 p-3">
      <div className="mb-1 text-xs font-bold text-slate-400">🗺 本课思维导图（自动生成）</div>
      <svg viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} className="mx-auto block w-full" style={{ minWidth: 480 }}>
        {/* 连线 */}
        {nodes.filter((n) => n.parent).map((n, i) => {
          const p = n.parent!;
          const mx = (n.x + p.x) / 2;
          return (
            <path key={'e' + i} d={`M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${n.y}, ${n.x} ${n.y}`}
              fill="none" stroke="#cbd5e1" strokeWidth={n.depth === 1 ? 2 : 1.2} />
          );
        })}
        {/* 节点 */}
        {nodes.map((n, i) => {
          const w = depthW(n.depth), h = depthH(n.depth);
          const col = depthColor(n.depth);
          const isRoot = n.depth === 0;
          const display = n.label.length > 10 ? n.label.slice(0, 10) + '…' : n.label;
          return (
            <g key={'n' + i}>
              <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx={n.depth === 0 ? 14 : 8}
                fill={isRoot ? '#1d4ed8' : n.depth === 1 ? '#eff6ff' : '#f8fafc'}
                stroke={col} strokeWidth={isRoot ? 0 : 1.5} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={depthFont(n.depth)}
                fontWeight={isRoot ? 900 : n.depth === 1 ? 700 : 500}
                fill={isRoot ? '#fff' : n.depth === 1 ? '#1e40af' : '#64748b'}>
                {display}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
