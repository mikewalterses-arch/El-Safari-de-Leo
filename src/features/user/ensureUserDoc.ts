import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/types/models';

const LEO_DISPLAY_NAME = 'Leo';
const LEO_BIRTHDATE = new Date('2019-06-07');
const LEO_AVATAR_COLOR = '#FF9B85';

/**
 * Crea `users/{uid}` con los datos iniciales de Leo si todavía no existe.
 * Idempotente: si ya está, no hace nada.
 */
export async function ensureUserDoc(uid: string): Promise<void> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  const seed: User = {
    displayName: LEO_DISPLAY_NAME,
    birthDate: Timestamp.fromDate(LEO_BIRTHDATE),
    avatarColor: LEO_AVATAR_COLOR,
    createdAt: Timestamp.now(),
    stats: {
      totalSightings: 0,
      uniqueAnimals: 0,
      categoriesUnlocked: [],
      achievements: [],
    },
  };
  await setDoc(ref, seed);
}
