import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveKidState {
  activeKidId: string | null;
  setActiveKidId: (id: string | null) => void;
  clear: () => void;
}

/**
 * Almacena el id del peque activo (qué peque está usando la app ahora).
 * Persiste en localStorage para que abrir la PWA mantenga la elección.
 *
 * `clear()`: limpia el id. Se llama al cambiar de cuenta (uid) y al cerrar
 * sesión, para evitar arrastrar IDs de peques de cuentas anteriores.
 */
export const useActiveKidStore = create<ActiveKidState>()(
  persist(
    (set) => ({
      activeKidId: null,
      setActiveKidId: (id) => set({ activeKidId: id }),
      clear: () => set({ activeKidId: null }),
    }),
    { name: 'safarideleo:activeKidId' },
  ),
);

/** Útil fuera de React. */
export function getActiveKidId(): string | null {
  return useActiveKidStore.getState().activeKidId;
}
