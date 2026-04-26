/**
 * Cliente fino de Wikimedia Commons vía la REST de Wikipedia.
 * Devuelve la URL del primer archivo de audio asociado al artículo de un animal.
 * El audio típico es un rugido / canto / sonido representativo (.ogg).
 *
 * Si no hay audio disponible o falla la red, devuelve undefined.
 */

const REST_MEDIA_LIST = 'https://es.wikipedia.org/api/rest_v1/page/media-list';

interface MediaSrcEntry {
  src: string;
  scale?: string;
}

interface MediaListItem {
  type?: string;
  title?: string;
  srcset?: MediaSrcEntry[];
  original?: { source?: string };
}

interface MediaListResponse {
  items?: MediaListItem[];
}

export async function fetchAnimalSound(
  title: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${REST_MEDIA_LIST}/${encodeURIComponent(title)}`,
    );
    if (!res.ok) return undefined;
    const data: MediaListResponse = await res.json();
    const audio = data.items?.find((i) => i.type === 'audio');
    if (!audio) return undefined;

    const src = audio.original?.source ?? audio.srcset?.[0]?.src;
    if (!src) return undefined;
    return src.startsWith('//') ? `https:${src}` : src;
  } catch {
    return undefined;
  }
}
