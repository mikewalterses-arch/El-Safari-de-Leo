import type { CSSProperties } from 'react';
import { useT } from '@/i18n';

const KID_HEIGHT_M = 1.25;
const FILL_KID = '#7DD3C7';
const FILL_ANIMAL = '#F4A896';

type AnimalGroup = 'bird' | 'mammal' | 'fish' | 'insect' | 'reptile' | 'spider' | 'default';

function iconicTaxonToGroup(iconicTaxon?: string): AnimalGroup {
  switch (iconicTaxon) {
    case 'Aves': return 'bird';
    case 'Mammalia': return 'mammal';
    case 'Actinopterygii': return 'fish';
    case 'Insecta': return 'insect';
    case 'Reptilia': return 'reptile';
    case 'Arachnida': return 'spider';
    default: return 'default';
  }
}

interface SizeComparisonProps {
  sizeMeters: number;
  iconicTaxon?: string;
}

export function SizeComparison({ sizeMeters, iconicTaxon }: SizeComparisonProps) {
  const t = useT();
  const containerH = 200;
  const max = Math.max(sizeMeters, KID_HEIGHT_M);
  const animalRatio = Math.max(sizeMeters / max, 0.06);
  const kidRatio = KID_HEIGHT_M / max;

  const animalH = animalRatio * containerH;
  const kidH = kidRatio * containerH;

  const group = iconicTaxonToGroup(iconicTaxon);
  const isTiny = sizeMeters < 0.05;

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
          {isTiny ? (
            <HandWithDot height={Math.min(containerH * 0.55, kidH)} />
          ) : (
            <AnimalSilhouette height={animalH} group={group} />
          )}
          <p className="mt-1 text-xs font-semibold text-foreground/60">
            {formatSize(sizeMeters)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-foreground/70">
        {describeSize(sizeMeters)}
      </p>
    </section>
  );
}

