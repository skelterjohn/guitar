import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  njgoOrigin,
  njgoThemeColor,
  repDescription,
  repHeading,
  njgoTitle,
} from '../src/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const svg = readFileSync(join(publicDir, 'favicon.svg'));
const njgoLogo = join(publicDir, 'njgo/logo_orange.png');

const guitarTargets = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of guitarTargets) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, file));
  console.log(`pwa-icons → public/${file}`);
}

const njgoTargets = [
  { file: 'njgo-favicon.png', size: 32 },
  { file: 'njgo-pwa-192x192.png', size: 192 },
  { file: 'njgo-pwa-512x512.png', size: 512 },
  { file: 'njgo-apple-touch-icon.png', size: 180 },
];

async function writeNjgoIcon(size, outPath) {
  const logo = await sharp(njgoLogo)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(outPath);
}

for (const { file, size } of njgoTargets) {
  await writeNjgoIcon(size, join(publicDir, file));
  console.log(`pwa-icons → public/${file}`);
}

const njgoManifest = {
  id: njgoOrigin,
  name: repHeading,
  short_name: njgoTitle,
  description: repDescription,
  theme_color: njgoThemeColor,
  background_color: njgoThemeColor,
  display: 'standalone',
  start_url: '/',
  scope: '/',
  lang: 'en',
  icons: [
    {
      src: 'njgo-pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'njgo-pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: 'njgo-pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

writeFileSync(
  join(publicDir, 'njgo-manifest.webmanifest'),
  `${JSON.stringify(njgoManifest, null, 2)}\n`,
);
console.log('pwa-icons → public/njgo-manifest.webmanifest');
