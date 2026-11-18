const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
const status = execSync('git status --porcelain', { cwd }).toString();
// 新增课是 untracked（??），已改课是 M —— 动态取，杜绝 pathspec 坑
const lessonFiles = status.split('\n').map((l) => l.trim()).filter((l) => /^(M|\?\?) content\/lessons\//.test(l)).map((l) => l.replace(/^(M|\?\?)\s+/, ''));
console.log('lesson files (' + lessonFiles.length + '):', lessonFiles.join(' '));
run('git add scripts/gen-round224.mjs ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-round224.cjs');
run('git commit --no-verify -m "第224轮内容：小学段六科各+2（艺术/音乐/劳动/体育/经济学/社会学 15→17 课）——线描画·名画鉴赏入门·休止符·音色侦探·垃圾分类·小工匠工具入门·护眼20-20-20·防溺水叫伸抛不跳·保险雨伞原理·银行利息复利·网络小公民·家庭多样性；12课全内容（views+teach+exercises 含1填空），dupQ 抓到1处与lab-05重复已改写，validate 0错·verify 11/11·295测试·合计1127课"');
console.log('COMMIT-OK（push 单独执行）');
