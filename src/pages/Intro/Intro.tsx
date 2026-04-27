import { useNavigate } from 'react-router-dom';
import { Onboarding } from '@/pages/Onboarding/Onboarding';

/**
 * Ruta /intro: cualquiera puede ver la intro de la app a demanda.
 * No marca el flag de onboardingCompleted — es solo demostración.
 */
export function Intro() {
  const navigate = useNavigate();
  const back = () => navigate(-1);
  return <Onboarding onComplete={back} onClose={back} />;
}
