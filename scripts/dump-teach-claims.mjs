import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 提取全部讲解里的【】定义/公式句（承重事实），供人工复核 */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const out = [];
for (const f of fs.readdirSync(D)) {
  const j = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  if (!j.teach) continue;
  const claims = [];
  for (const sec of j.teach.sections) {
    for (const p of sec.body.split('\n')) {
      const m = p.trim().match(/^(【[^】]*】)(.*)$/);
      if (m) claims.push(m[1] + m[2].slice(0, 110));
    }
  }
  if (claims.length) out.push(`## ${j.id} ${j.subjectArea}${j.grade} ${j.title}\n` + claims.map(c => '  ' + c).join('\n'));
}
fs.writeFileSync(path.join(path.dirname(D), '..', 'teach-claims.txt'), out.join('\n'), 'utf-8');
console.log(`共 ${out.length} 课含定义句，总字符 ${out.join('\n').length}`);
