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

  if (loading || (user && !seeded)) {
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
