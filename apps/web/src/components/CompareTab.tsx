import { useEffect, useState } from 'react';
import type { Lesson, Profile, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { computeBadges, readRecords, recordsKey, EMPTY_RECORDS } from '../runtime/achievements.ts';
import { calcStreak } from '../utils/streak.ts';

function stat(p: ProfileProgress | null): { minutes: number; done: number; accuracy: number | null; streak: number } {
  const minutes = Object.values(p?.dailyUsage ?? {}).reduce((a, b) => a + b, 0);
  const done = Object.values(p?.lessons ?? {}).filter((l) => l.status === 'completed').length;
  const ex = Object.values(p?.exercises ?? {});
  const total = ex.reduce((a, e) => a + e.total, 0);
  const correct = ex.reduce((a, e) => a + e.correct, 0);
  return { minutes, done, accuracy: total > 0 ? Math.round((correct / total) * 100) : null, streak: calcStreak(p?.dailyUsage ?? {}) };
}

/** 多档案对比：一张表看清每个孩子的时长、完成、正确率、连续与徽章 */
export default function CompareTab({ profiles }: { profiles: Profile[] }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [rows, setRows] = useState<{ profile: Profile; progress: ProfileProgress | null }[]>([]);

  useEffect(() => {
    void api.lessons().then(setLessons).catch(() => {});
    void Promise.all(profiles.map((p) => api.progress(p.id).catch(() => null))).then((ps) => {
      setRows(profiles.map((p, i) => ({ profile: p, progress: ps[i] })));
    });
  }, [profiles]);

  if (profiles.length === 0) return <p className="text-slate-400">还没有创建孩子的档案。</p>;

  return (
    <div className="rounded-2xl bg-white/80 p-5">
      <h3 className="mb-1 font-black">👨‍👩‍👧‍👦 档案对比</h3>
      <p className="mb-4 text-xs text-slate-400">各孩子的累计学习数据一览（数据只在本机，兄弟姊妹间互相看看、互相加油）。</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs text-slate-400">
              <th className="py-2 pr-3">孩子</th>
              <th className="py-2 pr-3">累计时长</th>
              <th className="py-2 pr-3">完成课程</th>
              <th className="py-2 pr-3">练习正确率</th>
              <th className="py-2 pr-3">连续天数</th>
              <th className="py-2 pr-3">错题清零</th>
              <th className="py-2">徽章</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ profile: pf, progress }) => {
              const s = stat(progress);
              let badges = 0;
              try {
                const rec = readRecords(JSON.parse(localStorage.getItem(recordsKey(pf.id)) ?? '{}')) ?? EMPTY_RECORDS;
                badges = computeBadges(lessons, progress, rec).filter((b) => b.unlocked).length;
              } catch { /* 忽略 */ }
              return (
                <tr key={pf.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 pr-3 font-bold text-slate-700">{pf.avatar} {pf.name}</td>
                  <td className="py-2.5 pr-3 text-slate-600">{s.minutes} 分钟</td>
                  <td className="py-2.5 pr-3 text-slate-600">{s.done}/{lessons.length || '—'}</td>
                  <td className="py-2.5 pr-3">
                    {s.accuracy === null ? <span className="text-slate-300">—</span> : (
                      <span className={`font-bold ${s.accuracy >= 80 ? 'text-emerald-600' : s.accuracy >= 60 ? 'text-amber-600' : 'text-rose-500'}`}>{s.accuracy}%</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-slate-600">🔥 {s.streak} 天</td>
                  <td className="py-2.5 pr-3 text-slate-600">{progress?.wrongCleared ?? 0} 道</td>
                  <td className="py-2.5 font-bold text-violet-600">🏅 {badges}/17</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">提示：正确率来自随堂小练与挑战赛的作答记录；徽章总数会随版本更新增加。</p>
    </div>
  );
}
