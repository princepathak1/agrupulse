'use client';

import React from 'react';
import { Milestone, CheckCircle, Clock, ArrowRight, ShieldCheck, Radio, Sparkles } from 'lucide-react';

export function RoadmapSection() {
  const milestones = [
    {
      quarter: 'Phase 1 • Current Deliverable',
      title: 'MVP: FastMCP Agent & YOLOv8 Inference',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      items: [
        'INT8 Quantized YOLOv8 freshness & decay index classifier.',
        'FastMCP server exposing Agmarknet & e-NAM pricing lookup tools.',
        'Autonomous arbitration agent calculating non-linear distance vs decay net returns.',
        'Lightweight Indian APMC vector routing visualization.',
      ],
    },
    {
      quarter: 'Phase 2 • Upcoming',
      title: 'Descope OAuth & IAM Security Layer',
      status: 'In Progress',
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      items: [
        'Descope passwordless passkey authentication for truck drivers & commission agents.',
        'Role-based access control (RBAC) preventing unauthorized trade execution.',
        'Session-bound digital dispatch tokens signed over mTLS.',
      ],
    },
    {
      quarter: 'Phase 3 • Q3',
      title: 'Automated WhatsApp & Twilio Dispatches',
      status: 'Planned',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      items: [
        'Automated bill-of-lading dispatch notices to APMC trader guilds via WhatsApp Business.',
        'Interactive driver WhatsApp bot for reporting unexpected road closures & checkpoint delays.',
        'Automated wholesale price hedge bidding before cargo arrival.',
      ],
    },
    {
      quarter: 'Phase 4 • Q4',
      title: 'Dynamic Cold-Chain IoT Hardware Telemetry',
      status: 'Research',
      statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      items: [
        'Bluetooth BLE container sensor telemetry logging reefer ambient temperature and humidity.',
        'Ethylene gas ppm monitoring for real-time overripening early warnings.',
        'Autonomous agent dynamic rerouting triggered instantly by refrigeration failure alerts.',
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-20 md:py-28 bg-[var(--background)] border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <Milestone className="w-3.5 h-3.5" />
            <span>Horizon Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
            Product Roadmap &amp; Evolution
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            From the hackathon MVP to a full-stack, enterprise-hardened agricultural logistics autonomous agent network.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {milestones.map((ms, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--muted)]">
                    {ms.quarter}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${ms.statusColor}`}>
                    {ms.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)] leading-snug">
                  {ms.title}
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-[var(--muted)]">
                  {ms.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">›</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)] text-[10px] font-mono text-[var(--muted)]">
                Stage {idx + 1} of 4
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
