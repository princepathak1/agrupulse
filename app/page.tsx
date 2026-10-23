'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { StepperSection } from '@/components/sections/StepperSection';
import { ArchitectureDiagram } from '@/components/sections/ArchitectureDiagram';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { UniqueAngleSection } from '@/components/sections/UniqueAngleSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { RoadmapSection } from '@/components/sections/RoadmapSection';
import { ArrowRight, Cpu, Sparkles, Terminal, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: The Problem */}
        <ProblemSection />

        {/* Section 3: How It Works */}
        <StepperSection />

        {/* Section 4: Interactive Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Section 5: Features (MVP vs Planned) */}
        <FeaturesSection />

        {/* Section 6: Unique Angle Comparison Table */}
        <UniqueAngleSection />

        {/* Section 7: Tech Stack Chips */}
        <TechStackSection />

        {/* Section 8: Live Demo Centerpiece CTA Banner */}
        <section className="py-16 md:py-20 bg-[#174A32] text-white relative overflow-hidden border-y border-[#28784A]/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-emerald-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive intelligence platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
              Test produce assessment and mandi recommendations
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              Assess produce quality using computer vision, calculate remaining shelf life, and compare net realization across Indian APMC mandis after factoring freight and transit decay.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#28784A] hover:bg-[#1f5f3a] text-white shadow-xs transition-colors group"
              >
                <span>Launch interactive demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-emerald-200/60">
              Includes 4 crop samples, 8 Indian APMC mandis, cold-chain simulation, and dynamic reroute testing.
            </p>
          </div>
        </section>

        {/* Section 9: Roadmap */}
        <RoadmapSection />
      </main>

      {/* Section 10: Footer */}
      <Footer />
    </div>
  );
}
