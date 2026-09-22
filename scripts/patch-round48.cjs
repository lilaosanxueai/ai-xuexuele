/** 第48轮接线：① /pairs 路由+地图入口 ② SubjectScreen 单元小测打印 */
const fs = require('fs');

// ---------- 1. App.tsx 路由 ----------
let p = 'apps/web/src/App.tsx';
let t = fs.readFileSync(p, 'utf8');
if (!t.includes('PairsGameScreen')) {
  const a1 = "const ExamScreen = lazy(() => import('./screens/ExamScreen.tsx'));";
  if (!t.includes(a1)) throw new Error('App anchor1 missing');
  t = t.replace(a1, a1 + "\nconst PairsGameScreen = lazy(() => import('./screens/PairsGameScreen.tsx'));");
  const a2 = '          <Route path="/exam/:subject" element={<ExamScreen />} />';
  if (!t.includes(a2)) throw new Error('App anchor2 missing');
  t = t.replace(a2, a2 + '\n          <Route path="/pairs" element={<PairsGameScreen />} />');
  fs.writeFileSync(p, t);
  console.log('route: ok');
} else console.log('route: already');

// ---------- 2. MapScreen 入口（挑战赛卡后追加连线卡） ----------
p = 'apps/web/src/screens/MapScreen.tsx';
t = fs.readFileSync(p, 'utf8');
if (!t.includes('/pairs')) {
  const a3 = "          </button>\n        </section>";
  if (!t.includes(a3)) throw new Error('Map anchor missing');
  t = t.replace(a3, `          </button>
          <button
            onClick={() => nav('/pairs')}
            className="rounded-3xl bg-gradient-to-br from-lime-400 to-emerald-500 p-6 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="text-5xl">🔗</div>
            <div className="mt-2 text-xl font-black">概念连连看</div>
            <div className="mt-1 text-xs opacity-90">知识点配对小游戏 · 全学科 · 越玩越牢</div>
          </button>
        </section>`);
  fs.writeFileSync(p, t);
  console.log('map entry: ok');
} else console.log('map entry: already');

// ---------- 3. SubjectScreen：单元小测面板加打印按钮 + 打印浮层 ----------
p = 'apps/web/src/screens/SubjectScreen.tsx';
t = fs.readFileSync(p, 'utf8');
if (!t.includes('unit-sheet')) {
  // 3a. 打印状态与函数（插在 startUnitTest 函数前）
  const a4 = '  /** 从模块内的课程随堂题抽 8 道组卷';
  if (!t.includes(a4)) throw new Error('SS anchor1 missing');
  const insert1 = [
    '  /** 单元小测打印：纸质卷 + 答案页 */',
    '  const [printing, setPrinting] = useState(false);',
    '  const doPrintUnitTest = () => {',
    '    setPrinting(true);',
    '    setTimeout(() => { window.print(); setPrinting(false); }, 120);',
    '  };',
    '',
    a4,
  ].join('\n');
  t = t.replace(a4, insert1);

  // 3b. 找到 unitTest 面板的关闭按钮旁加打印按钮；先定位渲染 unitTest 的 JSX
  const a5 = t.indexOf('unitTest &&');
  if (a5 < 0) throw new Error('SS anchor2 missing: unitTest panel not found');
  // 在面板标题行附近插打印按钮：查找包含 unitTest.module 的标题文本后
  const seg = t.slice(a5, a5 + 1200);
  const m = seg.match(/<h3[^>]*>([^<]*)\{unitTest\.module\}([^<]*)<\/h3>/);
  if (!m) throw new Error('SS anchor3 missing: title not found');
  const titleFull = m[0];
  const newTitle = titleFull.replace('</h3>', '</h3>\n            <button onClick={doPrintUnitTest} className="rounded-xl bg-slate-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800">🖨 打印试卷</button>');
  t = t.replace(titleFull, newTitle);

  // 3c. 打印浮层：挂在组件 return 的最外层 div 结束前——插到文件里第一个 "    </div>\n  );\n}" 的 return 收尾
  const closeAnchor = '    </div>\n  );\n}';
  const idx = t.indexOf(closeAnchor);
  if (idx < 0) throw new Error('SS anchor4 missing');
  const sheet = [
    '        {/* 单元小测打印浮层 */}',
    '        {printing && unitTest && (',
    '          <div id="unit-sheet" className="fixed inset-0 z-[80] overflow-y-auto bg-white p-8 text-slate-900">',
    '            <style>{\'@media print { body * { visibility: hidden !important; } #unit-sheet, #unit-sheet * { visibility: visible !important; } #unit-sheet { position: absolute !important; left: 0; top: 0; width: 100%; background: #fff; } }\'}</style>',
    '            <div className="mx-auto max-w-2xl">',
    '              <h1 className="text-center text-2xl font-black">{subject} · {unitTest.module} 单元测验卷</h1>',
    '              <p className="mt-1 text-center text-sm text-slate-500">共 {unitTest.exercises.length} 题 · 来自 AI学学乐课程库 · {new Date().toLocaleDateString(\'zh-CN\')}</p>',
    '              <p className="mt-1 text-center text-xs text-slate-400">姓名：____________　得分：______</p>',
    '              <div className="mt-6 space-y-5">',
    '                {unitTest.exercises.map((ex, i) => (',
    '                  <div key={i} className="break-inside-avoid">',
    '                    <div className="font-semibold">{i + 1}. {ex.q}</div>',
    '                    <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">',
    '                      {ex.options.map((opt, oi) => (<div key={oi}>{\'ABCD\'[oi]}. {opt}</div>))}',
    '                    </div>',
    '                    <div className="mt-1 text-sm">答：（　　　　）</div>',
    '                  </div>',
    '                ))}',
    '              </div>',
    '              <div className="mt-10 break-before-page border-t border-slate-300 pt-6">',
    '                <h2 className="text-lg font-black">参考答案</h2>',
    '                <ol className="mt-2 grid grid-cols-2 gap-1 text-sm">',
    '                  {unitTest.exercises.map((ex, i) => (<li key={i}>{i + 1}. {\'ABCD\'[ex.answer]}　{ex.explain.slice(0, 40)}</li>))}',
    '                </ol>',
    '              </div>',
    '            </div>',
    '          </div>',
    '        )}',
    '',
  ].join('\n');
  t = t.slice(0, idx) + sheet + t.slice(idx);
  fs.writeFileSync(p, t);
  console.log('unit print: ok');
} else console.log('unit print: already');
