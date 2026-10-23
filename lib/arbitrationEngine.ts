import { COMMODITY_PRESETS } from '@/data/commodities';
import { DISTANCE_MATRIX, MANDIS, ORIGIN_CITIES, haversineDistanceKm, resolveOriginLocation } from '@/data/mandis';
import { ArbitrationKnobs, MandiArbitrationResult, ProducePreset } from './types';

export function calculateArbitration(
  knobs: ArbitrationKnobs,
  presetOverride?: ProducePreset
): {
  results: MandiArbitrationResult[];
  recommended: MandiArbitrationResult;
  nearest: MandiArbitrationResult;
  reasoning: string;
} {
  const preset =
    presetOverride ||
    COMMODITY_PRESETS.find((p) => p.id === knobs.commodityId) ||
    COMMODITY_PRESETS[0];

  const originInfo = resolveOriginLocation(knobs.originCityId, knobs.customOriginCoords, knobs.customOriginName);
  const originName = knobs.customOriginName || originInfo.name;
  const initialDecay = knobs.decayIndexOverride !== undefined ? knobs.decayIndexOverride : preset.decayIndex;
  const decayRate = preset.baseDecayRatePerHour;
  const coldChainFactor = knobs.coldChainEnabled ? 0.5 : 1.0;

  // Evaluate candidate Mandis
  const evaluated: MandiArbitrationResult[] = MANDIS.map((mandi) => {
    let distanceKm: number;
    let transitHours: number;

    const presetMatrix = DISTANCE_MATRIX[originInfo.id];
    if (presetMatrix && presetMatrix[mandi.id]) {
      distanceKm = presetMatrix[mandi.id].km;
      transitHours = presetMatrix[mandi.id].hours;
    } else {
      distanceKm = haversineDistanceKm(originInfo.lat, originInfo.lng, mandi.lat, mandi.lng);
      transitHours = Math.max(0.8, Math.round((distanceKm / 46) * 10) / 10);
    }

    // Spoilage formula: clamp(initial_decay + decay_rate_per_hour * transit_hours * (cold_chain ? 0.5 : 1), 0, 100)
    const rawSpoilage = initialDecay + decayRate * transitHours * coldChainFactor;
    const spoilageOnArrivalPercent = Math.min(Math.max(rawSpoilage, 0), 100);
    const spoilageDecimal = spoilageOnArrivalPercent / 100;

    // Smart commodity price lookup (supports custom presets with detected crop name)
    const findCommodityPriceKey = (pId: string, pName: string): string => {
      if (mandi.basePrices[pId]) return pId;
      const lower = `${pId} ${pName}`.toLowerCase();
      if (lower.includes('banana')) return 'banana';
      if (lower.includes('mango')) return 'mango';
      if (lower.includes('potato')) return 'potato';
      if (lower.includes('onion')) return 'onion';
      if (lower.includes('apple')) return 'apple';
      if (lower.includes('tomato')) return 'tomato';
      return 'tomato';
    };

    const priceKey = findCommodityPriceKey(preset.id, preset.name);
    const modalPricePerQuintal = mandi.basePrices[priceKey] || 3200;
    const modalPricePerKg = modalPricePerQuintal / 100;

    // Saleable produce after transit spoilage
    const effectiveSaleableKg = knobs.quantityKg * (1 - spoilageDecimal);
    const grossRevenue = modalPricePerKg * effectiveSaleableKg;

    // Transport cost
    const transportCost = distanceKm * knobs.transportCostPerKm;

    // Net return formula: price_per_kg * quantity * (1 - spoilage_on_arrival) - transport_cost
    const netReturn = Math.round(grossRevenue - transportCost);

    return {
      mandiId: mandi.id,
      mandiName: mandi.name,
      state: mandi.state,
      distanceKm,
      transitHours,
      modalPricePerQuintal,
      modalPricePerKg,
      spoilageOnArrivalPercent: Number(spoilageOnArrivalPercent.toFixed(1)),
      effectiveSaleableKg: Math.round(effectiveSaleableKg),
      grossRevenue: Math.round(grossRevenue),
      transportCost: Math.round(transportCost),
      netReturn,
      isRecommended: false,
      rank: 0,
      netReturnDeltaVsNearest: 0,
    };
  });

  // Pick top 5 candidate Mandis (filter down from 8)
  // Ensure the nearest Mandi is always included in the candidates for fair comparison
  const sortedByDistance = [...evaluated].sort((a, b) => a.distanceKm - b.distanceKm);
  const nearest = sortedByDistance[0];

  // Sort by net return descending
  const sortedByNetReturn = [...evaluated].sort((a, b) => b.netReturn - a.netReturn);
  
  // Make sure top 5 has the nearest + top 4 net return earners
  const candidateIds = new Set<string>([nearest.mandiId]);
  for (const item of sortedByNetReturn) {
    if (candidateIds.size >= 5) break;
    candidateIds.add(item.mandiId);
  }

  const finalCandidates = evaluated
    .filter((m) => candidateIds.has(m.mandiId))
    .sort((a, b) => b.netReturn - a.netReturn);

  // Assign ranks and calculate delta vs nearest
  finalCandidates.forEach((cand, idx) => {
    cand.rank = idx + 1;
    cand.isRecommended = idx === 0;
    cand.netReturnDeltaVsNearest = cand.netReturn - nearest.netReturn;
  });

  const recommended = finalCandidates[0];
  // Generate dynamic explanation
  let reasoning = '';
  if (recommended.mandiId === nearest.mandiId) {
    reasoning = `High initial decay (${initialDecay.toFixed(0)}%) and tight shelf life dictate routing to nearest terminal market ${nearest.mandiName} (${nearest.distanceKm} km from ${originName}). Long-distance arbitrage is unviable because in-transit spoilage outweighs inter-state price premiums.`;
  } else {
    const profitDiff = recommended.netReturn - nearest.netReturn;
    const priceDiffQuintal = recommended.modalPricePerQuintal - nearest.modalPricePerQuintal;
    const extraKm = recommended.distanceKm - nearest.distanceKm;
    reasoning = `Although ${nearest.mandiName} is only ${nearest.distanceKm} km from ${originName}, ${recommended.mandiName} commands a +₹${priceDiffQuintal}/quintal price premium. With ${knobs.coldChainEnabled ? 'active cold-chain telemetry suppressing decay' : 'favorable transit speed'}, this delivers an additional +₹${profitDiff.toLocaleString('en-IN')} net profit despite +${extraKm} km travel.`;
  }

  return {
    results: finalCandidates,
    recommended,
    nearest,
    reasoning,
  };
}

export function simulateMidTransitDegradation(
  knobs: ArbitrationKnobs,
  preset: ProducePreset
): {
  updatedKnobs: ArbitrationKnobs;
  rerouteReason: string;
} {
  // Simulates a mid-transit temperature spike or 6-hour highway traffic choke:
  // Decay index spikes by +28-35%
  const spike = Math.min(preset.decayIndex + 32, 92);
  const updatedKnobs: ArbitrationKnobs = {
    ...knobs,
    decayIndexOverride: spike,
    // When produce suddenly degrades mid-transit, farmers often disable expensive cold chain or the unit faulted
  };

  const rerouteReason = `Telemetry Alert: Reefer compressor thermal fault detected at Highway Milestone KM-340. Internal temperature rose to 26°C. Visual edge degradation jumped from ${preset.decayIndex}% to ${spike}%. Rerouting from long-haul destination to closest viable secondary APMC to avoid total spoilage loss.`;

  return {
    updatedKnobs,
    rerouteReason,
  };
}
