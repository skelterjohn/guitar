import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const pdfDir = join(repoRoot, 'pdf');
const catalogPath = join(__dirname, '../src/data/catalog.json');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const referenced = new Set();

for (const section of catalog.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      referenced.add(pdf.file);
    }
  }
}

if (!existsSync(pdfDir)) {
  console.warn(`warning: ${pdfDir} not found; skipping PDF file checks`);
  process.exit(0);
}

const onDisk = new Set(
  readdirSync(pdfDir).filter((name) => name.endsWith('.pdf')),
);

const missing = [...referenced].filter((file) => !onDisk.has(file));
const errors = [];

if (missing.length > 0) {
  errors.push(`catalog references missing PDFs:\n  ${missing.join('\n  ')}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log(`catalog OK (${referenced.size} PDFs)`);
