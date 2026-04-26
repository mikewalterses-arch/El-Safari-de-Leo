/**
 * Cliente fino de Wikipedia (es) para identificar animales.
 * - opensearch / generator=search → sugerencias mientras Leo escribe.
 * - REST summary → datos completos al elegir un resultado.
 *
 * Sin API key, sin rate limit en uso normal de un solo usuario.
 */

const WIKI_LANG = 'es';
const ACTION_API = `https://${WIKI_LANG}.wikipedia.org/w/api.php`;
const REST_SUMMARY = `https://${WIKI_LANG}.wikipedia.org/api/rest_v1/page/summary`;

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
  query?: {
    pages?: Record<string, MediaWikiSearchPage>;
  };
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

export async function searchAnimals(
  query: string,
  limit = 8,
): Promise<WikiSearchResult[]> {
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

  const res = await fetch(`${ACTION_API}?${params}`);
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

export async function fetchAnimalSummary(title: string): Promise<WikiSummary> {
  const res = await fetch(`${REST_SUMMARY}/${encodeURIComponent(title)}`);
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
      `https://${WIKI_LANG}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    wikibaseItemQid: data.wikibase_item,
  };
}
