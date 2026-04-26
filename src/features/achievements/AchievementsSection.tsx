import { useMemo } from 'react';
import { useT } from '@/i18n';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { evaluateAchievements } from './achievements';
import { cn } from '@/lib/cn';

export function AchievementsSection() {
  const t = useT();
  const { sightings } = useSightings();
  const { animals } = useAnimals();

  const items = useMemo(
    () => evaluateAchievements(sightings, animals),
    [sightings, animals],
  );

  const unlockedCount = items.filter((i) => i.unlocked).length;
  const sorted = [...items].sort(
    (a, b) => Number(b.unlocked) - Number(a.unlocked),
  );

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <h3 className="text-lg font-extrabold">{t('profile.achievementsTitle')}</h3>
      <p className="mt-1 text-sm text-foreground/60">
        {unlockedCount} / {items.length}
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-3">
        {sorted.map(({ def, unlocked }) => {
          const Icon = def.icon;
          return (
            <li
              key={def.id}
              className={cn(
                'rounded-card border p-3 text-center transition-opacity',
                unlocked
                  ? 'border-success/40 bg-success/15'
                  : 'border-foreground/10 bg-foreground/5 opacity-50',
              )}
            >
              <Icon
                className={cn(
                  'mx-auto h-8 w-8',
                  unlocked ? 'text-foreground' : 'text-foreground/40',
                )}
                strokeWidth={2}
              />
              <p className="mt-2 text-sm font-extrabold">{t(def.titleKey)}</p>
              <p className="mt-1 text-xs text-foreground/60">{t(def.descKey)}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
