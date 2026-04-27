import type { Locale } from '@/i18n';

/**
 * Deriva etiquetas educativas (badges) a partir del iconic taxon de iNaturalist.
 * Cada badge enseña a Leo una característica del animal: si es vertebrado o no,
 * si es vivíparo u ovíparo, cómo se mueve, etc.
 *
 * Las reglas son aproximaciones de un nivel adecuado para 7 años. Hay
 * excepciones biológicas (el ornitorrinco es mamífero ovíparo, el avestruz no
 * vuela, etc) que ignoramos a favor de la simplicidad pedagógica.
 */

export type BadgeKey =
  | 'mammal'
  | 'bird'
  | 'reptile'
  | 'amphibian'
  | 'fish'
  | 'insect'
  | 'arachnid'
  | 'mollusc'
  | 'vertebrate'
  | 'invertebrate'
  | 'viviparous'
  | 'oviparous'
  | 'flies'
  | 'swims'
  | 'walks'
  | 'amphibious';

const BADGES_BY_TAXON: Record<string, BadgeKey[]> = {
  Mammalia: ['mammal', 'vertebrate', 'viviparous'],
  Aves: ['bird', 'vertebrate', 'oviparous', 'flies'],
  Reptilia: ['reptile', 'vertebrate', 'oviparous', 'walks'],
  Amphibia: ['amphibian', 'vertebrate', 'oviparous', 'amphibious'],
  Actinopterygii: ['fish', 'vertebrate', 'oviparous', 'swims'],
  Insecta: ['insect', 'invertebrate'],
  Arachnida: ['arachnid', 'invertebrate', 'walks'],
  Mollusca: ['mollusc', 'invertebrate'],
};

const LABELS: Record<BadgeKey, Record<Locale, string>> = {
  mammal: { es: 'Mamífero', eu: 'Ugaztuna' },
  bird: { es: 'Ave', eu: 'Hegaztia' },
  reptile: { es: 'Reptil', eu: 'Narrastia' },
  amphibian: { es: 'Anfibio', eu: 'Anfibioa' },
  fish: { es: 'Pez', eu: 'Arraina' },
  insect: { es: 'Insecto', eu: 'Intsektua' },
  arachnid: { es: 'Arácnido', eu: 'Armiarma' },
  mollusc: { es: 'Molusco', eu: 'Moluskua' },
  vertebrate: { es: 'Vertebrado', eu: 'Ornoduna' },
  invertebrate: { es: 'Invertebrado', eu: 'Ornogabea' },
  viviparous: { es: 'Vivíparo', eu: 'Bizidun' },
  oviparous: { es: 'Ovíparo', eu: 'Errulea' },
  flies: { es: 'Vuela', eu: 'Hegan egiten du' },
  swims: { es: 'Nada', eu: 'Igeri egiten du' },
  walks: { es: 'Camina', eu: 'Ibiltzen da' },
  amphibious: { es: 'Vive en agua y tierra', eu: 'Uretan eta lehorrean bizi da' },
};

export interface CategoryBadge {
  key: BadgeKey;
  label: string;
}

export function deriveBadges(
  iconicTaxon: string | undefined,
  lang: Locale,
): CategoryBadge[] {
  if (!iconicTaxon) return [];
  const keys = BADGES_BY_TAXON[iconicTaxon] ?? [];
  return keys.map((key) => ({ key, label: LABELS[key][lang] }));
}
