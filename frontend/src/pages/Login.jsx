import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Wallet, LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Authenticating...');
    try {
      await login(email, password);
      toast.success('Successfully logged in!', { id: loadId });
    } catch (err) {
      toast.error(err, { id: loadId });
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-3 bg-primary-900/50 rounded-xl text-primary-400">
            <Wallet className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your finance portal</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:underline">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
