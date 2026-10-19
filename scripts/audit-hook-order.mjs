import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(import.meta.dirname, '..', 'apps/web/src/screens');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'));
let issues = 0;
for (const f of files) {
  const lines = fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/);
  let hookCount = 0;
  let lastHookLine = 0;
  const findings = [];
  // 扫描组件函数体（第一个 export default function 之后）
  const start = lines.findIndex((l) => /export default function/.test(l));
  for (let i = start; i < lines.length; i++) {
    const l = lines[i];
    const isHook = /^\s*(const|let)\s+\w+\s*=\s*use[A-Z]/.test(l) || /^\s*use[A-Z]\w*\(/.test(l);
    if (isHook) { hookCount++; lastHookLine = i + 1; continue; }
    // 早退：return null / return <JSX，且位于最后一个 hook 之后；排除 effect 清理函数 return () => {...}
    const isEarlyReturn = /^\s*(if \([^)]*\) )?return (\(?null|\()/i.test(l) && !/return \(\s*\)?\s*=>/.test(l) && i + 1 < lines.length;
    if (isEarlyReturn && lastHookLine > 0) {
      // 看这个 return 之后是否还有 hook（到文件尾或下一个函数）
      for (let j = i + 1; j < lines.length; j++) {
        if (/^function |^const \w+ = \(|^export /.test(lines[j])) break;
        if (/^\s*(const|let)\s+\w+\s*=\s*use[A-Z]/.test(lines[j]) || /^\s*use[A-Z]\w*\(/.test(lines[j])) {
          findings.push(`L${i + 1} 早退后 L${j + 1} 仍有hook: ${lines[j].trim().slice(0, 70)}`);
          break;
        }
      }
    }
  }
  if (findings.length) {
    issues++;
    console.log('==', f, `(${hookCount} hooks)`);
    findings.forEach((x) => console.log('  ', x));
  }
}
console.log(issues === 0 ? '\n全部屏幕无「早退后有hook」模式 ✓' : `\n${issues} 个文件存在风险模式`);
