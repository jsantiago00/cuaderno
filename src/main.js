import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { firebaseConfigured } from './firebase.js';
import { watchAuth, resolveRedirectSignIn } from './auth.js';
import { renderLogin } from './views/login.js';
import { renderMissingConfig } from './views/missing-config.js';
import { mountAppShell, unmountAppShell } from './views/app-shell.js';
import { applySettings } from './settings.js';
import { hasLocalNotes } from './local-notes.js';
import { syncLocalNotesToCloud } from './sync.js';

applySettings();
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

  watchAuth(async (user) => {
    unmountAppShell();
    if (user) {
      if (hasLocalNotes()) {
        renderLoading();
        try {
          await syncLocalNotesToCloud(user.uid);
        } catch (err) {
          console.error('Error sincronizando notas locales', err);
        }
      }
      mountAppShell(root, user);
    } else {
      renderLogin(root, { onContinueLocal: () => mountAppShell(root, null) });
    }
  });
}

bootstrap();
