import { type ReactNode } from 'react';
import {
  ArrowRight,
  Heart,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react';
import {
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  useLocaleStore,
  useT,
} from '@/i18n';
import { cn } from '@/lib/cn';

export function Discover() {
  return (
    <div className="min-h-dvh bg-surface text-foreground">
      <TopBar />
      <Hero />
      <TrustStrip />
      <FeaturePhoto />
      <FeatureMap />
      <FeatureLearn />
      <HowItWorks />
      <ForWhom />
      <Privacy />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ─── Phone mockup shell ─── */
function PhoneMock({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      'relative w-44 rounded-[28px] border-4 border-foreground/30 bg-foreground/5 p-1.5 shadow-card',
      className,
    )}>
      <div className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground/30" />
      <div className="aspect-[9/16] overflow-hidden rounded-[20px] bg-surface">
        {children}
      </div>
    </div>
  );
}

/* ─── Phone scenes ─── */

function SceneCollection() {
  const animals = [
    { e: '🦁', label: 'León', bg: 'bg-accent/25' },
    { e: '🐧', label: 'Pingüino', bg: 'bg-primary/25' },
    { e: '🦋', label: 'Mariposa', bg: 'bg-highlight/40' },
    { e: '🐠', label: 'Pez payaso', bg: 'bg-primary/20' },
    { e: '🐢', label: 'Tortuga', bg: 'bg-success/30' },
    { e: '🦅', label: 'Águila', bg: 'bg-accent/20' },
  ];
  return (
    <div className="h-full w-full bg-surface p-2.5">
      <div className="mb-2 flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-full bg-primary/30" />
        <div className="h-2 w-20 rounded-full bg-foreground/20" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {animals.map((a) => (
          <div key={a.label} className={cn('flex flex-col items-center rounded-xl py-2.5', a.bg)}>
            <span className="text-2xl">{a.e}</span>
            <span className="mt-1 text-[9px] font-bold text-foreground/60">{a.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-xl bg-primary/20 px-2.5 py-1.5">
        <span className="text-[9px] font-extrabold">6 animales</span>
        <Star className="h-3 w-3 text-accent fill-accent" />
      </div>
    </div>
  );
}

function SceneIdentify() {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-cream to-surface p-2.5">
      <div className="aspect-square w-full overflow-hidden rounded-xl border-2 border-dashed border-foreground/25 bg-foreground/5 flex items-center justify-center">
        <span className="text-5xl">🦁</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {[
          { e: '🦁', name: 'León', sci: 'Panthera leo', selected: false },
          { e: '🐆', name: 'Leopardo', sci: 'Panthera pardus', selected: true },
          { e: '🐅', name: 'Tigre', sci: 'Panthera tigris', selected: false },
        ].map((item) => (
          <div
            key={item.name}
            className={cn(
              'flex items-center gap-2 rounded-xl p-1.5',
              item.selected && 'bg-primary/20 ring-1 ring-primary/50',
            )}
          >
            <span className="text-base">{item.e}</span>
            <div className="flex-1">
              <div className={cn('h-1.5 w-14 rounded-full', item.selected ? 'bg-foreground/40' : 'bg-foreground/20')} />
              <div className="mt-0.5 h-1 w-10 rounded-full bg-foreground/10 italic" />
            </div>
            {item.selected && <div className="h-3 w-3 rounded-full bg-primary shadow-sm" />}
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="flex h-8 items-center gap-1 rounded-full bg-accent px-4 shadow-card">
          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
          <span className="text-[10px] font-extrabold">Añadir</span>
        </div>
      </div>
    </div>
  );
}

function SceneMap() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Fondo de mapa */}
      <div className="absolute inset-0 bg-[#e8f5e9]" />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.2) 1px,transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {/* Caminos */}
      <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-white/50" />
      <div className="absolute left-1/3 top-0 h-full w-1 bg-white/50" />
      {/* Pines con emoji */}
      {[
        { l: '15%', t: '18%', e: '🦁', c: 'bg-accent' },
        { l: '58%', t: '33%', e: '🐧', c: 'bg-primary' },
        { l: '28%', t: '62%', e: '🦋', c: 'bg-highlight' },
        { l: '70%', t: '70%', e: '🐠', c: 'bg-primary' },
      ].map((p) => (
        <div key={p.e} className="absolute flex flex-col items-center" style={{ left: p.l, top: p.t }}>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-full shadow-card text-base', p.c)}>
            {p.e}
          </div>
          <div className="h-2 w-0.5 bg-foreground/40" />
        </div>
      ))}
      {/* Posición del usuario */}
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 ring-4 ring-blue-500/30 shadow" />
    </div>
  );
}

function SceneDetail() {
  return (
    <div className="h-full w-full bg-surface">
      <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-primary/30 to-accent/25">
        <span className="text-6xl">🦁</span>
        <span className="absolute bottom-2 left-2 rounded-full bg-foreground/60 px-2 py-0.5 text-[9px] font-bold text-surface">
          Tu foto · Cañuelo, 2024
        </span>
      </div>
      <div className="space-y-2 p-2.5">
        <div className="h-2.5 w-2/3 rounded-full bg-foreground/35" />
        <div className="h-1.5 w-1/2 rounded-full bg-foreground/15" />
        {/* Dato curioso */}
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-2">
          <div className="mb-1 text-[8px] font-extrabold uppercase tracking-wider text-accent">
            ¿Sabías que…
          </div>
          <div className="h-1 w-full rounded-full bg-foreground/15" />
          <div className="mt-0.5 h-1 w-3/4 rounded-full bg-foreground/10" />
        </div>
        {/* Comparador de tamaño */}
        <div className="rounded-xl bg-cream p-2">
          <div className="mb-1.5 h-1.5 w-20 rounded-full bg-foreground/20" />
          <div className="flex items-end gap-3 h-8">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3 rounded-sm bg-primary/50" style={{ height: '30%' }} />
              <div className="text-[7px] text-foreground/50">Tú</div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3 rounded-sm bg-accent/60" style={{ height: '85%' }} />
              <div className="text-[7px] text-foreground/50">León</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneTrophies() {
  const trophies = [
    { e: '🦁', done: true },
    { e: '🐦', done: true },
    { e: '🐠', done: true },
    { e: '🌊', done: true },
    { e: '🦋', done: false },
    { e: '🐍', done: false },
  ];
  return (
    <div className="h-full w-full bg-surface p-2.5">
      <div className="mb-2 h-2 w-1/2 rounded-full bg-foreground/25" />
      {/* Banner logro reciente */}
      <div className="mb-2.5 flex items-center gap-2 rounded-xl bg-highlight/40 px-2.5 py-2">
        <span className="text-xl">🏆</span>
        <div>
          <div className="h-1.5 w-20 rounded-full bg-foreground/40" />
          <div className="mt-0.5 h-1 w-14 rounded-full bg-foreground/20" />
        </div>
      </div>
      {/* Grid de logros */}
      <div className="grid grid-cols-3 gap-1.5">
        {trophies.map(({ e, done }, i) => (
          <div
            key={i}
            className={cn(
              'flex aspect-square flex-col items-center justify-center rounded-xl text-xl',
              done ? 'bg-highlight/60' : 'bg-foreground/5 opacity-35',
            )}
          >
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Secciones de la página ─── */

function TopBar() {
  const t = useT();
  return (
    <header className="sticky top-0 z-20 border-b border-foreground/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3">
        <a href="/conoce" aria-label="El Safari de Leo" className="flex items-center gap-2">
          <img src="/icons/safari-de-leo-source.svg" alt="" className="h-9 w-9 rounded-xl" />
          <span className="hidden text-base font-extrabold sm:block">El Safari de Leo</span>
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-sm font-extrabold text-surface transition-transform hover:scale-105 active:translate-y-px"
        >
          {t('discover.tryApp')}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const t = useT();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/25 via-highlight/20 to-success/15" />
      {/* Emojis flotantes decorativos */}
      <span className="pointer-events-none absolute right-6 top-8 text-5xl opacity-20 select-none sm:opacity-30">🌿</span>
      <span className="pointer-events-none absolute left-4 bottom-10 text-4xl opacity-15 select-none">🌺</span>
      <span className="pointer-events-none absolute right-1/4 bottom-8 text-3xl opacity-20 select-none">🦋</span>

      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Texto */}
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-foreground/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
              {t('discover.hero.eyebrow')}
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {t('discover.productName')}
            </h1>
            <p
              className="mx-auto mt-5 max-w-xl text-2xl font-extrabold leading-snug text-foreground/85 sm:text-3xl lg:mx-0"
              dangerouslySetInnerHTML={{ __html: t('discover.hero.title') }}
            />
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-foreground/70 lg:mx-0">
              {t('discover.hero.body')}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <a
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-lg font-extrabold text-foreground shadow-card transition-transform hover:scale-105 active:translate-y-px sm:w-auto"
              >
                {t('discover.hero.cta')}
                <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-foreground/20 bg-cream/80 px-8 py-4 text-lg font-extrabold text-foreground transition-colors hover:border-foreground/40 sm:w-auto"
              >
                {t('discover.hero.cta2')}
              </a>
            </div>
            <p className="mt-5 text-sm text-foreground/55">{t('discover.hero.tagline')}</p>
          </div>
          {/* Phone mockup */}
          <div className="flex shrink-0 justify-center">
            <div className="relative">
              <div className="absolute inset-0 -m-6 rounded-full bg-primary/20 blur-3xl" />
              <PhoneMock className="relative">
                <SceneCollection />
              </PhoneMock>
              {/* Badge flotante */}
              <div className="absolute -right-4 top-8 flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
                <span className="text-lg">🏆</span>
                <span className="text-xs font-extrabold">¡Nuevo logro!</span>
              </div>
              <div className="absolute -left-6 bottom-12 flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
                <span className="text-lg">📍</span>
                <span className="text-xs font-extrabold">Parque del Retiro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: '🆓', text: 'Completamente gratis' },
    { icon: '🚫', text: 'Sin anuncios' },
    { icon: '🔒', text: 'Privado y seguro' },
    { icon: '🌍', text: 'Castellano y euskera' },
  ];
  return (
    <div className="border-y border-foreground/10 bg-cream/60 py-5">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-3 px-5 sm:gap-6">
        {items.map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-extrabold text-foreground/70">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Feature block helper */
function FeatureBlock({
  phone,
  eyebrow,
  title,
  body,
  bullets,
  reverse = false,
  bg = '',
}: {
  phone: ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  bullets: { icon: LucideIcon | string; text: string }[];
  reverse?: boolean;
  bg?: string;
}) {
  return (
    <section className={cn('py-20 sm:py-28', bg)}>
      <div className={cn(
        'mx-auto flex w-full max-w-5xl flex-col items-center gap-12 px-5 lg:flex-row lg:gap-20',
        reverse && 'lg:flex-row-reverse',
      )}>
        {/* Phone */}
        <div className="flex shrink-0 justify-center">
          <div className="relative">
            <div className="absolute inset-0 -m-8 rounded-full bg-primary/10 blur-3xl" />
            {phone}
          </div>
        </div>
        {/* Text */}
        <div className="flex-1">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-foreground/70">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} />
            {eyebrow}
          </p>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">{body}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-base">
                  {typeof icon === 'string' ? icon : <span className="[&>*]:h-3.5 [&>*]:w-3.5">{icon as any}</span>}
                </span>
                <span className="text-base text-foreground/80">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeaturePhoto() {
  const t = useT();
  return (
    <FeatureBlock
      phone={<PhoneMock><SceneIdentify /></PhoneMock>}
      eyebrow={t('discover.features.1.title')}
      title="Identifica cualquier animal con un toque."
      body={t('discover.features.1.body')}
      bullets={[
        { icon: '📸', text: 'Foto con la cámara o desde la galería' },
        { icon: '🔍', text: 'Buscador adaptado para niños, sin nombres raros' },
        { icon: '✅', text: 'Confirma el animal y queda en la colección al instante' },
      ]}
    />
  );
}

function FeatureMap() {
  const t = useT();
  return (
    <FeatureBlock
      reverse
      bg="bg-cream/40"
      phone={<PhoneMock><SceneMap /></PhoneMock>}
      eyebrow={t('discover.features.3.title')}
      title="Cada aventura, guardada en el mapa."
      body={t('discover.features.3.body')}
      bullets={[
        { icon: '📍', text: 'Foto + GPS automático en cada avistamiento' },
        { icon: '🗺️', text: 'El mapa crece con cada salida familiar' },
        { icon: '📅', text: 'Revisa los recuerdos por fecha y lugar' },
      ]}
    />
  );
}

function FeatureLearn() {
  return (
    <FeatureBlock
      phone={
        <div className="flex flex-col items-center gap-6">
          <PhoneMock><SceneDetail /></PhoneMock>
          <PhoneMock><SceneTrophies /></PhoneMock>
        </div>
      }
      eyebrow="Aprende y colecciona"
      title="Una Pokédex real. Con animales de verdad."
      body="Cada animal desbloquea su ficha completa: qué come, cómo nace, dónde vive, cuánto mide. Datos de Wikipedia adaptados para peques."
      bullets={[
        { icon: '📚', text: 'Info educativa de cada especie (dieta, hábitat, reproducción)' },
        { icon: '🔊', text: 'Sonidos reales del animal' },
        { icon: '📏', text: 'Comparador de tamaño: ¿cómo de grande es respecto a tu peque?' },
        { icon: '🏆', text: 'Más de 30 logros por desbloquear' },
      ]}
    />
  );
}

function HowItWorks() {
  const t = useT();
  const steps = [
    { n: 1, e: '👀', title: t('discover.how.1.title'), body: t('discover.how.1.body') },
    { n: 2, e: '📸', title: t('discover.how.2.title'), body: t('discover.how.2.body') },
    { n: 3, e: '🔍', title: t('discover.how.3.title'), body: t('discover.how.3.body') },
    { n: 4, e: '🌟', title: t('discover.how.4.title'), body: t('discover.how.4.body') },
  ];
  return (
    <section id="como-funciona" className="border-t border-foreground/10 bg-foreground py-20 text-surface sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{t('discover.how.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-surface/70">{t('discover.how.body')}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, e, title, body }) => (
            <div key={n} className="relative rounded-2xl border border-surface/10 bg-surface/10 p-6 backdrop-blur">
              <span className="absolute -top-3 left-5 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-foreground shadow">
                {n}
              </span>
              <span className="text-4xl">{e}</span>
              <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-surface/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForWhom() {
  const t = useT();
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{t('discover.forWhom.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">{t('discover.forWhom.body')}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <ForWhomCard
            emoji="👨‍👧"
            icon={Heart}
            title={t('discover.forWhom.parents.title')}
            color="bg-primary/15 border-primary/20"
            items={[
              t('discover.forWhom.parents.1'),
              t('discover.forWhom.parents.2'),
              t('discover.forWhom.parents.3'),
              t('discover.forWhom.parents.4'),
            ]}
          />
          <ForWhomCard
            emoji="🧒"
            icon={Sparkles}
            title={t('discover.forWhom.kids.title')}
            color="bg-accent/15 border-accent/20"
            items={[
              t('discover.forWhom.kids.1'),
              t('discover.forWhom.kids.2'),
              t('discover.forWhom.kids.3'),
              t('discover.forWhom.kids.4'),
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function ForWhomCard({
  emoji,
  title,
  color,
  items,
}: {
  emoji: string;
  icon: LucideIcon;
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div className={cn('rounded-2xl border-2 p-7 shadow-soft', color)}>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{emoji}</span>
        <h3 className="text-xl font-extrabold">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base text-foreground/80">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-foreground/40" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Privacy() {
  const t = useT();
  return (
    <section className="border-t border-foreground/10 bg-cream/50 py-20">
      <div className="mx-auto w-full max-w-3xl px-5 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/30 shadow-soft">
          <ShieldCheck className="h-8 w-8" strokeWidth={2.2} />
        </span>
        <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">{t('discover.trust.title')}</h2>
        <p className="mt-6 text-lg leading-relaxed text-foreground/70">{t('discover.trust.body')}</p>
      </div>
    </section>
  );
}

function FinalCta() {
  const t = useT();
  return (
    <section className="relative overflow-hidden border-t border-foreground/10 bg-gradient-to-br from-primary/20 via-highlight/20 to-accent/20 py-20 sm:py-28">
      <span className="pointer-events-none absolute right-8 top-8 text-6xl opacity-15 select-none">🦁</span>
      <span className="pointer-events-none absolute left-8 bottom-8 text-5xl opacity-10 select-none">🌿</span>
      <div className="mx-auto w-full max-w-3xl px-5 text-center">
        <span className="mb-6 inline-block text-6xl">🚀</span>
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t('discover.final.title')}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground/75">
          {t('discover.final.body')}
        </p>
        <a
          href="/"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-10 py-4 text-xl font-extrabold text-foreground shadow-card transition-transform hover:scale-105 active:translate-y-px"
        >
          {t('discover.final.cta')}
          <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
        </a>
        <p className="mt-5 text-sm text-foreground/55">
          Ábrela en Chrome o Safari → "Añadir a pantalla de inicio" → funciona como app nativa 📱
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-foreground/10 bg-surface py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 px-5">
        <LocaleSwitcher />
        <div className="flex items-center gap-2">
          <img src="/icons/safari-de-leo-source.svg" alt="" className="h-6 w-6 rounded-lg" />
          <p className="text-sm text-foreground/50">{t('discover.footer')}</p>
        </div>
      </div>
    </footer>
  );
}

function LocaleSwitcher() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return (
    <div className="flex items-center gap-1 rounded-full bg-foreground/8 p-1">
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide transition-colors',
            locale === l ? 'bg-foreground text-surface' : 'text-foreground/60 hover:text-foreground',
          )}
          aria-label={LOCALE_NAMES[l]}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
