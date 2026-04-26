import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Sighting } from '@/types/models';

export interface SightingDoc extends Sighting {
  id: string;
}

interface UseSightingsState {
  sightings: SightingDoc[];
  loading: boolean;
}

/**
 * Subscripción en vivo a `sightings/*` ordenados por fecha desc.
 * Usa onSnapshot, así que cambios remotos (otros dispositivos) se reflejan
 * automáticamente. Para fase 2-3 con un solo usuario es overkill, pero
 * cuesta lo mismo que getDocs y cubre fase 4+ sin cambios.
 */
export function useSightings(): UseSightingsState {
  const [state, setState] = useState<UseSightingsState>({
    sightings: [],
    loading: true,
  });

  useEffect(() => {
    const q = query(collection(db, 'sightings'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        setState({
          sightings: snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Sighting),
          })),
          loading: false,
        });
      },
      (err) => {
        console.error('useSightings failed', err);
        setState((s) => ({ ...s, loading: false }));
      },
    );
  }, []);

  return state;
}
