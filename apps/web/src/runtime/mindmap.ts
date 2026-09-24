import type { Lesson } from '@shared/types.ts';

/** 课程思维导图：自动从课题+课标知识点+讲解章节生成，帮助孩子建立知识结构 */

export interface MindNode {
  label: string;
  children: MindNode[];
}

/** 生成课程的思维导图：根=课题，一级=讲解章节，二级=章节要点（从【】定义句提取关键词） */
export function buildMindmap(lesson: Lesson): MindNode {
  const root: MindNode = { label: lesson.title, children: [] };
  const sections = lesson.teach?.sections ?? [];
  if (sections.length === 0) {
    // 无讲解时用课标知识点作一级
    for (const p of lesson.curriculum?.points ?? []) {
      root.children.push({ label: p, children: [] });
    }
    return root;
  }
  for (const sec of sections) {
    const node: MindNode = { label: sec.title, children: [] };
    // 从 body 提取【】要点作为子节点（最多 2 条）
    const claims = sec.body.match(/【[^】]+】/g) ?? [];
    for (const c of claims.slice(0, 2)) {
      node.children.push({ label: c.slice(1, -1).slice(0, 20), children: [] });
    }
    // 无【】时取 body 第一句前 20 字
    if (node.children.length === 0 && sec.body.trim()) {
      const first = sec.body.split(/[。！？\n]/)[0]?.trim().slice(0, 20);
      if (first) node.children.push({ label: first, children: [] });
    }
    root.children.push(node);
  }
  // 补充课标知识点未覆盖的为附加分支
  const secTitles = new Set(sections.map((s) => s.title));
  for (const p of lesson.curriculum?.points ?? []) {
    const key = p.replace(/[（(].*$/, '').slice(0, 4);
    if (![...secTitles].some((t) => t.includes(key) || key.includes(t.slice(0, 4)))) {
      if (root.children.length < 6) root.children.push({ label: p, children: [] });
    }
  }
  return root;
}

/** 导图布局：根居中，一级分左右两列，二级挂在一级下方 */
export interface LaidNode {
  x: number;
  y: number;
  label: string;
  depth: number;
  parent?: LaidNode;
}

export function layoutMindmap(root: MindNode): LaidNode[] {
  const out: LaidNode[] = [];
  const RN = { x: 0, y: 0, label: root.label, depth: 0 };
  out.push(RN);
  const cols = root.children;
  const half = Math.ceil(cols.length / 2);
  const vGap = 58;
  // 左列
  const startY = -((half - 1) * vGap) / 2;
  cols.slice(0, half).forEach((c, i) => {
    const y = startY + i * vGap;
    const n: LaidNode = { x: -110, y, label: c.label, depth: 1, parent: RN };
    out.push(n);
    c.children.slice(0, 2).forEach((g, j) => {
      out.push({ x: -220, y: y + (j - (c.children.length - 1) / 2) * 24, label: g.label, depth: 2, parent: n });
    });
  });
  // 右列
  const rCols = cols.slice(half);
  const rStart = -((rCols.length - 1) * vGap) / 2;
  rCols.forEach((c, i) => {
    const y = rStart + i * vGap;
    const n: LaidNode = { x: 110, y, label: c.label, depth: 1, parent: RN };
    out.push(n);
    c.children.slice(0, 2).forEach((g, j) => {
      out.push({ x: 220, y: y + (j - (c.children.length - 1) / 2) * 24, label: g.label, depth: 2, parent: n });
    });
  });
  return out;
}

export const depthColor = (d: number) => ['#1d4ed8', '#2563eb', '#94a3b8'][d] ?? '#64748b';
export const depthW = (d: number) => [88, 96, 88][d] ?? 84;
export const depthH = (d: number) => [32, 28, 22][d] ?? 22;
export const depthFont = (d: number) => [13, 11, 9][d] ?? 9;
