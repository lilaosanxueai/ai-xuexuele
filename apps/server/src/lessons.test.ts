import { afterAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadLessons, findLesson } from './lessons.ts';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lessons-cache-'));
const write = (name: string, json: unknown) => fs.writeFileSync(path.join(dir, name), JSON.stringify(json), 'utf-8');

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe('loadLessons mtime 缓存', () => {
  it('未变化时返回同一引用；文件变化后自动重读', () => {
    write('a.json', { id: 'a', order: 2 });
    write('b.json', { id: 'b', order: 1 });
    const first = loadLessons(dir);
    expect(first.map((l) => l.id)).toEqual(['b', 'a']); // 按 order 排序
    expect(loadLessons(dir)).toBe(first); // 指纹相同 → 命中缓存

    // 家长改 JSON：mtime 变化 → 立即重新加载
    write('b.json', { id: 'b2', order: 1 });
    const second = loadLessons(dir);
    expect(second).not.toBe(first);
    expect(second.map((l) => l.id)).toEqual(['b2', 'a']);
  });

  it('findLesson 按目录查找', () => {
    write('c.json', { id: 'c', order: 3 });
    expect(findLesson('c', dir)?.id).toBe('c');
    expect(findLesson('nope', dir)).toBeUndefined();
  });

  it('解析失败的文件跳过且不拖垮整体', () => {
    fs.writeFileSync(path.join(dir, 'bad.json'), '{oops', 'utf-8');
    const list = loadLessons(dir);
    expect(list.some((l) => l.id === 'a')).toBe(true);
  });
});
