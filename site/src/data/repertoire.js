import yaml from 'js-yaml';
import source from './repertoire.yaml?raw';
import pdfHashes from './pdf-hashes.json';

const repertoire = yaml.load(source);

for (const section of repertoire.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      const hash = pdfHashes[pdf.file];
      if (hash) pdf.hash = hash;
    }
  }
}

export default repertoire;
