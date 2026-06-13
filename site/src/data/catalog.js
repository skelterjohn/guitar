import yaml from 'js-yaml';
import source from './catalog.yaml?raw';
import pdfHashes from './pdf-hashes.json';

const catalog = yaml.load(source);

for (const section of catalog.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      const hash = pdfHashes[pdf.file];
      if (hash) pdf.hash = hash;
    }
  }
}

export default catalog;
