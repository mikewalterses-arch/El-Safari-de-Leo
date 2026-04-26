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

const EMPTY_LOCATION: SightingLocation = { lat: 0, lng: 0, placeName: '' };

/**
 * Crea un avistamiento end-to-end:
 * 1. Comprime la foto y genera thumbnail.
 * 2. Crea el doc en `sightings/{auto}` con URLs vacíos (sirve para tener el sightingId).
 * 3. Sube original y thumbnail a Storage en `sightings/{uid}/{sightingId}/{photo,thumb}.jpg`.
 * 4. Actualiza el doc con las URLs descargables.
 *
 * TODO(fase-2-final): incrementar `users/{uid}.stats.totalSightings` y, si isFirstDiscovery,
 * `uniqueAnimals` (transacción Firestore).
 */
export async function createSighting(input: CreateSightingInput): Promise<string> {
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
  return docRef.id;
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
