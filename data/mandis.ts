import { Mandi, OriginCity } from '@/lib/types';

export const ORIGIN_CITIES: OriginCity[] = [
  // Maharashtra
  { id: 'nashik', name: 'Nashik Hub', state: 'Maharashtra', hubSpecialty: 'Onion & Grape Capital', lat: 19.9975, lng: 73.7898 },
  { id: 'pune', name: 'Pune Narayangaon', state: 'Maharashtra', hubSpecialty: 'Vegetable & Tomato Cluster', lat: 18.5204, lng: 73.8567 },
  { id: 'nagpur', name: 'Nagpur Central', state: 'Maharashtra', hubSpecialty: 'Citrus & Central Transit Junction', lat: 21.1458, lng: 79.0882 },
  { id: 'latur', name: 'Latur Agri Hub', state: 'Maharashtra', hubSpecialty: 'Soybean & Pulses Trading', lat: 18.4088, lng: 76.5604 },
  { id: 'solapur', name: 'Solapur Market', state: 'Maharashtra', hubSpecialty: 'Pomegranate & Coarse Grains', lat: 17.6599, lng: 75.9064 },
  { id: 'ahmednagar', name: 'Ahmednagar-Sangamner', state: 'Maharashtra', hubSpecialty: 'Tomato & Dairy Corridor', lat: 19.0948, lng: 74.748 },
  { id: 'jalgaon', name: 'Jalgaon Hub', state: 'Maharashtra', hubSpecialty: 'Banana Capital of India', lat: 21.0077, lng: 75.5626 },
  { id: 'kolhapur', name: 'Kolhapur Basin', state: 'Maharashtra', hubSpecialty: 'Sugarcane & Jaggery Trade', lat: 16.705, lng: 74.2433 },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', hubSpecialty: 'Cotton & Sweet Lime Belt', lat: 19.8762, lng: 75.3433 },
  { id: 'amravati', name: 'Amravati Market', state: 'Maharashtra', hubSpecialty: 'Orange & Cotton Corridor', lat: 20.9374, lng: 77.7796 },

  // Karnataka
  { id: 'kolar', name: 'Kolar Valley', state: 'Karnataka', hubSpecialty: 'Tomato Capital of South India', lat: 13.1367, lng: 78.1291 },
  { id: 'bengaluru_rural', name: 'Bengaluru Rural (Doddaballapur)', state: 'Karnataka', hubSpecialty: 'Greenhouse Horticulture', lat: 13.293, lng: 77.5385 },
  { id: 'belagavi', name: 'Belagavi Agri Market', state: 'Karnataka', hubSpecialty: 'Sub-tropical Vegetable Belt', lat: 15.8497, lng: 74.4977 },
  { id: 'hubballi', name: 'Hubballi-Dharwad', state: 'Karnataka', hubSpecialty: 'North Karnataka Agro Hub', lat: 15.3647, lng: 75.124 },
  { id: 'davanagere', name: 'Davanagere Market', state: 'Karnataka', hubSpecialty: 'Maize & Paddy Corridor', lat: 14.4644, lng: 75.9218 },
  { id: 'mysuru', name: 'Mysuru-Nanjangud', state: 'Karnataka', hubSpecialty: 'Banana & Fruit Corridors', lat: 12.2958, lng: 76.6394 },

  // Andhra Pradesh & Telangana
  { id: 'guntur', name: 'Guntur Terminal Hub', state: 'Andhra Pradesh', hubSpecialty: "Asia's Largest Red Chili Market", lat: 16.3067, lng: 80.4365 },
  { id: 'hyderabad', name: 'Hyderabad Shamshabad', state: 'Telangana', hubSpecialty: 'Deccan Seed & Freight Gateway', lat: 17.385, lng: 78.4867 },
  { id: 'vijayawada', name: 'Vijayawada-Krishna Delta', state: 'Andhra Pradesh', hubSpecialty: 'Mango & Horticultural Delta', lat: 16.5062, lng: 80.648 },
  { id: 'kurnool', name: 'Kurnool Market Yard', state: 'Andhra Pradesh', hubSpecialty: 'Onion & Groundnut Hub', lat: 15.8281, lng: 78.0373 },

  // Tamil Nadu
  { id: 'coimbatore', name: 'Coimbatore Market', state: 'Tamil Nadu', hubSpecialty: 'Vegetables & Coconut Belt', lat: 11.0168, lng: 76.9558 },
  { id: 'dindigul', name: 'Dindigul-Oddanchatram', state: 'Tamil Nadu', hubSpecialty: 'Major South Vegetable Yard', lat: 10.3673, lng: 77.9803 },
  { id: 'madurai', name: 'Madurai Market', state: 'Tamil Nadu', hubSpecialty: 'Southern Agro Trading Hub', lat: 9.9252, lng: 78.1198 },
  { id: 'salem', name: 'Salem Hub', state: 'Tamil Nadu', hubSpecialty: 'Mango & Sago Capital', lat: 11.6643, lng: 78.146 },

  // Gujarat
  { id: 'ahmedabad_rural', name: 'Ahmedabad Rural', state: 'Gujarat', hubSpecialty: 'Central Gujarat Agro Gateway', lat: 23.0225, lng: 72.5714 },
  { id: 'surat', name: 'Surat-Navsari', state: 'Gujarat', hubSpecialty: 'South Gujarat Fruit Corridor', lat: 21.1702, lng: 72.8311 },
  { id: 'mehsana', name: 'Mehsana-Unjha', state: 'Gujarat', hubSpecialty: "Asia's Largest Spice & Cumin Yard", lat: 23.588, lng: 72.3693 },
  { id: 'rajkot', name: 'Rajkot Saurashtra', state: 'Gujarat', hubSpecialty: 'Groundnut & Cotton Market', lat: 22.3039, lng: 70.8022 },

  // Madhya Pradesh
  { id: 'indore', name: 'Indore Malwa Hub', state: 'Madhya Pradesh', hubSpecialty: 'Soybean & Potato Capital', lat: 22.7196, lng: 75.8577 },
  { id: 'bhopal', name: 'Bhopal Central', state: 'Madhya Pradesh', hubSpecialty: 'Wheat & Pulses Junction', lat: 23.2599, lng: 77.4126 },
  { id: 'ratlam', name: 'Ratlam Agro Market', state: 'Madhya Pradesh', hubSpecialty: 'Garlic & Onion Hub', lat: 23.3315, lng: 75.0367 },
  { id: 'jabalpur', name: 'Jabalpur Mahakoshal', state: 'Madhya Pradesh', hubSpecialty: 'Green Pea & Pulse Belt', lat: 23.1815, lng: 79.9864 },

  // Uttar Pradesh & North India
  { id: 'greater_noida', name: 'Greater Noida Hub', state: 'Uttar Pradesh', hubSpecialty: 'NCR Cold Storage & Logistics Basin', lat: 28.4744, lng: 77.504 },
  { id: 'noida', name: 'Noida Agro Terminal', state: 'Uttar Pradesh', hubSpecialty: 'Yamuna Expressway Freight Corridor', lat: 28.5355, lng: 77.391 },
  { id: 'delhi', name: 'Delhi NCR (Central)', state: 'Delhi NCT', hubSpecialty: 'National Capital Freight Gateway', lat: 28.6139, lng: 77.209 },
  { id: 'ghaziabad', name: 'Ghaziabad Sahibabad', state: 'Uttar Pradesh', hubSpecialty: 'Western UP Grain & Vegetable Hub', lat: 28.6692, lng: 77.4538 },
  { id: 'gurugram', name: 'Gurugram Khandsa', state: 'Haryana', hubSpecialty: 'South NCR Agro Terminal', lat: 28.4595, lng: 77.0266 },
  { id: 'faridabad', name: 'Faridabad Hub', state: 'Haryana', hubSpecialty: 'Haryana Border Wholesale Yard', lat: 28.4089, lng: 77.3178 },
  { id: 'meerut', name: 'Meerut Partapur', state: 'Uttar Pradesh', hubSpecialty: 'Sugarcane & Vegetable Trading Yard', lat: 28.9845, lng: 77.7064 },
  { id: 'kanpur', name: 'Kanpur Chakeri', state: 'Uttar Pradesh', hubSpecialty: 'Central UP Commercial Agro Terminal', lat: 26.4499, lng: 80.3319 },
  { id: 'prayagraj', name: 'Prayagraj Mundera', state: 'Uttar Pradesh', hubSpecialty: 'Doab Agri Cluster & Guava Capital', lat: 25.4358, lng: 81.8463 },
  { id: 'aligarh', name: 'Aligarh Hub', state: 'Uttar Pradesh', hubSpecialty: 'Grain & Agro-Machinery Corridor', lat: 27.8974, lng: 78.088 },
  { id: 'chandigarh', name: 'Chandigarh Sector 26', state: 'Punjab / Haryana', hubSpecialty: 'Northern APMC Regional Terminal', lat: 30.7333, lng: 76.7794 },
  { id: 'agra', name: 'Agra-Fatehabad', state: 'Uttar Pradesh', hubSpecialty: 'Indo-Gangetic Potato Belt', lat: 27.1767, lng: 78.0081 },
  { id: 'lucknow_rural', name: 'Lucknow-Malihabad', state: 'Uttar Pradesh', hubSpecialty: 'Mango & Vegetable Basin', lat: 26.8467, lng: 80.9462 },
  { id: 'varanasi', name: 'Varanasi Agro Hub', state: 'Uttar Pradesh', hubSpecialty: 'Eastern UP Vegetable Corridor', lat: 25.3176, lng: 82.9739 },
  { id: 'shimla', name: 'Shimla-Kotkhai', state: 'Himachal Pradesh', hubSpecialty: 'Temperate Apple Orchard Corridor', lat: 31.1048, lng: 77.1734 },
  { id: 'solan', name: 'Solan Hub', state: 'Himachal Pradesh', hubSpecialty: 'Mushroom & Off-season Tomato', lat: 30.9045, lng: 77.0967 },
  { id: 'ludhiana', name: 'Ludhiana Central', state: 'Punjab', hubSpecialty: 'Grain & Vegetable Belt', lat: 30.901, lng: 75.8573 },
  { id: 'karnal', name: 'Karnal Agri Corridor', state: 'Haryana', hubSpecialty: 'Basmati & Dairy Hub', lat: 29.6857, lng: 76.9905 },

  // Rajasthan
  { id: 'jaipur_rural', name: 'Jaipur Muhana Rural', state: 'Rajasthan', hubSpecialty: 'Desert Tomato & Onion Belt', lat: 26.9124, lng: 75.7873 },
  { id: 'kota', name: 'Kota Hadoti', state: 'Rajasthan', hubSpecialty: 'Coriander & Soya Hub', lat: 25.2138, lng: 75.8648 },
  { id: 'alwar', name: 'Alwar Market', state: 'Rajasthan', hubSpecialty: 'Mustard & Onion Corridor', lat: 27.553, lng: 76.6346 },

  // East & West Bengal / Bihar
  { id: 'patna', name: 'Patna Basin', state: 'Bihar', hubSpecialty: 'Gangetic Vegetable Cluster', lat: 25.5941, lng: 85.1376 },
  { id: 'muzaffarpur', name: 'Muzaffarpur Hub', state: 'Bihar', hubSpecialty: 'Shahi Litchi & Maize Capital', lat: 26.1209, lng: 85.3647 },
  { id: 'kolkata_rural', name: 'Kolkata Singur', state: 'West Bengal', hubSpecialty: 'Eastern Horticultural Gateway', lat: 22.5726, lng: 88.3639 },
  { id: 'siliguri', name: 'Siliguri North Bengal', state: 'West Bengal', hubSpecialty: 'North-East Produce Junction', lat: 26.7271, lng: 88.3953 },
];

