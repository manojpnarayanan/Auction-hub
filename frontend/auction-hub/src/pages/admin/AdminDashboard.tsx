import { useState, useEffect } from "react";
import { getDashboardStats, getDashboardStatsByRange } from "../../api/Admin/adminDashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from "react-hot-toast";

type Period = "daily" | "monthly" | "yearly" | "custom";

interface DashboardStatsData {
    totalRevenue: number;
    auctionSuccessRate: number;
    inventory: { pending: number; approved: number; active: number };
    totalUsers: number;
    revenueTimeline: { label: string; amount: number }[];
    userGrowthTimeline: { label: string; count: number }[];
}

export default function AdminDashboard() {
    const [period, setPeriod] = useState<Period>('monthly');
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const [loading, setLoading] = useState(true);

    // Custom date range state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateError, setDateError] = useState('');

    const presetPeriods: { key: Period; label: string }[] = [
        { key: 'daily', label: 'Daily' },
        { key: 'monthly', label: 'Monthly' },
        { key: 'yearly', label: 'Yearly' },
        { key: 'custom', label: '📅 Custom' },
    ];

    // Fetch when preset period changes (not for custom — waits for Apply)
    useEffect(() => {
        if (period === 'custom') return;
        setLoading(true);
        getDashboardStats(period)
            .then((data)=> setStats(data))
            .catch(() => toast.error('Failed to load dashboard stats'))
            .finally(() => setLoading(false));
    }, [period]);

    const handleApplyCustomRange = () => {
        setDateError('');
        if (!startDate || !endDate) {
            setDateError('Please select both start and end dates.');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setDateError('Start date must be before end date.');
            return;
        }
        setLoading(true);
        getDashboardStatsByRange(startDate, endDate)
            .then(setStats)
            .catch(() => toast.error('Failed to load stats for selected range'))
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 mt-1">Live platform overview</p>
                </div>

                {/* Period Filter + Custom Date Range */}
                <div className="flex flex-col items-end gap-3">
                    {/* Preset button group */}
                    <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                        {presetPeriods.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => { setPeriod(key); setDateError(''); }}
                                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                                    period === key
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Custom date inputs — revealed only when Custom is selected */}
                    {period === 'custom' && (
                        <div className="flex flex-col gap-2 bg-slate-800 border border-slate-700 rounded-xl p-4 w-full sm:w-auto">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                                Select Date Range
                            </p>
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-slate-500">From</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        max={endDate || undefined}
                                        onChange={(e) => { setStartDate(e.target.value); setDateError(''); }}
                                        className="bg-slate-900 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-slate-500">To</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate || undefined}
                                        onChange={(e) => { setEndDate(e.target.value); setDateError(''); }}
                                        className="bg-slate-900 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                    />
                                </div>
                                <button
                                    onClick={handleApplyCustomRange}
                                    disabled={!startDate || !endDate || loading}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    {loading ? 'Loading…' : 'Apply'}
                                </button>
                            </div>
                            {dateError && <p className="text-xs text-red-400 mt-1">{dateError}</p>}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : stats ? (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <KPICard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="💰" color="indigo" />
                        <KPICard title="Success Rate" value={`${stats.auctionSuccessRate}%`} icon="📈" color="emerald" />
                        <KPICard title="Inventory" value={`${stats.inventory.pending} Pending`} sub={`${stats.inventory.active} Active · ${stats.inventory.approved} Approved`} icon="📦" color="amber" />
                        <KPICard title="Total Users" value={stats.totalUsers.toString()} icon="👥" color="violet" />
                    </div>

                    {/* Revenue Chart */}
                    <div className="bg-slate-800 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-200">Revenue Over Time</h2>
                            {period === 'custom' && startDate && endDate && (
                                <span className="text-xs text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
                                    {startDate} → {endDate}
                                </span>
                            )}
                        </div>
                        {stats.revenueTimeline.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-52 text-slate-500">
                                <span className="text-4xl mb-3">📊</span>
                                <p className="text-sm">No revenue data for this period</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={stats.revenueTimeline}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                                    />
                                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* User Growth Chart */}
                    <div className="bg-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-200">User Growth</h2>
                            {period === 'custom' && startDate && endDate && (
                                <span className="text-xs text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
                                    {startDate} → {endDate}
                                </span>
                            )}
                        </div>
                        {stats.userGrowthTimeline.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-52 text-slate-500">
                                <span className="text-4xl mb-3">👥</span>
                                <p className="text-sm">No user registrations in this period</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={stats.userGrowthTimeline}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-slate-400">Failed to load stats.</p>
            )}
        </div>
    );
}

function KPICard({ title, value, icon, color, sub }: {
    title: string; value: string; icon: string; color: string; sub?: string;
}) {
    const colors: Record<string, string> = {
        indigo: 'from-indigo-600/20 to-indigo-600/5 border-indigo-500/30',
        emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/30',
        amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/30',
        violet: 'from-violet-600/20 to-violet-600/5 border-violet-500/30',
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5`}>
            <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-slate-400">{title}</span>
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
}