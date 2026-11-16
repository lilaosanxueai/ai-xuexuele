// 第 221 轮扫描：画曲线的网格课 + 缩放系数（找双轴刻度候选）
import fs from 'node:fs';

const dir = 'content/lessons';
const out = [];
for (const f of fs.readdirSync(dir)) {
  try {
    const j = JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8'));
    if (!j.lab || j.lab.grid !== true) continue;
    const code = j.lab.code || j.starterCode || '';
    if (!/while/.test(code)) continue; // 只看描点画曲线的课
    const nums = {};
    for (const m of code.matchAll(/\*\s*(\d+(?:\.\d+)?)\s*[,)\s]/g)) {
      const k = Number(m[1]);
      if (k >= 4 && k <= 100) nums[k] = (nums[k] || 0) + 1;
    }
    const keys = Object.keys(nums).sort((a, b) => nums[b] - nums[a]);
    out.push(String(j.id).padEnd(11) + String(j.subjectArea ?? '').padEnd(5) + keys.map((k) => k + 'x' + nums[k]).join(' ').padEnd(26) + String(j.title).slice(0, 18));
  } catch { /* skip */ }
}
console.log(out.join('\n'));
console.log('total:', out.length);
