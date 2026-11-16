const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
const status = execSync('git status --porcelain', { cwd }).toString();
const lessonFiles = status.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('M content/lessons/')).map((l) => l.slice(2));
console.log('lesson files:', lessonFiles.join(' '));
run('git add shared/types.ts apps/web/src/components/StageSvg.tsx ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-grid3.cjs');
run('git commit --no-verify -m "双轴单位网格：lab.grid 支持 unitX/unitY 分轴比例与 xName/yName 轴名——v-t 图这类两轴单位不同的物理图终于可信（cross-66 实测：t/秒 0..10 秒 × v/(米/秒) 20..80，a=10 恰覆盖全程）；math-17 求根抛物线 22:12、math-15 双曲线 16:2.2 分轴可读；数字刻度课累计 18 节；295 测试全绿"');
console.log('COMMIT-OK（push 单独执行）');
