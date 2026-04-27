import { useEffect } from 'react';
import { useFirestoreStore, type JournalNoteDoc } from '@/stores/firestoreStore';
import { useAuth } from '@/features/auth/useAuth';
import { useKids } from '@/features/kids/useKids';

export type { JournalNoteDoc };

export function useNotes() {
  const { user } = useAuth();
  const { activeKidId } = useKids();
  const start = useFirestoreStore((s) => s.startNotes);
  const notes = useFirestoreStore((s) => s.notes);
  const loading = useFirestoreStore((s) => s.notesLoading);

  useEffect(() => {
    if (user && activeKidId) start(user.uid, activeKidId);
  }, [user, activeKidId, start]);

  return { notes, loading };
}
