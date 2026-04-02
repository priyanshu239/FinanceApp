import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, LogOut, Wallet, Users, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) return null;

  const NavContent = ({ mobile = false }) => (
    <>
      <Link 
        to="/" 
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-2 hover:text-primary-400 transition-colors ${mobile ? 'py-3' : ''}`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className={mobile ? 'text-lg' : ''}>Dashboard</span>
      </Link>
      {(user.role === 'analyst' || user.role === 'admin') && (
        <Link 
          to="/records" 
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-2 hover:text-primary-400 transition-colors ${mobile ? 'py-3' : ''}`}
        >
          <List className="w-4 h-4" />
          <span className={mobile ? 'text-lg' : ''}>Records</span>
        </Link>
      )}
      {user.role === 'admin' && (
        <Link 
          to="/users" 
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-2 hover:text-primary-400 transition-colors ${mobile ? 'py-3' : ''}`}
        >
          <Users className="w-4 h-4" />
          <span className={mobile ? 'text-lg' : ''}>Users</span>
        </Link>
      )}
      <div className={`flex items-center gap-3 ${mobile ? 'border-t border-gray-700 mt-4 pt-6' : 'border-l border-gray-700 pl-6'}`}>
        <div className="flex flex-col">
          <span className="text-gray-100 font-medium text-sm leading-tight">
            {user.name}
          </span>
          <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">
            {user.role}
          </span>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className={`p-2.5 text-rose-400 hover:bg-rose-900/20 rounded-xl transition-all border border-transparent hover:border-rose-500/20`}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </>
  );

  return (
    <nav className="bg-gray-800/80 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-700 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 text-xl font-black text-primary-400 tracking-tighter group">
            <div className="p-2 bg-primary-900/40 rounded-xl group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span>ZORVYN</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <NavContent />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="lg:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-8 flex flex-col gap-6 shadow-2xl">
            <NavContent mobile />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
