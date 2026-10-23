'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Languages, ArrowRight, Menu, X, Sprout } from 'lucide-react';
import { useThemeLanguage } from './ThemeLanguageContext';

export function Navbar() {
  const { theme, toggleTheme, lang, setLang, t } = useThemeLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDemoPage = pathname === '/demo';

  const navLinks = [
    { href: '/#problem', label: t.nav.problem },
    { href: '/#how-it-works', label: t.nav.howItWorks },
    { href: '/#architecture', label: t.nav.architecture },
    { href: '/#features', label: t.nav.features },
    { href: '/#tech-stack', label: t.nav.techStack },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--card)] border-b border-[var(--border)] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#174A32] flex items-center justify-center text-white shadow-2xs group-hover:bg-[#28784A] transition-colors">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-[var(--foreground)]">
              AgruPulse
            </span>
            <span className="text-xs text-[var(--secondary-text)] -mt-0.5">
              Produce intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        {!isDemoPage ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--secondary-text)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[var(--primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link
              href="/"
              className="text-[var(--secondary-text)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5"
            >
              <span>← Back to overview</span>
            </Link>
          </nav>
        )}

        {/* Actions: Language, Theme, Launch CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted-bg)] text-[var(--foreground)] transition-colors cursor-pointer"
            title="Toggle English / हिन्दी"
            aria-label="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-[var(--secondary-text)]" />
            <span className="font-medium">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted-bg)] text-[var(--secondary-text)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Action Button */}
          {!isDemoPage ? (
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#28784A] hover:bg-[#1f613b] text-white shadow-2xs transition-colors"
            >
              <span>Launch platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-md bg-[var(--primary-surface)] text-[var(--primary-dark)] dark:text-emerald-300 font-medium border border-[#28784A]/20">
              Produce & Mandi Lab
            </span>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--foreground)] border border-[var(--border)]"
            aria-label="Open Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--card)] px-4 pt-2 pb-4 space-y-2">
          {!isDemoPage ? (
            navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] border-b border-[var(--border)]/50"
              >
                {link.label}
              </a>
            ))
          ) : (
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[var(--foreground)]"
            >
              ← Back to overview
            </Link>
          )}
          <div className="pt-2">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#28784A] text-white"
            >
              <span>Launch platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
