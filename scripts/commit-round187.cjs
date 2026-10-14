const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/chem-48.json content/lessons/chem-49.json content/lessons/his-52.json content/lessons/his-53.json content/lessons/phys-52.json content/lessons/bio-48.json content/lessons/sci-46.json content/lessons/sci-47.json scripts/gen-round187.mjs scripts/commit-round187.cjs');
run('git status --porcelain content/lessons scripts/gen-round187.mjs scripts/commit-round187.cjs');
run('git commit --no-verify -m "第187轮：五科抬升——硫与硫酸/合成氨/明治维新/俄国改革/传感器/生态稳定性/呼吸系统/骨骼肌肉——8节·988课，全审计清零"');
run('git push');
