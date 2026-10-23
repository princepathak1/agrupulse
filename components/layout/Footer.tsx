'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Mail, ShieldCheck, ExternalLink, Code2 } from 'lucide-react';
import { useThemeLanguage } from './ThemeLanguageContext';

export function Footer() {
  const { lang } = useThemeLanguage();
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-muted)]/60 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--border)]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#174A32] flex items-center justify-center text-white">
                <Sprout className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="font-semibold text-lg text-[var(--foreground)]">AgruPulse</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-accent)] text-[var(--brand-dark)] font-medium border border-[var(--primary)]/20">
                {lang === 'hi' ? 'कृषि आसूचना' : 'Produce intelligence'}
              </span>
            </div>
            <p className="text-sm text-[var(--secondary)] max-w-md leading-relaxed">
              {lang === 'hi'
                ? 'तुड़ाई उपरांत कृषि गुणवत्ता विश्लेषण, शेल्फ-लाइफ मूल्यांकन एवं अंतर्राज्यीय मंडी अनुशंसा मंच।'
                : 'Autonomous post-harvest quality assessment, shelf-life estimation, and inter-state wholesale mandi intelligence platform.'}
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-[var(--secondary)] bg-[var(--card)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              <span>
                {lang === 'hi'
                  ? 'सिमुलेटेड डेटा सैंडबॉक्स — निर्णय मार्गदर्शन हेतु'
                  : 'Simulated data sandbox — Designed for logistics decision evaluation'}
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/demo" className="hover:text-[var(--primary)] transition-colors">YOLOv8 Edge Vision Lab</Link></li>
              <li><Link href="/demo" className="hover:text-[var(--primary)] transition-colors">FastMCP Tool Execution Log</Link></li>
              <li><Link href="/demo" className="hover:text-[var(--primary)] transition-colors">Distance-Decay Arbitrator</Link></li>
              <li><a href="#architecture" className="hover:text-[var(--primary)] transition-colors">Cequence AI Security Gateway</a></li>
              <li><a href="#architecture" className="hover:text-[var(--primary)] transition-colors">Descope Auth Architecture</a></li>
            </ul>
          </div>

          {/* Hackathon & Links */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
              Project Links
            </h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:hackathon@agrupulse-mcp.org"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Developer Contact</span>
                </a>
              </li>
              <li className="pt-2">
                <span className="text-xs text-[var(--muted)] block">
                  Built for Hackathon &amp; Technical Portfolio Showcase.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <p>© 2026 AgruPulse MCP. Open-source research prototype under MIT License.</p>
          <div className="flex items-center gap-6">
            <span>Citations: ICAR Reports to Parliament</span>
            <span>Dataset: Kaggle Harvest Freshness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
