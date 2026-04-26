import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchAnimalSummary, type WikiSearchResult } from '@/lib/wikipedia';
import type { Animal } from '@/types/models';

/**
 * Asegura que el animal exista en `animals/{wikipediaPageId}` (cache).
 * Si ya está cacheado, devuelve el id sin tocar la red.
 * Si no, hace fetch del summary y crea el doc.
 */
export async function ensureAnimal(result: WikiSearchResult): Promise<string> {
  const animalId = String(result.pageId);
  const ref = doc(db, 'animals', animalId);
  const existing = await getDoc(ref);
  if (existing.exists()) return animalId;

  const summary = await fetchAnimalSummary(result.title);
  const animal: Animal = {
    commonName: summary.title,
    wikipediaUrl: summary.wikipediaUrl,
    wikipediaPageId: summary.pageId,
    description: summary.description,
    thumbnailUrl: summary.thumbnailUrl,
    imageUrl: summary.imageUrl,
    source: 'wikipedia',
    createdAt: Timestamp.now(),
  };
  await setDoc(ref, animal);
  return animalId;
}
