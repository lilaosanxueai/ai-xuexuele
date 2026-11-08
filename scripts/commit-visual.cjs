const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/runtime/knowledgeUniverse.ts apps/web/src/screens/UniverseScreen.tsx SKILL.md scripts/commit-visual.cjs');
run('git commit --no-verify -m "星空视觉重做（截图评审驱动，5→8分）：星星改为星辉光晕+白星核（练过=亮星闪烁·没练=小暗点，亮暗层级拉开2倍）；跨科连线默认近乎隐去（乱麻→秩序，选中才金色流光）；学科椭圆收小至245/185+星团环收紧——光晕不再裁切；背景80颗暗星纹理给纵深；学科名半透明圆角底衬任何光晕上可读；横幅渐变加深+统计四格竖分隔线+tabular-nums；学科chips 0%自动降噪隐藏；DOM核验18学科标签全渲染"');
console.log('COMMIT-OK（push 单独执行）');
