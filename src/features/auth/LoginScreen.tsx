import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { auth } from '@/lib/firebase';

type Mode = 'signin' | 'signup';

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // AuthGate detecta el cambio en useAuth y muestra la app.
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  const isSignup = mode === 'signup';

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <img
            src="/icons/safari-de-leo-source.svg"
            alt=""
            className="inline-block h-20 w-20 rounded-full"
          />
          <h1 className="mt-6 text-3xl font-extrabold">
            {isSignup ? 'Crear cuenta' : 'Configura el safari'}
          </h1>
          <p className="mt-2 text-foreground/70">
            {isSignup
              ? 'Elige el email y la contraseña que vas a usar.'
              : 'Esto solo es la primera vez. Después Leo no verá esta pantalla.'}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleAuth();
          }}
          className="mt-10 space-y-4"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                required
                autoComplete={isSignup ? 'email' : 'email'}
                placeholder="papa@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full rounded-button border border-foreground/15 bg-cream py-3 pl-10 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              {isSignup ? 'Elige una contraseña' : 'Contraseña'}
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type="password"
                required
                minLength={isSignup ? 6 : undefined}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder={isSignup ? 'Mínimo 6 caracteres' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full rounded-button border border-foreground/15 bg-cream py-3 pl-10 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              />
            </div>
          </label>

          {error && <p className="text-sm font-semibold text-coral">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-accent py-3 text-base font-extrabold text-foreground shadow-card disabled:opacity-50"
          >
            {submitting
              ? isSignup
                ? 'Creando...'
                : 'Entrando...'
              : isSignup
                ? 'Crear cuenta'
                : 'Entrar'}
            {!submitting && <ArrowRight className="h-5 w-5" strokeWidth={2.5} />}
          </button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          className="mt-6 w-full text-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {isSignup
            ? '¿Ya tienes cuenta? Entrar'
            : '¿Primera vez? Crear cuenta'}
        </button>
      </div>
    </div>
  );
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('email-already-in-use')) {
    return 'Ese email ya tiene cuenta. Pulsa "¿Ya tienes cuenta? Entrar" o bórralo primero en Firebase Console.';
  }
  if (msg.includes('weak-password')) {
    return 'La contraseña es muy débil. Pon al menos 6 caracteres.';
  }
  if (msg.includes('invalid-credential') || msg.includes('wrong-password')) {
    return 'Email o contraseña incorrectos.';
  }
  if (msg.includes('user-not-found')) {
    return 'No encuentro ese usuario. ¿Quizá quieres crear cuenta?';
  }
  if (msg.includes('too-many-requests')) {
    return 'Demasiados intentos. Espera un poco antes de probar.';
  }
  if (msg.includes('network')) {
    return 'Sin internet. Comprueba tu conexión.';
  }
  return msg;
}
