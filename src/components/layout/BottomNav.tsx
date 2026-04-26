import { NavLink } from 'react-router-dom';
import { Home, Map as MapIcon, Plus, Library, BookText, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  primary?: boolean;
}

const items: NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home, exact: true },
  { to: '/mapa', label: 'Mapa', icon: MapIcon },
  { to: '/nuevo', label: 'Nuevo', icon: Plus, primary: true },
  { to: '/coleccion', label: 'Colección', icon: Library },
  { to: '/diario', label: 'Diario', icon: BookText },
];

// TODO(fase-5): badge de notificación cuando haya logro nuevo
export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-foreground/10 bg-surface/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon, exact, primary }) => (
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
                  <span className="text-foreground/80">{label}</span>
                </>
              ) : (
                <>
                  <Icon className="h-6 w-6" strokeWidth={2} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
