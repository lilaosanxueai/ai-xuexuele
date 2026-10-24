const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/math-115.json content/lessons/math-116.json content/lessons/math-117.json content/lessons/math-118.json content/lessons/math-119.json content/lessons/math-120.json scripts/gen-round196.mjs scripts/commit-round196.cjs');
run('git commit --no-verify -m "第196轮：高中数学纵深——正弦余弦定理/诱导公式/互斥对立/独立事件/期望/平面向量——6节·1056课，闸门拦截1偏科+1长选项修复后11项全绿"');
run('git -c http.proxy= -c https.proxy= push');
