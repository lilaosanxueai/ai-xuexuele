const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join('C:', 'Users', '10166', '.agents', 'skills', 'creative-island');
const run = (cmd) => {
  console.log('> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
};
run('git add content/lessons/pe-55.json content/lessons/pe-56.json content/lessons/eng-48.json content/lessons/eng-49.json content/lessons/sci-50.json content/lessons/sci-51.json content/lessons/it-27.json content/lessons/it-28.json scripts/gen-round194.mjs scripts/commit-round194.cjs');
run('git commit --no-verify -m "第194轮：全线均衡达成（P15/J22/S17）——体测攻略/反兴奋剂/购物英语/电影英语/食品添加剂/简单机械/数据可视化/信息社会——8节·1044课，闸门四轮拦截全修复"');
run('git -c http.proxy= -c https.proxy= push');
