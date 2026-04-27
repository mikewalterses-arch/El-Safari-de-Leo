import { Bird, Bug, Cat, Fish, Rabbit, Squirrel, Turtle, type LucideIcon } from 'lucide-react';

/**
 * Avatar circular: fondo de color de marca + icono del animal elegido.
 * Si no hay icon, muestra la inicial del nombre.
 *
 * Lista de presets (icon + color) — usados como avatares preset en Perfil.
 */

const ICON_MAP: Record<string, LucideIcon> = {
  cat: Cat,
  bird: Bird,
  fish: Fish,
  bug: Bug,
  rabbit: Rabbit,
  squirrel: Squirrel,
  turtle: Turtle,
};

export interface AvatarPreset {
  id: string;
  icon: string;
  color: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'cat-coral', icon: 'cat', color: '#FF9B85' },
  { id: 'cat-turquoise', icon: 'cat', color: '#7DD3C7' },
  { id: 'rabbit-yellow', icon: 'rabbit', color: '#FFE5A0' },
  { id: 'bird-lime', icon: 'bird', color: '#B8E0A0' },
  { id: 'bird-coral', icon: 'bird', color: '#FF9B85' },
  { id: 'fish-turquoise', icon: 'fish', color: '#7DD3C7' },
  { id: 'turtle-lime', icon: 'turtle', color: '#B8E0A0' },
  { id: 'squirrel-yellow', icon: 'squirrel', color: '#FFE5A0' },
  { id: 'bug-lime', icon: 'bug', color: '#B8E0A0' },
  { id: 'bug-coral', icon: 'bug', color: '#FF9B85' },
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
