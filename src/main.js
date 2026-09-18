import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { firebaseConfigured } from './firebase.js';
import { watchAuth, resolveRedirectSignIn } from './auth.js';
import { renderLogin } from './views/login.js';
import { renderMissingConfig } from './views/missing-config.js';
import { mountAppShell, unmountAppShell } from './views/app-shell.js';

registerSW({ immediate: true });

const root = document.getElementById('app');

function renderLoading() {
  root.innerHTML = `<div class="boot-loading" aria-busy="true"><span class="spinner"></span></div>`;
}

async function bootstrap() {
  if (!firebaseConfigured) {
    renderMissingConfig(root);
    return;
  }

  renderLoading();
  await resolveRedirectSignIn();

  watchAuth((user) => {
    unmountAppShell();
    if (user) {
      mountAppShell(root, user);
    } else {
      renderLogin(root);
    }
  });
}

bootstrap();
