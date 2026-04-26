import { AnimalSearch } from '@/features/animals/AnimalSearch';
import type { WikiSearchResult } from '@/lib/wikipedia';

interface IdentifyStepProps {
  onAnimalSelected: (result: WikiSearchResult) => void;
}

export function IdentifyStep({ onAnimalSelected }: IdentifyStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold">¿Qué es?</h2>
      <p className="mt-1 text-foreground/60">
        Escribe el nombre y elige el correcto.
      </p>
      <div className="mt-6">
        <AnimalSearch onSelect={onAnimalSelected} />
      </div>
    </div>
  );
}
