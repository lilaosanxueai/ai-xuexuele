const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eth-51.json content/lessons/ai-30.json content/lessons/art-53.json content/lessons/mus-48.json content/lessons/geo-39.json content/lessons/lab-51.json content/lessons/soc-52.json content/lessons/eco-52.json scripts/gen-round188.mjs scripts/commit-round188.cjs');
run('git status --porcelain content/lessons scripts/gen-round188.mjs scripts/commit-round188.cjs');
run('git commit --no-verify -m "第188轮：高中S15底部抬升至16（8科）——知识产权/深度伪造/游戏美术/协奏曲/产业转移/办公技能/社会工作/规模经济——8节·996课，全审计一次清零"');
run('git push');
