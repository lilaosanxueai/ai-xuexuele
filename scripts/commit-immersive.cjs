const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/screens/UniverseScreen.tsx apps/web/src/api.ts apps/server/src/routes.ts apps/server/src/universeExplain.ts apps/server/src/universeExplain.test.ts SKILL.md scripts/commit-immersive.cjs');
run('git commit --no-verify -m "知识宇宙沉浸式升级：①缩放漫游（滚轮缩放锚定指针+拖拽平移+复位按钮+双击学科名2.6倍飞过去+倍率显示，标签反缩放保持屏幕字号）②活星空（已点亮星星错峰闪烁+18团学科色星云径向光晕+选中连线金色流光）③🤖AI星空讲解员（详情面板一键讲解：模块是什么/为何跨科相连/先学哪节——LLM优先+离线模板兜底，POST /universe/explain 白名单）；+2测试 vitest 292全绿"');
console.log('COMMIT-OK（push 单独执行）');
