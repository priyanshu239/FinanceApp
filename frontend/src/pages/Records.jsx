import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Trash2, Filter, ChevronLeft, ChevronRight, Calculator,
  Calendar, Tag, RotateCcw, AlertTriangle, X, Download, FileSpreadsheet, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const Records = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ type: '', category: '', date: '' });
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, isBulk: false });
  const [selectedIds, setSelectedIds] = useState([]);
  const [newRecord, setNewRecord] = useState({
    amount: '', type: 'expense', category: '', note: '',
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
      setSelectedIds([]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const loadId = toast.loading('Generating CSV...');
    try {
      const { type, category, date } = filters;
      let url = `/api/records/export?`;
      if (type) url += `&type=${type}`;
      if (category) url += `&category=${category}`;
      if (date) url += `&date=${date}`;
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `zorvyn-finance-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started!', { id: loadId });
    } catch {
      toast.error('Failed to export records', { id: loadId });
    }
  };

  useEffect(() => { fetchRecords(); }, [page, filters]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Adding record...');
    try {
      await api.post('/api/records', newRecord);
      setShowModal(false);
      setNewRecord({ amount: '', type: 'expense', category: '', note: '', date: new Date().toISOString().split('T')[0] });
      toast.success('Record added!', { id: loadId });
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add record', { id: loadId });
    }
  };

  const confirmDelete = async () => {
    const { id, isBulk } = deleteConfirm;
    const loadId = toast.loading(isBulk ? `Deleting ${selectedIds.length} records...` : 'Deleting...');
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
      toast.error(err.response?.data?.message || 'Failed to delete', { id: loadId });
    }
  };

  const handleSelect = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleSelectAll = () =>
    setSelectedIds(selectedIds.length === records.length ? [] : records.map(r => r._id));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Filter + Action Bar */}
      <div className="card p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-paper-200 border border-ink/20 rounded-pill px-3 py-2">
            <Filter className="w-4 h-4 text-ink-muted" />
            <select
              value={filters.type}
              onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}
              className="bg-transparent text-sm text-ink focus:outline-none cursor-pointer font-medium"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-paper-200 border border-ink/20 rounded-pill px-3 py-2">
            <Tag className="w-4 h-4 text-ink-muted" />
            <input
              type="text" placeholder="Category..."
              className="bg-transparent text-sm text-ink focus:outline-none w-28 font-medium placeholder-ink-faint"
              value={filters.category}
              onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
            />
          </div>
          <div className="flex items-center gap-2 bg-paper-200 border border-ink/20 rounded-pill px-3 py-2">
            <Calendar className="w-4 h-4 text-ink-muted" />
            <input
              type="date"
              className="bg-transparent text-sm text-ink focus:outline-none w-32 [color-scheme:light]"
              value={filters.date}
              onChange={(e) => { setFilters({ ...filters, date: e.target.value }); setPage(1); }}
            />
          </div>
          {(filters.type || filters.category || filters.date) && (
            <button onClick={() => setFilters({ type: '', category: '', date: '' })} className="btn-ghost py-2 px-3 text-accent-red">
              <RotateCcw className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {(user.role === 'admin' || user.role === 'analyst') && (
            <button onClick={handleExport} className="btn-secondary py-2 px-4 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-accent-green" /> Export CSV
            </button>
          )}
          {user.role === 'admin' && selectedIds.length > 0 && (
            <button onClick={() => setDeleteConfirm({ show: true, id: null, isBulk: true })} className="btn-danger py-2 px-4 text-sm">
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
            </button>
          )}
          {user.role === 'admin' && (
            <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-4 text-sm">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          )}
        </div>
      </div>

      {error && <div className="card p-4 text-accent-red font-medium text-sm border-accent-red">{error}</div>}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-paper">
            <thead>
              <tr>
                {user.role === 'admin' && (
                  <th className="text-left w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-ink/30 cursor-pointer"
                      checked={records.length > 0 && selectedIds.length === records.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th className="text-left">Date</th>
                <th className="text-left">Category</th>
                <th className="text-left">Type</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Created By</th>
                {user.role === 'admin' && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className={selectedIds.includes(record._id) ? 'bg-paper-300/50' : ''}>
                  {user.role === 'admin' && (
                    <td>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-ink/30 cursor-pointer"
                        checked={selectedIds.includes(record._id)}
                        onChange={() => handleSelect(record._id)}
                      />
                    </td>
                  )}
                  <td className="text-ink-muted">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="font-semibold text-ink">{record.category}</td>
                  <td>
                    <span className={record.type === 'income' ? 'badge-income' : 'badge-expense'}>
                      {record.type}
                    </span>
                  </td>
                  <td className={`font-bold font-mono ${record.type === 'income' ? 'text-accent-green' : 'text-accent-red'}`}>
                    {record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}
                  </td>
                  <td className="text-ink-muted text-sm">{record.createdBy?.name || 'Unknown'}</td>
                  {user.role === 'admin' && (
                    <td className="text-right">
                      <button
                        onClick={() => setDeleteConfirm({ show: true, id: record._id, isBulk: false })}
                        className="p-2 text-ink-muted hover:text-accent-red transition-colors rounded-lg hover:bg-[#b5291c]/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-8 text-center text-ink-muted text-sm">Loading records...</div>
        )}
        {!loading && records.length === 0 && (
          <div className="p-16 text-center">
            <Search className="w-10 h-10 text-ink-faint mx-auto mb-4" />
            <p className="font-bold text-ink">No records found</p>
            <p className="text-ink-muted text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-ink/10 bg-paper-200/50">
          <p className="text-sm text-ink-muted">
            Showing <span className="font-bold text-ink">{records.length}</span> of <span className="font-bold text-ink">{total}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg border border-ink/20 hover:bg-paper-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-ink" />
            </button>
            <span className="text-sm font-bold text-ink px-2">{page} / {totalPages || 1}</span>
            <button
              disabled={page * limit >= total}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg border border-ink/20 hover:bg-paper-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-ink" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-sm w-full max-w-md p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-ink lowercase">add financial record</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-ink-muted hover:text-ink rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="space-y-1.5">
                <label className="label-xs">Amount ($)</label>
                <div className="relative">
                  <Calculator className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                  <input
                    type="number" step="0.01" className="input-paper pl-10" placeholder="0.00"
                    value={newRecord.amount} onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })} required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="label-xs">Type</label>
                  <select className="input-paper appearance-none" value={newRecord.type} onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="label-xs">Date</label>
                  <input type="date" className="input-paper [color-scheme:light]" value={newRecord.date} onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="label-xs">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                  <input
                    type="text" className="input-paper pl-10" placeholder="e.g. Rent, Salary, Food"
                    value={newRecord.category} onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })} required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="label-xs">Note (Optional)</label>
                <textarea
                  className="input-paper resize-none" rows="2"
                  value={newRecord.note} onChange={(e) => setNewRecord({ ...newRecord, note: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-3">Cancel</button>
                <button type="submit" className="btn-primary flex-1 py-3">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="card-sm w-full max-w-sm p-8 animate-scale-in text-center">
            <div className="w-14 h-14 bg-[#b5291c]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#b5291c]/20">
              <AlertTriangle className="w-7 h-7 text-accent-red" />
            </div>
            <h3 className="text-xl font-black text-ink mb-2">
              {deleteConfirm.isBulk ? `Delete ${selectedIds.length} records?` : 'Delete this record?'}
            </h3>
            <p className="text-ink-muted text-sm mb-7">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ show: false, id: null, isBulk: false })} className="btn-secondary flex-1 py-3">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn-danger flex-1 py-3">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
