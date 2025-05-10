// src/contexts/theme-provider.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'gamer';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: 'light', // Default to light
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'app-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeInternal] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme && ['light', 'dark', 'gamer'].includes(storedTheme)) {
        return storedTheme;
      }
    } catch (e) {
      // localStorage can be unavailable (e.g., private browsing) or throw errors
      console.error('Error reading theme from localStorage:', e);
    }
    return defaultTheme;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;

    root.classList.remove('dark', 'gamer'); // Remove other theme classes

    if (theme !== 'light') {
      // Add class only if not 'light' (assuming 'light' is the default state with no class)
      root.classList.add(theme);
    }
    // If theme is 'light', no class is added, relying on :root styles from globals.css

    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [theme, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeInternal(newTheme);
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
