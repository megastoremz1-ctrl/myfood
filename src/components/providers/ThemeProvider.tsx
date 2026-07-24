'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Locale, translations, TranslationKey } from '@/lib/i18n';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocaleState] = useState<Locale>('pt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('myfood-theme') as Theme | null;
    const savedLocale = localStorage.getItem('myfood-locale') as Locale | null;

    if (savedTheme) setThemeState(savedTheme);
    if (savedLocale) setLocaleState(savedLocale);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const applyTheme = () => {
      let resolved: 'light' | 'dark' = 'light';

      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }

      setResolvedTheme(resolved);

      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme(); };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('myfood-theme', newTheme);
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('myfood-locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, locale, setLocale, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
