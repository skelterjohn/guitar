import { useParams } from 'react-router-dom';
import catalog from '../data/catalog.js';
import repertoire from '../data/repertoire.js';
import PdfViewer from '../components/PdfViewer.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { pageTitle, viewPageUrl } from '../seo.js';

function findPdfInSections(sections, filename) {
  for (const section of sections) {
    for (const piece of section.pieces) {
      for (const pdf of piece.pdfs) {
        if (pdf.file === filename) {
          return { section, piece, pdf };
        }
      }
    }
  }
  return null;
}

function findPdf(filename) {
  return (
    findPdfInSections(catalog.sections, filename) ??
    findPdfInSections(repertoire.sections, filename) ?? {
      section: null,
      piece: null,
      pdf: null,
    }
  );
}

function sectionSiblings(section, currentPiece) {
  if (!section || !currentPiece) return [];

  return section.pieces
    .filter((piece) => piece !== currentPiece)
    .map((piece) => ({
      title: piece.title,
      file: piece.pdfs[0]?.file,
    }))
    .filter((entry) => entry.file);
}

function viewerPageName(piece, pdf, filename) {
  if (!piece || !pdf) return filename;
  if (pdf.label === 'score') return piece.title;
  return `${piece.title} (${pdf.label})`;
}

export default function ViewPdf() {
  const { filename } = useParams();
  const decoded = decodeURIComponent(filename);
  const { section, piece, pdf } = findPdf(decoded);
  const name = viewerPageName(piece, pdf, decoded);
  const description =
    piece?.description?.split('\n\n').find(Boolean) ?? `${name} — guitar score PDF`;

  usePageMeta({
    title: pageTitle(name),
    description,
    url: viewPageUrl(decoded),
  });

  return (
    <PdfViewer
      filename={decoded}
      pdfHash={pdf?.hash}
      pdfs={piece?.pdfs ?? []}
      sectionPieces={sectionSiblings(section, piece)}
    />
  );
}
