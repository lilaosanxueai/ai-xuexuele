import * as Blockly from 'blockly';
import type { BlockCatalogEntry, BuildOp } from '@shared/types.ts';
import { BLOCK_DEFS } from '../blocks/definitions.ts';

/** AI 代搭：把指令序列搭上 Blockly 画布（逐块动画，孩子全程看着拼） */

interface FieldDef { name: string; kind: 'number' | 'text' | 'dropdown'; options?: string[] }

/** 从积木定义生成目录（按课程工具箱过滤），发给大模型选积木用 */
export function buildCatalog(allowedTypes: string[]): BlockCatalogEntry[] {
  const allow = new Set(allowedTypes);
  const catalog: BlockCatalogEntry[] = [];
  for (const def of BLOCK_DEFS as unknown as {
    type: string; message0: string; args0?: unknown[]; args1?: unknown[]; args2?: unknown[];
    previousStatement?: unknown; output?: unknown;
  }[]) {
    if (!def.type || !allow.has(def.type)) continue;
    const fields: FieldDef[] = [];
    for (const arg of [...(def.args0 ?? []), ...(def.args1 ?? []), ...(def.args2 ?? [])] as { type: string; name?: string; check?: string | string[]; options?: [string, string][] }[]) {
      if (!arg?.name) continue;
      if (arg.type === 'field_number') fields.push({ name: arg.name, kind: 'number' });
      else if (arg.type === 'field_input') fields.push({ name: arg.name, kind: 'text' });
      else if (arg.type === 'field_dropdown') fields.push({ name: arg.name, kind: 'dropdown', options: (arg.options ?? []).map((o) => o[1]) });
      // 数字槽（input_value check Number）：代搭时以影子数字积木填入
      else if (arg.type === 'input_value' && (Array.isArray(arg.check) ? arg.check.includes('Number') : arg.check === 'Number')) {
        fields.push({ name: arg.name, kind: 'number' });
      }
    }
    catalog.push({
      type: def.type,
      label: def.message0.replace(/%\d/g, '□'),
      message: def.message0,
      fields,
      container: [...(def.args1 ?? []), ...(def.args2 ?? [])].some((a) => (a as { type?: string })?.type === 'input_statement'),
      // 帽子积木：json 里没有 previousStatement 键（语句积木显式写 null，值积木有 output）
      hat: def.previousStatement === undefined && def.output === undefined,
    });
  }
  return catalog;
}

const MAX_BLOCKS = 60;
const MAX_DEPTH = 4;

/** 校验并清洗大模型/本地解析器输出的指令：白名单、字段过滤、数值限幅、总量封顶 */
export function sanitizeOps(input: unknown, catalog: BlockCatalogEntry[], depth = 0): BuildOp[] {
  if (!Array.isArray(input) || depth > MAX_DEPTH) return [];
  const byType = new Map(catalog.map((c) => [c.type, c]));
  const out: BuildOp[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const op = raw as { op?: unknown; type?: unknown; fields?: unknown; children?: unknown; branch?: unknown };
    if (op.op === 'clear') { out.push({ op: 'clear' }); continue; }
    if (op.op !== 'add' || typeof op.type !== 'string') continue;
    const entry = byType.get(op.type);
    if (!entry) continue;

    const fields: Record<string, string> = {};
    if (op.fields && typeof op.fields === 'object') {
      for (const f of entry.fields) {
        const v = (op.fields as Record<string, unknown>)[f.name];
        if (v == null) continue;
        const s = String(v);
        if (f.kind === 'number') {
          const n = Number.parseFloat(s);
          if (Number.isFinite(n)) fields[f.name] = String(Math.min(999, Math.max(-999, n)));
        } else if (f.kind === 'dropdown') {
          if (f.options?.includes(s)) fields[f.name] = s;
        } else {
          fields[f.name] = s.replace(/[\u0000-\u001f]/g, '').slice(0, 40);
        }
      }
    }

    const next: BuildOp = { op: 'add', type: entry.type };
    if (Object.keys(fields).length) next.fields = fields;
    if (entry.container) {
      const branch = typeof op.branch === 'string' && ['STACK', 'STACK2'].includes(op.branch) ? op.branch : 'STACK';
      const children = sanitizeOps(op.children, catalog, depth + 1).filter((c) => c.op === 'add');
      if (children.length) { next.branch = branch; next.children = children; }
    }
    out.push(next);
    if (out.length >= MAX_BLOCKS) break;
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 语句积木链（含子容器递归）。返回链尾积木（用于顶层续接下一组指令） */
function addChain(
  ws: Blockly.WorkspaceSvg,
  ops: BuildOp[],
  connectFirst: (b: Blockly.BlockSvg) => void,
  animate: boolean,
  state: { added: number },
): Blockly.BlockSvg | null {
  let tail: Blockly.BlockSvg | null = null;
  for (const op of ops) {
    if (op.op !== 'add' || !op.type) continue;
    const b = ws.newBlock(op.type) as Blockly.BlockSvg;
    for (const [name, value] of Object.entries(op.fields ?? {})) {
      try {
        if (b.getField(name)) b.setFieldValue(value, name);
        else {
          // 数字槽（input_value）：放一个影子数字积木进去
          const input = b.getInput(name);
          if (input?.connection) {
            const num = ws.newBlock('island_number') as Blockly.BlockSvg;
            num.setFieldValue(value, 'NUM');
            num.initSvg();
            num.render();
            input.connection.connect(num.outputConnection!);
          }
        }
      } catch { /* 字段不存在则跳过 */ }
    }
    if (tail) tail.nextConnection?.connect(b.previousConnection!);
    else connectFirst(b);
    tail = b;
    b.initSvg();
    b.render();
    state.added++;
    if (op.children?.length) {
      const input = b.getInput(op.branch && op.branch !== 'STACK' ? op.branch : 'STACK');
      const conn = input?.connection;
      if (conn) addChain(ws, op.children.filter((c) => c.op === 'add'), (child) => conn.connect(child.previousConnection!), animate, state);
    }
  }
  return tail;
}

/** 执行指令：搭上画布。animate=true 时逐块出现（每块 ~0.4s），最后自动排整齐。顶层指令依次串成一条执行链 */
export async function applyBuildOps(
  ws: Blockly.WorkspaceSvg,
  ops: BuildOp[],
  opts: { animate?: boolean; onEach?: (n: number) => void } = {},
): Promise<{ added: number }> {
  const { animate = true, onEach } = opts;
  const state = { added: 0 };
  let topTail: Blockly.BlockSvg | null = null;
  for (const op of ops) {
    if (op.op === 'clear') {
      ws.clear();
      topTail = null;
      if (animate) await sleep(300);
      continue;
    }
    const prevTail = topTail;
    const tail = addChain(
      ws,
      [op],
      (b) => {
        // 顶层续接：接到上一组链尾的 next（帽子积木没有 previousConnection，自成新链头）
        if (prevTail && b.previousConnection) prevTail.nextConnection?.connect(b.previousConnection);
      },
      false,
      state,
    );
    if (tail) topTail = tail;
    onEach?.(state.added);
    if (animate) await sleep(400);
  }
  try { ws.cleanUp(); } catch { /* 空画布等情况 */ }
  try { ws.scrollCenter(); } catch { /* 忽略 */ }
  return { added: state.added };
}
