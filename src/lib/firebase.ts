import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Inicialización única del SDK de Firebase. Importa este archivo desde cualquier
 * sitio que necesite hablar con Auth/Firestore/Storage en lugar de re-instanciar.
 *
 * Notas:
 * - Los valores VITE_FIREBASE_* son públicos por diseño en Firebase Web. No son
 *   secretos; lo que protege los datos son las security rules (firebase/*.rules).
 * - Firebase Auth Web usa por defecto persistencia LOCAL (IndexedDB), por eso
 *   Leo no verá nunca un login después de la primera vez que Mikel se autentique
 *   en su dispositivo.
 * - `experimentalAutoDetectLongPolling`: si WebChannel no está disponible o tiene
 *   problemas (proxies, firewalls, navegación rápida en dev con Strict Mode), el
 *   SDK cae a HTTP long-polling. Evita el bug "INTERNAL ASSERTION FAILED (b815)".
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

/** UID del único usuario autorizado (Mikel). Disponible para componentes que necesiten el doc users/{ADMIN_UID}. */
export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;
