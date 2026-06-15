import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defaultDescription, siteTitle } from './src/seo.js';

const gcsPdfOrigin = 'https://storage.googleapis.com/skelterjohnguitar-pdf';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: siteTitle,
        short_name: 'Guitar scores',
        description: defaultDescription,
        theme_color: '#f1f5f9',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/pdf/],
      },
    }),
  ],
  server: {
    proxy: {
      '/pdf': {
        target: gcsPdfOrigin,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf/, ''),
      },
    },
  },
});
