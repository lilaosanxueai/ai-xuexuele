const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/ai-33.json content/lessons/mus-49.json content/lessons/eco-54.json content/lessons/art-54.json content/lessons/geo-p9.json content/lessons/lab-52.json content/lessons/pe-53.json content/lessons/soc-53.json scripts/gen-round191.mjs scripts/commit-round191.cjs');
run('git status --porcelain content/lessons scripts/gen-round191.mjs scripts/commit-round191.cjs');
run('git commit --no-verify -m "第191轮：小学底部拉平至15——输入法打字/音乐会礼仪/购物清单/撕纸画/南极北极/叠被子/传统游戏/口述历史——8节·1020课，全审计一次清零"');
run('git push');
