import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Exercise, ProfileProgress, WrongItem } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import ExercisePanel from '../components/ExercisePanel.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';
import { bumpCounter } from '../runtime/dailyQuests.ts';

/** 打印样式：只打印练习卷浮层 */
const PRINT_CSS = `@media print { body * { visibility: hidden !important; } #print-sheet, #print-sheet * { visibility: visible !important; } #print-sheet { position: absolute !important; left: 0; top: 0; width: 100%; background: #fff; } }`;

/** 每日任务计数器：当天消灭的错题数 */
const counterKey = (pid: string) => `island-daily-${pid}`;
function bumpDaily(pid: string, key: 'wrongsCleared' | 'flashcards' | 'challenges') {
  try {
    const next = bumpCounter(JSON.parse(localStorage.getItem(counterKey(pid)) ?? '{}'), key);
    localStorage.setItem(counterKey(pid), JSON.stringify(next));
  } catch { /* 本地存储异常不影响主流程 */ }
}

/** 错题本：练习里错过的题自动收进来，重练全对就移出 */
export default function WrongBookScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [progress, setProgress] = useState<ProfileProgress | null>(null);
  const [practicing, setPracticing] = useState(false);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [labIds, setLabIds] = useState<Set<string>>(new Set());
  /** 举一反三（作业帮式）：错题关联同模块课程，推荐变式练习 */
  const [moduleLessons, setModuleLessons] = useState<Map<string, { id: string; title: string; emoji: string; subjectArea: string }[]>>(new Map());

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.progress(profile.id).then(setProgress).catch(() => setProgress(null));
    // 实验课跳 /lab、辅导课跳 /tutor——「看讲解」直达对应课程；同时建 课标模块→课程 索引
    void api.lessons().then((ls) => {
      setLabIds(new Set(ls.filter((l) => l.lab || l.starterCode).map((l) => l.id)));
      const m = new Map<string, { id: string; title: string; emoji: string; subjectArea: string }[]>();
      for (const l of ls) {
        const mod = l.curriculum?.module;
        if (!mod) continue;
        if (!m.has(mod)) m.set(mod, []);
        m.get(mod)!.push({ id: l.id, title: l.title, emoji: l.emoji, subjectArea: l.subjectArea ?? '' });
      }
      setModuleLessons(m);
    }).catch(() => {});
  }, [profile, nav]);

  const wrongs = progress?.wrongBook ?? [];
  const [printing, setPrinting] = useState(false);

  const doPrint = () => {
    setPrinting(true);
    setTimeout(() => { window.print(); setPrinting(false); }, 120);
  };

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
    if (clears.length > 0) bumpDaily(profile.id, 'wrongsCleared');
    setPracticing(false);
    if (wrongPicks.length === 0 && clears.length > 0) {
      setCelebrate(`🎉 太棒了！${clears.length} 道错题全部练对，已移出错题本！`);
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
            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">还有 {wrongs.length} 道待重练</span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">错题清空啦 ✨</span>
          )}
          {(progress?.wrongCleared ?? 0) > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-600">累计练对 {progress?.wrongCleared} 道</span>
          )}
          {wrongs.length > 0 && (
            <button onClick={doPrint} className="ml-auto rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">🖨 打印练习卷</button>
          )}
        </div>

        {/* 打印练习卷：纸质重练（家长可打印），答案单独一页 */}
        {printing && (
          <div id="print-sheet" className="fixed inset-0 z-[80] overflow-y-auto bg-white p-8 text-slate-900">
            <style>{PRINT_CSS}</style>
            <div className="mx-auto max-w-2xl">
              <h1 className="text-center text-2xl font-black">错题重练卷</h1>
              <p className="mt-1 text-center text-sm text-slate-500">共 {wrongs.length} 题 · 来自 AI学学乐错题本 · {new Date().toLocaleDateString('zh-CN')}</p>
              <p className="mt-1 text-center text-xs text-slate-400">姓名：____________　日期：____________　得分：______</p>
              <div className="mt-6 space-y-5">
                {wrongs.map((w, i) => (
                  <div key={w.id} className="break-inside-avoid">
                    <div className="font-semibold">{i + 1}.（{w.subjectArea}）{w.q}</div>
                    <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      {w.options.map((opt, oi) => (<div key={oi}>{'ABCD'[oi]}. {opt}</div>))}
                    </div>
                    <div className="mt-1 text-sm">答：（　　　　）</div>
                  </div>
                ))}
              </div>
              <div className="mt-10 break-before-page border-t border-slate-300 pt-6">
                <h2 className="text-lg font-black">参考答案</h2>
                <ol className="mt-2 grid grid-cols-2 gap-1 text-sm">
                  {wrongs.map((w, i) => (
                    <li key={w.id}>{i + 1}. {'ABCD'[w.answer]}　{w.explain.slice(0, 40)}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {wrongs.length === 0 ? (
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-md">
            <div className="text-6xl">🌟</div>
            <p className="mt-4 text-lg font-bold text-slate-600">
              {progress?.wrongCleared ? '错题都练对啦，太厉害了！' : '还没有错题——去上几课、做做随堂小练吧！'}
            </p>
            <button onClick={() => nav('/map')} className="mt-5 rounded-xl bg-sky-500 px-6 py-2.5 font-bold text-white hover:bg-sky-600">回学科中心 →</button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setPracticing(true)}
              className="mb-5 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              🎯 开始重练错题（{Math.min(wrongs.length, 20)} 道 · 全对即移出）
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
                        {items.map((w) => {
                          // 举一反三：找同模块的其他课程（排除本题来源课）
                          const siblings = (() => {
                            for (const [mod, ls] of moduleLessons) {
                              if (ls.some((x) => x.id === w.lessonId)) {
                                return ls.filter((x) => x.id !== w.lessonId).slice(0, 2);
                              }
                            }
                            return [];
                          })();
                          return (
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
                          <button
                            onClick={() => nav(labIds.has(w.lessonId) ? `/lab/${w.lessonId}` : `/tutor/${w.lessonId}`)}
                            className="mt-0.5 shrink-0 rounded-xl bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                            title="回到这一课的课本讲解"
                          >
                            📖 看讲解
                          </button>
                        </div>
                        {siblings.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2">
                            <span className="text-[11px] font-bold text-slate-400">🔁 举一反三（同考点变式）：</span>
                            {siblings.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => nav(labIds.has(s.id) ? `/lab/${s.id}` : `/tutor/${s.id}`)}
                                className="rounded-lg bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700 transition hover:bg-violet-100"
                              >
                                {s.emoji} {s.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                          );
                        })}
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
