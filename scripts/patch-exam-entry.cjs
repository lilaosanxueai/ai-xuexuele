/** 在 SubjectScreen 知识图谱 section 上方插入期末模拟卷入口（幂等） */
const fs = require('fs');
const p = 'apps/web/src/screens/SubjectScreen.tsx';
let t = fs.readFileSync(p, 'utf8');
if (t.includes('/exam/')) { console.log('already'); process.exit(0); }
const anchor = `        {/* 知识图谱掌握度（松鼠AI 式模块级诊断）；无成绩时也显示（全部"未检测"），保证单元小测入口常在 */}`;
if (!t.includes(anchor)) throw new Error('anchor not found');
const btn = `        {/* 期末模拟卷：全学科抽题组卷 + 限时 + 模块诊断 */}
        <button
          onClick={() => nav(\`/exam/\${encodeURIComponent(subject)}\`)}
          className="mb-4 flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-sky-500 p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5"
        >
          <div className="text-4xl">📝</div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-black">期末模拟卷</div>
            <div className="text-xs opacity-85">全学科抽 20 题 · 限时 30 分钟 · 结卷按课标模块诊断薄弱点</div>
          </div>
          <div className="shrink-0 rounded-xl bg-white/20 px-4 py-2 text-sm font-bold">开考 →</div>
        </button>

`;
t = t.replace(anchor, btn + anchor);
fs.writeFileSync(p, t);
console.log('exam entry added');
