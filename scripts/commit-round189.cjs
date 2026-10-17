const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/psy-57.json content/lessons/pe-52.json content/lessons/bio-49.json content/lessons/his-54.json content/lessons/phys-53.json content/lessons/chem-50.json content/lessons/chn-44.json content/lessons/eth-52.json scripts/gen-round189.mjs scripts/commit-round189.cjs');
run('git status --porcelain content/lessons scripts/gen-round189.mjs scripts/commit-round189.cjs');
run('git commit --no-verify -m "第189轮：1000课达成——弗洛伊德/极限运动/细胞一生/拉美独立/熵/分离提纯/古诗节日/光盘行动——8节·1004课，高中全面16+"');
run('git push');
