import {
  Award,
  Calendar,
  Compass,
  Crown,
  Sparkles,
  Star,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { AnimalDoc, SightingDoc } from '@/stores/firestoreStore';

/**
 * Catálogo de logros con secciones. Hay logros generales (cuenta total),
 * de colección (variedad), de explorador (lugares y días), y por clase
 * taxonómica (primer X / experto en X). Todos derivados de sightings
 * + animals — sin estado en Firestore.
 */

export type AchievementSection = 'general' | 'collection' | 'explorer' | 'classes';

export interface AchievementDef {
  id: string;
  section: AchievementSection;
  /** Solo para sección 'classes': la subsección (mamíferos, aves...). */
  classKey?: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  unlocked: (s: SightingDoc[], animals: Map<string, AnimalDoc>) => boolean;
}

/* Helpers ---------------------------------------------------------------- */

function uniqueAnimalCount(sightings: SightingDoc[]): number {
  return new Set(sightings.map((s) => s.animalId)).size;
}

function uniqueIconicTaxa(
  sightings: SightingDoc[],
  animals: Map<string, AnimalDoc>,
): Set<string> {
  const set = new Set<string>();
  for (const s of sightings) {
    const t = animals.get(s.animalId)?.iconicTaxon;
    if (t) set.add(t);
  }
  return set;
}

function uniqueAnimalCountForClass(
  sightings: SightingDoc[],
  animals: Map<string, AnimalDoc>,
  iconicTaxon: string,
): number {
  const set = new Set<string>();
  for (const s of sightings) {
    if (animals.get(s.animalId)?.iconicTaxon === iconicTaxon) {
      set.add(s.animalId);
    }
  }
  return set.size;
}

function uniquePlaces(sightings: SightingDoc[]): number {
  const set = new Set<string>();
  for (const s of sightings) {
    if (s.location?.placeName) set.add(s.location.placeName);
  }
  return set.size;
}

function uniqueDays(sightings: SightingDoc[]): number {
  const set = new Set<string>();
  for (const s of sightings) {
    const d = s.createdAt?.toDate?.();
    if (!d) continue;
    set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  return set.size;
}

/* Catálogo --------------------------------------------------------------- */

const GENERAL: AchievementDef[] = [
  {
    id: 'first_animal',
    section: 'general',
    titleKey: 'ach.firstAnimal.title',
    descKey: 'ach.firstAnimal.desc',
    icon: Star,
    unlocked: (s) => s.length >= 1,
  },
  {
    id: 'three_animals',
    section: 'general',
    titleKey: 'ach.threeAnimals.title',
    descKey: 'ach.threeAnimals.desc',
    icon: Award,
    unlocked: (s) => s.length >= 3,
  },
  {
    id: 'ten_animals',
    section: 'general',
    titleKey: 'ach.tenAnimals.title',
    descKey: 'ach.tenAnimals.desc',
    icon: Trophy,
    unlocked: (s) => s.length >= 10,
  },
  {
    id: 'twentyfive_animals',
    section: 'general',
    titleKey: 'ach.twentyfive.title',
    descKey: 'ach.twentyfive.desc',
    icon: Trophy,
    unlocked: (s) => s.length >= 25,
  },
  {
    id: 'seven_days',
    section: 'general',
    titleKey: 'ach.sevenDays.title',
    descKey: 'ach.sevenDays.desc',
    icon: Calendar,
    unlocked: (s) => uniqueDays(s) >= 7,
  },
];

const COLLECTION: AchievementDef[] = [
  {
    id: 'three_unique',
    section: 'collection',
    titleKey: 'ach.threeUnique.title',
    descKey: 'ach.threeUnique.desc',
    icon: Sparkles,
    unlocked: (s) => uniqueAnimalCount(s) >= 3,
  },
  {
    id: 'ten_unique',
    section: 'collection',
    titleKey: 'ach.tenUnique.title',
    descKey: 'ach.tenUnique.desc',
    icon: Sparkles,
    unlocked: (s) => uniqueAnimalCount(s) >= 10,
  },
  {
    id: 'five_classes',
    section: 'collection',
    titleKey: 'ach.fiveClasses.title',
    descKey: 'ach.fiveClasses.desc',
    icon: Crown,
    unlocked: (s, animals) => uniqueIconicTaxa(s, animals).size >= 5,
  },
];

const EXPLORER: AchievementDef[] = [
  {
    id: 'three_places',
    section: 'explorer',
    titleKey: 'ach.threePlaces.title',
    descKey: 'ach.threePlaces.desc',
    icon: Compass,
    unlocked: (s) => uniquePlaces(s) >= 3,
  },
];

interface ClassConfig {
  iconicTaxon: string;
  classKey: string;
  expertThreshold: number;
}

const CLASSES: ClassConfig[] = [
  { iconicTaxon: 'Mammalia', classKey: 'mammals', expertThreshold: 5 },
  { iconicTaxon: 'Aves', classKey: 'birds', expertThreshold: 5 },
  { iconicTaxon: 'Reptilia', classKey: 'reptiles', expertThreshold: 3 },
  { iconicTaxon: 'Amphibia', classKey: 'amphibians', expertThreshold: 3 },
  { iconicTaxon: 'Actinopterygii', classKey: 'fish', expertThreshold: 5 },
  { iconicTaxon: 'Insecta', classKey: 'insects', expertThreshold: 5 },
  { iconicTaxon: 'Arachnida', classKey: 'arachnids', expertThreshold: 3 },
  { iconicTaxon: 'Mollusca', classKey: 'molluscs', expertThreshold: 3 },
];

const CLASS_ACHIEVEMENTS: AchievementDef[] = CLASSES.flatMap((c) => [
  {
    id: `first_${c.classKey}`,
    section: 'classes',
    classKey: c.classKey,
    titleKey: `ach.first.${c.classKey}.title`,
    descKey: `ach.first.${c.classKey}.desc`,
    icon: Award,
    unlocked: (s, animals) =>
      uniqueAnimalCountForClass(s, animals, c.iconicTaxon) >= 1,
  },
  {
    id: `expert_${c.classKey}`,
    section: 'classes',
    classKey: c.classKey,
    titleKey: `ach.expert.${c.classKey}.title`,
    descKey: `ach.expert.${c.classKey}.desc`,
    icon: Trophy,
    unlocked: (s, animals) =>
      uniqueAnimalCountForClass(s, animals, c.iconicTaxon) >=
      c.expertThreshold,
  },
]);

const ACHIEVEMENTS: AchievementDef[] = [
  ...GENERAL,
  ...COLLECTION,
  ...EXPLORER,
  ...CLASS_ACHIEVEMENTS,
];

export interface AchievementStatus {
  def: AchievementDef;
  unlocked: boolean;
}

export function evaluateAchievements(
  sightings: SightingDoc[],
  animals: Map<string, AnimalDoc>,
): AchievementStatus[] {
  return ACHIEVEMENTS.map((def) => ({
    def,
    unlocked: def.unlocked(sightings, animals),
  }));
}

const UNLOCKED_KEY = 'safarideleo:unlockedAchievements';

export function getStoredUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function setStoredUnlocked(ids: Set<string>) {
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...ids]));
  } catch {
    /* localStorage no disponible: no es crítico */
  }
}
