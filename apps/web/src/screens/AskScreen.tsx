import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, Settings } from '@shared/types.ts';
import { DEFAULT_SETTINGS } from '@shared/types.ts';
import { api } from '../api.ts';
import { useProfileStore } from '../stores/profile.ts';
import Header from '../components/Header.tsx';
import AIBuddy from '../components/AIBuddy.tsx';
import { buildIndex, searchLessons } from '../runtime/search.ts';

/** AI 答疑页：不绑定课程的自由学科问答——作业不会做、知识点没听懂，直接问。
 *  创新点：问句先过全科知识索引，命中的课本定义句注入 AI 上下文，让回答向课本口径靠拢。 */
export default function AskScreen() {
  const nav = useNavigate();
  const { current: profile } = useProfileStore();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!profile) { nav('/'); return; }
    void api.settings().then(setSettings).catch(() => {});
    void api.lessons().then(setLessons).catch(() => {});
  }, [profile, nav]);

  const index = useMemo(() => buildIndex(lessons), [lessons]);

  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 p-4">
        <div className="mb-3">
          <h1 className="text-xl font-black text-slate-800">💬 问 AI 老师</h1>
          <p className="text-sm text-slate-500">作业不会做、知识点没听懂、想多学一点——什么学科都可以问</p>
        </div>
        <div className="h-[calc(100vh-12rem)] overflow-hidden rounded-2xl bg-white shadow-md">
          <AIBuddy
            profileId={profile.id}
            buddy={settings.buddy}
            intro={`你好！我是${settings.buddy.name}。今天学习中遇到什么问题了吗？把题目或不懂的地方告诉我，我来帮你弄懂它（放心，我不会直接报答案，会引导你自己想出来）。`}
            defaultMode="explain"
            modes={['explain', 'hint']}
            quick={{
              explain: ['怎么背单词记得牢？', '应用题总是列错式子怎么办？'],
              hint: ['这道题不会做', '作业里有一题卡住了'],
            }}
            subtitle="AI 学科辅导老师"
            getContext={(message) => {
              const ctx: { screen: 'ask'; askKnowledge?: string } = { screen: 'ask' };
              if (message && index.length > 0) {
                const hits = searchLessons(index, message, { limit: 2 });
                if (hits.length > 0) {
                  const byId = new Map(lessons.map((l) => [l.id, l]));
                  const parts = hits.map((h) => {
                    const l = byId.get(h.lessonId);
                    const grade = l ? (l.gradeBand === 'primary' ? '小学' : l.gradeBand === 'junior' ? '初中' : '高中') : '';
                    return `《${h.lessonTitle}》（${h.subject}·${grade}）：${h.snippets.join('；')}`;
                  });
                  ctx.askKnowledge = parts.join('\n').slice(0, 800);
                }
              }
              return ctx;
            }}
          />
        </div>
      </main>
    </div>
  );
}
