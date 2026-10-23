'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { PanelCaptureGrade } from '@/components/demo/PanelCaptureGrade';
import { PanelAgentReasoning } from '@/components/demo/PanelAgentReasoning';
import { PanelArbitration } from '@/components/demo/PanelArbitration';
import { COMMODITY_PRESETS } from '@/data/commodities';
import { ORIGIN_CITIES, resolveOriginLocation } from '@/data/mandis';
import { calculateArbitration, simulateMidTransitDegradation } from '@/lib/arbitrationEngine';
import { generateMCPToolCalls } from '@/lib/mcpSimulator';
import { analyzeImagePixels } from '@/lib/visionEngine';
import { analyzeProduceImage } from '@/lib/geminiVision';
import { ArbitrationKnobs, ProducePreset } from '@/lib/types';
import { Sparkles, Terminal, Activity, ArrowLeft } from 'lucide-react';
import { useThemeLanguage } from '@/components/layout/ThemeLanguageContext';
import Link from 'next/link';

export default function DemoPage() {
  const { lang, t } = useThemeLanguage();
  const [currentPreset, setCurrentPreset] = useState<ProducePreset>(COMMODITY_PRESETS[0]);
  const [knobs, setKnobs] = useState<ArbitrationKnobs>({
    commodityId: COMMODITY_PRESETS[0].id,
    quantityKg: COMMODITY_PRESETS[0].defaultQuantityKg,
    originCityId: 'nashik',
    transportCostPerKm: 28,
    coldChainEnabled: true,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecutingAgent, setIsExecutingAgent] = useState(false);
  const [isRerouted, setIsRerouted] = useState(false);
  const [rerouteReason, setRerouteReason] = useState<string | undefined>();

  // Run arbitration calculation
  const originObj = resolveOriginLocation(knobs.originCityId, knobs.customOriginCoords, knobs.customOriginName);
  const originName = knobs.customOriginName || originObj.name;
  const calculation = calculateArbitration(knobs, currentPreset);
  const toolCalls = generateMCPToolCalls(
    currentPreset,
    originName,
    calculation.results,
    calculation.recommended,
    knobs.coldChainEnabled
  );

  const handleSelectPreset = (preset: ProducePreset) => {
    setIsAnalyzing(true);
    setIsRerouted(false);
    setCurrentPreset(preset);
    setKnobs((prev) => ({
      ...prev,
      commodityId: preset.id,
      quantityKg: preset.defaultQuantityKg,
      decayIndexOverride: undefined,
    }));

    setTimeout(() => {
      setIsAnalyzing(false);
      setIsExecutingAgent(true);
    }, 600);
  };

  const handleCustomAnalyze = async (file?: File, customUrl?: string, commodityHint?: string) => {
    setIsAnalyzing(true);
    setIsRerouted(false);

    // Execute Google AI Studio Gemini Multimodal Vision analysis (with automated local CV fallback)
    const imageTarget = customUrl || file || '';
    const targetCrop = commodityHint || knobs.commodityId;
    
    try {
      const { pixelResult, geminiResult, isAI } = await analyzeProduceImage(
        imageTarget,
        currentPreset,
        targetCrop
      );

      // Determine matching known commodity ID for mandi price arbitration
      let matchedCommodityId = currentPreset.id;
      const detectedName = (geminiResult?.detectedCrop || pixelResult.detectedCropType || '').toLowerCase();
      if (detectedName.includes('banana')) matchedCommodityId = 'banana';
      else if (detectedName.includes('mango')) matchedCommodityId = 'mango';
      else if (detectedName.includes('potato')) matchedCommodityId = 'potato';
      else if (detectedName.includes('onion')) matchedCommodityId = 'onion';
      else if (detectedName.includes('apple')) matchedCommodityId = 'apple';
      else if (detectedName.includes('tomato')) matchedCommodityId = 'tomato';

      const updatedPreset: ProducePreset = {
        ...currentPreset,
        id: file ? `custom-${file.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}` : currentPreset.id,
        name: geminiResult?.detectedCrop
          ? `${geminiResult.detectedCrop} (Gemini AI)`
          : file
          ? `Photo: ${pixelResult.detectedCropType.split('/')[0].trim()}`
          : currentPreset.name,
        nameHindi: geminiResult?.detectedCropHindi || currentPreset.nameHindi,
        emoji: geminiResult?.emoji || currentPreset.emoji,
        freshnessClass: geminiResult?.freshnessClass || pixelResult.freshnessClass,
        decayIndex: geminiResult?.decayIndex ?? pixelResult.decayIndex,
        surfaceSpoilagePercent: geminiResult?.surfaceSpoilagePercent ?? pixelResult.surfaceSpoilagePercent,
        shelfLifeHours: geminiResult?.shelfLifeHours ?? pixelResult.shelfLifeHours,
        baseDecayRatePerHour: geminiResult?.baseDecayRatePerHour ?? currentPreset.baseDecayRatePerHour,
        boundingBoxes: geminiResult?.boundingBoxes || pixelResult.boundingBoxes,
        description: geminiResult?.pathologySummary || pixelResult.summary,
        descriptionHindi: geminiResult?.pathologySummaryHindi || currentPreset.descriptionHindi,
        aiAnalysis: isAI && geminiResult
          ? {
              provider: geminiResult.provider,
              model: geminiResult.modelUsed,
              pathologySummary: geminiResult.pathologySummary,
              pathologySummaryHindi: geminiResult.pathologySummaryHindi,
              storageRecommendation: geminiResult.storageRecommendation,
              dispatchRecommendation: geminiResult.dispatchRecommendation,
              detectedCropType: geminiResult.detectedCrop,
              latencyMs: geminiResult.latencyMs,
              defectCount: geminiResult.boundingBoxes.length,
            }
          : undefined,
      };

      setCurrentPreset(updatedPreset);
      setKnobs((prev) => ({
        ...prev,
        commodityId: matchedCommodityId,
        decayIndexOverride: undefined,
      }));
      setIsAnalyzing(false);
      setIsExecutingAgent(true);
    } catch (err) {
      console.error('Error during produce analysis:', err);
      setIsAnalyzing(false);
      setIsExecutingAgent(true);
    }
  };

  const handleTriggerReroute = () => {
    if (isRerouted) {
      // Toggle back to normal
      setIsRerouted(false);
      setRerouteReason(undefined);
      setKnobs((prev) => ({ ...prev, decayIndexOverride: undefined }));
      setIsExecutingAgent(true);
    } else {
      const { updatedKnobs, rerouteReason } = simulateMidTransitDegradation(knobs, currentPreset);
      setKnobs(updatedKnobs);
      setIsRerouted(true);
      setRerouteReason(rerouteReason);
      setIsExecutingAgent(true);
    }
  };

  const handleReplayAgent = () => {
    setIsExecutingAgent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      <DemoBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Page Introduction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-[var(--primary)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28784A]" />
                {t.demo.activeDaemon}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {t.demo.bannerTitle}
            </h1>
            <p className="text-sm text-[var(--secondary-text)] mt-1 max-w-3xl leading-relaxed">
              {t.demo.bannerDesc}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--secondary-text)] hover:text-[var(--foreground)] transition-colors self-start sm:self-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.demo.backToOverview}</span>
          </Link>
        </div>

        {/* Workspace: 2-Column Responsive Layout (5 cols left, 7 cols right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Produce Quality Assessment & AI Pipeline (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <PanelCaptureGrade
              currentPreset={currentPreset}
              onSelectPreset={handleSelectPreset}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleCustomAnalyze}
            />

            <PanelAgentReasoning
              toolCalls={toolCalls}
              isExecuting={isExecutingAgent}
              onReplay={handleReplayAgent}
            />
          </div>

          {/* Right Column: Mandi Recommendations & Logistics Optimization (7 cols) */}
          <div className="lg:col-span-7">
            <PanelArbitration
              knobs={knobs}
              onKnobsChange={(newKnobs) => {
                setKnobs(newKnobs);
                setIsExecutingAgent(true);
              }}
              results={calculation.results}
              recommended={calculation.recommended}
              nearest={calculation.nearest}
              reasoning={calculation.reasoning}
              isRerouted={isRerouted}
              rerouteReason={rerouteReason}
              onTriggerReroute={handleTriggerReroute}
              currentPreset={currentPreset}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
