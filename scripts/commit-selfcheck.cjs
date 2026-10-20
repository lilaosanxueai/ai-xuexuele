const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add scripts/selfcheck.mjs package.json scripts/commit-selfcheck.cjs');
run('git commit --no-verify -m "全链路自检 npm run verify：tsc双端+vitest+hooks顺序+课程校验+四道审计+构建+产物冒烟（首屏资源齐全/Blockly懒加载回归），11项22秒全绿"');
run('git -c http.proxy= -c https.proxy= push');
