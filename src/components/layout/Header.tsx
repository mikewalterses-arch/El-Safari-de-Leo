import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { SupervisionStrip } from './SupervisionStrip';

export function Header() {
  return (
    <div className="sticky top-0 z-10">
      <header className="border-b border-foreground/10 bg-surface/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-lg text-foreground">
              L
            </span>
            <span className="text-lg">El Safari de Leo</span>
          </Link>
          <Link
            to="/perfil"
            aria-label="Perfil"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10"
          >
            <UserRound className="h-5 w-5" strokeWidth={2} />
          </Link>
        </div>
      </header>
      <SupervisionStrip />
    </div>
  );
}
