import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { checkAnswer, eqText, generateEq, solveSteps, type LinEq } from '../runtime/solve.ts';

const statsKey = (pid: string) => `island-solve-${pid}`;
function readStats(pid: string): { solved: number; sessions: number } {
  try { return { solved: 0, sessions: 0, ...JSON.parse(localStorage.getItem(statsKey(pid)) ?? '{}') }; }
  catch { return { solved: 0, sessions: 0 }; }
}
function writeStats(pid: string, s: { solved: number; sessions: number }) {
  try { localStorage.setItem(statsKey(pid), JSON.stringify(s)); } catch { /* 忽略 */ }
}

type Diff = 'easy' | 'normal' | 'hard';
const DIFFS: [Diff, string, string][] = [
  ['easy', '🌱 基础', '单边含 x'],
  ['normal', '🌿 提高', '双边含 x'],
  ['hard', '🌳 挑战', '系数更大'],
];

/**
 * 🧮 一元一次方程求解器：先自己解，卡住了看步骤——
 * 移项（过桥变号）→ 合并同类项 → 系数化为 1，规范步骤像老师在黑板上示范。
 */
export default function SolveScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [diff, setDiff] = useState<Diff>('normal');
  const [queue, setQueue] = useState<LinEq[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'ok' | 'bad'>('none');
  const [showSteps, setShowSteps] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const stats = useMemo(() => (profile ? readStats(profile.id) : { solved: 0, sessions: 0 }), [profile, finished]);

  const cur = queue[idx];

  if (!profile) return null;

  const begin = () => {
    const q = Array.from({ length: 5 }, () => generateEq(diff));
    setQueue(q);
    setIdx(0);
    setInput('');
    setFeedback('none');
    setShowSteps(false);
    setCorrect(0);
    setFinished(false);
  };

  const goNext = (wasCorrect: boolean) => {
    const nextCorrect = correct + (wasCorrect ? 1 : 0);
    setCorrect(nextCorrect);
    if (profile) {
      const s = readStats(profile.id);
      writeStats(profile.id, { solved: s.solved + (wasCorrect ? 1 : 0), sessions: s.sessions + (idx === 0 ? 1 : 0) });
    }
    if (idx + 1 >= queue.length) setFinished(true);
    else { setIdx(idx + 1); setInput(''); setFeedback('none'); setShowSteps(false); }
  };

  const submit = () => {
    if (feedback !== 'none' || !cur || input.trim() === '') return;
    if (checkAnswer(input, cur.x)) {
      setFeedback('ok');
      setTimeout(() => goNext(true), 700);
    } else {
      setFeedback('bad');
      setShowSteps(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">🧮 方程求解器</h1>
          <span className="hidden text-xs text-slate-400 sm:inline">移项→合并→系数化一 · 整数解保证 · 数据只在本机</span>
        </div>

        {queue.length === 0 && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/85 p-5 shadow-md">
              <div className="mb-2 text-sm font-black text-slate-700">① 选难度</div>
              <div className="grid grid-cols-3 gap-3">
                {DIFFS.map(([d, label, desc]) => (
                  <button key={d} onClick={() => setDiff(d)} className={`rounded-2xl p-3 text-center transition ${diff === d ? 'bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <div className="font-black">{label}</div>
                    <div className="mt-0.5 text-xs opacity-80">{desc}</div>
                  </button>
                ))}
              </div>
              <button onClick={begin} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                🧮 开始解方程（5 题）
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">累计解对 <b className="text-indigo-600">{stats.solved}</b> 题</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">练习 <b className="text-indigo-600">{stats.sessions}</b> 轮</span>
            </div>
          </div>
        )}

        {cur && !finished && (
          <div className="rounded-3xl bg-white/90 p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">第 {idx + 1}/{queue.length} 题</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(correct / queue.length) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-400">已对 {correct}</span>
            </div>

            <div className="rounded-2xl bg-slate-50 py-8 text-center">
              <div className="text-4xl font-black tracking-wider text-slate-800">{eqText(cur)}</div>
              <div className="mt-1 text-xs text-slate-400">x = ?（先自己算，卡住了看步骤）</div>
            </div>

            <div className="mt-5 flex flex-col items-center gap-3">
              <div className="flex w-full max-w-sm gap-2">
                <input
                  value={input}
                  onChange={(e) => { if (feedback === 'none') setInput(e.target.value); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                  disabled={feedback !== 'none'}
                  placeholder="x = ?"
                  className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-2xl font-black text-slate-800 outline-none transition focus:border-indigo-400 disabled:bg-slate-50"
                  autoComplete="off"
                />
                <button onClick={submit} disabled={feedback !== 'none'} className="rounded-2xl bg-indigo-600 px-6 text-base font-black text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-40">确定</button>
              </div>

              {feedback === 'none' && !showSteps && (
                <button onClick={() => setShowSteps(true)} className="rounded-xl bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200">💡 卡住了？看解题步骤</button>
              )}

              {feedback === 'ok' && <div className="animate-bounce rounded-2xl bg-emerald-100 px-6 py-3 text-lg font-black text-emerald-600">✅ 正确！x = {cur.x}</div>}

              {feedback === 'bad' && (
                <div className="w-full max-w-sm rounded-2xl bg-rose-50 p-4 text-center ring-1 ring-rose-200">
                  <div className="text-sm font-bold text-rose-500">再看看——正确答案是 x = {cur.x}，看下面步骤找找哪步出了问题</div>
                  <button onClick={() => goNext(false)} className="mt-3 w-full rounded-xl bg-rose-500 p-2.5 text-sm font-black text-white transition hover:bg-rose-600">明白了，下一题 →</button>
                </div>
              )}

              {showSteps && (
                <div className="w-full space-y-2 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                  <div className="text-center text-sm font-black text-amber-700">规范解题步骤</div>
                  {solveSteps(cur).map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-3">
                      <span className="shrink-0 rounded-lg bg-amber-100 px-2 py-1 text-xs font-black text-amber-700">{s.title}</span>
                      <span className="text-lg font-black text-slate-800">{s.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {finished && (
          <div className="space-y-4">
            <div className={`rounded-3xl p-6 text-center shadow-lg ${correct === queue.length ? 'bg-gradient-to-br from-emerald-400 to-teal-400' : 'bg-gradient-to-br from-indigo-400 to-violet-400'}`}>
              <div className="text-5xl">{correct === queue.length ? '🎉' : '💪'}</div>
              <div className="mt-2 text-2xl font-black text-white">解对 {correct}/{queue.length} 题</div>
              <div className="mt-1 text-sm text-white/85">移项过桥变号 · 合并同类项 · 系数化为 1</div>
            </div>
            <button onClick={begin} className="w-full rounded-2xl bg-indigo-600 p-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-indigo-700">🆕 再来一轮</button>
          </div>
        )}
      </main>
    </div>
  );
}
