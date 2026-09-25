import type { Lesson, ProfileProgress } from '@shared/types.ts';

/** 学习数据 CSV 导出：成绩明细 + 学习时长，可在 Excel 打开 */

function csvEscape(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** 成绩明细 CSV：课程/学科/答题/答对/正确率/完成时间 */
export function exercisesToCsv(lessons: Lesson[], progress: ProfileProgress): string {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const rows = [['课程ID', '课程名', '学科', '学段', '答题数', '答对数', '正确率(%)', '完成时间']];
  const doneSet = new Set<string>();
  for (const [id, lp] of Object.entries(progress.lessons ?? {})) {
    if (lp.status === 'completed' && lp.completedAt) doneSet.add(lp.completedAt.slice(0, 10) + '|' + id);
  }
  for (const [id, ex] of Object.entries(progress.exercises ?? {})) {
    const l = byId.get(id);
    if (!l) continue;
    const band = l.gradeBand === 'primary' ? '小学' : l.gradeBand === 'junior' ? '初中' : '高中';
    const acc = ex.total > 0 ? Math.round((ex.correct / ex.total) * 100) : '';
    const doneAt = [...doneSet].find((d) => d.endsWith('|' + id))?.split('|')[0] ?? '';
    rows.push([id, l.title, l.subjectArea ?? '', band, String(ex.total), String(ex.correct), String(acc), doneAt]);
  }
  return rows.map((r) => r.map(csvEscape).join(',')).join('\n');
}

/** 学习时长 CSV：日期/分钟 */
export function usageToCsv(progress: ProfileProgress): string {
  const rows = [['日期', '学习分钟']];
  for (const [date, min] of Object.entries(progress.dailyUsage ?? {}).sort(([a], [b]) => a.localeCompare(b))) {
    rows.push([date, String(min)]);
  }
  return rows.map((r) => r.map(csvEscape).join(',')).join('\n');
}

/** 触发浏览器下载 CSV */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
