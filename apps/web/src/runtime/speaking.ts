/**
 * 英语跟读工作台：TTS 示范 → 麦克风跟读 → 语音识别转写 → 相似度评分。
 * 评分基于最长公共子序列（LCS）的词级匹配，本地计算零依赖。
 */

export interface SpeakSentence {
  level: 'primary' | 'junior' | 'senior';
  topic: string;
  text: string;
}

/** 内置句库：按学段分级的生活常用句 */
export const SENTENCE_BANK: SpeakSentence[] = [
  // 小学
  { level: 'primary', topic: '打招呼', text: 'Good morning, teacher. Nice to meet you.' },
  { level: 'primary', topic: '介绍自己', text: 'My name is Li Ming. I am nine years old.' },
  { level: 'primary', topic: '喜好', text: 'I like apples and bananas very much.' },
  { level: 'primary', topic: '天气', text: 'It is sunny today. Let us go to the park.' },
  { level: 'primary', topic: '家庭', text: 'This is my father. He is a doctor.' },
  { level: 'primary', topic: '时间', text: 'What time is it? It is seven o clock.' },
  { level: 'primary', topic: '颜色', text: 'The sky is blue and the flowers are red.' },
  { level: 'primary', topic: '学校', text: 'I go to school by bus every day.' },
  { level: 'primary', topic: '动物', text: 'The panda is black and white. It is very cute.' },
  { level: 'primary', topic: '感谢', text: 'Thank you very much. You are so kind.' },
  // 初中
  { level: 'junior', topic: '日常', text: 'I usually get up at six thirty in the morning.' },
  { level: 'junior', topic: '爱好', text: 'My favorite subject is English because it is interesting.' },
  { level: 'junior', topic: '周末', text: 'Last weekend I went to the library with my best friend.' },
  { level: 'junior', topic: '建议', text: 'You should do more exercise to keep healthy.' },
  { level: 'junior', topic: '天气', text: 'It was raining hard when I got home yesterday.' },
  { level: 'junior', topic: '旅行', text: 'Have you ever been to Beijing? It is a beautiful city.' },
  { level: 'junior', topic: '比较', text: 'This book is more interesting than that one.' },
  { level: 'junior', topic: '计划', text: 'I am going to visit my grandparents next Sunday.' },
  { level: 'junior', topic: '道歉', text: 'I am sorry I am late. The traffic was really heavy.' },
  { level: 'junior', topic: '观点', text: 'I think reading books is good for our study.' },
  // 高中
  { level: 'senior', topic: '观点表达', text: 'From my point of view, practice makes perfect.' },
  { level: 'senior', topic: '描述经历', text: 'Not only did we enjoy the scenery, but we also learned a lot.' },
  { level: 'senior', topic: '建议信', text: 'I would appreciate it if you could take my suggestion into consideration.' },
  { level: 'senior', topic: '人物', text: 'He is such a determined person that he never gives up.' },
  { level: 'senior', topic: '环保', text: 'It is high time that we took action to protect our environment.' },
  { level: 'senior', topic: '科技', text: 'With the development of technology, our life has changed a lot.' },
  { level: 'senior', topic: '读后续写', text: 'Tears welled up in her eyes as she hugged the little dog tightly.' },
  { level: 'senior', topic: '读后续写', text: 'A warm smile spread across his face when he saw the sunrise.' },
  { level: 'senior', topic: '文化交流', text: 'What impressed me most was the rich culture and friendly people.' },
  { level: 'senior', topic: '结尾', text: 'Looking back on this experience, I have learned the value of teamwork.' },
];

/** 归一化：小写 + 去标点 + 拆词 */
export function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ').split(/\s+/).filter(Boolean);
}

export interface DiffWord {
  word: string;
  /** ok=识别到了；miss=漏读；extra=多读/识别噪声 */
  state: 'ok' | 'miss' | 'extra';
}

export interface SpeakResult {
  /** 0-100 */
  score: number;
  diff: DiffWord[];
  comment: string;
}

/** LCS 词级匹配：返回目标句的匹配标记与识别串中的多余词 */
export function scoreSpeaking(target: string, transcript: string): SpeakResult {
  const t = tokenize(target);
  const s = tokenize(transcript);
  if (t.length === 0) return { score: 0, diff: [], comment: '说点什么吧 🎤' };
  if (s.length === 0) return { score: 0, diff: t.map((w) => ({ word: w, state: 'miss' as const })), comment: '没听清，再试一次 🔁' };

  // LCS 表
  const m = t.length, n = s.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = t[i] === s[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  // 回溯得到目标句每个词是否命中；被跳过的识别词记 extra
  const diff: DiffWord[] = [];
  let i = 0, j = 0;
  const extras: DiffWord[] = [];
  while (i < m && j < n) {
    if (t[i] === s[j]) { diff.push({ word: t[i], state: 'ok' }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { diff.push({ word: t[i], state: 'miss' }); i++; }
    else { extras.push({ word: s[j], state: 'extra' }); j++; }
  }
  while (i < m) { diff.push({ word: t[i], state: 'miss' }); i++; }
  while (j < n) { extras.push({ word: s[j], state: 'extra' }); j++; }

  const matched = diff.filter((d) => d.state === 'ok').length;
  // 得分 = 命中率为主，少量惩罚多读
  const raw = matched / t.length;
  const penalty = Math.min(0.15, extras.length * 0.03);
  const score = Math.max(0, Math.round((raw - penalty) * 100));
  const comment = score >= 90 ? '地道！发音清晰流利 🏆'
    : score >= 70 ? '很棒！个别词再练练 👍'
    : score >= 40 ? '不错，多跟读几遍会更好 💪'
    : '别灰心，先听示范再慢慢说 🎧';
  return { score, diff: [...diff, ...extras], comment };
}

/** 浏览器语音识别的最小类型面 */
export interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

/** 创建识别器（不支持的环境返回 null） */
export function createRecognizer(): RecognitionLike | null {
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = 'en-US';
  r.interimResults = false;
  r.continuous = false;
  return r;
}
