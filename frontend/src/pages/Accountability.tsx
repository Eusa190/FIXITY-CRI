import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

// Mock jurisdictions data
const JURISDICTIONS = [
    { rank: 1, name: 'Rohini', district: 'North West Delhi', cri: 94, avgResponse: 68, resolved: 23, trend: 'up' },
    { rank: 2, name: 'Hinjewadi', district: 'Pune', cri: 88, avgResponse: 42, resolved: 34, trend: 'up' },
    { rank: 3, name: 'Andheri West', district: 'Mumbai Suburban', cri: 82, avgResponse: 31, resolved: 41, trend: 'down' },
    { rank: 4, name: 'Dwarka', district: 'South West Delhi', cri: 76, avgResponse: 28, resolved: 52, trend: 'up' },
    { rank: 5, name: 'Wakad', district: 'Pune', cri: 72, avgResponse: 24, resolved: 61, trend: 'down' },
    { rank: 6, name: 'Koramangala', district: 'Bangalore Urban', cri: 68, avgResponse: 22, resolved: 58, trend: 'up' },
    { rank: 7, name: 'Pitampura', district: 'North West Delhi', cri: 65, avgResponse: 19, resolved: 67, trend: 'down' },
    { rank: 8, name: 'Powai', district: 'Mumbai Suburban', cri: 54, avgResponse: 18, resolved: 72, trend: 'down' },
    { rank: 9, name: 'Whitefield', district: 'Bangalore Urban', cri: 48, avgResponse: 16, resolved: 78, trend: 'down' },
    { rank: 10, name: 'Viman Nagar', district: 'Pune', cri: 42, avgResponse: 14, resolved: 84, trend: 'down' },
];

export default function Accountability() {
    const [lastUpdate, setLastUpdate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Stats
    const avgCRI = Math.round(JURISDICTIONS.reduce((sum, j) => sum + j.cri, 0) / JURISDICTIONS.length);
    const avgResponseTime = Math.round(JURISDICTIONS.reduce((sum, j) => sum + j.avgResponse, 0) / JURISDICTIONS.length);
    const avgResolved = Math.round(JURISDICTIONS.reduce((sum, j) => sum + j.resolved, 0) / JURISDICTIONS.length);

    return (
        <div className="min-h-screen bg-[#FAFBFC] pt-20">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-8">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Public Record
                    </p>
                    <h1 className="text-3xl font-bold text-[#0B0D12] mb-4">
                        Authority Accountability
                    </h1>
                    <p className="text-neutral-600 max-w-2xl">
                        This page displays public performance metrics for all monitored jurisdictions.
                        Data is based on report resolution times and CRI trends.
                    </p>
                    <p className="text-xs text-neutral-400 mt-4" style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Updated {lastUpdate}s ago • Publicly accessible
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-neutral-200 p-5">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                            style={{ fontFamily: 'ui-monospace, monospace' }}>
                            National Avg CRI
                        </p>
                        <span className={`text-4xl font-bold ${avgCRI >= 80 ? 'text-[#B91C1C]' : avgCRI >= 50 ? 'text-[#D97706]' : 'text-[#059669]'
                            }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                            {avgCRI}
                        </span>
                    </div>
                    <div className="bg-white border border-neutral-200 p-5">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                            style={{ fontFamily: 'ui-monospace, monospace' }}>
                            Avg Response Time
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-neutral-700" style={{ fontFamily: 'ui-monospace, monospace' }}>
                                {avgResponseTime}h
                            </span>
                            <span className="text-xs text-neutral-400">to first action</span>
                        </div>
                    </div>
                    <div className="bg-white border border-neutral-200 p-5">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                            style={{ fontFamily: 'ui-monospace, monospace' }}>
                            Resolved Within 48h
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-neutral-700" style={{ fontFamily: 'ui-monospace, monospace' }}>
                                {avgResolved}%
                            </span>
                            <span className="text-xs text-neutral-400">national avg</span>
                        </div>
                    </div>
                </div>

                {/* Jurisdiction Rankings */}
                <div className="bg-white border border-neutral-200">
                    <div className="p-4 border-b border-neutral-100">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest"
                            style={{ fontFamily: 'ui-monospace, monospace' }}>
                            Jurisdiction Rankings by CRI
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Ranked by current Civic Risk Index • Higher CRI = higher risk
                        </p>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-neutral-50 border-b border-neutral-100 text-xs text-neutral-500 uppercase tracking-widest"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-4">Jurisdiction</div>
                        <div className="col-span-2 text-right">CRI</div>
                        <div className="col-span-2 text-right flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            Avg Response
                        </div>
                        <div className="col-span-2 text-right flex items-center justify-end gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Resolved 48h
                        </div>
                        <div className="col-span-1 text-right">Trend</div>
                    </div>

                    {/* Table Rows */}
                    {JURISDICTIONS.map((jurisdiction) => (
                        <div
                            key={jurisdiction.rank}
                            className={`grid grid-cols-12 gap-4 px-4 py-4 border-b border-neutral-100 ${jurisdiction.cri >= 80 ? 'bg-red-50' : ''
                                }`}
                        >
                            <div className="col-span-1 font-bold text-neutral-700" style={{ fontFamily: 'ui-monospace, monospace' }}>
                                #{jurisdiction.rank}
                            </div>
                            <div className="col-span-4">
                                <p className="font-medium text-[#0B0D12]">{jurisdiction.name}</p>
                                <p className="text-xs text-neutral-500">{jurisdiction.district}</p>
                            </div>
                            <div className="col-span-2 text-right">
                                <span className={`text-lg font-bold ${jurisdiction.cri >= 80 ? 'text-[#B91C1C]' :
                                        jurisdiction.cri >= 50 ? 'text-[#D97706]' :
                                            'text-[#059669]'
                                    }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                    {jurisdiction.cri}
                                </span>
                            </div>
                            <div className="col-span-2 text-right">
                                <span className={`text-sm font-medium ${jurisdiction.avgResponse > 48 ? 'text-[#B91C1C]' :
                                        jurisdiction.avgResponse > 24 ? 'text-[#D97706]' :
                                            'text-neutral-600'
                                    }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                    {jurisdiction.avgResponse}h
                                </span>
                            </div>
                            <div className="col-span-2 text-right">
                                <span className={`text-sm font-medium ${jurisdiction.resolved < 50 ? 'text-[#B91C1C]' :
                                        jurisdiction.resolved < 70 ? 'text-[#D97706]' :
                                            'text-[#059669]'
                                    }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                    {jurisdiction.resolved}%
                                </span>
                            </div>
                            <div className="col-span-1 flex justify-end items-center">
                                {jurisdiction.trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4 text-[#B91C1C]" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-[#059669]" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Methodology note */}
                <div className="mt-8 p-6 bg-neutral-100 border border-neutral-200">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Methodology
                    </p>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Rankings are calculated based on current CRI scores. Response time measures
                        hours from report submission to first authority action. Resolution rate
                        measures percentage of issues resolved within 48 hours. No individual
                        authority names are displayed. Data is aggregated at jurisdiction level.
                    </p>
                </div>

                {/* Footer */}
                <p className="text-xs text-neutral-400 mt-6 text-center" style={{ fontFamily: 'ui-monospace, monospace' }}>
                    This data is publicly accessible • Rankings updated hourly
                </p>
            </div>
        </div>
    );
}
