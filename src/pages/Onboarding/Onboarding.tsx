import { useMemo, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
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
  if (variant === 'birthday') return <ArtWelcome heroNumber={heroNumber} />;
  if (variant === 'compass') return <ArtCollection />;
  if (variant === 'family') return <ArtFamily />;
  return <ArtHowItWorks />;
}

/* ── Slide 1: Bienvenida / Cumpleaños ── */
function ArtWelcome({ heroNumber }: { heroNumber: number }) {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-primary/30 via-highlight/20 to-accent/20 px-6 py-8 text-center overflow-hidden">
      {/* Fondo de puntos decorativos */}
      <span className="absolute -top-6 -left-6 text-7xl opacity-20">🌿</span>
      <span className="absolute -bottom-4 -right-4 text-6xl opacity-15">🌺</span>

      {/* Número de edad destacado */}
      <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-card">
        <span className="text-5xl font-extrabold">{heroNumber}</span>
        <span className="absolute -top-2 -right-2 text-3xl">🎉</span>
      </div>

      {/* Desfile de animales */}
      <div className="flex justify-center gap-2 text-4xl">
        <span style={{ animationDelay: '0ms' }} className="animate-bounce inline-block">🦁</span>
        <span style={{ animationDelay: '80ms' }} className="animate-bounce inline-block">🐘</span>
        <span style={{ animationDelay: '160ms' }} className="animate-bounce inline-block">🦋</span>
        <span style={{ animationDelay: '240ms' }} className="animate-bounce inline-block">🐬</span>
        <span style={{ animationDelay: '320ms' }} className="animate-bounce inline-block">🦜</span>
      </div>
      <div className="mt-2 flex justify-center gap-3 text-3xl opacity-70">
        <span>🐠</span><span>🦊</span><span>🐢</span><span>🦅</span>
      </div>
    </div>
  );
}

/* ── Slide 2: Tu Colección ── */
function ArtCollection() {
  const animals = [
    { e: '🦁', name: 'León', color: 'bg-accent/30' },
    { e: '🐧', name: 'Pingüino', color: 'bg-primary/30' },
    { e: '🦋', name: 'Mariposa', color: 'bg-highlight/40' },
    { e: '🐠', name: 'Pez payaso', color: 'bg-primary/20' },
    { e: '🐢', name: 'Tortuga', color: 'bg-success/30' },
    { e: '🦅', name: 'Águila', color: 'bg-accent/20' },
  ];
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2">
        {animals.map(({ e, name, color }) => (
          <div
            key={name}
            className={cn(
              'flex flex-col items-center rounded-2xl px-2 py-3 shadow-soft',
              color,
            )}
          >
            <span className="text-4xl">{e}</span>
            <span className="mt-1 text-[10px] font-bold text-foreground/70 text-center leading-tight">{name}</span>
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-foreground/50">
        Tu colección crece con cada aventura 🌟
      </p>
    </div>
  );
}

/* ── Slide 3: Con papá / familia ── */
function ArtFamily() {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-accent/20 to-highlight/30 px-6 py-8 text-center overflow-hidden">
      <span className="absolute top-3 right-5 text-4xl opacity-30">🌸</span>
      <span className="absolute bottom-4 left-4 text-3xl opacity-25">🍃</span>

      {/* Escena de aventura en familia */}
      <div className="flex items-end justify-center gap-2 text-7xl">
        <span>👨</span>
        <span className="text-5xl mb-1">🧒</span>
      </div>
      <div className="mt-3 text-3xl">🔭</div>
      <div className="mt-4 flex justify-center gap-3 text-2xl">
        <span>🌲</span>
        <span>🐦</span>
        <span>🌲</span>
        <span>🦎</span>
        <span>🌿</span>
      </div>

      {/* Badge aventura */}
      <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-foreground/10 px-4 py-1.5">
        <span className="text-sm">❤️</span>
        <span className="text-xs font-extrabold text-foreground/80">Aventuras en familia</span>
      </div>
    </div>
  );
}

/* ── Slide 4: Cómo funciona ── */
function ArtHowItWorks() {
  const steps = [
    {
      emoji: '📸',
      bg: 'bg-primary',
      label: 'Fotografía',
      desc: 'Haz una foto al animal que encuentres',
    },
    {
      emoji: '🔍',
      bg: 'bg-accent',
      label: 'Identifica',
      desc: 'Búscalo y aprende todo sobre él',
    },
    {
      emoji: '🗺️',
      bg: 'bg-success',
      label: 'Colecciona',
      desc: 'Guárdalo en tu mapa de aventuras',
    },
  ];
  return (
    <div className="w-full space-y-3">
      {steps.map(({ emoji, bg, label, desc }, i) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl border border-foreground/8 bg-cream px-4 py-3 shadow-soft"
        >
          <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-soft', bg)}>
            {emoji}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold">
              <span className="mr-1.5 text-foreground/40">0{i + 1}</span>
              {label}
            </p>
            <p className="text-xs text-foreground/60">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
