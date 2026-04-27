import type { Locale } from '@/i18n';

/**
 * Deriva un panel de características educativas del animal: tipo, esqueleto,
 * reproducción, hábitat (multi-valor) y alimentación.
 *
 * - Tipo, esqueleto, reproducción y hábitat se derivan del iconic taxon de
 *   iNat (heurísticas adecuadas para 7 años — ignoramos excepciones como
 *   ornitorrinco mamífero ovíparo, pingüino ave que no vuela, etc).
 * - Alimentación se extrae con regex del extract de Wikipedia. Si no se
 *   encuentra palabra clave, se omite la fila.
 *
 * Las heurísticas son INTENCIONALMENTE simples: para hacer educación rica
 * por especie hace falta un catálogo curado (post-fase actual).
 */

export interface Characteristic {
  labelKey: string;
  value: string;
}

type Habitat = 'land' | 'water' | 'air';

const TYPE_BY_TAXON: Record<string, Record<Locale, string>> = {
  Mammalia: { es: 'Mamífero', eu: 'Ugaztuna' },
  Aves: { es: 'Ave', eu: 'Hegaztia' },
  Reptilia: { es: 'Reptil', eu: 'Narrastia' },
  Amphibia: { es: 'Anfibio', eu: 'Anfibioa' },
  Actinopterygii: { es: 'Pez', eu: 'Arraina' },
  Insecta: { es: 'Insecto', eu: 'Intsektua' },
  Arachnida: { es: 'Arácnido', eu: 'Armiarma' },
  Mollusca: { es: 'Molusco', eu: 'Moluskua' },
};

const SKELETON_BY_TAXON: Record<string, 'vertebrate' | 'invertebrate'> = {
  Mammalia: 'vertebrate',
  Aves: 'vertebrate',
  Reptilia: 'vertebrate',
  Amphibia: 'vertebrate',
  Actinopterygii: 'vertebrate',
  Insecta: 'invertebrate',
  Arachnida: 'invertebrate',
  Mollusca: 'invertebrate',
};

const REPRO_BY_TAXON: Record<string, 'viviparous' | 'oviparous'> = {
  Mammalia: 'viviparous',
  Aves: 'oviparous',
  Reptilia: 'oviparous',
  Amphibia: 'oviparous',
  Actinopterygii: 'oviparous',
  Insecta: 'oviparous',
  Arachnida: 'oviparous',
  Mollusca: 'oviparous',
};

/**
 * Hábitats por defecto por clase. Los anfibios y aves tienen múltiples valores
 * porque la clase como concepto cubre varios medios. Para 7 años, "vive en
 * agua y tierra" para una rana es educativo y correcto.
 *
 * Mollusca no tiene default (varía mucho: caracol terrestre vs pulpo acuático).
 */
const HABITAT_BY_TAXON: Record<string, Habitat[]> = {
  Mammalia: ['land'],
  Aves: ['air', 'land'],
  Reptilia: ['land'],
  Amphibia: ['water', 'land'],
  Actinopterygii: ['water'],
  Insecta: ['air', 'land'],
  Arachnida: ['land'],
};

const HABITAT_LABELS: Record<Habitat, Record<Locale, string>> = {
  land: { es: 'Tierra', eu: 'Lurra' },
  water: { es: 'Agua', eu: 'Ura' },
  air: { es: 'Aire', eu: 'Airea' },
};

const SKELETON_LABELS: Record<string, Record<Locale, string>> = {
  vertebrate: {
    es: 'Tiene huesos (vertebrado)',
    eu: 'Hezurrak ditu (ornoduna)',
  },
  invertebrate: {
    es: 'Sin huesos (invertebrado)',
    eu: 'Hezurrik gabe (ornogabea)',
  },
};

const REPRO_LABELS: Record<string, Record<Locale, string>> = {
  viviparous: {
    es: 'Nace del vientre de su madre (vivíparo)',
    eu: 'Amaren sabeletik jaiotzen da (bizidun)',
  },
  oviparous: {
    es: 'Nace de un huevo (ovíparo)',
    eu: 'Arrautza batetik jaiotzen da (errulea)',
  },
};

const DIET_LABELS: Record<string, Record<Locale, string>> = {
  carnivore: { es: 'Carnívoro (come carne)', eu: 'Haragijalea' },
  herbivore: { es: 'Herbívoro (come plantas)', eu: 'Belarjalea' },
  omnivore: { es: 'Omnívoro (come de todo)', eu: 'Orojalea' },
  insectivore: { es: 'Insectívoro (come insectos)', eu: 'Intsektujalea' },
  frugivore: { es: 'Frugívoro (come frutas)', eu: 'Frutajalea' },
  granivore: { es: 'Granívoro (come semillas)', eu: 'Hazijalea' },
  piscivore: { es: 'Piscívoro (come peces)', eu: 'Arrainjalea' },
};

/**
 * Default de alimentación cuando Wikipedia no menciona palabra clave.
 * Solo donde la generalización es bastante segura.
 */
const DEFAULT_DIET_BY_TAXON: Record<string, string | undefined> = {
  Reptilia: 'carnivore',
  Amphibia: 'carnivore',
  Arachnida: 'carnivore',
};

function extractDiet(description: string): string | null {
  const lower = description.toLowerCase();
  if (/\bins[eé]ct[íi]voros?\b/.test(lower)) return 'insectivore';
  if (/\bfrug[íi]voros?\b/.test(lower)) return 'frugivore';
  if (/\bgran[íi]voros?\b/.test(lower)) return 'granivore';
  if (/\bpisc[íi]voros?\b/.test(lower)) return 'piscivore';
  if (/\bomn[íi]voros?\b/.test(lower)) return 'omnivore';
  if (/\bcarn[íi]voros?\b/.test(lower)) return 'carnivore';
  if (/\bherb[íi]voros?\b/.test(lower)) return 'herbivore';
  return null;
}

export function deriveCharacteristics(
  iconicTaxon: string | undefined,
  description: string,
  lang: Locale,
): Characteristic[] {
  const rows: Characteristic[] = [];

  if (iconicTaxon) {
    const type = TYPE_BY_TAXON[iconicTaxon]?.[lang];
    if (type) rows.push({ labelKey: 'char.type', value: type });

    const skeleton = SKELETON_BY_TAXON[iconicTaxon];
    if (skeleton) {
      rows.push({
        labelKey: 'char.skeleton',
        value: SKELETON_LABELS[skeleton][lang],
      });
    }

    const repro = REPRO_BY_TAXON[iconicTaxon];
    if (repro) {
      rows.push({
        labelKey: 'char.reproduction',
        value: REPRO_LABELS[repro][lang],
      });
    }

    const habitats = HABITAT_BY_TAXON[iconicTaxon];
    if (habitats && habitats.length > 0) {
      const value = habitats.map((h) => HABITAT_LABELS[h][lang]).join(' + ');
      rows.push({ labelKey: 'char.habitat', value });
    }
  }

  // Diet: extraído de Wikipedia → fallback por clase si falla.
  const dietKey =
    extractDiet(description) ??
    (iconicTaxon ? DEFAULT_DIET_BY_TAXON[iconicTaxon] : null);
  if (dietKey && DIET_LABELS[dietKey]) {
    rows.push({ labelKey: 'char.diet', value: DIET_LABELS[dietKey][lang] });
  }

  return rows;
}
