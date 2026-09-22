import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Exercise, Lesson, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import ExercisePanel from '../components/ExercisePanel.tsx';
import { SUBJECTS, SUBJECT_STYLE } from '../components/subjectMeta.ts';

/** 学科页：该学科按学段分组的全部课程，含课标标注。理科动态演示课进互动实验室，其余进辅导页 */
const BAND_ORDER = ['primary', 'junior', 'senior'] as const;
const BAND_LABEL: Record<string, string> = { primary: '小学', junior: '初中', senior: '高中衔接' };
/** 理科五科 + 科学（内容动态化 + 动态互动先行）；其他学科若有 lab 字段（如新文科互动课）同样进实验室 */
const LAB_SUBJECTS = new Set(['数学', '物理', '化学', '生物', '地理', '科学']);
const isLabLesson = (l: Lesson) => (LAB_SUBJECTS.has(l.subjectArea ?? '') || !!l.lab) && !!(l.lab || l.starterCode);

export default function SubjectScreen() {
  const nav = useNavigate();
  const { area = '' } = useParams();
  const subject = decodeURIComponent(area);
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);
  /** 单元测验（猿题库/学而思式模块级组卷）：模块名 + 抽好的题 */
  const [unitTest, setUnitTest] = useState<{ module: string; exercises: Exercise[] } | null>(null);

  /** 从模块内的课程随堂题抽 8 道组卷（每课最多 2 道，打散顺序） */
  const assembleUnitTest = (mod: string): Exercise[] => {
    const pool: Exercise[] = [];
    for (const l of lessons) {
      if ((l.curriculum?.module ?? '其他') !== mod) continue;
      const exs = l.exercises ?? [];
      // 每课抽后 3 题里的 2 道（前 3 题是基础，单元测验偏综合）
      const picks = [3, 4, 5].filter((i) => exs[i]).map((i) => exs[i]);
      pool.push(...picks.slice(0, 2).map((e) => ({ ...e })));
    }
    // Fisher-Yates 打散
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 8);
  };
  const startUnitTest = (mod: string) => setUnitTest({ module: mod, exercises: assembleUnitTest(mod) });

  /** 单元小测打印：纸质卷 + 答案页 */
  const [printing, setPrinting] = useState(false);
  const printUnitTest = (mod: string) => {
    setUnitTest({ module: mod, exercises: assembleUnitTest(mod) });
    setPrinting(true);
    setTimeout(() => { window.print(); setPrinting(false); }, 120);
  };

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

  // 知识图谱掌握度（松鼠AI式）：按课标模块聚合——做过的课按随堂正确率计掌握度
  const modules = new Map<string, { done: number; total: number; masterySum: number; masteryN: number }>();
  for (const l of mine) {
    const mod = l.curriculum?.module ?? '其他';
    const m = modules.get(mod) ?? { done: 0, total: 0, masterySum: 0, masteryN: 0 };
    m.total++;
    if (progress?.lessons[l.id]?.status === 'completed') m.done++;
    const ex = progress?.exercises?.[l.id];
    if (ex && ex.total > 0) { m.masterySum += ex.correct / ex.total; m.masteryN++; }
    modules.set(mod, m);
  }

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

        {/* 期末模拟卷：全学科抽题组卷 + 限时 + 模块诊断 */}
        <button
          onClick={() => nav(`/exam/${encodeURIComponent(subject)}`)}
          className="mb-4 flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-sky-500 p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5"
        >
          <div className="text-4xl">📝</div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-black">期末模拟卷</div>
            <div className="text-xs opacity-85">全学科抽 20 题 · 限时 30 分钟 · 结卷按课标模块诊断薄弱点</div>
          </div>
          <div className="shrink-0 rounded-xl bg-white/20 px-4 py-2 text-sm font-bold">开考 →</div>
        </button>

        {/* 知识图谱掌握度（松鼠AI 式模块级诊断）；无成绩时也显示（全部"未检测"），保证单元小测入口常在 */}
        {modules.size > 1 && (
          <section className="mb-8 rounded-3xl bg-white/85 p-5 shadow-sm">
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-700">🧠 知识图谱掌握度</h2>
              <span className="text-xs text-slate-400">按课标模块诊断 · 数据来自随堂练正确率</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[...modules.entries()]
                .sort((a, b) => (b[1].masteryN ? b[1].masterySum / b[1].masteryN : -1) - (a[1].masteryN ? a[1].masterySum / a[1].masteryN : -1))
                .map(([mod, m]) => {
                  const mastery = m.masteryN ? Math.round((m.masterySum / m.masteryN) * 100) : -1;
                  const col = mastery < 0 ? '#cbd5e1' : mastery >= 80 ? '#16a34a' : mastery >= 60 ? '#f59e0b' : '#dc2626';
                  return (
                    <div key={mod} className="rounded-2xl bg-slate-50 p-3">
                      <div className="mb-1.5 flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-bold text-slate-700">{mod}</span>
                        <span className="shrink-0 text-xs font-black" style={{ color: col }}>
                          {mastery < 0 ? '未检测' : `${mastery}%`}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full transition-all" style={{ width: `${mastery < 0 ? 0 : mastery}%`, background: col }} />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">已学 {m.done}/{m.total} 课{mastery >= 0 && mastery < 60 ? ' · 薄弱模块，优先巩固' : ''}</span>
                        <span className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => printUnitTest(mod)}
                            className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-200"
                            title="打印本模块纸质试卷（含答案页）"
                          >
                            🖨 打印
                          </button>
                          <button
                            onClick={() => startUnitTest(mod)}
                            className="shrink-0 rounded-lg bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 transition hover:bg-violet-200"
                            title="综合该模块多课的题目进行测验"
                          >
                            📝 单元小测
                          </button>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

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
                    onClick={() => nav(isLabLesson(l) ? `/lab/${l.id}` : `/tutor/${l.id}`)}
                    className={`flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${isDone ? `ring-2 ${style.ring}` : ''}`}
                  >
                    <div className="text-3xl">{l.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-bold text-slate-800">{l.title}</span>
                        {isLabLesson(l) && <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">🔬 互动实验</span>}
                        {l.codeLesson && <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-white">Python</span>}
                        {l.grade != null && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{l.grade}年级</span>}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-slate-400">
                        {l.subject ? `${l.subject.emoji} ${l.subject.name}` : l.curriculum ? `📗 ${l.curriculum.module}` : ''}
                        {l.curriculum ? ` · ${l.curriculum.points.slice(0, 2).join(' / ')}` : ''}
                        {l.textbook ? ` · 📚 ${l.textbook}` : ''}
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

      {/* 单元测验（模块级综合测评） */}
      {unitTest && unitTest.exercises.length > 0 && (
        <ExercisePanel
          title={`单元小测 · ${unitTest.module}`}
          exercises={unitTest.exercises}
          onClose={() => setUnitTest(null)}
          onDone={(correct) => {
            setUnitTest(null);
            alert(`单元小测完成：${correct}/${unitTest.exercises.length} 道正确${correct === unitTest.exercises.length ? '，满分！🎉' : correct / unitTest.exercises.length >= 0.6 ? '，模块基本掌握 ✓' : '，建议回看该模块的薄弱课程'}`);
          }}
        />
      )}

      {/* 单元小测打印浮层：纸质卷 + 答案页 */}
      {printing && unitTest && (
        <div id="unit-sheet" className="fixed inset-0 z-[80] overflow-y-auto bg-white p-8 text-slate-900">
          <style>{'@media print { body * { visibility: hidden !important; } #unit-sheet, #unit-sheet * { visibility: visible !important; } #unit-sheet { position: absolute !important; left: 0; top: 0; width: 100%; background: #fff; } }'}</style>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-center text-2xl font-black">{subject} · {unitTest.module} 单元测验卷</h1>
            <p className="mt-1 text-center text-sm text-slate-500">共 {unitTest.exercises.length} 题 · 来自 AI学学乐课程库 · {new Date().toLocaleDateString('zh-CN')}</p>
            <p className="mt-1 text-center text-xs text-slate-400">姓名：____________　得分：______</p>
            <div className="mt-6 space-y-5">
              {unitTest.exercises.map((ex, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="font-semibold">{i + 1}. {ex.q}</div>
                  <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {ex.options.map((opt, oi) => (<div key={oi}>{'ABCD'[oi]}. {opt}</div>))}
                  </div>
                  <div className="mt-1 text-sm">答：（　　　　）</div>
                </div>
              ))}
            </div>
            <div className="mt-10 break-before-page border-t border-slate-300 pt-6">
              <h2 className="text-lg font-black">参考答案</h2>
              <ol className="mt-2 grid grid-cols-2 gap-1 text-sm">
                {unitTest.exercises.map((ex, i) => (<li key={i}>{i + 1}. {'ABCD'[ex.answer]}　{ex.explain.slice(0, 40)}</li>))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
