'use client';

import React, { useState, useEffect, useRef } from 'react';
import { COMMODITY_PRESETS } from '@/data/commodities';
import { ORIGIN_CITIES, resolveOriginLocation } from '@/data/mandis';
import { ArbitrationKnobs, MandiArbitrationResult, OriginCity, ProducePreset } from '@/lib/types';
import { ArbitrationCharts } from './ArbitrationCharts';
import { MandiGeoMap } from './MandiGeoMap';
import {
  Sparkles,
  Sliders,
  TrendingUp,
  Snowflake,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Key,
  HelpCircle,
  CheckCircle2,
  Navigation,
  MapPin,
  Search,
  LocateFixed,
  Check,
  Loader2,
  X,
  Building2,
} from 'lucide-react';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';

interface PanelArbitrationProps {
  knobs: ArbitrationKnobs;
  onKnobsChange: (knobs: ArbitrationKnobs) => void;
  results: MandiArbitrationResult[];
  recommended: MandiArbitrationResult | null;
  nearest: MandiArbitrationResult | null;
  reasoning: string;
  isRerouted: boolean;
  rerouteReason?: string;
  onTriggerReroute: () => void;
  currentPreset: ProducePreset;
}

export function PanelArbitration({
  knobs,
  onKnobsChange,
  results,
  recommended,
  nearest,
  reasoning,
  isRerouted,
  rerouteReason,
  onTriggerReroute,
  currentPreset,
}: PanelArbitrationProps) {
  const { lang, t } = useThemeLanguage();
  const [showFormula, setShowFormula] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'charts' | 'map'>('table');
  const [tooltipState, setTooltipState] = useState<string | null>(null);

  const activeOrigin = resolveOriginLocation(knobs.originCityId, knobs.customOriginCoords, knobs.customOriginName);
  const activeOriginName = knobs.customOriginName || activeOrigin.name;

  const [locationSearch, setLocationSearch] = useState(activeOriginName);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState<Array<{
    place_id: string | number;
    name: string;
    state: string;
    subtext: string;
    lat: number;
    lng: number;
    isHub?: boolean;
    cityId?: string;
  }>>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocationSearch(activeOriginName);
  }, [activeOriginName]);

  // Click outside to dismiss location dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Live Autocomplete: Instant built-in hubs + Debounced OpenStreetMap Nominatim geocoding
  useEffect(() => {
    const query = locationSearch.trim();
    if (!query || query.length < 2) {
      setLiveSuggestions([]);
      setIsSearchingGeocode(false);
      return;
    }

    const q = query.toLowerCase();

    // 1. Instant local match across 70+ built-in hubs
    const localMatches = ORIGIN_CITIES.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const stateMatch = c.state.toLowerCase().includes(q);
      const specialtyMatch = c.hubSpecialty.toLowerCase().includes(q);
      const idMatch = c.id.toLowerCase().replace(/_/g, ' ').includes(q);
      return nameMatch || stateMatch || specialtyMatch || idMatch;
    }).slice(0, 5).map((c) => ({
      place_id: `hub-${c.id}`,
      name: c.name,
      state: c.state,
      subtext: `${c.state} • ${c.hubSpecialty}`,
      lat: c.lat,
      lng: c.lng,
      isHub: true,
      cityId: c.id,
    }));

    setLiveSuggestions(localMatches);

    // 2. Query Nominatim for real live places across India
    const timer = setTimeout(async () => {
      setIsSearchingGeocode(true);
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=in&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (resp.ok) {
          const data = await resp.json();
          const nominatimList = data.map((item: any, idx: number) => {
            const addr = item.address || {};
            const mainName =
              addr.city ||
              addr.town ||
              addr.suburb ||
              addr.village ||
              addr.county ||
              item.display_name.split(',')[0];
            const stateStr = addr.state || 'India';
            const districtStr = addr.state_district || addr.county || '';
            const sub = [districtStr, stateStr].filter(Boolean).join(', ');

            return {
              place_id: item.place_id || `nom-${idx}`,
              name: mainName,
              state: stateStr,
              subtext: sub || item.display_name,
              lat: Number(parseFloat(item.lat).toFixed(4)),
              lng: Number(parseFloat(item.lon).toFixed(4)),
              isHub: false,
            };
          });

          // Merge: localMatches first, then unique Nominatim places
          const merged = [...localMatches];
          for (const n of nominatimList) {
            if (!merged.some((m) => Math.abs(m.lat - n.lat) < 0.05 && Math.abs(m.lng - n.lng) < 0.05)) {
              merged.push(n);
            }
          }
          setLiveSuggestions(merged.slice(0, 7));
        }
      } catch {
        // network error, retain localMatches
      } finally {
        setIsSearchingGeocode(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationSearch]);

  const handleApplyLocation = (name: string, lat: number, lng: number, cityId?: string) => {
    setLocationSearch(name);
    setIsLocationDropdownOpen(false);
    setGpsStatus(`✓ ${name} (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`);
    setTimeout(() => setGpsStatus(null), 3500);

    onKnobsChange({
      ...knobs,
      originCityId: cityId || `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      customOriginName: name,
      customOriginCoords: { lat, lng },
    });
  };

  const handleCommodityChange = (id: string) => {
    const selectedPreset = COMMODITY_PRESETS.find((p) => p.id === id);
    onKnobsChange({
      ...knobs,
      commodityId: id,
      quantityKg: selectedPreset ? selectedPreset.defaultQuantityKg : knobs.quantityKg,
    });
  };

  const handleSelectLocation = (city: OriginCity) => {
    handleApplyLocation(city.name, city.lat, city.lng, city.id);
  };

  const handleCustomLocationSubmit = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // 1. Direct match from suggestions
    const existing = liveSuggestions.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(s.name.toLowerCase())
    );
    if (existing) {
      handleApplyLocation(existing.name, existing.lat, existing.lng, existing.cityId);
      return;
    }

    // 2. Direct match from built-in cities
    const localMatch = ORIGIN_CITIES.find(
      (c) =>
        c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        trimmed.toLowerCase().includes(c.name.toLowerCase().split(' ')[0]) ||
        c.id.toLowerCase().replace(/_/g, ' ').includes(trimmed.toLowerCase())
    );
    if (localMatch) {
      handleSelectLocation(localMatch);
      return;
    }

    // 3. Live geocode fetch
    setIsSearchingGeocode(true);
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmed
        )}&countrycodes=in&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.length > 0) {
          const top = data[0];
          const lat = Number(parseFloat(top.lat).toFixed(4));
          const lng = Number(parseFloat(top.lon).toFixed(4));
          const cleanName = top.display_name.split(',').slice(0, 2).join(', ');
          handleApplyLocation(cleanName, lat, lng);
          return;
        }
      }
    } catch {
      // network fallback
    } finally {
      setIsSearchingGeocode(false);
    }

    // 4. Fallback to resolveOriginLocation
    const resolved = resolveOriginLocation(trimmed);
    handleApplyLocation(resolved.name, resolved.lat, resolved.lng, resolved.id);
  };

  const handleMapLocationSelect = (lat: number, lng: number, locationName: string) => {
    handleApplyLocation(locationName, lat, lng, 'custom-map');
  };

  const handleUseGPS = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('GPS unavailable');
      return;
    }
    setIsLocating(true);
    setGpsStatus('Locating device...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        const name = `GPS Location (${lat}°N, ${lng}°E)`;
        handleApplyLocation(name, lat, lng, 'custom-gps');
      },
      () => {
        setIsLocating(false);
        setGpsStatus('Location denied');
        setTimeout(() => setGpsStatus(null), 3000);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="agru-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[var(--border)] mb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-[var(--surface-accent)] text-[var(--brand-dark)] dark:bg-emerald-900/50 dark:text-emerald-300 flex items-center justify-center text-xs font-semibold">
              3
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {t.demo.panel3Title}
              </h2>
            </div>
          </div>

          {/* Reroute Trigger Button */}
          <button
            onClick={onTriggerReroute}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isRerouted
                ? 'bg-rose-50 border-rose-300 text-[var(--accent-red)] dark:bg-rose-950/40 dark:border-rose-800'
                : 'bg-[var(--surface-muted)] border-[var(--border)] hover:bg-[var(--surface-accent)] text-[var(--secondary)] hover:text-[var(--brand-dark)]'
            }`}
            title="Simulate sudden mid-transit spoilage spike"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isRerouted ? t.demo.rerouteActiveBtn : 'Simulate transport disruption'}</span>
          </button>
        </div>

        {/* Mid-Transit Alert Callout if Rerouted */}
        {isRerouted && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[var(--accent-red)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-rose-900 dark:text-rose-200 block">
                {lang === 'hi' ? 'परिवहन मार्ग में आपातकालीन बदलाव सक्रिय' : 'Dynamic cargo reroute enacted'}
              </span>
              <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300">
                {rerouteReason}
              </p>
            </div>
          </div>
        )}

        {/* Logistics Controls Organized into Clear Groups */}
        <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] mb-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)]">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{lang === 'hi' ? 'रसद एवं प्रस्थान पैरामीटर' : 'Logistics parameters'}</span>
            </div>
            <span className="text-[11px] font-normal text-[var(--secondary)]">
              {lang === 'hi' ? 'इंटरैक्टिव कंट्रोल्स' : 'Configurable inputs'}
            </span>
          </div>

          {/* Group 1: Produce and Batch */}
          <div>
            <span className="text-[11px] font-medium text-[var(--secondary)] uppercase tracking-wider block mb-2">
              Produce &amp; batch
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Commodity Selection */}
              <div>
                <label className="text-xs font-medium text-[var(--secondary)] block mb-1">
                  {lang === 'hi' ? 'फसल' : 'Commodity'}
                </label>
                <select
                  value={knobs.commodityId}
                  onChange={(e) => handleCommodityChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  {COMMODITY_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {lang === 'hi' ? p.nameHindi : p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Quantity (kg) */}
              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <label className="font-medium text-[var(--secondary)]">{t.demo.batchQuantity}</label>
                  <span className="font-medium text-[var(--foreground)]">
                    {(knobs.quantityKg / 1000).toFixed(1)} tonnes ({knobs.quantityKg} kg)
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={knobs.quantityKg}
                  onChange={(e) =>
                    onKnobsChange({ ...knobs, quantityKg: Number(e.target.value) })
                  }
                  className="w-full accent-[#28784A] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Transport & Cold Chain */}
          <div className="pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] font-medium text-[var(--secondary)] uppercase tracking-wider block mb-2">
              Transport &amp; routing
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Origin Location */}
              <div ref={dropdownRef} className="relative">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <label className="font-medium text-[var(--secondary)] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--primary)]" />
                    <span>{t.demo.originLocation}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('map')}
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline cursor-pointer"
                      title="Open interactive map to click or pick any address"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>{t.demo.chooseOnMap}</span>
                    </button>
                    <span className="text-[var(--border)]">•</span>
                    <button
                      type="button"
                      onClick={handleUseGPS}
                      disabled={isLocating}
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline cursor-pointer"
                      title="Detect Device GPS Location"
                    >
                      <LocateFixed className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? (lang === 'hi' ? 'खोज रहे...' : 'Locating...') : t.demo.useGps}</span>
                    </button>
                  </div>
                </div>

                {/* Location Input with Autocomplete dropdown */}
                <div className="relative">
                  <input
                    type="text"
                    value={locationSearch}
                    onFocus={() => setIsLocationDropdownOpen(true)}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setIsLocationDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomLocationSubmit(locationSearch);
                      }
                    }}
                    placeholder="Search city, district, town or farm..."
                    className="w-full px-2.5 py-1.5 pr-14 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {locationSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocationSearch('');
                          setIsLocationDropdownOpen(true);
                        }}
                        className="text-[var(--secondary)] hover:text-[var(--foreground)] p-0.5 cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCustomLocationSubmit(locationSearch)}
                      className="text-[var(--secondary)] hover:text-[var(--primary)] p-0.5 cursor-pointer"
                      title="Apply entered location"
                    >
                      {isSearchingGeocode ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary)]" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* GPS Status feedback */}
                {gpsStatus && (
                  <span className="text-[11px] text-[var(--primary)] font-medium block mt-1 animate-pulse">
                    {gpsStatus}
                  </span>
                )}

                {/* Autocomplete Dropdown */}
                {isLocationDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl max-h-64 overflow-y-auto p-1.5 text-xs space-y-1">
                    {/* Explicit "Set location" Button */}
                    {locationSearch.trim() && (
                      <button
                        type="button"
                        onClick={() => handleCustomLocationSubmit(locationSearch)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCustomLocationSubmit(locationSearch);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg bg-[var(--surface-accent)] hover:bg-[var(--primary)] hover:text-white text-[var(--primary)] font-medium flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Navigation className="w-3.5 h-3.5 shrink-0 group-hover:text-white text-[var(--primary)]" />
                          <span className="truncate">Set location: &ldquo;{locationSearch}&rdquo;</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--card)] text-[var(--secondary)] group-hover:text-[var(--primary)] shrink-0">
                          ↵ Apply
                        </span>
                      </button>
                    )}

                    {/* Section Header */}
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--secondary)] px-2 pt-1 font-semibold">
                      <span>{locationSearch.trim() ? 'Matching Places & Hubs' : 'Major Agricultural Hubs'}</span>
                      {isSearchingGeocode && (
                        <span className="flex items-center gap-1 text-[var(--primary)] normal-case">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" /> Searching...
                        </span>
                      )}
                    </div>

                    {/* Suggestions List */}
                    {locationSearch.trim() ? (
                      liveSuggestions.length > 0 ? (
                        liveSuggestions.map((s) => (
                          <button
                            key={s.place_id}
                            type="button"
                            onClick={() => handleApplyLocation(s.name, s.lat, s.lng, s.cityId)}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleApplyLocation(s.name, s.lat, s.lng, s.cityId);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--foreground)] transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <div className="truncate pr-2 flex items-center gap-2">
                              <MapPin className={`w-3.5 h-3.5 shrink-0 ${s.isHub ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                              <div className="truncate">
                                <span className="font-medium block truncate text-xs">{s.name}</span>
                                <span className="text-[10px] text-[var(--secondary)] block truncate">
                                  {s.subtext} • {s.lat.toFixed(2)}°N, {s.lng.toFixed(2)}°E
                                </span>
                              </div>
                            </div>
                            {activeOriginName.toLowerCase().includes(s.name.toLowerCase()) && (
                              <Check className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                            )}
                          </button>
                        ))
                      ) : (
                        !isSearchingGeocode && (
                          <div className="px-3 py-2 text-center text-[11px] text-[var(--secondary)]">
                            Press &ldquo;Apply&rdquo; or Enter to geocode &ldquo;{locationSearch}&rdquo;
                          </div>
                        )
                      )
                    ) : (
                      ORIGIN_CITIES.slice(0, 8).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectLocation(c)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectLocation(c);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--foreground)] transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div className="truncate pr-2 flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-medium block truncate text-xs">{c.name}</span>
                              <span className="text-[10px] text-[var(--secondary)] block truncate">
                                {c.state} • {c.hubSpecialty}
                              </span>
                            </div>
                          </div>
                          {knobs.originCityId === c.id && (
                            <Check className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Freight Rate ₹/km */}
              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <label className="font-medium text-[var(--secondary)]">Freight rate</label>
                  <span className="font-medium text-[var(--foreground)]">
                    ₹{knobs.transportCostPerKm} / km
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="2"
                    value={knobs.transportCostPerKm}
                    onChange={(e) =>
                      onKnobsChange({
                        ...knobs,
                        transportCostPerKm: Number(e.target.value),
                      })
                    }
                    className="w-full accent-[#28784A] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Quick Hub Shortcuts */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2.5 text-xs">
              <span className="text-[11px] text-[var(--secondary)] mr-1">Quick origins:</span>
              {[
                { id: 'nashik', label: 'Nashik' },
                { id: 'kolar', label: 'Kolar' },
                { id: 'pune', label: 'Pune' },
                { id: 'nagpur', label: 'Nagpur' },
                { id: 'latur', label: 'Latur' },
                { id: 'guntur', label: 'Guntur' },
                { id: 'indore', label: 'Indore' },
                { id: 'agra', label: 'Agra' },
                { id: 'shimla', label: 'Shimla' },
              ].map((hub) => {
                const isSelected = knobs.originCityId === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => {
                      const match = ORIGIN_CITIES.find((c) => c.id === hub.id);
                      if (match) handleSelectLocation(match);
                    }}
                    className={`px-2 py-0.5 rounded-md text-xs transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-medium shadow-2xs'
                        : 'bg-[var(--card)] text-[var(--secondary)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {hub.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cold Chain Toggle Switch */}
          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Snowflake className="w-4 h-4 text-[var(--accent-blue)]" />
              <div>
                <span className="text-xs font-semibold text-[var(--foreground)] block">
                  Cold-chain refrigerated transport
                </span>
                <span className="text-[11px] text-[var(--secondary)] block">
                  Reefer suppression reduces in-transit decay rate by 50%
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                onKnobsChange({ ...knobs, coldChainEnabled: !knobs.coldChainEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                knobs.coldChainEnabled ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
              }`}
              aria-label="Toggle cold chain"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  knobs.coldChainEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* View Tabs: Candidates Table | Visual Charts | Map */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'table'
                ? 'bg-[var(--brand-dark)] text-white'
                : 'bg-[var(--surface-muted)] text-[var(--secondary)] hover:text-[var(--foreground)]'
            }`}
          >
            Candidate mandis ({results.length})
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-[var(--brand-dark)] text-white'
                : 'bg-[var(--surface-muted)] text-[var(--secondary)] hover:text-[var(--foreground)]'
            }`}
          >
            {t.demo.tabCharts}
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-[var(--brand-dark)] text-white'
                : 'bg-[var(--surface-muted)] text-[var(--secondary)] hover:text-[var(--foreground)]'
            }`}
          >
            <span>🗺️ {t.demo.tabMap}</span>
          </button>
        </div>

        {/* Tab Content 1: Mandi Arbitration Table */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-xs">
              <thead className="bg-[var(--surface-muted)] text-[var(--secondary)] text-[11px] font-medium">
                <tr>
                  <th className="py-2.5 px-3">{t.demo.colRank}</th>
                  <th className="py-2.5 px-3">{t.demo.colPrice}</th>
                  <th className="py-2.5 px-3">{t.demo.colDistance}</th>
                  <th className="py-2.5 px-3">{t.demo.colSpoilage}</th>
                  <th className="py-2.5 px-3">{t.demo.colFreight}</th>
                  <th className="py-2.5 px-3 font-semibold text-[var(--foreground)]">{t.demo.colNet}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {results.map((res) => {
                  const isWinner = res.isRecommended;
                  return (
                    <tr
                      key={res.mandiId}
                      className={`transition-colors ${
                        isWinner
                          ? 'bg-[var(--surface-accent)] font-medium text-[var(--foreground)]'
                          : 'hover:bg-[var(--surface-muted)]/50 text-[var(--secondary)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {isWinner && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--primary)] text-white font-medium shrink-0">
                              Top pick
                            </span>
                          )}
                          <span className="font-semibold text-[var(--foreground)] truncate max-w-[150px]">
                            {res.mandiName}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--secondary)] block">
                          {res.state}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-[var(--foreground)]">
                          ₹{res.modalPricePerQuintal.toLocaleString('en-IN')}/q
                        </span>
                        <span className="text-[10px] text-[var(--secondary)] block">
                          ₹{res.modalPricePerKg.toFixed(1)}/kg
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span>{res.distanceKm} km</span>
                        <span className="text-[10px] text-[var(--secondary)] block">
                          ~{res.transitHours}h transit
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={
                            res.spoilageOnArrivalPercent > 40
                              ? 'text-[var(--accent-red)] font-semibold'
                              : 'text-[var(--accent-amber)] font-semibold'
                          }
                        >
                          {res.spoilageOnArrivalPercent}%
                        </span>
                        <span className="text-[10px] text-[var(--secondary)] block">
                          ~{res.effectiveSaleableKg} kg saleable
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--secondary)]">
                        ₹{res.transportCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-sm">
                        <span className={isWinner ? 'text-[var(--primary)] font-bold' : 'text-[var(--foreground)]'}>
                          ₹{res.netReturn.toLocaleString('en-IN')}
                        </span>
                        {res.netReturnDeltaVsNearest !== 0 && (
                          <span
                            className={`text-[10px] block ${
                              res.netReturnDeltaVsNearest > 0
                                ? 'text-[var(--primary)] font-medium'
                                : 'text-[var(--secondary)]'
                            }`}
                          >
                            {res.netReturnDeltaVsNearest > 0 ? '+' : ''}₹{res.netReturnDeltaVsNearest.toLocaleString('en-IN')} vs local
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content 2: Comparative Charts */}
        {activeTab === 'charts' && (
          <ArbitrationCharts results={results} recommendedId={recommended?.mandiId || ''} />
        )}

        {/* Tab Content 3: India Geo Vectors & Full Interactive Map */}
        {activeTab === 'map' && (
          <MandiGeoMap
            originCityId={knobs.originCityId}
            customOriginName={activeOriginName}
            customOriginCoords={knobs.customOriginCoords || { lat: activeOrigin.lat, lng: activeOrigin.lng }}
            results={results}
            recommendedId={recommended?.mandiId || ''}
            onSelectLocation={handleMapLocationSelect}
          />
        )}

        {/* Winner Highlight & Plain-Language Trade-off Explanation */}
        {recommended && (
          <div className="mt-4 p-4 rounded-xl bg-[var(--surface-accent)] border border-[var(--primary)]/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-dark)]">
                <Sparkles className="w-4 h-4 text-[var(--accent-amber)]" />
                <span>{t.demo.recommendation}: {recommended.mandiName}</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--brand-dark)] text-white">
                Expected net: ₹{recommended.netReturn.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              <strong className="text-[var(--brand-dark)]">{t.demo.whyThisRoute}</strong> {reasoning}
            </p>
          </div>
        )}

        {/* Collapsible: "How it's calculated" Formula */}
        <div className="mt-4 rounded-xl border border-[var(--border)] overflow-hidden">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="w-full px-4 py-2.5 bg-[var(--surface-muted)] hover:bg-[var(--surface-muted)]/80 flex items-center justify-between text-xs font-medium text-[var(--foreground)] transition-colors cursor-pointer"
            aria-expanded={showFormula}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
              <span>{t.demo.howCalculated}</span>
            </div>
            {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFormula && (
            <div className="p-4 bg-[var(--card)] text-xs space-y-3 text-[var(--secondary)] border-t border-[var(--border)]">
              <div>
                <span className="text-[var(--foreground)] font-medium block mb-0.5">
                  1. Spoilage on arrival formula:
                </span>
                <code className="p-2 rounded bg-[var(--surface-muted)] block text-xs font-mono text-[var(--foreground)]">
                  spoilage_on_arrival = initial_decay + (decay_rate_per_hour × transit_hours × (cold_chain ? 0.5 : 1.0))
                </code>
              </div>
              <div>
                <span className="text-[var(--foreground)] font-medium block mb-0.5">
                  2. Net return formula:
                </span>
                <code className="p-2 rounded bg-[var(--surface-muted)] block text-xs font-mono text-[var(--foreground)]">
                  net_return = (modal_price_per_kg × saleable_kg) − (distance_km × freight_rate_per_km)
                </code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Downstream Dispatch & Auth Integration Previews (Clearly labeled as Planned Features) */}
      <div className="mt-5 pt-3.5 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[var(--secondary)] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <span>Calculations verified for freight dispatch</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* WhatsApp Alert Button (Planned feature preview) */}
          <div className="relative group w-1/2 sm:w-auto">
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-muted)] text-[var(--secondary)] border border-[var(--border)] cursor-not-allowed opacity-75"
              aria-label="Notify Buyer via WhatsApp preview"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Notify buyer (WhatsApp)</span>
            </button>
            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:block px-2.5 py-1 rounded bg-black/90 text-white text-[10px] whitespace-nowrap z-30 font-sans shadow-lg">
              Planned feature: automated WhatsApp manifest dispatch
            </div>
          </div>

          {/* Descope Auth Button (Planned feature preview) */}
          <div className="relative group w-1/2 sm:w-auto">
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-muted)] text-[var(--secondary)] border border-[var(--border)] cursor-not-allowed opacity-75"
              aria-label="Sign in with Descope preview"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Sign in with Descope</span>
            </button>
            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:block px-2.5 py-1 rounded bg-black/90 text-white text-[10px] whitespace-nowrap z-30 font-sans shadow-lg">
              Planned feature: driver biometric &amp; passkey authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
