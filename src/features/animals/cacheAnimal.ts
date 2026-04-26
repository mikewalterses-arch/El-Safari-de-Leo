import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchAnimalSummary, type WikiSearchResult } from '@/lib/wikipedia';
import { fetchTaxonomicClass } from '@/lib/wikidata';
import { fetchAnimalSound } from '@/lib/wikimedia';
import { getLocale } from '@/i18n';
import type { Animal } from '@/types/models';

/**
 * Asegura que el animal exista en `animals/{lang}_{wikipediaPageId}` (cache).
 * El doc id incluye el locale para que un animal cacheado en castellano y otro
 * en euskera no choquen — son entradas distintas (mismo animal, distinta lengua
 * y posiblemente distinto pageId también).
 *
 * Si ya está cacheado, devuelve el id sin tocar la red.
 * Si no, hace fetch del summary, enriquece con clase taxonómica (Wikidata) y
 * sonido (Wikimedia) en paralelo, y crea el doc.
 *
 * Los enriquecimientos son no bloqueantes: si fallan, el animal se cachea con
 * los campos opcionales ausentes.
 */
export async function ensureAnimal(result: WikiSearchResult): Promise<string> {
  const lang = getLocale();
  const animalId = `${lang}_${result.pageId}`;
  const ref = doc(db, 'animals', animalId);
  const existing = await getDoc(ref);
  if (existing.exists()) return animalId;

  const summary = await fetchAnimalSummary(result.title, lang);

  const [taxClass, soundUrl] = await Promise.all([
    summary.wikibaseItemQid
      ? fetchTaxonomicClass(summary.wikibaseItemQid, lang).catch(() => null)
      : Promise.resolve(null),
    fetchAnimalSound(summary.title, lang).catch(() => undefined),
  ]);

  const animal: Animal = {
    commonName: summary.title,
    wikipediaUrl: summary.wikipediaUrl,
    wikipediaPageId: summary.pageId,
    description: summary.description,
    source: 'wikipedia',
    createdAt: Timestamp.now(),
    ...(summary.thumbnailUrl && { thumbnailUrl: summary.thumbnailUrl }),
    ...(summary.imageUrl && { imageUrl: summary.imageUrl }),
    ...(taxClass && { taxonomicClass: taxClass }),
    ...(soundUrl && { soundUrl }),
  };
  await setDoc(ref, animal);
  return animalId;
}
