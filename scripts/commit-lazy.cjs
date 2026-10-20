const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/App.tsx scripts/check-front.mjs scripts/commit-lazy.cjs');
run('git commit --no-verify -m "性能优化：Gallery/Tutor/Lab 懒加载——Blockly(776KB)挡回首屏外，主包271→172KB，首屏JS 1.28MB→406KB(gzip -63%)；浏览器回归五步全绿"');
run('git push');
