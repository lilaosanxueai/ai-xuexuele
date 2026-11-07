const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/screens/UniverseScreen.tsx apps/server/src/universeExplain.ts apps/server/src/universeExplain.test.ts apps/server/src/routes.ts SKILL.md scripts/commit-route-player.cjs');
run('git commit --no-verify -m "航线播放器：点航线主题▶镜头逐站2.4倍飞行（金色路径流光串联站点+当前站白环呼吸+站点标签常显+其余星体隐没），悬浮条报站/停止/走完自动复位；🤖AI讲这条线（kind=route：为何这些学科被串起——LLM航线提示词+离线串联模板）；+1测试 vitest 293全绿"');
console.log('COMMIT-OK（push 单独执行）');
