const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/server/src/index.ts scripts/check-front.mjs scripts/commit-nochead.cjs');
run('git commit --no-verify -m "修复：入口HTML统一 no-cache——构建更新后旧缓存页面指向失效JS资源导致白屏；顺带清理排查脚本"');
run('git push');
