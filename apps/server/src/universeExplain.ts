/**
 * AI 星空讲解员：给知识宇宙的一个课标模块写讲解（未配置 LLM 或调用失败时的离线模板兜底）。
 * 纯函数：同样的数据 → 同样的讲解词。
 */

export interface UniverseExplainPayload {
  subject: string;
  module: string;
  count: number;
  done: number;
  accuracy: number | null;
  /** 跨科连线（共享知识的模块） */
  links: { subject: string; module: string; shared: string[] }[];
  /** 建议先学的课名（未完成的排前面，最多 3 个） */
  next: string[];
}

export function offlineUniverseExplain(p: UniverseExplainPayload): string {
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

export const UNIVERSE_EXPLAIN_SYSTEM = '你是「AI学学乐」知识星空的讲解员，为 K-12 学生与家长讲解一个课标模块。根据 JSON 数据写 90-150 字的中文讲解：①这个模块大概讲什么（通俗，一句话能懂）②它和列出的跨科模块为什么相连（共享的知识是什么）③结合完成情况与正确率给一条具体的先学建议。语气亲切自然、不用列表、不空泛、不提分数排名。';
