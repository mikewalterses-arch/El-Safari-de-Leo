import {
  ArrowRight,
  Award,
  Camera,
  Compass,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

const FEATURES: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Camera,
    title: 'Foto y a la colección',
    body: 'Tu peque hace una foto al animal que ve y lo identifica con un buscador adaptado. Acaba en su Pokédex personal.',
  },
  {
    icon: Search,
    title: 'Catálogo enorme',
    body: 'Miles de animales reales con info de Wikipedia y características educativas (qué come, cómo nace, dónde vive).',
  },
  {
    icon: MapPin,
    title: 'Mapa de aventuras',
    body: 'Cada avistamiento queda en el mapa con foto, fecha y ubicación. Los recuerdos no se pierden.',
  },
  {
    icon: Compass,
    title: 'Cerca de ti',
    body: 'Sugerimos qué animales han visto otras personas cerca para inspirar la próxima salida.',
  },
  {
    icon: Trophy,
    title: 'Logros y retos',
    body: 'Más de 30 logros por descubrir: primer mamífero, primer ave, 10 animales, retos semanales… motivación constante.',
  },
  {
    icon: Award,
    title: 'Quiz educativo',
    body: 'Tras cada descubrimiento, una pregunta corta sobre el animal: qué grupo es, qué come. Aprender sin darse cuenta.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Ve un animal',
    body: 'En el zoo, en la playa, en el parque, en un libro. En cualquier sitio.',
  },
  {
    n: '2',
    title: 'Hace una foto',
    body: 'Con la cámara o desde la galería. La app se encarga del resto.',
  },
  {
    n: '3',
    title: 'Lo identifica',
    body: 'Busca el nombre y lo añade. Aparece en su colección con foto, datos y mapa.',
  },
  {
    n: '4',
    title: 'Aprende y colecciona',
    body: 'Lee curiosidades, escucha sonidos, compara su tamaño con el suyo, desbloquea logros.',
  },
];

export function Discover() {
  return (
    <div className="min-h-dvh bg-surface text-foreground">
      <Header />
      <Hero />
      <WhatIs />
      <ForWhom />
      <Features />
      <HowItWorks />
      <Trust />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-foreground/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <a href="/conoce" className="flex items-center gap-2">
          <img
            src="/icons/safari-de-leo-source.svg"
            alt=""
            className="h-9 w-9"
          />
          <span className="text-base font-extrabold tracking-tight">
            El Safari
          </span>
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-1.5 rounded-button bg-foreground px-4 py-2 text-sm font-extrabold text-surface transition-transform active:translate-y-px"
        >
          Probar la app
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/30 via-highlight/30 to-success/20" />
      <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:py-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          Para peques curiosos de 5 a 10 años
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          La app que convierte cada paseo en un{' '}
          <span className="text-primary">safari</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
          Una libreta mágica de animales para tu hijo o hija. Hace una foto,
          la identifica, y construye su colección como si fuera una Pokédex
          real con animales del mundo.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-accent px-8 py-4 text-lg font-extrabold text-foreground shadow-card transition-transform active:translate-y-px sm:w-auto"
          >
            Pruébala gratis
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </a>
          <a
            href="#como-funciona"
            className="inline-flex w-full items-center justify-center gap-2 rounded-button border-2 border-foreground/20 bg-cream px-8 py-4 text-lg font-extrabold text-foreground sm:w-auto"
          >
            Ver cómo funciona
          </a>
        </div>
        <p className="mt-6 text-sm text-foreground/60">
          Sin anuncios · Funciona como app en el móvil · Castellano y euskera
        </p>
      </div>
    </section>
  );
}

function WhatIs() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
      <h2 className="text-3xl font-extrabold sm:text-4xl">
        Una excusa perfecta para mirar al mundo.
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-foreground/75">
        El Safari es una app pensada para que los peques quieran salir, mirar,
        preguntar y aprender. Cada animal que ven —en el zoo, en el parque,
        en la playa, incluso en un libro— se convierte en un descubrimiento
        que pueden coleccionar y mirar después.
      </p>
    </section>
  );
}

function ForWhom() {
  return (
    <section className="border-y border-foreground/10 bg-cream py-16">
      <div className="mx-auto w-full max-w-5xl px-4">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
          Pensada para hacerla juntos.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/75">
          La app vive en el móvil de papá o mamá. Los peques la usan
          contigo cuando os apetece — sin pantallas en el bolsillo del niño.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <BenefitCard
            icon={Heart}
            title="Para padres y madres"
            items={[
              'Sin anuncios ni compras dentro del juego',
              'Sin contenido inadecuado: solo animales reales',
              'Multi-hijo: cada peque su colección',
              'Funciona offline parcialmente',
            ]}
          />
          <BenefitCard
            icon={Sparkles}
            title="Para los peques"
            items={[
              'Onboarding adaptado con su nombre',
              'Lenguaje sencillo, dibujos grandes, botones claros',
              'Logros y celebraciones en cada descubrimiento',
              'Aprenden taxonomía sin notarlo',
            ]}
          />
        </div>
      </div>
    </section>
  );
}

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
}

function BenefitCard({ icon: Icon, title, items }: BenefitCardProps) {
  return (
    <div className="rounded-card border border-foreground/10 bg-surface p-6 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <h3 className="text-xl font-extrabold">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 text-base text-foreground/80">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Features() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
        Todo lo que hace.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/75">
        Más que una colección: una herramienta educativa que crece con el
        peque.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-card border border-foreground/10 bg-cream p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/40">
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">{f.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-foreground/75">
                {f.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-t border-foreground/10 bg-cream py-16"
    >
      <div className="mx-auto w-full max-w-5xl px-4">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
          Así es un descubrimiento.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/75">
          Cuatro pasos. Tan simple que hasta un niño de 5 años lo entiende.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-card border border-foreground/10 bg-surface p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-foreground shadow-card">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-foreground/75">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/40">
        <ShieldCheck className="h-7 w-7" strokeWidth={2.2} />
      </span>
      <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
        Privacidad y datos: lo justo y nada más.
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-foreground/75">
        Las fotos y avistamientos se guardan solo en tu cuenta familiar.
        Nada es público, nada se comparte. Sin recolección de datos para
        publicidad. Sin redes sociales dentro.
      </p>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-y border-foreground/10 bg-foreground py-16 text-surface">
      <div className="mx-auto w-full max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Empieza el primer safari.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-surface/80">
          Ábrela en el móvil, instálala como app desde Safari o Chrome
          ("Añadir a pantalla de inicio") y deja que el peque empiece a
          descubrir.
        </p>
        <a
          href="/"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-button bg-accent px-10 py-4 text-lg font-extrabold text-foreground shadow-card transition-transform active:translate-y-px"
        >
          Entrar a la app
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 py-10 text-center text-sm text-foreground/60">
      <p>El Safari · Hecho con cariño para los pequeños exploradores</p>
    </footer>
  );
}