/* ─── Kid silhouette ─── */
// Path vectorizado por Gemini desde foto de silueta — viewBox 0 0 165 323
// Solo el path negro (fill #000000), sin artefactos del fondo.
const KID_SVG_PATH = 'M62.10 296.91 c-4.13 -0.47 -7.51 -1.43 -9.37 -2.69 c-1.70 -1.12 -2.06 -1.82 -2.06 -4.01 c0 -2.08 0.61 -3.68 1.77 -4.64 l0.69 -0.61 l-0.94 -0.90 c-0.94 -0.85 -0.96 -0.92 -1.03 -2.53 c-0.13 -2.35 0.22 -3.45 1.52 -4.69 c1.26 -1.23 2.29 -1.61 5.60 -2.11 c1.97 -0.29 2.74 -0.52 4.75 -1.50 c2.24 -1.08 2.38 -1.17 1.97 -1.46 c-0.72 -0.52 -1.12 -1.52 -1.12 -2.87 c0 -2.47 0.99 -3.25 4.10 -3.25 c1.08 0 2.29 0.13 2.80 0.31 c0.52 0.18 0.96 0.27 1.03 0.18 c0.04 -0.09 0.16 -0.87 0.25 -1.73 c0.11 -1.19 0.07 -1.82 -0.22 -2.58 c-0.52 -1.39 -0.69 -5.38 -0.34 -7.56 c0.13 -0.94 0.65 -2.94 1.12 -4.44 c0.94 -2.89 1.79 -6.05 1.79 -6.57 c0 -0.49 -2.85 -7.62 -3.45 -8.65 c-0.29 -0.49 -1.23 -1.79 -2.08 -2.87 c-2.85 -3.61 -3.97 -5.94 -4.46 -9.26 c-0.38 -2.53 -0.99 -11.93 -0.99 -15.40 c0 -2.06 -0.09 -2.89 -0.45 -3.81 c-0.94 -2.56 -1.19 -4.19 -1.21 -8.14 l-0.02 -3.81 l-1.19 -2.24 c-0.63 -1.23 -1.61 -3.05 -2.17 -4.04 c-1.19 -2.15 -1.43 -3.47 -0.94 -5.40 c0.20 -0.72 0.27 -1.39 0.20 -1.48 c-0.09 -0.07 -1.41 -0.40 -2.96 -0.74 c-3.32 -0.72 -6.03 -1.66 -7.08 -2.47 c-0.67 -0.52 -0.76 -0.69 -0.76 -1.64 c0 -0.69 0.27 -1.64 0.78 -2.87 c1.10 -2.53 1.77 -6.86 1.66 -10.51 c-0.16 -5.13 -0.04 -9.89 0.34 -13.34 c0.20 -1.91 0.45 -6.10 0.58 -9.30 c0.22 -6.64 0.38 -7.58 2.11 -12.89 c0.67 -2.04 1.37 -4.60 1.57 -5.72 c1.48 -8.41 1.61 -8.90 3.54 -13.56 c2.56 -6.12 2.96 -7.64 3.86 -14.75 c0.90 -7.02 1.43 -7.69 8.88 -11.30 c1.79 -0.87 3.27 -1.61 3.30 -1.64 c0.16 -0.09 -1.14 -4.82 -1.73 -6.37 c-1.21 -3.12 -2.42 -4.13 -7.15 -5.90 c-3.59 -1.35 -4.60 -1.97 -5.31 -3.36 c-0.40 -0.76 -0.40 -3.16 0 -4.48 c0.25 -0.85 0.25 -1.10 0 -1.55 c-0.16 -0.29 -0.29 -1.01 -0.31 -1.59 c0 -0.90 0.09 -1.12 0.56 -1.43 c0.47 -0.29 0.56 -0.54 0.56 -1.39 c0 -0.90 0.11 -1.10 0.90 -1.84 l0.87 -0.81 l-0.31 -0.90 c-0.58 -1.64 -0.29 -3.36 0.67 -3.99 c0.29 -0.18 1.26 -0.52 2.13 -0.72 c2.20 -0.49 3.32 -1.55 4.01 -3.79 c0.65 -2.04 2.02 -4.95 2.96 -6.32 c0.72 -1.01 0.76 -1.17 0.69 -2.76 c-0.04 -1.35 0.02 -1.82 0.36 -2.38 c1.01 -1.59 4.37 -3.61 7.04 -4.21 c1.73 -0.40 14.19 -0.49 16.50 -0.13 c3.59 0.58 8.90 2.74 13.70 5.58 c2.74 1.61 3.74 2.53 3.97 3.56 c0.22 1.08 0.29 1.17 0.74 1.17 c0.72 0 0.96 0.76 0.87 2.82 c-0.07 1.75 -0.04 1.88 0.38 1.88 c0.85 0.02 2.31 0.85 2.67 1.52 c0.25 0.49 0.34 1.46 0.34 4.21 c-0.02 1.95 -0.09 3.77 -0.18 3.99 c-0.09 0.25 -0.04 0.81 0.11 1.23 c0.34 0.94 0.40 3.79 0.11 4.57 c-0.11 0.29 -0.83 1.23 -1.57 2.06 c-0.74 0.83 -1.66 2.13 -2.06 2.89 c-1.84 3.47 -3.56 5.60 -5.69 6.97 c-1.30 0.85 -5.47 2.69 -8.32 3.70 c-1.10 0.38 -2.91 1.21 -4.04 1.82 l-2.06 1.14 l-0.09 2.60 c-0.09 2.80 0.16 4.66 0.94 6.88 c1.57 4.48 2.22 8.38 3.25 19.32 c0.63 6.88 0.85 8.63 1.50 12.06 c0.47 2.53 0.47 5.02 -0.02 6.84 c-0.13 0.43 -0.34 2 -0.47 3.47 c-0.34 3.50 -1.12 5.85 -3.25 9.80 c-0.92 1.70 -1.68 3.21 -1.68 3.36 c0 0.16 0.36 0.85 0.78 1.55 c2.22 3.59 1.97 7.87 -0.90 15.22 l-0.38 1.01 l1.35 2.80 c1.82 3.72 2.62 6.25 3.30 10.22 c0.67 3.88 0.74 6.95 0.18 8 c-0.20 0.40 -0.45 1.61 -0.54 2.74 c-0.36 3.70 -1.32 5.92 -3.72 8.52 c-0.99 1.05 -1.61 1.93 -1.55 2.13 c0.04 0.18 0.38 0.99 0.72 1.79 c0.52 1.26 0.61 1.77 0.61 3.70 c0 2.44 -0.58 4.93 -2.22 9.46 l-0.78 2.17 l0.85 1.19 c1.50 2.11 1.86 2.82 1.86 3.77 c0 0.94 -0.56 2.38 -1.35 3.47 l-0.47 0.65 l0.49 0.49 c0.40 0.40 0.47 0.67 0.38 1.93 l-0.09 1.43 l0.99 0.81 c1.43 1.17 1.68 1.93 1.59 4.78 l-0.09 2.40 l0.74 0.83 c0.83 0.96 0.92 1.73 0.38 4.06 c-0.36 1.46 -0.34 1.50 0.34 3.59 c0.76 2.44 1.23 5.04 1.03 5.99 c-0.11 0.52 0 0.83 0.43 1.32 c1.03 1.26 1.26 2.94 0.65 5.31 c-0.34 1.35 -0.34 1.52 0.04 2.80 c0.29 1.01 0.40 2.15 0.43 4.08 c0 3.07 -0.31 4.42 -1.55 6.43 c-0.72 1.21 -0.76 1.39 -0.83 3.81 c-0.09 2.51 -0.07 2.56 0.67 4.06 c0.94 1.88 1.21 4.42 0.61 5.85 c-0.34 0.83 -0.34 0.94 0.09 2.11 c0.27 0.67 0.56 2.24 0.67 3.50 c0.18 1.84 0.36 2.51 0.92 3.59 c0.61 1.17 0.69 1.61 0.81 3.74 c0.11 2.13 0.09 2.49 -0.34 3.36 c-1.10 2.24 -4.30 3.21 -12.55 3.79 c-4.28 0.29 -6.93 0.29 -7.11 0.02 c-0.07 -0.13 -0.54 -0.09 -1.19 0.11 c-2.53 0.78 -6.79 1.26 -12.15 1.32 c-2.89 0.04 -5.63 0.02 -6.05 -0.02 Z';

