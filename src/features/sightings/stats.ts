import type { SightingDoc } from '@/stores/firestoreStore';

/**
 * Helpers para stats derivadas de la lista de avistamientos. Sin estado en
 * Firestore — todo se computa on-the-fly desde sightings.
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function getValidDates(sightings: SightingDoc[]): Date[] {
  return sightings
    .map((s) => s.createdAt?.toDate?.())
    .filter((d): d is Date => d instanceof Date);
}

/**
 * Días consecutivos con al menos un avistamiento, terminando hoy o ayer.
 * Si hoy no hay y ayer tampoco, devuelve 0.
 */
export function computeStreak(sightings: SightingDoc[]): number {
  const dates = getValidDates(sightings);
  if (dates.length === 0) return 0;

  const dayKeys = new Set(dates.map(dayKey));
  const cursor = new Date();

  // Permitimos un día de gracia: si hoy aún no se ha avistado nada,
  // empezamos a contar desde ayer (no rompe la racha).
  if (!dayKeys.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dayKeys.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (dayKeys.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface WeeklyStats {
  /** Avistamientos en los últimos 7 días */
  sightingsCount: number;
  /** Animales descubiertos por primera vez en los últimos 7 días */
  newAnimalsCount: number;
}

export function computeWeeklyStats(sightings: SightingDoc[]): WeeklyStats {
  const cutoff = Date.now() - ONE_WEEK_MS;

  const recent: SightingDoc[] = [];
  const olderAnimalIds = new Set<string>();

  for (const s of sightings) {
    const d = s.createdAt?.toDate?.();
    if (!d) continue;
    if (d.getTime() > cutoff) {
      recent.push(s);
    } else {
      olderAnimalIds.add(s.animalId);
    }
  }

  const recentAnimalIds = new Set(recent.map((s) => s.animalId));
  let newAnimalsCount = 0;
  for (const id of recentAnimalIds) {
    if (!olderAnimalIds.has(id)) newAnimalsCount++;
  }

  return {
    sightingsCount: recent.length,
    newAnimalsCount,
  };
}
