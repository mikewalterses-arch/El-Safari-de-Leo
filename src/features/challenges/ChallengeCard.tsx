import { useMemo } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { useLocaleStore, useT } from '@/i18n';
import { cn } from '@/lib/cn';
import { getCurrentChallenge } from './challenges';

export function ChallengeCard() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const { sightings } = useSightings();
  const { animals } = useAnimals();

  const challenge = useMemo(
    () => getCurrentChallenge(sightings, animals, locale),
    [sightings, animals, locale],
  );

  if (!challenge) return null;

  const { className, completed } = challenge;

  return (
    <section
      className={cn(
        'rounded-card border p-4 transition-colors',
        completed
          ? 'border-success/40 bg-success/15'
          : 'border-foreground/10 bg-cream',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-soft',
            completed ? 'bg-success' : 'bg-highlight',
          )}
        >
          {completed ? (
            <CheckCircle2 className="h-6 w-6 text-foreground" strokeWidth={2.5} />
          ) : (
            <Award className="h-6 w-6 text-foreground" strokeWidth={2.5} />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-foreground/60">
            {t('challenge.weekly')}
          </p>
          <p className="mt-0.5 text-base font-semibold">
            {completed
              ? t('challenge.completed', { className })
              : t('challenge.prompt', { className })}
          </p>
        </div>
      </div>
    </section>
  );
}
