import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, LogOut, Wallet, Users, Menu, X, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-semibold transition-all duration-150
    ${isActive(path)
      ? 'bg-ink text-paper-100 shadow-paper'
      : 'text-ink-muted hover:text-ink hover:bg-paper-200'
    }`;

  return (
    <nav className="sticky top-3 z-[100] px-3">
      {/* Full-width magnifying glass pill */}
      <div
        className="rounded-full border overflow-hidden relative"
        style={{
          borderColor: 'rgba(15, 14, 11, 0.20)',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px) saturate(250%) contrast(125%) brightness(115%)',
          WebkitBackdropFilter: 'blur(10px) saturate(250%) contrast(125%) brightness(115%)',
          boxShadow: [
            'inset 0 1.5px 0 rgba(255,255,255,0.85)',
            'inset 0 -1px 0 rgba(15,14,11,0.05)',
            '0 4px 28px rgba(15,14,11,0.10)',
          ].join(', '),
        }}
      >
        {/* Main bar — sits above the lens layer */}
        <div className="relative z-10 flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-ink font-black tracking-tight">
            <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-paper-100" />
            </div>
            <span className="text-base uppercase tracking-widest">Zorvyn</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            {(user.role === 'analyst' || user.role === 'admin') && (
              <Link to="/records" className={navLinkClass('/records')}>
                <List className="w-4 h-4" /> Records
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/users" className={navLinkClass('/users')}>
                <Users className="w-4 h-4" /> Users
              </Link>
            )}
          </div>

          {/* Right — User + Logout */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink/15 hover:border-ink/40 hover:bg-paper-300/30 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center text-paper-100 text-xs font-black">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-ink">{user.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{user.role}</span>
              </div>
            </Link>
            <button onClick={logout} className="btn-ghost text-sm px-3 py-2" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-ink-muted hover:text-ink">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu — drops below inside the glass pill */}
        {isOpen && (
          <div className="relative z-10 lg:hidden border-t border-ink/10 px-4 pb-4 pt-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setIsOpen(false)} className={navLinkClass('/')}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            {(user.role === 'analyst' || user.role === 'admin') && (
              <Link to="/records" onClick={() => setIsOpen(false)} className={navLinkClass('/records')}>
                <List className="w-4 h-4" /> Records
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/users" onClick={() => setIsOpen(false)} className={navLinkClass('/users')}>
                <Users className="w-4 h-4" /> Users
              </Link>
            )}
            <div className="border-t border-ink/10 pt-3 mt-1 flex items-center justify-between">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-ink">
                <UserCircle className="w-5 h-5 text-ink-muted" />
                {user.name} <span className="text-xs text-ink-muted uppercase tracking-widest">({user.role})</span>
              </Link>
              <button onClick={() => { setIsOpen(false); logout(); }} className="text-accent-red font-bold text-sm flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
