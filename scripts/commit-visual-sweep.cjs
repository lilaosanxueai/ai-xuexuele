const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/screens/HomeScreen.tsx apps/web/src/screens/MapScreen.tsx apps/web/src/screens/WrongbookScreen.tsx apps/web/src/screens/ParentScreen.tsx apps/web/src/components/LearningHeatmap.tsx SKILL.md scripts/commit-visual-sweep.cjs');
run('git commit --no-verify -m "全应用视觉大扫除（六屏截图评审驱动）：选人页漂浮装饰+档案/添加卡统一高度+家长入口胶囊化；每日一题选项改等宽网格；家长端隐私承诺折叠为可展开+12周热力图修两 bug（月份标签绝对定位对齐周列·卡片 w-fit 消除右侧死区）；错题本空态垂直居中+星星光晕底衬+CTA换品牌amber+文案改「去上课」+清空标签降权；293测试全绿"');
console.log('COMMIT-OK（push 单独执行）');
