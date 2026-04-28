import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';
import { addKid } from './kidMutations';
import { useActiveKidStore } from './activeKid';
import { Avatar, AVATAR_PRESETS } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';

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
  const [presetId, setPresetId] = useState(AVATAR_PRESETS[0]!.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preset =
    AVATAR_PRESETS.find((p) => p.id === presetId) ?? AVATAR_PRESETS[0]!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !birthDate) return;
    setSaving(true);
    setError(null);
    try {
      const created = await addKid(user.uid, {
        displayName: name.trim(),
        birthDate: new Date(birthDate),
        avatarColor: preset.color,
        avatarIcon: preset.icon,
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                Elige un avatar
              </span>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_PRESETS.map((p) => {
                  const selected = p.id === presetId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPresetId(p.id)}
                      aria-label={p.id}
                      className={cn(
                        'flex aspect-square items-center justify-center rounded-full border-2 transition-transform',
                        selected
                          ? 'scale-110 border-foreground'
                          : 'border-transparent',
                      )}
                    >
                      <Avatar icon={p.icon} color={p.color} size={44} />
                    </button>
                  );
                })}
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
