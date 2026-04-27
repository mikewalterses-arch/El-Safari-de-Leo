import { Baby, ChevronRight, UserRound } from 'lucide-react';
import { useT } from '@/i18n';
import { useUserTypeStore, type UserType } from './userType';

export function WhoAreYou() {
  const t = useT();
  const setUserType = useUserTypeStore((s) => s.setUserType);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-foreground">
          L
        </span>
        <h1 className="mt-6 text-3xl font-extrabold">{t('whoAreYou.title')}</h1>
        <p className="mt-2 text-foreground/60">{t('whoAreYou.subtitle')}</p>

        <div className="mt-10 grid gap-4">
          <UserButton
            label={t('whoAreYou.leo')}
            icon={Baby}
            tone="primary"
            onClick={() => setUserType('leo')}
          />
          <UserButton
            label={t('whoAreYou.papa')}
            icon={UserRound}
            tone="accent"
            onClick={() => setUserType('papa')}
          />
        </div>
      </div>
    </div>
  );
}

interface UserButtonProps {
  label: string;
  icon: typeof Baby;
  tone: 'primary' | 'accent';
  onClick: (t: UserType) => void;
}

function UserButton({ label, icon: Icon, tone, onClick }: UserButtonProps) {
  const bg = tone === 'primary' ? 'bg-primary' : 'bg-accent';
  return (
    <button
      type="button"
      onClick={() => onClick(tone === 'primary' ? 'leo' : 'papa')}
      className={`flex w-full items-center gap-4 rounded-card ${bg} p-5 text-foreground shadow-card transition-transform active:scale-[0.98]`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface/30">
        <Icon className="h-9 w-9" strokeWidth={2} />
      </span>
      <span className="flex-1 text-left text-2xl font-extrabold">{label}</span>
      <ChevronRight className="h-6 w-6 opacity-60" />
    </button>
  );
}
