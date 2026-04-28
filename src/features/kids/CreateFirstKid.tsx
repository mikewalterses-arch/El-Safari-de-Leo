import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { addKid } from './kidMutations';
import { useActiveKidStore } from './activeKid';

const COLORS = [
  '#FF9B85',
  '#7DD3C7',
  '#F8B400',
  '#A8DADC',
  '#FFD166',
  '#EF476F',
  '#06D6A0',
  '#118AB2',
];

/**
 * Pantalla bloqueante que se muestra cuando un usuario autenticado todavía no
 * tiene ningún peque en su perfil. Antes creábamos un "Leo" por defecto pero
 * provocaba inconsistencias de IDs y datos de plantilla. Ahora pedimos
 * explícitamente la creación del primer peque.
 */
export function CreateFirstKid() {
  const { user } = useAuth();
  const setActiveKidId = useActiveKidStore((s) => s.setActiveKidId);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [color, setColor] = useState(COLORS[0]!);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !birthDate) return;
    setSaving(true);
    setError(null);
    try {
      const created = await addKid(user.uid, {
        displayName: name.trim(),
        birthDate: new Date(birthDate),
        avatarColor: color,
      });
      // Activar el peque recién creado para que toda la app le filtre
      setActiveKidId(created.id);
    } catch (err) {
      console.error('CreateFirstKid failed', err);
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-surface text-foreground">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-highlight/60 shadow-card">
              <Sparkles className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <h1 className="mt-6 text-3xl font-extrabold leading-tight">
              ¡Bienvenido al Safari!
            </h1>
            <p className="mt-3 text-base leading-relaxed text-foreground/75">
              Antes de empezar, cuéntame quién va a usar la app. Puedes añadir
              más peques después desde Perfil.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-foreground/60">
                Nombre
              </span>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Leo"
                className="w-full rounded-button border-2 border-foreground/15 bg-cream px-4 py-3 text-base focus:border-primary focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-foreground/60">
                Fecha de nacimiento
              </span>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-button border-2 border-foreground/15 bg-cream px-4 py-3 text-base focus:border-primary focus:outline-none"
              />
            </label>

            <div>
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-foreground/60">
                Color
              </span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={c}
                    className={`h-10 w-10 rounded-full transition-transform ${
                      color === c
                        ? 'ring-4 ring-foreground/60 ring-offset-2 ring-offset-surface'
                        : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm font-semibold text-coral">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving || !name.trim() || !birthDate}
              className="w-full rounded-button bg-accent py-4 text-lg font-extrabold text-foreground shadow-card transition-transform active:translate-y-px disabled:opacity-50"
            >
              {saving ? 'Creando…' : 'Empezar el safari'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
