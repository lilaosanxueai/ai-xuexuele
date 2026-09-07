import { useState } from 'react';
import type { Exercise } from '@shared/types.ts';

interface Props {
  title: string;
  exercises: Exercise[];
  onDone: (correct: number) => void;
  onClose: () => void;
}

/** 随堂小练：逐题作答 → 立即判分与解析 → 成绩单 */
export default function ExercisePanel({ title, exercises, onDone, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const ex = exercises[idx];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === ex.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= exercises.length) {
      setFinished(true);
      onDone(correct + (picked === ex.answer ? 0 : 0)); // correct 已在 pick 中累计
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  };

  if (finished) {
    const full = correct === exercises.length;
    return (
      <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="text-6xl">{full ? '🏆' : correct >= exercises.length / 2 ? '👍' : '💪'}</div>
          <h3 className="mt-3 text-2xl font-black text-slate-800">{correct} / {exercises.length} 题正确</h3>
          <p className="mt-2 text-sm text-slate-500">
            {full ? '全对！这个知识点稳了' : correct >= exercises.length / 2 ? '不错！看看错题解析会更扎实' : '再看看解析，然后重学一遍这课，你可以的'}
          </p>
          <button onClick={onClose} className="mt-5 rounded-xl bg-sky-500 px-6 py-2.5 font-bold text-white hover:bg-sky-600">完成</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-black text-slate-800">📝 {title} · 随堂小练</h3>
          <span className="text-xs text-slate-400">第 {idx + 1}/{exercises.length} 题 · 已对 {correct}</span>
        </div>
        <div className="mb-4 rounded-2xl bg-slate-50 p-3 text-[15px] font-semibold leading-relaxed text-slate-800">{ex.q}</div>
        <div className="space-y-2">
          {ex.options.map((opt, i) => {
            const isAnswer = i === ex.answer;
            const isPicked = picked === i;
            const show = picked !== null;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className={`w-full rounded-xl border-2 px-4 py-2.5 text-left text-[15px] transition ${
                  show && isAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                    : show && isPicked ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : picked === null ? 'border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                    : 'border-slate-100 text-slate-400'
                }`}
              >
                <span className="mr-2 font-black">{'ABCD'[i]}.</span>{opt}
                {show && isAnswer && ' ✅'}
                {show && isPicked && !isAnswer && ' ❌'}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
            💡 {ex.explain}
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-300">先不练了</button>
          {picked !== null && (
            <button onClick={next} className="rounded-xl bg-sky-500 px-5 py-2 font-bold text-white hover:bg-sky-600">
              {idx + 1 >= exercises.length ? '看成绩' : '下一题 →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
