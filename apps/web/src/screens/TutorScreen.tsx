import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson, Settings, WrongItem } from '@shared/types.ts';
import { DEFAULT_SETTINGS } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import AIBuddy, { type BuddyHandle } from '../components/AIBuddy.tsx';
import ExercisePanel from '../components/ExercisePanel.tsx';

/** 学科辅导场景的快捷提问（替代默认的编程向问题） */
const TUTOR_QUICK: Partial<Record<'explain' | 'hint' | 'review', string[]>> = {
  explain: ['这一课的重点是什么？', '这个知识点怎么用？'],
  hint: ['这道题我不会做', '给我一点提示'],
  review: ['我这课学得怎么样？'],
};

/**
 * AI 辅导页（重构后的课程学习主入口）：
 * 左栏导学卡（目标/知识点/教材） + 主区 AI 老师对话 + 随堂小练闭环 + 可选动手演示。
 * 没有任务点亮、没有通关庆祝——学习本身是主线。
 */
export default function TutorScreen() {
  const { id } = useParams();
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const buddyRef = useRef<BuddyHandle>(null);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    setQuizDone(false);
    void api.settings().then(setSettings).catch(() => {});
    void api.lessons().then((all) => {
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

  const getContext = () => ({
    screen: 'tutor' as const,
    lessonTitle: lesson.title,
    lessonGoals: lesson.goals,
    curriculumModule: lesson.curriculum?.module,
    curriculumPoints: lesson.curriculum?.points,
    textbook: lesson.textbook,
    grade: lesson.grade,
    subjectArea: lesson.subjectArea,
    lessonStory: lesson.story?.slice(0, 200),
    hintPrompts: lesson.tasks.find((t) => !t.optional)?.hintPrompts,
  });

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
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-4 lg:grid-cols-[320px_1fr]">
        {/* 左：本课导学 */}
        <aside className="space-y-3">
          <button
            onClick={() => buddyRef.current?.askInMode('explain', `请给我讲讲《${lesson.title}》这一课：我要学什么？最重要的知识点是什么？`)}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 p-4 text-left text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="text-base font-black">📖 让 AI 老师讲讲这一课</div>
            <div className="mt-0.5 text-xs opacity-85">听不懂就追问，随时可以换种讲法</div>
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
              <button
                onClick={() => setQuizOpen(true)}
                className={`w-full rounded-2xl p-4 text-left font-bold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${
                  quizDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-400 text-white'
                }`}
              >
                <div className="text-base">{quizDone ? '✅ 已完成随堂小练（可再练一遍）' : '📝 随堂小练'}</div>
                <div className="mt-0.5 text-xs font-normal opacity-80">{lesson.exercises.length} 道题 · 答错的题自动进错题本</div>
              </button>
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

        {/* 右：AI 老师对话（主区） */}
        <section className="min-h-[70vh] overflow-hidden rounded-2xl bg-white/80 shadow-md lg:h-[calc(100vh-7.5rem)]">
          <AIBuddy
            ref={buddyRef}
            profileId={profile.id}
            buddy={settings.buddy}
            intro={lesson.aiIntro || `你好！我是${settings.buddy.name}。今天我们一起学《${lesson.title}》。点左边的「让 AI 老师讲讲这一课」开始，有任何不懂的随时问我！`}
            defaultMode="explain"
            modes={['explain', 'hint', 'review']}
            quick={TUTOR_QUICK}
            subtitle="AI 学科辅导老师"
            getContext={getContext}
          />
        </section>
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
            // 随堂练完成 → AI 老师在对话里发复盘引导（关掉成绩单即可看到，不遮挡不打扰）
            const acc = Math.round((correct / lesson.exercises!.length) * 100);
            buddyRef.current?.sayLocal(
              acc === 100
                ? `🎉 ${correct} 题全对！最后想一想：这一课最重要的一点是什么？它让你想起了之前学过的什么？想检验自己可以点下面的「🎯 考考我」。`
                : `练习完成：答对 ${correct}/${lesson.exercises!.length}。答错的题已经收进错题本了。要不要把错的那题弄懂？跟我说「给我讲讲做错的题」，我们把它彻底搞明白。`,
            );
            void api.updateProgress(profile.id, {
              lessonId: lesson.id,
              completed: true,
              exercise: { correct, total: lesson.exercises!.length },
              // 辅导课的要点是导学与讨论（manual），随堂练通过即视为全部达成，家长端进度不再永远 0/N
              tasks: Object.fromEntries(lesson.tasks.filter((t) => !t.optional).map((t) => [t.id, true])),
              wrongAdds,
            }).catch(() => {});
          }}
        />
      )}
    </div>
  );
}
