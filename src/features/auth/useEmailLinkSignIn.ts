import { useEffect } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const SIGN_IN_EMAIL_KEY = 'safarideleo:signInEmail';

/**
 * Detecta cuando la URL actual es un link de sign-in de Firebase y completa el login.
 * Limpia la URL después para no dejar el token largo a la vista.
 */
export function useEmailLinkSignIn() {
  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    let email = window.localStorage.getItem(SIGN_IN_EMAIL_KEY);
    if (!email) {
      // El link se abrió en otro navegador del que pidió el link.
      // Pedimos el email para confirmar (Firebase lo exige por seguridad).
      email = window.prompt('Confirma tu email para entrar a la app');
    }
    if (!email) return;

    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        window.localStorage.removeItem(SIGN_IN_EMAIL_KEY);
        window.history.replaceState({}, '', '/');
      })
      .catch((err) => {
        console.error('Email link sign-in failed', err);
      });
  }, []);
}
