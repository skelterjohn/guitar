import { useParams } from 'react-router-dom';
import catalog from '../data/catalog.js';
import PdfViewer from '../components/PdfViewer.jsx';

function findPdfContext(filename) {
  for (const section of catalog.sections) {
    for (const piece of section.pieces) {
      for (const pdf of piece.pdfs) {
        if (pdf.file === filename) {
          return {
            piece,
            displayName: `${piece.title} — ${pdf.label}`,
          };
        }
      }
    }
  }
  return { piece: null, displayName: filename };
}

export default function ViewPdf() {
  const { filename } = useParams();
  const decoded = decodeURIComponent(filename);
  const { piece, displayName } = findPdfContext(decoded);

  return (
    <PdfViewer
      filename={decoded}
      displayName={displayName}
      pieceTitle={piece?.title}
      pdfs={piece?.pdfs ?? []}
    />
  );
}
