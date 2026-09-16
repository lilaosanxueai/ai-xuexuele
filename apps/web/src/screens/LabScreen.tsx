import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { LabParam, Lesson, Settings, WrongItem } from '@shared/types.ts';
import { DEFAULT_SETTINGS } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import Stage from '../components/Stage.tsx';
import AIBuddy, { type BuddyHandle } from '../components/AIBuddy.tsx';
import ExercisePanel from '../components/ExercisePanel.tsx';
import { StageState, setRunSpeed } from '../runtime/stageState.ts';
import { parsePy, PyRunner } from '../runtime/pyinterp.ts';
import { pyStageApi } from '../runtime/pyBridge.ts';

/**
 * 互动实验室（理科五科学习新主页）：内容动态化 + 动态互动。
 * 左侧参数滑块 → 演示代码注入参数 → 舞台瞬时重绘；探索问题引导孩子做"实验"。
 * 无 lab 字段的代码课自动提取顶层「带注释的赋值」为滑块。
 */

/** 实验室场景的快捷提问（替代默认的编程向问题） */
const LAB_QUICK: Partial<Record<'explain' | 'hint', string[]>> = {
  explain: ['我拖动参数后看到了变化，为什么？', '这个知识点在课本里怎么讲？'],
  hint: ['我不知道该观察什么', '给我一点探索提示'],
};

/** 顶层数值赋值 + 中文注释 → 自动参数（如 `v0 = 0 # 初速度`） */
const AUTO_PARAM_RE = /^([A-Za-z_]\w*)\s*=\s*(-?\d+(?:\.\d+)?)\s*#\s*(.+)$/;

function niceStep(range: number): number {
  if (range >= 200) return 1;
  if (range >= 40) return 0.5;
  if (range >= 8) return 0.2;
  return 0.1;
}

/** 从演示代码自动提取可调参数（注释约定），生成滑块定义。循环内自增的累加器（c = c + 1）不算参数 */
function autoParams(code: string): LabParam[] {
  const out: LabParam[] = [];
  const seen = new Set<string>();
  for (const line of code.split('\n')) {
    const m = line.match(AUTO_PARAM_RE);
    if (!m || seen.has(m[1])) continue;
    // 自增变量是计数器/累加器（如 stay_win = stay_win + 1），拖它没有意义
    if (new RegExp(`\\b${m[1]}\\s*=\\s*${m[1]}\\s*\\+`).test(code)) continue;
    seen.add(m[1]);
    const v = Number(m[2]);
    const label = m[3].trim().slice(0, 12);
    let min: number, max: number;
    if (v === 0) { min = -10; max = 10; }
    else if (v > 0) { min = 0; max = Math.max(v * 3, v + 10); }
    else { min = Math.min(v * 3, v - 10); max = -v * 2; }
    out.push({ name: m[1], label, min: Math.round(min * 100) / 100, max: Math.round(max * 100) / 100, step: niceStep(max - min), value: v });
    if (out.length >= 6) break;
  }
  return out;
}

/** 把顶层 `name = 原值` 行替换为滑块当前值（保留行内注释） */
function injectParams(code: string, values: Record<string, number>): string {
  let out = code;
  for (const [name, v] of Object.entries(values)) {
    const re = new RegExp(`^(\\s*)(${name})\\s*=\\s*[-+\\d.]+`, 'm');
    if (re.test(out)) out = out.replace(re, `$1$2 = ${v}`);
  }
  return out;
}

