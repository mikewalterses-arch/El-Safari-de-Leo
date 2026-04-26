import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SUPPORTED_LOCALES, type Locale } from './messages';

const DEFAULT_LOCALE: Locale = 'es';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        if (!SUPPORTED_LOCALES.includes(locale)) return;
        set({ locale });
      },
    }),
    { name: 'safarideleo:locale' },
  ),
);

/** Útil fuera de React (ej. clientes de Wikipedia) — devuelve el locale actual. */
export function getLocale(): Locale {
  return useLocaleStore.getState().locale;
}