function KidSilhouette({ height }: { height: number }) {
  return (
    <svg
      viewBox="0 0 165 323"
      style={{ height, width: 'auto' }}
      preserveAspectRatio="xMidYMax meet"
    >
      <path d={KID_SVG_PATH} fill={FILL_KID} />
    </svg>
  );
}

/* ─── Animal silhouette dispatcher ─── */

function AnimalSilhouette({ height, group }: { height: number; group: AnimalGroup }) {
  const style: CSSProperties = { height, width: 'auto', maxWidth: height * 2.5 };
  switch (group) {
    case 'bird':    return <BirdSvg    style={style} />;
    case 'mammal':  return <MammalSvg  style={style} />;
    case 'fish':    return <FishSvg    style={style} />;
    case 'insect':  return <InsectSvg  style={style} />;
    case 'reptile': return <ReptileSvg style={style} />;
    case 'spider':  return <SpiderSvg  style={style} />;
    default:        return <MammalSvg  style={style} />;
  }
}

/* ─── Hand with tiny dot (for animals < 5 cm) ─── */

function HandWithDot({ height }: { height: number }) {
  return (
    <svg
      viewBox="0 0 80 120"
      style={{ height, width: 'auto' }}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Palm */}
      <path d="M 18 75 Q 12 112 18 118 L 62 118 Q 68 112 62 75 Z" fill={FILL_ANIMAL} />
      {/* Thumb */}
      <path d="M 18 80 Q 7 66 10 52 Q 13 44 21 48 Q 18 60 20 75 Z" fill={FILL_ANIMAL} />
      {/* Index */}
      <rect x="22" y="40" width="9" height="38" rx="4.5" fill={FILL_ANIMAL} />
      {/* Middle */}
      <rect x="33" y="32" width="9" height="45" rx="4.5" fill={FILL_ANIMAL} />
      {/* Ring */}
      <rect x="44" y="36" width="9" height="42" rx="4.5" fill={FILL_ANIMAL} />
      {/* Pinky */}
      <rect x="55" y="42" width="8" height="36" rx="4" fill={FILL_ANIMAL} />
      {/* Tiny animal dot on palm */}
      <circle cx="40" cy="94" r="3.5" fill="#3D2B1F" opacity="0.55" />
    </svg>
  );
}

