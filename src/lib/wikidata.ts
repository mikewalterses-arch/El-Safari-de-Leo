import type { TaxonomicClass } from '@/types/models';

/**
 * Cliente de Wikidata SPARQL para enriquecer animales con su clase taxonómica.
 * Walks up P171* (parent taxon transitive) hasta encontrar uno con rank
 * P105 = Q37517 (clase). Sin clave; CORS habilitado en query.wikidata.org.
 *
 * Fallos no bloqueantes: cualquier error devuelve null y el animal se cachea
 * sin clase taxonómica.
 */

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

interface SparqlBinding {
  cls: { value: string };
  clsLabel: { value: string };
}

interface SparqlResponse {
  results?: { bindings?: SparqlBinding[] };
}

export async function fetchTaxonomicClass(
  qid: string,
  lang = 'es',
): Promise<TaxonomicClass | null> {
  const query = `
SELECT ?cls ?clsLabel WHERE {
  wd:${qid} wdt:P171* ?cls .
  ?cls wdt:P105 wd:Q37517 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang},en". }
}
LIMIT 1`.trim();

  try {
    const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
    const res = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json' },
    });
    if (!res.ok) return null;
    const data: SparqlResponse = await res.json();
    const binding = data.results?.bindings?.[0];
    if (!binding) return null;

    const match = /\/(Q\d+)$/.exec(binding.cls.value);
    if (!match) return null;

    return {
      qid: match[1]!,
      name: binding.clsLabel.value,
    };
  } catch {
    return null;
  }
}
