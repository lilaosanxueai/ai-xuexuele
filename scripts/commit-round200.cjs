const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/phys-56.json content/lessons/phys-57.json content/lessons/phys-58.json content/lessons/phys-59.json content/lessons/phys-60.json content/lessons/phys-61.json scripts/gen-round200.mjs scripts/commit-round200.cjs');
run('git commit --no-verify -m "第200轮里程碑：物理收官——电势能/焦耳定律/带电粒子圆周舞/全反射/光电效应/原子核——6节·1080课，物理63节，数理化生四大理科主干全通"');
run('git -c http.proxy= -c https.proxy= push');
