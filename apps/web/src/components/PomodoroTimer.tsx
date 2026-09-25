import { useEffect, useRef, useState } from 'react';
import { api } from '../api.ts';

/** 番茄钟学习计时器：专注 25 分钟 → 休息 5 分钟，自动计入学习时长 */
const FOCUS_SEC = 25 * 60;
const BREAK_SEC = 5 * 60;

export default function PomodoroTimer({ profileId }: { profileId: string }) {
  const [phase, setPhase] = useState<'idle' | 'focus' | 'break'>('idle');
  const [left, setLeft] = useState(FOCUS_SEC);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const pct = phase === 'focus' ? ((FOCUS_SEC - left) / FOCUS_SEC) * 100 : phase === 'break' ? ((BREAK_SEC - left) / BREAK_SEC) * 100 : 0;
  const R = 40;
  const C = 2 * Math.PI * R;

  const completeFocus = async () => {
    setCycles((c) => c + 1);
    // 25 分钟自动计入 dailyUsage（每次最多 5 分钟，分 5 次提交）
    for (let i = 0; i < 5; i++) {
      try { await api.updateProgress(profileId, { minutesDelta: 5 }); } catch { /* 忽略 */ }
    }
  };

  const tick = () => {
    setLeft((s) => {
      if (s <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (phase === 'focus') {
          void completeFocus();
          setPhase('break');
          return BREAK_SEC;
        }
        setPhase('idle');
        return FOCUS_SEC;
      }
      return s - 1;
    });
  };

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 1000);
    if (phase === 'idle') { setPhase('focus'); setLeft(FOCUS_SEC); }
  };

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setLeft(FOCUS_SEC);
  };

  const color = phase === 'focus' ? '#dc2626' : phase === 'break' ? '#16a34a' : '#64748b';
  const label = phase === 'focus' ? '🍅 专注中' : phase === 'break' ? '🌿 休息一下' : '⏱ 番茄钟';

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-200">
      {/* 进度环 */}
      <svg viewBox="0 0 100 100" className="h-14 w-14 shrink-0">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="50" cy="50" r={R} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100}
          transform="rotate(-90 50 50)" strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }} />
        <text x="50" y="48" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f172a">{mm}</text>
        <text x="50" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">{ss}</text>
      </svg>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-black" style={{ color }}>{label}</div>
        <div className="text-[10px] text-slate-400">
          {phase === 'idle' ? '点 ▶ 开始 25 分钟专注' : phase === 'focus' ? `完成自动记 25 分钟 · 已完成 ${cycles} 🍅` : '休息 5 分钟再来一轮'}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        {phase === 'idle' || phase === 'break' ? (
          <button onClick={start} className="rounded-lg bg-red-500 px-2.5 py-1.5 text-[10px] font-bold text-white shadow transition hover:bg-red-600">
            {phase === 'break' ? '跳过' : '▶'}
          </button>
        ) : (
          <button onClick={pause} className="rounded-lg bg-amber-500 px-2.5 py-1.5 text-[10px] font-bold text-white shadow transition hover:bg-amber-600">⏸</button>
        )}
        <button onClick={reset} className="rounded-lg bg-slate-200 px-2 py-1.5 text-[10px] font-bold text-slate-500 transition hover:bg-slate-300">↺</button>
      </div>
      {cycles > 0 && <span className="shrink-0 text-xs font-black text-red-400">{cycles}🍅</span>}
    </div>
  );
}
