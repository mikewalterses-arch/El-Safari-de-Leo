import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import type { Animal, Sighting } from '@/types/models';

/**
 * Store global con subscripciones onSnapshot **únicas** por colección. Se inician
 * la primera vez que un componente las consume y nunca se cancelan durante el ciclo
 * de vida de la app.
 *
 * Por qué no un `useEffect` en cada hook como teníamos antes: navegar entre Map
 * y Profile montaba y desmontaba listeners rápido, lo que combinado con React
 * Strict Mode (doble efecto en dev) confundía el WebChannel del SDK de Firestore
 * y disparaba "INTERNAL ASSERTION FAILED (b815)". Una subscripción permanente
 * elimina el churn.
 */

export interface AnimalDoc extends Animal {
  id: string;
}
export interface SightingDoc extends Sighting {
  id: string;
}

interface FirestoreState {
  animals: Map<string, AnimalDoc>;
  sightings: SightingDoc[];
  animalsLoading: boolean;
  sightingsLoading: boolean;
  _animalsStarted: boolean;
  _sightingsStarted: boolean;
  startAnimals: () => void;
  startSightings: () => void;
}

export const useFirestoreStore = create<FirestoreState>((set, get) => ({
  animals: new Map(),
  sightings: [],
  animalsLoading: true,
  sightingsLoading: true,
  _animalsStarted: false,
  _sightingsStarted: false,

  startAnimals: () => {
    if (get()._animalsStarted) return;
    set({ _animalsStarted: true });
    onSnapshot(
      collection(db, 'animals'),
      (snap) => {
        const map = new Map<string, AnimalDoc>();
        snap.docs.forEach((d) =>
          map.set(d.id, { id: d.id, ...(d.data() as Animal) }),
        );
        set({ animals: map, animalsLoading: false });
      },
      (err) => {
        console.error('animals snapshot failed', err);
        set({ animalsLoading: false });
      },
    );
  },

  startSightings: () => {
    if (get()._sightingsStarted) return;
    set({ _sightingsStarted: true });
    const q = query(collection(db, 'sightings'), orderBy('createdAt', 'desc'));
    onSnapshot(
      q,
      (snap) => {
        set({
          sightings: snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Sighting),
          })),
          sightingsLoading: false,
        });
      },
      (err) => {
        console.error('sightings snapshot failed', err);
        set({ sightingsLoading: false });
      },
    );
  },
}));
