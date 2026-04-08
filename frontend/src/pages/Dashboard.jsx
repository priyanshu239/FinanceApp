import { useState, useEffect } from 'react';
import api from '../utils/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Activity, CalendarDays, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Paper-friendly chart colors — muted, no bright saturated hues
const CHART_COLORS = ['#2d6a4f', '#b5291c', '#926015', '#5c5040', '#7a7368', '#3a3128'];

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendType, setTrendType] = useState('monthly');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/api/dashboard/summary');
        setSummary(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
        <p className="text-ink-muted text-sm font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="card p-8 text-center max-w-md mx-auto mt-12">
      <p className="text-accent-red font-bold">{error}</p>
    </div>
  );
  if (!summary) return null;

  const { totals, categoryTotals, monthlyTrends, weeklyTrends } = summary;
  const currentTrends = trendType === 'monthly' ? monthlyTrends : weeklyTrends;
  const trendData = currentTrends.map(t => ({
    ...t,
    label: trendType === 'monthly' ? `M${t.month}` : `W${t.week}`
  }));

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Income"
          value={totals.totalIncome}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-accent-green"
          positive
        />
        <StatCard
          label="Total Expenses"
          value={totals.totalExpense}
          icon={<TrendingDown className="w-5 h-5" />}
          color="text-accent-red"
        />
        <StatCard
          label="Net Balance"
          value={totals.netBalance}
          icon={<Wallet className="w-5 h-5" />}
          color={totals.netBalance >= 0 ? 'text-accent-green' : 'text-accent-red'}
          positive={totals.netBalance >= 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-ink-muted" />
              <h2 className="font-black text-ink text-lg lowercase">trend analysis</h2>
            </div>
            <div className="flex items-center gap-1 border border-ink/20 rounded-pill p-1">
              {['monthly', 'weekly'].map(t => (
                <button
                  key={t}
                  onClick={() => setTrendType(t)}
                  className={`px-4 py-1 rounded-pill text-xs font-bold uppercase tracking-wider transition-all
                    ${trendType === t ? 'bg-ink text-paper-100' : 'text-ink-muted hover:text-ink'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,14,11,0.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#7a7368' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#7a7368' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#f5f2ea', border: '1px solid #0f0e0b', borderRadius: 12, boxShadow: '3px 3px 0 rgba(15,14,11,0.12)' }}
                  labelStyle={{ color: '#0f0e0b', fontWeight: 700 }}
                />
                <Bar dataKey="income" fill="#2d6a4f" name="Income" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" fill="#b5291c" name="Expense" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="card p-6">
          <h2 className="font-black text-ink text-lg lowercase mb-6">expense distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals.filter(c => c.type === 'expense')}
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="category"
                  strokeWidth={0}
                >
                  {categoryTotals.filter(c => c.type === 'expense').map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#f5f2ea', border: '1px solid #0f0e0b', borderRadius: 12, boxShadow: '3px 3px 0 rgba(15,14,11,0.12)' }}
                  formatter={(val) => [`$${val.toLocaleString()}`, '']}
                />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#3a3630', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity — Admin only */}
      {user.role === 'admin' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-ink-muted" />
              <h2 className="font-black text-ink lowercase">recent activity</h2>
            </div>
            <span className="label-xs px-3 py-1 bg-paper-300 rounded-pill border border-ink/10">
              administrator view
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-paper">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">User</th>
                  <th className="text-left">Category</th>
                  <th className="text-left">Type</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentActivities.data?.map((activity) => (
                  <tr key={activity._id}>
                    <td className="text-ink-muted">{new Date(activity.date).toLocaleDateString()}</td>
                    <td className="font-semibold text-ink">{activity.createdBy?.name || 'Deleted User'}</td>
                    <td className="text-ink-muted">{activity.category}</td>
                    <td>
                      <span className={activity.type === 'income' ? 'badge-income' : 'badge-expense'}>
                        {activity.type}
                      </span>
                    </td>
                    <td className={`text-right font-bold font-mono ${activity.type === 'income' ? 'text-accent-green' : 'text-accent-red'}`}>
                      {activity.type === 'income' ? '+' : '-'}${activity.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {summary.recentActivities.data?.length === 0 && (
            <div className="p-12 text-center text-ink-muted italic text-sm">No recent activity detected.</div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, positive }) => (
  <div className="stat-card flex items-center justify-between">
    <div>
      <p className="label-xs mb-2">{label}</p>
      <p className={`text-3xl font-black font-mono ${color}`}>
        ${Math.abs(value || 0).toLocaleString()}
      </p>
    </div>
    <div className={`p-3 rounded-xl border border-ink/10 bg-white/50 ${color}`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
