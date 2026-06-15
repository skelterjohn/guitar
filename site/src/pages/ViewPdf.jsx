import { useParams } from 'react-router-dom';
import catalog from '../data/catalog.js';
import PdfViewer from '../components/PdfViewer.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { pageTitle, viewPageUrl } from '../seo.js';

function findPdf(filename) {
  for (const section of catalog.sections) {
    for (const piece of section.pieces) {
      for (const pdf of piece.pdfs) {
        if (pdf.file === filename) {
          return { piece, pdf };
        }
      }
    }
  }
  return { piece: null, pdf: null };
}

function viewerPageName(piece, pdf, filename) {
  if (!piece || !pdf) return filename;
  if (pdf.label === 'score') return piece.title;
  return `${piece.title} (${pdf.label})`;
}

export default function ViewPdf() {
  const { filename } = useParams();
  const decoded = decodeURIComponent(filename);
  const { piece, pdf } = findPdf(decoded);
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
    />
  );
}
