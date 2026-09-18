import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  linkWithPopup,
  linkWithRedirect,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.js';

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signIn() {
  // El redirect depende de que el navegador recupere un estado guardado en
  // IndexedDB al volver de Google, algo que en la práctica falla seguido en
  // navegadores mobile normales (in-app browsers, storage particionado). Solo
  // hace falta redirect cuando de verdad no hay ventana "opener" a la que
  // volver, es decir, PWA instalada en modo standalone.
  if (isStandalone()) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }
  return signInWithPopup(auth, googleProvider);
}

export function signInAsGuest() {
  // Cuenta anónima: mismo uid en Firestore que una cuenta con Google, así que
  // notes.js funciona igual. No sincroniza entre dispositivos hasta que se
  // vincule con Google (linkGoogleAccount) - es un uid distinto en cada uno.
  return signInAnonymously(auth);
}

export async function linkGoogleAccount() {
  if (!auth.currentUser) return null;
  if (isStandalone()) {
    await linkWithRedirect(auth.currentUser, googleProvider);
    return null;
  }
  return linkWithPopup(auth.currentUser, googleProvider);
}

export async function resolveRedirectSignIn() {
  try {
    return await getRedirectResult(auth);
  } catch (err) {
    console.error('Error resolviendo el inicio de sesión', err);
    return null;
  }
}

export function signOutUser() {
  return signOut(auth);
}
