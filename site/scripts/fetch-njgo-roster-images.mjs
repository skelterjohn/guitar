import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = process.argv[2];
const outDir = join(__dirname, '../public/roster');

if (!htmlPath) {
  console.error('Usage: node fetch-njgo-roster-images.mjs <njgo-page.html>');
  process.exit(1);
}

const skipTitles = new Set(['New Jersey Guitar Orchestra']);

function rosterFilename(displayName) {
  const name = displayName
    .trim()
    .replace(/^Dr\.\s+/i, '')
    .replace(/\s+/g, ' ');

  const parts = name
    .split(' ')
    .filter((part) => part && !/^[A-Za-z]\.$/.test(part));

  return parts
    .map((part) => part
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ''))
    .join('_');
}

function extensionFromUrl(url, contentType) {
  const fromPath = extname(new URL(url).pathname).toLowerCase();
  if (fromPath && fromPath.length <= 5) return fromPath;
  if (contentType === 'image/jpeg') return '.jpg';
  if (contentType === 'image/png') return '.png';
  return '.jpg';
}

function parseMembers(html) {
  const members = [];
  const itemPattern = /&quot;title&quot;:\s*&quot;([^&]+?)&quot;,\s*\n\s*&quot;description&quot;:[\s\S]*?&quot;assetUrl&quot;:\s*&quot;([^&]+?)&quot;[\s\S]*?&quot;contentType&quot;:\s*&quot;([^&]+?)&quot;/g;

  let match;
  while ((match = itemPattern.exec(html)) !== null) {
    const title = match[1].trim();
    if (!title || skipTitles.has(title)) continue;

    const assetUrl = match[2].replace(/&amp;/g, '&');
    const contentType = match[3];
    const filename = rosterFilename(title);
    if (!filename) continue;

    members.push({ title, filename, assetUrl, contentType });
  }

  return members;
}

const html = await readFile(htmlPath, 'utf8');
const members = parseMembers(html);
await mkdir(outDir, { recursive: true });

const results = [];

for (const member of members) {
  const ext = extensionFromUrl(member.assetUrl, member.contentType);
  const outputName = `${member.filename}${ext}`;
  const outputPath = join(outDir, outputName);

  const response = await fetch(member.assetUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${member.title}: ${response.status} ${member.assetUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
  results.push({ title: member.title, file: outputName, bytes: buffer.length });
  console.log(`saved ${outputName} (${member.title})`);
}

console.log(`\nDownloaded ${results.length} images to ${outDir}`);
