import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    // 前后端共享层：运行时值导入（如 REVIEW_INTERVAL_DAYS）在测试里也要能解析
    alias: { '@shared': path.resolve(root, 'shared') },
  },
});
