import { useEffect } from 'react';
import { useFirestoreStore, type SightingDoc } from '@/stores/firestoreStore';

export type { SightingDoc };

interface UseSightingsState {
  sightings: SightingDoc[];
  loading: boolean;
}

/** Wrapper fino del store global. La subscripción se inicia la primera vez que se llama. */
export function useSightings(): UseSightingsState {
  const start = useFirestoreStore((s) => s.startSightings);
  const sightings = useFirestoreStore((s) => s.sightings);
  const loading = useFirestoreStore((s) => s.sightingsLoading);
  useEffect(() => {
    start();
  }, [start]);
  return { sightings, loading };
}
