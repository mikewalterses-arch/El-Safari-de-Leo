import type { AnimalDoc } from '@/stores/firestoreStore';
import type { AnimalGroup, Habitat } from './curatedCatalog';

/**
 * Helpers para extraer atributos de un Animal independientemente de si tiene
 * datos curados o solo viene de las heurísticas iNat. Usados por el filtrado
 * y agrupación del Pokédex.
 */

const ICONIC_TO_GROUP: Record<string, AnimalGroup> = {
  Mammalia: 'mamifero',
  Aves: 'ave',
  Actinopterygii: 'pez',
  Reptilia: 'reptil',
  Amphibia: 'anfibio',
  Insecta: 'invertebrado',
  Arachnida: 'invertebrado',
  Mollusca: 'invertebrado',
};

const ICONIC_TO_HABITATS: Record<string, Habitat[]> = {
  Mammalia: ['terrestre'],
  Aves: ['aereo', 'terrestre'],
  Reptilia: ['terrestre'],
  Amphibia: ['acuatico', 'terrestre'],
  Actinopterygii: ['acuatico'],
  Insecta: ['aereo', 'terrestre'],
  Arachnida: ['terrestre'],
};

export function getGroupKey(animal: AnimalDoc): AnimalGroup | null {
  if (animal.curatedTags) return animal.curatedTags.group;
  if (animal.iconicTaxon) return ICONIC_TO_GROUP[animal.iconicTaxon] ?? null;
  return null;
}

export function getHabitats(animal: AnimalDoc): Habitat[] {
  if (animal.curatedTags) return animal.curatedTags.habitat;
  if (animal.iconicTaxon) return ICONIC_TO_HABITATS[animal.iconicTaxon] ?? [];
  return [];
}

export function getDiet(animal: AnimalDoc): string | null {
  if (animal.curatedTags) return animal.curatedTags.diet;
  return null;
}

export const GROUP_ORDER: AnimalGroup[] = [
  'mamifero',
  'ave',
  'pez',
  'reptil',
  'anfibio',
  'invertebrado',
];
