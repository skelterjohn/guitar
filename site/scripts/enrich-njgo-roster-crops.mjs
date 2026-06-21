import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const htmlPath = process.argv[2] ?? join(__dirname, '../public/roster/_page.html');
const yamlPath = join(__dirname, '../src/data/njgo-roster.yaml');

const skipTitles = new Set(['New Jersey Guitar Orchestra']);

function parseCrops(html) {
  const cropsByTitle = new Map();
  const itemPattern = /&quot;title&quot;:\s*&quot;([^&]+?)&quot;,[\s\S]*?&quot;imageId&quot;:[\s\S]*?&quot;mediaFocalPoint&quot;:\s*\{\s*&quot;x&quot;:\s*([0-9.]+),\s*&quot;y&quot;:\s*([0-9.]+)/g;

  let match;
  while ((match = itemPattern.exec(html)) !== null) {
    const title = match[1].trim();
    if (!title || skipTitles.has(title)) continue;
    cropsByTitle.set(title, {
      aspect_ratio: '4:3',
      focal_point: {
        x: Number(match[2]),
        y: Number(match[3]),
      },
    });
  }

  return cropsByTitle;
}

function formatCrop(crop) {
  return [
    '    crop:',
    `      aspect_ratio: "${crop.aspect_ratio}"`,
    '      focal_point:',
    `        x: ${crop.focal_point.x}`,
    `        y: ${crop.focal_point.y}`,
  ];
}

const html = readFileSync(htmlPath, 'utf8');
const cropsByTitle = parseCrops(html);
const lines = readFileSync(yamlPath, 'utf8').split(/\r?\n/);
const out = [];
let updated = 0;

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];

  if (/^    crop:/.test(line)) {
    while (i + 1 < lines.length && /^      /.test(lines[i + 1])) {
      i += 1;
    }
    continue;
  }

  out.push(line);

  const nameMatch = line.match(/^  - name: "(.+)"$/);
  if (!nameMatch) continue;

  const crop = cropsByTitle.get(nameMatch[1]);
  if (!crop) {
    throw new Error(`No crop data for ${nameMatch[1]}`);
  }

  if (i + 1 < lines.length && /^    image: /.test(lines[i + 1])) {
    out.push(lines[i + 1]);
    i += 1;
    out.push(...formatCrop(crop));
    updated += 1;
  }
}

writeFileSync(yamlPath, `${out.join('\n').replace(/\n?$/, '\n')}`);
console.log(`Added crop data for ${updated} members`);
