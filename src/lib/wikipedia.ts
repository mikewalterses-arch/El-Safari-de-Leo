import { getLocale } from '@/i18n';
import type { Locale } from '@/i18n';

/**
 * Cliente fino de Wikipedia para enriquecer datos de animales identificados.
 * La búsqueda de animales ya NO usa Wikipedia (usa iNaturalist en
 * `lib/inaturalist.ts:searchAnimalTaxa` para evitar resultados como
 * "León (ciudad)" cuando Leo busca un animal).
 *
 * Wikipedia se usa solo para obtener la descripción rica + imagen al
 * cachear un animal cuya `wikipediaUrl` viene de iNaturalist.
 */

const REST_SUMMARY_HOST = (lang: Locale) =>
  `https://${lang}.wikipedia.org/api/rest_v1/page/summary`;

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

interface RestSummaryResponse {
  pageid: number;
  title: string;
  extract?: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  content_urls?: { desktop?: { page?: string } };
  wikibase_item?: string;
}

export async function fetchAnimalSummary(
  title: string,
  lang: Locale = getLocale(),
): Promise<WikiSummary> {
  const res = await fetch(
    `${REST_SUMMARY_HOST(lang)}/${encodeURIComponent(title)}`,
  );
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

/** Extrae el título del artículo desde una URL de Wikipedia. */
export function extractWikipediaTitle(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');
    const last = parts[parts.length - 1];
    return last ? decodeURIComponent(last) : null;
  } catch {
    return null;
  }
}
