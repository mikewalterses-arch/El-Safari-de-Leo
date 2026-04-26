import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Contenedor responsivo: ancho máx pensado para móvil con margen cómodo en desktop. */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-md px-4 py-6', className)}>
      {children}
    </div>
  );
}
