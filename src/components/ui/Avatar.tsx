import {
  Bird,
  Bug,
  Cat,
  Dog,
  Fish,
  PawPrint,
  Rabbit,
  Rat,
  Snail,
  Squirrel,
  Turtle,
  Worm,
  type LucideIcon,
} from 'lucide-react';

/**
 * Avatar circular: fondo de color de marca + icono del animal elegido.
 * Si no hay icon, muestra la inicial del nombre.
 *
 * Lista de presets (icon + color) — usados como avatares preset.
 */

const ICON_MAP: Record<string, LucideIcon> = {
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  bug: Bug,
  rabbit: Rabbit,
  squirrel: Squirrel,
  turtle: Turtle,
  rat: Rat,
  snail: Snail,
  worm: Worm,
  paw: PawPrint,
};

export interface AvatarPreset {
  id: string;
  icon: string;
  color: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  // Mamíferos
  { id: 'cat-coral', icon: 'cat', color: '#FF9B85' },
  { id: 'cat-turquoise', icon: 'cat', color: '#7DD3C7' },
  { id: 'dog-yellow', icon: 'dog', color: '#FFE5A0' },
  { id: 'dog-blue', icon: 'dog', color: '#90CAF9' },
  { id: 'rabbit-pink', icon: 'rabbit', color: '#F8BBD0' },
  { id: 'rabbit-lime', icon: 'rabbit', color: '#B8E0A0' },
  { id: 'squirrel-orange', icon: 'squirrel', color: '#FFCC80' },
  { id: 'rat-purple', icon: 'rat', color: '#B39DDB' },
  // Aves
  { id: 'bird-lime', icon: 'bird', color: '#B8E0A0' },
  { id: 'bird-coral', icon: 'bird', color: '#FF9B85' },
  { id: 'bird-blue', icon: 'bird', color: '#90CAF9' },
  // Acuáticos
  { id: 'fish-turquoise', icon: 'fish', color: '#7DD3C7' },
  { id: 'fish-blue', icon: 'fish', color: '#90CAF9' },
  { id: 'turtle-lime', icon: 'turtle', color: '#B8E0A0' },
  // Invertebrados
  { id: 'bug-lime', icon: 'bug', color: '#B8E0A0' },
  { id: 'bug-coral', icon: 'bug', color: '#FF9B85' },
  { id: 'snail-yellow', icon: 'snail', color: '#FFE5A0' },
  { id: 'worm-pink', icon: 'worm', color: '#F8BBD0' },
  // Genérico
  { id: 'paw-orange', icon: 'paw', color: '#FFCC80' },
  { id: 'paw-purple', icon: 'paw', color: '#B39DDB' },
];

interface AvatarProps {
  icon?: string;
  color: string;
  fallbackInitial?: string;
  size?: number;
  className?: string;
}

export function Avatar({
  icon,
  color,
  fallbackInitial = '',
  size = 40,
  className,
}: AvatarProps) {
  const Icon = icon ? ICON_MAP[icon] : null;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-foreground ${className ?? ''}`}
      style={{ background: color, width: size, height: size }}
    >
      {Icon ? (
        <Icon size={Math.round(size * 0.55)} strokeWidth={2} />
      ) : (
        <span
          className="font-extrabold"
          style={{ fontSize: Math.round(size * 0.45) }}
        >
          {fallbackInitial.toUpperCase()}
        </span>
      )}
    </span>
  );
}
