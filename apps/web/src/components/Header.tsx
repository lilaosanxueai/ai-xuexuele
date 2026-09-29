import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profile.ts';
import { levelFor } from '../runtime/xp.ts';

export default function Header() {
  const { current, setCurrent } = useProfileStore();
  const nav = useNavigate();
  const [lv, setLv] = useState<number | null>(null);

  // 等级徽章：随当前档案拉取 XP（本地接口，开销可忽略；档案切换时重拉）
  useEffect(() => {
    if (!current) { setLv(null); return; }
    let alive = true;
    void fetch(`/api/progress/${current.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p: { xp?: number }) => { if (alive) setLv(levelFor(p.xp ?? 0).level); })
      .catch(() => { if (alive) setLv(null); });
    return () => { alive = false; };
  }, [current]);

  return (
    <header className="flex flex-wrap items-center gap-2 px-4 py-2 md:py-3">
      <Link to="/map" className="text-xl font-black text-sky-700 md:text-2xl">📖 AI学学乐</Link>
      <nav className="flex gap-0.5 md:ml-6 md:gap-1">
        <NavLink to="/map">📚 <span className="hidden sm:inline">学习中心</span></NavLink>
        <NavLink to="/ask">💬 <span className="hidden sm:inline">答疑</span></NavLink>
        <NavLink to="/gallery">🖼 <span className="hidden sm:inline">作品墙</span></NavLink>
      </nav>
      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        {current && (
          <button
            onClick={() => { setCurrent(null); nav('/'); }}
            className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-sm font-bold shadow hover:bg-white md:px-3 md:py-1.5"
            title="切换角色"
          >
            <span className="text-lg md:text-xl">{current.avatar}</span> <span className="hidden sm:inline">{current.name}</span>
            {lv != null && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-600" title="学习之星等级">⭐{lv}</span>
            )}
          </button>
        )}
        <Link to="/parent" className="rounded-full bg-slate-200/70 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-300 md:px-3 md:py-1.5 md:text-sm">🛡 家长</Link>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-full px-2 py-1 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-sky-700 md:px-4 md:py-1.5"
    >
      {children}
    </Link>
  );
}
