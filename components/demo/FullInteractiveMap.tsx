'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MANDIS, ORIGIN_CITIES } from '@/data/mandis';
import { MandiArbitrationResult } from '@/lib/types';
import {
  Search,
  MapPin,
  Crosshair,
  Layers,
  Sparkles,
  Loader2,
  X,
  Check,
  Navigation,
  Info,
} from 'lucide-react';

interface FullInteractiveMapProps {
  currentLat: number;
  currentLng: number;
  currentLocationName: string;
  results: MandiArbitrationResult[];
  recommendedId: string;
  onSelectLocation: (lat: number, lng: number, locationName: string) => void;
  heightClassName?: string;
}

interface GeocodingResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  address?: {
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
  };
}

export function FullInteractiveMap({
  currentLat,
  currentLng,
  currentLocationName,
  results,
  recommendedId,
  onSelectLocation,
  heightClassName = 'h-[440px]',
}: FullInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const routesLayerGroupRef = useRef<any>(null);
  const mandisLayerGroupRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'voyager'>('voyager');
  const [tileLayerRef, setTileLayerRef] = useState<any>(null);
  const [reverseGeocodingStatus, setReverseGeocodingStatus] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // already initialized

      const L = await import('leaflet');

      if (isCancelled || !mapContainerRef.current) return;

      // Default center: currentLat, currentLng or Nashik
      const initialLat = currentLat || 20.0059;
      const initialLng = currentLng || 73.7898;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 7,
        zoomControl: true,
        attributionControl: false,
      });

      // CartoDB Voyager Tile layer
      const voyagerTile = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      );

      voyagerTile.addTo(map);
      setTileLayerRef(voyagerTile);

      // Layer groups for clean updates
      const routesGroup = L.layerGroup().addTo(map);
      const mandisGroup = L.layerGroup().addTo(map);
      routesLayerGroupRef.current = routesGroup;
      mandisLayerGroupRef.current = mandisGroup;

      // Custom Origin Marker Icon
      const originIcon = L.divIcon({
        className: 'custom-origin-div-icon',
        html: `
          <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:grab;">
            <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:#f59e0b; opacity:0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width:26px; height:26px; border-radius:50%; background:#d97706; border:3px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:white; font-size:13px; font-weight:bold;">
              📍
            </div>
            <div style="position:absolute; top:-22px; background:#1b4332; color:white; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; white-space:nowrap; border:1px solid #52b788; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
              ORIGIN / FARM
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const originMarker = L.marker([initialLat, initialLng], {
        icon: originIcon,
        draggable: true,
      }).addTo(map);

      originMarkerRef.current = originMarker;

      // Drag handler on origin marker
      originMarker.on('dragend', async () => {
        const pos = originMarker.getLatLng();
        await reverseGeocodeAndSelect(pos.lat, pos.lng);
      });

      // Map click handler: click anywhere in India/world to place origin
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        originMarker.setLatLng([lat, lng]);
        await reverseGeocodeAndSelect(lat, lng);
      });

      mapInstanceRef.current = map;
      setIsMapLoaded(true);

      // Force recalculation of container size after mounting
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle tile layer style change
  const handleTileStyleChange = async (style: 'streets' | 'satellite' | 'voyager') => {
    if (!mapInstanceRef.current) return;
    const L = await import('leaflet');
    const map = mapInstanceRef.current;

    if (tileLayerRef) {
      map.removeLayer(tileLayerRef);
    }

    let newLayer: any;
    if (style === 'satellite') {
      newLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );
    } else if (style === 'streets') {
      newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      });
    } else {
      newLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      );
    }

    newLayer.addTo(map);
    setTileLayerRef(newLayer);
    setMapStyle(style);
  };

  // Reverse geocode when pin is placed or dragged
  const reverseGeocodeAndSelect = async (lat: number, lng: number) => {
    setReverseGeocodingStatus('Resolving address...');
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (resp.ok) {
        const data = await resp.json();
        const addr = data.address || {};
        const shortName =
          addr.village ||
          addr.town ||
          addr.city ||
          addr.county ||
          addr.state_district ||
          data.display_name.split(',')[0];
        const stateName = addr.state ? `, ${addr.state}` : '';
        const resolvedName = `${shortName}${stateName}` || `Location (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`;

        setReverseGeocodingStatus(null);
        onSelectLocation(lat, lng, resolvedName);
        return;
      }
    } catch {
      // Ignore network errors and fallback
    }

    const fallbackName = `Location (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`;
    setReverseGeocodingStatus(null);
    onSelectLocation(lat, lng, fallbackName);
  };

  // Sync origin marker position when currentLat / currentLng changes externally
  useEffect(() => {
    if (!originMarkerRef.current || !mapInstanceRef.current) return;
    const currentMarkerPos = originMarkerRef.current.getLatLng();
    if (
      Math.abs(currentMarkerPos.lat - currentLat) > 0.001 ||
      Math.abs(currentMarkerPos.lng - currentLng) > 0.001
    ) {
      originMarkerRef.current.setLatLng([currentLat, currentLng]);
      mapInstanceRef.current.panTo([currentLat, currentLng], { animate: true });
    }
  }, [currentLat, currentLng]);

  // Redraw Mandi markers & routing vectors whenever results or recommendedId changes
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;

    async function drawRoutesAndMandis() {
      const L = await import('leaflet');
      const map = mapInstanceRef.current;
      const routesGroup = routesLayerGroupRef.current;
      const mandisGroup = mandisLayerGroupRef.current;

      if (!routesGroup || !mandisGroup) return;

      routesGroup.clearLayers();
      mandisGroup.clearLayers();

      const originLatLng: [number, number] = [currentLat, currentLng];

      results.forEach((res) => {
        const mandi = MANDIS.find((m) => m.id === res.mandiId);
        if (!mandi) return;

        const isWinner = res.mandiId === recommendedId;
        const mandiLatLng: [number, number] = [mandi.lat, mandi.lng];

        // 1. Draw Polyline Route
        const routeColor = isWinner ? '#28784A' : '#94A3B8';
        const routeWeight = isWinner ? 3.5 : 2;
        const routeDash = isWinner ? undefined : '5, 6';
        const routeOpacity = isWinner ? 0.95 : 0.55;

        const polyline = L.polyline([originLatLng, mandiLatLng], {
          color: routeColor,
          weight: routeWeight,
          dashArray: routeDash,
          opacity: routeOpacity,
        });

        polyline.addTo(routesGroup);

        // 2. Custom Mandi Marker
        const mandiIcon = L.divIcon({
          className: 'custom-mandi-div-icon',
          html: `
            <div style="position:relative; cursor:pointer;">
              <div style="
                width: ${isWinner ? '30px' : '22px'};
                height: ${isWinner ? '30px' : '22px'};
                border-radius: 50%;
                background: ${isWinner ? '#28784A' : '#475569'};
                border: 2px solid #ffffff;
                box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-size: ${isWinner ? '12px' : '9px'};
                font-weight: 600;
              ">
                ${isWinner ? '★' : '•'}
              </div>
              <div style="
                position: absolute;
                top: ${isWinner ? '-22px' : '-18px'};
                left: 50%;
                transform: translateX(-50%);
                background: ${isWinner ? '#174A32' : '#202820'};
                color: #ffffff;
                font-size: ${isWinner ? '10px' : '9px'};
                font-weight: 600;
                padding: 1.5px 6px;
                border-radius: 4px;
                white-space: nowrap;
                border: 1px solid ${isWinner ? '#28784A' : '#475569'};
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              ">
                ${mandi.shortName.split(' ')[0]} (₹${res.modalPricePerKg.toFixed(1)}/kg)
              </div>
            </div>
          `,
          iconSize: [isWinner ? 32 : 24, isWinner ? 32 : 24],
          iconAnchor: [isWinner ? 16 : 12, isWinner ? 16 : 12],
        });

        const mandiMarker = L.marker(mandiLatLng, { icon: mandiIcon });

        // Popup with rich arbitration details
        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #1e293b; min-width: 190px;">
            <div style="font-weight: bold; font-size: 13px; color: ${isWinner ? '#047857' : '#0f172a'}; margin-bottom: 4px;">
              ${isWinner ? '★ Recommended: ' : ''}${res.mandiName}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
              ${mandi.state} • Modal: <strong>₹${res.modalPricePerQuintal}/quintal</strong> (₹${res.modalPricePerKg.toFixed(1)}/kg)
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #f8fafc; padding: 6px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 6px; font-size: 10px;">
              <div>🛣️ <strong>${res.distanceKm} km</strong></div>
              <div>⏱️ <strong>${res.transitHours}h</strong> transit</div>
              <div>📉 Spoilage: <strong>${res.spoilageOnArrivalPercent}%</strong></div>
              <div>🚚 Freight: <strong>₹${res.transportCost.toLocaleString('en-IN')}</strong></div>
            </div>
            <div style="background: ${isWinner ? '#ecfdf5' : '#f1f5f9'}; border: 1px solid ${isWinner ? '#a7f3d0' : '#cbd5e1'}; padding: 4px 8px; border-radius: 6px; font-weight: bold; color: ${isWinner ? '#065f46' : '#334155'}; text-align: center;">
              Net Return: ₹${res.netReturn.toLocaleString('en-IN')}
            </div>
          </div>
        `;

        mandiMarker.bindPopup(popupContent);
        mandiMarker.addTo(mandisGroup);
      });
    }

    drawRoutesAndMandis();
  }, [isMapLoaded, results, recommendedId, currentLat, currentLng]);

  // Handle Search using Nominatim + built-in fallback
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsDropdownOpen(true);
  };

  // Debounced geocoding search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Query OpenStreetMap Nominatim for real addresses across India
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=in&limit=6&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        );

        if (resp.ok) {
          const data: GeocodingResult[] = await resp.json();
          // Also prepend any matching built-in hubs for instantaneous offline feedback
          const hubMatches: GeocodingResult[] = ORIGIN_CITIES.filter(
            (c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.state.toLowerCase().includes(searchQuery.toLowerCase())
          )
            .slice(0, 3)
            .map((c, i) => ({
              place_id: -(i + 1),
              lat: c.lat.toString(),
              lon: c.lng.toString(),
              display_name: `${c.name}, ${c.state} (Agricultural Hub - ${c.hubSpecialty})`,
            }));

          // Deduplicate
          const combined = [...hubMatches, ...data];
          setSearchResults(combined);
        }
      } catch {
        // Fallback to built-in hubs if Nominatim fails
        const hubMatches: GeocodingResult[] = ORIGIN_CITIES.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.state.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((c, i) => ({
          place_id: -(i + 1),
          lat: c.lat.toString(),
          lon: c.lng.toString(),
          display_name: `${c.name}, ${c.state} (${c.hubSpecialty})`,
        }));
        setSearchResults(hubMatches);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (result: GeocodingResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const name = result.display_name.split(',').slice(0, 3).join(', ');

    setSearchQuery(name);
    setIsDropdownOpen(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 11, { duration: 1.2 });
    }
    if (originMarkerRef.current) {
      originMarkerRef.current.setLatLng([lat, lng]);
    }

    onSelectLocation(lat, lng, name);
  };

  const handleUseGPS = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setReverseGeocodingStatus('Detecting device GPS...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 13);
        }
        if (originMarkerRef.current) {
          originMarkerRef.current.setLatLng([lat, lng]);
        }
        await reverseGeocodeAndSelect(lat, lng);
      },
      () => {
        setReverseGeocodingStatus(null);
        alert('Could not retrieve GPS location. Please allow location access.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--card)] flex flex-col">
      {/* Top Map Toolbar: Live Address Search + View Style Switcher + GPS */}
      <div className="p-3 bg-[var(--muted-bg)]/80 backdrop-blur-md border-b border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2.5 z-20 relative">
        {/* Address Search Bar */}
        <div className="relative w-full sm:w-96">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ANY village, farm, highway, or address in India..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin absolute right-8" />
            )}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsDropdownOpen(false);
                }}
                className="absolute right-2.5 text-[var(--muted)] hover:text-[var(--foreground)] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-xl z-50 divide-y divide-[var(--border)]">
              {searchResults.map((res) => (
                <button
                  key={res.place_id}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-start gap-2 text-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <span className="font-semibold text-[var(--foreground)] block truncate">
                      {res.display_name.split(',')[0]}
                    </span>
                    <span className="text-[10px] text-[var(--muted)] block truncate">
                      {res.display_name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Controls: GPS Button + Layer Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* GPS Button */}
          <button
            onClick={handleUseGPS}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--brand-dark)] text-white hover:bg-[var(--primary)] transition-colors cursor-pointer"
            title="Locate my farm using device GPS"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Use GPS</span>
          </button>

          {/* Layer switcher */}
          <div className="flex items-center bg-[var(--card)] rounded-lg p-0.5 border border-[var(--border)] text-xs font-medium">
            <button
              onClick={() => handleTileStyleChange('voyager')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                mapStyle === 'voyager'
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
              }`}
            >
              Voyager
            </button>
            <button
              onClick={() => handleTileStyleChange('streets')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                mapStyle === 'streets'
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
              }`}
            >
              OSM
            </button>
            <button
              onClick={() => handleTileStyleChange('satellite')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                mapStyle === 'satellite'
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className={`relative w-full ${heightClassName} bg-[var(--surface-muted)] z-10`}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Instruction & Active Origin Badge */}
        <div className="absolute top-3 left-3 bg-[var(--card)]/95 backdrop-blur-xs text-[var(--foreground)] px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs shadow-xs flex items-center gap-2 pointer-events-none z-20 max-w-[85%]">
          <Navigation className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
          <div className="truncate">
            <span className="text-[var(--secondary)]">Origin:</span>{' '}
            <span className="font-semibold text-[var(--foreground)]">{currentLocationName}</span>
          </div>
        </div>

        {/* Status Indicator (Reverse Geocoding / Click prompt) */}
        <div className="absolute bottom-3 left-3 bg-[var(--card)]/95 backdrop-blur-xs text-[var(--secondary)] px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs shadow-xs flex items-center gap-2 pointer-events-none z-20">
          <Info className="w-3.5 h-3.5 text-[var(--accent-amber)] shrink-0" />
          <span>
            {reverseGeocodingStatus || '💡 Click anywhere or drag the 📍 pin to set your exact farm/origin'}
          </span>
        </div>
      </div>
    </div>
  );
}
