import type { Timestamp } from 'firebase/firestore';

/**
 * Perfil de un peque dentro de la cuenta de un padre/madre.
 * Una cuenta de auth puede tener varios peques (multi-hijo).
 */
export interface KidProfile {
  id: string;
  displayName: string;
  birthDate: Timestamp;
  avatarColor: string;
  avatarIcon?: string;
  createdAt: Timestamp;
}

/**
 * Documento en `users/{userId}`. Representa la cuenta del padre/madre.
 * Multi-hijo: la lista `kids` contiene los peques de la familia.
 * Compat: campos legacy (displayName, birthDate, avatarColor) coexisten hasta
 * que la migración los mueve a `kids[0]`.
 */
export interface User {
  kids?: KidProfile[];
  migratedToMultiKid?: boolean;
  createdAt: Timestamp;
  stats?: UserStats;
  // Legacy single-kid (se mantienen hasta migrar):
  displayName?: string;
  birthDate?: Timestamp;
  avatarColor?: string;
  avatarIcon?: string;
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

/** Tags ricos del catálogo curado. Sobrescriben las heurísticas iNat cuando hay match. */
export interface CuratedTags {
  group: 'mamifero' | 'ave' | 'pez' | 'reptil' | 'anfibio' | 'invertebrado';
  skeleton: 'vertebrado' | 'invertebrado';
  birth: 'viviparo' | 'oviparo';
  diet: 'carnivoro' | 'herbivoro' | 'omnivoro';
  habitat: ('terrestre' | 'acuatico' | 'aereo')[];
  funFact: string;
  /** Tamaño aproximado en metros (longitud o altura). Opcional por compat. */
  sizeMeters?: number;
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
  iconicTaxon?: string;
  soundUrl?: string;
  /** Datos curados si el animal está en `curatedCatalog`. */
  curatedTags?: CuratedTags;
}

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
  /** Id del peque al que pertenece este avistamiento. */
  kidId?: string;
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
  /** Id del peque al que pertenece esta nota. */
  kidId?: string;
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
