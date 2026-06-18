import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { repDescription, repHeading, siteOrigin } from '../src/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../public/rep.webmanifest');

const manifest = {
  id: `${siteOrigin}/rep`,
  name: repHeading,
  short_name: 'rep',
  description: repDescription,
  start_url: '/rep',
  scope: '/',
  display: 'standalone',
  theme_color: '#f1f5f9',
  background_color: '#f1f5f9',
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
};

writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`rep manifest → ${outPath}`);
