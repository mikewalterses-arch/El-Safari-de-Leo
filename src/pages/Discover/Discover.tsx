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
import {
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  useLocaleStore,
  useT,
} from '@/i18n';
import { cn } from '@/lib/cn';

const FEATURE_ICONS: LucideIcon[] = [
  Camera,
  Search,
  MapPin,
  Compass,
  Trophy,
  Award,
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
  const t = useT();
  return (
    <header className="border-b border-foreground/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <a href="/conoce" aria-label={t('discover.productName')}>
          <img
            src="/icons/safari-de-leo-source.svg"
            alt=""
            className="h-10 w-10"
          />
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-1.5 rounded-button bg-foreground px-4 py-2 text-sm font-extrabold text-surface transition-transform active:translate-y-px"
        >
          {t('discover.tryApp')}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

function LocaleSwitcher() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return (
    <div className="flex items-center gap-1 rounded-full bg-foreground/10 p-1">
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide transition-colors',
            locale === l
              ? 'bg-foreground text-surface'
              : 'text-foreground/70 hover:text-foreground',
          )}
          aria-label={LOCALE_NAMES[l]}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Hero() {
  const t = useT();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/30 via-highlight/30 to-success/20" />
      <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:py-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          {t('discover.hero.eyebrow')}
        </p>
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          {t('discover.productName')}
        </h1>
        <p
          className="mx-auto mt-6 max-w-3xl text-2xl font-extrabold leading-tight text-foreground/85 sm:text-3xl"
          dangerouslySetInnerHTML={{ __html: t('discover.hero.title') }}
        />
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
          {t('discover.hero.body')}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-accent px-8 py-4 text-lg font-extrabold text-foreground shadow-card transition-transform active:translate-y-px sm:w-auto"
          >
            {t('discover.hero.cta')}
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </a>
          <a
            href="#como-funciona"
            className="inline-flex w-full items-center justify-center gap-2 rounded-button border-2 border-foreground/20 bg-cream px-8 py-4 text-lg font-extrabold text-foreground sm:w-auto"
          >
            {t('discover.hero.cta2')}
          </a>
        </div>
        <p className="mt-6 text-sm text-foreground/60">
          {t('discover.hero.tagline')}
        </p>
      </div>
    </section>
  );
}

function WhatIs() {
  const t = useT();
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
      <h2 className="text-3xl font-extrabold sm:text-4xl">
        {t('discover.whatIs.title')}
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-foreground/75">
        {t('discover.whatIs.body')}
      </p>
    </section>
  );
}

function ForWhom() {
  const t = useT();
  return (
    <section className="border-y border-foreground/10 bg-cream py-16">
      <div className="mx-auto w-full max-w-5xl px-4">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
          {t('discover.forWhom.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/75">
          {t('discover.forWhom.body')}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <BenefitCard
            icon={Heart}
            title={t('discover.forWhom.parents.title')}
            items={[
              t('discover.forWhom.parents.1'),
              t('discover.forWhom.parents.2'),
              t('discover.forWhom.parents.3'),
              t('discover.forWhom.parents.4'),
            ]}
          />
          <BenefitCard
            icon={Sparkles}
            title={t('discover.forWhom.kids.title')}
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
  const t = useT();
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
        {t('discover.features.title')}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/75">
        {t('discover.features.body')}
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_ICONS.map((Icon, i) => (
          <div
            key={i}
            className="rounded-card border border-foreground/10 bg-cream p-6"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/40">
              <Icon className="h-6 w-6" strokeWidth={2.2} />
            </span>
            <h3 className="mt-4 text-lg font-extrabold">
              {t(`discover.features.${i + 1}.title`)}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-foreground/75">
              {t(`discover.features.${i + 1}.body`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = useT();
  return (
    <section
      id="como-funciona"
      className="border-t border-foreground/10 bg-cream py-16"
    >
      <div className="mx-auto w-full max-w-5xl px-4">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
          {t('discover.how.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/75">
          {t('discover.how.body')}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-card border border-foreground/10 bg-surface p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-foreground shadow-card">
                {n}
              </span>
              <h3 className="mt-4 text-lg font-extrabold">
                {t(`discover.how.${n}.title`)}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-foreground/75">
                {t(`discover.how.${n}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const t = useT();
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/40">
        <ShieldCheck className="h-7 w-7" strokeWidth={2.2} />
      </span>
      <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
        {t('discover.trust.title')}
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-foreground/75">
        {t('discover.trust.body')}
      </p>
    </section>
  );
}

function FinalCta() {
  const t = useT();
  return (
    <section className="border-y border-foreground/10 bg-foreground py-16 text-surface">
      <div className="mx-auto w-full max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          {t('discover.final.title')}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-surface/80">
          {t('discover.final.body')}
        </p>
        <a
          href="/"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-button bg-accent px-10 py-4 text-lg font-extrabold text-foreground shadow-card transition-transform active:translate-y-px"
        >
          {t('discover.final.cta')}
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 py-10 text-center">
      <div className="flex justify-center">
        <LocaleSwitcher />
      </div>
      <p className="mt-6 text-sm text-foreground/60">{t('discover.footer')}</p>
    </footer>
  );
}
