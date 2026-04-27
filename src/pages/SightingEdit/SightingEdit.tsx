import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { deleteField, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/features/auth/useAuth';
import { replaceSightingPhoto } from '@/features/sightings/replaceSightingPhoto';
import { AttributesPicker } from '@/features/sightings/AttributesPicker';
import { useT } from '@/i18n';
import type { Sighting, SightingAttributes } from '@/types/models';

/**
 * Pantalla de edición completa de un avistamiento. Permite cambiar foto,
 * nota y atributos. La ubicación y la fecha quedan fijas (son punto en el
 * tiempo del avistamiento original).
 */
export function SightingEdit() {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sightingId } = useParams<{ sightingId: string }>();

  const [sighting, setSighting] = useState<Sighting | null>(null);
  const [notes, setNotes] = useState('');
  const [attributes, setAttributes] = useState<SightingAttributes>({});
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !sightingId) return;
    setLoading(true);
    getDoc(doc(db, 'users', user.uid, 'sightings', sightingId))
      .then((snap) => {
        if (snap.exists()) {
          const s = snap.data() as Sighting;
          setSighting(s);
          setNotes(s.notes ?? '');
          setAttributes(s.attributes ?? {});
        }
      })
      .finally(() => setLoading(false));
  }, [user, sightingId]);

  useEffect(() => {
    if (!newPhoto) {
      setNewPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(newPhoto);
    setNewPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newPhoto]);

  const onPickPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewPhoto(file);
  };

  const save = async () => {
    if (!user || !sightingId) return;
    setSaving(true);
    setError(null);
    try {
      if (newPhoto) {
        await replaceSightingPhoto(sightingId, user.uid, newPhoto);
      }
      const hasAttrs = Boolean(
        attributes.size || attributes.color || attributes.activity,
      );
      await updateDoc(doc(db, 'users', user.uid, 'sightings', sightingId), {
        notes,
        attributes: hasAttrs ? attributes : deleteField(),
      });
      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo falló');
      setSaving(false);
    }
  };

  if (loading) return <p className="text-foreground/60">{t('common.loading')}</p>;
  if (!sighting) {
    return (
      <div className="space-y-4">
        <BackButton />
        <p>{t('animal.notFound')}</p>
      </div>
    );
  }

  const previewUrl = newPhotoUrl ?? sighting.photoUrl ?? sighting.thumbnailUrl;

  return (
    <div className="space-y-6">
      <BackButton />

      <h2 className="text-2xl font-extrabold">{t('sightingEdit.title')}</h2>

      {previewUrl && (
        <img
          src={previewUrl}
          alt=""
          className="aspect-square w-full rounded-card object-cover shadow-card"
        />
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-button border border-foreground/20 py-3 font-semibold"
      >
        <Camera className="h-5 w-5" />
        {t('sightingEdit.changePhoto')}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPickPhoto}
        className="hidden"
      />

      <AttributesPicker value={attributes} onChange={setAttributes} />

      <label className="block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-foreground/60">
          {t('newSighting.note')}
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('newSighting.notePlaceholder')}
          rows={3}
          className="mt-2 w-full rounded-card border border-foreground/15 bg-cream p-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {error && <p className="text-sm font-semibold text-coral">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={saving}
          className="flex-1 rounded-button border border-foreground/20 py-3 font-semibold disabled:opacity-50"
        >
          {t('diary.noteCancel')}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex flex-[2] items-center justify-center gap-2 rounded-button bg-accent py-3 font-extrabold text-foreground shadow-card disabled:opacity-50"
        >
          <Check className="h-5 w-5" strokeWidth={2.5} />
          {saving ? t('newSighting.saving') : t('profile.save')}
        </button>
      </div>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1 font-semibold text-primary"
    >
      <ArrowLeft className="h-5 w-5" /> {t('common.back')}
    </button>
  );
}
