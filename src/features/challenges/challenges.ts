import type { AnimalDoc, SightingDoc } from '@/stores/firestoreStore';
import type { Locale } from '@/i18n';

/**
 * Reto semanal: cada semana proponemos a Leo encontrar una clase de animal
 * que aún no haya visto. Si la encuentra durante esa misma semana, se marca
 * como completado.
 *
 * El reto elegido se persiste en localStorage por semana (lunes como clave),
 * para que no cambie aunque el usuario refresque o cierre la app.
 */

const WEEK_PREFIX = 'safarideleo:challenge:';

const CHALLENGE_KEYS = [
  'mammals',
  'birds',
  'reptiles',
  'amphibians',
  'fish',
  'insects',
  'arachnids',
] as const;

type ChallengeKey = (typeof CHALLENGE_KEYS)[number];

function isChallengeKey(s: string): s is ChallengeKey {
  return (CHALLENGE_KEYS as readonly string[]).includes(s);
}

const CLASS_LABELS: Record<ChallengeKey, Record<Locale, string>> = {
  mammals: { es: 'Mamíferos', eu: 'Ugaztunak' },
  birds: { es: 'Aves', eu: 'Hegaztiak' },
  reptiles: { es: 'Reptiles', eu: 'Narrastiak' },
  amphibians: { es: 'Anfibios', eu: 'Anfibioak' },
  fish: { es: 'Peces', eu: 'Arrainak' },
  insects: { es: 'Insectos', eu: 'Intsektuak' },
  arachnids: { es: 'Arácnidos', eu: 'Armiarmak' },
};

function weekStartKey(d = new Date()): string {
  const day = d.getDay() || 7; // domingo=0 → 7
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(d.getDate() - (day - 1));
  return monday.toISOString().slice(0, 10);
}

function weekStartDate(): Date {
  return new Date(`${weekStartKey()}T00:00:00`);
}

export interface ChallengeStatus {
  className: string;
  completed: boolean;
}

export function getCurrentChallenge(
  sightings: SightingDoc[],
  animals: Map<string, AnimalDoc>,
  locale: Locale,
): ChallengeStatus | null {
  if (sightings.length === 0) return null;

  const weekKey = weekStartKey();
  const storageKey = `${WEEK_PREFIX}${weekKey}`;

  let chosen = readChallenge(storageKey);
  if (!chosen) {
    chosen = pickChallenge(sightings, animals, locale);
    if (chosen) writeChallenge(storageKey, chosen);
  }
  if (!chosen) return null;

  const className = CLASS_LABELS[chosen][locale];
  const completed = wasClassSeenThisWeek(sightings, animals, className);
  return { className, completed };
}

function readChallenge(storageKey: string): ChallengeKey | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return isChallengeKey(raw) ? raw : null;
  } catch {
    return null;
  }
}

function writeChallenge(storageKey: string, value: ChallengeKey) {
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    /* no es crítico */
  }
}

/**
 * Elige una clase de reto que Leo no haya visto NUNCA. Si ya las vio todas,
 * elige cualquiera que no haya visto esta semana. Si hasta esa cabe, devuelve
 * null (no proponemos reto en esa semana).
 */
function pickChallenge(
  sightings: SightingDoc[],
  animals: Map<string, AnimalDoc>,
  locale: Locale,
): ChallengeKey | null {
  const seenEver = new Set<string>();
  for (const s of sightings) {
    const name = animals.get(s.animalId)?.taxonomicClass?.name;
    if (name) seenEver.add(name);
  }
  const neverSeen = CHALLENGE_KEYS.find(
    (k) => !seenEver.has(CLASS_LABELS[k][locale]),
  );
  if (neverSeen) return neverSeen;

  // Todas vistas alguna vez: pick una no vista esta semana.
  const seenThisWeek = collectClassesSeenThisWeek(sightings, animals);
  return (
    CHALLENGE_KEYS.find((k) => !seenThisWeek.has(CLASS_LABELS[k][locale])) ??
    null
  );
}

function collectClassesSeenThisWeek(
  sightings: SightingDoc[],
  animals: Map<string, AnimalDoc>,
): Set<string> {
  const start = weekStartDate();
  const out = new Set<string>();
  for (const s of sightings) {
    const d = s.createdAt?.toDate?.();
    if (!d || d < start) continue;
    const name = animals.get(s.animalId)?.taxonomicClass?.name;
    if (name) out.add(name);
  }
  return out;
}

function wasClassSeenThisWeek(
  sightings: SightingDoc[],
  animals: Map<string, AnimalDoc>,
  className: string,
): boolean {
  return collectClassesSeenThisWeek(sightings, animals).has(className);
}