export default function LabScreen() {
  const { id } = useParams();
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [values, setValues] = useState<Record<string, number>>({});
  const [slowRunning, setSlowRunning] = useState(false);
  const [buddyOpen, setBuddyOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [explored, setExplored] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const stageRef = useRef(new StageState());
  const runnerRef = useRef<PyRunner | null>(null);
  const buddyRef = useRef<BuddyHandle>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 参数定义：lab.params 优先，否则自动提取
  const baseCode = useMemo(() => lesson?.lab?.code ?? lesson?.starterCode ?? '', [lesson]);
  const params: LabParam[] = useMemo(
    () => (lesson?.lab?.params?.length ? lesson.lab.params : autoParams(baseCode)),
    [lesson, baseCode],
  );

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    setQuizDone(false);
    setExplored({});
    void api.settings().then(setSettings).catch(() => {});
    void api.lessons().then((all) => {
      const l = all.find((x) => x.id === id) ?? null;
      if (!l || !(l.lab || l.starterCode)) { nav(l ? `/tutor/${id}` : '/map'); return; }
      setLesson(l);
      setValues(Object.fromEntries((l.lab?.params ?? autoParams(l.lab?.code ?? l.starterCode ?? '')).map((p) => [p.name, p.value])));
    }).catch(() => nav('/map'));
    return () => { runnerRef.current?.stop(); setRunSpeed('normal'); };
  }, [id, profile, nav]);

  /** 跑一遍演示：清舞台 → 注入参数 → 解析运行。speed='instant' 用于滑块实时重绘 */
  const runLab = useCallback((code: string, vals: Record<string, number>, speed: 'instant' | 'normal') => {
    const l = lesson;
    if (!l) return;
    runnerRef.current?.stop();
    stageRef.current.reset(l.actor, l.targets);
    setRunSpeed(speed);
    const { program, error } = parsePy(injectParams(code, vals));
    if (error || !program) {
      setToast(`演示代码有问题：${error?.message ?? '无法解析'}`);
      return;
    }
    const runner = new PyRunner(program, pyStageApi(stageRef.current));
    runnerRef.current = runner;
    if (speed === 'normal') setSlowRunning(true);
    void runner.run(() => {
      setSlowRunning(false);
      setRunSpeed('instant');
      if (runner.lastError) setToast(`演示中断：${runner.lastError}`);
    });
  }, [lesson]);

  // 课程与参数就绪后先跑一遍（瞬时）
  useEffect(() => {
    if (!lesson || !baseCode || params.length === 0) return;
    runLab(baseCode, values, 'instant');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, baseCode]);

  /** 滑块变动：防抖 80ms 瞬时重绘 */
  const onParamChange = (name: string, v: number) => {
    setValues((prev) => {
      const next = { ...prev, [name]: v };
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runLab(baseCode, next, 'instant'), 80);
      return next;
    });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!profile || !lesson) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">正在搭建实验室…</div>;
  }

  const exploreList = lesson.lab?.explore ?? [];
  const bandText = lesson.gradeBand === 'senior' ? '高中' : lesson.gradeBand === 'junior' ? '初中' : '小学';

  const getContext = () => ({
    screen: 'lab' as const,
    lessonTitle: lesson.title,
    lessonGoals: lesson.goals,
    curriculumModule: lesson.curriculum?.module,
    curriculumPoints: lesson.curriculum?.points,
    textbook: lesson.textbook,
    grade: lesson.grade,
    subjectArea: lesson.subjectArea,
    labParams: params.map((p) => `${p.label}=${values[p.name]}${p.unit ?? ''}`).join('、'),
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <Header />
      {/* 课题条 */}
      <div className="border-b bg-white/80 px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => nav(`/subject/${encodeURIComponent(lesson.subjectArea ?? '数学')}`)} className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200">← 返回学科</button>
          <span className="text-xl">{lesson.emoji}</span>
          <h1 className="text-base font-black text-slate-800">{lesson.title}</h1>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">{lesson.subjectArea ?? '数学'}</span>
          {lesson.grade != null && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{lesson.grade}年级</span>}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{bandText}</span>
          {lesson.textbook && <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 sm:inline">📚 {lesson.textbook}</span>}
          <div className="ml-auto flex items-center gap-1.5">
            {lesson.exercises?.length ? (
              <button onClick={() => setQuizOpen(true)} className={`rounded-xl px-3 py-1.5 text-sm font-bold shadow-sm ${quizDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-400 text-white hover:bg-amber-500'}`}>
                {quizDone ? '✅ 随堂小练' : '📝 随堂小练'}
              </button>
            ) : null}
            <button onClick={() => nav(`/practice/${lesson.id}`)} className="rounded-xl bg-white/80 px-3 py-1.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-white" title="查看和修改演示代码">⌨ 看代码</button>
            <button
              onClick={() => setBuddyOpen((v) => !v)}
              className={`rounded-xl px-3 py-1.5 text-sm font-bold shadow-sm transition ${buddyOpen ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-white/80 text-slate-700 hover:bg-white'}`}
            >
              📖 问 AI
            </button>
          </div>
        </div>
      </div>

      <main className="relative flex min-h-0 flex-1">
        {/* 左：参数 + 探索问题 */}
        <aside className="w-72 shrink-0 space-y-3 overflow-y-auto border-r bg-white/60 p-3">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm font-black text-slate-700">⚙️ 探索参数</div>
            {params.length === 0 && <p className="text-xs text-slate-400">这节演示没有可调参数</p>}
            {params.map((p) => (
              <div key={p.name} className="mb-3">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-600">{p.label}</span>
                  <span className="font-mono text-xs font-black text-sky-600">{values[p.name] ?? p.value}{p.unit ?? ''}</span>
                </div>
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={values[p.name] ?? p.value}
                  onChange={(e) => onParamChange(p.name, Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
            ))}
            <button
              onClick={() => runLab(baseCode, values, 'normal')}
              disabled={slowRunning}
              className="mt-1 w-full rounded-xl bg-violet-500 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-violet-600 disabled:opacity-50"
            >
              {slowRunning ? '⏳ 演示中…' : '▶ 慢速看过程'}
            </button>
          </div>

          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm font-black text-slate-700">🔍 探索问题</div>
            {exploreList.length > 0 ? (
              <ul className="space-y-2">
                {exploreList.map((q, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setExplored((prev) => ({ ...prev, [i]: !prev[i] }))}
                      className={`flex w-full items-start gap-2 rounded-xl border p-2 text-left text-[13px] leading-snug transition ${
                        explored[i] ? 'border-emerald-300 bg-emerald-50 text-slate-500 line-through decoration-emerald-400' : 'border-slate-200 bg-white hover:border-sky-300'
                      }`}
                    >
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${explored[i] ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'}`}>
                        {explored[i] ? '✓' : i + 1}
                      </span>
                      <span>{q}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-sky-50 p-2 text-[13px] leading-snug text-sky-700">
                💡 拖动左边的参数试一试：什么变了？为什么？把发现说给爸妈听，或点「问 AI」讨论。
              </p>
            )}
          </div>
        </aside>

        {/* 右：舞台（实时重绘） */}
        <div className={`min-w-0 flex-1 p-4 transition-all duration-300 ${buddyOpen ? 'pr-[22.5rem]' : ''}`}>
          <Stage fit grid={lesson.lab?.grid ?? false} stage={stageRef.current} />
        </div>

        {/* AI 辅导浮窗 */}
        <div
          className={`absolute bottom-3 right-3 top-3 z-30 w-[22rem] max-w-[calc(100%-1.5rem)] transition-all duration-300 ${
            buddyOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
          }`}
        >
          <AIBuddy
            ref={buddyRef}
            profileId={profile.id}
            buddy={settings.buddy}
            intro={lesson.aiIntro || `我是${settings.buddy.name}。拖动左边的参数做实验，把你的发现告诉我，不懂的随时问！`}
            defaultMode="explain"
            modes={['explain', 'hint']}
            quick={LAB_QUICK}
            subtitle="AI 学科辅导老师"
            getContext={getContext}
          />
        </div>
      </main>

      {/* 随堂小练 */}
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
            void api.updateProgress(profile.id, {
              lessonId: lesson.id,
              completed: true,
              exercise: { correct, total: lesson.exercises!.length },
              wrongAdds,
            }).catch(() => {});
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-800/90 px-5 py-3 text-white shadow-xl">{toast}</div>
      )}
    </div>
  );
}
