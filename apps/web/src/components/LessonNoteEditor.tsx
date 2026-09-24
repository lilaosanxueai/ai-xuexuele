import { useEffect, useState } from 'react';
import { api } from '../api.ts';

/** 课程笔记：孩子自己的学习笔记，自动保存到学习档案 */
export default function LessonNoteEditor({ lessonId, profileId, onSaved }: {
  lessonId: string;
  profileId: string;
  onSaved?: (note: string) => void;
}) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // 打开时从 API 拉已有笔记
  useEffect(() => {
    if (!open || loaded) return;
    void api.progress(profileId).then((p) => {
      setText(p.lessonNotes?.[lessonId] ?? '');
      if (p.lessonNotes?.[lessonId]) setSavedAt('已保存');
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, [open, loaded, profileId, lessonId]);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await api.updateProgress(profileId, { lessonNotes: { [lessonId]: text } });
      setSavedAt('✓ 已保存');
      onSaved?.(text);
    } catch {
      setSavedAt('保存失败，重试');
    } finally {
      setSaving(false);
    }
  };

  // 自动保存：停顿 2 秒
  useEffect(() => {
    if (!loaded || text === '') return;
    const t = setTimeout(() => { void save(); }, 2000);
    return () => clearTimeout(t);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-2xl bg-amber-50/80 ring-1 ring-amber-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-bold text-amber-700 transition hover:bg-amber-100/60"
      >
        📝 我的笔记
        {loaded && text && <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] text-amber-700">已有 {text.length} 字</span>}
        {savedAt && <span className="text-[10px] font-normal text-amber-400">{savedAt}</span>}
        <span className="ml-auto text-xs">{open ? '收起 ▲' : '展开 ▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-3">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setSavedAt(null); }}
            onBlur={() => void save()}
            maxLength={2000}
            rows={5}
            placeholder={'用自己的话记下来才是真的懂了：\n· 这一课最关键的一个点是什么？\n· 我容易在哪里出错？\n· 我想提醒自己……'}
            className="w-full rounded-xl border-2 border-amber-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-amber-400"
          />
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>{text.length}/2000</span>
            <span>{saving ? '保存中…' : savedAt ?? '停止输入 2 秒自动保存'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
