import { addDoc, collection, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function createNote(
  uid: string,
  kidId: string,
  text: string,
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('La nota no puede estar vacía');
  const ref = await addDoc(collection(db, 'users', uid, 'notes'), {
    kidId,
    text: trimmed,
    createdAt: Timestamp.now(),
  });
  console.log('[createNote] doc created', { docId: ref.id, uid, kidId });
  return ref.id;
}

export async function deleteNote(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'notes', id));
}
