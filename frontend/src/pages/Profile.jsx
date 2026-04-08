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
    if (!name.trim()) return toast.error('Name cannot be empty');
    if (name === user.name) return toast.error('Name is the same as current');
    setIsSubmitting(true);
    const loadId = toast.loading('Updating name...');
    try {
      await updateProfile({ name });
      toast.success('Name updated!', { id: loadId });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update name', { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) return toast.error('Enter your current password');
    if (!newPassword) return toast.error('Enter a new password');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    setIsSubmitting(true);
    const loadId = toast.loading('Updating password...');
    try {
      await updateProfile({ currentPassword, newPassword });
      toast.success('Password updated!', { id: loadId });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update password', { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabel = { admin: 'Administrator', analyst: 'Analyst', viewer: 'Viewer' };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-up">
      {/* Header / Avatar Card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center text-paper-100 text-2xl font-black flex-shrink-0 shadow-paper">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black text-ink lowercase">{user?.name}</h1>
          <p className="text-ink-muted text-sm">{user?.email}</p>
          <span className="label-xs mt-1 inline-block px-2 py-0.5 bg-paper-300 border border-ink/10 rounded-pill">
            {roleLabel[user?.role] || user?.role}
          </span>
        </div>
      </div>

      {/* Email (Read-only) */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Mail className="w-4 h-4 text-ink-muted" />
          <h2 className="font-black text-ink lowercase">email address</h2>
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="email" value={user?.email || ''} disabled
            className="input-paper pl-10 opacity-60 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-ink-muted mt-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
          Email address cannot be changed for security reasons
        </p>
      </div>

      {/* Update Name */}
      <form onSubmit={handleUpdateName} className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-ink-muted" />
          <h2 className="font-black text-ink lowercase">update name</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="label-xs">Display Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input-paper pl-10"
                placeholder="Your display name"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" /> Save Name
          </button>
        </div>
      </form>

      {/* Update Password */}
      <form onSubmit={handleUpdatePassword} className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-4 h-4 text-ink-muted" />
          <h2 className="font-black text-ink lowercase">change password</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Current Password', val: currentPassword, set: setCurrentPassword, placeholder: 'Enter current password' },
            { label: 'New Password', val: newPassword, set: setNewPassword, placeholder: 'Min. 8 characters' },
            { label: 'Confirm New Password', val: confirmPassword, set: setConfirmPassword, placeholder: 'Repeat new password' },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label} className="space-y-1.5">
              <label className="label-xs">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="password" value={val} onChange={(e) => set(e.target.value)}
                  className="input-paper pl-10"
                  placeholder={placeholder}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-ink-muted">
            Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols.
          </p>
          <button type="submit" disabled={isSubmitting} className="btn-primary py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
            <KeyRound className="w-4 h-4" /> Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
