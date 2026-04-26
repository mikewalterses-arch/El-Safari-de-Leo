import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Volume2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSightings } from '@/features/sightings/useSightings';
import { useT } from '@/i18n';
import type { Animal } from '@/types/models';

export function AnimalDetail() {
  const t = useT();
  const { animalId } = useParams<{ animalId: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const { sightings } = useSightings();

  useEffect(() => {
    if (!animalId) return;
    setLoading(true);
    getDoc(doc(db, 'animals', animalId))
      .then((snap) => {
        if (snap.exists()) setAnimal(snap.data() as Animal);
      })
      .finally(() => setLoading(false));
  }, [animalId]);

  const mySightings = sightings.filter((s) => s.animalId === animalId);

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

      {animal.imageUrl ? (
        <img
          src={animal.imageUrl}
          alt={animal.commonName}
          className="aspect-square w-full rounded-card object-cover shadow-card"
        />
      ) : animal.thumbnailUrl ? (
        <img
          src={animal.thumbnailUrl}
          alt={animal.commonName}
          className="aspect-square w-full rounded-card object-cover shadow-card"
        />
      ) : null}

      <div>
        <h2 className="text-3xl font-extrabold">{animal.commonName}</h2>
        {animal.taxonomicClass && (
          <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-accent">
            {animal.taxonomicClass.name}
          </p>
        )}
      </div>

      {animal.soundUrl && <SoundButton url={animal.soundUrl} />}

      {animal.description && (
        <p className="leading-relaxed">{animal.description}</p>
      )}

      <a
        href={animal.wikipediaUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        {t('animal.wikipedia')} <ExternalLink className="h-4 w-4" />
      </a>

      {mySightings.length > 0 && (
        <section>
          <h3 className="text-lg font-extrabold">
            {t('animal.timesSeen', { count: mySightings.length })}
          </h3>
          <ul className="mt-3 space-y-3">
            {mySightings.map((s) => {
              const date = s.createdAt?.toDate();
              return (
                <li
                  key={s.id}
                  className="flex gap-3 rounded-card border border-foreground/10 bg-cream p-3"
                >
                  {s.thumbnailUrl && (
                    <img
                      src={s.thumbnailUrl}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-button object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1 text-sm">
                    {s.location?.placeName && (
                      <p className="truncate font-semibold">
                        {s.location.placeName}
                      </p>
                    )}
                    {date && (
                      <p className="text-foreground/60">
                        {date.toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    {s.notes && <p className="mt-1 italic">"{s.notes}"</p>}
                  </div>
                </li>
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
