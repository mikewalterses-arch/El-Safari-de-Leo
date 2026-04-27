import { useT } from '@/i18n';

const KID_HEIGHT_M = 1.25;

interface SizeComparisonProps {
  sizeMeters: number;
  /** Foto del animal para usar como silueta. Opcional. */
  thumbnailUrl?: string;
}

/**
 * Compara visualmente el tamaño del animal con la altura de un niño de 7 años.
 * Dos siluetas a escala lado a lado + texto descriptivo amigable.
 */
export function SizeComparison({ sizeMeters, thumbnailUrl }: SizeComparisonProps) {
  const t = useT();
  const containerH = 200;
  const max = Math.max(sizeMeters, KID_HEIGHT_M);
  // Altura mínima visible para que no desaparezca el animal microscópico
  const animalRatio = Math.max(sizeMeters / max, 0.04);
  const kidRatio = KID_HEIGHT_M / max;

  const animalH = animalRatio * containerH;
  const kidH = kidRatio * containerH;

  const sizeText = describeSize(sizeMeters);

  return (
    <section className="rounded-card border border-foreground/10 bg-cream p-4">
      <h3 className="text-lg font-extrabold">{t('animal.sizeTitle')}</h3>
      <div
        className="mt-4 flex items-end justify-around"
        style={{ height: containerH + 8 }}
      >
        <div className="flex flex-col items-center">
          <KidSilhouette height={kidH} />
          <p className="mt-1 text-xs font-semibold text-foreground/60">
            {t('animal.sizeKid')}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <AnimalSilhouette height={animalH} thumbnailUrl={thumbnailUrl} />
          <p className="mt-1 text-xs font-semibold text-foreground/60">
            {formatSize(sizeMeters)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-foreground/70">
        {sizeText}
      </p>
    </section>
  );
}

function KidSilhouette({ height }: { height: number }) {
  // Silueta SVG genérica de niño: cabeza redonda + cuerpo trapezoidal.
  return (
    <svg
      viewBox="0 0 60 200"
      style={{ height, width: 'auto' }}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Cabeza */}
      <circle cx="30" cy="30" r="20" fill="#7DD3C7" />
      {/* Cuello */}
      <rect x="26" y="48" width="8" height="8" fill="#7DD3C7" />
      {/* Cuerpo */}
      <path d="M 14 56 L 46 56 L 50 130 L 38 130 L 38 200 L 22 200 L 22 130 L 10 130 Z" fill="#7DD3C7" />
    </svg>
  );
}

function AnimalSilhouette({
  height,
  thumbnailUrl,
}: {
  height: number;
  thumbnailUrl?: string;
}) {
  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt=""
        style={{ height, width: 'auto', maxWidth: 120 }}
        className="rounded-button object-contain"
      />
    );
  }
  // Fallback: óvalo genérico
  return (
    <div
      className="rounded-full bg-coral"
      style={{ height, width: height * 0.8 }}
    />
  );
}

function formatSize(m: number): string {
  if (m < 0.01) return `${Math.round(m * 1000)} mm`;
  if (m < 1) return `${Math.round(m * 100)} cm`;
  return `${m % 1 === 0 ? m : m.toFixed(1)} m`;
}

function describeSize(m: number): string {
  const ratio = m / KID_HEIGHT_M;
  if (m < 0.01) return '¡Casi no se ve! Cabe en la punta de tu dedo.';
  if (m < 0.05) return '¡Como una uña tuya!';
  if (m < 0.3) return '¡Cabe en tu mano!';
  if (m < 1) return 'Más pequeño que tú.';
  if (m < 1.5) return '¡Casi como tú de alto!';
  if (m < 3) return 'Más grande que tú.';
  return `¡${ratio.toFixed(0)} veces más grande que tú!`;
}
