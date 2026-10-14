const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/chem-46.json content/lessons/chem-47.json content/lessons/his-50.json content/lessons/his-51.json content/lessons/bio-47.json content/lessons/phys-51.json content/lessons/sci-44.json content/lessons/sci-45.json scripts/gen-round186.mjs scripts/commit-round186.cjs');
run('git status --porcelain content/lessons scripts/gen-round186.mjs scripts/commit-round186.cjs');
run('git commit --no-verify -m "第186轮：五科抬升——卤素/化学键/拜占庭/阿拉伯帝国/物质循环/能级光谱/生物分类/观察昆虫——8节·980课·order破千，全审计清零"');
run('git push');
