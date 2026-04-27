import { Users } from 'lucide-react';
import { useT } from '@/i18n';
import { useUserTypeStore } from '@/features/auth/userType';

/**
 * Banda persistente bajo el header SOLO en modo Leo. Recuerda con sutileza
 * que el móvil se usa con papá. La idea es que Leo lo lea repetidamente
 * sin que sea molesto, para que vaya interiorizando el hábito.
 */
export function SupervisionStrip() {
  const t = useT();
  const userType = useUserTypeStore((s) => s.userType);
  if (userType !== 'leo') return null;
  return (
    <div className="border-b border-foreground/5 bg-highlight/50 px-4 py-1.5">
      <div className="mx-auto flex max-w-md items-center gap-2 text-xs font-semibold text-foreground/80">
        <Users className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        <span>{t('supervision.banner')}</span>
      </div>
    </div>
  );
}
