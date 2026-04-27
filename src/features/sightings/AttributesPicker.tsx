import type { ReactNode } from 'react';
import { useT } from '@/i18n';
import { cn } from '@/lib/cn';
import type {
  SightingActivity,
  SightingAttributes,
  SightingSize,
} from '@/types/models';

const SIZES: SightingSize[] = ['small', 'medium', 'large'];
const ACTIVITIES: SightingActivity[] = [
  'sleeping',
  'eating',
  'drinking',
  'flying',
  'swimming',
  'hiding',
  'playing',
  'walking',
];

interface ColorOption {
  id: string;
  hex: string;
}

const COLORS: ColorOption[] = [
  { id: 'white', hex: '#FFFFFF' },
  { id: 'black', hex: '#3D2B1F' },
  { id: 'brown', hex: '#8B5E3C' },
  { id: 'gray', hex: '#9CA3AF' },
  { id: 'yellow', hex: '#FFE5A0' },
  { id: 'orange', hex: '#FF9B85' },
  { id: 'red', hex: '#E04848' },
  { id: 'green', hex: '#B8E0A0' },
];

interface AttributesPickerProps {
  value: SightingAttributes;
  onChange: (next: SightingAttributes) => void;
}

/**
 * Modo compañero: tres preguntas opcionales que refuerzan la observación.
 * Cada chip es toggleable — pulsar el activo lo deselecciona.
 */
export function AttributesPicker({ value, onChange }: AttributesPickerProps) {
  const t = useT();

  const setSize = (s: SightingSize) =>
    onChange({ ...value, size: value.size === s ? undefined : s });
  const setActivity = (a: SightingActivity) =>
    onChange({ ...value, activity: value.activity === a ? undefined : a });
  const setColor = (c: string) =>
    onChange({ ...value, color: value.color === c ? undefined : c });

  return (
    <div className="space-y-4 rounded-card border border-foreground/10 bg-cream p-4">
      <Row label={t('attr.sizeLabel')}>
        {SIZES.map((s) => (
          <Chip key={s} active={value.size === s} onClick={() => setSize(s)}>
            {t(`attr.size.${s}`)}
          </Chip>
        ))}
      </Row>

      <Row label={t('attr.colorLabel')}>
        {COLORS.map((c) => (
          <ColorChip
            key={c.id}
            hex={c.hex}
            label={t(`attr.color.${c.id}`)}
            active={value.color === c.id}
            onClick={() => setColor(c.id)}
          />
        ))}
      </Row>

      <Row label={t('attr.activityLabel')}>
        {ACTIVITIES.map((a) => (
          <Chip
            key={a}
            active={value.activity === a}
            onClick={() => setActivity(a)}
          >
            {t(`attr.activity.${a}`)}
          </Chip>
        ))}
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-foreground/60">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-pill border px-3 py-1.5 text-sm font-semibold transition-colors',
        active
          ? 'border-primary bg-primary text-foreground'
          : 'border-foreground/15 bg-surface text-foreground/70',
      )}
    >
      {children}
    </button>
  );
}

interface ColorChipProps {
  hex: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

function ColorChip({ hex, label, active, onClick }: ColorChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-pill border px-3 py-1.5 text-sm font-semibold transition-colors',
        active
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-foreground/15 bg-surface text-foreground/70',
      )}
    >
      <span
        aria-hidden
        className="h-4 w-4 rounded-full border border-foreground/15"
        style={{ background: hex }}
      />
      {label}
    </button>
  );
}
