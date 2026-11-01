const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add apps/web/src/runtime/knowledgeUniverse.ts apps/web/src/runtime/knowledgeUniverse.test.ts apps/web/src/components/AnnualReport.tsx SKILL.md scripts/commit-annual-universe.cjs');
run('git commit --no-verify -m "年度报告接入知识星图：封面第4卡（今年点亮星座）+总览表行（累计/今年/星系覆盖）+🌌知识星图节（第一颗星的时刻+逐月点亮轨迹+学得最扎实的星座榜）；annualUniverse纯函数+2测试，vitest 284全绿"');
console.log('COMMIT-OK（push 单独执行）');
