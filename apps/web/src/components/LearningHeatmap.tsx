import { useMemo } from 'react';

/**
 * 学习热力图（GitHub 式年度活动图）：
 * 近 12 周×7 天的格子网格，颜色深浅=当天学习分钟数。
 * 一眼看到自己的坚持——空白的格子是"今天还没学"的提醒。
 */

const LEVELS = [
  { bg: '#e2e8f0', label: '0 分钟' },
  { bg: '#bae6fd', label: '1-15 分钟' },
  { bg: '#7dd3fc', label: '16-30 分钟' },
  { bg: '#38bdf8', label: '31-60 分钟' },
  { bg: '#0284c7', label: '60+ 分钟' },
];

function levelOf(min: number): number {
  if (min <= 0) return 0;
  if (min <= 15) return 1;
  if (min <= 30) return 2;
  if (min <= 60) return 3;
  return 4;
}

/** 近 N 周的日期矩阵（列=周，行=周一~周日） */
function buildWeeks(weeks: number, dailyUsage: Record<string, number>) {
  const today = new Date();
  const result: { date: string; min: number; future: boolean }[][] = [];
  // 从 weeks 周前的周一开始
  const start = new Date(today);
  start.setDate(today.getDate() - (weeks - 1) * 7);
  // 对齐到周一
  const dow = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dow);

  for (let w = 0; w < weeks; w++) {
    const col: { date: string; min: number; future: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + w * 7 + d);
      const key = dt.toISOString().slice(0, 10);
      const isFuture = dt > today;
      col.push({ date: key, min: isFuture ? -1 : (dailyUsage[key] ?? 0), future: isFuture });
    }
    result.push(col);
  }
  return result;
}

export default function LearningHeatmap({ dailyUsage }: { dailyUsage: Record<string, number> }) {
  const weeks = useMemo(() => buildWeeks(12, dailyUsage), [dailyUsage]);

  const stats = useMemo(() => {
    let active = 0, total = 0;
    for (const col of weeks) {
      for (const d of col) {
        if (!d.future) {
          total++;
          if (d.min > 0) active++;
        }
      }
    }
    return { active, total, rate: total > 0 ? Math.round((active / total) * 100) : 0 };
  }, [weeks]);

  const monthLabels = useMemo(() => {
    const labels: { text: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((col, ci) => {
      const d = col[0];
      if (d) {
        const m = new Date(d.date).getMonth();
        if (m !== lastMonth) {
          labels.push({ text: `${m + 1}月`, col: ci });
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-black text-slate-700">📊 学习热力图</span>
        <span className="text-[11px] text-slate-400">
          近12周学习 <b className="text-sky-600">{stats.active}</b>/{stats.total} 天（{stats.rate}%）
        </span>
      </div>
      <div className="relative">
        {/* 月份标签 */}
        <div className="mb-1 ml-7 flex h-4 gap-[3px] overflow-hidden">
          {monthLabels.map((l) => (
            <span key={l.text + l.col} className="shrink-0 text-[9px] font-bold text-slate-400" style={{ marginLeft: l.col === 0 ? 0 : `${(l.col - (monthLabels.find((x) => x.col < l.col)?.col ?? -1) - 1) * 15}px` }}>
              {l.text}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {/* 星期标签 */}
          <div className="flex w-6 shrink-0 flex-col gap-[3px] text-[8px] leading-[11px] text-slate-300">
            {['一', '', '三', '', '五', '', '日'].map((d, i) => (
              <span key={i} className="h-[11px]">{d}</span>
            ))}
          </div>
          {/* 格子网格 */}
          {weeks.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-[3px]">
              {col.map((d) => (
                <div
                  key={d.date}
                  className="h-[11px] w-[11px] rounded-[2px] transition-transform hover:scale-125"
                  style={{
                    background: d.future ? 'transparent' : LEVELS[levelOf(d.min)].bg,
                    border: d.future ? 'none' : '1px solid rgba(0,0,0,0.03)',
                  }}
                  title={d.future ? '' : `${d.date} · ${d.min} 分钟`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* 图例 */}
      <div className="mt-2 flex items-center justify-end gap-1 text-[9px] text-slate-400">
        <span>少</span>
        {LEVELS.map((l, i) => (
          <span key={i} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: l.bg }} title={l.label} />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}
