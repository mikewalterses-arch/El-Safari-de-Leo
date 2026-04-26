import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { processPhoto } from './compressImage';
import type { SightingLocation } from '@/types/models';

interface CreateSightingInput {
  uid: string;
  animalId: string;
  photo: File;
  location: SightingLocation | null;
  notes: string;
}

export interface CreateSightingResult {
  id: string;
  isFirstDiscovery: boolean;
}

const EMPTY_LOCATION: SightingLocation = { lat: 0, lng: 0, placeName: '' };

/**
 * Crea un avistamiento end-to-end. Devuelve el id y si es primer avistamiento de
 * ese animalId, para que el caller pueda lanzar la animación de descubrimiento.
 *
 * 1. Comprueba si es primer avistamiento del animal.
 * 2. Comprime la foto y genera thumbnail en paralelo.
 * 3. Crea el doc en `sightings/{auto}` con URLs vacíos.
 * 4. Sube original y thumbnail a Storage en `sightings/{uid}/{sightingId}/`.
 * 5. Actualiza el doc con las URLs descargables.
 *
 * TODO(post-fase-5): incrementar `users/{uid}.stats.totalSightings` y, si
 * isFirstDiscovery, `uniqueAnimals` (transacción Firestore).
 */
export async function createSighting(
  input: CreateSightingInput,
): Promise<CreateSightingResult> {
  const isFirstDiscovery = await checkFirstDiscovery(input.animalId);
  const { original, thumbnail } = await processPhoto(input.photo);

  const docRef = await addDoc(collection(db, 'sightings'), {
    animalId: input.animalId,
    photoUrl: '',
    thumbnailUrl: '',
    location: input.location ?? EMPTY_LOCATION,
    notes: input.notes,
    identificationMethod: 'manual',
    createdAt: Timestamp.now(),
    isFirstDiscovery,
  });

  const photoPath = `sightings/${input.uid}/${docRef.id}/photo.jpg`;
  const thumbPath = `sightings/${input.uid}/${docRef.id}/thumb.jpg`;

  const [photoUrl, thumbnailUrl] = await Promise.all([
    uploadBytes(storageRef(storage, photoPath), original).then((s) =>
      getDownloadURL(s.ref),
    ),
    uploadBytes(storageRef(storage, thumbPath), thumbnail).then((s) =>
      getDownloadURL(s.ref),
    ),
  ]);

  await updateDoc(docRef, { photoUrl, thumbnailUrl });
  return { id: docRef.id, isFirstDiscovery };
}

async function checkFirstDiscovery(animalId: string): Promise<boolean> {
  const q = query(
    collection(db, 'sightings'),
    where('animalId', '==', animalId),
    limit(1),
  );
  const snap = await getDocs(q);
  return snap.empty;
}
