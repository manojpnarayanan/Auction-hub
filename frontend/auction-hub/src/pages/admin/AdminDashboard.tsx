import { useState,useEffect } from "react";
import { getDashboardStats } from "../../api/Admin/adminDashboard";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from 'recharts';
type Period = "daily"|"monthly"|"yearly";

interface getDashboardStats{
    totalRevenue:number;
    auctionSuccessRate:number;
    inventory:{pending:number,approved:number,active:number};
    totalUsers:number;
    revenueTimeline:{label:string;amount:number}[];
    userGrowthTimeline:{label:string;count:number}[];
}

    export default function AdminDashboard(){
        const [period,setPeriod]=useState<Period>('monthly');
        const [stats,setStats]=useState<getDashboardStats | null>(null);
        const [loading,setLoading]=useState(true);
        useEffect(()=>{
            setLoading(true);
            getDashboardStats(period)
            .then(setStats)
            .finally(()=>setLoading(false))
        },[period]);
        const periods:Period[]=['daily','monthly','yearly'];

         return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 mt-1">Live platform overview</p>
                </div>
                {/* Period Filter */}
                <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                    {periods.map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                                period === p
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
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
                    {/* <div className="bg-slate-800 rounded-2xl p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-slate-200">Revenue Over Time</h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={stats.revenueTimeline}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#revenueGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div> */}
                    {/* Revenue Chart */}
{/* Revenue Chart */}
<div className="bg-slate-800 rounded-2xl p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4 text-slate-200">Revenue Over Time</h2>
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
                        <h2 className="text-lg font-semibold mb-4 text-slate-200">User Growth</h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={stats.userGrowthTimeline}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
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