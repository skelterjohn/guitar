import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const pdfDir = join(repoRoot, 'pdf');
const catalogPath = join(__dirname, '../src/data/catalog.yaml');
const repertoirePath = join(__dirname, '../src/data/repertoire.yaml');

function collectPdfFiles(catalogPath, label) {
  const catalog = yaml.load(readFileSync(catalogPath, 'utf8'));
  const referenced = new Set();

  for (const section of catalog.sections) {
    for (const piece of section.pieces) {
      for (const pdf of piece.pdfs) {
        referenced.add(pdf.file);
      }
    }
  }

  return { label, referenced };
}

const catalogs = [collectPdfFiles(catalogPath, 'catalog'), collectPdfFiles(repertoirePath, 'repertoire')];
const referenced = new Set();

for (const { referenced: files } of catalogs) {
  for (const file of files) referenced.add(file);
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
  errors.push(`catalogs reference missing PDFs:\n  ${missing.join('\n  ')}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log(`catalogs OK (${referenced.size} PDFs across catalog and repertoire)`);
