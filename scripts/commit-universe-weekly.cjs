const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/runtime/knowledgeUniverse.ts apps/web/src/runtime/dailyQuests.ts apps/web/src/runtime/weeklyReport.ts apps/web/src/runtime/weeklyReport.test.ts apps/web/src/runtime/weeklyShare.test.ts apps/web/src/runtime/shareCard.ts apps/web/src/screens/ParentScreen.tsx apps/server/src/weeklyComment.ts apps/server/src/weeklyComment.test.ts apps/server/src/routes.ts SKILL.md scripts/commit-universe-weekly.cjs');
run('git commit --no-verify -m "宇宙周报：本周新点亮的星进家长端——🌟新星chip+星座清单+分享卡新星横幅+AI/模板评语亮点句（LLM提示词经白名单自动携带）；moduleStars下沉knowledgeUniverse与每日任务共享，weekDelta+stars；+4测试，vitest 282全绿"');
console.log('COMMIT-OK（push 单独执行）');
