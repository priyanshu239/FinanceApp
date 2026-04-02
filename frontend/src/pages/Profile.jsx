import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, KeyRound, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Name cannot be empty');
    }
    if (name === user.name) {
      return toast.error('Name is the same as current');
    }

    setIsSubmitting(true);
    const loadId = toast.loading('Updating name...');
    try {
      await updateProfile({ name });
      toast.success('Name updated successfully!', { id: loadId });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update name', { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      return toast.error('Please enter your current password');
    }
    if (!newPassword) {
      return toast.error('Please enter a new password');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }

    setIsSubmitting(true);
    const loadId = toast.loading('Updating password...');
    try {
      await updateProfile({ currentPassword, newPassword });
      toast.success('Password updated successfully!', { id: loadId });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update password', { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-900/50 rounded-xl text-primary-400">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400">Update your personal details</p>
        </div>
      </div>

      {/* Email (Read-only) */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-200">Email Address</h2>
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-gray-500 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Email cannot be changed for security reasons
        </p>
      </div>

      {/* Update Name */}
      <form onSubmit={handleUpdateName} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-gray-200">Update Name</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            Save Name
          </button>
        </div>
      </form>

      {/* Update Password */}
      <form onSubmit={handleUpdatePassword} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <KeyRound className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-gray-200">Change Password</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Enter current password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Enter new password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-[0.98]"
          >
            <KeyRound className="w-4 h-4" />
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
