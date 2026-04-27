import type { Locale } from '@/i18n';
import type { AnimalSearchResult } from '@/types/models';

/**
 * Cliente de iNaturalist API — dos usos:
 * 1. searchAnimalTaxa: búsqueda por nombre, ordenado por nº observaciones.
 *    Filtra a Animalia (taxon_id=1). Esto sustituye a la búsqueda Wikipedia
 *    para la identificación, porque Wikipedia mezcla animales con homónimos
 *    (ciudades, papas, libros) que confunden a un niño.
 * 2. fetchNearbySpecies: especies observadas cerca de una ubicación.
 *
 * Sin clave; rate-limit razonable para uso de un solo usuario.
 */

const INAT_TAXA = 'https://api.inaturalist.org/v1/taxa';
const INAT_SPECIES_COUNTS =
  'https://api.inaturalist.org/v1/observations/species_counts';

const TAXON_ANIMALIA = 1;

/* ---------- Búsqueda por nombre ---------- */

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

export async function searchAnimalTaxa(
  query: string,
  options: { lang?: Locale; limit?: number } = {},
): Promise<AnimalSearchResult[]> {
  const { lang = 'es', limit = 12 } = options;
  if (query.trim().length < 2) return [];

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
  /** Radio en km. Por defecto 10. */
  radiusKm?: number;
  /** Cantidad máxima de especies a devolver. Por defecto 12. */
  limit?: number;
  /** Idioma para nombre común. Por defecto "es". */
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
