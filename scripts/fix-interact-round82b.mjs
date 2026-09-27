import fs from 'node:fs';
import path from 'node:path';

/**
 * 第82轮B：interact 修复收尾（art-23 加厚、eng-27 补标题）。
 * 用法: npx tsx scripts/fix-interact-round82b.mjs
 */
const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'content', 'lessons');

const EXTRA = {
  'art-23': {
    '连年有鱼': { kind: 'info', icon: '🖼️', title: '小知识', text: '苏州桃花坞、天津杨柳青是年画两大名产地' },
    '福到了': { kind: 'info', icon: '📍', title: '怎么贴', text: '大门的福字要正贴，水缸、柜子才倒贴（福到）' },
    '多子多福': { kind: 'info', icon: '🌰', title: '同类吉祥果', text: '枣子=早生贵子，桂圆=富贵团圆，莲子=连生贵子' },
    '福禄双全': { kind: 'info', icon: '🎐', title: '一物多寓', text: '葫芦口小肚大=纳财，藤蔓绵延=子孙绵延，门口挂还保平安' },
  },
};

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
const done = [];
for (const f of files) {
  const p = path.join(DIR, f);
  let data;
  try { data = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const arr = Array.isArray(data) ? data : [data];
  let changed = false;
  for (const l of arr) {
    if (!l.interact) continue;
    if (l.id === 'art-23') {
      l.interact.views.forEach((v) => {
        const add = EXTRA['art-23'][v.title];
        if (add && v.blocks) v.blocks.push(add);
      });
      changed = true;
      done.push('art-23');
    }
    if (l.id === 'eng-27') {
      l.interact.views.forEach((v) => {
        (v.blocks ?? []).forEach((b) => {
          if (b.kind === 'info' && !b.title && (b.text ?? '').includes('复数')) b.title = '要记住';
        });
      });
      changed = true;
      done.push('eng-27');
    }
  }
  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
console.log('done:', done.join(', ') || '无');
