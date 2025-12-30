import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'public' | 'monitoring';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Get from localStorage or default to 'public'
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('fixity-theme') as Theme) || 'public';
        }
        return 'public';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('fixity-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'public' ? 'monitoring' : 'public');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
