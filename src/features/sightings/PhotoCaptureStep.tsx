import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { useT } from '@/i18n';

interface PhotoCaptureStepProps {
  onPhotoSelected: (file: File) => void;
}

export function PhotoCaptureStep({ onPhotoSelected }: PhotoCaptureStepProps) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const open = () => inputRef.current?.click();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">
          {t('newSighting.takePhotoTitle')}
        </h2>
        <p className="mt-1 text-foreground/60">
          {t('newSighting.takePhotoSubtitle')}
        </p>
      </div>

      {previewUrl && file ? (
        <div className="space-y-4">
          <img
            src={previewUrl}
            alt=""
            className="aspect-square w-full rounded-card object-cover shadow-card"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={open}
              className="flex flex-1 items-center justify-center gap-2 rounded-button border border-foreground/20 py-3 font-semibold"
            >
              <RefreshCw className="h-5 w-5" />
              {t('newSighting.another')}
            </button>
            <button
              type="button"
              onClick={() => onPhotoSelected(file)}
              className="flex flex-[2] items-center justify-center rounded-button bg-accent py-3 font-extrabold text-foreground shadow-card"
            >
              {t('newSighting.next')}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed border-primary/40 bg-cream"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-foreground shadow-card">
            <Camera className="h-10 w-10" strokeWidth={2} />
          </span>
          <span className="text-lg font-extrabold">
            {t('newSighting.takePhoto')}
          </span>
          <span className="text-sm text-foreground/60">
            {t('newSighting.galleryHint')}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
