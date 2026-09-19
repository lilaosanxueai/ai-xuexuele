import fs from 'node:fs';

/** 修复 18 节新课里的解释器不兼容语法（列表/三元/引号缺失/中文引号内容） */
const F = {
  'bio-01': { old: 'chain = ["兔", "狐", "鹰"]', new: null, patch: (c) => {
    // 删掉列表行，用 if 链取名字
    let s = c.replace('chain = ["兔", "狐", "鹰"]\n', '');
    s = s.replace('write(chain[i], x, y, "#ffffff", 11)', [
      'if i == 0:', '            write("兔", x, y, "#ffffff", 11)',
      'if i == 1:', '            write("狐", x, y, "#ffffff", 11)',
      'if i == 2:', '            write("鹰", x, y, "#ffffff", 11)',
    ].join('\n'));
    return s;
  }},
  'bio-02': { patch: (c) => c.replace('write("不是"用进废退"：长颈鹿不是伸长的脖子", -150, -160, "#ea580c", 11)', 'write("不是用进废退：长颈鹿不是伸长脖子的", -150, -160, "#ea580c", 11)') },
  'bio-03': { patch: (c) => c.replace('defs = ["第一道：皮肤·黏膜", "第二道：吞噬细胞·溶菌酶", "第三道：抗体·免疫细胞"]', '# 三道防线名（逐个 if 写）') .replace('write(defs[i], 0, y, "#ffffff", 11)', [
    'if i == 0:', '        write("第一道：皮肤黏膜", 0, y, "#ffffff", 11)',
    'if i == 1:', '        write("第二道：吞噬细胞", 0, y, "#ffffff", 11)',
    'if i == 2:', '        write("第三道：抗体免疫细胞", 0, y, "#ffffff", 11)',
  ].join('\n')) },
  'bio-06': { patch: (c) => c.replace('write "乳酸菌→酸奶·醋酸菌→醋·曲霉→酱", \n', '').replace('write "乳酸菌→酸奶·醋酸菌→醋·曲霉→酱", ', 'write("乳酸菌酸奶·醋酸菌醋", -60, -135, "#b45309", 10)\n') },
  'chem-02': { patch: (c) => c.replace('fill_rect(-160, -20, 70, 70, conc > 2 ? "#e2e8f0" : "#eff6ff")', 'fill_rect(-160, -20, 70, 70, "#e2e8f0")') },
  'chem-03': { patch: (c) => c.replace('write("温度足够：还原反应进行！铁被"抢"了出来", -120, 95, "#16a34a", 12)', 'write("温度足够：还原反应进行！铁被夺了出来", -120, 95, "#16a34a", 12)') },
  'chem-07': { patch: (c) => c.replace(/i == 2 \? "#a16207" : "#78716c"/g, '"#78716c"').replace('fill_rect(x, 60, 90, 12, i == 2 ? "#a16207" : "#78716c")', 'fill_rect(x, 60, 90, 12, "#78716c")') },
};

for (const [id, cfg] of Object.entries(F)) {
  const p = `content/lessons/${id}.json`;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const code = cfg.patch(j.lab.code);
  if (code === j.lab.code) { console.log(`⚠ ${id} 未变化`); continue; }
  j.lab.code = code;
  j.starterCode = code;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  console.log(`修复 ${id}`);
}
