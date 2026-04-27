import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Compass,
  Map as MapIcon,
  Plus,
  Search,
  Sparkles,
  Trophy,
  Users,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useT } from '@/i18n';

type SceneKey =
  | 'add'
  | 'search'
  | 'nearby'
  | 'map'
  | 'detail'
  | 'sound'
  | 'trophy'
  | 'kids';

interface Section {
  icon: LucideIcon;
  scene: SceneKey;
  titleKey: string;
  bodyKey: string;
}

const SECTIONS: Section[] = [
  { icon: Camera, scene: 'add', titleKey: 'help.add.title', bodyKey: 'help.add.body' },
  { icon: Search, scene: 'search', titleKey: 'help.search.title', bodyKey: 'help.search.body' },
  { icon: Compass, scene: 'nearby', titleKey: 'help.nearby.title', bodyKey: 'help.nearby.body' },
  { icon: MapIcon, scene: 'map', titleKey: 'help.map.title', bodyKey: 'help.map.body' },
  { icon: Sparkles, scene: 'detail', titleKey: 'help.detail.title', bodyKey: 'help.detail.body' },
  { icon: Volume2, scene: 'sound', titleKey: 'help.sound.title', bodyKey: 'help.sound.body' },
  { icon: Trophy, scene: 'trophy', titleKey: 'help.trophy.title', bodyKey: 'help.trophy.body' },
  { icon: Users, scene: 'kids', titleKey: 'help.kids.title', bodyKey: 'help.kids.body' },
];

