import { useEffect } from 'react';
import { useFirestoreStore, type AnimalDoc } from '@/stores/firestoreStore';

export type { AnimalDoc };

interface UseAnimalsState {
  animals: Map<string, AnimalDoc>;
  loading: boolean;
}

/** Wrapper fino del store global. La subscripción se inicia la primera vez que se llama. */
export function useAnimals(): UseAnimalsState {
  const start = useFirestoreStore((s) => s.startAnimals);
  const animals = useFirestoreStore((s) => s.animals);
  const loading = useFirestoreStore((s) => s.animalsLoading);
  useEffect(() => {
    start();
  }, [start]);
  return { animals, loading };
}
