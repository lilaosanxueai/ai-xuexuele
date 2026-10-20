import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 学学乐一键启动器：端口占用检测 → 脱离会话拉起服务 → 等端口就绪 → 打开浏览器。
 *  服务进程 detached + unref，不随本脚本或终端退出而终止。 */

const PORT = 8787;
const URL = `http://127.0.0.1:${PORT}`;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const up = () => new Promise((resolve) => {
  const s = net.connect(PORT, '127.0.0.1');
  s.once('connect', () => { s.destroy(); resolve(true); });
  s.once('error', () => resolve(false));
});

const openBrowser = () => {
  const p = spawn('cmd', ['/c', 'start', '', URL], { detached: true, stdio: 'ignore', windowsHide: true });
  p.unref();
};

if (await up()) {
  console.log(`[学学乐] 已在运行：${URL}（直接打开浏览器）`);
  openBrowser();
  process.exit(0);
}

console.log('[学学乐] 启动服务中（独立进程，关掉本窗口也不受影响）…');
const child = spawn('cmd', ['/c', 'npm', 'start'], {
  cwd: ROOT, detached: true, stdio: 'ignore', windowsHide: true,
});
child.unref();

let ok = false;
for (let i = 0; i < 30; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  if (await up()) { ok = true; break; }
  if (i % 5 === 4) console.log(`[学学乐] 还在等端口就绪…（${i + 1}s）`);
}
if (!ok) {
  console.error('[学学乐] 30 秒内服务未就绪——请手动运行 npm start 查看报错。');
  process.exit(1);
}
console.log(`[学学乐] 就绪：${URL}`);
openBrowser();
