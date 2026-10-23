import { MandiArbitrationResult, MCPToolCall, ProducePreset } from './types';

export function generateMCPToolCalls(
  preset: ProducePreset,
  originCityName: string,
  candidates: MandiArbitrationResult[],
  recommended: MandiArbitrationResult,
  coldChain: boolean
): MCPToolCall[] {
  const formatTime = (offsetSec: number) => {
    const sec = (12 + offsetSec).toString().padStart(2, '0');
    return `14:32:${sec}.420`;
  };

  const isAIPowered = !!preset.aiAnalysis;

  return [
    {
      id: isAIPowered ? 'call-gemini-studio-01' : 'call-yolo-edge-01',
      timestamp: formatTime(0),
      tool: isAIPowered ? 'google_ai_studio.gemini_multimodal_vision' : 'edge_vision.analyze_decay',
      status: 'completed',
      durationMs: isAIPowered ? preset.aiAnalysis?.latencyMs || 620 : 84,
      arguments: isAIPowered
        ? {
            provider: 'Google AI Studio',
            model: preset.aiAnalysis?.model || 'gemini-3.8-flash',
            modality: 'Multimodal Vision (High-Resolution RGB)',
            commodity_target: preset.name,
            prompt_instruction: 'AGMARK & ICAR Post-Harvest Grading & Defect Localization',
          }
        : {
            model: 'yolov8n_decay_int8.onnx',
            input_tensor: '1x3x640x640',
            commodity_target: preset.id,
            detection_threshold: 0.75,
          },
      result: {
        detected_class: preset.freshnessClass,
        decay_index: preset.decayIndex,
        surface_spoilage_pct: preset.surfaceSpoilagePercent,
        estimated_shelf_life_hours: preset.shelfLifeHours,
        bounding_box_count: preset.boundingBoxes.length,
        inference_latency: isAIPowered
          ? `${preset.aiAnalysis?.latencyMs || 620}ms (Google Cloud TPU / Gemini 3.8 Flash)`
          : '14.2ms (Edge NPU)',
        model_name: isAIPowered ? preset.aiAnalysis?.model || 'gemini-3.8-flash' : 'YOLOv8-Nano',
        provider: isAIPowered ? 'Google AI Studio' : 'Edge NPU (INT8)',
        pathology_summary: preset.aiAnalysis?.pathologySummary,
        storage_recommendation: preset.aiAnalysis?.storageRecommendation,
        dispatch_recommendation: preset.aiAnalysis?.dispatchRecommendation,
      },
      gatewaySecurityCheck: {
        verifiedBy: isAIPowered ? 'Cequence AI Gateway (mTLS & Cloud Guardrails)' : 'Cequence AI Gateway Proxy',
        tlsCipher: 'TLS_AES_256_GCM_SHA384',
        threatScore: 0,
        latencyMs: 1.8,
      },
    },
    {
      id: 'call-agmarknet-query-02',
      timestamp: formatTime(1),
      tool: 'agmarknet_api.get_live_mandi_prices',
      status: 'completed',
      durationMs: 312,
      arguments: {
        commodity: preset.name,
        states_queried: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Rajasthan', 'Uttar Pradesh'],
        date: '2026-10-14',
        price_type: 'Modal',
      },
      result: {
        records_found: 8,
        price_spread: {
          min_modal_quintal: Math.min(...candidates.map((c) => c.modalPricePerQuintal)),
          max_modal_quintal: Math.max(...candidates.map((c) => c.modalPricePerQuintal)),
          spread_inr: Math.max(...candidates.map((c) => c.modalPricePerQuintal)) - Math.min(...candidates.map((c) => c.modalPricePerQuintal)),
        },
        data_source: 'National Agriculture Market (e-NAM) / Agmarknet Gateway',
        cache_hit: false,
      },
    },
    {
      id: 'call-transit-decay-03',
      timestamp: formatTime(2),
      tool: 'telemetry_agent.calculate_transit_decay',
      status: 'completed',
      durationMs: 145,
      arguments: {
        origin_hub: originCityName,
        candidate_count: candidates.length,
        base_decay_rate_hr: preset.baseDecayRatePerHour,
        cold_chain_telemetry_active: coldChain,
        decay_reduction_multiplier: coldChain ? 0.5 : 1.0,
      },
      result: {
        candidates_computed: candidates.map((c) => ({
          destination: c.mandiName,
          distance_km: c.distanceKm,
          transit_hours: c.transitHours,
          projected_spoilage_pct: c.spoilageOnArrivalPercent,
        })),
        spoilage_formula: 'clamp(initial_decay + rate * hours * factor, 0, 100)',
      },
    },
    {
      id: 'call-rank-destinations-04',
      timestamp: formatTime(3),
      tool: 'arbitration_orchestrator.rank_destinations',
      status: 'completed',
      durationMs: 198,
      arguments: {
        batch_quantity_kg: candidates[0]?.effectiveSaleableKg ? Math.round(candidates[0].grossRevenue / (candidates[0].modalPricePerKg || 1)) : 4000,
        strategy: 'maximize_net_return_after_freight',
        penalty_weights: {
          transit_spoilage: 1.0,
          fuel_surcharge_km: 1.0,
        },
      },
      result: {
        top_destination: recommended.mandiName,
        projected_net_return_inr: recommended.netReturn,
        delta_vs_nearest_inr: recommended.netReturnDeltaVsNearest,
        arbitration_verdict: recommended.isRecommended
          ? `Arbitrage optimal: routed to ${recommended.mandiName} (+₹${recommended.netReturnDeltaVsNearest.toLocaleString('en-IN')})`
          : 'Nearest market liquidation recommended',
      },
    },
    {
      id: 'call-dispatch-order-05',
      timestamp: formatTime(4),
      tool: 'cequence_gateway.dispatch_order',
      status: 'completed',
      durationMs: 276,
      arguments: {
        action: 'EXECUTE_CONSIGNMENT_DISPATCH',
        destination_mandi_id: recommended.mandiId,
        buyer_allocation: 'APMC Authorized Commission Agent Guild',
        freight_reserve_inr: recommended.transportCost,
        escrow_mode: 'DESCOPE_OAUTH_PREVIEW',
      },
      result: {
        consignment_id: 'AGRU-849201',
        dispatch_status: 'DISPATCH_COMMITTED',
        routing_waypoints: [`${originCityName} Freight Terminal`, `NH Corridor Checkpoint`, recommended.mandiName],
        gateway_security: 'VERIFIED_BY_CEQUENCE_AI_GATEWAY',
      },
      gatewaySecurityCheck: {
        verifiedBy: 'Cequence AI Gateway Proxy v4.2.1',
        tlsCipher: 'TLS_AES_256_GCM_SHA384 (mTLS Enforced)',
        threatScore: 0.01,
        latencyMs: 8.4,
      },
    },
  ];
}
