import { useRef, useState } from 'react';
import type { Exercise } from '@shared/types.ts';
import { blankCorrect } from '../runtime/exerciseUtils.ts';

/** 一道错题的原始信息：题目下标 + 孩子当时选的选项（填空题为 -1，原始输入见 input） */
export interface WrongPick { idx: number; pick: number; input?: string }

interface Props {
  title: string;
  exercises: Exercise[];
  /** 结束回调：答对数 + 错题明细（下标与错误选项） */
  onDone: (correct: number, wrongs: WrongPick[]) => void;
  onClose: () => void;
}

/** 答题音效（WebAudio 本地合成，不联网）：正确=双音上行，错误=短低音 */
let audioCtx: AudioContext | null = null;
function playTone(ok: boolean) {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const t = audioCtx.currentTime;
    const beep = (freq: number, at: number, dur: number) => {
      const o = audioCtx!.createOscillator();
      const g = audioCtx!.createGain();
      o.frequency.value = freq;
      o.type = 'sine';
      g.gain.setValueAtTime(0.12, t + at);
      g.gain.exponentialRampToValueAtTime(0.001, t + at + dur);
      o.connect(g).connect(audioCtx!.destination);
      o.start(t + at);
      o.stop(t + at + dur);
    };
    if (ok) { beep(660, 0, 0.1); beep(880, 0.09, 0.14); }
    else beep(200, 0, 0.18);
  } catch { /* 无声环境不影响答题 */ }
}

/** 词卡模式：所有选项都短（≤12 字）时用 2×2 大词卡呈现，更像互动练习而非试卷 */
function isCardMode(ex: Exercise): boolean {
  return (ex.options ?? []).every((o) => String(o ?? '').length <= 12);
}

