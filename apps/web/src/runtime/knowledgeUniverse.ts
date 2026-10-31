import type { Lesson, ProfileProgress } from '@shared/types.ts';

/**
 * 知识宇宙（全局知识图谱）：把 18 学科的全部课标模块画成一张星空图。
 * 节点 = 学科×模块（大小=课数·颜色=学科·亮度=掌握度），连线 = 不同学科模块共享的知识关键词。
 * 纯函数 + 确定性布局（同输入同输出），渲染交给 UniverseScreen。
 */

export interface UniverseNode {
  /** 学科·模块 */
  id: string;
  subject: string;
  module: string;
  /** 模块内课程数 */
  count: number;
  /** 已完成课程数 */
  doneCount: number;
  /** 随堂练平均正确率 0-100；无数据为 null */
  accuracy: number | null;
  /** 模块最早一课的 order（用作模块排序） */
  firstOrder: number;
  x: number;
  y: number;
  r: number;
}

export interface UniverseEdge {
  a: string;
  b: string;
  /** 共享关键词数 */
  weight: number;
  shared: string[];
}

export interface UniverseSubject {
  subject: string;
  count: number;
  modules: number;
  /** 已完成课程数 */
  done: number;
  /** 完成率 0-1 */
  doneRatio: number;
  /** 学科平均正确率 0-100（无数据为 null） */
  accuracy: number | null;
  x: number;
  y: number;
}

/** 薄弱星云：值得优先补亮的模块（低正确率或大而未启动） */
export interface WeakSpot {
  id: string;
  subject: string;
  module: string;
  accuracy: number | null;
  doneCount: number;
  count: number;
  /** 给孩子看的一句话理由 */
  reason: string;
  /** 推荐先学/先练的一课（未完成优先·全完成则练正确率最低的） */
  lessonId: string | null;
  lessonTitle: string | null;
  lessonEmoji: string;
}

export interface UniverseGraph {
  nodes: UniverseNode[];
  edges: UniverseEdge[];
  subjects: UniverseSubject[];
}

/** 知识关键词：去掉括号注释·取前几个字（与 crossLink 同思路·稍宽） */
function keyOf(point: string): string {
  return point.replace(/[（(].*$/, '').replace(/[·，。:：]/g, '').trim().slice(0, 4);
}

function keysOf(lesson: Lesson): Set<string> {
  return new Set((lesson.curriculum?.points ?? []).map(keyOf).filter((k) => k.length >= 2));
}

const W = 1000;
const H = 780;
const CX = W / 2;
const CY = H / 2;

/** 学科锚点在椭圆上·模块绕锚点成小星团（确定性·无随机） */
export function buildUniverse(
  lessons: Lesson[],
  progress: ProfileProgress | null,
  opts: { maxEdges?: number; maxPerNode?: number } = {},
): UniverseGraph {
  const maxEdges = opts.maxEdges ?? 120;
  const maxPerNode = opts.maxPerNode ?? 4;

  // 1) 分组：subject × module
  const groups = new Map<string, { subject: string; module: string; lessons: Lesson[] }>();
  for (const l of lessons) {
    const subject = l.subjectArea ?? '信息科技';
    const module = l.curriculum?.module ?? '其他';
    const id = subject + '·' + module;
    const g = groups.get(id) ?? { subject, module, lessons: [] };
    g.lessons.push(l);
    groups.set(id, g);
  }

  // 2) 学科星系锚点：按课程数排序（大学科均匀分布·相邻错开）后绕椭圆
  const subjectNames = [...new Set([...groups.values()].map((g) => g.subject))];
  const byCount = new Map<string, number>();
  for (const g of groups.values()) byCount.set(g.subject, (byCount.get(g.subject) ?? 0) + g.lessons.length);
  const ordered = [...subjectNames].sort((a, b) => (byCount.get(b) ?? 0) - (byCount.get(a) ?? 0));
  const anchor = new Map<string, { x: number; y: number }>();
  ordered.forEach((s, i) => {
    const ang = (i / ordered.length) * Math.PI * 2 - Math.PI / 2;
    anchor.set(s, { x: CX + Math.cos(ang) * 330, y: CY + Math.sin(ang) * 250 });
  });

  // 3) 模块节点：绕学科锚点成小星团
  const nodes: UniverseNode[] = [];
  const bySubject = new Map<string, UniverseNode[]>();
  for (const g of groups.values()) {
    const list = bySubject.get(g.subject) ?? [];
    bySubject.set(g.subject, list);
    const node: UniverseNode = {
      id: g.subject + '·' + g.module, subject: g.subject, module: g.module,
      count: g.lessons.length, doneCount: 0, accuracy: null,
      firstOrder: Math.min(...g.lessons.map((l) => l.order)), x: 0, y: 0,
      r: 10 + Math.sqrt(g.lessons.length) * 3,
    };
    // 掌握度：随堂练正确率平均 + 完成数
    const accs: number[] = [];
    for (const l of g.lessons) {
      const done = progress?.lessons[l.id]?.status === 'completed';
      if (done) node.doneCount += 1;
      const ex = progress?.exercises?.[l.id];
      if (ex && ex.total > 0) accs.push((ex.correct / ex.total) * 100);
    }
    if (accs.length > 0) node.accuracy = Math.round(accs.reduce((s, v) => s + v, 0) / accs.length);
    list.push(node);
    nodes.push(node);
  }
  for (const [subject, list] of bySubject) {
    const a = anchor.get(subject)!;
    // 学科内模块按首次出现顺序绕圈
    list.sort((p, q) => p.firstOrder - q.firstOrder);
    const m = list.length;
    const ringR = 30 + Math.min(70, m * 4);
    list.forEach((n, j) => {
      const ang = (j / m) * Math.PI * 2;
      n.x = a.x + Math.cos(ang) * ringR;
      n.y = a.y + Math.sin(ang) * ringR * 0.8;
    });
  }

  // 4) 连线：不同学科模块共享关键词
  const keysByNode = new Map<string, Set<string>>();
  for (const g of groups.values()) {
    const set = new Set<string>();
    for (const l of g.lessons) for (const k of keysOf(l)) set.add(k);
    keysByNode.set(g.subject + '·' + g.module, set);
  }
  const all = [...groups.keys()];
  const raw: UniverseEdge[] = [];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const ga = groups.get(all[i])!;
      const gb = groups.get(all[j])!;
      if (ga.subject === gb.subject) continue; // 跨学科才有意义
      const ka = keysByNode.get(all[i])!;
      const kb = keysByNode.get(all[j])!;
      const shared = [...ka].filter((k) => kb.has(k));
      if (shared.length > 0) raw.push({ a: all[i], b: all[j], weight: shared.length, shared });
    }
  }
  // 全局按权重取前 maxEdges·每个节点最多 maxPerNode 条（保不糊成毛线球）
  raw.sort((p, q) => q.weight - p.weight);
  const degree = new Map<string, number>();
  const edges: UniverseEdge[] = [];
  for (const e of raw) {
    if (edges.length >= maxEdges) break;
    const da = degree.get(e.a) ?? 0;
    const db = degree.get(e.b) ?? 0;
    if (da >= maxPerNode || db >= maxPerNode) continue;
    degree.set(e.a, da + 1);
    degree.set(e.b, db + 1);
    edges.push(e);
  }

  const subjects: UniverseSubject[] = ordered.map((s) => {
    const list = bySubject.get(s) ?? [];
    const count = byCount.get(s) ?? 0;
    const done = list.reduce((sum, n) => sum + n.doneCount, 0);
    const accs = list.map((n) => n.accuracy).filter((a): a is number => a != null);
    return {
      subject: s, count, modules: list.length,
      done, doneRatio: count > 0 ? done / count : 0,
      accuracy: accs.length > 0 ? Math.round(accs.reduce((x, v) => x + v, 0) / accs.length) : null,
      x: anchor.get(s)!.x, y: anchor.get(s)!.y,
    };
  });

  return { nodes, edges, subjects };
}

