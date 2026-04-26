import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { useT } from '@/i18n';

const PALETTE = ['#7DD3C7', '#FF9B85', '#FFE5A0', '#B8E0A0'];

/**
 * Pantalla de celebración cuando isFirstDiscovery=true: confeti animado + texto
 * con efecto de muelle. Se muestra ~2.5 s antes de redirigir al diario.
 */
export function DiscoveryCelebration({ animalName }: { animalName: string }) {
  const t = useT();

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: PALETTE,
      ticks: 200,
    });
    // segunda salva con un pequeño delay para que dure más
    const handle = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        startVelocity: 35,
        origin: { y: 0.5 },
        colors: PALETTE,
      });
    }, 350);
    return () => clearTimeout(handle);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <motion.span
        initial={{ scale: 0, rotate: -45 }}
        animate={{
          scale: [0, 1.2, 1],
          rotate: [0, 12, -8, 4, 0],
        }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex h-32 w-32 items-center justify-center rounded-full bg-accent shadow-card"
      >
        <Sparkles className="h-16 w-16 text-foreground" strokeWidth={2.5} />
      </motion.span>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold">
          {t('discovery.title')}
        </h2>
        <p className="mt-2 text-lg font-semibold text-accent">{animalName}</p>
      </motion.div>
    </div>
  );
}
