import { ArrowRight, Lock } from 'lucide-react';
import { useT } from '@/i18n';
import { useUserTypeStore } from './userType';

export function NeedsPapa() {
  const t = useT();
  const setUserType = useUserTypeStore((s) => s.setUserType);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-6 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
        <Lock className="h-10 w-10 text-accent" strokeWidth={2} />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold">{t('needsPapa.title')}</h1>
      <p className="mt-3 max-w-md text-foreground/70">
        {t('needsPapa.body')}
      </p>
      <button
        type="button"
        onClick={() => setUserType('papa')}
        className="mt-8 inline-flex items-center gap-2 rounded-button bg-accent px-6 py-3 text-base font-extrabold text-foreground shadow-card"
      >
        {t('needsPapa.cta')}
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