/* ─── Individual animal SVGs ─── */

function BirdSvg({ style }: { style: CSSProperties }) {
  const f = FILL_ANIMAL;
  return (
    <svg viewBox="0 0 150 108" style={style} preserveAspectRatio="xMidYMax meet">
      {/* Cuerpo ovalado, alargado horizontalmente */}
      <ellipse cx="64" cy="60" rx="50" ry="26" fill={f} />
      {/* Ala: arco suave encima del cuerpo */}
      <path d="M 22 52 C 35 30 75 22 108 40 C 95 50 70 52 35 56 Z" fill={f} />
      {/* Cola bifurcada a la izquierda */}
      <path d="M 15 60 C 4 48 0 38 2 30 C 8 42 14 54 15 60 Z" fill={f} />
      <path d="M 15 60 C 4 72 0 82 2 90 C 8 78 14 66 15 60 Z" fill={f} />
      {/* Cabeza */}
      <circle cx="118" cy="44" r="18" fill={f} />
      {/* Pico apuntando a la derecha */}
      <path d="M 133 40 L 148 44 L 133 48 Z" fill={f} />
      {/* Patas */}
      <rect x="56" y="84" width="5" height="20" rx="2" fill={f} />
      <rect x="70" y="84" width="5" height="20" rx="2" fill={f} />
      {/* Dedos */}
      <rect x="46" y="102" width="20" height="4" rx="2" fill={f} />
      <rect x="60" y="102" width="20" height="4" rx="2" fill={f} />
    </svg>
  );
}

function MammalSvg({ style }: { style: CSSProperties }) {
  const f = FILL_ANIMAL;
  return (
    <svg viewBox="0 0 200 130" style={style} preserveAspectRatio="xMidYMax meet">
      {/* Body */}
      <ellipse cx="90" cy="65" rx="65" ry="38" fill={f} />
      {/* Head */}
      <circle cx="163" cy="52" r="28" fill={f} />
      {/* Snout */}
      <ellipse cx="185" cy="62" rx="13" ry="10" fill={f} />
      {/* Ear */}
      <path d="M 158 26 L 146 4 L 172 20 Z" fill={f} />
      {/* Tail */}
      <path d="M 26 50 Q 8 34 10 18 Q 14 10 22 14 Q 17 28 30 44 Z" fill={f} />
      {/* Front legs */}
      <rect x="128" y="100" width="14" height="28" rx="5" fill={f} />
      <rect x="148" y="100" width="14" height="28" rx="5" fill={f} />
      {/* Back legs */}
      <rect x="48" y="100" width="14" height="28" rx="5" fill={f} />
      <rect x="68" y="100" width="14" height="28" rx="5" fill={f} />
    </svg>
  );
}

function FishSvg({ style }: { style: CSSProperties }) {
  const f = FILL_ANIMAL;
  return (
    <svg viewBox="0 0 165 95" style={style} preserveAspectRatio="xMidYMax meet">
      {/* Body */}
      <ellipse cx="88" cy="48" rx="57" ry="30" fill={f} />
      {/* Tail fin */}
      <path d="M 32 48 L 5 24 L 5 72 Z" fill={f} />
      {/* Dorsal fin */}
      <path d="M 68 19 Q 95 5 120 19 L 115 30 Q 92 18 73 29 Z" fill={f} />
      {/* Pectoral fin */}
      <path d="M 103 55 Q 125 65 122 78 Q 108 70 98 60 Z" fill={f} />
    </svg>
  );
}

