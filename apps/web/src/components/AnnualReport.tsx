import { useEffect, useMemo, useState } from 'react';
import type { Lesson, Profile, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { computeBadges, readRecords, recordsKey, EMPTY_RECORDS } from '../runtime/achievements.ts';
import { calcStreak } from '../utils/streak.ts';

interface AnnualData {
  profile: Profile;
  progress: ProfileProgress;
  lessons: Lesson[];
  totalMinutes: number;
  doneCount: number;
  exerciseTotal: number;
  exerciseCorrect: number;
  streak: number;
  wrongCleared: number;
  badgesUnlocked: number;
  badgesTotal: number;
  subjectStats: { subject: string; correct: number; total: number }[];
  monthlyMinutes: number[];
  noteCount: number;
  year: number;
}

/** 年度学习成长报告：一键生成 A4 打印版 */
export default function AnnualReport({ profiles }: { profiles: Profile[] }) {
  const [printing, setPrinting] = useState(false);
  const [data, setData] = useState<AnnualData | null>(null);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (profiles.length > 0 && !selected) setSelected(profiles[0].id);
  }, [profiles, selected]);

  const generate = async () => {
    if (!selected) return;
    const profile = profiles.find((p) => p.id === selected);
    if (!profile) return;
    const [progress, lessons] = await Promise.all([
      api.progress(selected).catch(() => null),
      api.lessons().catch(() => [] as Lesson[]),
    ]);
    if (!progress) return;

    const totalMinutes = Object.values(progress.dailyUsage ?? {}).reduce((a, b) => a + b, 0);
    const doneCount = Object.values(progress.lessons ?? {}).filter((l) => l.status === 'completed').length;
    const exEntries = Object.values(progress.exercises ?? {});
    const exerciseTotal = exEntries.reduce((a, e) => a + e.total, 0);
    const exerciseCorrect = exEntries.reduce((a, e) => a + e.correct, 0);
    const streak = calcStreak(progress.dailyUsage ?? {});

    let rec = EMPTY_RECORDS;
    try { rec = readRecords(JSON.parse(localStorage.getItem(recordsKey(selected)) ?? '{}')); } catch { /* ignore */ }
    const badges = computeBadges(lessons, progress, rec);

    // 学科统计
    const byId = new Map(lessons.map((l) => [l.id, l]));
    const subjMap = new Map<string, { correct: number; total: number }>();
    for (const [lid, ex] of Object.entries(progress.exercises ?? {})) {
      const l = byId.get(lid);
      const s = l?.subjectArea ?? '其他';
      const cur = subjMap.get(s) ?? { correct: 0, total: 0 };
      cur.correct += ex.correct;
      cur.total += ex.total;
      subjMap.set(s, cur);
    }
    const subjectStats = [...subjMap.entries()].map(([subject, v]) => ({ subject, ...v })).sort((a, b) => b.total - a.total);

    // 月度分钟
    const year = new Date().getFullYear();
    const monthlyMinutes = Array.from({ length: 12 }, (_, m) => {
      let sum = 0;
      for (const [k, v] of Object.entries(progress.dailyUsage ?? {})) {
        if (k.startsWith(`${year}-${String(m + 1).padStart(2, '0')}`)) sum += v;
      }
      return sum;
    });

    const noteCount = Object.values(progress.lessonNotes ?? {}).filter((n) => n && n.trim().length > 10).length;

    setData({
      profile, progress, lessons, totalMinutes, doneCount, exerciseTotal, exerciseCorrect, streak,
      wrongCleared: progress.wrongCleared ?? 0,
      badgesUnlocked: badges.filter((b) => b.unlocked).length,
      badgesTotal: badges.length,
      subjectStats, monthlyMinutes, noteCount, year,
    });
  };

  const doPrint = () => {
    if (!data) return;
    setPrinting(true);
    setTimeout(() => { window.print(); setPrinting(false); }, 150);
  };

  const PRINT_CSS = '@media print { body * { visibility: hidden !important; } #annual-report, #annual-report * { visibility: visible !important; } #annual-report { position: absolute !important; left: 0; top: 0; width: 100%; background: #fff; } .break-before-page { break-before: page; } }';

  if (profiles.length === 0) return <p className="text-slate-400">还没有创建孩子的档案。</p>;

  return (
    <div className="rounded-2xl bg-white/80 p-5">
      <h3 className="mb-1 font-black">📖 年度学习成长报告</h3>
      <p className="mb-4 text-xs text-slate-400">一键生成 A4 打印版年度总结——记录这一年的成长足迹，适合家长会和成长档案。</p>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400">
          {profiles.map((p) => <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>)}
        </select>
        <button onClick={() => void generate()} className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-indigo-600">生成报告</button>
        {data && <button onClick={doPrint} className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-slate-800">🖨 打印</button>}
      </div>

      {printing && data && (
        <div id="annual-report" className="fixed inset-0 z-[80] overflow-y-auto bg-white p-10 text-slate-900">
          <style>{PRINT_CSS}</style>
          <div className="mx-auto max-w-2xl">
            {/* 封面 */}
            <div className="pb-10 text-center">
              <h1 className="text-4xl font-black">{data.year} 年度学习成长报告</h1>
              <p className="mt-3 text-xl">{data.profile.avatar} {data.profile.name}</p>
              <p className="mt-1 text-sm text-slate-400">AI学学乐 · {new Date().toLocaleDateString('zh-CN')} 生成</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-3xl font-black text-indigo-600">{Math.round(data.totalMinutes / 60)}h</div><div className="text-xs text-slate-400">累计学习时长</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-3xl font-black text-emerald-600">{data.doneCount}</div><div className="text-xs text-slate-400">完成课程</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-3xl font-black text-amber-500">{data.badgesUnlocked}</div><div className="text-xs text-slate-400">获得徽章</div></div>
              </div>
            </div>

            {/* 第二页：数据总览 */}
            <div className="break-before-page pt-8">
              <h2 className="mb-4 border-b-2 border-slate-200 pb-2 text-2xl font-black">数据总览</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b"><td className="py-2 font-bold">累计学习时长</td><td className="py-2 text-right">{data.totalMinutes} 分钟（约 {Math.round(data.totalMinutes / 60)} 小时）</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">完成课程</td><td className="py-2 text-right">{data.doneCount} / {data.lessons.length} 门</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">练习答题</td><td className="py-2 text-right">{data.exerciseTotal} 道（答对 {data.exerciseCorrect} 道{data.exerciseTotal > 0 ? `，正确率 ${Math.round((data.exerciseCorrect / data.exerciseTotal) * 100)}%` : ''}）</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">错题练对</td><td className="py-2 text-right">{data.wrongCleared} 道</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">学习笔记</td><td className="py-2 text-right">{data.noteCount} 篇</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">最长连续学习</td><td className="py-2 text-right">{data.streak} 天</td></tr>
                </tbody>
              </table>
            </div>

            {/* 学科分析 */}
            <div className="mt-8">
              <h2 className="mb-3 border-b-2 border-slate-200 pb-2 text-xl font-black">学科表现</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-xs text-slate-400"><th className="py-1">学科</th><th>答题数</th><th>答对</th><th>正确率</th></tr></thead>
                <tbody>
                  {data.subjectStats.map((s) => (
                    <tr key={s.subject} className="border-b">
                      <td className="py-1.5 font-bold">{s.subject}</td>
                      <td>{s.total}</td><td>{s.correct}</td>
                      <td className={s.total > 0 && s.correct / s.total >= 0.8 ? 'font-bold text-emerald-600' : s.total > 0 && s.correct / s.total >= 0.6 ? 'font-bold text-amber-600' : 'font-bold text-rose-500'}>
                        {s.total > 0 ? Math.round((s.correct / s.total) * 100) + '%' : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 月度热力 */}
            <div className="mt-8">
              <h2 className="mb-3 border-b-2 border-slate-200 pb-2 text-xl font-black">月度学习热力</h2>
              <div className="flex items-end gap-1" style={{ height: 100 }}>
                {data.monthlyMinutes.map((m, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                    <div className="w-full rounded-t bg-indigo-400" style={{ height: Math.max(2, (m / Math.max(...data.monthlyMinutes, 1)) * 70) }} title={`${i + 1}月 ${m}分钟`} />
                    <span className="text-[8px] text-slate-400">{i + 1}月</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 第三页：徽章与寄语 */}
            <div className="break-before-page pt-8">
              <h2 className="mb-3 border-b-2 border-slate-200 pb-2 text-2xl font-black">成就徽章</h2>
              <div className="flex flex-wrap gap-3">
                {(() => {
                  let rec = EMPTY_RECORDS;
                  try { rec = readRecords(JSON.parse(localStorage.getItem(recordsKey(selected)) ?? '{}')); } catch { /* ignore */ }
                  return computeBadges(data.lessons, data.progress, rec).filter((b) => b.unlocked).map((b) => (
                    <div key={b.id} className="rounded-2xl bg-amber-50 px-4 py-3 text-center ring-2 ring-amber-300">
                      <div className="text-3xl">{b.emoji}</div>
                      <div className="text-xs font-bold text-slate-700">{b.name}</div>
                    </div>
                  ));
                })()}
              </div>
              {data.badgesUnlocked === 0 && <p className="text-sm text-slate-400">本年度暂未解锁徽章——每天学一点，徽章自然来！</p>}
            </div>

            <div className="mt-10">
              <h2 className="mb-3 border-b-2 border-slate-200 pb-2 text-xl font-black">家长寄语</h2>
              <div className="min-h-24 rounded-xl border-2 border-dashed border-slate-200 p-4 text-sm text-slate-400">
                （请家长手写填入对孩子的鼓励与期望）
              </div>
            </div>

            <p className="mt-10 text-center text-xs text-slate-300">本报告由 AI学学乐 本地生成 · 数据仅存本机</p>
          </div>
        </div>
      )}

      {!printing && data && (
        <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-800">
          ✅ 报告已生成（{data.profile.name} · {data.year} 年度）：累计 {Math.round(data.totalMinutes / 60)} 小时 · 完成 {data.doneCount} 课 · 徽章 {data.badgesUnlocked}/{data.badgesTotal}。点击"🖨 打印"查看完整版。
        </div>
      )}
    </div>
  );
}
