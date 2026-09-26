import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';
import { buildDeck } from '../runtime/flashcards.ts';
import { bumpRecords, readRecords, recordsKey } from '../runtime/achievements.ts';

/** 概念连线小游戏：左列知识点、右列定义句，点选两侧配对——答对锁定变绿，全部配对用时越短越好 */
interface Cell {
  key: string;
  text: string;
  cardId: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PairsGameScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subject, setSubject] = useState('全部');
  const [left, setLeft] = useState<Cell[]>([]);
  const [right, setRight] = useState<Cell[]>([]);
  const [pickedL, setPickedL] = useState<string | null>(null);
  const [pickedR, setPickedR] = useState<string | null>(null);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then(setLessons);
  }, [profile, nav]);

  const deck = useMemo(() => buildDeck(lessons), [lessons]);
  const subjects = useMemo(() => ['全部', ...new Set(deck.map((c) => c.subject))], [deck]);

  // 计时
  useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  const start = () => {
    const pool = subject === '全部' ? deck : deck.filter((c) => c.subject === subject);
    // 随机取 5 张卡为一局，且每张卡的正面不重复
    const seen = new Set<string>();
    const picks = [];
    for (const c of shuffle(pool)) {
      if (seen.has(c.front)) continue;
      seen.add(c.front);
      picks.push(c);
      if (picks.length >= 5) break;
    }
    if (picks.length < 3) return;
    setLeft(shuffle(picks.map((c) => ({ key: 'L' + c.id, text: c.front, cardId: c.id }))));
    setRight(shuffle(picks.map((c) => ({ key: 'R' + c.id, text: c.back.length > 26 ? c.back.slice(0, 26) + '…' : c.back, cardId: c.id }))));
    setLocked(new Set()); setPickedL(null); setPickedR(null);
    setWrongCount(0); setSeconds(0); setWrongFlash(null);
    setDone(false); setRunning(true);
  };

  const pick = (side: 'L' | 'R', cell: Cell) => {
    if (done || locked.has(cell.key)) return;
    if (side === 'L') setPickedL(cell.key === pickedL ? null : cell.key);
    else setPickedR(cell.key === pickedR ? null : cell.key);
    // 两侧都选了就判定
    const curL = side === 'L' ? (cell.key === pickedL ? null : cell.key) : pickedL;
    const curR = side === 'R' ? (cell.key === pickedR ? null : cell.key) : pickedR;
    if (!curL || !curR) return;
    const lCell = left.find((c) => c.key === curL)!;
    const rCell = right.find((c) => c.key === curR)!;
    if (lCell.cardId === rCell.cardId) {
      const next = new Set(locked); next.add(curL); next.add(curR);
      setLocked(next); setPickedL(null); setPickedR(null);
      if (next.size >= left.length * 2) {
        setDone(true); setRunning(false);
        try {
          if (!profile) return;
          const k = recordsKey(profile.id);
          const prev = readRecords(JSON.parse(localStorage.getItem(k) ?? '{}'));
          localStorage.setItem(k, JSON.stringify(bumpRecords(prev, { pairsPlays: prev.pairsPlays + 1 })));
        } catch { /* 忽略 */ }
      }
    } else {
      setWrongCount((w) => w + 1);
      setWrongFlash(curL + '|' + curR);
      setTimeout(() => { setPickedL(null); setPickedR(null); setWrongFlash(null); }, 500);
    }
  };

  if (!profile) return null;
  const cellCls = (cell: Cell, side: 'L' | 'R') => {
    const isPicked = (side === 'L' ? pickedL : pickedR) === cell.key;
    const isLocked = locked.has(cell.key);
    const isWrong = wrongFlash?.includes(cell.key);
    return `w-full rounded-2xl p-3 text-left text-sm leading-snug transition ${
      isLocked ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400'
        : isWrong ? 'bg-rose-100 text-rose-600 animate-pulse'
        : isPicked ? 'bg-sky-100 ring-2 ring-sky-400 text-sky-800'
        : 'bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md text-slate-700'
    }`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-lime-50 to-emerald-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">🔗 概念连连看</h1>
          <span className="text-xs text-slate-400">左点知识点 · 右点对应释义 · 配对成功变绿锁定</span>
        </div>

        {!running && !done && (
          <div className="rounded-3xl bg-white/90 p-5 shadow-md">
            <p className="mb-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800">每局 5 对卡片（来自课程知识点与课本定义句）：左列点一个、右列点一个——配对立即判定，全对计时结束。错 1 次没关系，多玩几轮知识点就刻进脑子啦！</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {subjects.map((s) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${subject === s ? 'bg-emerald-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s === '全部' ? '🌈 全部' : `${SUBJECTS[s]?.emoji ?? '📘'} ${s}`}
                </button>
              ))}
            </div>
            <button onClick={start} className="w-full rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-500 py-3.5 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5">开始连线 🔗</button>
          </div>
        )}

        {(running || done) && (
          <div>
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-2 text-sm shadow-sm">
              <span className="font-bold text-slate-500">已配对 {locked.size / 2}/{left.length}</span>
              <span className="font-bold text-sky-600">⏱ {seconds} 秒</span>
              <span className="font-bold text-rose-400">失误 {wrongCount} 次</span>
              <button onClick={start} className="rounded-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white">换一局</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-center text-xs font-black text-slate-400">知识点</div>
                {left.map((c) => (<button key={c.key} onClick={() => pick('L', c)} className={cellCls(c, 'L')}><span className="font-bold">{c.text}</span></button>))}
              </div>
              <div className="space-y-2">
                <div className="text-center text-xs font-black text-slate-400">课本释义</div>
                {right.map((c) => (<button key={c.key} onClick={() => pick('R', c)} className={cellCls(c, 'R')}>{c.text}</button>))}
              </div>
            </div>
            {done && (
              <div className="mt-5 rounded-3xl bg-white/95 p-6 text-center shadow-lg">
                <div className="text-5xl">{wrongCount === 0 ? '🏆' : wrongCount <= 2 ? '🎉' : '💪'}</div>
                <div className="mt-2 text-xl font-black text-slate-800">{wrongCount === 0 ? '一次全对！' : '全部配对成功！'}</div>
                <div className="mt-1 text-sm text-slate-500">用时 {seconds} 秒 · 失误 {wrongCount} 次</div>
                <div className="mt-4 flex justify-center gap-2">
                  <button onClick={start} className="rounded-2xl bg-emerald-500 px-6 py-2.5 font-bold text-white shadow transition hover:bg-emerald-600">再来一局</button>
                  <button onClick={() => nav('/flashcards')} className="rounded-2xl bg-violet-100 px-6 py-2.5 font-bold text-violet-600 transition hover:bg-violet-200">去闪卡复习</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
