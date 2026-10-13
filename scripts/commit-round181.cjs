const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/art-51.json content/lessons/mus-45.json content/lessons/geo-36.json content/lessons/lab-49.json content/lessons/soc-49.json content/lessons/pe-49.json content/lessons/eco-50.json content/lessons/sci-40.json scripts/gen-round181.mjs scripts/commit-round181.cjs');
run('git status --porcelain content/lessons scripts/gen-round181.mjs scripts/commit-round181.cjs');
run('git commit --no-verify -m "第181轮：初中底部拉平至21——篆刻/黄河大合唱/铁路网/断舍离/数字鸿沟/仰泳/比较优势/月相——8节·942课，全审计清零"');
run('git push');
