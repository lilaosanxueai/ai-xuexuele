import { useRef, useState } from 'react';
import { api } from '../api.ts';
import type { ProfileProgress } from '@shared/types.ts';

/** 数据备份：导出 JSON 存到 U 盘/网盘；换电脑或误删后一键恢复 */
export default function BackupTab({ profileId }: { profileId: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = async () => {
    setBusy(true);
    try {
      const data = await api.backup(profileId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ai-xuexuele-backup-${profileId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      setMsg('✅ 备份文件已下载，请妥善保存（U 盘/网盘各存一份更保险）');
    } catch {
      setMsg('❌ 导出失败，请确认服务正在运行');
    } finally {
      setBusy(false);
    }
  };

  const doImport = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as { progress?: ProfileProgress };
      if (!data.progress) throw new Error('bad file');
      if (!window.confirm('导入将覆盖当前孩子的全部学习进度（课内完成、练习成绩、错题本、学习时长），确定继续吗？')) return;
      await api.restore(profileId, data.progress);
      setMsg('✅ 恢复完成，学习进度已回到备份时的状态');
    } catch {
      setMsg('❌ 导入失败：文件损坏、格式不对或与当前档案不匹配');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/80 p-5">
      <h3 className="mb-2 font-black">💾 学习数据备份与恢复</h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-500">
        所有学习数据只存本机。建议每月导出一次备份文件存到 U 盘或网盘——换电脑、重装系统或误删数据时，用「恢复」一键找回。
      </p>
      <div className="flex flex-wrap gap-3">
        <button onClick={doExport} disabled={busy} className="rounded-xl bg-emerald-500 px-5 py-2.5 font-bold text-white shadow transition hover:bg-emerald-600 disabled:opacity-50">⬇️ 导出备份文件</button>
        <button onClick={() => fileRef.current?.click()} disabled={busy} className="rounded-xl bg-sky-500 px-5 py-2.5 font-bold text-white shadow transition hover:bg-sky-600 disabled:opacity-50">⬆️ 从备份恢复</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void doImport(f);
            e.target.value = '';
          }}
        />
      </div>
      {msg && <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{msg}</p>}
      <p className="mt-3 text-xs text-slate-400">提示：恢复会覆盖当前进度，请确认选择的备份文件属于这个孩子（文件名含档案编号）。</p>
    </div>
  );
}
