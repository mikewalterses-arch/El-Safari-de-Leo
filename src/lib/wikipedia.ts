import { getLocale } from '@/i18n';
import type { Locale } from '@/i18n';

/**
 * Cliente fino de Wikipedia para identificar animales. El idioma se toma del
 * locale actual (es por defecto, eu si Leo cambió en /perfil).
 *
 * Notas:
 * - Si el animal solo tiene artículo en una de las dos lenguas, hay que manejar
 *   el fallo en el caller. No hacemos fallback automático: cambiar el contenido
 *   bajo los pies confunde más que ayuda.
 * - opensearch / generator=search → sugerencias mientras Leo escribe.
 * - REST summary → datos completos al elegir un resultado.
 *
 * Sin API key, sin rate limit en uso normal de un solo usuario.
 */

export interface WikiSearchResult {
  pageId: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface WikiSummary {
  pageId: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  wikipediaUrl: string;
  /** Wikidata Q-id, usado para enriquecer con clase taxonómica. */
  wikibaseItemQid?: string;
}

interface MediaWikiSearchPage {
  pageid: number;
  title: string;
  index: number;
  thumbnail?: { source: string };
  terms?: { description?: string[] };
}

interface MediaWikiSearchResponse {
  query?: { pages?: Record<string, MediaWikiSearchPage> };
}

interface RestSummaryResponse {
  pageid: number;
  title: string;
  extract?: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  content_urls?: { desktop?: { page?: string } };
  wikibase_item?: string;
}

function actionApi(lang: Locale) {
  return `https://${lang}.wikipedia.org/w/api.php`;
}

function restSummary(lang: Locale) {
  return `https://${lang}.wikipedia.org/api/rest_v1/page/summary`;
}

export async function searchAnimals(
  query: string,
  options: { lang?: Locale; limit?: number } = {},
): Promise<WikiSearchResult[]> {
  const lang = options.lang ?? getLocale();
  const limit = options.limit ?? 8;
  if (query.trim().length < 2) return [];

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: String(limit),
    prop: 'pageimages|pageterms',
    piprop: 'thumbnail',
    pithumbsize: '120',
    wbptterms: 'description',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`${actionApi(lang)}?${params}`);
  if (!res.ok) throw new Error(`Wikipedia search failed: ${res.status}`);
  const data: MediaWikiSearchResponse = await res.json();

  const pages = data.query?.pages ? Object.values(data.query.pages) : [];
  return pages
    .sort((a, b) => a.index - b.index)
    .map((p) => ({
      pageId: p.pageid,
      title: p.title,
      description: p.terms?.description?.[0],
      thumbnailUrl: p.thumbnail?.source,
    }));
}

export async function fetchAnimalSummary(
  title: string,
  lang: Locale = getLocale(),
): Promise<WikiSummary> {
  const res = await fetch(`${restSummary(lang)}/${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error(`Wikipedia summary failed: ${res.status}`);
  const data: RestSummaryResponse = await res.json();

  return {
    pageId: data.pageid,
    title: data.title,
    description: data.extract ?? '',
    thumbnailUrl: data.thumbnail?.source,
    imageUrl: data.originalimage?.source,
    wikipediaUrl:
      data.content_urls?.desktop?.page ??
      `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    wikibaseItemQid: data.wikibase_item,
  };
}
