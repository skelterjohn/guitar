import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defaultDescription, siteOrigin, siteTitle } from './src/seo.js';

const gcsPdfOrigin = 'https://storage.googleapis.com/skelterjohnguitar-pdf';
const bookendDevOrigin = process.env.BOOKEND_DEV_ORIGIN ?? 'http://localhost:8081';

function devPwaQuiet() {
  const stubManifest = JSON.stringify({
    name: 'dev',
    short_name: 'dev',
    start_url: '/',
    display: 'browser',
    icons: [],
  });

  return {
    name: 'dev-pwa-quiet',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] === '/manifest.webmanifest') {
          res.setHeader('Content-Type', 'application/manifest+json');
          res.end(stubManifest);
          return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(/<link rel="manifest"[^>]*>\s*/i, '');
      },
    },
  };
}

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    devPwaQuiet(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'njgo-sitemap.xml',
        'apple-touch-icon.png',
        'pwa-init.js',
        'njgo-favicon.png',
        'njgo-manifest.webmanifest',
        'bluebridge-manifest.webmanifest',
        'bluebridge-favicon.png',
        'bluebridge-apple-touch-icon.png',
        'bluebridge-pwa-192x192.png',
        'bluebridge-pwa-512x512.png',
        'njgo-apple-touch-icon.png',
        'njgo-pwa-192x192.png',
        'njgo-pwa-512x512.png',
      ],
      manifest: {
        id: siteOrigin,
        name: siteTitle,
        short_name: 'Guitar scores',
        description: defaultDescription,
        theme_color: '#f1f5f9',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: '/',
        scope: '/',
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
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/pdf/],
      },
    }),
  ],
  server: {
    host: true,
    proxy: {
      '/pdf': {
        target: gcsPdfOrigin,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf/, ''),
      },
      '/bookend': {
        target: bookendDevOrigin,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bookend/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log(`[bookend proxy] ${req.method} ${req.url} -> ${bookendDevOrigin}`);
          });
          proxy.on('error', (err, req) => {
            console.error(`[bookend proxy] error for ${req.method} ${req.url}:`, err.message);
          });
        },
      },
    },
  },
});
