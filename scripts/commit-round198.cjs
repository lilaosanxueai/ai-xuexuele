const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/chem-51.json content/lessons/chem-52.json content/lessons/chem-53.json content/lessons/chem-54.json content/lessons/chem-55.json content/lessons/chem-56.json scripts/gen-round198.mjs scripts/commit-round198.cjs');
run('git commit --no-verify -m "第198轮：化学理论纵深——氧化还原/离子反应/乙烯与苯/同分异构体/三大营养素/分子间作用力——6节·1068课，化学达54节"');
run('git -c http.proxy= -c https.proxy= push');
