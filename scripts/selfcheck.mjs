import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/** 全链路自检：类型 → 测试 → 内容与代码审计 → 构建 → 产物冒烟。
 *  把「白屏」「hooks 顺序」「审计清零」这些教训固化成一道闸门，npm run verify 一键全查。 */

const ROOT = path.resolve(import.meta.dirname, '..');
const results = [];
const t0 = Date.now();

function step(name, fn) {
  const s = Date.now();
  try {
    const out = fn();
    results.push({ name, ok: true, ms: Date.now() - s, note: out ?? '' });
    console.log(`✓ ${name}${out ? '  — ' + out : ''}`);
  } catch (e) {
    const tail = String(e.stdout || e.message || '').split(/\r?\n/).filter(Boolean).slice(-4).join(' ⏎ ');
    results.push({ name, ok: false, ms: Date.now() - s, note: tail });
    console.log(`✗ ${name}\n    ${tail}`);
  }
}

const run = (cmd) => execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, env: { ...process.env, FORCE_COLOR: '0' } });
const countOf = (s, re) => (s.match(re) ?? []).length;

console.log('==== 学学乐全链路自检 ====\n');

step('tsc 类型检查（web）', () => { run('npx tsc -p apps/web --noEmit'); return ''; });
step('tsc 类型检查（server）', () => { run('npx tsc -p apps/server --noEmit'); return ''; });

step('vitest 单元测试', () => {
  const out = run('npx vitest run').replace(/\x1b\[[0-9;]*m/g, ''); // 剥掉 ANSI 色码再解析
  const m = out.match(/Tests\s+(\d+) passed/);
  if (!m) throw new Error('测试结果解析失败（可能有用例挂了）');
  return `${m[1]} 个全过`;
});

step('hooks 顺序审计（React#310 预防）', () => {
  const out = run('node scripts/audit-hook-order.mjs');
  if (!out.includes('无「早退后有hook」')) throw new Error(out.trim().split(/\r?\n/).slice(-3).join(' '));
  return '21 屏无风险模式';
});

step('课程库校验（validate-lessons）', () => {
  const out = run('py scripts/validate-lessons.py');
  const line = out.split(/\r?\n/).find((l) => l.includes('合计')) ?? '';
  if (!/错误 0 条/.test(out)) throw new Error('存在校验错误');
  return line.trim();
});

step('题库审计（偏科/无解析/重复题）', () => {
  const out = run('node scripts/audit-exercises.mjs');
  const bad = countOf(out, /\[skew\] [1-9]/) + countOf(out, /\[noExp\] [1-9]/) + countOf(out, /\[dupQ\] [1-9]/);
  if (bad > 0) throw new Error(out.trim().split(/\r?\n/).filter((l) => /\[(skew|noExp|dupQ)\] [1-9]/.test(l)).join(' ⏎ '));
  return 'skew/noExp/dupQ 全零';
});

step('泄漏审计（长选项暗示）', () => {
  const out = run('node scripts/audit-leak.mjs');
  if (countOf(out, /\[longHint\] [1-9]/) > 0) throw new Error(out.trim().split(/\r?\n/).filter((l) => /\[longHint\] [1-9]/.test(l)).join(' ⏎ '));
  return 'longHint 全零';
});

step('interact 卡片审计', () => {
  const out = run('node --experimental-transform-types scripts/audit-interact.mjs');
  const bad = countOf(out, /\[\w+\] [1-9]\d* 节/);
  if (bad > 0) throw new Error(out.trim().split(/\r?\n/).filter((l) => /\[\w+\] [1-9]\d* 节/.test(l)).join(' ⏎ '));
  return '全零';
});

step('SVG 舞台审计', () => {
  const out = run('node --experimental-transform-types scripts/audit-stages.mjs');
  if (countOf(out, /\[error\] [1-9]/) > 0) throw new Error('存在 error 级舞台');
  return 'error 全零';
});

step('前端构建', () => {
  run('npm run build');
  return '';
});

step('产物冒烟（首屏资源 + Blockly 懒加载回归）', () => {
  const html = fs.readFileSync(path.join(ROOT, 'apps/web/dist/index.html'), 'utf8');
  const assets = [...html.matchAll(/(?:src|href)="\/?assets\/([^"]+)"/g)].map((m) => m[1]);
  const missing = assets.filter((a) => !fs.existsSync(path.join(ROOT, 'apps/web/dist/assets', a)));
  if (missing.length) throw new Error(`首屏引用了不存在的资源: ${missing.join(', ')}`);
  if (/blockly/i.test(assets.join(','))) throw new Error('Blockly 出现在首屏——懒加载被打破');
  const total = assets.reduce((s, a) => s + fs.statSync(path.join(ROOT, 'apps/web/dist/assets', a)).size, 0);
  return `${assets.length} 个首屏资源齐全，共 ${(total / 1024).toFixed(0)}KB（Blockly 已挡在首屏外）`;
});

const failed = results.filter((r) => !r.ok);
console.log(`\n==== 自检完成：${results.length - failed.length}/${results.length} 通过 · ${(Date.now() - t0) / 1000 | 0}s ====`);
if (failed.length) {
  console.log('未通过：' + failed.map((f) => f.name).join(' · '));
  process.exit(1);
}
