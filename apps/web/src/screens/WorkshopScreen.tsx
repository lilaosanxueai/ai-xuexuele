import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import type { BlockCatalogEntry, BuddyMode, BuildOp, ChatContext, Lesson, Settings, WrongItem } from '@shared/types.ts';
import { DEFAULT_SETTINGS } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import BlocklyWorkspace, { type WorkspaceApi } from '../components/BlocklyWorkspace.tsx';
import Stage from '../components/Stage.tsx';
import TaskPanel from '../components/TaskPanel.tsx';
import AIBuddy, { type BuddyHandle } from '../components/AIBuddy.tsx';
import { buildToolbox } from '../blocks/toolbox.ts';
import { ALL_BLOCK_TYPES, BLOCK_LABELS } from '../blocks/definitions.ts';
import { StageState, setRunSpeed, getRunSpeed, type RunSpeed } from '../runtime/stageState.ts';
import { playSound, isMuted, setMuted } from '../runtime/sounds.ts';
import { Executor } from '../runtime/executor.ts';
import { evaluateTasks, requiredTasksDone, type RunEvidence } from '../runtime/validators.ts';
import { recognizer } from '../ml/recognizer.ts';
import { parsePy, PyRunner } from '../runtime/pyinterp.ts';
import { pyStageApi } from '../runtime/pyBridge.ts';
import { workspaceToPython } from '../blocks/python.ts';
import { applyBuildOps, buildCatalog, workspaceToOps } from '../runtime/builder.ts';
import ExercisePanel from '../components/ExercisePanel.tsx';
import { guideRespond, newGuideState, type GuideState } from '../runtime/guideBrain.ts';

export interface WorkshopMode {
  kind: 'lesson' | 'freeplay';
  lessonId?: string;
}

const FREEPLAY_LESSON: Lesson = {
  id: 'freeplay',
  island: '自由创造岛',
  order: 99,
  title: '自由创造',
  emoji: '✨',
  story: '',
  goals: [],
  toolbox: ALL_BLOCK_TYPES,
  actor: { costume: '🤖', x: 0, y: 0 },
  tasks: [],
  aiIntro: '',
  celebrate: '',
};

const IDEAS = [
  { emoji: '📊', title: '坐标绘图实验', desc: '用「移到 x: y:」在坐标系里画出图形（数学·位置）' },
  { emoji: '🎵', title: '音阶练习器', desc: '用音阶积木排出一段旋律（音乐·音阶）' },
  { emoji: '🧠', title: 'AI 手势控制实验', desc: '训练模型后用「当 AI 认出」控制角色（信息科技·AI）' },
];

const SPEED_LABEL: Record<RunSpeed, string> = { slow: '🐢 慢速', normal: '▶ 常速', fast: '🐇 快速' };

/** 任务完成喝彩：夸努力和方法，不夸聪明（教育设计的经典原则） */
const CHEERS = [
  (t: string) => `🎉 又完成一步！「${t}」被你搞定了——你刚才自己动手试的那几下特别关键！`,
  (t: string) => `✅ 漂亮！我注意到你刚才调整了积木再试了一次，这就叫「试错精神」，创作者都靠它！`,
  (t: string) => `💪 帅啊！「${t}」完成！遇到卡点你没有放弃，这一点我最佩服！`,
];

