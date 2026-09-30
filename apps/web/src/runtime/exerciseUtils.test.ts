import { describe, expect, it } from 'vitest';
import { blankCorrect, toWrongItem } from './exerciseUtils.ts';
import type { Exercise } from '@shared/types.ts';

const choiceEx: Exercise = { q: '一加一等于？', options: ['2', '3', '1', '0'], answer: 0, explain: '基础加法' };
const bankBlank: Exercise = {
  q: '数轴上 x>2 取 2 的 ___ 侧', options: ['右', '左', '上'], answer: 0, explain: '大于向右',
  type: 'blank', blank: { answerText: '右', bank: ['右', '左', '上'] },
};
const typedBlank: Exercise = {
  q: '秦统一于公元前 ___ 年', options: ['221', '0', '再想一想'], answer: 0, explain: '前221年',
  type: 'blank', blank: { answerText: '221' },
};

describe('blankCorrect 填空判分', () => {
  it('trim 与大小写不敏感', () => {
    expect(blankCorrect(bankBlank, ' 右 ')).toBe(true);
    expect(blankCorrect(typedBlank, ' 221 ')).toBe(true);
  });
  it('错答判错', () => {
    expect(blankCorrect(bankBlank, '左')).toBe(false);
    expect(blankCorrect(typedBlank, '222')).toBe(false);
    expect(blankCorrect(typedBlank, '')).toBe(false);
  });
});

describe('toWrongItem 错题转换', () => {
  it('选择题原样透传', () => {
    const w = toWrongItem(choiceEx, { idx: 0, pick: 2 });
    expect(w.options).toEqual(choiceEx.options);
    expect(w.answer).toBe(0);
    expect(w.wrongPicks).toEqual([2]);
  });
  it('词库填空 → 词库选项形态', () => {
    const w = toWrongItem(bankBlank, { idx: 0, pick: 1 });
    expect(w.options).toEqual(['右', '左', '上']);
    expect(w.answer).toBe(0);
    expect(w.wrongPicks).toEqual([1]);
  });
  it('键盘填空 → 合成选项（正确在前、我的错答在后）', () => {
    const w = toWrongItem(typedBlank, { idx: 0, pick: -1, input: '207' });
    expect(w.options[0]).toBe('221');
    expect(w.options[1]).toBe('207');
    expect(w.answer).toBe(0);
    expect(w.explain).toContain('正确答案');
  });
  it('空答不崩（显示"空着"）', () => {
    const w = toWrongItem(typedBlank, { idx: 0, pick: -1, input: '' });
    expect(w.options[1]).toBe('（空着）');
  });
});
