import { useEffect, useState } from 'react';
import type { InteractBlock, InteractView } from '@shared/types.ts';

/** 主题色映射（Tailwind 渐变与底色，避免动态拼接被清除） */
const COLOR: Record<string, { grad: string; soft: string; text: string; ring: string }> = {
  red: { grad: 'from-rose-500 to-red-500', soft: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
  orange: { grad: 'from-orange-500 to-amber-500', soft: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-200' },
  amber: { grad: 'from-amber-400 to-yellow-500', soft: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
  green: { grad: 'from-emerald-500 to-green-500', soft: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
  teal: { grad: 'from-teal-500 to-cyan-500', soft: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-200' },
  sky: { grad: 'from-sky-500 to-blue-500', soft: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-200' },
  blue: { grad: 'from-blue-500 to-indigo-500', soft: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
  violet: { grad: 'from-violet-500 to-purple-500', soft: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
  purple: { grad: 'from-purple-500 to-fuchsia-500', soft: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
  pink: { grad: 'from-pink-500 to-rose-500', soft: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-200' },
  rose: { grad: 'from-rose-400 to-pink-500', soft: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
};

function themeOf(c: string) {
  return COLOR[c] ?? COLOR.sky;
}

/**
 * 原生互动卡视图（现代在线互动教育形态）：
 * 参数切换视图 → 渐变标题卡 + 图标信息卡/对照卡/步骤条/金句高亮，切换带淡入动画。
 */
export default function InteractLab({ view, paramLabel, paramValue }: { view: InteractView; paramLabel: string; paramValue: number }) {
  const [shown, setShown] = useState(view.when);
  useEffect(() => {
    const t = setTimeout(() => setShown(view.when), 30);
    return () => clearTimeout(t);
  }, [view.when]);
  const c = themeOf(view.color);
  const fresh = shown === view.when;

  return (
    <div key={view.when} className={`flex h-full flex-col gap-3 overflow-y-auto p-3 transition-all duration-300 sm:p-5 ${fresh ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* 标题卡 */}
      <div className={`rounded-3xl bg-gradient-to-br ${c.grad} p-5 text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          {view.emoji && <span className="text-4xl drop-shadow">{view.emoji}</span>}
          <div className="min-w-0">
            <div className="truncate text-xl font-black sm:text-2xl">{view.title}</div>
            {view.subtitle && <div className="mt-0.5 line-clamp-2 text-xs font-bold text-white/85 sm:text-sm">{view.subtitle}</div>}
          </div>
          <span className="ml-auto hidden shrink-0 rounded-full bg-white/25 px-3 py-1 text-xs font-bold sm:block">{paramLabel} {paramValue}</span>
        </div>
      </div>

      {/* 内容块 */}
      {view.blocks.map((b, i) => {
        if (b.kind === 'info') {
          return (
            <div key={i} className={`flex items-start gap-3 rounded-2xl ${c.soft} p-4 shadow-sm ring-1 ${c.ring}`}>
              <span className="shrink-0 text-2xl">{b.icon}</span>
              <div className="min-w-0">
                <div className={`text-sm font-black ${c.text}`}>{b.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-slate-700">{b.text}</div>
              </div>
            </div>
          );
        }
        if (b.kind === 'compare') {
          return (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              {b.title && <div className="mb-2 text-sm font-black text-slate-600">{b.title}</div>}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {b.items.map((it, j) => (
                  <div key={j} className={`rounded-xl ${c.soft} px-3 py-2.5`}>
                    <div className="text-[11px] font-bold text-slate-400">{it.label}</div>
                    <div className={`text-sm font-black ${c.text}`}>{it.value}</div>
                    {it.hint && <div className="mt-0.5 text-[11px] text-slate-400">{it.hint}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (b.kind === 'steps') {
          return (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              {b.title && <div className="mb-2 text-sm font-black text-slate-600">{b.title}</div>}
              <div className="space-y-2">
                {b.items.map((s, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${c.grad} text-xs font-black text-white`}>{j + 1}</span>
                    <span className="text-sm text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key={i} className={`rounded-2xl bg-gradient-to-r ${c.grad} p-4 text-center shadow-md`}>
            <div className="text-sm font-black leading-relaxed text-white sm:text-base">{b.text}</div>
          </div>
        );
      })}
    </div>
  );
}
