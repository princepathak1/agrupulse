/**
 * AgruPulse API Client Layer
 * 
 * NOTE: Currently runs on deterministic client-side simulated data.
 * Designed as a drop-in replacement interface for a production
 * FastAPI / FastMCP server backend.
 * 
 * To switch to a live backend:
 * 1. Set NEXT_PUBLIC_USE_LIVE_API=true in .env.local
 * 2. Point NEXT_PUBLIC_FASTAPI_URL to your FastAPI/FastMCP server endpoint
 */

import { calculateArbitration } from './arbitrationEngine';
import { generateMCPToolCalls } from './mcpSimulator';
import { ArbitrationKnobs, MandiArbitrationResult, MCPToolCall, ProducePreset } from './types';

const USE_LIVE_API = process.env.NEXT_PUBLIC_USE_LIVE_API === 'true';
const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export interface GradingResponse {
  preset: ProducePreset;
  inferenceMs: number;
}

export interface ArbitrationResponse {
  results: MandiArbitrationResult[];
  recommended: MandiArbitrationResult;
  nearest: MandiArbitrationResult;
  reasoning: string;
  toolCalls: MCPToolCall[];
}

export async function analyzeProduceImage(
  imageFile: File | null,
  preset: ProducePreset
): Promise<GradingResponse> {
  if (USE_LIVE_API && imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('commodity', preset.id);

    const res = await fetch(`${API_BASE_URL}/api/v1/grade-produce`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Grading API failed with status ${res.status}`);
    return await res.json();
  }

  // Simulated latency for realism
  await new Promise((resolve) => setTimeout(resolve, 750));
  return {
    preset,
    inferenceMs: 84,
  };
}

export async function executeArbitrationAgent(
  knobs: ArbitrationKnobs,
  preset: ProducePreset,
  originCityName: string
): Promise<ArbitrationResponse> {
  if (USE_LIVE_API) {
    const res = await fetch(`${API_BASE_URL}/api/v1/arbitrate-mandi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ knobs, preset }),
    });
    if (!res.ok) throw new Error(`Arbitration API failed with status ${res.status}`);
    return await res.json();
  }

  // Client-side simulation
  const calculation = calculateArbitration(knobs, preset);
  const toolCalls = generateMCPToolCalls(
    preset,
    originCityName,
    calculation.results,
    calculation.recommended,
    knobs.coldChainEnabled
  );

  return {
    ...calculation,
    toolCalls,
  };
}
