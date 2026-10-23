export type FreshnessClass = 'Fresh' | 'Ripe' | 'Overripe' | 'Spoiled';

export interface BoundingBox {
  id: string;
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ProducePreset {
  id: string;
  name: string;
  nameHindi: string;
  emoji: string;
  category: 'Fruit' | 'Vegetable';
  freshnessClass: FreshnessClass;
  decayIndex: number; // 0 - 100
  surfaceSpoilagePercent: number; // 0 - 100
  shelfLifeHours: number;
  baseDecayRatePerHour: number; // % spoilage added per hour in standard ambient transit
  defaultQuantityKg: number;
  svgColor: string;
  accentColor: string;
  boundingBoxes: BoundingBox[];
  description: string;
  descriptionHindi: string;
  aiAnalysis?: {
    provider: string; // 'Google AI Studio'
    model: string; // 'gemini-3.8-flash'
    pathologySummary: string;
    pathologySummaryHindi?: string;
    storageRecommendation?: string;
    dispatchRecommendation?: string;
    detectedCropType?: string;
    latencyMs?: number;
    defectCount?: number;
  };
}

export interface OriginCity {
  id: string;
  name: string;
  state: string;
  hubSpecialty: string;
  lat: number;
  lng: number;
}

export interface Mandi {
  id: string;
  name: string;
  shortName: string;
  state: string;
  region: 'North' | 'West' | 'South' | 'Central';
  lat: number;
  lng: number;
  isTerminalMarket: boolean;
  basePrices: Record<string, number>; // ₹ per quintal (100 kg)
}

export interface MandiArbitrationResult {
  mandiId: string;
  mandiName: string;
  state: string;
  distanceKm: number;
  transitHours: number;
  modalPricePerQuintal: number; // ₹ / quintal
  modalPricePerKg: number; // ₹ / kg
  spoilageOnArrivalPercent: number; // 0 - 100
  effectiveSaleableKg: number;
  grossRevenue: number;
  transportCost: number;
  netReturn: number;
  isRecommended: boolean;
  rank: number;
  netReturnDeltaVsNearest: number; // Difference in ₹ compared to nearest Mandi
}

export interface ArbitrationKnobs {
  commodityId: string;
  quantityKg: number;
  originCityId: string;
  customOriginName?: string;
  customOriginCoords?: { lat: number; lng: number };
  transportCostPerKm: number; // ₹ per km (e.g. ₹28 - ₹45)
  coldChainEnabled: boolean;
  decayIndexOverride?: number;
}

export interface MCPToolCall {
  id: string;
  timestamp: string;
  tool: string;
  status: 'running' | 'completed' | 'failed';
  durationMs: number;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown>;
  gatewaySecurityCheck?: {
    verifiedBy: string;
    tlsCipher: string;
    threatScore: number;
    latencyMs: number;
  };
}

export interface SimulationState {
  isAnalyzing: boolean;
  analyzed: boolean;
  currentPreset: ProducePreset;
  customImageUploaded: boolean;
  customImageUrl?: string;
  knobs: ArbitrationKnobs;
  results: MandiArbitrationResult[];
  recommendedMandi: MandiArbitrationResult | null;
  nearestMandi: MandiArbitrationResult | null;
  isRerouted: boolean;
  rerouteReason?: string;
  toolCalls: MCPToolCall[];
  streamingIndex: number;
  isExecutingAgent: boolean;
}
