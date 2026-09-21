import type { Lesson } from '@shared/types.ts';

/**
 * 闪卡复习系统：把每节课的知识点变成「正面提问 → 背面要点」的背诵卡，
 * 用莱特纳记忆盒安排复习（认得升盒拉长间隔，不认得回盒 0 明日再见）。
 * 全部本地运行，进度存 localStorage。
 */

export interface Flashcard {
  /** lessonId#序号 */
  id: string;
  subject: string;
  lessonTitle: string;
  /** 正面：知识点名称 */
  front: string;
  /** 背面：来自讲解层【】定义句的核心表述 */
  back: string;
}

/** 某张卡的记忆盒状态 */
export interface CardState {
  /** 0 新卡/需重记，1 生疏，2 熟悉，3 掌握 */
  box: number;
  /** 下次到期的日期 YYYY-MM-DD */
  due: string;
}

/** 莱特纳盒子的复习间隔（天）：盒 0 当天，1 → 2 天，2 → 5 天，3 → 12 天 */
export const BOX_INTERVAL_DAYS = [0, 2, 5, 12];

/** 从讲解层正文里提取【】包裹的定义句 */
function extractClaims(text: string): string[] {
  const found = text.match(/【[^】]+】/g) ?? [];
  return found.map((s) => s.slice(1, -1));
}

/** 生成全站闪卡：每节课的每个课标知识点一张卡，背面匹配讲解中的定义句 */
export function buildDeck(lessons: Lesson[]): Flashcard[] {
  const deck: Flashcard[] = [];
  for (const l of lessons) {
    const points = l.curriculum?.points ?? [];
    if (points.length === 0) continue;
    const claimsBySection = (l.teach?.sections ?? []).map((s) => ({ title: s.title, claims: extractClaims(s.body) }));
    const allClaims = claimsBySection.flatMap((s) => s.claims);
    points.forEach((point, i) => {
      // 优先找包含知识点关键词（取前 2-4 个字符）的定义句
      const key = point.replace(/[（(].*$/, '').slice(0, 4);
      let back = allClaims.find((c) => c.includes(key) || point.includes(c.slice(0, 4)));
      if (!back) {
        const sec = claimsBySection[i] ?? claimsBySection[0];
        back = sec?.claims[0] ?? sec?.title ?? point;
      }
      deck.push({
        id: `${l.id}#${i}`,
        subject: l.subjectArea ?? '信息科技',
        lessonTitle: l.title,
        front: point,
        back,
      });
    });
  }
  return deck;
}

export function todayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function addDays(now: Date, days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 答题后更新记忆盒：again 回盒 0，good 原地，easy 升一盒（封顶 3） */
export function nextCardState(prev: CardState | undefined, grade: 'again' | 'good' | 'easy', now: Date = new Date()): CardState {
  const box0 = prev?.box ?? 0;
  let box = box0;
  if (grade === 'again') box = 0;
  if (grade === 'easy') box = Math.min(3, box0 + 1);
  return { box, due: addDays(now, BOX_INTERVAL_DAYS[box]) };
}

/** 卡是否到期（due <= 今天） */
export function isDue(state: CardState | undefined, now: Date = new Date()): boolean {
  if (!state) return true;
  return state.due <= todayKey(now);
}

/** 取一组卡里到期的（最多 limit 张），优先低盒（生疏优先） */
export function pickDueCards(deck: Flashcard[], states: Record<string, CardState>, limit = 10, now: Date = new Date()): Flashcard[] {
  return deck
    .filter((c) => isDue(states[c.id], now))
    .sort((a, b) => (states[a.id]?.box ?? -1) - (states[b.id]?.box ?? -1))
    .slice(0, limit);
}

/** 复习统计 */
export function deckStats(deck: Flashcard[], states: Record<string, CardState>, now: Date = new Date()): { total: number; due: number; mastered: number } {
  let due = 0;
  let mastered = 0;
  for (const c of deck) {
    const s = states[c.id];
    if (isDue(s, now)) due += 1;
    if (s && s.box >= 3) mastered += 1;
  }
  return { total: deck.length, due, mastered };
}
