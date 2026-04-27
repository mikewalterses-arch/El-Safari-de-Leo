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

export interface TaxonomicClass {
  qid: string;
  name: string;
}

export interface Animal {
  commonName: string;
  scientificName?: string;
  wikipediaUrl: string;
  wikipediaPageId: number;
  description: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  source: 'wikipedia' | 'inaturalist' | 'manual';
  createdAt: Timestamp;
  taxonomicClass?: TaxonomicClass;
  soundUrl?: string;
}

/** Atributos opcionales que Leo añade en el paso de confirmación. */
export type SightingSize = 'small' | 'medium' | 'large';
export type SightingActivity =
  | 'sleeping'
  | 'eating'
  | 'drinking'
  | 'flying'
  | 'swimming'
  | 'hiding'
  | 'playing'
  | 'walking';

export interface SightingAttributes {
  size?: SightingSize;
  color?: string;
  activity?: SightingActivity;
}

export interface Sighting {
  animalId: string;
  photoUrl: string;
  thumbnailUrl: string;
  location: SightingLocation;
  notes: string;
  identificationMethod: 'manual';
  createdAt: Timestamp;
  isFirstDiscovery: boolean;
  attributes?: SightingAttributes;
}

export interface SightingLocation {
  lat: number;
  lng: number;
  placeName: string;
}

/** Documento en `notes/{noteId}`. Diario libre, notas sin foto. */
export interface JournalNote {
  text: string;
  createdAt: Timestamp;
}

export interface AnimalSearchResult {
  sourceId: number;
  source: 'inaturalist' | 'wikipedia';
  title: string;
  scientificName?: string;
  description?: string;
  thumbnailUrl?: string;
  wikipediaUrl?: string;
  iconicTaxon?: string;
}
