import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { KidProfile, User } from '@/types/models';

const DEFAULT_KID_NAME = 'Leo';
const DEFAULT_BIRTHDATE = new Date('2019-06-07');
const DEFAULT_AVATAR_COLOR = '#FF9B85';

function newKidId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Crea `users/{uid}` si no existe, y migra cuentas legacy single-kid al modelo
 * multi-hijo. Idempotente.
 *
 * Cuentas nuevas: se crean SIN kids — la app pide al usuario que cree el
 * primer peque manualmente. Antes creabamos un Leo por defecto, lo que
 * provocaba IDs huérfanos y datos de plantilla mezclados con datos reales.
 */
export async function ensureUserDoc(uid: string): Promise<void> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const seed: User = {
      kids: [],
      migratedToMultiKid: true,
      createdAt: Timestamp.now(),
    };
    await setDoc(ref, seed);
    return;
  }

  const user = snap.data() as User;
  if (user.migratedToMultiKid) return;

  // Migrar legacy single-kid → multi-hijo. Construimos un peque con los datos
  // del modelo viejo y reasignamos sightings/notes preexistentes.
  const legacyName = user.displayName?.trim() || DEFAULT_KID_NAME;
  const legacyBirthDate =
    user.birthDate instanceof Timestamp
      ? user.birthDate
      : Timestamp.fromDate(DEFAULT_BIRTHDATE);
  const legacyColor = user.avatarColor ?? DEFAULT_AVATAR_COLOR;
  const legacyIcon = user.avatarIcon;

  const firstKid: KidProfile = {
    id: newKidId(),
    displayName: legacyName,
    birthDate: legacyBirthDate,
    avatarColor: legacyColor,
    ...(legacyIcon && { avatarIcon: legacyIcon }),
    createdAt: user.createdAt ?? Timestamp.now(),
  };

  await migrateSightingsAndNotes(uid, firstKid.id);

  await updateDoc(ref, {
    kids: [firstKid],
    migratedToMultiKid: true,
  });
}

async function migrateSightingsAndNotes(
  uid: string,
  kidId: string,
): Promise<void> {
  const sightingsSnap = await getDocs(collection(db, 'users', uid, 'sightings'));
  const notesSnap = await getDocs(collection(db, 'users', uid, 'notes'));

  const refsToUpdate: { ref: ReturnType<typeof doc> }[] = [];
  for (const s of sightingsSnap.docs) {
    if (s.data().kidId) continue;
    refsToUpdate.push({ ref: s.ref });
  }
  for (const n of notesSnap.docs) {
    if (n.data().kidId) continue;
    refsToUpdate.push({ ref: n.ref });
  }

  // Firestore limita batch a 500 ops. Chunkeamos a 400 por seguridad.
  for (let i = 0; i < refsToUpdate.length; i += 400) {
    const batch = writeBatch(db);
    for (const r of refsToUpdate.slice(i, i + 400)) {
      batch.update(r.ref, { kidId });
    }
    await batch.commit();
  }
}
