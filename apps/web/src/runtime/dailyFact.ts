import type { Lesson } from '@shared/types.ts';

/**
 * 每日知识碎片：每天展示一条跨学科的有趣知识（"你知道吗？"），
 * 按日期确定性轮换，链接到相关课程激发深入学习的兴趣。
 */

export interface DailyFact {
  emoji: string;
  subject: string;
  fact: string;
  lessonId: string | null;
  lessonTitle: string | null;
}

/** 精选知识碎片库（手工打磨，覆盖各学科） */
const FACTS: Omit<DailyFact, 'lessonId' | 'lessonTitle'>[] = [
  { emoji: '🦴', subject: '科学', fact: '人的骨骼有 206 块，但婴儿有 300 多块——长大后有些骨会融合。' },
  { emoji: '🧲', subject: '科学', fact: '地球本身就是一个巨大的磁铁——指南针能指北是因为地磁场的存在。' },
  { emoji: '⚡', subject: '物理', fact: '闪电的温度可达约 30000°C，是太阳表面温度的 5 倍。' },
  { emoji: '🌊', subject: '物理', fact: '声音在水中的传播速度约 1500m/s，是空气中的 4 倍多。' },
  { emoji: '🧪', subject: '化学', fact: '金和铜是人类最早使用的金属——约 1 万年前就有了铜器。' },
  { emoji: '💎', subject: '化学', fact: '钻石和铅笔芯都是碳原子——区别只在于排列方式（金刚石结构 vs 层状石墨）。' },
  { emoji: '🧬', subject: '生物', fact: '如果把一个细胞的 DNA 拉直，约有 2 米长；全身的 DNA 连起来可绕地球数百圈。' },
  { emoji: '🌳', subject: '生物', fact: '树靠"蒸腾拉力"把水从根拉到百米高的树顶——不需要任何泵。' },
  { emoji: '🌍', subject: '地理', fact: '地球自转一周不是正好 24 小时，而是 23 小时 56 分 4 秒（恒星日）。' },
  { emoji: '🏔️', subject: '地理', fact: '喜马拉雅山每年还在长高约 5 毫米——印度板块仍在北推。' },
  { emoji: '📐', subject: '数学', fact: '圆周率 π 已被计算到百万亿位，但圆的周长公式只用一个字母就够了。' },
  { emoji: '🔢', subject: '数学', fact: '0 是最后被发明的数字——古罗马没有 0，算术非常痛苦。' },
  { emoji: '📖', subject: '语文', fact: '汉字是世界上仍在使用的最古老文字——从甲骨文到简化字超过 3400 年。' },
  { emoji: '🌙', subject: '语文', fact: '李白一生写诗约 1000 首，其中"月"字出现了 300 多次。' },
  { emoji: '🔤', subject: '英语', fact: '英语中使用最多的字母是 E，最少的是 Z——密码学就利用了这一点。' },
  { emoji: '莎士比亚', subject: '英语', fact: '莎士比亚发明了约 1700 个英语单词，包括 lonely 和 bedroom。' },
  { emoji: '🎵', subject: '音乐', fact: '莫扎特 5 岁作曲、8 岁写交响曲——但他也说"天赋就是日复一日的练习"。' },
  { emoji: '🎼', subject: '音乐', fact: '毕达哥拉斯发现音程的数学规律：弦长减半，音高升高八度。' },
  { emoji: '🎨', subject: '艺术', fact: '达芬奇画蒙娜丽莎用了约 4 年，但一生都没觉得"画完了"。' },
  { emoji: '🏛️', subject: '艺术', fact: '古希腊雕塑是彩色的——我们看到的白色是颜料褪掉后的样子。' },
  { emoji: '⚽', subject: '体育', fact: '一场 90 分钟的足球赛，一名中场球员跑动约 12 公里。' },
  { emoji: '🥇', subject: '体育', fact: '奥运金牌其实是银做的——表面镀了约 6 克黄金。' },
  { emoji: '💻', subject: '信息科技', fact: '第一个计算机 Bug 是一只真的飞蛾——1947 年困在哈佛计算机里。' },
  { emoji: '🤖', subject: '信息科技', fact: 'AI 学下围棋只用了 3 天——但学拿起一个杯子到现在还在努力。' },
  { emoji: '⚖️', subject: '道德与法治', fact: '"法"字古代写作"灋"——左边是水（公平），右边是独角兽（正义）。' },
  { emoji: '♻️', subject: '道德与法治', fact: '一个塑料瓶自然降解需要约 450 年——你扔的瓶子比你活得久得多。' },
  { emoji: '🍳', subject: '劳动', fact: '炒鸡蛋时加一点水会更嫩——水蒸气让蛋蓬松。这是物理变化。' },
  { emoji: '🔧', subject: '劳动', fact: '拧螺丝顺时针是紧、逆时针是松——全世界统一，源于工业革命标准化。' },
  { emoji: '🍯', subject: '科学', fact: '蜂蜜是唯一不会变质的食物——考古学家发现 3000 年前的蜂蜜还能吃。' },
  { emoji: '🐳', subject: '生物', fact: '蓝鲸的心脏有小汽车那么大，心跳声 3 公里外都能探测到。' },
];

/** 按日期+档案确定性选一条（同一天同一条，每天不同） */
export function pickDailyFact(dateKey: string, _profileId: string): DailyFact {
  let h = 0;
  const s = dateKey;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  const fact = FACTS[h % FACTS.length];
  return { ...fact, lessonId: null, lessonTitle: null };
}

/** 从课程库中找到与该学科相关的第一门课（可选跳转） */
export function linkFactToLesson(fact: DailyFact, lessons: Lesson[]): DailyFact {
  const match = lessons.find((l) => (l.subjectArea ?? '') === fact.subject);
  if (match) return { ...fact, lessonId: match.id, lessonTitle: match.title };
  return fact;
}
