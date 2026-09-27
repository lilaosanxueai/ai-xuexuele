import fs from 'node:fs';
import path from 'node:path';

/**
 * 第82轮：interact 原生卡课程「内容体检」（JSON 级离线审计，不跑代码）。
 * 检查 152 节卡片课的视图/区块/文字/探索问题质量：
 *  - 结构：视图数、每视图区块数、标题/副题/金句完整性
 *  - 内容：碎句（<6字）、与标题重复的区块、视图标题雷同
 *  - 配套：explore 探索问题、teach 讲解、exercises 随堂练 是否缺失
 * 用法: npx tsx scripts/audit-interact.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const lessons = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    if (Array.isArray(j)) lessons.push(...j); else if (j) lessons.push(j);
  } catch { /* skip */ }
}

const flagged = { noSlider: [], thinViews: [], fragBlocks: [], dupBlocks: [], dupTitles: [], noExplore: [], noTeach: [], noExercises: [] };
let total = 0;
for (const l of lessons) {
  if (!l.interact) continue;
  total++;
  const id = l.id + '「' + (l.title ?? '') + '」';
  const views = l.interact.views ?? [];
  if (views.length < 2) { flagged.noSlider.push(id + ' (仅' + views.length + '个视图，滑块无效果)'); continue; }

  const viewTitles = views.map((v) => (v.title ?? '').trim());
  views.forEach((v, i) => {
    const blocks = v.blocks ?? [];
    if (blocks.length === 0) { flagged.thinViews.push(id + ' 视图' + (i + 1) + ' 无任何区块'); return; }
    const textLen = blocks.reduce((s, b) => s + ((b.text ?? '') + (b.title ?? '') + (b.items ?? []).join('')).length, 0);
    if (textLen < 24) flagged.thinViews.push(id + ' 视图' + (i + 1) + '「' + viewTitles[i] + '」内容过薄(' + textLen + '字)');
    for (const b of blocks) {
      const t = (b.text ?? '').trim();
      const titled = !!(b.title ?? '').toString().trim();
      // 有标题的「标签-值」卡（如 情绪：愤怒、委屈）是合法形态，只揪无标题碎句
      if (t && !titled && t.length < 6 && (b.kind === 'info' || b.kind === 'highlight')) {
        flagged.fragBlocks.push(id + ' 视图' + (i + 1) + '「' + t + '」碎句');
      }
      if (t && t === (v.title ?? '').trim()) {
        flagged.dupBlocks.push(id + ' 视图' + (i + 1) + ' 区块与标题重复「' + t.slice(0, 12) + '」');
      }
    }
  });
  // 标题雷同判定：标题+副题组合仍重复才算（副题能区分时是可以接受的形态）
  const combos = new Set(views.map((v) => ((v.title ?? '') + '||' + (v.subtitle ?? '')).trim()));
  const uniqTitles = new Set(viewTitles.filter(Boolean));
  if (combos.size < Math.min(views.length, 4) && views.length >= 3 && uniqTitles.size < views.length) {
    flagged.dupTitles.push(id + ' (' + views.length + '个视图仅' + combos.size + '种标题组合)');
  }
  if (!(l.interact.explore ?? []).length && !(l.lab?.explore ?? []).length) flagged.noExplore.push(id);
  if (!l.teach) flagged.noTeach.push(id);
  if (!l.exercises?.length) flagged.noExercises.push(id);
}

console.log('=== interact 卡片课内容体检：共 ' + total + ' 节 ===');
for (const [k, arr] of Object.entries(flagged)) {
  console.log('\n[' + k + '] ' + arr.length + ' 节');
  arr.slice(0, 30).forEach((s) => console.log('  - ' + s));
  if (arr.length > 30) console.log('  …还有 ' + (arr.length - 30) + ' 节');
}
