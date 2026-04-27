import { doc, updateDoc } from 'firebase/firestore';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { processPhoto } from './compressImage';

/**
 * Reemplaza la foto + thumbnail de un avistamiento existente del usuario uid.
 */
export async function replaceSightingPhoto(
  sightingId: string,
  uid: string,
  newPhoto: File,
): Promise<void> {
  const { original, thumbnail } = await processPhoto(newPhoto);

  const photoPath = `sightings/${uid}/${sightingId}/photo.jpg`;
  const thumbPath = `sightings/${uid}/${sightingId}/thumb.jpg`;

  const [photoUrl, thumbnailUrl] = await Promise.all([
    uploadBytes(storageRef(storage, photoPath), original).then((s) =>
      getDownloadURL(s.ref),
    ),
    uploadBytes(storageRef(storage, thumbPath), thumbnail).then((s) =>
      getDownloadURL(s.ref),
    ),
  ]);

  await updateDoc(doc(db, 'users', uid, 'sightings', sightingId), {
    photoUrl,
    thumbnailUrl,
  });
}
