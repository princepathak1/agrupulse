import { BoundingBox, FreshnessClass, ProducePreset } from './types';
import { analyzeImagePixels, PixelAnalysisResult } from './visionEngine';

export interface GeminiAnalysisResult {
  success: boolean;
  isAIPowered: boolean;
  provider: string;
  modelUsed: string;
  latencyMs: number;
  detectedCrop: string;
  detectedCropHindi: string;
  category: 'Fruit' | 'Vegetable';
  freshnessClass: FreshnessClass;
  decayIndex: number;
  surfaceSpoilagePercent: number;
  shelfLifeHours: number;
  baseDecayRatePerHour: number;
  emoji: string;
  dominantColor: string;
  pathologySummary: string;
  pathologySummaryHindi: string;
  storageRecommendation: string;
  dispatchRecommendation: string;
  boundingBoxes: BoundingBox[];
}

/**
 * Convert any image source (File, Blob, object URL, or data URL) to base64
 */
export async function convertImageSourceToBase64(imageSource: string | File | Blob): Promise<string> {
  if (typeof imageSource === 'string') {
    if (imageSource.startsWith('data:image')) {
      return imageSource;
    }

    // If it's a blob URL or remote URL, fetch and convert to base64
    try {
      const response = await fetch(imageSource);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn('Failed to fetch image URL for base64 conversion:', e);
      return imageSource;
    }
  }

  // File or Blob
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(imageSource);
  });
}

/**
 * Primary function: Analyze Produce Image with Google AI Studio Gemini Multimodal Vision
 * Falls back transparently to local heuristic CV engine if network or quota issue occurs.
 */
export async function analyzeProduceImage(
  imageSource: string | File,
  fallbackPreset: ProducePreset,
  cropHint: string = 'tomato',
  customApiKey?: string
): Promise<{
  pixelResult: PixelAnalysisResult;
  geminiResult?: GeminiAnalysisResult;
  isAI: boolean;
}> {
  // Check if user set a local key override in localStorage
  let activeKey = customApiKey;
  if (!activeKey && typeof window !== 'undefined') {
    activeKey = localStorage.getItem('agrupulse_gemini_key') || undefined;
  }

  try {
    const base64 = await convertImageSourceToBase64(imageSource);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (activeKey) {
      headers['x-gemini-api-key'] = activeKey;
    }

    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        imageBase64: base64,
        cropHint,
      }),
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;

        const geminiResult: GeminiAnalysisResult = {
          success: true,
          isAIPowered: true,
          provider: resData.provider || 'Google AI Studio',
          modelUsed: resData.modelUsed || 'gemini-3.8-flash',
          latencyMs: resData.latencyMs || 650,
          detectedCrop: d.detectedCrop,
          detectedCropHindi: d.detectedCropHindi,
          category: d.category,
          freshnessClass: d.freshnessClass,
          decayIndex: d.decayIndex,
          surfaceSpoilagePercent: d.surfaceSpoilagePercent,
          shelfLifeHours: d.shelfLifeHours,
          baseDecayRatePerHour: d.baseDecayRatePerHour,
          emoji: d.emoji,
          dominantColor: d.dominantColor,
          pathologySummary: d.pathologySummary,
          pathologySummaryHindi: d.pathologySummaryHindi,
          storageRecommendation: d.storageRecommendation,
          dispatchRecommendation: d.dispatchRecommendation,
          boundingBoxes: d.boundingBoxes,
        };

        const pixelResult: PixelAnalysisResult = {
          boundingBoxes: d.boundingBoxes,
          decayIndex: d.decayIndex,
          surfaceSpoilagePercent: d.surfaceSpoilagePercent,
          freshnessClass: d.freshnessClass,
          shelfLifeHours: d.shelfLifeHours,
          detectedDominantColor: d.dominantColor,
          detectedCropType: d.detectedCrop,
          pixelDamageCount: Math.round(d.surfaceSpoilagePercent * 25),
          summary: d.pathologySummary,
        };

        return { pixelResult, geminiResult, isAI: true };
      }
    }

    console.warn('[Gemini AI] API call was not successful, falling back to local vision engine.');
  } catch (error) {
    console.warn('[Gemini AI] Call error:', error);
  }

  // Graceful Fallback to local CV engine
  const localResult = await analyzeImagePixels(imageSource, fallbackPreset, cropHint);
  return { pixelResult: localResult, isAI: false };
}

/**
 * Check Google AI Studio status
 */
export async function checkGoogleStudioStatus(customApiKey?: string): Promise<{
  configured: boolean;
  valid?: boolean;
  maskedKey?: string;
  primaryModel?: string;
  error?: string;
}> {
  try {
    let key = customApiKey;
    if (!key && typeof window !== 'undefined') {
      key = localStorage.getItem('agrupulse_gemini_key') || undefined;
    }

    const headers: Record<string, string> = {};
    if (key) {
      headers['x-gemini-api-key'] = key;
    }

    const res = await fetch('/api/analyze-image', {
      method: 'GET',
      headers,
    });
    return await res.json();
  } catch (err: any) {
    return { configured: false, valid: false, error: err?.message };
  }
}
