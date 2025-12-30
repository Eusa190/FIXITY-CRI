import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CurrentUser, User, Authority } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
    user: CurrentUser;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; redirect?: string; error?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<CurrentUser>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            if (response.redirect) {
                await refreshUser();
                return { success: true, redirect: response.redirect };
            }
            return { success: false, error: response.error || 'Login failed' };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            setUser(null);
        } catch {
            // Ignore logout errors
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function isUser(user: CurrentUser): user is User {
    return user !== null && user.role === 'citizen';
}

export function isAuthority(user: CurrentUser): user is Authority {
    return user !== null && user.role === 'authority';
}
