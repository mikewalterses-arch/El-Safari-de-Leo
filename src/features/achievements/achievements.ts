import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Calendar,
  Compass,
  Crown,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import type { AnimalDoc, SightingDoc } from '@/stores/firestoreStore';

/**
 * Catálogo de logros. Se computan a partir de la lista de avistamientos
 * y el cache de animales. Sin estado persistido en Firestore — son derivados.
 *
 * Para detectar "logro recién desbloqueado" comparamos contra un set
 * persistido en localStorage en cada save (ver useNewlyUnlocked).
 */

export interface AchievementDef {
  id: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  unlocked: (s: SightingDoc[], animals: Map<string, AnimalDoc>) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_animal',
    titleKey: 'ach.firstAnimal.title',
    descKey: 'ach.firstAnimal.desc',
    icon: Star,
    unlocked: (s) => s.length >= 1,
  },
  {
    id: 'three_animals',
    titleKey: 'ach.threeAnimals.title',
    descKey: 'ach.threeAnimals.desc',
    icon: Award,
    unlocked: (s) => s.length >= 3,
  },
  {
    id: 'ten_animals',
    titleKey: 'ach.tenAnimals.title',
    descKey: 'ach.tenAnimals.desc',
    icon: Trophy,
    unlocked: (s) => s.length >= 10,
  },
  {
    id: 'twentyfive_animals',
    titleKey: 'ach.twentyfive.title',
    descKey: 'ach.twentyfive.desc',
    icon: Trophy,
    unlocked: (s) => s.length >= 25,
  },
  {
    id: 'three_unique',
    titleKey: 'ach.threeUnique.title',
    descKey: 'ach.threeUnique.desc',
    icon: Sparkles,
    unlocked: (s) => new Set(s.map((x) => x.animalId)).size >= 3,
  },
  {
    id: 'ten_unique',
    titleKey: 'ach.tenUnique.title',
    descKey: 'ach.tenUnique.desc',
    icon: Sparkles,
    unlocked: (s) => new Set(s.map((x) => x.animalId)).size >= 10,
  },
  {
    id: 'three_places',
    titleKey: 'ach.threePlaces.title',
    descKey: 'ach.threePlaces.desc',
    icon: Compass,
    unlocked: (s) => {
      const places = new Set(
        s.map((x) => x.location?.placeName).filter((p): p is string => Boolean(p)),
      );
      return places.size >= 3;
    },
  },
  {
    id: 'five_classes',
    titleKey: 'ach.fiveClasses.title',
    descKey: 'ach.fiveClasses.desc',
    icon: Crown,
    unlocked: (s, animals) => {
      const classes = new Set(
        s
          .map((sg) => animals.get(sg.animalId)?.taxonomicClass?.qid)
          .filter((q): q is string => Boolean(q)),
      );
      return classes.size >= 5;
    },
  },
  {
    id: 'seven_days',
    titleKey: 'ach.sevenDays.title',
    descKey: 'ach.sevenDays.desc',
    icon: Calendar,
    unlocked: (s) => {
      const days = new Set(
        s
          .map((sg) => {
            const d = sg.createdAt?.toDate?.();
            if (!d) return null;
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          })
          .filter((x): x is string => Boolean(x)),
      );
      return days.size >= 7;
    },
  },
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
