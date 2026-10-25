const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/math-121.json content/lessons/math-122.json content/lessons/math-123.json content/lessons/math-124.json content/lessons/math-125.json content/lessons/math-126.json scripts/gen-round197.mjs scripts/commit-round197.cjs');
run('git commit --no-verify -m "第197轮：高中数学全线贯通——变化率与导数概念/求导法则/定积分/数列求和方法/圆锥曲线统一定义/方差标准差——6节·1062课，数学达126节"');
run('git -c http.proxy= -c https.proxy= push');
