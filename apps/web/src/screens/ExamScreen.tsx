import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson, WrongItem } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { sampleQuestions, type ChallengeQ } from '../runtime/challenge.ts';
import { bumpRecords, readRecords, recordsKey } from '../runtime/achievements.ts';

/** 学科期末模拟卷：全学科课程抽 20 题 · 30 分钟总计时 · 无生命限制 · 结卷按课标模块诊断 */
const TOTAL = 20;
const EXAM_SECONDS = 30 * 60;

type Phase = 'setup' | 'doing' | 'over';

interface ModuleStat {
  module: string;
  correct: number;
  total: number;
}

export default function ExamScreen() {
  const nav = useNavigate();
  const { subject = '' } = useParams();
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [phase, setPhase] = useState<Phase>('setup');
  const [queue, setQueue] = useState<ChallengeQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ q: ChallengeQ; pick: number }[]>([]);
  const [left, setLeft] = useState(EXAM_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then(setLessons);
  }, [profile, nav]);

  const subjectLessons = useMemo(
    () => lessons.filter((l) => (l.subjectArea ?? '信息科技') === decodeURIComponent(subject)),
    [lessons, subject],
  );

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  useEffect(() => () => clearTimer(), []);

  const submit = (finalAnswers: { q: ChallengeQ; pick: number }[]) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    clearTimer();
    setAnswers(finalAnswers);
    setPhase('over');
    const wrongAdds: WrongItem[] = finalAnswers
      .filter((a) => a.pick !== a.q.answer)
      .map((a) => ({
        id: `${a.q.lessonId}#e${a.q.q.slice(0, 8)}`, lessonId: a.q.lessonId, lessonTitle: a.q.lessonTitle, subjectArea: a.q.subjectArea,
        q: a.q.q, options: a.q.options, answer: a.q.answer, explain: a.q.explain,
        wrongPicks: [a.pick], times: 1, lastWrongAt: new Date().toISOString(),
      }));
    if (profile) {
      if (wrongAdds.length > 0) void api.updateProgress(profile.id, { wrongAdds, minutesDelta: 5 }).catch(() => {});
      const rate = finalAnswers.length ? Math.round((finalAnswers.filter((a) => a.pick === a.q.answer).length / finalAnswers.length) * 100) : 0;
      try {
        const k = recordsKey(profile.id);
        const prev = readRecords(JSON.parse(localStorage.getItem(k) ?? '{}'));
        localStorage.setItem(k, JSON.stringify(bumpRecords(prev, { examBest: rate })));
      } catch { /* 忽略 */ }
    }
  };

  // 总倒计时：到点自动交卷
  useEffect(() => {
    if (phase !== 'doing') return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setPhase((p) => { if (p === 'doing') submit(answersRef.current); return 'over'; });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const answersRef = useRef<{ q: ChallengeQ; pick: number }[]>([]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  const start = () => {
    const qs = sampleQuestions(subjectLessons, { count: TOTAL });
    if (qs.length === 0) return;
    submittedRef.current = false;
    setQueue(qs);
    setAnswers([]);
    setIdx(0); setPicked(null); setLeft(EXAM_SECONDS);
    setPhase('doing');
  };

  if (!profile) return null;

  const q = queue[idx];
  const correctCount = answers.filter((a) => a.pick === a.q.answer).length;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  const moduleStats = useMemo<ModuleStat[]>(() => {
    const byId = new Map(lessons.map((l) => [l.id, l]));
    const m = new Map<string, ModuleStat>();
    for (const a of answers) {
      const mod = byId.get(a.q.lessonId)?.curriculum?.module ?? '其他';
      const cur = m.get(mod) ?? { module: mod, correct: 0, total: 0 };
      cur.total += 1;
      if (a.pick === a.q.answer) cur.correct += 1;
      m.set(mod, cur);
    }
    return [...m.values()].sort((a, b) => a.correct / Math.max(1, a.total) - b.correct / Math.max(1, b.total));
  }, [answers, lessons]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-50 to-sky-50">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-10">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav(`/subject/${subject}`)} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回学科</button>
          <h1 className="text-2xl font-black text-slate-700">📝 {decodeURIComponent(subject)}·期末模拟卷</h1>
        </div>

        {phase === 'setup' && (
          <div className="rounded-3xl bg-white/90 p-6 shadow-md">
            <div className="mb-4 rounded-2xl bg-indigo-50 p-4 text-sm leading-relaxed text-indigo-900">
              📋 考试说明：从本学科 {subjectLessons.length} 节课中抽取最多 {TOTAL} 题（覆盖不同课标模块）· 限时 30 分钟 · 不限答题顺序感受（逐题作答，即时判分）· 到点自动交卷 · 答错的题自动进错题本。
            </div>
            <div className="mb-4 text-xs text-slate-400">本学科课程库：{subjectLessons.length} 节 · 涵盖 {[...new Set(subjectLessons.map((l) => l.curriculum?.module).filter(Boolean))].length} 个课标模块</div>
            <button onClick={start} disabled={subjectLessons.length === 0} className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 py-3.5 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50">
              {subjectLessons.length === 0 ? '本学科暂无课程' : '开始考试 ✍️'}
            </button>
          </div>
        )}

        {phase === 'doing' && q && (
          <div className="rounded-3xl bg-white/95 p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-500">第 {idx + 1}/{queue.length} 题</span>
              <span className={`rounded-xl px-3 py-1 font-black ${left < 300 ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-700'}`}>⏱ {mm}:{ss}</span>
            </div>
            <div className="mb-3 rounded-2xl bg-slate-50 p-3 text-[15px] font-semibold leading-relaxed text-slate-800">{q.q}</div>
            <div className="mb-2 text-right text-xs text-slate-400">{q.subjectArea} · 《{q.lessonTitle}》</div>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isAnswer = i === q.answer;
                const isPicked = picked === i;
                const show = picked !== null;
                return (
                  <button key={i} onClick={() => { if (picked !== null) return; setPicked(i); }} disabled={picked !== null}
                    className={`w-full rounded-xl border-2 px-4 py-2.5 text-left text-[15px] transition ${
                      show && isAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        : show && isPicked ? 'border-rose-300 bg-rose-50 text-rose-700'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}>
                    <span className="mr-2 font-black">{'ABCD'[i]}.</span>{opt}
                    {show && isAnswer && ' ✅'}
                    {show && isPicked && !isAnswer && ' ❌'}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">💡 {q.explain}</div>
            )}
            <div className="mt-4 flex justify-between">
              <span className="text-xs text-slate-400">已答对 {correctCount} 题</span>
              <button
                onClick={() => {
                  const next = [...answers, { q, pick: picked ?? -1 }];
                  setAnswers(next);
                  if (idx + 1 >= queue.length) submit(next);
                  else { setIdx(idx + 1); setPicked(null); }
                }}
                disabled={picked === null}
                className="rounded-xl bg-indigo-500 px-5 py-2 font-bold text-white transition hover:bg-indigo-600 disabled:opacity-40"
              >
                {idx + 1 >= queue.length ? '交卷 📤' : '下一题 →'}
              </button>
            </div>
          </div>
        )}

        {phase === 'over' && (
          <div className="rounded-3xl bg-white/95 p-6 shadow-lg">
            <div className="text-center">
              <div className="text-5xl">{correctCount === queue.length ? '🏆' : correctCount >= queue.length * 0.8 ? '🎉' : correctCount >= queue.length * 0.6 ? '👍' : '💪'}</div>
              <div className="mt-2 text-3xl font-black text-slate-800">{correctCount} / {queue.length}</div>
              <div className="text-sm text-slate-500">正确率 {queue.length ? Math.round((correctCount / queue.length) * 100) : 0}% · 用时 {Math.floor((EXAM_SECONDS - left) / 60)} 分钟</div>
            </div>
            {moduleStats.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-sm font-black text-slate-600">📊 模块诊断（从弱到强）</div>
                <div className="space-y-1.5">
                  {moduleStats.map((m) => {
                    const rate = Math.round((m.correct / Math.max(1, m.total)) * 100);
                    return (
                      <div key={m.module} className="flex items-center gap-2 text-xs">
                        <span className="w-36 shrink-0 truncate font-bold text-slate-600">{m.module}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${rate >= 80 ? 'bg-emerald-400' : rate >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${rate}%` }} />
                        </div>
                        <span className="w-16 text-right text-slate-400">{m.correct}/{m.total} · {rate}%</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-slate-400">红条模块建议回到学科页的「单元小测」针对性重练；答错的题已进错题本。</p>
              </div>
            )}
            <div className="mt-5 flex justify-center gap-2">
              <button onClick={start} className="rounded-2xl bg-indigo-500 px-6 py-2.5 font-bold text-white shadow transition hover:bg-indigo-600">再考一次</button>
              <button onClick={() => nav('/wrongbook')} className="rounded-2xl bg-rose-100 px-6 py-2.5 font-bold text-rose-600 transition hover:bg-rose-200">看错题本</button>
              <button onClick={() => nav(`/subject/${subject}`)} className="rounded-2xl bg-slate-100 px-6 py-2.5 font-bold text-slate-600 transition hover:bg-slate-200">回学科页</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
