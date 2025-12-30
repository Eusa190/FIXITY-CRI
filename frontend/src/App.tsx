import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Report from './pages/Report';
import Profile from './pages/Profile';
import AuthorityDashboard from './pages/AuthorityDashboard';
import CommunityFeed from './pages/CommunityFeed';
import CRIMap from './pages/CRIMap';
import HowCRIWorks from './pages/HowCRIWorks';
import Accountability from './pages/Accountability';
import SystemStatus from './pages/SystemStatus';
import IssueDetail from './pages/IssueDetail';
import Ethics from './pages/Ethics';
import Analytics from './pages/Analytics';
import { ModernDashboardLayout } from './components/layout/ModernDashboardLayout';
import './index.css';

// Simple ProtectedRoute
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] text-neutral-400 text-xs font-mono uppercase tracking-widest">Verifying Access...</div>;
    }

    return user ? children : <Navigate to="/login" replace />;
};

// Global Dashboard Wrapper
const DashboardLayoutWrapper = () => {
    const { user } = useAuth();
    // Default to citizen if not logged in (guest view), or authority if authority
    const userType = user?.role === 'authority' ? 'authority' : 'citizen';

    return (
        <ModernDashboardLayout userType={userType}>
            <Outlet />
        </ModernDashboardLayout>
    );
};

function AppContent() {
    const location = useLocation();

    // Navbar Logic: ONLY show on Landing Page (/)
    // Hide everywhere else
    const isLandingPage = location.pathname === '/';
    const shouldShowNavbar = isLandingPage;

    // Footer Logic: Hide on dashboard pages and auth pages
    // Show only on Landing (maybe?) or same as Navbar?
    // User requested "one page website like something", usually implies persistent sidebar elsewhere.
    // Let's hide footer on dashboard routes to avoid double scrollbars or layout issues.
    const shouldShowFooter = isLandingPage;

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowNavbar && <Navbar />}
            <main className="flex-1 flex flex-col">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Dashboard Routes (Wrapped in Global Sidebar) */}
                    <Route element={<DashboardLayoutWrapper />}>
                        <Route path="/map" element={<CRIMap />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="/community" element={<CommunityFeed />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/how-cri-works" element={<HowCRIWorks />} />
                        <Route path="/accountability" element={<Accountability />} />
                        <Route path="/system-status" element={<SystemStatus />} />
                        <Route path="/issue/:id" element={<IssueDetail />} />
                        <Route path="/ethics" element={<Ethics />} />

                        {/* Protected Authority Routes */}
                        <Route path="/authority/*" element={
                            <ProtectedRoute>
                                <AuthorityDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute>
                                <Analytics />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </main>
            {shouldShowFooter && <Footer />}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
