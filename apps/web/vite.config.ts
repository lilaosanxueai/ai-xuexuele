import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@shared': path.resolve(appDir, '../../shared') },
  },
  server: {
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:8787' },
  },
  build: {
    rollupOptions: {
      output: {
        // 大依赖分包：Blockly 单独拆（约半数体积），React 全家桶次之——
        // 首屏并行下载 + 应用更新后 vendor 缓存不失效
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('blockly')) return 'blockly';
          if (id.includes('react') || id.includes('scheduler')) return 'react';
          return 'vendor';
        },
      },
    },
  },
});