export const MANDIS: Mandi[] = [
  {
    id: 'azadpur',
    name: 'Azadpur Mandi (APMC)',
    shortName: 'Azadpur Delhi',
    state: 'Delhi NCT',
    region: 'North',
    lat: 28.7126,
    lng: 77.1812,
    isTerminalMarket: true,
    basePrices: {
      tomato: 3850, // ₹ / quintal
      banana: 2600,
      mango: 8900,
      potato: 1980,
      onion: 3450,
      apple: 9200,
    },
  },
  {
    id: 'vashi',
    name: 'Vashi APMC Wholesale Market',
    shortName: 'Vashi Mumbai',
    state: 'Maharashtra',
    region: 'West',
    lat: 19.076,
    lng: 73.0075,
    isTerminalMarket: true,
    basePrices: {
      tomato: 3420,
      banana: 2450,
      mango: 8200,
      potato: 1820,
      onion: 2950,
      apple: 8600,
    },
  },
  {
    id: 'koyambedu',
    name: 'Koyambedu Wholesale Market Complex',
    shortName: 'Koyambedu Chennai',
    state: 'Tamil Nadu',
    region: 'South',
    lat: 13.0694,
    lng: 80.1948,
    isTerminalMarket: true,
    basePrices: {
      tomato: 3750,
      banana: 2300,
      mango: 7800,
      potato: 2150,
      onion: 3600,
      apple: 9400,
    },
  },
  {
    id: 'yeshwanthpur',
    name: 'Yeshwanthpur APMC Yard',
    shortName: 'Yeshwanthpur Bengaluru',
    state: 'Karnataka',
    region: 'South',
    lat: 13.0285,
    lng: 77.5458,
    isTerminalMarket: true,
    basePrices: {
      tomato: 3150,
      banana: 2200,
      mango: 7600,
      potato: 2050,
      onion: 3200,
      apple: 8900,
    },
  },
  {
    id: 'pune_market',
    name: 'Gultekdi Market Yard APMC',
    shortName: 'Gultekdi Pune',
    state: 'Maharashtra',
    region: 'West',
    lat: 18.4967,
    lng: 73.8643,
    isTerminalMarket: false,
    basePrices: {
      tomato: 2980,
      banana: 2150,
      mango: 7400,
      potato: 1740,
      onion: 2780,
      apple: 8100,
    },
  },
  {
    id: 'ghazipur',
    name: 'Ghazipur Subzi Mandi',
    shortName: 'Ghazipur Delhi-NCR',
    state: 'Delhi / UP Border',
    region: 'North',
    lat: 28.6258,
    lng: 77.3328,
    isTerminalMarket: true,
    basePrices: {
      tomato: 3680,
      banana: 2520,
      mango: 8650,
      potato: 1910,
      onion: 3380,
      apple: 9050,
    },
  },
  {
    id: 'jaipur',
    name: 'Mahatma Jyotiba Phule Mandi',
    shortName: 'Jaipur Muhana',
    state: 'Rajasthan',
    region: 'North',
    lat: 26.8289,
    lng: 75.7689,
    isTerminalMarket: false,
    basePrices: {
      tomato: 3350,
      banana: 2400,
      mango: 8100,
      potato: 1790,
      onion: 3100,
      apple: 8400,
    },
  },
  {
    id: 'lucknow',
    name: 'Naveen Galla Mandi Sitapur Road',
    shortName: 'Naveen Mandi Lucknow',
    state: 'Uttar Pradesh',
    region: 'Central',
    lat: 26.892,
    lng: 80.9324,
    isTerminalMarket: false,
    basePrices: {
      tomato: 3280,
      banana: 2380,
      mango: 7950,
      potato: 1650,
      onion: 3250,
      apple: 8750,
    },
  },
];

