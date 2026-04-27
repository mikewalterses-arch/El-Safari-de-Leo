import { useEffect } from 'react';
import { useFirestoreStore, type SightingDoc } from '@/stores/firestoreStore';
import { useAuth } from '@/features/auth/useAuth';
import { useKids } from '@/features/kids/useKids';

export type { SightingDoc };

interface UseSightingsState {
  sightings: SightingDoc[];
  loading: boolean;
}

export function useSightings(): UseSightingsState {
  const { user } = useAuth();
  const { activeKidId } = useKids();
  const start = useFirestoreStore((s) => s.startSightings);
  const sightings = useFirestoreStore((s) => s.sightings);
  const loading = useFirestoreStore((s) => s.sightingsLoading);

  useEffect(() => {
    if (user && activeKidId) start(user.uid, activeKidId);
  }, [user, activeKidId, start]);

  return { sightings, loading };
}
