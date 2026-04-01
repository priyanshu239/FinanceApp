import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Activity, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendType, setTrendType] = useState('monthly'); // 'monthly' or 'weekly'

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-red-400 text-center">{error}</div>;
  if (!summary) return null;

  const { totals, categoryTotals, monthlyTrends, weeklyTrends } = summary;
  
  const currentTrends = trendType === 'monthly' ? monthlyTrends : weeklyTrends;
  const trendData = currentTrends.map(t => ({
    ...t,
    label: trendType === 'monthly' ? `Month ${t.month}` : `Week ${t.week}`
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Income" 
          value={totals.totalIncome} 
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-emerald-400"
          bg="bg-emerald-900/20"
        />
        <StatCard 
          title="Total Expenses" 
          value={totals.totalExpense} 
          icon={<TrendingDown className="w-6 h-6" />}
          color="text-rose-400"
          bg="bg-rose-900/20"
        />
        <StatCard 
          title="Net Balance" 
          value={totals.netBalance} 
          icon={<Wallet className="w-6 h-6" />}
          color="text-primary-400"
          bg="bg-primary-900/20"
        />
      </div>

      {(user.role === 'admin' || user.role === 'analyst' || user.role === 'viewer') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trends Analyzer */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary-400" />
                Trend Analysis
              </h2>
              <div className="flex bg-gray-900/50 p-1 rounded-lg border border-gray-700">
                <button 
                  onClick={() => setTrendType('monthly')}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${
                    trendType === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setTrendType('weekly')}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${
                    trendType === 'weekly' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#0ea5e9' }}
                    cursor={{ fill: '#374151', opacity: 0.2 }}
                  />
                  <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#f43f5e" name="Expense" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold mb-8">Expense Distribution</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryTotals.filter(c => c.type === 'expense')}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="total"
                    nameKey="category"
                    strokeWidth={0}
                  >
                    {categoryTotals.filter(c => c.type === 'expense').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {user.role === 'admin' && (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" />
              Recent Activity
            </h2>
            <span className="text-xs bg-gray-900 px-3 py-1 rounded-full text-gray-400 font-medium">Administrator View</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {summary.recentActivities?.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-200">
                      {activity.createdBy?.name || 'Deleted User'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{activity.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        activity.type === 'income' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'
                      }`}>
                        {activity.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${
                      activity.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {activity.type === 'income' ? '+' : '-'}${activity.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {summary.recentActivities?.length === 0 && (
            <div className="p-12 text-center text-gray-500 italic">No recent activity detected.</div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight">${value?.toLocaleString() || 0}</h3>
      </div>
      <div className={`${bg} ${color} p-4 rounded-xl shadow-inner`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
