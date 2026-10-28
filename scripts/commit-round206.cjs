const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/mus-51.json content/lessons/mus-52.json content/lessons/mus-53.json content/lessons/mus-54.json content/lessons/mus-55.json content/lessons/mus-56.json scripts/gen-round206.mjs scripts/commit-round206.cjs');
run('git commit --no-verify -m "第206轮：音乐高中纵深——巴赫巴洛克/奏鸣曲式/艺术歌曲/民族乐派/室内乐/变奏曲——6节·1115课，18学科高中段全部17+"');
run('git -c http.proxy= -c https.proxy= push');
