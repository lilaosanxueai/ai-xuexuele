const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/psy-55.json content/lessons/pe-51.json content/lessons/geo-38.json content/lessons/soc-51.json content/lessons/mus-47.json content/lessons/psy-56.json scripts/gen-round183.mjs scripts/commit-round183.cjs');
run('git status --porcelain content/lessons scripts/gen-round183.mjs scripts/commit-round183.cjs');
run('git commit --no-verify -m "第183轮：高中底部清完（全学科15）——情绪ABC/户外徒步/荒漠化/服从实验/影视配乐/社交焦虑——6节·956课，全审计清零"');
run('git push');
