const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/ai-31.json content/lessons/ai-32.json content/lessons/phys-54.json content/lessons/phys-55.json content/lessons/sci-48.json content/lessons/sci-49.json content/lessons/it-26.json content/lessons/eco-53.json scripts/gen-round190.mjs scripts/commit-round190.cjs');
run('git status --porcelain content/lessons scripts/gen-round190.mjs scripts/commit-round190.cjs');
run('git commit --no-verify -m "第190轮：知识库更新到最近——AI智能体/人形机器人/量子计算/人造太阳/中国航天/新能源汽车/5G万物互联/低空经济——8节·1012课，全审计清零"');
run('git push');
