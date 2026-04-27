import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import type { Animal, JournalNote, Sighting } from '@/types/models';

/**
 * Store global con subscripciones onSnapshot **únicas** por colección. Se inician
 * la primera vez que un componente las consume y nunca se cancelan durante el
 * ciclo de vida de la app. Evita el bug "INTERNAL ASSERTION FAILED (b815)" del
 * SDK de Firestore que se daba al re-suscribir rápido al cambiar de menú.
 */

export interface AnimalDoc extends Animal {
  id: string;
}
export interface SightingDoc extends Sighting {
  id: string;
}
export interface JournalNoteDoc extends JournalNote {
  id: string;
}

interface FirestoreState {
  animals: Map<string, AnimalDoc>;
  sightings: SightingDoc[];
  notes: JournalNoteDoc[];
  animalsLoading: boolean;
  sightingsLoading: boolean;
  notesLoading: boolean;
  _animalsStarted: boolean;
  _sightingsStarted: boolean;
  _notesStarted: boolean;
  startAnimals: () => void;
  startSightings: () => void;
  startNotes: () => void;
}

export const useFirestoreStore = create<FirestoreState>((set, get) => ({
  animals: new Map(),
  sightings: [],
  notes: [],
  animalsLoading: true,
  sightingsLoading: true,
  notesLoading: true,
  _animalsStarted: false,
  _sightingsStarted: false,
  _notesStarted: false,

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

  startNotes: () => {
    if (get()._notesStarted) return;
    set({ _notesStarted: true });
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    onSnapshot(
      q,
      (snap) => {
        set({
          notes: snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as JournalNote),
          })),
          notesLoading: false,
        });
      },
      (err) => {
        console.error('notes snapshot failed', err);
        set({ notesLoading: false });
      },
    );
  },
}));
