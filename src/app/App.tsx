import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { Onboarding } from '@/pages/Onboarding/Onboarding';
import { AuthGate } from '@/features/auth/AuthGate';
import { WhoAreYou } from '@/features/auth/WhoAreYou';
import { useUserTypeStore } from '@/features/auth/userType';

const ONBOARDING_KEY = 'safarideleo:onboardingCompleted';

export function App() {
  const userType = useUserTypeStore((s) => s.userType);
  const [completed, setCompleted] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true',
  );

  // Paso 0: ¿quién eres? — gate antes de cualquier otra cosa.
  if (!userType) {
    return <WhoAreYou />;
  }

  return (
    <AuthGate>
      {/* Onboarding solo se muestra a Leo (papá no necesita la felicitación). */}
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
