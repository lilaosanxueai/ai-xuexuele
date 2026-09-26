/** 听写训练：语文生字词 + 英语单词（TTS 报词 → 键入 → 判分） */

export interface DictWord {
  word: string;
  /** 提示：英语=中文释义，语文=首字提示 */
  hint?: string;
}

/** 语文生字词（按年级，常见高频词，听写作业口径） */
export const CHINESE_BANK: Record<string, DictWord[]> = {
  一年级: [
    { word: '天空' }, { word: '白云' }, { word: '小鸟' }, { word: '山水' },
    { word: '日月' }, { word: '石头' }, { word: '火车' }, { word: '学校' },
    { word: '朋友' }, { word: '上下' }, { word: '左右' }, { word: '大小' },
  ],
  二年级: [
    { word: '春天' }, { word: '花园' }, { word: '老师' }, { word: '同学' },
    { word: '劳动' }, { word: '运动' }, { word: '故事' }, { word: '国旗' },
    { word: '快乐' }, { word: '生日' }, { word: '打扫' }, { word: '干净' },
  ],
  三年级: [
    { word: '美丽' }, { word: '早晨' }, { word: '勇敢' }, { word: '彩虹' },
    { word: '蝴蝶' }, { word: '教室' }, { word: '操场' }, { word: '观察' },
    { word: '科学' }, { word: '礼物' }, { word: '旅行' }, { word: '聪明' },
  ],
  四年级: [
    { word: '勤劳' }, { word: '思考' }, { word: '实验' }, { word: '记录' },
    { word: '合作' }, { word: '交流' }, { word: '尊重' }, { word: '诚实' },
    { word: '责任' }, { word: '梦想' }, { word: '收获' }, { word: '成功' },
  ],
  五年级: [
    { word: '文化' }, { word: '民族' }, { word: '英雄' }, { word: '奋斗' },
    { word: '成就' }, { word: '探索' }, { word: '发明' }, { word: '创造' },
    { word: '生态' }, { word: '环境' }, { word: '资源' }, { word: '节约' },
  ],
  六年级: [
    { word: '青春' }, { word: '友谊' }, { word: '回忆' }, { word: '感恩' },
    { word: '努力' }, { word: '坚持' }, { word: '超越' }, { word: '挑战' },
    { word: '未来' }, { word: '希望' }, { word: '成长' }, { word: '理想' },
  ],
};

/** 英语单词（按年级，课标高频词，hint 为中文释义） */
export const ENGLISH_BANK: Record<string, DictWord[]> = {
  三年级: [
    { word: 'apple', hint: '苹果' }, { word: 'book', hint: '书' }, { word: 'cat', hint: '猫' },
    { word: 'dog', hint: '狗' }, { word: 'egg', hint: '鸡蛋' }, { word: 'fish', hint: '鱼' },
    { word: 'girl', hint: '女孩' }, { word: 'hand', hint: '手' }, { word: 'jump', hint: '跳' },
    { word: 'kite', hint: '风筝' }, { word: 'lion', hint: '狮子' }, { word: 'milk', hint: '牛奶' },
  ],
  四年级: [
    { word: 'morning', hint: '早晨' }, { word: 'school', hint: '学校' }, { word: 'teacher', hint: '老师' },
    { word: 'student', hint: '学生' }, { word: 'window', hint: '窗户' }, { word: 'garden', hint: '花园' },
    { word: 'breakfast', hint: '早餐' }, { word: 'dinner', hint: '晚餐' }, { word: 'family', hint: '家庭' },
    { word: 'holiday', hint: '假日' }, { word: 'weather', hint: '天气' }, { word: 'winter', hint: '冬天' },
  ],
  五年级: [
    { word: 'beautiful', hint: '美丽的' }, { word: 'hospital', hint: '医院' }, { word: 'library', hint: '图书馆' },
    { word: 'museum', hint: '博物馆' }, { word: 'restaurant', hint: '餐馆' }, { word: 'supermarket', hint: '超市' },
    { word: 'remember', hint: '记得' }, { word: 'forget', hint: '忘记' }, { word: 'interesting', hint: '有趣的' },
    { word: 'dangerous', hint: '危险的' }, { word: 'important', hint: '重要的' }, { word: 'different', hint: '不同的' },
  ],
  六年级: [
    { word: 'subject', hint: '科目' }, { word: 'science', hint: '科学' }, { word: 'history', hint: '历史' },
    { word: 'geography', hint: '地理' }, { word: 'physics', hint: '物理' }, { word: 'chemistry', hint: '化学' },
    { word: 'biology', hint: '生物' }, { word: 'engineer', hint: '工程师' }, { word: 'scientist', hint: '科学家' },
    { word: 'experiment', hint: '实验' }, { word: 'knowledge', hint: '知识' }, { word: 'language', hint: '语言' },
  ],
  七年级: [
    { word: 'vegetable', hint: '蔬菜' }, { word: 'delicious', hint: '美味的' }, { word: 'expensive', hint: '昂贵的' },
    { word: 'cheap', hint: '便宜的' }, { word: 'festival', hint: '节日' }, { word: 'celebrate', hint: '庆祝' },
    { word: 'tradition', hint: '传统' }, { word: 'practice', hint: '练习' }, { word: 'improve', hint: '提高' },
    { word: 'describe', hint: '描述' }, { word: 'experience', hint: '经历' }, { word: 'encourage', hint: '鼓励' },
  ],
  八年级: [
    { word: 'environment', hint: '环境' }, { word: 'pollution', hint: '污染' }, { word: 'protect', hint: '保护' },
    { word: 'society', hint: '社会' }, { word: 'technology', hint: '技术' }, { word: 'communication', hint: '交流' },
    { word: 'competition', hint: '竞争' }, { word: 'opportunity', hint: '机会' }, { word: 'challenge', hint: '挑战' },
    { word: 'success', hint: '成功' }, { word: 'failure', hint: '失败' }, { word: 'progress', hint: '进步' },
  ],
};

export type DictSubject = '语文' | '英语';

/** 取指定学科+年级的词库 */
export function bankFor(subject: DictSubject, grade: string): DictWord[] {
  const bank = subject === '语文' ? CHINESE_BANK : ENGLISH_BANK;
  return bank[grade] ?? [];
}

/** 归一化输入：去首尾空格；英语再转小写并去掉词内空格与常见标点 */
export function normalizeInput(input: string, subject: DictSubject): string {
  let s = input.trim();
  if (subject === '英语') {
    s = s.toLowerCase().replace(/[\s\-_.']/g, '');
  }
  return s;
}

/** 判分：英语忽略大小写/空格/连字符，语文要求逐字一致 */
export function checkWord(input: string, word: string, subject: DictSubject): boolean {
  return normalizeInput(input, subject) === normalizeInput(word, subject);
}

/** 首字提示（语文）：天×、英× */
export function maskHint(word: string): string {
  if (word.length <= 1) return word;
  return word[0] + '×'.repeat(word.length - 1);
}

/** 从词库随机抽 n 个词（可排除已抽过的） */
export function sampleWords(bank: DictWord[], n: number, exclude: string[] = []): DictWord[] {
  const excl = new Set(exclude);
  const pool = bank.filter((w) => !excl.has(w.word));
  const src = pool.length >= n ? pool : bank;
  return [...src].sort(() => Math.random() - 0.5).slice(0, Math.min(n, src.length));
}
