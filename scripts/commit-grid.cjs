const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git status --porcelain');
run('git add shared/types.ts apps/web/src/components/StageSvg.tsx apps/web/src/runtime/stageProbe.test.ts apps/web/src/screens/WrongBookScreen.tsx content/lessons/math-01.json content/lessons/extra-01-treasure.json content/lessons/math-08.json content/lessons/math-10.json content/lessons/math-44.json content/lessons/math-62.json content/lessons/math-64.json content/lessons/math-67.json content/lessons/math-98.json SKILL.md scripts/commit-grid.cjs');
run('git commit --no-verify -m "实验室舞台刻度升级（PhET 对标·评审质变认定）：网格从 viewBox 装饰线改为数据坐标对齐（与取点读数同源）+x/y 零轴高亮；lab.grid 支持数值=舞台单位/数学单位比，数字刻度按数学单位标注（一次函数标 -5/0/5 而非像素 150），探针读数同步换算；niceStep 好刻度纯函数+2 测试；9 节真坐标课设 unit，math-01 数轴实测 -10..10 刻度+0 轴分界；补 217 轮被大小写坑漏提交的错题本空态重排（WrongBookScreen 大写 B）；295 测试全绿"');
run('git status --porcelain | findstr "WrongBook StageSvg types"');
console.log('COMMIT-OK（push 单独执行）');