export function Help() {
  const t = useT();
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('help.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold">{t('help.title')}</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <p className="mb-6 text-base leading-relaxed text-foreground/75">
          {t('help.intro')}
        </p>

        <div className="space-y-4">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-card border border-foreground/10 bg-cream"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 text-base font-extrabold">
                    {t(section.titleKey)}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 flex-shrink-0 text-foreground/50 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                    strokeWidth={2.5}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-foreground/10 px-4 py-5">
                    <div className="mb-4 flex justify-center">
                      <Scene which={section.scene} />
                    </div>
                    <p className="text-base leading-relaxed text-foreground/85">
                      {t(section.bodyKey)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-foreground/50">
          {t('help.footer')}
        </p>
      </main>
    </div>
  );
}

function PhoneMock({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-44 rounded-[28px] border-4 border-foreground/20 bg-foreground/5 p-1.5 shadow-card">
      <div className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground/30" />
      <div className="aspect-[9/16] overflow-hidden rounded-[20px] bg-surface">
        {children}
      </div>
    </div>
  );
}

function Scene({ which }: { which: SceneKey }) {
  if (which === 'add') {
    return (
      <PhoneMock>
        <div className="relative h-full w-full bg-gradient-to-b from-cream to-surface p-3">
          <div className="h-2 w-12 rounded-full bg-foreground/20" />
          <div className="mt-3 aspect-square w-full rounded-card border-2 border-dashed border-foreground/30 bg-foreground/5" />
          <div className="mt-3 h-2 w-3/4 rounded-full bg-foreground/15" />
          <div className="mt-1 h-2 w-1/2 rounded-full bg-foreground/10" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-accent shadow-card">
              <Plus className="h-7 w-7 text-foreground" strokeWidth={3} />
            </div>
          </div>
        </div>
      </PhoneMock>
    );
  }
  if (which === 'search') {
    return (
      <PhoneMock>
        <div className="h-full w-full bg-surface p-3">
          <div className="flex items-center gap-2 rounded-full bg-foreground/10 px-2 py-1.5">
            <Search className="h-3 w-3" strokeWidth={2.5} />
            <div className="h-1.5 w-12 rounded-full bg-foreground/20" />
          </div>
          <div className="mt-3 space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-2 rounded-card p-2',
                  i === 0 && 'bg-primary/20',
                )}
              >
                <div className="h-7 w-7 rounded-full bg-foreground/15" />
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 w-2/3 rounded-full bg-foreground/30" />
                  <div className="h-1 w-1/2 rounded-full bg-foreground/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PhoneMock>
    );
  }
  if (which === 'nearby') {
    return (
      <PhoneMock>
        <div className="relative h-full w-full bg-success/20 p-3">
          <div className="h-2 w-1/2 rounded-full bg-foreground/25" />
          <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-card bg-success/30">
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/30" />
            <div className="absolute left-[20%] top-[30%] h-2 w-2 rounded-full bg-accent" />
            <div className="absolute left-[70%] top-[60%] h-2 w-2 rounded-full bg-accent" />
            <div className="absolute left-[40%] top-[75%] h-2 w-2 rounded-full bg-accent" />
          </div>
          <div className="mt-3 flex gap-2">
            <div className="h-9 w-9 rounded-card bg-cream" />
            <div className="h-9 w-9 rounded-card bg-cream" />
            <div className="h-9 w-9 rounded-card bg-cream" />
          </div>
        </div>
      </PhoneMock>
    );
  }
  if (which === 'map') {
    return (
      <PhoneMock>
        <div className="relative h-full w-full bg-success/30">
          <div className="absolute left-[15%] top-[20%] flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-card">
            <div className="h-2 w-2 rounded-full bg-surface" />
          </div>
          <div className="absolute left-[60%] top-[35%] flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-card">
            <div className="h-2 w-2 rounded-full bg-surface" />
          </div>
          <div className="absolute left-[30%] top-[60%] flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-card">
            <div className="h-2 w-2 rounded-full bg-surface" />
          </div>
          <div className="absolute left-[75%] top-[75%] flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-card">
            <div className="h-2 w-2 rounded-full bg-surface" />
          </div>
        </div>
      </PhoneMock>
    );
  }
  if (which === 'detail') {
    return (
      <PhoneMock>
        <div className="h-full w-full bg-surface">
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/30 to-accent/30" />
          <div className="space-y-2 p-3">
            <div className="h-2.5 w-2/3 rounded-full bg-foreground/30" />
            <div className="h-1.5 w-1/2 rounded-full bg-foreground/15" />
            <div className="mt-2 space-y-1">
              <div className="h-1 w-full rounded-full bg-foreground/10" />
              <div className="h-1 w-full rounded-full bg-foreground/10" />
              <div className="h-1 w-3/4 rounded-full bg-foreground/10" />
            </div>
          </div>
        </div>
      </PhoneMock>
    );
  }
  if (which === 'sound') {
    return (
      <PhoneMock>
        <div className="flex h-full w-full flex-col items-center justify-center bg-surface p-3">
          <div className="relative">
            <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-accent/40" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow-card">
              <Volume2 className="h-8 w-8 text-foreground" strokeWidth={2.5} />
            </span>
          </div>
          <div className="mt-4 h-2 w-2/3 rounded-full bg-foreground/20" />
          <div className="mt-1 h-1.5 w-1/2 rounded-full bg-foreground/10" />
        </div>
      </PhoneMock>
    );
  }
  if (which === 'trophy') {
    return (
      <PhoneMock>
        <div className="h-full w-full bg-surface p-3">
          <div className="h-2 w-1/2 rounded-full bg-foreground/25" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-card',
                  i < 4
                    ? 'bg-highlight/60 text-foreground'
                    : 'bg-foreground/5 text-foreground/30',
                )}
              >
                <Trophy className="h-4 w-4" strokeWidth={2.5} />
              </div>
            ))}
          </div>
        </div>
      </PhoneMock>
    );
  }
  // kids
  return (
    <PhoneMock>
      <div className="h-full w-full bg-surface p-3">
        <div className="h-2 w-1/2 rounded-full bg-foreground/25" />
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 rounded-card border-2 border-primary bg-primary/15 p-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <span className="text-xs font-extrabold">L</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 w-1/2 rounded-full bg-foreground/35" />
              <div className="h-1 w-1/3 rounded-full bg-foreground/15" />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-card bg-foreground/5 p-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success">
              <span className="text-xs font-extrabold">M</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 w-1/2 rounded-full bg-foreground/25" />
              <div className="h-1 w-1/3 rounded-full bg-foreground/10" />
            </div>
          </div>
        </div>
      </div>
    </PhoneMock>
  );
}
