import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Inicialización única del SDK de Firebase. Importa este archivo desde cualquier
 * sitio que necesite hablar con Auth/Firestore/Storage en lugar de re-instanciar.
 *
 * Auth: email + contraseña. El usuario (Mikel) entra una vez en el iPhone con
 * su password; la sesión persiste en IndexedDB indefinidamente. Leo nunca ve
 * pantalla de login (entra a través del WhoAreYou con sesión ya viva).
 *
 * Notas:
 * - Los valores VITE_FIREBASE_* son públicos por diseño en Firebase Web.
 * - `experimentalAutoDetectLongPolling`: si WebChannel falla, cae a HTTP
 *   long-polling. Evita "INTERNAL ASSERTION FAILED (b815)".
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

export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;
