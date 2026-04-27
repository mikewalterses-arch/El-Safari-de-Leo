import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

/**
 * Borra un avistamiento del usuario uid: la foto + el thumbnail de Storage
 * y el documento de Firestore. Los borrados de Storage son best-effort —
 * si fallan (archivo no existe), seguimos con el doc de Firestore.
 */
export async function deleteSighting(
  uid: string,
  sightingId: string,
): Promise<void> {
  const photoPath = `sightings/${uid}/${sightingId}/photo.jpg`;
  const thumbPath = `sightings/${uid}/${sightingId}/thumb.jpg`;

  await Promise.all([
    deleteObject(storageRef(storage, photoPath)).catch(() => {}),
    deleteObject(storageRef(storage, thumbPath)).catch(() => {}),
  ]);

  await deleteDoc(doc(db, 'users', uid, 'sightings', sightingId));
}
