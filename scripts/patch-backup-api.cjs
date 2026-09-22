/** api.ts 加 backup/restore 方法（幂等） */
const fs = require('fs');
const p = 'apps/web/src/api.ts';
let t = fs.readFileSync(p, 'utf8');
if (t.includes('backup:')) { console.log('already'); process.exit(0); }
const anchor = '  settings: () =>';
if (!t.includes(anchor)) throw new Error('anchor missing');
const add = [
  '  /** 学习数据备份（导出 JSON）/ 恢复（导入覆盖） */',
  "  backup: (profileId: string) => req<{ app: string; version: number; exportedAt: string; profileId: string; progress: ProfileProgress }>(`/api/backup/${profileId}`),",
  '  restore: (profileId: string, progress: ProfileProgress) =>',
  "    req<ProfileProgress>(`/api/restore/${profileId}`, { method: 'POST', body: JSON.stringify({ progress }) }),",
  anchor,
].join('\n');
t = t.replace(anchor, add);
fs.writeFileSync(p, t);
console.log('api patched:', t.includes('backup:'));
