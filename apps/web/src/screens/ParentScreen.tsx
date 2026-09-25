import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lesson, Profile, ProfileProgress, Project, Settings } from '@shared/types.ts';
import { api } from '../api.ts';
import BackupTab from '../components/BackupTab.tsx';
import CompareTab from '../components/CompareTab.tsx';
import AnnualReport from '../components/AnnualReport.tsx';
import { computeBadges, readRecords, recordsKey, EMPTY_RECORDS } from '../runtime/achievements.ts';
import { computeWeeklyReport } from '../runtime/weeklyReport.ts';
import { calcStreak } from '../utils/streak.ts';

/** 家长面板：学习进度 / 学情报告 / AI 对话记录 / 伙伴设置（已取消 PIN 门，直接进入） */

type Tab = 'progress' | 'report' | 'annual' | 'chats' | 'settings' | 'backup' | 'compare';

export default function ParentScreen() {
  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-8">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-black">🛡 家长中心</h1>
        <Link to="/map" className="ml-auto rounded-xl bg-slate-200 px-3 py-1.5 text-sm font-bold hover:bg-slate-300">← 回应用</Link>
      </div>
      <div className="mb-6 rounded-2xl bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-800">
        🔒 <b>隐私承诺</b>：孩子的全部数据（进度、作品、AI 对话、训练场样本与摄像头画面）都只保存在这台电脑上，不上云、不联网同步；摄像头画面只在本机浏览器内计算。
      </div>
      <Tabs />
    </div>
  );
}

function Tabs() {
  const [tab, setTab] = useState<Tab>('progress');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileId, setProfileId] = useState('');

  useEffect(() => {
    void api.profiles().then((ps) => {
      setProfiles(ps);
      if (ps[0]) setProfileId(ps[0].id);
    });
  }, []);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {([['progress', '📈 学习进度'], ['report', '📗 学情报告'], ['annual', '📖 年度报告'], ['chats', '💬 AI 对话记录'], ['compare', '👥 档案对比'], ['backup', '💾 数据备份'],
        ['settings', '⚙️ 设置']] as [Tab, string][])
          .map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-4 py-2 font-bold ${tab === k ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
            >
              {label}
            </button>
          ))}
        {profiles.length > 1 && (
          <select
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            className="ml-auto rounded-xl border border-slate-300 px-3 py-2"
          >
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>)}
          </select>
        )}
      </div>
      {!profileId ? <p className="text-slate-400">还没有创建孩子角色</p> : (
        tab === 'annual' ? <AnnualReport profiles={profiles} />
        : tab === 'compare' ? <CompareTab profiles={profiles} />
        : tab === 'backup' ? <BackupTab profileId={profileId} />
        : tab === 'progress' ? <ProgressTab profileId={profileId} />
          : tab === 'report' ? <ReportTab profileId={profileId} />
 : tab === 'chats' ? <ChatsTab profileId={profileId} />
 : <SettingsTab />
      )}
    </div>
  );
}

