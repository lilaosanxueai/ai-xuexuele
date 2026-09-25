import { useMemo } from 'react';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

/** 学科掌握雷达图：全学科一图看全——各学科的平均正确率标到 0-100 */

interface SubjectStat {
  subject: string;
  mastery: number; // 0-100
}

function stats(lessons: Lesson[], progress: ProfileProgress | null): SubjectStat[] {
  const m = new Map<string, { sum: number; n: number }>();
  for (const [lid, ex] of Object.entries(progress?.exercises ?? {})) {
    if (ex.total === 0) continue;
    const l = lessons.find((x) => x.id === lid);
    if (!l) continue;
    const s = l.subjectArea ?? '信息科技';
    const cur = m.get(s) ?? { sum: 0, n: 0 };
    cur.sum += ex.correct / ex.total;
    cur.n += 1;
    m.set(s, cur);
  }
  return [...m.entries()]
    .map(([subject, v]) => ({ subject, mastery: Math.round((v.sum / v.n) * 100) }))
    .sort((a, b) => b.mastery - a.mastery);
}

export default function SubjectRadar({ lessons, progress }: { lessons: Lesson[]; progress: ProfileProgress | null }) {
  const data = useMemo(() => stats(lessons, progress), [lessons, progress]);
  if (data.length < 3) return null;

  const N = Math.min(data.length, 8); // 最多8个学科（正八边形）
  const R = 100;
  const cx = 130, cy = 120;
  const angle = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;

  // 雷达图网格（3 层：33/66/100）
  const rings = [33, 66, 100];
  const gridPath = rings.map((r) => {
    const pts = Array.from({ length: N }, (_, i) => {
      const x = cx + (R * r / 100) * Math.cos(angle(i));
      const y = cy + (R * r / 100) * Math.sin(angle(i));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return { r, pts };
  });

  // 数据多边形
  const dataPts = data.slice(0, N).map((d, i) => {
    const x = cx + (R * d.mastery / 100) * Math.cos(angle(i));
    const y = cy + (R * d.mastery / 100) * Math.sin(angle(i));
    return { x, y, subject: d.subject, mastery: d.mastery };
  });
  const polygon = dataPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
      <div className="mb-1 text-sm font-black text-slate-700">🕸 学科掌握雷达图</div>
      <p className="mb-2 text-xs text-slate-400">做过题的学科按平均正确率排布——图形越饱满越均匀，说明全面发展</p>
      <svg viewBox="0 0 260 250" className="mx-auto block w-full max-w-sm">
        {/* 网格 */}
        {gridPath.map((g) => (
          <polygon key={g.r} points={g.pts} fill="none" stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {/* 轴线 */}
        {Array.from({ length: N }, (_, i) => {
          const x = cx + R * Math.cos(angle(i));
          const y = cy + R * Math.sin(angle(i));
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />;
        })}
        {/* 数据 */}
        <polygon points={polygon} fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="2" />
        {/* 数据点 */}
        {dataPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1d4ed8" />
        ))}
        {/* 学科标签 */}
        {dataPts.map((p, i) => {
          const lx = cx + (R + 20) * Math.cos(angle(i));
          const ly = cy + (R + 20) * Math.sin(angle(i));
          return (
            <text key={i} x={lx} y={ly + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill={p.mastery >= 70 ? '#059669' : p.mastery >= 50 ? '#d97706' : '#dc2626'}>
              {p.subject.length > 4 ? p.subject.slice(0, 4) : p.subject} {p.mastery}%
            </text>
          );
        })}
      </svg>
    </div>
  );
}
