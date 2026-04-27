import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import type { Animal, JournalNote, Sighting } from '@/types/models';

/**
 * Store global con subscripciones onSnapshot **únicas** por colección.
 *
 * Multi-usuario: las subscripciones de sightings y notes se inician con un uid
 * (datos privados por familia bajo users/{uid}/...). Animals es un cache
 * compartido a nivel global.
 *
 * Las subscripciones se inician la primera vez que un componente las consume y
 * nunca se cancelan durante la vida de la app — para evitar el bug de Firestore
 * "INTERNAL ASSERTION FAILED (b815)" al re-suscribir rápido al cambiar de menú.
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
  _sightingsStartedFor: string | null;
  _notesStartedFor: string | null;
  startAnimals: () => void;
  startSightings: (uid: string) => void;
  startNotes: (uid: string) => void;
}

export const useFirestoreStore = create<FirestoreState>((set, get) => ({
  animals: new Map(),
  sightings: [],
  notes: [],
  animalsLoading: true,
  sightingsLoading: true,
  notesLoading: true,
  _animalsStarted: false,
  _sightingsStartedFor: null,
  _notesStartedFor: null,

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

  startSightings: (uid: string) => {
    if (get()._sightingsStartedFor === uid) return;
    set({ _sightingsStartedFor: uid });
    const q = query(
      collection(db, 'users', uid, 'sightings'),
      orderBy('createdAt', 'desc'),
    );
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

  startNotes: (uid: string) => {
    if (get()._notesStartedFor === uid) return;
    set({ _notesStartedFor: uid });
    const q = query(
      collection(db, 'users', uid, 'notes'),
      orderBy('createdAt', 'desc'),
    );
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
