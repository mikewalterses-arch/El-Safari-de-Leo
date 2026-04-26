import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { searchAnimals, type WikiSearchResult } from '@/lib/wikipedia';

interface AnimalSearchProps {
  onSelect: (result: WikiSearchResult) => void;
}

export function AnimalSearch({ onSelect }: AnimalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WikiSearchResult[]>([]);
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
    const t = setTimeout(() => {
      searchAnimals(query)
        .then((r) => {
          if (!cancelled) setResults(r);
        })
        .catch(() => {
          if (!cancelled) setError('No se pudo buscar. ¿Hay internet?');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-base font-semibold">¿Qué animal viste?</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            autoFocus
            placeholder="Escribe el nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-button border border-foreground/15 bg-cream py-3 pl-10 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </label>

      {loading && <p className="mt-4 text-sm text-foreground/60">Buscando...</p>}
      {error && <p className="mt-4 text-sm font-semibold text-coral">{error}</p>}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((r) => (
            <li key={r.pageId}>
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
                  {r.description && (
                    <p className="truncate text-sm text-foreground/60">
                      {r.description}
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
