import { useState, type FormEvent } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { SIGN_IN_EMAIL_KEY } from './useEmailLinkSignIn';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin,
        handleCodeInApp: true,
      });
      window.localStorage.setItem(SIGN_IN_EMAIL_KEY, email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo falló al enviar el email');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-6 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-success">
          <Check className="h-12 w-12 text-foreground" strokeWidth={2.5} />
        </span>
        <h1 className="mt-8 text-3xl font-extrabold">Revisa tu email</h1>
        <p className="mt-3 max-w-md text-foreground/70">
          Te he mandado un link a <strong className="font-extrabold">{email}</strong>.
          Ábrelo en este iPhone para entrar a la app.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 text-sm font-semibold text-primary underline"
        >
          ¿Te equivocaste? Cambiar email
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <img
            src="/icons/safari-de-leo-source.svg"
            alt=""
            className="inline-block h-20 w-20 rounded-full"
          />
          <h1 className="mt-6 text-3xl font-extrabold">Configura el safari</h1>
          <p className="mt-2 text-foreground/70">
            Esto solo es la primera vez. Después Leo no verá esta pantalla.
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Tu email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                required
                autoFocus
                placeholder="papa@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full rounded-button border border-foreground/15 bg-cream py-3 pl-10 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              />
            </div>
          </label>

          {error && <p className="text-sm font-semibold text-coral">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !email}
            className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-accent py-3 text-base font-extrabold text-foreground shadow-card disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Mandarme el link'}
            {!submitting && <ArrowRight className="h-5 w-5" strokeWidth={2.5} />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-foreground/50">
          Recibirás un link de un solo uso. No hay contraseña que recordar.
        </p>
      </div>
    </div>
  );
}
