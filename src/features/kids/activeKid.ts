import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveKidState {
  activeKidId: string | null;
  setActiveKidId: (id: string | null) => void;
}

/**
 * Almacena el id del peque activo (qué peque está usando la app ahora).
 * Persiste en localStorage para que abrir la PWA mantenga la elección.
 */
export const useActiveKidStore = create<ActiveKidState>()(
  persist(
    (set) => ({
      activeKidId: null,
      setActiveKidId: (id) => set({ activeKidId: id }),
    }),
    { name: 'safarideleo:activeKidId' },
  ),
);

/** Útil fuera de React. */
export function getActiveKidId(): string | null {
  return useActiveKidStore.getState().activeKidId;
}
