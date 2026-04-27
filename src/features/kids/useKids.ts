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
 * Lee la lista de peques del User y mantiene el peque activo coherente:
 * - Si el activeKidId guardado no existe en `kids`, salta al primero.
 * - Si no hay kids todavía, activeKidId = null.
 */
export function useKids(): UseKidsResult {
  const { profile, loading } = useUserProfile();
  const activeKidId = useActiveKidStore((s) => s.activeKidId);
  const setActiveKidId = useActiveKidStore((s) => s.setActiveKidId);

  const kids = profile?.kids ?? [];

  useEffect(() => {
    if (kids.length === 0) {
      if (activeKidId !== null) setActiveKidId(null);
      return;
    }
    const found = kids.find((k) => k.id === activeKidId);
    if (!found) {
      setActiveKidId(kids[0]!.id);
    }
  }, [kids, activeKidId, setActiveKidId]);

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
