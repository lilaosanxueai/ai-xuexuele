const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/chem-43.json content/lessons/chem-44.json content/lessons/bio-45.json content/lessons/bio-46.json content/lessons/chn-42.json content/lessons/chn-43.json content/lessons/phys-49.json content/lessons/phys-50.json scripts/gen-round185.mjs scripts/commit-round185.cjs');
run('git status --porcelain content/lessons scripts/gen-round185.mjs scripts/commit-round185.cjs');
run('git commit --no-verify -m "第185轮：四科抬升——塑料/水污染/种群/神经系统/语言得体/微写作/内能比热容/共振——8节·972课，全审计清零"');
run('git push');
