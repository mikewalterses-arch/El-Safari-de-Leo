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

/** Clase taxonómica derivada de Wikidata (P171 + P105=Q37517). */
export interface TaxonomicClass {
  /** Q-id de Wikidata, ej. "Q19159" para Mammalia */
  qid: string;
  /** Nombre localizado, ej. "Mamíferos" */
  name: string;
}

/**
 * Cache de animales identificados. Cada vez que Leo identifica un animal vía
 * Wikipedia, lo guardamos aquí (idempotente). El doc id es `String(wikipediaPageId)`.
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
  /** Clase taxonómica derivada de Wikidata. Opcional: puede no existir si Wikidata falló. */
  taxonomicClass?: TaxonomicClass;
  /** URL de archivo de audio (.ogg) de Wikimedia Commons si existe. */
  soundUrl?: string;
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
