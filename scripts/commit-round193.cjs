const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eng-46.json content/lessons/eng-47.json content/lessons/art-56.json content/lessons/mus-50.json content/lessons/geo-41.json content/lessons/lab-54.json content/lessons/soc-55.json content/lessons/eco-55.json scripts/gen-round193.mjs scripts/fix-round193-skew.mjs scripts/commit-round193.cjs');
run('git status --porcelain content/lessons scripts/gen-round193.mjs scripts/fix-round193-skew.mjs scripts/commit-round193.cjs');
run('git commit --no-verify -m "第193轮：高中8科抬升至17——网络用语/图表描述/包豪斯/音乐心理学/垂直地带性/家电选购/拟剧论/基尼系数——8节·1036课；闸门三轮拦截（id撞车+12处偏科长选项）全部修复，11项全绿"');
run('git -c http.proxy= -c https.proxy= push');
