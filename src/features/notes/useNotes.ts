import { useEffect } from 'react';
import { useFirestoreStore, type JournalNoteDoc } from '@/stores/firestoreStore';
import { useAuth } from '@/features/auth/useAuth';

export type { JournalNoteDoc };

export function useNotes() {
  const { user } = useAuth();
  const start = useFirestoreStore((s) => s.startNotes);
  const notes = useFirestoreStore((s) => s.notes);
  const loading = useFirestoreStore((s) => s.notesLoading);

  useEffect(() => {
    if (user) start(user.uid);
  }, [user, start]);

  return { notes, loading };
}