function InsectSvg({ style }: { style: CSSProperties }) {
  const f = FILL_ANIMAL;
  return (
    <svg viewBox="0 0 140 90" style={style} preserveAspectRatio="xMidYMax meet">
      {/* Abdomen */}
      <ellipse cx="36" cy="50" rx="30" ry="22" fill={f} />
      {/* Thorax */}
      <ellipse cx="74" cy="46" rx="19" ry="19" fill={f} />
      {/* Head */}
      <circle cx="108" cy="44" r="15" fill={f} />
      {/* Antennae */}
      <path d="M 116 31 Q 124 16 120 6" stroke={f} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 106 30 Q 108 14 112 6" stroke={f} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Right legs (upper, mid, lower) */}
      <path d="M 82 40 L 97 22 L 92 18 L 78 36 Z" fill={f} />
      <path d="M 80 48 L 100 40 L 100 46 L 82 54 Z" fill={f} />
      <path d="M 76 56 L 92 70 L 87 74 L 72 60 Z" fill={f} />
      {/* Left legs */}
      <path d="M 66 40 L 51 22 L 56 18 L 70 36 Z" fill={f} />
      <path d="M 66 48 L 46 40 L 46 46 L 64 54 Z" fill={f} />
      <path d="M 68 56 L 52 70 L 57 74 L 72 60 Z" fill={f} />
    </svg>
  );
}

function ReptileSvg({ style }: { style: CSSProperties }) {
  const f = FILL_ANIMAL;
  return (
    <svg viewBox="0 0 230 85" style={style} preserveAspectRatio="xMidYMax meet">
      {/* Long body + tail combined */}
      <path d="M 10 44 Q 30 38 60 42 L 185 42 Q 205 42 205 50 Q 205 58 185 58 L 60 58 Q 30 62 10 56 Q 5 50 10 44 Z" fill={f} />
      {/* Head */}
      <ellipse cx="198" cy="45" rx="20" ry="13" fill={f} />
      {/* Tongue */}
      <path d="M 216 42 L 226 38" stroke={f} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 216 42 L 226 46" stroke={f} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Eye */}
      <circle cx="206" cy="41" r="3.5" fill="#3D2B1F" opacity="0.4" />
      {/* Front legs */}
      <path d="M 158 56 L 162 76 L 152 76 Z" fill={f} />
      <path d="M 175 56 L 179 76 L 169 76 Z" fill={f} />
      {/* Back legs */}
      <path d="M 68 56 L 72 76 L 62 76 Z" fill={f} />
      <path d="M 85 56 L 89 76 L 79 76 Z" fill={f} />
    </svg>
  );
}

function SpiderSvg({ style }: { style: CSSProperties }) {
  const f = FILL_ANIMAL;
  return (
    <svg viewBox="0 0 130 95" style={style} preserveAspectRatio="xMidYMax meet">
      {/* Abdomen */}
      <ellipse cx="38" cy="52" rx="30" ry="26" fill={f} />
      {/* Cephalothorax */}
      <circle cx="80" cy="48" r="20" fill={f} />
      {/* Right legs */}
      <path d="M 92 40 L 112 20 L 116 25 L 97 44 Z" fill={f} />
      <path d="M 94 44 L 118 36 L 118 42 L 96 50 Z" fill={f} />
      <path d="M 92 55 L 118 60 L 116 66 L 91 59 Z" fill={f} />
      <path d="M 88 60 L 110 78 L 106 83 L 85 64 Z" fill={f} />
      {/* Left legs */}
      <path d="M 68 40 L 48 20 L 44 25 L 63 44 Z" fill={f} />
      <path d="M 66 44 L 42 36 L 42 42 L 64 50 Z" fill={f} />
      <path d="M 68 55 L 42 60 L 44 66 L 69 59 Z" fill={f} />
      <path d="M 72 60 L 50 78 L 54 83 L 75 64 Z" fill={f} />
    </svg>
  );
}

/* ─── Helpers ─── */

function formatSize(m: number): string {
  if (m < 0.01) return `${Math.round(m * 1000)} mm`;
  if (m < 1) return `${Math.round(m * 100)} cm`;
  return `${m % 1 === 0 ? m : m.toFixed(1)} m`;
}

function describeSize(m: number): string {
  const ratio = m / KID_HEIGHT_M;
  if (m < 0.01) return '¡Casi invisible! Cabe en la punta de tu dedo.';
  if (m < 0.05) return '¡Cabe entero en la palma de tu mano!';
  if (m < 0.3) return '¡Cabe en tu mano!';
  if (m < 1) return 'Más pequeño que tú.';
  if (m < 1.5) return '¡Casi tan alto como tú!';
  if (m < 3) return 'Más grande que tú.';
  return `¡${ratio.toFixed(0)} veces más grande que tú!`;
}
