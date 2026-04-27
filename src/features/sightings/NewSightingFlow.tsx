import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import type {
  AnimalSearchResult,
  SightingAttributes,
  SightingLocation,
} from '@/types/models';

type Step = 'photo' | 'identify' | 'caching' | 'confirm' | 'saving' | 'done';

interface PreselectedState {
  animal?: AnimalSearchResult;
}

export function NewSightingFlow() {
  const t = useT();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedAnimal =
    (location.state as PreselectedState | null)?.animal ?? null;

  const [step, setStep] = useState<Step>('photo');
  const [photo, setPhoto] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [animal, setAnimal] = useState<AnimalSearchResult | null>(preselectedAnimal);
  const [animalId, setAnimalId] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<SightingLocation | null>(null);
  const [notes, setNotes] = useState('');
  const [attributes, setAttributes] = useState<SightingAttributes>({});
  const [error, setError] = useState<string | null>(null);
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [isFirstDiscovery, setIsFirstDiscovery] = useState(false);

  useEffect(() => {
    if (!photo || locationData) return;
    getCurrentLocation()
      .then(setLocationData)
      .catch(() => {});
  }, [photo, locationData]);

  const cacheSelected = async (result: AnimalSearchResult) => {
    setAnimal(result);
    setError(null);
    setIdentifyError(null);
    setStep('caching');
    try {
      const id = await ensureAnimal(result);
      setAnimalId(id);
      setStep('confirm');
    } catch (err) {
      console.error('ensureAnimal failed', err);
      setIdentifyError(
        err instanceof Error ? err.message : 'No se pudo cargar el animal',
      );
      setStep('identify');
    }
  };

  const onPhotoSelected = (file: File) => {
    setPhoto(file);
    if (preselectedAnimal) {
      // Si vienes de "Cerca de ti", saltamos el paso de identificar — ya
      // sabemos qué animal es. Pasamos directo al caching.
      void cacheSelected(preselectedAnimal);
    } else {
      setStep('identify');
    }
  };

  const onAnimalSelected = (result: AnimalSearchResult) => {
    void cacheSelected(result);
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
        location: locationData,
        notes,
        attributes,
      });
      navigator.vibrate?.([60, 30, 60]);
      setIsFirstDiscovery(result.isFirstDiscovery);
      setStep('done');
    } catch (err) {
      console.error('createSighting failed', err);
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
    return (
      <IdentifyStep
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onAnimalSelected={onAnimalSelected}
        error={identifyError}
      />
    );
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
        location={locationData}
        notes={notes}
        attributes={attributes}
        onNotesChange={setNotes}
        onAttributesChange={setAttributes}
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
