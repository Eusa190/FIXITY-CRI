import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success && result.redirect) {
                navigate(result.redirect);
            } else {
                setError(result.error || 'Login failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center py-12 px-4 relative">
            {/* Subtle grid texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="authGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0B0D12" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#authGrid)" />
                </svg>
            </div>

            {/* CRI presence - subtle vertical indicator */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
                <div className="w-1 h-24 bg-neutral-200 rounded-full" />
                <p
                    className="text-[9px] text-neutral-300 whitespace-nowrap"
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        fontFamily: 'ui-monospace, monospace'
                    }}
                >
                    Monitoring
                </p>
            </div>

            <div className="max-w-md w-full relative z-20">
                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#0B0D12] text-sm mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-[#D92D20] flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#0B0D12] font-bold text-xl">Fixity</span>
                </div>

                {/* Card - sharper, less comfortable */}
                <div className="bg-white border border-neutral-200 p-8">
                    {/* Context line */}
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-6 text-center"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Access to civic risk reporting system
                    </p>

                    <h2 className="text-2xl font-bold text-center text-[#0B0D12] mb-8">Login</h2>

                    {error && (
                        <div className="bg-[#D92D20]/5 border border-[#D92D20]/20 text-[#D92D20] px-4 py-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-neutral-600 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] placeholder-neutral-400 focus:outline-none focus:border-[#0B0D12] focus:ring-1 focus:ring-[#0B0D12]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-neutral-600 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] placeholder-neutral-400 focus:outline-none focus:border-[#0B0D12] focus:ring-1 focus:ring-[#0B0D12]"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Institutional button - dark, not colorful */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#0B0D12] text-white font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>
                    </form>

                    {/* Warning text */}
                    <p className="text-xs text-neutral-400 text-center mt-6" style={{ fontFamily: 'ui-monospace, monospace' }}>
                        All submissions are publicly indexed.
                    </p>

                    <div className="text-center mt-6 pt-6 border-t border-neutral-100">
                        <p className="text-neutral-500 text-sm">
                            First time reporting?{' '}
                            <Link to="/register" className="text-[#0B0D12] font-medium hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer CRI presence */}
                <p className="text-xs text-neutral-400 text-center mt-8" style={{ fontFamily: 'ui-monospace, monospace' }}>
                    Civic Risk Index updates continuously.
                </p>
            </div>
        </div>
    );
}
