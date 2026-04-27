import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import type { Animal, JournalNote, Sighting } from '@/types/models';

/**
 * Store global con subscripciones onSnapshot **únicas** por colección.
 *
 * Multi-hijo: las subscripciones de sightings y notes están parametrizadas por
 * `(uid, kidId)`. Si cambia el activeKidId (otro peque seleccionado), se cierra
 * el listener anterior y se abre uno nuevo filtrado por el nuevo kidId.
 *
 * Animals queda a nivel raíz (cache compartido entre todos los usuarios).
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
  _sightingsKey: string | null; // `${uid}:${kidId}`
  _notesKey: string | null;
  _sightingsUnsub: (() => void) | null;
  _notesUnsub: (() => void) | null;
  startAnimals: () => void;
  startSightings: (uid: string, kidId: string) => void;
  startNotes: (uid: string, kidId: string) => void;
}

export const useFirestoreStore = create<FirestoreState>((set, get) => ({
  animals: new Map(),
  sightings: [],
  notes: [],
  animalsLoading: true,
  sightingsLoading: true,
  notesLoading: true,
  _animalsStarted: false,
  _sightingsKey: null,
  _notesKey: null,
  _sightingsUnsub: null,
  _notesUnsub: null,

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

  startSightings: (uid, kidId) => {
    const key = `${uid}:${kidId}`;
    if (get()._sightingsKey === key) return;
    // Cerrar listener anterior si lo hay
    get()._sightingsUnsub?.();
    set({ _sightingsKey: key, sightingsLoading: true, sightings: [] });

    const q = query(
      collection(db, 'users', uid, 'sightings'),
      where('kidId', '==', kidId),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(
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
    set({ _sightingsUnsub: unsub });
  },

  startNotes: (uid, kidId) => {
    const key = `${uid}:${kidId}`;
    if (get()._notesKey === key) return;
    get()._notesUnsub?.();
    set({ _notesKey: key, notesLoading: true, notes: [] });

    const q = query(
      collection(db, 'users', uid, 'notes'),
      where('kidId', '==', kidId),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(
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
    set({ _notesUnsub: unsub });
  },
}));
