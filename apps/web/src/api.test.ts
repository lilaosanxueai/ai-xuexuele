import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, resetLessonsCache } from './api.ts';

describe('api.lessons 会话缓存', () => {
  beforeEach(() => resetLessonsCache());
  afterEach(() => vi.unstubAllGlobals());

  it('同一会话内多次调用只发一次网络请求', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([{ id: 'a' }]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const a = await api.lessons();
    const b = await api.lessons();
    expect(a).toEqual([{ id: 'a' }]);
    expect(b).toBe(a); // 同一份引用
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('并发调用共享同一个 Promise（不重复拉取）', async () => {
    const fetchMock = vi.fn(async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const [x, y] = await Promise.all([api.lessons(), api.lessons()]);
    expect(x).toBe(y);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('resetLessonsCache 后重新拉取（家长改课后 F5 的等价行为）', async () => {
    const fetchMock = vi.fn(async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    await api.lessons();
    resetLessonsCache();
    await api.lessons();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
