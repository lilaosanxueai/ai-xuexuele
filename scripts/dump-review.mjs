import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 导出全部课程随堂题为可读审校稿（按学科分文件） */
const D = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const lessons = [];
for (const f of fs.readdirSync(D)) {
  if (!f.endsWith('.json')) continue;
  lessons.push(JSON.parse(fs.readFileSync(path.join(D, f), 'utf8')));
}
lessons.sort((a, b) => a.subjectArea.localeCompare(b.subjectArea, 'zh') || a.order - b.order);

const groups = {
  math: ['数学'],
  science: ['物理', '化学'],
  biosci: ['生物', '地理', '科学'],
  liberal: ['语文', '英语', '信息科技', '音乐', '道德与法治', '艺术', '劳动', '体育与健康'],
};
for (const [name, subjects] of Object.entries(groups)) {
  const lines = [];
  for (const l of lessons.filter((x) => subjects.includes(x.subjectArea))) {
    lines.push(`\n## ${l.id} | ${l.subjectArea}${l.grade}年级 | ${l.title}`);
    (l.exercises ?? []).forEach((q, i) => {
      const opts = q.options.map((o, j) => String.fromCharCode(65 + j) + '.' + o).join('  ');
      lines.push(`Q${i + 1} ${q.q}`);
      lines.push(`   ${opts}`);
      lines.push(`   ✓${String.fromCharCode(65 + q.answer)} | 解析: ${q.explain}`);
    });
  }
  fs.writeFileSync(path.join(path.dirname(D), '..', 'scripts', `review-${name}.txt`).replace('scripts', 'scripts'), lines.join('\n'), 'utf8');
  console.log(`review-${name}.txt: ${lessons.filter((x) => subjects.includes(x.subjectArea)).length} 课`);
}
