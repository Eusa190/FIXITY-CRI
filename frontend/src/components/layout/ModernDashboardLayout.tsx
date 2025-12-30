import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Map,
    AlertTriangle,
    Share2,
    BookOpen,
    User,
    Shield,
    BarChart,
    LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userType: 'citizen' | 'authority';
}

export function ModernDashboardLayout({ children, userType }: DashboardLayoutProps) {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Define Navigation Items based on Role
    const navItems = userType === 'authority' ? [
        { name: 'Dashboard', url: '/authority/dashboard', icon: Shield },
        { name: 'Analytics', url: '/analytics', icon: BarChart },
        { name: 'Reports', url: '/report', icon: AlertTriangle },
    ] : [
        { name: 'Risk Map', url: '/map', icon: Map },
        { name: 'Report', url: '/report', icon: AlertTriangle },
        { name: 'Feed', url: '/community', icon: Share2 },
        { name: 'How to Use CRI', url: '/how-cri-works', icon: BookOpen },
        { name: 'Profile', url: '/profile', icon: User },
    ];

    return (
        <div className="h-screen bg-[#111111] flex overflow-hidden font-sans selection:bg-orange-500/30">
            {/* --- LEFT SIDEBAR --- */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-20 lg:w-72 flex-shrink-0 flex flex-col py-8 px-4 lg:px-8 z-20 overflow-y-auto scrollbar-hide"
            >
                {/* Profile / Brand Header */}
                <div className="flex flex-col gap-8">
                    {/* User Profile Card (Mini) */}
                    <div className="flex flex-col items-center lg:items-start gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                                {user?.username?.[0]?.toUpperCase() || 'G'}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#EA580C] rounded-full border-2 border-[#111111]" />
                        </div>
                        <div className="hidden lg:block">
                            <h2 className="text-white font-bold text-lg leading-tight">
                                {user?.username || 'Guest User'}
                            </h2>
                            <p className="text-neutral-500 text-xs">{(user as any)?.email || 'citizen@fixity.in'}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 mt-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.url;
                            return (
                                <Link key={item.name} to={item.url}>
                                    <div className="relative group">
                                        <motion.div
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
                                                isActive
                                                    ? "text-white"
                                                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <item.icon className={cn("w-6 h-6 flex-shrink-0", isActive ? "text-[#EA580C]" : "group-hover:text-[#EA580C] transition-colors")} strokeWidth={isActive ? 2.5 : 2} />
                                            <span className={cn("hidden lg:block font-medium text-sm tracking-wide whitespace-normal leading-tight text-left", isActive ? "font-bold" : "")}>
                                                {item.name}
                                            </span>
                                        </motion.div>

                                        {/* Active Pill Indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#EA580C] rounded-r-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions - Lifted up */}
                <div className="flex flex-col gap-2 mt-2">
                    <button onClick={logout} className="flex items-center gap-4 px-4 py-3 text-[#EF4444] hover:text-[#DC2626] transition-colors rounded-xl hover:bg-[#EF4444]/10 group">
                        <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="hidden lg:block font-bold text-sm tracking-wide">Logout</span>
                    </button>
                </div>
            </motion.div>


            {/* --- MAIN CONTENT AREA ("Floating Card") --- */}
            <div className="flex-1 p-4 lg:p-6 overflow-hidden relative flex">
                <div
                    className="flex-1 bg-white rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row"
                >
                    {/* Orange Accent Top Line */}
                    {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EA580C] to-orange-300 opacity-20" /> */}

                    {/* Main Scrollable Content */}
                    <div className="flex-1 overflow-y-auto h-full p-6 lg:p-10 scrollbar-hide">
                        {/* Content Wrapper */}
                        {children}
                    </div>

                    {/* Right Side Widgets (Optional Context Column - Visible on larger screens if needed, or part of children) */}
                    {/* For now, we wrap children. If children have 2 cols, they handle it. 
                        But the design shows a specific right column. We can make this optional or built-in.
                        Let's check if the child needs 'full width' or 'sidebar'. 
                        For flexibility, we'll let children define the grid, this `div` is just the white canvas. */}

                </div>
            </div>
        </div>
    );
}

// Helper to wrap pages easily
export const withDashboardLayout = (Component: React.ComponentType, userType: 'citizen' | 'authority' = 'citizen') => {
    return (props: any) => (
        <ModernDashboardLayout userType={userType}>
            <Component {...props} />
        </ModernDashboardLayout>
    );
};
