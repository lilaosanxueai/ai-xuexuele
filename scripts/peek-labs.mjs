import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const IDS = process.argv.slice(2);
for (const f of fs.readdirSync(D)) {
  const j = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  if (!IDS.includes(j.id) || !j.lab) continue;
  console.log(`\n=== ${j.id} ${j.title} | grid=${j.lab.grid} ===`);
  console.log('params:', JSON.stringify(j.lab.params.map(p => `${p.name}(${p.label}) ${p.min}~${p.max} step${p.step} v${p.value}${p.unit ?? ''}`)));
  console.log(j.lab.code);
}
