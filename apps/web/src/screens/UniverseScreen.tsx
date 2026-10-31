import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';
import { buildUniverse, universeWeakSpots, type UniverseNode } from '../runtime/knowledgeUniverse.ts';

/** 学科主题色 → SVG 填充色（Tailwind 类名在 SVG 上不能用·映射到固定 hex） */
const HEX: Record<string, string> = {
  slate: '#64748b', sky: '#0ea5e9', rose: '#f43f5e', amber: '#f59e0b', teal: '#14b8a6',
  indigo: '#6366f1', violet: '#8b5cf6', emerald: '#10b981', orange: '#f97316', pink: '#ec4899',
  fuchsia: '#d946ef', red: '#ef4444', lime: '#84cc16', cyan: '#06b6d4', yellow: '#eab308', purple: '#a855f7',
};
const hexOf = (subject: string) => HEX[SUBJECTS[subject]?.color] ?? '#94a3b8';

/** 知识宇宙：18 学科 × 全部课标模块的跨学科知识图谱——学科是星系·模块是星星·共享关键词是引力线 */
export default function UniverseScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null); // 只看某学科
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then(setLessons).catch(() => {});
    void api.progress(profile.id).then(setProgress).catch(() => {});
  }, [profile, nav]);

  const graph = useMemo(() => buildUniverse(lessons, progress), [lessons, progress]);
  const weak = useMemo(() => universeWeakSpots(graph, lessons, progress), [graph, lessons, progress]);
  const doneLessons = graph.nodes.reduce((s, n) => s + n.doneCount, 0);

  const node = useMemo(() => graph.nodes.find((n) => n.id === (sel ?? '')) ?? null, [graph, sel]);
  const hoverNode = useMemo(() => graph.nodes.find((n) => n.id === (hover ?? '')) ?? null, [graph, hover]);
  const lit = graph.nodes.filter((n) => n.accuracy !== null).length;

  const selEdges = useMemo(() => new Set(graph.edges.filter((e) => e.a === sel || e.b === sel).flatMap((e) => [e.a, e.b])), [graph, sel]);
  const isLit = (n: UniverseNode) => selEdges.has(n.id);

  if (!profile) return null;

  if (lessons.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
          <div className="mb-4 h-8 w-40 animate-pulse rounded-xl bg-slate-200" />
          <div className="mb-3 rounded-2xl bg-white/80 p-4 shadow-sm"><div className="mb-2 h-5 w-2/3 animate-pulse rounded-lg bg-slate-200" /><div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100" /></div>
          <p className="text-center text-sm text-slate-400">正在展开知识宇宙…（首次打开需加载课程库）</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 p-5 text-white shadow-lg">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white/20 px-3 py-1.5 text-sm font-bold hover:bg-white/30">← 学科中心</button>
          <span className="text-4xl">🌌</span>
          <div>
            <h1 className="text-2xl font-black">知识宇宙</h1>
            <p className="text-xs opacity-80">学科是星系 · 模块是星星 · 连线是共享的知识关键词——看看你的知识版图点亮了多少</p>
          </div>
          <div className="ml-auto flex gap-4 text-center">
            <div><div className="text-2xl font-black">{graph.subjects.length}</div><div className="text-[10px] opacity-70">学科</div></div>
            <div><div className="text-2xl font-black">{doneLessons}<span className="text-sm opacity-70">/{lessons.length}</span></div><div className="text-[10px] opacity-70">已完成课</div></div>
            <div><div className="text-2xl font-black">{lit}<span className="text-sm opacity-70">/{graph.nodes.length}</span></div><div className="text-[10px] opacity-70">已点亮模块</div></div>
            <div><div className="text-2xl font-black">{graph.edges.length}</div><div className="text-[10px] opacity-70">跨科连线</div></div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔍 搜索模块名（如：函数/光合/市场）" className="w-56 rounded-xl bg-white px-3 py-1.5 text-sm shadow-sm outline-none ring-1 ring-slate-200 focus:ring-sky-400" />
          <button onClick={() => { setFocus(null); setSel(null); setQuery(''); }} className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm hover:bg-slate-50">全部</button>
          {graph.subjects.map((s) => {
            const pct = Math.round(s.doneRatio * 100);
            const R = 6, C = 2 * Math.PI * R;
            return (
              <button key={s.subject} onClick={() => setFocus(focus === s.subject ? null : s.subject)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold shadow-sm transition ${focus === s.subject ? 'text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                style={focus === s.subject ? { background: hexOf(s.subject) } : undefined}
                title={`${s.subject}：${s.done}/${s.count} 课完成（${pct}%）${s.accuracy == null ? '' : ` · 平均正确率 ${s.accuracy}%`}`}>
                <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0">
                  <circle cx="8" cy="8" r={R} fill="none" stroke={focus === s.subject ? 'rgba(255,255,255,0.35)' : 'rgba(148,163,184,0.3)'} strokeWidth="2.5" />
                  <circle cx="8" cy="8" r={R} fill="none" stroke={focus === s.subject ? '#fff' : hexOf(s.subject)} strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray={`${(C * s.doneRatio).toFixed(2)} ${C.toFixed(2)}`} transform="rotate(-90 8 8)" />
                </svg>
                {SUBJECTS[s.subject]?.emoji} {s.subject}
                <span className={`text-[10px] font-black ${focus === s.subject ? 'opacity-80' : 'text-slate-400'}`}>{pct}%</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950 shadow-lg" style={{ minHeight: 480 }}>
            <svg viewBox="0 0 1000 780" className="h-auto w-full" style={{ maxHeight: 640 }}>
              {/* 连线 */}
              {graph.edges.map((e, i) => {
                const a = graph.nodes.find((n) => n.id === e.a);
                const b = graph.nodes.find((n) => n.id === e.b);
                if (!a || !b) return null;
                const on = sel !== null && (e.a === sel || e.b === sel);
                const dim = focus !== null && a.subject !== focus && b.subject !== focus;
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? '#fbbf24' : '#7dd3fc'} strokeWidth={on ? 2 : 1} opacity={dim ? 0.04 : on ? 0.9 : 0.16} />;
              })}
              {/* 学科锚点名 */}
              {graph.subjects.map((s) => (
                <text key={s.subject} x={s.x} y={s.y + 4} textAnchor="middle" fill={hexOf(s.subject)} fontSize={13} fontWeight={800} opacity={focus !== null && focus !== s.subject ? 0.12 : 0.45}>
                  {SUBJECTS[s.subject]?.emoji} {s.subject}
                </text>
              ))}
              {/* 模块节点 */}
              {graph.nodes.map((n) => {
                const dim = (focus !== null && n.subject !== focus) || (sel !== null && !isLit(n) && n.id !== sel);
                const acc = n.accuracy;
                return (
                  <g key={n.id} onClick={() => setSel(n.id === sel ? null : n.id)} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer', opacity: dim ? 0.08 : 1 }}>
                    <circle cx={n.x} cy={n.y} r={n.r + (n.id === sel ? 4 : 0)} fill={hexOf(n.subject)} fillOpacity={acc == null ? 0.16 : 0.3 + (acc / 100) * 0.7} stroke={n.id === sel ? '#fff' : hexOf(n.subject)} strokeWidth={n.id === sel ? 2.5 : 1.2} />
                    {n.doneCount === n.count && n.count > 0 && <text x={n.x} y={n.y + 3.5} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={800}>✓</text>}
                    {(hover === n.id || n.id === sel) && <text x={n.x} y={n.y - n.r - 5} textAnchor="middle" fill="#fff" fontSize={10.5} fontWeight={700}>{n.module}</text>}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 详情面板 */}
          <div className="space-y-3">
            {node ? (
              <div className="rounded-3xl bg-white/90 p-4 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{SUBJECTS[node.subject]?.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-slate-400">{node.subject} · 课标模块</div>
                    <div className="truncate text-lg font-black text-slate-800">{node.module}</div>
                  </div>
                  <button onClick={() => setSel(null)} className="shrink-0 rounded-xl bg-slate-100 px-2 py-1 text-xs font-bold text-slate-400 hover:bg-slate-200">✕</button>
                </div>
                <div className="mb-3 flex gap-2 text-center text-xs">
                  <div className="flex-1 rounded-xl bg-slate-50 p-2"><b className="block text-base text-slate-700">{node.count}</b>课</div>
                  <div className="flex-1 rounded-xl bg-slate-50 p-2"><b className="block text-base text-emerald-600">{node.doneCount}</b>完成</div>
                  <div className="flex-1 rounded-xl bg-slate-50 p-2"><b className="block text-base text-sky-600">{node.accuracy == null ? '—' : node.accuracy + '%'}</b>正确率</div>
                </div>
                <div className="mb-1 text-xs font-black text-slate-500">模块课程</div>
                <div className="max-h-44 space-y-1 overflow-y-auto">
                  {lessons.filter((l) => (l.subjectArea ?? '信息科技') === node.subject && (l.curriculum?.module ?? '其他') === node.module).sort((a, b) => a.order - b.order).map((l) => {
                    const done = progress?.lessons[l.id]?.status === 'completed';
                    const isLab = !!(l.lab || l.starterCode);
                    return (
                      <button key={l.id} onClick={() => nav(isLab ? `/lab/${l.id}` : `/tutor/${l.id}`)}
                        className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700">
                        <span>{done ? '✅' : '⏳'}</span><span className="min-w-0 flex-1 truncate">{l.emoji} {l.title}</span>
                      </button>
                    );
                  })}
                </div>
                {graph.edges.filter((e) => e.a === node.id || e.b === node.id).length > 0 && (
                  <>
                    <div className="mb-1 mt-3 text-xs font-black text-slate-500">跨科连线</div>
                    <div className="flex flex-wrap gap-1.5">
                      {graph.edges.filter((e) => e.a === node.id || e.b === node.id).map((e, i) => {
                        const other = e.a === node.id ? e.b : e.a;
                        return (
                          <button key={i} onClick={() => setSel(other)} className="rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-100" title={`共享：${e.shared.join('、')}`}>
                            🔗 {other}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ) : hoverNode ? (
              <div className="rounded-3xl bg-white/90 p-4 shadow-md">
                <div className="text-[10px] font-bold text-slate-400">{hoverNode.subject}</div>
                <div className="text-lg font-black text-slate-800">{hoverNode.module}</div>
                <div className="mt-1 text-xs text-slate-500">{hoverNode.count} 课 · 完成 {hoverNode.doneCount} · 正确率 {hoverNode.accuracy == null ? '—' : hoverNode.accuracy + '%'}（点击查看详情）</div>
              </div>
            ) : (
              <>
                <div className="rounded-3xl bg-white/90 p-4 shadow-md">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="text-lg">🌫</span>
                    <span className="text-xs font-black text-slate-500">薄弱星云 · 优先补亮</span>
                    <span className="ml-auto text-[10px] font-bold text-slate-400">按紧急程度排序</span>
                  </div>
                  {weak.length === 0 ? (
                    <p className="py-3 text-center text-xs font-bold text-emerald-500">🌟 暂无薄弱模块，知识版图一片明亮！</p>
                  ) : (
                    <div className="space-y-1.5">
                      {weak.map((w) => {
                        const lesson = lessons.find((l) => l.id === w.lessonId);
                        const isLab = !!(lesson?.lab || lesson?.starterCode);
                        return (
                          <button key={w.id} onClick={() => w.lessonId && nav(isLab ? `/lab/${w.lessonId}` : `/tutor/${w.lessonId}`)}
                            title={`跳到《${w.lessonTitle ?? ''}》`}
                            className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2 text-left transition hover:bg-amber-50">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: hexOf(w.subject) }} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-black text-slate-700">{w.subject} · {w.module}</span>
                              <span className="block truncate text-[10px] font-semibold text-slate-400">{w.reason}</span>
                            </span>
                            <span className="shrink-0 rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-700">去补亮 →</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="rounded-3xl bg-white/70 p-4 text-center shadow-sm">
                  <p className="text-xs font-bold text-slate-500">点击任意星星看模块详情</p>
                  <p className="mt-1 text-[10px] text-slate-400">亮度=正确率 · ✓=全部完成 · 金线=与所选模块共享知识 · 学科筛选环=完成率</p>
                </div>
              </>
            )}
            {query.trim() && (
              <div className="rounded-3xl bg-white/90 p-4 shadow-md">
                <div className="mb-2 text-xs font-black text-slate-500">🔍 搜索「{query}」</div>
                <div className="max-h-52 space-y-1 overflow-y-auto">
                  {graph.nodes.filter((n) => n.module.toLowerCase().includes(query.trim().toLowerCase()) || n.subject.includes(query.trim())).slice(0, 12).map((n) => (
                    <button key={n.id} onClick={() => { setSel(n.id); setFocus(n.subject); }} className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5 text-left text-xs font-semibold text-slate-600 hover:bg-sky-50">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: hexOf(n.subject) }} />{n.subject} · {n.module}<span className="ml-auto text-slate-400">{n.count}课</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
