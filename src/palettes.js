// Paletas de color seleccionables desde Configuración. Cada una define los
// mismos 10 roles que usa style.css (paper/ink/brown/accent + variantes) para
// modo claro y oscuro, así que cambiar de paleta o de tema es solo pisar
// estas custom properties en :root - ver settings.js#applySettings.
export const PALETTES = {
  clasico: {
    label: 'Clásico',
    light: {
      paper: '#faf6ef', paperRaised: '#ffffff', ink: '#3a2f28', inkSoft: '#6b5d51',
      line: '#e6ddcd', brown: '#5b4636', brownDark: '#402f24',
      accent: '#c1653a', accentDark: '#a34f2a', accentSoft: '#f3ddd0',
    },
    dark: {
      paper: '#211a15', paperRaised: '#2b2219', ink: '#f1e7db', inkSoft: '#c2b3a3',
      line: '#40332a', brown: '#d8cdb8', brownDark: '#f1e7db',
      accent: '#e07a4b', accentDark: '#f5946a', accentSoft: '#3a281f',
    },
  },
  neutral_elegance: {
    label: 'Neutral elegance',
    light: {
      paper: '#fff6ec', paperRaised: '#ffffff', ink: '#4a341f', inkSoft: '#997e67',
      line: '#e8dcc9', brown: '#664930', brownDark: '#4a341f',
      accent: '#997e67', accentDark: '#664930', accentSoft: '#f4e4d3',
    },
    dark: {
      paper: '#241c15', paperRaised: '#2e2419', ink: '#f5e9da', inkSoft: '#ccbeb1',
      line: '#4a3c2c', brown: '#ccbeb1', brownDark: '#f5e9da',
      accent: '#e3b98c', accentDark: '#ffdbbb', accentSoft: '#4a3626',
    },
  },
  woodland: {
    label: 'Woodland',
    light: {
      paper: '#f7efe9', paperRaised: '#ffffff', ink: '#3b3524', inkSoft: '#7c6f5a',
      line: '#e4d7cc', brown: '#525034', brownDark: '#3b3524',
      accent: '#9f7560', accentDark: '#7c5843', accentSoft: '#eedfd6',
    },
    dark: {
      paper: '#211e14', paperRaised: '#2b2719', ink: '#ede6d8', inkSoft: '#c7bba8',
      line: '#453f2c', brown: '#c7bba8', brownDark: '#ede6d8',
      accent: '#c99a7a', accentDark: '#e3af8c', accentSoft: '#3f3324',
    },
  },
  driftwood: {
    label: 'Driftwood pearl morning',
    light: {
      paper: '#f7f1ee', paperRaised: '#ffffff', ink: '#3a2620', inkSoft: '#8a6259',
      line: '#e3d9d2', brown: '#5a322a', brownDark: '#3a2620',
      accent: '#bc7b6f', accentDark: '#96594e', accentSoft: '#f3e2dc',
    },
    dark: {
      paper: '#221815', paperRaised: '#2c201c', ink: '#f0dfd8', inkSoft: '#cba79c',
      line: '#4a362f', brown: '#cba79c', brownDark: '#f0dfd8',
      accent: '#d99083', accentDark: '#e4a499', accentSoft: '#40241f',
    },
  },
  ink_wash: {
    label: 'Ink wash',
    light: {
      paper: '#f2f2f1', paperRaised: '#ffffff', ink: '#252525', inkSoft: '#6e6e6e',
      line: '#dadad9', brown: '#252525', brownDark: '#141414',
      accent: '#545454', accentDark: '#3a3a3a', accentSoft: '#e3e3e2',
    },
    dark: {
      paper: '#1b1b1b', paperRaised: '#252525', ink: '#ededec', inkSoft: '#b8b8b8',
      line: '#3d3d3d', brown: '#cfcfcf', brownDark: '#f2f2f1',
      accent: '#9e9e9e', accentDark: '#cfcfcf', accentSoft: '#333333',
    },
  },
  jade_pebble: {
    label: 'Jade pebble morning',
    light: {
      paper: '#f3f5f0', paperRaised: '#ffffff', ink: '#2c3528', inkSoft: '#65715f',
      line: '#dce3d6', brown: '#404e3b', brownDark: '#2c3528',
      accent: '#7b9669', accentDark: '#5e7850', accentSoft: '#e5ede0',
    },
    dark: {
      paper: '#1b1f19', paperRaised: '#252b22', ink: '#e7ede3', inkSoft: '#b7c4b0',
      line: '#3b4436', brown: '#bac8b1', brownDark: '#e7ede3',
      accent: '#93ac80', accentDark: '#aabf97', accentSoft: '#333d2e',
    },
  },
  rose_quartz: {
    label: 'Rose quartz evening',
    light: {
      paper: '#fbf3f2', paperRaised: '#ffffff', ink: '#3d1620', inkSoft: '#8c5c61',
      line: '#ead9d8', brown: '#64242f', brownDark: '#3d1620',
      accent: '#b44446', accentDark: '#8f3335', accentSoft: '#fadcda',
    },
    dark: {
      paper: '#20161a', paperRaised: '#2b1e22', ink: '#f5e4e2', inkSoft: '#d2a9a9',
      line: '#4a3236', brown: '#d2a9a9', brownDark: '#f5e4e2',
      accent: '#e06466', accentDark: '#fc8f8f', accentSoft: '#3f2226',
    },
  },
};

export const PALETTE_ORDER = [
  'clasico', 'neutral_elegance', 'woodland', 'driftwood', 'ink_wash', 'jade_pebble', 'rose_quartz',
];

export const FONTS = {
  clasico: { label: 'Clásico', serif: "'Lora', Georgia, serif", sans: "'Nunito Sans', system-ui, -apple-system, sans-serif" },
  elegante: { label: 'Elegante', serif: "'Playfair Display', Georgia, serif", sans: "'Source Sans 3', system-ui, -apple-system, sans-serif" },
  calida: { label: 'Cálida', serif: "'Merriweather', Georgia, serif", sans: "'Work Sans', system-ui, -apple-system, sans-serif" },
  manuscrita: { label: 'Manuscrita', serif: "'Caveat', cursive", sans: "'Nunito Sans', system-ui, -apple-system, sans-serif" },
};

export const FONT_ORDER = ['clasico', 'elegante', 'calida', 'manuscrita'];

export const FONT_SIZES = {
  small: { label: 'Pequeña', rootPx: 14 },
  medium: { label: 'Mediana', rootPx: 16 },
  large: { label: 'Grande', rootPx: 18 },
};

export const FONT_SIZE_ORDER = ['small', 'medium', 'large'];
