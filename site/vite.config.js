import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';
import { defaultDescription, siteOrigin, siteTitle } from './src/seo.js';

const gcsPdfOrigin = 'https://storage.googleapis.com/skelterjohnguitar-pdf';

export default defineConfig({
  plugins: [
    {
      name: 'pwa-html-entries',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const path = req.url?.split('?')[0] ?? '';

          if (path === '/' || path === '') {
            res.writeHead(302, { Location: '/catalog' });
            res.end();
            return;
          }

          if (path === '/catalog' || path === '/catalog/') {
            req.url = req.url.replace(/^\/catalog\/?/, '/catalog.html');
          } else if (path === '/rep' || path === '/rep/') {
            req.url = req.url.replace(/^\/rep\/?/, '/rep.html');
          }

          next();
        });
      },
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png', 'rep.webmanifest'],
      manifest: {
        id: `${siteOrigin}/catalog`,
        name: siteTitle,
        short_name: 'Guitar scores',
        description: defaultDescription,
        theme_color: '#f1f5f9',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: '/catalog',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,webmanifest}'],
        navigateFallback: '/catalog.html',
        navigateFallbackDenylist: [/^\/pdf/],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        catalog: resolve(__dirname, 'catalog.html'),
        rep: resolve(__dirname, 'rep.html'),
      },
    },
  },
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
