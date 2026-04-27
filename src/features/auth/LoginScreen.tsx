import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {
  ArrowRight,
  BookOpenCheck,
  Camera,
  Lock,
  Mail,
  MapPin,
} from 'lucide-react';
import { auth } from '@/lib/firebase';

type Mode = 'signin' | 'signup';

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>('signup');
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
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
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
    <div className="min-h-dvh bg-surface px-6 py-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <Hero />

        <FeatureList />

        <div className="rounded-card border border-foreground/10 bg-cream p-5">
          <h2 className="text-center text-lg font-extrabold">
            {isSignup ? 'Crea la cuenta de tu peque' : 'Entrar'}
          </h2>
          <p className="mt-1 text-center text-sm text-foreground/60">
            {isSignup
              ? 'Cuenta gratis. Después configuras el nombre del peque desde Perfil.'
              : 'Email y contraseña, o tu cuenta de Google.'}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-button border border-foreground/15 bg-surface py-3 text-base font-extrabold text-foreground shadow-soft disabled:opacity-50"
          >
            <GoogleG />
            Continuar con Google
          </button>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-foreground/10" />
            <span className="text-xs font-semibold text-foreground/40">
              o con email
            </span>
            <span className="h-px flex-1 bg-foreground/10" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleAuth();
            }}
            className="space-y-3"
          >
            <Field icon={Mail}>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="papa@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full bg-transparent py-3 pr-3 text-base focus:outline-none disabled:opacity-60"
              />
            </Field>
            <Field icon={Lock}>
              <input
                type="password"
                required
                minLength={isSignup ? 6 : undefined}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder={isSignup ? 'Mínimo 6 caracteres' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full bg-transparent py-3 pr-3 text-base focus:outline-none disabled:opacity-60"
              />
            </Field>

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
            className="mt-4 w-full text-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {isSignup ? '¿Ya tienes cuenta? Entrar' : '¿Primera vez? Crear cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="text-center">
      <img
        src="/icons/safari-de-leo-source.svg"
        alt=""
        className="inline-block h-24 w-24 rounded-full"
      />
      <h1 className="mt-5 text-3xl font-extrabold">El Safari de Leo</h1>
      <p className="mt-2 text-foreground/70">
        Una libreta mágica para que tu peque descubra animales en sus paseos.
      </p>
    </div>
  );
}

function FeatureList() {
  const items = [
    {
      icon: Camera,
      title: 'Foto + GPS automático',
      body: 'Hace foto al animal y guarda dónde lo vio.',
    },
    {
      icon: BookOpenCheck,
      title: 'Identifica desde Wikipedia',
      body: 'Busca el animal por nombre y aprende sobre él.',
    },
    {
      icon: MapPin,
      title: 'Pokédex, mapa y diario',
      body: 'Su colección crece. Ve sus aventuras en el mapa.',
    },
  ];
  return (
    <ul className="space-y-2">
      {items.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="flex items-start gap-3 rounded-card border border-foreground/10 bg-cream p-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <Icon className="h-5 w-5 text-foreground" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold">{title}</p>
            <p className="text-xs text-foreground/60">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Field({
  icon: Icon,
  children,
}: {
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center rounded-button border border-foreground/15 bg-surface pl-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
      <Icon className="h-5 w-5 shrink-0 text-foreground/40" />
      {children}
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('email-already-in-use')) {
    return 'Ese email ya tiene cuenta. Pulsa "¿Ya tienes cuenta? Entrar".';
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
  if (msg.includes('popup-closed-by-user') || msg.includes('cancelled-popup-request')) {
    return 'Cerraste la ventana antes de terminar. Inténtalo otra vez.';
  }
  if (msg.includes('popup-blocked')) {
    return 'El navegador bloqueó la ventana de Google. Permite popups y reintenta.';
  }
  if (msg.includes('network')) {
    return 'Sin internet. Comprueba tu conexión.';
  }
  return msg;
}
