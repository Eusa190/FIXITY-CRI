
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, isUser } from '../context/AuthContext';
import { issueApi } from '../services/api';
import type { Issue } from '../types';
import { Activity, Map as MapIcon, ArrowRight, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


// --- BENTO GRID COMPONENTS ---

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: string;
    delay?: number;
}

function BentoCard({ children, className = "", colSpan = "col-span-1", delay = 0 }: BentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-white rounded-[24px] p-8 shadow-sm border border-neutral-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${colSpan} ${className}`}
        >
            {children}
        </motion.div>
    );
}

function StatLabel({ label, color = "text-neutral-500" }: { label: string, color?: string }) {
    return <h3 className={`text-[10px] font-bold ${color} uppercase tracking-widest mb-2 opacity-80 flex items-center gap-2`}>{label}</h3>;
}

function StatusChip({ status }: { status: string }) {
    const styles = {
        'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
        'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Critical': 'bg-red-50 text-red-700 border-red-100'
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles[status as keyof typeof styles] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {status}
        </span>
    );
}

// --- MAIN DASHBOARD ---

export default function Profile() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { navigate('/login'); return; }
        if (user && !isUser(user)) { navigate('/authority/dashboard'); return; }

        const fetchIssues = async () => {
            try {
                const data = await issueApi.getMyIssues();
                setIssues(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        if (user) fetchIssues();
    }, [user, authLoading, navigate]);

    if (authLoading || loading) return <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center font-sans text-xs font-semibold tracking-widest text-neutral-400">LOADING CONTROL PANEL...</div>;

    // Derived State
    const resolvedCount = issues.filter(i => i.status === 'Resolved').length;
    const criticalCount = issues.filter(i => (i.severity_score || 0) > 70).length;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">

            {/* 12-COLUMN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">

                {/* --- ROW 1: IDENTITY & ACTION --- */}

                {/* TILE 1: Credibility Score (3 cols) */}
                <BentoCard colSpan="col-span-12 md:col-span-3" delay={0.1}>
                    <div>
                        <StatLabel label="Reporter Credibility" />
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-7xl font-bold tracking-tighter text-[#111111]">85</span>
                            <span className="text-xl font-medium text-neutral-300">/100</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-1.5 flex-1 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs font-medium text-neutral-500">
                            Top 10% Contributor
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-100 text-[10px] text-neutral-400 leading-relaxed">
                        Based on verification accuracy, frequency, and evidence quality.
                    </div>
                </BentoCard>

                {/* TILE 2: Log New Issue (6 cols) - DOMINANT */}
                < BentoCard colSpan="col-span-12 md:col-span-6" className="!bg-[#111111] !border-[#111111] text-white relative overflow-hidden group" delay={0.2} >
                    {/* Subtle background glow */}
                    < div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none transition-opacity group-hover:opacity-20" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-white/5 px-3 py-1 rounded-full">Primary Action</span>
                        </div>

                        <div className="mt-8 mb-8 max-w-md">
                            <h2 className="text-3xl font-bold tracking-tight mb-3">Log New Issue</h2>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Report civic hazards directly to the index. Your submission adds pressure to the public record and compels authority action.
                            </p>
                        </div>

                        <Link to="/report" className="w-full bg-white text-[#111111] h-14 rounded-xl flex items-center justify-center font-bold text-sm tracking-wide hover:bg-neutral-100 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/20">
                            INITIATE REPORT <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </BentoCard >

                {/* TILE 3: Local CRI Snapshot (3 cols) */}
                < BentoCard colSpan="col-span-12 md:col-span-3" delay={0.3} >
                    <div>
                        <StatLabel label="Local CRI Snapshot" />
                        <div className="flex flex-col mt-4">
                            <div className="text-7xl font-bold tracking-tighter text-[#F59E0B]">73</div>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="px-2.5 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded-md text-[10px] font-bold uppercase tracking-wide">Elevated Risk</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-100">
                        <div className="flex items-center gap-2 text-neutral-600">
                            <MapIcon className="w-4 h-4 text-neutral-400" />
                            <span className="text-xs font-bold uppercase tracking-wide">Pune District</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-2">+6 points this week due to monsoon damage reports</p>
                    </div>
                </BentoCard >

                {/* --- ROW 2: HISTORY & PROOF --- */}

                {/* TILE 4: Lifetime Impact (5 cols) */}
                <BentoCard colSpan="col-span-12 md:col-span-5" delay={0.4}>
                    <StatLabel label="Lifetime Impact" />
                    <div className="grid grid-cols-2 gap-8 mt-6">
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="flex items-center gap-2 text-neutral-400 mb-2">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Total Reported</span>
                            </div>
                            <div className="text-3xl font-bold text-[#111111]">{issues.length}</div>
                        </div>
                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                            <div className="flex items-center gap-2 text-emerald-600/70 mb-2">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Resolved</span>
                            </div>
                            <div className="text-3xl font-bold text-[#16A34A]">{resolvedCount}</div>
                        </div>
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="flex items-center gap-2 text-neutral-400 mb-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Avg Response</span>
                            </div>
                            <div className="text-3xl font-bold text-[#111111]">1.2<span className="text-lg text-neutral-400">d</span></div>
                        </div>
                        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                            <div className="flex items-center gap-2 text-red-400 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Critical</span>
                            </div>
                            <div className="text-3xl font-bold text-[#DC2626]">{criticalCount}</div>
                        </div>
                    </div>
                </BentoCard>

                {/* TILE 5: Evidence Log (7 cols) */}
                <BentoCard colSpan="col-span-12 md:col-span-7" className="!p-0 overflow-hidden flex flex-col" delay={0.5}>
                    <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/30">
                        <StatLabel label="Evidence Log" />
                        <span className="text-[10px] bg-white border border-neutral-200 px-2.5 py-1 rounded-md text-neutral-400 font-mono tracking-wider">IMMUTABLE LEDGER</span>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-neutral-100">
                                <tr>
                                    <th className="py-4 px-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Location</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Category</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {issues.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-xs text-neutral-400 italic">
                                            No records found in public ledger.
                                        </td>
                                    </tr>
                                ) : (
                                    issues.slice(0, 5).map((issue) => (
                                        <tr key={issue.id} className="group hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-4 px-6 text-xs text-neutral-500 font-medium group-hover:text-neutral-900">
                                                {new Date(issue.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-6 text-xs font-semibold text-[#111111]">{issue.block}</td>
                                            <td className="py-4 px-6 text-xs text-neutral-500 max-w-[200px] truncate">{issue.title}</td>
                                            <td className="py-4 px-6 text-right">
                                                <StatusChip status={issue.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-center hover:bg-neutral-100 transition-colors cursor-pointer">
                        <Link to="#" className="text-xs font-bold text-neutral-500 uppercase tracking-wide group-hover:text-[#111111] flex items-center justify-center gap-2">
                            View Full Audit Log <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </BentoCard>

                {/* --- ROW 3: INTELLIGENCE --- */}

                {/* TILE 6: Live Risk Map (12 cols) */}
                <BentoCard colSpan="col-span-12" className="!p-0 overflow-hidden relative h-[350px] bg-neutral-100 border-none" delay={0.6}>
                    {/* Map Background (Styled) */}
                    <div className="absolute inset-0 z-0 opacity-80 mix-blend-multiply transition-all duration-700 hover:opacity-100 hover:scale-[1.02]">
                        <MapContainer
                            center={[20.2961, 85.8245]}
                            zoom={12}
                            zoomControl={false}
                            dragging={false}
                            scrollWheelZoom={false}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                className="grayscale contrast-125"
                            />
                        </MapContainer>
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none bg-gradient-to-t from-white/80 via-transparent to-transparent">
                        <div className="bg-white/95 backdrop-blur-md p-8 rounded-[2rem] border border-white/50 shadow-2xl text-center max-w-lg pointer-events-auto transform transition-transform hover:-translate-y-1">
                            <h2 className="text-xl font-bold text-[#111111] mb-3 tracking-tight">LIVE CIVIC RISK MAP</h2>
                            <p className="text-sm text-neutral-500 mb-8 leading-relaxed max-w-sm mx-auto">
                                Real-time geospatial visualization of unresolved issues weighted by severity and duration.
                            </p>
                            <Link to="/map" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl">
                                EXPLORE DATA <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </BentoCard>

            </div >
        </div >
    );
}
