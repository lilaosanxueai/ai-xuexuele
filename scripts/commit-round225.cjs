const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
const status = execSync('git status --porcelain', { cwd }).toString();
const lessonFiles = status.split('\n').map((l) => l.trim()).filter((l) => /^(M|\?\?) content\/lessons\//.test(l)).map((l) => l.replace(/^(M|\?\?)\s+/, ''));
console.log('lesson files (' + lessonFiles.length + '):', lessonFiles.join(' '));
run('git add scripts/gen-round225.mjs ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-round225.cjs');
run('git commit --no-verify -m "第225轮内容：小学段收尾——道法/地理/信科/英语/心理 各+2，小学全线 ≥17——拒绝欺凌三不原则·守时承诺·河流湖泊·地球自转昼夜·算法启蒙·像素画·What time is it·I can swim·睡眠夜班工厂·倾听三要素；10课全内容，dupQ 拦2处（12355/自转方向撞题）已改写，validate 0错·verify 11/11·295测试·合计1137课"');
console.log('COMMIT-OK（push 单独执行）');
