import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AudienceToggle() {
    const [mode, setMode] = useState<'public' | 'authority'>('public');

    return (
        <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col items-center mb-16 relative z-40 isolate">
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6">Select Perspective</p>
                <div className="bg-neutral-100 p-1.5 rounded-full flex relative shadow-sm">
                    <motion.div
                        className="absolute bg-white shadow-sm rounded-full inset-y-1.5 w-[140px] pointer-events-none"
                        animate={{ left: mode === 'public' ? '6px' : 'calc(100% - 146px)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                        onClick={() => setMode('public')}
                        className={`relative z-20 w-[140px] py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer ${mode === 'public' ? 'text-red-600' : 'text-neutral-500'}`}
                    >
                        Citizens
                    </button>
                    <button
                        onClick={() => setMode('authority')}
                        className={`relative z-20 w-[140px] py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer ${mode === 'authority' ? 'text-red-600' : 'text-neutral-500'}`}
                    >
                        Authorities
                    </button>
                </div>
            </div>

            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {mode === 'public' ? (
                        <motion.div
                            key="public"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid md:grid-cols-2 gap-12 items-center"
                        >
                            <div>
                                <h3 className="text-4xl font-bold mb-6 text-neutral-800">Force accountability through visibility.</h3>
                                <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                                    When reports are public, they cannot be ignored. Track your submission from intake to resolution, and watch the risk score escalate if action isn't taken.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-neutral-700">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        Instant public record
                                    </li>
                                    <li className="flex items-center gap-3 text-neutral-700">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        Automatic risk escalation
                                    </li>
                                    <li className="flex items-center gap-3 text-neutral-700">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        Proof of negligence
                                    </li>
                                </ul>
                                <Link to="/report" className="inline-flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all border-b-2 border-red-600 pb-0.5">
                                    Start a Report <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="aspect-square bg-red-50 rounded-2xl flex items-center justify-center relative overflow-hidden group border border-red-100">
                                <Users className="w-32 h-32 text-red-400 opacity-50 group-hover:scale-110 transition-transform duration-700" />
                                {/* Decorations */}
                                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-20"></div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="authority"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid md:grid-cols-2 gap-12 items-center"
                        >
                            <div>
                                <h3 className="text-4xl font-bold mb-6 text-neutral-800">Manage risk before it becomes a crisis.</h3>
                                <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                                    Access a unified dashboard of civic health. Identify critical infrastructure failures early and deploy resources based on data, not noise.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-neutral-700">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        Real-time heatmap
                                    </li>
                                    <li className="flex items-center gap-3 text-neutral-700">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        Duplicate detection
                                    </li>
                                    <li className="flex items-center gap-3 text-neutral-700">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        Performance analytics
                                    </li>
                                </ul>
                                <Link to="/auth/login" className="inline-flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all border-b-2 border-red-600 pb-0.5">
                                    Access Portal <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="aspect-square bg-red-50 rounded-2xl flex items-center justify-center relative overflow-hidden group border border-red-100">
                                <Building2 className="w-32 h-32 text-red-500 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute w-full h-[1px] bg-red-200 top-1/2 left-0 animate-pulse"></div>
                                <div className="absolute h-full w-[1px] bg-red-200 left-1/2 top-0 animate-pulse delay-75"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
