'use client';

import React from 'react';
import { AlertTriangle, TrendingDown, Clock, Scale, BookOpen } from 'lucide-react';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';

export function ProblemSection() {
  const { t } = useThemeLanguage();

  const statCards = [
    {
      number: t.problem.stat1Number,
      label: t.problem.stat1Label,
      sub: t.problem.stat1Sub,
      accent: 'border-emerald-500/30',
      badge: 'Food Grains',
    },
    {
      number: t.problem.stat2Number,
      label: t.problem.stat2Label,
      sub: t.problem.stat2Sub,
      accent: 'border-amber-500/30',
      badge: 'Horticulture',
    },
    {
      number: t.problem.stat3Number,
      label: t.problem.stat3Label,
      sub: t.problem.stat3Sub,
      accent: 'border-rose-500/30',
      badge: '~10% Total Output',
      alert: true,
    },
    {
      number: t.problem.stat4Number,
      label: t.problem.stat4Label,
      sub: t.problem.stat4Sub,
      accent: 'border-red-500/30',
      badge: 'Perishables in Transit',
      alert: true,
    },
  ];

  return (
    <section id="problem" className="py-20 md:py-28 bg-[var(--background)] border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.problem.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
            {t.problem.heading}
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {t.problem.subheading}
          </p>
        </div>

        {/* 4 Animated Stat Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-[var(--card)] border ${
                card.alert ? 'border-rose-300 dark:border-rose-900/60' : 'border-[var(--card-border)]'
              } shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--muted-bg)] text-[var(--muted)]">
                  {card.badge}
                </span>
                {card.alert && (
                  <TrendingDown className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[var(--foreground)]">
                {card.number}
              </div>
              <div className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {card.label}
              </div>
              <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Deep Dive Problem Analysis & ICAR Quote */}
        <div className="mt-12 rounded-2xl bg-[var(--muted-bg)] border border-[var(--border)] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Quote / Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Scale className="w-4 h-4" />
                <span>The Core Asymmetry</span>
              </div>
              <p className="text-base sm:text-lg italic text-[var(--foreground)] leading-relaxed">
                {t.problem.quoteText}
              </p>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.problem.citation}</span>
              </div>
            </div>

            {/* Why Static Apps Fail Box */}
            <div className="lg:col-span-4 bg-[var(--card)] p-5 rounded-xl border border-[var(--card-border)] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Why Crop Apps Fall Short
              </h3>
              <ul className="space-y-2 text-xs text-[var(--foreground)]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Passive advisory only:</strong> Diagnoses leaf disease but does nothing for harvest logistics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Static price charts:</strong> No connection between current spoilage and distance to market.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>No mid-transit autonomy:</strong> If refrigeration breaks down or traffic delays, cargo is lost.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
