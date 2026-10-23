'use client';

import React from 'react';
import { COMPARISON_DATA } from '@/data/comparison';
import { Check, X, Sparkles, Zap } from 'lucide-react';

export function UniqueAngleSection() {
  return (
    <section id="comparison" className="py-20 md:py-28 bg-[var(--background)] border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Unique Paradigm</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
            Typical Crop Apps vs. AgruPulse MCP
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Why turning computer vision into an active autonomous financial logistics tool fundamentally changes the economics of post-harvest management.
          </p>
        </div>

        {/* Highlight Callout Box */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#183928] to-[#122b1f] text-white border border-emerald-800/80 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0 font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-300">
                The Fundamental Breakthrough
              </h3>
              <p className="mt-1 text-sm text-neutral-200 leading-relaxed">
                Crop-disease apps diagnose leaf fungi and offer static spraying advice. <strong>AgruPulse MCP</strong> bridges computer-vision produce quality directly to live APMC market prices via the Model Context Protocol. It executes dynamic distance-decay trade-offs and generates actionable dispatch routes autonomously.
              </p>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="mt-10 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-xs">
              <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
                <thead className="bg-[var(--muted-bg)]">
                  <tr>
                    <th scope="col" className="py-4 px-6 font-semibold text-[var(--foreground)] w-1/4">
                      Dimension
                    </th>
                    <th scope="col" className="py-4 px-6 font-semibold text-rose-700 dark:text-rose-400 w-1/3">
                      Typical Crop Apps (Static Advisory)
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 w-1/3">
                      AgruPulse MCP (Active Arbitration)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {COMPARISON_DATA.map((row, i) => (
                    <tr key={i} className="hover:bg-[var(--muted-bg)]/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[var(--foreground)]">
                        {row.dimension}
                      </td>
                      <td className="py-4 px-6 text-[var(--muted)]">
                        <div className="flex items-start gap-2">
                          <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{row.typicalCropApp}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[var(--foreground)] bg-emerald-500/5 font-medium">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 font-bold" />
                          <span>{row.agruPulseMCP}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
