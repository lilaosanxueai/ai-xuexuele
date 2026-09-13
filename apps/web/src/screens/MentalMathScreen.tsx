import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';

/** 一道口算题 */
interface MQ { text: string; answer: number }

const LEVELS = [
  { key: 'g1', name: '一年级', emoji: '🐣', desc: '20 以内加减法' },
  { key: 'g2', name: '二年级', emoji: '🐤', desc: '表内乘除 · 百以内加减' },
  { key: 'g34', name: '三四年级', emoji: '🦆', desc: '两位数×一位数 · 三位数加减' },
  { key: 'g56', name: '五六年级', emoji: '🦢', desc: '小数 · 运算律混合' },
  { key: 'junior', name: '初中', emoji: '🦅', desc: '负数 · 平方 · 简单方程' },
] as const;
type LevelKey = (typeof LEVELS)[number]['key'];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** 各年级题库生成（保证整除/不出负数等口算规范） */
function genQuestion(level: LevelKey): MQ {
  switch (level) {
    case 'g1': {
      const kind = rand(0, 1);
      if (kind === 0) { const a = rand(2, 15), b = rand(2, 20 - a); return { text: `${a} + ${b} = ?`, answer: a + b }; }
      const a = rand(5, 20), b = rand(1, a - 1); return { text: `${a} - ${b} = ?`, answer: a - b };
    }
    case 'g2': {
      const kind = rand(0, 2);
      if (kind === 0) { const a = rand(2, 9), b = rand(2, 9); return { text: `${a} × ${b} = ?`, answer: a * b }; }
      if (kind === 1) { const b = rand(2, 9), q = rand(2, 9); return { text: `${b * q} ÷ ${b} = ?`, answer: q }; }
      const a = rand(20, 80), b = rand(10, 100 - a); return { text: `${a} + ${b} = ?`, answer: a + b };
    }
    case 'g34': {
      const kind = rand(0, 2);
      if (kind === 0) { const a = rand(12, 39), b = rand(2, 9); return { text: `${a} × ${b} = ?`, answer: a * b }; }
      if (kind === 1) { const a = rand(150, 800), b = rand(50, 999 - a); return { text: `${a} + ${b} = ?`, answer: a + b }; }
      const a = rand(200, 999), b = rand(50, a - 20); return { text: `${a} - ${b} = ?`, answer: a - b };
    }
    case 'g56': {
      const kind = rand(0, 2);
      if (kind === 0) { const a = rand(11, 89) / 10, b = rand(11, 89) / 10; return { text: `${a} + ${b} = ?（小数）`, answer: Math.round((a + b) * 10) / 10 }; }
      if (kind === 1) { const a = rand(2, 12), b = rand(2, 12), c = rand(2, 9); return { text: `${a} × ${b} + ${c} = ?`, answer: a * b + c }; }
      const a = rand(2, 9), b = rand(2, 9), c = rand(2, 9); return { text: `${a} × (${b} + ${c}) = ?`, answer: a * (b + c) };
    }
    case 'junior': {
      const kind = rand(0, 2);
      if (kind === 0) { const a = -rand(2, 19), b = rand(2, 19); return { text: `(${a}) + ${b} = ?`, answer: a + b }; }
      if (kind === 1) { const a = rand(2, 15); return { text: `${a}² = ?`, answer: a * a }; }
      const x = rand(2, 12), k = rand(2, 9), c = rand(1, 20); return { text: `${k}x + ${c} = ${k * x + c}，x = ?`, answer: x };
    }
  }
}

