import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';
import { buildDeck, deckStats, nextCardState, pickDueCards, type CardState, type Flashcard } from '../runtime/flashcards.ts';
import { bumpCounter } from '../runtime/dailyQuests.ts';

/** 闪卡复习：知识点 → 背面要点，莱特纳记忆盒安排间隔复习 */
const storageKey = (profileId: string) => `island-flashcards-${profileId}`;
const dailyKey = (profileId: string) => `island-daily-${profileId}`;

function loadStates(profileId: string): Record<string, CardState> {
  try {
    return JSON.parse(localStorage.getItem(storageKey(profileId)) ?? '{}');
  } catch {
    return {};
  }
}

export default function FlashcardScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subject, setSubject] = useState<string>('全部');
  const [states, setStates] = useState<Record<string, CardState>>({});
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState({ again: 0, good: 0, easy: 0 });
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    setStates(loadStates(profile.id));
    void api.lessons().then(setLessons);
  }, [profile, nav]);

  const fullDeck = useMemo(() => buildDeck(lessons), [lessons]);
  const subjects = useMemo(() => ['全部', ...new Set(fullDeck.map((c) => c.subject))], [fullDeck]);
  const deck = useMemo(() => (subject === '全部' ? fullDeck : fullDeck.filter((c) => c.subject === subject)), [fullDeck, subject]);
  const stats = useMemo(() => deckStats(deck, states), [deck, states]);
  const current = queue[idx];

  const persist = (next: Record<string, CardState>) => {
    setStates(next);
    if (profile) localStorage.setItem(storageKey(profile.id), JSON.stringify(next));
  };

  const start = () => {
    const due = pickDueCards(deck, states, 10);
    if (due.length === 0) return;
    setQueue(due);
    setIdx(0);
    setFlipped(false);
    setTally({ again: 0, good: 0, easy: 0 });
    setRunning(true);
  };

  const grade = (g: 'again' | 'good' | 'easy') => {
    if (!current) return;
    const next = { ...states, [current.id]: nextCardState(states[current.id], g) };
    persist(next);
    try {
      localStorage.setItem(dailyKey(profile!.id), JSON.stringify(bumpCounter(localStorage.getItem(dailyKey(profile!.id)), 'flashcards')));
    } catch { /* 忽略本地存储异常 */ }
    setTally((t) => ({ ...t, [g]: t[g] + 1 }));
    setFlipped(false);
    if (idx + 1 >= queue.length) setRunning(false);
    else setIdx(idx + 1);
  };

  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-10">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">🃏 闪卡复习</h1>
          <span className="text-xs text-slate-400">知识点正反面 · 记忆盒自动排期 · 数据只在本机</span>
        </div>

        {/* 学科筛选 + 统计 */}
        <div className="mb-4 rounded-3xl bg-white/80 p-4 shadow-md">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => { setSubject(s); setRunning(false); }}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${subject === s ? 'bg-indigo-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {s === '全部' ? '📚 全部' : `${SUBJECTS[s]?.emoji ?? '📘'} ${s}`}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-600">卡片 {stats.total} 张</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-600">今日待复习 {stats.due} 张</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-600">已掌握 {stats.mastered} 张</span>
            <button
              onClick={start}
              disabled={stats.due === 0}
              className="ml-auto rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {stats.due === 0 ? '今日已清空 🎉' : `开始复习（最多 10 张）→`}
            </button>
          </div>
        </div>

        {/* 复习进行中：当前卡 */}
        {running && current && (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>第 {idx + 1} / {queue.length} 张 · {current.subject} · 来自《{current.lessonTitle}》</span>
              <span>盒 {states[current.id]?.box ?? 0} · {flipped ? '记住了吗？' : '先想一想…'}</span>
            </div>
            <button
              onClick={() => setFlipped(!flipped)}
              className={`w-full rounded-3xl p-8 text-left shadow-lg transition ${flipped ? 'bg-white ring-2 ring-violet-300' : 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white hover:-translate-y-0.5'}`}
            >
              <div className="mb-2 text-xs opacity-70">{flipped ? '背面 · 要点' : '正面 · 知识点'}</div>
              <div className={`text-2xl font-black leading-relaxed ${flipped ? 'text-slate-800' : ''}`}>{flipped ? current.back : current.front}</div>
              {!flipped && <div className="mt-6 text-center text-sm opacity-80">点击卡片查看答案 ✋</div>}
            </button>
            {flipped && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button onClick={() => grade('again')} className="rounded-2xl bg-rose-100 py-3 font-black text-rose-600 transition hover:bg-rose-200">😵 不认得<br /><span className="text-xs font-normal">明天再见</span></button>
                <button onClick={() => grade('good')} className="rounded-2xl bg-amber-100 py-3 font-black text-amber-700 transition hover:bg-amber-200">🤔 模糊<br /><span className="text-xs font-normal">后天再练</span></button>
                <button onClick={() => grade('easy')} className="rounded-2xl bg-emerald-100 py-3 font-black text-emerald-700 transition hover:bg-emerald-200">😄 认得<br /><span className="text-xs font-normal">拉长间隔</span></button>
              </div>
            )}
          </div>
        )}

        {/* 完成画面 */}
        {!running && queue.length > 0 && (
          <div className="rounded-3xl bg-white/80 p-6 text-center shadow-md">
            <div className="text-5xl">🎉</div>
            <div className="mt-2 text-xl font-black text-slate-700">本组卡片复习完成！</div>
            <div className="mt-3 flex justify-center gap-3 text-sm">
              <span className="rounded-full bg-rose-50 px-3 py-1 font-bold text-rose-600">不认得 {tally.again}</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-600">模糊 {tally.good}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-600">认得 {tally.easy}</span>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={start} disabled={deckStats(deck, states).due === 0} className="rounded-2xl bg-violet-500 px-5 py-2.5 font-bold text-white shadow transition hover:bg-violet-600 disabled:opacity-50">再来一组</button>
              <button onClick={() => nav('/map')} className="rounded-2xl bg-slate-100 px-5 py-2.5 font-bold text-slate-600 transition hover:bg-slate-200">回学习地图</button>
            </div>
          </div>
        )}

        {/* 说明 */}
        {queue.length === 0 && (
          <div className="rounded-3xl bg-white/70 p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
            <p className="mb-2 font-bold text-slate-700">怎么用？</p>
            <p>① 每节课的知识点自动做成了双面卡：正面提问，背面是课本讲解里的核心句。② 看正面回想，点卡片翻面对答案。③ 诚实打分——「认得」的卡间隔会越拉越长（2 天→5 天→12 天），「不认得」的卡明天就会再出现，这正是记忆需要的节奏。</p>
          </div>
        )}
      </main>
    </div>
  );
}
