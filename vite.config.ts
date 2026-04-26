import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'autoUpdate' regenera el SW en cada build y refresca silenciosamente al cargar
      // la app. Para fase 1 vale; cuando definamos casos offline reales (fase 2+) podemos
      // pasar a 'prompt' para mostrar al usuario un "hay versión nueva, ¿recargar?".
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/favicon.ico',
        'icons/apple-touch-icon-180x180.png',
        'icons/safari-de-leo-source.svg',
      ],
      manifest: {
        name: 'El Safari de Leo',
        short_name: 'Safari',
        description: 'Avistamientos de animales para Leo',
        lang: 'es',
        theme_color: '#7DD3C7',
        background_color: '#FFF9F2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // TODO(fase-2+): refinar runtime caching de Firestore/Storage para soporte offline real.
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
