import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Map, User, Shield, LogIn, BarChart } from 'lucide-react';
import { useAuth, isAuthority } from '../context/AuthContext';
import { NavBar as TubelightNavBar } from './ui/tubelight-navbar';

export default function Navbar() {
    const { user, logout } = useAuth();
    // Live update counter - Removed
    // Simulate CRI fluctuation - Removed


    // --- NAVIGATION ITEMS FOR TUBELIGHT BAR ---
    let navItems = [];

    if (user && isAuthority(user)) {
        // AUTHORITY VIEW: Work-focused, stripped of distractions
        navItems = [
            { name: 'Report', url: '/report', icon: AlertTriangle },
            { name: 'Analytics', url: '/authority/analytics', icon: BarChart },
            { name: 'Authority', url: '/authority/dashboard', icon: Shield }
        ];
    } else {
        // LANDING PAGE SCROLL-SPY
        navItems = [
            { name: 'Home', url: '#home', icon: Home },
            { name: 'Timeline', url: '#timeline', icon: BarChart },
            { name: 'Integrity', url: '#integrity', icon: Shield },
            { name: 'Live Map', url: '#live-map', icon: Map },
            { name: 'Perspective', url: '#audience', icon: User },
        ];
    }

    return (
        <>
            {/* 1. HUD: TOP LEFT (Logo + CRI Status) */}
            <div className="fixed top-6 left-6 z-[60] flex items-center gap-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 pl-3 pr-4 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#D92D20] flex items-center justify-center rounded-full">
                        <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <span className="text-[#0B0D12] dark:text-white font-bold text-sm tracking-tight block leading-none">Fixity</span>
                    </div>
                </Link>
            </div>

            {/* 2. HUD: TOP RIGHT (Auth + Theme) */}
            <div className="fixed top-6 right-6 z-[60] flex items-center gap-3">
                {user ? (
                    <div className="flex items-center gap-3 bg-white/80 dark:bg-black/80 backdrop-blur-md p-1.5 pl-4 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm group relative">
                        <div className="flex flex-col items-end leading-none mr-1">
                            <span className="text-xs font-bold text-[#0B0D12] dark:text-white">{user.username}</span>
                            <span className="text-[9px] text-neutral-500 uppercase tracking-wide">{isAuthority(user) ? 'Authority' : 'Citizen'}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
                            title="Logout"
                        >
                            <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center gap-2 bg-[#0B0D12] text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-lg hover:bg-neutral-800 transition-colors"
                    >
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Login</span>
                    </Link>
                )}
            </div>

            {/* 3. CENTER: TUBELIGHT NAVBAR */}
            <TubelightNavBar items={navItems} />
            {/* <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white/50 p-2 rounded">Navbar Disabled for Debug</div> */}
        </>
    );
}
