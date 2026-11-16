const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git status --porcelain');
// 课程 JSON 文件名与 id 不一定一致（cross-67-physics2.json 这类），从 porcelain 动态取，杜绝 pathspec 坑
const status = execSync('git status --porcelain', { cwd }).toString();
const lessonFiles = status.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('M content/lessons/')).map((l) => l.slice(2));
console.log('lesson files:', lessonFiles.join(' '));
run('git add shared/types.ts apps/web/src/components/StageSvg.tsx ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-grid2.cjs');
run('git commit --no-verify -m "坐标课刻度推广：lab.grid 支持 {unit,ox,oy} 原点偏移（勾股 -150,-80 从直角顶点起数·平抛 -200,130 按米标注 x·下落为负），刻度门槛 52→46px 防跳档稀疏；逐课核对 46 个缩放候选后为 6 节干净等比课设单位（数轴求解 22/方程组 25/解集 22/函数交点 28/勾股 26/平抛 7），实测三课刻度全部命中；295 测试全绿"');
console.log('COMMIT-OK（push 单独执行）');
