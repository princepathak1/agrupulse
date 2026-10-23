'use client';

import React from 'react';
import { Camera, Eye, Cpu, Truck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';

export function StepperSection() {
  const { t } = useThemeLanguage();

  const steps = [
    {
      num: '01',
      icon: Camera,
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      tech: 'Mobile Web / Driver App',
      tag: 'Zero Hardware Sensor Required',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      num: '02',
      icon: Eye,
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      tech: 'YOLOv8-Nano (ONNX INT8)',
      tag: 'Sub-15ms Edge Inference',
      accent: 'text-amber-600 dark:text-amber-400',
    },
    {
      num: '03',
      icon: Cpu,
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      tech: 'FastMCP Server + Agmarknet',
      tag: 'Autonomous Multi-Agent Tools',
      accent: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      num: '04',
      icon: Truck,
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
      tech: 'Cequence Gateway + Descope',
      tag: 'Cryptographic Dispatch Order',
      accent: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[var(--muted-bg)]/40 border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.howItWorks.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
            {t.howItWorks.heading}
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {t.howItWorks.subheading}
          </p>
        </div>

        {/* 4-Step Stepper Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl bg-[var(--card)] border border-[var(--card-border)] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-neutral-300 dark:text-neutral-700 group-hover:text-amber-500 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--muted-bg)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-5 h-5 ${step.accent}`} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Step Metadata Footer */}
                <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold text-[var(--foreground)]">
                    {step.tech}
                  </div>
                  <div className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--muted-bg)] text-[var(--muted)] border border-[var(--border)]">
                    {step.tag}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unique Value Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#163829] to-[#0f241a] text-white border border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-emerald-200">
              The AgruPulse Difference: Active Decision Autonomy
            </h4>
            <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
              Unlike static advisory apps that simply display prices, AgruPulse acts on your produce’s internal clock. 
              The FastMCP agent balances shelf-life degradation vs. diesel freight cost to find the mathematically optimal Mandi.
            </p>
          </div>
          <a
            href="/demo"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono tracking-wide transition-all"
          >
            <span>Test Scenario in Demo</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
