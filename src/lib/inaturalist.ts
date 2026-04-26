/**
 * Cliente de iNaturalist API — consulta especies observadas en una zona.
 * Sin clave; rate-limit razonable para uso de un solo usuario.
 */

const INAT_SPECIES_COUNTS =
  'https://api.inaturalist.org/v1/observations/species_counts';

const TAXON_ANIMALIA = 1;

export interface NearbySpecies {
  taxonId: number;
  scientificName: string;
  commonName?: string;
  thumbnailUrl?: string;
  count: number;
  wikipediaUrl?: string;
}

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
}

interface INatSpeciesCount {
  count: number;
  taxon: INatTaxon;
}

interface INatResponse {
  results?: INatSpeciesCount[];
}

interface FetchNearbyOptions {
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
  options: FetchNearbyOptions = {},
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
  const data: INatResponse = await res.json();

  return (data.results ?? []).map((r) => ({
    taxonId: r.taxon.id,
    scientificName: r.taxon.name,
    commonName: r.taxon.preferred_common_name,
    thumbnailUrl: r.taxon.default_photo?.square_url ?? r.taxon.default_photo?.medium_url,
    count: r.count,
    wikipediaUrl: r.taxon.wikipedia_url,
  }));
}
