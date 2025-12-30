import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Database, Shield, Activity } from 'lucide-react';

export default function SystemStatus() {
    const [uptimeSeconds, setUptimeSeconds] = useState(0);
    const [lastCalc, setLastCalc] = useState(12);

    useEffect(() => {
        // Simulate uptime counter
        const startTime = Date.now() - (14 * 24 * 60 * 60 * 1000) - (7 * 60 * 60 * 1000) - (23 * 60 * 1000);

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setUptimeSeconds(Math.floor(elapsed / 1000));
            setLastCalc(prev => prev >= 59 ? 0 : prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format uptime
    const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);

    const systemComponents = [
        { name: 'CRI Calculation Engine', status: 'operational', latency: '23ms' },
        { name: 'Report Ingestion API', status: 'operational', latency: '45ms' },
        { name: 'Authority Notification Service', status: 'operational', latency: '112ms' },
        { name: 'Public Data API', status: 'operational', latency: '31ms' },
        { name: 'Geolocation Service', status: 'operational', latency: '67ms' },
        { name: 'Database Cluster', status: 'operational', latency: '8ms' },
    ];

    const recentEvents = [
        { time: '2m ago', event: 'CRI recalculation completed (all jurisdictions)', type: 'calc' },
        { time: '12m ago', event: 'Threshold alert: Rohini crossed CRI 90', type: 'alert' },
        { time: '1h ago', event: 'Scheduled database backup completed', type: 'maintenance' },
        { time: '2h ago', event: 'CRI methodology v2.3 deployed', type: 'deployment' },
        { time: '6h ago', event: 'Authority notification batch sent (47 recipients)', type: 'notification' },
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFC] pt-20">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-[#059669] animate-pulse" />
                        <p className="text-xs text-[#059669] uppercase tracking-widest font-medium"
                            style={{ fontFamily: 'ui-monospace, monospace' }}>
                            All Systems Operational
                        </p>
                    </div>
                    <h1 className="text-3xl font-bold text-[#0B0D12] mb-4">
                        System Status
                    </h1>
                    <p className="text-neutral-600 max-w-2xl">
                        Real-time status of Fixity infrastructure and CRI calculation systems.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-neutral-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[#059669]" />
                            <p className="text-xs text-neutral-500 uppercase tracking-widest"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Uptime
                            </p>
                        </div>
                        <span className="text-2xl font-bold text-[#0B0D12]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            {days}d {hours}h {minutes}m
                        </span>
                        <p className="text-xs text-neutral-400 mt-1">99.98% this month</p>
                    </div>

                    <div className="bg-white border border-neutral-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            <p className="text-xs text-neutral-500 uppercase tracking-widest"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Last CRI Calc
                            </p>
                        </div>
                        <span className="text-2xl font-bold text-[#0B0D12]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            {lastCalc}m ago
                        </span>
                        <p className="text-xs text-neutral-400 mt-1">Next in {60 - lastCalc}m</p>
                    </div>

                    <div className="bg-white border border-neutral-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="w-4 h-4 text-neutral-500" />
                            <p className="text-xs text-neutral-500 uppercase tracking-widest"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Active Jurisdictions
                            </p>
                        </div>
                        <span className="text-2xl font-bold text-[#0B0D12]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            1,247
                        </span>
                        <p className="text-xs text-neutral-400 mt-1">Being monitored</p>
                    </div>

                    <div className="bg-white border border-neutral-200 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-neutral-500" />
                            <p className="text-xs text-neutral-500 uppercase tracking-widest"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Audit Mode
                            </p>
                        </div>
                        <span className="text-xl font-bold text-[#059669]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            PUBLIC
                        </span>
                        <p className="text-xs text-neutral-400 mt-1">All data verifiable</p>
                    </div>
                </div>

                {/* Component Status */}
                <div className="bg-white border border-neutral-200 mb-8">
                    <div className="p-4 border-b border-neutral-100">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest"
                            style={{ fontFamily: 'ui-monospace, monospace' }}>
                            Component Status
                        </p>
                    </div>

                    {systemComponents.map((component, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 last:border-b-0"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-[#059669]" />
                                <span className="text-[#0B0D12]">{component.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-neutral-400" style={{ fontFamily: 'ui-monospace, monospace' }}>
                                    {component.latency}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-[#D1FAE5] text-[#065F46]"
                                    style={{ fontFamily: 'ui-monospace, monospace' }}>
                                    Operational
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Events */}
                <div className="bg-white border border-neutral-200 mb-8">
                    <div className="p-4 border-b border-neutral-100">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest"
                            style={{ fontFamily: 'ui-monospace, monospace' }}>
                            Recent System Events
                        </p>
                    </div>

                    {recentEvents.map((event, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 px-4 py-3 border-b border-neutral-100 last:border-b-0"
                        >
                            <span className="text-xs text-neutral-400 w-16 flex-shrink-0"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                {event.time}
                            </span>
                            <span className={`text-sm ${event.type === 'alert' ? 'text-[#B91C1C]' : 'text-neutral-600'
                                }`}>
                                {event.event}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Data Sources */}
                <div className="bg-neutral-100 border border-neutral-200 p-6 mb-8">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Data Sources
                    </p>
                    <ul className="space-y-2 text-sm text-neutral-600">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                            Citizen reports via Fixity mobile and web applications
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                            Authority response data from authenticated dashboard actions
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                            Geographic data from verified location services
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                            Municipal open data APIs (integration pending)
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs text-neutral-400" style={{ fontFamily: 'ui-monospace, monospace' }}>
                        System monitored 24/7 • Incident history publicly available
                    </p>
                    <p className="text-xs text-neutral-400 mt-1" style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Last audit: 18 Dec 2025 • Compliance: Public Mode
                    </p>
                </div>
            </div>
        </div>
    );
}
