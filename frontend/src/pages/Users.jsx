import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Users as UsersIcon, Shield, Trash2, UserCheck, UserMinus, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async (id, updates) => {
    const loadId = toast.loading('Updating user...');
    try {
      await api.put(`/users/${id}`, updates);
      toast.success('User updated successfully', { id: loadId });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user', { id: loadId });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteConfirm;
    const loadId = toast.loading('Deleting account...');
    try {
      await api.delete(`/users/${id}`);
      toast.success('User account deleted', { id: loadId });
      setDeleteConfirm({ show: false, id: null });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user', { id: loadId });
    }
  };

  const handleDelete = async (id) => {
    // Handled by handleDeleteClick and confirmDelete
  };

  if (loading && users.length === 0) return <div className="p-8 text-center text-gray-400">Loading Users...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between p-6 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-primary-400" />
            User Management
          </h1>
          <p className="text-gray-400 mt-1">Control system access, roles, and account statuses.</p>
        </div>
        <div className="hidden md:block">
          <span className="bg-primary-900/40 text-primary-400 px-4 py-2 rounded-xl border border-primary-500/20 text-sm font-bold">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {error && <div className="p-4 bg-red-900/20 border border-red-500 text-red-500 rounded-xl">{error}</div>}

      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-bold">User Details</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold">Role</th>
                <th className="px-6 py-5 font-bold text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700/20 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-900/30 flex items-center justify-center text-primary-400 font-bold border border-primary-500/20">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-100">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => handleUpdate(user._id, { status: user.status === 'active' ? 'inactive' : 'active' })}
                      className={`flex items-center gap-2 group/status px-3 py-1.5 rounded-lg border transition-all ${
                        user.status === 'active' 
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <><UserCheck className="w-4 h-4" /> Active</>
                      ) : (
                        <><UserMinus className="w-4 h-4" /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <select 
                      className="bg-gray-900 border border-gray-700 rounded-lg py-1.5 px-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      value={user.role}
                      onChange={(e) => handleUpdate(user._id, { role: e.target.value })}
                      disabled={user._id === currentAdmin.id}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="analyst">Analyst</option>
                      {user.role === 'admin' && <option value="admin">Administrator</option>}
                    </select>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {user._id !== currentAdmin.id && (
                      <button 
                        onClick={() => handleDeleteClick(user._id)}
                        className="p-2.5 text-gray-500 hover:text-rose-400 hover:bg-rose-900/20 rounded-xl transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* User Deletion Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-800 w-full max-w-sm rounded-[24px] p-8 border border-gray-700 shadow-2xl scale-in-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50"></div>
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-900/30 flex items-center justify-center border-2 border-amber-500/20">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Delete Account?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  This user will lose all access to the system. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="flex-1 px-6 py-3.5 bg-gray-900 hover:bg-gray-700 text-gray-300 font-bold rounded-2xl transition-all border border-gray-700 active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-900/20 transition-all active:scale-95"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
