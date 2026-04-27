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
import type { SightingAttributes, SightingLocation } from '@/types/models';

interface CreateSightingInput {
  uid: string;
  animalId: string;
  photo: File;
  location: SightingLocation | null;
  notes: string;
  attributes?: SightingAttributes;
}

export interface CreateSightingResult {
  id: string;
  isFirstDiscovery: boolean;
}

const EMPTY_LOCATION: SightingLocation = { lat: 0, lng: 0, placeName: '' };

export async function createSighting(
  input: CreateSightingInput,
): Promise<CreateSightingResult> {
  const isFirstDiscovery = await checkFirstDiscovery(input.animalId);
  const { original, thumbnail } = await processPhoto(input.photo);

  const docData: Record<string, unknown> = {
    animalId: input.animalId,
    photoUrl: '',
    thumbnailUrl: '',
    location: input.location ?? EMPTY_LOCATION,
    notes: input.notes,
    identificationMethod: 'manual',
    createdAt: Timestamp.now(),
    isFirstDiscovery,
  };
  if (input.attributes && hasAttributes(input.attributes)) {
    docData.attributes = input.attributes;
  }

  const docRef = await addDoc(collection(db, 'sightings'), docData);

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

function hasAttributes(a: SightingAttributes): boolean {
  return Boolean(a.size || a.color || a.activity);
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
