import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PhotoCaptureStep } from './PhotoCaptureStep';
import { IdentifyStep } from './IdentifyStep';
import { ConfirmStep } from './ConfirmStep';
import { QuizStep } from './QuizStep';
import { generateQuestion } from './quizGenerator';
import { createSighting } from './createSighting';
import { DiscoveryCelebration } from './DiscoveryCelebration';
import { ensureAnimal } from '@/features/animals/cacheAnimal';
import { useAuth } from '@/features/auth/useAuth';
import { useKids } from '@/features/kids/useKids';
import { getCurrentLocation } from '@/lib/geolocation';
import { useT } from '@/i18n';
import type {
  Animal,
  AnimalSearchResult,
  CuratedTags,
  SightingAttributes,
  SightingLocation,
} from '@/types/models';

type Step =
  | 'photo'
  | 'identify'
  | 'caching'
  | 'confirm'
  | 'saving'
  | 'done'
  | 'quiz';

interface PreselectedState {
  animal?: AnimalSearchResult;
}

export function NewSightingFlow() {
  const t = useT();
  const { user } = useAuth();
  const { activeKidId } = useKids();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedAnimal =
    (location.state as PreselectedState | null)?.animal ?? null;

  const [step, setStep] = useState<Step>('photo');
  const [photo, setPhoto] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [animal, setAnimal] = useState<AnimalSearchResult | null>(preselectedAnimal);
  const [animalId, setAnimalId] = useState<string | null>(null);
  const [animalCuratedTags, setAnimalCuratedTags] = useState<CuratedTags | undefined>(undefined);
  const [locationData, setLocationData] = useState<SightingLocation | null>(null);
  const [notes, setNotes] = useState('');
  const [attributes, setAttributes] = useState<SightingAttributes>({});
  const [error, setError] = useState<string | null>(null);
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [isFirstDiscovery, setIsFirstDiscovery] = useState(false);

  // Pregunta del quiz: se genera una sola vez cuando tenemos los curatedTags.
  const quizQuestion = useMemo(
    () => (animalCuratedTags ? generateQuestion(animalCuratedTags) : null),
    [animalCuratedTags],
  );

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
      // Leemos el animal cacheado para tener acceso a curatedTags (sirve al quiz).
      try {
        const snap = await getDoc(doc(db, 'animals', id));
        const data = snap.data() as Animal | undefined;
        setAnimalCuratedTags(data?.curatedTags);
      } catch {
        /* no-blocker; el quiz simplemente no se mostrará */
      }
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
    if (!activeKidId) {
      console.warn('[onSave] activeKidId is null — abortando', {
        hasUser: !!user,
        hasPhoto: !!photo,
        animalId,
        activeKidId,
      });
      setError('No hay un peque activo. Ve a Perfil y crea o selecciona uno.');
      return;
    }
    setStep('saving');
    setError(null);
    try {
      const result = await createSighting({
        uid: user.uid,
        kidId: activeKidId,
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
    const handle = setTimeout(() => {
      // Si el animal está en el catálogo curado, mostramos quiz.
      if (quizQuestion) {
        setStep('quiz');
      } else {
        navigate('/diario');
      }
    }, delay);
    return () => clearTimeout(handle);
  }, [step, navigate, isFirstDiscovery, quizQuestion]);

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
  if (step === 'quiz' && quizQuestion && animal) {
    return (
      <QuizStep
        question={quizQuestion}
        animalName={animal.title}
        onContinue={() => navigate('/diario')}
      />
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
