'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Network, Sparkles, Navigation, ShieldCheck, Activity, MapPin } from 'lucide-react';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';

export function HeroSection() {
  const { t } = useThemeLanguage();

  // Dynamic ticking simulation for Hero visual
  const [decayValue, setDecayValue] = useState(38);
  const [shelfHours, setShelfHours] = useState(48);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scanStep === 0) {
      setDecayValue(38);
      setShelfHours(48);
    } else if (scanStep === 1) {
      setDecayValue(42);
      setShelfHours(42);
    } else if (scanStep === 2) {
      setDecayValue(45);
      setShelfHours(36);
    } else {
      setDecayValue(40);
      setShelfHours(46);
    }
  }, [scanStep]);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-topo-grid border-b border-[var(--border)]">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Pitch & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1b4332]/10 dark:bg-emerald-950/60 text-[#1b4332] dark:text-emerald-300 border border-[#1b4332]/20 dark:border-emerald-700/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.hero.badge}</span>
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                MCP-Native
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.12]">
              <span>{t.hero.titleLine1}</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-amber-600 dark:from-[#52b788] dark:via-[#74c69d] dark:to-amber-400">
                {t.hero.titleLine2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#1b4332] hover:bg-[#24583f] dark:bg-[#52b788] dark:hover:bg-[#40916c] dark:text-[#0a120e] shadow-md hover:shadow-lg transition-all text-sm group"
              >
                <span>{t.hero.ctaDemo}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#architecture"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--muted-bg)] border border-[var(--border)] shadow-xs transition-all text-sm"
              >
                <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.hero.ctaArchitecture}</span>
              </a>
            </div>

            {/* Key Value Micro-metrics */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[var(--border)] max-w-xl mx-auto lg:mx-0">
              <div className="text-left">
                <div className="text-xs text-[var(--muted)]">Detection Edge</div>
                <div className="font-mono font-bold text-sm text-[var(--foreground)]">YOLOv8 INT8</div>
              </div>
              <div className="text-left border-l border-[var(--border)] pl-3">
                <div className="text-xs text-[var(--muted)]">Arbitration Engine</div>
                <div className="font-mono font-bold text-sm text-[var(--foreground)]">FastMCP Agent</div>
              </div>
              <div className="text-left border-l border-[var(--border)] pl-3">
                <div className="text-xs text-[var(--muted)]">Price Feeds</div>
                <div className="font-mono font-bold text-sm text-[var(--foreground)]">Agmarknet / e-NAM</div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Visual Demonstration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm p-5 overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  <span className="font-semibold text-[var(--foreground)]">{t.hero.scannerLabel}</span>
                </div>
                <span className="text-[11px] text-[var(--secondary)]">Batch #AG-409</span>
              </div>

              {/* Simulated Produce Crate Scanner Window */}
              <div className="relative h-64 rounded-xl bg-[#F4F6F2] dark:bg-[#18221B] overflow-hidden flex items-center justify-center border border-[var(--border)]">
                {/* SVG Visual Representation of Produce Crate */}
                <svg viewBox="0 0 320 200" className="w-full h-full p-4">
                  {/* Crate Base Outline */}
                  <rect x="25" y="45" width="270" height="135" rx="8" fill="#E2E7DF" stroke="#D1D8CD" strokeWidth="1.5" />
                  <line x1="25" y1="85" x2="295" y2="85" stroke="#D1D8CD" strokeWidth="1" strokeDasharray="4 2" />
                  <line x1="25" y1="125" x2="295" y2="125" stroke="#D1D8CD" strokeWidth="1" strokeDasharray="4 2" />
                  
                  {/* Produce Clustered items */}
                  <circle cx="80" cy="115" r="28" fill="#DC2626" opacity="0.9" />
                  <circle cx="130" cy="110" r="26" fill="#EF4444" opacity="0.9" />
                  <circle cx="180" cy="118" r="27" fill="#DC2626" opacity="0.9" />
                  <circle cx="230" cy="112" r="26" fill="#EF4444" opacity="0.9" />
                  
                  <circle cx="105" cy="85" r="25" fill="#EF4444" opacity="0.9" />
                  <circle cx="155" cy="80" r="26" fill="#DC2626" opacity="0.9" />
                  <circle cx="205" cy="84" r="25" fill="#EF4444" opacity="0.9" />

                  {/* Tomato Leaves */}
                  <path d="M78 87 Q80 80 86 85" stroke="#28784A" strokeWidth="2.5" fill="none" />
                  <path d="M128 82 Q130 75 136 80" stroke="#28784A" strokeWidth="2.5" fill="none" />
                  <path d="M178 90 Q180 83 186 88" stroke="#28784A" strokeWidth="2.5" fill="none" />
                  <path d="M228 84 Q230 77 236 82" stroke="#28784A" strokeWidth="2.5" fill="none" />

                  {/* Mock Bounding Boxes with Detection Labels */}
                  <rect
                    x="115"
                    y="70"
                    width="85"
                    height="75"
                    rx="4"
                    fill="none"
                    stroke="#B7791F"
                    strokeWidth="1.5"
                  />
                  <rect x="115" y="55" width="75" height="15" rx="3" fill="#B7791F" />
                  <text x="120" y="66" fill="#FFFFFF" fontSize="9" fontWeight="600" fontFamily="system-ui">
                    Soft spot 92%
                  </text>

                  <rect
                    x="60"
                    y="95"
                    width="65"
                    height="60"
                    rx="4"
                    fill="none"
                    stroke="#C4473A"
                    strokeWidth="1.5"
                  />
                  <rect x="60" y="80" width="60" height="15" rx="3" fill="#C4473A" />
                  <text x="64" y="91" fill="#FFFFFF" fontSize="9" fontWeight="600" fontFamily="system-ui">
                    Ripe 96%
                  </text>
                </svg>

                {/* Subtle Scanning Progress Line */}
                <div className="absolute inset-x-0 h-0.5 bg-[var(--primary)] shadow-xs animate-scanline" />

                {/* Floating Inference Pill */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[var(--card)]/90 backdrop-blur-xs border border-[var(--border)] text-[11px] font-medium text-[var(--secondary)] flex items-center gap-1.5 shadow-2xs">
                  <Activity className="w-3 h-3 text-[var(--primary)]" />
                  <span>Computer vision active</span>
                </div>
              </div>

              {/* Real-time Ticking Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--muted-bg)] border border-[var(--border)]">
                  <div className="text-[11px] text-[var(--muted)] flex items-center justify-between">
                    <span>{t.hero.decayIndex}</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">Class: Ripe</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400">
                      {decayValue}%
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">surface spoil</span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="mt-2 w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-700"
                      style={{ width: `${decayValue}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--muted-bg)] border border-[var(--border)]">
                  <div className="text-[11px] text-[var(--muted)] flex items-center justify-between">
                    <span>{t.hero.shelfLife}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      ~{shelfHours}h
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">ambient</span>
                  </div>
                  {/* Cold chain status */}
                  <div className="mt-2 text-[10px] text-[var(--muted)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Cold Chain: +48h cushion</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Route Callout */}
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{t.hero.optimalRoute}</span>
                </div>
                <div className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400/80 flex items-center justify-between">
                  <span>Calculated via FastMCP Agmarknet Arbitrator</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">1,240 km / 26h</span>
                </div>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card)] border border-[var(--card-border)] shadow-lg text-xs font-medium text-[var(--foreground)]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cequence AI Gateway Secured</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
