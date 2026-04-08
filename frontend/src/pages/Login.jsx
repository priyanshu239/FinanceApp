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
      toast.success('Welcome back!', { id: loadId });
    } catch (err) {
      toast.error(err, { id: loadId });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ink rounded-2xl mb-5 shadow-paper-md">
            <Wallet className="w-8 h-8 text-paper-100" />
          </div>
          <h1 className="text-3xl font-black text-ink lowercase tracking-tight">welcome back</h1>
          <p className="text-ink-muted mt-1.5 text-sm">sign in to your finance dashboard</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="label-xs">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-paper pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-xs">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-paper pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink/10 text-center text-sm text-ink-muted">
            No account yet?{' '}
            <Link to="/register" className="text-ink font-bold hover:underline underline-offset-2">
              Register here →
            </Link>
          </div>
        </div>

        {/* Subtle footer */}
        <p className="text-center text-xs text-ink-faint mt-6">
          zorvyn · finance data processing & access control
        </p>
      </div>
    </div>
  );
};

export default Login;
