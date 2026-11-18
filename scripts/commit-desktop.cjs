const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/utils/lessonHotkeys.ts apps/web/src/screens/TutorScreen.tsx apps/web/src/screens/LabScreen.tsx apps/web/src/screens/UniverseScreen.tsx SKILL.md scripts/commit-desktop.cjs');
run('git commit --no-verify -m "桌面体验双项：①键盘翻课——←/→ 在辅导页/实验室页直接上一课下一课（useLessonHotkeys 共享 hook·输入框聚焦不打扰·与顶部‹›同序列，实测 mus-57→mus-58 实验室路由正确）②知识宇宙 hover 性能——681 节点渲染层独立 useMemo（deps 不含 hover·悬停面板更新时跳过整棵子树重建）+星名标签改 CSS :hover 驱动；hooks 顺序审计含 memo 内 return 的误报以移动块位化解；verify 11/11·295 测试"');
console.log('COMMIT-OK（push 单独执行）');
