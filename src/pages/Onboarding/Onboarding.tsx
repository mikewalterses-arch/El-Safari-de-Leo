import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Camera,
  Compass,
  Map as MapIcon,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useKids } from '@/features/kids/useKids';
import type { KidProfile } from '@/types/models';

interface OnboardingProps {
  onComplete: () => void;
  /** Si se proporciona, muestra una X arriba a la derecha para cerrar la intro
   *  sin completar (modo demostración desde Perfil → "Ver intro"). */
  onClose?: () => void;
}

type SlideVisual = 'birthday' | 'compass' | 'family' | 'steps';

interface Slide {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  visual: SlideVisual;
}

export function Onboarding({ onComplete, onClose }: OnboardingProps) {
  const { activeKid } = useKids();
  const [step, setStep] = useState(0);

  const slides = useMemo(() => buildSlides(activeKid), [activeKid]);
  const slide = slides[step]!;
  const isLast = step === slides.length - 1;

  const next = () => {
    if (isLast) onComplete();
    else setStep(step + 1);
  };

  const heroNumber = getHeroNumber(activeKid);

  return (
    <div className="flex min-h-dvh flex-col bg-surface text-foreground">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>
      )}

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mx-auto w-full max-w-md">
          <SlideArt variant={slide.visual} heroNumber={heroNumber} />
          <p className="mt-10 text-sm font-extrabold uppercase tracking-wider text-accent">
            {slide.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight">
            {slide.title}
          </h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-foreground/80">
            {slide.body}
          </p>
        </div>
      </main>

      <footer
        className="px-6"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 2.5rem)' }}
      >
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
          <div className="flex gap-2" aria-hidden>
            {slides.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === step ? 'w-8 bg-primary' : 'w-2 bg-foreground/15',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-accent px-6 py-4 text-lg font-extrabold text-foreground shadow-card transition-transform active:translate-y-px"
          >
            {slide.cta}
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </footer>
    </div>
  );
}

function buildSlides(kid: KidProfile | null): Slide[] {
  const name = kid?.displayName?.trim() || 'pequeño explorador';
  const isBirthday = kid ? isBirthdayToday(kid) : false;
  const ageTurning = kid ? getAgeTurning(kid) : null;

  const firstSlide: Slide =
    isBirthday && ageTurning !== null
      ? {
          eyebrow: '¡Feliz cumpleaños!',
          title: `Hoy cumples ${ageTurning}, ${name}`,
          body: 'Papá te ha hecho un regalo muy especial.\nUna app solo para ti.',
          cta: 'Sigue',
          visual: 'birthday',
        }
      : {
          eyebrow: `¡Hola, ${name}!`,
          title: `Bienvenido al Safari`,
          body: 'Una app solo para ti, para descubrir\nanimales por todas partes.',
          cta: 'Sigue',
          visual: 'birthday',
        };

  return [
    firstSlide,
    {
      eyebrow: 'Te presento',
      title: `El Safari de ${name}`,
      body: 'Una libreta mágica para guardar todos los animales que descubras. En el zoo, en la playa, en el parque, en libros... en cualquier sitio.',
      cta: 'Sigue',
      visual: 'compass',
    },
    {
      eyebrow: 'Importante',
      title: 'Hazlo con papá',
      body: 'Esta app es para descubrir animales juntos.\nPídele permiso a papá antes de abrirla.',
      cta: 'Sigue',
      visual: 'family',
    },
    {
      eyebrow: '¿Cómo funciona?',
      title: 'Tres pasos',
      body: '1. Hazle una foto al animal.\n2. Búscalo en la lista y añádelo a tu colección.\n3. Mira tus aventuras en el mapa.',
      cta: '¡Empezar mi safari!',
      visual: 'steps',
    },
  ];
}

function isBirthdayToday(kid: KidProfile): boolean {
  const birth = kid.birthDate?.toDate?.();
  if (!birth) return false;
  const today = new Date();
  return (
    birth.getMonth() === today.getMonth() &&
    birth.getDate() === today.getDate()
  );
}

function getAgeTurning(kid: KidProfile): number | null {
  const birth = kid.birthDate?.toDate?.();
  if (!birth) return null;
  const today = new Date();
  return today.getFullYear() - birth.getFullYear();
}

function getHeroNumber(kid: KidProfile | null): number {
  if (!kid) return 7;
  const turning = getAgeTurning(kid);
  if (turning === null || turning <= 0) return 7;
  return turning;
}

function SlideArt({
  variant,
  heroNumber,
}: {
  variant: SlideVisual;
  heroNumber: number;
}) {
  if (variant === 'birthday') {
    return (
      <div className="relative inline-flex items-center justify-center">
        <span className="absolute inset-0 -m-8 rounded-full bg-highlight/50 blur-2xl" />
        <span className="relative flex h-36 w-36 items-center justify-center rounded-full bg-primary text-7xl font-extrabold text-foreground shadow-card">
          {heroNumber}
        </span>
      </div>
    );
  }
  if (variant === 'compass') {
    return (
      <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-success shadow-card">
        <Compass className="h-16 w-16 text-foreground" strokeWidth={1.8} />
      </div>
    );
  }
  if (variant === 'family') {
    return (
      <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-accent/40 shadow-card">
        <Users className="h-16 w-16 text-foreground" strokeWidth={1.8} />
      </div>
    );
  }
  return (
    <div className="flex justify-center gap-3">
      <StepIcon icon={Camera} bg="bg-primary" />
      <StepIcon icon={Compass} bg="bg-accent" />
      <StepIcon icon={MapIcon} bg="bg-success" />
    </div>
  );
}

function StepIcon({ icon: Icon, bg }: { icon: LucideIcon; bg: string }) {
  return (
    <div
      className={cn(
        'flex h-20 w-20 items-center justify-center rounded-card shadow-soft',
        bg,
      )}
    >
      <Icon className="h-9 w-9 text-foreground" strokeWidth={1.8} />
    </div>
  );
}
