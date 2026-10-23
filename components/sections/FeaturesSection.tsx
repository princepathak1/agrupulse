'use client';

import React from 'react';
import { Check, Clock, Eye, Server, Cpu, Key, MessageCircle, Thermometer } from 'lucide-react';

export function FeaturesSection() {
  const mvpFeatures = [
    {
      icon: Eye,
      title: 'Quantized YOLOv8 Visual Decay Classifier',
      desc: 'Real-time inference yielding structured freshness classes (Fresh, Ripe, Overripe, Spoiled), a numerical decay index (0–100), and surface spoilage % with visual bounding boxes.',
      status: 'MVP Ready',
      statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    },
    {
      icon: Server,
      title: 'FastMCP Price Lookup Tools',
      desc: 'Standardized Model Context Protocol server exposing automated lookup tools for Agmarknet and e-NAM feeds across 2,400+ Indian APMCs.',
      status: 'MVP Ready',
      statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    },
    {
      icon: Cpu,
      title: 'Autonomous Distance-Decay Routing Agent',
      desc: 'Mathematical optimization engine that calculates transit decay vs. freight cost trade-offs and recommends the highest net-return destination Mandi.',
      status: 'MVP Ready',
      statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    },
  ];

  const plannedFeatures = [
    {
      icon: Key,
      title: 'Descope OAuth & IAM Protection',
      desc: 'Frictionless passwordless authentication (Passkeys, WhatsApp OTP) securing agent-to-buyer transaction dispatches and KYC for commission agents.',
      status: 'Planned',
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    },
    {
      icon: MessageCircle,
      title: 'Automated WhatsApp / Twilio Buyer Dispatches',
      desc: 'Instant dispatch manifests and estimated arrival notices sent directly to wholesale buyers and APMC traders via WhatsApp Business API.',
      status: 'Planned',
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    },
    {
      icon: Thermometer,
      title: 'Hardware Cold-Chain IoT Telemetry',
      desc: 'Direct integration with Bluetooth low-energy reefer container sensors tracking real-time ambient temperature, humidity, and ethylene ppm.',
      status: 'Planned',
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[var(--muted-bg)]/30 border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <span>Capabilities Scope</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
            Core Features &amp; Project Scope
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Clearly delineating current functional MVP deliverables from upcoming enterprise roadmap extensions.
          </p>
        </div>

        {/* Two Columns: MVP vs Planned */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* MVP Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-xl font-bold text-[var(--foreground)]">Must-Have (MVP Deliverables)</h3>
              <span className="ml-auto text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                3 Features Live
              </span>
            </div>

            <div className="space-y-4">
              {mvpFeatures.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-xs hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${feat.statusColor}`}>
                        {feat.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--foreground)]">{feat.title}</h4>
                    <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planned Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="text-xl font-bold text-[var(--foreground)]">Nice-to-Have (Planned Enhancements)</h3>
              <span className="ml-auto text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Roadmap Preview
              </span>
            </div>

            <div className="space-y-4">
              {plannedFeatures.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-xs hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${feat.statusColor}`}>
                        {feat.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--foreground)]">{feat.title}</h4>
                    <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
