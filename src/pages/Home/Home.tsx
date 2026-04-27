import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Flame, Sparkles } from 'lucide-react';
import { fetchNearbySpecies, type NearbySpecies } from '@/lib/inaturalist';
import { haversineKm } from '@/lib/geo';
import { useSightings } from '@/features/sightings/useSightings';
import {
  computeStreak,
  computeWeeklyStats,
} from '@/features/sightings/stats';
import { useLocaleStore, useT } from '@/i18n';

const CACHE_KEY = 'safarideleo:nearbyCache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MOVED_THRESHOLD_DEG = 0.05;

const NEW_PLACE_THRESHOLD_KM = 5;

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
      <NewPlaceBanner />
      <StatsCard />
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

/**
 * Modo aventura: cuando Leo está a más de 5 km de cualquier avistamiento previo,
 * aparece un banner animado celebrando que está en sitio nuevo.
 */
function NewPlaceBanner() {
  const t = useT();
  const { sightings } = useSightings();
  const [isNewPlace, setIsNewPlace] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    const valid = sightings.filter(
      (s) => s.location && (s.location.lat !== 0 || s.location.lng !== 0),
    );
    if (valid.length === 0) return;

    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (cancelled) return;
        const { latitude, longitude } = p.coords;
        const minDist = Math.min(
          ...valid.map((s) =>
            haversineKm(latitude, longitude, s.location.lat, s.location.lng),
          ),
        );
        setIsNewPlace(minDist > NEW_PLACE_THRESHOLD_KM);
      },
      () => {
        /* Permiso denegado: ocultamos banner */
      },
      { timeout: 10_000, maximumAge: 60_000 },
    );

    return () => {
      cancelled = true;
    };
  }, [sightings]);

  if (!isNewPlace) return null;

  return (
    <motion.section
      initial={{ scale: 0.96, opacity: 0, y: -8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="rounded-card border-2 border-primary bg-gradient-to-br from-primary/20 to-accent/15 p-4"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-foreground shadow-card">
          <Compass className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-extrabold">{t('home.newPlace.title')}</h3>
          <p className="mt-0.5 text-sm text-foreground/70">
            {t('home.newPlace.subtitle')}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/**
 * Tarjeta de hábito: días seguidos + resumen semanal. Solo aparece si hay
 * algo interesante que decir (racha ≥ 2 o avistamientos en últimos 7 días).
 */
function StatsCard() {
  const t = useT();
  const { sightings } = useSightings();

  const streak = useMemo(() => computeStreak(sightings), [sightings]);
  const week = useMemo(() => computeWeeklyStats(sightings), [sightings]);

  if (streak < 2 && week.sightingsCount === 0) return null;

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      {streak >= 2 && (
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 shrink-0 text-coral" strokeWidth={2.5} />
          <p className="text-base font-semibold">
            {t('home.streak', { count: streak })}
          </p>
        </div>
      )}
      {week.sightingsCount > 0 && (
        <p className={streak >= 2 ? 'mt-2 text-sm text-foreground/70' : 'text-sm text-foreground/70'}>
          {t('home.weekSummary', {
            sightings: week.sightingsCount,
            newAnimals: week.newAnimalsCount,
          })}
          {week.newAnimalsCount > 0 && (
            <>
              {' · '}
              <span className="font-semibold text-success">
                {t('home.weekNewAnimals', { count: week.newAnimalsCount })}
              </span>
            </>
          )}
        </p>
      )}
    </section>
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
