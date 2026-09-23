import type { Lesson, ProfileProgress } from '@shared/types.ts';

/**
 * 期末复习计划生成器：把学科知识图谱的模块掌握度变成可执行的 N 天计划。
 * 原则：薄弱模块优先且分配更多天数；每天 1-2 个模块；同模块的复习日错开（间隔复习）。
 */

export interface PlanModule {
  module: string;
  /** 掌握度 0-100；无数据为 null（视为最薄弱优先） */
  mastery: number | null;
  lessonCount: number;
}

export interface PlanDay {
  day: number;
  modules: string[];
}

export interface StudyPlan {
  /** 生成时间 */
  createdAt: string;
  /** 总天数 */
  days: number;
  schedule: PlanDay[];
}

/** 从课程与进度提炼模块列表（带掌握度） */
export function collectModules(lessons: Lesson[], progress: ProfileProgress | null): PlanModule[] {
  const m = new Map<string, { sum: number; n: number; total: number }>();
  for (const l of lessons) {
    const mod = l.curriculum?.module;
    if (!mod) continue;
    const cur = m.get(mod) ?? { sum: 0, n: 0, total: 0 };
    cur.total += 1;
    const ex = progress?.exercises?.[l.id];
    if (ex && ex.total > 0) { cur.sum += ex.correct / ex.total; cur.n += 1; }
    m.set(mod, cur);
  }
  return [...m.entries()].map(([module, v]) => ({ module, mastery: v.n > 0 ? Math.round((v.sum / v.n) * 100) : null, lessonCount: v.total }));
}

/**
 * 生成计划：按"弱者多配"权重分配天数。
 * 权重 = (100 - 掌握度) + 40（无数据的模块掌握度按 0 算再 +40 额外优先）
 */
export function generateStudyPlan(modules: PlanModule[], days: number): StudyPlan {
  if (modules.length === 0 || days <= 0) return { createdAt: new Date().toISOString(), days, schedule: [] };
  const sorted = [...modules].sort((a, b) => (a.mastery ?? -40) - (b.mastery ?? -40));
  const weight = (m: PlanModule) => (m.mastery === null ? 140 : 100 - m.mastery) + 20;
  const totalWeight = sorted.reduce((s, m) => s + weight(m), 0);

  // 每个模块分到的"复习次数"（至少 1 次）
  const slots: string[] = [];
  for (const m of sorted) {
    const share = Math.max(1, Math.round((weight(m) / totalWeight) * days * 1.2));
    for (let i = 0; i < share && slots.length < days * 2; i++) slots.push(m.module);
  }
  // 轮转摊到每天（薄弱模块排前，自然占据更早的天）
  const schedule: PlanDay[] = [];
  for (let d = 1; d <= days; d++) {
    const take = slots.splice(0, d <= days / 3 ? 2 : 1);
    if (take.length === 0 && schedule.length > 0) {
      // 槽位用尽：回头复习最薄弱的一个
      take.push(sorted[0].module);
    }
    if (take.length > 0) schedule.push({ day: d, modules: [...new Set(take)] });
  }
  return { createdAt: new Date().toISOString(), days, schedule };
}

/** 今日该复习的模块（按计划创建日推算第几天；超出计划范围返回空） */
export function todayModules(plan: StudyPlan | null, now: Date = new Date()): string[] {
  if (!plan || plan.schedule.length === 0) return [];
  const start = new Date(plan.createdAt);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const day = diff + 1;
  if (day < 1) return [];
  return plan.schedule.find((d) => d.day === day)?.modules ?? [];
}
