import { describe, expect, it } from 'vitest';
import { lessonNeighbors, lessonRoute } from './lessonNav.ts';
import type { Lesson } from '@shared/types.ts';

const mk = (id: string, area: string, order: number, lab = false): Lesson => ({
  id, island: 'cross', order, title: `课-${id}`, emoji: '📘', story: '', goals: [],
  toolbox: [], actor: { costume: '🤖', x: 0, y: 0 }, tasks: [], aiIntro: '', celebrate: '',
  subjectArea: area, ...(lab ? { starterCode: 'hide()' } : {}),
});

describe('lessonNeighbors 同学科序列导航', () => {
  it('按 order 找到前后课', () => {
    const all = [mk('a', '数学', 3), mk('b', '数学', 1), mk('c', '数学', 2), mk('x', '英语', 9)];
    const nb = lessonNeighbors(all, 'c');
    expect(nb.prev?.id).toBe('b');
    expect(nb.next?.id).toBe('a');
    expect(nb.index).toBe(2);
    expect(nb.total).toBe(3); // 英语课不算进来
  });

  it('首尾课只有单侧邻居', () => {
    const all = [mk('a', '科学', 1), mk('b', '科学', 2)];
    expect(lessonNeighbors(all, 'a').prev).toBeNull();
    expect(lessonNeighbors(all, 'a').next?.id).toBe('b');
    expect(lessonNeighbors(all, 'b').prev?.id).toBe('a');
    expect(lessonNeighbors(all, 'b').next).toBeNull();
  });

  it('不存在的课程返回空导航', () => {
    const nb = lessonNeighbors([mk('a', '数学', 1)], 'zzz');
    expect(nb.prev).toBeNull();
    expect(nb.next).toBeNull();
    expect(nb.total).toBe(0);
  });

  it('order 相同时按 id 稳定排序', () => {
    const all = [mk('b', '音乐', 5), mk('a', '音乐', 5)];
    expect(lessonNeighbors(all, 'b').prev?.id).toBe('a');
  });
});

describe('lessonRoute 路由分流', () => {
  it('实验课进 /lab，普通课进 /tutor', () => {
    expect(lessonRoute(mk('a', '数学', 1, true))).toBe('/lab/a');
    expect(lessonRoute(mk('b', '数学', 2))).toBe('/tutor/b');
  });
});