/**
 * 薄弱星云：从宇宙图里挑出最值得补亮的模块。
 * 两类入选：① 练过但正确率低于阈值（默认 60%）② 课程 ≥3 节却一节没学（整片黑暗的大星球）。
 * 排序：越薄弱越靠前（正确率升序 → 未启动按课数降序），同分按 firstOrder 稳定。
 */
export function universeWeakSpots(
  graph: UniverseGraph,
  lessons: Lesson[],
  progress: ProfileProgress | null,
  opts: { limit?: number; weakAcc?: number } = {},
): WeakSpot[] {
  const limit = opts.limit ?? 6;
  const weakAcc = opts.weakAcc ?? 60;

  // 模块内的课程清单（复用 lessons·保持与节点同一分组规则）
  const byModule = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const id = (l.subjectArea ?? '信息科技') + '·' + (l.curriculum?.module ?? '其他');
    const list = byModule.get(id) ?? [];
    list.push(l);
    byModule.set(id, list);
  }

  type Cand = { score: number; spot: WeakSpot };
  const cands: Cand[] = [];
  for (const n of graph.nodes) {
    const list = (byModule.get(n.id) ?? []).slice().sort((a, b) => a.order - b.order);
    let score = 0;
    let reason = '';
    if (n.accuracy != null && n.accuracy < weakAcc) {
      score = 1000 + (weakAcc - n.accuracy) * 10; // 越低越急
      reason = `正确率只有 ${n.accuracy}%，练一练把星星补亮`;
    } else if (n.doneCount === 0 && n.count >= 3) {
      score = 300 + n.count * 10; // 大而未启动
      reason = `${n.count} 节课还全暗，来点亮第一颗`;
    } else {
      continue; // 健康模块不进星云
    }
    // 推荐课：未完成的按顺序第一节；全完成则挑正确率最低的一课
    let pick: Lesson | null = list.find((l) => progress?.lessons[l.id]?.status !== 'completed') ?? null;
    if (!pick) {
      let worst = 101;
      for (const l of list) {
        const ex = progress?.exercises?.[l.id];
        if (ex && ex.total > 0) {
          const acc = (ex.correct / ex.total) * 100;
          if (acc < worst) { worst = acc; pick = l; }
        }
      }
      pick = pick ?? list[0] ?? null;
    }
    cands.push({
      // 同级先出现的模块略优先·保证确定性
      score: score - Math.min(200, n.firstOrder / 1000),
      spot: {
        id: n.id, subject: n.subject, module: n.module,
        accuracy: n.accuracy, doneCount: n.doneCount, count: n.count,
        reason, lessonId: pick?.id ?? null, lessonTitle: pick?.title ?? null, lessonEmoji: pick?.emoji ?? '⭐',
      },
    });
  }

  cands.sort((a, b) => b.score - a.score);
  return cands.slice(0, limit).map((c) => c.spot);
}
