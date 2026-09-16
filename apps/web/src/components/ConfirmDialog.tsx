import type { ReactNode } from 'react';

/** 应用风格的确认弹窗：替代浏览器原生 confirm()，视觉与全站卡片弹窗一致 */
export default function ConfirmDialog({
  title,
  message,
  confirmText = '确定',
  danger = false,
  onConfirm,
  onClose,
}: {
  title: string;
  message?: ReactNode;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-black">{title}</h3>
        {message && <div className="mt-2 text-sm leading-relaxed text-slate-600">{message}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl bg-slate-200 px-4 py-2 font-bold hover:bg-slate-300">取消</button>
          <button
            onClick={() => { onClose(); onConfirm(); }}
            className={`rounded-xl px-4 py-2 font-bold text-white ${danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-sky-500 hover:bg-sky-600'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
