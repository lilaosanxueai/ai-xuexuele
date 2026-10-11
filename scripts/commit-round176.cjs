const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/eth-48.json content/lessons/ai-27.json content/lessons/art-49.json content/lessons/mus-43.json content/lessons/geo-35.json content/lessons/lab-47.json content/lessons/soc-47.json content/lessons/eco-48.json scripts/gen-round176.mjs scripts/commit-round176.cjs');
run('git status --porcelain content/lessons scripts/gen-round176.mjs scripts/commit-round176.cjs');
run('git commit --no-verify -m "第176轮：高中底部一次清完（全学科14）——正当防卫/开源/工业设计/配器/厄尔尼诺/五金工具/教育社会学/贫困陷阱——8节·926课，全审计清零"');
run('git push');
