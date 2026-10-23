'use client';

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';

export function DemoBanner() {
  const { lang } = useThemeLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-[var(--muted-bg)] border-b border-[var(--border)] text-[var(--secondary-text)] px-4 py-2 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
          <p className="leading-relaxed">
            <span className="font-medium text-[var(--foreground)]">
              {lang === 'hi' ? 'सिमुलेशन मोड:' : 'Simulation mode:'}
            </span>{' '}
            {lang === 'hi'
              ? 'यह वातावरण भारतीय मंडियों और कोल्ड-चेन टेलीमेट्री के मॉडलिंग डेटा का उपयोग करता है।'
              : 'This sandbox uses simulated APMC market data and cold-chain telemetry models for demonstration.'}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss notice"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
