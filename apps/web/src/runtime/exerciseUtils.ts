import type { Exercise, WrongItem } from '@shared/types.ts';

/**
 * 练习题工具：错题落库时的统一转换。
 * 填空题（blank）答错也要进错题本闭环——转成等价的选择题形态：
 * 有词库 → options=词库；键盘输入 → options=[正确答案, 我的错答, 再想一想]。
 */

export interface RawPick {
  idx: number;
  pick: number;
  /** 填空题：孩子的原始输入（键盘输入型） */
  input?: string;
}

/** 填空判分：trim + 忽略大小写（数学式/英文均适用） */
export function blankCorrect(ex: Exercise, input: string): boolean {
  const ans = (ex.blank?.answerText ?? '').trim().toLowerCase();
  const got = (input ?? '').trim().toLowerCase();
  return ans.length > 0 && ans === got;
}

/** 任一题型 → 错题本条目（lessonId/lessonTitle 由调用方补） */
export function toWrongItem(ex: Exercise, p: RawPick): Omit<WrongItem, 'id' | 'lessonId' | 'lessonTitle' | 'subjectArea' | 'times' | 'lastWrongAt'> & { wrongPicks: number[] } {
  if (ex.type === 'blank') {
    if (ex.blank?.bank && ex.blank.bank.length >= 2) {
      const pickIdx = Math.max(0, p.pick);
      return { q: ex.q, options: [...ex.blank.bank], answer: ex.answer, explain: ex.explain, wrongPicks: [pickIdx] };
    }
    // 键盘输入型：合成选项呈现对错
    const mine = (p.input ?? '').trim() || '（空着）';
    return {
      q: ex.q,
      options: [ex.blank?.answerText ?? '', mine, '再想一想'],
      answer: 0,
      explain: `正确答案：${ex.blank?.answerText ?? ''}。${ex.explain}`,
      wrongPicks: [1],
    };
  }
  return { q: ex.q, options: ex.options, answer: ex.answer, explain: ex.explain, wrongPicks: [p.pick] };
}
