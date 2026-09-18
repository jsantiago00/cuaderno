import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.js';

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signIn() {
  // En modo instalado (PWA standalone) o en mobile el popup suele fallar o
  // se bloquea; ahí conviene el flujo de redirect.
  if (isStandalone() || /Android|iPhone|iPad/i.test(navigator.userAgent)) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }
  return signInWithPopup(auth, googleProvider);
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
