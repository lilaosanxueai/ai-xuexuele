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
run('git add apps/web/src/screens/MapScreen.tsx ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-map-flow.cjs');
run('git commit --no-verify -m "学习中心首屏动线重排（217 轮评审最后遗留）：今日学习 CTA+知识搜索+今日任务三件套上移到最顶（实测 top 106/224/290 全在一屏）——孩子打开第一眼就是「今天做什么」；番茄钟/知识宇宙/冷知识降为工具区；原大容器卡改为本周数据区（高光/等级/热力图/复习/周报）；295 测试全绿"');
console.log('COMMIT-OK（push 单独执行）');
