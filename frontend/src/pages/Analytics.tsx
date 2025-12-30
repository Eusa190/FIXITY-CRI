import { useEffect, useState } from 'react';
import { useAuth, isAuthority } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler // for area charts
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { analyticsApi } from '../services/api';
import { TrendingUp, RefreshCcw } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

function WidgetCard({ title, children, className = "", subtitle }: { title: string, subtitle?: string, children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-white rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-neutral-100 flex flex-col ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-bold text-neutral-800">{title}</h3>
                    {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
                {children}
            </div>
        </div>
    );
}

function KpiCard({ title, value, subtext, color, tooltip }: { title: string, value: string | number, subtext: string, color: string, tooltip: string }) {
    return (
        <div className="group relative bg-white rounded-xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">{title}</h4>
            <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
            <div className="text-xs text-neutral-500 font-medium">{subtext}</div>

            {/* Tooltip on hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-neutral-900 text-white text-[10px] px-2 py-1 rounded">
                    {tooltip}
                </div>
            </div>
        </div>
    );
}

export default function Analytics() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        setIsRefreshing(true);
        try {
            const res = await analyticsApi.getAnalytics();
            setData(res);
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (user && !isAuthority(user)) navigate('/profile');

        if (user && isAuthority(user)) {
            fetchData();
            // Auto-refresh every 5 seconds
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, [user, navigate]);

    if (loading) return <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center font-sans font-bold text-neutral-300 tracking-widest text-sm">LOADING CONTROL ROOM...</div>;

    if (!data) return <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">No Data Available</div>;

    // --- CHART CONFIGS ---
    const PILLAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1']; // Blue, Green, Orange, Indigo

    // 1. Trend Chart
    const trendConfig = {
        labels: data.trend.labels,
        datasets: [{
            label: 'System Risk (CRI)',
            data: data.trend.values,
            borderColor: '#DC2626',
            backgroundColor: 'rgba(220, 38, 38, 0.05)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#FFF',
            pointBorderColor: '#DC2626',
            pointBorderWidth: 2
        }]
    };

    const trendOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10, family: 'sans-serif' } } },
            x: { grid: { display: false }, ticks: { font: { size: 10, family: 'sans-serif' } } }
        }
    };

    // 2. Pillars Breakdown (Doughnut)
    const pillarLabels = data.pillars.map((p: any) => p.name);
    const pillarValues = data.pillars.map((p: any) => p.risk);

    const pillarConfig = {
        labels: pillarLabels,
        datasets: [{
            data: pillarValues,
            backgroundColor: PILLAR_COLORS,
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const pillarOptions = {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: { position: 'right' as const, labels: { boxWidth: 10, usePointStyle: true, font: { size: 11 } } }
        }
    };

    // 3. Distribution (Bar)
    const distLabels = Object.keys(data.distribution);
    const distValues = Object.values(data.distribution);

    const distConfig = {
        labels: distLabels,
        datasets: [{
            label: 'Issues',
            data: distValues,
            backgroundColor: '#111827',
            borderRadius: 4,
            barThickness: 20
        }]
    };

    const distOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
    };

    // --- RENDER HELPERS ---
    const getCRILabel = (score: number) => {
        if (score > 80) return { text: "CRITICAL", color: "text-[#DC2626]" };
        if (score > 50) return { text: "MODERATE", color: "text-[#F59E0B]" };
        return { text: "STABLE", color: "text-[#10B981]" };
    };

    const criStatus = getCRILabel(data.summary.cri_score);

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 pb-20">
            {/* TOP ACTIONS BAR (Hidden for clean view or kept minimal) */}
            <header className="bg-white border-b border-neutral-200 px-8 py-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">Operational Control Room</h1>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time risk monitoring & department accountability</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors uppercase tracking-wide">
                        Export Report
                    </button>
                    <button
                        onClick={() => fetchData()}
                        disabled={isRefreshing}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors uppercase tracking-wide flex items-center gap-2 disabled:opacity-70"
                    >
                        <RefreshCcw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Live Refresh'}
                    </button>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">

                {/* 1. TOP SUMMARY (The "Oh No" Row) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <KpiCard
                        title="Current CRI Score"
                        value={data.summary.cri_score}
                        subtext={criStatus.text}
                        color={criStatus.color}
                        tooltip="Scale: 0-100. Aggregated risk based on unresolved civic issues"
                    />
                    <KpiCard
                        title="High-Risk Issues"
                        value={data.summary.high_risk_count}
                        subtext="Requiring immediate intervention"
                        color="text-[#111827]"
                        tooltip="Issues exceeding risk threshold of 70"
                    />
                    <KpiCard
                        title="Avg Resolution Time"
                        value={data.summary.avg_res_time}
                        subtext="Department efficiency metric"
                        color="text-[#111827]"
                        tooltip="Average time from reporting to verified resolution"
                    />
                    <KpiCard
                        title="Repeat Complaint Rate"
                        value={data.summary.repeat_rate}
                        subtext="Ineffective resolution signal"
                        color="text-[#F59E0B]"
                        tooltip="Percentage of issues reported multiple times"
                    />
                </div>

                {/* 2. RISK BREAKDOWN & TREND (The Heart) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
                    {/* Pillars Donut */}
                    <WidgetCard title="Risk Composition" subtitle="Contribution by primary risk pillars" className="col-span-1">
                        <div className="h-[250px] flex items-center justify-center relative">
                            <Doughnut data={pillarConfig} options={pillarOptions} />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-slate-200 opacity-20">CRI</span>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-xs text-neutral-500 italic">"Public Health contributes 34% due to unresolved waste."</p>
                        </div>
                    </WidgetCard>

                    {/* Trend Line */}
                    <WidgetCard title="7-Day Risk Trajectory" subtitle="Impact of inaction vs. resolution" className="col-span-2">
                        <div className="w-full h-full p-2">
                            <Line data={trendConfig} options={trendOptions} />
                        </div>
                        <div className="mt-2 text-right">
                            <span className="text-xs font-bold text-[#DC2626] flex items-center justify-end gap-1">
                                <TrendingUp className="w-3 h-3" /> Risk Accumulating
                            </span>
                        </div>
                    </WidgetCard>
                </div>

                {/* 3. HOTSPOTS & DISTRIBUTION (The "Don't Look At Me") */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hotspot Table */}
                    <WidgetCard title="Top Risk Locations" subtitle="Localized intervention priorities" className="col-span-2">
                        <div className="overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-neutral-400 uppercase bg-neutral-50/50 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Area / Block</th>
                                        <th className="px-4 py-3 font-semibold text-right">CRI Score</th>
                                        <th className="px-4 py-3 font-semibold">Dominant Risk</th>
                                        <th className="px-4 py-3 font-semibold text-right">Duration</th>
                                        <th className="px-4 py-3 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {data.hotspots.map((spot: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-neutral-50 transition-colors group cursor-pointer">
                                            <td className="px-4 py-3 font-medium text-slate-900">{spot.area}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${spot.cri > 70 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {spot.cri}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{spot.dominant_risk}</td>
                                            <td className="px-4 py-3 text-right text-xs font-mono text-neutral-400">
                                                {spot.duration || '0h'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                                                    Deploy
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </WidgetCard>

                    {/* Category Dist */}
                    <WidgetCard title="Issue Load by Category" subtitle="Volume by technical category" className="col-span-1">
                        <div className="flex-1 min-h-[200px] flex items-end pb-4">
                            <Bar data={distConfig} options={distOptions} />
                        </div>
                    </WidgetCard>
                </div>

            </main>
        </div>
    );
}
