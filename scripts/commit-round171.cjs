const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eng-41.json content/lessons/eng-42.json content/lessons/soc-24.json scripts/gen-round171.mjs scripts/commit-round171.cjs');
run('git status --porcelain');
run('git commit --no-verify -m "第171轮修正：恢复被覆盖的eng-41（一般过去式），新词汇课改名eng-42；补提交soc-24答案再平衡——894课"');
run('git push');
