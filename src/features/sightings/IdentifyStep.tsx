import { AnimalSearch } from '@/features/animals/AnimalSearch';
import { useT } from '@/i18n';
import type { AnimalSearchResult } from '@/types/models';

interface IdentifyStepProps {
  query: string;
  onQueryChange: (q: string) => void;
  onAnimalSelected: (result: AnimalSearchResult) => void;
  error?: string | null;
}

export function IdentifyStep({
  query,
  onQueryChange,
  onAnimalSelected,
  error,
}: IdentifyStepProps) {
  const t = useT();
  return (
    <div>
      <h2 className="text-2xl font-extrabold">{t('newSighting.identifyTitle')}</h2>
      <p className="mt-1 text-foreground/60">
        {t('newSighting.identifySubtitle')}
      </p>
      {error && (
        <div className="mt-4 rounded-card border border-coral/40 bg-coral/10 p-3 text-sm font-semibold text-coral">
          {error}
        </div>
      )}
      <div className="mt-6">
        <AnimalSearch
          query={query}
          onQueryChange={onQueryChange}
          onSelect={onAnimalSelected}
        />
      </div>
    </div>
  );
}
