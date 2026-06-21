import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function rosterFilename(displayName) {
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

const rosterDir = join(__dirname, '../public/roster');
const yamlPath = join(__dirname, '../src/data/njgo-roster.yaml');
const files = readdirSync(rosterDir);
const byStem = new Map(files.map((file) => [file.replace(/\.[^.]+$/, ''), file]));

const lines = readFileSync(yamlPath, 'utf8').split(/\r?\n/);
const out = [];
let added = 0;

for (const line of lines) {
  if (/^    image: /.test(line)) continue;

  const match = line.match(/^  - name: "(.+)"$/);
  if (match) {
    const stem = rosterFilename(match[1]);
    const file = byStem.get(stem);
    if (!file) {
      throw new Error(`No image for ${match[1]} (${stem})`);
    }
    out.push(line);
    out.push(`    image: /roster/${file}`);
    added += 1;
    continue;
  }

  out.push(line);
}

writeFileSync(yamlPath, `${out.join('\n').replace(/\n?$/, '\n')}`);
console.log(`Added image entries for ${added} members`);
