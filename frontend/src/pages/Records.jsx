import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Filter, ChevronLeft, ChevronRight, Calculator, Calendar, Tag, RotateCcw, AlertTriangle, X, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Records = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [filters, setFilters] = useState({ type: '', category: '', date: '' });
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, isBulk: false });
  const [selectedIds, setSelectedIds] = useState([]);
  const [newRecord, setNewRecord] = useState({
    amount: '',
    type: 'expense',
    category: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { type, category, date } = filters;
      let url = `/api/records?page=${page}&limit=${limit}`;
      if (type) url += `&type=${type}`;
      if (category) url += `&category=${category}`;
      if (date) url += `&date=${date}`;
      
      const res = await api.get(url);
      setRecords(res.data.data);
      setTotal(res.data.total);
      setSelectedIds([]); // Clear selection on fetch
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, filters]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Adding record...');
    try {
      await api.post('/api/records', newRecord);
      setShowModal(false);
      setNewRecord({ amount: '', type: 'expense', category: '', note: '', date: new Date().toISOString().split('T')[0] });
      toast.success('Record added successfully!', { id: loadId });
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add record', { id: loadId });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, id, isBulk: false });
  };

  const handleBulkDeleteClick = () => {
    setDeleteConfirm({ show: true, id: null, isBulk: true });
  };

  const confirmDelete = async () => {
    const { id, isBulk } = deleteConfirm;
    const loadId = toast.loading(isBulk ? `Deleting ${selectedIds.length} records...` : 'Deleting record...');
    try {
      if (isBulk) {
        await api.post('/api/records/bulk-delete', { ids: selectedIds });
        toast.success(`${selectedIds.length} records deleted`, { id: loadId });
        setSelectedIds([]);
      } else {
        await api.delete(`/api/records/${id}`);
        toast.success('Record deleted', { id: loadId });
      }
      setDeleteConfirm({ show: false, id: null, isBulk: false });
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete record', { id: loadId });
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === records.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(records.map(r => r._id));
    }
  };

  const handleDelete = async (id) => {
    // This is now handled by handleDeleteClick and confirmDelete
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-800 rounded-2xl border border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-700">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={filters.type} 
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-transparent text-sm focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-700">
            <Tag className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Filter by category..."
              className="bg-transparent text-sm focus:outline-none w-32"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-700">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input 
              type="date" 
              className="bg-transparent text-sm focus:outline-none w-32 [color-scheme:dark]"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          {(filters.type || filters.category || filters.date) && (
            <button 
              onClick={() => setFilters({ type: '', category: '', date: '' })}
              className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
              title="Clear Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {user.role === 'admin' && (
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDeleteClick}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg active:scale-95 animate-in slide-in-from-right"
              >
                <Trash2 className="w-5 h-5" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Record
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              {user.role === 'admin' && (
                <th className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500/20"
                    checked={records.length > 0 && selectedIds.length === records.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Created By</th>
              {user.role === 'admin' && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {records.map((record) => (
              <tr key={record._id} className={`hover:bg-gray-700/30 transition-colors ${selectedIds.includes(record._id) ? 'bg-primary-900/10' : ''}`}>
                {user.role === 'admin' && (
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500/20"
                      checked={selectedIds.includes(record._id)}
                      onChange={() => handleSelect(record._id)}
                    />
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium">{record.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    record.type === 'income' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${
                  record.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.createdBy?.name || 'Unknown'}</td>
                {user.role === 'admin' && (
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(record._id)}
                      className="text-gray-500 hover:text-rose-400 transition-colors p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {loading && <div className="p-8 text-center text-gray-500">Loading records...</div>}
        {!loading && records.length === 0 && <div className="p-12 text-center text-gray-500 italic">No records found matching criteria.</div>}

        <div className="bg-gray-900/50 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {records.length} of {total} records</p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={page * limit >= total}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500 text-red-500 rounded-xl mb-6 shadow-lg animate-in fade-in text-center font-medium">
          {error}
        </div>
      )}

      {/* Modal Backdrop and Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 w-full max-w-md rounded-2xl p-8 border border-gray-700 shadow-2xl scale-in-center">
            <h2 className="text-2xl font-bold mb-6">Add New Financial Record</h2>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Amount ($)</label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                    value={newRecord.amount}
                    onChange={(e) => setNewRecord({...newRecord, amount: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-3"
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input 
                      type="date" 
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 px-3"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4"
                    placeholder="e.g. Rent, Salary, Food"
                    value={newRecord.category}
                    onChange={(e) => setNewRecord({...newRecord, category: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Note (Optional)</label>
                <textarea 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-3"
                  rows="2"
                  value={newRecord.note}
                  onChange={(e) => setNewRecord({...newRecord, note: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-primary-600 hover:bg-primary-500 font-bold py-3 rounded-xl"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-800 w-full max-w-sm rounded-[24px] p-8 border border-gray-700 shadow-2xl scale-in-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/50"></div>
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-rose-900/30 flex items-center justify-center border-2 border-rose-500/20">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{deleteConfirm.isBulk ? 'Delete Batch?' : 'Are you sure?'}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {deleteConfirm.isBulk 
                    ? `You are about to permanently remove ${selectedIds.length} records. This action cannot be reversed.`
                    : 'This transaction will be permanently removed. This action cannot be reversed.'
                  }
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
                  className="flex-1 px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-900/20 transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
