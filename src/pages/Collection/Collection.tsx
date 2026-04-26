import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAnimals, type AnimalDoc } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { useT } from '@/i18n';

export function Collection() {
  const t = useT();
  const { sightings } = useSightings();
  const { animals } = useAnimals();

  const discovered = useMemo<AnimalDoc[]>(() => {
    const ids = new Set(sightings.map((s) => s.animalId));
    return Array.from(ids)
      .map((id) => animals.get(id))
      .filter((a): a is AnimalDoc => a !== undefined);
  }, [sightings, animals]);

  const byClass = useMemo(() => {
    const m = new Map<string, AnimalDoc[]>();
    for (const a of discovered) {
      const className = a.taxonomicClass?.name ?? t('collection.unclassified');
      const list = m.get(className) ?? [];
      list.push(a);
      m.set(className, list);
    }
    return m;
  }, [discovered, t]);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">{t('collection.title')}</h2>
        <p className="mt-1 text-foreground/60">
          {t('collection.count', { count: discovered.length })}
        </p>
      </div>

      {Array.from(byClass.entries()).map(([className, list]) => (
        <section key={className}>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-accent">
            {className}
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
      ))}
    </div>
  );
}
