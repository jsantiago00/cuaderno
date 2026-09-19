import { PALETTES, FONTS, FONT_SIZES } from './palettes.js';

const THEME_KEY = 'soltarte_theme';
const PALETTE_KEY = 'soltarte_palette';
const FONT_KEY = 'soltarte_font';
const FONT_SIZE_KEY = 'soltarte_font_size';

// La app se llamaba Cuaderno antes de renombrarse - migra las preferencias
// guardadas bajo esas claves viejas para no resetear el tema del usuario.
(function migrateLegacyKeys() {
  const pairs = [
    [THEME_KEY, 'cuaderno_theme'],
    [PALETTE_KEY, 'cuaderno_palette'],
    [FONT_KEY, 'cuaderno_font'],
    [FONT_SIZE_KEY, 'cuaderno_font_size'],
  ];
  try {
    for (const [key, legacyKey] of pairs) {
      if (localStorage.getItem(key) !== null) continue;
      const legacy = localStorage.getItem(legacyKey);
      if (legacy !== null) localStorage.setItem(key, legacy);
    }
  } catch (err) {
    console.error('Error migrando preferencias', err);
  }
})();

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || (systemPrefersDark() ? 'dark' : 'light');
}
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applySettings();
}

export function getPalette() {
  const v = localStorage.getItem(PALETTE_KEY);
  return v && PALETTES[v] ? v : 'clasico';
}
export function setPalette(key) {
  localStorage.setItem(PALETTE_KEY, key);
  applySettings();
}

export function getFont() {
  const v = localStorage.getItem(FONT_KEY);
  return v && FONTS[v] ? v : 'clasico';
}
export function setFont(key) {
  localStorage.setItem(FONT_KEY, key);
  applySettings();
}

export function getFontSize() {
  const v = localStorage.getItem(FONT_SIZE_KEY);
  return v && FONT_SIZES[v] ? v : 'medium';
}
export function setFontSize(key) {
  localStorage.setItem(FONT_SIZE_KEY, key);
  applySettings();
}

// Pisa las custom properties de :root según tema+paleta+tipografía+tamaño.
// Se llama al boot (antes del primer render, para no parpadear) y cada vez
// que se cambia algo desde el panel de Configuración.
export function applySettings() {
  const root = document.documentElement;
  const theme = getTheme();
  const palette = PALETTES[getPalette()] || PALETTES.clasico;
  const colors = palette[theme] || palette.light;

  for (const [key, value] of Object.entries(colors)) {
    const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(cssVar, value);
  }
  root.style.colorScheme = theme;

  const font = FONTS[getFont()] || FONTS.clasico;
  root.style.setProperty('--font-serif', font.serif);
  root.style.setProperty('--font-sans', font.sans);

  const size = FONT_SIZES[getFontSize()] || FONT_SIZES.medium;
  root.style.fontSize = size.rootPx + 'px';
}
