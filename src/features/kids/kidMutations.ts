import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { KidProfile, User } from '@/types/models';

const DEFAULT_AVATAR_COLOR = '#7DD3C7';

function newKidId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

interface NewKidInput {
  displayName: string;
  birthDate: Date;
  avatarColor?: string;
  avatarIcon?: string;
}

export async function addKid(uid: string, input: NewKidInput): Promise<KidProfile> {
  const ref = doc(db, 'users', uid);
  const kid: KidProfile = {
    id: newKidId(),
    displayName: input.displayName,
    birthDate: Timestamp.fromDate(input.birthDate),
    avatarColor: input.avatarColor ?? DEFAULT_AVATAR_COLOR,
    ...(input.avatarIcon && { avatarIcon: input.avatarIcon }),
    createdAt: Timestamp.now(),
  };
  await updateDoc(ref, { kids: arrayUnion(kid) });
  return kid;
}

interface UpdateKidInput {
  id: string;
  displayName?: string;
  birthDate?: Date;
  avatarColor?: string;
  avatarIcon?: string;
}

export async function updateKid(uid: string, input: UpdateKidInput): Promise<void> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const user = snap.data() as User;
  const kids = user.kids ?? [];
  const next = kids.map((k) => {
    if (k.id !== input.id) return k;
    const updated: KidProfile = { ...k };
    if (input.displayName !== undefined) updated.displayName = input.displayName;
    if (input.birthDate !== undefined) {
      updated.birthDate = Timestamp.fromDate(input.birthDate);
    }
    if (input.avatarColor !== undefined) updated.avatarColor = input.avatarColor;
    if (input.avatarIcon !== undefined) {
      if (input.avatarIcon === '') {
        delete updated.avatarIcon;
      } else {
        updated.avatarIcon = input.avatarIcon;
      }
    }
    return updated;
  });
  await updateDoc(ref, { kids: next });
}

export async function removeKid(uid: string, kidId: string): Promise<void> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const user = snap.data() as User;
  const kids = user.kids ?? [];
  const target = kids.find((k) => k.id === kidId);
  if (!target) return;
  // arrayRemove necesita el objeto exacto. Pasamos el objeto encontrado.
  await updateDoc(ref, { kids: arrayRemove(target) });
  // Nota: los avistamientos y notas asociados quedan huérfanos en la base de
  // datos. La UI los oculta porque filtra por activeKidId. Para limpieza
  // física habría que añadir un purge job (post-fase actual).
}
