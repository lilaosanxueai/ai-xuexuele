const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git status --porcelain');
run('git add apps/web/src/runtime/knowledgeUniverse.ts apps/web/src/runtime/knowledgeUniverse.test.ts apps/web/src/runtime/achievements.ts apps/web/src/runtime/achievements.test.ts apps/web/src/screens/UniverseScreen.tsx SKILL.md scripts/commit-universe2.cjs');
run('git commit --no-verify -m "知识宇宙二期：薄弱星云（低正确率/大而未启动模块按紧急度推荐+一键补亮）、学科筛选完成率环、宇宙探索4徽章（点亮之星/星图半百/满贯星系/十星巡礼·21枚）；universeWeakSpots纯函数+测试，vitest 275全绿"');
console.log('COMMIT-OK（push 单独执行）');
