'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TRANSLATIONS } from '@/data/translations';

interface ThemeLanguageContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export function ThemeLanguageProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<Language>('en');

  const applyTheme = (t: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
  };

  useEffect(() => {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('agrupulse-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const savedLang = localStorage.getItem('agrupulse-lang') as Language | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLang(savedLang);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('agrupulse-theme', next);
      applyTheme(next);
      return next;
    });
  };

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('agrupulse-lang', newLang);
  };

  const t = TRANSLATIONS[lang];

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang: handleSetLang,
        t,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
}

export function useThemeLanguage() {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
}
