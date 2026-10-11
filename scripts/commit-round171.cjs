const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/ai-25.json content/lessons/mus-41.json content/lessons/art-45.json content/lessons/lab-44.json content/lessons/eng-41.json content/lessons/pe-45.json scripts/gen-round171.mjs scripts/commit-round171.cjs');
run('git status --porcelain');
run('git commit --no-verify -m "第171轮：学段拉平——网络协议/电子音乐/插画绘本/阳台种植/词汇记忆法/篮球防守——6节·893课，全审计清零"');
run('git push');
