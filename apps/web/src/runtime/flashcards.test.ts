import { describe, expect, it } from 'vitest';
import { buildDeck, deckStats, isDue, nextCardState, pickDueCards } from './flashcards.ts';
import type { Lesson } from '@shared/types.ts';

const mkLesson = (over: Partial<Lesson>): Lesson => ({
  id: 'l1', island: 'cross', order: 1, title: '测试课', emoji: '📘', story: '', goals: [], toolbox: [], actor: { costume: '📘', x: 0, y: 0 }, targets: [], tasks: [], aiIntro: '', celebrate: '',
  subjectArea: '数学', gradeBand: 'primary', grade: 3, textbook: '测试', ...over,
});

describe('buildDeck 卡组生成', () => {
  it('每个课标知识点生成一张卡，背面优先匹配含关键词的定义句', () => {
    const l = mkLesson({
      curriculum: { module: 'm', stage: '测试', points: ['比的基本性质', '比例尺'] },
      teach: { sections: [
        { title: '比', body: '【比的前项和后项同乘同除比值不变】\n普通句子。' },
        { title: '比例尺', body: '【图上距离与实际距离的比叫比例尺】' },
      ], examples: [], mistakes: [] },
    });
    const deck = buildDeck([l]);
    expect(deck).toHaveLength(2);
    expect(deck[0].id).toBe('l1#0');
    expect(deck[0].front).toBe('比的基本性质');
    expect(deck[0].back).toBe('比的前项和后项同乘同除比值不变');
    expect(deck[1].back).toBe('图上距离与实际距离的比叫比例尺');
  });
  it('匹配不到时回退到该节/首节的第一条定义句', () => {
    const l = mkLesson({
      curriculum: { module: 'm', stage: '测试', points: ['完全不相关的点'] },
      teach: { sections: [{ title: '兜底节', body: '【兜底定义】别的句子' }], examples: [], mistakes: [] },
    });
    const deck = buildDeck([l]);
    expect(deck[0].back).toBe('兜底定义');
  });
  it('没有知识点或没有讲解的课不产卡', () => {
    expect(buildDeck([mkLesson({})])).toHaveLength(0);
    expect(buildDeck([mkLesson({ curriculum: { module: 'm', stage: '测试', points: [] } })])).toHaveLength(0);
  });
});

describe('nextCardState 莱特纳记忆盒', () => {
  const now = new Date('2026-09-20T08:00:00');
  it('新卡 easy 升盒 1，两天后到期', () => {
    const s = nextCardState(undefined, 'easy', now);
    expect(s.box).toBe(1);
    expect(s.due).toBe('2026-09-22');
  });
  it('again 永远回盒 0，当天到期', () => {
    const s = nextCardState({ box: 3, due: '2026-09-22' }, 'again', now);
    expect(s.box).toBe(0);
    expect(s.due).toBe('2026-09-20');
  });
  it('easy 封顶盒 3，间隔 12 天', () => {
    const s = nextCardState({ box: 3, due: '2026-09-22' }, 'easy', now);
    expect(s.box).toBe(3);
    expect(s.due).toBe('2026-10-02');
  });
  it('good 原地不动但顺延到当前盒间隔', () => {
    const s = nextCardState({ box: 1, due: '2026-09-19' }, 'good', now);
    expect(s.box).toBe(1);
    expect(s.due).toBe('2026-09-22');
  });
});

describe('到期与统计', () => {
  const now = new Date('2026-09-20T08:00:00');
  const deck = buildDeck([mkLesson({ curriculum: { module: 'm', stage: '测试', points: ['a', 'b', 'c'] } })]);
  it('无状态的卡都算到期', () => {
    const stats = deckStats(deck, {}, now);
    expect(stats).toEqual({ total: 3, due: 3, mastered: 0 });
  });
  it('due 等于今天即到期；盒 3 计入已掌握', () => {
    const states = {
      'l1#0': { box: 3, due: '2026-09-20' },
      'l1#1': { box: 2, due: '2026-09-21' },
    };
    expect(isDue(states['l1#0'], now)).toBe(true);
    expect(isDue(states['l1#1'], now)).toBe(false);
    const stats = deckStats(deck, states, now);
    expect(stats.due).toBe(2); // l1#0（今日到期）+ l1#2（新卡）
    expect(stats.mastered).toBe(1);
  });
  it('pickDueCards 优先低盒且限量', () => {
    const states = { 'l1#0': { box: 2, due: '2026-09-25' }, 'l1#1': { box: 1, due: '2026-09-19' } };
    const picked = pickDueCards(deck, states, 2, now); // 到期：l1#1（盒1）、l1#2（新）
    expect(picked.map((c) => c.id)).toEqual(['l1#2', 'l1#1']);
  });
});
