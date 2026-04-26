import { useEffect, useState } from 'react';
import { Check, MapPin } from 'lucide-react';
import type { WikiSearchResult } from '@/lib/wikipedia';
import type { SightingLocation } from '@/types/models';

interface ConfirmStepProps {
  photo: File;
  animal: WikiSearchResult;
  location: SightingLocation | null;
  notes: string;
  onNotesChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
  error: string | null;
}

export function ConfirmStep({
  photo,
  animal,
  location,
  notes,
  onNotesChange,
  onSave,
  onBack,
  error,
}: ConfirmStepProps) {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">¡Casi! ¿Algo más?</h2>
        <p className="mt-1 text-foreground/60">
          Revisa los datos y guarda tu avistamiento.
        </p>
      </div>

      {photoUrl && (
        <img
          src={photoUrl}
          alt=""
          className="aspect-square w-full rounded-card object-cover shadow-card"
        />
      )}

      <div className="rounded-card border border-foreground/10 bg-cream p-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-foreground/60">
          Animal
        </p>
        <p className="mt-1 text-lg font-extrabold">{animal.title}</p>
      </div>

      <div className="rounded-card border border-foreground/10 bg-cream p-4">
        <p className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wide text-foreground/60">
          <MapPin className="h-3 w-3" /> Lugar
        </p>
        <p className="mt-1 text-base">
          {location?.placeName
            ? location.placeName
            : location
              ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}`
              : 'Sin ubicación'}
        </p>
      </div>

      <label className="block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-foreground/60">
          Tu nota (opcional)
        </span>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Lo que quieras contar de este animal..."
          rows={3}
          className="mt-2 w-full rounded-card border border-foreground/15 bg-cream p-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {error && <p className="text-sm font-semibold text-coral">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-button border border-foreground/20 py-3 font-semibold"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex flex-[2] items-center justify-center gap-2 rounded-button bg-accent py-3 font-extrabold text-foreground shadow-card"
        >
          <Check className="h-5 w-5" strokeWidth={2.5} />
          Guardar
        </button>
      </div>
    </div>
  );
}
