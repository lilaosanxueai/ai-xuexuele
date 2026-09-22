import type { Teach } from '@shared/types.ts';

/** 本地语音朗读（Web Speech，不联网；不支持的环境隐藏按钮） */
const ttsOk = typeof window !== 'undefined' && 'speechSynthesis' in window;
function speak(text: string) {
  if (!ttsOk) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[【】💡✏️⚠️✗]/g, ''));
  u.lang = 'zh-CN';
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

/**
 * 教材级讲解面板（自学正文）：概念精讲 + 例题分步 + 易错点。
 * 像课本一页：定义准确、步骤完整，孩子不需要 AI 也能自己学懂。
 */
export default function TeachPanel({ teach, compact = false, onFinish }: { teach: Teach; compact?: boolean; onFinish?: () => void }) {
  return (
    <div className={compact ? 'space-y-4' : 'space-y-5'}>
      {/* 概念精讲 */}
      {teach.sections.map((sec, i) => (
        <section key={i} className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-2.5 flex items-center gap-2 text-base font-black text-slate-800">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-xs text-sky-700">{i + 1}</span>
            {sec.title}
            {ttsOk && (
              <button onClick={() => speak(sec.title + '。' + sec.body)} title="朗读本节" className="ml-auto shrink-0 rounded-xl bg-slate-100 px-2.5 py-1 text-base transition hover:bg-sky-100">🔊</button>
            )}
          </h3>
          <div className="space-y-2">
            {sec.body.split('\n').map((p, j) =>
              p.trim().startsWith('【') ? (
                <p key={j} className="rounded-xl border-l-4 border-sky-400 bg-sky-50 px-3 py-2 text-[15px] font-bold leading-relaxed text-sky-900">{p}</p>
              ) : (
                <p key={j} className="text-[15px] leading-[1.9] text-slate-700">{p}</p>
              ),
            )}
          </div>
        </section>
      ))}

      {/* 例题精讲 */}
      {teach.examples.length > 0 && (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-black text-slate-800">✏️ 例题精讲</h3>
          <div className="space-y-4">
            {teach.examples.map((ex, i) => (
              <div key={i} className="rounded-2xl border border-slate-200">
                <div className="rounded-t-2xl bg-slate-50 px-4 py-3 text-[15px] font-bold leading-relaxed text-slate-800">
                  <span className="mr-1.5 rounded-md bg-slate-700 px-1.5 py-0.5 text-xs text-white">例{i + 1}</span>
                  {ex.q}
                </div>
                <ol className="space-y-1.5 px-5 py-3">
                  {ex.steps.map((s, j) => (
                    <li key={j} className="flex gap-2 text-[14px] leading-relaxed text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">{j + 1}</span>
                      <span className="flex-1">{s}</span>
                    </li>
                  ))}
                </ol>
                {ex.tip && (
                  <div className="mx-4 mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[13px] leading-relaxed text-amber-800">
                    💡 {ex.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 易错点 */}
      {teach.mistakes?.length ? (
        <section className="rounded-2xl bg-rose-50/70 p-5">
          <h3 className="mb-2 text-base font-black text-rose-700">⚠️ 易错点</h3>
          <ul className="space-y-1.5">
            {teach.mistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-rose-900">
                <span className="mt-0.5 shrink-0 font-black text-rose-400">✗</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 读完讲解 → 随堂测（自学闭环的衔接） */}
      {onFinish && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onFinish}
            className="rounded-2xl bg-emerald-500 px-8 py-3 text-base font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            我读完了，开始随堂小练 →
          </button>
        </div>
      )}
    </div>
  );
}
