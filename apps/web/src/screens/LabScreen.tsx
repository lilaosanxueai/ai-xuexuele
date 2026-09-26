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
import TeachPanel from '../components/TeachPanel.tsx';
import { StageState, setRunSpeed } from '../runtime/stageState.ts';
import { parsePy, PyRunner } from '../runtime/pyinterp.ts';
import { pyStageApi } from '../runtime/pyBridge.ts';
import { socraticOnExplore, socraticOnChallenge, socraticOnWrong, socraticOnPerfect } from '../runtime/socratic.ts';
import { lessonNeighbors, lessonRoute } from '../runtime/lessonNav.ts';

/**
 * 互动实验室（理科五科学习新主页）：内容动态化 + 动态互动。
 * 左侧参数滑块 → 演示代码注入参数 → 舞台瞬时重绘；探索问题引导孩子做"实验"。
 * 无 lab 字段的代码课自动提取顶层「带注释的赋值」为滑块。
 */

/** 实验室场景的快捷提问（替代默认的编程向问题） */
const LAB_QUICK: Partial<Record<'explain' | 'hint', string[]>> = {
  explain: ['我拖动参数后看到了变化，为什么？', '这个知识点在课本里怎么讲？', '帮我看看实验记录单写得怎么样'],
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
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [values, setValues] = useState<Record<string, number>>({});
  const [slowRunning, setSlowRunning] = useState(false);
  const [buddyOpen, setBuddyOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [teachOpen, setTeachOpen] = useState(false);
  /** 讲解是否看过（stepper 用；打开过讲解弹窗即算） */
  const [teachSeen, setTeachSeen] = useState(false);
  const [explored, setExplored] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [challengeDone, setChallengeDone] = useState<Record<number, boolean>>({});
  /** 预测-验证（PhET 式）：挑战前先猜能不能达成 {挑战序号: 猜能(true)/猜不能(false)} */
  const [predictions, setPredictions] = useState<Record<number, boolean>>({});
  /** 实验记录单：观察笔记（自动保存到进度，AI 可点评） */
  const [labNote, setLabNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(true);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stageRef = useRef(new StageState());
  const runnerRef = useRef<PyRunner | null>(null);
  const buddyRef = useRef<BuddyHandle>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /** 补间动画：当前插值中的参数值（重绘用），滑块显示值是目标值 */
  const tweenValsRef = useRef<Record<string, number> | null>(null);
  const tweenRafRef = useRef(0);
  /** AI 观察员：最近的参数操作记录（name/label/from/to） */
  const opsRef = useRef<{ name: string; label: string; from: number; to: number }[]>([]);
  const opsCountRef = useRef(0);
  const guidedRef = useRef(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  /** 实验挑战达成检测：参数到位（浮点容差）即亮 */
  useEffect(() => {
    const chs = lesson?.lab?.challenges;
    if (!chs?.length) return;
    chs.forEach((ch, i) => {
      if (challengeDone[i]) return;
      const hit = Object.entries(ch.params).every(
        ([k, target]) => Math.abs((values[k] ?? NaN) - target) < 1e-9,
      );
      if (hit) {
        setChallengeDone((prev) => ({ ...prev, [i]: true }));
        setToast(`🎯 挑战达成：${ch.text}`);
        // 预测-验证：孩子事先猜过的话，先对照预测再苏格拉底追问
        const guessed = predictions[i];
        const predictNote = guessed === undefined ? '' : guessed ? '（你猜对了，真有预感！）' : '（你猜不会亮——猜想和实验不一致的地方，正是科学最有趣的起点！）';
        buddyRef.current?.sayLocal(`🎯 挑战达成！「${ch.text}」${predictNote}\n${socraticOnChallenge(ch.text)}`);
        reportTask(`c${i}`, true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, lesson]);

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
    setChallengeDone({});
    setLabNote('');
    void api.settings().then(setSettings).catch(() => {});
    void api.lessons().then((all) => {
      const l = all.find((x) => x.id === id) ?? null;
      if (!l || !(l.lab || l.starterCode)) { nav(l ? `/tutor/${id}` : '/map'); return; }
      setAllLessons(all);
      setLesson(l);
      setValues(Object.fromEntries((l.lab?.params ?? autoParams(l.lab?.code ?? l.starterCode ?? '')).map((p) => [p.name, p.value])));
      void api.progress(profile.id).then((p) => {
        const lp = p.lessons?.[l.id];
        setLabNote(p.labNotes?.[l.id] ?? '');
        // 恢复上次实验进度（要点勾选/挑战达成）
        if (lp) {
          const ex: Record<number, boolean> = {};
          const ch: Record<number, boolean> = {};
          for (const [tid, st] of Object.entries(lp.tasks ?? {})) {
            if (!st.done) continue;
            if (/^e\d+$/.test(tid)) ex[Number(tid.slice(1))] = true;
            if (/^c\d+$/.test(tid)) ch[Number(tid.slice(1))] = true;
          }
          setExplored(ex);
          setChallengeDone(ch);
          if (lp.tasks?.quiz?.done) setQuizDone(true);
        }
      }).catch(() => {});
    }).catch(() => nav('/map'));
    return () => {
      runnerRef.current?.stop();
      cancelAnimationFrame(tweenRafRef.current);
      setRunSpeed('normal');
    };
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

  /**
   * 滑块变动：记录操作（AI 观察员用）→ 目标值立即生效于滑块显示；
   * 图形用补间动画连续变形（随机类课直接跳变防闪烁）。拖动中防抖 120ms。
   */
  const onParamChange = (name: string, v: number) => {
    const p = params.find((x) => x.name === name);
    const from = values[name] ?? v;
    setValues((prev) => ({ ...prev, [name]: v }));
    // 记录操作（合并同一参数的连续拖动）
    const ops = opsRef.current;
    const last = ops[ops.length - 1];
    if (last && last.name === name) {
      last.to = v;
    } else {
      ops.push({ name, label: p?.label ?? name, from, to: v });
      if (ops.length > 6) ops.shift();
    }
    opsCountRef.current++;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // AI 观察员：探索满 5 次且未引导过 → 伙伴主动开口（本地零成本）
      if (opsCountRef.current >= 5 && !guidedRef.current) {
        guidedRef.current = true;
        buddyRef.current?.sayLocal('👀 我注意到你已经调了好几组参数——发现什么规律了吗？说出来或点 💬 问我，我帮你把发现变成结论！');
      }
      const animate = lesson?.lab?.animate !== false;
      if (!animate) {
        tweenValsRef.current = null;
        runLab(baseCode, { ...valuesRef.current }, 'instant');
        return;
      }
      // 补间：从当前插值（或上一目标）平滑过渡到新目标
      const startVals: Record<string, number> = { ...(tweenValsRef.current ?? valuesRef.current) };
      const targetVals: Record<string, number> = { ...valuesRef.current };
      const startT = performance.now();
      cancelAnimationFrame(tweenRafRef.current);
      const DURATION = 320;
      const step = () => {
        const t = Math.min(1, (performance.now() - startT) / DURATION);
        const ease = 1 - Math.pow(1 - t, 3);
        const cur: Record<string, number> = {};
        for (const k of Object.keys(targetVals)) {
          const a = startVals[k] ?? targetVals[k];
          cur[k] = a + (targetVals[k] - a) * ease;
        }
        tweenValsRef.current = cur;
        runLab(baseCode, cur, 'instant');
        if (t < 1) tweenRafRef.current = requestAnimationFrame(step);
        else tweenValsRef.current = null;
      };
      tweenRafRef.current = requestAnimationFrame(step);
    }, 120);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /** 上报要点完成状态（探索/挑战/随堂练 → 家长端「要点完成」实时可见） */
  const reportTask = (taskId: string, done: boolean) => {
    if (!profile || !lesson) return;
    void api.updateProgress(profile.id, { lessonId: lesson.id, tasks: { [taskId]: done } }).catch(() => {});
  };

  /** 记录单输入：1.5s 防抖自动保存到进度 */
  const onNoteChange = (text: string) => {
    setLabNote(text);
    setNoteSaved(false);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => {
      if (!profile || !lesson) return;
      void api.updateProgress(profile.id, { lessonId: lesson.id, labNote: text.slice(0, 2000) })
        .then(() => setNoteSaved(true))
        .catch(() => {});
    }, 1500);
  };

  /** 让 AI 点评记录单：打开伙伴窗并发送点评请求（记录内容会随上下文带给 AI） */
  const askAiToReview = () => {
    if (!labNote.trim()) {
      setToast('先在记录单里写下你的发现，再让 AI 老师看～');
      return;
    }
    setBuddyOpen(true);
    buddyRef.current?.askInMode('explain', '请点评我的实验记录单：我的发现对不对？哪里可以写得更像科学家？');
  };

  if (!profile || !lesson) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">正在搭建实验室…</div>;
  }

  const exploreList = lesson.lab?.explore ?? [];
  const bandText = lesson.gradeBand === 'senior' ? '高中' : lesson.gradeBand === 'junior' ? '初中' : '小学';
  /** 已勾选的探索问题数（stepper 判断"学"阶段进行中） */
  const exploredCount = Object.values(explored).filter(Boolean).length;

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
    labOps: opsRef.current.map((o) => `把${o.label}从${Math.round(o.from * 100) / 100}调到${Math.round(o.to * 100) / 100}`).join('；'),
    labNote: labNote.trim() || undefined,
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
          {/* 连续学习导航：同学科按 order 排序，学完直接翻下一课 */}
          {(() => {
            const nb = lessonNeighbors(allLessons, lesson.id);
            if (nb.total === 0) return null;
            return (
              <span className="flex items-center gap-1.5">
                <span className="hidden text-xs font-bold text-slate-400 md:inline">{nb.index}/{nb.total}</span>
                {nb.prev && (
                  <button onClick={() => nav(lessonRoute(nb.prev!))} className="max-w-32 truncate rounded-xl bg-slate-100 px-2 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200" title={`上一课：${nb.prev.title}`}>
                    ← {nb.prev.title}
                  </button>
                )}
                {nb.next && (
                  <button onClick={() => nav(lessonRoute(nb.next!))} className="max-w-32 truncate rounded-xl bg-sky-500 px-2 py-1.5 text-xs font-bold text-white transition hover:bg-sky-600" title={`下一课：${nb.next.title}`}>
                    {nb.next.title} →
                  </button>
                )}
              </span>
            );
          })()}
          <div className="ml-auto flex items-center gap-1.5">
            {lesson.teach && (
              <button
                onClick={() => { setTeachOpen(true); setTeachSeen(true); }}
                className="rounded-xl bg-sky-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
                title="概念精讲 + 例题分步 + 易错点（像课本一样自己学）"
              >
                📖 课本讲解
              </button>
            )}
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
        {/* 学习路径 stepper（学而思式 预习-学习-巩固 闭环可视化） */}
        <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-bold">
          {(() => {
            const steps: { key: string; label: string; state: 'done' | 'now' | 'todo'; onClick?: () => void }[] = [
              { key: 'pre', label: '① 预习·开场一问', state: teachOpen ? 'now' : (teachSeen ? 'done' : 'todo'), onClick: () => setTeachOpen(true) },
              { key: 'learn', label: '② 学·讲解+实验', state: !teachSeen ? 'todo' : exploredCount > 0 || quizDone ? 'done' : 'now', onClick: () => setTeachOpen(true) },
              { key: 'test', label: '③ 练·随堂小练', state: quizDone ? 'done' : teachSeen ? 'now' : 'todo', onClick: () => (lesson.exercises?.length ? setQuizOpen(true) : undefined) },
              { key: 'fix', label: '④ 固·错题清零', state: 'todo', onClick: () => nav('/wrongbook') },
            ];
            return steps.map((s) => (
              <button
                key={s.key}
                onClick={s.onClick}
                className={`shrink-0 rounded-full px-2.5 py-1 transition ${
                  s.state === 'done' ? 'bg-emerald-100 text-emerald-700' : s.state === 'now' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s.state === 'done' ? '✓ ' : ''}{s.label}
              </button>
            ));
          })()}
        </div>
      </div>

      <main className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        {/* 左：参数 + 探索问题（手机端横排在上，桌面竖排在左） */}
        <aside className="w-full shrink-0 space-y-3 overflow-y-auto border-b border-r bg-white/60 p-3 md:w-72 md:border-b-0">
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
                      onClick={() => {
                        const nowChecked = !explored[i];
                        setExplored((prev) => ({ ...prev, [i]: nowChecked }));
                        reportTask(`e${i}`, nowChecked);
                        // 勾选（而非取消）时，AI 用苏格拉底式追问引导深入（Khanmigo 模式）
                        if (nowChecked) buddyRef.current?.sayLocal(socraticOnExplore(q));
                      }}
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
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-black text-slate-700">📝 实验记录单</div>
              <span className={`text-[11px] ${noteSaved ? 'text-emerald-500' : 'text-amber-500'}`}>
                {noteSaved ? '✓ 已保存' : '保存中…'}
              </span>
            </div>
            <textarea
              value={labNote}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={5}
              maxLength={300}
              placeholder={'像科学家一样记录：\n我动了什么参数 → 看到了什么变化 → 我的结论是…'}
              className="w-full resize-none rounded-xl border border-slate-200 p-2 text-[13px] leading-relaxed outline-none focus:border-sky-400"
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{labNote.length}/300</span>
              <button
                onClick={askAiToReview}
                className="rounded-xl bg-sky-100 px-3 py-1.5 text-xs font-bold text-sky-700 transition hover:bg-sky-200"
              >
                🔍 让 AI 老师看看
              </button>
            </div>
          </div>
          {(lesson.lab?.challenges?.length ?? 0) > 0 && (
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="mb-2 text-sm font-black text-slate-700">🎯 实验挑战</div>
              <ul className="space-y-2">
                {lesson.lab!.challenges!.map((ch, i) => (
                  <li
                    key={i}
                    className={`rounded-xl border p-2 text-[13px] leading-snug transition ${
                      challengeDone[i] ? 'border-amber-400 bg-amber-50' : 'border-dashed border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 ${challengeDone[i] ? '' : 'opacity-40'}`}>{challengeDone[i] ? '🏅' : '🎯'}</span>
                      <span className={challengeDone[i] ? 'font-bold text-amber-700' : 'text-slate-600'}>{ch.text}</span>
                    </div>
                    {!challengeDone[i] && predictions[i] === undefined && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">先猜猜（PhET 预测法）：</span>
                        <button
                          onClick={() => { setPredictions((p) => ({ ...p, [i]: true })); setBuddyOpen(true); buddyRef.current?.sayLocal('🔮 你猜会达成！好，现在动手试试——实验会告诉你猜得对不对。'); }}
                          className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                        >
                          能亮 🙌
                        </button>
                        <button
                          onClick={() => { setPredictions((p) => ({ ...p, [i]: false })); setBuddyOpen(true); buddyRef.current?.sayLocal('🔮 你猜不会达成？敢不敢做个实验验证一下猜想？科学家就是这么工作的。'); }}
                          className="rounded-lg bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600 hover:bg-rose-100"
                        >
                          不能 🤨
                        </button>
                      </div>
                    )}
                    {!challengeDone[i] && predictions[i] !== undefined && (
                      <div className="mt-1 text-[10px] text-slate-400">你的猜想：{predictions[i] ? '能达成' : '不能达成'}——去做实验验证吧！</div>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-slate-400">把参数调到要求的样子，达成会自己亮</p>
            </div>
          )}
        </aside>

        {/* 右：舞台（实时重绘；网格课开悬停坐标读数） */}
        <div className={`min-w-0 flex-1 p-4 transition-all duration-300 ${buddyOpen ? 'pr-[22.5rem]' : ''}`}>
          <Stage fit grid={lesson.lab?.grid ?? false} coords={lesson.lab?.grid ?? false} stage={stageRef.current} />
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
              tasks: { quiz: true },
              wrongAdds,
            }).catch(() => {});
            // 练习复盘：苏格拉底式——有错引导回看讲解，全对检验能否举例（费曼技巧）
            if (wrongs.length > 0) buddyRef.current?.sayLocal(socraticOnWrong(correct, lesson.exercises!.length, lesson.title));
            else buddyRef.current?.sayLocal(socraticOnPerfect());
          }}
        />
      )}

      {/* 课本讲解（教材级自学正文） */}
      {teachOpen && lesson.teach && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setTeachOpen(false)}>
          <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b bg-white px-5 py-3">
              <h2 className="text-base font-black text-slate-800">📖 课本讲解 · {lesson.title}</h2>
              <button onClick={() => setTeachOpen(false)} className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200">✕ 关闭</button>
            </div>
            <div className="overflow-y-auto p-4">
              {/* 开场一问（李永乐式钩子）：讲解前先抛出真实世界的问题 */}
              {lesson.story && (
                <div className="mb-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 p-5 ring-1 ring-indigo-100">
                  <div className="mb-1.5 text-sm font-black text-indigo-700">🎬 开场一问</div>
                  <p className="text-[15px] leading-[1.9] text-indigo-900">{lesson.story}</p>
                </div>
              )}
              <TeachPanel teach={lesson.teach} />
              {/* 理解度自评（洋葱学园式）：读完自评，模糊/没懂给回学路径 */}
              <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="mb-2 text-sm font-black text-slate-700">🧐 读完了？给自己打个分：</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setTeachOpen(false); setQuizOpen(true); setBuddyOpen(true); buddyRef.current?.sayLocal('😄 很有信心！那就用随堂小练验证一下——全对才算真懂哦。'); }} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600">
                    😀 全懂了，去小练
                  </button>
                  <button onClick={() => { setBuddyOpen(true); buddyRef.current?.sayLocal('🤔 有点模糊很正常！建议：① 拖动左边滑块做几组实验，看着图形变化再回来重读对应章节；② 或点我问具体哪里不懂。'); }} className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-200">
                    😐 有点模糊
                  </button>
                  <button onClick={() => { setBuddyOpen(true); buddyRef.current?.sayLocal('😅 没懂也不要紧！回到最上面的「开场一问」重读一遍，重点看【高亮框】里的定义；还卡住就告诉我具体哪句看不懂，我们一句一句拆。'); }} className="rounded-xl bg-rose-100 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-200">
                    😵 没太懂
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-800/90 px-5 py-3 text-white shadow-xl">{toast}</div>
      )}
    </div>
  );
}
