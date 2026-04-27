import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PhotoCaptureStep } from './PhotoCaptureStep';
import { IdentifyStep } from './IdentifyStep';
import { ConfirmStep } from './ConfirmStep';
import { createSighting } from './createSighting';
import { DiscoveryCelebration } from './DiscoveryCelebration';
import { ensureAnimal } from '@/features/animals/cacheAnimal';
import { useAuth } from '@/features/auth/useAuth';
import { getCurrentLocation } from '@/lib/geolocation';
import { useT } from '@/i18n';
import type { AnimalSearchResult, SightingLocation } from '@/types/models';

type Step = 'photo' | 'identify' | 'caching' | 'confirm' | 'saving' | 'done';

export function NewSightingFlow() {
  const t = useT();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('photo');
  const [photo, setPhoto] = useState<File | null>(null);
  const [animal, setAnimal] = useState<AnimalSearchResult | null>(null);
  const [animalId, setAnimalId] = useState<string | null>(null);
  const [location, setLocation] = useState<SightingLocation | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFirstDiscovery, setIsFirstDiscovery] = useState(false);

  // GPS en background mientras Leo identifica.
  useEffect(() => {
    if (!photo || location) return;
    getCurrentLocation()
      .then(setLocation)
      .catch(() => {
        /* sin GPS: guardamos sin location */
      });
  }, [photo, location]);

  const onPhotoSelected = (file: File) => {
    setPhoto(file);
    setStep('identify');
  };

  const onAnimalSelected = async (result: AnimalSearchResult) => {
    setAnimal(result);
    setError(null);
    setStep('caching');
    try {
      const id = await ensureAnimal(result);
      setAnimalId(id);
      setStep('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el animal');
      setStep('identify');
    }
  };

  const onSave = async () => {
    if (!user || !photo || !animalId) return;
    setStep('saving');
    setError(null);
    try {
      const result = await createSighting({
        uid: user.uid,
        animalId,
        photo,
        location,
        notes,
      });
      navigator.vibrate?.([60, 30, 60]);
      setIsFirstDiscovery(result.isFirstDiscovery);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
      setStep('confirm');
    }
  };

  useEffect(() => {
    if (step !== 'done') return;
    const delay = isFirstDiscovery ? 2500 : 1200;
    const handle = setTimeout(() => navigate('/diario'), delay);
    return () => clearTimeout(handle);
  }, [step, navigate, isFirstDiscovery]);

  if (step === 'photo') {
    return <PhotoCaptureStep onPhotoSelected={onPhotoSelected} />;
  }
  if (step === 'identify') {
    return <IdentifyStep onAnimalSelected={onAnimalSelected} />;
  }
  if (step === 'caching') {
    return <FlowStateMessage label={t('newSighting.caching')} spinning />;
  }
  if (step === 'saving') {
    return <FlowStateMessage label={t('newSighting.saving')} spinning />;
  }
  if (step === 'done') {
    return isFirstDiscovery && animal ? (
      <DiscoveryCelebration animalName={animal.title} />
    ) : (
      <FlowStateMessage label={t('newSighting.saved')} success />
    );
  }

  if (animal && photo) {
    return (
      <ConfirmStep
        photo={photo}
        animal={animal}
        location={location}
        notes={notes}
        onNotesChange={setNotes}
        onSave={onSave}
        onBack={() => setStep('identify')}
        error={error}
      />
    );
  }
  return null;
}

interface FlowStateMessageProps {
  label: string;
  spinning?: boolean;
  success?: boolean;
}

function FlowStateMessage({ label, spinning, success }: FlowStateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      {spinning && (
        <span
          aria-label="Cargando"
          className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        />
      )}
      {success && (
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-success">
          <Check className="h-14 w-14 text-foreground" strokeWidth={2.5} />
        </span>
      )}
      <p className={success ? 'text-2xl font-extrabold' : 'font-semibold'}>
        {label}
      </p>
    </div>
  );
}
