import type { ProfileProgress } from '@shared/types.ts';
import { calcStreak } from '../utils/streak.ts';

/**
 * 每日任务条（Duolingo 式）：三任务打卡 + 🔥连续天数 + ⚡XP 等级。
 * 数据全部由服务端在通关/答题/交流时自动累计，前端只读展示。
 */

const LEVELS: { min: number; name: string; emoji: string }[] = [
  { min: 2000, name: '传奇创造者', emoji: '🌟' },
  { min: 1000, name: '学科大师', emoji: '🎓' },
  { min: 500, name: '知识船长', emoji: '⛵' },
  { min: 200, name: '勇敢冒险家', emoji: '🗺' },
  { min: 0, name: '见习探索者', emoji: '🐣' },
];

export function levelOf(xp: number) {
  return LEVELS.find((l) => xp >= l.min) ?? LEVELS[LEVELS.length - 1];
}

export default function DailyQuestBar({ progress }: { progress: ProfileProgress | null }) {
  const today = new Date().toISOString().slice(0, 10);
  const fresh = progress?.questDate === today ? progress.questDone : undefined;
  const q = { lesson: fresh?.lesson ?? false, quiz: fresh?.quiz ?? 0, chat: fresh?.chat ?? 0 };
  const streak = calcStreak(progress?.dailyUsage ?? {});
  const xp = progress?.xp ?? 0;
  const level = levelOf(xp);

  const tasks = [
    { emoji: '🏁', label: '通关 1 节课', done: q.lesson },
    { emoji: '📝', label: `答对 5 题（${Math.min(5, q.quiz)}/5）`, done: q.quiz >= 5 },
    { emoji: '💬', label: `和伙伴聊聊（${Math.min(2, q.chat)}/2）`, done: q.chat >= 2 },
  ];
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 shadow-sm">
      <div className="mb-2.5 flex items-center gap-2 text-sm">
        <span className="font-black text-slate-700">🎯 今日任务</span>
        {doneCount === 3 && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">全部完成，太棒了！🎉</span>}
        <span className="ml-auto flex items-center gap-1 text-xs font-bold text-orange-500">🔥 连续 {streak} 天</span>
        <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-600 shadow-sm" title={`累计 ${xp} XP：通关+50 · 答题+10 · 交流+5`}>
          {level.emoji} {level.name} · {xp} XP
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {tasks.map((t) => (
          <div
            key={t.label}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
              t.done ? 'bg-emerald-100 text-emerald-700' : 'bg-white/80 text-slate-500'
            }`}
          >
            <span className="text-lg">{t.done ? '✅' : t.emoji}</span>
            <span className="truncate">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