// Highway routing distance matrix (km) and estimated transit hours under Indian freight conditions (~45-50 km/h average)
export const DISTANCE_MATRIX: Record<string, Record<string, { km: number; hours: number }>> = {
  nashik: {
    azadpur: { km: 1240, hours: 26 },
    vashi: { km: 165, hours: 4.5 },
    koyambedu: { km: 1290, hours: 28 },
    yeshwanthpur: { km: 980, hours: 21 },
    pune_market: { km: 210, hours: 5 },
    ghazipur: { km: 1255, hours: 26.5 },
    jaipur: { km: 1020, hours: 22 },
    lucknow: { km: 1190, hours: 25 },
  },
  kolar: {
    azadpur: { km: 2090, hours: 44 },
    vashi: { km: 1040, hours: 22 },
    koyambedu: { km: 265, hours: 6 },
    yeshwanthpur: { km: 75, hours: 2 },
    pune_market: { km: 910, hours: 19 },
    ghazipur: { km: 2105, hours: 44.5 },
    jaipur: { km: 1980, hours: 41 },
    lucknow: { km: 1920, hours: 40 },
  },
  nagpur: {
    azadpur: { km: 1080, hours: 23 },
    vashi: { km: 820, hours: 17 },
    koyambedu: { km: 1100, hours: 24 },
    yeshwanthpur: { km: 1060, hours: 23 },
    pune_market: { km: 730, hours: 15.5 },
    ghazipur: { km: 1095, hours: 23.5 },
    jaipur: { km: 910, hours: 19.5 },
    lucknow: { km: 740, hours: 16 },
  },
  pune: {
    azadpur: { km: 1410, hours: 29 },
    vashi: { km: 145, hours: 3.5 },
    koyambedu: { km: 1180, hours: 25 },
    yeshwanthpur: { km: 840, hours: 18 },
    pune_market: { km: 18, hours: 0.8 },
    ghazipur: { km: 1425, hours: 29.5 },
    jaipur: { km: 1180, hours: 24.5 },
    lucknow: { km: 1340, hours: 28 },
  },
  agra: {
    azadpur: { km: 230, hours: 4.5 },
    vashi: { km: 1210, hours: 25 },
    koyambedu: { km: 1980, hours: 42 },
    yeshwanthpur: { km: 1910, hours: 40 },
    pune_market: { km: 1260, hours: 26.5 },
    ghazipur: { km: 215, hours: 4.2 },
    jaipur: { km: 240, hours: 5 },
    lucknow: { km: 330, hours: 6.5 },
  },
  shimla: {
    azadpur: { km: 350, hours: 7.5 },
    vashi: { km: 1720, hours: 35 },
    koyambedu: { km: 2490, hours: 52 },
    yeshwanthpur: { km: 2420, hours: 50 },
    pune_market: { km: 1780, hours: 37 },
    ghazipur: { km: 365, hours: 7.8 },
    jaipur: { km: 620, hours: 13 },
    lucknow: { km: 820, hours: 17 },
  },
};

