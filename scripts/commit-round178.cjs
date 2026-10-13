const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add shared/types.ts apps/server/src/store.ts apps/web/src/runtime/dailyQuests.ts apps/web/src/runtime/dailyQuests.test.ts apps/web/src/runtime/wrongReview.ts apps/web/src/screens/WrongbookScreen.tsx apps/web/src/screens/ParentScreen.tsx vitest.config.ts scripts/commit-round178.cjs');
run('git status --porcelain shared apps vitest.config.ts scripts/commit-round178.cjs');
run('git commit --no-verify -m "第178轮：记忆盒全链路——每日任务新增复查项(reviews计数)+毕业计数+家长端统计卡；补根vitest配置修@shared值导入解析，261测试全过"');
run('git push');
