import { useState } from 'react';
import {
  ArrowRight,
  Camera,
  Compass,
  Map as MapIcon,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface OnboardingProps {
  onComplete: () => void;
}

type SlideVisual = 'birthday' | 'compass' | 'steps';

interface Slide {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  visual: SlideVisual;
}

// TODO(post-fase-1): para cumpleaños futuros, calcular el número desde users/{uid}.birthDate
// en lugar de hardcodear "7". El placeholder de hoy es intencional: es su regalo de los 7.
const slides: Slide[] = [
  {
    eyebrow: '¡Feliz cumpleaños!',
    title: 'Hoy cumples 7, Leo',
    body: 'Papá te ha hecho un regalo muy especial.\nUna app solo para ti.',
    cta: 'Sigue',
    visual: 'birthday',
  },
  {
    eyebrow: 'Te presento',
    title: 'El Safari de Leo',
    body: 'Una libreta mágica para guardar todos los animales que descubras. En el zoo, en la playa, en el parque, en libros... en cualquier sitio.',
    cta: 'Sigue',
    visual: 'compass',
  },
  {
    eyebrow: '¿Cómo funciona?',
    title: 'Tres pasos',
    body: '1. Hazle una foto al animal.\n2. Búscalo en la lista y añádelo a tu colección.\n3. Mira tus aventuras en el mapa.',
    cta: '¡Empezar mi safari!',
    visual: 'steps',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const slide = slides[step]!;
  const isLast = step === slides.length - 1;

  const next = () => {
    if (isLast) onComplete();
    else setStep(step + 1);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-surface text-foreground">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mx-auto w-full max-w-md">
          <SlideArt variant={slide.visual} />
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

function SlideArt({ variant }: { variant: SlideVisual }) {
  if (variant === 'birthday') {
    return (
      <div className="relative inline-flex items-center justify-center">
        <span className="absolute inset-0 -m-8 rounded-full bg-highlight/50 blur-2xl" />
        <span className="relative flex h-36 w-36 items-center justify-center rounded-full bg-primary text-7xl font-extrabold text-foreground shadow-card">
          7
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
