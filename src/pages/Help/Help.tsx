import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Compass,
  Map as MapIcon,
  Search,
  Sparkles,
  Trophy,
  Users,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface Section {
  icon: LucideIcon;
  title: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    icon: Camera,
    title: 'Añadir un avistamiento',
    body: 'Toca el botón "+" abajo en el centro. Haz una foto al animal o elige una de la galería. Después busca su nombre en la lista (puedes escribir en castellano o euskera). Confírmalo, añade alguna nota si quieres y guárdalo. ¡Ya lo tienes en tu colección!',
  },
  {
    icon: Search,
    title: 'Buscar un animal',
    body: 'Cuando hagas la foto, aparece un buscador. Escribe el nombre y verás coincidencias del catálogo de iNaturalist. Si no estás seguro, prueba con un nombre similar (por ejemplo "gorrión común"). El buscador funciona en castellano y euskera.',
  },
  {
    icon: Compass,
    title: 'Cerca de ti',
    body: 'En la pantalla de Inicio verás un mapa con los animales que han visto otras personas cerca de tu ubicación. Toca cualquiera para ver más información o añadirlo directamente a tu colección.',
  },
  {
    icon: MapIcon,
    title: 'Mapa de tus aventuras',
    body: 'En la pestaña Mapa están todos tus avistamientos colocados donde los hiciste. Toca cualquier pin para abrir el detalle del animal.',
  },
  {
    icon: Sparkles,
    title: 'Ver detalles de un animal',
    body: 'En tu Colección o desde el Mapa, toca un animal para abrir su ficha. Verás tu foto, info de Wikipedia, sus características (qué tipo de animal es, qué come, dónde vive…) y una comparación con tu tamaño. Si tiene sonido, podrás escucharlo.',
  },
  {
    icon: Volume2,
    title: 'Sonidos de animales',
    body: 'Algunos animales tienen sonido grabado. Mira el botón de altavoz en su ficha. Si está, puedes escuchar cómo cantan, ladran o rugen.',
  },
  {
    icon: Trophy,
    title: 'Logros',
    body: 'Cada vez que descubras un animal nuevo o cumplas un reto desbloqueas un logro. Hay logros por número total, por clases (mamíferos, aves, peces, reptiles, anfibios, invertebrados) y por hitos especiales. Los puedes ver en Perfil.',
  },
  {
    icon: Users,
    title: 'Varios peques',
    body: 'En Perfil puedes añadir más peques (hermanos, primos, amigos). Cada uno tiene su colección, sus avistamientos y sus logros separados. Cambia entre ellos tocando su tarjeta.',
  },
];

export function Help() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold">Cómo funciona</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <p className="mb-6 text-base leading-relaxed text-foreground/75">
          Una guía rápida de todo lo que la app puede hacer. Toca cualquier
          sección para abrirla.
        </p>

        <div className="space-y-3">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-card border border-foreground/10 bg-cream"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 text-base font-extrabold">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 flex-shrink-0 text-foreground/50 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                    strokeWidth={2.5}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-foreground/10 px-4 py-4 text-base leading-relaxed text-foreground/80">
                    {section.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-foreground/50">
          Hecho con cariño para los pequeños exploradores.
        </p>
      </main>
    </div>
  );
}
