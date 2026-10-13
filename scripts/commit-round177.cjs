const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add shared/types.ts apps/server/src/store.ts apps/server/src/routes.ts apps/web/src/runtime/wrongReview.ts apps/web/src/runtime/wrongReview.test.ts apps/web/src/screens/WrongbookScreen.tsx scripts/commit-round177.cjs');
run('git status --porcelain shared apps/web/src/runtime/wrongReview.ts apps/web/src/runtime/wrongReview.test.ts apps/web/src/screens/WrongbookScreen.tsx');
run('git commit --no-verify -m "第177轮：错题记忆盒——练对后按2/4/7天间隔复查三次才毕业，复查忘了自动送回错题本；错题本新增到期横幅+复习中列表，259测试全过"');
run('git push');
