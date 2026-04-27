import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { ensureUserDoc } from '@/features/user/ensureUserDoc';

interface AuthGateProps {
  children: ReactNode;
}

/**
 * Espera a que el usuario anónimo esté firmado y a que `users/{uid}` exista.
 * Mientras tanto muestra un spinner. No hay login visible — la firma es
 * automática (ver lib/firebase.ts).
 */
export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!user || seeded) return;
    ensureUserDoc(user.uid)
      .then(() => setSeeded(true))
      .catch((err) => {
        console.error('ensureUserDoc failed', err);
        setSeeded(true);
      });
  }, [user, seeded]);

  if (loading || !user || !seeded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <span
          aria-label="Cargando"
          className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return <>{children}</>;
}
