import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Exercise, ProfileProgress, WrongItem } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import ExercisePanel from '../components/ExercisePanel.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';

/** 错题本：练习里错过的题自动收进来，重练全对就消灭它 */
export default function WrongBookScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [progress, setProgress] = useState<ProfileProgress | null>(null);
  const [practicing, setPracticing] = useState(false);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.progress(profile.id).then(setProgress).catch(() => setProgress(null));
  }, [profile, nav]);

  const wrongs = progress?.wrongBook ?? [];

  // 分学科分组
  const bySubject = useMemo(() => {
    const m = new Map<string, WrongItem[]>();
    for (const w of wrongs) {
      if (!m.has(w.subjectArea)) m.set(w.subjectArea, []);
      m.get(w.subjectArea)!.push(w);
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [wrongs]);

  // 重练题组：全部错题乱序
  const practiceSet = useMemo<Exercise[]>(() => {
    return [...wrongs]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)
      .map((w) => ({ q: w.q, options: w.options, answer: w.answer, explain: w.explain }));
  }, [practicing]); // eslint-disable-line react-hooks/exhaustive-deps

  const finishPractice = (correct: number, wrongPicks: { idx: number; pick: number }[]) => {
    if (!profile) return;
    const wrongIdxSet = new Set(wrongPicks.map((w) => w.idx));
    // 本轮答对 → 消灭；仍错 → 错次+1
    const clears: string[] = [];
    const adds: WrongItem[] = [];
    practiceSet.forEach((ex, i) => {
      // practiceSet 与 wrongs 同源乱序，用题目内容对回去
      const origin = [...wrongs].find((w) => w.q === ex.q && w.options.join('|') === ex.options.join('|'));
      if (!origin) return;
      if (!wrongIdxSet.has(i)) clears.push(origin.id);
      else adds.push({ ...origin, times: 1, wrongPicks: [wrongPicks.find((w) => w.idx === i)?.pick ?? 0] });
    });
    void api.updateProgress(profile.id, { wrongClears: clears, wrongAdds: adds })
      .then((p) => setProgress(p))
      .catch(() => {});
    setPracticing(false);
    if (wrongPicks.length === 0 && clears.length > 0) {
      setCelebrate(`🎉 太棒了！${clears.length} 道错题全部消灭！继续保持！`);
    }
  };

  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-10">
        {celebrate && (
          <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 p-4 text-center text-lg font-black text-white shadow-lg">
            {celebrate}
            <button onClick={() => setCelebrate(null)} className="ml-3 rounded-lg bg-white/25 px-3 py-1 text-sm hover:bg-white/40">知道了</button>
          </div>
        )}
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-700">📖 错题本</h1>
          {wrongs.length > 0 ? (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">还有 {wrongs.length} 道等你消灭</span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">全部消灭！✨</span>
          )}
          {(progress?.wrongCleared ?? 0) > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-600">累计消灭 {progress?.wrongCleared} 道 🏅</span>
          )}
        </div>

        {wrongs.length === 0 ? (
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-md">
            <div className="text-6xl">🌟</div>
            <p className="mt-4 text-lg font-bold text-slate-600">
              {progress?.wrongCleared ? '错题都消灭光啦，太厉害了！' : '还没有错题——去上几课、做做随堂小练吧！'}
            </p>
            <button onClick={() => nav('/map')} className="mt-5 rounded-xl bg-sky-500 px-6 py-2.5 font-bold text-white hover:bg-sky-600">回学科中心 →</button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setPracticing(true)}
              className="mb-5 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              🎯 开始消灭错题（{Math.min(wrongs.length, 20)} 道 · 全对即消灭）
            </button>

            {bySubject.map(([area, items]) => {
              const meta = SUBJECTS[area] ?? { emoji: '📘', color: 'slate', desc: '' };
              return (
                <section key={area} className="mb-5">
                  <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-slate-600">
                    <span className="text-2xl">{meta.emoji}</span>{area}
                    <span className="text-sm font-normal text-slate-400">{items.length} 道</span>
                  </h2>
                  <div className="space-y-2">
                    {items.map((w) => (
                      <div key={w.id} className="rounded-2xl bg-white/85 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-xs font-black ${
                            w.times >= 3 ? 'bg-rose-500 text-white' : w.times === 2 ? 'bg-orange-400 text-white' : 'bg-slate-200 text-slate-600'
                          }`} title="错过几次">
                            错 {w.times} 次
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-800">{w.q}</div>
                            <div className="mt-1 text-xs text-slate-400">
                              来自《{w.lessonTitle}》· {new Date(w.lastWrongAt).toLocaleDateString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>

      {practicing && practiceSet.length > 0 && (
        <ExercisePanel
          title="错题重练"
          exercises={practiceSet}
          onClose={() => setPracticing(false)}
          onDone={finishPractice}
        />
      )}
    </div>
  );
}
