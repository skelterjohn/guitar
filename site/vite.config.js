import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';
import { defaultDescription, siteOrigin, siteTitle } from './src/seo.js';

const gcsPdfOrigin = 'https://storage.googleapis.com/skelterjohnguitar-pdf';

function servePwaShell(pathname) {
  if (pathname === '/catalog' || pathname.startsWith('/catalog/')) {
    return '/catalog.html';
  }
  if (pathname === '/rep' || pathname.startsWith('/rep/')) {
    return '/rep.html';
  }
  return null;
}

export default defineConfig({
  plugins: [
    {
      name: 'pwa-html-entries',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = req.url?.split('?')[0] ?? '';

          if (pathname === '/' || pathname === '') {
            res.writeHead(302, { Location: '/catalog' });
            res.end();
            return;
          }

          const shell = servePwaShell(pathname);
          if (shell) {
            const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
            req.url = `${shell}${query}`;
          }

          next();
        });
      },
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/catalog/',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png',
        'rep.webmanifest',
        'sw-rep.js',
      ],
      manifest: {
        id: `${siteOrigin}/catalog`,
        name: siteTitle,
        short_name: 'Guitar scores',
        description: defaultDescription,
        theme_color: '#f1f5f9',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: '/catalog',
        scope: '/catalog/',
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
        navigateFallbackAllowlist: [/^\/catalog/],
        navigateFallbackDenylist: [/^\/pdf/, /^\/rep/],
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
