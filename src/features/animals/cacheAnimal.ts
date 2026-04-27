import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  extractWikipediaTitle,
  fetchAnimalSummary,
  type WikiSummary,
} from '@/lib/wikipedia';
import { fetchTaxonomicClass } from '@/lib/wikidata';
import { fetchAnimalSound } from '@/lib/wikimedia';
import { getLocale, type Locale } from '@/i18n';
import type { Animal, AnimalSearchResult, TaxonomicClass } from '@/types/models';

const ENRICH_TIMEOUT_MS = 4000;

/**
 * Cachea un animal en `animals/{id}` y devuelve el id usado.
 * El id depende de la fuente:
 * - `inat_{taxonId}` si viene de iNaturalist (caso normal en fase 4+).
 * - `{lang}_{wikipediaPageId}` si viene de Wikipedia (entradas legacy).
 *
 * Idempotente: si ya está cacheado, no toca la red.
 *
 * Si hay wikipediaUrl, se usa Wikipedia para enriquecer con descripción
 * rica + imagen + sonido + clase taxonómica (Wikidata). Estos pasos están
 * limitados con timeout de 4 s para no bloquear al usuario si el SPARQL
 * está lento.
 */
export async function ensureAnimal(result: AnimalSearchResult): Promise<string> {
  const lang = getLocale();
  const animalId =
    result.source === 'inaturalist'
      ? `inat_${result.sourceId}`
      : `${lang}_${result.sourceId}`;

  const ref = doc(db, 'animals', animalId);
  const existing = await getDoc(ref);
  if (existing.exists()) return animalId;

  // Si tenemos una URL de Wikipedia, intentamos descripción rica.
  let summary: WikiSummary | null = null;
  if (result.wikipediaUrl) {
    const title = extractWikipediaTitle(result.wikipediaUrl);
    if (title) {
      summary = await fetchAnimalSummary(title, lang).catch(() => null);
    }
  }

  // Enriquecimiento opcional con timeout.
  const [taxClassFromWikidata, soundUrl] = await Promise.all([
    summary?.wikibaseItemQid
      ? withTimeout(
          fetchTaxonomicClass(summary.wikibaseItemQid, lang).catch(() => null),
          ENRICH_TIMEOUT_MS,
          null,
        )
      : Promise.resolve(null),
    summary
      ? withTimeout(
          fetchAnimalSound(summary.title, lang).catch(() => undefined),
          ENRICH_TIMEOUT_MS,
          undefined,
        )
      : Promise.resolve(undefined),
  ]);

  // Fallback de clase taxonómica: el iconicTaxon de iNat ya nos dice si es
  // mamífero, ave, etc, sin necesidad de SPARQL.
  const taxClass: TaxonomicClass | undefined =
    taxClassFromWikidata ??
    (result.iconicTaxon
      ? {
          qid: '',
          name: localizeIconicTaxon(result.iconicTaxon, lang),
        }
      : undefined);

  const finalThumb = summary?.thumbnailUrl ?? result.thumbnailUrl;
  const finalDescription =
    summary?.description ||
    [result.title, result.scientificName].filter(Boolean).join(' — ') ||
    result.title;

  const animal: Animal = {
    commonName: summary?.title ?? result.title,
    description: finalDescription,
    wikipediaUrl: summary?.wikipediaUrl ?? result.wikipediaUrl ?? '',
    wikipediaPageId: summary?.pageId ?? 0,
    source: result.source,
    createdAt: Timestamp.now(),
    ...(result.scientificName && { scientificName: result.scientificName }),
    ...(finalThumb && { thumbnailUrl: finalThumb }),
    ...(summary?.imageUrl && { imageUrl: summary.imageUrl }),
    ...(taxClass && { taxonomicClass: taxClass }),
    ...(soundUrl && { soundUrl }),
  };
  await setDoc(ref, animal);
  return animalId;
}

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

const ICONIC_LABELS: Record<string, Record<Locale, string>> = {
  Mammalia: { es: 'Mamíferos', eu: 'Ugaztunak' },
  Aves: { es: 'Aves', eu: 'Hegaztiak' },
  Reptilia: { es: 'Reptiles', eu: 'Narrastiak' },
  Amphibia: { es: 'Anfibios', eu: 'Anfibioak' },
  Actinopterygii: { es: 'Peces', eu: 'Arrainak' },
  Insecta: { es: 'Insectos', eu: 'Intsektuak' },
  Arachnida: { es: 'Arácnidos', eu: 'Armiarmak' },
  Mollusca: { es: 'Moluscos', eu: 'Moluskuak' },
  Animalia: { es: 'Animales', eu: 'Animaliak' },
};

function localizeIconicTaxon(name: string, lang: Locale): string {
  return ICONIC_LABELS[name]?.[lang] ?? name;
}
