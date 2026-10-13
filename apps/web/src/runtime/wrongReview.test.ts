import { describe, expect, it } from 'vitest';
import { daysUntil, dueReviews, scheduledReviews, stageLabel } from './wrongReview.ts';
import type { ReviewItem } from '@shared/types.ts';

const mk = (id: string, dueAt: string, stage = 0): ReviewItem => ({
  id, lessonId: 'l1', lessonTitle: '测试课', subjectArea: '数学',
  q: '1+1=?', options: ['1', '2'], answer: 1, explain: '基础加法', stage, dueAt,
});

const NOW = new Date('2026-10-11T10:00:00Z');

describe('wrongReview 记忆盒调度', () => {
  it('到期与未到期分离，到期边界为 <=', () => {
    const q = [
      mk('a', '2026-10-11T10:00:00Z'), // 恰好到期
      mk('b', '2026-10-11T09:59:59Z'), // 早一秒
      mk('c', '2026-10-12T00:00:00Z'), // 明天
    ];
    expect(dueReviews(q, NOW).map((x) => x.id)).toEqual(['b', 'a']);
    expect(scheduledReviews(q, NOW).map((x) => x.id)).toEqual(['c']);
  });

  it('到期超过 10 道只取最早到期的 10 道', () => {
    const q = Array.from({ length: 15 }, (_, i) => mk(`x${String(i).padStart(2, '0')}`, new Date(NOW.getTime() - (15 - i) * 60_000).toISOString()));
    const due = dueReviews(q, NOW);
    expect(due).toHaveLength(10);
    expect(due[0].id).toBe('x00'); // 最早到期排最前
  });

  it('daysUntil 向上取整且不为负', () => {
    expect(daysUntil(new Date(NOW.getTime() + 3 * 86_400_000).toISOString(), NOW)).toBe(3);
    expect(daysUntil(new Date(NOW.getTime() + 1000).toISOString(), NOW)).toBe(1);
    expect(daysUntil('2026-10-10T00:00:00Z', NOW)).toBe(0);
  });

  it('stageLabel 标注复查进度与毕业', () => {
    expect(stageLabel(0)).toContain('第 1 次');
    expect(stageLabel(0)).toContain('3 关');
    expect(stageLabel(2)).toContain('1 关毕业');
    expect(stageLabel(3)).toBe('已毕业');
  });

  it('空队列安全返回空数组', () => {
    expect(dueReviews([], NOW)).toEqual([]);
    expect(scheduledReviews([], NOW)).toEqual([]);
  });
});
