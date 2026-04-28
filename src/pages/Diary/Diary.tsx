import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, PenLine, Plus, Trash2 } from 'lucide-react';
import { useAnimals } from '@/features/animals/useAnimals';
import { useSightings } from '@/features/sightings/useSightings';
import { useNotes, type JournalNoteDoc } from '@/features/notes/useNotes';
import { NewNoteForm } from '@/features/notes/NewNoteForm';
import { deleteNote } from '@/features/notes/createNote';
import { useAuth } from '@/features/auth/useAuth';
import { useLocaleStore, useT } from '@/i18n';
import type { SightingDoc } from '@/stores/firestoreStore';

type DiaryItem =
  | { type: 'sighting'; key: string; createdAt: Date; sighting: SightingDoc }
  | { type: 'note'; key: string; createdAt: Date; note: JournalNoteDoc };

export function Diary() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const { sightings, loading: sightingsLoading } = useSightings();
  const { notes, loading: notesLoading } = useNotes();
  const { animals } = useAnimals();
  const [writing, setWriting] = useState(false);

  const items: DiaryItem[] = useMemo(() => {
    const out: DiaryItem[] = [];
    for (const s of sightings) {
      const d = s.createdAt?.toDate?.();
      if (!d) continue;
      out.push({ type: 'sighting', key: `s-${s.id}`, createdAt: d, sighting: s });
    }
    for (const n of notes) {
      const d = n.createdAt?.toDate?.();
      if (!d) continue;
      out.push({ type: 'note', key: `n-${n.id}`, createdAt: d, note: n });
    }
    out.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return out;
  }, [sightings, notes]);

  if (sightingsLoading || notesLoading) {
    return <p className="text-foreground/60">{t('common.loading')}</p>;
  }

  const dateLocale = locale === 'eu' ? 'eu-ES' : 'es-ES';
  const formatDate = (d: Date) =>
    d.toLocaleDateString(dateLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{t('diary.title')}</h2>
          {items.length > 0 && (
            <p className="mt-1 text-foreground/60">
              {t('diary.count', { count: items.length })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setWriting((v) => !v)}
          className="inline-flex items-center gap-1 rounded-button bg-primary px-3 py-2 text-sm font-extrabold text-foreground shadow-soft"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t('diary.writeNote')}
        </button>
      </div>

      {writing && <NewNoteForm onClose={() => setWriting(false)} />}

      {items.length === 0 && !writing && (
        <div className="rounded-card border border-foreground/10 bg-cream p-8 text-center">
          <p className="text-foreground/70">{t('diary.empty')}</p>
        </div>
      )}

      {items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) =>
            item.type === 'sighting' ? (
              <SightingCard
                key={item.key}
                sighting={item.sighting}
                animalName={animals.get(item.sighting.animalId)?.commonName}
                date={formatDate(item.createdAt)}
              />
            ) : (
              <NoteCard
                key={item.key}
                note={item.note}
                date={formatDate(item.createdAt)}
              />
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function SightingCard({
  sighting,
  animalName,
  date,
}: {
  sighting: SightingDoc;
  animalName?: string;
  date: string;
}) {
  const t = useT();
  return (
    <li>
      <Link
        to={`/animal/${sighting.animalId}`}
        className="flex gap-3 rounded-card border border-foreground/10 bg-cream p-3 shadow-soft transition-colors hover:border-primary"
      >
        {sighting.thumbnailUrl ? (
          <img
            src={sighting.thumbnailUrl}
            alt=""
            loading="lazy"
            className="h-24 w-24 shrink-0 rounded-button object-cover"
          />
        ) : (
          <div className="h-24 w-24 shrink-0 rounded-button bg-foreground/5" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-extrabold">
            {animalName ?? t('newSighting.animal')}
          </p>
          {sighting.location?.placeName && (
            <p className="mt-1 flex items-center gap-1 text-xs text-foreground/60">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{sighting.location.placeName}</span>
            </p>
          )}
          <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/60">
            <Calendar className="h-3 w-3 shrink-0" />
            {date}
          </p>
          {sighting.attributes && <AttributeBadges sighting={sighting} />}
          {sighting.notes && (
            <p className="mt-2 line-clamp-2 text-sm italic text-foreground/80">
              "{sighting.notes}"
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}

function AttributeBadges({ sighting }: { sighting: SightingDoc }) {
  const t = useT();
  const attrs = sighting.attributes;
  if (!attrs) return null;
  const tags: string[] = [];
  if (attrs.size) tags.push(t(`attr.size.${attrs.size}`));
  if (attrs.color) tags.push(t(`attr.color.${attrs.color}`));
  if (attrs.activity) tags.push(t(`attr.activity.${attrs.activity}`));
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

function NoteCard({ note, date }: { note: JournalNoteDoc; date: string }) {
  const t = useT();
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user || deleting) return;
    if (!window.confirm(t('diary.noteDeleteConfirm'))) return;
    setDeleting(true);
    try {
      await deleteNote(user.uid, note.id);
    } catch (err) {
      console.error('deleteNote failed', err);
      setDeleting(false);
    }
  };

  return (
    <li className="rounded-card border border-foreground/10 bg-highlight/40 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wide text-foreground/60">
          <PenLine className="h-3 w-3" /> {t('diary.noteLabel')}
        </p>
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={deleting}
          aria-label={t('diary.noteDelete')}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-coral/10 hover:text-coral disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
      <p className="mt-2 whitespace-pre-line text-base leading-relaxed">
        {note.text}
      </p>
      <p className="mt-2 flex items-center gap-1 text-xs text-foreground/60">
        <Calendar className="h-3 w-3 shrink-0" />
        {date}
      </p>
    </li>
  );
}
