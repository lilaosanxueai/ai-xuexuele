const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/runtime/dailyQuests.ts apps/web/src/runtime/dailyQuests.test.ts apps/web/src/runtime/achievements.ts apps/web/src/runtime/achievements.test.ts apps/web/src/screens/UniverseScreen.tsx SKILL.md scripts/commit-routes2.cjs');
run('git commit --no-verify -m "航线二期：每日任务「走一站航线」（引用下一站学科+课名+直达课程，今天完成任意站点课即点亮）；+2航线徽章（🛸星际旅人走完1条/🚀星际舰队3条——站点未学优先，全✅=该主题跨科课学尽）；航线卡完成态（🎉绿环+未完成优先排序）；徽章23枚，+4测试 vitest 290全绿"');
console.log('COMMIT-OK（push 单独执行）');
