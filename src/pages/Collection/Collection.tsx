import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnimals, type AnimalDoc } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import {
  getGroupKey,
  getHabitats,
  GROUP_ORDER,
} from '@/features/animals/animalGrouping';
import type { AnimalGroup, Habitat } from '@/features/animals/curatedCatalog';
import { useT } from '@/i18n';
import { cn } from '@/lib/cn';

export function Collection() {
  const t = useT();
  const { sightings } = useSightings();
  const { animals } = useAnimals();

  const [groupFilter, setGroupFilter] = useState<AnimalGroup | null>(null);
  const [habitatFilter, setHabitatFilter] = useState<Habitat | null>(null);

  const discovered = useMemo<AnimalDoc[]>(() => {
    const ids = new Set(sightings.map((s) => s.animalId));
    return Array.from(ids)
      .map((id) => animals.get(id))
      .filter((a): a is AnimalDoc => a !== undefined);
  }, [sightings, animals]);

  const filtered = useMemo(() => {
    return discovered.filter((a) => {
      if (groupFilter && getGroupKey(a) !== groupFilter) return false;
      if (habitatFilter && !getHabitats(a).includes(habitatFilter)) return false;
      return true;
    });
  }, [discovered, groupFilter, habitatFilter]);

  const groupedByKey = useMemo(() => {
    const m = new Map<AnimalGroup | 'unclassified', AnimalDoc[]>();
    for (const a of filtered) {
      const key = getGroupKey(a) ?? 'unclassified';
      const list = m.get(key) ?? [];
      list.push(a);
      m.set(key, list);
    }
    return m;
  }, [filtered]);

  if (discovered.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold">{t('collection.title')}</h2>
        <div className="rounded-card border border-foreground/10 bg-cream p-8 text-center">
          <p className="text-foreground/70">{t('collection.empty')}</p>
        </div>
      </div>
    );
  }

  const showingFiltered = groupFilter !== null || habitatFilter !== null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold">{t('collection.title')}</h2>
        <p className="mt-1 text-foreground/60">
          {showingFiltered
            ? t('collection.countFiltered', {
                shown: filtered.length,
                total: discovered.length,
              })
            : t('collection.count', { count: discovered.length })}
        </p>
      </div>

      <FilterRow
        title={t('collection.filterGroup')}
        items={GROUP_ORDER.map((g) => ({
          key: g,
          label: t(`group.${g}`),
        }))}
        active={groupFilter}
        onSelect={(k) =>
          setGroupFilter((current) =>
            current === k ? null : (k as AnimalGroup),
          )
        }
      />
      <FilterRow
        title={t('collection.filterHabitat')}
        items={[
          { key: 'terrestre', label: t('habitat.terrestre') },
          { key: 'acuatico', label: t('habitat.acuatico') },
          { key: 'aereo', label: t('habitat.aereo') },
        ]}
        active={habitatFilter}
        onSelect={(k) =>
          setHabitatFilter((current) =>
            current === k ? null : (k as Habitat),
          )
        }
      />

      {filtered.length === 0 ? (
        <div className="rounded-card border border-foreground/10 bg-cream p-6 text-center">
          <p className="text-sm text-foreground/70">
            {t('collection.noMatch')}
          </p>
          <button
            type="button"
            onClick={() => {
              setGroupFilter(null);
              setHabitatFilter(null);
            }}
            className="mt-3 inline-flex items-center justify-center rounded-button border border-foreground/20 px-4 py-2 text-sm font-semibold"
          >
            {t('collection.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {GROUP_ORDER.concat('unclassified' as AnimalGroup).map((groupKey) => {
            const list = groupedByKey.get(groupKey as AnimalGroup);
            if (!list || list.length === 0) return null;
            const sectionLabel =
              groupKey === ('unclassified' as AnimalGroup)
                ? t('collection.unclassified')
                : t(`group.${groupKey}`);
            return (
              <section key={groupKey}>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-accent">
                  {sectionLabel}
                </h3>
                <ul className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {list.map((animal) => (
                    <li key={animal.id}>
                      <Link
                        to={`/animal/${animal.id}`}
                        className="block rounded-card border border-foreground/10 bg-cream p-2 text-center transition-shadow hover:shadow-card"
                      >
                        {animal.thumbnailUrl ? (
                          <img
                            src={animal.thumbnailUrl}
                            alt=""
                            loading="lazy"
                            className="aspect-square w-full rounded-button object-cover"
                          />
                        ) : (
                          <div className="aspect-square w-full rounded-button bg-foreground/5" />
                        )}
                        <p className="mt-2 truncate text-xs font-semibold">
                          {animal.commonName}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FilterRowProps {
  title: string;
  items: { key: string; label: string }[];
  active: string | null;
  onSelect: (key: string) => void;
}

function FilterRow({ title, items, active, onSelect }: FilterRowProps) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-foreground/50">
        {title}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={cn(
                'rounded-pill border px-3 py-1.5 text-xs font-extrabold transition-colors',
                isActive
                  ? 'border-primary bg-primary text-foreground'
                  : 'border-foreground/15 bg-surface text-foreground/70',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
