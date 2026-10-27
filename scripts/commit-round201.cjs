const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/chn-45.json content/lessons/chn-46.json content/lessons/chn-47.json content/lessons/chn-48.json content/lessons/chn-49.json content/lessons/chn-50.json scripts/gen-round201.mjs scripts/commit-round201.cjs');
run('git commit --no-verify -m "第201轮：语文阅读写作纵深——人物描写/环境描写/作文开头/作文结尾/欲扬先抑/托物言志——6节·1086课，语文达72课"');
run('git -c http.proxy= -c https.proxy= push');