/** 60 秒限时口算闯关：连击计分，错题可重练 */
export default function MentalMathScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [level, setLevel] = useState<LevelKey | null>(null);
  const [q, setQ] = useState<MQ | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'ok' | 'bad'>('none');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongs, setWrongs] = useState<MQ[]>([]);
  const [finished, setFinished] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrongsRef = useRef<MQ[]>([]);
  const retryQueue = useRef<MQ[]>([]);

  // 计时
  useEffect(() => {
    if (!level || finished) return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [level, timeLeft, finished]);

  // 本地最佳记录
  const bestKey = `mentalmath-best-${level ?? ''}`;
  const best = level ? Number(localStorage.getItem(bestKey) ?? 0) : 0;

  const start = (lv: LevelKey) => {
    setLevel(lv);
    setQ(genQuestion(lv));
    setInput('');
    setFeedback('none');
    setTimeLeft(60);
    setScore(0); setStreak(0); setBestStreak(0); setCorrectCount(0);
    wrongsRef.current = []; setWrongs([]);
    retryQueue.current = []; setRetryMode(false);
    setFinished(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const startRetry = () => {
    if (wrongs.length === 0) return;
    retryQueue.current = [...wrongs].sort(() => Math.random() - 0.5);
    wrongsRef.current = []; setWrongs([]);
    setRetryMode(true);
    setFinished(false);
    setQ(retryQueue.current[0]);
    setInput(''); setFeedback('none');
    setCorrectCount(0); setStreak(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const nextQuestion = (retryIdx: number | null) => {
    if (retryMode) {
      const rest = retryQueue.current.slice(1);
      retryQueue.current = rest;
      if (rest.length === 0) { setFinished(true); return; }
      setQ(rest[0]);
    } else {
      setQ(genQuestion(level!));
    }
    setInput('');
    setFeedback('none');
    inputRef.current?.focus();
  };

  const finish = () => {
    setFinished(true);
    setWrongs(wrongsRef.current);
    if (retryMode) return;
    // 成绩上报（家长面板可见）
    if (profile) {
      void api.updateProgress(profile.id, {
        lessonId: 'mentalmath',
        exercise: { correct: correctCount, total: correctCount + wrongsRef.current.length },
      }).catch(() => {});
    }
    if (score > best) localStorage.setItem(bestKey, String(score));
  };

  const submit = () => {
    if (!q || input.trim() === '' || feedback !== 'none') return;
    const val = Number(input);
    const ok = Number.isFinite(val) && Math.abs(val - q.answer) < 1e-9;
    if (ok) {
      setFeedback('ok');
      setCorrectCount((c) => c + 1);
      setStreak((s) => { const ns = s + 1; setBestStreak((b) => Math.max(b, ns)); return ns; });
      setScore((s) => s + 10 + streak * 2);
      setTimeout(() => nextQuestion(null), 350);
    } else {
      setFeedback('bad');
      wrongsRef.current.push(q);
      setStreak(0);
      setTimeout(() => nextQuestion(null), 900);
    }
  };

  if (!level) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-10">
          <h1 className="text-2xl font-black text-slate-700">⚡ 口算训练器</h1>
          <p className="mb-5 mt-1 text-sm text-slate-500">60 秒限时闯关 · 连击加倍 · 答错的题自动进入重练</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {LEVELS.map((l) => (
              <button
                key={l.key}
                onClick={() => start(l.key)}
                className="flex items-center gap-4 rounded-3xl bg-white/85 p-5 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-4xl">{l.emoji}</span>
                <span>
                  <span className="block text-lg font-black text-slate-800">{l.name}</span>
                  <span className="text-xs text-slate-500">{l.desc}</span>
                </span>
                <span className="ml-auto rounded-xl bg-sky-500 px-4 py-2 font-bold text-white">开始 →</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const levelMeta = LEVELS.find((l) => l.key === level)!;

  if (finished) {
    const total = correctCount + wrongs.length;
    const acc = total ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-6 pb-10 pt-8">
          <div className="w-full rounded-3xl bg-white/90 p-8 text-center shadow-xl">
            <div className="text-6xl">{acc >= 90 ? '🏆' : acc >= 70 ? '👍' : '💪'}</div>
            <h2 className="mt-3 text-2xl font-black text-slate-800">
              {retryMode ? '错题重练完成！' : '时间到！'}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-2xl bg-sky-50 p-3"><div className="text-xl font-black text-sky-600">{correctCount}</div><div className="text-slate-500">答对</div></div>
              <div className="rounded-2xl bg-rose-50 p-3"><div className="text-xl font-black text-rose-600">{wrongs.length}</div><div className="text-slate-500">仍错</div></div>
              <div className="rounded-2xl bg-amber-50 p-3"><div className="text-xl font-black text-amber-600">{acc}%</div><div className="text-slate-500">正确率</div></div>
            </div>
            {!retryMode && <p className="mt-3 text-sm text-slate-500">得分 {score} · 最长连击 {bestStreak} 🔥{score > 0 && best > 0 && score > best ? ' · 新纪录！' : ''}</p>}
            {wrongs.length > 0 ? (
              <>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-left">
                  <div className="mb-2 text-sm font-bold text-slate-600">📖 这次没做对的题：</div>
                  {wrongs.map((w, i) => (
                    <div key={i} className="flex justify-between border-b border-dashed border-slate-200 py-1.5 text-sm last:border-0">
                      <span className="text-slate-700">{w.text}</span>
                      <span className="font-bold text-emerald-600">= {w.answer}</span>
                    </div>
                  ))}
                </div>
                <button onClick={startRetry} className="mt-4 w-full rounded-xl bg-rose-500 px-5 py-2.5 font-bold text-white hover:bg-rose-600">
                  🎯 只重练这些错题
                </button>
              </>
            ) : (
              <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">全对！一个错题都没有 🎉</p>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={() => start(level)} className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 font-bold text-white hover:bg-sky-600">再来一局</button>
              <button onClick={() => setLevel(null)} className="flex-1 rounded-xl bg-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-300">换年级</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-6 pb-10 pt-6">
        {/* 顶部状态 */}
        <div className="mb-3 flex w-full items-center gap-2 text-sm">
          <span className="rounded-full bg-white/85 px-3 py-1 font-bold text-slate-600 shadow-sm">{levelMeta.emoji} {levelMeta.name}</span>
          <span className="rounded-full bg-white/85 px-3 py-1 font-bold text-slate-600 shadow-sm">得分 {score}</span>
          {streak >= 3 && <span className="animate-pulse rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-600 shadow-sm">🔥 连击 {streak}</span>}
          <span className={`ml-auto rounded-full px-3 py-1 font-black shadow-sm ${timeLeft <= 10 ? 'animate-pulse bg-rose-500 text-white' : 'bg-white/85 text-slate-600'}`}>⏱ {timeLeft}s</span>
        </div>
        {/* 计时条 */}
        <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
          <div className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-rose-400' : 'bg-sky-400'}`} style={{ width: `${(timeLeft / 60) * 100}%` }} />
        </div>

        {/* 题目 */}
        <div className={`w-full rounded-3xl p-10 text-center shadow-xl transition ${feedback === 'ok' ? 'bg-emerald-400' : feedback === 'bad' ? 'bg-rose-400' : 'bg-white/90'}`}>
          <div className={`text-5xl font-black tracking-wide ${feedback !== 'none' ? 'text-white' : 'text-slate-800'}`}>{q?.text}</div>
          {feedback === 'ok' && <div className="mt-2 text-lg font-bold text-white">✓ 正确！+{10 + streak * 2}</div>}
          {feedback === 'bad' && <div className="mt-2 text-lg font-bold text-white">✗ 应该是 {q?.answer}</div>}
        </div>

        {/* 输入 */}
        <form
          className="mt-6 flex w-full gap-2"
          onSubmit={(e) => { e.preventDefault(); submit(); }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputMode="decimal"
            autoFocus
            placeholder="输入答案，回车提交"
            className="min-w-0 flex-1 rounded-2xl border-2 border-slate-300 bg-white/95 px-5 py-4 text-center text-3xl font-black text-slate-800 outline-none focus:border-sky-400"
          />
          <button type="submit" className="rounded-2xl bg-sky-500 px-6 text-xl font-black text-white hover:bg-sky-600">确认</button>
        </form>
        <button onClick={() => nav('/map')} className="mt-6 text-sm text-slate-400 hover:text-slate-600">不练了，回地图</button>
      </main>
    </div>
  );
}
