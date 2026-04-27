import { useEffect } from 'react';
import { useFirestoreStore, type JournalNoteDoc } from '@/stores/firestoreStore';

export type { JournalNoteDoc };

export function useNotes() {
  const start = useFirestoreStore((s) => s.startNotes);
  const notes = useFirestoreStore((s) => s.notes);
  const loading = useFirestoreStore((s) => s.notesLoading);
  useEffect(() => {
    start();
  }, [start]);
  return { notes, loading };
}
