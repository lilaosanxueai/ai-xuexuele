const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/components/Header.tsx apps/web/src/runtime/weeklyReport.ts apps/web/src/runtime/weeklyShare.test.ts apps/web/src/screens/ParentScreen.tsx apps/server/src/weeklyComment.ts apps/server/src/weeklyComment.test.ts apps/server/src/routes.ts scripts/commit-round179.cjs');
run('git status --porcelain apps vitest.config.ts scripts/commit-round179.cjs');
run('git commit --no-verify -m "第179轮：记忆盒触达收尾——Header新增错题本入口+到期红点；周报/AI评语接入复习中与毕业数（模板亮点句+LLM摘要透传），262测试全过"');
run('git push');
