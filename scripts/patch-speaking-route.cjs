/** 挂 SpeakingScreen 路由（幂等） */
const fs = require('fs');
const p = 'apps/web/src/App.tsx';
let t = fs.readFileSync(p, 'utf8');
if (t.includes('SpeakingScreen')) { console.log('already'); process.exit(0); }
const a1 = "const PairsGameScreen = lazy(() => import('./screens/PairsGameScreen.tsx'));";
if (!t.includes(a1)) throw new Error('a1 missing');
t = t.replace(a1, a1 + "\nconst SpeakingScreen = lazy(() => import('./screens/SpeakingScreen.tsx'));");
const a2 = '          <Route path="/pairs" element={<PairsGameScreen />} />';
if (!t.includes(a2)) throw new Error('a2 missing');
t = t.replace(a2, a2 + '\n          <Route path="/speaking" element={<SpeakingScreen />} />');
fs.writeFileSync(p, t);
console.log('routed');
