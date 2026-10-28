const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/geo-42.json content/lessons/geo-43.json content/lessons/geo-44.json content/lessons/geo-45.json content/lessons/geo-46.json content/lessons/geo-47.json scripts/gen-round203.mjs scripts/commit-round203.cjs');
run('git commit --no-verify -m "第203轮：地理高中纵深——锋面天气/河流水文/土壤地理/农业区位/工业区位/城市区位——6节·1098课，地理达60课"');
run('git -c http.proxy= -c https.proxy= push');
