import { ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';

export default function HowCRIWorks() {
    return (
        <div className="bg-[#FAFBFC] min-h-full rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Documentation
                    </p>
                    <h1 className="text-3xl font-bold text-[#0B0D12] mb-4">
                        How the Civic Risk Index Works
                    </h1>
                    <p className="text-neutral-600 text-lg leading-relaxed">
                        The Civic Risk Index (CRI) is a real-time measurement of unresolved civic issues
                        within a geographic jurisdiction. It transforms citizen reports into a quantifiable
                        accountability metric.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {/* What CRI Measures */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-[#0B0D12] mb-4">What CRI Measures</h2>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                        CRI is not a count of complaints. It is a weighted index that reflects:
                    </p>
                    <ul className="space-y-3 text-neutral-600">
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                            <span><strong>Volume</strong> — Number of unresolved issues in a jurisdiction</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                            <span><strong>Duration</strong> — How long issues have remained unaddressed</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                            <span><strong>Severity</strong> — Category-based risk weighting (e.g., safety hazards rank higher)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                            <span><strong>Pattern</strong> — Clustering of similar issues in the same area</span>
                        </li>
                    </ul>
                </section>

                {/* What Increases CRI */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <ArrowUp className="w-5 h-5 text-[#B91C1C]" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">What Increases CRI</h2>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6">
                        <ul className="space-y-3 text-neutral-600">
                            <li className="flex items-start gap-3">
                                <span className="text-[#B91C1C] font-bold">+</span>
                                <span>New civic issue reported</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#B91C1C] font-bold">+</span>
                                <span>Existing issue remains unresolved (time decay penalty)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#B91C1C] font-bold">+</span>
                                <span>High-severity category (safety, sanitation, infrastructure failure)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#B91C1C] font-bold">+</span>
                                <span>Multiple reports in same geographic cluster</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#B91C1C] font-bold">+</span>
                                <span>Issue crosses 48-hour unresolved threshold</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* What Decreases CRI */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <ArrowDown className="w-5 h-5 text-[#059669]" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">What Decreases CRI</h2>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6">
                        <ul className="space-y-3 text-neutral-600">
                            <li className="flex items-start gap-3">
                                <span className="text-[#059669] font-bold">−</span>
                                <span>Issue marked as resolved by authority</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#059669] font-bold">−</span>
                                <span>Fast response time (resolution within 24 hours)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#059669] font-bold">−</span>
                                <span>Issue acknowledged and marked "In Progress"</span>
                            </li>
                        </ul>
                        <p className="text-xs text-neutral-400 mt-4" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            Note: CRI does not decrease on its own. Resolution requires explicit action.
                        </p>
                    </div>
                </section>

                {/* Threshold Behaviors */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">Threshold Behaviors</h2>
                    </div>
                    <p className="text-neutral-600 mb-6">
                        CRI operates on a 0-100 scale. System behavior changes at key thresholds:
                    </p>

                    <div className="space-y-4">
                        {/* Threshold 50 */}
                        <div className="bg-white border border-neutral-200 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl font-bold text-[#D97706]" style={{ fontFamily: 'ui-monospace, monospace' }}>50</span>
                                <span className="text-xs px-2 py-0.5 bg-[#FEF3C7] text-[#92400E]" style={{ fontFamily: 'ui-monospace, monospace' }}>ELEVATED</span>
                            </div>
                            <ul className="text-sm text-neutral-600 space-y-1">
                                <li>• Jurisdiction flagged for monitoring</li>
                                <li>• Appears on public risk map with orange indicator</li>
                                <li>• Weekly reports generated for authorities</li>
                            </ul>
                        </div>

                        {/* Threshold 80 */}
                        <div className="bg-white border border-[#B91C1C]/20 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl font-bold text-[#B91C1C]" style={{ fontFamily: 'ui-monospace, monospace' }}>80</span>
                                <span className="text-xs px-2 py-0.5 bg-[#FEE2E2] text-[#B91C1C]" style={{ fontFamily: 'ui-monospace, monospace' }}>CRITICAL</span>
                            </div>
                            <ul className="text-sm text-neutral-600 space-y-1">
                                <li>• Jurisdiction escalated to critical status</li>
                                <li>• Automatic notification to higher authorities</li>
                                <li>• Public visibility increased</li>
                                <li>• Response time tracking begins</li>
                            </ul>
                        </div>

                        {/* Threshold 100 */}
                        <div className="bg-[#0B0D12] p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'ui-monospace, monospace' }}>100</span>
                                <span className="text-xs px-2 py-0.5 bg-white/20 text-white" style={{ fontFamily: 'ui-monospace, monospace' }}>FAILURE</span>
                            </div>
                            <ul className="text-sm text-neutral-300 space-y-1">
                                <li>• Maximum risk threshold breached</li>
                                <li>• Jurisdiction appears in public failure list</li>
                                <li>• Mandatory escalation protocol triggered</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Calculation Frequency */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-[#0B0D12] mb-4">Calculation Frequency</h2>
                    <div className="bg-neutral-100 border border-neutral-200 p-6">
                        <p className="text-neutral-600 mb-4">
                            CRI is recalculated every hour for all active jurisdictions.
                            Real-time updates are triggered when:
                        </p>
                        <ul className="text-sm text-neutral-600 space-y-2">
                            <li>• A new issue is reported</li>
                            <li>• An issue status changes</li>
                            <li>• A threshold is crossed</li>
                        </ul>
                        <p className="text-xs text-neutral-400 mt-4" style={{ fontFamily: 'ui-monospace, monospace' }}>
                            Last system-wide recalculation: 12 minutes ago
                        </p>
                    </div>
                </section>

                {/* Footer note */}
                <div className="border-t border-neutral-200 pt-8">
                    <p className="text-xs text-neutral-400" style={{ fontFamily: 'ui-monospace, monospace' }}>
                        This documentation is publicly accessible. CRI methodology is transparent by design.
                    </p>
                </div>
            </div>
        </div>
    );
}
