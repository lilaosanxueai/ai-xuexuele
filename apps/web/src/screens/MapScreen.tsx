import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS, SUBJECT_STYLE } from '../components/subjectMeta.ts';
import { recommendNext } from '../runtime/recommend.ts';
import { calcStreak } from '../utils/streak.ts';
import { computeBadges } from '../runtime/achievements.ts';
import { computeWeeklyReport } from '../runtime/weeklyReport.ts';

/** 学科中心：以「学科 × 学段」组织全部课程（对标课表结构） */
export default function MapScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then(setLessons);
    void api.progress(profile.id).then(setProgress).catch(() => setProgress({ profileId: profile.id, lessons: {}, dailyUsage: {}, lessonDrafts: {}, lessonCodes: {} }));
  }, [profile, nav]);

  if (!profile) return null;

  const lessonDone = (id: string) => progress?.lessons[id]?.status === 'completed';
  const today = new Date().toISOString().slice(0, 10);
  const todayMin = progress?.dailyUsage[today] ?? 0;
  const rec = recommendNext(lessons, progress);
  const doneCount = lessons.filter((l) => lessonDone(l.id)).length;

  // 间隔重复（Duolingo 式）：完成于 1/3/7/14 天前的课进入"复习黄金期"
  const REVIEW_DAYS = [1, 3, 7, 14];
  const reviews = useMemo(() => {
    if (!progress) return [];
    const now = Date.now();
    const out: { lesson: Lesson; daysAgo: number }[] = [];
    for (const l of lessons) {
      const at = progress.lessons[l.id]?.completedAt;
      if (!at) continue;
      const days = Math.floor((now - new Date(at).getTime()) / 86_400_000);
      if (REVIEW_DAYS.includes(days)) out.push({ lesson: l, daysAgo: days });
    }
    return out.sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 4);
  }, [progress, lessons]);

  // 按学科聚合
  const byArea = new Map<string, Lesson[]>();
  for (const l of [...lessons].sort((a, b) => a.order - b.order)) {
    const key = l.subjectArea ?? '信息科技';
    if (!byArea.has(key)) byArea.set(key, []);
    byArea.get(key)!.push(l);
  }

  const badges = useMemo(() => computeBadges(lessons, progress), [lessons, progress]);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const report = useMemo(() => computeWeeklyReport(lessons, progress), [lessons, progress]);
  const maxBarMinutes = Math.max(10, ...report.dayBars.map((d) => d.minutes));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-10">
        {/* 学习概览 + 智能推荐 */}
        <div className="mb-6 rounded-3xl bg-white/80 p-5 shadow-md">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-orange-50 px-3 py-1 font-bold text-orange-500">🔥 连续学习 {calcStreak(progress?.dailyUsage ?? {})} 天</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">今日 {todayMin} 分钟</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">已学 {doneCount}/{lessons.length} 课</span>
            {(progress?.wrongBook?.length ?? 0) > 0 && (
              <button
                onClick={() => nav('/wrongbook')}
                className="rounded-full bg-rose-100 px-3 py-1 font-bold text-rose-600 shadow-sm transition hover:bg-rose-200"
              >
                📖 错题本 · {progress!.wrongBook!.length} 道待重练
              </button>
            )}
            <span className="ml-auto text-xs text-slate-400">覆盖 3-9 年级 + 高中衔接 · 对标课程标准</span>
          </div>
          {rec && (
            <button
              onClick={() => nav(`/tutor/${rec.lessonId}`)}
              className="flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="text-4xl">{rec.emoji}</div>
              <div className="min-w-0">
                <div className="text-xs opacity-80">🤖 智能推荐 · {rec.subjectArea}</div>
                <div className="truncate text-xl font-black">{rec.title}</div>
                <div className="mt-0.5 text-sm opacity-90">{rec.reason}</div>
              </div>
              <div className="ml-auto shrink-0 rounded-xl bg-white/20 px-4 py-2 font-bold">开始 →</div>
            </button>
          )}
        </div>

        {/* 复习黄金期（间隔重复：1/3/7/14 天前学过的课记忆将衰退，现在复习效果最好） */}
        {reviews.length > 0 && (
          <div className="mb-6 rounded-3xl bg-amber-50/90 p-5 shadow-sm ring-1 ring-amber-200">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg font-black text-amber-700">⏰ 复习黄金期</span>
              <span className="text-xs text-amber-600/80">学过 1/3/7/14 天的课记忆开始衰退，现在重温一遍效果最好</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {reviews.map(({ lesson: l, daysAgo }) => (
                <button
                  key={l.id}
                  onClick={() => nav(l.lab || l.starterCode ? `/lab/${l.id}` : `/tutor/${l.id}`)}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-2xl">{l.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-700">{l.title}</div>
                    <div className="text-xs text-amber-600">{daysAgo} 天前学过 · {l.subjectArea}</div>
                  </div>
                  <span className="shrink-0 rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">复习 →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 学情周报：本地数据算出「这周学得怎么样、哪里薄弱、下一步干什么」 */}
        <div className="mb-6 rounded-3xl bg-white/80 p-5 shadow-md">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-lg font-black text-slate-700">📊 本周学情</span>
            <span className="text-xs text-slate-400">过去 7 天 · 数据只在本机</span>
            <span className="ml-auto flex gap-2 text-xs">
              <span className="rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-600">共 {report.totalMinutes} 分钟</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-600">学习 {report.activeDays} 天</span>
              <span className="rounded-full bg-orange-50 px-3 py-1 font-bold text-orange-500">🔥 连续 {report.streak} 天</span>
            </span>
          </div>
          <p className="mb-3 text-sm text-slate-600">{report.headline}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {/* 每日时长柱状图 */}
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="mb-2 text-xs font-bold text-slate-500">每日学习时长（分钟）</div>
              <div className="flex h-24 items-end gap-1.5">
                {report.dayBars.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md ${d.minutes > 0 ? 'bg-gradient-to-t from-sky-400 to-indigo-400' : 'bg-slate-200'}`}
                      style={{ height: `${Math.max(4, (d.minutes / maxBarMinutes) * 80)}px` }}
                      title={`${d.label} ${d.minutes} 分钟`}
                    />
                    <span className="text-[10px] text-slate-400">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 学科正确率 + 薄弱课 */}
            <div className="space-y-2">
              {report.subjectStats.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {report.subjectStats.slice(0, 6).map((s) => (
                    <span
                      key={s.subject}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${s.accuracy !== null && s.accuracy >= 80 ? 'bg-emerald-100 text-emerald-700' : s.accuracy !== null && s.accuracy >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'}`}
                    >
                      {s.subject} {s.accuracy}%（{s.correct}/{s.total}）
                    </span>
                  ))}
                </div>
              )}
              {report.weakLessons.length > 0 ? (
                <div className="space-y-1.5">
                  {report.weakLessons.map((w) => (
                    <button
                      key={w.lessonId}
                      onClick={() => nav(`/tutor/${w.lessonId}`)}
                      className="flex w-full items-center gap-2 rounded-xl bg-rose-50 p-2 text-left transition hover:bg-rose-100"
                    >
                      <span className="text-xl">{w.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-700">{w.title}</span>
                        <span className="text-xs text-rose-500">{w.subject} · 正确率 {w.accuracy}%，建议重练</span>
                      </span>
                      <span className="shrink-0 rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">去补 →</span>
                    </button>
                  ))}
                </div>
              ) : (
                report.totalMinutes > 0 && (
                  <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    🎉 没有检测到薄弱课{report.lessonsDone.length > 0 && `，本周完成了 ${report.lessonsDone.length} 节课`}，可以挑战新的学科！
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* 成就徽章墙：全部由本地学习数据解锁 */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5 shadow-sm ring-1 ring-violet-200">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg font-black text-violet-700">🏅 我的成就</span>
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-bold text-violet-600">{unlockedCount}/{badges.length} 已解锁</span>
            <span className="text-xs text-violet-400">完成小目标攒徽章，学习像闯关</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`rounded-2xl p-3 text-center transition ${b.unlocked ? 'bg-white shadow-md ring-2 ring-amber-300' : 'bg-white/50'}`}
                title={b.desc}
              >
                <div className={`text-3xl ${b.unlocked ? '' : 'opacity-30 grayscale'}`}>{b.emoji}</div>
                <div className={`mt-1 truncate text-xs font-bold ${b.unlocked ? 'text-slate-700' : 'text-slate-400'}`}>{b.name}</div>
                {b.unlocked ? (
                  <div className="text-[10px] font-bold text-amber-500">已达成 ✓</div>
                ) : (
                  <div className="mt-1">
                    <div className="h-1 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.min(100, (b.cur / b.goal) * 100)}%` }} />
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-400">{b.cur}/{b.goal}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 学科网格 */}
        <h2 className="mb-3 text-xl font-black text-slate-700">📚 学科中心</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...byArea.entries()].map(([area, ls]) => {
            const meta = SUBJECTS[area] ?? { emoji: '📘', color: 'slate', desc: '' };
            const style = SUBJECT_STYLE[area] ?? SUBJECT_STYLE['信息科技'];
            const done = ls.filter((l) => lessonDone(l.id)).length;
            const bands = [...new Set(ls.map((l) => l.gradeBand ?? 'primary'))];
            const bandText = bands.map((b) => (b === 'primary' ? '小学' : b === 'junior' ? '初中' : '高中衔接')).join(' · ');
            return (
              <button
                key={area}
                onClick={() => nav(`/subject/${encodeURIComponent(area)}`)}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${style.card} p-5 text-left text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{meta.emoji}</div>
                  <div className="min-w-0">
                    <div className="text-xl font-black">{area}</div>
                    <div className="mt-0.5 truncate text-xs opacity-80">{meta.desc}</div>
                  </div>
                  <div className="ml-auto shrink-0 text-right">
                    <div className="text-2xl font-black">{done}<span className="text-sm opacity-70">/{ls.length}</span></div>
                    <div className="text-[10px] opacity-70">已学课程</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-white transition-all" style={{ width: `${ls.length ? (done / ls.length) * 100 : 0}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs opacity-80">
                  <span>{bandText}</span>
                  <span className="opacity-0 transition group-hover:opacity-100">进入学习 →</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* AI 答疑 + AI 实验室 + 口算 + 闪卡 + 挑战赛 */}
        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => nav('/ask')}
            className="rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 p-6 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">💬</div>
            <div className="mt-2 text-xl font-black">问 AI 老师</div>
            <div className="mt-1 text-xs opacity-90">作业不会做、知识点没听懂，什么学科都可以问</div>
          </button>
          <button
            onClick={() => nav('/playground')}
            className="rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 p-6 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">🧠</div>
            <div className="mt-2 text-xl font-black">AI 实验室 · 人工智能通识</div>
            <div className="mt-1 text-xs opacity-90">采集样本 → 训练识别模型 → 测试验证，理解「AI 是从数据学出来的」</div>
          </button>
          <button
            onClick={() => nav('/mentalmath')}
            className="rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 p-6 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">⚡</div>
            <div className="mt-2 text-xl font-black">口算训练器</div>
            <div className="mt-1 text-xs opacity-90">60 秒限时练习 · 五档年级难度 · 错题自动重练</div>
          </button>
          <button
            onClick={() => nav('/flashcards')}
            className="rounded-3xl bg-gradient-to-br from-violet-400 to-fuchsia-500 p-6 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">🃏</div>
            <div className="mt-2 text-xl font-black">闪卡复习</div>
            <div className="mt-1 text-xs opacity-90">知识点正反面 · 记忆盒自动排期 · 忘了明天再见</div>
          </button>
          <button
            onClick={() => nav('/challenge')}
            className="rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 p-6 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">⚡</div>
            <div className="mt-2 text-xl font-black">全学科挑战赛</div>
            <div className="mt-1 text-xs opacity-90">10 题 3 命 · 限时连击加分 · 错题自动进错题本</div>
          </button>
        </section>
      </main>
    </div>
  );
}
