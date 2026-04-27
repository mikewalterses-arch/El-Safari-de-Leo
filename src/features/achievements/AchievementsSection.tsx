import { useMemo } from 'react';
import { useT } from '@/i18n';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import {
  evaluateAchievements,
  type AchievementStatus,
} from './achievements';
import { cn } from '@/lib/cn';

const SECTIONS_ORDER = ['general', 'collection', 'explorer', 'classes'] as const;
const CLASS_KEYS_ORDER = [
  'mammals',
  'birds',
  'reptiles',
  'amphibians',
  'fish',
  'insects',
  'arachnids',
  'molluscs',
];

export function AchievementsSection() {
  const t = useT();
  const { sightings } = useSightings();
  const { animals } = useAnimals();

  const items = useMemo(
    () => evaluateAchievements(sightings, animals),
    [sightings, animals],
  );

  const grouped = useMemo(() => {
    const out: Record<string, AchievementStatus[]> = {
      general: [],
      collection: [],
      explorer: [],
      classes: [],
    };
    for (const item of items) {
      out[item.def.section]!.push(item);
    }
    return out;
  }, [items]);

  const classByKey = useMemo(() => {
    const out = new Map<string, AchievementStatus[]>();
    for (const item of grouped.classes ?? []) {
      const key = item.def.classKey ?? 'unknown';
      const list = out.get(key) ?? [];
      list.push(item);
      out.set(key, list);
    }
    return out;
  }, [grouped]);

  const unlockedCount = items.filter((i) => i.unlocked).length;

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-extrabold">{t('profile.achievementsTitle')}</h3>
        <p className="text-sm text-foreground/60">
          {unlockedCount} / {items.length}
        </p>
      </div>

      <div className="mt-4 space-y-5">
        {SECTIONS_ORDER.map((section) => {
          if (section === 'classes') {
            return (
              <div key={section}>
                <SectionHeader label={t(`ach.section.${section}`)} />
                <div className="mt-3 space-y-4">
                  {CLASS_KEYS_ORDER.map((classKey) => {
                    const list = classByKey.get(classKey);
                    if (!list || list.length === 0) return null;
                    const sorted = [...list].sort(
                      (a, b) => Number(b.unlocked) - Number(a.unlocked),
                    );
                    return (
                      <div key={classKey}>
                        <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-foreground/50">
                          {t(`ach.class.${classKey}`)}
                        </p>
                        <Grid items={sorted} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          const list = grouped[section];
          if (!list || list.length === 0) return null;
          const sorted = [...list].sort(
            (a, b) => Number(b.unlocked) - Number(a.unlocked),
          );
          return (
            <div key={section}>
              <SectionHeader label={t(`ach.section.${section}`)} />
              <div className="mt-3">
                <Grid items={sorted} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h4 className="text-sm font-extrabold uppercase tracking-wider text-accent">
      {label}
    </h4>
  );
}

function Grid({ items }: { items: AchievementStatus[] }) {
  const t = useT();
  return (
    <ul className="grid grid-cols-2 gap-3">
      {items.map(({ def, unlocked }) => {
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
                'mx-auto h-7 w-7',
                unlocked ? 'text-foreground' : 'text-foreground/40',
              )}
              strokeWidth={2}
            />
            <p className="mt-2 text-sm font-extrabold leading-tight">
              {t(def.titleKey)}
            </p>
            <p className="mt-1 text-xs leading-tight text-foreground/60">
              {t(def.descKey)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
