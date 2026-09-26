import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { checkPoem, makeQuiz, POEMS, type PoemMode, type PoemQuestion } from '../runtime/poems.ts';

/** 本地累计统计（按档案存 localStorage） */
interface PoemStats { totalQuestions: number; sessions: number; bestAccuracy: number; }
const statsKey = (pid: string) => `island-poem-${pid}`;
function readStats(pid: string): PoemStats {
  try { return { totalQuestions: 0, sessions: 0, bestAccuracy: 0, ...JSON.parse(localStorage.getItem(statsKey(pid)) ?? '{}') }; }
  catch { return { totalQuestions: 0, sessions: 0, bestAccuracy: 0 }; }
}
function writeStats(pid: string, s: PoemStats) {
  try { localStorage.setItem(statsKey(pid), JSON.stringify(s)); } catch { /* 忽略 */ }
}

/**
 * 📜 古诗词默写：补字（句中遮字）与接句（上句接下句）两种模式。
 * TTS 朗读提示 → 键入默写 → 忽略标点判分；错题展示全诗帮助记忆。
 */
export default function PoemScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [phase, setPhase] = useState<'setup' | 'session' | 'review'>('setup');
  const [mode, setMode] = useState<PoemMode>('fill');
  const [queue, setQueue] = useState<PoemQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'ok' | 'bad'>('none');
  const [firstTryOk, setFirstTryOk] = useState(0);
  const [wrongQs, setWrongQs] = useState<PoemQuestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const stats = useMemo(() => (profile ? readStats(profile.id) : { totalQuestions: 0, sessions: 0, bestAccuracy: 0 }), [profile, phase]);

  const ttsOk = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = (text: string) => {
    if (!ttsOk) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[＿，。？！、；：]/g, ''));
    u.lang = 'zh-CN';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  // 换题自动朗读 + 聚焦
  useEffect(() => {
    if (phase !== 'session' || !queue[idx]) return;
    const t = setTimeout(() => {
      speak(queue[idx].speakText);
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx, queue]);

  if (!profile) return null;
  const cur = queue[idx];

  const startRound = (qs: PoemQuestion[]) => {
    setQueue(qs);
    setIdx(0);
    setInput('');
    setFeedback('none');
    setFirstTryOk(0);
    setWrongQs([]);
    setPhase('session');
  };

  const begin = () => startRound(makeQuiz(8, mode));

  const finishRound = (okCount: number, wrongs: PoemQuestion[]) => {
    const total = queue.length || 8;
    const accuracy = Math.round((okCount / total) * 100);
    const s = readStats(profile.id);
    writeStats(profile.id, {
      totalQuestions: s.totalQuestions + total,
      sessions: s.sessions + 1,
      bestAccuracy: Math.max(s.bestAccuracy, accuracy),
    });
    setWrongQs(wrongs);
    setPhase('review');
  };

  const submit = () => {
    if (feedback !== 'none' || !cur || input.trim() === '') return;
    if (checkPoem(input, cur.answer)) {
      setFeedback('ok');
      const nextOk = firstTryOk + 1;
      setFirstTryOk(nextOk);
      setTimeout(() => {
        if (idx + 1 >= queue.length) finishRound(nextOk, wrongQs);
        else { setIdx(idx + 1); setInput(''); setFeedback('none'); }
      }, 700);
    } else {
      setFeedback('bad');
      if (!wrongQs.some((q) => q.poem.id === cur.poem.id && q.lineIdx === cur.lineIdx)) setWrongQs([...wrongQs, cur]);
    }
  };

  const nextAfterWrong = () => {
    if (idx + 1 >= queue.length) finishRound(firstTryOk, wrongQs);
    else { setIdx(idx + 1); setInput(''); setFeedback('none'); }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">📜 古诗词默写</h1>
          <span className="hidden text-xs text-slate-400 sm:inline">{POEMS.length} 首必背古诗 · 忽略标点判分 · 数据只在本机</span>
        </div>

        {phase === 'setup' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/85 p-5 shadow-md">
              <div className="mb-2 text-sm font-black text-slate-700">① 选模式</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('fill')}
                  className={`rounded-2xl p-4 text-center transition ${mode === 'fill' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <div className="text-3xl">✏️</div>
                  <div className="mt-1 font-black">补字默写</div>
                  <div className="text-xs opacity-80">句中遮两字，听音补全</div>
                </button>
                <button
                  onClick={() => setMode('next')}
                  className={`rounded-2xl p-4 text-center transition ${mode === 'next' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <div className="text-3xl">🔗</div>
                  <div className="mt-1 font-black">上句接下句</div>
                  <div className="text-xs opacity-80">给出上一句，默写下一句</div>
                </button>
              </div>
              <button onClick={begin} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                🎧 开始默写（8 句）
              </button>
              {!ttsOk && <p className="mt-2 text-center text-xs text-rose-500">当前浏览器不支持语音朗读，可换 Chrome/Edge 体验</p>}
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">累计默写 <b className="text-amber-600">{stats.totalQuestions}</b> 句</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">练习 <b className="text-amber-600">{stats.sessions}</b> 轮</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">最佳正确率 <b className="text-amber-600">{stats.bestAccuracy}%</b></span>
            </div>
          </div>
        )}

        {phase === 'session' && cur && (
          <div className="rounded-3xl bg-white/90 p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                {mode === 'fill' ? '补字默写' : '上句接下句'} · {cur.poem.dynasty}·{cur.poem.author}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((idx + (feedback !== 'none' ? 1 : 0)) / queue.length) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-400">{idx + 1}/{queue.length}</span>
            </div>

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-full rounded-2xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                {mode === 'fill' ? (
                  <>
                    <div className="text-xs font-bold text-amber-500">《{cur.poem.title}》· 听音补全遮住的字</div>
                    <div className="mt-2 text-2xl font-black tracking-[0.3em] text-slate-800">{cur.prompt}</div>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-bold text-amber-500">《{cur.poem.title}》· 上一句是——</div>
                    <div className="mt-2 text-2xl font-black tracking-[0.3em] text-slate-800">{cur.prompt}</div>
                    <div className="mt-1 text-xs text-amber-500">请默写出下一句</div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => speak(cur.speakText)} className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">🔊 再听一遍</button>
                <button onClick={() => speak(cur.poem.lines.join(''))} className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">📖 朗读全诗</button>
              </div>

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => { if (feedback === 'none') setInput(e.target.value); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                disabled={feedback !== 'none'}
                placeholder={mode === 'fill' ? '补上遮住的字…' : '默写下一句…'}
                className="w-full max-w-md rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-2xl font-black tracking-widest text-slate-800 outline-none transition focus:border-amber-400 disabled:bg-slate-50"
                autoComplete="off"
              />

              {feedback === 'none' && (
                <button onClick={submit} className="w-full max-w-md rounded-2xl bg-amber-600 p-3 text-base font-black text-white shadow-md transition hover:bg-amber-700">确认（回车）</button>
              )}
              {feedback === 'ok' && (
                <div className="animate-bounce rounded-2xl bg-emerald-100 px-6 py-3 text-lg font-black text-emerald-600">✅ 正确！</div>
              )}
              {feedback === 'bad' && (
                <div className="w-full max-w-md rounded-2xl bg-rose-50 p-4 text-center ring-1 ring-rose-200">
                  <div className="text-sm font-bold text-rose-500">再看看——正确答案：</div>
                  <div className="mt-1 text-2xl font-black tracking-widest text-rose-600">{cur.answer}</div>
                  <button onClick={nextAfterWrong} className="mt-3 w-full rounded-xl bg-rose-500 p-2.5 text-sm font-black text-white transition hover:bg-rose-600">我记住了，下一句 →</button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'review' && (
          <div className="space-y-4">
            <div className={`rounded-3xl p-6 text-center shadow-lg ${firstTryOk === queue.length ? 'bg-gradient-to-br from-amber-400 to-orange-400' : 'bg-gradient-to-br from-sky-400 to-indigo-400'}`}>
              <div className="text-5xl">{firstTryOk === queue.length ? '🎉' : '👏'}</div>
              <div className="mt-2 text-2xl font-black text-white">
                {firstTryOk === queue.length ? '全部默写正确！' : `首次答对 ${firstTryOk}/${queue.length}`}
              </div>
              <div className="mt-1 text-sm text-white/85">正确率 {Math.round((firstTryOk / (queue.length || 8)) * 100)}%{wrongQs.length > 0 ? ` · ${wrongQs.length} 句进入重练` : ''}</div>
            </div>

            {wrongQs.length > 0 && (
              <div className="rounded-3xl bg-white/90 p-5 shadow-md">
                <div className="mb-3 text-sm font-black text-rose-600">📖 错题里的整首诗（读两遍再默一遍）</div>
                <div className="space-y-3">
                  {wrongQs.map((q) => (
                    <div key={q.poem.id + q.lineIdx} className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                      <div className="text-center text-sm font-bold text-amber-700">《{q.poem.title}》 {q.poem.dynasty}·{q.poem.author}</div>
                      <div className="mt-2 space-y-1 text-center">
                        {q.poem.lines.map((line, i) => (
                          <div key={i} className={`text-lg font-black tracking-[0.25em] ${i === q.lineIdx || i === q.lineIdx + 1 ? 'text-rose-600' : 'text-slate-700'}`}>{line}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              {wrongQs.length > 0 && (
                <button onClick={() => startRound([...wrongQs])} className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5">
                  🔁 重练错题（{wrongQs.length} 句）
                </button>
              )}
              <button onClick={begin} className="flex-1 rounded-2xl bg-amber-600 p-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-amber-700">
                🆕 新一轮
              </button>
              <button onClick={() => setPhase('setup')} className="rounded-2xl bg-slate-200 p-4 text-center font-black text-slate-600 transition hover:bg-slate-300">
                ⚙️ 换设置
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
