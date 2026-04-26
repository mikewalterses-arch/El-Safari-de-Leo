import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { fetchNearbySpecies, type NearbySpecies } from '@/lib/inaturalist';

export function Home() {
  return (
    <div className="space-y-6">
      <Greeting />
      <NearbyAnimals />
    </div>
  );
}

function Greeting() {
  return (
    <div>
      <h2 className="text-2xl font-extrabold">¡Hola, Leo!</h2>
      <p className="mt-1 text-foreground/60">¿Qué animales has visto hoy?</p>
    </div>
  );
}

type NearbyStatus = 'idle' | 'loading' | 'denied' | 'error' | 'ok';

// TODO(fase-3-final): cache localStorage de Cerca de mí por (lat, lng) redondeados,
// para no llamar a iNaturalist cada vez que Leo entra en Home.
function NearbyAnimals() {
  const [species, setSpecies] = useState<NearbySpecies[]>([]);
  const [status, setStatus] = useState<NearbyStatus>('idle');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchNearbySpecies(pos.coords.latitude, pos.coords.longitude, {
          limit: 12,
        })
          .then((s) => {
            if (cancelled) return;
            setSpecies(s);
            setStatus('ok');
          })
          .catch(() => !cancelled && setStatus('error'));
      },
      () => !cancelled && setStatus('denied'),
      { timeout: 10_000 },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <h3 className="flex items-center gap-2 text-lg font-extrabold">
        <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.5} />
        Animales cerca de ti
      </h3>

      {status === 'loading' && (
        <p className="mt-3 text-sm text-foreground/60">
          Buscando qué hay por aquí...
        </p>
      )}
      {status === 'denied' && (
        <p className="mt-3 text-sm text-foreground/60">
          Activa la ubicación para ver qué animales hay cerca.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm text-foreground/60">
          No pude consultar ahora. Inténtalo más tarde.
        </p>
      )}
      {status === 'ok' && species.length === 0 && (
        <p className="mt-3 text-sm text-foreground/60">
          No hay observaciones recientes registradas en esta zona.
        </p>
      )}
      {status === 'ok' && species.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {species.map((s) => (
            <li
              key={s.taxonId}
              className="flex flex-col items-center rounded-button border border-foreground/10 bg-surface p-2 text-center"
            >
              {s.thumbnailUrl ? (
                <img
                  src={s.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 rounded-button object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-button bg-foreground/5" />
              )}
              <p className="mt-2 w-full truncate text-xs font-semibold">
                {s.commonName ?? s.scientificName}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
