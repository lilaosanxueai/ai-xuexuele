import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { bankFor, checkWord, maskHint, sampleWords, type DictSubject, type DictWord } from '../runtime/dictation.ts';

const CN_GRADES = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
const EN_GRADES = ['三年级', '四年级', '五年级', '六年级', '七年级', '八年级'];

/** 本地累计统计（按档案存 localStorage） */
interface DictStats { totalWords: number; sessions: number; bestAccuracy: number; }
const statsKey = (pid: string) => `island-dictation-${pid}`;
function readStats(pid: string): DictStats {
  try { return { totalWords: 0, sessions: 0, bestAccuracy: 0, ...JSON.parse(localStorage.getItem(statsKey(pid)) ?? '{}') }; }
  catch { return { totalWords: 0, sessions: 0, bestAccuracy: 0 }; }
}
function writeStats(pid: string, s: DictStats) {
  try { localStorage.setItem(statsKey(pid), JSON.stringify(s)); } catch { /* 忽略 */ }
}

/**
 * ✍️ 听写训练：TTS 报词 → 键入拼写 → 即时判分。
 * 语文生字词（首字提示）/ 英语单词（中文释义提示）；错词进入重练循环。
 */
export default function DictationScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [phase, setPhase] = useState<'setup' | 'session' | 'review'>('setup');
  const [subject, setSubject] = useState<DictSubject>('语文');
  const [grade, setGrade] = useState('三年级');
  const [queue, setQueue] = useState<DictWord[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'ok' | 'bad'>('none');
  const [showHint, setShowHint] = useState(false);
  const [firstTryOk, setFirstTryOk] = useState(0);
  const [wrongWords, setWrongWords] = useState<DictWord[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const stats = useMemo(() => (profile ? readStats(profile.id) : { totalWords: 0, sessions: 0, bestAccuracy: 0 }), [profile, phase]);

  const ttsOk = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speakWord = (w: string, subj: DictSubject = subject) => {
    if (!ttsOk) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w);
    u.lang = subj === '英语' ? 'en-US' : 'zh-CN';
    u.rate = subj === '英语' ? 0.75 : 0.85;
    window.speechSynthesis.speak(u);
  };

  // 换词自动报读 + 聚焦输入框
  useEffect(() => {
    if (phase !== 'session' || !queue[idx]) return;
    const t = setTimeout(() => {
      speakWord(queue[idx].word);
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx, queue]);

  if (!profile) return null;
  const grades = subject === '语文' ? CN_GRADES : EN_GRADES;
  const cur = queue[idx];

  const startRound = (words: DictWord[]) => {
    setQueue(words);
    setIdx(0);
    setInput('');
    setFeedback('none');
    setShowHint(false);
    setFirstTryOk(0);
    setWrongWords([]);
    setPhase('session');
  };

  const begin = () => {
    const bank = bankFor(subject, grade);
    if (bank.length === 0) return;
    startRound(sampleWords(bank, 10));
  };

  const finishRound = (okCount: number, wrongs: DictWord[]) => {
    const total = queue.length || 10;
    const accuracy = Math.round((okCount / total) * 100);
    const s = readStats(profile.id);
    writeStats(profile.id, {
      totalWords: s.totalWords + total,
      sessions: s.sessions + 1,
      bestAccuracy: Math.max(s.bestAccuracy, accuracy),
    });
    setWrongWords(wrongs);
    setPhase('review');
  };

  const submit = () => {
    if (feedback !== 'none' || !cur || input.trim() === '') return;
    const ok = checkWord(input, cur.word, subject);
    if (ok) {
      setFeedback('ok');
      const nextOk = firstTryOk + 1;
      setFirstTryOk(nextOk);
      setTimeout(() => {
        if (idx + 1 >= queue.length) finishRound(nextOk, wrongWords);
        else { setIdx(idx + 1); setInput(''); setFeedback('none'); setShowHint(false); }
      }, 700);
    } else {
      setFeedback('bad');
      if (!wrongWords.some((w) => w.word === cur.word)) setWrongWords([...wrongWords, cur]);
    }
  };

  const nextAfterWrong = () => {
    if (idx + 1 >= queue.length) finishRound(firstTryOk, wrongWords);
    else { setIdx(idx + 1); setInput(''); setFeedback('none'); setShowHint(false); }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">✍️ 听写训练</h1>
          <span className="hidden text-xs text-slate-400 sm:inline">听音写词 · 错词重练 · 数据只在本机</span>
        </div>

        {phase === 'setup' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/85 p-5 shadow-md">
              <div className="mb-2 text-sm font-black text-slate-700">① 选学科</div>
              <div className="grid grid-cols-2 gap-3">
                {(['语文', '英语'] as DictSubject[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSubject(s); setGrade((s === '语文' ? CN_GRADES : EN_GRADES)[2]); }}
                    className={`rounded-2xl p-4 text-center transition ${subject === s ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <div className="text-3xl">{s === '语文' ? '🈶' : '🔤'}</div>
                    <div className="mt-1 font-black">{s}</div>
                    <div className="text-xs opacity-80">{s === '语文' ? '生字词听写' : '单词拼写'}</div>
                  </button>
                ))}
              </div>
              <div className="mb-2 mt-4 text-sm font-black text-slate-700">② 选年级</div>
              <div className="flex flex-wrap gap-2">
                {grades.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${grade === g ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <button onClick={begin} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                🎧 开始听写（10 个词）
              </button>
              {!ttsOk && <p className="mt-2 text-center text-xs text-rose-500">当前浏览器不支持语音朗读，可换 Chrome/Edge 体验听写</p>}
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">累计听写 <b className="text-teal-600">{stats.totalWords}</b> 词</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">练习 <b className="text-teal-600">{stats.sessions}</b> 轮</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-500 shadow-sm">最佳正确率 <b className="text-teal-600">{stats.bestAccuracy}%</b></span>
            </div>
          </div>
        )}

        {phase === 'session' && cur && (
          <div className="rounded-3xl bg-white/90 p-6 shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">{subject} · {grade}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${((idx + (feedback !== 'none' ? 1 : 0)) / queue.length) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-400">{idx + 1}/{queue.length}</span>
            </div>

            <div className="flex flex-col items-center gap-4 py-4">
              <button
                onClick={() => speakWord(cur.word)}
                className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-5xl text-white shadow-xl transition hover:scale-105 active:scale-95"
                title="再听一遍"
              >
                🔊
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => speakWord(cur.word)} className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">🔁 再听一遍</button>
                <button onClick={() => setShowHint(!showHint)} className="rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-200">
                  {showHint ? '隐藏提示' : '💡 提示'}
                </button>
              </div>
              {showHint && (
                <div className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-200">
                  {subject === '英语' ? (cur.hint ?? '—') : maskHint(cur.word)}
                </div>
              )}

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => { if (feedback === 'none') setInput(e.target.value); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                disabled={feedback !== 'none'}
                placeholder={subject === '英语' ? '在这里拼出英文单词…' : '在这里写出你听到的词…'}
                className="w-full max-w-md rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-2xl font-black tracking-widest text-slate-800 outline-none transition focus:border-teal-400 disabled:bg-slate-50"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              {feedback === 'none' && (
                <button onClick={submit} className="w-full max-w-md rounded-2xl bg-teal-600 p-3 text-base font-black text-white shadow-md transition hover:bg-teal-700">确认（回车）</button>
              )}
              {feedback === 'ok' && (
                <div className="animate-bounce rounded-2xl bg-emerald-100 px-6 py-3 text-lg font-black text-emerald-600">✅ 正确！</div>
              )}
              {feedback === 'bad' && (
                <div className="w-full max-w-md rounded-2xl bg-rose-50 p-4 text-center ring-1 ring-rose-200">
                  <div className="text-sm font-bold text-rose-500">再看看——正确答案：</div>
                  <div className="mt-1 text-3xl font-black tracking-widest text-rose-600">{cur.word}</div>
                  {cur.hint && <div className="mt-1 text-xs text-rose-400">{cur.hint}</div>}
                  <div className="mt-1 text-xs text-slate-400">读一遍，抄一遍，下一轮还会再考它</div>
                  <button onClick={nextAfterWrong} className="mt-3 w-full rounded-xl bg-rose-500 p-2.5 text-sm font-black text-white transition hover:bg-rose-600">我记住了，下一词 →</button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'review' && (
          <div className="space-y-4">
            <div className={`rounded-3xl p-6 text-center shadow-lg ${firstTryOk === queue.length ? 'bg-gradient-to-br from-emerald-400 to-teal-400' : 'bg-gradient-to-br from-sky-400 to-indigo-400'}`}>
              <div className="text-5xl">{firstTryOk === queue.length ? '🎉' : '👏'}</div>
              <div className="mt-2 text-2xl font-black text-white">
                {firstTryOk === queue.length ? '全部听写正确！' : `首次答对 ${firstTryOk}/${queue.length}`}
              </div>
              <div className="mt-1 text-sm text-white/85">正确率 {Math.round((firstTryOk / (queue.length || 10)) * 100)}%{wrongWords.length > 0 ? ` · ${wrongWords.length} 个词进入重练` : ''}</div>
            </div>

            {wrongWords.length > 0 && (
              <div className="rounded-3xl bg-white/90 p-5 shadow-md">
                <div className="mb-3 text-sm font-black text-rose-600">✍️ 错词卡（读一遍·抄一遍）</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {wrongWords.map((w) => (
                    <button key={w.word} onClick={() => speakWord(w.word)} className="rounded-2xl bg-rose-50 p-3 text-center ring-1 ring-rose-200 transition hover:bg-rose-100" title="点我听读音">
                      <div className="text-xl font-black tracking-wider text-slate-800">{w.word}</div>
                      {w.hint && <div className="mt-0.5 text-xs text-slate-400">{w.hint}</div>}
                      <div className="mt-1 text-[10px] text-rose-400">🔊 点击听读</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              {wrongWords.length > 0 && (
                <button onClick={() => startRound(sampleWords(wrongWords, wrongWords.length))} className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5">
                  🔁 重练错词（{wrongWords.length} 个）
                </button>
              )}
              <button onClick={begin} className="flex-1 rounded-2xl bg-teal-600 p-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-teal-700">
                🆕 新一轮（同年级）
              </button>
              <button onClick={() => setPhase('setup')} className="rounded-2xl bg-slate-200 p-4 text-center font-black text-slate-600 transition hover:bg-slate-300">
                ⚙️ 换设置
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
