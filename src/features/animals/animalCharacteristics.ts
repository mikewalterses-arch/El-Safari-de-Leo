import type { Locale } from '@/i18n';

/**
 * Deriva un panel de características educativas del animal: tipo, esqueleto,
 * reproducción, movimiento, hábitat y alimentación. Los datos se construyen
 * desde el iconic taxon de iNat y, para alimentación, parseando el extract
 * de Wikipedia (heurística por palabras como "carnívoro", "herbívoro"...).
 *
 * Las reglas son aproximaciones para un niño de 7 años. Hay excepciones
 * biológicas (ornitorrinco mamífero ovíparo, avestruz no vuela...) que
 * ignoramos a favor de la simplicidad pedagógica.
 */

export interface Characteristic {
  labelKey: string;
  value: string;
}

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

const MOVEMENT_BY_TAXON: Record<string, 'walks' | 'flies' | 'swims'> = {
  Mammalia: 'walks',
  Aves: 'flies',
  Reptilia: 'walks',
  Actinopterygii: 'swims',
  Insecta: 'flies',
  Arachnida: 'walks',
};

const AMPHIBIOUS = new Set(['Amphibia']);

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
  // Vivíparo = el embrión se desarrolla dentro del cuerpo de la madre y nace
  // ya formado (mayoría de mamíferos).
  viviparous: {
    es: 'Nace del vientre de su madre (vivíparo)',
    eu: 'Amaren sabeletik jaiotzen da (bizidun)',
  },
  // Ovíparo = se desarrolla dentro de un huevo que sale del cuerpo de la madre
  // y eclosiona fuera. Aves, reptiles, peces, anfibios, insectos.
  oviparous: {
    es: 'Nace de un huevo (ovíparo)',
    eu: 'Arrautza batetik jaiotzen da (errulea)',
  },
};

const MOVEMENT_LABELS: Record<string, Record<Locale, string>> = {
  walks: { es: 'Camina', eu: 'Ibiltzen da' },
  flies: { es: 'Vuela', eu: 'Hegan egiten du' },
  swims: { es: 'Nada', eu: 'Igeri egiten du' },
};

const AMPHIBIOUS_LABEL: Record<Locale, string> = {
  es: 'Vive en agua y tierra',
  eu: 'Uretan eta lehorrean bizi da',
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

    if (AMPHIBIOUS.has(iconicTaxon)) {
      rows.push({ labelKey: 'char.habitat', value: AMPHIBIOUS_LABEL[lang] });
    } else {
      const move = MOVEMENT_BY_TAXON[iconicTaxon];
      if (move) {
        rows.push({
          labelKey: 'char.movement',
          value: MOVEMENT_LABELS[move][lang],
        });
      }
    }
  }

  const diet = extractDiet(description);
  if (diet) {
    rows.push({ labelKey: 'char.diet', value: DIET_LABELS[diet][lang] });
  }

  return rows;
}
