import type { Locale } from '@/i18n';
import type { CuratedTags } from '@/types/models';

/**
 * Deriva el panel de características educativas (tipo, esqueleto, reproducción,
 * hábitat, alimentación). Dos fuentes:
 * 1. Catálogo curado (`curatedTags`): datos hand-crafted con multi-valor en
 *    hábitat. Cubre los ~88 animales más habituales con precisión.
 * 2. Heurísticas iNat (`iconicTaxon`): fallback para animales fuera del
 *    catálogo. Funciona con la generalización por clase y falla en
 *    excepciones (pingüino, ornitorrinco, pulpo).
 *
 * Si curatedTags está disponible, se usa siempre (más preciso).
 */

export interface Characteristic {
  labelKey: string;
  value: string;
}

type Habitat = 'land' | 'water' | 'air';

/* ─── Etiquetas localizadas ─────────────────────────────────────── */

const GROUP_LABELS: Record<CuratedTags['group'], Record<Locale, string>> = {
  mamifero: { es: 'Mamífero', eu: 'Ugaztuna' },
  ave: { es: 'Ave', eu: 'Hegaztia' },
  pez: { es: 'Pez', eu: 'Arraina' },
  reptil: { es: 'Reptil', eu: 'Narrastia' },
  anfibio: { es: 'Anfibio', eu: 'Anfibioa' },
  invertebrado: { es: 'Invertebrado', eu: 'Ornogabea' },
};

const SKELETON_LABELS: Record<CuratedTags['skeleton'], Record<Locale, string>> = {
  vertebrado: {
    es: 'Tiene huesos (vertebrado)',
    eu: 'Hezurrak ditu (ornoduna)',
  },
  invertebrado: {
    es: 'Sin huesos (invertebrado)',
    eu: 'Hezurrik gabe (ornogabea)',
  },
};

const BIRTH_LABELS: Record<CuratedTags['birth'], Record<Locale, string>> = {
  viviparo: {
    es: 'Nace del vientre de su madre (vivíparo)',
    eu: 'Amaren sabeletik jaiotzen da (bizidun)',
  },
  oviparo: {
    es: 'Nace de un huevo (ovíparo)',
    eu: 'Arrautza batetik jaiotzen da (errulea)',
  },
};

const DIET_LABELS: Record<CuratedTags['diet'], Record<Locale, string>> = {
  carnivoro: { es: 'Carnívoro (come carne)', eu: 'Haragijalea' },
  herbivoro: { es: 'Herbívoro (come plantas)', eu: 'Belarjalea' },
  omnivoro: { es: 'Omnívoro (come de todo)', eu: 'Orojalea' },
};

const CURATED_HABITAT_LABELS: Record<
  CuratedTags['habitat'][number],
  Record<Locale, string>
> = {
  terrestre: { es: 'Tierra', eu: 'Lurra' },
  acuatico: { es: 'Agua', eu: 'Ura' },
  aereo: { es: 'Aire', eu: 'Airea' },
};

/* ─── Heurísticas (fallback iNat) ───────────────────────────────── */

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

const HABITAT_BY_TAXON: Record<string, Habitat[]> = {
  Mammalia: ['land'],
  Aves: ['air', 'land'],
  Reptilia: ['land'],
  Amphibia: ['water', 'land'],
  Actinopterygii: ['water'],
  Insecta: ['air', 'land'],
  Arachnida: ['land'],
};

const HEUR_HABITAT_LABELS: Record<Habitat, Record<Locale, string>> = {
  land: { es: 'Tierra', eu: 'Lurra' },
  water: { es: 'Agua', eu: 'Ura' },
  air: { es: 'Aire', eu: 'Airea' },
};

const HEUR_SKELETON_LABELS: Record<string, Record<Locale, string>> = {
  vertebrate: SKELETON_LABELS.vertebrado,
  invertebrate: SKELETON_LABELS.invertebrado,
};

const HEUR_REPRO_LABELS: Record<string, Record<Locale, string>> = {
  viviparous: BIRTH_LABELS.viviparo,
  oviparous: BIRTH_LABELS.oviparo,
};

const HEUR_DIET_LABELS: Record<string, Record<Locale, string>> = {
  carnivore: DIET_LABELS.carnivoro,
  herbivore: DIET_LABELS.herbivoro,
  omnivore: DIET_LABELS.omnivoro,
  insectivore: { es: 'Insectívoro (come insectos)', eu: 'Intsektujalea' },
  frugivore: { es: 'Frugívoro (come frutas)', eu: 'Frutajalea' },
  granivore: { es: 'Granívoro (come semillas)', eu: 'Hazijalea' },
  piscivore: { es: 'Piscívoro (come peces)', eu: 'Arrainjalea' },
};

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

/* ─── Función principal ─────────────────────────────────────────── */

export function deriveCharacteristics(
  iconicTaxon: string | undefined,
  description: string,
  lang: Locale,
  curated?: CuratedTags,
): Characteristic[] {
  if (curated) {
    return deriveFromCurated(curated, lang);
  }
  return deriveFromHeuristics(iconicTaxon, description, lang);
}

function deriveFromCurated(c: CuratedTags, lang: Locale): Characteristic[] {
  const rows: Characteristic[] = [];
  rows.push({ labelKey: 'char.type', value: GROUP_LABELS[c.group][lang] });
  rows.push({
    labelKey: 'char.skeleton',
    value: SKELETON_LABELS[c.skeleton][lang],
  });
  rows.push({
    labelKey: 'char.reproduction',
    value: BIRTH_LABELS[c.birth][lang],
  });
  rows.push({
    labelKey: 'char.habitat',
    value: c.habitat
      .map((h) => CURATED_HABITAT_LABELS[h][lang])
      .join(' + '),
  });
  rows.push({
    labelKey: 'char.diet',
    value: DIET_LABELS[c.diet][lang],
  });
  return rows;
}

function deriveFromHeuristics(
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
        value: HEUR_SKELETON_LABELS[skeleton][lang],
      });
    }

    const repro = REPRO_BY_TAXON[iconicTaxon];
    if (repro) {
      rows.push({
        labelKey: 'char.reproduction',
        value: HEUR_REPRO_LABELS[repro][lang],
      });
    }

    const habitats = HABITAT_BY_TAXON[iconicTaxon];
    if (habitats && habitats.length > 0) {
      rows.push({
        labelKey: 'char.habitat',
        value: habitats.map((h) => HEUR_HABITAT_LABELS[h][lang]).join(' + '),
      });
    }
  }

  const dietKey =
    extractDiet(description) ??
    (iconicTaxon ? DEFAULT_DIET_BY_TAXON[iconicTaxon] : null);
  if (dietKey && HEUR_DIET_LABELS[dietKey]) {
    rows.push({
      labelKey: 'char.diet',
      value: HEUR_DIET_LABELS[dietKey][lang],
    });
  }

  return rows;
}
