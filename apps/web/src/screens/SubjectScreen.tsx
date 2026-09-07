import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS, SUBJECT_STYLE } from '../components/subjectMeta.ts';

/** 学科页：该学科按学段分组的全部课程，含课标标注 */
const BAND_ORDER = ['primary', 'junior', 'senior'] as const;
const BAND_LABEL: Record<string, string> = { primary: '小学', junior: '初中', senior: '高中衔接' };

export default function SubjectScreen() {
  const nav = useNavigate();
  const { area = '' } = useParams();
  const subject = decodeURIComponent(area);
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then((all) => setLessons(all.filter((l) => (l.subjectArea ?? '信息科技') === subject)));
    void api.progress(profile.id).then(setProgress).catch(() => {});
  }, [profile, subject, nav]);

  if (!profile) return null;

  const meta = SUBJECTS[subject] ?? { emoji: '📘', color: 'slate', desc: '' };
  const style = SUBJECT_STYLE[subject] ?? SUBJECT_STYLE['信息科技'];
  const lessonDone = (id: string) => progress?.lessons[id]?.status === 'completed';
  const mine = [...lessons].sort((a, b) => a.order - b.order);
  const done = mine.filter((l) => lessonDone(l.id)).length;

  const bands = BAND_ORDER
    .map((b) => ({ band: b, list: mine.filter((l) => (l.gradeBand ?? 'primary') === b) }))
    .filter((g) => g.list.length > 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-10">
        <div className={`mb-6 flex items-center gap-4 rounded-3xl bg-gradient-to-r ${style.card} p-6 text-white shadow-lg`}>
          <button onClick={() => nav('/map')} className="rounded-xl bg-white/20 px-3 py-1.5 text-sm font-bold hover:bg-white/30">← 学科中心</button>
          <div className="text-5xl">{meta.emoji}</div>
          <div className="min-w-0">
            <h1 className="text-3xl font-black">{subject}</h1>
            <p className="mt-0.5 text-sm opacity-85">{meta.desc}</p>
          </div>
          <div className="ml-auto shrink-0 text-right">
            <div className="text-3xl font-black">{done}<span className="text-base opacity-70">/{mine.length}</span></div>
            <div className="text-xs opacity-70">已完成</div>
          </div>
        </div>

        {bands.map(({ band, list }) => (
          <section key={band} className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-black text-slate-700">
              {BAND_LABEL[band]}
              <span className="text-xs font-normal text-slate-400">{list.length} 课 · {subject}课程标准</span>
            </h2>
            <div className="space-y-2">
              {list.map((l) => {
                const isDone = lessonDone(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => nav(`/lesson/${l.id}`)}
                    className={`flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${isDone ? `ring-2 ${style.ring}` : ''}`}
                  >
                    <div className="text-3xl">{l.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-bold text-slate-800">{l.title}</span>
                        {l.codeLesson && <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-white">Python</span>}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-slate-400">
                        {l.subject ? `${l.subject.emoji} ${l.subject.name}` : l.curriculum ? `📗 ${l.curriculum.module}` : ''}
                        {l.curriculum ? ` · ${l.curriculum.points.slice(0, 2).join(' / ')}` : ''}
                      </div>
                    </div>
                    <span className="shrink-0 text-xl">{isDone ? '✅' : '▶'}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {mine.length === 0 && (
          <div className="rounded-3xl bg-white/70 p-10 text-center text-slate-400">该学科暂无课程</div>
        )}
      </main>
    </div>
  );
}
