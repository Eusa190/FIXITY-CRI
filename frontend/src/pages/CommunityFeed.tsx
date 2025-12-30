import { useState, useEffect } from 'react';
import { issueApi } from '../services/api';
import type { Issue } from '../types';
import { Clock, X } from 'lucide-react';

// Calculate hours since date
function hoursSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
}

// Format time unresolved
function formatUnresolved(hours: number): string {
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h`;
    }
    return `${hours}h`;
}

export default function CommunityFeed() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const data = await issueApi.getCommunityFeed();
                // Sort by unresolved time (oldest first = most pressure)
                const sorted = data.sort((a, b) => {
                    if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
                    if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
                    const aHours = a.created_at ? hoursSince(a.created_at) : 0;
                    const bHours = b.created_at ? hoursSince(b.created_at) : 0;
                    return bHours - aHours;
                });
                setIssues(sorted);
            } catch {
                // Handle error silently
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--canvas-bg)' }}>
                <div className="animate-spin w-6 h-6 border-2 border-neutral-300 border-t-[#0B0D12] rounded-full" />
            </div>
        );
    }

    const pendingCount = issues.filter(i => i.status === 'Pending').length;
    const totalUnresolvedHours = issues
        .filter(i => i.status !== 'Resolved')
        .reduce((sum, i) => sum + (i.created_at ? hoursSince(i.created_at) : 0), 0);

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-[#0B0D12] mb-1">
                Civic Issue Ledger
            </h1>
            <p className="text-sm text-neutral-500">
                All unresolved issues are listed below. Sorted by time unresolved.
            </p>

            <p className="text-xs text-neutral-400 mt-4 mb-6" style={{ fontFamily: 'ui-monospace, monospace' }}>
                This feed is publicly accessible.
            </p>

            {/* Stats bar */}
            <div style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-subtle)' }}
                className="rounded-xl overflow-hidden mb-8 border border-neutral-200">
                <div className="px-6 py-4 flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Total Issues:</span>
                        <span className="text-sm font-medium text-[#0B0D12]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            {issues.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Pending:</span>
                        <span className="text-sm font-medium text-[#D97706]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            {pendingCount}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Total Unresolved Time:</span>
                        <span className="text-sm font-medium text-[#B91C1C]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            {formatUnresolved(totalUnresolvedHours)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Issues List */}
            <div className="pb-8">
                {issues.length === 0 ? (
                    <div className="bg-white border border-neutral-200 p-8 text-center rounded-xl">
                        <p className="text-neutral-500">No issues recorded.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {issues.map((issue) => {
                            const hours = issue.created_at ? hoursSince(issue.created_at) : 0;
                            const riskImpact = issue.status === 'Resolved' ? 0 : Math.min(Math.floor(hours / 6), 20);
                            const isEscalating = hours > 48 && issue.status === 'Pending';

                            return (
                                <div
                                    key={issue.id}
                                    onClick={() => setSelectedIssue(issue)}
                                    className={`bg-white border ${isEscalating ? 'border-[#B91C1C]/30' : 'border-neutral-200'} p-5 cursor-pointer hover:bg-neutral-50 transition-colors rounded-xl`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Time - Most prominent */}
                                        <div className="flex-shrink-0 w-20 text-right">
                                            <p className={`text-lg font-bold ${issue.status === 'Resolved' ? 'text-[#059669]' :
                                                    hours > 48 ? 'text-[#B91C1C]' :
                                                        hours > 24 ? 'text-[#D97706]' :
                                                            'text-neutral-600'
                                                }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                                {issue.status === 'Resolved' ? '—' : formatUnresolved(hours)}
                                            </p>
                                            <p className="text-[10px] text-neutral-400" style={{ fontFamily: 'ui-monospace, monospace' }}>
                                                {issue.status === 'Resolved' ? 'resolved' : 'unresolved'}
                                            </p>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#0B0D12] mb-1">{issue.title}</p>
                                            <p className="text-sm text-neutral-500 mb-2">
                                                {issue.block}, {issue.district}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs">
                                                {/* Status badge - rectangular, muted */}
                                                <span className={`px-2 py-0.5 rounded ${issue.status === 'Pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                                                        issue.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                                                            'bg-[#D1FAE5] text-[#065F46]'
                                                    }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                                    {issue.status}
                                                </span>

                                                {/* Risk impact */}
                                                {riskImpact > 0 && (
                                                    <span className="text-[#B91C1C]" style={{ fontFamily: 'ui-monospace, monospace' }}>
                                                        +{riskImpact} CRI
                                                    </span>
                                                )}

                                                {/* Visibility */}
                                                <span className="text-neutral-400" style={{ fontFamily: 'ui-monospace, monospace' }}>
                                                    Visibility: Public
                                                </span>
                                            </div>
                                        </div>

                                        {/* Timestamp */}
                                        <div className="flex-shrink-0 text-right">
                                            <p className="text-xs text-neutral-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <p className="text-xs text-neutral-400 mt-6 text-center" style={{ fontFamily: 'ui-monospace, monospace' }}>
                Visible to authorities and public • Data publicly auditable
            </p>

            {/* Issue Detail Modal */}
            {selectedIssue && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
                    onClick={() => setSelectedIssue(null)}
                >
                    <div
                        className="bg-white border border-neutral-200 max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start p-6 border-b border-neutral-200">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1"
                                    style={{ fontFamily: 'ui-monospace, monospace' }}>
                                    Public Record #{selectedIssue.id}
                                </p>
                                <h2 className="text-xl font-bold text-[#0B0D12]">{selectedIssue.title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedIssue(null)}
                                className="text-neutral-400 hover:text-[#0B0D12]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {selectedIssue.image_path && (
                            <img
                                src={`/api/static/uploads/${selectedIssue.image_path}`}
                                alt="Issue documentation"
                                className="w-full h-48 object-cover"
                            />
                        )}

                        <div className="p-6">
                            <p className="text-neutral-600 mb-6">{selectedIssue.description}</p>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Location</span>
                                    <span className="text-[#0B0D12]">{selectedIssue.block}, {selectedIssue.district}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Category</span>
                                    <span className="text-[#0B0D12]">{selectedIssue.category}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Status</span>
                                    <span className={
                                        selectedIssue.status === 'Pending' ? 'text-[#D97706]' :
                                            selectedIssue.status === 'In Progress' ? 'text-blue-600' :
                                                'text-[#059669]'
                                    }>{selectedIssue.status}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Time unresolved</span>
                                    <span className={
                                        selectedIssue.status === 'Resolved' ? 'text-[#059669]' : 'text-[#B91C1C]'
                                    } style={{ fontFamily: 'ui-monospace, monospace' }}>
                                        {selectedIssue.status === 'Resolved'
                                            ? 'Resolved'
                                            : formatUnresolved(selectedIssue.created_at ? hoursSince(selectedIssue.created_at) : 0)
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-500">Visibility</span>
                                    <span className="text-[#0B0D12]">Public</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-neutral-500">Reported</span>
                                    <span className="text-[#0B0D12]">
                                        {selectedIssue.created_at
                                            ? new Date(selectedIssue.created_at).toLocaleString()
                                            : '—'
                                        }
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-400 mt-6 pt-4 border-t border-neutral-200"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                This record is publicly indexed in the Civic Risk system.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
