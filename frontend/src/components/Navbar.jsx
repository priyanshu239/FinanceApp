import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, LogOut, Wallet, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-400">
          <Wallet className="w-6 h-6" />
          FinanceApp
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 hover:text-primary-400 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          {(user.role === 'analyst' || user.role === 'admin') && (
            <Link to="/records" className="flex items-center gap-1 hover:text-primary-400 transition-colors">
              <List className="w-4 h-4" />
              Records
            </Link>
          )}
          {user.role === 'admin' && (
            <Link to="/users" className="flex items-center gap-1 hover:text-primary-400 transition-colors">
              <Users className="w-4 h-4" />
              Users
            </Link>
          )}
          <div className="flex items-center gap-3 border-l border-gray-700 pl-6">
            <span className="text-gray-400 text-sm">
              {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="p-2 text-red-400 hover:bg-red-900/20 rounded-full transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
