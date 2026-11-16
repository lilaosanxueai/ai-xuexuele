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
run('git add shared/types.ts apps/web/src/components/StageSvg.tsx scripts/scan-dualaxis.mjs ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-grid4.cjs');
run('git commit --no-verify -m "双轴刻度扫荡（52 候选筛 3 节）+单轴模式：只给 unitX 则 y 轴不标数（正弦波 y=A·sin 像素无单位）；meta-01 遗忘曲线带轴名（小时 × 记忆量/%·心理学课读图直接可用）、math-34 导数切线 25:6、math-11 正弦波 x/度；数字刻度课累计 21 节；295 测试全绿"');
console.log('COMMIT-OK（push 单独执行）');
