import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer'
  });
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const loadId = toast.loading('Creating account...');
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account created successfully!', { id: loadId });
    } catch (err) {
      toast.error(err, { id: loadId });
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <div className="flex flex-col items-center gap-4 mb-6 text-center">
          <div className="p-3 bg-primary-900/50 rounded-xl text-primary-400">
            <UserPlus className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-400">Join our finance data network</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Your Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                <option value="viewer">Viewer (Dashboard only)</option>
                <option value="analyst">Analyst (Records + Dashboard)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
