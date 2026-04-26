import type { Timestamp } from 'firebase/firestore';

/**
 * Espejo TypeScript de las colecciones de Firestore.
 * Mantener sincronizado si cambian las shapes en Firestore.
 */

export type AnimalCategory =
  | 'marine'
  | 'mammal'
  | 'bird'
  | 'reptile'
  | 'amphibian'
  | 'insect'
  | 'fish'
  | 'other';

/** Documento en `users/{userId}`. userId == ADMIN_UID (Mikel). El perfil representa a Leo. */
export interface User {
  displayName: string;
  birthDate: Timestamp;
  avatarColor: string;
  createdAt: Timestamp;
  stats: UserStats;
}

export interface UserStats {
  totalSightings: number;
  uniqueAnimals: number;
  categoriesUnlocked: string[];
  achievements: string[];
}

/** Documento en `animals/{animalId}`. Catálogo compartido (semilla + añadidos por usuario). */
export interface Animal {
  commonName: string;
  scientificName: string;
  category: AnimalCategory;
  subcategory: string;
  funFactKid: string;
  habitat: string;
  size: string;
  diet: string;
  illustration: string;
  source: 'seed' | 'user-added';
  searchTerms: string[];
}

/** Documento en `sightings/{sightingId}`. Cada avistamiento de Leo. */
export interface Sighting {
  animalId: string;
  photoUrl: string;
  thumbnailUrl: string;
  location: SightingLocation;
  notes: string;
  identificationMethod: 'manual';
  // TODO(post-fase-1): si se añade IA, ampliar union: 'manual' | 'ai-suggested' | 'ai-confirmed'
  createdAt: Timestamp;
  isFirstDiscovery: boolean;
}

export interface SightingLocation {
  lat: number;
  lng: number;
  placeName: string;
}
