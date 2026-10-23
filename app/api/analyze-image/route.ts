import { NextRequest, NextResponse } from 'next/server';

// Default fallback key from environment
const DEFAULT_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_STUDIO_API_KEY ||
  '';

const PRIMARY_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.8-flash';
const FALLBACK_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];

interface GeminiDefectBox {
  id?: string;
  label?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  confidence?: number;
  severity?: 'low' | 'medium' | 'high';
}

interface GeminiVisionOutput {
  detectedCrop?: string;
  detectedCropHindi?: string;
  category?: 'Fruit' | 'Vegetable';
  freshnessClass?: 'Fresh' | 'Ripe' | 'Overripe' | 'Spoiled';
  decayIndex?: number;
  surfaceSpoilagePercent?: number;
  shelfLifeHours?: number;
  baseDecayRatePerHour?: number;
  boundingBoxes?: GeminiDefectBox[];
  pathologySummary?: string;
  pathologySummaryHindi?: string;
  storageRecommendation?: string;
  dispatchRecommendation?: string;
  emoji?: string;
  dominantColor?: string;
}

const SYSTEM_INSTRUCTION = `You are AgruPulse Post-Harvest Agricultural Computer Vision & Pathology Inspector, powered by Google AI Studio Gemini Multimodal Vision.
Your mission is to perform automated post-harvest grading and decay analysis on agricultural produce images in accordance with AGMARK and ICAR post-harvest quality standards.

Carefully examine the produce photo and return ONLY a strict JSON object with this exact schema:
{
  "detectedCrop": "Tomato", // Name of the detected fruit/vegetable (e.g., Tomato, Banana, Mango, Potato, Onion, Papaya, Apple, Chili, etc.)
  "detectedCropHindi": "टमाटर", // Crop name in Hindi
  "category": "Vegetable", // "Fruit" or "Vegetable"
  "freshnessClass": "Ripe", // Exactly one of: "Fresh", "Ripe", "Overripe", "Spoiled"
  "decayIndex": 35, // Integer 0 to 100 (0 = pristine harvest condition, 100 = complete necrosis/fungal liquefaction)
  "surfaceSpoilagePercent": 14.5, // Float 0.0 to 100.0 (% surface area affected by browning, soft spots, mold, or mechanical damage)
  "shelfLifeHours": 48, // Integer estimated remaining marketable shelf life in ambient storage (25-30°C)
  "baseDecayRatePerHour": 0.85, // Float estimated % spoilage increase per hour in transit (typically 0.15 to 1.8)
  "emoji": "🍅", // Produce emoji
  "dominantColor": "#DC2626", // Dominant hex color code
  "pathologySummary": "Detailed scientific assessment of produce tissue, firmness, ethylene ripening stage, or pathological infection.",
  "pathologySummaryHindi": "फसल की गुणवत्ता, सड़न स्तर और शेल्फ लाइफ का सटीक हिंदी विवरण।",
  "storageRecommendation": "Storage advice (e.g., Maintain 10-12°C with 85-90% RH).",
  "dispatchRecommendation": "Logistical action advice (e.g., Immediate local mandi liquidation recommended due to high perishability).",
  "boundingBoxes": [
    {
      "id": "defect_1",
      "label": "Blossom-end rot initiation", // Specific blemish/pathology label
      "x": 35, // X coordinate of top-left corner as integer percentage (0 to 100)
      "y": 42, // Y coordinate of top-left corner as integer percentage (0 to 100)
      "width": 24, // Width as percentage (1 to 100)
      "height": 22, // Height as percentage (1 to 100)
      "confidence": 0.92, // Float 0.0 to 1.0
      "severity": "medium" // Exactly "low", "medium", or "high"
    }
  ]
}

If no produce is present, state that clearly in the summary and set decayIndex: 0, freshnessClass: "Fresh", boundingBoxes: [].`;

/**
 * Call Gemini API with model fallback
 */
