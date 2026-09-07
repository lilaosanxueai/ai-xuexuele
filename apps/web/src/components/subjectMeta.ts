/** 学科元信息：图标、主题色、课标名称 */
export const SUBJECTS: Record<string, { emoji: string; color: string; desc: string }> = {
  '信息科技': { emoji: '💻', color: 'slate', desc: '编程与人工智能 · 信息安全' },
  '数学': { emoji: '🔢', color: 'sky', desc: '数与代数 · 图形与几何 · 统计与函数' },
  '语文': { emoji: '📖', color: 'rose', desc: '古诗 · 成语 · 表达' },
  '英语': { emoji: '🔤', color: 'amber', desc: '口语 · 数字 · 句型' },
  '科学': { emoji: '🔬', color: 'teal', desc: '物质科学 · 宇宙与地球' },
  '物理': { emoji: '⚡', color: 'indigo', desc: '力 · 声 · 光 · 电' },
  '化学': { emoji: '🧪', color: 'violet', desc: '物态变化 · 分子 · 方程式' },
  '生物': { emoji: '🌿', color: 'emerald', desc: '生命周期 · 生态系统' },
  '地理': { emoji: '🌏', color: 'orange', desc: '地球运动 · 纬度与气候' },
  '音乐': { emoji: '🎵', color: 'pink', desc: '音阶 · 旋律 · 节奏' },
};

/** 学段显示名 */
export const BAND_LABEL: Record<string, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中衔接',
};

/** 学科主题色对应的 Tailwind 类（避免动态拼接被清除） */
export const SUBJECT_STYLE: Record<string, { card: string; badge: string; text: string; ring: string }> = {
  '信息科技': { card: 'from-slate-500 to-slate-700', badge: 'bg-slate-100 text-slate-700', text: 'text-slate-700', ring: 'ring-slate-300' },
  '数学': { card: 'from-sky-500 to-blue-600', badge: 'bg-sky-100 text-sky-700', text: 'text-sky-700', ring: 'ring-sky-300' },
  '语文': { card: 'from-rose-500 to-red-600', badge: 'bg-rose-100 text-rose-700', text: 'text-rose-700', ring: 'ring-rose-300' },
  '英语': { card: 'from-amber-400 to-orange-500', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-700', ring: 'ring-amber-300' },
  '科学': { card: 'from-teal-500 to-cyan-600', badge: 'bg-teal-100 text-teal-700', text: 'text-teal-700', ring: 'ring-teal-300' },
  '物理': { card: 'from-indigo-500 to-violet-600', badge: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700', ring: 'ring-indigo-300' },
  '化学': { card: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-700', text: 'text-violet-700', ring: 'ring-violet-300' },
  '生物': { card: 'from-emerald-500 to-green-600', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-700', ring: 'ring-emerald-300' },
  '地理': { card: 'from-orange-500 to-amber-600', badge: 'bg-orange-100 text-orange-700', text: 'text-orange-700', ring: 'ring-orange-300' },
  '音乐': { card: 'from-pink-500 to-fuchsia-600', badge: 'bg-pink-100 text-pink-700', text: 'text-pink-700', ring: 'ring-pink-300' },
};
