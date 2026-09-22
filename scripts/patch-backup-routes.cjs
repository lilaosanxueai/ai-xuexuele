/** 给 routes.ts 加备份/恢复路由（幂等） */
const fs = require('fs');
const p = 'apps/server/src/routes.ts';
let t = fs.readFileSync(p, 'utf8');
if (t.includes('/backup/')) { console.log('already'); process.exit(0); }
const anchor = '  // ---------- 作品 ----------';
if (!t.includes(anchor)) throw new Error('anchor missing');
const L = String.fromCharCode(10);
const add = [
  '  // ---------- 备份与恢复（本地数据一份都不丢） ----------',
  "  r.get('/backup/:profileId', (req, res) => {",
  "    res.json({ app: 'ai-xuexuele', version: 1, exportedAt: new Date().toISOString(), profileId: req.params.profileId, progress: store.getProgress(req.params.profileId) });",
  '  });',
  "  r.post('/restore/:profileId', (req, res) => {",
  '    const p = req.body?.progress;',
  "    if (!p || typeof p !== 'object' || p.profileId !== req.params.profileId) return res.status(400).json({ error: '备份文件格式不对或与当前档案不匹配' });",
  "    if (!p.lessons || !p.dailyUsage) return res.status(400).json({ error: '备份缺少学习进度数据' });",
  '    res.json(store.replaceProgress(req.params.profileId, p));',
  '  });',
  '',
  anchor,
].join(L);
t = t.replace(anchor, add);
fs.writeFileSync(p, t);
console.log('routes patched:', t.includes('/restore/'));
