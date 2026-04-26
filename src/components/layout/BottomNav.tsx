import { NavLink } from 'react-router-dom';
import {
  Home,
  Map as MapIcon,
  Plus,
  Library,
  BookText,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useT } from '@/i18n';

interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
  primary?: boolean;
}

const items: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: Home, exact: true },
  { to: '/mapa', labelKey: 'nav.map', icon: MapIcon },
  { to: '/nuevo', labelKey: 'nav.new', icon: Plus, primary: true },
  { to: '/coleccion', labelKey: 'nav.collection', icon: Library },
  { to: '/diario', labelKey: 'nav.diary', icon: BookText },
];

// TODO(fase-5): badge de notificación cuando haya logro nuevo
export function BottomNav() {
  const t = useT();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-foreground/10 bg-surface/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, labelKey, icon: Icon, exact, primary }) => (
          <li key={to} className="flex">
            <NavLink
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'flex w-full flex-col items-center justify-center gap-1 py-2 text-xs font-semibold',
                  !primary && (isActive ? 'text-primary' : 'text-foreground/60'),
                )
              }
            >
              {primary ? (
                <>
                  <span className="-mt-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-surface shadow-card">
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <span className="text-foreground/80">{t(labelKey)}</span>
                </>
              ) : (
                <>
                  <Icon className="h-6 w-6" strokeWidth={2} />
                  <span>{t(labelKey)}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
