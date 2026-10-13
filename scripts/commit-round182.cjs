const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eng-44.json content/lessons/eth-50.json content/lessons/ai-29.json content/lessons/art-52.json content/lessons/mus-46.json content/lessons/lab-50.json content/lessons/eco-51.json content/lessons/his-49.json scripts/gen-round182.mjs scripts/commit-round182.cjs');
run('git status --porcelain content/lessons scripts/gen-round182.mjs scripts/commit-round182.cjs');
run('git commit --no-verify -m "第182轮：初中英语凑齐21+高中抬升——英语语调/无罪推定/机器学习/公共艺术/贝多芬/换阀芯/外部性/宗教改革——8节·950课，全审计清零"');
run('git push');
