import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const { register } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Creating account...');
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account created!', { id: loadId });
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
            <UserPlus className="w-8 h-8 text-paper-100" />
          </div>
          <h1 className="text-3xl font-black text-ink lowercase tracking-tight">create account</h1>
          <p className="text-ink-muted mt-1.5 text-sm">join the finance data network</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="label-xs">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange}
                  className="input-paper pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-xs">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange}
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
                  type="password" name="password" value={formData.password}
                  onChange={handleChange}
                  className="input-paper pl-10"
                  placeholder="Min. 8 characters"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="label-xs">Your Role</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
                <select
                  name="role" value={formData.role}
                  onChange={handleChange}
                  className="input-paper pl-10 appearance-none cursor-pointer"
                >
                  <option value="viewer">Viewer — Dashboard only</option>
                  <option value="analyst">Analyst — Records + Dashboard</option>
                  <option value="admin">Admin — Full Access</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-3">
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink/10 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-bold hover:underline underline-offset-2">
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
