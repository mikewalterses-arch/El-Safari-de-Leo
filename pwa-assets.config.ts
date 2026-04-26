import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config';

// Genera iconos PWA + favicon + apple-touch-icon a partir del SVG fuente.
// Ejecutar con: pnpm generate-pwa-assets
export default defineConfig({
  preset,
  images: ['public/icons/safari-de-leo-source.svg'],
});
