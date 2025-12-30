import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { DISTRICTS, BLOCKS } from '../types';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

type Tab = 'citizen' | 'authority';

export default function Register() {
    const [activeTab, setActiveTab] = useState<Tab>('citizen');

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

                {/* Card */}
                <div className="bg-white border border-neutral-200 p-8">
                    {/* Context line */}
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-6 text-center"
                        style={{ fontFamily: 'ui-monospace, monospace' }}>
                        Register to submit civic risk reports
                    </p>

                    <h2 className="text-2xl font-bold text-center text-[#0B0D12] mb-6">Create Account</h2>

                    {/* Tabs */}
                    <div className="flex mb-6 border border-neutral-200">
                        <button
                            onClick={() => setActiveTab('citizen')}
                            className={`flex-1 py-2 text-sm font-medium transition-all ${activeTab === 'citizen'
                                ? 'bg-[#0B0D12] text-white'
                                : 'text-neutral-500 hover:text-[#0B0D12]'
                                }`}
                        >
                            Citizen
                        </button>
                        <button
                            onClick={() => setActiveTab('authority')}
                            className={`flex-1 py-2 text-sm font-medium transition-all border-l border-neutral-200 ${activeTab === 'authority'
                                ? 'bg-[#0B0D12] text-white'
                                : 'text-neutral-500 hover:text-[#0B0D12]'
                                }`}
                        >
                            Authority
                        </button>
                    </div>

                    {activeTab === 'citizen' ? <CitizenForm /> : <AuthorityForm />}

                    <div className="text-center mt-6 pt-6 border-t border-neutral-100">
                        <p className="text-neutral-500 text-sm">
                            Already registered?{' '}
                            <Link to="/login" className="text-[#0B0D12] font-medium hover:underline">
                                Login
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

function CitizenForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!email) {
            setError('Please enter email');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await authApi.sendOtp(email);
            if (response.message) {
                setOtpSent(true);
                alert('OTP Sent! Check your email (or server console for demo)');
            } else {
                setError(response.error || 'Failed to send OTP');
            }
        } catch {
            setError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!acknowledged) {
            setError('Please acknowledge the terms');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await authApi.registerCitizen({ username, password, otp });
            if (response.redirect) {
                navigate(response.redirect);
            } else {
                setError(response.error || 'Registration failed');
            }
        } catch {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-[#D92D20]/5 border border-[#D92D20]/20 text-[#D92D20] px-4 py-2 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-neutral-600 text-sm font-medium mb-2">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    required
                />
            </div>

            <div>
                <label className="block text-neutral-600 text-sm font-medium mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    required
                    disabled={otpSent}
                />
            </div>

            <div>
                <label className="block text-neutral-600 text-sm font-medium mb-2">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    required
                />
            </div>

            {!otpSent ? (
                <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-3 bg-neutral-700 text-white font-medium hover:bg-neutral-600 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Verify Email & Send OTP'}
                </button>
            ) : (
                <>
                    <div>
                        <label className="block text-neutral-600 text-sm font-medium mb-2">Enter 4-digit OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                            placeholder="XXXX"
                            maxLength={4}
                            required
                        />
                    </div>

                    {/* Acknowledgment checkbox */}
                    <label className="flex items-start gap-3 text-sm text-neutral-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => setAcknowledged(e.target.checked)}
                            className="mt-1 w-4 h-4 border-neutral-300"
                        />
                        <span>I understand reports contribute to a public civic risk index.</span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading || !acknowledged}
                        className="w-full py-3 bg-[#0B0D12] text-white font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Complete Registration'}
                    </button>
                </>
            )}

            {/* Warning text */}
            <p className="text-xs text-neutral-400 text-center" style={{ fontFamily: 'ui-monospace, monospace' }}>
                All submissions are publicly indexed.
            </p>
        </form>
    );
}

function AuthorityForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        state: 'Odisha',
        district: 'Khordha',
        block: 'Bhubaneswar Ward 19',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!acknowledged) {
            setError('Please acknowledge the terms');
            return;
        }
        setLoading(true);
        setError('');

        try {
            await authApi.registerAuthority(formData);
            alert('Authority Account Created. Please Login.');
            navigate('/login');
        } catch {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-[#D92D20]/5 border border-[#D92D20]/20 text-[#D92D20] px-4 py-2 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-neutral-600 text-sm font-medium mb-2">Officer Name</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    required
                />
            </div>

            <div>
                <label className="block text-neutral-600 text-sm font-medium mb-2">Gov Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@gov.in"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    required
                />
            </div>

            <div>
                <label className="block text-neutral-600 text-sm font-medium mb-2">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    required
                />
            </div>

            {/* Dual State Policy: Odisha & West Bengal */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-neutral-600 text-sm font-medium mb-2">State</label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value, district: '', block: '' })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    >
                        <option value="Odisha">Odisha</option>
                        <option value="West Bengal">West Bengal</option>
                    </select>
                </div>
                <div>
                    <label className="block text-neutral-600 text-sm font-medium mb-2">District</label>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12]"
                    >
                        <option value="">Select District</option>
                        {(DISTRICTS[formData.state] || []).map((district) => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-neutral-600 text-sm font-medium mb-2">Block / Ward</label>
                <select
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    disabled={!formData.district}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-[#0B0D12] focus:outline-none focus:border-[#0B0D12] disabled:opacity-40"
                    required
                >
                    <option value="">Select Block / Ward</option>
                    {(BLOCKS[formData.district] || []).map((block) => (
                        <option key={block} value={block}>
                            {block}
                        </option>
                    ))}
                </select>
            </div>

            {/* Acknowledgment checkbox */}
            <label className="flex items-start gap-3 text-sm text-neutral-600 cursor-pointer">
                <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-1 w-4 h-4 border-neutral-300"
                />
                <span>I understand all actions are logged in the public civic risk system.</span>
            </label>

            <button
                type="submit"
                disabled={loading || !acknowledged}
                className="w-full py-3 bg-[#0B0D12] text-white font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Registering...' : 'Register Authority'}
            </button>

            {/* Warning text */}
            <p className="text-xs text-neutral-400 text-center" style={{ fontFamily: 'ui-monospace, monospace' }}>
                Authority actions are publicly auditable.
            </p>
        </form>
    );
}
