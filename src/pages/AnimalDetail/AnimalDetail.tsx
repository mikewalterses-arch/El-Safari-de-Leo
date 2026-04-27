import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ImagePlus, Trash2, Volume2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSightings } from '@/features/sightings/useSightings';
import { useAuth } from '@/features/auth/useAuth';
import { replaceSightingPhoto } from '@/features/sightings/replaceSightingPhoto';
import { deleteSighting } from '@/features/sightings/deleteSighting';
import { deriveBadges } from '@/features/animals/categoryBadges';
import { useLocaleStore, useT } from '@/i18n';
import type { Animal, SightingAttributes } from '@/types/models';

export function AnimalDetail() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const { animalId } = useParams<{ animalId: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const { sightings } = useSightings();
  const { user } = useAuth();

  useEffect(() => {
    if (!animalId) return;
    setLoading(true);
    getDoc(doc(db, 'animals', animalId))
      .then((snap) => {
        if (snap.exists()) setAnimal(snap.data() as Animal);
      })
      .finally(() => setLoading(false));
  }, [animalId]);

  const mySightings = useMemo(
    () => sightings.filter((s) => s.animalId === animalId),
    [sightings, animalId],
  );

  const heroPhotoUrl =
    mySightings[0]?.photoUrl ||
    mySightings[0]?.thumbnailUrl ||
    animal?.imageUrl ||
    animal?.thumbnailUrl ||
    null;

  const hasMyPhoto = Boolean(
    mySightings[0]?.photoUrl || mySightings[0]?.thumbnailUrl,
  );

  const badges = useMemo(
    () => (animal ? deriveBadges(animal.iconicTaxon, locale) : []),
    [animal, locale],
  );

  if (loading) {
    return <p className="text-foreground/60">{t('common.loading')}</p>;
  }

  if (!animal) {
    return (
      <div className="space-y-4">
        <BackLink />
        <p>{t('animal.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink />

      {heroPhotoUrl && (
        <div className="relative">
          <img
            src={heroPhotoUrl}
            alt={animal.commonName}
            className="aspect-square w-full rounded-card object-cover shadow-card"
          />
          {hasMyPhoto && (
            <span className="absolute bottom-3 left-3 rounded-pill bg-foreground/70 px-3 py-1 text-xs font-extrabold text-surface backdrop-blur">
              {t('animal.yourPhoto')}
            </span>
          )}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-extrabold">{animal.commonName}</h2>
        {animal.scientificName &&
          animal.scientificName !== animal.commonName && (
            <p className="mt-1 text-sm italic text-foreground/60">
              {animal.scientificName}
            </p>
          )}
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.key}
              className="rounded-pill bg-primary/15 px-3 py-1 text-xs font-extrabold text-foreground"
            >
              {b.label}
            </span>
          ))}
        </div>
      )}

      {animal.soundUrl && <SoundButton url={animal.soundUrl} />}

      {animal.description && (
        <p className="leading-relaxed">{animal.description}</p>
      )}

      <div className="flex items-center gap-3 rounded-card border border-foreground/10 bg-cream p-3">
        {animal.thumbnailUrl && hasMyPhoto && (
          <img
            src={animal.thumbnailUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-button object-cover"
          />
        )}
        <a
          href={animal.wikipediaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-between gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t('animal.wikipedia')}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {mySightings.length > 0 && (
        <section>
          <h3 className="text-lg font-extrabold">
            {t('animal.timesSeen', { count: mySightings.length })}
          </h3>
          <ul className="mt-3 space-y-3">
            {mySightings.map((s) => {
              const date = s.createdAt?.toDate();
              return (
                <SightingItem
                  key={s.id}
                  sightingId={s.id}
                  thumbnailUrl={s.thumbnailUrl}
                  placeName={s.location?.placeName}
                  date={date}
                  notes={s.notes}
                  attributes={s.attributes}
                  uid={user?.uid}
                />
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function BackLink() {
  const t = useT();
  return (
    <Link
      to="/coleccion"
      className="inline-flex items-center gap-1 font-semibold text-primary"
    >
      <ArrowLeft className="h-5 w-5" /> {t('common.back')}
    </Link>
  );
}

function SoundButton({ url }: { url: string }) {
  const t = useT();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) {
      const a = new Audio(url);
      a.addEventListener('ended', () => setPlaying(false));
      a.addEventListener('error', () => setPlaying(false));
      audioRef.current = a;
    }
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    } else {
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-3 text-base font-extrabold text-foreground shadow-card"
    >
      <Volume2 className="h-5 w-5" strokeWidth={2.5} />
      {playing ? t('animal.soundPlaying') : t('animal.sound')}
    </button>
  );
}

interface SightingItemProps {
  sightingId: string;
  thumbnailUrl?: string;
  placeName?: string;
  date?: Date;
  notes?: string;
  attributes?: SightingAttributes;
  uid?: string;
}

function SightingItem({
  sightingId,
  thumbnailUrl,
  placeName,
  date,
  notes,
  attributes,
  uid,
}: SightingItemProps) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uid) return;
    setBusy(true);
    setError(null);
    try {
      await replaceSightingPhoto(sightingId, uid, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo falló');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDelete = async () => {
    if (!uid) return;
    if (!window.confirm(t('animal.deleteConfirm'))) return;
    setBusy(true);
    setError(null);
    try {
      await deleteSighting(uid, sightingId);
      // useSightings actualiza automáticamente vía onSnapshot;
      // este componente desaparece de la lista.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo falló');
      setBusy(false);
    }
  };

  return (
    <li className="flex gap-3 rounded-card border border-foreground/10 bg-cream p-3">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          loading="lazy"
          className="h-24 w-24 shrink-0 rounded-button object-cover"
        />
      ) : (
        <div className="h-24 w-24 shrink-0 rounded-button bg-foreground/5" />
      )}
      <div className="min-w-0 flex-1 text-sm">
        {placeName && <p className="truncate font-semibold">{placeName}</p>}
        {date && (
          <p className="text-foreground/60">
            {date.toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        {attributes && <AttributeBadges attributes={attributes} />}
        {notes && <p className="mt-1 italic">"{notes}"</p>}
        {uid && (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-pill border border-foreground/15 bg-surface px-2.5 py-1 text-xs font-semibold text-foreground/70 disabled:opacity-50"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {busy ? t('animal.uploading') : t('animal.changePhoto')}
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-pill border border-coral/40 bg-coral/10 px-2.5 py-1 text-xs font-semibold text-coral disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t('animal.delete')}
            </button>
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs font-semibold text-coral">{error}</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    </li>
  );
}

function AttributeBadges({ attributes }: { attributes: SightingAttributes }) {
  const t = useT();
  const tags: string[] = [];
  if (attributes.size) tags.push(t(`attr.size.${attributes.size}`));
  if (attributes.color) tags.push(t(`attr.color.${attributes.color}`));
  if (attributes.activity) tags.push(t(`attr.activity.${attributes.activity}`));
  if (tags.length === 0) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-pill bg-foreground/5 px-2 py-0.5 text-[11px] font-semibold text-foreground/70"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
