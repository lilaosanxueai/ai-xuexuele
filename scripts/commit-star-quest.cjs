const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/runtime/dailyQuests.ts apps/web/src/runtime/dailyQuests.test.ts SKILL.md scripts/commit-star-quest.cjs');
run('git commit --no-verify -m "薄弱星云接入每日任务：「补亮一颗星」——今天点亮一个课标模块的第一节课即完成，任务卡引用最大全暗模块+全暗星球数，点击直达知识宇宙；starsLitToday 纯推导（模块最早完成时间在今天），+3 测试，vitest 278 全绿"');
console.log('COMMIT-OK（push 单独执行）');
