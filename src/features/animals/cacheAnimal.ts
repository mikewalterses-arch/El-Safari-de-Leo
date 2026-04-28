import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  extractWikipediaTitle,
  fetchAnimalSummary,
  type WikiSummary,
} from '@/lib/wikipedia';
import { fetchTaxonomicClass } from '@/lib/wikidata';
import { fetchAnimalSound } from '@/lib/wikimedia';
import { getLocale, type Locale } from '@/i18n';
import { findCuratedAnimal } from './curatedCatalog';
import type {
  Animal,
  AnimalSearchResult,
  CuratedTags,
  TaxonomicClass,
} from '@/types/models';

const ENRICH_TIMEOUT_MS = 4000;

export async function ensureAnimal(result: AnimalSearchResult): Promise<string> {
  const lang = getLocale();
  const animalId =
    result.source === 'inaturalist'
      ? `inat_${result.sourceId}`
      : `${lang}_${result.sourceId}`;

  const ref = doc(db, 'animals', animalId);
  const existing = await getDoc(ref);
  if (existing.exists()) return animalId;

  let summary: WikiSummary | null = null;
  if (result.wikipediaUrl) {
    const title = extractWikipediaTitle(result.wikipediaUrl);
    // Usar el idioma de la URL (no el locale del usuario): iNaturalist devuelve
    // URLs de en.wikipedia.org aunque el locale sea es, y buscar "Mallard" en
    // es.wikipedia.org devuelve el artículo de una ciruela, no el pato.
    const wikiLang = extractWikipediaLang(result.wikipediaUrl) ?? lang;
    if (title) {
      summary = await fetchAnimalSummary(title, wikiLang).catch(() => null);
    }
  }

  const [taxClassFromWikidata, soundUrl] = await Promise.all([
    summary?.wikibaseItemQid
      ? withTimeout(
          fetchTaxonomicClass(summary.wikibaseItemQid, lang).catch(() => null),
          ENRICH_TIMEOUT_MS,
          null,
        )
      : Promise.resolve(null),
    summary
      ? withTimeout(
          fetchAnimalSound(summary.title, lang).catch(() => undefined),
          ENRICH_TIMEOUT_MS,
          undefined,
        )
      : Promise.resolve(undefined),
  ]);

  const taxClass: TaxonomicClass | undefined =
    taxClassFromWikidata ??
    (result.iconicTaxon
      ? { qid: '', name: localizeIconicTaxon(result.iconicTaxon, lang) }
      : undefined);

  const finalThumb = summary?.thumbnailUrl ?? result.thumbnailUrl;
  const finalDescription =
    summary?.description ||
    [result.title, result.scientificName].filter(Boolean).join(' — ') ||
    result.title;

  // Catálogo curado: si el animal está en la lista hand-crafted, usamos sus
  // tags multi-valor en lugar de las heurísticas. Cubre los ~88 animales más
  // habituales (perro, león, pingüino, pulpo, etc) con datos rigurosos +
  // dato curioso adaptado a niños.
  const curated = findCuratedAnimal(
    summary?.title ?? result.title,
    result.scientificName,
  );
  const curatedTags: CuratedTags | undefined = curated
    ? {
        group: curated.group,
        skeleton: curated.skeleton,
        birth: curated.birth,
        diet: curated.diet,
        habitat: curated.habitat,
        funFact: curated.funFact,
        sizeMeters: curated.sizeMeters,
      }
    : undefined;

  const animal: Animal = {
    // Siempre el nombre preferido de iNaturalist (localizado al locale del usuario).
    // El título de Wikipedia puede ser el nombre inglés o incluso el artículo
    // equivocado (ej: "Mallard" en es.wikipedia.org es una ciruela, no el pato).
    commonName: result.title,
    description: finalDescription,
    wikipediaUrl: summary?.wikipediaUrl ?? result.wikipediaUrl ?? '',
    wikipediaPageId: summary?.pageId ?? 0,
    source: result.source,
    createdAt: Timestamp.now(),
    ...(result.scientificName && { scientificName: result.scientificName }),
    ...(finalThumb && { thumbnailUrl: finalThumb }),
    ...(summary?.imageUrl && { imageUrl: summary.imageUrl }),
    ...(taxClass && { taxonomicClass: taxClass }),
    ...(result.iconicTaxon && { iconicTaxon: result.iconicTaxon }),
    ...(soundUrl && { soundUrl }),
    ...(curatedTags && { curatedTags }),
  };
  await setDoc(ref, animal);
  return animalId;
}

function extractWikipediaLang(url: string): Locale | null {
  try {
    const m = new URL(url).hostname.match(/^([a-z]{2})\.wikipedia\.org$/);
    return m ? (m[1] as Locale) : null;
  } catch {
    return null;
  }
}

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

const ICONIC_LABELS: Record<string, Record<Locale, string>> = {
  Mammalia: { es: 'Mamíferos', eu: 'Ugaztunak' },
  Aves: { es: 'Aves', eu: 'Hegaztiak' },
  Reptilia: { es: 'Reptiles', eu: 'Narrastiak' },
  Amphibia: { es: 'Anfibios', eu: 'Anfibioak' },
  Actinopterygii: { es: 'Peces', eu: 'Arrainak' },
  Insecta: { es: 'Insectos', eu: 'Intsektuak' },
  Arachnida: { es: 'Arácnidos', eu: 'Armiarmak' },
  Mollusca: { es: 'Moluscos', eu: 'Moluskuak' },
  Animalia: { es: 'Animales', eu: 'Animaliak' },
};

function localizeIconicTaxon(name: string, lang: Locale): string {
  return ICONIC_LABELS[name]?.[lang] ?? name;
}
