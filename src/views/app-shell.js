import { signIn, signOutUser } from '../auth.js';
import { mountNotesView, unmountNotesView, createNoteFromTemplate } from './notes-view.js';
import { mountLearnView, unmountLearnView } from './learn-view.js';

let activeTab = 'notes';

export function mountAppShell(root, user) {
  root.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <div class="brand">
          <svg viewBox="0 0 512 512" width="28" height="28" aria-hidden="true">
            <rect width="512" height="512" rx="112" fill="#5b4636"/>
            <rect x="120" y="96" width="272" height="336" rx="18" fill="#faf6ef"/>
            <path d="M300 380 L392 152 C400 132 424 128 440 140 C456 152 458 176 444 194 L360 380 Z" fill="#c1653a"/>
          </svg>
          <span>Cuaderno</span>
        </div>
        <nav class="tabs" role="tablist">
          <button class="tab-btn is-active" data-tab="notes" role="tab" aria-selected="true">Mis escritos</button>
          <button class="tab-btn" data-tab="learn" role="tab" aria-selected="false">Aprender formas</button>
        </nav>
        <div class="user-menu">
          ${
            user
              ? user.photoURL
                ? `<img class="avatar" src="${user.photoURL}" alt="" referrerpolicy="no-referrer" />`
                : `<span class="avatar avatar-fallback">${(user.displayName || user.email || '?')[0].toUpperCase()}</span>`
              : ''
          }
          <button id="auth-btn" class="btn btn-ghost" title="${user ? 'Cerrar sesión' : 'Iniciar sesión para sincronizar tus escritos'}">${user ? 'Salir' : 'Iniciar sesión'}</button>
        </div>
      </header>
      <main class="app-main">
        <div id="view-notes" class="view"></div>
        <div id="view-learn" class="view is-hidden"></div>
      </main>
    </div>
  `;

  mountNotesView(document.getElementById('view-notes'), user);
  mountLearnView(document.getElementById('view-learn'), {
    onUseTemplate: (form) => {
      createNoteFromTemplate(form);
      switchTab('notes');
    },
  });

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('auth-btn').addEventListener('click', () => {
    if (user) {
      signOutUser();
    } else {
      signIn().catch((err) => {
        console.error(err);
        alert('No se pudo iniciar sesión. Probá de nuevo.');
      });
    }
  });
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
  document.getElementById('view-notes').classList.toggle('is-hidden', tab !== 'notes');
  document.getElementById('view-learn').classList.toggle('is-hidden', tab !== 'learn');
}

export function unmountAppShell() {
  unmountNotesView();
  unmountLearnView();
  activeTab = 'notes';
}
