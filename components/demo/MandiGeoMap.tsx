'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { resolveOriginLocation } from '@/data/mandis';
import { MandiArbitrationResult } from '@/lib/types';
import { Navigation, Loader2 } from 'lucide-react';

interface MandiGeoMapProps {
  originCityId: string;
  customOriginName?: string;
  customOriginCoords?: { lat: number; lng: number };
  results: MandiArbitrationResult[];
  recommendedId: string;
  onSelectLocation?: (lat: number, lng: number, locationName: string) => void;
}

// Dynamically import FullInteractiveMap with SSR disabled to prevent Leaflet window reference errors
const FullInteractiveMap = dynamic(
  () => import('./FullInteractiveMap').then((mod) => mod.FullInteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[440px] w-full rounded-2xl bg-[var(--muted-bg)]/60 border border-[var(--border)] flex flex-col items-center justify-center gap-3 text-[var(--muted)] font-mono text-xs">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        <span>Loading interactive OpenStreetMap &amp; transit vectors...</span>
      </div>
    ),
  }
);

export function MandiGeoMap({
  originCityId,
  customOriginName,
  customOriginCoords,
  results,
  recommendedId,
  onSelectLocation,
}: MandiGeoMapProps) {
  const origin = resolveOriginLocation(originCityId, customOriginCoords);
  const originName = customOriginName || origin.name;
  const currentLat = customOriginCoords?.lat || origin.lat;
  const currentLng = customOriginCoords?.lng || origin.lng;

  const handleLocationSelected = (lat: number, lng: number, name: string) => {
    if (onSelectLocation) {
      onSelectLocation(lat, lng, name);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
          <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Interactive India Logistics &amp; Mandi Route Map</span>
        </div>
        <div className="text-[11px] font-mono text-[var(--muted)]">
          Origin: <strong className="text-emerald-700 dark:text-emerald-300">{originName}</strong> ({currentLat.toFixed(3)}°N, {currentLng.toFixed(3)}°E)
        </div>
      </div>

      <FullInteractiveMap
        currentLat={currentLat}
        currentLng={currentLng}
        currentLocationName={originName}
        results={results}
        recommendedId={recommendedId}
        onSelectLocation={handleLocationSelected}
        heightClassName="h-[420px] sm:h-[460px]"
      />
    </div>
  );
}
