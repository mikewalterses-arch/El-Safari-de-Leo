import { clsx, type ClassValue } from 'clsx';

/** Atajo para componer clases Tailwind condicionales. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
