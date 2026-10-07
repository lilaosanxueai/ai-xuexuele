import fs from 'node:fs';
import path from 'node:path';
import { LESSONS_DIR } from './config.ts';
import type { Lesson } from '@shared/types.ts';

/**
 * 课程库加载：mtime 版本号缓存——家长改 JSON 仍然立即生效（mtime 变了就重读），不用重启；
 * 未变化时跳过 712 个文件的读取与 JSON.parse（约 4.7MB/次的解析开销）。
 */

const cache = new Map<string, { key: string; lessons: Lesson[] }>();

/** 目录指纹：文件名+大小+mtime（stat 712 个文件 ≈ 毫秒级，远低于全量读取解析） */
function dirFingerprint(dir: string): string {
  let key = '';
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.json')) continue;
    const st = fs.statSync(path.join(dir, f));
    key += `${f}:${st.size}:${st.mtimeMs};`;
  }
  return key;
}

function readAll(dir: string): Lesson[] {
  const lessons: Lesson[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try {
      lessons.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Lesson);
    } catch (e) {
      console.error(`课程文件 ${f} 解析失败，已跳过：`, e);
    }
  }
  return lessons.sort((a, b) => a.order - b.order);
}

export function loadLessons(dir: string = LESSONS_DIR): Lesson[] {
  const key = dirFingerprint(dir);
  const hit = cache.get(dir);
  if (hit && hit.key === key) return hit.lessons;
  const lessons = readAll(dir);
  cache.set(dir, { key, lessons });
  return lessons;
}

export function findLesson(id: string, dir: string = LESSONS_DIR): Lesson | undefined {
  return loadLessons(dir).find((l) => l.id === id);
}
