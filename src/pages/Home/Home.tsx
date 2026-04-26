import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { fetchNearbySpecies, type NearbySpecies } from '@/lib/inaturalist';
import { useLocaleStore, useT } from '@/i18n';

const CACHE_KEY = 'safarideleo:nearbyCache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const MOVED_THRESHOLD_DEG = 0.05; // ≈5.5 km, refrescamos si se mueve más

interface NearbyCache {
  lat: number;
  lng: number;
  locale: string;
  timestamp: number;
  species: NearbySpecies[];
}

function readCache(): NearbyCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NearbyCache;
  } catch {
    return null;
  }
}

function writeCache(c: NearbyCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* localStorage lleno o deshabilitado: no es crítico */
  }
}

function isFreshFor(cache: NearbyCache, lat: number, lng: number, locale: string) {
  if (cache.locale !== locale) return false;
  if (Date.now() - cache.timestamp > CACHE_TTL_MS) return false;
  if (Math.abs(lat - cache.lat) > MOVED_THRESHOLD_DEG) return false;
  if (Math.abs(lng - cache.lng) > MOVED_THRESHOLD_DEG) return false;
  return true;
}

export function Home() {
  return (
    <div className="space-y-6">
      <Greeting />
      <NearbyAnimals />
    </div>
  );
}

function Greeting() {
  const t = useT();
  return (
    <div>
      <h2 className="text-2xl font-extrabold">{t('home.greeting')}</h2>
      <p className="mt-1 text-foreground/60">{t('home.subgreeting')}</p>
    </div>
  );
}

type NearbyStatus = 'idle' | 'loading' | 'denied' | 'error' | 'ok';

function NearbyAnimals() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
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
        const { latitude: lat, longitude: lng } = pos.coords;

        const cache = readCache();
        if (cache && isFreshFor(cache, lat, lng, locale)) {
          if (cancelled) return;
          setSpecies(cache.species);
          setStatus('ok');
          return;
        }

        fetchNearbySpecies(lat, lng, { limit: 12, lang: locale })
          .then((s) => {
            if (cancelled) return;
            setSpecies(s);
            setStatus('ok');
            writeCache({ lat, lng, locale, timestamp: Date.now(), species: s });
          })
          .catch(() => !cancelled && setStatus('error'));
      },
      () => !cancelled && setStatus('denied'),
      { timeout: 10_000 },
    );
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <h3 className="flex items-center gap-2 text-lg font-extrabold">
        <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.5} />
        {t('home.nearbyTitle')}
      </h3>

      {status === 'loading' && (
        <p className="mt-3 text-sm text-foreground/60">{t('home.nearbyLoading')}</p>
      )}
      {status === 'denied' && (
        <p className="mt-3 text-sm text-foreground/60">{t('home.nearbyDenied')}</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm text-foreground/60">{t('home.nearbyError')}</p>
      )}
      {status === 'ok' && species.length === 0 && (
        <p className="mt-3 text-sm text-foreground/60">{t('home.nearbyEmpty')}</p>
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
