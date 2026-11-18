import { useEffect } from 'react';
import type { Lesson } from '@shared/types.ts';
import { lessonNeighbors, lessonRoute } from '../runtime/lessonNav.ts';

/**
 * 桌面键盘翻课：← 上一课 / → 下一课（同学科序列，与页面顶部的 ‹ › 同一套逻辑）。
 * 输入框聚焦时不打扰；lessonId 为空（加载中）时静默。
 */
export function useLessonHotkeys(all: Lesson[], lessonId: string | null | undefined, nav: (path: string) => void) {
  useEffect(() => {
    if (!lessonId) return;
    const nb = lessonNeighbors(all, lessonId);
    if (!nb.prev && !nb.next) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft' && nb.prev) {
        e.preventDefault();
        nav(lessonRoute(nb.prev));
      } else if (e.key === 'ArrowRight' && nb.next) {
        e.preventDefault();
        nav(lessonRoute(nb.next));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [all, lessonId, nav]);
}
