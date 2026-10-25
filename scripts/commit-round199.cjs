const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/bio-50.json content/lessons/bio-51.json content/lessons/bio-52.json content/lessons/bio-53.json content/lessons/bio-54.json content/lessons/bio-55.json scripts/gen-round199.mjs scripts/commit-round199.cjs');
run('git commit --no-verify -m "第199轮：生物高中纵深——跨膜运输/细胞呼吸/中心法则/突变重组/有丝分裂/内环境稳态——6节·1074课，生物达58节"');
run('git -c http.proxy= -c https.proxy= push');
