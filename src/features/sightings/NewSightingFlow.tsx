import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PhotoCaptureStep } from './PhotoCaptureStep';
import { IdentifyStep } from './IdentifyStep';
import { ConfirmStep } from './ConfirmStep';
import { createSighting } from './createSighting';
import { ensureAnimal } from '@/features/animals/cacheAnimal';
import { useAuth } from '@/features/auth/useAuth';
import { getCurrentLocation } from '@/lib/geolocation';
import type { WikiSearchResult } from '@/lib/wikipedia';
import type { SightingLocation } from '@/types/models';

type Step = 'photo' | 'identify' | 'confirm' | 'saving' | 'done';

export function NewSightingFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('photo');
  const [photo, setPhoto] = useState<File | null>(null);
  const [animal, setAnimal] = useState<WikiSearchResult | null>(null);
  const [animalId, setAnimalId] = useState<string | null>(null);
  const [location, setLocation] = useState<SightingLocation | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // En cuanto Leo hace la foto, lanzamos GPS en background — para cuando llegue al
  // paso de confirmación normalmente ya está resuelto. Si falla, no es bloqueante.
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

  const onAnimalSelected = async (result: WikiSearchResult) => {
    setAnimal(result);
    setError(null);
    try {
      const id = await ensureAnimal(result);
      setAnimalId(id);
      setStep('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el animal');
    }
  };

  const onSave = async () => {
    if (!user || !photo || !animalId) return;
    setStep('saving');
    setError(null);
    try {
      await createSighting({
        uid: user.uid,
        animalId,
        photo,
        location,
        notes,
      });
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
      setStep('confirm');
    }
  };

  // Tras "done" llevamos a Leo al diario con el avistamiento recién hecho.
  // TODO(fase-5): aquí va la animación de descubrimiento si es primer avistamiento.
  useEffect(() => {
    if (step !== 'done') return;
    const t = setTimeout(() => navigate('/diario'), 1500);
    return () => clearTimeout(t);
  }, [step, navigate]);

  if (step === 'photo') {
    return <PhotoCaptureStep onPhotoSelected={onPhotoSelected} />;
  }
  if (step === 'identify') {
    return <IdentifyStep onAnimalSelected={onAnimalSelected} />;
  }
  if (step === 'saving') {
    return <FlowStateMessage label="Guardando tu avistamiento..." spinning />;
  }
  if (step === 'done') {
    return <FlowStateMessage label="¡Guardado!" success />;
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
