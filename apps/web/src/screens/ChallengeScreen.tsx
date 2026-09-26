import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, WrongItem } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';
import { comboWord, gradeResult, sampleQuestions, scoreFor, type ChallengeQ } from '../runtime/challenge.ts';
import { bumpCounter } from '../runtime/dailyQuests.ts';
import { bumpRecords, readRecords, recordsKey } from '../runtime/achievements.ts';

/** 全学科挑战赛：10 题 · 3 条命 · 20 秒/题 · 连击加分，错题自动进错题本 */
const QUESTION_SECONDS = 20;
const TOTAL = 10;
const LIVES = 3;
const BANDS = ['全部', 'primary', 'junior', 'senior'] as const;
const BAND_LABEL: Record<string, string> = { 全部: '全学段', primary: '小学', junior: '初中', senior: '高中' };

type Phase = 'setup' | 'playing' | 'over';

export default function ChallengeScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subject, setSubject] = useState('全部');
  const [band, setBand] = useState('全部');
  const [phase, setPhase] = useState<Phase>('setup');
  const [queue, setQueue] = useState<ChallengeQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [seconds, setSeconds] = useState(QUESTION_SECONDS);
  const wrongsRef = useRef<WrongItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then(setLessons);
  }, [profile, nav]);

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  useEffect(() => () => clearTimer(), []);

  const q = queue[idx];

  const finish = (finalCorrect: number, finalScore: number) => {
    clearTimer();
    setPhase('over');
    if (profile) {
      void api.updateProgress(profile.id, {
        wrongAdds: wrongsRef.current,
        minutesDelta: 5,
      }).catch(() => {});
      try {
        const k = recordsKey(profile.id);
        const prev = readRecords(JSON.parse(localStorage.getItem(k) ?? '{}'));
        localStorage.setItem(k, JSON.stringify(bumpRecords(prev, { challengeBest: score })));
      } catch { /* 忽略 */ }
      try {
        localStorage.setItem(`island-daily-${profile.id}`, JSON.stringify(bumpCounter(localStorage.getItem(`island-daily-${profile.id}`), 'challenges')));
      } catch { /* 忽略本地存储异常 */ }
    }
    void finalCorrect; void finalScore;
  };

  const settle = (pickIdx: number | null) => {
    if (!q || picked !== null) return;
    clearTimer();
    setPicked(pickIdx ?? -1);
    const isRight = pickIdx === q.answer;
    if (isRight) {
      const gained = scoreFor(streak + 1);
      setScore((s) => s + gained);
      setCorrect((c) => c + 1);
      setStreak((s) => { const ns = s + 1; setBestStreak((b) => Math.max(b, ns)); return ns; });
    } else {
      wrongsRef.current.push({
        id: `${q.lessonId}#c${idx}`, lessonId: q.lessonId, lessonTitle: q.lessonTitle, subjectArea: q.subjectArea,
        q: q.q, options: q.options, answer: q.answer, explain: q.explain,
        wrongPicks: pickIdx === null ? [] : [pickIdx], times: 1, lastWrongAt: new Date().toISOString(),
      });
      setStreak(0);
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) { setTimeout(() => finish(correct, score), 1600); return; }
    }
    setTimeout(() => next(), 1500);
  };

  const next = () => {
    if (idx + 1 >= queue.length) { finish(correct, score); return; }
    setIdx(idx + 1);
    setPicked(null);
    setSeconds(QUESTION_SECONDS);
  };

  // 每题倒计时
  useEffect(() => {
    if (phase !== 'playing' || picked !== null || !q) return;
    clearTimer();
    setSeconds(QUESTION_SECONDS);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { settle(null); return 0; }
        return s - 1;
      });
    }, 1000);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx]);

  const start = () => {
    const qs = sampleQuestions(lessons, { subject, gradeBand: band, count: TOTAL });
    if (qs.length === 0) return;
    setQueue(qs);
    setIdx(0); setPicked(null); setCorrect(0); setScore(0); setStreak(0); setBestStreak(0);
    setLives(LIVES); setSeconds(QUESTION_SECONDS);
    wrongsRef.current = [];
    setPhase('playing');
  };

  if (!profile) return null;
  const subjects = ['全部', ...new Set(lessons.map((l) => l.subjectArea ?? '信息科技'))];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 to-rose-50">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">⚡ 全学科挑战赛</h1>
        </div>

        {phase === 'setup' && (
          <div className="rounded-3xl bg-white/90 p-5 shadow-md">
            <div className="mb-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
              规则：{TOTAL} 道题 · ❤️×{LIVES} 条命（答错扣 1 条）· 每题 {QUESTION_SECONDS} 秒 · 连击有加分 · 答错的题自动进错题本
            </div>
            <div className="mb-2 text-xs font-bold text-slate-500">选择学科</div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {subjects.map((s) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${subject === s ? 'bg-orange-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s === '全部' ? '🌈 全学科' : `${SUBJECTS[s]?.emoji ?? '📘'} ${s}`}
                </button>
              ))}
            </div>
            <div className="mb-2 text-xs font-bold text-slate-500">选择学段</div>
            <div className="mb-5 flex gap-1.5">
              {BANDS.map((b) => (
                <button key={b} onClick={() => setBand(b)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${band === b ? 'bg-rose-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {BAND_LABEL[b]}
                </button>
              ))}
            </div>
            <button onClick={start} className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5">
              开始挑战 ⚡
            </button>
          </div>
        )}

        {phase === 'playing' && q && (
          <div className="rounded-3xl bg-white/95 p-5 shadow-lg">
            {/* 顶栏：题号/命/分数 */}
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-500">第 {idx + 1}/{queue.length} 题</span>
              <span>{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</span>
              <span className="font-black text-orange-500">{score} 分 {streak >= 2 && <span className="ml-1 text-xs">🔥×{streak}</span>}</span>
            </div>
            {/* 倒计时条 */}
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full transition-all duration-1000 ${seconds <= 5 ? 'bg-rose-500' : 'bg-sky-400'}`} style={{ width: `${(seconds / QUESTION_SECONDS) * 100}%` }} />
            </div>
            <div className="mb-3 rounded-2xl bg-slate-50 p-3 text-[15px] font-semibold leading-relaxed text-slate-800">{q.q}</div>
            <div className="mb-2 text-right text-xs text-slate-400">{q.subjectArea} · 《{q.lessonTitle}》</div>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isAnswer = i === q.answer;
                const isPicked = picked === i;
                const show = picked !== null;
                return (
                  <button key={i} onClick={() => settle(i)} disabled={picked !== null}
                    className={`w-full rounded-xl border-2 px-4 py-2.5 text-left text-[15px] transition ${
                      show && isAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        : show && isPicked ? 'border-rose-300 bg-rose-50 text-rose-700'
                        : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}>
                    <span className="mr-2 font-black">{'ABCD'[i]}.</span>{opt}
                    {show && isAnswer && ' ✅'}
                    {show && isPicked && !isAnswer && ' ❌'}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
                {picked === q.answer ? `+${scoreFor(streak)} 分！${comboWord(streak)}` : picked === -1 ? '⏰ 超时！' : '答错了，'}
                <span className="ml-1">💡 {q.explain}</span>
              </div>
            )}
          </div>
        )}

        {phase === 'over' && (() => {
          const g = gradeResult(correct, queue.length || TOTAL, score);
          return (
            <div className="rounded-3xl bg-white/95 p-8 text-center shadow-lg">
              <div className="text-6xl">{g.emoji}</div>
              <div className="mt-2 text-2xl font-black text-slate-800">{g.title}</div>
              <p className="mt-1 text-sm text-slate-500">{g.word}</p>
              <div className="mt-5 flex justify-center gap-3 text-sm">
                <span className="rounded-full bg-orange-50 px-4 py-1.5 font-bold text-orange-600">得分 {score}</span>
                <span className="rounded-full bg-emerald-50 px-4 py-1.5 font-bold text-emerald-600">答对 {correct}/{queue.length}</span>
                <span className="rounded-full bg-rose-50 px-4 py-1.5 font-bold text-rose-500">最佳连击 🔥×{bestStreak}</span>
              </div>
              {wrongsRef.current.length > 0 && (
                <div className="mt-3 text-xs text-slate-400">{wrongsRef.current.length} 道错题已进入错题本，记得去清零哦</div>
              )}
              <div className="mt-5 flex justify-center gap-2">
                <button onClick={start} className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 font-bold text-white shadow transition hover:-translate-y-0.5">再来一局 ⚡</button>
                <button onClick={() => nav('/wrongbook')} className="rounded-2xl bg-rose-100 px-6 py-2.5 font-bold text-rose-600 transition hover:bg-rose-200">看错题本</button>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