/**
 * Calculates geodesic driving road distance using the Haversine formula
 * adjusted with the standard Indian NHAI highway road-winding multiplier (~1.28x).
 */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;
  return Math.max(15, Math.round(straightLineKm * 1.28));
}

/**
 * Resolves any custom location name, query, or GPS coordinate pair into a full OriginCity record.
 */
export function resolveOriginLocation(
  originIdOrQuery: string,
  customCoords?: { lat: number; lng: number },
  customName?: string
): OriginCity {
  // If real device GPS coordinates or custom geocoded coordinates are supplied
  if (customCoords && typeof customCoords.lat === 'number' && typeof customCoords.lng === 'number') {
    const fallbackTitle = originIdOrQuery?.startsWith('custom-')
      ? originIdOrQuery.replace(/^custom-/, '').replace(/-/g, ' ')
      : originIdOrQuery;
    const displayName = customName || fallbackTitle || 'Selected Origin';
    return {
      id: originIdOrQuery || 'custom-loc',
      name: displayName,
      state: 'Geocoded Dispatch Location',
      hubSpecialty: `Lat: ${customCoords.lat.toFixed(3)}°, Lng: ${customCoords.lng.toFixed(3)}°`,
      lat: customCoords.lat,
      lng: customCoords.lng,
    };
  }

  const query = (originIdOrQuery || 'nashik').trim().toLowerCase();

  // 1. Direct ID match
  const idMatch = ORIGIN_CITIES.find((c) => c.id.toLowerCase() === query);
  if (idMatch) return idMatch;

  // 2. Direct Name match
  const nameMatch = ORIGIN_CITIES.find((c) => c.name.toLowerCase() === query);
  if (nameMatch) return nameMatch;

  // 3. Normalized / Substring match (e.g. user typed "greater noida", "noida", "delhi", "latur", "pune")
  const normQuery = query.replace(/[_\s-]+/g, ' ');
  const partial = ORIGIN_CITIES.find((c) => {
    const normName = c.name.toLowerCase().replace(/[_\s-]+/g, ' ');
    const normId = c.id.toLowerCase().replace(/[_\s-]+/g, ' ');
    return (
      normName.includes(normQuery) ||
      normQuery.includes(normName) ||
      normId.includes(normQuery) ||
      normQuery.includes(normId) ||
      c.state.toLowerCase().includes(normQuery)
    );
  });
  if (partial) {
    return {
      ...partial,
      name: originIdOrQuery.trim(),
    };
  }

  // 4. Fallback for completely arbitrary custom location (e.g. "Sangamner Farm", "Baramati", "Khandwa"):
  // Generates smooth, realistic coordinates within the central Indian agricultural belt
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = (((Math.abs(hash) % 100) / 100) * 8 - 4); // +/- 4 deg
  const lngOffset = (((Math.abs(hash >> 3) % 100) / 100) * 8 - 4);

  return {
    id: `custom-${query.replace(/[^a-z0-9]/g, '') || 'loc'}`,
    name: originIdOrQuery.trim(),
    state: 'Custom Dispatch Origin',
    hubSpecialty: 'Direct Farm Hub',
    lat: Number((20.5937 + latOffset).toFixed(4)),
    lng: Number((78.9629 + lngOffset).toFixed(4)),
  };
}
