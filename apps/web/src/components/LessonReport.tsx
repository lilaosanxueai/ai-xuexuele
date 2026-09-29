import type { Lesson } from '@shared/types.ts';
import type { NextStep } from '../runtime/nextStep.ts';

interface Props {
  lesson: Lesson;
  correct: number;
  total: number;
  /** 本轮进错题本的题数 */
  wrongCount: number;
  /** 本轮获得的学习之星（XP） */
  xpGained?: number;
  /** 难度自适应下一站建议（可选：无课程表数据时不显示） */
  nextStep?: NextStep | null;
  onGoNext?: (path: string) => void;
  onClose: () => void;
  onGoWrongbook: () => void;
}

/** 评语（学而思课堂反馈式：先肯定，再给一条具体建议） */
function commentOf(pct: number, wrongCount: number): { head: string; body: string } {
  if (pct >= 100) return { head: '满分通关！', body: '这一课的知识点已经扎实掌握，可以放心进入下一课。记得过两天回来做一道错题保持手感。' };
  if (pct >= 75) return { head: '掌握得不错！', body: wrongCount > 0 ? `还差 ${wrongCount} 道题的火候：去错题本看解析，弄懂「为什么选它」，比多刷十道新题更值。` : '继续保持，稳扎稳打。' };
  if (pct >= 50) return { head: '及格线以上，还能更稳', body: '建议回到「📖 讲解」重读对应章节，重点看【高亮框】里的定义，再来一轮小练。' };
  return { head: '这一课需要重学', body: '别灰心——先读开场一问，再跟着讲解一步步来，然后把这一课的随堂小练重做一遍。弄懂比做快重要。' };
}

/** 课堂报告（学而思式课后反馈卡）：得分环 + 知识点清单 + 学习路径 + 老师评语 */
export default function LessonReport({ lesson, correct, total, wrongCount, xpGained, nextStep, onGoNext, onClose, onGoWrongbook }: Props) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const C = 2 * Math.PI * 44; // r=44 的周长
  const points = lesson.curriculum?.points ?? [];
  const goals = lesson.goals ?? [];
  const c = commentOf(pct, wrongCount);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto">
        {/* 头部：课程 + 得分环 */}
        <div className="bg-gradient-to-b from-sky-600 to-sky-500 px-6 pb-6 pt-5 text-white">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-100">课堂报告 · {lesson.subjectArea ?? '学习'}</div>
              <h3 className="mt-1 truncate text-lg font-black">{lesson.emoji} {lesson.title}</h3>
              <div className="mt-1 text-xs text-sky-100">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} · 随堂小练</div>
            </div>
              <button onClick={onClose} className="rounded-full bg-white/20 px-2.5 py-1 text-sm font-bold hover:bg-white/30">✕</button>
            </div>
            {xpGained != null && xpGained > 0 && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/95 px-3.5 py-1.5 text-sm font-black text-white shadow">
                ⭐ 本课获得 {xpGained} 颗学习之星
              </div>
            )}
          <div className="mt-4 flex items-center gap-5">
            <div className="relative h-28 w-28 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="9" />
                <circle
                  cx="50" cy="50" r="44" fill="none" stroke={pct >= 90 ? '#6ee7b7' : pct >= 60 ? '#fde68a' : '#fda4af'}
                  strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(pct / 100) * C} ${C}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{pct}</span>
                <span className="text-[10px] font-bold text-sky-100">正确率</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold">答对 {correct} / {total} 题</div>
              <div className="mt-1 text-xs leading-relaxed text-sky-100">
                {wrongCount > 0 ? `${wrongCount} 道错题已收进错题本，巩固后消灭它们。` : '没有错题，本课掌握扎实！'}
              </div>
            </div>
          </div>
        </div>

        {/* 知识点掌握 */}
        {points.length > 0 && (
          <div className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-black text-slate-700">🎯 本课知识点</div>
            <div className="flex flex-wrap gap-1.5">
              {points.map((p) => (
                <span key={p} className={`rounded-full px-2.5 py-1 text-xs font-bold ${pct >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {pct >= 90 ? '✓ ' : '▸ '}{p}
                </span>
              ))}
            </div>
            {goals.length > 0 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                学习目标：{goals.join(' · ')}
              </p>
            )}
          </div>
        )}

        {/* 学习路径四步 */}
        <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-black text-slate-700">🧭 学习路径</div>
          <div className="flex items-center gap-1 text-[11px] font-bold">
            {['预习', '学习', '小练', '巩固'].map((s, i) => {
              const now = i === 3 && wrongCount > 0;
              const done = i < 3 || wrongCount === 0;
              return (
                <div key={s} className="flex items-center">
                  {i > 0 && <div className={`mx-1 h-[3px] w-4 rounded-full ${done || now ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                  <span className={`flex items-center gap-1 rounded-full px-2 py-1 ${now ? 'bg-sky-600 text-white' : done ? 'text-emerald-700' : 'text-slate-400'}`}>
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${now ? 'bg-white/25' : done ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>{done ? '✓' : i + 1}</span>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {wrongCount > 0 ? '巩固：错题本里有本课错题，练对即移出。' : '巩固：本课暂无待消灭错题。'}
          </p>
        </div>

        {/* 老师评语 */}
        <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-1.5 text-sm font-black text-slate-700">💬 老师的话</div>
          <div className="text-[13px] font-bold text-slate-600">{c.head}</div>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{c.body}</p>
        </div>
        <div className="pb-3" />
        </div>

        {/* 下一站（难度自适应：高分进阶/低分补基础/中间顺位） */}
        {nextStep && (
          <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-1.5 text-sm font-black text-slate-700">🧭 下一站</div>
            <p className="text-[13px] leading-relaxed text-slate-500">{nextStep.reason}</p>
            {onGoNext && (
              <button
                onClick={() => onGoNext(nextStep.path)}
                className="mt-2.5 flex w-full items-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 p-3 text-left text-white shadow-md transition hover:brightness-110"
              >
                <span className="text-2xl">{nextStep.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black">{nextStep.title}</span>
                  <span className="text-[11px] opacity-80">立即前往 →</span>
                </span>
              </button>
            )}
          </div>
        )}

        {/* 动作（固定底栏：不随内容滚动，永远可见） */}
        <div className="flex gap-2 border-t border-slate-200 bg-white/90 p-4">
          {wrongCount > 0 ? (
            <button onClick={onGoWrongbook} className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:bg-rose-600">
              🎯 去错题本消灭 {wrongCount} 道错题
            </button>
          ) : (
            <button onClick={onClose} className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:bg-emerald-600">
              ✅ 完成这一课
            </button>
          )}
          <button onClick={onClose} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200">关闭</button>
        </div>
      </div>
    </div>
  );
}
