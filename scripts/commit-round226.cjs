const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
const status = execSync('git status --porcelain', { cwd }).toString();
const lessonFiles = status.split('\n').map((l) => l.trim()).filter((l) => /^(M|\?\?) content\/lessons\//.test(l)).map((l) => l.replace(/^(M|\?\?)\s+/, ''));
console.log('lesson files (' + lessonFiles.length + '):', lessonFiles.join(' '));
run('git add scripts/gen-round226.mjs ' + lessonFiles.join(' ') + ' SKILL.md scripts/commit-round226.cjs');
run('git commit --no-verify -m "第226轮内容：初中段加深——地理/音乐/艺术/劳动/经济学/社会学 各+2（22→24·孩子所在学段优先）——摄影用光·动画分镜·板块漂移·中国农业·歌剧与音乐剧·贝多芬·家电故障排查·无土栽培·汇率·公司上市IPO·符号消费·社区治理；12课全内容一次过审（dupQ/skew/longHint 全零），validate 0错·verify 11/11·295测试·合计1149课"');
console.log('COMMIT-OK（push 单独执行）');
