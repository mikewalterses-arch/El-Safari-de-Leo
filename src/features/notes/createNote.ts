import { addDoc, collection, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function createNote(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('La nota no puede estar vacía');
  const ref = await addDoc(collection(db, 'notes'), {
    text: trimmed,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function deleteNote(id: string): Promise<void> {
  await deleteDoc(doc(db, 'notes', id));
}
