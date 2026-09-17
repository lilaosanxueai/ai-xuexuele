// 用项目自身的 Python 解释器对全部实验课 lab.code 做真实解析测试
// 用法: npx tsx scripts/test-labcode.ts
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parsePy } from '../apps/web/src/runtime/pyinterp.ts';

const dir = join(import.meta.dirname, '..', 'content', 'lessons');
let pass = 0, fail = 0;
const failures: string[] = [];
for (const f of readdirSync(dir).filter(x => x.endsWith('.json'))) {
  const d = JSON.parse(readFileSync(join(dir, f), 'utf-8'));
  const code = d.lab?.code ?? d.starterCode;
  if (!d.lab || !code) continue;
  const r = parsePy(code);
  if (r.error) { fail++; failures.push(`${f} [行${r.error.line}] ${r.error.message}${r.error.hint ? ' | ' + r.error.hint : ''}`); }
  else pass++;
}
console.log(`实验课解析测试: ${pass} 通过 / ${fail} 失败`);
failures.forEach(x => console.log('  [FAIL] ' + x));
process.exit(fail > 0 ? 1 : 0);
