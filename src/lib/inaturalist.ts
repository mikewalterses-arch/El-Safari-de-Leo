import type { Locale } from '@/i18n';
import type { AnimalSearchResult } from '@/types/models';

const INAT_TAXA = 'https://api.inaturalist.org/v1/taxa';
const INAT_SPECIES_COUNTS =
  'https://api.inaturalist.org/v1/observations/species_counts';

const TAXON_ANIMALIA = 1;

interface INatPhoto {
  square_url?: string;
  medium_url?: string;
}

interface INatTaxon {
  id: number;
  name: string;
  preferred_common_name?: string;
  default_photo?: INatPhoto;
  wikipedia_url?: string;
  iconic_taxon_name?: string;
  rank?: string;
}

interface INatTaxaResponse {
  results?: INatTaxon[];
}

async function fetchTaxaOnce(
  query: string,
  lang: Locale,
  limit: number,
): Promise<AnimalSearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    is_active: 'true',
    taxon_id: String(TAXON_ANIMALIA),
    rank: 'species,subspecies,genus,family',
    locale: lang,
    order: 'desc',
    order_by: 'observations_count',
    per_page: String(limit),
  });
  const res = await fetch(`${INAT_TAXA}?${params}`);
  if (!res.ok) throw new Error(`iNaturalist taxa search failed: ${res.status}`);
  const data: INatTaxaResponse = await res.json();
  return (data.results ?? []).map(taxonToSearchResult);
}

function taxonToSearchResult(t: INatTaxon): AnimalSearchResult {
  return {
    sourceId: t.id,
    source: 'inaturalist' as const,
    title: t.preferred_common_name ?? t.name,
    scientificName: t.name,
    description: t.preferred_common_name ? t.name : undefined,
    thumbnailUrl: t.default_photo?.square_url ?? t.default_photo?.medium_url,
    wikipediaUrl: t.wikipedia_url,
    iconicTaxon: t.iconic_taxon_name,
  };
}

export async function searchAnimalTaxa(
  query: string,
  options: { lang?: Locale; limit?: number } = {},
): Promise<AnimalSearchResult[]> {
  const lang = options.lang ?? 'es';
  const limit = options.limit ?? 12;
  if (query.trim().length < 2) return [];

  const primary = await fetchTaxaOnce(query, lang, limit);

  if (lang === 'eu' && primary.length < 4) {
    try {
      const fallback = await fetchTaxaOnce(query, 'es', limit);
      const seen = new Set(primary.map((p) => p.sourceId));
      for (const item of fallback) {
        if (seen.has(item.sourceId)) continue;
        seen.add(item.sourceId);
        primary.push(item);
        if (primary.length >= limit) break;
      }
    } catch {
      /* ignoramos error del fallback */
    }
  }

  return primary;
}

/**
 * Devuelve los datos completos de un taxon por id. Usado en /cerca/:taxonId
 * cuando se entra por deep-link y no hay state previo.
 */
export async function fetchTaxonById(
  taxonId: number,
  lang: Locale = 'es',
): Promise<AnimalSearchResult | null> {
  const params = new URLSearchParams({ locale: lang });
  const res = await fetch(`${INAT_TAXA}/${taxonId}?${params}`);
  if (!res.ok) return null;
  const data: INatTaxaResponse = await res.json();
  const taxon = data.results?.[0];
  if (!taxon) return null;
  return taxonToSearchResult(taxon);
}

/* ---------- Especies cerca de ti ---------- */

export interface NearbySpecies {
  taxonId: number;
  scientificName: string;
  commonName?: string;
  thumbnailUrl?: string;
  count: number;
  wikipediaUrl?: string;
  iconicTaxon?: string;
}

interface INatSpeciesCount {
  count: number;
  taxon: INatTaxon;
}

interface INatNearbyResponse {
  results?: INatSpeciesCount[];
}

interface NearbyOptions {
  radiusKm?: number;
  limit?: number;
  lang?: string;
}

export async function fetchNearbySpecies(
  lat: number,
  lng: number,
  options: NearbyOptions = {},
): Promise<NearbySpecies[]> {
  const { radiusKm = 10, limit = 12, lang = 'es' } = options;
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radiusKm),
    taxon_id: String(TAXON_ANIMALIA),
    per_page: String(limit),
    locale: lang,
  });
  const res = await fetch(`${INAT_SPECIES_COUNTS}?${params}`);
  if (!res.ok) throw new Error(`iNaturalist failed: ${res.status}`);
  const data: INatNearbyResponse = await res.json();
  return (data.results ?? []).map((r) => ({
    taxonId: r.taxon.id,
    scientificName: r.taxon.name,
    commonName: r.taxon.preferred_common_name,
    thumbnailUrl: r.taxon.default_photo?.square_url ?? r.taxon.default_photo?.medium_url,
    count: r.count,
    wikipediaUrl: r.taxon.wikipedia_url,
    iconicTaxon: r.taxon.iconic_taxon_name,
  }));
}

/** Convierte una NearbySpecies a un AnimalSearchResult para alimentar al flow de nuevo avistamiento. */
export function nearbyToSearchResult(s: NearbySpecies): AnimalSearchResult {
  return {
    sourceId: s.taxonId,
    source: 'inaturalist',
    title: s.commonName ?? s.scientificName,
    scientificName: s.scientificName,
    thumbnailUrl: s.thumbnailUrl,
    wikipediaUrl: s.wikipediaUrl,
    iconicTaxon: s.iconicTaxon,
  };
}
