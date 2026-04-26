import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { useLocaleStore, useT } from '@/i18n';

export function Diary() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const { sightings, loading } = useSightings();
  const { animals } = useAnimals();

  if (loading) {
    return <p className="text-foreground/60">{t('common.loading')}</p>;
  }

  if (sightings.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold">{t('diary.title')}</h2>
        <div className="rounded-card border border-foreground/10 bg-cream p-8 text-center">
          <p className="text-foreground/70">{t('diary.empty')}</p>
        </div>
      </div>
    );
  }

  const dateLocale = locale === 'eu' ? 'eu-ES' : 'es-ES';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">{t('diary.title')}</h2>
        <p className="mt-1 text-foreground/60">
          {t('diary.count', { count: sightings.length })}
        </p>
      </div>

      <ul className="space-y-3">
        {sightings.map((s) => {
          const animal = animals.get(s.animalId);
          const date = s.createdAt?.toDate();
          return (
            <li key={s.id}>
              <Link
                to={`/animal/${s.animalId}`}
                className="flex gap-3 rounded-card border border-foreground/10 bg-cream p-3 shadow-soft transition-colors hover:border-primary"
              >
                {s.thumbnailUrl ? (
                  <img
                    src={s.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="h-24 w-24 shrink-0 rounded-button object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 shrink-0 rounded-button bg-foreground/5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold">
                    {animal?.commonName ?? t('newSighting.animal')}
                  </p>
                  {s.location?.placeName && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-foreground/60">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{s.location.placeName}</span>
                    </p>
                  )}
                  {date && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/60">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {date.toLocaleDateString(dateLocale, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  {s.notes && (
                    <p className="mt-2 line-clamp-2 text-sm italic text-foreground/80">
                      "{s.notes}"
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
