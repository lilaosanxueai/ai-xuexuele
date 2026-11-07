/**
 * AI 星空讲解员：给知识宇宙的一个课标模块写讲解（未配置 LLM 或调用失败时的离线模板兜底）。
 * 纯函数：同样的数据 → 同样的讲解词。
 */

export interface UniverseExplainPayload {
  /** module=单模块讲解；route=航线讲解（串起多学科） */
  kind?: 'module' | 'route';
  subject: string;
  module: string;
  count: number;
  done: number;
  accuracy: number | null;
  /** 跨科连线（共享知识的模块）；航线讲解时为各站点 */
  links: { subject: string; module: string; shared: string[] }[];
  /** 建议先学的课名（未完成的排前面，最多 3 个） */
  next: string[];
}

export function offlineUniverseExplain(p: UniverseExplainPayload): string {
  if (p.kind === 'route') return offlineRouteExplain(p);
  const parts: string[] = [];
  parts.push(`「${p.module}」是${p.subject}知识版图上的一颗星，共 ${p.count} 节课${p.done > 0 ? `，你已经点亮了 ${p.done} 节` : '，还没有开始点亮'}`);
  if (p.accuracy != null && p.accuracy < 70) parts.push(`当前正确率 ${p.accuracy}%，值得优先补一补`);
  if (p.links.length > 0) {
    const names = p.links.slice(0, 3).map((l) => `${l.subject}「${l.module}」`).join('、');
    parts.push(`它和 ${names} 共享同一片知识——在这里学会一次，到别的学科也能用`);
  }
  if (p.next[0]) parts.push(`建议从《${p.next[0]}》开始`);
  return parts.join('。') + '。';
}

/** 航线讲解：这条线为什么这么串、走过几站、下一站去哪 */
function offlineRouteExplain(p: UniverseExplainPayload): string {
  const stops = p.links;
  const parts: string[] = [];
  parts.push(`「${p.module}」航线串起了 ${stops.length} 个学科：${stops.map((s) => s.subject).join('→')}`);
  parts.push(`它们共享同一片知识「${p.module}」——同一件事，在每个学科里各有一副面孔，走一遍就都认得了`);
  if (p.done > 0) parts.push(`已经走过 ${p.done}/${stops.length} 站`);
  else parts.push(`一站都还没走，今天就能出发`);
  return parts.join('。') + '。';
}

export const UNIVERSE_EXPLAIN_SYSTEM = '你是「AI学学乐」知识星空的讲解员，为 K-12 学生与家长讲解一个课标模块。根据 JSON 数据写 90-150 字的中文讲解：①这个模块大概讲什么（通俗，一句话能懂）②它和列出的跨科模块为什么相连（共享的知识是什么）③结合完成情况与正确率给一条具体的先学建议。语气亲切自然、不用列表、不空泛、不提分数排名。';

export const UNIVERSE_ROUTE_SYSTEM = '你是「AI学学乐」知识星空的讲解员，为 K-12 学生与家长讲解一条跨学科研学航线（由共享同一知识关键词的多个学科课程串成）。根据 JSON 数据写 90-150 字的中文讲解：①这条航线的主题（module 字段）把哪些学科串了起来、为什么它们会有关系 ②沿着站点走一遭能看到什么（同一知识在不同学科的不同面孔）③结合完成情况给一条出发建议。语气亲切自然、不用列表、不空泛。';
