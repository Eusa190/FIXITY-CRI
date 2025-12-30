import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0B0D12] py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#D92D20] flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-xl">Fixity</span>
                        </Link>
                        <p className="text-neutral-500 text-sm leading-relaxed max-w-md">
                            Transforming civic complaints into quantifiable risk.
                            Making municipal neglect visible and accountable.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <p className="text-neutral-400 font-semibold text-sm uppercase tracking-wider mb-4">Platform</p>
                        <div className="space-y-2">
                            <Link to="/report" className="block text-neutral-500 hover:text-white text-sm transition-colors">
                                Report Issue
                            </Link>
                            <Link to="/map" className="block text-neutral-500 hover:text-white text-sm transition-colors">
                                Risk Map
                            </Link>
                            <Link to="/community" className="block text-neutral-500 hover:text-white text-sm transition-colors">
                                Community Feed
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className="text-neutral-400 font-semibold text-sm uppercase tracking-wider mb-4">Access</p>
                        <div className="space-y-2">
                            <Link to="/login" className="block text-neutral-500 hover:text-white text-sm transition-colors">
                                Citizen Login
                            </Link>
                            <Link to="/authority/dashboard" className="block text-neutral-500 hover:text-white text-sm transition-colors">
                                Authority Portal
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-neutral-600 text-sm">
                        © 2024 Fixity • Team Think-Bolts
                    </p>
                    {/* Uneasy line - don't let them relax */}
                    <p className="text-neutral-500 text-xs" style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Public data. Continuously updated.
                    </p>
                </div>
            </div>
        </footer>
    );
}
