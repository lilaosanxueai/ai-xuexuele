import { describe, expect, it } from 'vitest';
import { blankLine, checkPoem, makeQuiz, normalizePoem, POEMS, questionFrom } from './poems.ts';

describe('normalizePoem / checkPoem 忽略标点判分', () => {
  it('归一化去掉标点和空格', () => {
    expect(normalizePoem('床前明月光，')).toBe('床前明月光');
    expect(normalizePoem('疑是地上霜。')).toBe('疑是地上霜');
    expect(normalizePoem('更上一层楼！')).toBe('更上一层楼');
  });

  it('判分：多字少字标点都不影响正确答案', () => {
    expect(checkPoem('低头思故乡', '低头思故乡。')).toBe(true);
    expect(checkPoem('低头 思故乡，', '低头思故乡。')).toBe(true);
    expect(checkPoem('低头思故', '低头思故乡')).toBe(false);
    expect(checkPoem('抬头思故乡', '低头思故乡')).toBe(false);
  });
});

describe('blankLine 补字题', () => {
  it('遮掉连续两个字，展示句含两个＿', () => {
    for (let i = 0; i < 20; i++) {
      const { display, answer } = blankLine('床前明月光，', 2);
      expect([...display].filter((c) => c === '＿').length).toBe(2);
      expect([...answer].length).toBe(2);
      let ai = 0;
      const rebuilt = [...display].map((c) => (c === '＿' ? [...answer][ai++] : c)).join('');
      expect(rebuilt).toBe('床前明月光，');
    }
  });

  it('答案不会遮到标点', () => {
    for (let i = 0; i < 20; i++) {
      const { answer } = blankLine('鹅，鹅，鹅，', 2);
      expect(/[，。？！、]/.test(answer)).toBe(false);
    }
  });
});

describe('questionFrom / makeQuiz 出题', () => {
  it('补字模式的答案是诗中原文', () => {
    for (let i = 0; i < 20; i++) {
      const q = questionFrom(POEMS[1], 'fill'); // 静夜思
      expect(q.poem.lines[q.lineIdx]).toContain(q.answer);
      expect(q.prompt).toContain('＿');
    }
  });

  it('接句模式的答案是下一句', () => {
    for (let i = 0; i < 20; i++) {
      const q = questionFrom(POEMS[1], 'next');
      expect(q.prompt).toBe(POEMS[1].lines[q.lineIdx]);
      expect(q.answer).toBe(POEMS[1].lines[q.lineIdx + 1]);
    }
  });

  it('组卷数量正确且题目结构完整', () => {
    const quiz = makeQuiz(8, 'fill');
    expect(quiz.length).toBe(8);
    for (const q of quiz) {
      expect(q.answer.length).toBeGreaterThan(0);
      expect(q.speakText).toBe(q.poem.lines[q.lineIdx]);
    }
  });

  it('词库规模与基本信息', () => {
    expect(POEMS.length).toBeGreaterThanOrEqual(20);
    for (const p of POEMS) {
      expect(p.lines.length).toBeGreaterThanOrEqual(4);
      expect(p.author.length).toBeGreaterThan(0);
    }
  });
});
