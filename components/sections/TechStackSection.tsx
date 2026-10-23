'use client';

import React, { useState } from 'react';
import { TECH_CATEGORIES, TECH_STACK } from '@/data/techStack';
import { Layers, Sparkles, Shield, Cpu, Database, Eye, Server } from 'lucide-react';

export function TechStackSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categoryIcons: Record<string, React.ElementType> = {
    'ML & Edge AI': Eye,
    'Agent & Protocols': Cpu,
    'Agricultural Data': Database,
    'Backend & Web': Server,
    'Security & Auth': Shield,
  };

  const filteredItems =
    activeCategory === 'All'
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === activeCategory);

  return (
    <section id="tech-stack" className="py-20 md:py-28 bg-[var(--muted-bg)]/30 border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <Layers className="w-3.5 h-3.5" />
            <span>Modern Systems Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
            Production-Grade Architecture Stack
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Engineered across five cohesive domains: edge computer vision, MCP agent protocols, public APMC telemetry, async backends, and zero-trust API security.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'All'
                ? 'bg-[#1b4332] text-white dark:bg-[#52b788] dark:text-[#0a120e] shadow-xs'
                : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]'
            }`}
          >
            All Disciplines ({TECH_STACK.length})
          </button>
          {TECH_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat];
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#1b4332] text-white dark:bg-[#52b788] dark:text-[#0a120e] shadow-xs'
                    : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Tech Stack Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((tech, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-[var(--card)] border ${
                tech.highlight
                  ? 'border-emerald-500/40 dark:border-emerald-600/40 shadow-xs'
                  : 'border-[var(--card-border)]'
              } hover:shadow-md transition-shadow relative flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--muted-bg)] text-[var(--muted)] border border-[var(--border)]">
                    {tech.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    {tech.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>{tech.name}</span>
                  {tech.highlight && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                </h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  {tech.description}
                </p>
              </div>

              {tech.name.includes('Pluggable') && (
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                  Anthropic Claude 3.5 Sonnet / Groq Llama-3.1-70B / vLLM
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
