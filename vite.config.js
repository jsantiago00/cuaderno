import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Publicado en GitHub Pages como sitio de proyecto: https://<usuario>.github.io/soltarte/
export default defineConfig({
  base: '/soltarte/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'SoltArte',
        short_name: 'SoltArte',
        description: 'Tu cuaderno personal para canciones, poemas y letras.',
        theme_color: '#5b4636',
        background_color: '#faf6ef',
        display: 'standalone',
        start_url: '/soltarte/',
        scope: '/soltarte/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Firestore/Auth requests van directo a la red; nunca se cachean.
        navigateFallbackDenylist: [/^\/__/],
      },
    }),
  ],
});
