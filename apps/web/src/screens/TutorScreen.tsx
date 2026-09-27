import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson, WrongItem } from '@shared/types.ts';
import MindmapView from '../components/MindmapView.tsx';
import LessonNoteEditor from '../components/LessonNoteEditor.tsx';
import { findCrossLinks } from '../runtime/crossLink.ts';
import { lessonNeighbors, lessonRoute } from '../runtime/lessonNav.ts';
import type { Lesson as LessonType } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import ExercisePanel from '../components/ExercisePanel.tsx';
import TeachPanel from '../components/TeachPanel.tsx';
import LessonReport from '../components/LessonReport.tsx';

/**
 * 课程阅读页（现代自学形态）：
 * 左栏导学卡（目标/知识点/引入） + 主区课本讲解正文 + 思维导图 + 笔记 + 跨学科链接。
 * 学习流程内不嵌 AI 对话；有疑问走独立「问老师」页（/ask）。
 */
export default function TutorScreen() {
  const { id } = useParams();
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [allLessons, setAllLessons] = useState<LessonType[]>([]);
  /** 课堂报告（学而思式课后反馈卡） */
  const [report, setReport] = useState<{ correct: number; total: number; wrongCount: number } | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    setQuizDone(false);
    void api.lessons().then((all) => {
      setAllLessons(all);
      const l = all.find((x) => x.id === id) ?? null;
      setLesson(l);
      if (!l) nav('/map');
    }).catch(() => nav('/map'));
  }, [id, profile, nav]);

  if (!profile || !lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">正在打开这一课…</div>
    );
  }

  const bandText = lesson.gradeBand === 'senior' ? '高中' : lesson.gradeBand === 'junior' ? '初中' : '小学';
  const hasPractice = (lesson.toolbox?.length ?? 0) > 0 || !!lesson.starterCode;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      {/* 课题条 */}
      <div className="border-b bg-white/80 px-6 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <button onClick={() => nav(`/subject/${encodeURIComponent(lesson.subjectArea ?? '信息科技')}`)} className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200">
            ← 返回学科
          </button>
          <span className="text-2xl">{lesson.emoji}</span>
          <h1 className="text-lg font-black text-slate-800">{lesson.title}</h1>
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-700">
            {lesson.subjectArea ?? '信息科技'}
          </span>
          {lesson.grade != null && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">{lesson.grade} 年级</span>}
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">{bandText}</span>
          {lesson.textbook && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">📚 {lesson.textbook}</span>}
          {/* 连续学习导航：同学科按 order 排序，学完直接翻下一课 */}
          {(() => {
            const nb = lessonNeighbors(allLessons, lesson.id);
            if (nb.total === 0) return null;
            return (
              <span className="ml-auto flex items-center gap-1.5">
                <span className="hidden text-xs font-bold text-slate-400 sm:inline">{nb.index}/{nb.total} 课</span>
                {nb.prev && (
                  <button onClick={() => nav(lessonRoute(nb.prev!))} className="max-w-36 truncate rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200" title={`上一课：${nb.prev.title}`}>
                    ← {nb.prev.title}
                  </button>
                )}
                {nb.next && (
                  <button onClick={() => nav(lessonRoute(nb.next!))} className="max-w-36 truncate rounded-xl bg-sky-500 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-sky-600" title={`下一课：${nb.next.title}`}>
                    {nb.next.title} →
                  </button>
                )}
              </span>
            );
          })()}
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-4 lg:grid-cols-[320px_1fr]">
        {/* 左：本课导学 */}
        <aside className="space-y-3">
          <button
            onClick={() => nav('/ask')}
            className="w-full rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-sky-300"
          >
            <div className="text-base font-black text-slate-700">💬 有疑问？问老师</div>
            <div className="mt-0.5 text-xs text-slate-500">先读右边讲解正文，卡住了再去答疑页问</div>
          </button>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-black text-slate-700">🎯 学习目标</div>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {lesson.goals.map((g) => (
                <li key={g} className="flex gap-1.5">
                  <span className="text-emerald-500">✓</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {lesson.curriculum?.points?.length ? (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm font-black text-slate-700">📗 课本知识点</div>
              <div className="flex flex-wrap gap-1.5">
                {lesson.curriculum.points.map((p) => (
                  <span key={p} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{p}</span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                {lesson.curriculum.module && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 font-semibold text-sky-600">课标 · {lesson.curriculum.module}</span>
                )}
                {lesson.curriculum.stage && <span>{lesson.curriculum.stage}</span>}
              </div>
            </div>
          ) : null}

          {lesson.story && (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm font-black text-slate-700">📝 课前引入</div>
              <p className="text-sm leading-relaxed text-slate-600">{lesson.story}</p>
            </div>
          )}

          <div className="space-y-2">
            {lesson.exercises?.length ? (
              <>
                <button
                  onClick={() => setQuizOpen(true)}
                  className={`w-full rounded-2xl p-4 text-left font-bold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${
                    quizDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-400 text-white'
                  }`}
                >
                  <div className="text-base">{quizDone ? '✅ 已完成随堂小练（可再练一遍）' : '📝 随堂小练'}</div>
                  <div className="mt-0.5 text-xs font-normal opacity-80">{lesson.exercises.length} 道题 · 答错的题自动进错题本</div>
                </button>
                {quizDone && report && (
                  <button
                    onClick={() => setReportOpen(true)}
                    className="w-full rounded-2xl bg-white p-3 text-left font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:ring-sky-300"
                  >
                    📊 查看课堂报告
                  </button>
                )}
              </>
            ) : null}
            {hasPractice && (
              <button
                onClick={() => nav(`/practice/${lesson.id}`)}
                className="w-full rounded-2xl bg-violet-500 p-4 text-left text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="text-base font-bold">▶ 动手演示</div>
                <div className="mt-0.5 text-xs opacity-85">{lesson.starterCode ? '运行本课的 Python 演示程序' : '用积木把这一课搭出来'}</div>
              </button>
            )}
          </div>
        </aside>

        {/* 右：课本讲解正文是主区（现代自学阅读形态） */}
      {lesson.teach ? (
        <section className="min-h-[70vh] overflow-y-auto rounded-2xl bg-slate-50 p-4 shadow-md lg:h-[calc(100vh-7.5rem)]">
          {/* 开场一问（李永乐式钩子） */}
          {lesson.story && (
            <div className="mb-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 p-5 ring-1 ring-indigo-100">
              <div className="mb-1.5 text-sm font-black text-indigo-700">🎬 开场一问</div>
              <p className="text-[15px] leading-[1.9] text-indigo-900">{lesson.story}</p>
            </div>
          )}
          <TeachPanel
            teach={lesson.teach}
            onFinish={lesson.exercises?.length ? () => setQuizOpen(true) : undefined}
          />
          {lesson.teach && <MindmapView lesson={lesson} />}
          {profile && (
            <div className="mt-4">
              <LessonNoteEditor lessonId={lesson.id} profileId={profile.id} />
            </div>
          )}
          {(() => {
            const links = findCrossLinks(lesson, allLessons, 3);
            if (links.length === 0) return null;
            return (
              <div className="mt-4 rounded-2xl bg-cyan-50/80 p-4 ring-1 ring-cyan-200">
                <div className="mb-2 text-sm font-black text-cyan-700">🔗 跨学科链接</div>
                <p className="mb-2 text-xs text-cyan-500">这个知识点在其他学科中也有——知识是连通的</p>
                <div className="flex flex-wrap gap-1.5">
                  {links.map((link) => (
                    <button key={link.lessonId}
                      onClick={() => nav(`/tutor/${link.lessonId}`)}
                      className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
                    >
                      <span>{link.emoji}</span>
                      <span className="max-w-48 truncate">{link.lessonTitle}</span>
                      <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[9px] text-cyan-600">{link.subject}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>
      ) : (
        <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4 rounded-2xl bg-white/80 p-8 text-center shadow-md lg:h-[calc(100vh-7.5rem)]">
          <div className="text-5xl">{lesson.emoji}</div>
          <div className="text-xl font-black text-slate-700">{lesson.title}</div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            这是一节动手课：看左边的学习目标，点「▶ 动手演示」开始练习；有疑问去「问老师」页。
          </p>
        </section>
      )}
      </main>

      {/* 随堂小练：做完即记录完成（无庆祝），错题自动进错题本 */}
      {quizOpen && lesson.exercises && profile && (
        <ExercisePanel
          title={lesson.title}
          exercises={lesson.exercises}
          onClose={() => setQuizOpen(false)}
          onDone={(correct, wrongs) => {
            const wrongAdds: WrongItem[] = wrongs.map(({ idx, pick }) => {
              const ex = lesson.exercises![idx];
              return {
                id: `${lesson.id}#${idx}`,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                subjectArea: lesson.subjectArea ?? '数学',
                q: ex.q, options: ex.options, answer: ex.answer, explain: ex.explain,
                wrongPicks: [pick], times: 1, lastWrongAt: new Date().toISOString(),
              };
            });
            setQuizDone(true);
            setReport({ correct, total: lesson.exercises!.length, wrongCount: wrongs.length });
            setReportOpen(true);
            void api.updateProgress(profile.id, {
              lessonId: lesson.id,
              minutesDelta: 5,
              completed: true,
              exercise: { correct, total: lesson.exercises!.length },
              // 辅导课的要点是导学与讨论（manual），随堂练通过即视为全部达成，家长端进度不再永远 0/N
              tasks: Object.fromEntries(lesson.tasks.filter((t) => !t.optional).map((t) => [t.id, true])),
              wrongAdds,
            }).catch(() => {});
          }}
        />
      )}
      {/* 课堂报告（学而思式课后反馈卡） */}
      {report && reportOpen && (
        <LessonReport
          lesson={lesson}
          correct={report.correct}
          total={report.total}
          wrongCount={report.wrongCount}
          onClose={() => setReportOpen(false)}
          onGoWrongbook={() => nav('/wrongbook')}
        />
      )}
    </div>
  );
}
