import html2canvas from 'html2canvas';

/**
 * Captura el elemento DOM dado a JPG y lo comparte vía navigator.share
 * (sheet nativo de iOS/Android). Si la API no está disponible, descarga
 * el JPG como fallback.
 */
export async function captureAndShare(
  element: HTMLElement,
  fileNameBase: string,
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#FFF9F2',
    useCORS: true,
    scale: 2,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92),
  );
  if (!blob) throw new Error('No se pudo generar la imagen');

  const safeName = fileNameBase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const fileName = `${safeName || 'avistamiento'}.jpg`;
  const file = new File([blob], fileName, { type: 'image/jpeg' });

  // Preferimos compartir nativo si el navegador lo soporta para archivos.
  if (
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      // Usuario canceló o navigator.share falló — caemos al descarga.
      const error = err as { name?: string };
      if (error.name === 'AbortError') return;
    }
  }

  // Fallback: descarga el archivo
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
