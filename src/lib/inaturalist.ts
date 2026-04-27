import type { Locale } from '@/i18n';
import type { AnimalSearchResult } from '@/types/models';

/**
 * Cliente de iNaturalist API.
 * - searchAnimalTaxa: búsqueda por nombre, ordenado por nº de observaciones.
 *   Filtra a Animalia. Si el idioma activo es eu, también consulta en es para
 *   no quedarse sin resultados (iNat tiene poca cobertura de nombres comunes
 *   en euskera).
 * - fetchNearbySpecies: especies observadas cerca de una ubicación.
 */

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
  return (data.results ?? []).map((t) => ({
    sourceId: t.id,
    source: 'inaturalist' as const,
    title: t.preferred_common_name ?? t.name,
    scientificName: t.name,
    description: t.preferred_common_name ? t.name : undefined,
    thumbnailUrl: t.default_photo?.square_url ?? t.default_photo?.medium_url,
    wikipediaUrl: t.wikipedia_url,
    iconicTaxon: t.iconic_taxon_name,
  }));
}

export async function searchAnimalTaxa(
  query: string,
  options: { lang?: Locale; limit?: number } = {},
): Promise<AnimalSearchResult[]> {
  const lang = options.lang ?? 'es';
  const limit = options.limit ?? 12;
  if (query.trim().length < 2) return [];

  const primary = await fetchTaxaOnce(query, lang, limit);

  // Fallback: si la consulta es en eu y devuelve pocos resultados, también
  // buscamos en es y mezclamos. Evita pantalla vacía al buscar animales que
  // iNat no tiene catalogados con nombre común en euskera.
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

/* ---------- Especies cerca de ti ---------- */

export interface NearbySpecies {
  taxonId: number;
  scientificName: string;
  commonName?: string;
  thumbnailUrl?: string;
  count: number;
  wikipediaUrl?: string;
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
  }));
}
