import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, ExternalLink } from 'lucide-react';
import { fetchTaxonById } from '@/lib/inaturalist';
import {
  extractWikipediaTitle,
  fetchAnimalSummary,
  type WikiSummary,
} from '@/lib/wikipedia';
import { deriveCharacteristics } from '@/features/animals/animalCharacteristics';
import { useLocaleStore, useT } from '@/i18n';
import type { AnimalSearchResult } from '@/types/models';

interface LocationState {
  result?: AnimalSearchResult;
}

/**
 * Vista preview de un animal de "Cerca de ti". Muestra foto, descripción
 * de Wikipedia y características. Botón principal para iniciar un avistamiento
 * con este animal pre-seleccionado (saltándose el buscador del flow normal).
 */
export function NearbyDetail() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const navigate = useNavigate();
  const { taxonId } = useParams<{ taxonId: string }>();
  const location = useLocation();
  const initial = (location.state as LocationState | null)?.result ?? null;

  const [result, setResult] = useState<AnimalSearchResult | null>(initial);
  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (result || !taxonId) return;
    setLoading(true);
    fetchTaxonById(Number(taxonId), locale)
      .then((r) => {
        if (r) setResult(r);
      })
      .finally(() => setLoading(false));
  }, [result, taxonId, locale]);

  useEffect(() => {
    if (!result?.wikipediaUrl) return;
    const title = extractWikipediaTitle(result.wikipediaUrl);
    if (!title) return;
    fetchAnimalSummary(title, locale)
      .then(setSummary)
      .catch(() => {});
  }, [result, locale]);

  const characteristics = useMemo(() => {
    if (!result) return [];
    return deriveCharacteristics(
      result.iconicTaxon,
      summary?.description ?? '',
      locale,
    );
  }, [result, summary, locale]);

  if (loading) {
    return <p className="text-foreground/60">{t('common.loading')}</p>;
  }
  if (!result) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 font-semibold text-primary"
        >
          <ArrowLeft className="h-5 w-5" /> {t('common.back')}
        </Link>
        <p>{t('animal.notFound')}</p>
      </div>
    );
  }

  const heroPhoto =
    summary?.imageUrl ?? summary?.thumbnailUrl ?? result.thumbnailUrl;
  const description = summary?.description ?? '';

  const startSighting = () => {
    navigate('/nuevo', { state: { animal: result } });
  };

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 font-semibold text-primary"
      >
        <ArrowLeft className="h-5 w-5" /> {t('common.back')}
      </Link>

      {heroPhoto && (
        <div className="flex justify-center">
          <img
            src={heroPhoto}
            alt={result.title}
            className="max-h-72 w-auto max-w-full rounded-card object-contain shadow-card"
          />
        </div>
      )}

      <div>
        <h2 className="text-3xl font-extrabold">{result.title}</h2>
        {result.scientificName && result.scientificName !== result.title && (
          <p className="mt-1 text-sm italic text-foreground/60">
            {result.scientificName}
          </p>
        )}
      </div>

      {characteristics.length > 0 && (
        <section className="rounded-card border border-foreground/10 bg-cream p-4">
          <h3 className="text-lg font-extrabold">{t('animal.characteristics')}</h3>
          <dl className="mt-3 space-y-2">
            {characteristics.map((c) => (
              <div
                key={c.labelKey}
                className="flex items-baseline justify-between gap-3 border-b border-foreground/5 pb-2 last:border-0 last:pb-0"
              >
                <dt className="text-sm font-semibold text-foreground/60">
                  {t(c.labelKey)}
                </dt>
                <dd className="text-sm font-extrabold text-foreground">
                  {c.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {description && <p className="leading-relaxed">{description}</p>}

      {result.wikipediaUrl && (
        <a
          href={result.wikipediaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t('animal.wikipedia')} <ExternalLink className="h-4 w-4" />
        </a>
      )}

      <button
        type="button"
        onClick={startSighting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-accent py-4 text-lg font-extrabold text-foreground shadow-card"
      >
        <Camera className="h-5 w-5" strokeWidth={2.5} />
        {t('nearby.makeSighting')}
      </button>
    </div>
  );
}
