import { AnimalSearch } from '@/features/animals/AnimalSearch';
import { useT } from '@/i18n';
import type { AnimalSearchResult } from '@/types/models';

interface IdentifyStepProps {
  onAnimalSelected: (result: AnimalSearchResult) => void;
}

export function IdentifyStep({ onAnimalSelected }: IdentifyStepProps) {
  const t = useT();
  return (
    <div>
      <h2 className="text-2xl font-extrabold">{t('newSighting.identifyTitle')}</h2>
      <p className="mt-1 text-foreground/60">
        {t('newSighting.identifySubtitle')}
      </p>
      <div className="mt-6">
        <AnimalSearch onSelect={onAnimalSelected} />
      </div>
    </div>
  );
}