async function callGeminiVision(
  apiKey: string,
  base64Data: string,
  mimeType: string,
  cropHint?: string
): Promise<{ data: GeminiVisionOutput; modelUsed: string; latencyMs: number }> {
  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: Error | null = null;
  const startTime = Date.now();

  const userPrompt = cropHint && cropHint !== 'custom'
    ? `Analyze this produce sample. The declared/suspected crop variety is "${cropHint}". Detect all visible quality vectors, browning spots, bruising, fungal mold, and determine decay index, shelf life, and bounding box coordinates for all defects.`
    : `Analyze this produce sample. Identify the crop variety and detect all visible quality vectors, browning spots, bruising, fungal mold, and determine decay index, shelf life, and bounding box coordinates for all defects.`;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_INSTRUCTION}\n\nTask: ${userPrompt}`,
                },
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[Gemini API] Model ${model} returned status ${res.status}:`, errorText);
        // If 404 or model unavailable, try next fallback model
        if (res.status === 404 || res.status === 400) {
          lastError = new Error(`Model ${model} error: ${errorText}`);
          continue;
        }
        throw new Error(`Gemini API HTTP ${res.status}: ${errorText}`);
      }

      const responseJson = await res.json();
      const rawText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Gemini API returned empty candidate response');
      }

      // Parse JSON
      let parsed: GeminiVisionOutput;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        // Fallback: match first json block
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('Failed to parse Gemini output as JSON');
        }
      }

      const latencyMs = Date.now() - startTime;
      return { data: parsed, modelUsed: model, latencyMs };
    } catch (err: any) {
      console.warn(`[Gemini API] Failed with ${model}:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/**
 * POST /api/analyze-image
 */
export async function POST(req: NextRequest) {
  try {
    let base64Data = '';
    let mimeType = 'image/jpeg';
    let cropHint = '';
    let customApiKey = req.headers.get('x-gemini-api-key') || '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
      }
      mimeType = file.type || 'image/jpeg';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Data = buffer.toString('base64');
      cropHint = (formData.get('cropHint') as string) || '';
      if (!customApiKey) {
        customApiKey = (formData.get('apiKey') as string) || '';
      }
    } else {
      const body = await req.json();
      const rawImage = body.imageBase64 || body.image || '';
      if (!rawImage) {
        return NextResponse.json({ error: 'Missing imageBase64 in request body' }, { status: 400 });
      }

      // Strip data:image/...;base64, prefix if present
      if (rawImage.includes(',')) {
        const parts = rawImage.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) mimeType = mimeMatch[1];
        base64Data = parts[1];
      } else {
        base64Data = rawImage;
        mimeType = body.mimeType || 'image/jpeg';
      }

      cropHint = body.cropHint || '';
      if (!customApiKey) {
        customApiKey = body.apiKey || '';
      }
    }

    const apiKey = customApiKey.trim() || DEFAULT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google AI Studio API Key is not configured.' },
        { status: 401 }
      );
    }

    // Call Gemini
    const { data, modelUsed, latencyMs } = await callGeminiVision(
      apiKey,
      base64Data,
      mimeType,
      cropHint
    );

    // Sanitize and validate bounding boxes
    const normalizedBoxes = (data.boundingBoxes || []).map((b, idx) => ({
      id: b.id || `defect_${idx + 1}`,
      label: b.label || 'Surface blemish',
      x: Math.max(0, Math.min(100, Math.round(Number(b.x) || 0))),
      y: Math.max(0, Math.min(100, Math.round(Number(b.y) || 0))),
      width: Math.max(4, Math.min(100, Math.round(Number(b.width) || 20))),
      height: Math.max(4, Math.min(100, Math.round(Number(b.height) || 20))),
      confidence: Math.min(1, Math.max(0.1, Number(b.confidence) || 0.85)),
      severity: (['low', 'medium', 'high'].includes(b.severity || '') ? b.severity : 'medium') as 'low' | 'medium' | 'high',
    }));

    // Ensure valid freshness class
    const validFreshness = ['Fresh', 'Ripe', 'Overripe', 'Spoiled'];
    const freshnessClass = validFreshness.includes(data.freshnessClass || '')
      ? (data.freshnessClass as 'Fresh' | 'Ripe' | 'Overripe' | 'Spoiled')
      : (data.decayIndex || 0) < 20
      ? 'Fresh'
      : (data.decayIndex || 0) < 45
      ? 'Ripe'
      : (data.decayIndex || 0) < 70
      ? 'Overripe'
      : 'Spoiled';

    return NextResponse.json({
      success: true,
      provider: 'Google AI Studio',
      modelUsed,
      latencyMs,
      data: {
        detectedCrop: data.detectedCrop || 'Agricultural Produce',
        detectedCropHindi: data.detectedCropHindi || 'कृषि उत्पाद',
        category: data.category || 'Vegetable',
        freshnessClass,
        decayIndex: Math.max(0, Math.min(100, Math.round(data.decayIndex ?? 25))),
        surfaceSpoilagePercent: Math.max(0, Math.min(100, Math.round((data.surfaceSpoilagePercent ?? 5) * 10) / 10)),
        shelfLifeHours: Math.max(1, Math.round(data.shelfLifeHours ?? 48)),
        baseDecayRatePerHour: Number(data.baseDecayRatePerHour) || 0.85,
        emoji: data.emoji || '🌾',
        dominantColor: data.dominantColor || '#10B981',
        pathologySummary: data.pathologySummary || 'AI completed multi-spectral post-harvest inspection.',
        pathologySummaryHindi: data.pathologySummaryHindi || 'AI द्वारा पूर्ण बहु-स्पेक्ट्रल कटाई उपरांत परीक्षण।',
        storageRecommendation: data.storageRecommendation || 'Store in standard temperature-controlled warehouse.',
        dispatchRecommendation: data.dispatchRecommendation || 'Proceed with standard mandi dispatch.',
        boundingBoxes: normalizedBoxes,
      },
    });
  } catch (error: any) {
    console.error('API /api/analyze-image error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to analyze image with Google AI Studio',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze-image
 * Health check & verification of API Key
 */
export async function GET(req: NextRequest) {
  const customKey = req.headers.get('x-gemini-api-key') || '';
  const key = customKey.trim() || DEFAULT_API_KEY;

  if (!key) {
    return NextResponse.json({
      configured: false,
      message: 'No Google AI Studio key configured',
    });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      { method: 'GET' }
    );

    if (res.ok) {
      const data = await res.json();
      const modelCount = data.models?.length || 0;
      const maskedKey = `${key.slice(0, 6)}...${key.slice(-4)}`;
      return NextResponse.json({
        configured: true,
        valid: true,
        maskedKey,
        primaryModel: PRIMARY_MODEL,
        availableModelsCount: modelCount,
        provider: 'Google AI Studio',
      });
    } else {
      const errorText = await res.text();
      return NextResponse.json({
        configured: true,
        valid: false,
        error: `Google API responded with HTTP ${res.status}: ${errorText}`,
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      valid: false,
      error: err?.message || 'Network error connecting to Google AI Studio',
    });
  }
}
