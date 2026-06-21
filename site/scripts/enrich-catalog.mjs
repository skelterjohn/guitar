import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const pdfDir = join(repoRoot, 'pdf');
const catalogPath = join(__dirname, '../src/data/catalog.yaml');
const hashesPath = join(__dirname, '../src/data/pdf-hashes.json');
const HASH_LENGTH = 8;
const addHashes = process.env.ENRICH_HASHES === '1';

const catalog = yaml.load(readFileSync(catalogPath, 'utf8'));
const hashes = {};
let hashed = 0;

for (const section of catalog.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      if (!addHashes) continue;

      const localFile = pdf.file.startsWith('pub/') ? pdf.file.slice('pub/'.length) : pdf.file;
      const filePath = join(pdfDir, localFile);
      if (!existsSync(filePath)) {
        console.warn(`warning: missing ${pdf.file}, no hash`);
        continue;
      }

      const data = readFileSync(filePath);
      hashes[pdf.file] = createHash('md5')
        .update(data)
        .digest('hex')
        .slice(0, HASH_LENGTH);
      hashed += 1;
    }
  }
}

writeFileSync(hashesPath, `${JSON.stringify(hashes, null, 2)}\n`);

if (addHashes) {
  console.log(`pdf hashes (${hashed}) → ${hashesPath}`);
} else {
  console.log(`pdf hashes cleared → ${hashesPath}`);
}
