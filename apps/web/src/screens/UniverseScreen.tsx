import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, ProfileProgress } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import { SUBJECTS } from '../components/subjectMeta.ts';
import { buildUniverse, universeRoutes, universeWeakSpots, type UniverseNode, type RouteStop } from '../runtime/knowledgeUniverse.ts';

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
  // 星图漫游：view = {k: 缩放, x/y: 平移}（SVG viewBox 坐标系）
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ sx: number; sy: number; x: number; y: number; moved: boolean } | null>(null);
  // AI 星空讲解员（按模块缓存一次结果）
  const [aiTip, setAiTip] = useState<{ id: string; text: string; source: string } | null>(null);
  const [tipLoading, setTipLoading] = useState(false);
  // 航线播放器：镜头逐站飞行，路径流光
  const [playing, setPlaying] = useState<{ theme: string; stops: RouteStop[] } | null>(null);
  const [playIdx, setPlayIdx] = useState(0);
  const [routeTip, setRouteTip] = useState<{ theme: string; text: string; source: string } | null>(null);
  const [routeTipLoading, setRouteTipLoading] = useState(false);

  /** 以 SVG 坐标 (cx,cy) 为锚点缩放 factor 倍；缩回 1 自动复位 */
  const zoomAt = (factor: number, cx = 500, cy = 390) => setView((v) => {
    const k = Math.min(6, Math.max(1, v.k * factor));
    if (k === 1) return { k: 1, x: 0, y: 0 };
    return { k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k };
  });
  /** 缩放到指定倍数并把星系锚点放到屏幕中心 */
  const zoomTo = (k2: number, ax: number, ay: number) => setView({ k: k2, x: 500 - ax * k2, y: 390 - ay * k2 });

  // 非被动滚轮缩放（以指针为锚点）
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, ((e.clientX - rect.left) / rect.width) * 1000, ((e.clientY - rect.top) / rect.height) * 780);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons.length]); // 课程库加载后 svg 才挂载，此时再绑滚轮

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.lessons().then(setLessons).catch(() => {});
    void api.progress(profile.id).then(setProgress).catch(() => {});
  }, [profile, nav]);

  const graph = useMemo(() => buildUniverse(lessons, progress), [lessons, progress]);
  const weak = useMemo(() => universeWeakSpots(graph, lessons, progress), [graph, lessons, progress]);
  const routes = useMemo(() => universeRoutes(lessons, progress), [lessons, progress]);
  const doneLessons = graph.nodes.reduce((s, n) => s + n.doneCount, 0);

  const node = useMemo(() => graph.nodes.find((n) => n.id === (sel ?? '')) ?? null, [graph, sel]);
  const hoverNode = useMemo(() => graph.nodes.find((n) => n.id === (hover ?? '')) ?? null, [graph, hover]);
  const lit = graph.nodes.filter((n) => n.accuracy !== null).length;

  const selEdges = useMemo(() => new Set(graph.edges.filter((e) => e.a === sel || e.b === sel).flatMap((e) => [e.a, e.b])), [graph, sel]);
  const isLit = (n: UniverseNode) => selEdges.has(n.id);

  // 航线播放：逐站缩放飞行（2.4 倍看清楚站点），走完自动复位
  const playStopNodes = useMemo(() => {
    if (!playing) return [];
    return playing.stops.map((s) => graph.nodes.find((n) => n.subject === s.subject && n.module === s.module) ?? null);
  }, [playing, graph]);
  const playStopIds = useMemo(() => new Set(playStopNodes.filter(Boolean).map((n) => n!.id)), [playStopNodes]);
  const subjectIdx = useMemo(() => new Map(graph.subjects.map((s, i) => [s.subject, i])), [graph]);

  useEffect(() => {
    if (!playing) return;
    const node = playStopNodes[playIdx];
    if (node) zoomTo(2.4, node.x, node.y);
    const t = setTimeout(() => {
      if (playIdx + 1 >= playing.stops.length) {
        setPlaying(null);
        setView({ k: 1, x: 0, y: 0 });
      } else {
        setPlayIdx(playIdx + 1);
      }
    }, 1700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, playIdx, playStopNodes]);

  /** AI 讲解这条航线：为什么这些学科被串在一起 */
  const askRouteTip = () => {
    if (!playing || !profile || routeTipLoading) return;
    setRouteTipLoading(true);
    void api.universeExplain(profile.id, {
      kind: 'route', subject: '跨科航线', module: playing.theme,
      count: playing.stops.length, done: playing.stops.filter((s) => s.done).length, accuracy: null,
      links: playing.stops.map((s) => ({ subject: s.subject, module: s.module, shared: [] })),
      next: [],
    })
      .then((r) => setRouteTip({ theme: playing.theme, text: r.tip, source: r.source }))
      .catch(() => setRouteTip({ theme: playing.theme, text: '讲解员暂时不在星空里，稍后再试～', source: 'error' }))
      .finally(() => setRouteTipLoading(false));
  };

  /** AI 星空讲解员：讲这颗星是什么、为什么和别的学科相连、先学哪节 */
  const askTip = () => {
    if (!node || !profile || tipLoading) return;
    setTipLoading(true);
    const links = graph.edges.filter((e) => e.a === node.id || e.b === node.id).map((e) => {
      const otherId = e.a === node.id ? e.b : e.a;
      const other = graph.nodes.find((n) => n.id === otherId);
      return { subject: other?.subject ?? '', module: other?.module ?? '', shared: e.shared };
    });
    const next = lessons
      .filter((l) => (l.subjectArea ?? '信息科技') === node.subject && (l.curriculum?.module ?? '其他') === node.module && progress?.lessons[l.id]?.status !== 'completed')
      .sort((a, b) => a.order - b.order).slice(0, 3).map((l) => l.title);
    void api.universeExplain(profile.id, {
      subject: node.subject, module: node.module, count: node.count, done: node.doneCount, accuracy: node.accuracy, links, next,
    })
      .then((r) => setAiTip({ id: node.id, text: r.tip, source: r.source }))
      .catch(() => setAiTip({ id: node.id, text: '讲解员暂时不在星空里，稍后再试～', source: 'error' }))
      .finally(() => setTipLoading(false));
  };

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
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-800 p-5 text-white shadow-lg ring-1 ring-white/10">
          <button onClick={() => nav('/map')} className="rounded-xl bg-white/15 px-3 py-1.5 text-sm font-bold hover:bg-white/25">← 学科中心</button>
          <span className="text-4xl">🌌</span>
          <div>
            <h1 className="text-2xl font-black">知识宇宙</h1>
            <p className="text-xs opacity-75">学科是星系 · 模块是星星 · 连线是共享的知识关键词——看看你的知识版图点亮了多少</p>
          </div>
          <div className="ml-auto flex text-center">
            <div className="px-5"><div className="text-2xl font-black tabular-nums">{graph.subjects.length}</div><div className="text-[11px] opacity-75">学科</div></div>
            <div className="border-l-2 border-white/25 px-5"><div className="text-2xl font-black tabular-nums">{doneLessons}<span className="text-sm font-bold opacity-60"> / {lessons.length}</span></div><div className="text-[11px] opacity-75">已完成课</div></div>
            <div className="border-l-2 border-white/25 px-5"><div className="text-2xl font-black tabular-nums">{lit}<span className="text-sm font-bold opacity-60"> / {graph.nodes.length}</span></div><div className="text-[11px] opacity-75">已点亮模块</div></div>
            <div className="border-l-2 border-white/25 px-5"><div className="text-2xl font-black tabular-nums">{graph.edges.length}</div><div className="text-[11px] opacity-75">跨科连线</div></div>
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
                {pct > 0 ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0">
                    <circle cx="8" cy="8" r={R} fill="none" stroke={focus === s.subject ? 'rgba(255,255,255,0.35)' : 'rgba(148,163,184,0.3)'} strokeWidth="2.5" />
                    <circle cx="8" cy="8" r={R} fill="none" stroke={focus === s.subject ? '#fff' : hexOf(s.subject)} strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray={`${(C * s.doneRatio).toFixed(2)} ${C.toFixed(2)}`} transform="rotate(-90 8 8)" />
                  </svg>
                ) : (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: focus === s.subject ? '#fff' : hexOf(s.subject), opacity: focus === s.subject ? 0.9 : 0.45 }} />
                )}
                {SUBJECTS[s.subject]?.emoji} {s.subject}
                {pct > 0 && <span className={`text-[10px] font-black ${focus === s.subject ? 'opacity-80' : 'text-slate-400'}`}>{pct}%</span>}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950 shadow-lg" style={{ minHeight: 480 }}>
            <style>{`
              @keyframes uni-twinkle { 0%,100% { opacity: .9 } 50% { opacity: .4 } }
              .uni-tw { animation: uni-twinkle 2.8s ease-in-out infinite }
              @keyframes uni-flow { to { stroke-dashoffset: -24 } }
              .uni-flow { stroke-dasharray: 5 7; animation: uni-flow 1.1s linear infinite }
            `}</style>
            {/* 缩放漫游控件 */}
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
              {[['＋', () => zoomAt(1.3)], ['－', () => zoomAt(1 / 1.3)], ['⟲', () => setView({ k: 1, x: 0, y: 0 })]].map(([label, fn], i) => (
                <button key={i} onClick={fn as () => void} title={i === 2 ? '复位视图' : i === 0 ? '放大' : '缩小'}
                  className="h-8 w-8 rounded-xl bg-white/10 text-sm font-black text-white/80 backdrop-blur transition hover:bg-white/20">{label as string}</button>
              ))}
            </div>
            {/* 航线播放悬浮条 */}
            {playing && (
              <div className="absolute left-3 top-3 z-10 max-w-[280px] rounded-2xl bg-slate-900/85 p-3 text-white shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="animate-pulse">▶</span>
                  <span className="min-w-0 truncate">播放航线：{playing.theme}（{Math.min(playIdx + 1, playing.stops.length)}/{playing.stops.length}）</span>
                  <button onClick={() => { setPlaying(null); setView({ k: 1, x: 0, y: 0 }); }} className="ml-auto shrink-0 rounded-lg bg-white/20 px-2 py-0.5 text-[10px] hover:bg-white/30">⏹ 停止</button>
                </div>
                <div className="mt-0.5 truncate text-[10px] text-white/60">
                  第 {Math.min(playIdx + 1, playing.stops.length)} 站：{playing.stops[Math.min(playIdx, playing.stops.length - 1)]?.subject}·{playing.stops[Math.min(playIdx, playing.stops.length - 1)]?.lessonTitle}
                </div>
                <button onClick={askRouteTip} disabled={routeTipLoading} className="mt-1.5 rounded-lg bg-indigo-500 px-2 py-1 text-[10px] font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50">
                  {routeTipLoading ? '讲解中…' : routeTip && routeTip.theme === playing.theme ? '🤖 再讲一次' : '🤖 讲讲这条线'}
                </button>
                {routeTip && routeTip.theme === playing.theme && <p className="mt-1.5 text-[11px] leading-relaxed text-white/90">{routeTip.text}</p>}
              </div>
            )}
            <div className="pointer-events-none absolute bottom-2 left-3 z-10 text-[10px] font-bold text-white/30">滚轮缩放 · 拖拽平移 · 双击学科名飞过去{view.k > 1.05 ? ` · ${(view.k * 100).toFixed(0)}%` : ''}</div>
            <svg ref={svgRef} viewBox="0 0 1000 780" className="h-auto w-full touch-none select-none" style={{ maxHeight: 640, cursor: 'grab' }}
              onPointerDown={(e) => { dragRef.current = { sx: e.clientX, sy: e.clientY, x: view.x, y: view.y, moved: false }; }}
              onPointerMove={(e) => {
                const d = dragRef.current;
                if (!d) return;
                const rect = svgRef.current?.getBoundingClientRect();
                if (!rect) return;
                if (Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 4) d.moved = true;
                if (d.moved) setView((v) => ({ ...v, x: d.x + ((e.clientX - d.sx) / rect.width) * 1000, y: d.y + ((e.clientY - d.sy) / rect.height) * 780 }));
              }}
              onPointerUp={() => { setTimeout(() => { dragRef.current = null; }, 0); }}
              onPointerLeave={() => { dragRef.current = null; }}
            >
              <defs>
                {graph.subjects.map((s, i) => (
                  <radialGradient key={s.subject} id={`neb-${i}`}>
                    <stop offset="0%" stopColor={hexOf(s.subject)} stopOpacity="0.10" />
                    <stop offset="70%" stopColor={hexOf(s.subject)} stopOpacity="0.03" />
                    <stop offset="100%" stopColor={hexOf(s.subject)} stopOpacity="0" />
                  </radialGradient>
                ))}
                {graph.subjects.map((s, i) => (
                  <radialGradient key={s.subject + '-star'} id={`star-${i}`}>
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="35%" stopColor={hexOf(s.subject)} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={hexOf(s.subject)} stopOpacity="0" />
                  </radialGradient>
                ))}
              </defs>
              <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
                {/* 星云底色（每个学科一团很淡的学科色） */}
                {graph.subjects.map((s, i) => (
                  <ellipse key={s.subject} cx={s.x} cy={s.y} rx={160} ry={120} fill={`url(#neb-${i})`} opacity={focus !== null && focus !== s.subject ? 0.15 : 1} />
                ))}
                {/* 背景暗星纹理（确定性撒点·给宇宙纵深） */}
                {Array.from({ length: 80 }, (_, i) => (
                  <circle key={`bg-${i}`} cx={(i * 137.51) % 1000} cy={(i * 89.73 + 37) % 780} r={0.7 + ((i * 7) % 5) * 0.22} fill="#dbeafe" opacity={0.1 + ((i * 13) % 10) / 55} />
                ))}
                {/* 连线（选中时流光；播放航线时让位给航线路径） */}
                {graph.edges.map((e, i) => {
                  const a = graph.nodes.find((n) => n.id === e.a);
                  const b = graph.nodes.find((n) => n.id === e.b);
                  if (!a || !b) return null;
                  const on = sel !== null && (e.a === sel || e.b === sel);
                  const dim = playing !== null || (focus !== null && a.subject !== focus && b.subject !== focus);
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? '#fbbf24' : '#7dd3fc'} strokeWidth={on ? 2 : 1} opacity={dim ? 0.015 : on ? 0.9 : 0.035} className={on && playing === null ? 'uni-flow' : undefined} />;
                })}
                {/* 航线播放路径（金色流光串联站点） */}
                {playing && playStopNodes.length > 1 && (
                  <polyline points={playStopNodes.filter(Boolean).map((n) => `${n!.x},${n!.y}`).join(' ')} fill="none" stroke="#fbbf24" strokeWidth={2.8} strokeLinejoin="round" strokeLinecap="round" opacity={0.9} className="uni-flow" />
                )}
                {/* 学科锚点名（半透明圆角底衬保证任何光晕上可读·双击飞过去） */}
                {graph.subjects.map((s) => {
                  const fs = 13.5 / view.k;
                  const label = `${SUBJECTS[s.subject]?.emoji ?? ''} ${s.subject}`;
                  const w = (s.subject.length + 2.6) * fs + 8;
                  const faded = focus !== null && focus !== s.subject;
                  return (
                    <g key={s.subject} onDoubleClick={() => zoomTo(2.6, s.x, s.y)} style={{ cursor: 'zoom-in' }} opacity={faded ? 0.12 : 1}>
                      <rect x={s.x - w / 2} y={s.y - fs * 0.85} width={w} height={fs * 1.7} rx={6 / view.k} fill="#0b1020" opacity={faded ? 0.2 : 0.55} />
                      <text x={s.x} y={s.y + fs * 0.36} textAnchor="middle" fill={hexOf(s.subject)} fontSize={fs} fontWeight={800}
                        style={{ paintOrder: 'stroke', stroke: '#0b1020', strokeWidth: 2 / view.k, strokeLinejoin: 'round' }}>
                        {label}
                      </text>
                    </g>
                  );
                })}
                {/* 模块星星：星辉光晕+白星核（练过=亮星·没练=小暗星） */}
                {graph.nodes.map((n, idx) => {
                  const isStop = playing !== null && playStopIds.has(n.id);
                  const isNow = playing !== null && playStopNodes[playIdx]?.id === n.id;
                  const dim = playing !== null
                    ? !isStop
                    : (focus !== null && n.subject !== focus) || (sel !== null && !isLit(n) && n.id !== sel);
                  const acc = n.accuracy;
                  const bright = acc != null || isStop; // 亮星：练过或航线站点
                  const si = subjectIdx.get(n.subject) ?? -1;
                  return (
                    <g key={n.id} onClick={() => { if (dragRef.current?.moved) return; setSel(n.id === sel ? null : n.id); }} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer', opacity: dim ? 0.07 : 1 }}>
                      {isNow && <circle cx={n.x} cy={n.y} r={n.r * 1.7} fill="none" stroke="#fff" strokeWidth={1.2 / view.k} opacity={0.85} className="uni-tw" />}
                      {/* 星辉 */}
                      {si >= 0 && (
                        <circle cx={n.x} cy={n.y} r={n.r * (bright ? 2.2 : 1.05)} fill={`url(#star-${si})`}
                          opacity={bright ? (dim ? 0.18 : 0.7) : 0.08}
                          className={bright && !dim ? 'uni-tw' : undefined}
                          style={bright && !dim ? { animationDelay: `${(idx % 9) * 0.33}s` } : undefined} />
                      )}
                      {/* 星核 */}
                      <circle cx={n.x} cy={n.y} r={Math.max(2.5, n.r * (bright ? 0.7 : 0.24))} fill={bright ? '#fff' : hexOf(n.subject)} fillOpacity={bright ? 0.95 : 0.28}
                        stroke={n.id === sel || isNow ? '#fde68a' : 'none'} strokeWidth={(n.id === sel || isNow ? 2.2 : 0) / view.k} />
                      {n.doneCount === n.count && n.count > 0 && <text x={n.x} y={n.y + 3.5 / view.k} textAnchor="middle" fill="#0f172a" fontSize={9 / Math.max(1, view.k / 1.6)} fontWeight={800}>✓</text>}
                      {(hover === n.id || n.id === sel || isStop) && <text x={n.x} y={n.y - n.r * (bright ? 2.2 : 1.4) - 4 / view.k} textAnchor="middle" fill={isNow ? '#fde68a' : '#fff'} fontSize={10.5 / view.k} fontWeight={700}>{n.module}</text>}
                    </g>
                  );
                })}
              </g>
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
                <div className="mb-3 rounded-2xl bg-indigo-50 p-3">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className="text-sm">🤖</span>
                    <span className="text-xs font-black text-indigo-700">AI 星空讲解员</span>
                    <button onClick={askTip} disabled={tipLoading}
                      className="ml-auto rounded-lg bg-indigo-500 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50">
                      {tipLoading ? '讲解中…' : aiTip && aiTip.id === node.id ? '再讲一次' : '讲讲这颗星'}
                    </button>
                  </div>
                  {aiTip && aiTip.id === node.id ? (
                    <div>
                      <p className="text-[12px] leading-relaxed text-indigo-900">{aiTip.text}</p>
                      {aiTip.source !== 'error' && <p className="mt-1 text-right text-[10px] text-slate-400">{aiTip.source === 'llm' ? 'AI 生成' : '本地生成（配置 API Key 后为 AI 生成）'}</p>}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">点「讲讲这颗星」：AI 会讲这个模块是什么、为什么和别的学科相连、先学哪一节。</p>
                  )}
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
                            <span className="shrink-0 rounded-lg bg-amber-100 px-2.5 py-1.5 text-[11px] font-black text-amber-700">去补亮 →</span>
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

        {/* 星系航线：跨科共享知识串成的研学路线 */}
        {routes.length > 0 && (
          <div className="mt-4 rounded-3xl bg-white/80 p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">🛸</span>
              <h2 className="text-sm font-black text-slate-700">星系航线 · 跨学科研学路线</h2>
              <span className="hidden text-[10px] text-slate-400 sm:inline">跟着共享知识串门——每个学科出一站，从小学走到高中</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {routes.slice().sort((a, b) => (a.doneCount === a.stops.length ? 1 : 0) - (b.doneCount === b.stops.length ? 1 : 0)).map((r) => {
                const complete = r.doneCount === r.stops.length;
                return (
                <div key={r.theme} className={`w-64 shrink-0 rounded-2xl p-3 ring-1 ${complete ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-50 ring-slate-100'}`}>
                  <div className="mb-2 flex items-center gap-1.5">
                    <button onClick={() => {
                      if (playing?.theme === r.theme) { setPlaying(null); setView({ k: 1, x: 0, y: 0 }); }
                      else { setPlayIdx(0); setPlaying({ theme: r.theme, stops: r.stops }); }
                    }} title="在星图上播放这条航线（镜头逐站飞行）"
                      className={`min-w-0 shrink truncate rounded-full px-2 py-0.5 text-[11px] font-black transition hover:brightness-95 ${complete ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {complete ? '🎉' : '🔗'} {r.theme}{complete ? ' ✓' : ''} {playing?.theme === r.theme ? '⏹' : '▶'}
                    </button>
                    <span className="ml-auto shrink-0 text-[10px] font-bold text-slate-400">{r.doneCount}/{r.stops.length} 站</span>
                  </div>
                  <div className="space-y-1">
                    {r.stops.map((s, i) => {
                      const lesson = lessons.find((l) => l.id === s.lessonId);
                      const isLab = !!(lesson?.lab || lesson?.starterCode);
                      return (
                        <button key={s.subject + s.lessonId} onClick={() => nav(isLab ? `/lab/${s.lessonId}` : `/tutor/${s.lessonId}`)}
                          title={`${s.subject}·${s.module}（${s.band === 'primary' ? '小学' : s.band === 'junior' ? '初中' : '高中'}）`}
                          className={`flex w-full items-center gap-1.5 rounded-xl px-2 py-1.5 text-left text-[11px] font-semibold ring-1 transition ${s.done ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-white text-slate-600 ring-slate-100 hover:bg-sky-50 hover:text-sky-700'}`}>
                          <span className="w-3 shrink-0 text-center text-[9px] font-black text-slate-300">{i + 1}</span>
                          <span className="shrink-0">{s.done ? '✅' : '⏳'}</span>
                          <span className="min-w-0 flex-1 truncate">{s.emoji} {s.subject}·{s.lessonTitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