/** 随堂小练：逐题作答 → 立即判分与解析 → 成绩单（词卡/列表双形态 + 音效 + 连击） */
export default function ExercisePanel({ title, exercises, onDone, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  /** 填空题：已填文本 / 已判分标记 */
  const [blankInput, setBlankInput] = useState('');
  const [blankJudged, setBlankJudged] = useState<null | boolean>(null);
  const blankRef = useRef<HTMLInputElement | null>(null);
  const wrongsRef = useRef<WrongPick[]>([]);

  const ex = exercises[idx];
  const isBlank = ex.type === 'blank' && !!ex.blank;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === ex.answer;
    if (ok) { setCorrect((c) => c + 1); setStreak((s) => s + 1); }
    else { wrongsRef.current.push({ idx, pick: i }); setStreak(0); }
    playTone(ok);
  };

  /** 填空判分：词库点选走 pick；键盘输入在此判 */
  const judgeBlank = () => {
    if (blankJudged !== null) return;
    const ok = blankCorrect(ex, blankInput);
    setBlankJudged(ok);
    if (ok) { setCorrect((c) => c + 1); setStreak((s) => s + 1); }
    else { wrongsRef.current.push({ idx, pick: -1, input: blankInput }); setStreak(0); }
    playTone(ok);
  };

  const blankLocked = isBlank ? blankJudged !== null : picked !== null;

  const next = () => {
    if (idx + 1 >= exercises.length) {
      setFinished(true);
      onDone(correct, wrongsRef.current); // correct 已在判分中累计
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
    setBlankInput('');
    setBlankJudged(null);
    setTimeout(() => blankRef.current?.focus(), 80);
  };

  // 读题（Web Speech 本地语音，不联网；不支持的环境自动隐藏按钮）
  const ttsOk = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = (text: string) => {
    if (!ttsOk) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[💡✅❌🔊]/g, ''));
    u.lang = 'zh-CN';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
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
          <span className="text-xs text-slate-400">
            第 {idx + 1}/{exercises.length} 题 · 已对 {correct}
            {streak >= 3 && <b className="ml-1 text-orange-500">🔥×{streak}</b>}
          </span>
        </div>
        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-slate-50 p-3">
          <div className="min-w-0 flex-1 text-[15px] font-semibold leading-relaxed text-slate-800">{ex.q}</div>
          {ttsOk && (
            <button onClick={() => speak(ex.q)} title="读题" className="shrink-0 rounded-xl bg-white px-2.5 py-1.5 text-lg shadow-sm transition hover:bg-sky-50">🔊</button>
          )}
        </div>
        {isBlank && ex.blank ? (
          /* 填空模式：题干 ___ 高亮 + 词库点选或键盘输入 */
          (() => {
            const bank = ex.blank.bank;
            const ok = blankJudged === true;
            const bad = blankJudged === false;
            return (
              <div>
                <div className="mb-3 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/60 p-3 text-center text-[17px] font-bold leading-relaxed text-slate-800">
                  {ex.q.split('___').map((seg, i, arr) => (
                    <span key={i}>
                      {seg}
                      {i < arr.length - 1 && (
                        <span className={`mx-1 inline-block min-w-16 rounded-lg border-b-4 px-2 ${ok ? 'border-emerald-400 text-emerald-600' : bad ? 'border-rose-400 text-rose-600' : 'border-sky-300 text-sky-500'}`}>
                          {ok || bad ? (ok ? ex.blank!.answerText : (blankInput.trim() || '？')) : (bank ? blankInput : '____')}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                {bank ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    {bank.map((w) => (
                      <button
                        key={w}
                        disabled={blankJudged !== null || blankInput === w}
                        onClick={() => { setBlankInput(w); setTimeout(() => { setBlankJudged(blankCorrect(ex, w)); const o = blankCorrect(ex, w); if (o) { setCorrect((c) => c + 1); setStreak((s) => s + 1); } else { wrongsRef.current.push({ idx, pick: bank.indexOf(w), input: w }); setStreak(0); } playTone(o); }, 120); }}
                        className={`rounded-2xl border-2 px-5 py-3 text-[16px] font-bold transition ${
                          blankInput === w
                            ? ok ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : bad ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-sky-400 bg-sky-50 text-sky-700'
                            : blankJudged !== null ? 'border-slate-100 text-slate-300'
                            : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-sky-300'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      ref={blankRef}
                      value={blankInput}
                      disabled={blankJudged !== null}
                      onChange={(e) => setBlankInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') judgeBlank(); }}
                      placeholder="在这里填答案，回车确定"
                      autoFocus
                      className={`flex-1 rounded-2xl border-2 px-4 py-3 text-center text-[17px] font-bold outline-none transition ${
                        ok ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : bad ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 focus:border-sky-400'
                      }`}
                    />
                    {blankJudged === null && (
                      <button onClick={judgeBlank} disabled={!blankInput.trim()} className="shrink-0 rounded-2xl bg-sky-500 px-5 py-3 font-bold text-white shadow transition hover:bg-sky-600 disabled:opacity-40">确定</button>
                    )}
                  </div>
                )}
                {bad && (
                  <p className="mt-2 text-center text-sm font-bold text-emerald-600">正确答案：{ex.blank.answerText}</p>
                )}
              </div>
            );
          })()
        ) : isCardMode(ex) ? (
          /* 词卡模式：2×2 大词卡点选（短选项题自动启用） */
          <div className="grid grid-cols-2 gap-2.5">
            {ex.options.map((opt, i) => {
              const isAnswer = i === ex.answer;
              const isPicked = picked === i;
              const show = picked !== null;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  className={`rounded-2xl border-2 px-3 py-4 text-center text-[15px] font-bold leading-snug transition ${
                    show && isAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : show && isPicked ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : picked === null ? 'border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50'
                      : 'border-slate-100 text-slate-400'
                  }`}
                >
                  {opt}
                  {show && isAnswer && ' ✅'}
                  {show && isPicked && !isAnswer && ' ❌'}
                </button>
              );
            })}
          </div>
        ) : (
          /* 列表模式：长选项题（如完整句子）保持 ABCD 行式 */
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
        )}
        {blankLocked && (
          <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
            💡 {ex.explain}
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-300">先不练了</button>
          {blankLocked && (
            <button onClick={next} className="rounded-xl bg-sky-500 px-5 py-2 font-bold text-white hover:bg-sky-600">
              {idx + 1 >= exercises.length ? '看成绩' : '下一题 →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
