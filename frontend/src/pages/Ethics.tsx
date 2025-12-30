import { Shield, Eye, Lock, AlertTriangle, Users } from 'lucide-react';

export default function Ethics() {
    return (
        <div className="min-h-screen bg-[#FAFBFC] pt-20">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Governance
                    </p>
                    <h1 className="text-3xl font-bold text-[#0B0D12] mb-4">
                        Ethics & Safeguards
                    </h1>
                    <p className="text-neutral-600 text-lg leading-relaxed">
                        Fixity is designed to increase civic accountability without enabling misuse.
                        This document outlines the safeguards in place to ensure fair and responsible operation.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {/* Trust Indicators */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-neutral-600" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">Trust Indicators</h2>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6">
                        <p className="text-neutral-600 leading-relaxed mb-4">
                            Trust indicators are used internally to reduce spam and improve report prioritization.
                            They do not restrict citizens from reporting issues.
                        </p>
                        <ul className="space-y-3 text-neutral-600 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>All citizens can submit reports regardless of trust level</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>New users start with a neutral baseline, not a penalty</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Trust scores change slowly over time based on report accuracy</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Trust indicators are not publicly displayed or ranked</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Spam Prevention */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-neutral-600" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">Spam Prevention</h2>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6">
                        <p className="text-neutral-600 leading-relaxed mb-4">
                            The system employs multiple layers to detect and reduce spam without silencing legitimate reports:
                        </p>
                        <ul className="space-y-3 text-neutral-600 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Duplicate detection based on location and description similarity</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Rate limiting on submissions per user per jurisdiction</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Image verification to confirm evidence authenticity</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>GPS validation to ensure location accuracy</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Data Privacy */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-5 h-5 text-neutral-600" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">Data Privacy</h2>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6">
                        <ul className="space-y-3 text-neutral-600 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Reporter identity is not displayed on public feeds</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Personal data is not shared with third parties</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Location data is used only for issue mapping and CRI calculation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Users can request data deletion at any time</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Public Transparency */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-5 h-5 text-neutral-600" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">Public Transparency</h2>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6">
                        <ul className="space-y-3 text-neutral-600 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>CRI methodology is publicly documented</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>Authority response data is aggregated and published</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>System status and audit logs are publicly accessible</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                                <span>No private dashboards exist for unaccountable monitoring</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Equal Access */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-neutral-600" />
                        <h2 className="text-xl font-bold text-[#0B0D12]">Equal Access</h2>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6">
                        <p className="text-neutral-600 leading-relaxed">
                            Fixity is designed to serve all citizens equally. No demographic, location, or
                            socioeconomic data is used to prioritize or deprioritize reports. The system
                            operates on the principle that every civic issue deserves attention.
                        </p>
                    </div>
                </section>

                {/* Footer note */}
                <div className="border-t border-neutral-200 pt-8">
                    <p className="text-xs text-neutral-400" style={{ fontFamily: 'ui-monospace, monospace' }}>
                        This document is publicly accessible. Questions or concerns can be directed to system administrators.
                    </p>
                </div>
            </div>
        </div>
    );
}
