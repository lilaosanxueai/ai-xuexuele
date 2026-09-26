import { describe, expect, it } from 'vitest';
import { bankFor, checkWord, maskHint, normalizeInput, sampleWords } from './dictation.ts';

describe('dictation 听写词库', () => {
  it('按学科+年级取词库', () => {
    expect(bankFor('语文', '一年级').length).toBeGreaterThan(0);
    expect(bankFor('英语', '八年级').length).toBeGreaterThan(0);
    expect(bankFor('语文', '不存在')).toEqual([]);
  });

  it('英语词带中文提示，语文词不带', () => {
    expect(bankFor('英语', '三年级')[0].hint).toBeDefined();
    expect(bankFor('语文', '一年级')[0].hint).toBeUndefined();
  });
});

describe('checkWord 判分', () => {
  it('英语忽略大小写、空格、连字符和撇号', () => {
    expect(checkWord('Apple', 'apple', '英语')).toBe(true);
    expect(checkWord(' ice-cream ', 'icecream', '英语')).toBe(true);
    expect(checkWord("it's", 'its', '英语')).toBe(true);
    expect(checkWord('aple', 'apple', '英语')).toBe(false);
  });

  it('语文要求逐字一致（空格容忍）', () => {
    expect(checkWord(' 天空 ', '天空', '语文')).toBe(true);
    expect(checkWord('天空 ', '太空', '语文')).toBe(false);
  });
});

describe('normalizeInput / maskHint', () => {
  it('归一化：英语小写去符号，语文只去首尾空格', () => {
    expect(normalizeInput('  Hello ', '英语')).toBe('hello');
    expect(normalizeInput('你 好', '语文')).toBe('你 好');
  });

  it('首字提示遮住其余字', () => {
    expect(maskHint('天空')).toBe('天×');
    expect(maskHint('beautiful')).toBe('b' + '×'.repeat(8));
  });
});

describe('sampleWords 抽词', () => {
  it('抽指定数量且不超出词库', () => {
    const bank = bankFor('语文', '三年级');
    expect(sampleWords(bank, 5).length).toBe(5);
    expect(sampleWords(bank, 99).length).toBeLessThanOrEqual(bank.length);
  });

  it('exclude 的词不会被抽到（词库足够时）', () => {
    const bank = bankFor('英语', '五年级');
    const excluded = bank.slice(0, 6).map((w) => w.word);
    const picked = sampleWords(bank, 6, excluded).map((w) => w.word);
    for (const w of picked) expect(excluded).not.toContain(w);
  });
});
