const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eth-54.json content/lessons/eth-55.json content/lessons/eth-56.json content/lessons/eth-57.json content/lessons/eth-58.json scripts/gen-round205.mjs scripts/commit-round205.cjs');
run('git commit --no-verify -m "第205轮：高中道法纵深——人格权/婚姻继承/侵权责任/多元解纷/选举民主——5节·1109课，道法高中达22课"');
run('git -c http.proxy= -c https.proxy= push');
