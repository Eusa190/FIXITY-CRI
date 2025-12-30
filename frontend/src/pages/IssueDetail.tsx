import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, MapPin, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

// Mock issue data - in production this would come from API
const MOCK_ISSUES: Record<string, {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    block: string;
    district: string;
    state: string;
    created_at: string;
    acknowledged_at?: string;
    resolved_at?: string;
    severity_score: number;
    image_path?: string;
}> = {
    '1': {
        id: 1,
        title: 'Large pothole causing traffic hazard',
        description: 'A significant pothole has formed at the main junction near sector 12. Multiple vehicles have been damaged. The pothole is approximately 2 feet wide and 6 inches deep, posing a serious risk to two-wheelers and pedestrians.',
        category: 'Road damage (pothole)',
        status: 'In Progress',
        block: 'Rohini',
        district: 'North West',
        state: 'Delhi',
        created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        acknowledged_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        severity_score: 78,
    },
    '2': {
        id: 2,
        title: 'Street light non-functional for 2 weeks',
        description: 'The street light near the community park entrance has been non-functional. This creates a safety hazard for evening walkers and residents.',
        category: 'Lighting infrastructure failure',
        status: 'Pending',
        block: 'Pitampura',
        district: 'North West',
        state: 'Delhi',
        created_at: new Date(Date.now() - 336 * 60 * 60 * 1000).toISOString(),
        severity_score: 45,
    },
};

// Calculate hours since date
function hoursSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function IssueDetail() {
    const { id } = useParams<{ id: string }>();
    const [issue, setIssue] = useState<typeof MOCK_ISSUES[string] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            if (id && MOCK_ISSUES[id]) {
                setIssue(MOCK_ISSUES[id]);
            }
            setLoading(false);
        }, 300);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
                <div className="animate-spin w-6 h-6 border-2 border-neutral-300 border-t-[#0B0D12] rounded-full" />
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="min-h-screen bg-[#FAFBFC] pt-20">
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-neutral-600 mb-4">Issue not found.</p>
                    <Link to="/community" className="text-[#0B0D12] font-medium hover:underline">
                        ← Back to Public Feed
                    </Link>
                </div>
            </div>
        );
    }

    const hoursUnresolved = hoursSince(issue.created_at);
    const riskUnitsAccrued = issue.status === 'Resolved' ? 0 : Math.min(Math.floor(hoursUnresolved / 6), 20);

    // Build timeline
    const timeline = [
        {
            label: 'Reported',
            time: issue.created_at,
            status: 'complete',
        },
        {
            label: 'Acknowledged',
            time: issue.acknowledged_at,
            status: issue.acknowledged_at ? 'complete' : issue.status === 'Pending' ? 'pending' : 'pending',
        },
        {
            label: 'Resolved',
            time: issue.resolved_at,
            status: issue.resolved_at ? 'complete' : 'pending',
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFC] pt-20">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-6">
                    <Link
                        to="/community"
                        className="flex items-center gap-2 text-neutral-500 hover:text-[#0B0D12] text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Public Feed
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Public Record #{issue.id}
                            </p>
                            <h1 className="text-2xl font-bold text-[#0B0D12] mb-2">
                                {issue.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-neutral-500">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {issue.block}, {issue.district}
                                </span>
                                <span>{issue.category}</span>
                            </div>
                        </div>

                        <span className={`text-xs px-3 py-1 ${issue.status === 'Pending'
                                ? 'bg-[#FEF3C7] text-[#92400E]'
                                : issue.status === 'In Progress'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-[#D1FAE5] text-[#065F46]'
                            }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                            {issue.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white border border-neutral-200 p-6">
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Description
                            </p>
                            <p className="text-neutral-700 leading-relaxed">{issue.description}</p>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white border border-neutral-200 p-6">
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-6"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Issue Timeline
                            </p>

                            <div className="relative">
                                {timeline.map((step, index) => (
                                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                                        {/* Line */}
                                        <div className="relative flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'complete'
                                                    ? 'bg-[#D1FAE5]'
                                                    : 'bg-neutral-100'
                                                }`}>
                                                {step.status === 'complete' ? (
                                                    <CheckCircle className="w-4 h-4 text-[#059669]" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-neutral-400" />
                                                )}
                                            </div>
                                            {index < timeline.length - 1 && (
                                                <div className={`w-0.5 flex-1 mt-2 ${step.status === 'complete' ? 'bg-[#059669]' : 'bg-neutral-200'
                                                    }`} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pt-1">
                                            <p className="font-medium text-[#0B0D12]">{step.label}</p>
                                            <p className="text-sm text-neutral-500">
                                                {step.time ? formatDate(step.time) : 'Awaiting action'}
                                            </p>
                                            {step.label === 'Reported' && (
                                                <p className="text-xs text-neutral-400 mt-1"
                                                    style={{ fontFamily: 'ui-monospace, monospace' }}>
                                                    {hoursUnresolved}h ago
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Evidence */}
                        {issue.image_path && (
                            <div className="bg-white border border-neutral-200 p-6">
                                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4"
                                    style={{ fontFamily: 'ui-monospace, monospace' }}>
                                    Evidence
                                </p>
                                <img
                                    src={`/api/static/uploads/${issue.image_path}`}
                                    alt="Issue evidence"
                                    className="w-full rounded"
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Risk Impact */}
                        <div className="bg-white border border-neutral-200 p-5">
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Risk Impact
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Severity Score</p>
                                    <span className={`text-3xl font-bold ${issue.severity_score >= 80 ? 'text-[#B91C1C]' :
                                            issue.severity_score >= 50 ? 'text-[#D97706]' :
                                                'text-[#059669]'
                                        }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                        {issue.severity_score}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Risk Units Accrued</p>
                                    <span className="text-2xl font-bold text-[#B91C1C]"
                                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                                        +{riskUnitsAccrued}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Time Unresolved</p>
                                    <span className={`text-2xl font-bold ${hoursUnresolved >= 48 ? 'text-[#B91C1C]' : 'text-neutral-700'
                                        }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                        {hoursUnresolved}h
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Visibility */}
                        <div className="bg-white border border-neutral-200 p-5">
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Visibility Status
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-[#059669]" />
                                <span className="text-[#059669] font-medium">Publicly Visible</span>
                            </div>
                            <p className="text-xs text-neutral-500">
                                This issue is indexed in the public Civic Risk system and contributes to the local CRI.
                            </p>
                        </div>

                        {/* Location */}
                        <div className="bg-white border border-neutral-200 p-5">
                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4"
                                style={{ fontFamily: 'ui-monospace, monospace' }}>
                                Location
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Block</span>
                                    <span className="text-[#0B0D12]">{issue.block}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">District</span>
                                    <span className="text-[#0B0D12]">{issue.district}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">State</span>
                                    <span className="text-[#0B0D12]">{issue.state}</span>
                                </div>
                            </div>
                        </div>

                        {/* Warning if overdue */}
                        {hoursUnresolved >= 48 && issue.status !== 'Resolved' && (
                            <div className="bg-[#FEE2E2] border border-[#B91C1C]/30 p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-[#B91C1C]" />
                                    <p className="text-sm font-medium text-[#B91C1C]">Overdue</p>
                                </div>
                                <p className="text-xs text-[#B91C1C]/80">
                                    This issue has been unresolved for over 48 hours.
                                    It is now subject to public escalation protocols.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-xs text-neutral-400 mt-8 text-center" style={{ fontFamily: 'ui-monospace, monospace' }}>
                    This record is publicly indexed • Civic Risk Index contribution active
                </p>
            </div>
        </div>
    );
}
