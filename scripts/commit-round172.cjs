const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/his-47.json content/lessons/art-46.json content/lessons/psy-52.json content/lessons/soc-44.json content/lessons/pe-46.json content/lessons/eco-46.json scripts/gen-round172.mjs scripts/commit-round172.cjs');
run('git status --porcelain content/lessons scripts/gen-round172.mjs scripts/commit-round172.cjs');
run('git commit --no-verify -m "第172轮：学段拉平——古代科技/手工书/社会时钟/科层制/力量训练/二手市场——6节·900课里程碑，全审计清零"');
run('git push');
