import imageCompression from 'browser-image-compression';

/**
 * Procesa la foto antes de subir:
 * - original: comprimido a ~1.5 MB / max 1920px lado largo (suficiente para detalle).
 * - thumbnail: ~100 KB / 400px (rápido para grid de Pokédex y Diario en fase 4).
 *
 * Ambos se generan en paralelo en un Web Worker (no bloquea la UI).
 */

const ORIGINAL_OPTIONS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
} as const;

const THUMBNAIL_OPTIONS = {
  maxSizeMB: 0.1,
  maxWidthOrHeight: 400,
  useWebWorker: true,
} as const;

export async function processPhoto(
  file: File,
): Promise<{ original: File; thumbnail: File }> {
  const [original, thumbnail] = await Promise.all([
    imageCompression(file, ORIGINAL_OPTIONS),
    imageCompression(file, THUMBNAIL_OPTIONS),
  ]);
  return { original, thumbnail };
}
