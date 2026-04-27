import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { SupervisionStrip } from './SupervisionStrip';
import { useUserProfile } from '@/features/user/useUserProfile';
import { Avatar } from '@/components/ui/Avatar';

export function Header() {
  const { profile } = useUserProfile();
  const kidName = profile?.displayName?.trim() || 'Leo';
  const title = `El Safari de ${kidName}`;

  return (
    <div className="sticky top-0 z-[1100]">
      <header className="border-b border-foreground/10 bg-surface/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold">
            <img
              src="/icons/safari-de-leo-source.svg"
              alt=""
              className="h-9 w-9 rounded-full"
            />
            <span className="truncate text-lg">{title}</span>
          </Link>
          <Link to="/perfil" aria-label="Perfil" className="shrink-0">
            {profile ? (
              <Avatar
                icon={profile.avatarIcon}
                color={profile.avatarColor}
                fallbackInitial={profile.displayName.charAt(0)}
                size={40}
              />
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground">
                <UserRound className="h-5 w-5" strokeWidth={2} />
              </span>
            )}
          </Link>
        </div>
      </header>
      <SupervisionStrip />
    </div>
  );
}
