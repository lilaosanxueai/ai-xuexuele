import { useMemo, useState } from 'react';
import type { Lesson, ProfileProgress } from '@shared/types.ts';

/**
 * 学科页搜索栏：在闯关路径地图上快速定位课程。
 * 输入标题/知识点/模块名→高亮匹配节点，其余变淡。
 */
export default function PathSearch({
  lessons,
  onHighlight,
}: {
  lessons: Lesson[];
  onHighlight: (set: Set<string>) => void;
}) {
  const [q, setQ] = useState('');
  const [count, setCount] = useState<number | null>(null);

  const search = (text: string) => {
    setQ(text);
    if (!text.trim()) {
      onHighlight(new Set());
      setCount(null);
      return;
    }
    const kw = text.trim().toLowerCase();
    const hits = new Set<string>();
    for (const l of lessons) {
      const hay = [
        l.title,
        l.curriculum?.module ?? '',
        ...(l.curriculum?.points ?? []),
        ...(l.goals ?? []),
      ].join(' ').toLowerCase();
      if (hay.includes(kw)) hits.add(l.id);
    }
    onHighlight(hits);
    setCount(hits.size);
  };

  return (
    <div className="relative mb-3 flex items-center gap-2">
      <div className="relative flex-1">
        <input
          value={q}
          onChange={(e) => search(e.target.value)}
          placeholder="搜索课程标题、知识点…"
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-400"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-400">🔍</span>
        {q && (
          <button
            onClick={() => search('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-400 hover:bg-slate-200"
          >
            ✕
          </button>
        )}
      </div>
      {count !== null && (
        <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${count > 0 ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-400'}`}>
          {count > 0 ? `${count} 节` : '无结果'}
        </span>
      )}
    </div>
  );
}
