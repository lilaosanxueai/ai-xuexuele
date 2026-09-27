import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 第78轮：interact 卡片微清理——删掉与标题/副标题完全重复的冗余信息块 */
const DIR = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const WRITE = process.argv[2] === 'write';
let touched = 0, removed = 0;
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
  const p = path.join(DIR, f);
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!l.interact) continue;
  let dirty = false;
  for (const v of l.interact.views) {
    const before = v.blocks.length;
    v.blocks = v.blocks.filter((b) => {
      if (b.kind !== 'info') return true;
      const t = (b.text ?? '').trim();
      const dup = t === v.title || (v.subtitle && t === v.subtitle.trim()) || t.length <= 1;
      return !dup;
    });
    if (v.blocks.length !== before) { dirty = true; removed += before - v.blocks.length; }
  }
  if (dirty) {
    touched++;
    if (WRITE) fs.writeFileSync(p, JSON.stringify(l, null, 2) + '\n');
  }
}
console.log(`清理 ${touched} 课，删除冗余块 ${removed} 个 ${WRITE ? '(已写入)' : '(dry-run)'}`);
