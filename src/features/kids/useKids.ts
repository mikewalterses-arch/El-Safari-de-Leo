import { useEffect } from 'react';
import { useUserProfile } from '@/features/user/useUserProfile';
import { useActiveKidStore } from './activeKid';
import type { KidProfile } from '@/types/models';

interface UseKidsResult {
  kids: KidProfile[];
  activeKid: KidProfile | null;
  activeKidId: string | null;
  setActiveKidId: (id: string) => void;
  loading: boolean;
}

/**
 * Lee la lista de peques del User y mantiene el peque activo coherente.
 *
 * IMPORTANTE: el effect de inicialización usa `kids.length` (number) como
 * dependencia, no `kids` (array reference). Antes usábamos la referencia, lo
 * que combinado con la migración legacy → multi-kid (que dispara varios
 * snapshots en quick succession) causaba un bucle de setState — error #185
 * de React. Si activeKidId apunta a un kid que ya no existe, no auto-corregimos
 * desde el effect; el render-time fallback (kids[0] al final) es suficiente y
 * evita el bucle entre componentes con snapshots desincronizados.
 */
export function useKids(): UseKidsResult {
  const { profile, loading } = useUserProfile();
  const activeKidId = useActiveKidStore((s) => s.activeKidId);
  const setActiveKidId = useActiveKidStore((s) => s.setActiveKidId);

  const kids = profile?.kids ?? [];

  useEffect(() => {
    // Solo inicializar: si no hay activeKidId y hay peques, elige el primero.
    if (kids.length > 0 && !activeKidId) {
      setActiveKidId(kids[0]!.id);
    }
    // Si no hay peques (cuenta nueva o sin migrar), no hacemos nada.
  }, [kids.length, activeKidId, setActiveKidId]);

  // Fallback en render: si el activeKidId está desfasado (kid borrado), uses
  // el primero. Si no hay peques, null. Esto cubre los casos sin necesidad de
  // tocar el store y romper el bucle.
  const activeKid =
    kids.find((k) => k.id === activeKidId) ?? kids[0] ?? null;

  return {
    kids,
    activeKid,
    activeKidId: activeKid?.id ?? null,
    setActiveKidId,
    loading,
  };
}
