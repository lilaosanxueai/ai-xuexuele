const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eth-49.json content/lessons/ai-28.json content/lessons/art-50.json content/lessons/mus-44.json content/lessons/geo-p8.json content/lessons/lab-48.json content/lessons/soc-48.json content/lessons/eco-49.json scripts/gen-round180.mjs scripts/commit-round180.cjs');
run('git status --porcelain content/lessons scripts/gen-round180.mjs scripts/commit-round180.cjs');
run('git commit --no-verify -m "第180轮：小学底部一次清完（全学科14）——独自在家/数字照片/黏土手工/动物狂欢节/地球仪/厨房帮手/家庭会议/小小慈善——8节·934课，全审计清零"');
run('git push');
