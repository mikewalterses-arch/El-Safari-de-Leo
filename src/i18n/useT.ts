import { MESSAGES } from './messages';
import { useLocaleStore } from './store';

type Vars = Record<string, string | number>;

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(vars[key] ?? `{${key}}`),
  );
}

/**
 * Hook de traducción reactivo. El componente que lo use se re-renderiza al
 * cambiar el locale.
 *
 * Soporta interpolación con {nombre} y atajo de plurales pasando { count: N }
 * — busca primero `key.one`/`key.other` y cae a `key` si no existen.
 */
export function useT() {
  const locale = useLocaleStore((s) => s.locale);

  return (key: string, vars?: Vars): string => {
    const messages = MESSAGES[locale];
    const fallback = MESSAGES.es;

    if (vars && typeof vars.count === 'number') {
      const pluralKey = `${key}.${vars.count === 1 ? 'one' : 'other'}`;
      const tpl =
        messages[pluralKey] ?? fallback[pluralKey] ?? messages[key] ?? fallback[key] ?? key;
      return interpolate(tpl, vars);
    }

    const tpl = messages[key] ?? fallback[key] ?? key;
    return interpolate(tpl, vars);
  };
}
