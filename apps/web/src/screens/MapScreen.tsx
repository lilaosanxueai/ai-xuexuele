import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS, SUBJECT_STYLE } from '../components/subjectMeta.ts';
import { recommendNext } from '../runtime/recommend.ts';
import { calcStreak } from '../utils/streak.ts';

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

        {/* AI 答疑 + AI 实验室 + 口算 */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
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
        </section>
      </main>
    </div>
  );
}
