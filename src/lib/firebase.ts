import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Inicialización única del SDK de Firebase. Importa este archivo desde cualquier
 * sitio que necesite hablar con Auth/Firestore/Storage en lugar de re-instanciar.
 *
 * Auth: anónimo. Firmamos al usuario silenciosamente en cuanto la app carga
 * para que las security rules (`request.auth != null`) permitan leer/escribir.
 * Leo nunca ve pantalla de login. La sesión persiste en IndexedDB.
 *
 * Notas:
 * - Los valores VITE_FIREBASE_* son públicos por diseño en Firebase Web.
 * - `experimentalAutoDetectLongPolling`: si WebChannel falla (proxies, dev con
 *   Strict Mode), el SDK cae a HTTP long-polling. Evita "INTERNAL ASSERTION
 *   FAILED (b815)".
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(config);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const storage = getStorage(app);

/** UID disponible para componentes que necesiten el doc users/{uid}. Anónimo. */
export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

// Side effect: firma anónimamente si no hay sesión. La primera vez la app
// arranca con user=null, signInAnonymously() lo soluciona en segundo plano y
// onAuthStateChanged volverá a emitir con el nuevo user. AuthGate enseña
// spinner durante ese microsegundo.
//
// Requiere que en Firebase Console → Authentication → Sign-in method → Anonymous
// esté habilitado. Sin eso, signInAnonymously falla con "operation-not-allowed"
// y la app se queda en el spinner.
onAuthStateChanged(auth, (user) => {
  if (user) return;
  signInAnonymously(auth).catch((err) => {
    console.error('Anonymous sign-in failed', err);
  });
});
