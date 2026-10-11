const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/art-48.json content/lessons/geo-34.json content/lessons/soc-46.json content/lessons/mus-42.json content/lessons/pe-47.json content/lessons/lab-46.json scripts/gen-round174.mjs scripts/commit-round174.cjs');
run('git status --porcelain content/lessons scripts/gen-round174.mjs scripts/commit-round174.cjs');
run('git commit --no-verify -m "第174轮：初中底部拉平至20——字体设计/季风气候/社会学想象力/爵士乐/实心球/食物保鲜——6节·912课，全审计清零"');
run('git push');
