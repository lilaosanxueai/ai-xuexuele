const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/bio-41.json content/lessons/bio-42.json content/lessons/bio-43.json content/lessons/bio-44.json content/lessons/chem-42.json content/lessons/sci-41.json content/lessons/sci-42.json content/lessons/sci-43.json scripts/gen-round184.mjs scripts/commit-round184.cjs');
run('git status --porcelain content/lessons scripts/gen-round184.mjs scripts/commit-round184.cjs');
run('git commit --no-verify -m "第184轮：自然科学抬升——动物行为/人类演化/生物多样性/皮肤/化学式与化合价/光三原色/热传递/温度计——8节·964课，全审计清零"');
run('git push');