function ProgressTab({ profileId }: { profileId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);
  const [noteText, setNoteText] = useState('');
  useEffect(() => {
    void api.lessons().then(setLessons);
    void api.progress(profileId).then(setProgress);
  }, [profileId]);

  const today = new Date().toISOString().slice(0, 10);
  const todayMin = progress?.dailyUsage[today] ?? 0;

  const sendNote = async () => {
    const text = noteText.trim();
    if (!text) return;
    const next = [{ text, at: new Date().toISOString() }, ...(progress?.parentNotes ?? [])].slice(0, 20);
    setNoteText('');
    try {
      const p = await api.updateProgress(profileId, { parentNotes: next });
      setProgress(p);
    } catch { /* 提交失败静默 */ }
  };

  return (
    <div>
      {/* 家长悄悄话：写给孩子的小鼓励 */}
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 p-4 ring-1 ring-amber-200">
        <div className="mb-1 text-sm font-black text-amber-700">💌 给孩子的悄悄话</div>
        <div className="flex gap-2">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void sendNote(); }}
            maxLength={120}
            placeholder="写一句鼓励，会显示在孩子的学习地图顶部（120 字以内）"
            className="flex-1 rounded-xl border-2 border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
          />
          <button onClick={sendNote} disabled={!noteText.trim()} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-40">送出 💌</button>
        </div>
        {(progress?.parentNotes ?? []).length > 0 && (
          <div className="mt-2 space-y-1">
            {progress!.parentNotes!.slice(0, 3).map((n, i) => (
              <div key={n.at + i} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="shrink-0 text-slate-400">{new Date(n.at).toLocaleDateString('zh-CN')}</span>
                <span className="truncate">{i === 0 ? '📌 ' : ''}{n.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4 rounded-2xl bg-white/80 p-4">
        今天使用了 <b className="text-xl text-sky-700">{todayMin}</b> 分钟
      </div>
      <div className="overflow-hidden rounded-2xl bg-white/80">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-sm text-slate-500">
            <tr><th className="p-3">课程</th><th className="p-3">状态</th><th className="p-3">要点完成</th><th className="p-3">完成时间</th></tr>
          </thead>
          <tbody>
            {lessons.map((l) => {
              const lp = progress?.lessons[l.id];
              const done = lp?.tasks ? Object.values(lp.tasks).filter((t) => t.done).length : 0;
              return (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="p-3 font-semibold">{l.emoji} {l.title}</td>
                  <td className="p-3">{lp?.status === 'completed' ? '✅ 已完成' : lp ? '⏳ 进行中' : '—'}</td>
                  <td className="p-3">{done}/{l.tasks.length}</td>
                  <td className="p-3 text-sm text-slate-400">{lp?.completedAt ? new Date(lp.completedAt).toLocaleString('zh-CN') : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 学情报告：课标知识点覆盖 + 学习投入统计，可打印 */
function ReportTab({ profileId }: { profileId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    void api.lessons().then(setLessons);
    void api.progress(profileId).then(setProgress);
    void api.projects(profileId).then(setProjects).catch(() => {});
  }, [profileId]);

  const done = (id: string) => progress?.lessons[id]?.status === 'completed';
  const totalMin = Object.values(progress?.dailyUsage ?? {}).reduce((a, b) => a + b, 0);
  const streak = calcStreak(progress?.dailyUsage ?? {});
  const doneCount = lessons.filter((l) => done(l.id)).length;

  // 知识点覆盖：已完成课的知识点打勾（按 学科 × 课标模块 分组展示）
  const byModule = new Map<string, { point: string; lesson: Lesson; done: boolean }[]>();
  for (const l of lessons) {
    if (!l.curriculum) continue;
    for (const p of l.curriculum.points) {
      const key = `${l.subjectArea ?? '信息科技'} · ${l.curriculum.module}（${l.curriculum.stage}）`;
      if (!byModule.has(key)) byModule.set(key, []);
      byModule.get(key)!.push({ point: p, lesson: l, done: done(l.id) });
    }
  }

  // 练习成绩
  const exEntries = Object.entries(progress?.exercises ?? {});
  const exTotal = exEntries.reduce((a, [, e]) => a + e.total, 0);
  const exCorrect = exEntries.reduce((a, [, e]) => a + e.correct, 0);

  // 错题本
  const wrongItems = progress?.wrongBook ?? [];
  const wrongCleared = progress?.wrongCleared ?? 0;
  const wrongBySubject = Object.entries(
    wrongItems.reduce<Record<string, typeof wrongItems>>((acc, w) => {
      (acc[w.subjectArea] ??= []).push(w);
      return acc;
    }, {}),
  ).sort((a, b) => b[1].length - a[1].length);

  // 学科维度聚合
  const bySubject: Record<string, Lesson[]> = {};
  for (const l of lessons) {
    const key = l.subjectArea ?? '信息科技';
    (bySubject[key] ??= []).push(l);
  }

  // 跨学科实践课程：学科 × 编程演示双标注的课程
  const crossLessons = lessons.filter((l) => l.subject);

  // 本周学情镜像（周报引擎 + 徽章 + 热力图，全部本地计算）
  const report = computeWeeklyReport(lessons, progress);
  const badges = useMemo(() => {
    let rec = EMPTY_RECORDS;
    try { rec = readRecords(JSON.parse(localStorage.getItem(recordsKey(profileId)) ?? '{}')); } catch { /* 忽略 */ }
    return computeBadges(lessons, progress, rec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons, progress, profileId]);
  const heat: number[] = [];
  for (let i = 55; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const m = progress?.dailyUsage[d.toISOString().slice(0, 10)] ?? 0;
    heat.push(m === 0 ? 0 : m < 15 ? 1 : m < 30 ? 2 : m < 60 ? 3 : 4);
  }
  const heatColor = (lv: number) => ['bg-slate-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'][lv];

  // 学习成长报告打印（打印时只显示报告浮层）
  const [printing, setPrinting] = useState(false);
  const doPrint = () => {
    setPrinting(true);
    setTimeout(() => { window.print(); setPrinting(false); }, 120);
  };
  const unlockedBadges = badges.filter((b) => b.unlocked);
  const PRINT_CSS = '@media print { body * { visibility: hidden !important; } #growth-report, #growth-report * { visibility: visible !important; } #growth-report { position: absolute !important; left: 0; top: 0; width: 100%; background: #fff; } }';

  return (
    <div>
      {/* 打印成长报告浮层 */}
      {printing && (
        <div id="growth-report" className="fixed inset-0 z-[80] overflow-y-auto bg-white p-8 text-slate-900">
          <style>{PRINT_CSS}</style>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-center text-2xl font-black">学习成长报告</h1>
            <p className="mt-1 text-center text-sm text-slate-500">AI学学乐 · {new Date().toLocaleDateString('zh-CN')} 生成</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>本周学习时长：{report.totalMinutes} 分钟（{report.activeDays} 天）</div>
              <div>连续学习：{report.streak} 天</div>
              <div>课程完成：{doneCount}/{lessons.length}</div>
              <div>累计学习：{totalMin} 分钟</div>
              <div>随堂练习正确率：{exTotal ? Math.round((exCorrect / exTotal) * 100) : 0}%（{exCorrect}/{exTotal}）</div>
              <div>错题练对：{wrongCleared} 道（待重练 {wrongItems.length} 道）</div>
            </div>
            <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm">{report.headline}</p>
            {report.subjectStats.length > 0 && (
              <div className="mt-4">
                <h2 className="font-black">各学科正确率</h2>
                <ul className="mt-1 grid grid-cols-2 gap-x-4 text-sm">
                  {report.subjectStats.map((s) => (<li key={s.subject}>· {s.subject}：{s.accuracy}%（{s.correct}/{s.total}）</li>))}
                </ul>
              </div>
            )}
            {unlockedBadges.length > 0 && (
              <div className="mt-4">
                <h2 className="font-black">已解锁成就（{unlockedBadges.length}/{badges.length}）</h2>
                <p className="mt-1 text-sm">{unlockedBadges.map((b) => `${b.emoji}${b.name}`).join('　')}</p>
              </div>
            )}
            {report.weakLessons.length > 0 && (
              <div className="mt-4">
                <h2 className="font-black">建议加强</h2>
                <ul className="mt-1 text-sm">
                  {report.weakLessons.map((w) => (<li key={w.lessonId}>· {w.title}（{w.subject}）正确率 {w.accuracy}%</li>))}
                </ul>
              </div>
            )}
            <div className="mt-6 grid grid-cols-7 gap-1">
              {heat.map((lv, i) => (<div key={i} className="h-4 w-4 rounded-[3px] border border-slate-200" style={{ background: ['#f1f5f9', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981'][lv] }} />))}
            </div>
            <p className="mt-1 text-xs text-slate-400">近 8 周学习热力图（颜色越深学习越久）</p>
          </div>
        </div>
      )}
      {/* 本周学情速览 */}
      <div className="mb-4 rounded-2xl bg-white/80 p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="font-black">📊 本周学情（过去 7 天）</h3>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">共 {report.totalMinutes} 分钟</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">学习 {report.activeDays} 天</span>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500">🔥 连续 {report.streak} 天</span>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">🏅 徽章 {badges.filter((b) => b.unlocked).length}/{badges.length}</span>
          <button onClick={doPrint} className="ml-auto rounded-xl bg-slate-700 px-3 py-1 text-xs font-bold text-white transition hover:bg-slate-800">🖨 打印成长报告</button>
        </div>
        <p className="mb-3 text-sm text-slate-600">{report.headline}</p>
        {report.subjectStats.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {report.subjectStats.slice(0, 8).map((s) => (
              <span key={s.subject} className={`rounded-full px-2.5 py-1 text-xs font-bold ${s.accuracy !== null && s.accuracy >= 80 ? 'bg-emerald-100 text-emerald-700' : s.accuracy !== null && s.accuracy >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'}`}>
                {s.subject} {s.accuracy}%（{s.correct}/{s.total}）
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="shrink-0 text-xs font-bold text-slate-400">近 8 周</span>
          <div className="flex gap-1">
            {heat.map((lv, i) => (<div key={i} className={`h-3.5 w-3.5 shrink-0 rounded-[3px] ${heatColor(lv)}`} />))}
          </div>
        </div>
        {report.weakLessons.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="text-xs font-bold text-rose-500">需要关注的薄弱课：</div>
            {report.weakLessons.map((w) => (
              <div key={w.lessonId} className="text-xs text-slate-600">{w.emoji} {w.title}（{w.subject}）— 正确率 {w.accuracy}%</div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="累计学习" value={`${totalMin} 分钟`} emoji="⏰" />
        <StatCard label="连续天数" value={`${streak} 天`} emoji="🔥" />
        <StatCard label="课程完成" value={`${doneCount}/${lessons.length}`} emoji="🏁" />
        <StatCard label="创作作品" value={`${projects.length} 个`} emoji="🖼" />
        <StatCard label="随堂练习" value={exTotal ? `${Math.round((exCorrect / exTotal) * 100)}%` : '—'} emoji="📝" />
        <StatCard label="错题练对" value={wrongItems.length + wrongCleared > 0 ? `${wrongCleared}/${wrongItems.length + wrongCleared}` : '—'} emoji="📖" />
      </div>

      {/* 错题本：薄弱知识点一目了然 */}
      {wrongItems.length > 0 && (
        <div className="mb-4 rounded-2xl bg-white/80 p-5">
          <h3 className="mb-3 font-black">📖 待重练的错题（按学科）</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {wrongBySubject.map(([area, items]) => (
              <div key={area} className="flex items-center gap-2 text-sm">
                <span className="w-16 shrink-0 font-bold text-slate-600">{area}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-rose-400" style={{ width: `${Math.min(100, items.reduce((a, w) => a + w.times, 0) * 20)}%` }} />
                </div>
                <span className="w-14 text-right text-xs text-slate-400">{items.length} 道</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">错题会在孩子的错题本里等待重练，重练全对自动移出（累计已练对 {wrongCleared} 道）</p>
        </div>
      )}

      <div className="mb-4 rounded-2xl bg-white/80 p-5">
        <h3 className="mb-3 font-black">📚 各学科进度</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(bySubject).map(([area, ls]) => {
            const d = ls.filter((l) => done(l.id)).length;
            return (
              <div key={area} className="flex items-center gap-2 text-sm">
                <span className="w-16 shrink-0 font-bold text-slate-600">{area}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: `${(d / ls.length) * 100}%` }} />
                </div>
                <span className="w-10 text-right text-xs text-slate-400">{d}/{ls.length}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white/80 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-black">📗 课标知识点覆盖</h3>
          <span className="text-xs text-slate-400">按学科课标模块分组 · 绿色为已完成</span>
        </div>
        {[...byModule.entries()].map(([mod, points]) => (
          <div key={mod} className="mb-4">
            <div className="mb-1.5 text-sm font-bold text-slate-600">{mod}</div>
            <div className="flex flex-wrap gap-2">
              {points.map((p) => (
                <span
                  key={p.point + p.lesson.id}
                  title={`${p.lesson.title}${p.done ? ' · 已完成' : ' · 未完成'}`}
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    p.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {p.done ? '✓' : '○'} {p.point}
                </span>
              ))}
            </div>
          </div>
        ))}
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          绿色 ✓ 为已完成课程覆盖的知识点。2025 年秋季起多地中小学开设 AI 通识课（每年级不少于 8 课时），
          AI学学乐可作为课内的家庭动手补充：同样的知识点，这里全部通过「自己做出来」来学会。
        </p>
      </div>

      {crossLessons.length > 0 && (
        <div className="mt-4 rounded-2xl bg-rose-50/80 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-black text-rose-700">🎓 跨学科实践课程（学科 × 编程演示）</h3>
            <span className="text-xs text-rose-400">新课标要求：每学期不少于 10% 课时的跨学科主题学习</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {crossLessons.map((l) => (
              <div
                key={l.id}
                className={`rounded-xl p-3 text-sm ${done(l.id) ? 'bg-white shadow-sm' : 'bg-white/50 opacity-70'}`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <span>{done(l.id) ? '✅' : '○'}</span>
                  <span className="text-lg">{l.emoji}</span>
                  <span className="truncate">{l.title}</span>
                  <span className="ml-auto shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
                    {l.subject?.emoji} {l.subject?.name}
                  </span>
                </div>
                {done(l.id) && l.subject && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {l.subject.points.map((pt) => (
                      <span key={pt} className="rounded-full bg-rose-100/70 px-2 py-0.5 text-xs text-rose-700">✓ {pt}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-rose-400">
            已完成 {crossLessons.filter((l) => done(l.id)).length}/{crossLessons.length} 个跨学科实践——每个课程同时覆盖一门学科的知识点和编程演示。
          </p>
        </div>
      )}

      <div className="mt-4 text-right print:hidden">
        <button onClick={() => window.print()} className="rounded-xl bg-slate-800 px-5 py-2 font-bold text-white hover:bg-slate-900">🖨 打印 / 存 PDF</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 text-xl font-black text-slate-800">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function ChatsTab({ profileId }: { profileId: string }) {  const [dates, setDates] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [logs, setLogs] = useState<{ ts: string; mode: string; user: string; assistant: string }[]>([]);

  useEffect(() => {
    void api.chatDates(profileId).then((r) => {
      setDates(r.dates);
      if (r.dates[0]) setDate(r.dates[0]);
    });
  }, [profileId]);

  useEffect(() => {
    if (date) void api.chatLogs(profileId, date).then(setLogs);
  }, [profileId, date]);

  const MODE_LABEL: Record<string, string> = { idea: '💡灵感', hint: '🆘提示', explain: '📖讲解', review: '🌟点评', 'safety-guard': '🛡安全拦截' };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        {dates.length === 0 ? (
          <span className="text-slate-400">还没有对话记录</span>
        ) : (
          <select value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2">
            {dates.map((d) => <option key={d}>{d}</option>)}
          </select>
        )}
        <span className="text-sm text-slate-400">共 {logs.length} 条，全部对话均长期保留</span>
      </div>
      <div className="space-y-3">
        {logs.map((l, i) => (
          <div key={i} className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-bold text-slate-600">{MODE_LABEL[l.mode] ?? l.mode}</span>
              {new Date(l.ts).toLocaleTimeString('zh-CN')}
            </div>
            <div className="text-sm"><b>孩子：</b>{l.user}</div>
            <div className="mt-1 whitespace-pre-wrap text-sm"><b>伙伴：</b>{l.assistant}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { void api.settings().then(setSettings); }, []);
  if (!settings) return <p className="text-slate-400">加载中…</p>;

  const save = async () => {
    await api.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl space-y-5 rounded-2xl bg-white/80 p-6">
      <div>
        <h3 className="mb-3 font-black">🤖 AI 伙伴</h3>
        <div className="flex items-center gap-3">
          <input
            value={settings.buddy.emoji}
            onChange={(e) => setSettings({ ...settings, buddy: { ...settings.buddy, emoji: e.target.value } })}
            className="w-16 rounded-xl border border-slate-300 px-3 py-2 text-center text-xl"
          />
          <input
            value={settings.buddy.name}
            onChange={(e) => setSettings({ ...settings, buddy: { ...settings.buddy, name: e.target.value } })}
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
            placeholder="伙伴名字"
          />
        </div>
        <textarea
          value={settings.buddy.persona}
          onChange={(e) => setSettings({ ...settings, buddy: { ...settings.buddy, persona: e.target.value } })}
          rows={3}
          className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder="伙伴性格（会注入对话人设）"
        />
      </div>

      <div>
        <h3 className="mb-3 font-black">⏰ 每日使用时长</h3>
        <div className="flex items-center gap-3">
          <input
            type="range" min={10} max={120} step={5}
            value={settings.limits.dailyMinutes}
            onChange={(e) => setSettings({ ...settings, limits: { ...settings.limits, dailyMinutes: Number(e.target.value) } })}
            className="flex-1"
          />
          <span className="w-16 text-right font-bold">{settings.limits.dailyMinutes} 分钟</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">连续使用 20 分钟会自动弹出 20 秒远眺休息（护眼 20-20-20）</p>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!settings.limits.hardStop}
            onChange={(e) => setSettings({ ...settings, limits: { ...settings.limits, hardStop: e.target.checked } })}
            className="h-4 w-4 accent-emerald-600"
          />
          <span><b>到时锁定</b>：达到每日时长后锁定休息 1 分钟（自动解锁）。不勾选则只提醒不锁定</span>
        </label>
      </div>

      <div>
        <h3 className="mb-3 font-black">🆘 提示严格度</h3>
        <div className="flex gap-2">
          {([['gentle', '温和：只给方向'], ['normal', '标准：先方向后搭法'], ['direct', '直接：较早给搭法']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setSettings({ ...settings, limits: { ...settings.limits, hintStrictness: k } })}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold ${settings.limits.hintStrictness === k ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => void save()} className="rounded-xl bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-600">保存设置</button>
        {saved && <span className="text-sm text-emerald-600">已保存 ✓</span>}
      </div>
    </div>
  );
}
