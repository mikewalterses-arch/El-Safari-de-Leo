import { lazy, Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { Onboarding } from '@/pages/Onboarding/Onboarding';
import { AuthGate } from '@/features/auth/AuthGate';
import { WhoAreYou } from '@/features/auth/WhoAreYou';
import { useUserTypeStore } from '@/features/auth/userType';
import { useAuth } from '@/features/auth/useAuth';

const ONBOARDING_KEY = 'safarideleo:onboardingCompleted';

const Discover = lazy(() =>
  import('@/pages/Discover/Discover').then((m) => ({ default: m.Discover })),
);

export function App() {
  const userType = useUserTypeStore((s) => s.userType);
  const [completed, setCompleted] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true',
  );

  // Para usuarios recién creados (otra familia que abre la app por primera
  // vez) saltamos el onboarding del cumpleaños — ese flujo es específico de
  // Leo. Detectamos "recién creado" comparando creationTime con lastSignInTime.
  useAutoSkipOnboardingForNewUsers(setCompleted);

  // Landing pública /conoce: no pasa por WhoAreYou ni AuthGate.
  if (window.location.pathname.startsWith('/conoce')) {
    return (
      <Suspense fallback={<LandingFallback />}>
        <Discover />
      </Suspense>
    );
  }

  if (!userType) {
    return <WhoAreYou />;
  }

  return (
    <AuthGate>
      {userType === 'leo' && !completed ? (
        <Onboarding
          onComplete={() => {
            localStorage.setItem(ONBOARDING_KEY, 'true');
            setCompleted(true);
          }}
        />
      ) : (
        <RouterProvider router={router} />
      )}
    </AuthGate>
  );
}

function LandingFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface">
      <span
        aria-label="Cargando"
        className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
      />
    </div>
  );
}

function useAutoSkipOnboardingForNewUsers(
  setCompleted: (v: boolean) => void,
) {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    const created = user.metadata.creationTime;
    const lastSignIn = user.metadata.lastSignInTime;
    if (!created || !lastSignIn) return;
    const diff = Math.abs(
      new Date(created).getTime() - new Date(lastSignIn).getTime(),
    );
    // Si la cuenta se creó en el último minuto, es un usuario nuevo: saltamos
    // el onboarding cumpleaños (es de Leo, no aplica a otras familias).
    if (diff < 60_000 && localStorage.getItem(ONBOARDING_KEY) !== 'true') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      setCompleted(true);
    }
  }, [user, setCompleted]);
}
