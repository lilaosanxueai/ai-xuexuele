import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/profile.ts';

export default function Header() {
  const { current, setCurrent } = useProfileStore();
  const nav = useNavigate();
  return (
    <header className="flex flex-wrap items-center gap-2 px-4 py-2 md:py-3">
      <Link to="/map" className="text-xl font-black text-sky-700 md:text-2xl">📖 AI学学乐</Link>
      <nav className="flex gap-0.5 md:ml-6 md:gap-1">
        <NavLink to="/map">📚 <span className="hidden sm:inline">学习中心</span></NavLink>
        <NavLink to="/ask">💬 <span className="hidden sm:inline">问 AI</span></NavLink>
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
