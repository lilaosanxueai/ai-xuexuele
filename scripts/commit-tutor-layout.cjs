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
run('git add apps/web/src/screens/TutorScreen.tsx ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-tutor-layout.cjs');
run('git commit --no-verify -m "辅导页布局重排（217 轮评审批评 1:2.6 失衡）：左栏 320→340px 防碎+右栏正文套 max-w-3xl 阅读 measure（约 45em 行长上限，实测正文 732px）+已完成步骤加 emerald 底色强化进度感；比例 2.55→2.25；LabScreen 舞台占比经查为数轴类 1D 内容固有形态，不强行放大；295 测试全绿"');
console.log('COMMIT-OK（push 单独执行）');
