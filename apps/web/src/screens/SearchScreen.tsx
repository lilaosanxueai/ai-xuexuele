import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';
import { buildIndex, hotKeywords, searchLessons } from '../runtime/search.ts';

/** 全科知识搜索：知识点/讲解定义句/章节 一框搜全站 */
export default function SearchScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('全部');

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then(setLessons);
    void api.progress(profile.id).then(setProgress).catch(() => {});
  }, [profile, nav]);

  const index = useMemo(() => buildIndex(lessons, progress), [lessons, progress]);
  const results = useMemo(() => searchLessons(index, q, { subject }), [index, q, subject]);
  const subjects = useMemo(() => ['全部', ...new Set(lessons.map((l) => l.subjectArea ?? '信息科技'))], [lessons]);
  const hots = useMemo(() => hotKeywords(lessons), [lessons]);
  const labIds = useMemo(() => new Set(lessons.filter((l) => l.lab || l.starterCode).map((l) => l.id)), [lessons]);
  const bandText = (b: string) => (b === 'primary' ? '小学' : b === 'junior' ? '初中' : '高中');
  const historyKey = profile ? `island-search-hist-${profile.id}` : '';

  const saveHistory = (term: string) => {
    if (!historyKey || !term.trim() || term.trim().length < 2) return;
    try {
      const cur = JSON.parse(localStorage.getItem(historyKey) ?? '[]') as string[];
      const next = [term.trim(), ...cur.filter((x) => x !== term.trim())].slice(0, 8);
      localStorage.setItem(historyKey, JSON.stringify(next));
    } catch { /* ignore */ }
  };
  const searchHistory = (() => {
    try { return JSON.parse(localStorage.getItem(historyKey) ?? '[]') as string[]; } catch { return []; }
  })();

  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">🔍 知识搜索</h1>
          <span className="text-xs text-slate-400">知识点 · 定义句 · 章节 · {index.length.toLocaleString()} 条 · 只在本机</span>
        </div>

        {/* 搜索框 */}
        <div className="mb-3 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="卡在哪个知识点？搜「浮力」「定语从句」「光合作用」…"
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-[15px] font-semibold text-slate-800 outline-none transition focus:border-sky-400"
          />
          {q && (
            <button onClick={() => setQ('')} className="shrink-0 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-500 transition hover:bg-slate-200">清空</button>
          )}
        </div>

        {/* 搜索历史 */}
        {!q && searchHistory.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">🕐 最近搜索</span>
            {searchHistory.map((h) => (
              <button key={h} onClick={() => setQ(h)} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-sky-50 hover:text-sky-600">{h}</button>
            ))}
            <button onClick={() => { try { localStorage.removeItem(historyKey); } catch { /* ignore */ } setQ(''); }} className="text-[10px] text-slate-300 hover:text-rose-400">清除</button>
          </div>
        )}

        {/* 学科过滤 */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {subjects.map((s) => (
            <button key={s} onClick={() => setSubject(s)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${subject === s ? 'bg-sky-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s === '全部' ? '📚 全部' : `${SUBJECTS[s]?.emoji ?? '📘'} ${s}`}
            </button>
          ))}
        </div>

        {/* 无搜索词：热词推荐 */}
        {!q && (
          <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
            <div className="mb-2 text-sm font-bold text-slate-500">试试搜这些 👇</div>
            <div className="flex flex-wrap gap-2">
              {hots.map((k) => (
                <button key={k} onClick={() => setQ(k)} className="rounded-full bg-sky-50 px-4 py-1.5 text-sm font-bold text-sky-600 transition hover:bg-sky-100">{k}</button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">搜索范围是全部课程的知识点、课本讲解定义句和章节标题——查到后一键跳进对应课程学习。</p>
          </div>
        )}

        {/* 搜索结果 */}
        {q && (
          results.length === 0 ? (
            <div className="rounded-3xl bg-white/80 p-8 text-center shadow-sm">
              <div className="text-4xl">🤔</div>
              <div className="mt-2 font-bold text-slate-600">没有找到「{q}」</div>
              <div className="mt-1 text-xs text-slate-400">试试更短的关键词，或换一个说法（如「光合」→「光合作用」）</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-slate-400">找到 {results.length} 节相关课程</div>
              {results.map((r) => (
                <button
                  key={r.lessonId}
                  onClick={() => nav(labIds.has(r.lessonId) ? `/lab/${r.lessonId}` : `/tutor/${r.lessonId}`)}
                  className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{r.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-black text-slate-700">{r.lessonTitle}</div>
                      <div className="text-xs text-slate-400">{r.subject} · {bandText(r.band)}</div>
                    </div>
                    <span className="shrink-0 rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-bold text-white">去学习 →</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {r.snippets.map((s, i) => (
                      <div key={i} className="truncate rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">{s}</div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
