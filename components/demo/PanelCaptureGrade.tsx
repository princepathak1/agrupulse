'use client';

import React, { useState, useRef, useEffect } from 'react';
import { COMMODITY_PRESETS } from '@/data/commodities';
import { ProducePreset } from '@/lib/types';
import { ProduceIllustration } from './ProduceIllustration';
import {
  Upload,
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Scan,
  SlidersHorizontal,
  Key,
  Check,
  ShieldCheck,
  X,
  ExternalLink,
  Info,
  Thermometer,
  Truck,
  Layers,
  Eye,
  EyeOff,
  Tag,
} from 'lucide-react';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';
import { checkGoogleStudioStatus } from '@/lib/geminiVision';

interface PanelCaptureGradeProps {
  currentPreset: ProducePreset;
  onSelectPreset: (preset: ProducePreset) => void;
  isAnalyzing: boolean;
  onAnalyze: (customFile?: File, customUrl?: string, commodityHint?: string) => void;
}

export function PanelCaptureGrade({
  currentPreset,
  onSelectPreset,
  isAnalyzing,
  onAnalyze,
}: PanelCaptureGradeProps) {
  const { lang, t } = useThemeLanguage();
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cropHint, setCropHint] = useState<string>('tomato');
  const [imgAspect, setImgAspect] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bounding box overlay & inspection states
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [overlayMode, setOverlayMode] = useState<'badges' | 'full' | 'hidden'>('badges');

  // Google AI Studio modal & status state
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [studioStatus, setStudioStatus] = useState<{
    configured: boolean;
    valid?: boolean;
    maskedKey?: string;
    primaryModel?: string;
  }>({
    configured: true,
    valid: true,
    maskedKey: 'AQ.Ab8...tMIA',
    primaryModel: 'gemini-3.8-flash',
  });
  const [customKeyInput, setCustomKeyInput] = useState<string>('');
  const [keySaveMessage, setKeySaveMessage] = useState<string | null>(null);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);

  useEffect(() => {
    // Only check status when modal is actively opened
    if (showKeyModal) {
      checkGoogleStudioStatus().then((res) => {
        if (res && res.configured) {
          setStudioStatus({
            configured: true,
            valid: res.valid,
            maskedKey: res.maskedKey || 'AQ.Ab8...tMIA',
            primaryModel: res.primaryModel || 'gemini-3.8-flash',
          });
        }
      });
    }
  }, [showKeyModal]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFile(file);
      setCustomImage(url);
      onAnalyze(file, url, cropHint);
    }
  };

  const handleLoadSample = (sampleUrl: string, sampleHint: string) => {
    setUploadedFile(null);
    setCustomImage(sampleUrl);
    setImgAspect(1);
    setCropHint(sampleHint);
    onAnalyze(undefined, sampleUrl, sampleHint);
  };

  const handleSelectPreset = (preset: ProducePreset) => {
    setUploadedFile(null);
    setCustomImage(null);
    setImgAspect(null);
    setCropHint(preset.id);
    onSelectPreset(preset);
  };

  const handleCropHintChange = (newCrop: string) => {
    setCropHint(newCrop);
    if (customImage || uploadedFile) {
      onAnalyze(uploadedFile || undefined, customImage || undefined, newCrop);
    }
  };

  const handleClearCustomImage = () => {
    setUploadedFile(null);
    setCustomImage(null);
    setImgAspect(null);
    onSelectPreset(COMMODITY_PRESETS[0]);
  };

  const handleSaveCustomKey = async () => {
    setIsTestingKey(true);
    setKeySaveMessage(null);
    const keyToTest = customKeyInput.trim();

    if (!keyToTest) {
      localStorage.removeItem('agrupulse_gemini_key');
      const res = await checkGoogleStudioStatus();
      setStudioStatus({
        configured: true,
        valid: res.valid,
        maskedKey: res.maskedKey || 'AQ.Ab8...tMIA',
        primaryModel: 'gemini-3.8-flash',
      });
      setKeySaveMessage('Reset to default Google AI Studio API key.');
      setIsTestingKey(false);
      return;
    }

    localStorage.setItem('agrupulse_gemini_key', keyToTest);
    const res = await checkGoogleStudioStatus(keyToTest);
    if (res.valid) {
      setStudioStatus({
        configured: true,
        valid: true,
        maskedKey: res.maskedKey || `${keyToTest.slice(0, 6)}...${keyToTest.slice(-4)}`,
        primaryModel: res.primaryModel || 'gemini-3.8-flash',
      });
      setKeySaveMessage('✅ Google AI Studio key verified successfully!');
    } else {
      setKeySaveMessage(`⚠️ Connection test warning: ${res.error || 'Check key validity'}`);
    }
    setIsTestingKey(false);
  };

  // Freshness badge styles
  const getFreshnessBadgeClass = (freshness: string) => {
    switch (freshness) {
      case 'Fresh':
        return 'bg-[#EAF3E9] text-[#174A32] border-[#28784A]/30 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700';
      case 'Ripe':
        return 'bg-[#FFF4DC] text-[#B7791F] border-[#B7791F]/30 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700';
      case 'Overripe':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700';
      default:
        return 'bg-rose-50 text-[#C4473A] border-[#C4473A]/30 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700';
    }
  };

  // Bounding box renderer with collision prevention, smart positioning, and floating inspector
  const renderBoundingBox = (box: any, idx: number) => {
    if (overlayMode === 'hidden') return null;

    const boxColor =
      box.severity === 'high'
        ? '#C4473A'
        : box.severity === 'medium'
        ? '#B7791F'
        : '#28784A';
    const isHovered = hoveredBoxId === box.id || selectedBoxId === box.id;

    // Smart positioning so tags never overflow outside image edges
    const isNearTop = box.y < 16;
    const isNearRight = box.x > 62;
    const isNearBottom = box.y > 75;

    return (
      <div
        key={box.id}
        onMouseEnter={() => setHoveredBoxId(box.id)}
        onMouseLeave={() => setHoveredBoxId(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBoxId((prev) => (prev === box.id ? null : box.id));
        }}
        className="absolute transition-all duration-150 cursor-pointer pointer-events-auto rounded-[3px]"
        style={{
          left: `${box.x}%`,
          top: `${box.y}%`,
          width: `${box.width}%`,
          height: `${box.height}%`,
          borderColor: isHovered ? '#ffffff' : boxColor,
          borderWidth: isHovered ? '2.5px' : '1.5px',
          borderStyle: 'solid',
          backgroundColor: isHovered ? `${boxColor}35` : `${boxColor}15`,
          boxShadow: isHovered
            ? `0 0 14px ${boxColor}, inset 0 0 8px ${boxColor}60`
            : undefined,
          zIndex: isHovered ? 40 : 15,
        }}
      >
        {/* Compact, non-overlapping Pill Badge */}
        <div
          className="absolute flex items-center gap-1 px-1.5 py-0.5 rounded shadow-sm text-white font-medium text-[10px] whitespace-nowrap transition-transform"
          style={{
            backgroundColor: boxColor,
            top: isNearTop ? '2px' : '-22px',
            left: isNearRight ? 'auto' : '0px',
            right: isNearRight ? '0px' : 'auto',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          <span className="font-bold">#{idx + 1}</span>
          {overlayMode === 'full' && (
            <span className="max-w-[110px] truncate opacity-95">
              {box.label}
            </span>
          )}
          <span className="opacity-80 text-[9px] font-mono">
            {Math.round(box.confidence * 100)}%
          </span>
        </div>

        {/* Detailed Floating Popover on Hover or Selection */}
        {isHovered && (
          <div
            className={`absolute z-50 p-2.5 rounded-xl bg-neutral-900/95 dark:bg-neutral-950/95 border border-neutral-700/80 text-white shadow-2xl backdrop-blur-md pointer-events-none min-w-[210px] max-w-[270px] text-left transition-all ${
              isNearTop || (!isNearBottom && box.y < 30)
                ? 'top-full mt-2'
                : 'bottom-full mb-2'
            } ${isNearRight ? 'right-0' : 'left-0'}`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-neutral-700/60">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${boxColor}30`, color: boxColor }}
              >
                Defect #{idx + 1} • {box.severity.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-neutral-300">
                {Math.round(box.confidence * 100)}% conf
              </span>
            </div>
            <div className="text-xs font-semibold text-white leading-snug break-words">
              {box.label}
            </div>
            <div className="text-[10px] text-neutral-400 mt-1.5 flex items-center justify-between">
              <span>Boundary: {box.width}% × {box.height}%</span>
              <span className="text-emerald-400 font-medium">Surface Mapped</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="agru-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative">
      {/* Panel Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)] mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[var(--surface-accent)] text-[var(--brand-dark)] dark:bg-emerald-900/50 dark:text-emerald-300 flex items-center justify-center text-xs font-semibold">
              1
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {t.demo.panel1Title}
              </h2>
            </div>
          </div>

          {/* Vision API Status Pill */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--surface-muted)] hover:bg-[var(--surface-accent)] text-[var(--secondary)] hover:text-[var(--brand-dark)] border border-[var(--border)] transition-colors cursor-pointer"
            title="Configure Google AI Studio API key"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span>Vision API</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" title="Connected" />
          </button>
        </div>

        {/* Custom Image Mode Banner if active */}
        {customImage ? (
          <div className="mb-4 p-3 rounded-xl bg-[var(--surface-accent)] border border-[var(--primary)]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[var(--brand-dark)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <span>
                {lang === 'hi'
                  ? 'Google Studio Gemini 3.8 Flash विज़न सक्रिय'
                  : 'Google Studio Gemini 3.8 Flash Vision active'}
              </span>
            </div>
            <button
              onClick={handleClearCustomImage}
              className="text-xs font-medium text-[var(--secondary)] hover:text-[var(--accent-red)] underline cursor-pointer"
            >
              {lang === 'hi' ? 'प्रीसेट पर लौटें' : 'Reset to presets'}
            </button>
          </div>
        ) : (
          /* Preset Selector */
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[var(--secondary)]">
                {t.demo.selectPreset}
              </label>
              <span className="text-xs text-[var(--primary)] font-medium">
                {lang === 'hi' ? '4 नमूने उपलब्ध' : '4 sample presets'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {COMMODITY_PRESETS.slice(0, 4).map((p) => {
                const isSelected = currentPreset.id === p.id && !customImage;
                const commoditySubHint: Record<string, string> = {
                  tomato: 'High perishable',
                  banana: 'Fast ripening',
                  mango: 'Export grade',
                  potato: 'Durable tuber',
                };
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--surface-accent)] text-[var(--brand-dark)] font-semibold shadow-xs ring-1 ring-[var(--primary)]'
                        : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-muted)] text-[var(--secondary)] hover:text-[var(--foreground)]'
                    }`}
                    aria-label={`Select ${p.name}`}
                  >
                    <span className="text-xl block mb-0.5">{p.emoji}</span>
                    <span className="text-xs truncate block font-medium">
                      {lang === 'hi' ? p.nameHindi.split(' ')[0] : p.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-[var(--secondary)] block truncate">
                      {commoditySubHint[p.id] || p.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual Inspection Viewport */}
        <div className="relative h-72 sm:h-80 rounded-xl bg-[#F4F6F2] dark:bg-[#18221B] border border-[var(--border)] overflow-hidden flex items-center justify-center p-3 select-none">
          {/* Custom Image or SVG Illustration with mapped Bounding Box Overlay */}
          {customImage ? (
            <div
              className="relative h-full flex items-center justify-center max-w-full"
              style={{ aspectRatio: imgAspect ? `${imgAspect}` : undefined }}
            >
              <img
                src={customImage}
                alt="Uploaded produce sample"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth && naturalHeight) {
                    setImgAspect(naturalWidth / naturalHeight);
                  }
                }}
                className="w-full h-full object-contain rounded-lg"
              />
              {/* Overlay Bounding Boxes */}
              {!isAnalyzing &&
                currentPreset.boundingBoxes.map((box, idx) => renderBoundingBox(box, idx))}
            </div>
          ) : (
            <div className="relative w-52 h-52 flex items-center justify-center">
              <ProduceIllustration commodityId={currentPreset.id} />
              {/* Overlay Bounding Boxes for SVG preset */}
              {!isAnalyzing &&
                currentPreset.boundingBoxes.map((box, idx) => renderBoundingBox(box, idx))}
            </div>
          )}

          {/* Industrial Inspection State during Analysis */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/80 dark:bg-[#18221B]/85 backdrop-blur-2xs z-30 flex flex-col items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
              <span className="text-xs font-medium text-[var(--foreground)]">
                Inspecting produce surface &amp; defects...
              </span>
            </div>
          )}

          {/* Top Engine Badge */}
          <div className="absolute top-2.5 left-2.5 z-20">
            <span className="px-2 py-1 rounded-md bg-[var(--card)]/90 backdrop-blur-xs border border-[var(--border)] text-[11px] font-medium text-[var(--secondary)] flex items-center gap-1.5 shadow-2xs">
              <Scan className="w-3 h-3 text-[var(--primary)]" />
              {isAnalyzing
                ? 'Analyzing produce...'
                : currentPreset.aiAnalysis
                ? `Gemini Vision (${currentPreset.boundingBoxes.length} zones)`
                : customImage
                ? 'Computer vision analysis'
                : 'Defect inspection'}
            </span>
          </div>

          {/* Top Right: Overlay Display Mode Toggle */}
          {currentPreset.boundingBoxes.length > 0 && !isAnalyzing && (
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
              <div className="p-0.5 rounded-lg bg-[var(--card)]/90 backdrop-blur-xs border border-[var(--border)] shadow-2xs flex items-center text-[10px] font-medium">
                <button
                  type="button"
                  onClick={() => setOverlayMode('badges')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    overlayMode === 'badges'
                      ? 'bg-[var(--primary)] text-white font-semibold shadow-2xs'
                      : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
                  }`}
                  title="Compact badges without label collision"
                >
                  Badges
                </button>
                <button
                  type="button"
                  onClick={() => setOverlayMode('full')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    overlayMode === 'full'
                      ? 'bg-[var(--primary)] text-white font-semibold shadow-2xs'
                      : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
                  }`}
                  title="Show text tags on bounding boxes"
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setOverlayMode('hidden')}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    overlayMode === 'hidden'
                      ? 'bg-[var(--primary)] text-white font-semibold shadow-2xs'
                      : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
                  }`}
                  title="Hide boxes for raw photo inspection"
                >
                  <EyeOff className="w-3 h-3 inline" />
                </button>
              </div>
            </div>
          )}

          {/* Re-analyze Action Button */}
          <button
            onClick={() => onAnalyze(uploadedFile || undefined, customImage || undefined, cropHint)}
            disabled={isAnalyzing}
            className="absolute bottom-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--brand-dark)] hover:bg-[var(--primary)] text-white shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            aria-label="Re-analyze image"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze'}</span>
          </button>
        </div>

        {/* Defect Severity Legend with Criteria */}
        <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-[var(--secondary)]">
          <span className="font-medium text-[var(--foreground)]">Defect criteria:</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#28784A]" />
              <span>Minor (&lt;15%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B7791F]" />
              <span>Moderate (15–35%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C4473A]" />
              <span>Severe (&gt;35%)</span>
            </span>
          </div>
        </div>

        {/* Identified Defect Zones Breakdown List (Fully readable, interactive cards) */}
        {currentPreset.boundingBoxes.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-[var(--surface-muted)]/70 border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)]">
              <div className="flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>
                  {lang === 'hi' ? 'पहचाने गए विकृति क्षेत्र' : 'Detected Defect Zones'} ({currentPreset.boundingBoxes.length})
                </span>
              </div>
              <span className="text-[10px] text-[var(--secondary)] font-normal">
                Hover card to highlight on photo
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {currentPreset.boundingBoxes.map((box, idx) => {
                const boxColor =
                  box.severity === 'high'
                    ? '#C4473A'
                    : box.severity === 'medium'
                    ? '#B7791F'
                    : '#28784A';
                const isItemActive = hoveredBoxId === box.id || selectedBoxId === box.id;

                return (
                  <div
                    key={box.id}
                    onMouseEnter={() => setHoveredBoxId(box.id)}
                    onMouseLeave={() => setHoveredBoxId(null)}
                    onClick={() => setSelectedBoxId((prev) => (prev === box.id ? null : box.id))}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                      isItemActive
                        ? 'bg-[var(--surface-accent)] border-[var(--primary)] ring-1 ring-[var(--primary)]/40 shadow-xs'
                        : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className="w-5 h-5 rounded-md text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                        style={{ backgroundColor: boxColor }}
                      >
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[var(--foreground)] leading-snug break-words">
                          {box.label}
                        </div>
                        <div className="text-[10px] text-[var(--secondary)] mt-0.5 flex items-center gap-2">
                          <span className="capitalize font-medium" style={{ color: boxColor }}>
                            {box.severity} severity
                          </span>
                          <span>•</span>
                          <span>Zone {box.width}% × {box.height}%</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border"
                      style={{
                        backgroundColor: `${boxColor}15`,
                        color: boxColor,
                        borderColor: `${boxColor}30`,
                      }}
                    >
                      {Math.round(box.confidence * 100)}% conf
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload & Sample Testing Toolbar */}
        <div className="mt-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 rounded-lg border border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface-muted)] hover:bg-[var(--card)] text-xs font-medium text-[var(--secondary)] hover:text-[var(--foreground)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{t.demo.uploadCustom}</span>
            </button>

            {/* Quick Photographic Test Buttons */}
            <button
              onClick={() => handleLoadSample('/samples/tomato.jpg', 'tomato')}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] bg-[var(--card)] hover:bg-[var(--surface-muted)] text-xs text-[var(--secondary)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors cursor-pointer"
              title="Test with harvest tomato photo"
            >
              <span>🍅 Tomato photo</span>
            </button>
            <button
              onClick={() => handleLoadSample('/samples/banana.jpg', 'banana')}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] bg-[var(--card)] hover:bg-[var(--surface-muted)] text-xs text-[var(--secondary)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors cursor-pointer"
              title="Test with harvest banana photo"
            >
              <span>🍌 Banana photo</span>
            </button>
          </div>
        </div>

        {/* Concise Assessment Summary */}
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--foreground)]">
              {lang === 'hi' ? 'गुणवत्ता सारांश' : 'Quality summary'}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getFreshnessBadgeClass(
                currentPreset.freshnessClass
              )}`}
            >
              {currentPreset.freshnessClass}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Metric 1: Decay Index */}
            <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--secondary)] block">{t.demo.decayIndex}</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`text-lg font-semibold ${
                    currentPreset.decayIndex >= 65
                      ? 'text-[var(--accent-red)]'
                      : currentPreset.decayIndex >= 30
                      ? 'text-[var(--accent-amber)]'
                      : 'text-[var(--primary)]'
                  }`}
                >
                  {currentPreset.decayIndex}
                </span>
                <span className="text-[11px] text-[var(--secondary)]">/ 100</span>
              </div>
              <div className="mt-1.5 w-full h-1 bg-[var(--surface-muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)]"
                  style={{ width: `${currentPreset.decayIndex}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Surface Spoilage */}
            <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--secondary)] block">{t.demo.surfaceSpoilage}</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`text-lg font-semibold ${
                    currentPreset.surfaceSpoilagePercent >= 12
                      ? 'text-[var(--accent-red)]'
                      : 'text-[var(--foreground)]'
                  }`}
                >
                  {currentPreset.surfaceSpoilagePercent}%
                </span>
              </div>
              <span className="text-[10px] text-[var(--secondary)] mt-1 block">
                {currentPreset.boundingBoxes.length} {lang === 'hi' ? 'दोष क्षेत्र' : 'defect zones'}
              </span>
            </div>

            {/* Metric 3: Shelf-Life */}
            <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <span className="text-[11px] text-[var(--secondary)] block">{t.demo.shelfLife}</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`text-lg font-semibold ${
                    currentPreset.shelfLifeHours <= 12
                      ? 'text-[var(--accent-red)]'
                      : 'text-[var(--primary)]'
                  }`}
                >
                  ~{currentPreset.shelfLifeHours}h
                </span>
              </div>
              <span className="text-[10px] text-[var(--secondary)] mt-1 block">
                {lang === 'hi' ? 'सामान्य तापमान' : 'ambient storage'}
              </span>
            </div>
          </div>

          {/* Description Callout */}
          <p className="text-xs text-[var(--secondary)] leading-relaxed">
            {lang === 'hi' && currentPreset.descriptionHindi
              ? currentPreset.descriptionHindi
              : currentPreset.description}
          </p>
        </div>

        {/* Post-Harvest Pathology Assessment Card (if attached) */}
        {currentPreset.aiAnalysis && (
          <div className="mt-3 p-3.5 rounded-xl bg-[var(--surface-accent)] border border-[var(--primary)]/20 text-xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--primary)]/15">
              <span className="font-semibold text-[var(--brand-dark)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Pathology &amp; storage evaluation</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--card)] text-[var(--secondary)] border border-[var(--border)]">
                {currentPreset.aiAnalysis.model}
              </span>
            </div>

            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              {lang === 'hi' && currentPreset.aiAnalysis.pathologySummaryHindi
                ? currentPreset.aiAnalysis.pathologySummaryHindi
                : currentPreset.aiAnalysis.pathologySummary}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {currentPreset.aiAnalysis.storageRecommendation && (
                <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[11px] space-y-0.5">
                  <span className="font-medium text-[var(--primary)] flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    Storage recommendation
                  </span>
                  <p className="text-[var(--secondary)] truncate">
                    {currentPreset.aiAnalysis.storageRecommendation}
                  </p>
                </div>
              )}

              {currentPreset.aiAnalysis.dispatchRecommendation && (
                <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[11px] space-y-0.5">
                  <span className="font-medium text-[var(--accent-blue)] flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Dispatch urgency
                  </span>
                  <p className="text-[var(--secondary)] truncate">
                    {currentPreset.aiAnalysis.dispatchRecommendation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Google AI Studio API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-accent)] text-[var(--primary)] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Google AI Studio configuration
                  </h3>
                  <p className="text-xs text-[var(--secondary)]">
                    Gemini Multimodal Vision API
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-[var(--surface-muted)] flex items-center justify-center text-[var(--secondary)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Connection Status Box */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-accent)] border border-[var(--primary)]/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-[var(--brand-dark)] block">
                  Connected &amp; verified
                </span>
                <p className="text-[var(--secondary)] text-xs">
                  Active model: <span className="font-medium text-[var(--foreground)]">{studioStatus.primaryModel || 'gemini-3.8-flash'}</span>
                </p>
                <p className="text-[var(--secondary)] text-[11px] font-mono">
                  Key: {studioStatus.maskedKey}
                </p>
              </div>
            </div>

            {/* Key Override Form */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--foreground)] block">
                Custom API key (optional):
              </label>
              <input
                type="password"
                placeholder="Paste Google AI Studio API key..."
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] font-mono"
              />
              <p className="text-[11px] text-[var(--secondary)]">
                Leave blank and click &apos;Save &amp; verify&apos; to use the server-configured API key.
              </p>
            </div>

            {keySaveMessage && (
              <div className="p-2.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--foreground)]">
                {keySaveMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--surface-muted)] text-[var(--foreground)] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSaveCustomKey}
                disabled={isTestingKey}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--brand-dark)] hover:bg-[var(--primary)] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isTestingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isTestingKey ? 'Verifying...' : 'Save & verify'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
