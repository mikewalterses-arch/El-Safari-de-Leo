import type { SightingLocation } from '@/types/models';

const NOMINATIM_REVERSE = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Pide la posición actual y resuelve un nombre de lugar legible.
 * Si geolocalización falla, propaga el error (el caller decide si guardar sin location).
 * Si reverse-geocoding falla, devuelve placeName vacío (lat/lng siguen siendo válidos).
 *
 * TODO(fase-3): cache localStorage de reverse geocoding por (lat, lng) redondeados a 0.01.
 */
export async function getCurrentLocation(): Promise<SightingLocation> {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60_000,
    });
  });

  const { latitude: lat, longitude: lng } = position.coords;

  let placeName = '';
  try {
    placeName = await reverseGeocode(lat, lng);
  } catch {
    placeName = '';
  }

  return { lat, lng, placeName };
}

interface NominatimAddress {
  attraction?: string;
  zoo?: string;
  park?: string;
  beach?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    'accept-language': 'es',
    zoom: '16',
  });
  const res = await fetch(`${NOMINATIM_REVERSE}?${params}`);
  if (!res.ok) throw new Error('Nominatim failed');
  const data: NominatimResponse = await res.json();

  // Priorizar puntos de interés ("Zoo de Madrid") sobre dirección postal completa
  const a = data.address;
  if (a) {
    const poi = a.attraction ?? a.zoo ?? a.park ?? a.beach;
    const locality =
      a.neighbourhood ?? a.suburb ?? a.city ?? a.town ?? a.village;
    if (poi && locality) return `${poi}, ${locality}`;
    if (poi) return poi;
    if (locality) return locality;
  }
  return data.display_name ?? '';
}
