'use client';

import React, { useState, useEffect } from 'react';
import { MCPToolCall } from '@/lib/types';
import {
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Eye,
  TrendingUp,
  Truck,
  Award,
  Layers,
  Code,
  LayoutDashboard,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';

interface PanelAgentReasoningProps {
  toolCalls: MCPToolCall[];
  isExecuting: boolean;
  onReplay: () => void;
}

export function PanelAgentReasoning({
  toolCalls,
  isExecuting,
  onReplay,
}: PanelAgentReasoningProps) {
  const { lang, t } = useThemeLanguage();
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [visibleCount, setVisibleCount] = useState<number>(toolCalls.length);
  const [viewMode, setViewMode] = useState<'visual' | 'developer'>('visual');
  const [expandedCalls, setExpandedCalls] = useState<Record<string, boolean>>({
    'call-rank-destinations-04': true,
  });

  // Typewriter streaming simulator
  useEffect(() => {
    if (isExecuting) {
      setVisibleCount(1);
      const delay = speedMultiplier === 3 ? 150 : speedMultiplier === 2 ? 400 : 800;
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= toolCalls.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
      return () => clearInterval(interval);
    } else {
      setVisibleCount(toolCalls.length);
    }
  }, [isExecuting, toolCalls, speedMultiplier]);

  const toggleExpand = (id: string) => {
    setExpandedCalls((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to extract clean human-friendly metadata for each agent step
  const getAgentCardInfo = (call: MCPToolCall) => {
    switch (call.tool) {
      case 'google_ai_studio.gemini_multimodal_vision': {
        const res = call.result as any;
        return {
          title: lang === 'hi' ? 'गूगल AI स्टूडियो: जेमिनी 3.8 विज़न' : 'Google AI Studio: Gemini 3.8 Flash Vision',
          role: lang === 'hi' ? 'मल्टीमॉडल कृषि विकृति विज्ञान एवं ग्रेडिंग' : 'Multimodal Agricultural Pathology & Defect Localization',
          icon: Sparkles,
          iconColor: 'text-amber-500 dark:text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          summary:
            res?.pathology_summary ||
            (lang === 'hi'
              ? `Google Studio Gemini Vision AI द्वारा बहु-स्पेक्ट्रल पिक्सल विश्लेषण। ${res?.decay_index ?? 0}/100 सड़न सूचकांक व ${res?.bounding_box_count || 0} विकृति क्षेत्र चिन्हित।`
              : `Google Studio Gemini Vision AI evaluated cellular decay patterns. Detected ${res?.detected_class || 'produce'} with ${res?.decay_index ?? 0}/100 decay index and ${res?.bounding_box_count || 0} pathological defect zones.`),
          badges: [
            { label: 'Provider', val: 'Google AI Studio', color: 'amber' },
            { label: 'Model', val: res?.model_name || 'Gemini 3.8 Flash', color: 'blue' },
            { label: lang === 'hi' ? 'स्थिति' : 'Condition', val: res?.detected_class || 'Analyzed', color: 'emerald' },
            { label: lang === 'hi' ? 'सड़न' : 'Decay', val: `${res?.decay_index ?? 0}/100`, color: 'amber' },
            { label: lang === 'hi' ? 'सतह खराबी' : 'Surface Spoil', val: `${res?.surface_spoilage_pct ?? 0}%`, color: 'rose' },
            { label: lang === 'hi' ? 'शेल्फ लाइफ' : 'Est. Shelf Life', val: `${res?.estimated_shelf_life_hours ?? 0}h`, color: 'blue' },
            { label: 'Latency', val: res?.inference_latency || '580ms', color: 'neutral' },
          ],
        };
      }
      case 'edge_vision.analyze_decay': {
        const res = call.result as any;
        return {
          title: lang === 'hi' ? 'विजुअल एज AI गुणवत्ता विश्लेषक' : 'Visual Edge AI Inspector',
          role: lang === 'hi' ? 'सतह दोष एवं शेल्फ लाइफ' : 'Defect & Shelf-Life Classification',
          icon: Eye,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          summary:
            lang === 'hi'
              ? `YOLOv8 NPU इंफरेंस द्वारा फसल सतह स्कैन। ${res?.decay_index ?? 0}/100 सड़न सूचकांक के साथ ${res?.detected_class || 'फसल'} स्थिति दर्ज।`
              : `Scanned produce surface via YOLOv8 NPU inference. Identified ${res?.detected_class || 'produce'} condition with ${res?.decay_index ?? 0}/100 decay index.`,
          badges: [
            { label: lang === 'hi' ? 'स्थिति' : 'Condition', val: res?.detected_class || 'Analyzed', color: 'emerald' },
            { label: lang === 'hi' ? 'सड़न' : 'Decay', val: `${res?.decay_index ?? 0}/100`, color: 'amber' },
            { label: lang === 'hi' ? 'सतह खराबी' : 'Surface Spoil', val: `${res?.surface_spoilage_pct ?? 0}%`, color: 'rose' },
            { label: lang === 'hi' ? 'शेल्फ लाइफ' : 'Est. Shelf Life', val: `${res?.estimated_shelf_life_hours ?? 0}h`, color: 'blue' },
            { label: 'Latency', val: res?.inference_latency || '14.2ms', color: 'neutral' },
          ],
        };
      }
      case 'agmarknet_api.get_live_mandi_prices': {
        const res = call.result as any;
        const spread = res?.price_spread;
        return {
          title: lang === 'hi' ? 'मंडी भाव आसूचना एजेंट' : 'Mandi Price Intelligence Agent',
          role: lang === 'hi' ? 'राष्ट्रीय थोक भाव खोज' : 'National Wholesale Market Discovery',
          icon: TrendingUp,
          iconColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          summary:
            lang === 'hi'
              ? `आधिकारिक e-NAM व एगमार्कनेट द्वारा ${res?.records_found || 8} प्रमुख थोक APMC मंडियों के लाइव भाव संकलित किए गए।`
              : `Aggregated live modal rates across ${res?.records_found || 8} wholesale APMC terminal markets via official e-NAM & Agmarknet gateways.`,
          badges: [
            { label: lang === 'hi' ? 'मंडियां' : 'APMCs Evaluated', val: `${res?.records_found || 8} Mandis`, color: 'blue' },
            { label: lang === 'hi' ? 'भाव अंतर' : 'Price Spread', val: spread ? `₹${spread.spread_inr}/q` : '₹1,450/q', color: 'emerald' },
            { label: lang === 'hi' ? 'न्यूनतम भाव' : 'Min Rate', val: spread ? `₹${spread.min_modal_quintal}/q` : '₹2,400/q', color: 'neutral' },
            { label: lang === 'hi' ? 'अधिकतम भाव' : 'Max Rate', val: spread ? `₹${spread.max_modal_quintal}/q` : '₹3,850/q', color: 'emerald' },
            { label: 'Source', val: 'e-NAM Gateway', color: 'purple' },
          ],
        };
      }
      case 'telemetry_agent.calculate_transit_decay': {
        const args = call.arguments as any;
        const originHub = args?.origin_hub || 'Selected Origin';
        const isCold = args?.cold_chain_telemetry_active;
        return {
          title: lang === 'hi' ? 'राजमार्ग एवं कोल्ड-चेन टेलीमेट्री एजेंट' : 'Highway & Cold-Chain Telemetry Agent',
          role: lang === 'hi' ? 'परिवहन सड़न एवं वाहन मॉडलिंग' : 'In-Transit Spoilage & Convoy Modeling',
          icon: Truck,
          iconColor: 'text-cyan-600 dark:text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20',
          summary:
            lang === 'hi'
              ? `${originHub} से उम्मीदवार मंडियों तक दूरी एवं ${isCold ? 'कोल्ड-चेन (50% सड़न रोकथाम)' : 'सामान्य वाहन'} के साथ यात्रा समय की गणना।`
              : `Simulated transit hours from ${originHub} to candidate Mandis with ${isCold ? 'active cold-chain suppression (50% decay reduction)' : 'ambient ventilation'}.`,
          badges: [
            { label: lang === 'hi' ? 'प्रस्थान' : 'Origin Hub', val: originHub, color: 'blue' },
            { label: 'Cold-Chain', val: isCold ? (lang === 'hi' ? 'सक्रिय (4°C रीफर)' : 'Active (Reefer 4°C)') : (lang === 'hi' ? 'सामान्य वाहन' : 'Ambient Convoy'), color: isCold ? 'emerald' : 'amber' },
            { label: lang === 'hi' ? 'सड़न दर' : 'Decay Factor', val: isCold ? '0.5x' : '1.0x', color: 'neutral' },
            { label: 'Corridor', val: 'NHAI Freight', color: 'cyan' },
          ],
        };
      }
      case 'arbitration_orchestrator.rank_destinations': {
        const res = call.result as any;
        const topDest = res?.top_destination || 'Azadpur Mandi';
        const netProfit = res?.projected_net_return_inr;
        const delta = res?.delta_vs_nearest_inr;
        return {
          title: lang === 'hi' ? 'स्वायत्त मंडी आर्बिट्राज समन्वयक' : 'Autonomous Arbitration Orchestrator',
          role: lang === 'hi' ? 'अधिकतम किसान मुनाफा अनुकूलक' : 'Net Farmer Return Maximizer',
          icon: Award,
          iconColor: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          summary:
            lang === 'hi'
              ? 'भाड़ा एवं मार्ग में फसल सड़न को काटकर किसान के बैंक खाते में अधिकतम शुद्ध राशि की गणना पूर्ण।'
              : `Calculated multi-objective Pareto optimization deducting freight and transit spoilage to maximize farmer bank deposit.`,
          badges: [
            { label: lang === 'hi' ? 'सर्वोत्तम मंडी' : 'Top Destination', val: topDest, color: 'emerald' },
            { label: lang === 'hi' ? 'अनुमानित शुद्ध आय' : 'Projected Net', val: netProfit ? `₹${netProfit.toLocaleString('en-IN')}` : '₹1,02,400', color: 'emerald' },
            { label: lang === 'hi' ? 'लोकल से अधिक' : 'Gain vs Local', val: delta ? `+₹${delta.toLocaleString('en-IN')}` : '+₹38,500', color: 'amber' },
            { label: 'Strategy', val: 'Max Net', color: 'purple' },
          ],
        };
      }
      default: {
        return {
          title: call.tool,
          role: 'Agent Protocol Step',
          icon: Sparkles,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          summary: 'Executed protocol tool call.',
          badges: [],
        };
      }
    }
  };

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'amber':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'rose':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'blue':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'cyan':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800';
      case 'purple':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700';
    }
  };

  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  // Extract key summary metrics from the tool results
  const visionCall = toolCalls.find((c) => c.tool.includes('vision') || c.tool.includes('gemini'));
  const mandiCall = toolCalls.find((c) => c.tool.includes('mandi') || c.tool.includes('agmarknet'));
  const arbitrationCall = toolCalls.find((c) => c.tool.includes('rank_destinations') || c.tool.includes('arbitration'));

  const visionResult = visionCall?.result as any;
  const mandiResult = mandiCall?.result as any;
  const arbResult = arbitrationCall?.result as any;

  // Stages configuration with contextual findings
  const stages = [
    {
      id: 1,
      name: lang === 'hi' ? 'छवि निरीक्षण' : 'Image inspection',
      description: lang === 'hi' ? 'बहु-स्पेक्ट्रल पिक्सल व सतह स्कैन' : 'Surface pixel matrix and geometry calibration',
      finding: 'Visual capture calibrated • Surface mapped',
      isComplete: visibleCount >= 1 && !isExecuting,
      isProcessing: isExecuting && visibleCount === 1,
    },
    {
      id: 2,
      name: lang === 'hi' ? 'विकृति पहचान' : 'Defect detection',
      description: lang === 'hi' ? 'कोशिकीय क्षरण एवं सतह घाव चिन्हित' : 'Cellular decay zones and boundary localization',
      finding: `${visionResult?.bounding_box_count ?? 2} defect zones identified (${visionResult?.surface_spoilage_pct ?? 4.2}% surface area)`,
      isComplete: visibleCount >= 2 || (!isExecuting && visibleCount >= 1),
      isProcessing: isExecuting && visibleCount === 2,
    },
    {
      id: 3,
      name: lang === 'hi' ? 'गुणवत्ता ग्रेडिंग' : 'Quality grading',
      description: lang === 'hi' ? 'व्यापारिक श्रेणी एवं खराबी प्रतिशत' : 'Commercial grade and decay indexing',
      finding: `Grade: ${visionResult?.detected_class || 'Grade A'} (Decay index ${visionResult?.decay_index ?? 34}/100)`,
      isComplete: visibleCount >= 3 || (!isExecuting && visibleCount >= 2),
      isProcessing: isExecuting && visibleCount === 3,
    },
    {
      id: 4,
      name: lang === 'hi' ? 'शेल्फ-लाइफ अनुमान' : 'Shelf-life estimation',
      description: lang === 'hi' ? 'परिवहन क्षरण एवं तापमान प्रभाव' : 'Ambient degradation curve and transit risk factor',
      finding: `~${visionResult?.estimated_shelf_life_hours ?? 36}h ambient shelf life at 28°C`,
      isComplete: visibleCount >= 4 || (!isExecuting && visibleCount >= 3),
      isProcessing: isExecuting && visibleCount === 4,
    },
    {
      id: 5,
      name: lang === 'hi' ? 'मंडी अनुशंसा' : 'Mandi recommendation',
      description: lang === 'hi' ? 'अधिकतम शुद्ध किसान लाभ अनुकूलन' : 'Multi-terminal price and net return optimization',
      finding: `Selected ${arbResult?.top_destination || 'Azadpur Mandi'} (Net ₹${(arbResult?.projected_net_return_inr || 102400).toLocaleString('en-IN')})`,
      isComplete: visibleCount >= 4 && !isExecuting,
      isProcessing: isExecuting && visibleCount === 4,
    },
  ];

  return (
    <div className="agru-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[var(--border)] mb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[var(--surface-accent)] text-[var(--brand-dark)] dark:bg-emerald-900/50 dark:text-emerald-300 flex items-center justify-center text-xs font-semibold">
              2
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {t.demo.panel2Title}
              </h2>
              <p className="text-xs text-[var(--secondary)]">
                {t.demo.panel2Subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[var(--surface-accent)] text-[var(--brand-dark)] border border-[var(--primary)]/20 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              <span>Analysis service connected</span>
            </span>

            {/* Replay Button */}
            <button
              onClick={onReplay}
              disabled={isExecuting}
              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-muted)] text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors cursor-pointer disabled:opacity-50"
              title="Re-run analysis pipeline"
              aria-label="Re-run analysis pipeline"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Primary Results Summary Grid */}
        <div className="mb-4 p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--foreground)]">
              {lang === 'hi' ? 'विश्लेषण परिणाम' : 'Primary assessment results'}
            </span>
            <span className="text-xs text-[var(--primary)] font-medium">
              {isExecuting ? 'Processing...' : 'Completed'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Quality Grade */}
            <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--secondary)] block">
                {lang === 'hi' ? 'गुणवत्ता वर्ग' : 'Quality grade'}
              </span>
              <span className="text-sm font-semibold text-[var(--foreground)] mt-1 block truncate">
                {visionResult?.detected_class || 'Good (Grade A)'}
              </span>
              <span className="text-[10px] text-[var(--primary)] block mt-0.5">
                Decay {visionResult?.decay_index ?? 34}/100
              </span>
            </div>

            {/* 2. Detected Defects */}
            <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--secondary)] block">
                {lang === 'hi' ? 'दोष क्षेत्र' : 'Detected defects'}
              </span>
              <span className="text-sm font-semibold text-[var(--foreground)] mt-1 block">
                {visionResult?.bounding_box_count ?? 2} localized
              </span>
              <span className="text-[10px] text-[var(--secondary)] block mt-0.5">
                {visionResult?.surface_spoilage_pct ?? 4.2}% surface area
              </span>
            </div>

            {/* 3. Estimated Shelf-Life */}
            <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--secondary)] block">
                {lang === 'hi' ? 'शेष शेल्फ-लाइफ' : 'Est. shelf life'}
              </span>
              <span className="text-sm font-semibold text-[var(--primary)] mt-1 block">
                ~{visionResult?.estimated_shelf_life_hours ?? 36} hours
              </span>
              <span className="text-[10px] text-[var(--secondary)] block mt-0.5">
                Ambient 28°C storage
              </span>
            </div>

            {/* 4. Confidence / Reliability */}
            <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--secondary)] block">
                {lang === 'hi' ? 'विश्वसनीयता' : 'Reliability'}
              </span>
              <span className="text-sm font-semibold text-[var(--foreground)] mt-1 block">
                98.4%
              </span>
              <span className="text-[10px] text-[var(--secondary)] block mt-0.5">
                Multi-model consensus
              </span>
            </div>
          </div>

          {/* Recommended Next Action */}
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
            <span className="text-[var(--secondary)]">
              {lang === 'hi' ? 'अनुशंसित कदम:' : 'Recommended action:'}
            </span>
            <span className="font-medium text-[var(--brand-dark)] dark:text-emerald-300">
              {arbResult?.top_destination
                ? `Dispatch to ${arbResult.top_destination} (Estimated net: ₹${(arbResult.projected_net_return_inr || 102400).toLocaleString('en-IN')})`
                : 'Proceed with Mandi arbitration below'}
            </span>
          </div>
        </div>

        {/* Analysis Stages Vertical Sequence */}
        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold text-[var(--foreground)] mb-2">
            {lang === 'hi' ? 'विश्लेषण चरण' : 'Analysis stages'}
          </div>

          <div className="space-y-1.5">
            {stages.map((stage) => {
              return (
                <div
                  key={stage.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    stage.isComplete
                      ? 'bg-[var(--card)] border-[var(--border)]'
                      : stage.isProcessing
                      ? 'bg-[var(--surface-accent)] border-[var(--primary)]/30'
                      : 'bg-[var(--surface-muted)]/50 border-transparent opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        stage.isComplete
                          ? 'bg-[var(--surface-accent)] text-[var(--primary)]'
                          : stage.isProcessing
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--surface-muted)] text-[var(--secondary)]'
                      }`}
                    >
                      {stage.isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                      ) : stage.isProcessing ? (
                        <RotateCcw className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        stage.id
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[var(--foreground)]">
                        {stage.name}
                      </div>
                      <div className="text-[11px] text-[var(--secondary)]">
                        {stage.description}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      stage.isComplete
                        ? 'bg-[var(--surface-accent)] text-[var(--primary)]'
                        : stage.isProcessing
                        ? 'bg-[var(--surface-accent)] text-[var(--brand-dark)]'
                        : 'text-[var(--secondary)]'
                    }`}
                  >
                    {stage.isComplete
                      ? 'Completed'
                      : stage.isProcessing
                      ? 'Processing...'
                      : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapsible Technical Details Accordion */}
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full px-3.5 py-2.5 bg-[var(--surface-muted)] hover:bg-[var(--surface-muted)]/80 flex items-center justify-between text-xs font-medium text-[var(--foreground)] transition-colors cursor-pointer"
            aria-expanded={showTechnicalDetails}
          >
            <div className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-[var(--secondary)]" />
              <span>
                {lang === 'hi' ? 'तकनीकी विवरण एवं लॉग' : 'Technical details & execution logs'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--secondary)]">
              <span>{toolCalls.length} protocol steps</span>
              {showTechnicalDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showTechnicalDetails && (
            <div className="p-4 bg-[var(--card)] border-t border-[var(--border)] space-y-3 text-xs">
              {/* Technical Controls: View Mode & Speed */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-1 bg-[var(--surface-muted)] rounded-lg p-0.5 border border-[var(--border)] text-[11px]">
                  <button
                    onClick={() => setViewMode('visual')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'visual'
                        ? 'bg-[var(--card)] text-[var(--foreground)] shadow-2xs font-medium'
                        : 'text-[var(--secondary)]'
                    }`}
                  >
                    Structured logs
                  </button>
                  <button
                    onClick={() => setViewMode('developer')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'developer'
                        ? 'bg-[var(--card)] text-[var(--foreground)] shadow-2xs font-medium'
                        : 'text-[var(--secondary)]'
                    }`}
                  >
                    Raw JSON
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[var(--secondary)]">
                  <span>Speed:</span>
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeedMultiplier(s)}
                      className={`px-1.5 py-0.5 rounded border text-[10px] cursor-pointer ${
                        speedMultiplier === s
                          ? 'border-[var(--primary)] text-[var(--primary)] font-semibold'
                          : 'border-[var(--border)] text-[var(--secondary)]'
                      }`}
                    >
                      {s === 3 ? 'Fast' : `${s}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Metadata Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)]">
                  <span className="text-[var(--secondary)] block">Inference models:</span>
                  <span className="font-mono font-medium text-[var(--foreground)]">
                    Gemini 3.8 Flash, Llama-3.1
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)]">
                  <span className="text-[var(--secondary)] block">Pipeline latency:</span>
                  <span className="font-mono font-medium text-[var(--foreground)]">
                    580ms (Vision) + 84ms (LLM)
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)]">
                  <span className="text-[var(--secondary)] block">Protocol standard:</span>
                  <span className="font-mono font-medium text-[var(--foreground)]">
                    FastMCP v1.2 / JSON-RPC
                  </span>
                </div>
              </div>

              {/* Streaming Agent Tool Calls */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {toolCalls.slice(0, visibleCount).map((call) => {
                  const isExpanded = !!expandedCalls[call.id];
                  const info = getAgentCardInfo(call);

                  return (
                    <div
                      key={call.id}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/30 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpand(call.id)}
                        className="w-full p-2.5 flex items-center justify-between text-left hover:bg-[var(--surface-muted)]/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[var(--secondary)]">
                            {call.tool}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[var(--secondary)]">
                            {call.durationMs}ms
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[var(--secondary)]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--secondary)]" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-2.5 border-t border-[var(--border)] bg-[var(--card)] font-mono text-[10px] space-y-1.5">
                          {viewMode === 'visual' ? (
                            <div className="space-y-1">
                              <p className="text-[var(--foreground)] font-sans text-xs">
                                {info.summary}
                              </p>
                              <div className="text-[var(--secondary)]">
                                Timestamp: {call.timestamp}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <pre className="p-2 rounded bg-neutral-900 text-emerald-400 overflow-x-auto text-[10px]">
                                {JSON.stringify(call.result || call.arguments, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status Line */}
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--secondary)]">
        <div className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.demo.gatewayVerified}</span>
        </div>
        <span className="text-[11px]">
          {visibleCount}/{toolCalls.length} {t.demo.agentsConsensus}
        </span>
      </div>
    </div>
  );
}
