import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { Onboarding } from '@/pages/Onboarding/Onboarding';
import { AuthGate } from '@/features/auth/AuthGate';

const ONBOARDING_KEY = 'safarideleo:onboardingCompleted';

export function App() {
  const [completed, setCompleted] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true',
  );

  if (!completed) {
    return (
      <Onboarding
        onComplete={() => {
          localStorage.setItem(ONBOARDING_KEY, 'true');
          setCompleted(true);
        }}
      />
    );
  }

  return (
    <AuthGate>
      <RouterProvider router={router} />
    </AuthGate>
  );
}
