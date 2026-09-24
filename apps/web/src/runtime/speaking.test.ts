import { describe, expect, it } from 'vitest';
import { SENTENCE_BANK, scoreSpeaking, tokenize } from './speaking.ts';

describe('tokenize', () => {
  it('小写+去标点+拆词', () => {
    expect(tokenize('Good morning, teacher!')).toEqual(['good', 'morning', 'teacher']);
    expect(tokenize("It's seven o'clock.")).toEqual(["it's", 'seven', "o'clock"]);
  });
  it('空串与纯标点返回空数组', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('!?.,')).toEqual([]);
  });
});

describe('scoreSpeaking', () => {
  it('完全一致得满分', () => {
    const r = scoreSpeaking('Good morning teacher', 'good morning, teacher!');
    expect(r.score).toBeGreaterThanOrEqual(95);
    expect(r.diff.filter((d) => d.state === 'ok')).toHaveLength(3);
  });
  it('漏词标 miss 且分数下降', () => {
    const r = scoreSpeaking('I like apples and bananas', 'I like bananas');
    const miss = r.diff.filter((d) => d.state === 'miss');
    expect(miss.map((d) => d.word)).toContain('apples');
    expect(r.score).toBeLessThan(80);
  });
  it('多说的词标 extra 并扣分', () => {
    const base = scoreSpeaking('hello world', 'hello world');
    const extra = scoreSpeaking('hello world', 'hello world extra words');
    expect(extra.diff.some((d) => d.state === 'extra')).toBe(true);
    expect(extra.score).toBeLessThan(base.score);
  });
  it('空输入给出 0 分与提示', () => {
    expect(scoreSpeaking('hello', '').score).toBe(0);
    expect(scoreSpeaking('', 'anything').diff).toHaveLength(0);
  });
  it('乱序说 LCS 只保最长公共子序列', () => {
    const r = scoreSpeaking('one two three', 'three two one');
    // 完全逆序时 LCS 只有 1 个词（two 或 three 二选一）
    expect(r.diff.filter((d) => d.state === 'ok').length).toBe(1);
    expect(r.score).toBeLessThan(50);
  });
});

describe('SENTENCE_BANK', () => {
  it('三个学段各有 10 句且句子非空', () => {
    for (const lv of ['primary', 'junior', 'senior'] as const) {
      const items = SENTENCE_BANK.filter((s) => s.level === lv);
      expect(items.length).toBeGreaterThanOrEqual(10);
      for (const s of items) expect(s.text.trim().length).toBeGreaterThan(5);
    }
  });
});
