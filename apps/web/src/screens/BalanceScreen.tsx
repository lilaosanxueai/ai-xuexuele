import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { balanceTable, formulaParts, isBalanced, sampleEquations, type BalanceEq } from '../runtime/balance.ts';

const statsKey = (pid: string) => `island-balance-${pid}`;
function readStats(pid: string): { solved: number; sessions: number } {
  try { return { solved: 0, sessions: 0, ...JSON.parse(localStorage.getItem(statsKey(pid)) ?? '{}') }; }
  catch { return { solved: 0, sessions: 0 }; }
}
function writeStats(pid: string, s: { solved: number; sessions: number }) {
  try { localStorage.setItem(statsKey(pid), JSON.stringify(s)); } catch { /* 忽略 */ }
}

/** 化学式渲染：数字下标（CO2 → CO₂） */
function Formula({ f }: { f: string }) {
  return (
    <span className="font-black">
      {formulaParts(f).map((p, i) => (/\d/.test(p) ? <sub key={i} className="text-[0.7em]">{p}</sub> : <span key={i}>{p}</span>))}
    </span>
  );
}

/**
 * ⚗️ 方程式配平：给每个物质调系数，原子守恒对照表实时刷新，
 * 全部相等即配平成功。质量守恒定律的动手版。
 */
export default function BalanceScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [queue, setQueue] = useState<BalanceEq[]>([]);
  const [idx, setIdx] = useState(0);
  const [coeffs, setCoeffs] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const stats = useMemo(() => (profile ? readStats(profile.id) : { solved: 0, sessions: 0 }), [profile, finished]);

  const cur = queue[idx];
  const table = cur ? balanceTable(cur, coeffs) : [];
  const balanced = cur ? isBalanced(cur, coeffs) : false;

  // 配平成功 → 记成绩 → 自动进下一题
  useEffect(() => {
    if (!cur || !balanced) return;
    const t = setTimeout(() => {
      const next = solvedCount + 1;
      setSolvedCount(next);
      if (profile) {
        const s = readStats(profile.id);
        writeStats(profile.id, { solved: s.solved + 1, sessions: s.sessions + (idx === 0 ? 1 : 0) });
      }
      if (idx + 1 >= queue.length) setFinished(true);
      else { setIdx(idx + 1); setCoeffs(new Array(queue[idx + 1].answer.length).fill(1)); setAttempts(0); setShowHint(false); }
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanced, cur]);

  if (!profile) return null;

  const begin = () => {
    const q = sampleEquations(6);
    setQueue(q);
    setIdx(0);
    setCoeffs(new Array(q[0].answer.length).fill(1));
    setAttempts(0);
    setShowHint(false);
    setSolvedCount(0);
    setFinished(false);
  };

  const bump = (i: number, d: number) => {
    setAttempts((a) => a + 1);
    setCoeffs((cs) => cs.map((c, j) => (j === i ? Math.min(12, Math.max(1, c + d)) : c)));
  };

  const renderSide = (side: typeof cur.left, offset: number) => (
    <span className="flex flex-wrap items-center justify-center gap-1.5">
      {side.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-2xl font-black text-slate-400">+</span>}
          <span className="flex flex-col items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-slate-200">
            <Formula f={s.formula} />
            <span className="flex items-center gap-1">
              <button onClick={() => bump(offset + i, -1)} className="h-7 w-7 rounded-lg bg-slate-100 text-lg font-black leading-none text-slate-600 transition hover:bg-slate-200 active:scale-95" aria-label={`${s.name}系数减一`}>−</button>
              <span className={`w-7 text-center text-xl font-black ${coeffs[offset + i] === 1 ? 'text-slate-300' : 'text-rose-500'}`}>{coeffs[offset + i]}</span>
              <button onClick={() => bump(offset + i, 1)} className="h-7 w-7 rounded-lg bg-slate-100 text-lg font-black leading-none text-slate-600 transition hover:bg-slate-200 active:scale-95" aria-label={`${s.name}系数加一`}>＋</button>
            </span>
            <span className="text-[10px] text-slate-400">{s.name}</span>
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">⚗️ 方程式配平</h1>
          <span className="hidden text-xs text-slate-400 sm:inline">调系数看原子守恒 · 数据只在本机</span>
        </div>

        {queue.length === 0 && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/85 p-6 text-center shadow-md">
              <div className="text-5xl">⚖️</div>
              <p className="mt-3 text-lg font-bold text-slate-600">化学反应前后，原子种类和数目都不变</p>
              <p className="mt-1 text-sm text-slate-400">给每个物质配上合适的系数，让等号两边每种原子的个数相等</p>
              <button onClick={begin} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                ⚗️ 开始配平（6 题）
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">累计配平 <b className="text-cyan-600">{stats.solved}</b> 题</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">练习 <b className="text-cyan-600">{stats.sessions}</b> 轮</span>
            </div>
          </div>
        )}

        {cur && !finished && (
          <div className="rounded-3xl bg-white/90 p-5 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">第 {idx + 1}/{queue.length} 题</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${(solvedCount / queue.length) * 100}%` }} />
              </div>
              {attempts === 0 && <span className="text-xs font-bold text-emerald-500">尚未动手</span>}
              {attempts > 0 && !balanced && <span className="text-xs font-bold text-amber-500">调了 {attempts} 次</span>}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-slate-50 p-4">
              {renderSide(cur.left, 0)}
              <span className="text-3xl font-black text-slate-700">→</span>
              {renderSide(cur.right, cur.left.length)}
            </div>

            {/* 原子守恒对照表：配平的核心反馈 */}
            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <div className="grid grid-cols-4 bg-slate-100 text-center text-xs font-black text-slate-500">
                <div className="py-1.5">原子</div><div className="py-1.5">左边</div><div className="py-1.5">右边</div><div className="py-1.5">状态</div>
              </div>
              {table.map((row) => (
                <div key={row.el} className="grid grid-cols-4 border-t border-slate-100 text-center text-sm font-bold">
                  <div className="py-1.5 text-slate-600">{row.el}</div>
                  <div className="py-1.5 text-slate-700">{row.left}</div>
                  <div className="py-1.5 text-slate-700">{row.right}</div>
                  <div className={`py-1.5 ${row.ok ? 'text-emerald-500' : 'text-rose-500'}`}>{row.ok ? '✓ 相等' : '✗ 不等'}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
              {!showHint ? (
                <button onClick={() => setShowHint(true)} className="rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-200">💡 给点提示</button>
              ) : (
                <span className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">{cur.hint}</span>
              )}
              {balanced && <span className="animate-bounce rounded-xl bg-emerald-100 px-4 py-1.5 text-sm font-black text-emerald-600">✅ 配平成功！</span>}
            </div>
          </div>
        )}

        {finished && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 p-6 text-center shadow-lg">
              <div className="text-5xl">🎉</div>
              <div className="mt-2 text-2xl font-black text-white">完成 {solvedCount}/{queue.length} 题配平！</div>
              <div className="mt-1 text-sm text-white/85">原子种类不变·数目不变·质量守恒</div>
            </div>
            <button onClick={begin} className="w-full rounded-2xl bg-cyan-600 p-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-cyan-700">🆕 再来一轮</button>
          </div>
        )}
      </main>
    </div>
  );
}
