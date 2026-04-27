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

/** Clase taxonómica derivada de Wikidata o del iconic taxon de iNaturalist. */
export interface TaxonomicClass {
  /** Q-id de Wikidata si viene de allí, '' si viene de iNaturalist */
  qid: string;
  /** Nombre localizado, ej. "Mamíferos" */
  name: string;
}

/**
 * Cache de animales identificados. El doc id es:
 * - `inat_{taxonId}` para resultados de iNaturalist (la fuente principal de búsqueda).
 * - `{lang}_{wikipediaPageId}` para entradas legacy creadas con búsqueda Wikipedia directa.
 */
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

/** Documento en `sightings/{sightingId}`. Cada avistamiento de Leo. */
export interface Sighting {
  animalId: string;
  photoUrl: string;
  thumbnailUrl: string;
  location: SightingLocation;
  notes: string;
  identificationMethod: 'manual';
  createdAt: Timestamp;
  isFirstDiscovery: boolean;
}

export interface SightingLocation {
  lat: number;
  lng: number;
  placeName: string;
}

/**
 * Resultado de búsqueda de animal (mostrado en la lista de sugerencias).
 * Independiente de la fuente: iNaturalist es la principal, Wikipedia se usa
 * solo para enriquecer al cachear.
 */
export interface AnimalSearchResult {
  /** Id estable en su fuente (taxonId de iNat, pageId de Wikipedia) */
  sourceId: number;
  source: 'inaturalist' | 'wikipedia';
  /** Nombre que se muestra en la lista (común si existe, científico si no) */
  title: string;
  scientificName?: string;
  /** Texto corto mostrado bajo el título en la lista */
  description?: string;
  thumbnailUrl?: string;
  /** URL del artículo de Wikipedia en el idioma actual, si la conocemos */
  wikipediaUrl?: string;
  /** Iconic taxon en inglés que reporta iNat (Mammalia, Aves, ...) */
  iconicTaxon?: string;
}
