import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Animal } from '@/types/models';

export interface AnimalDoc extends Animal {
  id: string;
}

interface UseAnimalsState {
  animals: Map<string, AnimalDoc>;
  loading: boolean;
}

/**
 * Subscripción en vivo a `animals/*`. Se entrega como Map por id para que
 * los consumidores puedan hacer animals.get(sighting.animalId) en O(1).
 */
export function useAnimals(): UseAnimalsState {
  const [state, setState] = useState<UseAnimalsState>({
    animals: new Map(),
    loading: true,
  });

  useEffect(() => {
    return onSnapshot(
      collection(db, 'animals'),
      (snap) => {
        const map = new Map<string, AnimalDoc>();
        snap.docs.forEach((d) =>
          map.set(d.id, { id: d.id, ...(d.data() as Animal) }),
        );
        setState({ animals: map, loading: false });
      },
      (err) => {
        console.error('useAnimals failed', err);
        setState((s) => ({ ...s, loading: false }));
      },
    );
  }, []);

  return state;
}
