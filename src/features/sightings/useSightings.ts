import { useEffect } from 'react';
import { useFirestoreStore, type SightingDoc } from '@/stores/firestoreStore';
import { useAuth } from '@/features/auth/useAuth';

export type { SightingDoc };

interface UseSightingsState {
  sightings: SightingDoc[];
  loading: boolean;
}

/** Wrapper del store global: subscribe a sightings del usuario actual. */
export function useSightings(): UseSightingsState {
  const { user } = useAuth();
  const start = useFirestoreStore((s) => s.startSightings);
  const sightings = useFirestoreStore((s) => s.sightings);
  const loading = useFirestoreStore((s) => s.sightingsLoading);

  useEffect(() => {
    if (user) start(user.uid);
  }, [user, start]);

  return { sightings, loading };
}
