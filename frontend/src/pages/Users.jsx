import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Users as UsersIcon, Trash2, UserCheck, UserMinus, AlertTriangle, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/users${search ? `?search=${search}` : ''}`);
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleUpdate = async (id, updates) => {
    const loadId = toast.loading('Updating user...');
    try {
      await api.put(`/api/users/${id}`, updates);
      toast.success('User updated', { id: loadId });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update', { id: loadId });
    }
  };

  const confirmDelete = async () => {
    const { id } = deleteConfirm;
    const loadId = toast.loading('Deleting account...');
    try {
      await api.delete(`/api/users/${id}`);
      toast.success('User deleted', { id: loadId });
      setDeleteConfirm({ show: false, id: null });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete', { id: loadId });
    }
  };

  const roleColors = {
    admin: 'bg-ink text-paper-100 border-ink',
    analyst: 'bg-paper-300 text-ink border-ink/30',
    viewer: 'bg-paper-200 text-ink-muted border-ink/20',
  };

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header */}
      <div className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UsersIcon className="w-5 h-5 text-ink-muted" />
            <h1 className="text-2xl font-black text-ink lowercase">user management</h1>
          </div>
          <p className="text-ink-muted text-sm">control system access, roles, and account statuses</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-paper pl-10 pr-9 w-64 text-sm py-2.5"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="label-xs px-3 py-2 bg-paper-300 border border-ink/10 rounded-pill whitespace-nowrap">
            {users.length} Found
          </span>
        </div>
      </div>

      {error && <div className="card p-4 text-accent-red font-medium text-sm">{error}</div>}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-paper">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Role</th>
                <th className="text-left">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center text-paper-100 text-sm font-black flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-ink text-sm">{u.name}</div>
                        <div className="text-xs text-ink-muted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-pill border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-ink/20 ${roleColors[u.role] || roleColors.viewer}`}
                      value={u.role}
                      onChange={(e) => handleUpdate(u._id, { role: e.target.value })}
                      disabled={u._id === currentAdmin.id}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="analyst">Analyst</option>
                      {u.role === 'admin' && <option value="admin">Admin</option>}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdate(u._id, { status: u.status === 'active' ? 'inactive' : 'active' })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-pill text-xs font-bold border transition-all
                        ${u.status === 'active'
                          ? 'bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/30 hover:bg-[#2d6a4f]/20'
                          : 'bg-[#926015]/10 text-[#926015] border-[#926015]/30 hover:bg-[#926015]/20'
                        }`}
                    >
                      {u.status === 'active'
                        ? <><UserCheck className="w-3.5 h-3.5" /> Active</>
                        : <><UserMinus className="w-3.5 h-3.5" /> Inactive</>
                      }
                    </button>
                  </td>
                  <td className="text-right">
                    {u._id !== currentAdmin.id && (
                      <button
                        onClick={() => setDeleteConfirm({ show: true, id: u._id })}
                        className="p-2 text-ink-muted hover:text-accent-red hover:bg-[#b5291c]/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="p-16 text-center animate-fade-up">
            <div className="w-16 h-16 bg-paper-300 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-ink/10">
              <Search className="w-8 h-8 text-ink-faint" />
            </div>
            <h3 className="text-lg font-black text-ink mb-2">No users found</h3>
            <p className="text-ink-muted text-sm mb-6">
              {search ? `No results matching "${search}"` : 'No users registered yet.'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="btn-secondary py-2 px-5 text-sm">
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="card-sm w-full max-w-sm p-8 animate-scale-in text-center">
            <div className="w-14 h-14 bg-[#926015]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#926015]/20">
              <AlertTriangle className="w-7 h-7 text-[#926015]" />
            </div>
            <h3 className="text-xl font-black text-ink mb-2">Delete Account?</h3>
            <p className="text-ink-muted text-sm mb-7">This user will permanently lose all system access. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ show: false, id: null })} className="btn-secondary flex-1 py-3">Cancel</button>
              <button onClick={confirmDelete} className="btn-danger flex-1 py-3">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