export default function WorkshopScreen({ mode }: { mode: WorkshopMode }) {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [draftXml, setDraftXml] = useState<string | null>(null);
  const [progressReady, setProgressReady] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [taskDone, setTaskDone] = useState<Record<string, boolean>>({});
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [buddyOpen, setBuddyOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [taskListOpen, setTaskListOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [speed, setSpeed] = useState<RunSpeed>(getRunSpeed());
  const [muted, setMutedState] = useState(isMuted());
  const [camOn, setCamOn] = useState(false);
  const [codeMode, setCodeMode] = useState(false);
  const [codeText, setCodeText] = useState('');
  const [codeError, setCodeError] = useState<{ line: number; message: string; hint?: string } | null>(null);
  const [restOverlay, setRestOverlay] = useState(false);
  const [restCountdown, setRestCountdown] = useState(0);
  const [locked, setLocked] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const wsApiRef = useRef<WorkspaceApi | null>(null);
  const stageRef = useRef(new StageState());
  const execRef = useRef<Executor | null>(null);
  const pyRunnerRef = useRef<PyRunner | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const buddyRef = useRef<BuddyHandle>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const lastFiredLabel = useRef<string | null>(null);
  const codeTextRef = useRef(codeText);
  codeTextRef.current = codeText;
  const codeModeRef = useRef(codeMode);
  codeModeRef.current = codeMode;
  const codeDraftTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mountTimeRef = useRef(Date.now());
  const lastRestRef = useRef(Date.now());
  const guideRef = useRef<GuideState>(newGuideState());
  const lastActivityRef = useRef(Date.now());
  const hadBlocksRef = useRef(false);
  const [ideaHint, setIdeaHint] = useState<string | null>(null);

  const sayGuide = useCallback((ev: Parameters<typeof guideRespond>[0]) => {
    const line = guideRespond(ev, guideRef.current);
    if (line) buddyRef.current?.sayLocal(line);
  }, []);
  const taskDoneRef = useRef(taskDone);
  taskDoneRef.current = taskDone;
  const completedRef = useRef(lessonCompleted);
  completedRef.current = lessonCompleted;
  const cheerIdx = useRef(0);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ---------- 加载课程与设置 ----------
  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, l] = await Promise.all([
        api.settings().catch(() => DEFAULT_SETTINGS),
        mode.kind === 'lesson'
          ? api.lessons().then((all) => all.find((x) => x.id === mode.lessonId) ?? null)
          : Promise.resolve(FREEPLAY_LESSON),
      ]);
      if (!alive) return;
      setSettings(s);
      setWsReady(false);
      if (!l) { setToast('找不到这一课'); setProgressReady(true); return; }
      // 切课时停掉旧的运行器（组件复用时 pyRunnerRef 被覆盖但旧实例仍在跑）
      pyRunnerRef.current?.stop();
      execRef.current?.stop();
      setLesson(l);
      if (mode.kind === 'freeplay') {
        const idea = localStorage.getItem('island-idea');
        if (idea) { setIdeaHint(idea); localStorage.removeItem('island-idea'); }
        else setIdeaHint(null);
      }
      setCodeMode(!!l.codeLesson);
      setCodeText(l.starterCode ?? '');
      stageRef.current.reset(l.actor, l.targets);
      setProgressReady(false);
      if (profile) {
        try {
          const p = await api.progress(profile.id);
          if (!alive) return;
          const lp = p.lessons[l.id];
          if (lp) {
            setTaskDone(Object.fromEntries(Object.entries(lp.tasks).map(([k, v]) => [k, v.done])));
            setLessonCompleted(lp.status === 'completed');
          }
          setDraftXml(p.lessonDrafts?.[l.id] ?? null);
          const savedCode = p.lessonCodes?.[l.id];
          if (savedCode) setCodeText(savedCode);
        } catch { /* 首次学习无进度 */ }
      }
      if (alive) setProgressReady(true);
    })();
    return () => { alive = false; clearTimeout(draftTimer.current); };
  }, [mode.kind, mode.lessonId, profile]);

  // 画布挂载 + 进度就绪后，显式载入草稿（有草稿用草稿，否则保留课程初始积木）
  useEffect(() => {
    if (!wsReady || !progressReady || !lesson || !wsApiRef.current) return;
    if (draftXml) wsApiRef.current.loadXml(draftXml);
  }, [wsReady, progressReady, lesson, draftXml]);

  // ---------- 运行 ----------
  const collectEvidence = useCallback((hasRun: boolean): RunEvidence => {
    const stage = stageRef.current;
    return {
      blockCounts: wsApiRef.current?.getBlockCounts() ?? {},
      saidTexts: stage.saidTexts,
      reachedTargets: stage.reachedTargetIndices(),
      hasRun,
    };
  }, []);

  const maybeComplete = useCallback((next: Record<string, boolean>) => {
    if (!lesson || lesson.tasks.length === 0) return;
    if (!requiredTasksDone(lesson.tasks, next) || completedRef.current) return;
    setLessonCompleted(true);
    setCelebrate(true);
    if (profile) {
      void api.updateProgress(profile.id, {
        lessonId: lesson.id, tasks: next, completed: true,
        draft: wsApiRef.current?.getXml(),
      }).catch(() => {});
    }
  }, [lesson, profile]);

  const revalidate = useCallback((hasRun: boolean) => {
    if (!lesson || lesson.tasks.length === 0) return;
    const next = evaluateTasks(lesson.tasks, collectEvidence(hasRun), taskDoneRef.current);
    // 新亮起的必做任务 → 伙伴本地喝彩（不耗 token）。先在 setState 外算好，避免副作用塞进 updater
    const newly = lesson.tasks.find(
      (t) => !t.optional && next[t.id] && !taskDoneRef.current[t.id],
    );
    if (newly) {
      buddyRef.current?.sayLocal(CHEERS[cheerIdx.current % CHEERS.length](newly.text.slice(0, 22)));
      cheerIdx.current++;
    }
    setTaskDone((prev) => {
      const changed = lesson.tasks.some((t) => next[t.id] !== prev[t.id]);
      return changed ? next : prev;
    });
    maybeComplete(next);
  }, [lesson, collectEvidence, maybeComplete]);

  /** 事件（按键/点击/AI识别）按当前模式路由到积木执行器或 Python 运行器 */
  const fireHat = useCallback((kind: 'key' | 'click' | 'recognized', arg?: string) => {
    if (codeModeRef.current && pyRunnerRef.current) {
      pyRunnerRef.current.fire(kind === 'key' ? 'key' : kind === 'click' ? 'click' : 'recognize', arg);
    } else if (kind === 'key') {
      void execRef.current?.trigger({ type: 'key', key: arg! });
    } else if (kind === 'click') {
      void execRef.current?.trigger({ type: 'click' });
    } else {
      void execRef.current?.trigger({ type: 'recognized', label: arg! });
    }
  }, []);

  const handleRun = () => {
    if (codeMode) {
      const { program, error } = parsePy(codeText);
      if (error || !program) {
        setCodeError(error ?? { line: 0, message: '代码有点问题' });
        return;
      }
      setCodeError(null);
      pyRunnerRef.current = new PyRunner(program, pyStageApi(stageRef.current));
      setRunning(true);
      void pyRunnerRef.current.run(() => {
        setRunning(false);
        revalidate(true);
        lastActivityRef.current = Date.now();
        sayGuide({ type: 'first-run', ok: !pyRunnerRef.current?.lastError });
        if (pyRunnerRef.current?.lastError) setToast(`程序出了点小问题：${pyRunnerRef.current.lastError}`);
      });
      return;
    }
    const exec = execRef.current;
    if (!exec) return;
    setRunning(true);
    void exec.run(() => {
      setRunning(false);
      revalidate(true);
      lastActivityRef.current = Date.now();
      sayGuide({ type: 'first-run', ok: !exec.lastError });
      if (exec.lastError) setToast(`程序出了点小问题：${exec.lastError}`);
    });
  };

  const handleStop = () => {
    execRef.current?.stop();
    pyRunnerRef.current?.stop();
    setRunning(false);
    revalidate(true);
  };

  const switchMode = () => {
    if (!lesson) return;
    if (!codeMode && !codeText.trim()) {
      // 首次进入代码模式：从积木生成（代码课用 starterCode，已预置）
      const ws = wsApiRef.current?.workspace;
      setCodeText((ws ? workspaceToPython(ws) : '') || lesson.starterCode || 'say("你好，Python！")\n');
    }
    setCodeError(null);
    setCodeMode((v) => !v);
    pyRunnerRef.current?.stop();
    execRef.current?.stop();
    setRunning(false);
  };

  const regenerateFromBlocks = () => {
    if (!confirm('用积木重新生成代码？当前改过的代码会被覆盖。')) return;
    const ws = wsApiRef.current?.workspace;
    setCodeText((ws ? workspaceToPython(ws) : '') || 'say("你好，Python！")\n');
    setCodeError(null);
  };

  const handleCodeChange = (text: string) => {
    setCodeText(text);
    if (codeError) setCodeError(null);
    if (!lesson || !profile) return;
    clearTimeout(codeDraftTimer.current);
    codeDraftTimer.current = setTimeout(() => {
      void api.updateProgress(profile.id, { lessonId: lesson.id, code: text }).catch(() => {});
    }, 1500);
  };

  // ---------- 工作区变化：校验 + 草稿自动保存 ----------
  const handleWorkspaceChange = useCallback(() => {
    revalidate(false);
    lastActivityRef.current = Date.now();
    const counts = wsApiRef.current?.getBlockCounts() ?? {};
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total > 0 && !hadBlocksRef.current) {
      hadBlocksRef.current = true;
      sayGuide({ type: 'first-block' });
    }
    if (!lesson || !profile || !wsApiRef.current) return;
    // 立即快照 XML：防抖等待期间 workspace 可能被销毁（切课/关页）
    const xml = wsApiRef.current.getXml();
    clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      void api.updateProgress(profile.id, { lessonId: lesson.id, draft: xml }).catch(() => {});
    }, 1500);
  }, [revalidate, lesson, profile]);

  // ---------- 键盘（运行中生效） ----------
  useEffect(() => {
    if (!running) return;
    const map = (e: KeyboardEvent): string | null => {
      switch (e.key) {
        case 'ArrowUp': return 'up';
        case 'ArrowDown': return 'down';
        case 'ArrowLeft': return 'left';
        case 'ArrowRight': return 'right';
        case ' ': return 'space';
        default: return null;
      }
    };
    const down = (e: KeyboardEvent) => {
      const k = map(e);
      if (!k) return;
      e.preventDefault();
      if (!stageRef.current.keysHeld.has(k)) {
        stageRef.current.keysHeld.add(k);
        fireHat('key', k);
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = map(e);
      if (k) stageRef.current.keysHeld.delete(k);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      stageRef.current.keysHeld.clear();
    };
  }, [running]);

  // ---------- 使用时长心跳（每分钟上报；超时可选锁定）+ 发呆观察 ----------
  useEffect(() => {
    if (!profile) return;
    const timer = setInterval(() => {
      void api.updateProgress(profile.id, { minutesDelta: 1 })
        .then((p) => {
          const today = new Date().toISOString().slice(0, 10);
          const used = p.dailyUsage[today] ?? 0;
          if (used >= settings.limits.dailyMinutes) {
            const unlockedKey = `island-unlocked-${today}`;
            if (settings.limits.hardStop && !localStorage.getItem(unlockedKey)) {
              setLocked(true);
            } else {
              setToast('🏖 今天的创作时间到啦，保存好作品，休息一下眼睛吧！');
            }
          }
        })
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(timer);
  }, [profile, settings.limits.dailyMinutes, settings.limits.hardStop]);

  // 发呆观察：45 秒无活动，伙伴轻轻开口（画布空时换开场引导）
  useEffect(() => {
    const timer = setInterval(() => {
      if (running || locked) return;
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs < 45_000) return;
      const counts = wsApiRef.current?.getBlockCounts() ?? {};
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      sayGuide(total === 0 && !codeMode ? { type: 'empty-stage' } : { type: 'idle', seconds: Math.round(idleMs / 1000) });
      lastActivityRef.current = Date.now(); // 说完重置，避免连续打扰
    }, 15_000);
    return () => clearInterval(timer);
  }, [running, locked, codeMode, sayGuide]);

  const unlockWithPin = async () => {
    const r = await api.verifyPin(pinInput).catch(() => ({ ok: false }));
    if (r.ok) {
      localStorage.setItem(`island-unlocked-${new Date().toISOString().slice(0, 10)}`, '1');
      setLocked(false);
      setPinInput('');
    } else {
      setToast('PIN 不对哦，请爸爸妈妈来输入');
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // ---------- 保存作品 ----------
  const snapshot = (): string => {
    const src = canvasRef.current;
    if (!src) return '';
    const small = document.createElement('canvas');
    small.width = 240;
    small.height = 180;
    small.getContext('2d')!.drawImage(src, 0, 0, 240, 180);
    return small.toDataURL('image/jpeg', 0.75);
  };

  const doSave = async () => {
    if (!profile || !lesson || !wsApiRef.current) return;
    try {
      await api.saveProject({
        profileId: profile.id,
        title: saveTitle.trim() || `${lesson.title}-${new Date().toLocaleDateString('zh-CN')}`,
        xml: wsApiRef.current?.getXml() ?? '<xml></xml>',
        thumb: snapshot(),
        lessonId: lesson.id === 'freeplay' ? undefined : lesson.id,
        stage: { actor: lesson.actor, targets: lesson.targets },
        code: codeMode ? codeText : undefined,
      });
      setSaveOpen(false);
      setSaveTitle('');
      setToast('🖼 作品已经挂到作品墙啦！');
    } catch (e) {
      setToast(`保存失败：${e instanceof Error ? e.message : '未知错误'}`);
    }
  };

  // ---------- AI 上下文 ----------
  const buildContext = useCallback((): ChatContext => {
    const counts = wsApiRef.current?.getBlockCounts() ?? {};
    const labels: Record<string, number> = {};
    for (const [type, n] of Object.entries(counts)) {
      if (BLOCK_LABELS[type]) labels[BLOCK_LABELS[type]] = n;
    }
    const undone = lesson?.tasks.find((t) => !taskDoneRef.current[t.id]);
    const exec = execRef.current;
    return {
      screen: mode.kind === 'lesson' ? 'lesson' : 'freeplay',
      lessonTitle: lesson?.title,
      lessonGoals: lesson?.goals,
      currentTask: undone?.text,
      hintPrompts: undone?.hintPrompts,
      blockCounts: labels,
      runOk: exec ? !exec.lastError : undefined,
      lastError: exec?.lastError ?? undefined,
    };
  }, [lesson, mode.kind]);

  const toolbox = useMemo(() => buildToolbox(lesson?.toolbox ?? ALL_BLOCK_TYPES), [lesson]);
  /** 本课积木目录：代搭时大模型只能从这里选积木（跟工具箱一致，不会搭出超纲积木） */
  const blockCatalog = useMemo(() => buildCatalog(lesson?.toolbox ?? ALL_BLOCK_TYPES), [lesson]);

  /** AI 代搭落地：展开抽屉 → 逐块搭上画布 → 重新校验任务 */
  const handleBuildOps = useCallback((ops: BuildOp[]) => {
    setDrawerOpen(true);
    setBuddyOpen(true);
    const ws = wsApiRef.current?.workspace as Blockly.WorkspaceSvg | undefined;
    if (!ws) return;
    void applyBuildOps(ws, ops, { animate: true }).then(() => {
      revalidate(false);
      lastActivityRef.current = Date.now();
    });
  }, [revalidate]);

  // ---------- 工具条动作 ----------
  const cycleSpeed = () => {
    const order: RunSpeed[] = ['normal', 'slow', 'fast'];
    const next = order[(order.indexOf(speed) + 1) % order.length];
    setSpeed(next);
    setRunSpeed(next);
    setToast(next === 'slow' ? '🐢 慢速模式：看清楚程序一步一步怎么走！' : next === 'fast' ? '🐇 快速模式！' : '▶ 常速模式');
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => setToast('这台设备不支持全屏'));
  };
  const toggleMute = () => {
    setMuted(!muted);
    setMutedState(!muted);
    if (muted) playSound('ding');
  };

  // ---------- AI 识别：开启摄像头后持续识别，变化时触发「当 AI 认出」帽子 ----------
  const toggleCam = async () => {
    if (camOn) {
      recognizer.stopCamera();
      setCamOn(false);
      stageRef.current.recognized = null;
      return;
    }
    if (!recognizer.hasModel()) {
      setToast('先去地图上的 🧠 AI 实验室，教它认东西再来！');
      return;
    }
    try {
      if (hiddenVideoRef.current) await recognizer.ensureCamera(hiddenVideoRef.current);
      setCamOn(true);
      setToast('📷 AI 眼睛已打开！点 ▶ 运行后，做动作就能触发「当 AI 认出」积木');
    } catch {
      setToast('摄像头打不开，让爸爸妈妈检查一下权限设置～');
    }
  };

  useEffect(() => {
    if (!camOn) { lastFiredLabel.current = null; return; }
    const timer = setInterval(() => {
      const pred = recognizer.predict();
      const stage = stageRef.current;
      if (pred && pred.conf >= 0.6) {
        const label = String(pred.label);
        stage.recognized = label;
        stage.recognizedConfidence = pred.conf;
        if (running && label !== lastFiredLabel.current) {
          lastFiredLabel.current = label;
          fireHat('recognized', label);
        }
      } else {
        stage.recognized = null;
        if (!pred) lastFiredLabel.current = null;
      }
    }, 250);
    return () => clearInterval(timer);
  }, [camOn, running]);

  // 离开工作台时关掉摄像头
  useEffect(() => () => { recognizer.stopCamera(); }, []);

  // 卸载时立即保存代码草稿
  useEffect(() => {
    return () => {
      clearTimeout(codeDraftTimer.current);
      const text = codeTextRef.current;
      if (lesson && profile && text.trim()) {
        void api.updateProgress(profile.id, { lessonId: lesson.id, code: text }).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, profile]);

  // ---------- 护眼 20-20-20：连续 20 分钟，远眺 20 秒 ----------
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now - mountTimeRef.current >= 20 * 60_000 && now - lastRestRef.current >= 20 * 60_000) {
        lastRestRef.current = now;
        setRestCountdown(20);
        setRestOverlay(true);
      }
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!restOverlay || restCountdown <= 0) return;
    const t = setTimeout(() => {
      setRestCountdown((c) => {
        if (c <= 1) { setRestOverlay(false); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [restOverlay, restCountdown]);

  if (!profile) {
    return <Center><button className="rounded-xl bg-sky-500 px-6 py-3 font-bold text-white" onClick={() => nav('/')}>先选一个角色吧 👋</button></Center>;
  }
  if (!lesson) {
    return <Center>正在打开工作台…</Center>;
  }

  const requiredTasks = lesson.tasks.filter((t) => !t.optional);
  const currentTask = requiredTasks.find((t) => !taskDone[t.id]) ?? null;
  const currentIdx = currentTask ? requiredTasks.indexOf(currentTask) : -1;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50">
      {/* 顶部悬浮条 */}
      <header className="z-30 flex items-center gap-2 border-b border-white/60 bg-white/70 px-3 py-2 backdrop-blur">
        <button onClick={() => nav('/map')} className="rounded-xl bg-white/80 px-3 py-1.5 font-bold shadow-sm hover:bg-white">← 地图</button>
        <h1 className="truncate text-lg font-black">{lesson.emoji} {lesson.title}</h1>
        {requiredTasks.length > 0 && (
          <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
            requiredTasksDone(lesson.tasks, taskDone) ? 'bg-violet-500 text-white' : 'bg-violet-100 text-violet-700'
          }`}>
            ✨ 发现 {requiredTasks.filter((t) => taskDone[t.id]).length}/{requiredTasks.length}
          </span>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => setBuddyOpen((v) => !v)}
            className={`rounded-xl px-3 py-1.5 font-bold shadow-sm transition ${
              buddyOpen ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            {settings.buddy.emoji} {buddyOpen ? '收起伙伴' : settings.buddy.name}
          </button>
          <button onClick={() => setSaveOpen(true)} className="rounded-xl bg-violet-500 px-3 py-1.5 font-bold text-white shadow-sm hover:bg-violet-600">💾 存作品</button>
          {/* 更多工具 */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl bg-white/80 px-3 py-1.5 font-bold shadow-sm hover:bg-white"
              title="更多工具"
            >
              ⋯
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl">
                  <MenuItem onClick={() => { setMenuOpen(false); cycleSpeed(); }}>{SPEED_LABEL[speed]}</MenuItem>
                  <MenuItem onClick={() => { setMenuOpen(false); setCodeText(wsApiRef.current?.getCode() ?? ''); setCodeOpen(true); }}>👀 魔法代码</MenuItem>
                  <MenuItem onClick={() => { setMenuOpen(false); toggleMute(); }}>{muted ? '🔊 打开音效' : '🔇 关掉音效'}</MenuItem>
                  <MenuItem onClick={() => { setMenuOpen(false); void toggleCam(); }}>{camOn ? '📷 关闭 AI 眼睛' : '📷 打开 AI 眼睛'}</MenuItem>
                  <MenuItem onClick={() => { setMenuOpen(false); toggleFullscreen(); }}>⛶ 全屏</MenuItem>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 舞台层（沉浸式）：全屏居中，伙伴打开时让位右移 */}
      <div className="relative min-h-0 flex-1">
        <div className={`absolute inset-0 p-4 transition-all duration-300 ${buddyOpen ? 'pr-[23rem]' : ''}`}>
          <Stage
            fit
            stage={stageRef.current}
            onCanvasReady={(c) => { canvasRef.current = c; }}
            onSpriteClick={() => { if (running) fireHat('click'); }}
          />
        </div>

        {/* 左上：任务卡（一次只聚焦一个任务，大字） */}
        {requiredTasks.length > 0 ? (
          <div className="absolute left-4 top-4 z-20 w-[19rem] max-w-[calc(100%-2rem)] rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur">
            {currentTask ? (
              <>
                <div className="text-xs font-bold tracking-wide text-violet-500">
                  🎯 当前任务 · 第 {currentIdx + 1} 步 / 共 {requiredTasks.length} 步
                </div>
                <div className="mt-1.5 text-xl font-black leading-snug text-slate-800">{currentTask.text}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setBuddyOpen(true);
                      buddyRef.current?.askInMode('hint', `我在做「${currentTask.text}」，给我一点提示！`);
                    }}
                    className="rounded-full bg-amber-400 px-4 py-1.5 text-sm font-bold text-white shadow hover:bg-amber-500"
                  >
                    💡 要提示
                  </button>
                  <button
                    onClick={() => setTaskListOpen((v) => !v)}
                    className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
                  >
                    {taskListOpen ? '▲ 收起清单' : '📋 全部任务'}
                  </button>
                </div>
                {taskListOpen && (
                  <div className="mt-3 max-h-[34vh] overflow-y-auto rounded-xl">
                    <TaskPanel
                      lesson={lesson}
                      taskDone={taskDone}
                      ideaHint={ideaHint}
                      onToggleManual={(id) => {
                        const next = { ...taskDoneRef.current, [id]: !taskDoneRef.current[id] };
                        setTaskDone(next);
                        maybeComplete(next);
                      }}
                      onAskHint={(text) => {
                        setBuddyOpen(true);
                        buddyRef.current?.askInMode('hint', `我在做「${text}」，给我一点提示！`);
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="text-3xl">🌟</div>
                <div className="mt-1 text-lg font-black text-violet-600">全部发现都点亮啦！</div>
                <div className="mt-1 text-sm text-slate-500">点 ▶ 再玩一次，或回地图解锁下一课</div>
                <button onClick={() => nav('/map')} className="mt-3 rounded-xl bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-emerald-600">回到地图 🏝</button>
              </div>
            )}
          </div>
        ) : (
          /* 自由模式：实验方向卡 */
          <div className="absolute left-4 top-4 z-20 max-h-[calc(100%-2rem)] w-[19rem] max-w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur">
            <h2 className="text-lg font-black">🧪 学科实验工坊</h2>
            {ideaHint && (
              <div className="mt-2 rounded-xl bg-violet-50 p-2.5 text-sm leading-relaxed text-violet-700">
                🧪 本次实验方向：{ideaHint}——需要什么本领就问{settings.buddy.name}
              </div>
            )}
            <div className="mt-2 space-y-2">
              {IDEAS.map((idea) => (
                <div key={idea.title} className="rounded-xl border border-slate-200 bg-white/70 p-2.5">
                  <div className="font-bold">{idea.emoji} {idea.title}</div>
                  <div className="text-xs text-slate-500">{idea.desc}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setBuddyOpen(true); buddyRef.current?.askInMode('idea', '给我 3 个今天就能做的小作品点子！'); }}
              className="mt-3 w-full rounded-xl bg-amber-400 px-3 py-2 font-bold text-white hover:bg-amber-500"
            >
              💡 问{settings.buddy.name}要更多点子
            </button>
          </div>
        )}

        {/* 右下：运行大按钮 */}
        <div className="absolute bottom-4 right-5 z-20 flex flex-col items-center gap-1.5">
          {running ? (
            <button onClick={handleStop} className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-3xl text-white shadow-xl ring-4 ring-white/60 hover:bg-rose-600 transition" title="停止">⏹</button>
          ) : (
            <button onClick={handleRun} className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white shadow-xl ring-4 ring-white/60 hover:scale-105 hover:bg-emerald-600 transition" title="运行">▶</button>
          )}
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
            {running ? '运行中 · 点角色可互动' : '点我运行'}
          </span>
        </div>

        {/* AI 伙伴浮动面板：始终挂载，收起时滑出（喝彩/引导语仍会进对话记录） */}
        <div
          className={`absolute bottom-24 right-3 top-3 z-30 w-[22rem] max-w-[calc(100%-1.5rem)] transition-all duration-300 ${
            buddyOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
          }`}
        >
          <AIBuddy
            ref={buddyRef}
            profileId={profile.id}
            buddy={settings.buddy}
            defaultMode={mode.kind === 'lesson' ? 'hint' : 'idea'}
            intro={lesson.aiIntro || `嗨！我是${settings.buddy.name}${settings.buddy.emoji} 今天我们做点什么好玩的？`}
            getContext={buildContext}
            catalog={blockCatalog}
            onBuildOps={handleBuildOps}
            getCurrentOps={() => {
              const ws = wsApiRef.current?.workspace as Blockly.WorkspaceSvg | undefined;
              return ws ? workspaceToOps(ws) : [];
            }}
          />
        </div>
      </div>

      {/* 底部积木抽屉：可收起，收起后舞台最大化（剧场模式） */}
      <div
        className={`z-40 shrink-0 overflow-hidden border-t border-slate-200 bg-white shadow-[0_-6px_24px_rgba(15,23,42,0.10)] transition-[height] duration-300 ${
          drawerOpen ? 'h-[46vh]' : 'h-12'
        }`}
      >
        {/* 抽屉把手行：编辑工具贴着编辑器 */}
        <div className="flex h-12 items-center gap-1.5 px-3">
          <button
            onClick={switchMode}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
            title={codeMode ? '回到积木画布' : '看看积木变成的 Python 代码（可以直接改！）'}
          >
            {codeMode ? '🧩 积木模式' : '🐍 代码模式'}
          </button>
          {codeMode ? (
            !lesson.codeLesson && (
              <ToolBtn title="用积木重新生成代码（会覆盖当前代码）" onClick={regenerateFromBlocks}>⟲ 从积木重新生成</ToolBtn>
            )
          ) : (
            <>
              <ToolBtn title="撤销（放错积木不要紧）" onClick={() => wsApiRef.current?.workspace.undo(false)}>↩️</ToolBtn>
              <ToolBtn title="重做" onClick={() => wsApiRef.current?.workspace.undo(true)}>↪️</ToolBtn>
              <ToolBtn title="把积木排整齐" onClick={() => wsApiRef.current?.workspace.cleanUp()}>🧹 整理</ToolBtn>
              <ToolBtn title="切换运行速度：慢速能看清每一步" onClick={cycleSpeed}>{SPEED_LABEL[speed]}</ToolBtn>
            </>
          )}
          <span className="ml-auto hidden text-xs text-slate-400 sm:block">画布会自动保存，放心关掉</span>
          {lesson.exercises && lesson.exercises.length > 0 && (
            <ToolBtn title="随堂小练：检验这课学得牢不牢" onClick={() => setQuizOpen(true)}>📝 随堂小练</ToolBtn>
          )}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className={`ml-1.5 rounded-xl px-3 py-1.5 text-sm font-bold shadow-sm transition ${
              drawerOpen ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-sky-100 text-sky-700 hover:bg-sky-200 animate-pulse'
            }`}
            title={drawerOpen ? '收起积木，全屏看舞台' : '展开积木画布'}
          >
            {drawerOpen ? '▾ 收起看舞台' : '▴ 展开积木'}
          </button>
        </div>

        {/* 抽屉内容：积木 / 代码编辑器（保持挂载，收起仅视觉裁掉，切课草稿不丢） */}
        <div className="relative h-[calc(46vh-3rem)]" key={lesson.id}>
          <div className={`h-full ${codeMode ? 'hidden' : ''}`}>
            {progressReady ? (
              <BlocklyWorkspace
                toolbox={toolbox}
                initialXml={lesson.starterXml}
                onReady={(api) => {
                  wsApiRef.current = api;
                  execRef.current = new Executor(api.workspace, stageRef.current);
                  (window as unknown as { __islandWs?: unknown }).__islandWs = api;
                  (window as unknown as { __islandStage?: unknown }).__islandStage = stageRef.current;
                  setWsReady(true);
                }}
                onChange={handleWorkspaceChange}
                onFlush={(xml) => {
                  clearTimeout(draftTimer.current);
                  if (profile) void api.updateProgress(profile.id, { lessonId: lesson.id, draft: xml }).catch(() => {});
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">正在恢复你的画布…</div>
            )}
          </div>

          {codeMode && (
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-sm">
                <span className="font-bold text-slate-700">🐍 Python 代码</span>
                <span className="text-xs text-slate-400">和学校里学的 Python 是同一种语言！直接改，点 ▶ 就能跑</span>
              </div>
              <textarea
                value={codeText}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const ta = e.currentTarget;
                    const start = ta.selectionStart;
                    const next = codeText.slice(0, start) + '    ' + codeText.slice(ta.selectionEnd);
                    handleCodeChange(next);
                    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 4; });
                  }
                }}
                spellCheck={false}
                placeholder={'say("你好，Python！")\nfor _ in range(4):\n    move(80)\n    turn_right(90)'}
                className="min-h-0 flex-1 resize-none p-4 font-mono text-[15px] leading-7 text-slate-800 outline-none"
              />
              {codeError && (
                <div className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                  <b>第 {codeError.line} 行</b>：{codeError.message}{codeError.hint ? `（${codeError.hint}）` : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 魔法代码预览 */}
      {codeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setCodeOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 text-xl font-black">👀 你的积木变成了代码！</h3>
            <p className="mb-4 text-sm text-slate-500">
              你拖的每一块积木，在电脑里其实长这样。以后学文字编程（Python）时，就是直接写这些字——但现在你已经能「读」懂它们啦！
            </p>
            <pre className="rounded-2xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-emerald-300">{codeText || '（先拖几块积木，这里就会显示出代码）'}</pre>
            <div className="mt-4 text-right">
              <button onClick={() => setCodeOpen(false)} className="rounded-xl bg-slate-200 px-4 py-2 font-bold hover:bg-slate-300">知道了！</button>
            </div>
          </div>
        </div>
      )}

      {/* 保存作品弹窗 */}
      {saveOpen && (
        <Modal onClose={() => setSaveOpen(false)} title="💾 把作品挂到作品墙">
          <input
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            placeholder="给作品起个名字"
            maxLength={30}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-violet-400"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setSaveOpen(false)} className="rounded-xl bg-slate-200 px-4 py-2 font-bold">取消</button>
            <button onClick={() => void doSave()} className="rounded-xl bg-violet-500 px-4 py-2 font-bold text-white hover:bg-violet-600">保存</button>
          </div>
        </Modal>
      )}

      {/* 通关庆祝 */}
      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-2 text-6xl">🌟</div>
            <h2 className="mb-2 text-2xl font-black text-violet-600">新本领 GET！</h2>
            <p className="mb-3 whitespace-pre-wrap text-slate-600">{lesson.celebrate}</p>
            {lesson.curriculum ? (
              <div className="mb-6 rounded-2xl bg-emerald-50 p-3 text-left">
                <div className="mb-1.5 text-sm font-bold text-emerald-700">
                  📗 本课解锁的课本知识（{lesson.curriculum.stage}·{lesson.curriculum.module}）
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lesson.curriculum.points.map((p) => (
                    <span key={p} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">✓ {p}</span>
                  ))}
                </div>
              </div>
            ) : <p className="mb-6" />}
            <div className="flex justify-center gap-3">
              {lesson.exercises && lesson.exercises.length > 0 && (
                <button onClick={() => { setCelebrate(false); setQuizOpen(true); }} className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-white hover:bg-amber-500">📝 随堂小练</button>
              )}
              <button onClick={() => setCelebrate(false)} className="rounded-xl bg-slate-200 px-4 py-2 font-bold hover:bg-slate-300">再改进一下</button>
              <button onClick={() => nav('/map')} className="rounded-xl bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-emerald-600">回到地图 🏝</button>
            </div>
          </div>
        </div>
      )}

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
            void api.updateProgress(profile.id, {
              lessonId: lesson.id,
              exercise: { correct, total: lesson.exercises!.length },
              wrongAdds,
            }).catch(() => {});
          }}
        />
      )}

      {/* 护眼 20-20-20：连续 20 分钟远眺 20 秒 */}
      {restOverlay && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-900 to-sky-900 text-white">
          <div className="text-7xl">🌌</div>
          <h2 className="text-2xl font-black">眼睛小休息</h2>
          <p className="max-w-sm text-center leading-relaxed opacity-80">
            抬起头，看看窗外<b>最远</b>的地方，眨眨眼～ {restCountdown} 秒后继续冒险
          </p>
          <div className="text-5xl font-black tabular-nums">{restCountdown}</div>
          <button onClick={() => setRestOverlay(false)} className="rounded-xl bg-white/20 px-5 py-2 font-bold hover:bg-white/30">我休息好了</button>
        </div>
      )}

      {/* 到时锁定（家长开启 hardStop 后生效，PIN 解锁当日有效） */}
      {locked && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-slate-900/95 p-6 text-white">
          <div className="text-7xl">🌙</div>
          <h2 className="text-2xl font-black">今天的创作时间用完啦</h2>
          <p className="max-w-sm text-center text-white/70">作品都保存好了。早点休息，明天的小岛还有新冒险等你！</p>
          <div className="mt-2 flex gap-2">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void unlockWithPin()}
              placeholder="家长 PIN"
              className="w-36 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-center text-xl tracking-widest outline-none"
            />
            <button onClick={() => void unlockWithPin()} className="rounded-xl bg-white/20 px-4 py-2 font-bold hover:bg-white/30">解锁</button>
          </div>
          <button onClick={() => nav('/map')} className="rounded-xl bg-white/10 px-5 py-2 text-sm hover:bg-white/20">回地图看看作品</button>
        </div>
      )}

      {/* AI 眼睛的隐藏视频源 */}
      <video ref={hiddenVideoRef} playsInline muted className="hidden" />

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-800/90 px-5 py-3 text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function ToolBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-sky-700"
    >
      {children}
    </button>
  );
}

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
    >
      {children}
    </button>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen items-center justify-center text-lg">{children}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-black">{title}</h3>
        {children}
      </div>
    </div>
  );
}
