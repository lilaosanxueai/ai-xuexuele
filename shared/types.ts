/** 共享类型定义：前后端共用，改这里要同时考虑两端 */

export interface Profile {
  id: string;
  name: string;
  avatar: string; // emoji
  createdAt: string;
}

export type CheckRule =
  | { type: 'block_used'; block: string }
  | { type: 'block_used_any'; blocks: string[] }
  | { type: 'block_count_min'; block: string; count: number }
  | { type: 'block_count_total_min'; count: number }
  | { type: 'say_text' }
  | { type: 'actor_reach'; targetIndex: number; tolerance?: number }
  | { type: 'manual' };

/** 随堂练习题 */
export interface Exercise {
  q: string;
  options: string[];
  answer: number; // 正确选项下标
  explain: string;
}

export interface LessonTask {
  id: string;
  text: string;
  /** 分级提示词（AI 提示模式的参考材料，从方向到搭法） */
  hintPrompts: string[];
  check: CheckRule;
  /** ⭐挑战任务：选做，不计入通关条件 */
  optional?: boolean;
}

export interface StageTarget {
  emoji: string;
  x: number;
  y: number;
}

/** 课标对标：《义务教育信息科技课程标准（2022年版）》 */
export interface CurriculumInfo {
  /** 学段，如"第三学段（5-6年级）" */
  stage: string;
  /** 内容模块，如"身边的算法" */
  module: string;
  /** 本课覆盖的知识点 */
  points: string[];
}

export interface Lesson {
  id: string;
  island: string;
  /** 代码模式课：默认进入 Python 编辑器而非积木画布 */
  codeLesson?: boolean;
  /** 代码模式课的初始 Python 代码 */
  starterCode?: string;
  order: number;
  title: string;
  emoji: string;
  /** 开场故事，进入课程时展示 */
  story: string;
  goals: string[];
  /** 本课可用的积木类型列表 */
  toolbox: string[];
  starterXml?: string;
  actor: { costume: string; x: number; y: number; dir?: number };
  targets?: StageTarget[];
  tasks: LessonTask[];
  /** 综合创作课：无固定通关校验，任务多为自评 */
  freeplayLesson?: boolean;
  /** 对标课标信息（家长端学情报告与任务面板展示） */
  curriculum?: CurriculumInfo;
  /** 随堂练习（通关后解锁，成绩进家长报告） */
  exercises?: Exercise[];
  /** 交叉课程学科标注：编程 × 学科（跨学科主题学习） */
  subject?: { name: string; emoji: string; points: string[] };
  /** 学科分类（九大学科）：语文/数学/英语/科学/物理/化学/生物/地理/音乐/信息科技 */
  subjectArea?: string;
  /** 学段：primary 小学 / junior 初中 / senior 高中衔接 */
  gradeBand?: 'primary' | 'junior' | 'senior';
  aiIntro: string;
  celebrate: string;
}

export interface TaskState {
  done: boolean;
  doneAt?: string;
}

export interface LessonProgress {
  status: 'in_progress' | 'completed';
  tasks: Record<string, TaskState>;
  completedAt?: string;
}

export interface ProfileProgress {
  profileId: string;
  lessons: Record<string, LessonProgress>;
  /** 每日使用分钟数，键为 YYYY-MM-DD */
  dailyUsage: Record<string, number>;
  /** 每课的画布草稿（XML），离开后自动恢复 */
  lessonDrafts: Record<string, string>;
  /** 每课的 Python 代码草稿（代码模式），离开后自动恢复 */
  lessonCodes: Record<string, string>;
  /** 随堂练习成绩：lessonId -> {correct, total} */
  exercises?: Record<string, { correct: number; total: number }>;
}

export interface Project {
  id: string;
  profileId: string;
  title: string;
  /** Blockly workspace XML */
  xml: string;
  /** 舞台截图 dataURL */
  thumb: string;
  lessonId?: string;
  /** Python 代码模式保存的作品：放映时直接运行代码 */
  code?: string;
  /** 保存时的舞台配置，作品墙放映时还原 */
  stage?: { actor: Lesson['actor']; targets?: StageTarget[] };
  /** 给作品点过 ❤️ 的角色 id 列表（家庭点赞） */
  likes?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BuddyMode = 'idea' | 'build' | 'hint' | 'explain' | 'review';

/** AI 代搭指令：孩子口述 → 大模型/本地解析 → 积木操作序列（前端逐块搭上画布） */
export interface BuildOp {
  op: 'clear' | 'add';
  /** add：积木类型（island_ 前缀，必须在课程工具箱白名单内） */
  type?: string;
  /** add：字段值（字段名 → 文本值，数字字段也传字符串） */
  fields?: Record<string, string>;
  /** add：子积木（重复/如果 等容器积木内部） */
  children?: BuildOp[];
  /** add：容器积木的分支名（默认 STACK，如果否则的第二个分支是 STACK2） */
  branch?: string;
}

/** 积木目录条目：前端从定义生成，发给服务端供大模型选积木用 */
export interface BlockCatalogEntry {
  type: string;
  label: string;
  /** 积木上的完整文案（含 %1 占位），供大模型理解语义 */
  message: string;
  /** 可填字段：name=字段名 kind=类型 options=下拉可选项 */
  fields: { name: string; kind: 'number' | 'text' | 'dropdown'; options?: string[] }[];
  /** 是否有内部子积木槽（重复/如果等） */
  container?: boolean;
  /** 是否帽子积木（程序入口，一屏最多一个） */
  hat?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  mode?: BuddyMode;
  ts?: string;
}

/** 客户端发给服务端的对话上下文摘要（积木清单等，省 token 且不含敏感内容） */
export interface ChatContext {
  screen: 'lesson' | 'freeplay';
  lessonTitle?: string;
  lessonGoals?: string[];
  currentTask?: string;
  hintPrompts?: string[];
  blockCounts: Record<string, number>;
  runOk?: boolean;
  lastError?: string;
  projectTitle?: string;
}

export interface BuddySettings {
  name: string;
  emoji: string;
  /** 伙伴性格描述，注入 system prompt */
  persona: string;
}

export interface LimitSettings {
  dailyMinutes: number;
  /** 提示严格度：gentle 只给方向 / normal 给搭法 / direct 差一步的答案 */
  hintStrictness: 'gentle' | 'normal' | 'direct';
  /** 达到每日时长后锁定创作（需家长 PIN 解锁，当日有效）。默认 false 仅提醒 */
  hardStop?: boolean;
}

export interface Settings {
  buddy: BuddySettings;
  limits: LimitSettings;
}

export const DEFAULT_SETTINGS: Settings = {
  buddy: {
    name: '奇点',
    emoji: '🤖',
    persona: '热情、爱提问、把孩子当成一起创造的搭档；语气活泼、多鼓励、不说教，喜欢用表情符号，回复简短适合孩子阅读',
  },
  limits: { dailyMinutes: 40, hintStrictness: 'normal' },
};

/** AI 训练场：一个已训练的类别（名字 + 样本特征向量） */
export interface TrainedClass {
  name: string;
  emoji: string;
  /** 每条样本是压缩灰度特征向量（0~1），仅存在于本机 */
  samples: number[][];
}

export interface PlaygroundModel {
  classes: TrainedClass[];
  updatedAt?: string;
}
