/** ParentScreen 挂「💾 数据备份」页签，组件在 components/BackupTab.tsx（幂等） */
const fs = require('fs');
const p = 'apps/web/src/screens/ParentScreen.tsx';
let t = fs.readFileSync(p, 'utf8');
if (t.includes('BackupTab')) { console.log('already'); process.exit(0); }

const edits = [
  // 1. import
  ["import { api } from '../api.ts';", "import { api } from '../api.ts';\nimport BackupTab from '../components/BackupTab.tsx';"],
  // 2. Tab 类型
  ["type Tab = 'progress' | 'report' | 'chats' | 'settings';", "type Tab = 'progress' | 'report' | 'chats' | 'settings' | 'backup';"],
  // 3. 页签按钮（插到 settings 项前面）
  ["['settings', '⚙️", "['backup', '💾 数据备份'],\n        ['settings', '⚙️"],
  // 4. 渲染分支
  ["tab === 'progress' ? <ProgressTab profileId={profileId} />", "tab === 'backup' ? <BackupTab profileId={profileId} />\n        : tab === 'progress' ? <ProgressTab profileId={profileId} />"],
];
for (const [from, to] of edits) {
  if (!t.includes(from)) throw new Error('anchor missing: ' + from.slice(0, 30));
  t = t.replace(from, to);
}
fs.writeFileSync(p, t);
console.log('ParentScreen patched: true');
