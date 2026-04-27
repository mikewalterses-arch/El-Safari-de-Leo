import { useState } from 'react';
import { useT } from '@/i18n';
import { createNote } from './createNote';

interface NewNoteFormProps {
  onClose: () => void;
}

export function NewNoteForm({ onClose }: NewNoteFormProps) {
  const t = useT();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createNote(text);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo falló');
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSave();
      }}
      className="rounded-card border border-foreground/10 bg-cream p-4"
    >
      <p className="text-xs font-extrabold uppercase tracking-wide text-foreground/60">
        {t('diary.noteLabel')}
      </p>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('diary.notePlaceholder')}
        rows={4}
        disabled={submitting}
        className="mt-2 w-full rounded-card border border-foreground/15 bg-surface p-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
      />
      {error && <p className="mt-2 text-sm font-semibold text-coral">{error}</p>}
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="flex-1 rounded-button border border-foreground/20 py-3 font-semibold disabled:opacity-50"
        >
          {t('diary.noteCancel')}
        </button>
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="flex flex-[2] items-center justify-center rounded-button bg-accent py-3 font-extrabold text-foreground shadow-card disabled:opacity-50"
        >
          {submitting ? t('newSighting.saving') : t('diary.noteSave')}
        </button>
      </div>
    </form>
  );
}
