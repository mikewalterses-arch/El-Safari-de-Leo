import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { searchAnimalTaxa } from '@/lib/inaturalist';
import { useLocaleStore, useT } from '@/i18n';
import type { AnimalSearchResult } from '@/types/models';

interface AnimalSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSelect: (result: AnimalSearchResult) => void;
}

/**
 * Búsqueda de animales con iNaturalist. La query se controla desde fuera
 * (NewSightingFlow) para que el texto del input persista cuando se vuelve
 * a esta pantalla tras un fallo en el caching.
 */
export function AnimalSearch({ query, onQueryChange, onSelect }: AnimalSearchProps) {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const [results, setResults] = useState<AnimalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const handle = setTimeout(() => {
      searchAnimalTaxa(query, { lang: locale })
        .then((r) => {
          if (!cancelled) setResults(r);
        })
        .catch((err) => {
          console.error('searchAnimalTaxa failed', err);
          if (!cancelled) setError(t('newSighting.searchError'));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, locale, t]);

  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-base font-semibold">
          {t('newSighting.searchLabel')}
        </span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            autoFocus
            placeholder={t('newSighting.searchPlaceholder')}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full rounded-button border border-foreground/15 bg-cream py-3 pl-10 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </label>

      {loading && (
        <p className="mt-4 text-sm text-foreground/60">
          {t('newSighting.searching')}
        </p>
      )}
      {error && <p className="mt-4 text-sm font-semibold text-coral">{error}</p>}

      {!loading && !error && results.length === 0 && query.trim().length >= 2 && (
        <p className="mt-4 text-sm text-foreground/60">
          {t('newSighting.noResults')}
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((r) => (
            <li key={`${r.source}-${r.sourceId}`}>
              <button
                type="button"
                onClick={() => onSelect(r)}
                className="flex w-full items-center gap-3 rounded-card border border-foreground/10 bg-cream p-3 text-left shadow-soft transition-colors hover:border-primary"
              >
                {r.thumbnailUrl ? (
                  <img
                    src={r.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-button object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-button bg-foreground/5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold">{r.title}</p>
                  {r.scientificName && r.scientificName !== r.title && (
                    <p className="truncate text-sm italic text-foreground/60">
                      {r.scientificName}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
