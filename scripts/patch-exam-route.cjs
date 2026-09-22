/** 给 App.tsx 挂 ExamScreen 路由（幂等） */
const fs = require('fs');
const p = 'apps/web/src/App.tsx';
let t = fs.readFileSync(p, 'utf8');
if (!t.includes('ExamScreen')) {
  const anchor = "const SearchScreen = lazy(() => import('./screens/SearchScreen.tsx'));";
  if (!t.includes(anchor)) throw new Error('anchor not found');
  t = t.replace(anchor, anchor + "\nconst ExamScreen = lazy(() => import('./screens/ExamScreen.tsx'));");
  const routeAnchor = '          <Route path="/search" element={<SearchScreen />} />';
  if (!t.includes(routeAnchor)) throw new Error('route anchor not found');
  t = t.replace(routeAnchor, routeAnchor + '\n          <Route path="/exam/:subject" element={<ExamScreen />} />');
  fs.writeFileSync(p, t);
  console.log('routed: true');
} else {
  console.log('routed: already');
}
