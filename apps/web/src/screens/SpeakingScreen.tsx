import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SENTENCE_BANK, createRecognizer, scoreSpeaking, type RecognitionLike, type SpeakResult } from '../runtime/speaking.ts';

/** 英语跟读工作台：TTS 示范 → 麦克风跟读 → 相似度评分（本地 LCS 词级匹配） */
const LEVELS = [
  { key: 'primary', label: '🌱 小学' },
  { key: 'junior', label: '🌿 初中' },
  { key: 'senior', label: '🌳 高中' },
] as const;

export default function SpeakingScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [level, setLevel] = useState<'primary' | 'junior' | 'senior'>('primary');
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<SpeakResult | null>(null);
  const [custom, setCustom] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const recRef = useRef<RecognitionLike | null>(null);
  const finalTextRef = useRef('');

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    return () => { try { recRef.current?.stop(); } catch { /* 忽略 */ } };
  }, [profile, nav]);

  if (!profile) return null;

  const pool = SENTENCE_BANK.filter((s) => s.level === level);
  const current = customMode
    ? { level, topic: '自定义', text: custom.trim() || 'Type your sentence here first.' }
    : pool[idx % pool.length];

  const ttsOk = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = () => {
    if (!ttsOk) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(current.text);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const startRecord = () => {
    const rec = createRecognizer();
    if (!rec) { setTranscript(''); setResult({ score: 0, diff: [], comment: '当前浏览器不支持语音识别，请用 Chrome/Edge 🎧' }); return; }
    finalTextRef.current = '';
    setTranscript('');
    setResult(null);
    setRecording(true);
    rec.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      finalTextRef.current = text;
    };
    rec.onerror = () => { setRecording(false); };
    rec.onend = () => {
      setRecording(false);
      const said = finalTextRef.current;
      setTranscript(said);
      setResult(scoreSpeaking(current.text, said));
    };
    recRef.current = rec;
    try { rec.start(); } catch { /* 已在录音中 */ }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-cyan-50">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-3 pb-10 sm:px-6">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100">← 返回地图</button>
          <h1 className="text-2xl font-black text-slate-700">🗣 英语跟读</h1>
          <span className="text-xs text-slate-400">听示范 → 跟着说 → 看得分 · 全程本机</span>
        </div>

        {/* 学段选择 + 自定义 */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {LEVELS.map((l) => (
            <button key={l.key} onClick={() => { setLevel(l.key); setIdx(0); setCustomMode(false); }}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${level === l.key && !customMode ? 'bg-sky-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {l.label}
            </button>
          ))}
          <button onClick={() => setCustomMode(!customMode)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${customMode ? 'bg-violet-500 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            ✏️ 自定义句子
          </button>
          {!customMode && (
            <button onClick={() => { setIdx((i) => i + 1); setTranscript(''); setResult(null); }}
              className="ml-auto rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-200">
              换一句（{idx % pool.length + 1}/{pool.length}）
            </button>
          )}
        </div>

        {customMode && (
          <div className="mb-4 flex gap-2">
            <input value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={160}
              placeholder="输入想练的英语句子（来自课文/作文皆可）"
              className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-sky-400" />
          </div>
        )}

        {/* 句子卡 */}
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-1 text-xs font-bold text-slate-400">主题：{current.topic}</div>
          <div className="mb-5 text-2xl font-black leading-relaxed text-slate-800">{current.text}</div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={speak} disabled={!ttsOk}
              className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-3xl text-white shadow-lg transition hover:scale-105 disabled:opacity-40"
              title="听示范（语速放慢）">🔊</button>
            <button onClick={startRecord} disabled={recording}
              className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-lg transition hover:scale-105 ${recording ? 'animate-pulse bg-rose-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'}`}
              title={recording ? '正在听你说…' : '按住开始跟读'}>
              {recording ? '⏺' : '🎤'}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">{recording ? '正在听你说…（说完停 1 秒自动结束）' : '先听 🔊 示范，再按 🎤 跟读'}</p>

          {/* 识别结果 */}
          {transcript && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
              <div className="mb-1 text-xs font-bold text-slate-400">我听到的：{transcript}</div>
            </div>
          )}

          {/* 评分 */}
          {result && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-3">
                <span className={`text-3xl font-black ${result.score >= 70 ? 'text-emerald-600' : result.score >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>{result.score} 分</span>
                <span className="text-sm font-bold text-slate-600">{result.comment}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.diff.map((d, i) => (
                  <span key={i} className={`rounded-md px-1.5 py-0.5 text-sm font-semibold ${d.state === 'ok' ? 'bg-emerald-100 text-emerald-700' : d.state === 'miss' ? 'bg-rose-100 text-rose-500 line-through' : 'bg-slate-200 text-slate-400'}`}
                    title={d.state === 'ok' ? '读对了' : d.state === 'miss' ? '漏读/读错' : '识别到的多余内容'}>
                    {d.word}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-400">绿色=读对 · 红色删除线=漏读/读错 · 灰色=多余内容（识别偶有噪声，仅供参考）</p>
              <button onClick={() => { setTranscript(''); setResult(null); }}
                className="mt-3 rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-sky-600">再试一次 🔁</button>
            </div>
          )}
        </div>

        {/* 说明 */}
        <div className="mt-4 rounded-3xl bg-white/70 p-4 text-xs leading-relaxed text-slate-500">
          💡 跟读是练口语最有效的方法之一：先听慢速示范，模仿语音语调，再对照逐词评分找出漏读的词。每天 10 分钟，坚持一个月，开口会明显流利。语音识别在本机浏览器完成，不联网上传。
        </div>
      </main>
    </div>
  );
}
