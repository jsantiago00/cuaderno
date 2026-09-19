import { signIn } from '../auth.js';

export function renderLogin(root, { onContinueLocal } = {}) {
  root.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="login-icon" aria-hidden="true">
          <svg viewBox="0 0 512 512" width="56" height="56">
            <rect width="512" height="512" rx="112" fill="#5b4636"/>
            <rect x="120" y="96" width="272" height="336" rx="18" fill="#faf6ef"/>
            <line x1="156" y1="176" x2="356" y2="176" stroke="#d8cdb8" stroke-width="10" stroke-linecap="round"/>
            <line x1="156" y1="222" x2="356" y2="222" stroke="#d8cdb8" stroke-width="10" stroke-linecap="round"/>
            <path d="M300 380 L392 152 C400 132 424 128 440 140 C456 152 458 176 444 194 L360 380 Z" fill="#c1653a"/>
          </svg>
        </div>
        <h1>Cuaderno</h1>
        <p class="login-tagline">Un lugar para tus canciones, poemas y todo lo que se te ocurra escribir.</p>
        <ul class="login-features">
          <li>Se sincroniza sola entre tu celular y tu computadora</li>
          <li>Funciona sin conexión y guarda cuando vuelve internet</li>
          <li>Trae guías para escribir haikus, décimas, coplas y más</li>
        </ul>
        <button id="google-signin" class="btn btn-primary btn-google">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          Continuar con Google
        </button>
        <p class="login-hint">Usá la misma cuenta en todos tus dispositivos para ver tus escritos en cualquier lado.</p>
        <button id="guest-signin" class="btn btn-ghost btn-guest">Continuar sin cuenta</button>
        <p class="login-hint">Tus escritos quedan guardados solo en este dispositivo hasta que inicies sesión con Google.</p>
      </div>
    </div>
  `;

  const btn = document.getElementById('google-signin');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.classList.add('is-loading');
    try {
      await signIn();
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.classList.remove('is-loading');
      alert('No se pudo iniciar sesión. Probá de nuevo.');
    }
  });

  const guestBtn = document.getElementById('guest-signin');
  if (onContinueLocal) {
    guestBtn.addEventListener('click', () => onContinueLocal());
  }
}
