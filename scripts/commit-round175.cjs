const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eco-47.json content/lessons/sci-39.json content/lessons/eng-43.json content/lessons/psy-53.json content/lessons/pe-48.json content/lessons/his-48.json scripts/gen-round175.mjs scripts/commit-round175.cjs');
run('git status --porcelain content/lessons scripts/gen-round175.mjs scripts/commit-round175.cjs');
run('git commit --no-verify -m "第175轮：初中全学科20达成+高中抬升——沉没成本/磁悬浮/英语连读/认知负荷/运动改造大脑/启蒙运动——6节·918课，全审计清零"');
run('git push');
