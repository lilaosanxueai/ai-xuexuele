const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island', 'scripts', 'gen-round157.mjs');
let s = fs.readFileSync(p, 'utf8');
// 修复模式：'      ] },\n    ] },\n    teach:' 只闭合了两层（应为三层 views 闭合）
// 正确结构应为：'      ] },\n    ],\n    teach:'
// 方法：把 '\n    ] },\n    teach:' 改为 '\n    ],\n    teach:'（当且仅当前面一行是 '      ] },'）
const lines = s.split('\n');
const out = [];
let fixCount = 0;
for (let i = 0; i < lines.length; i++) {
  const cur = lines[i];
  const next = lines[i + 1] || '';
  // 当前是 '  ] },' 下一行是 '    ] },' 下下行是 '    teach:'
  if (cur.trim() === '] },' && cur.startsWith('      ') &&
      next.trim() === '] },' && next.startsWith('    ') &&
      (lines[i + 2] || '').trim().startsWith('teach:')) {
    out.push(cur);           // '      ] },'  ← views blocks 闭合
    out.push('    ],');      // '    ],'       ← views 数组闭合
    i += 1;                  // 跳过错误的 '    ] },'
    fixCount++;
  } else {
    out.push(cur);
  }
}
fs.writeFileSync(p, out.join('\n'), 'utf8');
console.log('fixed', fixCount, 'double-close patterns');
