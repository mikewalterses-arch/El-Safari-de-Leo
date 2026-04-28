import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { LoginScreen } from './LoginScreen';
import { NeedsPapa } from './NeedsPapa';
import { useUserTypeStore } from './userType';
import { ensureUserDoc } from '@/features/user/ensureUserDoc';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();
  const userType = useUserTypeStore((s) => s.userType);
  // Tracking por uid: si la sesión cambia de cuenta (logout + login), hay que
  // re-seedar para la nueva cuenta. `useState(false)` no era suficiente porque
  // dejaba el flag activo entre cambios de uid.
  const [seededUid, setSeededUid] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (seededUid === user.uid) return;
    ensureUserDoc(user.uid)
      .then(() => setSeededUid(user.uid))
      .catch((err) => {
        console.error('ensureUserDoc failed', err);
        setSeededUid(user.uid);
      });
  }, [user, seededUid]);

  if (loading || (user && seededUid !== user.uid)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <span
          aria-label="Cargando"
          className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!user) {
    if (userType === 'leo') return <NeedsPapa />;
    return <LoginScreen />;
  }

  return <>{children}</>;
}
