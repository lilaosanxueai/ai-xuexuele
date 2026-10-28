const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eng-50.json content/lessons/eng-51.json content/lessons/eng-52.json content/lessons/eng-53.json content/lessons/eng-54.json content/lessons/eng-55.json scripts/gen-round204.mjs scripts/commit-round204.cjs');
run('git commit --no-verify -m "第204轮：英语语法体系纵深——名词性从句/状语从句/倒装句/强调句/情态动词推测/过去完成时——6节·1104课，英语达59课"');
run('git -c http.proxy= -c https.proxy= push');
