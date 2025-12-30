import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, isAuthority } from '../context/AuthContext';
import { issueApi } from '../services/api';
import type { Issue } from '../types';

import {
    Activity,
    LayoutList,
    AlertOctagon,
    Clock,
    Shield
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// unused cn removed

// --- ASSETS ---
const authorityIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #DC2626; width: 10px; height: 10px; border: 1px solid white; box-shadow: 0 0 0 1px #DC2626;"></div>`,
    iconSize: [12, 12]
});

// --- BENTO GRID COMPONENTS ---

function BentoCard({ children, className = "", colSpan = "col-span-1" }: { children: React.ReactNode, className?: string, colSpan?: string }) {
    return (
        <div className={`bg-white rounded-[14px] p-6 shadow-sm border border-neutral-100 flex flex-col justify-between ${colSpan} ${className}`}>
            {children}
        </div>
    );
}

function StatLabel({ label }: { label: string }) {
    return <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1 opacity-80">{label}</h3>;
}

function StatusChip({ status }: { status: string }) {
    const colors = {
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
        'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Critical': 'bg-red-50 text-red-600 border-red-100'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${colors[status as keyof typeof colors] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}

export default function AuthorityDashboard() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [resolveNote, setResolveNote] = useState('');
    const [showResolve, setShowResolve] = useState(false);

    // Reset modal state when issue opens/closes
    useEffect(() => {
        if (!selectedIssue) {
            setResolveNote('');
            setShowResolve(false);
        }
    }, [selectedIssue]);

    const DEPARTMENTS = ['Road Maintenance', 'Sanitation Dept', 'Electrical Division', 'Water Supply', 'Civil Works'];

    const handleAssign = (dept: string) => {
        if (!selectedIssue) return;
        console.log("Assigning to department:", dept);
        // In real app, we'd save the department. For now, we update status to In Progress.
        handleUpdateStatus(selectedIssue.id, 'In Progress');
        // Ideally show a toast: "Assigned to {dept}"
    };

    const handleConfirmResolve = () => {
        if (!selectedIssue || !resolveNote.trim()) {
            alert("Resolution note is required.");
            return;
        }
        // In real app, send the note.
        handleUpdateStatus(selectedIssue.id, 'Resolved');
        setSelectedIssue(null);
    };

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user && !isAuthority(user)) {
            navigate('/profile');
            return;
        }

        const fetchData = async () => {
            try {
                const data = await issueApi.getAuthorityIssues();
                setIssues(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user && isAuthority(user)) {
            fetchData(); // Initial fetch
            const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

            return () => clearInterval(intervalId); // Cleanup on unmount
        }
    }, [user, authLoading, navigate]);

    const handleUpdateStatus = async (issueId: number, newStatus: string) => {
        try {
            const response = await issueApi.updateStatus(issueId, newStatus);
            if (response.success) {
                setIssues(issues.map(i => i.id === issueId ? { ...i, status: newStatus as Issue['status'] } : i));
                if (selectedIssue?.id === issueId) setSelectedIssue(null);
            }
        } catch (e) { console.error(e); }
    };

    if (authLoading || loading) return <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center font-sans text-xs font-semibold tracking-widest text-neutral-400">LOADING AUTHORITY CONSOLE...</div>;

    // const authority = user as Authority; // Unused
    const pendingCount = issues.filter(i => i.status === 'Pending').length;
    const criticalCount = issues.filter(i => (i.severity_score || 0) > 70 && i.status !== 'Resolved').length;

    // --- CRI CALCULATION ---
    // Calculate "Zone Risk" based on active issues.
    // For demo purposes: Sum of all issue severities, capped at 100.
    // This ensures that resolving ANY issue immediately drops the score.
    const systemCRI = Math.min(100, Math.round(issues
        .filter(i => i.status !== 'Resolved')
        .reduce((acc, curr) => acc + (curr.severity_score || 0), 0)
    ));

    // Helper function to calculate issue age for time escalation display
    const getIssueAge = (createdAt: string) => {
        const now = new Date();
        const created = new Date(createdAt);
        const hours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
        const minutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

        // Calculate escalation (matching backend: log(hours + 1) * 2)
        const currentEscalation = Math.log(hours + 1) * 2;
        const nextHourEscalation = Math.log(hours + 2) * 2;
        const increase = nextHourEscalation - currentEscalation;
        const minutesRemaining = 60 - (minutes % 60);

        if (hours < 1) return { text: 'Just now', color: 'text-green-600', urgent: false, nextEscalation: `+${increase.toFixed(1)} pts in ${minutesRemaining}m` };
        if (hours < 24) return { text: `${hours}h ago`, color: 'text-amber-600', urgent: hours > 6, nextEscalation: `+${increase.toFixed(1)} pts in ${minutesRemaining}m` };
        const days = Math.floor(hours / 24);
        if (days === 1) return { text: '1 day ago', color: 'text-red-600', urgent: true, nextEscalation: `+${increase.toFixed(1)} pts in ${minutesRemaining}m` };
        return { text: `${days}d ago`, color: 'text-red-700', urgent: true, nextEscalation: `+${increase.toFixed(2)} pts in ${minutesRemaining}m` };
    };

    return (
        <div className="min-h-full font-sans text-[#111111]">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#111111] tracking-tight">Authority Overview</h1>
                        <p className="text-neutral-500 mt-1">Real-time civic risk monitoring and response command center.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200">
                            <Activity className="w-3 h-3" />
                            System Operational
                        </span>
                        <div className="h-8 w-[1px] bg-neutral-200 mx-2" />
                        <span className="text-xs font-mono text-neutral-400">
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Helper function to calculate issue age */}
                {(() => {
                    const getIssueAge = (createdAt: string) => {
                        const now = new Date();
                        const created = new Date(createdAt);
                        const hours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));

                        if (hours < 1) return { text: 'Just now', color: 'text-green-600', urgent: false };
                        if (hours < 24) return { text: `${hours}h ago`, color: 'text-amber-600', urgent: hours > 6 };
                        const days = Math.floor(hours / 24);
                        if (days === 1) return { text: '1 day ago', color: 'text-red-600', urgent: true };
                        return { text: `${days}d ago`, color: 'text-red-700', urgent: true };
                    };
                    return null;
                })()}

                {/* 12-COLUMN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">

                    {/* --- ROW 1: STATUS & PRIORITY --- */}

                    {/* TILE 1: Zone Health (3 cols) */}
                    <BentoCard colSpan="col-span-12 md:col-span-3">
                        <div>
                            <StatLabel label="CRI" />
                            <div className="flex items-end gap-2 mt-4">
                                <span className="text-6xl font-bold tracking-tighter text-[#111111] transition-all duration-500">{systemCRI}</span>
                                <span className="text-xl font-medium text-neutral-300 mb-2">/100</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${systemCRI > 70 ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${systemCRI > 70 ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-wide ${systemCRI > 70 ? 'text-red-700' : 'text-emerald-700'}`}>
                                    {systemCRI > 70 ? 'Critical Condition' : 'Stable Condition'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-neutral-100 w-full">
                            <div className="h-2.5 bg-neutral-200/60 overflow-hidden rounded-full w-full shadow-inner">
                                <div
                                    className={`h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] relative transition-all duration-1000 ease-out ${systemCRI > 70 ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                                    style={{ width: `${systemCRI}%` }}
                                >
                                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/20"></div>
                                </div>
                            </div>

                            {/* Escalation Summary */}
                            {(() => {
                                const activeIssues = issues.filter(i => i.status !== 'Resolved');
                                const urgentIssues = activeIssues.filter(issue => {
                                    const ageInfo = getIssueAge(issue.created_at);
                                    return ageInfo.urgent;
                                });

                                if (urgentIssues.length > 0) {
                                    // Find soonest escalation
                                    let soonestTime = Infinity;
                                    let soonestIncrease = 0;
                                    urgentIssues.forEach(issue => {
                                        const ageInfo = getIssueAge(issue.created_at);
                                        const match = ageInfo.nextEscalation.match(/in (\d+)m/);
                                        if (match) {
                                            const mins = parseInt(match[1]);
                                            if (mins < soonestTime) {
                                                soonestTime = mins;
                                                const increase = parseFloat(ageInfo.nextEscalation.match(/\+(\d+\.?\d*)/)?.[1] || '0');
                                                soonestIncrease = increase;
                                            }
                                        }
                                    });

                                    return (
                                        <div className="mt-3 px-2 py-1.5 bg-red-50/30 rounded flex items-center justify-between text-[9px]">
                                            <span className="font-bold text-red-700 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {urgentIssues.length} escalating
                                            </span>
                                            <span className="font-mono text-red-600">
                                                +{soonestIncrease.toFixed(1)}pts in {soonestTime}m
                                            </span>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </BentoCard>

                    {/* TILE 2: ACTIVE CASE QUEUE (Action Oriented) (6 cols) */}
                    <BentoCard colSpan="col-span-12 md:col-span-6" className="!p-0 overflow-hidden border-2 border-neutral-100 relative max-h-[400px]">
                        <div className="px-5 py-4 border-b border-neutral-100 flex flex-row items-center justify-between bg-neutral-50/80 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <StatLabel label="LIVE QUEUE" />
                                <span className="bg-[#DC2626] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1.5 ring-1 ring-red-500/20">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    {issues.filter(i => i.status !== 'Resolved').length} PENDING
                                </span>
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 text-[9px] uppercase font-bold text-neutral-400 bg-white px-2 py-1 rounded border border-neutral-200">
                                <AlertOctagon className="w-3 h-3 text-[#DC2626]" />
                                High Priority First
                            </div>
                        </div>

                        <div className="overflow-y-auto h-[320px] scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent p-1">
                            {issues.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center text-neutral-400">
                                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
                                        <Shield className="w-6 h-6 text-neutral-300" />
                                    </div>
                                    <span className="text-xs font-medium">All Clear. No active cases.</span>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {issues.filter(i => i.status !== 'Resolved').map(issue => {
                                        const isCritical = (issue.severity_score || 0) > 75;
                                        return (
                                            <div
                                                key={issue.id}
                                                className={`p-4 rounded-lg hover:bg-neutral-50 transition-all duration-200 group cursor-pointer border ${isCritical ? 'border-red-100 bg-red-50/10' : 'border-transparent'}`}
                                                onClick={() => setSelectedIssue(issue)}
                                            >
                                                {/* Top Row: Title & Badges */}
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <h4 className="text-sm font-bold text-[#111111] group-hover:text-[#EA580C] transition-colors leading-tight">{issue.title}</h4>
                                                        </div>
                                                        <div className="text-[10px] text-neutral-500 font-mono flex gap-2 items-center flex-wrap">
                                                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-bold tracking-tight uppercase">{issue.category}</span>
                                                            <span className="text-neutral-300">•</span>
                                                            {(() => {
                                                                const ageInfo = getIssueAge(issue.created_at);
                                                                return (
                                                                    <span className={`font-bold ${ageInfo.color} flex items-center gap-1`}>
                                                                        {ageInfo.urgent && <Clock className="w-3 h-3" />}
                                                                        {ageInfo.text}
                                                                    </span>
                                                                );
                                                            })()}
                                                            <span className="text-neutral-300">•</span>
                                                            <span className="font-medium">{new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex flex-col items-end">
                                                        <div className={`font-mono text-xs font-bold px-2 py-0.5 rounded shadow-sm ${isCritical ? 'bg-[#DC2626] text-white' : 'bg-amber-100 text-[#F59E0B]'}`}>
                                                            {issue.severity_score}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Row */}
                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-100 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <StatusChip status={issue.status} />

                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-[#111111] transition-colors">
                                                        <span>Details</span>
                                                        <Activity className="w-3 h-3" />
                                                    </div>
                                                </div>

                                                {/* Escalation Timer */}
                                                {(() => {
                                                    const ageInfo = getIssueAge(issue.created_at);
                                                    if (!ageInfo.urgent) return null;
                                                    return (
                                                        <div className="mt-2 px-2 py-1.5 bg-red-50/50 rounded border border-red-100 flex items-center gap-2">
                                                            <AlertOctagon className="w-3 h-3 text-red-600" />
                                                            <span className="text-[9px] font-bold text-red-700 tracking-wide">
                                                                NEXT ESCALATION: {ageInfo.nextEscalation}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </BentoCard>

                    {/* TILE 3: Critical Stats (3 cols) */}
                    <BentoCard colSpan="col-span-12 md:col-span-3">
                        <StatLabel label="ATTENTION REQUIRED" />
                        <div className="flex flex-col gap-4 mt-6 h-full justify-center">
                            <div className="flex justify-between items-center p-4 bg-red-50/50 rounded-xl border border-red-100 transition-transform hover:scale-[1.02]">
                                <div>
                                    <div className="text-3xl font-bold text-[#DC2626] font-mono leading-none">{criticalCount}</div>
                                    <div className="text-[9px] uppercase text-red-600/70 font-bold tracking-wider mt-1">Critical</div>
                                </div>
                                <div className="p-2.5 bg-white rounded-lg shadow-sm">
                                    <AlertOctagon className="w-5 h-5 text-[#DC2626]" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-amber-50/50 rounded-xl border border-amber-100 transition-transform hover:scale-[1.02]">
                                <div>
                                    <div className="text-3xl font-bold text-[#F59E0B] font-mono leading-none">{pendingCount}</div>
                                    <div className="text-[9px] uppercase text-amber-600/70 font-bold tracking-wider mt-1">Pending</div>
                                </div>
                                <div className="p-2.5 bg-white rounded-lg shadow-sm">
                                    <Clock className="w-5 h-5 text-[#F59E0B]" />
                                </div>
                            </div>
                        </div>
                    </BentoCard>


                    {/* --- ROW 2: TACTICAL & ACTION --- */}

                    {/* TILE 4: Tactical Map (8 cols) */}
                    <BentoCard colSpan="col-span-12 md:col-span-8" className="!p-0 overflow-hidden relative min-h-[400px] bg-neutral-100 shadow-inner group">
                        <MapContainer
                            center={[20.2961, 85.8245]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                            {issues.map(issue => (
                                <Marker
                                    key={issue.id}
                                    position={[issue.latitude || 0, issue.longitude || 0]}
                                    icon={authorityIcon}
                                    eventHandlers={{ click: () => setSelectedIssue(issue) }}
                                />
                            ))}
                        </MapContainer>
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-2 rounded-lg border border-neutral-200 z-[400] shadow-lg flex items-center gap-2.5 transition-transform group-hover:scale-105">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]"></span>
                            </span>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#111111]">Tactical View</span>
                        </div>
                    </BentoCard>

                    {/* TILE 5: Critical Actions (4 cols) */}
                    <BentoCard colSpan="col-span-12 md:col-span-4">
                        <div className="flex flex-col h-full">
                            <StatLabel label="SYSTEM ACTIONS" />

                            <div className="space-y-3 mt-8">
                                <button className="w-full h-14 bg-[#111111] text-white rounded-lg font-bold text-xs uppercase hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-neutral-900/20 active:scale-[0.98] duration-200 group">
                                    <LayoutList className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                                    <span>View Full Case List</span>
                                </button>
                                <button
                                    onClick={() => alert("Mock: Report generated and sent to Municipal Commissioner.")}
                                    className="w-full h-14 bg-white border border-neutral-200 text-[#111111] rounded-lg font-bold text-xs uppercase hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] duration-200 group"
                                >
                                    <Activity className="w-4 h-4 text-neutral-400 group-hover:text-[#111111] transition-colors" />
                                    <span>Generate Risk Report</span>
                                </button>
                            </div>

                            <div className="mt-auto pt-8 border-t border-neutral-100">
                                <h4 className="text-[10px] font-bold text-neutral-900 mb-4 flex items-center justify-between">
                                    <span>PERFORMANCE METRICS</span>
                                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-[9px] text-neutral-500 font-mono">LAST 24H</span>
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-neutral-500 font-medium">Avg Response Time</span>
                                            <span className="font-mono text-[#DC2626] font-bold">4.2h <span className="text-[10px] opacity-60 ml-0.5">(+0.8)</span></span>
                                        </div>
                                        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-[#111111] w-[70%] h-full rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                                        <div className="text-[10px] text-neutral-500 leading-relaxed">
                                            <span className="font-bold text-neutral-700">Insight:</span> Delay increased due to <span className="text-[#DC2626] font-bold">3 unresolved high-risk cases</span> in Ward 19.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                </div>

                {/* ISSUE DETAIL MODAL (Strict Style) */}
                {selectedIssue && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(17, 17, 17, 0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedIssue(null)}>
                        <div className="bg-white rounded-[14px] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div className="p-6 border-b border-neutral-100 flex justify-between items-start bg-neutral-50">
                                <div>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">INCIDENT ID: {selectedIssue.id}</span>
                                    <h2 className="text-xl font-bold text-[#111111] mt-1 leading-tight">{selectedIssue.title}</h2>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <StatusChip status={selectedIssue.status} />
                                    <button onClick={() => setSelectedIssue(null)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                                        <span className="sr-only">Close</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto flex-1">
                                <div className="w-full bg-neutral-100 relative min-h-[200px] flex items-center justify-center border-b border-neutral-100">
                                    {selectedIssue.image_path ? (
                                        <img
                                            src={`/api/static/uploads/${selectedIssue.image_path}`}
                                            className="w-full h-auto max-h-[400px] object-contain"
                                            alt="Evidence"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                                            <AlertOctagon className="w-8 h-8 mb-2 opacity-20" />
                                            <span className="text-xs font-mono uppercase tracking-widest">No Visual Evidence</span>
                                        </div>
                                    )}
                                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-400">
                                        <AlertOctagon className="w-8 h-8 mb-2 opacity-50 text-red-400" />
                                        <span className="text-xs font-mono uppercase tracking-widest">Image Failed to Load</span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 border-b border-neutral-100 pb-8">
                                        <div>
                                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block mb-1">Location</label>
                                            <div className="text-sm font-bold text-[#111111]">{selectedIssue.block}</div>
                                            <div className="text-[10px] text-neutral-500">{selectedIssue.district}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block mb-1">Severity</label>
                                            <div className="text-sm font-mono font-bold text-[#DC2626] flex items-center gap-1">
                                                {selectedIssue.severity_score || 'N/A'} <span className="text-[10px] text-neutral-400 font-normal">CRI</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block mb-1">Category</label>
                                            <div className="text-sm font-medium text-[#111111]">{selectedIssue.category || 'General'}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block mb-1">Reported</label>
                                            <div className="text-sm font-mono text-neutral-600">
                                                {selectedIssue.created_at ? new Date(selectedIssue.created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block mb-2">Detailed Report</label>
                                        <p className="text-sm text-neutral-700 leading-relaxed max-w-prose">
                                            {selectedIssue.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t border-neutral-100 bg-neutral-50">
                                {showResolve ? (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-200">
                                        <div>
                                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Resolution Evidence & Notes (Required)</label>
                                            <textarea
                                                value={resolveNote}
                                                onChange={(e) => setResolveNote(e.target.value)}
                                                placeholder="Describe action taken, resources used, and outcome..."
                                                className="w-full text-sm border border-neutral-200 rounded p-3 focus:outline-none focus:border-neutral-400 min-h-[80px]"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setShowResolve(false)} className="flex-1 h-10 border border-neutral-200 bg-white text-neutral-600 font-bold text-xs uppercase rounded hover:bg-neutral-50">Cancel</button>
                                            <button
                                                onClick={handleConfirmResolve}
                                                disabled={!resolveNote.trim()}
                                                className="flex-1 h-10 bg-[#111111] text-white font-bold text-xs uppercase rounded hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Confirm Resolution
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap">Assign To:</div>
                                            <select
                                                onChange={(e) => handleAssign(e.target.value)}
                                                className="text-xs border-b border-neutral-200 bg-transparent py-1 pr-6 focus:outline-none focus:border-neutral-900 cursor-pointer hover:border-neutral-400 transition-colors w-full"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select Department...</option>
                                                {DEPARTMENTS.map(dept => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex gap-3">
                                            {selectedIssue.status === 'Pending' && (
                                                <button
                                                    onClick={() => { handleUpdateStatus(selectedIssue.id, 'In Progress'); }}
                                                    className="flex-1 h-11 border bg-white border-neutral-200 text-[#111111] font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-50 transition-colors"
                                                >
                                                    Acknowledge Receipt
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setShowResolve(true)}
                                                className="flex-1 h-11 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-900 transition-colors shadow-sm"
                                            >
                                                Mark as Resolved
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
