import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const pdfDir = join(repoRoot, 'pdf');
const catalogPath = join(__dirname, '../src/data/catalog.yaml');
const outPath = join(__dirname, '../src/data/catalog.json');
const HASH_LENGTH = 8;

const catalog = yaml.load(readFileSync(catalogPath, 'utf8'));
let hashed = 0;

for (const section of catalog.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      const filePath = join(pdfDir, pdf.file);
      if (!existsSync(filePath)) {
        console.warn(`warning: missing ${pdf.file}, no hash`);
        delete pdf.hash;
        continue;
      }

      const data = readFileSync(filePath);
      pdf.hash = createHash('md5').update(data).digest('hex').slice(0, HASH_LENGTH);
      hashed += 1;
    }
  }
}

writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`catalog enriched (${hashed} PDF hashes) → ${outPath}`);
