import type { Timestamp } from 'firebase/firestore';

/**
 * Espejo TypeScript de las colecciones de Firestore.
 * Mantener sincronizado si cambian las shapes en Firestore.
 */

/** Documento en `users/{userId}`. userId == ADMIN_UID. El perfil representa a Leo. */
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

/**
 * Cache de animales identificados. Cada vez que Leo identifica un animal vía
 * Wikipedia, lo guardamos aquí (idempotente). El doc id es `String(wikipediaPageId)`.
 *
 * El brief original tenía campos curados (funFactKid, habitat, size, diet, category).
 * En fase 2 simplificamos al subset que devuelve Wikipedia. Si en fase 6 se añade
 * curación manual, ampliar este modelo y añadir un editor en /perfil.
 */
export interface Animal {
  commonName: string;
  scientificName?: string;
  wikipediaUrl: string;
  wikipediaPageId: number;
  description: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  source: 'wikipedia' | 'manual';
  createdAt: Timestamp;
}

/** Documento en `sightings/{sightingId}`. Cada avistamiento de Leo. */
export interface Sighting {
  animalId: string;
  photoUrl: string;
  thumbnailUrl: string;
  location: SightingLocation;
  notes: string;
  identificationMethod: 'manual';
  // TODO(post-fase-2): si añadimos otra fuente (IA/Wikidata estructurado), ampliar union
  createdAt: Timestamp;
  isFirstDiscovery: boolean;
}

export interface SightingLocation {
  lat: number;
  lng: number;
  placeName: string;
}
